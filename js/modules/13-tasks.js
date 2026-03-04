// =====================
        // TASKS
        // =====================
        function openTaskModal(id = null) {
            document.getElementById('taskModal').style.display = 'block';
            updateSelects();
            updateProjectSelects();
            
            // Accordion: закриваємо при новій задачі, розкриваємо при редагуванні
            const advPanel = document.getElementById('taskAdvancedPanel');
            const advArrow = document.getElementById('taskAdvancedArrow');
            if (advPanel) advPanel.style.display = id ? 'contents' : 'none';
            if (advArrow) advArrow.style.transform = id ? 'rotate(180deg)' : '';
            
            // Initialize comments section
            initTaskComments(id);
            
            // Рендеримо чекбокси для сповіщень
            renderNotifyUsersCheckboxes(id);
            renderNotifyReminderCheckboxes();
            
            if (id) {
                editingId = id;
                if (id) { const _t = tasks.find(t => t.id === id); if (_t) _t._openedAt = Date.now(); }
                const task = tasks.find(x => x.id === id);
                if (task) {
                    document.getElementById('taskModalTitle').textContent = t('editTask');
                    document.getElementById('taskTitle').value = task.title || '';
                    document.getElementById('taskFunction').value = task.function || '';
                    updateProjectSelects(task.projectId);
                    document.getElementById('taskProject').value = task.projectId || '';
                    // Load stages for this project
                    updateTaskStageSelect(task.projectId, task.stageId);
                    document.getElementById('taskAssignee').value = task.assigneeId || '';
                    // Розбиваємо deadline на дату і час
                    const dl = parseDeadline(task);
                    document.getElementById('taskDeadlineDate').value = dl.date;
                    document.getElementById('taskDeadlineTime').value = dl.time || '18:00';
                    
                    // Час закінчення / тривалість
                    if (task.timeEnd) {
                        document.getElementById('taskTimeEnd').value = task.timeEnd;
                        if (task.duration) {
                            document.getElementById('taskTimeMode').value = 'duration';
                            document.getElementById('taskEstimatedTime').value = task.duration;
                        } else {
                            document.getElementById('taskTimeMode').value = 'end';
                        }
                    } else if (task.estimatedTime) {
                        document.getElementById('taskTimeMode').value = 'duration';
                        document.getElementById('taskEstimatedTime').value = task.estimatedTime;
                        const startTime = task.deadlineTime || '18:00';
                        document.getElementById('taskTimeEnd').value = calculateEndTime(startTime, parseInt(task.estimatedTime));
                    } else {
                        document.getElementById('taskTimeMode').value = 'duration';
                        document.getElementById('taskEstimatedTime').value = '60';
                        document.getElementById('taskTimeEnd').value = '19:00';
                    }
                    toggleTaskTimeMode();
                    
                    document.getElementById('taskPriority').value = task.priority || 'medium';
                    document.getElementById('taskStatus').value = task.status || 'new';
                    document.getElementById('taskExpectedResult').value = task.expectedResult || '';
                    document.getElementById('taskReportFormat').value = task.reportFormat || '';
                    document.getElementById('taskDescription').value = task.description || task.instruction || '';
                    
                    // AI Help button
                    const aiRow = document.getElementById('taskAiHelpRow');
                    const aiLink = document.getElementById('taskAiHelpLink');
                    if (aiRow && aiLink) {
                        aiRow.style.display = 'block';
                        aiLink.href = getAiHelpUrl(task.title, task.description || task.instruction || '', task.function);
                    }
                    
                    // Встановлюємо чекбокси сповіщень
                    setNotifyUsersCheckboxes(task.notifyOnComplete || []);
                    
                    // Встановлюємо налаштування нагадувань
                    setRemindersCheckboxes(task.reminders || [60, 15]);
                    document.getElementById('taskEscalationEnabled').checked = task.escalationEnabled || false;
                    document.getElementById('taskEscalationMinutes').value = task.escalationMinutes || 60;
                    setNotifyReminderCheckboxes(task.notifyOnReminder || []);
                    
                    // FEAT-001: Нові поля
                    renderUserCheckboxes('taskCoExecutors', task.coExecutorIds || []);
                    renderUserCheckboxes('taskObservers', task.observerIds || []);
                    document.getElementById('taskStartDate').value = task.startDate || '';
                    document.getElementById('taskRequireReview').checked = task.requireReview !== false; // default true
                    document.getElementById('taskAllowDeadlineChange').checked = task.allowDeadlineChange || false;
                    document.getElementById('taskRequireReport').checked = task.requireReport !== undefined ? task.requireReport : !!(task.expectedResult || task.reportFormat);
                    renderChecklist(task.checklist || []);
                    
                    // FEAT-006: Time Tracking
                    renderTimeTracking(task);
                    
                    // FEAT-007: Блокуємо дедлайн якщо не дозволено
                    const deadlineEditable = canEditDeadline(task);
                    document.getElementById('taskDeadlineDate').disabled = !deadlineEditable;
                    document.getElementById('taskDeadlineTime').disabled = !deadlineEditable;
                    
                    // VIEW-ONLY режим для employee, який не є виконавцем або постановником
                    const canEdit = currentUserData?.role !== 'employee' || 
                                    task.assigneeId === currentUser?.uid || 
                                    task.creatorId === currentUser?.uid ||
                                    (task.coExecutorIds && task.coExecutorIds.includes(currentUser?.uid));
                    const formFields = document.getElementById('taskForm').querySelectorAll('input, select, textarea');
                    formFields.forEach(el => { 
                        if (!canEdit) el.disabled = true; 
                    });
                    const submitBtn = document.getElementById('taskForm').querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.style.display = canEdit ? '' : 'none';
                    if (!canEdit) {
                        document.getElementById('taskModalTitle').textContent = t('viewTask');
                    }
                    
                    // Task actions — показуємо керівнику/постановнику дії залежно від статусу
                    const reviewActions = document.getElementById('taskReviewActions');
                    if (reviewActions) {
                        const isOwnerOrAdmin = currentUserData?.role === 'owner' || currentUserData?.role === 'admin';
                        const isManager = currentUserData?.role === 'manager';
                        const isCreator = task.creatorId === currentUser?.uid;
                        const canManage = isOwnerOrAdmin || isManager || isCreator;
                        const isAssignee = task.assigneeId === currentUser?.uid;
                        
                        if (canManage && task.status === 'review') {
                            // Менеджер/owner бачить кнопки ревью
                            reviewActions.style.display = 'block';
                            reviewActions.style.background = 'linear-gradient(135deg,#f0fdf4,#ecfdf5)';
                            reviewActions.style.border = '2px solid #22c55e';
                            const label = document.getElementById('taskActionsLabel');
                            const btns = document.getElementById('taskActionsButtons');
                            label.innerHTML = '<i data-lucide="shield-check" class="icon icon-sm" style="color:#16a34a;"></i> <span style="color:#16a34a;">Завдання на перевірці</span>';
                            btns.innerHTML = `
                                <button type="button" class="btn btn-success" style="flex:1;min-width:130px;padding:0.6rem 1rem;font-size:0.9rem;font-weight:600;" onclick="acceptReviewFromModal()">
                                    <i data-lucide="check-circle" class="icon"></i> ${t('acceptTask')}
                                </button>
                                <button type="button" class="btn" style="flex:1;min-width:130px;padding:0.6rem 1rem;font-size:0.9rem;font-weight:600;background:#f59e0b;" onclick="rejectReviewFromModal()">
                                    <i data-lucide="rotate-ccw" class="icon"></i> ${t('reviseTask')}
                                </button>`;
                            refreshIcons();
                        } else if (isAssignee && (task.status === 'new' || task.status === 'progress')) {
                            // Виконавець бачить кнопку Виконано
                            reviewActions.style.display = 'block';
                            reviewActions.style.background = 'linear-gradient(135deg,#f0fdf4,#ecfdf5)';
                            reviewActions.style.border = '2px solid #22c55e';
                            const label = document.getElementById('taskActionsLabel');
                            const btns = document.getElementById('taskActionsButtons');
                            const statusLabel = task.status === 'new' ? t('statusNewTask') : t('statusInWork');
                            label.innerHTML = '<i data-lucide="info" class="icon icon-sm" style="color:#16a34a;"></i> <span style="color:#16a34a;">Статус: ' + statusLabel + '</span>';
                            
                            const manageButtons = canManage ? `
                                <button type="button" class="btn" style="flex:1;min-width:130px;padding:0.6rem 1rem;font-size:0.85rem;font-weight:600;background:#f59e0b;" onclick="rejectReviewFromModal()">
                                    <i data-lucide="message-circle" class="icon"></i> ${t('reviseTask')}
                                </button>` : '';
                            
                            btns.innerHTML = `
                                <button type="button" class="btn btn-success" style="flex:1;min-width:180px;padding:0.75rem 1rem;font-size:1rem;font-weight:700;" onclick="completeTaskFromModal()">
                                    <i data-lucide="check-circle" class="icon"></i> ${t('markDone')}
                                </button>
                                ${manageButtons}`;
                            refreshIcons();
                        } else if (!isAssignee && canManage && (task.status === 'new' || task.status === 'progress')) {
                            // Менеджер дивиться чужу задачу (не на ревью)
                            reviewActions.style.display = 'block';
                            reviewActions.style.background = 'linear-gradient(135deg,#f0f9ff,#e0f2fe)';
                            reviewActions.style.border = '2px solid #38bdf8';
                            const label = document.getElementById('taskActionsLabel');
                            const btns = document.getElementById('taskActionsButtons');
                            const statusLabel = task.status === 'new' ? t('statusNewTask') : t('statusInWork');
                            label.innerHTML = '<i data-lucide="info" class="icon icon-sm" style="color:#0284c7;"></i> <span style="color:#0284c7;">Статус: ' + statusLabel + '</span>';
                            btns.innerHTML = `
                                <button type="button" class="btn btn-success" style="flex:1;min-width:130px;padding:0.6rem 1rem;font-size:0.9rem;font-weight:600;" onclick="acceptReviewFromModal()">
                                    <i data-lucide="check-circle" class="icon"></i> ${t('acceptWork')}
                                </button>
                                <button type="button" class="btn" style="flex:1;min-width:130px;padding:0.6rem 1rem;font-size:0.9rem;font-weight:600;background:#f59e0b;" onclick="rejectReviewFromModal()">
                                    <i data-lucide="message-circle" class="icon"></i> ${t('reviseTask')}
                                </button>`;
                            refreshIcons();
                        } else if (isAssignee && task.status === 'review') {
                            // Працівник бачить що його задача на перевірці
                            reviewActions.style.display = 'block';
                            reviewActions.style.background = 'linear-gradient(135deg,#fffbeb,#fef3c7)';
                            reviewActions.style.border = '2px solid #f59e0b';
                            const label = document.getElementById('taskActionsLabel');
                            const btns = document.getElementById('taskActionsButtons');
                            label.innerHTML = '<i data-lucide="clock" class="icon icon-sm" style="color:#d97706;"></i> <span style="color:#d97706;">Завдання на перевірці у керівника</span>';
                            btns.innerHTML = '<p style="font-size:0.85rem;color:#92400e;margin:0;">Очікуйте підтвердження або зауваження</p>';
                            refreshIcons();
                        } else if (canManage && task.status === 'done') {
                            reviewActions.style.display = 'block';
                            reviewActions.style.background = 'linear-gradient(135deg,#f0fdf4,#ecfdf5)';
                            reviewActions.style.border = '2px solid #86efac';
                            const label = document.getElementById('taskActionsLabel');
                            const btns = document.getElementById('taskActionsButtons');
                            label.innerHTML = '<i data-lucide="check-circle-2" class="icon icon-sm" style="color:#16a34a;"></i> <span style="color:#16a34a;">Завдання виконано</span>';
                            btns.innerHTML = `
                                <button type="button" class="btn" style="flex:1;min-width:130px;padding:0.6rem 1rem;font-size:0.9rem;font-weight:600;background:#f59e0b;" onclick="reopenTaskFromModal()">
                                    <i data-lucide="rotate-ccw" class="icon"></i> ${t('returnToWork')}
                                </button>`;
                            refreshIcons();
                        } else {
                            reviewActions.style.display = 'none';
                        }
                    }
                }
            } else {
                editingId = null;
                document.getElementById('taskModalTitle').textContent = t('newTask');
                document.getElementById('taskForm').reset();
                // Hide review actions
                const reviewActions = document.getElementById('taskReviewActions');
                if (reviewActions) reviewActions.style.display = 'none';
                // Hide AI help for new tasks
                const aiRow = document.getElementById('taskAiHelpRow');
                if (aiRow) aiRow.style.display = 'none';
                // Reset view-only mode
                document.getElementById('taskForm').querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
                const submitBtn = document.getElementById('taskForm').querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.style.display = '';
                // Встановлюємо дефолтний час
                document.getElementById('taskDeadlineTime').value = '18:00';
                document.getElementById('taskTimeEnd').value = '19:00';
                document.getElementById('taskTimeMode').value = 'duration';
                document.getElementById('taskEstimatedTime').value = '60';
                toggleTaskTimeMode();
                
                // За замовчуванням сповіщуємо творця (поточного користувача)
                setNotifyUsersCheckboxes([currentUser?.uid]);
                
                // Дефолтні налаштування нагадувань
                setRemindersCheckboxes([60, 15]); // За 1 год і 15 хв
                document.getElementById('taskEscalationEnabled').checked = false;
                document.getElementById('taskEscalationMinutes').value = 60;
                setNotifyReminderCheckboxes([currentUser?.uid]); // Контроль творцю
                
                // FEAT-001: Дефолти нових полів
                renderUserCheckboxes('taskCoExecutors', []);
                renderUserCheckboxes('taskObservers', []);
                document.getElementById('taskStartDate').value = '';
                document.getElementById('taskRequireReview').checked = true;
                document.getElementById('taskAllowDeadlineChange').checked = false;
                document.getElementById('taskRequireReport').checked = false;
                renderChecklist([]);
                document.getElementById('taskDeadlineDate').disabled = false;
                document.getElementById('taskDeadlineTime').disabled = false;
                // FEAT-006: Ховаємо time tracking для нових завдань
                document.getElementById('timeTrackingSection').style.display = 'none';
                
                // Auto-assign employee to self
                if (currentUserData?.role === 'employee' && currentUser?.uid) {
                    document.getElementById('taskAssignee').value = currentUser.uid;
                }
            }
        }
        
        // Рендеримо чекбокси для сповіщень
        function renderNotifyUsersCheckboxes(taskId) {
            const container = document.getElementById('taskNotifyUsers');
            if (!container) return;
            
            const sortedUsers = [...users].sort((a, b) => {
                const roleOrder = { owner: 0, manager: 1, employee: 2 };
                return (roleOrder[a.role] || 2) - (roleOrder[b.role] || 2);
            });
            
            const uid = 'taskNotifyUsers_ms';
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
                    <div class="user-ms-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;margin-top:4px;background:white;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:200;max-height:240px;overflow:hidden;">
                        <div style="padding:0.4rem;border-bottom:1px solid #f3f4f6;">
                            <input type="text" placeholder="" data-i18n-placeholder="search" 
                                   oninput="filterUserMultiSelect('${uid}', this.value)"
                                   style="width:100%;padding:0.4rem 0.6rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.82rem;outline:none;" 
                                   onfocus="this.style.borderColor='#22c55e'" onblur="this.style.borderColor='#e5e7eb'">
                        </div>
                        <div class="user-ms-list" style="overflow-y:auto;max-height:190px;padding:0.25rem;">
                            ${sortedUsers.map(user => {
                                const roleIcon = user.role === 'owner' ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg> ' : user.role === 'manager' ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ' : '';
                                return `<label class="user-ms-item" data-name="${esc((user.name || user.email).toLowerCase())}" 
                                                style="display:flex;align-items:center;gap:0.5rem;padding:0.45rem 0.6rem;cursor:pointer;border-radius:6px;font-size:0.84rem;transition:background 0.1s;" 
                                                onmouseover="if(!this.querySelector('input').checked)this.style.background='#f9fafb'" 
                                                onmouseout="if(!this.querySelector('input').checked)this.style.background=''">
                                    <input type="checkbox" name="notifyUser" value="${esc(user.id)}" 
                                           style="width:16px;height:16px;accent-color:#22c55e;flex-shrink:0;" 
                                           onchange="onUserMultiSelectChange('${uid}','taskNotifyUsers')">
                                    <span>${roleIcon}${esc(user.name || user.email)}</span>
                                </label>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
            refreshIcons();
        }
        
        function updateNotifyCheckboxStyle(checkbox) {
            const label = checkbox.closest('.notify-user-checkbox');
            if (label) {
                label.style.background = checkbox.checked ? '#f0fdf4' : 'white';
                label.style.borderColor = checkbox.checked ? '#22c55e' : '#e5e7eb';
            }
        }
        
        // Встановлюємо вибрані чекбокси
        function setNotifyUsersCheckboxes(userIds) {
            const container = document.getElementById('taskNotifyUsers');
            if (!container) return;
            
            container.querySelectorAll('input[name="notifyUser"]').forEach(cb => {
                cb.checked = userIds.includes(cb.value);
                const item = cb.closest('.user-ms-item');
                if (item) item.style.background = cb.checked ? '#f0fdf4' : '';
            });
            // Update label
            onUserMultiSelectChange('taskNotifyUsers_ms', 'taskNotifyUsers');
        }
        
        // Отримуємо вибраних користувачів
        function getNotifyUsersFromCheckboxes() {
            const container = document.getElementById('taskNotifyUsers');
            if (!container) return [];
            
            return Array.from(container.querySelectorAll('input[name="notifyUser"]:checked'))
                .map(cb => cb.value);
        }
