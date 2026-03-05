// =====================
        // ARCHIVE UI
        // =====================
        let isArchiveView = false;
        let archiveTasks = [];
        let archiveLastDoc = null;
        const ARCHIVE_PAGE_SIZE = 50;
        
        function toggleArchiveView() {
            isArchiveView = !isArchiveView;
            
            const tasksContainer = document.getElementById('tasksContainer');
            const archiveContainer = document.getElementById('archiveContainer');
            const listContainer = tasksContainer?.closest('.list-container');
            const filtersRow = listContainer?.querySelector('.filters-row');
            const mobileFilterBar = document.getElementById('mobileFilterBar');
            const totalTimeInfo = document.getElementById('totalTimeInfo');
            const archiveBtn = document.getElementById('archiveToggleBtn');
            
            if (isArchiveView) {
                tasksContainer.style.display = 'none';
                if (filtersRow) filtersRow.style.display = 'none';
                if (mobileFilterBar) mobileFilterBar.style.display = 'none';
                if (totalTimeInfo) totalTimeInfo.style.display = 'none';
                archiveContainer.style.display = 'block';
                archiveBtn.style.background = 'var(--primary)';
                archiveBtn.innerHTML = '<i data-lucide="arrow-left" class="icon"></i> <span>' + t('tasks') + '</span>';
                
                archiveTasks = [];
                archiveLastDoc = null;
                loadArchiveTasks();
            } else {
                tasksContainer.style.display = '';
                if (filtersRow) filtersRow.style.display = '';
                if (mobileFilterBar) mobileFilterBar.style.display = '';
                if (totalTimeInfo) totalTimeInfo.style.display = '';
                archiveContainer.style.display = 'none';
                archiveBtn.style.background = '#6b7280';
                archiveBtn.innerHTML = '<i data-lucide="archive" class="icon"></i> <span>' + t('archive') + '</span>';
            }
            refreshIcons();
        }
        
        async function loadArchiveTasks() {
            if (!currentCompany) return;
            
            const listEl = document.getElementById('archiveTasksList');
            if (archiveTasks.length === 0) {
                listEl.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;"><div class="spinner"></div>' + t('loading') + '</div>';
            }
            
            try {
                const base = db.collection('companies').doc(currentCompany);
                let query = base.collection('tasksArchive')
                    .orderBy('archivedAt', 'desc')
                    .limit(ARCHIVE_PAGE_SIZE);
                
                if (archiveLastDoc) {
                    query = query.startAfter(archiveLastDoc);
                }
                
                const snap = await query.get();
                
                if (snap.empty && archiveTasks.length === 0) {
                    listEl.innerHTML = `
                        <div style="text-align:center;padding:3rem;color:#9ca3af;">
                            <i data-lucide="archive" class="icon icon-xl" style="color:#d1d5db;margin-bottom:0.5rem;"></i>
                            <p>' + t('archiveEmpty') + '</p>
                            <p style="font-size:0.8rem;">' + t('archiveAutoHint') + '</p>
                        </div>`;
                    refreshIcons();
                    return;
                }
                
                const newTasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                archiveTasks = archiveTasks.concat(newTasks);
                
                if (snap.docs.length > 0) {
                    archiveLastDoc = snap.docs[snap.docs.length - 1];
                }
                
                renderArchiveTasks();
                
                // Show/hide load more
                const loadMoreEl = document.getElementById('archiveLoadMore');
                loadMoreEl.style.display = snap.docs.length >= ARCHIVE_PAGE_SIZE ? 'block' : 'none';
                
            } catch (error) {
                console.error('loadArchiveTasks error:', error);
                listEl.innerHTML = '<div style="text-align:center;padding:2rem;color:#ef4444;">' + t('archiveLoadError') + '</div>';
            }
        }
        
        function loadMoreArchive() {
            loadArchiveTasks();
        }
        
        function renderArchiveTasks() {
            const listEl = document.getElementById('archiveTasksList');
            const countEl = document.getElementById('archiveCount');
            
            countEl.textContent = t('recordsCount').replace('{n}', archiveTasks.length);
            
            const st = { new: t('statusNew'), progress: t('statusProgress'), review: t('statusReview'), done: t('statusDone') };
            
            // Desktop table
            let html = `
                <table class="tasks-table" style="table-layout:fixed;">
                    <thead>
                        <tr>
                            <th>${t('task')}</th>
                            <th>${t('assignee')}</th>
                            <th>${t('deadline')}</th>
                            <th>${t('type')}</th>
                            <th>' + t('archivedAt') + '</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            archiveTasks.forEach(task => {
                const taskDeadline = task.deadlineDate || '';
                const archivedDate = task.archivedAt?.toDate ? 
                    task.archivedAt.toDate().toLocaleDateString('uk-UA') : 
                    (task.archivedAt ? new Date(task.archivedAt).toLocaleDateString('uk-UA') : '-');
                
                html += `
                    <tr style="opacity:0.8;">
                        <td class="task-title-cell">
                            <span class="task-title-text">${esc(task.title)}</span>
                        </td>
                        <td>${esc(task.assigneeName) || '-'}</td>
                        <td>${taskDeadline ? formatDateShort(taskDeadline) : '-'}</td>
                        <td>${esc(task.function) || '-'}</td>
                        <td style="font-size:0.8rem;color:#9ca3af;">${archivedDate}</td>
                        <td>
                            <button class="action-btn" onclick="restoreFromArchive('${escId(task.id)}')" title="${t('reopen')}">
                                <i data-lucide="rotate-ccw" class="icon icon-sm" style="color:var(--primary);"></i>
                            </button>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table>`;
            
            // Mobile cards
            html += `<div class="mobile-tasks-list">`;
            archiveTasks.forEach(task => {
                const archivedDate = task.archivedAt?.toDate ? 
                    task.archivedAt.toDate().toLocaleDateString('uk-UA') : '-';
                
                html += `
                <div class="mobile-task-card status-done" style="opacity:0.85;">
                    <div class="mobile-task-content">
                        <div class="mobile-task-header">
                            <div class="mobile-task-title">${esc(task.title)}</div>
                            <span class="status-badge status-done">${st.done}</span>
                        </div>
                        <div class="mobile-task-meta">
                            ${task.assigneeName ? `<div class="mobile-task-meta-item"><i data-lucide="user" class="icon icon-sm"></i> ${esc(task.assigneeName)}</div>` : ''}
                            ${task.function ? `<div class="mobile-task-meta-item"><i data-lucide="tag" class="icon icon-sm"></i> ${esc(task.function)}</div>` : ''}
                            <div class="mobile-task-meta-item"><i data-lucide="archive" class="icon icon-sm"></i> ${archivedDate}</div>
                        </div>
                        <div class="mobile-task-actions">
                            <button class="mobile-action-btn edit" onclick="restoreFromArchive('${escId(task.id)}')">
                                <i data-lucide="rotate-ccw" class="icon icon-sm"></i> ${t('reopen')}
                            </button>
                        </div>
                    </div>
                </div>`;
            });
            html += `</div>`;
            
            listEl.innerHTML = html;
            refreshIcons();
        }
        
        async function restoreFromArchive(taskId) {
            if (!await showConfirmModal(t('restoreFromArchive'), { danger: true })) return;
            
            try {
                const base = db.collection('companies').doc(currentCompany);
                const archiveDoc = await base.collection('tasksArchive').doc(taskId).get();
                
                if (!archiveDoc.exists) {
                    showToast(t('taskNotFoundArchive'), 'error');
                    return;
                }
                
                const data = archiveDoc.data();
                delete data.archivedAt;
                
                // Restore to tasks + remove from archive
                const batch = db.batch();
                batch.set(base.collection('tasks').doc(taskId), data);
                batch.delete(base.collection('tasksArchive').doc(taskId));
                await batch.commit();
                
                // Update local arrays
                archiveTasks = archiveTasks.filter(t => t.id !== taskId);
                if (!tasks.find(t => t.id === taskId)) {
                    tasks.unshift({ id: taskId, ...data });
                }
                
                renderArchiveTasks();
                showToast(t('taskRestored'), 'success');
            } catch (error) {
                console.error('restoreFromArchive error:', error);
                showToast(t('restoreError'), 'error');
            }
        }
        
        async function autoGenerateRegularTasks() {
            if (!currentUser || !currentCompany) return;
            
            const today = new Date();
            const todayStr = getLocalDateStr(today);
            
            // Skip if already generated today (avoids extra Firestore query on tab refresh)
            const autoGenKey = `autoGen_${currentCompany}_${currentUser.uid}`;
            if (localStorage.getItem(autoGenKey) === todayStr) return;
            
            const base = db.collection('companies').doc(currentCompany).collection('tasks');
            
            // Серверна перевірка: які regularTaskId вже мають завдання на сьогодні
            // Це захищає від дублів коли 2+ таби відкриті одночасно
            let existingRegularIds = new Set();
            try {
                const existingSnap = await base
                    .where('deadlineDate', '==', todayStr)
                    .where('autoGenerated', '==', true)
                    .get();
                existingSnap.docs.forEach(doc => {
                    const d = doc.data();
                    if (d.regularTaskId && d.assigneeId) {
                        existingRegularIds.add(`${d.regularTaskId}_${d.assigneeId}`);
                    }
                });
            } catch (err) {
                console.warn('[AutoGenerate] Server check failed, falling back to local:', err);
                // Fallback: локальна перевірка
                tasks.forEach(t => {
                    if (t.regularTaskId && t.deadlineDate === todayStr && t.autoGenerated) {
                        existingRegularIds.add(`${t.regularTaskId}_${t.assigneeId}`);
                    }
                });
            }
            
            // Збираємо завдання для створення
            const tasksToCreate = [];
            
            for (const rt of regularTasks) {
                if (!isRegularTaskDay(rt, today)) continue;
                
                let assigneeIds;
                if (rt.assigneeId) {
                    // Прямий виконавець з регулярного завдання
                    assigneeIds = [rt.assigneeId];
                } else {
                    const func = functions.find(f => f.name === rt.function);
                    assigneeIds = func?.assigneeIds || [];
                }
                if (assigneeIds.length === 0) continue;
                
                for (const assigneeId of assigneeIds) {
                    const key = `${rt.id}_${assigneeId}`;
                    if (existingRegularIds.has(key)) continue;
                    
                    // Одразу додаємо в set щоб не створити дублі в рамках одного batch
                    existingRegularIds.add(key);
                    
                    const assignee = users.find(u => u.id === assigneeId);
                    tasksToCreate.push({
                        title: rt.title,
                        function: rt.function,
                        assigneeId: assigneeId,
                        assigneeName: assignee?.name || assignee?.email || '',
                        deadlineDate: todayStr,
                        deadlineTime: rt.timeStart || rt.time || '18:00',
                        deadline: todayStr + 'T' + (rt.timeStart || rt.time || '18:00'),
                        expectedResult: rt.expectedResult || '',
                        reportFormat: rt.reportFormat || '',
                        description: rt.instruction || '',
                        status: 'new',
                        priority: rt.priority || 'medium',
                        requireReview: rt.requireReview || false,
                        checklist: (rt.checklist || []).map(c => ({ text: c.text || c, done: false })),
                        pinned: false,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        createdDate: todayStr,
                        creatorId: currentUser.uid,
                        creatorName: t('systemUser'),
                        regularTaskId: rt.id,
                        notifyOnComplete: rt.notifyOnComplete || [],
                        autoGenerated: true
                    });
                }
            }
            
            if (tasksToCreate.length === 0) return;
            
            try {
                // Batch write — до 500 операцій за раз (Firestore ліміт)
                const batchSize = 500;
                for (let i = 0; i < tasksToCreate.length; i += batchSize) {
                    const batch = db.batch();
                    const chunk = tasksToCreate.slice(i, i + batchSize);
                    const localTasks = [];
                    
                    for (const taskData of chunk) {
                        const newRef = base.doc();
                        batch.set(newRef, taskData);
                        localTasks.push({ id: newRef.id, ...taskData });
                    }
                    
                    await batch.commit();
                    
                    // Додаємо в локальний масив ПІСЛЯ успішного commit
                    localTasks.forEach(t => tasks.unshift(t));
                }
                
                console.log(`[AutoGenerate] Created ${tasksToCreate.length} tasks in batch`);
                localStorage.setItem(autoGenKey, todayStr);
            } catch (err) {
                console.error('[AutoGenerate] Batch error:', err);
            }
        }
