// =====================
        // ADMIN FUNCTIONS
        // =====================
        async function renderAdminPanel() {
            // Автоматично завантажуємо список при відкритті вкладки
            loadAdminCompanies();
        }
        
        async function loadAdminCompanies() {
            if (!isSuperAdmin) return;
            
            const container = document.getElementById('adminCompaniesList');
            container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:1rem;" data-i18n="uploading">Завантаження...</p>';
            
            try {
                const companiesSnap = await db.collection('companies').orderBy('createdAt', 'desc').get();
                
                if (companiesSnap.empty) {
                    if (!container) return;
                    container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:2rem;">Компаній ще немає</p>';
                    return;
                }
                
                let html = `
                    <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                        <thead>
                            <tr style="background:#f9fafb;text-align:left;">
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">${t('companyCol')}</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">${t('ownerCol')}</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">Email</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">${t('createdCol')}</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">${t('usersCol')}</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">${t('tasksCol')}</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;">${t('statusCol')}</th>
                                <th style="padding:0.75rem;border-bottom:2px solid #e5e7eb;width:80px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                for (const doc of companiesSnap.docs) {
                    const company = doc.data();
                    const companyId = doc.id;
                    
                    // Отримуємо кількість юзерів та завдань
                    const [usersSnap, tasksSnap] = await Promise.all([
                        db.collection('companies').doc(companyId).collection('users').get(),
                        db.collection('companies').doc(companyId).collection('tasks').get()
                    ]);
                    
                    const createdAt = company.createdAt?.toDate?.() 
                        ? company.createdAt.toDate().toLocaleDateString('uk-UA') 
                        : '-';
                    
                    html += `
                        <tr style="border-bottom:1px solid #e5e7eb;${company.disabled ? 'opacity:0.6;background:#fef2f2;' : ''}" id="company-row-${companyId}">
                            <td style="padding:0.75rem;font-weight:600;">${esc(company.name || t('noName'))}</td>
                            <td style="padding:0.75rem;">${esc(company.ownerName || '-')}</td>
                            <td style="padding:0.75rem;"><code style="background:#f3f4f6;padding:0.15rem 0.4rem;border-radius:4px;font-size:0.8rem;">${esc(company.ownerEmail || '-')}</code></td>
                            <td style="padding:0.75rem;color:var(--gray);">${createdAt}</td>
                            <td style="padding:0.75rem;text-align:center;">
                                <span style="background:#dbeafe;color:#1d4ed8;padding:0.2rem 0.5rem;border-radius:10px;font-size:0.75rem;font-weight:600;">${usersSnap.size}</span>
                            </td>
                            <td style="padding:0.75rem;text-align:center;">
                                <span style="background:#dcfce7;color:#16a34a;padding:0.2rem 0.5rem;border-radius:10px;font-size:0.75rem;font-weight:600;">${tasksSnap.size}</span>
                            </td>
                            <td style="padding:0.75rem;text-align:center;">
                                <span style="padding:0.2rem 0.5rem;border-radius:10px;font-size:0.75rem;font-weight:600;${company.disabled ? 'background:#fee2e2;color:#dc2626;' : 'background:#dcfce7;color:#16a34a;'}">${company.disabled ? t('blocked') : t('activeStatus')}</span>
                            </td>
                            <td style="padding:0.75rem;text-align:center;display:flex;gap:0.25rem;">
                                <button onclick="toggleCompanyDisabled('${companyId}', ${!!company.disabled})" 
                                    style="background:${company.disabled ? '#dcfce7' : '#fef3c7'};color:${company.disabled ? '#16a34a' : '#92400e'};border:none;padding:0.4rem 0.6rem;border-radius:6px;cursor:pointer;font-size:0.75rem;"
                                    title="${company.disabled ? t('unblock') : t('block')}">
                                    ${company.disabled ? 'ON' : 'OFF'}
                                </button>
                                <button onclick="deleteCompany('${escId(companyId)}', '${escId(company.name || '')}', ${usersSnap.size}, ${tasksSnap.size})" 
                                    style="background:#fee2e2;color:#dc2626;border:none;padding:0.4rem 0.6rem;border-radius:6px;cursor:pointer;font-size:0.75rem;"
                                    title="${t('deleteCompanyTitle')}">
                                    &times;
                                </button>
                            </td>
                        </tr>
                    `;
                }
                
                html += '</tbody></table>';
                container.innerHTML = html;
                
            } catch (error) {
                console.error('Error loading companies:', error);
                container.innerHTML = '<p style="color:var(--danger);text-align:center;padding:1rem;">Помилка завантаження: ' + error.message + '</p>';
            }
        }
        
        async function toggleCompanyDisabled(companyId, currentlyDisabled) {
            if (!isSuperAdmin) return;
            const newState = !currentlyDisabled;
            const action = newState ? t('blockAction') : t('unblockAction');
            if (!await showConfirmModal(t('confirmCompanyAction').replace('{action}', action), { danger: true })) return;
            
            try {
                await db.collection('companies').doc(companyId).update({ disabled: newState });
                showToast(newState ? t('companyBlocked') : t('companyUnblocked'), newState ? 'warning' : 'success');
                loadAdminCompanies();
            } catch (e) {
                console.error('Toggle disabled error:', e);
                showAlertModal(t('error') + ': ' + e.message);
            }
        }
        
        async function deleteCompany(companyId, companyName, usersCount, tasksCount) {
            if (!isSuperAdmin) return;
            
            // Підтвердження з інформацією про те що буде видалено
            const confirmMsg = t('deleteCompanyConfirm').replace('{name}', companyName).replace('{users}', usersCount).replace('{tasks}', tasksCount);
            
            if (!await showConfirmModal(confirmMsg, { danger: true })) return;
            
            // Друге підтвердження для безпеки
            const confirmMsg2 = t('deleteCompanyConfirm2').replace('{name}', companyName);
            
            const userInput = prompt(confirmMsg2);
            const yesVariants = ['ua','ru','en','de','pl'].map(l => (translations[l]?.confirmYes || '').toLowerCase()).filter(Boolean); if (!yesVariants.includes(userInput?.toLowerCase())) {
                return;
            }
            
            // Показуємо що йде видалення
            const row = document.getElementById(`company-row-${companyId}`);
            if (row) {
                row.style.opacity = '0.5';
                row.style.pointerEvents = 'none';
            }
            
            try {
                // Видаляємо всі підколекції (chunked — Firestore batch limit 500)
                const deleteOps = [];
                
                // Видаляємо users
                const usersSnap = await db.collection('companies').doc(companyId).collection('users').get();
                usersSnap.forEach(doc => deleteOps.push({ type: 'delete', ref: doc.ref }));
                
                // Видаляємо tasks та їх comments
                const tasksSnap = await db.collection('companies').doc(companyId).collection('tasks').get();
                for (const taskDoc of tasksSnap.docs) {
                    const commentsSnap = await taskDoc.ref.collection('comments').get();
                    commentsSnap.forEach(commentDoc => deleteOps.push({ type: 'delete', ref: commentDoc.ref }));
                    deleteOps.push({ type: 'delete', ref: taskDoc.ref });
                }
                
                // Видаляємо functions
                const functionsSnap = await db.collection('companies').doc(companyId).collection('functions').get();
                functionsSnap.forEach(doc => deleteOps.push({ type: 'delete', ref: doc.ref }));
                
                // Видаляємо regularTasks
                const regularSnap = await db.collection('companies').doc(companyId).collection('regularTasks').get();
                regularSnap.forEach(doc => deleteOps.push({ type: 'delete', ref: doc.ref }));
                
                // Видаляємо processes та templates
                const processesSnap = await db.collection('companies').doc(companyId).collection('processes').get();
                processesSnap.forEach(doc => deleteOps.push({ type: 'delete', ref: doc.ref }));
                const templatesSnap = await db.collection('companies').doc(companyId).collection('processTemplates').get();
                templatesSnap.forEach(doc => deleteOps.push({ type: 'delete', ref: doc.ref }));
                const projectsSnap = await db.collection('companies').doc(companyId).collection('projects').get();
                projectsSnap.forEach(doc => deleteOps.push({ type: 'delete', ref: doc.ref }));
                
                // Chunked commit (auto-splits at 450)
                await safeBatchCommit(deleteOps);
                console.log(`[deleteCompany] Deleted ${deleteOps.length} documents in chunks`);
                
                // Видаляємо саму компанію
                await db.collection('companies').doc(companyId).delete();
                
                // Видаляємо invite якщо є
                const invitesSnap = await db.collection('invites').where('companyId', '==', companyId).get();
                await Promise.all(invitesSnap.docs.map(doc => doc.ref.delete()));
                
                // Видаляємо рядок з таблиці
                if (row) row.remove();
                
                showToast(t('companyDeleted'), 'success');
                
            } catch (error) {
                console.error('Error deleting company:', error);
                showToast(t('deleteError') + error.message, 'error');
                
                // Повертаємо вигляд рядка
                if (row) {
                    row.style.opacity = '1';
                    row.style.pointerEvents = 'auto';
                }
            }
        }

        async function adminCreateCompany(e) {
            e.preventDefault();
            if (!isSuperAdmin) return;
            
            const email = document.getElementById('adminOwnerEmail').value.trim().toLowerCase();
            const password = document.getElementById('adminOwnerPassword').value;
            const name = document.getElementById('adminOwnerName').value.trim();
            const companyName = document.getElementById('adminCompanyName').value.trim();
            
            const btn = document.getElementById('adminCreateBtn');
            btn.disabled = true;
            btn.textContent = t('creating');
            
            try {
                const companyRef = db.collection('companies').doc();
                const companyId = companyRef.id;
                
                await companyRef.set({
                    name: companyName,
                    ownerName: name,
                    ownerEmail: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: currentUser.uid
                });
                
                await db.collection('invites').add({
                    email: email,
                    companyId: companyId,
                    role: 'owner',
                    ownerName: name,
                    tempPassword: password,
                    invitedBy: currentUser.uid,
                    accepted: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                showAlertModal(t('companyCreated').replace('{name}', companyName).replace('{email}', email).replace('{password}', password));
                
                document.getElementById('adminCreateForm').reset();
                
                // Оновлюємо список компаній
                loadAdminCompanies();
                
            } catch (e) {
                showAlertModal(t('error') + ': ' + e.message);
            }
            
            btn.disabled = false;
            btn.textContent = t('createCompanyBtn');
        }
