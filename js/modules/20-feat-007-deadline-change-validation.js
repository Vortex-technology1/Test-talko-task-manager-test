// =====================
        // FEAT-007: Deadline change validation
        // =====================
        function canEditDeadline(task) {
            if (!task) return true;
            // Постановник завжди може
            if (task.creatorId === currentUser?.uid) return true;
            // Якщо дозволено виконавцю
            if (task.allowDeadlineChange) return true;
            // Адмін/овнер завжди може
            if (currentUserData?.role === 'owner' || currentUserData?.role === 'superadmin') return true;
            return false;
        }
        
        function showToast(message, type = 'success', duration = 4000) {
            // WCAG: анонс для скрін-рідерів через aria-live region
            const liveRegion = document.getElementById(type === 'error' ? 'ariaAlertRegion' : 'ariaLiveRegion');
            if (liveRegion) { liveRegion.textContent = ''; setTimeout(() => { liveRegion.textContent = message; }, 50); }
            const existing = document.getElementById('simpleToast');
            if (existing) existing.remove();
            
            const colors = {
                success: { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34,197,94,0.4)' },
                warning: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.4)' },
                error: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: 'rgba(239,68,68,0.4)' },
                info: { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.4)' }
            };
            const c = colors[type] || colors.success;
            
            const toast = document.createElement('div');
            toast.id = 'simpleToast';
            toast.style.cssText = `
                position:fixed;top:20px;right:20px;background:${c.bg};color:white;
                padding:1rem 1.5rem;border-radius:12px;box-shadow:0 10px 40px ${c.shadow};
                z-index:10001;animation:slideInRight 0.3s ease;cursor:pointer;
                max-width:350px;font-weight:500;font-size:0.9rem;
            `;
            toast.textContent = message;
            toast.onclick = () => toast.remove();
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideInRight 0.3s reverse';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
        
        // Замінник showAlertModal() — не блокує UI
        function showAlertModal(message, type = 'info') {
            showToast(message, type, 6000);
        }
        
        // Замінник confirm() — повертає Promise<boolean>
        function showConfirmModal(message, { danger = false } = {}) {
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10050;display:flex;align-items:center;justify-content:center;padding:1rem;';
                overlay.innerHTML = `
                    <div style="background:white;border-radius:16px;padding:1.5rem;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                        <p style="margin:0 0 1.25rem;font-size:0.95rem;color:#374151;white-space:pre-line;line-height:1.5;">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
                        <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
                            <button id="_confirmNo" style="padding:0.5rem 1.1rem;border:1px solid #e5e7eb;border-radius:8px;background:white;cursor:pointer;font-size:0.9rem;color:#6b7280;">Скасувати</button>
                            <button id="_confirmYes" style="padding:0.5rem 1.25rem;border:none;border-radius:8px;background:${danger?'#ef4444':'#22c55e'};color:white;cursor:pointer;font-size:0.9rem;font-weight:600;">Підтвердити</button>
                        </div>
                    </div>`;
                document.body.appendChild(overlay);
                const cleanup = (result) => { overlay.remove(); resolve(result); };
                overlay.querySelector('#_confirmYes').onclick = () => cleanup(true);
                overlay.querySelector('#_confirmNo').onclick = () => cleanup(false);
                overlay.onclick = (e) => { if (e.target === overlay) cleanup(false); };
            });
        }
        window.showAlertModal = showAlertModal;
        window.showConfirmModal = showConfirmModal;
        
        // Listener для завдань на перевірці (сповіщення постановнику)
        let reviewTasksUnsubscribe = null;
        let knownReviewTaskIds = new Set();
        
        function initReviewTasksListener() {
            if (!currentCompany || !currentUser) return;
            
            if (reviewTasksUnsubscribe) {
                reviewTasksUnsubscribe();
            }
            
            let isFirstLoad = true;
            
            // Слухаємо завдання де поточний юзер — постановник, статус = review
            // УВАГА: Потрібен складений індекс в Firebase:
            // Collection: tasks, Fields: creatorId (Ascending), status (Ascending)
            reviewTasksUnsubscribe = db.collection('companies').doc(currentCompany)
                .collection('tasks')
                .where('creatorId', '==', currentUser.uid)
                .where('status', '==', 'review')
                .onSnapshot(snapshot => {
                    const currentIds = new Set(snapshot.docs.map(d => d.id));
                    
                    if (isFirstLoad) {
                        knownReviewTaskIds = currentIds;
                        isFirstLoad = false;
                        return;
                    }
                    
                    const newReviews = snapshot.docs.filter(doc => !knownReviewTaskIds.has(doc.id));
                    
                    if (newReviews.length > 0) {
                        newReviews.forEach(doc => {
                            const task = doc.data();
                            // Не сповіщаємо якщо сам собі поставив
                            if (task.assigneeId !== currentUser.uid) {
                                playNotificationSound();
                                showReviewTaskToast(task, doc.id);
                            }
                            // Інкрементальне оновлення
                            const idx = tasks.findIndex(t => t.id === doc.id);
                            if (idx >= 0) {
                                tasks[idx] = { ...tasks[idx], ...task, id: doc.id };
                            }
                        });
                        
                        scheduleRender();
                    }
                    
                    knownReviewTaskIds = currentIds;
                }, error => {
                    console.error('Review tasks listener error:', error);
                });
        }
        
        // Listener для повернених на доопрацювання (сповіщення виконавцю)
        let rejectedTasksUnsubscribe = null;
        let knownRejectedTimestamps = new Map();
        
        function initRejectedTasksListener() {
            if (!currentCompany || !currentUser) return;
            
            if (rejectedTasksUnsubscribe) {
                rejectedTasksUnsubscribe();
            }
            
            let isFirstLoad = true;
            
            // Слухаємо завдання де поточний юзер — виконавець, статус = progress
            // і є поле reviewRejectedAt (означає що повернули з перевірки)
            rejectedTasksUnsubscribe = db.collection('companies').doc(currentCompany)
                .collection('tasks')
                .where('assigneeId', '==', currentUser.uid)
                .where('status', '==', 'progress')
                .onSnapshot(snapshot => {
                    if (isFirstLoad) {
                        // Запамʼятовуємо поточні timestamp-и
                        snapshot.docs.forEach(doc => {
                            const data = doc.data();
                            if (data.reviewRejectedAt) {
                                knownRejectedTimestamps.set(doc.id, data.reviewRejectedAt);
                            }
                        });
                        isFirstLoad = false;
                        return;
                    }
                    
                    // Шукаємо нові повернення
                    snapshot.docs.forEach(doc => {
                        const data = doc.data();
                        if (data.reviewRejectedAt && data.reviewRejectedBy !== currentUser.uid) {
                            const prevTimestamp = knownRejectedTimestamps.get(doc.id);
                            if (data.reviewRejectedAt !== prevTimestamp) {
                                playNotificationSound();
                                const reason = data.reviewRejectReason;
                                const creatorName = data.creatorName || '';
                                const msg = `${creatorName} ${t('rejectedTaskMsg')}: ${data.title?.substring(0,30) || ''}${reason ? ' — ' + reason : ''}`;
                                showToast(msg, 'warning');
                                addNotification('rejected', t('taskReturnedForRevision'), (data.creatorName || '') + ': ' + (data.title || ''), doc.id);
                                // Інкрементальне оновлення
                                const idx = tasks.findIndex(t => t.id === doc.id);
                                if (idx >= 0) {
                                    tasks[idx] = { ...tasks[idx], ...data, id: doc.id };
                                }
                                _coalesceMyDay = true;
                                _coalesceView = true;
                            }
                        }
                        if (data.reviewRejectedAt) {
                            knownRejectedTimestamps.set(doc.id, data.reviewRejectedAt);
                        }
                    });
                    // Batch render after processing all rejected tasks
                    if (_coalesceMyDay || _coalesceView) scheduleRender();
                }, error => {
                    console.error('Rejected tasks listener error:', error);
                });
        }
        
        function showReviewTaskToast(task, taskId) {
            // Add to notification center
            addNotification('review', t('taskForReview'), (task.assigneeName || '') + ': ' + (task.title || ''), taskId || null);
            
            const existingToast = document.getElementById('reviewTaskToast');
            if (existingToast) existingToast.remove();
            
            const assigneeName = task.assigneeName || '';
            const title = task.title || '';
            const shortTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;
            
            const toast = document.createElement('div');
            toast.id = 'reviewTaskToast';
            toast.style.cssText = `
                position:fixed;top:80px;right:20px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);
                color:white;padding:1rem 1.25rem;border-radius:12px;
                box-shadow:0 10px 40px rgba(139,92,246,0.4);z-index:10001;
                display:flex;flex-direction:column;gap:0.75rem;animation:slideInRight 0.3s ease;
                max-width:360px;width:calc(100% - 40px);
            `;
            toast.innerHTML = `
                <div style="display:flex;align-items:center;gap:0.75rem;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${t('taskOnReview')}</div>
                        <div style="font-size:0.85rem;opacity:0.9;">${esc(assigneeName)}: ${esc(shortTitle)}</div>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                         style="opacity:0.7;cursor:pointer;flex-shrink:0;" onclick="this.closest('#reviewTaskToast').remove()">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </div>
                <div style="display:flex;gap:0.5rem;">
                    <button onclick="this.closest('#reviewTaskToast').remove();acceptReviewTask('${escId(taskId)}')" 
                            style="flex:1;padding:0.5rem;border:none;border-radius:8px;background:#22c55e;color:white;font-weight:600;cursor:pointer;font-size:0.85rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${t('acceptTask')}
                    </button>
                    <button onclick="this.closest('#reviewTaskToast').remove();rejectReviewTask('${escId(taskId)}')" 
                            style="flex:1;padding:0.5rem;border:none;border-radius:8px;background:rgba(255,255,255,0.2);color:white;font-weight:600;cursor:pointer;font-size:0.85rem;">
                        <i data-lucide="rotate-ccw" class="icon icon-sm"></i> ${t('rejectTask')}
                    </button>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Автоховаємо через 15 сек (більше часу бо потрібна дія)
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideInRight 0.3s reverse';
                    setTimeout(() => toast.remove(), 300);
                }
            }, 15000);
        }

        // Mobile quick complete
        const completingTaskIds = new Set();
        const pendingDeleteIds = new Set(); // Prevent snapshot re-inserting during delete
        
        async function quickCompleteTask(id) {
            const taskForQC = tasks.find(t => t.id === id);
            if (taskForQC && !canEditTask(taskForQC)) {
                showToast(t('noPermissionTask'), 'error');
                return;
            }

            // Guard against double-tap
            if (completingTaskIds.has(id)) return;
            completingTaskIds.add(id);
            
            // Оптимістичне оновлення - миттєво показуємо результат
            const taskIndex = tasks.findIndex(t => t.id === id);
            const originalTask = taskIndex >= 0 ? deepCloneTask(tasks[taskIndex]) : null;
            
            // Визначаємо статус: review (якщо є постановник) або done
            const needsReview = shouldSendForReview(originalTask);
            const newStatus = needsReview ? 'review' : 'done';
            
            // Якщо потрібен звіт — показуємо modal перед завершенням
            if (requiresCompletionReport(originalTask)) {
                // Зберігаємо попередній статус для rollback
                if (taskIndex >= 0) {
                    tasks[taskIndex]._prevStatus = tasks[taskIndex].status;
                    tasks[taskIndex].status = newStatus;
                    renderMyDay();
                    refreshCurrentView();
                }
                showCompletionReport(id, () => doQuickComplete(id, taskIndex, originalTask, needsReview, newStatus));
                return;
            }
            
            doQuickComplete(id, taskIndex, originalTask, needsReview, newStatus);
        }
        
        async function doQuickComplete(id, taskIndex, originalTask, needsReview, newStatus) {
            if (taskIndex >= 0 && !tasks[taskIndex]._prevStatus) {
                tasks[taskIndex].status = newStatus;
                tasks[taskIndex].completedAt = new Date().toISOString();
                if (needsReview) tasks[taskIndex].sentForReviewAt = new Date().toISOString();
                renderMyDay();
                refreshCurrentView();
            }
            if (taskIndex >= 0) delete tasks[taskIndex]._prevStatus;
            
            try {
                // Delete from Google Calendar when completed
                if (originalTask?.calendarEventId && googleAccessToken && !needsReview) {
                    deleteCalendarEvent(originalTask.calendarEventId).catch(err => console.warn("[Calendar] Delete sync failed:", err));
                }
                
                const updateData = { 
                    status: newStatus,
                    completedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                if (needsReview) updateData.sentForReviewAt = firebase.firestore.FieldValue.serverTimestamp();
                
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(id).update(updateData);
                
                // Автопросування процесу якщо завдання пов'язане
                if (!needsReview) {
                    advanceProcessIfLinked(id);
                }
                // Автостатус проєкту
                if (originalTask?.projectId) autoUpdateProjectStatus(originalTask.projectId);
                // AUDIT LOG
                logTaskChange(id, 'complete', { status: newStatus }, { status: originalTask?.status || 'todo' });
                
                if (needsReview) {
                    showToast(t('taskSentForReview'), 'info');
                }
            } catch (e) {
                // Rollback при помилці
                if (taskIndex >= 0 && originalTask) {
                    tasks[taskIndex] = originalTask;
                    renderMyDay();
                    refreshCurrentView();
                }
                showAlertModal(t('error') + ': ' + e.message);
            } finally {
                completingTaskIds.delete(id);
            }
        }
        
        // Reopen completed task
        async function reopenTask(id) {
            const taskForCheck = tasks.find(t => t.id === id);
            if (taskForCheck && !canEditTask(taskForCheck)) {
                showToast(t('noPermissionTask'), 'error');
                return;
            }
            
            // Оптимістичне оновлення
            const taskIndex = tasks.findIndex(t => t.id === id);
            const originalTask = taskIndex >= 0 ? deepCloneTask(tasks[taskIndex]) : null;
            
            if (taskIndex >= 0) {
                tasks[taskIndex].status = 'progress';
                tasks[taskIndex].completedAt = null;
                renderMyDay();
                refreshCurrentView();
            }
            
            try {
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(id).update({ 
                    status: 'progress',
                    completedAt: null
                });
                // Автостатус проєкту (done→progress може змінити completed→active)
                if (originalTask?.projectId) autoUpdateProjectStatus(originalTask.projectId);
                // AUDIT LOG
                logTaskChange(id, 'reopen', { status: 'progress' }, { status: originalTask?.status || 'done' });
                showToast(t('taskReopened'), 'success');
                // Re-create calendar event
                if (googleAccessToken && originalTask?.deadlineDate) {
                    createCalendarEvent(originalTask).then(calId => {
                        if (calId) db.collection('companies').doc(currentCompany).collection('tasks').doc(id).update({ calendarEventId: calId }).catch(() => {});
                    }).catch(() => {});
                }
            } catch (e) {
                // Rollback при помилці
                if (taskIndex >= 0 && originalTask) {
                    tasks[taskIndex] = originalTask;
                    renderMyDay();
                    refreshCurrentView();
                }
                showAlertModal(t('error') + ': ' + e.message);
            }
        }
