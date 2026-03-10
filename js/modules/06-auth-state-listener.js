// =====================
        // AUTH STATE LISTENER
        // =====================
        auth.onAuthStateChanged(async (user) => {
            try {
            if (user) {
                currentUser = user;
                isSuperAdmin = user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
                
                // Очищаємо попередні listeners перед ініціалізацією нової сесії
                cleanupAllListeners();
                
                if (isSuperAdmin) {
                const superBtn = document.getElementById('superadminBtn');
                if (superBtn) superBtn.style.display = '';
                    document.getElementById('adminTabBtn').style.display = 'block';
                }
                
                const companyId = await findUserCompany(user.uid, user.email);
                
                if (!companyId && !isSuperAdmin) {
                    document.getElementById('loadingPage').style.display = 'none';
                    document.getElementById('authPage').style.display = 'flex';
                    document.getElementById('mainInterface').style.display = 'none';
                    showNoAccess();
                    return;
                }
                
                if (!companyId && isSuperAdmin) {
                    currentCompany = null;
                    currentUserData = { id: user.uid, email: user.email, role: 'superadmin', name: 'Super Admin' };
                    document.getElementById('currentUserName').textContent = 'Super Admin';
                    document.getElementById('currentUserRole').textContent = t('adminRole');
                    document.getElementById('companyBadge').textContent = 'TALKO System';
                    document.getElementById('companyBadge').style.display = 'inline';
                    showMainInterface();
                    return;
                }
                
                currentCompany = companyId;
                window.currentCompanyId = companyId; // для CRM, Marketing, Bots модулів
                
                const userDoc = await db.collection('companies').doc(companyId).collection('users').doc(user.uid).get();
                currentUserData = userDoc.exists ? { id: user.uid, ...userDoc.data() } : { id: user.uid, email: user.email, role: 'employee' };
                
                const companyDoc = await db.collection('companies').doc(companyId).get();
                const companyData = companyDoc.data();
                
                // Перевірка чи компанія заблокована
                if (companyData?.disabled && !isSuperAdmin) {
                    document.getElementById('authPage').style.display = 'flex';
                    document.getElementById('mainInterface').style.display = 'none';
                    const authErr = document.getElementById('authError') || document.createElement('p');
                    authErr.id = 'authError';
                    authErr.style.cssText = 'color:#dc2626;text-align:center;padding:1rem;font-weight:600;';
                    authErr.textContent = t('companyBlocked');
                    const authBox = document.querySelector('.auth-box');
                    if (authBox && !document.getElementById('authError')) authBox.appendChild(authErr);
                    await auth.signOut();
                    return;
                }
                
                document.getElementById('currentUserName').textContent = currentUserData.name || user.displayName || user.email;
                document.getElementById('currentUserRole').textContent = currentUserData ? `(${getRoleText(currentUserData.role)})` : '';
                document.getElementById('companyBadge').textContent = companyData?.name || '';
                document.getElementById('companyBadge').style.display = 'inline';
                
                if (currentUserData.role === 'employee') {
                    document.getElementById('inviteBtn').style.display = 'none';
                    document.getElementById('demoDataBtn').style.display = 'none';
                    // Ховаємо адмін-вкладки для співробітників
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        const tab = btn.getAttribute('onclick')?.match(/switchTab\('(\w+)'\)/)?.[1];
                        if (['users', 'functions'].includes(tab)) btn.style.display = 'none';
                    });
                }
                
                // Show demo data button ONLY for superadmin (by email, not role)
                if (isSuperAdmin) {
                    document.getElementById('demoDataBtnDesktop').style.display = 'flex';
                    document.getElementById('demoDataBtn').style.display = 'flex';
                } else {
                    document.getElementById('demoDataBtnDesktop').style.display = 'none';
                    document.getElementById('demoDataBtn').style.display = 'none';
                }
                
                // AI buttons: Generator + Import = owner only, AI config = admin/superadmin only
                const isOwnerRole = currentUserData?.role === 'owner';
                document.getElementById('ownerAiButtons').style.display = (isOwnerRole || isSuperAdmin) ? 'grid' : 'none';
                document.getElementById('aiAssistantsBtnMenu').style.display = isSuperAdmin ? 'flex' : 'none';
                document.getElementById('aiStructureBtnDesktop').style.display = 'none'; // temporarily disabled
                
                showMainInterface();
                initCalendar();
                initRegularView();
                initGoogleCalendar();
                loadAllData();
                // Синхронізуємо обидва stats tab buttons (desktop + mobile) одразу після login
                if (typeof showStatsTabIfAllowed === 'function') showStatsTabIfAllowed();
                if (typeof initStatistics === 'function') initStatistics();

                // FIX БАГ 4: event-driven замість setTimeout(500)
                // Гарантує що companyFeatures вже встановлені в loadAllData
                window.addEventListener('talko:featuresLoaded', function _onFeatures() {
                    window.removeEventListener('talko:featuresLoaded', _onFeatures);
                    // Бізнес dropdown — показуємо якщо є хоча б одна feature
                    let hasBizFeature = false;
                    if (window.isFeatureEnabled && window.isFeatureEnabled('crm')) {
                        const crmBtn = document.getElementById('crmNavBtn');
                        if (crmBtn) crmBtn.style.display = '';
                        if (typeof initCRMModule === 'function') initCRMModule();
                        hasBizFeature = true;
                    }
                    if (window.isFeatureEnabled && window.isFeatureEnabled('marketing')) {
                        const mktBtn = document.getElementById('marketingNavBtn');
                        if (mktBtn) mktBtn.style.display = '';
                        hasBizFeature = true;
                    }
                    if (window.isFeatureEnabled && window.isFeatureEnabled('bots')) {
                        const botsBtn = document.getElementById('botsNavBtn');
                        if (botsBtn) botsBtn.style.display = '';
                        if (typeof initBotsModule === 'function') initBotsModule();
                        hasBizFeature = true;
                    }
                    if (window.isFeatureEnabled && window.isFeatureEnabled('sites')) {
                        const sitesBtn = document.getElementById('sitesNavBtn');
                        if (sitesBtn) sitesBtn.style.display = '';
                        hasBizFeature = true;
                    }
                    if (hasBizFeature) {
                        const bizBtn = document.getElementById('bizNavBtn');
                        if (bizBtn) bizBtn.style.display = '';
                        // Інтеграції — доступні завжди якщо є хоча б одна biz feature
                        const intgBtn = document.getElementById('integrationsNavBtn');
                        if (intgBtn) intgBtn.style.display = '';
                    }

                    // Відновлюємо останній активний таб після F5
                    try {
                        const lastTab = sessionStorage.getItem('talko_last_tab');
                        const safeTabs = ['tasks','myDay','projects','processes','statistics',
                            'analytics','ownerDashboard','functions','bizstructure','users',
                            'learning','admin','crm','marketing','bots','sites','coordination',
                            'regular','incidents'];
                        if (lastTab && safeTabs.includes(lastTab) && typeof switchTab === 'function') {
                            // Перевіряємо що таб доступний (кнопка є і не прихована)
                            const tabEl = document.getElementById(lastTab + 'Tab');
                            if (tabEl) {
                                switchTab(lastTab);
                            }
                        }
                    } catch(e) {}
                });

                // Show FAB (було окремим onAuthStateChanged — об'єднано)
                const fab = document.getElementById('fabAdd');
                if (fab) fab.style.display = 'flex';
                
                // Real-time listener для нових завдань з процесів
                initTasksListener();
            } else {
                document.getElementById('loadingPage').style.display = 'none';
                document.getElementById('authPage').style.display = 'flex';
                document.getElementById('mainInterface').style.display = 'none';
                document.getElementById('logoutBtn').style.display = 'none';
                document.getElementById('adminTabBtn').style.display = 'none';
                // P3 FIX: bell завжди видимий — не ховаємо при логауті
                notifications = [];
                
                // Hide FAB on logout
                const fab = document.getElementById('fabAdd');
                if (fab) fab.style.display = 'none';
                
                // Перевіряємо чи є інвайт в URL
                const urlParams = new URLSearchParams(window.location.search);
                const inviteId = urlParams.get('invite');
                
                if (inviteId) {
                    // Є invite в URL — перевіряємо валідність і показуємо форму реєстрації
                    checkInviteUrl().then(result => {
                        if (result === true) {
                            showRegisterForm(); // Тепер currentInviteData вже заповнено
                        } else if (result === 'already_used') {
                            showLoginForm();
                            showAuthMessage(t('inviteAlreadyUsed'), 'info');
                        } else {
                            showRegisterForm(); // Показуємо форму все одно, нехай вводить email вручну
                            showAuthMessage(t('inviteNotFoundEmail'), 'error');
                        }
                    });
                } else {
                    showLoginForm();
                }
            }
            } catch(authErr) { console.error('[Auth] onAuthStateChanged error:', authErr); }
        });

        function showMainInterface() {
            document.getElementById('loadingPage').style.display = 'none';
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('mainInterface').style.display = 'block';
            document.getElementById('logoutBtn').style.display = 'block';
            document.getElementById('currentUserInfo').style.display = 'flex';
            document.getElementById('notificationBell').style.display = 'flex';
            // Відновлюємо стан кнопки "Приховати виконані"
            const hideBtn = document.getElementById('hideCompletedBtn');
            if (hideBtn && window.hideCompletedTasks) hideBtn.classList.add('active');
        }

        function getRoleText(role) {
            const roleKeys = { owner: 'roleOwner', manager: 'roleManager', employee: 'roleEmployee', superadmin: 'adminRole' };
            return roleKeys[role] ? t(roleKeys[role]) : role;
        }
