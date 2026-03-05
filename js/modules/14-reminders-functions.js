// =====================
        // REMINDERS FUNCTIONS
        // =====================
        
        // Отримуємо вибрані нагадування
        function getSelectedReminders() {
            const reminders = [];
            if (document.getElementById('taskReminder60')?.checked) reminders.push(60);
            if (document.getElementById('taskReminder30')?.checked) reminders.push(30);
            if (document.getElementById('taskReminder15')?.checked) reminders.push(15);
            return reminders;
        }
        
        // Встановлюємо чекбокси нагадувань
        function setRemindersCheckboxes(reminders) {
            const r60 = document.getElementById('taskReminder60');
            const r30 = document.getElementById('taskReminder30');
            const r15 = document.getElementById('taskReminder15');
            
            if (r60) r60.checked = reminders.includes(60);
            if (r30) r30.checked = reminders.includes(30);
            if (r15) r15.checked = reminders.includes(15);
        }
        
        // Рендеримо чекбокси для контролю (notifyOnReminder)
        function renderNotifyReminderCheckboxes() {
            const container = document.getElementById('taskNotifyReminder');
            if (!container) return;
            
            const managers = users.filter(u => u.role === 'owner' || u.role === 'manager');
            const uid = 'taskNotifyReminder_ms';
            
            container.innerHTML = `
                <div class="user-multiselect" id="${uid}" style="position:relative;width:100%;">
                    <div class="user-ms-toggle" onclick="toggleUserMultiSelect('${uid}')" 
                         style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;background:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-size:0.85rem;min-height:38px;transition:border-color 0.2s;">
                        <span class="user-ms-label" style="color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${t('selectPlaceholder')}</span>
                        <span style="color:#9ca3af;margin-left:0.5rem;display:flex;align-items:center;gap:0.3rem;">
                            <span style="background:#22c55e;color:white;font-size:0.7rem;padding:1px 6px;border-radius:10px;font-weight:600;display:none;">0</span>
                            <i data-lucide="chevron-down" class="icon" style="width:14px;height:14px;"></i>
                        </span>
                    </div>
                    <div class="user-ms-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;margin-top:4px;background:white;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:200;max-height:200px;overflow:hidden;">
                        <div class="user-ms-list" style="overflow-y:auto;max-height:190px;padding:0.25rem;">
                            ${managers.map(user => {
                                const roleIcon = user.role === 'owner' ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg> ' : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ';
                                return `<label class="user-ms-item" data-name="${esc((user.name || user.email).toLowerCase())}" 
                                                style="display:flex;align-items:center;gap:0.5rem;padding:0.45rem 0.6rem;cursor:pointer;border-radius:6px;font-size:0.84rem;transition:background 0.1s;" 
                                                onmouseover="if(!this.querySelector('input').checked)this.style.background='#f9fafb'" 
                                                onmouseout="if(!this.querySelector('input').checked)this.style.background=''">
                                    <input type="checkbox" name="notifyReminder" value="${esc(user.id)}" 
                                           style="width:16px;height:16px;accent-color:#22c55e;flex-shrink:0;" 
                                           onchange="onUserMultiSelectChange('${uid}','taskNotifyReminder')">
                                    <span>${roleIcon}${esc(user.name || user.email)}</span>
                                </label>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
            refreshIcons();
        }
        
        // Встановлюємо чекбокси контролю
        function setNotifyReminderCheckboxes(userIds) {
            const container = document.getElementById('taskNotifyReminder');
            if (!container) return;
            
            container.querySelectorAll('input[name="notifyReminder"]').forEach(cb => {
                cb.checked = userIds.includes(cb.value);
                const item = cb.closest('.user-ms-item');
                if (item) item.style.background = cb.checked ? '#f0fdf4' : '';
            });
            onUserMultiSelectChange('taskNotifyReminder_ms', 'taskNotifyReminder');
        }
        
        // Отримуємо вибраних для контролю
        function getNotifyReminderFromCheckboxes() {
            const container = document.getElementById('taskNotifyReminder');
            if (!container) return [];
            
            return Array.from(container.querySelectorAll('input[name="notifyReminder"]:checked'))
                .map(cb => cb.value);
        }

        async function saveTask(e) {
            e.preventDefault();
            
            // Захист від подвійного збереження
            if (isSaving) return;
            
            // Rate limiting
            if (!rateLimiter.check('saveTask')) {
                showAlertModal(t('tooManyRequests'));
                return;
            }
            
            // Збираємо дані для валідації
            const taskData = {
                title: document.getElementById('taskTitle').value.trim(),
                deadlineDate: document.getElementById('taskDeadlineDate').value,
                deadlineTime: document.getElementById('taskDeadlineTime').value,
                description: document.getElementById('taskDescription').value.trim()
            };
            
            // Валідація
            const errors = validateTaskData(taskData);
            if (errors.length > 0) {
                showAlertModal(errors.join('\n'));
                return;
            }
            
            isSaving = true;
            
            // Копіюємо editingId локально щоб уникнути race condition
            const currentEditingId = editingId;
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn?.innerHTML;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
            }
            
            try {
                const assigneeId = document.getElementById('taskAssignee').value;
                const assignee = users.find(u => u.id === assigneeId);
                
                // Warn if assignee has critical overdue tasks
                if (assigneeId && !currentEditingId) {
                    const todayStr = getLocalDateStr(new Date());
                    const criticalOverdue = tasks.filter(t => 
                        t.assigneeId === assigneeId && 
                        t.status !== 'done' && 
                        t.deadlineDate && 
                        t.deadlineDate < todayStr &&
                        Math.floor((new Date() - new Date(t.deadlineDate + 'T23:59')) / 86400000) >= 3
                    );
                    if (criticalOverdue.length >= 3) {
                        const name = assignee?.name || assignee?.email || '';
                        const proceed = await showConfirmModal(
                            `${name}: ${criticalOverdue.length} ${t('criticalOverdueWarning')}\n\n${t('criticalOverdueAdvice')}\n\n${t('continueAnyway')}`
                        );
                        if (!proceed) {
                            isSaving = false;
                            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
                            return;
                        }
                    }
                }
                const deadlineDate = document.getElementById('taskDeadlineDate').value;
                const deadlineTime = document.getElementById('taskDeadlineTime').value;
                const timeMode = document.getElementById('taskTimeMode').value;
                const timeEnd = timeMode === 'end' 
                    ? document.getElementById('taskTimeEnd').value 
                    : calculateEndTime(deadlineTime, parseInt(document.getElementById('taskEstimatedTime').value || '60'));
                const duration = timeMode === 'duration' 
                    ? parseInt(document.getElementById('taskEstimatedTime').value || '60') 
                    : null;
                
                const statusVal = document.getElementById('taskStatus').value;
                const data = {
                    title: document.getElementById('taskTitle').value.trim(),
                    function: document.getElementById('taskFunction').value,
                    ownerFunctionId: (() => {
                        const fname = document.getElementById('taskFunction').value;
                        if (!fname || typeof functions === 'undefined') return '';
                        const f = functions.find(fn => fn.name === fname);
                        return f?.id || '';
                    })(),
                    projectId: document.getElementById('taskProject')?.value || '',
                    stageId: document.getElementById('taskStage')?.value || '',
                    assigneeId: assigneeId,
                    assigneeName: assignee?.name || assignee?.email || '',
                    deadlineDate: deadlineDate,
                    deadlineTime: deadlineTime,
                    timeEnd: timeEnd,
                    duration: duration,
                    deadline: deadlineDate + 'T' + deadlineTime, // для сумісності
                    estimatedTime: document.getElementById('taskEstimatedTime').value,
                    priority: document.getElementById('taskPriority').value,
                    status: statusVal,
                    expectedResult: document.getElementById('taskExpectedResult').value.trim(),
                    reportFormat: document.getElementById('taskReportFormat').value.trim(),
                    description: document.getElementById('taskDescription').value.trim(),
                    notifyOnComplete: getNotifyUsersFromCheckboxes(),
                    // Нові поля для сповіщень
                    reminders: getSelectedReminders(),
                    escalationEnabled: document.getElementById('taskEscalationEnabled').checked,
                    escalationMinutes: parseInt(document.getElementById('taskEscalationMinutes').value) || 60,
                    notifyOnReminder: getNotifyReminderFromCheckboxes(),
                    // FEAT-001: Співвиконавці та спостерігачі
                    coExecutorIds: getSelectedUsersFromCheckboxes('taskCoExecutors'),
                    observerIds: getSelectedUsersFromCheckboxes('taskObservers'),
                    // FEAT-003: Дата початку
                    startDate: document.getElementById('taskStartDate').value || null,
                    // FEAT-002+007: Toggles
                    requireReview: document.getElementById('taskRequireReview').checked,
                    allowDeadlineChange: document.getElementById('taskAllowDeadlineChange').checked,
                    requireReport: document.getElementById('taskRequireReport').checked,
                    // FEAT-001: Чеклист
                    checklist: getChecklistData(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                // Status-dependent timestamps + review enforcement
                const existingForReview = currentEditingId ? tasks.find(t => t.id === currentEditingId) : null;
                if (statusVal === 'done' && existingForReview && shouldSendForReview(existingForReview)) {
                    // Задача потребує review — перенаправляємо
                    data.status = 'review';
                    data.sentForReviewAt = firebase.firestore.FieldValue.serverTimestamp();
                    data.completedAt = null;
                } else if (statusVal === 'done') {
                    data.completedAt = firebase.firestore.FieldValue.serverTimestamp();
                    data.completedBy = currentUser.uid;
                } else if (statusVal === 'review') {
                    data.sentForReviewAt = firebase.firestore.FieldValue.serverTimestamp();
                    data.completedAt = null;
                } else {
                    data.completedAt = null;
                }
                
                let newDocRef = null;
                let _prevProjectId = '';
                
                if (currentEditingId) {
                    // Update existing task
                    const existingTask = tasks.find(t => t.id === currentEditingId);
                    // Permission check: employee can only edit own tasks
                    if (existingTask && !canEditTask(existingTask)) {
                        showToast(t('noPermissionTask'), 'error');
                        isSaving = false;
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
                        return;
                    }
                    // Зберігаємо попередній projectId для автостатусу
                    _prevProjectId = existingTask?.projectId || '';
                    
                    // Concurrency check: warn if another user modified this task
                    if (existingTask?._openedAt) {
                        try {
                            const freshDoc = await db.collection('companies').doc(currentCompany).collection('tasks').doc(currentEditingId).get();
                            const freshUpdated = freshDoc.data()?.updatedAt;
                            if (freshUpdated?.toMillis && freshUpdated.toMillis() > existingTask._openedAt) {
                                if (!await showConfirmModal(t('taskModifiedByOther'), { danger: true })) {
                                    isSaving = false;
                                    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
                                    return;
                                }
                            }
                        } catch(e) { /* proceed on error */ }
                    }
                    
                    await db.collection('companies').doc(currentCompany).collection('tasks').doc(currentEditingId).update(data);
                    
                    // AUDIT LOG — визначаємо що змінилось
                    if (existingTask) {
                        const trackedFields = ['title','status','assigneeId','deadlineDate','deadlineTime','priority','description','expectedResult','projectId','function','requireReview'];
                        const changes = {};
                        for (const f of trackedFields) {
                            if (String(data[f] ?? '') !== String(existingTask[f] ?? '')) {
                                changes[f] = data[f];
                            }
                        }
                        if (Object.keys(changes).length > 0) {
                            const action = changes.status ? 'status' : changes.assigneeId ? 'reassign' : changes.deadlineDate || changes.deadlineTime ? 'deadline' : 'edit';
                            logTaskChange(currentEditingId, action, changes, existingTask);
                            
                            // Decision log for AGI
                            if (changes.assigneeId) {
                                logDecision('reassign', {
                                    taskId: currentEditingId,
                                    taskTitle: data.title,
                                    from: existingTask.assigneeId,
                                    to: data.assigneeId,
                                    function: data.function
                                });
                            }
                            if (changes.deadlineDate) {
                                logDecision('deadline_change', {
                                    taskId: currentEditingId,
                                    taskTitle: data.title,
                                    from: existingTask.deadlineDate,
                                    to: data.deadlineDate,
                                    assignee: data.assigneeId
                                });
                            }
                            if (changes.priority) {
                                logDecision('priority_change', {
                                    taskId: currentEditingId,
                                    taskTitle: data.title,
                                    from: existingTask.priority,
                                    to: data.priority
                                });
                            }
                        }
                    }
                    
                    // Sync with Google Calendar (non-blocking)
                    if (existingTask?.calendarEventId && googleAccessToken) {
                        updateCalendarEvent(existingTask.calendarEventId, data).catch(err => 
                            console.warn('[Calendar] Update sync failed:', err)
                        );
                    }
                } else {
                    // Create new task
                    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    data.createdDate = getLocalDateStr();
                    data.creatorId = currentUser.uid;
                    data.creatorName = currentUserData?.name || currentUser.email;
                    data.pinned = false;
                    
                    newDocRef = await db.collection('companies').doc(currentCompany).collection('tasks').add(data);
                    
                    // AUDIT LOG — створення задачі
                    logTaskChange(newDocRef.id, 'created', { title: data.title, assigneeId: data.assigneeId, deadlineDate: data.deadlineDate }, null);
                    
                    // Sync with Google Calendar (only if date is set)
                    if (deadlineDate && googleAccessToken) {
                        const calendarEventId = await createCalendarEvent(data);
                        if (calendarEventId) {
                            await newDocRef.update({ calendarEventId: calendarEventId });
                        }
                    }
                }
                
                closeModal('taskModal');
                
                // FIX 3: Warning якщо дедлайн задачі > дедлайн проєкту
                if (data.projectId && data.deadlineDate) {
                    const proj = projects.find(p => p.id === data.projectId);
                    if (proj?.deadline && data.deadlineDate > proj.deadline && data.status !== 'done') {
                        showToast(t('deadlineExceedsProject').replace('{taskDate}', formatDateShort(data.deadlineDate)).replace('{projName}', proj.name).replace('{projDate}', formatDateShort(proj.deadline)), 'warning');
                    }
                }
                
                // Автопросування процесу якщо завдання завершили через форму
                if (currentEditingId && data.status === 'done') {
                    advanceProcessIfLinked(currentEditingId);
                    // Delete calendar event when task completed
                    const completedTask = tasks.find(t => t.id === currentEditingId);
                    if (completedTask?.calendarEventId && googleAccessToken) {
                        deleteCalendarEvent(completedTask.calendarEventId).catch(() => {});
                    }
                }
                // Re-create calendar event when reopened from done via form
                if (currentEditingId && data.status !== 'done' && data.status !== 'review') {
                    const prevTask = tasks.find(t => t.id === currentEditingId);
                    if (prevTask?.status === 'done' && data.deadlineDate && googleAccessToken) {
                        createCalendarEvent(data).then(calId => {
                            if (calId) db.collection('companies').doc(currentCompany).collection('tasks').doc(currentEditingId).update({ calendarEventId: calId }).catch(() => {});
                        }).catch(() => {});
                    }
                }
                
                // Локальне оновлення замість повного перезавантаження
                if (currentEditingId) {
                    // Update — знаходимо і оновлюємо в масиві
                    const idx = tasks.findIndex(t => t.id === currentEditingId);
                    if (idx >= 0) {
                        // Прибираємо FieldValue sentinels перед локальним merge
                        const localData = { ...data };
                        delete localData.updatedAt;
                        delete localData.createdAt;
                        delete localData.completedAt;
                        delete localData.sentForReviewAt;
                        tasks[idx] = { ...tasks[idx], ...localData, id: currentEditingId };
                    }
                } else {
                    // Create — додаємо на початок масиву
                    if (!tasks.some(t => t.id === newDocRef.id)) tasks.unshift({ id: newDocRef.id, ...data, createdAt: new Date() });
                }
                
                // Перерендерюємо тільки потрібні views
                renderMyDay();
                refreshCurrentView();
                updateSelects();
                
                // Оновлюємо project detail якщо відкритий
                if (openProjectId) renderProjectDetail(openProjectId);
                
                // Автостатус проекту (оновити новий і старий проєкт)
                if (data.projectId) autoUpdateProjectStatus(data.projectId);
                if (_prevProjectId && _prevProjectId !== data.projectId) {
                    autoUpdateProjectStatus(_prevProjectId);
                }
                
                // Auto-update stage progress
                if (data.stageId && typeof window.autoUpdateStageProgress === 'function') {
                    window.autoUpdateStageProgress(data.stageId);
                }
                
                // Emit events
                if (typeof window.createProjectEvent === 'function') {
                    const prevStatus = existingTask?.status || '';
                    // task_done — тільки якщо статус реально змінився на done
                    if (data.status === 'done' && prevStatus !== 'done' && data.projectId) {
                        window.createProjectEvent('task_done', {
                            projectId: data.projectId, stageId: data.stageId || '',
                            taskId: currentEditingId || (newDocRef ? newDocRef.id : ''),
                            functionId: data.function || '',
                        });
                    }
                }
                
            } catch (error) {
                console.error('saveTask error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            } finally {
                isSaving = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        }
