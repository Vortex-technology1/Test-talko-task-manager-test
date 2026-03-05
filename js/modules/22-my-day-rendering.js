// =====================
        // MY DAY RENDERING
        // =====================
        function renderMyDay() {
            _visibleTaskIds = null; // Invalidate visibility cache
            const container = document.getElementById('mydayContent');
            if (!container) return;
            
            const today = new Date();
            const todayStr = getLocalDateStr(today);
            const todayDay = today.getDay();
            
            // Форматуємо дату
            const dayNames = getDayNames();
            const monthGenitive = { ua: ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'],
                ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
                pl: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
                en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'] };
            const monthNames = monthGenitive[currentLang] || monthGenitive['ua'];
            
            const dateText = `${dayNames[todayDay]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;
            document.getElementById('mydayDateText').textContent = dateText;
            
            // Збираємо всі завдання на сьогодні для поточного користувача
            const myTasks = [];
            
            // PRE-BUILD: lookup maps для O(1) пошуку (замість O(n) find кожного разу)
            const myTaskIds = new Set();
            const funcByName = {};
            functions.forEach(f => { funcByName[f.name] = f; });
            
            // Index для швидкого пошуку згенерованих regular tasks
            const generatedTaskIndex = {};
            tasks.forEach(t => {
                if (t.regularTaskId && t.deadlineDate === todayStr && t.assigneeId === currentUser?.uid) {
                    // Зберігаємо перший знайдений (масив desc по createdAt → перший = найновіший)
                    if (!generatedTaskIndex[t.regularTaskId]) {
                        generatedTaskIndex[t.regularTaskId] = t;
                    }
                }
            });
            
            // 1. Разові завдання з дедлайном сьогодні або прострочені
            tasks.filter(t => {
                if (t.assigneeId !== currentUser.uid) return false;
                if (t.deadlineDate === todayStr) return true;
                if (t.deadlineDate < todayStr && t.status !== 'done' && t.status !== 'review') return true;
                return false;
            }).forEach(t => {
                myTaskIds.add(t.id);
                myTasks.push({
                    id: t.id,
                    title: t.title,
                    time: t.deadlineTime || '',
                    function: t.function || '',
                    type: 'task',
                    done: t.status === 'done',
                    review: t.status === 'review',
                    overdue: t.deadlineDate < todayStr && t.status !== 'done' && t.status !== 'review',
                    priority: t.priority || 'medium',
                    originalTask: t
                });
            });
            
            // 1.5. Завдання на перевірці де поточний юзер — постановник (не виконавець)
            tasks.filter(t => {
                if (t.status !== 'review') return false;
                if (t.creatorId !== currentUser.uid) return false;
                if (t.assigneeId === currentUser.uid) return false; // вже покриті вище
                // Не дублюємо якщо вже є в myTasks (O(1) Set lookup)
                return !myTaskIds.has(t.id);
            }).forEach(t => {
                myTasks.push({
                    id: t.id,
                    title: t.title,
                    time: t.deadlineTime || '',
                    function: t.function || '',
                    type: 'task',
                    done: false,
                    review: true,
                    overdue: false,
                    priority: t.priority || 'medium',
                    originalTask: t
                });
            });
            
            // 2. Регулярні завдання на сьогодні
            regularTasks.forEach(rt => {
                // Перевіряємо чи поточний користувач є виконавцем функції (O(1) map lookup)
                const func = funcByName[rt.function];
                if (!func || !func.assigneeIds?.includes(currentUser.uid)) return;
                
                // Перевіряємо чи сьогодні день цього завдання
                let isToday = false;
                
                // Підтримка старого формату daily
                if (rt.period === 'daily') {
                    isToday = true;
                } else if (rt.period === 'weekly') {
                    if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) {
                        isToday = rt.daysOfWeek.includes(todayDay.toString());
                    } else if (rt.dayOfWeek) {
                        isToday = rt.dayOfWeek === todayDay.toString();
                    }
                } else if (rt.period === 'monthly') {
                    const todayDate = today.getDate();
                    if (rt.dayOfMonth === 'last') {
                        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                        isToday = todayDate === lastDay;
                    } else {
                        isToday = todayDate === parseInt(rt.dayOfMonth);
                    }
                } else if (rt.period === 'quarterly') {
                    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
                    if (today.getMonth() === quarterStartMonth) {
                        const todayDate = today.getDate();
                        if (rt.dayOfMonth === 'last') {
                            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                            isToday = todayDate === lastDay;
                        } else {
                            isToday = todayDate === parseInt(rt.dayOfMonth);
                        }
                    }
                }
                
                if (!isToday) return;
                
                // Перевіряємо чи виконано (O(1) index lookup замість O(n) find)
                const generatedTask = generatedTaskIndex[rt.id] || null;
                
                myTasks.push({
                    id: rt.id,
                    title: rt.title,
                    time: rt.timeStart || rt.time || '',
                    function: rt.function || '',
                    type: 'regular',
                    done: generatedTask?.status === 'done',
                    review: generatedTask?.status === 'review',
                    overdue: false,
                    generatedTaskId: generatedTask?.id,
                    originalTask: generatedTask || rt
                });
            });
            
            // Сортуємо: спочатку не виконані, потім review, потім по часу
            myTasks.sort((a, b) => {
                // done внизу
                if (a.done !== b.done) return a.done ? 1 : -1;
                // review після pending
                if (a.review !== b.review) return a.review ? 1 : -1;
                if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
                return (a.time || '99:99').localeCompare(b.time || '99:99');
            });
            
            // Статистика
            const total = myTasks.length;
            const done = myTasks.filter(t => t.done).length;
            const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;
            
            document.getElementById('mydayProgressFill').style.width = progressPercent + '%';
            document.getElementById('mydayProgressFill').style.background = progressPercent >= 80 ? 'var(--success)' : progressPercent >= 40 ? '#f59e0b' : '#ef4444';
            document.getElementById('mydayProgressText').textContent = `${done}/${total} (${progressPercent}%)`;
            
            // Рендеримо
            if (myTasks.length === 0) {
                container.innerHTML = `
                    <div class="myday-empty">
                        <div class="myday-empty-icon"><i data-lucide="clipboard-list" class="icon icon-xl" style="width:48px;height:48px;color:var(--gray);"></i></div>
                        <h3>${t('noTasksForToday')}</h3>
                        <p style="color:var(--gray);margin-top:0.5rem;">${t('timeToRest')}</p>
                    </div>`;
                refreshIcons();
                return;
            }
            
            // Всі виконані?
            if (done === total && total > 0) {
                container.innerHTML = `
                    <div class="myday-all-done">
                        <div class="myday-all-done-icon"><i data-lucide="party-popper" class="icon" style="width:48px;height:48px;color:var(--success);"></i></div>
                        <h3>${t('allTasksDone')}</h3>
                        <p style="color:var(--gray);">${t('greatJob')}</p>
                    </div>
                    <div class="myday-section" style="margin-top:1rem;">
                        <div class="myday-section-title">
                            <i data-lucide="check-circle" class="icon icon-sm" style="color:var(--success);"></i>
                            ${t('doneToday')} (${done})
                        </div>
                        ${myTasks.map(t => renderMyDayItem(t)).join('')}
                    </div>`;
                refreshIcons();
                return;
            }
            
            // Розділяємо на категорії
            const overdueTasks = myTasks.filter(t => t.overdue && !t.done && !t.review);
            const pendingTasks = myTasks.filter(t => !t.done && !t.overdue && !t.review);
            const reviewTasks = myTasks.filter(t => t.review);
            const doneTasks = myTasks.filter(t => t.done);
            
            let html = '';
            
            // Прострочені
            if (overdueTasks.length > 0) {
                html += `
                    <div class="myday-section">
                        <div class="myday-section-title" style="color:var(--danger);">
                            <i data-lucide="alert-circle" class="icon icon-sm"></i>
                            ${t('overdueStatus')} (${overdueTasks.length})
                        </div>
                        ${overdueTasks.map(t => renderMyDayItem(t)).join('')}
                    </div>`;
            }
            
            // Очікують виконання
            if (pendingTasks.length > 0) {
                html += `
                    <div class="myday-section">
                        <div class="myday-section-title">
                            <i data-lucide="circle" class="icon icon-sm"></i>
                            ${t('toDo')} (${pendingTasks.length})
                        </div>
                        ${pendingTasks.map(t => renderMyDayItem(t)).join('')}
                    </div>`;
            }
            
            // На перевірці
            if (reviewTasks.length > 0) {
                html += `
                    <div class="myday-section">
                        <div class="myday-section-title" style="color:#8b5cf6;">
                            <i data-lucide="eye" class="icon icon-sm"></i>
                            ${t('onReview')} (${reviewTasks.length})
                        </div>
                        ${reviewTasks.map(t => renderMyDayItem(t)).join('')}
                    </div>`;
            }
            
            // Виконані
            if (doneTasks.length > 0) {
                html += `
                    <div class="myday-section">
                        <div class="myday-section-title" style="color:var(--success);">
                            <i data-lucide="check-circle" class="icon icon-sm"></i>
                            ${t('completedStatus')} (${doneTasks.length})
                        </div>
                        ${doneTasks.map(t => renderMyDayItem(t)).join('')}
                    </div>`;
            }
            
            container.innerHTML = html;
            refreshIcons();
            updateOverdueBadge();
            renderMyAnalytics();
        }
        
        function renderMyDayItem(task) {
            const checkClass = task.done ? 'checked' : (task.review ? 'checked' : '');
            const itemClass = task.done ? 'done' : (task.review ? 'review' : (task.overdue ? 'overdue' : ''));
            const tagClass = task.type === 'regular' ? 'regular' : '';
            const tagText = task.type === 'regular' 
                ? (t('regularType'))
                : (t('oneTimeType'));
            
            // Визначаємо чи поточний юзер — постановник цього завдання
            const isCreator = task.originalTask?.creatorId === currentUser?.uid;
            const showReviewActions = task.review && isCreator && task.originalTask?.assigneeId !== currentUser?.uid;
            
            let reviewActionsHtml = '';
            if (showReviewActions) {
                const taskId = task.type === 'regular' ? (task.generatedTaskId || task.id) : task.id;
                reviewActionsHtml = `
                    <div style="display:flex;gap:0.4rem;margin-top:0.5rem;" onclick="event.stopPropagation();">
                        <button onclick="acceptReviewTask('${escId(taskId)}')" 
                                style="flex:1;padding:0.4rem 0.6rem;border:none;border-radius:8px;background:#22c55e;color:white;font-weight:600;cursor:pointer;font-size:0.8rem;">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-2px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${t('acceptTask')}
                        </button>
                        <button onclick="rejectReviewTask('${escId(taskId)}')" 
                                style="flex:1;padding:0.4rem 0.6rem;border:none;border-radius:8px;background:#f59e0b;color:white;font-weight:600;cursor:pointer;font-size:0.8rem;">
                            <i data-lucide="rotate-ccw" class="icon icon-sm"></i> ${t('rejectTask')}
                        </button>
                    </div>`;
            }
            
            let reviewBadge = '';
            if (task.review) {
                reviewBadge = `<span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:#f3e8ff;color:#7c3aed;font-weight:500;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-1px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${t('reviewLabel')}</span>`;
            }
            
            // Project/stage context
            let projectBadge = '';
            const ot = task.originalTask || {};
            if (ot.projectId) {
                const proj = projects.find(p => p.id === ot.projectId);
                if (proj) {
                    let badge = esc(proj.name);
                    if (ot.stageId && typeof window.projectStages !== 'undefined') {
                        const st = window.projectStages.find(s => s.id === ot.stageId);
                        if (st) badge += ' → ' + esc(st.name);
                    }
                    projectBadge = `<span style="font-size:0.65rem;padding:1px 5px;border-radius:4px;background:#eff6ff;color:#3b82f6;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${badge}</span>`;
                }
            }
            
            return `
                <div class="myday-item ${itemClass}" onclick="openMyDayTask('${escId(task.id)}', '${escId(task.type)}', '${escId(task.generatedTaskId || '')}')">
                    <div class="myday-checkbox ${checkClass}" ${!task.review ? `onclick="event.stopPropagation(); toggleMyDayTask(event, '${escId(task.id)}', '${escId(task.type)}', '${escId(task.generatedTaskId || '')}', ${task.done || task.review})"` : ''} ${task.review ? 'style="background:#8b5cf6;border-color:#8b5cf6;"' : ''}>
                        ${task.done ? '<i data-lucide="check" class="icon icon-sm"></i>' : ''}
                        ${task.review ? '<i data-lucide="eye" class="icon icon-sm" style="color:white;"></i>' : ''}
                    </div>
                    <div class="myday-item-content">
                        <div class="myday-item-title">${esc(task.title)}</div>
                        <div class="myday-item-meta">
                            ${task.time ? `<span class="myday-item-time">${esc(task.time)}</span>` : ''}
                            ${task.function ? `<span>${esc(task.function)}</span>` : ''}
                            <span class="myday-item-tag ${tagClass}">${tagText}</span>
                            ${reviewBadge}
                            ${projectBadge}
                            ${!task.done ? getAiHelpButton(task.title, task.originalTask?.description || task.originalTask?.instruction || '', task.function, 'small') : ''}
                        </div>
                        ${reviewActionsHtml}
                    </div>
                    ${!task.done && !task.review ? getTimerButtonHtml(task.id) : ''}
                    ${task.overdue ? '<i data-lucide="alert-triangle" class="icon" style="color:var(--danger);"></i>' : ''}
                </div>`;
        }
        
        async function toggleMyDayTask(e, id, type, generatedTaskId, currentDone) {
            
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(currentDone ? 10 : [10, 50, 10]);
            
            // Visual feedback - знаходимо елемент і анімуємо
            const checkbox = e?.target?.closest('.myday-checkbox');
            const item = checkbox?.closest('.myday-item');
            
            if (checkbox && !currentDone) {
                checkbox.classList.add('checked');
                checkbox.innerHTML = '<i data-lucide="check" class="icon icon-sm"></i>';
                refreshIcons();
            }
            if (item && !currentDone) {
                item.style.transform = 'scale(0.98)';
                item.style.opacity = '0.7';
            }
            
            try {
                if (type === 'regular') {
                    // Для регулярних - змінюємо статус згенерованого завдання
                    const todayStr = getLocalDateStr();
                    
                    
                    // Спочатку шукаємо завдання для ПОТОЧНОГО користувача
                    let taskToUpdate = null;
                    
                    if (generatedTaskId) {
                        // Перевіряємо чи це завдання дійсно належить поточному користувачу
                        taskToUpdate = tasks.find(t => t.id === generatedTaskId && t.assigneeId === currentUser.uid);
                    }
                    
                    // Якщо не знайшли по generatedTaskId - шукаємо по regularTaskId
                    if (!taskToUpdate) {
                        taskToUpdate = tasks.find(t => 
                            t.regularTaskId === id && 
                            t.deadlineDate === todayStr &&
                            t.assigneeId === currentUser.uid
                        );
                    }
                    
                    
                    if (taskToUpdate) {
                        // Оновлюємо існуюче завдання
                        const newStatus = currentDone ? 'new' : 'done';
                        await db.collection('companies').doc(currentCompany).collection('tasks').doc(taskToUpdate.id).update({
                            status: newStatus,
                            completedAt: newStatus === 'done' ? firebase.firestore.FieldValue.serverTimestamp() : null,
                            completedDate: newStatus === 'done' ? ((typeof getLocalDateStr === 'function') ? getLocalDateStr(new Date()) : new Date().toISOString().split('T')[0]) : null,  // P0 FIX
                        });
                        // AUDIT LOG
                        logTaskChange(taskToUpdate.id, newStatus === 'done' ? 'complete' : 'reopen', { status: newStatus }, { status: currentDone ? 'done' : 'new' });
                    } else if (!currentDone) {
                        // Завдання не існує в локальному масиві - перевіряємо Firestore напряму
                        const todayStr2 = getLocalDateStr();
                        const existCheck = await db.collection('companies').doc(currentCompany)
                            .collection('tasks')
                            .where('regularTaskId', '==', id)
                            .where('deadlineDate', '==', todayStr2)
                            .where('assigneeId', '==', currentUser.uid)
                            .limit(1).get();
                        
                        if (!existCheck.empty) {
                            // Вже існує в Firestore — оновлюємо замість створення
                            const existingDoc = existCheck.docs[0];
                            await existingDoc.ref.update({
                                status: 'done',
                                completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                                completedDate: ((typeof getLocalDateStr === 'function') ? getLocalDateStr(new Date()) : new Date().toISOString().split('T')[0]),  // P0 FIX
                            });
                        } else {
                        // Створюємо нове
                        const rt = regularTasks.find(r => r.id === id);
                        if (rt) {
                            const newTaskRef = await db.collection('companies').doc(currentCompany).collection('tasks').add({
                                title: rt.title,
                                function: rt.function,
                                assigneeId: currentUser.uid,
                                assigneeName: currentUserData?.name || currentUser.email,
                                deadlineDate: todayStr2,
                                deadlineTime: rt.timeStart || rt.time || '18:00',
                                deadline: todayStr2 + 'T' + (rt.timeStart || rt.time || '18:00'),
                                expectedResult: rt.expectedResult || '',
                                reportFormat: rt.reportFormat || '',
                                description: rt.instruction || '',
                                status: 'done',
                                priority: 'medium',
                                pinned: false,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                createdDate: todayStr2,
                                creatorName: t('systemUser'),
                                regularTaskId: id,
                                autoGenerated: true,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                                completedDate: ((typeof getLocalDateStr === 'function') ? getLocalDateStr(new Date()) : new Date().toISOString().split('T')[0]),  // P0 FIX
                            });
                        } else {
                            console.error('Could not find regular task template:', id);
                            throw new Error(t('regularTaskNotFound'));
                        }
                        } // close existCheck else
                    } else {
                        console.error('Cannot uncheck - task not found for user');
                        throw new Error(t('taskNotFound'));
                    }
                } else {
                    // Для разових - перевіряємо чи потрібна перевірка
                    const taskObj = tasks.find(t => t.id === id);
                    const needsReview = !currentDone && shouldSendForReview(taskObj);
                    const newStatus = currentDone ? 'new' : (needsReview ? 'review' : 'done');
                    
                    const _cd = ((typeof getLocalDateStr === 'function') ? getLocalDateStr(new Date()) : new Date().toISOString().split('T')[0]);
                    await db.collection('companies').doc(currentCompany).collection('tasks').doc(id).update({
                        status: newStatus,
                        completedAt: newStatus === 'done' ? firebase.firestore.FieldValue.serverTimestamp() : null,
                        completedDate: newStatus === 'done' ? _cd : null,  // P0 FIX
                        ...(needsReview ? { sentForReviewAt: firebase.firestore.FieldValue.serverTimestamp() } : {})
                    });
                    // AUDIT LOG
                    logTaskChange(id, newStatus === 'done' || newStatus === 'review' ? 'complete' : 'reopen', { status: newStatus }, { status: currentDone ? 'done' : 'new' });
                    
                    if (needsReview) {
                        showToast(t('taskSentForReview'), 'info');
                    }
                }
                
                // Локальне оновлення замість loadAllData
                if (type === 'regular') {
                    const todayStr = getLocalDateStr();
                    let taskToUpdate = tasks.find(t => 
                        t.regularTaskId === id && 
                        t.deadlineDate === todayStr && 
                        t.assigneeId === currentUser.uid
                    );
                    if (taskToUpdate) {
                        taskToUpdate.status = currentDone ? 'new' : 'done';
                        taskToUpdate.completedAt = currentDone ? null : new Date().toISOString();
                        if (taskToUpdate.projectId) autoUpdateProjectStatus(taskToUpdate.projectId);
                    }
                } else {
                    const task = tasks.find(t => t.id === id);
                    if (task) {
                        const needsReview = !currentDone && shouldSendForReview(task);
                        task.status = currentDone ? 'new' : (needsReview ? 'review' : 'done');
                        task.completedAt = currentDone ? null : new Date().toISOString();
                        // Автопросування процесу
                        if (!needsReview && !currentDone) {
                            advanceProcessIfLinked(task.id);
                        }
                        // Автостатус проєкту
                        if (task.projectId) autoUpdateProjectStatus(task.projectId);
                    }
                }
                
                renderMyDay();
            } catch (error) {
                console.error('Error toggling task:', error);
                showAlertModal(t('error') + ': ' + error.message);
                // Відновлюємо UI при помилці
                if (checkbox && !currentDone) {
                    checkbox.classList.remove('checked');
                    checkbox.innerHTML = '';
                }
                if (item) {
                    item.style.transform = '';
                    item.style.opacity = '';
                }
            }
        }
        
        function openMyDayTask(id, type, generatedTaskId) {
            if (type === 'regular' && generatedTaskId) {
                openTaskModal(generatedTaskId);
            } else if (type === 'task') {
                openTaskModal(id);
            } else {
                // Регулярне без згенерованого - відкриваємо регулярне
                openRegularTaskModal(id);
            }
        }
        
        async function refreshMyDay() {
            const btn = document.querySelector('.myday-refresh-btn');
            if (btn) {
                btn.classList.add('spinning');
            }
            if (navigator.vibrate) navigator.vibrate(10);
            
            try {
                await loadAllData();
                renderMyDay();
            } finally {
                setTimeout(() => {
                    if (btn) btn.classList.remove('spinning');
                }, 500);
            }
        }
