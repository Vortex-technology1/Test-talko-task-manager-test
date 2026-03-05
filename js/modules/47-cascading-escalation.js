// =============================================
        // CASCADING ESCALATION — Каскадна ескалація
        // =============================================
        
        const ESCALATION_LEVELS = [
            { days: 1, level: 1, label: t('overdue1day'), target: 'assignee', color: '#92400e' },
            { days: 3, level: 2, label: t('overdue3days'), target: 'manager', color: '#9a3412' },
            { days: 7, level: 3, label: t('overdue7days'), target: 'owner', color: '#dc2626' }
        ];
        
        function getEscalationLevel(task) {
            if (!task.deadlineDate || task.status === 'done') return null;
            
            const now = new Date();
            const deadline = new Date(task.deadlineDate + 'T' + (task.deadlineTime || '23:59'));
            const diffMs = now - deadline;
            if (diffMs <= 0) return null;
            
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            
            let level = null;
            for (const esc of ESCALATION_LEVELS) {
                if (diffDays >= esc.days) level = esc;
            }
            return level;
        }
        
        function getEscalationBadgeHtml(task) {
            const level = getEscalationLevel(task);
            if (!level) return '';
            return `<span class="escalation-badge escalation-${level.level}" title="${level.label}"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> ${level.label}</span>`;
        }
        
        function renderEscalationBanner() {
            const banner = document.getElementById('escalationBanner');
            if (!banner) return;

            const canSee = (typeof hasPermission === 'function' && hasPermission('viewControl'))
                || currentUserData?.role === 'owner'
                || currentUserData?.role === 'manager';

            if (!canSee || !tasks || tasks.length === 0) {
                banner.style.display = 'none';
                banner.innerHTML = '';
                return;
            }

            const level3 = tasks.filter(t => !t.status || t.status !== 'done')
                .filter(t => getEscalationLevel(t)?.level === 3);
            const level2 = tasks.filter(t => !t.status || t.status !== 'done')
                .filter(t => getEscalationLevel(t)?.level === 2);

            if (level3.length === 0 && level2.length === 0) {
                banner.style.display = 'none';
                banner.innerHTML = '';
                return;
            }

            const isCritical = level3.length > 0;
            const items = isCritical ? level3 : level2;
            const msg = isCritical
                ? t('escalationCritical').replace('{n}', level3.length)
                : t('escalationWarning').replace('{n}', level2.length);
            const cls = isCritical ? 'esc-banner-critical' : 'esc-banner-warning';

            const chips = items.slice(0, 5).map(tk =>
                `<span class="esc-task-chip" onclick="openTaskModal('${tk.id}')" title="${(tk.title||'').replace(/"/g,'')}">${(tk.title||'').substring(0,30)}${(tk.title||'').length > 30 ? '…' : ''}</span>`
            ).join('');
            const moreCount = items.length > 5 ? `<span class="esc-task-chip">+${items.length - 5}</span>` : '';

            banner.style.display = 'block';
            banner.innerHTML = `
                <div class="esc-banner-item ${cls}" onclick="switchTab('tasks')">
                    <div style="flex:1;min-width:0;">
                        <div>⚠️ ${msg}</div>
                        ${chips || moreCount ? `<div class="esc-banner-tasks">${chips}${moreCount}</div>` : ''}
                    </div>
                    <button class="esc-banner-close" onclick="event.stopPropagation();dismissEscalationBanner()" title="Закрити">×</button>
                </div>`;
        }

        window.dismissEscalationBanner = function() {
            const banner = document.getElementById('escalationBanner');
            if (banner) { banner.style.display = 'none'; }
            // Повторно показати через 30 хвилин
            setTimeout(() => { if (typeof renderEscalationBanner === 'function') renderEscalationBanner(); }, 30 * 60 * 1000);
        };

        window.renderEscalationBanner = renderEscalationBanner;

        async function checkEscalations() {
            if (!currentCompany) return;

            // Оновлюємо sticky банер
            renderEscalationBanner();
            
            const overdueTasks = tasks.filter(t => {
                if (t.status === 'done') return false;
                const level = getEscalationLevel(t);
                return level && level.level >= 2;
            });
            
            if (overdueTasks.length === 0) return;
            
            // Групуємо по рівнях
            const level2 = overdueTasks.filter(t => getEscalationLevel(t)?.level === 2);
            const level3 = overdueTasks.filter(t => getEscalationLevel(t)?.level === 3);
            
            // Логуємо ескалації які ще не логувались сьогодні
            const today = getLocalDateStr();
            for (const task of overdueTasks) {
                const level = getEscalationLevel(task);
                if (!level) continue;
                
                const lastEscKey = `esc_${task.id}_${level.level}_${today}`;
                if (sessionStorage.getItem(lastEscKey)) continue;
                
                await logTaskChange(task.id, 'escalation', {
                    level: level.level,
                    label: level.label,
                    overdueDays: Math.floor((new Date() - new Date(task.deadlineDate + 'T' + (task.deadlineTime || '23:59'))) / (1000 * 60 * 60 * 24))
                }, null);
                
                sessionStorage.setItem(lastEscKey, '1');
            }
        }
        
        // Auto-resize textarea
        document.addEventListener('DOMContentLoaded', () => {
            const textarea = document.getElementById('commentInput');
            if (textarea) {
                textarea.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
                });
            }
        });
