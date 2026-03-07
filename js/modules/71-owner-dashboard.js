// =============================================
// MODULE 71 — OWNER DASHBOARD (Панель власника)
// =============================================

window.renderOwnerDashboard = function(targetEl) {
    const el = targetEl || document.getElementById('ownerDashboardContent');
    if (!el) return;

    const now = new Date();
    const today = getLocalDateStr(now);
    const tm = new Date(now); tm.setDate(tm.getDate() + 1);
    const tomorrow = getLocalDateStr(tm);
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = getLocalDateStr(weekAgo);

    const allTasks = tasks || [];
    const activeTasks = allTasks.filter(t => t.status !== 'done');
    const doneTasks = allTasks.filter(t => t.status === 'done');

    // --- Ключові метрики ---
    const overdue = activeTasks.filter(t => {
        const d = parseDeadline(t).date;
        return d && d < today;
    });
    const dueToday = activeTasks.filter(t => {
        const d = parseDeadline(t).date;
        return d === today || d === tomorrow;
    });
    const inProgress = activeTasks.filter(t => t.status === 'progress');
    const doneThisWeek = doneTasks.filter(t => {
        const comp = t.completedAt ? getLocalDateStr(new Date(t.completedAt)) : '';
        return comp >= weekAgoStr;
    });

    // --- Навантаження по людях ---
    const byUser = {};
    activeTasks.forEach(t => {
        const uid = t.assigneeId || '__none';
        if (!byUser[uid]) byUser[uid] = { name: '', tasks: [], overdue: 0 };
        const u = users?.find(u => u.id === uid);
        byUser[uid].name = u ? (u.name || u.email) : 'Без виконавця';
        byUser[uid].tasks.push(t);
        const d = parseDeadline(t).date;
        if (d && d < today) byUser[uid].overdue++;
    });

    const userRows = Object.entries(byUser)
        .filter(([,v]) => v.tasks.length > 0)
        .sort((a,b) => b[1].overdue - a[1].overdue || b[1].tasks.length - a[1].tasks.length)
        .slice(0, 10)
        .map(([uid, v]) => {
            const overdueColor = v.overdue > 0 ? '#ef4444' : '#22c55e';
            const bar = Math.round((v.tasks.length / Math.max(...Object.values(byUser).map(x => x.tasks.length), 1)) * 100);
            return `<tr onclick="filterControlByCard && document.getElementById('controlAssigneeFilter') && (() => { switchTab('control'); setTimeout(() => { const sel = document.getElementById('controlAssigneeFilter'); if(sel){ sel.value='${uid}'; renderControl && renderControl(); } }, 300); })()" style="cursor:pointer;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                <td style="padding:0.65rem 0.75rem;font-weight:500;">${esc(v.name)}</td>
                <td style="padding:0.65rem 0.75rem;">
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                        <div style="flex:1;background:#f3f4f6;border-radius:4px;height:6px;overflow:hidden;">
                            <div style="width:${bar}%;background:#22c55e;height:100%;border-radius:4px;"></div>
                        </div>
                        <span style="font-size:0.85rem;font-weight:600;min-width:20px;">${v.tasks.length}</span>
                    </div>
                </td>
                <td style="padding:0.65rem 0.75rem;font-weight:600;color:${overdueColor};">${v.overdue > 0 ? v.overdue : '—'}</td>
            </tr>`;
        }).join('');

    // --- Прострочені завдання ---
    const overdueRows = overdue.slice(0, 8).map(t => {
        const u = users?.find(u => u.id === t.assigneeId);
        const name = u ? (u.name || u.email).split(' ')[0] : '—';
        const d = parseDeadline(t).date || '';
        const daysAgo = d ? Math.floor((now - new Date(d + 'T23:59')) / 86400000) : 0;
        const urgency = daysAgo >= 7 ? '#dc2626' : daysAgo >= 3 ? '#f97316' : '#ef4444';
        return `<tr onclick="openTaskModal('${t.id}')" style="cursor:pointer;" onmouseover="this.style.background='#fff5f5'" onmouseout="this.style.background=''">
            <td style="padding:0.6rem 0.75rem;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(t.title||'')}</td>
            <td style="padding:0.6rem 0.75rem;color:#6b7280;font-size:0.85rem;">${esc(name)}</td>
            <td style="padding:0.6rem 0.75rem;font-weight:700;color:${urgency};font-size:0.85rem;">−${daysAgo} дн.</td>
        </tr>`;
    }).join('');

    // --- Завершені за тиждень ---
    const doneRows = doneThisWeek.slice(0, 5).map(t => {
        const u = users?.find(u => u.id === t.assigneeId);
        const name = u ? (u.name || u.email).split(' ')[0] : '—';
        return `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="color:#22c55e;">✓</span>
            <span style="flex:1;font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(t.title||'')}</span>
            <span style="font-size:0.78rem;color:#9ca3af;">${esc(name)}</span>
        </div>`;
    }).join('');

    const completionRate = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;

    el.innerHTML = `
    <!-- KPI рядок -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.75rem;margin-bottom:1rem;">
        <div style="background:${overdue.length > 0 ? '#fef2f2' : '#f0fdf4'};border-radius:12px;padding:1rem;border:1px solid ${overdue.length > 0 ? '#fecaca' : '#bbf7d0'};" onclick="switchTab('control')" style="cursor:pointer;">
            <div style="font-size:0.78rem;font-weight:600;color:${overdue.length > 0 ? '#dc2626' : '#16a34a'};text-transform:uppercase;letter-spacing:0.04em;">Прострочені</div>
            <div style="font-size:2rem;font-weight:800;color:${overdue.length > 0 ? '#dc2626' : '#22c55e'};line-height:1.2;">${overdue.length}</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">завдань</div>
        </div>
        <div style="background:#fffbeb;border-radius:12px;padding:1rem;border:1px solid #fde68a;">
            <div style="font-size:0.78rem;font-weight:600;color:#d97706;text-transform:uppercase;letter-spacing:0.04em;">Сьогодні/завтра</div>
            <div style="font-size:2rem;font-weight:800;color:#f59e0b;line-height:1.2;">${dueToday.length}</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">завдань</div>
        </div>
        <div style="background:#eff6ff;border-radius:12px;padding:1rem;border:1px solid #bfdbfe;">
            <div style="font-size:0.78rem;font-weight:600;color:#2563eb;text-transform:uppercase;letter-spacing:0.04em;">В роботі</div>
            <div style="font-size:2rem;font-weight:800;color:#3b82f6;line-height:1.2;">${inProgress.length}</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">завдань</div>
        </div>
        <div style="background:#f0fdf4;border-radius:12px;padding:1rem;border:1px solid #bbf7d0;">
            <div style="font-size:0.78rem;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.04em;">Виконано за тиждень</div>
            <div style="font-size:2rem;font-weight:800;color:#22c55e;line-height:1.2;">${doneThisWeek.length}</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">завдань</div>
        </div>
        <div style="background:#f5f3ff;border-radius:12px;padding:1rem;border:1px solid #ddd6fe;">
            <div style="font-size:0.78rem;font-weight:600;color:#7c3aed;text-transform:uppercase;letter-spacing:0.04em;">Виконання %</div>
            <div style="font-size:2rem;font-weight:800;color:#8b5cf6;line-height:1.2;">${completionRate}%</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">всього завдань</div>
        </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">

        <!-- Навантаження команди -->
        <div style="background:white;border-radius:12px;box-shadow:var(--shadow);overflow:hidden;">
            <div style="padding:0.85rem 1rem;border-bottom:1px solid #f3f4f6;font-weight:600;font-size:0.9rem;">
                <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span> Навантаження команди
            </div>
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="background:#fafafa;font-size:0.72rem;color:#9ca3af;text-transform:uppercase;">
                        <th style="padding:0.5rem 0.75rem;text-align:left;">Співробітник</th>
                        <th style="padding:0.5rem 0.75rem;text-align:left;">Завдань</th>
                        <th style="padding:0.5rem 0.75rem;text-align:left;">Простр.</th>
                    </tr>
                </thead>
                <tbody>${userRows || '<tr><td colspan="3" style="padding:1rem;text-align:center;color:#9ca3af;">Немає даних</td></tr>'}</tbody>
            </table>
        </div>

        <!-- Прострочені + Виконані -->
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <div style="background:white;border-radius:12px;box-shadow:var(--shadow);overflow:hidden;flex:1;">
                <div style="padding:0.85rem 1rem;border-bottom:1px solid #f3f4f6;font-weight:600;font-size:0.9rem;color:#dc2626;">
                    🔴 Прострочені (${overdue.length})
                </div>
                ${overdue.length > 0 ? `<table style="width:100%;border-collapse:collapse;">
                    <tbody>${overdueRows}</tbody>
                </table>` : '<div style="padding:1rem;text-align:center;color:#22c55e;font-size:0.85rem;">✓ Всі завдання вчасно</div>'}
            </div>

            <div style="background:white;border-radius:12px;box-shadow:var(--shadow);overflow:hidden;">
                <div style="padding:0.85rem 1rem;border-bottom:1px solid #f3f4f6;font-weight:600;font-size:0.9rem;color:#16a34a;">
                    <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span> Виконано за 7 днів (${doneThisWeek.length})
                </div>
                <div style="padding:0.5rem 0.75rem;">
                    ${doneRows || '<div style="padding:0.5rem;color:#9ca3af;font-size:0.85rem;">Немає виконаних завдань</div>'}
                </div>
            </div>
        </div>
    </div>`;
};

// Показуємо пункт меню тільки для owner/manager
// renderOwnerReportInto — рендерить звіт в переданий контейнер
window.renderOwnerReportInto = function(el) {
    if (!el) return;
    renderOwnerDashboard(el);
    // Додаємо time tracking звіт після основного дашборду
    const timeSection = document.createElement('div');
    timeSection.id = 'ownerTimeTrackingReport';
    timeSection.style.marginTop = '1.5rem';
    el.appendChild(timeSection);
    if (typeof window.renderTimeTrackingReport === 'function') {
        window.renderTimeTrackingReport('ownerTimeTrackingReport');
    }
};

// Показуємо опцію "Звіт власника" в select тільки для owner/manager
window.initOwnerReportOption = function() {
    const role = typeof currentUserData !== 'undefined' ? currentUserData?.role : null;
    const opt = document.getElementById('ownerReportOption');
    if (opt) opt.style.display = (role === 'owner' || role === 'manager') ? '' : 'none';
};
