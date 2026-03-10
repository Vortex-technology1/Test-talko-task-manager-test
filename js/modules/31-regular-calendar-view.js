// =====================
        // REGULAR CALENDAR VIEW
        // =====================
        
'use strict';
        let currentRegularView = 'week'; // week, list
        
        function setRegularView(view) {
            currentRegularView = view;
            
            // Update buttons
            document.querySelectorAll('#regularCalendarHeader .calendar-view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === view);
            });
            
            // Show/hide containers
            const calendarContainer = document.getElementById('regularCalendarContainer');
            const listContainer = document.getElementById('regularListContainer');
            
            if (view === 'list') {
                calendarContainer.classList.remove('active');
                calendarContainer.style.display = 'none';
                listContainer.classList.add('active');
                listContainer.style.display = 'block';
                renderRegularTasks();
            } else {
                calendarContainer.classList.add('active');
                calendarContainer.style.display = 'block';
                listContainer.classList.remove('active');
                listContainer.style.display = 'none';
                renderRegularWeekView();
            }
            
            localStorage.setItem('regularView', view);
        }
        
        function renderRegularWeekView() {
            const headerEl = document.getElementById('regularWeekHeader');
            const bodyEl = document.getElementById('regularWeekBody');
            
            const todayJS = new Date().getDay(); // 0 = Sunday
            // Monday-first mapping: display column 0=Mon(1), 1=Tue(2), ..., 5=Sat(6), 6=Sun(0)
            const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // JS getDay() values in Mon-first order
            const dayNamesFullUA = getDayNames(); // index = JS getDay()
            
            // Build header — Monday first
            let headerHTML = '';
            for (let col = 0; col < 7; col++) {
                const jsDay = dayOrder[col];
                const isToday = jsDay === todayJS;
                headerHTML += `
                    <div class="regular-week-day-header ${isToday ? 'today' : ''}">
                        <div class="day-name">${dayNamesFullUA[jsDay]}</div>
                    </div>
                `;
            }
            headerEl.innerHTML = headerHTML;
            
            // Build body with time grid
            let bodyHTML = '';
            const startHour = 6; // 06:00
            const endHour = 22; // 22:00
            const hourHeight = 60; // pixels per hour
            
            for (let col = 0; col < 7; col++) {
                const jsDay = dayOrder[col];
                const isToday = jsDay === todayJS;
                
                // Застосовуємо фільтри
                const ff = document.getElementById('regularFunctionFilter')?.value;
                const af = document.getElementById('regularAssigneeFilter')?.value;
                
                const dayTasks = regularTasks.filter(rt => {
                    // Фільтр по функції
                    if (ff && rt.function !== ff) return false;
                    // Фільтр по виконавцю
                    if (af) {
                        const func = functions.find(f => f.name === rt.function);
                        if (!func?.assigneeIds?.includes(af)) return false;
                    }
                    // Фільтр по дню
                    if (rt.period === 'daily') return true;
                    if (rt.period === 'weekly') {
                        if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) {
                            return rt.daysOfWeek.includes(jsDay.toString());
                        } else if (rt.dayOfWeek) {
                            return rt.dayOfWeek === jsDay.toString();
                        }
                    }
                    return false;
                });
                
                // Calculate overlaps for parallel display
                const tasksWithPosition = calculateTaskPositions(dayTasks, startHour, hourHeight);
                
                bodyHTML += `<div class="regular-day-column ${isToday ? 'today' : ''}" data-day="${jsDay}">`;
                
                // Hour lines
                for (let h = startHour; h < endHour; h++) {
                    bodyHTML += `<div class="hour-line" style="top: ${(h - startHour) * hourHeight}px;"></div>`;
                }
                
                // Task blocks with calculated positions
                tasksWithPosition.forEach(taskPos => {
                    const rt = taskPos.task;
                    const timeStart = rt.timeStart || rt.time || '10:00';
                    const timeEnd = rt.timeEnd || calculateEndTime(timeStart, rt.duration || 60);
                    
                    // Get assignees from function
                    const func = functions.find(f => f.name === rt.function);
                    const assigneeNames = func?.assigneeIds?.map(id => {
                        const user = users.find(u => u.id === id);
                        return user?.name || user?.email?.split('@')[0] || '';
                    }).filter(Boolean) || [];
                    
                    // Status
                    const statusInfo = getRegularTaskStatus(rt);
                    const isCompleted = isToday && statusInfo.completedToday;
                    const isShort = taskPos.height < 50;
                    const isNarrow = taskPos.totalColumns > 1;
                    
                    // Width and left position for parallel tasks
                    const widthPercent = 100 / taskPos.totalColumns;
                    const leftPercent = taskPos.column * widthPercent;
                    
                    bodyHTML += `
                        <div class="regular-task-block ${isCompleted ? 'completed' : ''} ${isShort ? 'short' : ''} ${isNarrow ? 'narrow' : ''}"
                             style="top: ${taskPos.top}px; height: ${taskPos.height}px; left: calc(4px + ${leftPercent}%); width: calc(${widthPercent}% - 8px);"
                             onclick="openRegularTaskModal('${escId(rt.id)}')"
                             title="${esc(rt.title)}\n${timeStart} - ${timeEnd}\n${esc(rt.function) || ''}">
                            <div class="task-time">${timeStart} - ${timeEnd}</div>
                            <div class="task-title">${esc(rt.title)}</div>
                            ${!isShort && !isNarrow && assigneeNames.length > 0 ? `
                                <div class="task-assignee">${assigneeNames.map(n => esc(n)).slice(0, 2).join(', ')}${assigneeNames.length > 2 ? ` +${assigneeNames.length - 2}` : ''}</div>
                            ` : ''}
                            ${!isShort && !isNarrow && rt.function ? `<div class="task-function">${esc(rt.function)}</div>` : ''}
                        </div>
                    `;
                });
                
                bodyHTML += '</div>';
            }
            
            bodyEl.innerHTML = bodyHTML;
            refreshIcons();
            
            // Also update mobile view
            updateRegularDayTabs();
            renderMobileRegularDay();
        }
        
        // Calculate positions for overlapping tasks (like iOS calendar)
        function calculateTaskPositions(dayTasks, startHour, hourHeight) {
            if (!dayTasks.length) return [];
            
            // Convert tasks to time ranges
            const taskRanges = dayTasks.map(rt => {
                const timeStart = rt.timeStart || rt.time || '10:00';
                const [startH, startM] = timeStart.split(':').map(Number);
                const startMinutes = startH * 60 + startM;
                
                let durationMinutes = rt.duration || 60;
                if (rt.timeEnd && !rt.duration) {
                    const [endH, endM] = rt.timeEnd.split(':').map(Number);
                    durationMinutes = (endH * 60 + endM) - startMinutes;
                    if (durationMinutes <= 0) durationMinutes = 60;
                }
                
                const endMinutes = startMinutes + durationMinutes;
                const top = ((startH - startHour) * 60 + startM) * (hourHeight / 60);
                const height = Math.max(durationMinutes * (hourHeight / 60), 25);
                
                return {
                    task: rt,
                    startMinutes,
                    endMinutes,
                    top,
                    height,
                    column: 0,
                    totalColumns: 1
                };
            });
            
            // Sort by start time
            taskRanges.sort((a, b) => a.startMinutes - b.startMinutes);
            
            // Find overlapping groups and assign columns
            const groups = [];
            
            taskRanges.forEach(taskRange => {
                // Find or create a group that this task overlaps with
                let foundGroup = null;
                
                for (const group of groups) {
                    const overlapsWithGroup = group.some(t => 
                        taskRange.startMinutes < t.endMinutes && taskRange.endMinutes > t.startMinutes
                    );
                    
                    if (overlapsWithGroup) {
                        foundGroup = group;
                        break;
                    }
                }
                
                if (foundGroup) {
                    // Find available column
                    const usedColumns = new Set();
                    foundGroup.forEach(t => {
                        if (taskRange.startMinutes < t.endMinutes && taskRange.endMinutes > t.startMinutes) {
                            usedColumns.add(t.column);
                        }
                    });
                    
                    let col = 0;
                    while (usedColumns.has(col)) col++;
                    taskRange.column = col;
                    foundGroup.push(taskRange);
                } else {
                    // New group
                    taskRange.column = 0;
                    groups.push([taskRange]);
                }
            });
            
            // Calculate total columns for each group
            groups.forEach(group => {
                const maxCol = Math.max(...group.map(t => t.column)) + 1;
                group.forEach(t => t.totalColumns = maxCol);
            });
            
            return taskRanges;
        }
        
        function getRegularTaskStatus(rt) {
            const today = new Date();
            const todayDay = today.getDay();
            const todayDateStr = getLocalDateStr(today);
            
            // Check if task should run today
            let shouldRunToday = false;
            
            // Підтримка старого формату daily
            if (rt.period === 'daily') {
                shouldRunToday = true;
            } else if (rt.period === 'weekly') {
                // Підтримка нового формату (масив днів) і старого (один день)
                if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) {
                    shouldRunToday = rt.daysOfWeek.includes(todayDay.toString());
                } else if (rt.dayOfWeek) {
                    shouldRunToday = rt.dayOfWeek === todayDay.toString();
                }
            } else if (rt.period === 'monthly') {
                const todayDate = today.getDate();
                if (rt.dayOfMonth === 'last') {
                    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                    shouldRunToday = todayDate === lastDay;
                } else {
                    shouldRunToday = todayDate === parseInt(rt.dayOfMonth);
                }
            }
            
            // Check completion
            const lastCompleted = rt.lastCompleted?.toDate ? rt.lastCompleted.toDate() : null;
            const completedToday = lastCompleted && getLocalDateStr(lastCompleted) === todayDateStr;
            
            // Check if task was generated today
            const generatedTasks = tasks.filter(t => 
                t.regularTaskId === rt.id && 
                t.createdAt?.toDate && 
                getLocalDateStr(t.createdAt.toDate()) === todayDateStr
            );
            
            if (completedToday) {
                return { status: 'completed', color: '#4caf50', text: t('completedStatus'), lucideIcon: 'check-circle', completedToday: true };
            } else if (generatedTasks.length > 0) {
                const allDone = generatedTasks.every(t => t.status === 'done');
                if (allDone) {
                    return { status: 'completed', color: '#4caf50', text: t('completedStatus'), lucideIcon: 'check-circle', completedToday: true };
                }
                return { status: 'inProgress', color: '#ff9800', text: t('inProgressStatus'), lucideIcon: 'clock', completedToday: false };
            } else if (shouldRunToday) {
                return { status: 'notCreated', color: '#2196f3', text: t('pendingStatus'), lucideIcon: 'circle', completedToday: false };
            } else {
                return { status: 'inactive', color: '#9e9e9e', text: t('notToday'), lucideIcon: 'minus-circle', completedToday: false };
            }
        }
        
        // Mark regular task as completed
        async function markRegularTaskComplete(taskId) {
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(10);
            
            const task = regularTasks.find(t => t.id === taskId);
            if (!task) return;
            
            const today = new Date();
            const todayStr = getLocalDateStr(today);
            
            // Check if already completed today
            const lastCompleted = task.lastCompleted?.toDate ? task.lastCompleted.toDate() : null;
            const completedToday = lastCompleted && getLocalDateStr(lastCompleted) === todayStr;
            
            if (completedToday) {
                // Unmark as completed
                await db.collection('companies').doc(currentCompany).collection('regularTasks').doc(taskId).update({
                    lastCompleted: null
                });
                task.lastCompleted = null;
            } else {
                // Mark as completed
                const now = firebase.firestore.Timestamp.now();
                await db.collection('companies').doc(currentCompany).collection('regularTasks').doc(taskId).update({
                    lastCompleted: now
                });
                task.lastCompleted = now;
            }
            
            renderMyDay();
            if (currentRegularView === 'list') renderRegularTasks();
            else renderRegularWeekView();
            renderMobileRegularDay();
        }
        
        // Mobile Regular Tasks - selected day
        let selectedRegularDay = new Date().getDay();
        
        function selectRegularDay(day) {
            selectedRegularDay = day;
            updateRegularDayTabs();
            renderMobileRegularDay();
        }
        
        function updateRegularDayTabs() {
            const tabs = document.querySelectorAll('.regular-day-tab');
            const today = new Date().getDay();
            
            tabs.forEach(tab => {
                const tabDay = parseInt(tab.dataset.day);
                tab.classList.remove('active', 'today', 'has-tasks');
                
                if (tabDay === selectedRegularDay) {
                    tab.classList.add('active');
                }
                if (tabDay === today) {
                    tab.classList.add('today');
                }
                
                // Check if day has tasks
                const hasTasks = regularTasks.some(rt => {
                    if (rt.period === 'weekly') {
                        return parseInt(rt.dayOfWeek) === tabDay;
                    }
                    return false;
                });
                if (hasTasks) {
                    tab.classList.add('has-tasks');
                }
            });
        }
        
        function renderMobileRegularDay() {
            const container = document.getElementById('mobileRegularDayContent');
            if (!container) return;
            
            const today = new Date();
            const todayDay = today.getDay();
            const todayDate = today.getDate();
            const todayDateStr = getLocalDateStr(today);
            
            // Фільтри
            const ff = document.getElementById('regularFunctionFilter')?.value;
            const af = document.getElementById('regularAssigneeFilter')?.value;
            
            const applyUserFilters = (tasks) => {
                return tasks.filter(rt => {
                    if (ff && rt.function !== ff) return false;
                    if (af) {
                        const func = functions.find(f => f.name === rt.function);
                        if (!func?.assigneeIds?.includes(af)) return false;
                    }
                    return true;
                });
            };
            
            // Filter WEEKLY tasks for selected day
            const weeklyTasks = applyUserFilters(regularTasks.filter(rt => {
                if (rt.period === 'weekly') {
                    return parseInt(rt.dayOfWeek) === selectedRegularDay;
                }
                return false;
            })).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
            
            // Get MONTHLY tasks (show in separate section)
            const monthlyTasks = applyUserFilters(regularTasks.filter(rt => rt.period === 'monthly'))
                .sort((a, b) => {
                    const dayA = a.dayOfMonth === 'last' ? 32 : parseInt(a.dayOfMonth);
                    const dayB = b.dayOfMonth === 'last' ? 32 : parseInt(b.dayOfMonth);
                    return dayA - dayB;
                });
            
            // Get QUARTERLY tasks
            const quarterlyTasks = applyUserFilters(regularTasks.filter(rt => rt.period === 'quarterly'))
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
            
            let html = '';
            
            // Weekly tasks section
            if (weeklyTasks.length > 0) {
                weeklyTasks.forEach(rt => {
                    html += renderRegularTaskCard(rt);
                });
            } else if (monthlyTasks.length === 0 && quarterlyTasks.length === 0) {
                html += `
                    <div class="mobile-regular-empty">
                        <div class="mobile-regular-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6m-6 4h6"/></svg></div>
                        <div class="mobile-regular-empty-text">Немає регулярних завдань</div>
                    </div>
                `;
            }
            
            // Monthly tasks section
            if (monthlyTasks.length > 0) {
                html += `<div class="mobile-regular-section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    ${t('monthlyTasks')}
                </div>`;
                monthlyTasks.forEach(rt => {
                    const dayLabel = rt.dayOfMonth === 'last' 
                        ? (t('lastDayLabel'))
                        : (`${rt.dayOfMonth}${t('dayOfMonthLabel')}`);
                    html += renderRegularTaskCard(rt, dayLabel);
                });
            }
            
            // Quarterly tasks section
            if (quarterlyTasks.length > 0) {
                html += `<div class="mobile-regular-section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
                    ${t('quarterlyTasks')}
                </div>`;
                quarterlyTasks.forEach(rt => {
                    html += renderRegularTaskCard(rt, t('oncePerQuarter'));
                });
            }
            
            container.innerHTML = html;
            refreshIcons();
        }
        
        function renderRegularTaskCard(rt, extraLabel = null) {
            const func = functions.find(f => f.name === rt.function);
            const assigneeNames = func?.assigneeIds?.map(id => {
                const user = users.find(u => u.id === id);
                return user?.name || user?.email?.split('@')[0] || '';
            }).filter(Boolean) || [];
            
            const statusInfo = getRegularTaskStatus(rt);
            
            return `
                <div class="regular-task-card ${statusInfo.completedToday ? 'completed' : ''}" 
                     onclick="openRegularTaskModal('${escId(rt.id)}')"
                     style="border-left-color: ${statusInfo.color};">
                    <div class="task-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        ${rt.timeStart || rt.time || '--:--'}
                        ${rt.estimatedTime ? ` • ${formatDuration(parseInt(rt.estimatedTime))}` : ''}
                        ${extraLabel ? ` • <span style="color:#8b5cf6;font-weight:500;">${extraLabel}</span>` : ''}
                    </div>
                    <div class="task-title">${esc(rt.title)}</div>
                    ${assigneeNames.length > 0 ? `
                        <div class="task-assignee">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ${assigneeNames.map(n => esc(n)).slice(0, 2).join(', ')}${assigneeNames.length > 2 ? ` +${assigneeNames.length - 2}` : ''}
                        </div>
                    ` : ''}
                    ${rt.function ? `<div class="task-function">${esc(rt.function)}</div>` : ''}
                    <button class="regular-task-complete-btn ${statusInfo.completedToday ? 'completed' : ''}" 
                            onclick="event.stopPropagation();markRegularTaskComplete('${escId(rt.id)}')"
                            title="${statusInfo.completedToday ? t('doneToday') : t('markAsDone')}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                </div>
            `;
        }
        
        window.initRegularView = function initRegularView() {
            const savedView = localStorage.getItem('regularView') || 'week';
            setRegularView(savedView);
            
            // Init mobile view
            selectedRegularDay = new Date().getDay();
            updateRegularDayTabs();
            renderMobileRegularDay();
        }
