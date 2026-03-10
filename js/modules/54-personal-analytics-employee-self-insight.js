// =====================
    // PERSONAL ANALYTICS — employee self-insight
    // =====================
'use strict';
    function renderMyAnalytics() {
        const container = document.getElementById('myAnalytics');
        if (!container || !currentUser) return;
        
        const uid = currentUser.uid;
        const todayStr = getLocalDateStr();
        const now = new Date();
        
        // Calculate week boundaries (Mon-Sun)
        const dayOfWeek = now.getDay() || 7;
        const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek + 1);
        const weekStartStr = getLocalDateStr(weekStart);
        const lastWeekStart = new Date(weekStart); lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        const lastWeekStartStr = getLocalDateStr(lastWeekStart);
        
        const myTasks = tasks.filter(t => t.assigneeId === uid);
        const myDone = myTasks.filter(t => t.status === 'done');
        const myActive = myTasks.filter(t => t.status !== 'done');
        const myOverdue = myActive.filter(t => t.deadlineDate && t.deadlineDate < todayStr);
        
        // This week
        // БАГ 8 FIX: уніфікована функція — читає completedDate (string) або completedAt (Timestamp)
        const getCompletedDate = (t) => {
            if (t.completedDate) return t.completedDate;
            if (t.completedAt) return (typeof getDateStr === 'function') ? getDateStr(t.completedAt) : '';
            return '';
        };
        const thisWeekDone = myDone.filter(t => getCompletedDate(t) >= weekStartStr);
        const lastWeekDone = myDone.filter(t => getCompletedDate(t) >= lastWeekStartStr && getCompletedDate(t) < weekStartStr);
        
        // Avg completion time from timeLog
        const trackedTasks = myDone.filter(t => t.timeLog?.length > 0);
        const avgMinutes = trackedTasks.length > 0 
            ? Math.round(trackedTasks.reduce((s, t) => s + t.timeLog.reduce((ss, e) => ss + (e.minutes || 0), 0), 0) / trackedTasks.length)
            : 0;
        
        // Streak — consecutive days without overdue (P2 FIX: рахуємо по completedDate)
        let streak = 0;
        const checkDate = new Date(now);
        const todayForStreak = getLocalDateStr(new Date());
        for (let d = 0; d < 30; d++) {
            const dStr = getLocalDateStr(checkDate);
            // Завдання прострочене якщо: дедлайн у цей день І не виконане
            // (для минулих днів — точна перевірка; для сьогодні — поточний статус)
            const hadOverdue = myTasks.some(t => {
                if (t.deadlineDate !== dStr) return false;
                if (t.status === 'done') {
                    // Виконане — перевіряємо чи вчасно (completedDate <= deadlineDate)
                    const cd = t.completedDate || getCompletedDate(t);
                    return cd && cd > dStr; // виконане після дедлайну = прострочення
                }
                // Ще не виконане
                return dStr < todayForStreak; // прострочене тільки для минулих днів
            });
            if (hadOverdue && d > 0) break;
            if (d > 0) streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        // Daily chart data — last 14 days
        const chartDays = [];
        for (let d = 13; d >= 0; d--) {
            const cd = new Date(now); cd.setDate(now.getDate() - d);
            const cdStr = getLocalDateStr(cd);
            const dayDone = myDone.filter(t => getCompletedDate(t) === cdStr).length;
            const dayName = getDayNamesShort()[cd.getDay() === 0 ? 6 : cd.getDay() - 1];
            chartDays.push({ label: dayName, count: dayDone, date: cdStr });
        }
        const maxCount = Math.max(...chartDays.map(d => d.count), 1);
        
        // Trend arrow
        const thisWeekCount = thisWeekDone.length;
        const lastWeekCount = lastWeekDone.length;
        const trendIcon = thisWeekCount > lastWeekCount 
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>'
            : thisWeekCount < lastWeekCount 
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        
        container.style.display = 'block';
        container.innerHTML = `
            <div style="margin-top:1rem;padding:1rem;background:white;border-radius:12px;border:1px solid #e5e7eb;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                    <span style="font-weight:600;font-size:0.85rem;color:#374151;">${t('myStats')}</span>
                    ${streak > 1 ? `<span style="font-size:0.72rem;background:#f0fdf4;color:#16a34a;padding:2px 8px;border-radius:10px;font-weight:600;">${streak} ${t('daysStreak')}</span>` : ''}
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-bottom:0.75rem;">
                    <div style="text-align:center;padding:0.5rem;background:#f0fdf4;border-radius:8px;">
                        <div style="font-size:1.2rem;font-weight:700;color:#16a34a;">${thisWeekCount}</div>
                        <div style="font-size:0.62rem;color:#6b7280;">${t('thisWeek')} ${trendIcon}</div>
                    </div>
                    <div style="text-align:center;padding:0.5rem;background:#f9fafb;border-radius:8px;">
                        <div style="font-size:1.2rem;font-weight:700;color:#374151;">${myActive.length}</div>
                        <div style="font-size:0.62rem;color:#6b7280;">${t('active')}</div>
                    </div>
                    <div style="text-align:center;padding:0.5rem;background:${myOverdue.length > 0 ? '#fef2f2' : '#f9fafb'};border-radius:8px;">
                        <div style="font-size:1.2rem;font-weight:700;color:${myOverdue.length > 0 ? '#ef4444' : '#374151'};">${myOverdue.length}</div>
                        <div style="font-size:0.62rem;color:#6b7280;">${t('overdueStatus')}</div>
                    </div>
                    <div style="text-align:center;padding:0.5rem;background:#f0f9ff;border-radius:8px;">
                        <div style="font-size:1.2rem;font-weight:700;color:#0284c7;">${avgMinutes > 0 ? avgMinutes + t('minShortM') : '—'}</div>
                        <div style="font-size:0.62rem;color:#6b7280;">${t('avgTime')}</div>
                    </div>
                </div>
                
                <div style="display:flex;align-items:end;gap:2px;height:50px;">
                    ${chartDays.map(d => {
                        const h = Math.max(4, Math.round((d.count / maxCount) * 46));
                        const today = d.date === todayStr;
                        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;" title="${d.date}: ${d.count}">
                            <div style="width:100%;height:${h}px;background:${today ? '#22c55e' : (d.count > 0 ? '#bbf7d0' : '#f3f4f6')};border-radius:2px;"></div>
                            <span style="font-size:0.5rem;color:#9ca3af;margin-top:1px;">${d.label}</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    function getDateStr(val) {
        if (!val) return '';
        if (typeof val === 'string') return val.substring(0, 10);
        if (val.toDate) return getLocalDateStr(val.toDate());
        if (val instanceof Date) return getLocalDateStr(val);
        return '';
    }
