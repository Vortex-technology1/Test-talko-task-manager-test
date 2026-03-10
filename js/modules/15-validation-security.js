// =====================
        // VALIDATION & SECURITY
        // =====================
        
        // Санітизація HTML для захисту від XSS
'use strict';
        function deepCloneTask(task) {
            try { return structuredClone(task); } 
            catch(e) { return JSON.parse(JSON.stringify(task)); }
        }
        
        function sanitizeHTML(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        
        // Локальна дата у форматі YYYY-MM-DD (без UTC зсуву)
        function getLocalDateStr(d) {
            if (!d) d = new Date();
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        }
        
        // Санітизація для відображення (escape HTML entities)
        function esc(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        
        // Alias для зворотної сумісності
        const escapeForDisplay = esc;
        
        // Escape ID для безпечної вставки в onclick='func("ID")'
        // Proper escaping замість видалення символів
        function escId(id) {
            if (!id) return '';
            return String(id)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
        
        // Безпечний парсинг deadline — може бути string "2026-02-16T11:30", Firestore Timestamp, або undefined
        function parseDeadline(task) {
            let date = task.deadlineDate || '';
            let time = task.deadlineTime || '';
            if (!date && task.deadline) {
                if (task.deadline.toDate) {
                    const d = task.deadline.toDate();
                    date = getLocalDateStr(d);
                    if (!time) time = d.toTimeString().slice(0,5);
                } else if (typeof task.deadline === 'string') {
                    date = task.deadline.split('T')[0];
                    if (!time) time = task.deadline.split('T')[1]?.slice(0,5) || '';
                }
            }
            return { date, time };
        }
        
        // Одноразова міграція: якщо задача має deadline (Timestamp або string) але НЕ має deadlineDate —
        // парсимо deadline і дописуємо deadlineDate + deadlineTime в Firestore.
        // Працює в фоні, не блокує UI. Після міграції поле є — функція більше не спрацьовує.

        // Перевірка видимості задачі для поточного юзера
        // Owner/Manager бачать ВСЕ. Employee — тільки де він учасник.
        // Centralized permission check for task operations
        function canEditTask(task) {
            if (!currentUserData || !currentUser) return false;
            const role = currentUserData.role;
            if ((typeof hasPermission === 'function' && hasPermission('editAnyTask')) || role === 'owner' || role === 'admin' || role === 'manager') return true;
            const uid = currentUser.uid;
            return task.assigneeId === uid || task.creatorId === uid;
        }
        
        function isManagerOrAbove() {
            const role = currentUserData?.role;
            if (typeof hasPermission === 'function') return hasPermission('deleteAnyTask') || role === 'owner' || role === 'superadmin';
            return role === 'owner' || role === 'admin' || role === 'manager' || role === 'superadmin';
        }
        
        // Safe batch wrapper — auto-splits at 450 operations (Firestore limit is 500)
        async function safeBatchCommit(operations) {
            const BATCH_LIMIT = 450;
            for (let i = 0; i < operations.length; i += BATCH_LIMIT) {
                const batch = db.batch();
                const chunk = operations.slice(i, i + BATCH_LIMIT);
                for (const op of chunk) {
                    if (op.type === 'set') batch.set(op.ref, op.data);
                    else if (op.type === 'update') batch.update(op.ref, op.data);
                    else if (op.type === 'delete') batch.delete(op.ref);
                }
                await batch.commit();
            }
        }
        
        let _visibleTaskIds = null;
        
        function _buildVisibleSet() {
            if (!currentUserData || !currentUser) return null;
            if ((typeof hasPermission === 'function' && hasPermission('assignTasks')) || currentUserData.role === 'owner' || currentUserData.role === 'manager') return null;
            const uid = currentUser.uid;
            const s = new Set();
            for (const t of tasks) {
                if (t.assigneeId === uid || t.creatorId === uid || 
                    (t.coExecutorIds && t.coExecutorIds.includes(uid)) || 
                    (t.observerIds && t.observerIds.includes(uid))) {
                    s.add(t.id);
                }
            }
            return s;
        }
        
        function isTaskVisibleToUser(task) {
            if (!currentUserData || !currentUser) return true;
            if ((typeof hasPermission === 'function' && hasPermission('assignTasks')) || currentUserData.role === 'owner' || currentUserData.role === 'manager') return true;
            if (_visibleTaskIds === null) _visibleTaskIds = _buildVisibleSet();
            if (_visibleTaskIds === null) return true;
            return _visibleTaskIds.has(task.id);
        }

        async function migrateDeadlineFields(base) {
            const toMigrate = tasks.filter(t => !t.deadlineDate && t.deadline);
            if (toMigrate.length === 0) return;
            
            console.log(`[Migration] ${toMigrate.length} tasks need deadlineDate migration`);
            
            const batch = db.batch();
            let count = 0;
            
            for (const task of toMigrate) {
                let date = '', time = '';
                try {
                    if (task.deadline.toDate) {
                        const d = task.deadline.toDate();
                        date = getLocalDateStr(d);
                        time = d.toTimeString().slice(0,5);
                    } else if (typeof task.deadline === 'string' && task.deadline.includes('T')) {
                        date = task.deadline.split('T')[0];
                        time = task.deadline.split('T')[1]?.slice(0,5) || '';
                    }
                } catch(e) { continue; }
                
                if (!date) continue;
                
                const ref = base.collection('tasks').doc(task.id);
                batch.update(ref, { deadlineDate: date, deadlineTime: time || '18:00' });
                
                // Оновлюємо локальний масив одразу
                task.deadlineDate = date;
                task.deadlineTime = time || '18:00';
                count++;
                
                if (count >= 400) break; // Firestore batch limit safety
            }
            
            if (count > 0) {
                try {
                    await batch.commit();
                    console.log(`[Migration] Done: ${count} tasks migrated`);
                } catch(e) {
                    console.warn('[Migration] Failed:', e);
                }
            }
        }
        
        // Валідація завдання
        function validateTaskData(data) {
            const errors = [];
            
            if (!data.title || data.title.trim().length === 0) {
                errors.push(t('titleRequired'));
            } else if (data.title.length > 500) {
                errors.push(t('titleTooLong'));
            }
            
            if (data.deadlineDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.deadlineDate)) {
                errors.push(t('invalidDate'));
            }
            
            if (data.deadlineTime && !/^\d{2}:\d{2}$/.test(data.deadlineTime)) {
                errors.push(t('invalidTime'));
            }
            
            if (data.description && data.description.length > 10000) {
                errors.push(t('descTooLong'));
            }
            
            // assigneeId — не блокуємо збереження, автопідстановка в 13-tasks.js
            // якщо прийшов порожнім — warning в console, не error
            if (!data.assigneeId || data.assigneeId.trim().length === 0) {
                console.warn('[Validation] assigneeId empty — will fallback to currentUser');
            }
            
            return errors;
        }
        
        // Валідація регулярного завдання
        function validateRegularTaskData(data) {
            const errors = [];
            
            if (!data.title || data.title.trim().length === 0) {
                errors.push(t('titleRequired'));
            } else if (data.title.length > 500) {
                errors.push(t('titleTooLong'));
            }
            
            if (!data.function) {
                errors.push(t('functionRequired'));
            }
            
            if (!data.timeStart || !/^\d{2}:\d{2}$/.test(data.timeStart)) {
                errors.push(t('invalidStartTime'));
            }
            
            return errors;
        }
        
        // Валідація функції
        function validateFunctionData(data) {
            const errors = [];
            
            if (!data.name || data.name.trim().length === 0) {
                errors.push(t('functionNameRequired'));
            } else if (data.name.length > 200) {
                errors.push(t('functionNameTooLong'));
            } else {
                // Duplicate name check (exclude current editing function)
                const duplicate = functions.find(f => 
                    f.name.toLowerCase() === data.name.trim().toLowerCase() && 
                    f.id !== editingId && 
                    f.status !== 'archived'
                );
                if (duplicate) {
                    errors.push(t('functionNameDuplicate'));
                }
            }
            
            if (!data.headId) {
                errors.push(t('functionHeadRequired'));
            }
            
            return errors;
        }
        
        // Rate limiting
        const rateLimiter = {
            actions: {},
            limit: 10, // максимум дій
            window: 60000, // за 1 хвилину
            
            check(action) {
                const now = Date.now();
                if (!this.actions[action]) {
                    this.actions[action] = [];
                }
                
                // Видаляємо старі записи
                this.actions[action] = this.actions[action].filter(t => now - t < this.window);
                
                if (this.actions[action].length >= this.limit) {
                    return false; // Rate limit exceeded
                }
                
                this.actions[action].push(now);
                return true;
            }
        };
        
        // Undo system — stack для підтримки кількох послідовних видалень
        let deletedItemsStack = [];
        let undoTimeout = null;
        let undoTimerInterval = null;
        
        function showUndoToast(itemName, item, type) {
            // Додаємо в стек (а не перезаписуємо)
            deletedItemsStack.push({ item, type, name: itemName });
            
            const toast = document.getElementById('undoToast');
            const messageEl = document.getElementById('undoMessage');
            const timerBar = document.getElementById('undoTimerBar');
            
            // Показуємо останній видалений елемент + кількість в стеку
            if (deletedItemsStack.length > 1) {
                messageEl.textContent = `${itemName} (+${deletedItemsStack.length - 1} ще)`;
            } else {
                messageEl.textContent = itemName;
            }
            messageEl.title = deletedItemsStack.map(d => d.name).join(', ');
            timerBar.style.width = '100%';
            toast.classList.add('show');
            
            // Reset timers (перезапускаємо 5 сек від останнього видалення)
            if (undoTimeout) clearTimeout(undoTimeout);
            if (undoTimerInterval) clearInterval(undoTimerInterval);
            
            let timeLeft = 100;
            undoTimerInterval = setInterval(() => {
                timeLeft -= 2;
                timerBar.style.width = timeLeft + '%';
                if (timeLeft <= 0) clearInterval(undoTimerInterval);
            }, 100);
            
            undoTimeout = setTimeout(() => {
                hideUndoToast();
                deletedItemsStack = [];
            }, 8000); // P2 FIX: 5→8 сек
        }
        
        function hideUndoToast() {
            document.getElementById('undoToast').classList.remove('show');
            if (undoTimerInterval) clearInterval(undoTimerInterval);
            if (undoTimeout) clearTimeout(undoTimeout);
        }
        
        async function undoDelete() {
            if (deletedItemsStack.length === 0) return;
            
            hideUndoToast();
            
            const itemsToRestore = [...deletedItemsStack];
            deletedItemsStack = [];
            
            let restored = 0;
            let failed = 0;
            
            // Очистка Firestore Timestamp-ів перед restore
            // Timestamp об'єкти при .set() записуються як nested objects замість timestamps
            function cleanForRestore(obj) {
                const clean = {};
                for (const [key, val] of Object.entries(obj)) {
                    if (key === 'id') continue; // id не зберігаємо в документі
                    if (val && typeof val === 'object' && typeof val.toDate === 'function') {
                        // Firestore Timestamp → JS Date → Firestore Timestamp
                        clean[key] = firebase.firestore.Timestamp.fromDate(val.toDate());
                    } else if (val && typeof val === 'object' && val.seconds !== undefined && val.nanoseconds !== undefined) {
                        // Серіалізований Timestamp без toDate
                        clean[key] = new firebase.firestore.Timestamp(val.seconds, val.nanoseconds);
                    } else if (Array.isArray(val)) {
                        // Рекурсивно обробляємо масиви
                        clean[key] = val.map(item => {
                            if (item && typeof item === 'object' && typeof item.toDate === 'function') {
                                return firebase.firestore.Timestamp.fromDate(item.toDate());
                            } else if (item && typeof item === 'object' && item.seconds !== undefined && item.nanoseconds !== undefined) {
                                return new firebase.firestore.Timestamp(item.seconds, item.nanoseconds);
                            } else if (item && typeof item === 'object' && !Array.isArray(item)) {
                                return cleanForRestore({ ...item, id: undefined });
                            }
                            return item;
                        });
                    } else if (val && typeof val === 'object' && !(val instanceof Date)) {
                        // Рекурсивно обробляємо вкладені об'єкти
                        clean[key] = cleanForRestore({ ...val, id: undefined });
                    } else {
                        clean[key] = val;
                    }
                }
                return clean;
            }
            
            for (const { item, type } of itemsToRestore) {
                try {
                    const cleanItem = cleanForRestore(item);
                    if (type === 'task') {
                        await db.collection('companies').doc(currentCompany).collection('tasks').doc(item.id).set(cleanItem);
                        if (!tasks.find(t => t.id === item.id)) {
                            tasks.unshift(item);
                        }
                    } else if (type === 'regularTask') {
                        await db.collection('companies').doc(currentCompany).collection('regularTasks').doc(item.id).set(cleanItem);
                        if (!regularTasks.find(t => t.id === item.id)) {
                            regularTasks.unshift(item);
                        }
                    } else if (type === 'function') {
                        await db.collection('companies').doc(currentCompany).collection('functions').doc(item.id).set(cleanItem);
                        if (!functions.find(f => f.id === item.id)) {
                            functions.unshift(item);
                        }
                        // Відновлюємо ownerFunctionId в stages що були очищені при deleteFunction
                        if (typeof window.projectStages !== 'undefined') {
                            const stagesToRestore = window.projectStages.filter(s => s._prevOwnerFunctionId === item.id);
                            if (stagesToRestore.length > 0) {
                                const rb = db.batch();
                                stagesToRestore.forEach(s => {
                                    s.ownerFunctionId = item.id;
                                    delete s._prevOwnerFunctionId;
                                    rb.update(
                                        db.collection('companies').doc(currentCompany).collection('projectStages').doc(s.id),
                                        { ownerFunctionId: item.id }
                                    );
                                });
                                await rb.commit();
                            }
                        }
                    }
                    restored++;
                } catch (error) {
                    console.error('Undo error for item:', item.id, error);
                    failed++;
                }
            }
            
            // Re-render після всіх спроб (навіть якщо частина failed)
            renderMyDay();
            refreshCurrentView();
            if (currentRegularView === 'list') renderRegularTasks();
            else renderRegularWeekView();
            renderFunctions();
            updateSelects();
            
            // Автостатус проєктів для відновлених задач
            const affectedProjects = new Set();
            itemsToRestore.forEach(({ item, type }) => {
                if (type === 'task' && item.projectId) affectedProjects.add(item.projectId);
            });
            affectedProjects.forEach(pid => autoUpdateProjectStatus(pid));
            
            if (failed > 0) {
                showAlertModal(t('restorePartial').replace('{ok}', restored).replace('{total}', restored + failed).replace('{fail}', failed));
            } else if (restored > 0) {
                showToast(t('restoreSuccess').replace('{n}', restored), 'success');
            }
        }
        
        async function deleteTask(id) {
            const taskForDel = tasks.find(t => t.id === id);
            if (taskForDel && !canEditTask(taskForDel)) {
                showToast(t('noPermissionTask'), 'error');
                return;
            }

            const task = tasks.find(t => t.id === id);
            if (!task) return;
            
            const taskName = task.title || t('taskLabel');
            
            // Prevent snapshot from re-inserting during async delete
            pendingDeleteIds.add(id);
            
            // Оптимістичне видалення — зберігаємо копію для rollback
            const taskCopy = { ...task };
            tasks = tasks.filter(t => t.id !== id);
            renderMyDay();
            refreshCurrentView();
            
            // Показуємо toast з можливістю undo
            showUndoToast(taskName, taskCopy, 'task');
            
            try {
                if (taskCopy.calendarEventId && googleAccessToken) {
                    deleteCalendarEvent(taskCopy.calendarEventId).catch(err => console.warn("[Calendar] Delete sync failed:", err));
                }
                
                // P1 FIX: cascade — видаляємо підзавдання разом з батьком через batch
                const _subtasksSnap = await db.collection('companies').doc(currentCompany)
                    .collection('tasks').where('parentId', '==', id).get();
                
                if (_subtasksSnap.empty) {
                    // Немає підзавдань — просте видалення
                    await db.collection('companies').doc(currentCompany).collection('tasks').doc(id).delete();
                } else {
                    // Є підзавдання — batch delete (атомарно)
                    const _batch = db.batch();
                    _subtasksSnap.docs.forEach(d => {
                        _batch.delete(d.ref);
                        pendingDeleteIds.add(d.id);
                    });
                    _batch.delete(db.collection('companies').doc(currentCompany).collection('tasks').doc(id));
                    await _batch.commit();
                    // Видаляємо підзавдання з локального масиву
                    const _subtaskIds = _subtasksSnap.docs.map(d => d.id);
                    tasks = tasks.filter(t => !_subtaskIds.includes(t.id));
                    _subtaskIds.forEach(sid => pendingDeleteIds.delete(sid));
                }
                pendingDeleteIds.delete(id);
                // Автостатус проєкту після видалення задачі
                if (taskCopy.projectId) autoUpdateProjectStatus(taskCopy.projectId);
                // Note: audit log not needed for deletes — task doc is gone
            } catch (error) {
                pendingDeleteIds.delete(id);
                // Rollback — вставляємо назад (filter + unshift безпечно незалежно від змін масиву)
                if (!tasks.find(t => t.id === id)) {
                    tasks.unshift(taskCopy);
                }
                // Видаляємо цей елемент зі стеку undo (вже rollback-нутий)
                deletedItemsStack = deletedItemsStack.filter(d => d.item.id !== id);
                renderMyDay();
                refreshCurrentView();
                hideUndoToast();
                console.error('deleteTask error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }

        async function togglePin(id) {
            const taskIndex = tasks.findIndex(x => x.id === id);
            if (taskIndex < 0) return;
            
            const originalPinned = tasks[taskIndex].pinned;
            
            // Оптимістичне оновлення
            tasks[taskIndex].pinned = !originalPinned;
            renderMyDay();
            refreshCurrentView();
            
            try {
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(id).update({ pinned: !originalPinned });
            } catch (error) {
                // Rollback
                tasks[taskIndex].pinned = originalPinned;
                renderMyDay();
                refreshCurrentView();
                console.error('togglePin error:', error);
            }
        }
