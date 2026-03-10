// =====================
        // GOOGLE CALENDAR INTEGRATION
        // =====================
        
'use strict';
        window.initGoogleCalendar = function initGoogleCalendar() {
            // Initialize token client for Google Identity Services
            if (typeof google === "undefined") return;
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: GOOGLE_SCOPES,
                callback: handleGoogleAuthResponse,
            });
            
            // Check if user already has calendar connected
            checkGoogleCalendarStatus();
        }
        
        function checkGoogleCalendarStatus() {
            if (!currentUser || !currentCompany) return;
            
            db.collection('companies').doc(currentCompany)
                .collection('users').doc(currentUser.uid)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        if (data.googleCalendarConnected && data.googleCalendarEmail) {
                            showCalendarConnected(data.googleCalendarEmail);
                            googleAccessToken = data.googleAccessToken || null;
                        } else {
                            showCalendarNotConnected();
                        }
                    }
                })
                .catch(err => console.error('Error checking calendar status:', err));
        }
        
        function showCalendarConnected(email) {
            const connected = document.getElementById('gcalConnected');
            const notConnected = document.getElementById('gcalNotConnected');
            const emailEl = document.getElementById('gcalEmail');
            
            if (connected) connected.style.display = 'block';
            if (notConnected) notConnected.style.display = 'none';
            if (emailEl) emailEl.textContent = t('connected') + ': ' + email;
        }
        
        function showCalendarNotConnected() {
            const connected = document.getElementById('gcalConnected');
            const notConnected = document.getElementById('gcalNotConnected');
            
            if (connected) connected.style.display = 'none';
            if (notConnected) notConnected.style.display = 'block';
        }
        
        function connectGoogleCalendar() {
            if (!tokenClient) {
                showAlertModal(t('googleApiNotLoaded'));
                return;
            }
            
            // Request access token
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
        
        function handleGoogleAuthResponse(response) {
            if (response.error) {
                console.error('Google auth error:', response);
                showAlertModal(t('googleAuthError') + ': ' + response.error);
                return;
            }
            
            googleAccessToken = response.access_token;
            
            // Get user email from Google
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { 'Authorization': 'Bearer ' + googleAccessToken }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to get user info: ' + res.status);
                }
                return res.json();
            })
            .then(userInfo => {
                const email = userInfo.email || currentUser.email || t('connected');
                
                // Save to Firestore using set with merge
                return db.collection('companies').doc(currentCompany)
                    .collection('users').doc(currentUser.uid)
                    .set({
                        googleCalendarConnected: true,
                        googleCalendarEmail: email,
                        googleAccessToken: googleAccessToken,
                        googleCalendarUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true })
                    .then(() => {
                        showCalendarConnected(email);
                        showAlertModal(t('googleCalendarConnected'));
                    });
            })
            .catch(err => {
                console.error('Error saving calendar connection:', err);
                // Try to save without email
                db.collection('companies').doc(currentCompany)
                    .collection('users').doc(currentUser.uid)
                    .set({
                        googleCalendarConnected: true,
                        googleCalendarEmail: currentUser.email || t('connected'),
                        googleAccessToken: googleAccessToken,
                        googleCalendarUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true })
                    .then(() => {
                        showCalendarConnected(currentUser.email || t('connected'));
                        showAlertModal(t('googleCalendarConnected'));
                    })
                    .catch(err2 => {
                        showAlertModal(t('saveError') + ': ' + err2.message);
                    });
            });
        }
        
        async function disconnectGoogleCalendar() {
            if (!await showConfirmModal(t('disconnectGoogleCalendar'), { danger: true })) {
                return;
            }
            
            // Revoke token if exists
            if (googleAccessToken) {
                google.accounts.oauth2.revoke(googleAccessToken, () => {
                    // Token revoked
                });
            }
            
            // Update Firestore
            db.collection('companies').doc(currentCompany)
                .collection('users').doc(currentUser.uid)
                .set({
                    googleCalendarConnected: false,
                    googleCalendarEmail: firebase.firestore.FieldValue.delete(),
                    googleAccessToken: firebase.firestore.FieldValue.delete()
                }, { merge: true })
                .then(() => {
                    googleAccessToken = null;
                    showCalendarNotConnected();
                    showAlertModal(t('googleCalendarDisconnected'));
                })
                .catch(err => {
                    console.error('Error disconnecting calendar:', err);
                    showAlertModal(t('error') + ': ' + err.message);
                });
        }
