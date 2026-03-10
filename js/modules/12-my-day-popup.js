// =====================
        // MY DAY POPUP
        // =====================
'use strict';
        function showMyDayPopup() {
            // Показуємо тільки раз за сесію і тільки якщо є завдання
            if (myDayPopupShown) return;
            myDayPopupShown = true;
            
            const today = getLocalDateStr();
            const myTasks = tasks.filter(t => t.assigneeId === currentUser?.uid);
            
            // Завдання на сьогодні
            const todayTasks = myTasks.filter(t => t.deadlineDate === today && t.status !== 'done');
            
            // Прострочені
            const overdueTasks = myTasks.filter(t => t.deadlineDate < today && t.status !== 'done' && t.status !== 'review');
            
            // Нові завдання з процесів (створені сьогодні)
            const processTasksNew = myTasks.filter(t => 
                t.processId && 
                t.status === 'new' && 
                t.createdDate === today
            );
            
            // Якщо нічого немає - не показуємо
            if (todayTasks.length === 0 && overdueTasks.length === 0 && processTasksNew.length === 0) return;
            
            // Звуковий сигнал якщо є нові завдання з процесів
            if (processTasksNew.length > 0) {
                playNotificationSound();
            }
            
            // Оновлюємо title вкладки
            updatePageTitle();
            
            // Створюємо попап
            const popup = document.createElement('div');
            popup.id = 'myDayPopup';
            popup.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s;
            `;
            
            const overdueHtml = overdueTasks.length > 0 ? `
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:1rem;margin-bottom:1rem;">
                    <div style="display:flex;align-items:center;gap:0.5rem;color:#dc2626;font-weight:600;margin-bottom:0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        ${t('overdueStatus')}: ${overdueTasks.length}
                    </div>
                    <div style="font-size:0.85rem;color:#7f1d1d;">
                        ${overdueTasks.slice(0, 3).map(t => `• ${esc(t.title)}`).join('<br>')}
                        ${overdueTasks.length > 3 ? `<br><i>+${overdueTasks.length - 3} ${t('moreItems')}...</i>` : ''}
                    </div>
                </div>
            ` : '';
            
            const todayHtml = todayTasks.length > 0 ? `
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;margin-bottom:1rem;">
                    <div style="display:flex;align-items:center;gap:0.5rem;color:#16a34a;font-weight:600;margin-bottom:0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${t('forToday')}: ${todayTasks.length}
                    </div>
                    <div style="font-size:0.85rem;color:#166534;">
                        ${todayTasks.slice(0, 5).map(t => `• ${esc(t.title)}`).join('<br>')}
                        ${todayTasks.length > 5 ? `<br><i>+${todayTasks.length - 5} ${t('moreItems')}...</i>` : ''}
                    </div>
                </div>
            ` : '';
            
            // Нові завдання з процесів
            const processHtml = processTasksNew.length > 0 ? `
                <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:12px;padding:1rem;margin-bottom:1rem;">
                    <div style="display:flex;align-items:center;gap:0.5rem;color:#7c3aed;font-weight:600;margin-bottom:0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> ${t('newFromProcesses')}: ${processTasksNew.length}
                    </div>
                    <div style="font-size:0.85rem;color:#5b21b6;">
                        ${processTasksNew.slice(0, 3).map(t => `• ${esc(t.title)}`).join('<br>')}
                        ${processTasksNew.length > 3 ? `<br><i>+${processTasksNew.length - 3} ${t('moreItems')}...</i>` : ''}
                    </div>
                </div>
            ` : '';
            
            popup.innerHTML = `
                <div style="background:white;border-radius:20px;padding:1.5rem;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.3s;">
                    <div style="text-align:center;margin-bottom:1.25rem;">
                        <div style="width:60px;height:60px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <h2 style="margin:0;font-size:1.3rem;color:var(--dark);">${t('greeting')}, ${esc(currentUserData?.name?.split(' ')[0] || currentUser?.email?.split('@')[0] || '')}!</h2>
                        <p style="margin:0.25rem 0 0;color:var(--gray);font-size:0.9rem;">${t('yourTasksToday')}</p>
                    </div>
                    
                    ${processHtml}
                    ${overdueHtml}
                    ${todayHtml}
                    
                    <button onclick="closeMyDayPopup()" style="width:100%;padding:0.9rem;background:var(--primary);color:white;border:none;border-radius:12px;font-size:1rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                        ${t('startWork')}
                    </button>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            // Додаємо анімації (тільки один раз)
            if (!document.getElementById('myDayAnimStyles')) {
                const style = document.createElement('style');
                style.id = 'myDayAnimStyles';
                style.textContent = `
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `;
                document.head.appendChild(style);
            }
        }
        
        function closeMyDayPopup() {
            const popup = document.getElementById('myDayPopup');
            if (popup) {
                popup.style.animation = 'fadeIn 0.2s reverse';
                setTimeout(() => popup.remove(), 200);
            }
        }
