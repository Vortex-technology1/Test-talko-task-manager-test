// =====================
        // FEAT-006: TIME TRACKING
        // =====================
'use strict';
        window.timeTrackerInterval = null;
        window.timeTrackerStart = null;
        let timeTrackerTaskId = null;
        
        function toggleTimeTracker() {
            if (!editingId) return;
            
            if (window.timeTrackerInterval) {
                // СТОП
                stopTimeTracker();
            } else {
                // СТАРТ
                window.timeTrackerStart = Date.now();
                timeTrackerTaskId = editingId;
                const btn = document.getElementById('timeTrackBtn');
                btn.style.background = '#ef4444';
                btn.innerHTML = '<i data-lucide="square" class="icon icon-sm"></i> <span>' + t('btnStop') + '</span>';
                refreshIcons();
                
                window.timeTrackerInterval = setInterval(() => {
                    if (!window.timeTrackerStart) return;
                    const elapsed = Math.floor((Date.now() - window.timeTrackerStart) / 1000);
                    const mins = Math.floor(elapsed / 60);
                    const secs = elapsed % 60;
                    document.getElementById('timeTrackActual').textContent = formatTrackedTime(getTotalTrackedMinutes() + mins) + ':' + String(secs).padStart(2, '0').slice(-2);
                }, 1000);
            }
        }
        
        function stopTimeTracker() {
            if (!window.timeTrackerStart || !timeTrackerTaskId) return;
            
            const elapsed = Math.round((Date.now() - window.timeTrackerStart) / 60000); // хвилини
            clearInterval(window.timeTrackerInterval);
            window.timeTrackerInterval = null;
            
            const btn = document.getElementById('timeTrackBtn');
            btn.style.background = '#22c55e';
            btn.innerHTML = '<i data-lucide="play" class="icon icon-sm"></i> <span data-i18n="startTimer">Старт</span>';
            refreshIcons();
            
            if (elapsed >= 1) {
                addTimeEntry(elapsed);
            }
            
            window.timeTrackerStart = null;
        }
        
        async function addManualTime() {
            if (!editingId) return;
            const minutes = await (window.showInputModal ? showInputModal(t('howManyMinutes'), '', {placeholder: 'Наприклад: 30'}) : (async()=>prompt(t('howManyMinutes')))());
            if (minutes === null) return;
            const mins = parseInt(minutes);
            if (isNaN(mins) || mins <= 0) return;
            addTimeEntry(mins);
        }
        
        async function addTimeEntry(minutes) {
            const taskId = editingId; // copy to avoid race condition
            const task = tasks.find(t => t.id === taskId);
            if (!task || !taskId) return;
            
            const entry = {
                minutes: minutes,
                userId: currentUser.uid,
                userName: currentUserData?.name || currentUser.email,
                date: new Date().toISOString()
            };
            
            const timeLog = [...(task.timeLog || []), entry];
            
            try {
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(taskId).update({
                    timeLog: timeLog
                });
                task.timeLog = timeLog;
                renderTimeTracking(task);
            } catch (e) {
                console.error('addTimeEntry error:', e);
                showToast(t('error') + ': ' + e.message, 'error');
            }
        }
        
        function getTotalTrackedMinutes() {
            const task = tasks.find(t => t.id === editingId);
            if (!task || !task.timeLog) return 0;
            return task.timeLog.reduce((sum, e) => sum + (e.minutes || 0), 0);
        }

        // ========================
        // ЗВЕДЕНИЙ ЗВІТ по людях
        // ========================
        window.renderTimeTrackingReport = function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Збираємо timeLog по всіх задачах
            const byUser = {};  // uid → { name, byFunction: { fn → minutes } }
            tasks.forEach(task => {
                if (!task.timeLog || !task.timeLog.length) return;
                const uid = task.assigneeId || 'unknown';
                if (!byUser[uid]) byUser[uid] = { name: task.assigneeName || uid, byFunction: {}, total: 0 };
                task.timeLog.forEach(entry => {
                    const fn = task.function || '—';
                    byUser[uid].byFunction[fn] = (byUser[uid].byFunction[fn] || 0) + (entry.minutes || 0);
                    byUser[uid].total += (entry.minutes || 0);
                });
            });

            const rows = Object.entries(byUser)
                .sort((a, b) => b[1].total - a[1].total);

            if (!rows.length) {
                container.innerHTML = '<div style="text-align:center;color:#9ca3af;padding:2rem;">Немає даних трекінгу часу</div>';
                return;
            }

            const fmt = (m) => {
                if (m < 60) return m + ' хв';
                return Math.floor(m/60) + 'г ' + (m%60 ? (m%60)+'хв' : '');
            };

            container.innerHTML = `
                <div style="margin-bottom:1rem;">
                    <h3 style="margin:0 0 0.5rem;font-size:0.95rem;color:#374151;">⏱ Трекінг часу по виконавцях</h3>
                    <p style="margin:0;font-size:0.8rem;color:#9ca3af;">Загальний час за всі задачі з логом</p>
                </div>
                ${rows.map(([uid, data]) => `
                    <div style="background:#f9fafb;border-radius:10px;padding:0.75rem;margin-bottom:0.5rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                            <span style="font-weight:600;font-size:0.88rem;">${esc(data.name||'')}</span>
                            <span style="font-size:0.88rem;color:#22c55e;font-weight:700;">${fmt(data.total)}</span>
                        </div>
                        ${Object.entries(data.byFunction).sort((a,b)=>b[1]-a[1]).map(([fn, mins]) => `
                            <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:#6b7280;padding:0.15rem 0;">
                                <span>${esc(fn)}</span>
                                <span>${fmt(mins)}</span>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}`;
        };
        
        function formatTrackedTime(totalMinutes) {
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h}:${String(m).padStart(2, '0')}`;
        }
        
        function renderTimeTracking(task) {
            const section = document.getElementById('timeTrackingSection');
            if (!section) return;
            
            // Показуємо тільки при редагуванні
            section.style.display = editingId ? 'block' : 'none';
            
            // Запланований час
            const planned = task?.estimatedTime ? parseInt(task.estimatedTime) : 0;
            document.getElementById('timeTrackPlanned').textContent = planned > 0 
                ? formatTrackedTime(planned) : '—';
            
            // Фактичний час
            const total = task?.timeLog ? task.timeLog.reduce((s, e) => s + (e.minutes || 0), 0) : 0;
            const actualEl = document.getElementById('timeTrackActual');
            actualEl.textContent = formatTrackedTime(total);
            
            // Колір: зелений якщо < план, жовтий якщо ~, червоний якщо >
            if (planned > 0 && total > planned * 1.2) {
                actualEl.style.color = '#ef4444';
            } else if (planned > 0 && total > planned * 0.8) {
                actualEl.style.color = '#f59e0b';
            } else {
                actualEl.style.color = '#22c55e';
            }
            
            // Лог
            const logEl = document.getElementById('timeTrackLog');
            if (task?.timeLog && task.timeLog.length > 0) {
                logEl.innerHTML = task.timeLog.slice(-10).reverse().map(e => {
                    const date = new Date(e.date);
                    const dateStr = date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
                    const timeStr = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
                    return `<div style="padding:2px 0;border-bottom:1px solid #f3f4f6;">${esc(e.userName)}: <strong>${esc(String(e.minutes || 0))} хв</strong> — ${esc(dateStr)} ${esc(timeStr)}</div>`;
                }).join('');
            } else {
                logEl.innerHTML = '';
            }
        }
