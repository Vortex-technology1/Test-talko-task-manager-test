// =====================
    // TEAM DASHBOARD — manager overview
    // =====================
'use strict';
    function renderTeamDashboard() {
        const container = document.getElementById('teamDashboard');
        if (!container) return;
        if (currentUserData?.role === 'employee') { container.style.display = 'none'; return; }
        
        const todayStr = getLocalDateStr();
        const now = new Date();
        const dayOfWeek = now.getDay() || 7;
        const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek + 1);
        const weekStartStr = getLocalDateStr(weekStart);
        
        const teamData = users.map(u => {
            const ut = tasks.filter(t => t.assigneeId === u.id);
            const active = ut.filter(t => t.status !== 'done');
            const overdue = active.filter(t => t.deadlineDate && t.deadlineDate < todayStr);
            const weekDone = ut.filter(t => t.status === 'done' && t.completedAt && getDateStr(t.completedAt) >= weekStartStr);
            const todayDone = ut.filter(t => t.status === 'done' && t.completedAt && getDateStr(t.completedAt) === todayStr);
            
            let status = 'normal';
            if (overdue.length >= 3) status = 'critical';
            else if (overdue.length > 0) status = 'warning';
            else if (active.length > 8) status = 'overloaded';
            else if (active.length < 2 && weekDone.length < 3) status = 'idle';
            
            return { user: u, active: active.length, overdue: overdue.length, weekDone: weekDone.length, todayDone: todayDone.length, status };
        }).filter(d => d.user.role !== 'owner' || users.length <= 2)
          .sort((a, b) => b.overdue - a.overdue || b.active - a.active);
        
        if (teamData.length === 0) { container.style.display = 'none'; return; }
        
        // Process bottleneck
        const activeProcesses = processes.filter(p => p.status === 'active');
        let bottleneckHtml = '';
        if (activeProcesses.length > 0) {
            const stepCounts = {};
            activeProcesses.forEach(p => {
                const tpl = processTemplates.find(t => t.id === p.templateId);
                if (tpl?.steps) {
                    const step = tpl.steps[p.currentStep || 0];
                    if (step) {
                        const key = step.function;
                        if (!stepCounts[key]) stepCounts[key] = 0;
                        stepCounts[key]++;
                    }
                }
            });
            const sorted = Object.entries(stepCounts).sort((a, b) => b[1] - a[1]);
            if (sorted.length > 0 && sorted[0][1] > 1) {
                bottleneckHtml = `<div style="margin-top:0.5rem;padding:0.4rem 0.75rem;background:#fef3c7;border-radius:8px;font-size:0.75rem;color:#92400e;">
                    <strong>${t('bottleneck')}:</strong> ${esc(sorted[0][0])} — ${sorted[0][1]} ${t('processesWaiting')}
                </div>`;
            }
        }
        
        const statusColors = { critical: '#fef2f2', warning: '#fffbeb', overloaded: '#fff7ed', idle: '#f0f9ff', normal: '#f9fafb' };
        const statusIcons = { critical: '#ef4444', warning: '#f59e0b', overloaded: '#f97316', idle: '#0284c7', normal: '#6b7280' };
        
        container.style.display = 'block';
        container.innerHTML = `
            <div style="font-weight:600;font-size:0.85rem;color:#374151;margin-bottom:0.5rem;">${t('teamDashboard')}</div>
            <div style="display:flex;flex-direction:column;gap:0.3rem;">
                ${teamData.map(d => `
                    <div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.75rem;background:${statusColors[d.status]};border-radius:8px;border-left:3px solid ${statusIcons[d.status]};">
                        <div style="flex:1;font-size:0.82rem;font-weight:500;">${esc(d.user.name || d.user.email)}</div>
                        <span style="font-size:0.72rem;color:#16a34a;font-weight:600;" title="${t('doneToday')}">${d.todayDone}</span>
                        <span style="font-size:0.72rem;color:#374151;" title="${t('thisWeek')}">${d.weekDone}w</span>
                        <span style="font-size:0.72rem;color:#6b7280;" title="${t('active')}">${d.active}a</span>
                        ${d.overdue > 0 ? `<span style="font-size:0.72rem;color:#ef4444;font-weight:700;" title="${t('overdueStatus')}">${d.overdue}!</span>` : ''}
                    </div>
                `).join('')}
            </div>
            ${bottleneckHtml}
        `;
    }
