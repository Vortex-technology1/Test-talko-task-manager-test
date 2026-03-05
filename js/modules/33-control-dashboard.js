// =====================
        // CONTROL DASHBOARD
        // =====================
        function renderControl() {
            const af = document.getElementById('controlAssigneeFilter')?.value;
            const ff = document.getElementById('controlFunctionFilter')?.value;
            const pf = document.getElementById('controlPeriodFilter')?.value;
            
            // Завжди оновлюємо селекти — але зберігаємо поточне значення
            const assigneeSelect = document.getElementById('controlAssigneeFilter');
            const functionSelect = document.getElementById('controlFunctionFilter');
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            if (assigneeSelect) {
                assigneeSelect.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
                if (af) assigneeSelect.value = af; // відновлюємо вибір
            }
            if (functionSelect) {
                functionSelect.innerHTML = `<option value="">${t('allFunctions')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
                if (ff) functionSelect.value = ff; // відновлюємо вибір
            }
            
            const now = new Date();
            const today = getLocalDateStr(now);
            const tm = new Date(now); tm.setDate(tm.getDate() + 1);
            const tomorrow = getLocalDateStr(tm);
            
            // Фільтруємо завдання
            let filteredTasks = tasks.filter(task => {
                if (!isTaskVisibleToUser(task)) return false;
                if (af && task.assigneeId !== af) return false;
                if (ff && task.function !== ff) return false;
                if (pf === 'today') {
                    const taskDate = parseDeadline(task).date;
                    if (taskDate !== today) return false;
                }
                if (pf === 'week') {
                    const taskDate = parseDeadline(task).date;
                    const weekLater = new Date();
                    weekLater.setDate(weekLater.getDate() + 7);
                    if (taskDate > getLocalDateStr(weekLater) || taskDate < today) return false;
                }
                if (pf === 'month') {
                    const taskDate = parseDeadline(task).date;
                    const monthLater = new Date();
                    monthLater.setMonth(monthLater.getMonth() + 1);
                    if (taskDate > getLocalDateStr(monthLater) || taskDate < today) return false;
                }
                return true;
            });
            
            const urgent = filteredTasks.filter(task => {
                const taskDate = parseDeadline(task).date;
                return taskDate && taskDate < today && task.status !== 'done' && task.status !== 'review';
            }).length;
            
            const warning = filteredTasks.filter(task => {
                const taskDate = parseDeadline(task).date;
                return (taskDate === today || taskDate === tomorrow) && task.status !== 'done' && task.status !== 'review';
            }).length;
            
            const active = filteredTasks.filter(task => task.status === 'progress').length;
            const completed = filteredTasks.filter(task => task.status === 'done').length;
            
            document.getElementById('urgentCount').textContent = urgent;
            document.getElementById('warningCount').textContent = warning;
            document.getElementById('activeCount').textContent = active;
            document.getElementById('completedCount').textContent = completed;
            
            renderControlContent();
            renderTeamDashboard();
        }
        
        // Клік по картці — показати відповідний список
        window.filterControlByCard = function(type) {
            const content = document.getElementById('controlContent');
            if (!content) return;

            const now = new Date();
            const today = getLocalDateStr(now);
            const tm = new Date(now); tm.setDate(tm.getDate() + 1);
            const tomorrow = getLocalDateStr(tm);
            const af = document.getElementById('controlAssigneeFilter')?.value || '';
            const ff = document.getElementById('controlFunctionFilter')?.value || '';

            let filtered = tasks.filter(task => {
                if (!isTaskVisibleToUser(task)) return false;
                if (af && task.assigneeId !== af) return false;
                if (ff && task.function !== ff) return false;
                return true;
            });

            let title = '';
            if (type === 'urgent') {
                filtered = filtered.filter(t => {
                    const d = parseDeadline(t).date;
                    return d && d < today && t.status !== 'done' && t.status !== 'review';
                });
                title = '🔴 Прострочені завдання';
            } else if (type === 'warning') {
                filtered = filtered.filter(t => {
                    const d = parseDeadline(t).date;
                    return (d === today || d === tomorrow) && t.status !== 'done' && t.status !== 'review';
                });
                title = '🟡 Сьогодні і завтра';
            } else if (type === 'active') {
                filtered = filtered.filter(t => t.status === 'progress');
                title = '🔵 В роботі';
            } else if (type === 'completed') {
                filtered = filtered.filter(t => t.status === 'done');
                title = '🟢 Завершені';
            }

            // Підсвічуємо активну картку
            document.querySelectorAll('.dashboard-card').forEach(el => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
            const cardMap = {urgent:'.dashboard-card.urgent',warning:'.dashboard-card.warning',active:'.dashboard-card.active',completed:'.dashboard-card.completed'};
            const activeCard = document.querySelector(cardMap[type]);
            if (activeCard) { activeCard.style.outline = '3px solid rgba(255,255,255,0.7)'; activeCard.style.outlineOffset = '-3px'; }

            if (filtered.length === 0) {
                content.innerHTML = `<div style="padding:2rem;text-align:center;color:#9ca3af;">${title} — завдань немає</div>`;
                return;
            }

            const rows = filtered.map(task => {
                const assignee = users.find(u => u.id === task.assigneeId);
                const name = assignee ? (assignee.name || assignee.email).split(' ')[0] : '—';
                const d = parseDeadline(task).date || '';
                const isOverdue = d && d < today && task.status !== 'done';
                const dateColor = isOverdue ? '#ef4444' : '#6b7280';
                return `<tr style="cursor:pointer;" onclick="openTaskModal('${task.id}')">
                    <td style="padding:0.6rem 0.75rem;font-weight:500;color:#1a1a1a;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(task.title||'')}</td>
                    <td style="padding:0.6rem 0.75rem;color:#6b7280;font-size:0.85rem;white-space:nowrap;">${esc(name)}</td>
                    <td style="padding:0.6rem 0.75rem;color:${dateColor};font-size:0.85rem;white-space:nowrap;">${d || '—'}</td>
                    <td style="padding:0.6rem 0.75rem;font-size:0.82rem;">${task.function ? `<span style="background:#f3f4f6;border-radius:4px;padding:1px 6px;">${esc(task.function)}</span>` : ''}</td>
                </tr>`;
            }).join('');

            content.innerHTML = `
                <div style="background:white;border-radius:8px;overflow:hidden;border:1px solid #f3f4f6;">
                    <div style="padding:0.75rem 1rem;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;">
                        <span style="font-weight:600;font-size:0.95rem;">${title}</span>
                        <span style="font-size:0.82rem;color:#9ca3af;">${filtered.length} завдань</span>
                    </div>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#fafafa;font-size:0.78rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.04em;">
                                <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;">Завдання</th>
                                <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;">Виконавець</th>
                                <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;">Дедлайн</th>
                                <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;">Функція</th>
                            </tr>
                        </thead>
                        <tbody style="divide-y:#f9fafb;">
                            ${rows}
                        </tbody>
                    </table>
                </div>`;

            // Скролимо до списку
            content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        function renderControlContent() {
            const viewType = document.getElementById('controlViewType')?.value || 'briefing';
            const af = document.getElementById('controlAssigneeFilter')?.value;
            const ff = document.getElementById('controlFunctionFilter')?.value;
            
            let filteredTasks = tasks.filter(task => {
                if (!isTaskVisibleToUser(task)) return false;
                if (af && task.assigneeId !== af) return false;
                if (ff && task.function !== ff) return false;
                return task.status !== 'done';
            });
            
            const content = document.getElementById('controlContent');
            
            if (viewType === 'briefing') {
                // MORNING BRIEFING — one-page "what's burning"
                const todayStr = getLocalDateStr(new Date());
                // allTasks = all tasks with filters (including done for people stats)
                const allTasksWithDone = tasks.filter(task => {
                    if (!isTaskVisibleToUser(task)) return false;
                    if (af && task.assigneeId !== af) return false;
                    if (ff && task.function !== ff) return false;
                    return true;
                });
                const allTasks = allTasksWithDone.filter(t => t.status !== 'done');
                
                // 1. CRITICAL: overdue tasks (exclude review - they're awaiting approval, not stuck)
                const overdue = allTasks.filter(t => t.deadlineDate && t.deadlineDate < todayStr && t.status !== 'done' && t.status !== 'review');
                const critical = overdue.filter(t => {
                    const d = Math.floor((new Date() - new Date(t.deadlineDate + 'T23:59:59')) / 86400000);
                    return d >= 7;
                });
                const warning = overdue.filter(t => {
                    const d = Math.floor((new Date() - new Date(t.deadlineDate + 'T23:59:59')) / 86400000);
                    return d >= 3 && d < 7;
                });
                const fresh = overdue.filter(t => {
                    const d = Math.floor((new Date() - new Date(t.deadlineDate + 'T23:59:59')) / 86400000);
                    return d < 3;
                });
                
                // Set of overdue task IDs to avoid duplication in stuck
                const overdueIds = new Set(overdue.map(t => t.id));
                
                // 2. STUCK: tasks in 'new' status for >3 days (exclude already overdue - shown above)
                const stuck = allTasks.filter(t => {
                    if (t.status !== 'new') return false;
                    if (overdueIds.has(t.id)) return false; // already shown in overdue section
                    const created = t.createdAt?.toDate ? t.createdAt.toDate() : (t.createdAt ? new Date(t.createdAt) : null);
                    return created && (new Date() - created) / 86400000 > 3;
                });
                
                // 3. TODAY: tasks due today
                const todayTasks = allTasks.filter(t => t.deadlineDate === todayStr && t.status !== 'done');
                
                // 4. ON REVIEW: waiting for approval
                const onReview = allTasks.filter(t => t.status === 'review');
                
                // 5. PEOPLE STATUS
                const peopleStats = users.map(u => {
                    const ut = allTasksWithDone.filter(t => t.assigneeId === u.id);
                    const uOverdue = ut.filter(t => t.deadlineDate && t.deadlineDate < todayStr && t.status !== 'done' && t.status !== 'review').length;
                    const uActive = ut.filter(t => t.status !== 'done').length;
                    const uDone = ut.filter(t => t.status === 'done').length;
                    const uToday = ut.filter(t => t.deadlineDate === todayStr && t.status !== 'done').length;
                    return { ...u, overdue: uOverdue, active: uActive, done: uDone, today: uToday };
                }).filter(u => u.active > 0 || u.overdue > 0).sort((a,b) => b.overdue - a.overdue);
                
                // 6. REGULAR TASKS completion rate (today)
                const todayDow = new Date().getDay().toString();
                const todaysRegular = regularTasks.filter(rt => {
                    if (rt.period === 'daily') return true;
                    if (rt.period === 'weekly' && rt.daysOfWeek?.includes(todayDow)) return true;
                    if (rt.period === 'monthly' && parseInt(rt.dayOfMonth) === new Date().getDate()) return true;
                    return false;
                });
                const regDone = todaysRegular.filter(rt => {
                    return tasks.some(t => t.regularTaskId === rt.id && t.deadlineDate === todayStr && t.status === 'done');
                }).length;
                
                // Overall health score
                const healthScore = overdue.length === 0 && stuck.length === 0 ? 'green' : 
                    critical.length > 0 ? 'red' : 'yellow';
                const healthIcon = healthScore === 'green' ? 'check-circle' : healthScore === 'red' ? 'alert-octagon' : 'alert-triangle';
                const healthColor = healthScore === 'green' ? '#16a34a' : healthScore === 'red' ? '#ef4444' : '#f59e0b';
                const healthText = healthScore === 'green' ? (t('allGood')) : 
                    healthScore === 'red' ? (t('attentionRequired')) : (t('warningIssues'));

                content.innerHTML = `
                    <div style="margin-bottom:1rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem;background:${healthColor}15;border-radius:10px;border-left:4px solid ${healthColor};">
                            <i data-lucide="${healthIcon}" class="icon" style="color:${healthColor};width:28px;height:28px;flex-shrink:0;"></i>
                            <div>
                                <div style="font-weight:700;font-size:1rem;color:${healthColor};">${healthText}</div>
                                <div style="font-size:0.78rem;color:#6b7280;">${overdue.length} ${t('overdueStatus')} · ${todayTasks.length} ${t('forToday')} · ${onReview.length} ${t('statusOnReview')}</div>
                            </div>
                        </div>
                    </div>
                    
                    ${critical.length > 0 ? `
                    <div style="background:#fef2f2;border-radius:10px;padding:0.75rem;margin-bottom:0.75rem;">
                        <div style="font-weight:700;color:#dc2626;margin-bottom:0.4rem;"><i data-lucide="alert-octagon" class="icon icon-sm"></i> ${t('criticalOverdue')} (7+ ${t('daysAgo')})</div>
                        ${critical.slice(0,5).map(tk => `<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.82rem;border-bottom:1px solid #fecaca;cursor:pointer;" onclick="openTaskModal('${escId(tk.id)}')">
                            <span style="font-weight:500;">${esc(tk.title)}</span>
                            <span style="color:#9ca3af;white-space:nowrap;margin-left:0.5rem;">${esc(tk.assigneeName || '')} · ${tk.deadlineDate}</span>
                        </div>`).join('')}
                        ${critical.length > 5 ? `<div style="font-size:0.75rem;color:#9ca3af;padding-top:0.3rem;">+${critical.length-5}...</div>` : ''}
                    </div>` : ''}
                    
                    ${warning.length > 0 ? `
                    <div style="background:#fffbeb;border-radius:10px;padding:0.75rem;margin-bottom:0.75rem;">
                        <div style="font-weight:700;color:#b45309;margin-bottom:0.4rem;"><i data-lucide="alert-triangle" class="icon icon-sm"></i> ${t('overdueStatus')} (3-7 ${t('daysAgo')})</div>
                        ${warning.slice(0,5).map(tk => `<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.82rem;border-bottom:1px solid #fde68a;cursor:pointer;" onclick="openTaskModal('${escId(tk.id)}')">
                            <span style="font-weight:500;">${esc(tk.title)}</span>
                            <span style="color:#9ca3af;white-space:nowrap;margin-left:0.5rem;">${esc(tk.assigneeName || '')} · ${tk.deadlineDate}</span>
                        </div>`).join('')}
                    </div>` : ''}
                    
                    ${stuck.length > 0 ? `
                    <div style="background:#eef2ff;border-radius:10px;padding:0.75rem;margin-bottom:0.75rem;">
                        <div style="font-weight:700;color:#4338ca;margin-bottom:0.4rem;"><i data-lucide="pause-circle" class="icon icon-sm"></i> ${t('notStarted')} (3+ ${t('daysAgo')})</div>
                        ${stuck.slice(0,5).map(tk => `<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.82rem;border-bottom:1px solid #c7d2fe;cursor:pointer;" onclick="openTaskModal('${escId(tk.id)}')">
                            <span style="font-weight:500;">${esc(tk.title)}</span>
                            <span style="color:#9ca3af;white-space:nowrap;margin-left:0.5rem;">${esc(tk.assigneeName || '')}</span>
                        </div>`).join('')}
                    </div>` : ''}
                    
                    ${onReview.length > 0 ? `
                    <div style="background:#f5f3ff;border-radius:10px;padding:0.75rem;margin-bottom:0.75rem;">
                        <div style="font-weight:700;color:#7c3aed;margin-bottom:0.4rem;"><i data-lucide="eye" class="icon icon-sm"></i> ${t('statusOnReview')} (${onReview.length})</div>
                        ${onReview.slice(0,5).map(tk => `<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.82rem;border-bottom:1px solid #ddd6fe;cursor:pointer;" onclick="openTaskModal('${escId(tk.id)}')">
                            <span style="font-weight:500;">${esc(tk.title)}</span>
                            <span style="color:#9ca3af;white-space:nowrap;margin-left:0.5rem;">${esc(tk.assigneeName || '')}</span>
                        </div>`).join('')}
                    </div>` : ''}
                    
                    <div style="background:#f9fafb;border-radius:10px;padding:0.75rem;margin-bottom:0.75rem;">
                        <div style="font-weight:700;color:#374151;margin-bottom:0.5rem;"><i data-lucide="users" class="icon icon-sm"></i> ${t('teamStatus')}</div>
                        ${peopleStats.map(p => `
                        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;font-size:0.82rem;border-bottom:1px solid #e5e7eb;">
                            <span style="width:6px;height:6px;border-radius:50%;background:${p.overdue > 0 ? '#ef4444' : '#16a34a'};flex-shrink:0;"></span>
                            <span style="flex:1;font-weight:500;">${esc(p.name || p.email)}</span>
                            <span style="color:#6b7280;">${p.today} ${t('forToday')}</span>
                            ${p.overdue > 0 ? `<span style="color:#ef4444;font-weight:600;">${p.overdue} !</span>` : ''}
                        </div>`).join('')}
                    </div>
                    
                    ${todaysRegular.length > 0 ? `
                    <div style="background:#f0fdf4;border-radius:10px;padding:0.75rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                            <span style="font-weight:700;color:#374151;"><i data-lucide="repeat" class="icon icon-sm"></i> ${t('tabRegular')} ${t('forToday')}</span>
                            <span style="font-size:0.85rem;font-weight:600;color:${regDone === todaysRegular.length ? '#16a34a' : '#f59e0b'};">${regDone}/${todaysRegular.length}</span>
                        </div>
                        <div style="height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden;">
                            <div style="height:100%;width:${todaysRegular.length > 0 ? Math.round(regDone/todaysRegular.length*100) : 0}%;background:#16a34a;border-radius:3px;transition:width 0.3s;"></div>
                        </div>
                    </div>` : ''}
                `;
            } else if (viewType === 'workload') {
                // Group tasks by assignee
                const wl = {};
                filteredTasks.forEach(task => { 
                    const key = task.assigneeId || 'unassigned';
                    const name = task.assigneeName || t('notAssigned');
                    if (!wl[key]) wl[key] = { name, tasks: [] };
                    wl[key].tasks.push(task);
                });
                
                content.innerHTML = `
                    <h3 style="margin-bottom:1rem;">${t('employeeWorkload')}</h3>
                    ${Object.entries(wl).sort((a,b) => b[1].tasks.length - a[1].tasks.length).map(([id, data]) => {
                        const c = data.tasks.length;
                        const tasksList = data.tasks.map(t => {
                            const deadline = t.deadlineDate || '';
                            const isOverdue = deadline && deadline < getLocalDateStr();
                            return `
                                <div class="control-task-item ${isOverdue ? 'overdue' : ''}" onclick="openTaskModal('${escId(t.id)}')">
                                    <span class="task-title">${esc(t.title)} ${getEscalationBadgeHtml(t)}</span>
                                    <span class="task-meta">
                                        ${t.function ? `<span class="task-func">${esc(t.function)}</span>` : ''}
                                        ${deadline ? `<span class="task-date ${isOverdue ? 'overdue' : ''}">${deadline}</span>` : ''}
                                    </span>
                                </div>
                            `;
                        }).join('');
                        
                        return `
                            <div class="control-row" onclick="this.classList.toggle('expanded')">
                                <div class="control-row-header">
                                    <span><i data-lucide="user" class="icon icon-sm"></i> ${esc(data.name)}</span>
                                    <span class="control-row-count" style="color:${c > 5 ? '#e74c3c' : '#27ae60'};">${c} ${t('tasks')} <i data-lucide="chevron-down" class="icon icon-sm expand-icon"></i></span>
                                </div>
                                <div class="control-row-tasks">${tasksList}</div>
                            </div>
                        `;
                    }).join('') || `<p style="color:#7f8c8d;">${t('noActiveTasks')}</p>`}
                `;
            } else if (viewType === 'functions') {
                const byFunc = {};
                filteredTasks.forEach(task => { 
                    const fn = task.function || t('noFunction');
                    if (!byFunc[fn]) byFunc[fn] = [];
                    byFunc[fn].push(task);
                });
                
                content.innerHTML = `
                    <h3 style="margin-bottom:1rem;">${t('byFunctions')}</h3>
                    ${Object.entries(byFunc).sort((a,b) => b[1].length - a[1].length).map(([fn, taskList]) => {
                        const c = taskList.length;
                        const tasksHTML = taskList.map(t => {
                            const deadline = t.deadlineDate || '';
                            const isOverdue = deadline && deadline < getLocalDateStr();
                            return `
                                <div class="control-task-item ${isOverdue ? 'overdue' : ''}" onclick="event.stopPropagation(); openTaskModal('${escId(t.id)}')">
                                    <span class="task-title">${esc(t.title)} ${getEscalationBadgeHtml(t)}</span>
                                    <span class="task-meta">
                                        ${t.assigneeName ? `<span class="task-assignee">${esc(t.assigneeName)}</span>` : ''}
                                        ${deadline ? `<span class="task-date ${isOverdue ? 'overdue' : ''}">${deadline}</span>` : ''}
                                    </span>
                                </div>
                            `;
                        }).join('');
                        
                        return `
                            <div class="control-row" onclick="this.classList.toggle('expanded')">
                                <div class="control-row-header">
                                    <span><i data-lucide="settings" class="icon icon-sm"></i> ${esc(fn)}</span>
                                    <span class="control-row-count" style="color:#3498db;">${c} ${t('tasks')} <i data-lucide="chevron-down" class="icon icon-sm expand-icon"></i></span>
                                </div>
                                <div class="control-row-tasks">${tasksHTML}</div>
                            </div>
                        `;
                    }).join('') || `<p style="color:#7f8c8d;">${t('noActiveTasks')}</p>`}
                `;
            } else if (viewType === 'pipeline') {
                // Delegation Pipeline
                const todayStr = getLocalDateStr(new Date());
                const allVisible = tasks.filter(task => {
                    if (!isTaskVisibleToUser(task)) return false;
                    if (af && task.assigneeId !== af) return false;
                    if (ff && task.function !== ff) return false;
                    return true;
                });

                const statuses = [
                    { key: 'new', label: t('statusNew'), color: '#3b82f6', bg: '#eff6ff' },
                    { key: 'progress', label: t('inProgressStatus'), color: '#f59e0b', bg: '#fefce8' },
                    { key: 'review', label: t('statusOnReview'), color: '#8b5cf6', bg: '#f5f3ff' },
                    { key: 'done', label: t('statusDone'), color: '#16a34a', bg: '#f0fdf4' }
                ];

                const byPerson = {};
                allVisible.forEach(task => {
                    const uid = task.assigneeId || 'unassigned';
                    const name = task.assigneeName || t('notAssigned');
                    if (!byPerson[uid]) byPerson[uid] = { name, new: [], progress: [], review: [], done: [] };
                    if (byPerson[uid][task.status]) byPerson[uid][task.status].push(task);
                });

                content.innerHTML = `
                    <h3 style="margin-bottom:1rem;">${t('delegationPipeline')}</h3>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-bottom:1.5rem;text-align:center;">
                        ${statuses.map(s => {
                            const cnt = allVisible.filter(t => t.status === s.key).length;
                            return `<div style="background:${s.bg};padding:0.6rem;border-radius:8px;">
                                <div style="font-size:1.4rem;font-weight:700;color:${s.color};">${cnt}</div>
                                <div style="font-size:0.72rem;color:#6b7280;">${s.label}</div>
                            </div>`;
                        }).join('')}
                    </div>
                    ${Object.entries(byPerson).sort((a,b) => {
                        const aAct = a[1].new.length + a[1].progress.length + a[1].review.length;
                        const bAct = b[1].new.length + b[1].progress.length + b[1].review.length;
                        return bAct - aAct;
                    }).map(([uid, data]) => {
                        const doneCount = data.done.length;
                        const doneClean = data.done.filter(t => !t.reviewRejectedAt).length;
                        const autonomy = doneCount > 0 ? Math.round(doneClean / doneCount * 100) : 0;
                        const autoColor = autonomy >= 80 ? '#16a34a' : autonomy >= 50 ? '#f59e0b' : '#ef4444';
                        const overdue = [...data.new, ...data.progress].filter(t => t.deadlineDate && t.deadlineDate < todayStr).length;
                        const returned = [...data.progress, ...data.done].filter(t => t.reviewRejectedAt).length;

                        return `
                        <div class="control-row" onclick="this.classList.toggle('expanded')" style="margin-bottom:0.5rem;">
                            <div class="control-row-header" style="flex-wrap:wrap;gap:0.4rem;">
                                <span><i data-lucide="user" class="icon icon-sm"></i> ${esc(data.name)}</span>
                                <div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap;">
                                    ${overdue > 0 ? `<span style="background:#fef2f2;color:#ef4444;padding:2px 8px;border-radius:10px;font-size:0.72rem;font-weight:600;display:inline-flex;align-items:center;gap:2px;"><i data-lucide="alert-triangle" class="icon icon-sm"></i> ${overdue}</span>` : ''}
                                    ${returned > 0 ? `<span style="background:#fffbeb;color:#b45309;padding:2px 8px;border-radius:10px;font-size:0.72rem;display:inline-flex;align-items:center;gap:2px;"><i data-lucide="rotate-ccw" class="icon icon-sm"></i> ${returned}</span>` : ''}
                                    <span style="font-weight:600;color:${autoColor};font-size:0.78rem;">${autonomy}%</span>
                                    <i data-lucide="chevron-down" class="icon icon-sm expand-icon"></i>
                                </div>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:0.3rem 0.5rem;">
                                ${statuses.map(s => `<div style="text-align:center;font-size:0.85rem;font-weight:600;color:${s.color};">${data[s.key].length}</div>`).join('')}
                            </div>
                            <div class="control-row-tasks">
                                ${statuses.filter(s => data[s.key].length > 0).map(s => `
                                    <div style="margin-bottom:0.5rem;">
                                        <div style="font-size:0.75rem;font-weight:600;color:${s.color};padding:0.3rem 0;border-bottom:2px solid ${s.color};">${s.label} (${data[s.key].length})</div>
                                        ${data[s.key].slice(0, 10).map(t => {
                                            const isOverdue = t.deadlineDate && t.deadlineDate < todayStr && s.key !== 'done';
                                            return `<div class="control-task-item ${isOverdue ? 'overdue' : ''}" onclick="event.stopPropagation();openTaskModal('${escId(t.id)}')" style="display:flex;align-items:center;gap:0.3rem;">
                                                ${t.reviewRejectedAt ? '<i data-lucide="rotate-ccw" class="icon icon-sm" style="color:#f59e0b;width:12px;height:12px;"></i>' : ''}
                                                <span class="task-title" style="flex:1;">${esc(t.title)}</span>
                                                <span style="font-size:0.7rem;color:#9ca3af;">${t.deadlineDate || ''}</span>
                                            </div>`;
                                        }).join('')}
                                        ${data[s.key].length > 10 ? `<div style="font-size:0.72rem;color:#9ca3af;padding:0.2rem;">+${data[s.key].length - 10} ${t('more')}...</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>`;
                    }).join('')}
                `;
            } else if (viewType === 'journal') {
                // Management Failures Journal
                const todayStr = getLocalDateStr(new Date());
                const allVisible = tasks.filter(task => isTaskVisibleToUser(task));
                
                // Collect auto incidents
                const incidents = [];
                
                // 1. Overdue tasks
                allVisible.filter(tk => tk.deadlineDate && tk.deadlineDate < todayStr && tk.status !== 'done').forEach(tk => {
                    const daysLate = Math.floor((new Date() - new Date(tk.deadlineDate)) / 86400000);
                    incidents.push({
                        type: 'overdue', auto: true,
                        icon: 'alert-triangle', color: '#ef4444', bg: '#fef2f2',
                        label: t('overdueStatus'),
                        title: tk.title,
                        person: tk.assigneeName || t('notAssigned'),
                        func: tk.function || '',
                        date: tk.deadlineDate,
                        detail: `${daysLate} ${t('daysAgo')}`,
                        severity: daysLate > 7 ? 3 : daysLate > 3 ? 2 : 1,
                        taskId: tk.id
                    });
                });
                
                // 2. Review returns
                allVisible.filter(tk => tk.reviewRejectedAt).forEach(tk => {
                    const rejDate = typeof tk.reviewRejectedAt === 'string' ? tk.reviewRejectedAt.substring(0,10) : 
                        tk.reviewRejectedAt?.toDate ? getLocalDateStr(tk.reviewRejectedAt.toDate()) : '';
                    incidents.push({
                        type: 'returned', auto: true,
                        icon: 'rotate-ccw', color: '#f59e0b', bg: '#fffbeb',
                        label: t('returnedFromReview'),
                        title: tk.title,
                        person: tk.assigneeName || t('notAssigned'),
                        func: tk.function || '',
                        date: rejDate,
                        detail: tk.reviewRejectReason || '',
                        severity: 1,
                        taskId: tk.id
                    });
                });
                
                // 3. Tasks stuck as 'new' for >3 days
                allVisible.filter(tk => tk.status === 'new' && tk.createdAt).forEach(tk => {
                    const created = tk.createdAt?.toDate ? tk.createdAt.toDate() : new Date(tk.createdAt);
                    const daysOld = Math.floor((new Date() - created) / 86400000);
                    if (daysOld >= 3) {
                        incidents.push({
                            type: 'stuck', auto: true,
                            icon: 'pause-circle', color: '#6366f1', bg: '#eef2ff',
                            label: t('notStarted'),
                            title: tk.title,
                            person: tk.assigneeName || t('notAssigned'),
                            func: tk.function || '',
                            date: getLocalDateStr(created),
                            detail: `${daysOld} ${t('daysAgo')}`,
                            severity: daysOld > 7 ? 2 : 1,
                            taskId: tk.id
                        });
                    }
                });
                
                // 4. Manual incidents from Firestore
                const manualIncidents = (window._manualIncidents || []).filter(mi => !mi.resolved);
                const resolvedCount = (window._manualIncidents || []).filter(mi => mi.resolved).length;
                manualIncidents.forEach(mi => {
                    const catConfig = {
                        people: { icon: 'users', color: '#dc2626', bg: '#fef2f2' },
                        process: { icon: 'git-branch', color: '#ea580c', bg: '#fff7ed' },
                        finance: { icon: 'dollar-sign', color: '#b45309', bg: '#fffbeb' },
                        clients: { icon: 'user-x', color: '#9333ea', bg: '#faf5ff' },
                        quality: { icon: 'alert-octagon', color: '#dc2626', bg: '#fef2f2' },
                        other: { icon: 'flag', color: '#6b7280', bg: '#f9fafb' }
                    };
                    const cat = catConfig[mi.category] || catConfig.other;
                    incidents.push({
                        type: 'manual', auto: false,
                        icon: cat.icon, color: cat.color, bg: cat.bg,
                        label: mi.category ? (t('cat_' + mi.category) || mi.category) : '',
                        title: mi.title,
                        person: mi.responsible || '',
                        func: '',
                        date: mi.date || '',
                        detail: mi.description || '',
                        severity: mi.severity || 1,
                        manualId: mi.id
                    });
                });
                
                // Sort: severity desc, then date desc
                incidents.sort((a,b) => b.severity - a.severity || (b.date || '').localeCompare(a.date || ''));
                
                // Stats
                const overdueCount = incidents.filter(i => i.type === 'overdue').length;
                const returnedCount = incidents.filter(i => i.type === 'returned').length;
                const stuckCount = incidents.filter(i => i.type === 'stuck').length;
                const manualCount = incidents.filter(i => i.type === 'manual').length;
                
                content.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                        <h3>${t('failureJournal')}</h3>
                        <button class="btn btn-success btn-small" onclick="toggleAddIncidentForm()">
                            <i data-lucide="plus" class="icon icon-sm"></i> ${t('addIncident')}
                        </button>
                    </div>
                    
                    <div id="addIncidentFormArea" style="display:none;margin-bottom:1rem;"></div>
                    
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-bottom:1rem;">
                        <div style="background:#fef2f2;border-radius:8px;padding:0.5rem;text-align:center;">
                            <div style="font-size:1.2rem;font-weight:700;color:#ef4444;">${overdueCount}</div>
                            <div style="font-size:0.68rem;color:#6b7280;">${t('overdueStatus')}</div>
                        </div>
                        <div style="background:#fffbeb;border-radius:8px;padding:0.5rem;text-align:center;">
                            <div style="font-size:1.2rem;font-weight:700;color:#f59e0b;">${returnedCount}</div>
                            <div style="font-size:0.68rem;color:#6b7280;">${t('returnedFromReview')}</div>
                        </div>
                        <div style="background:#eef2ff;border-radius:8px;padding:0.5rem;text-align:center;">
                            <div style="font-size:1.2rem;font-weight:700;color:#6366f1;">${stuckCount}</div>
                            <div style="font-size:0.68rem;color:#6b7280;">${t('notStarted')}</div>
                        </div>
                        <div style="background:#faf5ff;border-radius:8px;padding:0.5rem;text-align:center;">
                            <div style="font-size:1.2rem;font-weight:700;color:#9333ea;">${manualCount}</div>
                            <div style="font-size:0.68rem;color:#6b7280;">${t('manualIncidents')}</div>
                        </div>
                    </div>
                    ${resolvedCount > 0 ? `<div style="font-size:0.75rem;color:#16a34a;margin-bottom:0.5rem;"><i data-lucide="check-circle" class="icon icon-sm"></i> ${resolvedCount} ${t('resolvedIncidents')}</div>` : ''}
                    
                    ${incidents.length === 0 ? `<div style="text-align:center;padding:2rem;color:#9ca3af;"><i data-lucide="check-circle" class="icon" style="width:48px;height:48px;color:#16a34a;"></i><p style="margin-top:0.5rem;">${t('noIncidents')}</p></div>` : ''}
                    
                    ${incidents.map(inc => `
                        <div style="display:flex;gap:0.6rem;padding:0.6rem;margin-bottom:0.3rem;background:${inc.bg};border-radius:8px;border-left:4px solid ${inc.color};">
                            <div style="flex-shrink:0;padding-top:2px;"><i data-lucide="${inc.icon}" class="icon icon-sm" style="color:${inc.color};"></i></div>
                            <div style="flex:1;min-width:0;${inc.taskId ? 'cursor:pointer;' : ''}" ${inc.taskId ? `onclick="openTaskModal('${escId(inc.taskId)}')"` : ''}>
                                <div style="display:flex;justify-content:space-between;gap:0.3rem;">
                                    <span style="font-weight:600;font-size:0.85rem;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(inc.title)}</span>
                                    <span style="font-size:0.7rem;color:#9ca3af;white-space:nowrap;">${inc.date}</span>
                                </div>
                                <div style="display:flex;gap:0.5rem;font-size:0.75rem;color:#6b7280;margin-top:2px;">
                                    <span>${esc(inc.person)}</span>
                                    ${inc.func ? `<span>· ${esc(inc.func)}</span>` : ''}
                                    ${inc.detail ? `<span style="color:${inc.color};font-weight:500;">· ${esc(inc.detail)}</span>` : ''}
                                    ${!inc.auto ? `<span style="background:#e0e7ff;color:#4338ca;padding:0 4px;border-radius:3px;font-size:0.65rem;">${t('manual')}</span>` : ''}
                                </div>
                            </div>
                            ${inc.manualId ? `<button onclick="resolveIncident('${escId(inc.manualId)}')" style="background:none;border:none;cursor:pointer;color:#16a34a;padding:4px;flex-shrink:0;" title="${t('markResolved')}"><i data-lucide="check-circle" class="icon icon-sm"></i></button>` : ''}
                        </div>
                    `).join('')}
                `;
            }
            
            refreshIcons();
        }
        
        function clearControlFilters() {
            document.getElementById('controlAssigneeFilter').value = '';
            document.getElementById('controlFunctionFilter').value = '';
            document.getElementById('controlPeriodFilter').value = '';
            renderControl();
        }
        
        function clearRegularFilters() {
            document.getElementById('regularAssigneeFilter').value = '';
            document.getElementById('regularFunctionFilter').value = '';
            document.getElementById('regularDayFilter').value = '';
            applyRegularFilters();
        }
