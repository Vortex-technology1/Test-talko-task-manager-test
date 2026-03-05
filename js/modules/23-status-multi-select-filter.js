// =====================
        // STATUS MULTI-SELECT FILTER
        // =====================
        function toggleStatusDropdown(e) {
            e.stopPropagation();
            const dd = document.getElementById('statusDropdown');
            const toggle = dd.previousElementSibling;
            const isOpen = dd.classList.contains('show');
            closeStatusDropdown();
            if (!isOpen) {
                dd.classList.add('show');
                toggle.classList.add('open');
            }
        }
        
        function closeStatusDropdown() {
            const dd = document.getElementById('statusDropdown');
            if (dd) {
                dd.classList.remove('show');
                dd.previousElementSibling.classList.remove('open');
            }
        }
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.status-multiselect')) {
                closeStatusDropdown();
            }
        });
        
        function getSelectedStatuses() {
            const checks = document.querySelectorAll('#statusDropdown .status-multiselect-item:not(.status-multiselect-all) input[type="checkbox"]');
            const selected = [];
            checks.forEach(cb => { if (cb.checked) selected.push(cb.value); });
            return selected;
        }
        
        function onStatusCheckChange() {
            const checks = document.querySelectorAll('#statusDropdown .status-multiselect-item:not(.status-multiselect-all) input[type="checkbox"]');
            const allCb = document.getElementById('statusAll');
            const total = checks.length;
            const checked = [...checks].filter(cb => cb.checked).length;
            allCb.checked = (checked === total);
            allCb.indeterminate = (checked > 0 && checked < total);
            updateStatusFilterLabel();
            refreshCurrentView();
        }
        
        function toggleAllStatuses(e) {
            e.preventDefault();
            const allCb = document.getElementById('statusAll');
            const checks = document.querySelectorAll('#statusDropdown .status-multiselect-item:not(.status-multiselect-all) input[type="checkbox"]');
            // If all checked -> uncheck all; otherwise check all
            const allChecked = [...checks].every(cb => cb.checked);
            const newState = !allChecked;
            checks.forEach(cb => cb.checked = newState);
            allCb.checked = newState;
            allCb.indeterminate = false;
            updateStatusFilterLabel();
            refreshCurrentView();
        }
        
        function updateStatusFilterLabel() {
            const label = document.getElementById('statusFilterLabel');
            const toggle = label.closest('.status-multiselect-toggle');
            const selected = getSelectedStatuses();
            const statusNames = { new: t('statusPluralNew'), progress: t('statusPluralProgress'), review: t('statusPluralReview'), done: t('statusPluralDone') };
            
            // Remove old count badge
            const oldBadge = toggle.querySelector('.status-multiselect-count');
            if (oldBadge) oldBadge.remove();
            
            if (selected.length === 0 || selected.length === 4) {
                label.textContent = t('statusesLabel');
                label.classList.add('placeholder');
            } else if (selected.length === 1) {
                label.textContent = statusNames[selected[0]] || selected[0];
                label.classList.remove('placeholder');
            } else {
                label.textContent = selected.map(s => statusNames[s]).join(', ');
                label.classList.remove('placeholder');
                // Add count badge
                const badge = document.createElement('span');
                badge.className = 'status-multiselect-count';
                badge.textContent = selected.length;
                toggle.insertBefore(badge, toggle.querySelector('.status-multiselect-arrow'));
            }
        }
        
        function setStatusFilterFromArray(arr) {
            const checks = document.querySelectorAll('#statusDropdown .status-multiselect-item:not(.status-multiselect-all) input[type="checkbox"]');
            const allCb = document.getElementById('statusAll');
            if (!arr || arr.length === 0) {
                checks.forEach(cb => cb.checked = false);
                allCb.checked = false;
                allCb.indeterminate = false;
            } else {
                checks.forEach(cb => cb.checked = arr.includes(cb.value));
                const checked = [...checks].filter(cb => cb.checked).length;
                allCb.checked = (checked === checks.length);
                allCb.indeterminate = (checked > 0 && checked < checks.length);
            }
            updateStatusFilterLabel();
        }
        
        function renderTasks() {
            // If kanban view is active, render kanban instead
            if (currentCalendarView === 'kanban' || currentCalendarView === 'deadlines') {
                renderKanbanBoard(currentCalendarView);
                return;
            }
            tasksVisibleCount = TASKS_PAGE_SIZE; // Reset pagination on filter change
            const c = document.getElementById('tasksContainer');
            const selectedStatuses = getSelectedStatuses();
            const ff = document.getElementById('functionFilter')?.value;
            const af = document.getElementById('assigneeFilter')?.value;
            const df = document.getElementById('dateFilter')?.value;
            const tf = document.getElementById('taskTypeFilter')?.value;
            const searchQuery = (document.getElementById('taskSearchInput')?.value || '').toLowerCase().trim();
            
            const today = getLocalDateStr();
            
            let f = tasks.filter(task => {
                if (!isTaskVisibleToUser(task)) return false;
                if (hideCompletedTasks && task.status === 'done') return false;
                if (selectedStatuses.length > 0 && !selectedStatuses.includes(task.status)) return false;
                if (ff && task.function !== ff) return false;
                if (af && task.assigneeId !== af) return false;
                if (tf === 'my' && task.assigneeId !== currentUser.uid) return false;
                if (tf === 'created' && task.creatorId !== currentUser.uid) return false;
                if (searchQuery && !(task.title || '').toLowerCase().includes(searchQuery) && 
                    !(task.description || '').toLowerCase().includes(searchQuery) &&
                    !(task.assigneeName || '').toLowerCase().includes(searchQuery)) return false;
                
                const taskDate = parseDeadline(task).date;
                
                if (df === 'today' && taskDate !== today) return false;
                if (df === 'overdue') {
                    if (taskDate >= today || task.status === 'done') return false;
                }
                if (df === 'week') {
                    const weekLater = new Date();
                    weekLater.setDate(weekLater.getDate() + 7);
                    if (taskDate > getLocalDateStr(weekLater) || taskDate < today) return false;
                }
                if (df === 'month') {
                    const monthLater = new Date();
                    monthLater.setMonth(monthLater.getMonth() + 1);
                    if (taskDate > getLocalDateStr(monthLater) || taskDate < today) return false;
                }
                if (df === 'custom') {
                    const dateFrom = document.getElementById('dateFrom')?.value;
                    const dateTo = document.getElementById('dateTo')?.value;
                    if (dateFrom && taskDate < dateFrom) return false;
                    if (dateTo && taskDate > dateTo) return false;
                }
                return true;
            });
            
            f.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                
                // Custom sort
                if (taskSortField) {
                    let valA, valB;
                    const statusOrder = { new: 0, progress: 1, review: 2, done: 3 };
                    switch(taskSortField) {
                        case 'title': valA = (a.title || '').toLowerCase(); valB = (b.title || '').toLowerCase(); break;
                        case 'assignee': valA = (a.assigneeName || '').toLowerCase(); valB = (b.assigneeName || '').toLowerCase(); break;
                        case 'creator': valA = (a.creatorName || '').toLowerCase(); valB = (b.creatorName || '').toLowerCase(); break;
                        case 'deadline': valA = a.deadlineDate || '9999'; valB = b.deadlineDate || '9999'; break;
                        case 'status': 
                            valA = statusOrder[a.status] ?? 9; valB = statusOrder[b.status] ?? 9; break;
                        case 'function': valA = (a.function || '').toLowerCase(); valB = (b.function || '').toLowerCase(); break;
                        default: valA = a.deadlineDate || '9999'; valB = b.deadlineDate || '9999';
                    }
                    const cmp = typeof valA === 'number' ? valA - valB : String(valA).localeCompare(String(valB));
                    return taskSortDir === 'desc' ? -cmp : cmp;
                }
                
                const dateA = parseDeadline(a).date || '9999';
                const dateB = parseDeadline(b).date || '9999';
                return dateA.localeCompare(dateB);
            });
            
            // Рахуємо загальний час
            let totalMinutes = 0;
            f.filter(task => task.status !== 'done').forEach(task => {
                if (task.estimatedTime) totalMinutes += parseInt(task.estimatedTime);
            });
            const totalHours = Math.floor(totalMinutes / 60);
            const totalMins = totalMinutes % 60;
            const totalTimeStr = totalMinutes > 0 ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${totalHours > 0 ? totalHours + (t('hourShort')) : ''}${totalMins > 0 ? totalMins + (t('minShort')) : ''}` : '';
            
            document.getElementById('totalTimeInfo').innerHTML = totalTimeStr ? `<span class="total-time-badge">${totalTimeStr} (${f.filter(x=>x.status!=='done').length} ${t('tasks')})</span>` : '';
            
            if (f.length === 0) {
                const hasFilters = selectedStatuses.length > 0 || ff || af || df || tf || (document.getElementById('taskSearchInput')?.value || '').trim();
                const isEmptyAll = tasks.filter(t => isTaskVisibleToUser(t)).length === 0;
                if (isEmptyAll) {
                    c.innerHTML = `<div class="empty-table" style="text-align:center;padding:3rem 1rem;">
                        <div style="margin-bottom:0.75rem;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg></div>
                        <h3 style="margin-bottom:0.5rem;">${t('noTasks') || 'Задач ще немає'}</h3>
                        <p style="color:#6b7280;margin-bottom:1rem;">${t('createFirstTask') || 'Створіть першу задачу для команди'}</p>
                        <button class="btn btn-success" onclick="openTaskModal()">+ ${t('newTask') || 'Нова задача'}</button>
                    </div>`;
                } else {
                    c.innerHTML = `<div class="empty-table"><h3>${t('noTasksFound') || 'Нічого не знайдено'}</h3><p>${t('changeFilters') || 'Спробуйте змінити фільтри'}</p></div>`;
                }
                return;
            }
            
            const st = { new: t('statusNew'), progress: t('statusProgress'), review: t('statusReview'), done: t('statusDone') };
            
            // Desktop table
            const sortIcon = (field) => {
                if (taskSortField !== field) return '<span class="sort-icon">⇅</span>';
                return `<span class="sort-icon">${taskSortDir === 'asc' ? '↑' : '↓'}</span>`;
            };
            const sortClass = (field) => taskSortField === field ? 'sortable sort-active' : 'sortable';
            
            let html = `
                <table class="tasks-table" style="table-layout:fixed;">
                    <thead>
                        <tr>
                            <th class="${sortClass('title')}" onclick="sortTasksBy('title')">${t('task')}${sortIcon('title')}<div class="col-resize-handle"></div></th>
                            <th class="${sortClass('assignee')}" onclick="sortTasksBy('assignee')">${t('assignee')}${sortIcon('assignee')}<div class="col-resize-handle"></div></th>
                            <th class="${sortClass('creator')}" onclick="sortTasksBy('creator')">${t('createdBy')}${sortIcon('creator')}<div class="col-resize-handle"></div></th>
                            <th class="${sortClass('deadline')}" onclick="sortTasksBy('deadline')">${t('deadline')}${sortIcon('deadline')}<div class="col-resize-handle"></div></th>
                            <th class="${sortClass('status')}" onclick="sortTasksBy('status')">${t('status')}${sortIcon('status')}<div class="col-resize-handle"></div></th>
                            <th class="${sortClass('function')}" onclick="sortTasksBy('function')">${t('type')}${sortIcon('function')}<div class="col-resize-handle"></div></th>
                            <th>${t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            f.forEach(task => {
                const { date: taskDeadline, time: taskTime } = parseDeadline(task);
                const od = taskDeadline && taskDeadline < today && task.status !== 'done' && task.status !== 'review';
                const isToday = taskDeadline === today;
                const deadlineClass = od ? 'overdue' : (isToday ? 'today' : '');
                
                // Індикатор процесу
                const processIndicator = task.processId ? `<i data-lucide="git-branch" class="icon icon-sm" style="color:#8b5cf6;" title="${t('taskFromProcess')}"></i> ` : '';
                
                html += `
                    <tr>
                        <td class="task-title-cell">
                            <span class="task-title-text ${task.pinned ? 'pinned' : ''}" onclick="openTaskModal('${escId(task.id)}')">${task.pinned ? '<i data-lucide="pin" class="icon icon-sm" style="color:#e74c3c"></i> ' : ''}${processIndicator}${esc(task.title)}</span>
                        </td>
                        <td>${esc(task.assigneeName) || '-'}</td>
                        <td>${esc(task.creatorName) || '-'}</td>
                        <td class="deadline-text ${deadlineClass}" onclick="inlineEditDeadline(event, '${escId(task.id)}', '${task.deadlineDate || ''}')" style="cursor:pointer;" title="${t('clickToChangeDate')}">${taskDeadline ? formatDateShort(taskDeadline) : '-'}${task.timeEnd ? ' ' + task.timeEnd : ''}</td>
                        <td><span class="status-badge status-${task.status}" style="cursor:pointer;" onclick="cycleTaskStatus('${escId(task.id)}',event)">${st[task.status] || task.status}</span></td>
                        <td>${esc(task.function) || '-'}</td>
                        <td>
                            <div class="action-btns">
                                ${task.status === 'review' && task.creatorId === currentUser?.uid && task.assigneeId !== currentUser?.uid ? `
                                    <button class="action-btn" onclick="acceptReviewTask('${escId(task.id)}')" title="${t('acceptTask')}" style="color:#22c55e;"><i data-lucide="check-circle" class="icon icon-sm"></i></button>
                                    <button class="action-btn" onclick="rejectReviewTask('${escId(task.id)}')" title="${t('rejectTask')}" style="color:#f59e0b;"><i data-lucide="rotate-ccw" class="icon icon-sm"></i></button>
                                ` : ''}
                                <button class="action-btn" onclick="togglePin('${escId(task.id)}')" title="${t('pin')}"><i data-lucide="pin" class="icon icon-sm"></i></button>
                                <button class="action-btn" onclick="openTaskModal('${escId(task.id)}')" title="${t('edit')}"><i data-lucide="pencil" class="icon icon-sm"></i></button>
                                <button class="action-btn" onclick="deleteTask('${escId(task.id)}')" title="${t('delete')}"><i data-lucide="trash-2" class="icon icon-sm"></i></button>
                            </div>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table>`;
            
            // Mobile cards with swipe support and date grouping
            html += `<div class="mobile-tasks-list" id="mobileTasksList">`;
            
            // Group tasks by date
            const groups = {
                overdue: [],
                today: [],
                tomorrow: [],
                thisWeek: [],
                later: [],
                noDueDate: []
            };
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = getLocalDateStr(tomorrow);
            
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() + 7);
            const weekEndStr = getLocalDateStr(weekEnd);
            
            f.forEach(task => {
                const taskDeadline = parseDeadline(task).date;
                
                if (!taskDeadline) {
                    groups.noDueDate.push(task);
                } else if (taskDeadline < today && task.status !== 'done' && task.status !== 'review') {
                    groups.overdue.push(task);
                } else if (taskDeadline === today) {
                    groups.today.push(task);
                } else if (taskDeadline === tomorrowStr) {
                    groups.tomorrow.push(task);
                } else if (taskDeadline <= weekEndStr) {
                    groups.thisWeek.push(task);
                } else {
                    groups.later.push(task);
                }
            });
            
            const groupLabels = {
                overdue: { label: t('overdueLabel2'), class: 'overdue' },
                today: { label: t('todayLabel'), class: 'today' },
                tomorrow: { label: t('tomorrowLabel'), class: 'tomorrow' },
                thisWeek: { label: t('thisWeekLabel'), class: '' },
                later: { label: t('laterLabel'), class: '' },
                noDueDate: { label: t('noDateLabel'), class: '' }
            };
            
            Object.keys(groups).forEach(groupKey => {
                const group = groups[groupKey];
                if (group.length === 0) return;
                
                const { label, class: headerClass } = groupLabels[groupKey];
                
                html += `
                <div class="date-group-header ${headerClass}">
                    <span class="date-label">${label}</span>
                    <span class="task-count">${group.length}</span>
                </div>`;
                
                group.forEach(task => {
                    const { date: taskDeadline, time: taskTime } = parseDeadline(task);
                    const od = taskDeadline && taskDeadline < today && task.status !== 'done' && task.status !== 'review';
                    const isToday = taskDeadline === today;
                    const deadlineClass = od ? 'deadline-overdue' : (isToday ? 'deadline-today' : '');
                    const cardClass = od ? 'overdue' : (task.pinned ? 'pinned' : `status-${task.status}`);
                    const canSwipeComplete = task.status !== 'done' && task.status !== 'review';
                    const isReviewForCreator = task.status === 'review' && task.creatorId === currentUser?.uid && task.assigneeId !== currentUser?.uid;
                    
                    html += `
                    <div class="mobile-task-card ${cardClass}" data-task-id="${task.id}" data-can-complete="${canSwipeComplete}">
                        <!-- Swipe backgrounds -->
                        <div class="swipe-action-bg left"><i data-lucide="check" class="icon"></i> ${t('statusDone')}</div>
                        <div class="swipe-action-bg right"><i data-lucide="trash-2" class="icon"></i> ${t('delete')}</div>
                        
                        <!-- Card content -->
                        <div class="mobile-task-content" onclick="openTaskModal('${escId(task.id)}')">
                            <div class="mobile-task-header">
                                <div class="mobile-task-title ${task.status === 'done' ? 'mobile-task-title-done' : ''}">
                                    ${task.pinned ? '<i data-lucide="pin" class="icon icon-sm" style="color:#e74c3c;width:14px;height:14px;"></i> ' : ''}${esc(task.title)}
                                </div>
                                ${(() => {
                                    if (!taskDeadline) return '';
                                    if (od) {
                                        const daysAgo = Math.floor((new Date(today) - new Date(taskDeadline)) / 86400000);
                                        const label = daysAgo === 1 ? '1 день тому' : daysAgo < 5 ? daysAgo + ' дні тому' : daysAgo + ' днів тому';
                                        return `<span class="mobile-task-deadline-badge overdue">${label}</span>`;
                                    }
                                    if (isToday) return `<span class="mobile-task-deadline-badge today">${task.timeEnd || t('today')}</span>`;
                                    // Format date compactly
                                    const dp = taskDeadline.split('-');
                                    const dayNum = parseInt(dp[2]);
                                    const monthShort = (typeof getMonthNames === 'function' ? getMonthNames() : ['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'])[parseInt(dp[1]) - 1];
                                    return `<span class="mobile-task-deadline-badge upcoming">${dayNum} ${monthShort}</span>`;
                                })()}
                            </div>
                            
                            <div class="mobile-task-meta">
                                ${(() => {
                                    // Аватар з ініціалами
                                    const name = task.assigneeName || '';
                                    const initials = name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || '?';
                                    const colors = ['#3b82f6','#ef4444','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#22c55e','#f97316'];
                                    const colorIdx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
                                    return `<div class="mobile-task-avatar" style="background:${colors[colorIdx]}">${initials}</div>`;
                                })()}
                                <span>${esc(task.assigneeName || '')}</span>
                                ${task.status !== 'done' ? `
                                    <span class="mobile-task-meta-sep">•</span>
                                    <span class="status-badge status-${task.status}" style="font-size:0.7rem;padding:0.1rem 0.4rem;cursor:pointer;" onclick="event.stopPropagation();cycleTaskStatus('${escId(task.id)}',event)">${st[task.status] || task.status}</span>
                                ` : ''}
                                ${task.function ? `<span class="mobile-task-meta-sep">•</span><span>${esc(task.function)}</span>` : ''}
                            </div>
                            
                            ${(() => {
                                // Badges: чеклист, коментарі, файли, співвиконавці
                                const badges = [];
                                const checklist = task.checklist || [];
                                if (checklist.length > 0) {
                                    const done = checklist.filter(c => c.checked).length;
                                    const cls = done === checklist.length ? 'has-items' : '';
                                    badges.push(`<span class="mobile-badge ${cls}"><i data-lucide="list-checks" class="icon"></i> ${done}/${checklist.length}</span>`);
                                }
                                const commentCount = task.commentCount || 0;
                                if (commentCount > 0) {
                                    badges.push(`<span class="mobile-badge has-items"><i data-lucide="message-circle" class="icon"></i> ${commentCount}</span>`);
                                }
                                const files = task.files || [];
                                if (files.length > 0) {
                                    badges.push(`<span class="mobile-badge has-items"><i data-lucide="paperclip" class="icon"></i> ${files.length}</span>`);
                                }
                                if (task.coExecutorIds?.length > 0) {
                                    badges.push(`<span class="mobile-badge"><i data-lucide="users" class="icon"></i> +${task.coExecutorIds.length}</span>`);
                                }
                                return badges.length > 0 ? `<div class="mobile-task-badges">${badges.join('')}</div>` : '';
                            })()}
                            
                            <div class="mobile-task-actions" onclick="event.stopPropagation()">
                                ${isReviewForCreator ? `
                                    <button class="mobile-action-btn complete" onclick="acceptReviewTask('${escId(task.id)}')" style="background:#22c55e;color:white;">
                                        <i data-lucide="check" class="icon icon-sm"></i> ${t('acceptTask')}
                                    </button>
                                    <button class="mobile-action-btn edit" onclick="rejectReviewTask('${escId(task.id)}')" style="background:#f59e0b;color:white;">
                                        <i data-lucide="rotate-ccw" class="icon icon-sm"></i> ${t('rejectTask')}
                                    </button>
                                ` : task.status === 'review' ? `
                                    <button class="mobile-action-btn edit" style="opacity:0.6;cursor:default;">
                                        <i data-lucide="eye" class="icon icon-sm"></i> ${t('reviewLabel')}
                                    </button>
                                ` : task.status !== 'done' ? `
                                    <button class="mobile-action-btn complete" onclick="quickCompleteTask('${escId(task.id)}')">
                                        <i data-lucide="check" class="icon icon-sm"></i> ${t('statusDone')}
                                    </button>
                                ` : `
                                    <button class="mobile-action-btn edit" onclick="reopenTask('${escId(task.id)}')">
                                        <i data-lucide="rotate-ccw" class="icon icon-sm"></i> ${t('reopen')}
                                    </button>
                                `}
                                <button class="mobile-action-btn edit" onclick="openTaskModal('${escId(task.id)}')">
                                    <i data-lucide="pencil" class="icon icon-sm"></i>
                                </button>
                                <button class="mobile-action-btn delete" onclick="showConfirmModal(t('deleteConfirm'),{danger:true}).then(ok=>ok&&deleteTask('${escId(task.id)}'))">
                                    <i data-lucide="trash-2" class="icon icon-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
                });
            });
            
            html += `</div>`;
            c.innerHTML = html;
            
            // Pagination: show only first TASKS_PAGE_SIZE tasks, add "Load More"
            applyTasksPagination();
            
            refreshIcons();
            initSwipeHandlers();
            initTableColumnResize();
            restoreColumnWidths();
            updateOverdueBadge();
            
            // Infinite scroll для автопідвантаження
            setTimeout(initInfiniteScroll, 100);
        }
        
        // === TASKS PAGINATION ===
        const TASKS_PAGE_SIZE = 50;
        let tasksVisibleCount = TASKS_PAGE_SIZE;
        
        function applyTasksPagination() {
            // Desktop table rows
            const tableRows = document.querySelectorAll('.tasks-table tbody tr');
            if (tableRows.length > 0) {
                tableRows.forEach((row, i) => {
                    row.style.display = i < tasksVisibleCount ? '' : 'none';
                });
                
                // Remove old "load more" button if exists
                const oldBtn = document.getElementById('loadMoreTasksBtn');
                if (oldBtn) oldBtn.remove();
                
                if (tableRows.length > tasksVisibleCount) {
                    const loadMoreHTML = `<div id="loadMoreTasksBtn" style="text-align:center;padding:1rem;">
                        <button class="btn btn-small" onclick="loadMoreTasks()" style="padding:0.6rem 2rem;">
                            ${t('showMore')} (${tasksVisibleCount}/${tableRows.length})
                        </button>
                    </div>`;
                    document.querySelector('.tasks-table')?.insertAdjacentHTML('afterend', loadMoreHTML);
                }
            }
            
            // Mobile cards with proper date group header visibility
            const mobileList = document.getElementById('mobileTasksList');
            if (mobileList) {
                const mobileCards = mobileList.querySelectorAll('.mobile-task-card');
                const dateHeaders = mobileList.querySelectorAll('.date-group-header');
                
                if (mobileCards.length > 0) {
                    let visibleMobile = 0;
                    mobileCards.forEach(card => {
                        if (visibleMobile < tasksVisibleCount) {
                            card.style.display = '';
                            visibleMobile++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Hide date group headers where ALL cards in that group are hidden
                    dateHeaders.forEach(header => {
                        let nextEl = header.nextElementSibling;
                        let hasVisibleCard = false;
                        while (nextEl && !nextEl.classList.contains('date-group-header')) {
                            if (nextEl.classList.contains('mobile-task-card') && nextEl.style.display !== 'none') {
                                hasVisibleCard = true;
                                break;
                            }
                            nextEl = nextEl.nextElementSibling;
                        }
                        header.style.display = hasVisibleCard ? '' : 'none';
                    });
                    
                    const oldMobileBtn = document.getElementById('loadMoreTasksMobileBtn');
                    if (oldMobileBtn) oldMobileBtn.remove();
                    
                    if (mobileCards.length > tasksVisibleCount) {
                        mobileList.insertAdjacentHTML('beforeend', `<div id="loadMoreTasksMobileBtn" style="text-align:center;padding:1rem;">
                            <button class="btn btn-small" onclick="loadMoreTasks()" style="padding:0.6rem 2rem;width:100%;">
                                ${t('showMore')} (${tasksVisibleCount}/${mobileCards.length})
                            </button>
                        </div>`);
                    }
                }
            }
        }
        
        function loadMoreTasks() {
            tasksVisibleCount += TASKS_PAGE_SIZE;
            applyTasksPagination();
            refreshIcons();
            initSwipeHandlers();
        }
        
        // Infinite scroll — автоматичне підвантаження при скролі
        let infiniteScrollObserver = null;
        let infiniteScrollCooldown = false;
        
        function initInfiniteScroll() {
            if (infiniteScrollObserver) infiniteScrollObserver.disconnect();
            
            const sentinel = document.getElementById('loadMoreTasksMobileBtn') || document.getElementById('loadMoreTasksBtn');
            if (!sentinel) return;
            
            infiniteScrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !infiniteScrollCooldown) {
                        infiniteScrollCooldown = true;
                        loadMoreTasks();
                        // Cooldown + переініціалізація на новий sentinel
                        setTimeout(() => {
                            infiniteScrollCooldown = false;
                            initInfiniteScroll();
                        }, 300);
                    }
                });
            }, { rootMargin: '200px' });
            
            infiniteScrollObserver.observe(sentinel);
        }
