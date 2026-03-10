// =====================
        // TELEGRAM INTEGRATION
        // =====================
        const TELEGRAM_BOT_USERNAME = 'talko_tasks_bot';
        
        function generateTelegramCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }
        
        async function connectTelegram() {
            if (!currentCompany || !currentUser) {
                showAlertModal(t('notAuthorized'));
                return;
            }
            
            // Генеруємо унікальний код
            const telegramCode = generateTelegramCode();
            
            // Зберігаємо код в профілі користувача
            try {
                await db.collection('companies').doc(currentCompany)
                    .collection('users').doc(currentUser.uid)
                    .set({ telegramCode: telegramCode }, { merge: true });
                
                // Відкриваємо Telegram бота з кодом
                const botUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${telegramCode}`;
                
                // Показуємо інструкцію
                const proceed = await showConfirmModal(
                    t('telegramConnectTitle')+'\n\n' +
                    '1. '+t('telegramConnectStep1')+'\n' +
                    '2. Натисніть "Start" або "Запустити"\n' +
                    '3. '+t('telegramConnectStep3')+'\n\n' +
                    t('telegramOpenConfirm')
                );
                
                if (proceed) {
                    window.open(botUrl, '_blank');
                    
                    // Через 3 секунди перевіряємо статус
                    setTimeout(() => {
                        checkTelegramStatus();
                    }, 5000);
                }
            } catch (error) {
                console.error('Error generating Telegram code:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
        
        async function disconnectTelegram() {
            if (!await showConfirmModal(t('disconnectTelegram'), { danger: true })) {
                return;
            }
            
            try {
                await db.collection('companies').doc(currentCompany)
                    .collection('users').doc(currentUser.uid)
                    .set({
                        telegramChatId: firebase.firestore.FieldValue.delete(),
                        telegramUserId: firebase.firestore.FieldValue.delete(),
                        telegramCode: firebase.firestore.FieldValue.delete()
                    }, { merge: true });
                
                showTelegramNotConnected();
                showAlertModal(t('telegramDisconnected'));
            } catch (error) {
                console.error('Error disconnecting Telegram:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
        
        async function checkTelegramStatus() {
            if (!currentCompany || !currentUser) return;
            
            try {
                const userDoc = await db.collection('companies').doc(currentCompany)
                    .collection('users').doc(currentUser.uid).get();
                
                if (userDoc.exists && userDoc.data().telegramChatId) {
                    showTelegramConnected();
                } else {
                    showTelegramNotConnected();
                }
            } catch (error) {
                console.error('Error checking Telegram status:', error);
            }
        }
        
        function showTelegramConnected() {
            const notConnected = document.getElementById('telegramNotConnected');
            const connected = document.getElementById('telegramConnected');
            if (notConnected) notConnected.style.display = 'none';
            if (connected) connected.style.display = 'block';
        }
        
        function showTelegramNotConnected() {
            const notConnected = document.getElementById('telegramNotConnected');
            const connected = document.getElementById('telegramConnected');
            if (notConnected) notConnected.style.display = 'block';
            if (connected) connected.style.display = 'none';
        }
        
        // Auto-refresh Google token (silent, no popup)
        async function refreshGoogleToken() {
            return new Promise((resolve) => {
                if (!tokenClient) { resolve(false); return; }
                const origCallback = tokenClient.callback;
                tokenClient.callback = (response) => {
                    tokenClient.callback = origCallback;
                    if (response.error) { 
                        console.log('Token refresh failed:', response.error);
                        googleAccessToken = null;
                        resolve(false); 
                        return; 
                    }
                    googleAccessToken = response.access_token;
                    // Save new token to Firestore
                    if (currentUser && currentCompany) {
                        db.collection('companies').doc(currentCompany)
                            .collection('users').doc(currentUser.uid)
                            .set({ googleAccessToken: response.access_token }, { merge: true })
                            .catch(() => {});
                    }
                    resolve(true);
                };
                tokenClient.requestAccessToken({ prompt: '' });
            });
        }
        
        // Create event in Google Calendar
        async function createCalendarEvent(task) {
            if (!googleAccessToken) {
                console.log('No Google Calendar token, skipping sync');
                return null;
            }
            
            const startDateTime = new Date(task.deadlineDate + 'T' + (task.deadlineTime || '09:00'));
            const durationMinutes = parseInt(task.estimatedTime) || 60;
            const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
            
            const event = {
                summary: task.title,
                description: task.description || task.expectedResult || '',
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: 'Europe/Kyiv'
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'Europe/Kyiv'
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 60 },
                        { method: 'popup', minutes: 15 }
                    ]
                }
            };
            
            try {
                const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + googleAccessToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(event)
                });
                
                if (response.status === 401) {
                    // Token expired, try silent refresh
                    console.log('Google token expired, refreshing...');
                    const refreshed = await refreshGoogleToken();
                    if (refreshed) {
                        // Retry with new token
                        const retry = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + googleAccessToken,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(event)
                        });
                        if (retry.ok) {
                            const result = await retry.json();
                            console.log('Calendar event created (after refresh):', result.id);
                            return result.id;
                        }
                    }
                    googleAccessToken = null;
                    return null;
                }
                
                if (!response.ok) {
                    throw new Error('Failed to create event: ' + response.status);
                }
                
                const result = await response.json();
                console.log('Calendar event created:', result.id);
                return result.id;
            } catch (err) {
                console.error('Error creating calendar event:', err);
                return null;
            }
        }
        
        // Update event in Google Calendar
        async function updateCalendarEvent(eventId, task) {
            if (!googleAccessToken || !eventId) {
                return false;
            }
            
            const startDateTime = new Date(task.deadlineDate + 'T' + (task.deadlineTime || '09:00'));
            const durationMinutes = parseInt(task.estimatedTime) || 60;
            const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
            
            const event = {
                summary: task.title,
                description: task.description || task.expectedResult || '',
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: 'Europe/Kyiv'
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'Europe/Kyiv'
                }
            };
            
            try {
                const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + googleAccessToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(event)
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        const refreshed = await refreshGoogleToken();
                        if (refreshed) {
                            const retry = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
                                method: 'PATCH',
                                headers: { 'Authorization': 'Bearer ' + googleAccessToken, 'Content-Type': 'application/json' },
                                body: JSON.stringify(event)
                            });
                            if (retry.ok) return true;
                        }
                    }
                    throw new Error('Failed to update event');
                }
                
                console.log('Calendar event updated:', eventId);
                return true;
            } catch (err) {
                console.error('Error updating calendar event:', err);
                return false;
            }
        }
        
        // Delete event from Google Calendar
        async function deleteCalendarEvent(eventId) {
            if (!googleAccessToken || !eventId) {
                return false;
            }
            
            try {
                const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + googleAccessToken
                    }
                });
                
                // 204 = success, 404/410 = already deleted (ok)
                if (response.ok || response.status === 404 || response.status === 410) {
                    console.log('Calendar event deleted:', eventId);
                    return true;
                }
                
                console.warn('Calendar delete response:', response.status);
                return false;
            } catch (err) {
                console.error('Error deleting calendar event:', err);
                return false;
            }
        }
        
        // Profile Modal
        function openProfileModal() {
            const modal = document.getElementById('profileModal');
            if (!modal) return;
            
            // Fill profile data
            const nameEl = document.getElementById('profileName');
            const emailEl = document.getElementById('profileEmail');
            const roleEl = document.getElementById('profileRole');
            const avatarEl = document.getElementById('profileAvatar');
            
            if (currentUserData) {
                const name = currentUserData.name || currentUser?.displayName || t('telegramUser');
                if (nameEl) nameEl.textContent = name;
                if (emailEl) emailEl.textContent = currentUser?.email || '';
                if (roleEl) roleEl.textContent = getRoleText(currentUserData.role);
                if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
            }
            
            // Check calendar status
            checkGoogleCalendarStatus();
            
            // Check Telegram status
            checkTelegramStatus();
            
            modal.style.display = 'flex';
            refreshIcons();
        }
