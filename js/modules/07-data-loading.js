// =====================
        // DATA LOADING
        // =====================
'use strict';
        async function loadAllData() {

            if (!currentCompany) return;
            if (isLoading) {
                dbg('loadAllData: already loading, skipping...');
                return;
            }
            
            isLoading = true;
            const thisLoadVersion = ++loadingVersion;
            const startTime = performance.now();
            
            // Показуємо skeleton якщо контент ще порожній
            showSkeletonLoading();
            
            try {
                // Паралельне завантаження ВСЬОГО для швидкості (6 запитів одночасно замість 6 послідовних)
                const base = db.collection('companies').doc(currentCompany);
                
                let processQuery = base.collection('processes');
                if (!showCompletedProcesses) {
                    processQuery = processQuery.where('status', '==', 'active');
                }
                
                const TASKS_LOAD_LIMIT = 5000;
                const isEmployeeRole = currentUserData?.role === 'employee';
                const uid = currentUser.uid;
                
                // Employee: load only THEIR tasks (assigned + created + coExecutor + observer)
                // Owner/Manager: load ALL tasks
                let tasksPromise;
                if (isEmployeeRole) {
                    tasksPromise = Promise.all([
                        base.collection('tasks').where('assigneeId', '==', uid).orderBy('createdAt', 'desc').limit(1000).get()
                            .catch(() => base.collection('tasks').where('assigneeId', '==', uid).limit(1000).get()),
                        base.collection('tasks').where('creatorId', '==', uid).orderBy('createdAt', 'desc').limit(500).get()
                            .catch(() => base.collection('tasks').where('creatorId', '==', uid).limit(500).get()),
                        base.collection('tasks').where('coExecutorIds', 'array-contains', uid).limit(500).get()
                            .catch(() => ({ docs: [] })), // Fallback if index missing
                        base.collection('tasks').where('observerIds', 'array-contains', uid).limit(500).get()
                            .catch(() => ({ docs: [] }))  // Fallback if index missing
                    ]).then(snaps => {
                        const taskMap = new Map();
                        snaps.forEach(snap => snap.docs.forEach(doc => {
                            if (!taskMap.has(doc.id)) taskMap.set(doc.id, doc);
                        }));
                        return { docs: Array.from(taskMap.values()), size: taskMap.size, _merged: true };
                    });
                } else {
                    tasksPromise = base.collection('tasks').orderBy('createdAt', 'desc').limit(TASKS_LOAD_LIMIT).get();
                }
                
                const [usersSnap, funcsSnap, tasksSnap, regSnap, templatesSnap, processesSnap, projectsSnap] = await Promise.all([
                    base.collection('users').get()
                        .catch(() => ({ docs: [] })),
                    base.collection('functions').get()
                        .catch(() => ({ docs: [] })),
                    tasksPromise,
                    base.collection('regularTasks').get()
                        .catch(() => ({ docs: [] })),
                    base.collection('processTemplates').orderBy('name').get()
                        .catch(() => base.collection('processTemplates').get())
                        .catch(() => ({ docs: [] })),
                    processQuery.get()
                        .catch(() => ({ docs: [] })),
                    base.collection('projects').orderBy('createdAt', 'desc').get()
                        .catch(() => base.collection('projects').get())
                        .catch(() => ({ docs: [] }))
                ]);

                // ─── FEATURE FLAGS ─────────────────────────────
                try {
                    const compDoc = await base.get();
                    if (compDoc.exists) {
                        window.companyFeatures = compDoc.data().features || {};
                    }
                } catch(e) { console.error('[07-data-loading]', e.message); }
                window.isFeatureEnabled = window.isFeatureEnabled || function(key) {
                    return !window.companyFeatures || window.companyFeatures[key] !== false;
                };

                
                // Попередження якщо досягнуто ліміт
                const taskCount = tasksSnap._merged ? tasksSnap.size : tasksSnap.docs.length;
                if (!tasksSnap._merged && taskCount >= TASKS_LOAD_LIMIT) {
                    console.warn(`[loadAllData] Task limit reached: ${taskCount}/${TASKS_LOAD_LIMIT}`);
                    showToast(t('taskLimitWarning').replace('{n}', TASKS_LOAD_LIMIT), 'warning');
                }
                dbg(`[loadAllData] ${isEmployeeRole ? 'Employee' : 'Manager'} mode: ${taskCount} tasks`);
                
                // Перевіряємо чи це ще актуальний запит
                if (thisLoadVersion !== loadingVersion) {
                    dbg('loadAllData: newer load started, discarding results');
                    return;
                }
                
                // Атомарно оновлюємо всі дані
                users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                functions = funcsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                tasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                regularTasks = regSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                processTemplates = templatesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                processes = processesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                
                updateSelects();
                updateProcessTemplateFilter();
                updateProjectSelects();
                
                // Sync functions to biz-structure canvas iframe
                if (typeof sendFunctionsToIframe === 'function') sendFunctionsToIframe();
                
                // Авто-генерація регулярних завдань при вході
                await autoGenerateRegularTasks();
                
                // Одноразова міграція: задачі з deadline (Timestamp) без deadlineDate
                const migrateKey = `migrated_${currentCompany}`;
                if (!localStorage.getItem(migrateKey)) {
                    try {
                        await migrateDeadlineFields(base);
                        localStorage.setItem(migrateKey, '1');
                    } catch(e) {
                        console.warn('[Migration] failed, will retry next load:', e);
                        // НЕ ставимо localStorage — спробує ще раз
                    }
                }
                
                // Ще раз перевіряємо актуальність
                if (thisLoadVersion !== loadingVersion) return;
                
                // Employee: автоматично ставимо фільтр "Мої" при завантаженні
                if (currentUserData?.role === 'employee' && currentUser) {
                    const calAf = document.getElementById('calendarAssigneeFilter');
                    if (calAf) calAf.value = currentUser.uid;
                }
                
                // Render My Day (головний екран)
                renderMyDay();
                
                // Show Statistics tab if allowed (after users loaded)
                if (typeof showStatsTabIfAllowed === 'function') showStatsTabIfAllowed();
                
                // Render based on current view
                if (currentCalendarView === 'list') {
                    renderTasks();
        if (typeof restoreActiveTimer === 'function') restoreActiveTimer();
                } else if (currentCalendarView === 'kanban' || currentCalendarView === 'deadlines') {
                    renderKanbanBoard(currentCalendarView);
                } else {
                    renderCalendar();
                }
                
                // Render regular tasks view
                if (currentRegularView === 'list') {
                    renderRegularTasks();
                } else {
                    renderRegularWeekView();
                }
                
                // Показуємо попап "Мій день" при першому завантаженні
                if (!sessionStorage.getItem('myDayShown')) {
                    showMyDayPopup();
                    sessionStorage.setItem('myDayShown', '1');
                }
                
                // Update overdue badges
                updateOverdueBadges();
                
                // Зберігаємо для offline — deferred to idle
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => saveOfflineData(), { timeout: 5000 });
                } else {
                    setTimeout(saveOfflineData, 2000);
                }
                
                // Архівація в фоні (non-blocking) — не чекаємо результату
                autoArchiveDoneTasks().then(() => {
                    // Якщо щось заархівувалось — перерендерити
                    // (tasks[] вже оновлений всередині autoArchiveDoneTasks)
                }).catch(() => {});
                
                dbg(`[loadAllData] Done in ${Math.round(performance.now() - startTime)}ms, tasks: ${tasks.length}`);
                if (currentUserData?.role === 'employee') {
                    const visible = tasks.filter(t => isTaskVisibleToUser(t)).length;
                    dbg(`[Visibility] Employee "${currentUserData.name}" sees ${visible}/${tasks.length} tasks`);
                }
                // BUG #1 fix: ініціалізуємо систему ролей після завантаження даних компанії
                if (typeof window.initRolesPermissions === 'function') {
                    window.initRolesPermissions().catch(e => console.warn('[Roles] init error:', e));
                }
                document.dispatchEvent(new CustomEvent('companyLoaded'));
                
            } catch (error) {
                console.error('loadAllData error:', error);
            } finally {
                if (thisLoadVersion === loadingVersion) {
                    isLoading = false;
                    // Check escalations after data is loaded
                    checkEscalations();
                    if (typeof initUsersTabVisibility === 'function') initUsersTabVisibility();
                if (typeof initOwnerReportOption === 'function') initOwnerReportOption();
                if (typeof initOwnerDashboardVisibility === 'function') initOwnerDashboardVisibility();
                    // Load manual incidents for journal
                    loadManualIncidents().catch(() => {});
                    // Load project-driven data (stages, materials, QC) for owner dashboard
                    if (currentUserData?.role !== 'employee') {
                        Promise.all([
                            typeof window.loadProjectStages === 'function' ? window.loadProjectStages() : Promise.resolve([]),
                            typeof window.loadProjectMaterials === 'function' ? window.loadProjectMaterials() : Promise.resolve([]),
                            typeof window.loadQualityChecks === 'function' ? window.loadQualityChecks() : Promise.resolve([]),
                            typeof window.loadWorkStandards === 'function' ? window.loadWorkStandards() : Promise.resolve([]),
                        ]).then(() => {
                            if (typeof window.renderOwnerProjectDashboard === 'function') window.renderOwnerProjectDashboard();
                        }).catch(e => console.warn('[loadAllData] project extras:', e));
                    }
                    // Show morning start modal (once per day)
                    setTimeout(() => { checkMorningStart(); startOnboarding(); saveDailySnapshot(); }, 1500);

                    // FIX: Dispatch event so feature-dependent modules initialize
                    // AFTER companyFeatures is guaranteed to be set
                    window.dispatchEvent(new CustomEvent('talko:featuresLoaded'));
                }
                hideSkeletonLoading();
            }
        }
