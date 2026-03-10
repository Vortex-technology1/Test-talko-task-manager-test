// =====================
        // BROWSER NOTIFICATIONS
        // =====================
'use strict';
        let notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        let notificationCheckInterval = null;
        let notifiedTasks = new Set(JSON.parse(localStorage.getItem('notifiedTasks') || '[]'));
        
        // Check if browser supports notifications
        function supportsNotifications() {
            return 'Notification' in window;
        }
        
        // Request permission
        async function requestNotificationPermission() {
            if (!supportsNotifications()) {
                showAlertModal(t('browserNoNotifications'));
                return false;
            }
            
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                notificationsEnabled = true;
                localStorage.setItem('notificationsEnabled', 'true');
                startNotificationChecker();
                updateNotificationButton();
                
                // Show test notification
                new Notification(t('notificationsEnabled'), {
                    body: t('notificationsEnabledDesc'),
                    icon: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png',
                    tag: 'test'
                });
                
                return true;
            } else {
                showAlertModal(t('notificationsDenied'));
                return false;
            }
        }
        
        // Disable notifications
        function disableNotifications() {
            notificationsEnabled = false;
            localStorage.setItem('notificationsEnabled', 'false');
            stopNotificationChecker();
            updateNotificationButton();
        }
        
        // Toggle notifications
        async function toggleNotifications() {
            if (notificationsEnabled) {
                disableNotifications();
            } else {
                await requestNotificationPermission();
            }
        }
        
        // Check deadlines and send notifications
        function checkDeadlinesAndNotify() {
            if (!notificationsEnabled || !tasks.length) return;
            
            const now = new Date();
            const today = getLocalDateStr(now);
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            tasks.filter(t => isTaskVisibleToUser(t)).forEach(task => {
                if (task.status === 'done' || task.status === 'review') return;
                
                const { date: taskDeadline, time: taskTime } = parseDeadline(task);
                
                if (!taskDeadline) return;
                
                const notifyKey = `${task.id}-${taskDeadline}`;
                
                // Already notified for this deadline
                if (notifiedTasks.has(notifyKey)) return;
                
                // Check if deadline is today
                if (taskDeadline === today) {
                    let shouldNotify = false;
                    let message = '';
                    
                    if (taskTime) {
                        // Has specific time - notify 1 hour before
                        const [deadlineHour, deadlineMinute] = taskTime.split(':').map(Number);
                        const deadlineInMinutes = deadlineHour * 60 + deadlineMinute;
                        const nowInMinutes = currentHour * 60 + currentMinute;
                        const diff = deadlineInMinutes - nowInMinutes;
                        
                        if (diff > 0 && diff <= 60) {
                            shouldNotify = true;
                            message = t('deadlineInMinutes').replace('{n}', diff).replace('{title}', task.title);
                        } else if (diff <= 0 && diff > -5) {
                            shouldNotify = true;
                            message = t('deadlineNow').replace('{title}', task.title);
                        }
                    } else {
                        // No specific time - notify once in the morning (9:00)
                        if (currentHour === 9 && currentMinute < 5) {
                            shouldNotify = true;
                            message = t('deadlineToday').replace('{title}', task.title);
                        }
                    }
                    
                    if (shouldNotify) {
                        sendTaskNotification(task, message, notifyKey);
                    }
                }
                
                // Check if deadline is tomorrow (notify at 18:00)
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = getLocalDateStr(tomorrow);
                
                if (taskDeadline === tomorrowStr && currentHour === 18 && currentMinute < 5) {
                    const notifyKeyTomorrow = `${task.id}-tomorrow`;
                    if (!notifiedTasks.has(notifyKeyTomorrow)) {
                        sendTaskNotification(task, t('deadlineTomorrow').replace('{title}', task.title), notifyKeyTomorrow);
                    }
                }
                
                // Check overdue — daily reminders with escalation
                if (taskDeadline < today) {
                    const daysOverdue = Math.floor((now - new Date(taskDeadline + 'T23:59')) / 86400000);
                    const overdueKey = `${task.id}-overdue-${today}`;
                    if (!notifiedTasks.has(overdueKey) && currentHour >= 9 && currentHour < 10) {
                        let msg = '';
                        if (daysOverdue >= 7) {
                            msg = t('overdueCriticalDays').replace('{n}', daysOverdue).replace('{title}', task.title);
                        } else if (daysOverdue >= 3) {
                            msg = t('overdueDays').replace('{n}', daysOverdue).replace('{title}', task.title);
                        } else {
                            msg = `${t('overdueStatus')}: ${task.title}`;
                        }
                        sendTaskNotification(task, msg, overdueKey);
                    }
                    
                    // Notify manager/owner about critical overdue (7+ days)
                    if (daysOverdue >= 7 && ((typeof hasPermission === 'function' && hasPermission('viewAllTasks')) || currentUserData?.role === 'owner' || currentUserData?.role === 'manager')) {
                        const mgrKey = `${task.id}-mgr-overdue-${today}`;
                        if (!notifiedTasks.has(mgrKey) && task.assigneeId !== currentUser?.uid && currentHour >= 9 && currentHour < 10) {
                            const assigneeName = task.assigneeName || '';
                            sendTaskNotification(task, t('overdueManagerAlert').replace('{name}', assigneeName).replace('{n}', daysOverdue).replace('{title}', task.title), mgrKey);
                        }
                    }
                }
            });
        }
        
        // Send notification
        function sendTaskNotification(task, message, notifyKey) {
            try {
                const notification = new Notification(message, {
                    body: task.function ? `${t('functionColon')}: ${task.function}` : t('clickToOpen'),
                    icon: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png',
                    tag: task.id,
                    requireInteraction: true
                });
                
                notification.onclick = () => {
                    window.focus();
                    openTaskModal(task.id);
                    notification.close();
                };
                
                // Mark as notified
                notifiedTasks.add(notifyKey);
                localStorage.setItem('notifiedTasks', JSON.stringify([...notifiedTasks]));
                
            } catch (e) {
                console.error('Notification error:', e);
            }
        }
        
        // Start checking deadlines
        function startNotificationChecker() {
            if (notificationCheckInterval) return;
            
            // Check immediately
            checkDeadlinesAndNotify();
            
            // Then check every 1 minute
            notificationCheckInterval = setInterval(checkDeadlinesAndNotify, 60000);
        }
        
        // Stop checking
        function stopNotificationChecker() {
            if (notificationCheckInterval) {
                clearInterval(notificationCheckInterval);
                notificationCheckInterval = null;
            }
        }
        
        // Update button state
        function updateNotificationButton() {
            const btn = document.getElementById('notificationToggleBtn');
            if (!btn) return;
            
            if (notificationsEnabled) {
                btn.innerHTML = '<i data-lucide="bell-off" class="icon"></i> ' + t('disableNotifications') + "'";
                btn.classList.add('btn-warning');
                btn.classList.remove('btn-success');
            } else {
                btn.innerHTML = '<i data-lucide="bell" class="icon"></i> ' + t('enableNotifications') + "'";
                btn.classList.remove('btn-warning');
                btn.classList.add('btn-success');
            }
            refreshIcons();
        }
        
        // Clear old notifications daily
        function clearOldNotifications() {
            const today = getLocalDateStr();
            const lastClear = localStorage.getItem('lastNotificationClear');
            
            if (lastClear !== today) {
                // Keep only overdue notifications
                const filtered = [...notifiedTasks].filter(key => key.includes('-overdue'));
                notifiedTasks = new Set(filtered);
                localStorage.setItem('notifiedTasks', JSON.stringify(filtered));
                localStorage.setItem('lastNotificationClear', today);
            }
        }
        
        // Init notifications on load
        document.addEventListener('DOMContentLoaded', () => {
            clearOldNotifications();
            
            if (notificationsEnabled && Notification.permission === 'granted') {
                startNotificationChecker();
            } else if (notificationsEnabled) {
                // Permission was revoked
                notificationsEnabled = false;
                localStorage.setItem('notificationsEnabled', 'false');
            }
            
            updateNotificationButton();
            
            // Init FAB for tasks tab
            updateFab('tasks');
        });

    // ====== MERGED FROM SCRIPT 2 ======
        // Mobile menu functions
        function openMobileMenu() {
            document.getElementById('mobileMenuModal').style.display = 'flex';
            refreshIcons();
        }
        
        function closeMobileMenu() {
            document.getElementById('mobileMenuModal').style.display = 'none';
        }
        
        window.openMobileMenu = openMobileMenu;
        window.closeMobileMenu = closeMobileMenu;
