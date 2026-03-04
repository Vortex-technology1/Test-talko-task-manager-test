// =====================
        // CALENDAR VIEW
        // =====================
        
        let currentCalendarView = 'day'; // day, week, month, list
        let calendarDate = new Date(); // Currently displayed date
        
        function getDayNames() {
            const d = { ua: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота'],
                        ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                        pl: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
                        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                        de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] };
            return d[currentLang] || d['ua'];
        }
        function getDayNamesShort() {
            const d = { ua: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
                        ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                        pl: ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'],
                        en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] };
            return d[currentLang] || d['ua'];
        }
        function getMonthNamesFull() {
            const m = { ua: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                        ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                        pl: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'] };
            return m[currentLang] || m['ua'];
        }
        
        // Для сумісності зі старим кодом
        let dayNames = getDayNames();
        let dayNamesShort = getDayNamesShort();
        let monthNames = getMonthNamesFull();
        
        function setCalendarView(view) {
            currentCalendarView = view;
            
            // Update buttons
            document.querySelectorAll('.calendar-view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === view);
            });
            
            // Hide/show week strip (only useful for day view on mobile)
            const weekStrip = document.getElementById('mobileWeekStrip');
            if (weekStrip) {
                weekStrip.style.display = (view === 'day') ? '' : 'none';
            }
            
            // Hide calendar nav for kanban/deadlines/list (arrows make no sense)
            const calNavBtns = document.querySelector('.calendar-nav');
            if (calNavBtns) {
                calNavBtns.style.display = (view === 'kanban' || view === 'deadlines' || view === 'list') ? 'none' : '';
            }
            
            // Mobile filter bar — only in list view
            const mobileFilterBar = document.getElementById('mobileFilterBar');
            if (mobileFilterBar && window.innerWidth < 768) {
                mobileFilterBar.style.display = (view === 'list') ? '' : 'none';
            }
            
            // Calendar filters — only in calendar views (not list, not kanban)
            const calFilterRow = document.getElementById('calendarFiltersRow');
            if (calFilterRow) {
                const isCalView = (view !== 'list' && view !== 'kanban' && view !== 'deadlines' && window.innerWidth >= 768);
                calFilterRow.style.display = isCalView ? 'flex' : 'none';
            }
            
            // Show/hide containers
            const calendarContainer = document.getElementById('calendarContainer');
            const listContainer = document.getElementById('listContainer');
            
            if (view === 'list') {
                calendarContainer.classList.remove('active');
                listContainer.classList.add('active');
                listContainer.style.display = '';
                listContainer.style.minHeight = '';
                const tasksC = document.getElementById('tasksContainer');
                if (tasksC) tasksC.style.display = '';
                const totalTimeInfo = document.getElementById('totalTimeInfo');
                if (totalTimeInfo) totalTimeInfo.style.display = '';
                // Hide kanban
                const kanbanC = document.getElementById('kanbanContainer');
                if (kanbanC) kanbanC.style.display = 'none';
                // Reset archive view if it was open
                if (isArchiveView) {
                    isArchiveView = false;
                    document.getElementById('tasksContainer').style.display = '';
                    const filtersRow = document.querySelector('#listContainer .filters-row');
                    if (filtersRow) filtersRow.style.display = '';
                    const mobileFilterBar = document.getElementById('mobileFilterBar');
                    if (mobileFilterBar) mobileFilterBar.style.display = '';
                    const totalTimeInfo = document.getElementById('totalTimeInfo');
                    if (totalTimeInfo) totalTimeInfo.style.display = '';
                    document.getElementById('archiveContainer').style.display = 'none';
                    const archiveBtn = document.getElementById('archiveToggleBtn');
                    if (archiveBtn) {
                        archiveBtn.style.background = '#6b7280';
                        archiveBtn.innerHTML = '<i data-lucide="archive" class="icon"></i> <span>Архів</span>';
                    }
                }
                renderTasks();
                updateCalendarTitle();
            } else if (view === 'kanban' || view === 'deadlines') {
                calendarContainer.classList.remove('active');
                listContainer.classList.remove('active');
                // Show list filters row (reuse for kanban filtering)
                const listFiltersRow = document.querySelector('#listContainer .filters-row');
                if (listFiltersRow) {
                    listFiltersRow.style.display = '';
                    listFiltersRow.style.position = 'relative';
                    listFiltersRow.style.zIndex = '10';
                }
                listContainer.style.display = 'block';
                listContainer.style.minHeight = '0';
                const tasksC = document.getElementById('tasksContainer');
                if (tasksC) tasksC.style.display = 'none';
                const totalTimeInfo = document.getElementById('totalTimeInfo');
                if (totalTimeInfo) totalTimeInfo.style.display = 'none';
                
                let kanbanC = document.getElementById('kanbanContainer');
                if (!kanbanC) {
                    kanbanC = document.createElement('div');
                    kanbanC.id = 'kanbanContainer';
                    listContainer.parentNode.insertBefore(kanbanC, listContainer.nextSibling);
                }
                kanbanC.style.display = 'block';
                renderKanbanBoard(view);
                updateCalendarTitle();
            } else {
                calendarContainer.classList.add('active');
                listContainer.classList.remove('active');
                listContainer.style.display = '';
                listContainer.style.minHeight = '';
                const tasksC = document.getElementById('tasksContainer');
                if (tasksC) tasksC.style.display = '';
                const kanbanC = document.getElementById('kanbanContainer');
                if (kanbanC) kanbanC.style.display = 'none';
                renderCalendar();
            }
            
            // Save preference
            localStorage.setItem('calendarView', view);
        }
        
        function calendarPrev() {
            if (currentCalendarView === 'kanban' || currentCalendarView === 'deadlines' || currentCalendarView === 'list') return;
            if (currentCalendarView === 'day') {
                calendarDate.setDate(calendarDate.getDate() - 1);
            } else if (currentCalendarView === 'week') {
                calendarDate.setDate(calendarDate.getDate() - 7);
            } else if (currentCalendarView === 'month') {
                calendarDate.setMonth(calendarDate.getMonth() - 1);
            }
            renderCalendar();
        }
        
        function calendarNext() {
            if (currentCalendarView === 'kanban' || currentCalendarView === 'deadlines' || currentCalendarView === 'list') return;
            if (currentCalendarView === 'day') {
                calendarDate.setDate(calendarDate.getDate() + 1);
            } else if (currentCalendarView === 'week') {
                calendarDate.setDate(calendarDate.getDate() + 7);
            } else if (currentCalendarView === 'month') {
                calendarDate.setMonth(calendarDate.getMonth() + 1);
            }
            renderCalendar();
        }
        
        function calendarToday() {
            if (currentCalendarView === 'kanban' || currentCalendarView === 'deadlines' || currentCalendarView === 'list') return;
            calendarDate = new Date();
            renderCalendar();
        }
        
        function renderCalendar() {
            updateCalendarTitle();
            renderWeekStrip(); // Mobile week strip
            updateCalendarFilterUI();
            
            if (currentCalendarView === 'day') {
                renderDayView();
            } else if (currentCalendarView === 'week') {
                renderWeekView();
            } else if (currentCalendarView === 'month') {
                renderMonthView();
            }
            
            refreshIcons();
        }
        
        function getCalendarFilteredTasks() {
            const af = document.getElementById('calendarAssigneeFilter')?.value;
            const ff = document.getElementById('calendarFunctionFilter')?.value;
            return tasks.filter(task => {
                if (!isTaskVisibleToUser(task)) return false;
                if (af && task.assigneeId !== af) return false;
                if (ff && task.function !== ff) return false;
                return true;
            });
        }
        
        function filterCalendarMy() {
            const af = document.getElementById('calendarAssigneeFilter');
            if (af.value === currentUser?.uid) {
                af.value = '';
            } else {
                af.value = currentUser?.uid;
            }
            renderCalendar();
        }
        
        function updateCalendarFilterUI() {
            const af = document.getElementById('calendarAssigneeFilter')?.value;
            const ff = document.getElementById('calendarFunctionFilter')?.value;
            const myBtn = document.getElementById('calendarMyBtn');
            if (myBtn) {
                if (af === currentUser?.uid) {
                    myBtn.style.background = 'var(--primary)';
                    myBtn.style.color = 'white';
                    myBtn.style.borderColor = 'var(--primary)';
                } else {
                    myBtn.style.background = '';
                    myBtn.style.color = '';
                    myBtn.style.borderColor = '';
                }
            }
            const countEl = document.getElementById('calendarFilterCount');
            if (countEl) {
                if (af || ff) {
                    const filtered = getCalendarFilteredTasks().length;
                    countEl.textContent = `${filtered} / ${tasks.filter(t => isTaskVisibleToUser(t)).length}`;
                } else {
                    countEl.textContent = '';
                }
            }
        }
        
        // Mobile Week Strip (Google Calendar style)
        function renderWeekStrip() {
            const container = document.getElementById('weekStripDays');
            if (!container) return;
            
            const today = new Date();
            const todayStr = today.toDateString();
            const selectedStr = calendarDate.toDateString();
            
            // Get start of current week
            const weekStart = new Date(calendarDate);
            weekStart.setDate(calendarDate.getDate() - ((calendarDate.getDay() + 6) % 7));
            
            const shortDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
            
            let html = '';
            
            for (let i = 0; i < 7; i++) {
                const day = new Date(weekStart);
                day.setDate(weekStart.getDate() + i);
                const dayStr = getLocalDateStr(day);
                
                const isToday = day.toDateString() === todayStr;
                const isSelected = day.toDateString() === selectedStr;
                
                // Get tasks for this day
                const dayTasks = getCalendarFilteredTasks().filter(task => {
                    if (!task.deadline) return false;
                    const taskDate = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                    return getLocalDateStr(taskDate) === dayStr;
                });
                
                // Generate task dots (max 3)
                const taskDots = dayTasks.slice(0, 3).map(t => 
                    `<div class="task-dot status-${t.status}"></div>`
                ).join('');
                
                const classes = ['week-strip-day'];
                if (isToday) classes.push('today');
                if (isSelected) classes.push('selected');
                if (dayTasks.length > 0) classes.push('has-tasks');
                
                html += `
                    <div class="${classes.join(' ')}" onclick="selectWeekStripDay('${dayStr}')">
                        <div class="day-label">${shortDays[i]}</div>
                        <div class="day-num">${day.getDate()}</div>
                        <div class="task-dots">${taskDots}</div>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        }
        
        function selectWeekStripDay(dateStr) {
            calendarDate = new Date(dateStr);
            renderCalendar();
        }
        
        function updateCalendarTitle() {
            const titleEl = document.getElementById('calendarTitle');
            const isMobile = window.innerWidth <= 767;
            
            if (currentCalendarView === 'day') {
                if (isMobile) {
                    // Mobile: just month and year like Google Calendar
                    titleEl.textContent = `${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
                } else {
                    titleEl.textContent = `${calendarDate.getDate()} ${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
                }
            } else if (currentCalendarView === 'week') {
                const weekStart = new Date(calendarDate);
                weekStart.setDate(calendarDate.getDate() - ((calendarDate.getDay() + 6) % 7));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                if (weekStart.getMonth() === weekEnd.getMonth()) {
                    titleEl.textContent = `${weekStart.getDate()} - ${weekEnd.getDate()} ${monthNames[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
                } else {
                    titleEl.textContent = `${weekStart.getDate()} ${monthNames[weekStart.getMonth()].slice(0,3)} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()].slice(0,3)} ${weekEnd.getFullYear()}`;
                }
            } else if (currentCalendarView === 'month') {
                titleEl.textContent = `${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
            } else if (currentCalendarView === 'list') {
                titleEl.textContent = `${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
            } else if (currentCalendarView === 'kanban') {
                titleEl.textContent = 'Канбан: Статуси';
            } else if (currentCalendarView === 'deadlines') {
                titleEl.textContent = 'Канбан: Терміни';
            }
        }
        
        // Mobile Agenda View (Apple Calendar Style)
        function renderMobileAgenda() {
            const agendaList = document.getElementById('agendaList');
            const agendaHeader = document.getElementById('agendaHeader');
            const agendaSubheader = document.getElementById('agendaSubheader');
            
            if (!agendaList) return;
            
            const today = new Date();
            const todayStr = today.toDateString();
            const selectedStr = calendarDate.toDateString();
            const dayStr = getLocalDateStr(calendarDate);
            
            // Set header
            const isToday = selectedStr === todayStr;
            const isTomorrow = calendarDate.toDateString() === new Date(today.getTime() + 86400000).toDateString();
            const isYesterday = calendarDate.toDateString() === new Date(today.getTime() - 86400000).toDateString();
            
            if (isToday) {
                agendaHeader.textContent = 'Сьогодні';
            } else if (isTomorrow) {
                agendaHeader.textContent = 'Завтра';
            } else if (isYesterday) {
                agendaHeader.textContent = 'Вчора';
            } else {
                agendaHeader.textContent = calendarDate.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
            }
            
            // Subheader with full date
            agendaSubheader.textContent = calendarDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
            
            // Get tasks for selected day
            const dayTasks = getCalendarFilteredTasks().filter(task => {
                if (!task.deadline) return false;
                const taskDate = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                return getLocalDateStr(taskDate) === dayStr;
            }).sort((a, b) => {
                const aDate = a.deadline?.toDate ? a.deadline.toDate() : new Date(a.deadline);
                const bDate = b.deadline?.toDate ? b.deadline.toDate() : new Date(b.deadline);
                return aDate - bDate;
            });
            
            if (dayTasks.length === 0) {
                agendaList.innerHTML = `
                    <div class="agenda-empty">
                        <div class="agenda-empty-icon"><i data-lucide="calendar" class="icon icon-xl"></i></div>
                        <div class="agenda-empty-text">${t('noTasksLabel')}</div>
                    </div>
                `;
                return;
            }
            
            let html = '';
            
            dayTasks.forEach(task => {
                const deadline = task.deadline?.toDate ? task.deadline.toDate() : new Date(task.deadline);
                const timeStr = deadline.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
                const isDone = task.status === 'done';
                const durationStr = task.estimatedTime ? formatDuration(parseInt(task.estimatedTime)) : '';
                
                html += `
                    <div class="agenda-item ${isDone ? 'done' : ''}" onclick="showTaskQuickMenu(event, '${escId(task.id)}')">
                        <div class="agenda-item-color status-${task.status}"></div>
                        <div class="agenda-item-content">
                            <div class="agenda-item-title">${esc(task.title)}</div>
                            <div class="agenda-item-meta">
                                <span class="agenda-item-time">${timeStr}</span>
                                ${durationStr ? ` • ${durationStr}` : ''}
                                ${task.assigneeName ? ` • ${esc(task.assigneeName)}` : ''}
                            </div>
                        </div>
                        <div class="agenda-item-check" onclick="event.stopPropagation();toggleTaskFromAgenda('${escId(task.id)}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                    </div>
                `;
            });
            
            agendaList.innerHTML = html;
        }
        
        // Toggle task completion from agenda
        async function toggleTaskFromAgenda(taskId) {
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(10);
            
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex < 0) return;
            
            const originalTask = deepCloneTask(tasks[taskIndex]);
            
            // Блокуємо toggle для review tasks — тільки постановник може accept/reject
            if (originalTask.status === 'review') {
                if (originalTask.creatorId === currentUser?.uid && originalTask.assigneeId !== currentUser?.uid) {
                    // Постановник — пропонуємо accept
                    acceptReviewTask(taskId);
                } else {
                    showToast(t('awaitingReview'), 'info');
                }
                return;
            }
            
            const needsReview = shouldSendForReview(originalTask);
            const newStatus = originalTask.status === 'done' 
                ? 'progress' 
                : (needsReview ? 'review' : 'done');
            
            // Оптимістичне оновлення
            tasks[taskIndex].status = newStatus;
            tasks[taskIndex].completedAt = newStatus === 'done' || newStatus === 'review' ? new Date().toISOString() : null;
            if (needsReview) tasks[taskIndex].sentForReviewAt = new Date().toISOString();
            renderMyDay();
            renderCalendar();
            
            try {
                if (newStatus === 'done' && originalTask.calendarEventId && googleAccessToken) {
                    deleteCalendarEvent(originalTask.calendarEventId).catch(err => console.warn("[Calendar] Delete sync failed:", err));
                }
                
                const updateData = {
                    status: newStatus,
                    completedAt: newStatus === 'done' || newStatus === 'review' ? firebase.firestore.FieldValue.serverTimestamp() : null
                };
                if (needsReview) updateData.sentForReviewAt = firebase.firestore.FieldValue.serverTimestamp();
                
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(taskId).update(updateData);
                // AUDIT LOG
                logTaskChange(taskId, updateData.status === 'done' ? 'complete' : 'status', { status: updateData.status }, { status: originalTask?.status });
                
                if (needsReview) {
                    showToast(t('taskSentForReview'), 'info');
                }
                // Автостатус проєкту
                if (originalTask?.projectId) autoUpdateProjectStatus(originalTask.projectId);
            } catch (error) {
                // Rollback
                tasks[taskIndex] = originalTask;
                renderMyDay();
                renderCalendar();
                console.error('toggleTaskFromAgenda error:', error);
            }
        }
        
        function renderDayView() {
            // Hide other views
            document.getElementById('calendarDayView').style.display = 'block';
            document.getElementById('calendarWeekView').style.display = 'none';
            document.getElementById('calendarMonthView').style.display = 'none';
            
            // Render mobile agenda
            renderMobileAgenda();
            
            const today = new Date();
            const isToday = calendarDate.toDateString() === today.toDateString();
            
            // Update header
            const headerEl = document.getElementById('dayColumnHeader');
            headerEl.className = 'calendar-day-column-header' + (isToday ? ' today' : '');
            headerEl.innerHTML = `
                <div class="day-name">${dayNames[calendarDate.getDay()]}</div>
                <div class="day-number">${calendarDate.getDate()}</div>
            `;
            
            // Build time slots
            const timeSlotsEl = document.getElementById('calendarTimeSlots');
            const eventsContainerEl = document.getElementById('calendarEventsContainer');
            
            const dayStr = getLocalDateStr(calendarDate);
            
            let timeSlotsHTML = '';
            let hoursHTML = '';
            
            for (let hour = 0; hour < 24; hour++) {
                const timeStr = hour.toString().padStart(2, '0') + ':00';
                timeSlotsHTML += `<div class="calendar-time-slot">${timeStr}</div>`;
                hoursHTML += `<div class="calendar-hour-row" data-hour="${hour}" data-date="${dayStr}" onclick="openTaskAtTime('${dayStr}', ${hour})" ondragover="onHourDragOver(event)" ondragleave="onHourDragLeave(event)" ondrop="onHourDrop(event, '${dayStr}', ${hour})"></div>`;
            }
            
            timeSlotsEl.innerHTML = timeSlotsHTML;
            
            // Keep current time line
            const currentTimeLineHTML = '<div class="calendar-current-time" id="currentTimeLine" style="display:none;"></div>';
            eventsContainerEl.innerHTML = hoursHTML + currentTimeLineHTML;
            
            // Filter tasks for this day
            const dayTasks = getCalendarFilteredTasks().filter(task => {
                if (!task.deadline) return false;
                const taskDate = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                return getLocalDateStr(taskDate) === dayStr;
            });
            
            // Separate all-day and timed tasks
            const allDayTasks = [];
            const timedTasks = [];
            
            dayTasks.forEach(task => {
                const deadline = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                const hours = deadline.getHours();
                const minutes = deadline.getMinutes();
                
                // If task has no specific time (00:00) and no estimated time, treat as all-day
                if (hours === 0 && minutes === 0 && !task.estimatedTime) {
                    allDayTasks.push(task);
                } else {
                    timedTasks.push({ ...task, deadlineDate: deadline });
                }
            });
            
            // Render all-day section
            const alldayEl = document.getElementById('calendarAllday');
            if (allDayTasks.length > 0) {
                alldayEl.style.display = 'block';
                alldayEl.innerHTML = `
                    <div class="calendar-allday-label">${t('noTimeLabel')} (${allDayTasks.length})</div>
                    ${allDayTasks.map(task => `
                        <div class="calendar-allday-event calendar-event status-${task.status}" onclick="showTaskQuickMenu(event, '${escId(task.id)}')">
                            ${task.status === 'done' ? '<span style="margin-right:4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:-2px;"><polyline points="20 6 9 17 4 12"/></svg></span>' : ''}
                            ${esc(task.title)}
                        </div>
                    `).join('')}
                `;
            } else {
                alldayEl.style.display = 'none';
            }
            
            // Render timed events
            timedTasks.forEach(task => {
                const deadline = task.deadlineDate;
                const startHour = deadline.getHours();
                const startMinute = deadline.getMinutes();
                
                // Calculate duration (use estimatedTime or default to 60 min)
                const durationMinutes = task.estimatedTime ? parseInt(task.estimatedTime) : 60;
                
                // Calculate position and height
                const topOffset = startHour * 60 + startMinute;
                const height = Math.max(durationMinutes, 20); // Minimum 20px height
                
                const eventHTML = `
                    <div class="calendar-event status-${task.status}" 
                         style="top: ${topOffset}px; height: ${height}px;"
                         onclick="showTaskQuickMenu(event, '${escId(task.id)}')"
                         draggable="true"
                         ondragstart="onTaskDragStart(event, '${escId(task.id)}')"
                         title="${esc(task.title)}">
                        ${task.status === 'done' ? '<div class="calendar-event-done-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
                        <div class="calendar-event-title">${esc(task.title)}</div>
                        <div class="calendar-event-time">${startHour.toString().padStart(2,'0')}:${startMinute.toString().padStart(2,'0')} • ${formatDuration(durationMinutes)}</div>
                    </div>
                `;
                eventsContainerEl.insertAdjacentHTML('beforeend', eventHTML);
            });
            
            // Show current time line if viewing today
            if (isToday) {
                updateCurrentTimeLine();
            }
        }
        
        function formatDuration(minutes) {
            if (minutes < 60) return `${minutes} хв`;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} год ${mins} хв` : `${hours} год`;
        }
        
        function updateCurrentTimeLine() {
            const now = new Date();
            const today = new Date();
            const line = document.getElementById('currentTimeLine');
            if (!line) return;
            
            if (calendarDate.toDateString() !== today.toDateString()) {
                line.style.display = 'none';
                return;
            }
            
            const topOffset = now.getHours() * 60 + now.getMinutes();
            line.style.display = 'block';
            line.style.top = topOffset + 'px';
        }
        
        function renderWeekView() {
            document.getElementById('calendarDayView').style.display = 'none';
            document.getElementById('calendarWeekView').style.display = 'block';
            document.getElementById('calendarMonthView').style.display = 'none';
            
            const weekStart = new Date(calendarDate);
            weekStart.setDate(calendarDate.getDate() - ((calendarDate.getDay() + 6) % 7));
            
            const today = new Date();
            const todayStr = today.toDateString();
            
            // Build header
            const headerEl = document.getElementById('weekHeader');
            let headerHTML = '<div class="calendar-time-gutter"></div>';
            
            for (let i = 0; i < 7; i++) {
                const day = new Date(weekStart);
                day.setDate(weekStart.getDate() + i);
                const isToday = day.toDateString() === todayStr;
                
                headerHTML += `
                    <div class="calendar-week-day-header ${isToday ? 'today' : ''}">
                        <div class="day-name">${dayNamesShort[i]}</div>
                        <div class="day-number" ${isToday ? 'style="background:var(--primary);color:white;border-radius:50%;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;"' : ''}>${day.getDate()}</div>
                    </div>
                `;
            }
            headerEl.innerHTML = headerHTML;
            
            // Build body with time slots
            const bodyEl = document.getElementById('weekBody');
            let bodyHTML = '<div class="calendar-time-slots">';
            
            for (let hour = 0; hour < 24; hour++) {
                bodyHTML += `<div class="calendar-time-slot">${hour.toString().padStart(2, '0')}:00</div>`;
            }
            bodyHTML += '</div>';
            
            // PRE-BUILD: date → tasks map for week (O(n) instead of O(7*n))
            const weekFilteredTasks = getCalendarFilteredTasks();
            const weekTasksByDate = {};
            weekFilteredTasks.forEach(task => {
                if (!task.deadline) return;
                const taskDate = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                const dateKey = getLocalDateStr(taskDate);
                if (!weekTasksByDate[dateKey]) weekTasksByDate[dateKey] = [];
                weekTasksByDate[dateKey].push(task);
            });
            
            // Build columns for each day
            for (let i = 0; i < 7; i++) {
                const day = new Date(weekStart);
                day.setDate(weekStart.getDate() + i);
                const dayStr = getLocalDateStr(day);
                
                bodyHTML += `<div class="calendar-week-day-column" data-date="${dayStr}">`;
                
                // Hour rows
                for (let hour = 0; hour < 24; hour++) {
                    bodyHTML += `<div class="calendar-hour-row" data-hour="${hour}" onclick="openTaskAtTime('${dayStr}', ${hour})" ondragover="onHourDragOver(event)" ondragleave="onHourDragLeave(event)" ondrop="onHourDrop(event, '${dayStr}', ${hour})"></div>`;
                }
                
                // Get tasks for this day (O(1) lookup)
                const dayTasks = weekTasksByDate[dayStr] || [];
                
                // Render events
                dayTasks.forEach(task => {
                    const deadline = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                    const startHour = deadline.getHours();
                    const startMinute = deadline.getMinutes();
                    const durationMinutes = task.estimatedTime ? parseInt(task.estimatedTime) : 60;
                    
                    const topOffset = startHour * 60 + startMinute;
                    const height = Math.max(durationMinutes, 20);
                    
                    bodyHTML += `
                        <div class="calendar-event status-${task.status}" 
                             style="position:absolute; top:${topOffset}px; height:${height}px; left:2px; right:2px;"
                             onclick="showTaskQuickMenu(event, '${escId(task.id)}')"
                             draggable="true"
                             ondragstart="onTaskDragStart(event, '${escId(task.id)}')"
                             title="${esc(task.title)}">
                            <div class="calendar-event-title" style="font-size:0.7rem;">${esc(task.title)}</div>
                        </div>
                    `;
                });
                
                bodyHTML += '</div>';
            }
            
            bodyEl.innerHTML = bodyHTML;
        }
        
        function renderMonthView() {
            document.getElementById('calendarDayView').style.display = 'none';
            document.getElementById('calendarWeekView').style.display = 'none';
            document.getElementById('calendarMonthView').style.display = 'block';
            
            // Оновлюємо заголовки днів тижня
            const monthDayNamesEl = document.getElementById('calendarMonthDayNames');
            if (monthDayNamesEl) {
                const shortDays = getDayNamesShort();
                monthDayNamesEl.innerHTML = shortDays.map(d => `<div class="calendar-month-day-name">${d}</div>`).join('');
            }
            
            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDay = (firstDay.getDay() + 6) % 7; // Monday-based (0 = Monday)
            const daysInMonth = lastDay.getDate();
            
            const today = new Date();
            const todayStr = getLocalDateStr(today);
            
            // Get prev month's last days
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            
            const bodyEl = document.getElementById('monthBody');
            let html = '';
            
            // PRE-BUILD: date → tasks map (O(n) instead of O(42*n))
            const filteredTasks = getCalendarFilteredTasks();
            const tasksByDate = {};
            filteredTasks.forEach(task => {
                if (!task.deadline) return;
                const taskDate = task.deadline.toDate ? task.deadline.toDate() : new Date(task.deadline);
                const dateKey = getLocalDateStr(taskDate);
                if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
                tasksByDate[dateKey].push(task);
            });
            
            let dayCounter = 1;
            let nextMonthDay = 1;
            
            // Calculate total cells needed (6 weeks max)
            const totalCells = 42;
            
            for (let i = 0; i < totalCells; i++) {
                let dayNum, dateStr, isOtherMonth = false;
                
                if (i < startDay) {
                    // Previous month
                    dayNum = prevMonthLastDay - startDay + i + 1;
                    const prevMonth = month === 0 ? 11 : month - 1;
                    const prevYear = month === 0 ? year - 1 : year;
                    dateStr = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                    isOtherMonth = true;
                } else if (dayCounter <= daysInMonth) {
                    // Current month
                    dayNum = dayCounter;
                    dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                    dayCounter++;
                } else {
                    // Next month
                    dayNum = nextMonthDay;
                    const nextMonth = month === 11 ? 0 : month + 1;
                    const nextYear = month === 11 ? year + 1 : year;
                    dateStr = `${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                    nextMonthDay++;
                    isOtherMonth = true;
                }
                
                const isToday = dateStr === todayStr;
                
                // Get tasks for this day (O(1) lookup from pre-built map)
                const dayTasks = tasksByDate[dateStr] || [];
                
                html += `
                    <div class="calendar-month-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}" 
                         data-date="${dateStr}"
                         onclick="goToDay('${dateStr}')">
                        <div class="month-day-number">${dayNum}</div>
                        ${dayTasks.slice(0, 3).map(task => `
                            <div class="calendar-month-event status-${task.status}" 
                                 onclick="event.stopPropagation(); showTaskQuickMenu(event, '${escId(task.id)}')"
                                 title="${esc(task.title)}">
                                ${esc(task.title)}
                            </div>
                        `).join('')}
                        ${dayTasks.length > 3 ? `<div class="calendar-month-more">+${dayTasks.length - 3} ще</div>` : ''}
                    </div>
                `;
            }
            
            bodyEl.innerHTML = html;
        }
        
        function goToDay(dateStr) {
            calendarDate = new Date(dateStr);
            setCalendarView('day');
        }
        
        // Initialize calendar
        function initCalendar() {
            // Load saved view preference
            const savedView = localStorage.getItem('calendarView') || 'day';
            setCalendarView(savedView);
            
            // Гарантія: при list view calendarFiltersRow прихований
            if (savedView === 'list') {
                const cfr = document.getElementById('calendarFiltersRow');
                if (cfr) cfr.style.display = 'none';
            }
            
            // Generate time slots
            renderCalendar();
            
            // Update current time line every minute
            setInterval(updateCurrentTimeLine, 60000);
            
            // Setup swipe navigation for mobile
            setupCalendarSwipe();
        }
        
        // Swipe navigation for mobile calendar
        function setupCalendarSwipe() {
            const dayView = document.getElementById('calendarDayView');
            const weekView = document.getElementById('calendarWeekView');
            const weekStrip = document.getElementById('mobileWeekStrip');
            
            [dayView, weekView, weekStrip].forEach(view => {
                if (!view) return;
                
                let touchStartX = 0;
                let touchStartY = 0;
                let touchEndX = 0;
                let isSwiping = false;
                
                view.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                    touchStartY = e.changedTouches[0].screenY;
                    isSwiping = true;
                }, { passive: true });
                
                view.addEventListener('touchmove', (e) => {
                    if (!isSwiping) return;
                    const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
                    // Cancel swipe if scrolling vertically
                    if (diffY > 30) {
                        isSwiping = false;
                    }
                }, { passive: true });
                
                view.addEventListener('touchend', (e) => {
                    if (!isSwiping) return;
                    touchEndX = e.changedTouches[0].screenX;
                    handleCalendarSwipe(touchStartX, touchEndX, view === weekStrip);
                    isSwiping = false;
                }, { passive: true });
            });
        }
        
        function handleCalendarSwipe(startX, endX, isWeekStrip) {
            const swipeThreshold = 70;
            const diff = startX - endX;
            
            if (Math.abs(diff) < swipeThreshold) return;
            
            if (isWeekStrip) {
                // Swipe on week strip → change week
                if (diff > 0) {
                    calendarDate.setDate(calendarDate.getDate() + 7);
                } else {
                    calendarDate.setDate(calendarDate.getDate() - 7);
                }
                renderCalendar();
            } else {
                if (diff > 0) {
                    // Swipe left → next day/week
                    navigateCalendar(1);
                } else {
                    // Swipe right → prev day/week
                    navigateCalendar(-1);
                }
            }
        }
        
        function navigateCalendar(direction) {
            if (currentCalendarView === 'day') {
                calendarDate.setDate(calendarDate.getDate() + direction);
            } else if (currentCalendarView === 'week') {
                calendarDate.setDate(calendarDate.getDate() + (direction * 7));
            } else if (currentCalendarView === 'month') {
                calendarDate.setMonth(calendarDate.getMonth() + direction);
            }
            renderCalendar();
        }

        function handleDateFilter() {
            const df = document.getElementById('dateFilter').value;
            const customRange = document.getElementById('customDateRange');
            
            if (df === 'custom') {
                customRange.style.display = 'flex';
                // Встановлюємо значення за замовчуванням
                const today = getLocalDateStr();
                const weekLater = new Date();
                weekLater.setDate(weekLater.getDate() + 7);
                document.getElementById('dateFrom').value = today;
                document.getElementById('dateTo').value = getLocalDateStr(weekLater);
            } else {
                customRange.style.display = 'none';
            }
            renderTasks();
        }
