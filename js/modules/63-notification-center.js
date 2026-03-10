// =====================
    // NOTIFICATION CENTER
    // =====================
'use strict';
    let notifications = [];
    let notificationPanelOpen = false;
    const MAX_NOTIFICATIONS = 50;
    
    function addNotification(type, title, body, taskId) {
        const notif = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type, // 'new_task', 'completed', 'review', 'rejected', 'process'
            title,
            body,
            taskId: taskId || null,
            time: new Date(),
            read: false
        };
        // Dedup: skip if same type+body within 3s
        const isDupe = notifications.some(n => n.type === notif.type && n.body === notif.body && (notif.time - n.time) < 3000);
        if (isDupe) return;
        notifications.unshift(notif);
        if (notifications.length > MAX_NOTIFICATIONS) notifications.pop();
        updateNotificationBadge();
        renderNotificationList();
    }
    
    function updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        const bell = document.getElementById('notificationBell');
        if (!badge || !bell) return;
        
        const unread = notifications.filter(n => !n.read).length;
        if (unread > 0) {
            badge.style.display = 'flex';
            badge.textContent = unread > 99 ? '99+' : unread;
            bell.style.background = 'rgba(239,68,68,0.08)';
        } else {
            badge.style.display = 'none';
            bell.style.background = 'transparent';
        }
    }
    
    function toggleNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        notificationPanelOpen = !notificationPanelOpen;
        panel.style.display = notificationPanelOpen ? 'flex' : 'none';
        if (notificationPanelOpen) renderNotificationList();
    }
    
    function markAllNotificationsRead() {
        notifications.forEach(n => n.read = true);
        updateNotificationBadge();
        renderNotificationList();
    }
    
    function renderNotificationList() {
        const list = document.getElementById('notificationList');
        if (!list) return;
        
        if (notifications.length === 0) {
            list.innerHTML = '<div style="text-align:center;color:#9ca3af;padding:2rem;font-size:0.85rem;">' + t('noNotifications') + '</div>';
            return;
        }
        
        const icons = {
            new_task: { color: '#3b82f6', svg: '<path d="M12 5v14M5 12h14"/>' },
            completed: { color: '#22c55e', svg: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
            review: { color: '#8b5cf6', svg: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
            rejected: { color: '#f59e0b', svg: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' },
            process: { color: '#10b981', svg: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>' }
        };
        
        const now = new Date();
        
        list.innerHTML = notifications.map(n => {
            const icon = icons[n.type] || icons.new_task;
            const ago = getTimeAgo(n.time, now);
            const unreadDot = n.read ? '' : '<div style="width:8px;height:8px;background:#3b82f6;border-radius:50%;flex-shrink:0;"></div>';
            
            const taskArg = n.taskId ? ", '" + n.taskId + "'" : '';
            return `<div style="display:flex;gap:10px;align-items:flex-start;padding:0.7rem 1.25rem;cursor:pointer;${n.read ? 'opacity:0.6;' : ''}border-bottom:1px solid #f9fafb;" onclick="onNotificationClick('${n.id}'${taskArg})">
                <div style="width:32px;height:32px;border-radius:8px;background:${icon.color}12;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${icon.color}" stroke-width="2">${icon.svg}</svg>
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:0.8rem;font-weight:600;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(n.title)}</div>
                    <div style="font-size:0.75rem;color:#6b7280;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(n.body)}</div>
                    <div style="font-size:0.65rem;color:#9ca3af;margin-top:3px;">${ago}</div>
                </div>
                ${unreadDot}
            </div>`;
        }).join('');
    }
    
    function onNotificationClick(notifId, taskId) {
        // Mark as read
        const n = notifications.find(x => x.id === notifId);
        if (n) n.read = true;
        updateNotificationBadge();
        renderNotificationList();
        
        // Open task if available
        if (taskId) {
            toggleNotificationPanel();
            openTaskModal(taskId);
        }
    }
    
    function getTimeAgo(date, now) {
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return t('justNow');
        if (diff < 3600) return Math.floor(diff / 60) + ' ' + t('minutesAgo');
        if (diff < 86400) return Math.floor(diff / 3600) + ' ' + t('hoursAgo');
        return Math.floor(diff / 86400) + ' ' + t('daysAgo');
    }
    
    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (notificationPanelOpen && !e.target.closest('#notificationPanel') && !e.target.closest('#notificationBell')) {
            notificationPanelOpen = false;
            document.getElementById('notificationPanel').style.display = 'none';
        }
    });



    // ====== MERGED FROM SCRIPT 3 ======
    // Service Worker registration + PWA Install
    let deferredInstallPrompt = null;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        // Banner disabled — user can install from browser menu
    });
    
    function showInstallBanner() {
        // Не показуємо якщо вже встановлено або якщо банер вже є
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        if (document.getElementById('pwaInstallBanner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'pwaInstallBanner';
        banner.innerHTML = `
            <div style="position:fixed;bottom:70px;left:50%;transform:translateX(-50%);
                background:linear-gradient(135deg,#1a1a1a,#2d2d2d);color:white;
                padding:14px 20px;border-radius:16px;display:flex;align-items:center;gap:14px;
                box-shadow:0 12px 40px rgba(0,0,0,0.4);z-index:10000;max-width:420px;width:calc(100% - 32px);
                border:1px solid rgba(255,255,255,0.1);animation:slideUpBanner 0.3s ease;">
                <img src="icons/icon-96x96.png" style="width:44px;height:44px;border-radius:10px;flex-shrink:0;">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:0.95rem;">Встановити TALKO Tasks</div>
                    <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);">Додати на головний екран</div>
                </div>
                <button onclick="installPWA()" style="background:#22c55e;color:white;border:none;padding:10px 18px;
                    border-radius:10px;font-weight:600;cursor:pointer;font-size:0.85rem;white-space:nowrap;flex-shrink:0;">
                    Додати
                </button>
                <button onclick="dismissInstallBanner()" style="background:none;border:none;color:rgba(255,255,255,0.5);
                    cursor:pointer;font-size:1.2rem;padding:4px;flex-shrink:0;">&times;</button>
            </div>
        `;
        document.body.appendChild(banner);
    }
    
    function installPWA() {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(result => {
            if (result.outcome === 'accepted') {
                console.log('[PWA] Installed');
            }
            deferredInstallPrompt = null;
            dismissInstallBanner();
        });
    }
    
    function dismissInstallBanner() {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.remove();
    }
    
    // iOS install hint (Safari не підтримує beforeinstallprompt)
    function checkIOSInstallHint() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        const dismissed = localStorage.getItem('talko_ios_install_dismissed');
        
        if (isIOS && !isStandalone && !dismissed) {
            setTimeout(() => {
                const hint = document.createElement('div');
                hint.id = 'pwaInstallBanner';
                hint.innerHTML = `
                    <div style="position:fixed;bottom:70px;left:50%;transform:translateX(-50%);
                        background:linear-gradient(135deg,#1a1a1a,#2d2d2d);color:white;
                        padding:16px 20px;border-radius:16px;display:flex;flex-direction:column;gap:10px;
                        box-shadow:0 12px 40px rgba(0,0,0,0.4);z-index:10000;max-width:380px;width:calc(100% - 32px);
                        border:1px solid rgba(255,255,255,0.1);animation:slideUpBanner 0.3s ease;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <img src="icons/icon-96x96.png" style="width:40px;height:40px;border-radius:10px;">
                            <div style="flex:1;">
                                <div style="font-weight:600;font-size:0.95rem;">Встановити TALKO Tasks</div>
                            </div>
                            <button onclick="dismissIOSHint()" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-size:1.2rem;">&times;</button>
                        </div>
                        <div style="font-size:0.85rem;color:rgba(255,255,255,0.8);line-height:1.5;">
                            Натисніть <span style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:6px;margin:0 2px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                            </span> → <b>На Гол. екран</b>
                        </div>
                    </div>
                `;
                document.body.appendChild(hint);
            }, 3000);
        }
    }
    
    function dismissIOSHint() {
        localStorage.setItem('talko_ios_install_dismissed', '1');
        dismissInstallBanner();
    }
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(reg => {
                console.log('[SW] Registered:', reg.scope);
                // Перевірка оновлень кожні 30 хвилин
                setInterval(() => reg.update(), 30 * 60 * 1000);
            }).catch(err => {
                console.log('[SW] Registration skipped:', err.message);
            });
            
            // iOS hint disabled
            // checkIOSInstallHint();
        });
    }
