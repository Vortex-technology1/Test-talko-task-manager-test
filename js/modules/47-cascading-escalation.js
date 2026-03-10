// =============================================
        // CASCADING ESCALATION — Каскадна ескалація
        // =============================================
        
'use strict';
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
        
        async function checkEscalations() {
            if (!currentCompany) return;

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
