// =====================
        // HELPERS
        // =====================
'use strict';
        let _selectsUsersHash = '';
        let _selectsFuncsHash = '';
        
        function updateSelects(force) {
            const uHash = users.map(u => u.id).join(',');
            const fHash = functions.filter(f => f.status !== 'archived').map(f => f.name).join(',');
            if (!force && uHash === _selectsUsersHash && fHash === _selectsFuncsHash) return;
            _selectsUsersHash = uHash;
            _selectsFuncsHash = fHash;
            
            const tf = document.getElementById('taskFunction');
            const ta = document.getElementById('taskAssignee');
            const ff = document.getElementById('functionFilter');
            const af = document.getElementById('assigneeFilter');
            const raf = document.getElementById('regularAssigneeFilter');
            const rff = document.getElementById('regularFunctionFilter');
            const caf = document.getElementById('calendarAssigneeFilter');
            const cff = document.getElementById('calendarFunctionFilter');
            const paf = document.getElementById('processAssigneeFilter');
            
            // Фільтруємо архівовані функції
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            
            if (tf) tf.innerHTML = `<option value="">${t('noFunction')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
            if (ta) {
                let usersList = users.length > 0 ? users : [];
                // Employee always sees self in assignee list
                if (currentUser && usersList.length === 0) {
                    usersList = [{ id: currentUser.uid, name: currentUserData?.name || currentUser.email }];
                }
                // For employees: show self first, then others from same functions
                if (currentUserData?.role === 'employee' && usersList.length > 0) {
                    const selfUser = usersList.find(u => u.id === currentUser?.uid);
                    const others = usersList.filter(u => u.id !== currentUser?.uid);
                    const reordered = selfUser ? [selfUser, ...others] : usersList;
                    ta.innerHTML = `<option value="">${t('select')}</option>` + reordered.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
                } else {
                    ta.innerHTML = `<option value="">${t('select')}</option>` + usersList.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
                }
            }
            if (ff) ff.innerHTML = `<option value="">${t('allFunctions')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
            if (af) af.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            if (raf) raf.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            if (rff) rff.innerHTML = `<option value="">${t('allFunctions')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
            if (caf) caf.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            if (cff) cff.innerHTML = `<option value="">${t('allFunctions')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
            if (paf) paf.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            const rta = document.getElementById('regularTaskAssignee');
            if (rta) rta.innerHTML = `<option value="">${t('fromFunctionAuto')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            // P2 FIX: відновлюємо збережені фільтри після заповнення selectів
            try {
                const saved = JSON.parse(sessionStorage.getItem('talko_filters') || '{}');
                if (saved.assignee && af) af.value = saved.assignee;
                if (saved.function && ff) ff.value = saved.function;
                if (saved.date) {
                    const dfEl = document.getElementById('dateFilter');
                    if (dfEl) dfEl.value = saved.date;
                }
            } catch(e) {}
        }

        function formatDate(s) {
            const d = new Date(s);
            return d.toLocaleDateString(getLocale(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        }

        // More tabs dropdown
        // Nav dropdowns (Система / Аналітика / Завдання)
        function toggleNavDropdown(menuId, wrapperId, e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById(menuId);
            if (!menu) return;
            const isOpen = menu.style.display === 'block';
            closeNavDropdowns();
            if (isOpen) return;
            if (menu.parentElement !== document.body) {
                document.body.appendChild(menu);
            }
            const btn = (e && e.currentTarget) || document.getElementById(wrapperId);
            menu.style.display = 'block';
            if (btn) {
                const rect = btn.getBoundingClientRect();
                const menuW = menu.offsetWidth || 180;
                let left = rect.left;
                if (left + menuW > window.innerWidth - 8) left = window.innerWidth - menuW - 8;
                if (left < 8) left = 8;
                menu.style.position = 'fixed';
                menu.style.top = (rect.bottom + 4) + 'px';
                menu.style.left = left + 'px';
            }
        }
        function closeNavDropdowns() {
            ['tasksTabMenu','sysTabMenu','analyticsTabMenu'].forEach(function(id) {
                const m = document.getElementById(id);
                if (m) m.style.display = 'none';
            });
        }
        // Закриваємо при будь-якому кліку — якщо клік на toggle-кнопку, toggleNavDropdown сам відкриє
        document.addEventListener('click', function(e) {
            const toggleBtns = ['tasksTabBtn','analyticsTabBtn','sysTabBtn'];
            const isToggle = toggleBtns.some(function(id) {
                const el = document.getElementById(id);
                return el && el.contains(e.target);
            });
            if (!isToggle) closeNavDropdowns();
        });
        // Закриваємо при скролі
        document.addEventListener('scroll', function() { closeNavDropdowns(); }, true);
        window.addEventListener('scroll', function() { closeNavDropdowns(); }, true);
        window.toggleNavDropdown = toggleNavDropdown;
        window.closeNavDropdowns = closeNavDropdowns;

        // Зворотна сумісність (старі виклики)
        function toggleMoreTabs(e) { }
        function closeMoreTabs() { closeNavDropdowns(); }
        window.toggleMoreTabs = toggleMoreTabs;
        window.closeMoreTabs = closeMoreTabs;

        // ── Tab Handlers Registry (замість chain перехоплень модулів) ──
        window._tabHandlers = window._tabHandlers || {};
        window.onSwitchTab = function(tabName, fn) {
            if (!window._tabHandlers[tabName]) window._tabHandlers[tabName] = [];
            // Запобігаємо дублікатам одного і того ж handler
            if (!window._tabHandlers[tabName].includes(fn)) {
                window._tabHandlers[tabName].push(fn);
            }
        };

        // Видаляє конкретний handler
        window.offSwitchTab = function(tabName, fn) {
            if (!window._tabHandlers[tabName]) return;
            window._tabHandlers[tabName] = window._tabHandlers[tabName].filter(f => f !== fn);
        };

        // Очищає ВСІ handlers — викликати при logout для запобігання memory leak
        window.clearSwitchTabHandlers = function() {
            window._tabHandlers = {};
        };

        // ── TALKO.nav namespace ──────────────────────────────────
        if (window.TALKO) {
            window.TALKO.nav = {
                switchTab:       switchTab,
                onSwitchTab:     window.onSwitchTab,
                closeDropdowns:  closeNavDropdowns,
            };
        }
        
        function switchTab(tabName) {
            // Зберігаємо активний таб для відновлення після F5
            try { sessionStorage.setItem('talko_last_tab', tabName); } catch(e) {}
            // Закриваємо всі nav-dropdown при будь-якому переході
            if (typeof closeNavDropdowns === 'function') closeNavDropdowns();
            // Reset project detail when leaving projects tab
            if (tabName !== 'projects' && openProjectId) {
                openProjectId = null;
            }
            
            document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
            var tabEl = document.getElementById(tabName + 'Tab'); if (tabEl) tabEl.classList.add('active');
            // Find matching tab button (including inside dropdown)
            // Find matching tab button — нормалізуємо пробіли в onclick для надійності
            var matchBtn = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
            if (!matchBtn) {
                // Шукаємо серед всіх tab-btn з closeMoreTabs (dropdown)
                document.querySelectorAll('.tab-btn').forEach(function(btn) {
                    var oc = (btn.getAttribute('onclick') || '').replace(/\s/g, '');
                    if (oc === `switchTab('${tabName}');closeMoreTabs();` || oc === `switchTab('${tabName}');closeMoreTabs()`) {
                        matchBtn = btn;
                    }
                });
            }
            if (matchBtn) matchBtn.classList.add('active');
            // Highlight "Ще" if secondary tab is active
            // Підсвічуємо кнопку групи якщо активна її вкладка
            // Підсвічування dropdown-батьків по новій структурі меню
            var tasksTabs    = ['tasks','regular'];
            var analyticsTabs = ['statistics','analytics','ownerDashboard'];
            var sysTabs      = ['functions','bizstructure','users','admin','learning'];

            var tasksBtn     = document.getElementById('tasksTabBtn');
            var analyticsBtn = document.getElementById('analyticsTabBtn');
            var sysBtn       = document.getElementById('sysTabBtn');

            if (tasksBtn)     tasksBtn.classList.toggle('active', tasksTabs.includes(tabName));
            if (analyticsBtn) analyticsBtn.classList.toggle('active', analyticsTabs.includes(tabName));
            if (sysBtn)       sysBtn.classList.toggle('active', sysTabs.includes(tabName));

            // Пошук також через closeNavDropdowns (нова система)
            if (!matchBtn) {
                document.querySelectorAll('.tab-btn').forEach(function(btn) {
                    var oc = (btn.getAttribute('onclick') || '').replace(/\s/g,'');
                    if (oc === 'switchTab(\'' + tabName + '\');closeNavDropdowns();') matchBtn = btn;
                });
            }
            
            // Update bottom nav
            document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tabName) btn.classList.add('active');
                // Підсвічуємо "Ще" якщо активна secondary вкладка
                if (btn.dataset.tab === 'more' && ['projects','processes','regular','users','functions','bizstructure','analytics','admin'].includes(tabName)) {
                    btn.classList.add('active');
                }
            });
            
            // Update FAB
            updateFab(tabName);
            
            // Scroll to top при переключенні вкладок
            window.scrollTo(0, 0);
            const mainEl = document.getElementById('mainInterface');
            if (mainEl) mainEl.scrollTop = 0;
            
            switch (tabName) {
                case 'myday': renderMyDay(); break;
                case 'tasks': setCalendarView(currentCalendarView); break;
                case 'control': renderControl(); break;
                case 'processes': updateProcessTemplateFilter(); renderProcessBoard(); break;
                case 'projects': renderProjects(); break;
                case 'regular': if (currentRegularView === 'list') renderRegularTasks(); else renderRegularWeekView(); break;
                case 'functions': renderFunctions(); if (currentFunctionsView === 'structure') renderFunctionsStructure(); break;
                case 'users': renderUsers(); break;
                case 'analytics': renderAnalytics(); break;
                case 'statistics': renderStatistics(); break;
                case 'admin': renderAdminPanel(); break;
                case 'bizstructure': if (typeof showBizStructureTab === 'function') showBizStructureTab(); break;
                case 'ownerDashboard': if (typeof renderOwnerDashboard === 'function') renderOwnerDashboard(); break;
                case 'learning': if (typeof window.initLearning === 'function') window.initLearning(); break;
                case 'marketing': if (typeof window.initLandingPagesModule === 'function') window.initLandingPagesModule(); break;
                case 'sites': if (typeof window.initSitesModule === 'function') window.initSitesModule(); break;
                case 'integrations': if (typeof window.initIntegrationsModule === 'function') window.initIntegrationsModule(); break;
            }
            
            updateOverdueBadges();

            // ── Зовнішні обробники (замість chain перехоплень) ──
            if (window._tabHandlers) {
                var handlers = window._tabHandlers[tabName] || [];
                handlers.forEach(function(fn) { try { fn(); } catch(e) { console.error('[switchTab handler]', tabName, e); } });
            }

            // ── Bottom nav sync (mobile) — вбудовано тут, не треба override ──
            document.querySelectorAll('.bottom-nav-btn').forEach(function(btn) {
                btn.classList.toggle('active', btn.dataset.tab === tabName);
            });
        }
        
        function updateOverdueBadges() {
            const todayStr = getLocalDateStr(new Date());
            const overdue = tasks.filter(t => t.deadlineDate && t.deadlineDate < todayStr && t.status !== 'done' && isTaskVisibleToUser(t)).length;
            const onReview = tasks.filter(t => t.status === 'review' && isTaskVisibleToUser(t)).length;
            
            // Control tab badge
            const controlBtn = document.querySelector("[onclick=\"switchTab('control')\"]");
            if (controlBtn) {
                let badge = controlBtn.querySelector('.tab-badge');
                if (overdue > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'tab-badge';
                        badge.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;border-radius:8px;background:#ef4444;color:white;font-size:0.6rem;font-weight:700;margin-left:4px;padding:0 4px;';
                        controlBtn.appendChild(badge);
                    }
                    badge.textContent = overdue;
                } else if (badge) badge.remove();
            }
            
            // My Day badge (review tasks)
            const mydayBtn = document.querySelector("[onclick=\"switchTab('myday')\"]");
            if (mydayBtn) {
                let badge = mydayBtn.querySelector('.tab-badge');
                if (onReview > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'tab-badge';
                        badge.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;border-radius:8px;background:#8b5cf6;color:white;font-size:0.6rem;font-weight:700;margin-left:4px;padding:0 4px;';
                        mydayBtn.appendChild(badge);
                    }
                    badge.textContent = onReview;
                } else if (badge) badge.remove();
            }
            
            // Mobile bottom nav badges
            document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
                let badge = btn.querySelector('.tab-badge');
                if (btn.dataset.tab === 'control' && overdue > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'tab-badge';
                        badge.style.cssText = 'position:absolute;top:2px;right:8px;min-width:14px;height:14px;border-radius:7px;background:#ef4444;color:white;font-size:0.55rem;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px;';
                        btn.style.position = 'relative';
                        btn.appendChild(badge);
                    }
                    badge.textContent = overdue;
                } else if (badge && (btn.dataset.tab === 'control')) {
                    badge.remove();
                }
            });
        }
        
        function updateFab(tabName) {
            const fab = document.getElementById('fabAdd');
            if (!fab) return;
            
            if (tabName === 'tasks' || tabName === 'myday') {
                fab.style.display = 'flex';
                fab.setAttribute('aria-label', t('addTask'));
                fab.setAttribute('title', t('addTask'));
                fab.onclick = () => openTaskModal();
            } else if (tabName === 'regular') {
                fab.style.display = 'flex';
                fab.setAttribute('aria-label', t('addRegularTask'));
                fab.setAttribute('title', t('addRegularTask'));
                fab.onclick = () => openRegularTaskModal();
            } else if (tabName === 'projects') {
                fab.style.display = 'flex';
                fab.setAttribute('aria-label', t('newProject'));
                fab.setAttribute('title', t('newProject'));
                fab.onclick = () => openProjectModal();
            } else {
                fab.style.display = 'none';
            }
        }
        
        // Дефолтний FAB обробник при завантаженні (до першого switchTab)
        (function initFabDefault() {
            const fab = document.getElementById('fabAdd');
            if (fab && !fab.onclick) fab.onclick = () => openTaskModal();
        })();

        function toggleTaskAdvanced() {
            const panel = document.getElementById('taskAdvancedPanel');
            const arrow = document.getElementById('taskAdvancedArrow');
            if (!panel) return;
            const isOpen = panel.style.display !== 'none';
            panel.style.display = isOpen ? 'none' : 'contents';
            if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
        }
        
        function renderAnalytics() {
            const visibleTasks = tasks.filter(t => isTaskVisibleToUser(t));
            const totalTasks = visibleTasks.length;
            const completedTasks = visibleTasks.filter(t => t.status === 'done').length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            document.getElementById('analyticsTotalTasks').textContent = totalTasks;
            document.getElementById('analyticsCompletedTasks').textContent = completedTasks;
            document.getElementById('analyticsCompletionRate').textContent = completionRate + '%';
            
            // Середній час виконання
            let totalTime = 0;
            let countWithTime = 0;
            visibleTasks.forEach(task => {
                if (task.estimatedTime) {
                    totalTime += parseInt(task.estimatedTime);
                    countWithTime++;
                }
            });
            const avgTime = countWithTime > 0 ? Math.round(totalTime / countWithTime) : 0;
            const avgHours = Math.floor(avgTime / 60);
            const avgMins = avgTime % 60;
            document.getElementById('analyticsAvgTime').textContent = avgTime > 0 ? `${avgHours > 0 ? avgHours + t('hourShortG') + ' ' : ''}${avgMins}${t('minShortM')}` : '-';
            
            // Статистика по статусах
            const byStatus = {
                new: visibleTasks.filter(task => task.status === 'new').length,
                progress: visibleTasks.filter(task => task.status === 'progress').length,
                review: visibleTasks.filter(task => task.status === 'review').length,
                done: visibleTasks.filter(task => task.status === 'done').length
            };
            
            // Прострочені
            const today = new Date();
            const todayStr = getLocalDateStr(today);
            const overdueTasks = visibleTasks.filter(task => {
                const taskDate = parseDeadline(task).date;
                return taskDate && taskDate < todayStr && task.status !== 'done' && task.status !== 'review';
            });
            
            document.getElementById('analyticsContent').innerHTML = `
                ${renderWeeklyChart(visibleTasks, today)}
                
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;margin-top:1rem;">
                    ${renderStatusCard(byStatus, overdueTasks.length)}
                    ${renderTopPerformers(visibleTasks)}
                    ${renderOverdueDetails(overdueTasks)}
                    ${renderStuckProcesses()}
                    ${renderFunctionLoad(visibleTasks)}
                </div>
            `;
            refreshIcons();
        }
        
        function renderWeeklyChart(visibleTasks, today) {
            // 7 днів назад
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                days.push(getLocalDateStr(d));
            }
            const dayNames = getDayNamesShort();
            
            // Рахуємо завершені і створені по днях
            const doneByDay = {};
            const createdByDay = {};
            days.forEach(d => { doneByDay[d] = 0; createdByDay[d] = 0; });
            
            visibleTasks.forEach(t => {
                // Completed
                if (t.status === 'done' && t.completedAt) {
                    let cDate;
                    if (t.completedAt.toDate) cDate = getLocalDateStr(t.completedAt.toDate());
                    else if (typeof t.completedAt === 'string') cDate = t.completedAt.split('T')[0];
                    if (cDate && doneByDay[cDate] !== undefined) doneByDay[cDate]++;
                }
                // Created
                if (t.createdAt) {
                    let crDate;
                    if (t.createdAt.toDate) crDate = getLocalDateStr(t.createdAt.toDate());
                    else if (typeof t.createdAt === 'string') crDate = t.createdAt.split('T')[0];
                    if (crDate && createdByDay[crDate] !== undefined) createdByDay[crDate]++;
                }
            });
            
            const maxVal = Math.max(1, ...Object.values(doneByDay), ...Object.values(createdByDay));
            
            const bars = days.map(d => {
                const done = doneByDay[d] || 0;
                const created = createdByDay[d] || 0;
                const dayDate = new Date(d);
                const label = dayNames[dayDate.getDay()];
                const dateNum = dayDate.getDate();
                const isToday = d === getLocalDateStr(today);
                
                return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                    <div style="display:flex;gap:2px;align-items:flex-end;height:80px;">
                        <div style="width:14px;background:#dbeafe;border-radius:3px 3px 0 0;height:${Math.max(2, (created/maxVal)*70)}px;" title="Створено: ${created}"></div>
                        <div style="width:14px;background:#22c55e;border-radius:3px 3px 0 0;height:${Math.max(2, (done/maxVal)*70)}px;" title="Виконано: ${done}"></div>
                    </div>
                    <div style="font-size:0.65rem;color:${isToday ? '#22c55e' : '#9ca3af'};font-weight:${isToday ? '700' : '400'};">${label}</div>
                    <div style="font-size:0.7rem;color:${isToday ? '#22c55e' : '#6b7280'};font-weight:${isToday ? '700' : '500'};">${dateNum}</div>
                </div>`;
            }).join('');
            
            return `<div style="background:white;border-radius:12px;padding:1rem;border:1px solid #e5e7eb;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                    <h4 style="margin:0;font-size:0.9rem;">${t('weeklyActivity')}</h4>
                    <div style="display:flex;gap:1rem;font-size:0.7rem;">
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;background:#dbeafe;border-radius:2px;"></span> ${t('createdLabel')}</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;background:#22c55e;border-radius:2px;"></span> ${t('doneLabel')}</span>
                    </div>
                </div>
                <div style="display:flex;gap:4px;align-items:flex-end;">${bars}</div>
            </div>`;
        }
        
        function renderStatusCard(byStatus, overdueCount) {
            return `<div style="background:#f8f9fa;border-radius:12px;padding:1rem;">
                <h4 style="margin-bottom:0.75rem;">${t('byStatus')}</h4>
                <div style="display:flex;flex-direction:column;gap:0.4rem;">
                    <div style="display:flex;justify-content:space-between;"><span><i data-lucide="plus-square" class="icon icon-sm" style="color:#3498db"></i> ${t('statusNew')}</span><strong>${byStatus.new}</strong></div>
                    <div style="display:flex;justify-content:space-between;"><span><i data-lucide="loader" class="icon icon-sm" style="color:#f39c12"></i> ${t('statusProgress')}</span><strong>${byStatus.progress}</strong></div>
                    <div style="display:flex;justify-content:space-between;"><span><i data-lucide="eye" class="icon icon-sm" style="color:#9b59b6"></i> ${t('statusReview')}</span><strong>${byStatus.review}</strong></div>
                    <div style="display:flex;justify-content:space-between;"><span><i data-lucide="check-circle" class="icon icon-sm" style="color:#27ae60"></i> ${t('statusDone')}</span><strong style="color:#27ae60;">${byStatus.done}</strong></div>
                    <div style="display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:0.4rem;margin-top:0.25rem;"><span><i data-lucide="alert-triangle" class="icon icon-sm" style="color:#e74c3c"></i> ${t('overdue')}</span><strong style="color:#e74c3c;">${overdueCount}</strong></div>
                </div>
            </div>`;
        }
        
        function renderTopPerformers(visibleTasks) {
            const byAssignee = {};
            visibleTasks.filter(task => task.status === 'done').forEach(task => {
                const name = task.assigneeName || t('notAssigned');
                byAssignee[name] = (byAssignee[name] || 0) + 1;
            });
            const topAssignees = Object.entries(byAssignee).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const maxDone = topAssignees[0]?.[1] || 1;
            
            return `<div style="background:#f8f9fa;border-radius:12px;padding:1rem;">
                <h4 style="margin-bottom:0.75rem;"><i data-lucide="trophy" class="icon icon-sm" style="color:#f39c12"></i> ${t('topPerformers')}</h4>
                ${topAssignees.length > 0 ? topAssignees.map(([name, count], i) => `
                    <div style="margin-bottom:0.5rem;">
                        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:2px;">
                            <span>${i === 0 ? '<i data-lucide="medal" class="icon icon-sm" style="color:#ffd700"></i> ' : ''}${name}</span>
                            <strong style="color:#27ae60;">${count}</strong>
                        </div>
                        <div style="height:4px;background:#e5e7eb;border-radius:99px;"><div style="height:100%;width:${(count/maxDone)*100}%;background:#22c55e;border-radius:99px;"></div></div>
                    </div>
                `).join('') : `<p style="color:#7f8c8d;">${t('noCompletedTasks')}</p>`}
            </div>`;
        }
        
        function renderOverdueDetails(overdueTasks) {
            if (overdueTasks.length === 0) return '';
            
            const byPerson = {};
            overdueTasks.forEach(t => {
                const name = t.assigneeName || t('notAssigned');
                if (!byPerson[name]) byPerson[name] = [];
                byPerson[name].push(t);
            });
            
            return `<div style="background:#fef2f2;border-radius:12px;padding:1rem;border:1px solid #fecaca;">
                <h4 style="margin-bottom:0.75rem;color:#dc2626;"><i data-lucide="alert-triangle" class="icon icon-sm"></i> ${t('overdueStatus')} (${overdueTasks.length})</h4>
                ${Object.entries(byPerson).map(([name, tasks]) => `
                    <div style="margin-bottom:0.5rem;">
                        <div style="font-size:0.8rem;font-weight:600;color:#991b1b;">${esc(name)} (${tasks.length})</div>
                        ${tasks.slice(0, 3).map(t => `
                            <div style="font-size:0.75rem;color:#7f1d1d;padding:2px 0 2px 12px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" onclick="openTaskModal('${escId(t.id)}')" title="${esc(t.title)}">
                                ${esc(t.title)} <span style="color:#dc2626;font-size:0.65rem;">${t.deadlineDate || ''}</span>
                            </div>
                        `).join('')}
                        ${tasks.length > 3 ? `<div style="font-size:0.7rem;color:#dc2626;padding-left:12px;">+${tasks.length - 3} ще...</div>` : ''}
                    </div>
                `).join('')}
            </div>`;
        }
        
        function renderStuckProcesses() {
            if (!processes || processes.length === 0) return '';
            
            const todayStr = getLocalDateStr();
            const stuck = processes.filter(p => {
                if (p.status !== 'active') return false;
                if (p.deadline && p.deadline < todayStr) return true;
                // Більше 3 днів на одному кроці
                const lastHistory = p.history?.[p.history.length - 1];
                if (lastHistory?.timestamp) {
                    const ts = lastHistory.timestamp.toDate ? lastHistory.timestamp.toDate() : new Date(lastHistory.timestamp);
                    const daysSince = (new Date() - ts) / 86400000;
                    return daysSince > 3;
                }
                return false;
            });
            
            if (stuck.length === 0) return '';
            
            return `<div style="background:#fffbeb;border-radius:12px;padding:1rem;border:1px solid #fde68a;">
                <h4 style="margin-bottom:0.75rem;color:#92400e;"><i data-lucide="pause-circle" class="icon icon-sm"></i> ${t('stuckProcesses')} (${stuck.length})</h4>
                ${stuck.slice(0, 5).map(p => {
                    const template = processTemplates.find(t => t.id === p.templateId);
                    const totalSteps = template?.steps?.length || '?';
                    const stepName = template?.steps?.[p.currentStep]?.title || template?.steps?.[p.currentStep]?.function || '';
                    return `<div style="font-size:0.8rem;padding:4px 0;border-bottom:1px solid #fef3c7;">
                        <div style="font-weight:600;color:#78350f;">${esc(p.name)}</div>
                        <div style="font-size:0.7rem;color:#92400e;">Крок ${(p.currentStep||0)+1}/${totalSteps}: ${esc(stepName)}${p.deadline ? ' — дедлайн: ' + p.deadline : ''}</div>
                    </div>`;
                }).join('')}
            </div>`;
        }
        
        function renderFunctionLoad(visibleTasks) {
            const byFunc = {};
            visibleTasks.filter(t => t.function && t.status !== 'done').forEach(t => {
                if (!byFunc[t.function]) byFunc[t.function] = { active: 0, overdue: 0 };
                byFunc[t.function].active++;
                const taskDate = parseDeadline(t).date;
                const todayStr = getLocalDateStr();
                if (taskDate && taskDate < todayStr) byFunc[t.function].overdue++;
            });
            
            const entries = Object.entries(byFunc).sort((a, b) => b[1].active - a[1].active).slice(0, 6);
            if (entries.length === 0) return '';
            const maxActive = entries[0]?.[1]?.active || 1;
            
            return `<div style="background:#f8f9fa;border-radius:12px;padding:1rem;">
                <h4 style="margin-bottom:0.75rem;"><i data-lucide="layers" class="icon icon-sm" style="color:#6366f1"></i> ${t('workloadByFunctions')}</h4>
                ${entries.map(([name, data]) => `
                    <div style="margin-bottom:0.5rem;">
                        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:2px;">
                            <span>${esc(name)}</span>
                            <span>${data.active}${data.overdue ? ` <span style="color:#ef4444;font-size:0.7rem;">(${data.overdue} ${t('overdueShort')})</span>` : ''}</span>
                        </div>
                        <div style="height:4px;background:#e5e7eb;border-radius:99px;position:relative;">
                            <div style="height:100%;width:${(data.active/maxActive)*100}%;background:#6366f1;border-radius:99px;"></div>
                            ${data.overdue ? `<div style="position:absolute;top:0;right:0;height:100%;width:${(data.overdue/maxActive)*100}%;background:#ef4444;border-radius:99px;"></div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>`;
        }

        // Модалки що мають власний editingId/editingUserId — скидаємо тільки їх
        const PRIMARY_MODALS = ['taskModal', 'userModal', 'regularTaskModal'];

        function closeModal(id) {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
            if (PRIMARY_MODALS.includes(id)) {
                editingId = null;
                editingUserId = null;
            }
            checkModalState();
        }

        // Глобальні аліаси — потрібні для superadmin та інших зовнішніх модулів
        window.closeModal = closeModal;
        window.openModal = function(id) {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        };
        
        function checkModalState() {
            const anyOpen = Array.from(document.querySelectorAll('.modal')).some(m => m.style.display === 'block');
            if (anyOpen) {
                document.body.style.overflow = 'hidden';
                if (window.innerWidth < 768) {
                    const bn = document.getElementById('bottomNav');
                    if (bn) bn.style.display = 'none';
                    const fab = document.getElementById('fabAdd');
                    if (fab) fab.style.display = 'none';
                }
            } else {
                document.body.style.overflow = '';
                if (window.innerWidth < 768) {
                    const bn = document.getElementById('bottomNav');
                    if (bn) bn.style.display = '';
                    const fab = document.getElementById('fabAdd');
                    if (fab) fab.style.display = '';
                }
            }
        }
        
        // Overdue badge
        function updateOverdueBadge() {
            const badge = document.getElementById('overdueNavBadge');
            if (!badge) return;
            const today = getLocalDateStr();
            const overdue = tasks.filter(t => {
                if (!isTaskVisibleToUser(t)) return false;
                if (t.status === 'done') return false;
                const d = parseDeadline(t).date;
                return d && d < today;
            }).length;
            if (overdue > 0) {
                badge.textContent = overdue > 99 ? '99+' : overdue;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        
        // Auto body-lock: спостерігаємо за зміною display на модалках
        const _modalObserver = new MutationObserver(() => checkModalState());
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.modal').forEach(m => {
                _modalObserver.observe(m, { attributes: true, attributeFilter: ['style'] });
            });
        });

        window.onclick = function(e) {
            // Форми з даними НЕ закриваються по кліку на overlay — тільки хрестиком
            ['functionModal', 'inviteModal', 'userModal', 'profileModal', 'processTemplatesModal', 'viewProcessModal', 'mergeFunctionsModal'].forEach(id => {
                if (e.target === document.getElementById(id)) closeModal(id);
            });
            // P2 FIX: taskModal закривається по overlay тільки якщо title порожній (новий)
            const taskModal = document.getElementById('taskModal');
            if (e.target === taskModal) {
                const titleVal = document.getElementById('taskTitle')?.value?.trim();
                if (!titleVal && !window.currentEditingId) closeModal('taskModal');
            }
        }

        // Init language on load
        // SVG Icon helper
        function icon(name, size = '') {
            const sizeClass = size ? ` icon-${size}` : '';
            return `<i data-lucide="${name}" class="icon${sizeClass}"></i>`;
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            setLanguage(currentLang);
            // Ініціалізуємо Lucide іконки
            if (typeof lucide !== 'undefined') {
                refreshIcons();
            }
        });
        
        // Переініціалізація іконок після динамічного контенту
        // Debounced refreshIcons — замість 40+ повних DOM-парсингів за секунду
        let _refreshIconsTimer = null;
        window.refreshIcons = function refreshIcons() {
            if (_refreshIconsTimer) return;
            _refreshIconsTimer = requestAnimationFrame(() => {
                _refreshIconsTimer = null;
                try {
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    } else {
                        // lucide ще не готовий — retry через 300ms
                        setTimeout(function() {
                            if (typeof window._initLucide === 'function') window._initLucide();
                            else if (typeof lucide !== 'undefined') lucide.createIcons();
                        }, 300);
                    }
                } catch(e) {}
            });
        }
        
        // Примусовий refresh (для модалок які потребують іконок зразу)
        window.refreshIconsNow = function refreshIconsNow() {
            if (_refreshIconsTimer) {
                cancelAnimationFrame(_refreshIconsTimer);
                _refreshIconsTimer = null;
            }
            try {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            } catch(e) {}
        // =====================
        // AUTH SAFETY HELPERS
        // =====================
        // Безпечний доступ до currentUser.uid — null якщо не авторизований
        window.getCurrentUid = function() {
            return (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null;
        };
        
        // Guard для функцій що потребують auth — повертає true якщо можна виконувати
        window.requireAuth = function(silent) {
            if (!currentUser || !currentCompany) {
                if (!silent) console.warn('[AUTH] Action blocked: user not authenticated');
                return false;
            }
            return true;
        };

        }
