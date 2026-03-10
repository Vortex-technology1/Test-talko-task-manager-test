// =====================
        // CALENDAR QUICK ACTIONS
        // =====================
        
        // Open task form with pre-filled date and time
'use strict';
        function openTaskAtTime(dateStr, hour) {
            editingId = null;
            document.getElementById('taskModalTitle').textContent = t('addTask');
            document.getElementById('taskForm').reset();
            
            // Pre-fill date and time
            document.getElementById('taskDeadlineDate').value = dateStr;
            document.getElementById('taskDeadlineTime').value = hour.toString().padStart(2, '0') + ':00';
            document.getElementById('taskStatus').value = 'new';
            
            // Reset assignee and function
            document.getElementById('taskAssignee').value = '';
            document.getElementById('taskFunction').value = '';
            
            document.getElementById('taskModal').style.display = 'flex';
            refreshIcons();
        }
        
        // Quick menu for task actions
        let activeQuickMenu = null;
        let activeOverlay = null;
        
        function showTaskQuickMenu(event, taskId) {
            event.stopPropagation();
            
            // Close existing menu
            closeTaskQuickMenu();
            
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;
            
            const isMobile = window.innerWidth <= 767;
            
            // Get deadline info
            const deadline = task.deadline?.toDate ? task.deadline.toDate() : new Date(task.deadline);
            const deadlineStr = deadline.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            const assignee = task.assigneeName || t('notAssigned');
            const funcName = task.function || '';
            
            // Status colors
            const statusColors = {
                'new': '#3b82f6',
                'progress': '#f59e0b', 
                'review': '#8b5cf6',
                'done': '#10b981'
            };
            const statusColor = statusColors[task.status] || '#6b7280';
            
            // Create overlay for mobile
            if (isMobile) {
                const overlay = document.createElement('div');
                overlay.className = 'task-bottom-sheet-overlay';
                overlay.onclick = closeTaskQuickMenu;
                document.body.appendChild(overlay);
                activeOverlay = overlay;
            }
            
            // Create menu
            const menu = document.createElement('div');
            menu.className = 'task-quick-menu';
            menu.id = 'taskQuickMenu';
            menu.innerHTML = `
                <div class="task-quick-menu-header">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:12px;height:12px;border-radius:50%;background:${statusColor};flex-shrink:0;"></div>
                        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;">${esc(task.title)}</span>
                    </div>
                    ${isMobile ? `<div style="font-size:0.85rem;color:#888;margin-top:6px;font-weight:400;">
                        ${deadlineStr}${funcName ? ' • ' + esc(funcName) : ''}
                    </div>` : ''}
                </div>
                <div class="task-quick-menu-item" onclick="openTaskModal('${taskId}');closeTaskQuickMenu();">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ${t('viewBtn')}
                </div>
                ${(currentUserData?.role !== 'employee' || task.assigneeId === currentUser?.uid || task.creatorId === currentUser?.uid) ? `
                <div class="task-quick-menu-item" onclick="openTaskModal('${taskId}');closeTaskQuickMenu();">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    ${t('editBtn')}
                </div>
                ` : ''}
                ${task.status === 'review' && task.creatorId === currentUser?.uid && task.assigneeId !== currentUser?.uid ? `
                <div class="task-quick-menu-item complete" onclick="acceptReviewTask('${taskId}');closeTaskQuickMenu();">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    ${t('acceptTask')}
                </div>
                <div class="task-quick-menu-item" onclick="rejectReviewTask('${taskId}');closeTaskQuickMenu();" style="color:#f59e0b;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    ${t('rejectTask')}
                </div>
                ` : task.status !== 'done' && task.status !== 'review' ? `
                <div class="task-quick-menu-item complete" onclick="quickCompleteFromMenu('${taskId}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    ${t('completeTask')}
                </div>
                ` : task.status === 'done' ? `
                <div class="task-quick-menu-item" onclick="reopenTaskFromMenu('${taskId}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    ${t('reopen')}
                </div>
                ` : task.status === 'review' ? `
                <div class="task-quick-menu-item" style="color:#8b5cf6;cursor:default;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ${t('reviewByCreator')}
                </div>
                ` : ''}
                <div class="task-quick-menu-item delete" onclick="deleteTaskFromMenu('${taskId}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    ${t('delete')}
                </div>
            `;
            
            // Position menu (only for desktop)
            if (!isMobile) {
                const rect = event.target.closest('.calendar-event, .calendar-allday-event').getBoundingClientRect();
                menu.style.position = 'fixed';
                menu.style.left = Math.min(rect.left, window.innerWidth - 220) + 'px';
                menu.style.visibility = 'hidden';
                document.body.appendChild(menu);
                
                const menuH = menu.offsetHeight;
                const spaceBelow = window.innerHeight - rect.bottom - 10;
                const spaceAbove = rect.top - 10;
                
                if (spaceBelow >= menuH) {
                    // Show below
                    menu.style.top = (rect.bottom + 5) + 'px';
                } else if (spaceAbove >= menuH) {
                    // Show above
                    menu.style.top = (rect.top - menuH - 5) + 'px';
                } else {
                    // Not enough space either way — center vertically
                    menu.style.top = Math.max(10, (window.innerHeight - menuH) / 2) + 'px';
                }
                menu.style.visibility = 'visible';
            } else {
                document.body.appendChild(menu);
            }
            activeQuickMenu = menu;
            
            // Close on click outside (desktop only)
            if (!isMobile) {
                setTimeout(() => {
                    document.addEventListener('click', closeTaskQuickMenu);
                }, 10);
            }
        }
        
        function closeTaskQuickMenu() {
            if (activeOverlay) {
                activeOverlay.remove();
                activeOverlay = null;
            }
            if (activeQuickMenu) {
                activeQuickMenu.remove();
                activeQuickMenu = null;
            }
            document.removeEventListener('click', closeTaskQuickMenu);
        }
        
        async function quickCompleteFromMenu(taskId) {
            closeTaskQuickMenu();
            quickCompleteTask(taskId);
        }
        
        async function reopenTaskFromMenu(taskId) {
            closeTaskQuickMenu();
            reopenTask(taskId);
        }
        
        async function deleteTaskFromMenu(taskId) {
            closeTaskQuickMenu();
            // Unified: use deleteTask which has optimistic UI + undo toast
            deleteTask(taskId);
        }
        
        // Drag and drop
        let draggedTaskId = null;
        
        function onTaskDragStart(event, taskId) {
            draggedTaskId = taskId;
            event.dataTransfer.effectAllowed = 'move';
            event.target.style.opacity = '0.5';
        }
        
        function onTaskDragEnd(event) {
            event.target.style.opacity = '1';
            draggedTaskId = null;
        }
        
        function onHourDragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            event.target.classList.add('drag-over');
        }
        
        function onHourDragLeave(event) {
            event.target.classList.remove('drag-over');
        }
        
        async function onHourDrop(event, dateStr, hour) {
            event.preventDefault();
            event.target.classList.remove('drag-over');
            
            if (!draggedTaskId) return;
            
            const task = tasks.find(t => t.id === draggedTaskId);
            if (!task) return;
            
            // Get minutes from original time if available
            const oldDeadline = task.deadline?.toDate ? task.deadline.toDate() : new Date(task.deadline);
            const minutes = oldDeadline ? oldDeadline.getMinutes() : 0;
            
            const newTime = hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
            const newDeadline = dateStr + 'T' + newTime;
            
            // Update task
            await db.collection('companies').doc(currentCompany).collection('tasks').doc(draggedTaskId).update({
                deadlineDate: dateStr,
                deadlineTime: newTime,
                deadline: newDeadline,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            // AUDIT LOG — deadline change via drag
            const dragTask = tasks.find(t => t.id === draggedTaskId);
            logTaskChange(draggedTaskId, 'deadline', { deadlineDate: dateStr, deadlineTime: newTime }, { deadlineDate: dragTask?.deadlineDate, deadlineTime: dragTask?.deadlineTime });
            
            // Update Google Calendar
            if (task.calendarEventId && googleAccessToken) {
                updateCalendarEvent(task.calendarEventId, { ...task, deadlineDate: dateStr, deadlineTime: newTime }).catch(err => 
                    console.warn('[Calendar] Update sync failed:', err)
                );
            }
            
            // Локальне оновлення
            task.deadlineDate = dateStr;
            task.deadlineTime = newTime;
            task.deadline = dateStr + 'T' + newTime;
            
            draggedTaskId = null;
            renderMyDay();
            refreshCurrentView();
        }
