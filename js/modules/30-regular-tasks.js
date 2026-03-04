// =====================
        // REGULAR TASKS
        // =====================
        function toggleRegularTimeMode() {
            const mode = document.getElementById('regularTaskTimeMode').value;
            const endInput = document.getElementById('regularTaskTimeEnd');
            const durationSelect = document.getElementById('regularTaskDuration');
            
            if (mode === 'end') {
                endInput.style.display = 'block';
                durationSelect.style.display = 'none';
            } else {
                endInput.style.display = 'none';
                durationSelect.style.display = 'block';
            }
        }
        
        function toggleTaskTimeMode() {
            const mode = document.getElementById('taskTimeMode').value;
            const endInput = document.getElementById('taskTimeEnd');
            const durationSelect = document.getElementById('taskEstimatedTime');
            
            if (mode === 'end') {
                endInput.style.display = 'block';
                durationSelect.style.display = 'none';
            } else {
                endInput.style.display = 'none';
                durationSelect.style.display = 'block';
            }
        }
        
        function calculateEndTime(startTime, durationMinutes) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes + durationMinutes;
            const endHours = Math.floor(totalMinutes / 60) % 24;
            const endMinutes = totalMinutes % 60;
            return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
        }
        
        function updatePeriodOptions() {
            const period = document.getElementById('regularTaskPeriod').value;
            const dayOfWeekGroup = document.getElementById('dayOfWeekGroup');
            const dayOfMonthGroup = document.getElementById('dayOfMonthGroup');
            
            if (period === 'weekly') {
                dayOfWeekGroup.style.display = 'block';
                dayOfMonthGroup.style.display = 'none';
            } else {
                // monthly, quarterly
                dayOfWeekGroup.style.display = 'none';
                dayOfMonthGroup.style.display = 'block';
            }
        }
        
        function selectAllDays() {
            document.querySelectorAll('input[name="dayOfWeek"]').forEach(cb => cb.checked = true);
            updateDayCheckboxStyles();
        }
        
        function selectWorkDays() {
            document.querySelectorAll('input[name="dayOfWeek"]').forEach(cb => {
                cb.checked = ['1','2','3','4','5'].includes(cb.value);
            });
            updateDayCheckboxStyles();
        }
        
        function clearDays() {
            document.querySelectorAll('input[name="dayOfWeek"]').forEach(cb => cb.checked = false);
            updateDayCheckboxStyles();
        }
        
        function updateDayCheckboxStyles() {
            document.querySelectorAll('input[name="dayOfWeek"]').forEach(cb => {
                const label = cb.parentElement;
                if (cb.checked) {
                    label.style.background = '#dcfce7';
                    label.style.borderColor = '#22c55e';
                } else {
                    label.style.background = '#f9fafb';
                    label.style.borderColor = '#e5e7eb';
                }
            });
        }
        
        function getSelectedDays() {
            return Array.from(document.querySelectorAll('input[name="dayOfWeek"]:checked')).map(cb => cb.value);
        }
        
        function setSelectedDays(days) {
            document.querySelectorAll('input[name="dayOfWeek"]').forEach(cb => {
                cb.checked = days.includes(cb.value);
            });
            updateDayCheckboxStyles();
        }
        
        // Додаємо слухачі для оновлення стилів
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('input[name="dayOfWeek"]').forEach(cb => {
                cb.addEventListener('change', updateDayCheckboxStyles);
            });
        });
        
        function openRegularTaskModal(id = null) {
            document.getElementById('regularTaskModal').style.display = 'block';
            updateRegularTaskFunctions();
            updatePeriodOptions();
            editingId = id;
            
            // Рендеримо чекбокси для сповіщень
            renderRegularNotifyUsersCheckboxes();
            
            if (id) {
                const rt = regularTasks.find(r => r.id === id);
                if (rt) {
                    document.getElementById('regularTaskTitle').value = rt.title;
                    document.getElementById('regularTaskFunction').value = rt.function;
                    
                    // Конвертуємо старий daily в weekly з усіма днями
                    if (rt.period === 'daily') {
                        document.getElementById('regularTaskPeriod').value = 'weekly';
                        updatePeriodOptions();
                        selectAllDays(); // Вибираємо всі дні
                    } else {
                        document.getElementById('regularTaskPeriod').value = rt.period || 'weekly';
                        updatePeriodOptions();
                        
                        // Встановлюємо вибрані дні
                        if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) {
                            setSelectedDays(rt.daysOfWeek);
                        } else if (rt.dayOfWeek) {
                            // Сумісність зі старим форматом
                            setSelectedDays([rt.dayOfWeek]);
                        } else {
                            setSelectedDays(['1']); // За замовчуванням понеділок
                        }
                    }
                    
                    document.getElementById('regularTaskDayOfMonth').value = rt.dayOfMonth || '1';
                    
                    // Час - нова логіка з підтримкою старого формату
                    if (rt.timeStart) {
                        document.getElementById('regularTaskTimeStart').value = rt.timeStart;
                        document.getElementById('regularTaskTimeEnd').value = rt.timeEnd || '11:00';
                        if (rt.duration) {
                            document.getElementById('regularTaskTimeMode').value = 'duration';
                            document.getElementById('regularTaskDuration').value = rt.duration;
                        } else {
                            document.getElementById('regularTaskTimeMode').value = 'end';
                        }
                    } else if (rt.time) {
                        // Сумісність зі старим форматом (тільки один час)
                        document.getElementById('regularTaskTimeStart').value = rt.time;
                        document.getElementById('regularTaskTimeEnd').value = calculateEndTime(rt.time, 60);
                        document.getElementById('regularTaskTimeMode').value = 'duration';
                        document.getElementById('regularTaskDuration').value = '60';
                    } else {
                        document.getElementById('regularTaskTimeStart').value = '10:00';
                        document.getElementById('regularTaskTimeEnd').value = '11:00';
                    }
                    toggleRegularTimeMode();
                    
                    document.getElementById('regularTaskExpectedResult').value = rt.expectedResult || '';
                    document.getElementById('regularTaskReportFormat').value = rt.reportFormat || '';
                    document.getElementById('regularTaskInstruction').value = rt.instruction || '';
                    
                    // Нові поля
                    document.getElementById('regularTaskPriority').value = rt.priority || 'medium';
                    document.getElementById('regularTaskRequireReview').checked = rt.requireReview || false;
                    document.getElementById('regularTaskAssignee').value = rt.assigneeId || '';
                    renderRegularChecklist(rt.checklist || []);
                    
                    // Встановлюємо чекбокси сповіщень
                    setRegularNotifyUsersCheckboxes(rt.notifyOnComplete || []);
                }
            } else {
                document.getElementById('regularTaskForm').reset();
                document.getElementById('regularTaskTimeStart').value = '10:00';
                document.getElementById('regularTaskTimeEnd').value = '11:00';
                document.getElementById('regularTaskTimeMode').value = 'duration';
                document.getElementById('regularTaskDuration').value = '60';
                toggleRegularTimeMode();
                document.getElementById('regularTaskPeriod').value = 'weekly';
                document.getElementById('regularTaskPriority').value = 'medium';
                document.getElementById('regularTaskRequireReview').checked = false;
                document.getElementById('regularTaskAssignee').value = '';
                renderRegularChecklist([]);
                clearDays();
                setSelectedDays(['1']); // За замовчуванням понеділок
                updatePeriodOptions();
                
                // За замовчуванням сповіщуємо творця
                setRegularNotifyUsersCheckboxes([currentUser?.uid]);
            }
        }
        
        // Рендеримо чекбокси для регулярних завдань
        function renderRegularNotifyUsersCheckboxes() {
            const container = document.getElementById('regularTaskNotifyUsers');
            if (!container) return;
            
            const sortedUsers = [...users].sort((a, b) => {
                const roleOrder = { owner: 0, manager: 1, employee: 2 };
                return (roleOrder[a.role] || 2) - (roleOrder[b.role] || 2);
            });
            
            container.innerHTML = sortedUsers.map(user => {
                const roleLabel = user.role === 'owner' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="1" style="vertical-align:-2px;"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>' : (user.role === 'manager' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="1" style="vertical-align:-2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' : '');
                return `
                    <label class="notify-user-checkbox" style="display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.75rem;background:white;border:1px solid #e5e7eb;border-radius:20px;cursor:pointer;font-size:0.85rem;transition:all 0.2s;">
                        <input type="checkbox" name="regularNotifyUser" value="${esc(user.id)}" style="margin:0;" onchange="updateNotifyCheckboxStyle(this)">
                        <span>${roleLabel} ${esc(user.name || user.email)}</span>
                    </label>
                `;
            }).join('');
        }
        
        function setRegularNotifyUsersCheckboxes(userIds) {
            const container = document.getElementById('regularTaskNotifyUsers');
            if (!container) return;
            
            container.querySelectorAll('input[name="regularNotifyUser"]').forEach(cb => {
                cb.checked = userIds.includes(cb.value);
                const label = cb.closest('.notify-user-checkbox');
                if (label) {
                    label.style.background = cb.checked ? '#f0fdf4' : 'white';
                    label.style.borderColor = cb.checked ? '#22c55e' : '#e5e7eb';
                }
            });
        }
        
        function getRegularNotifyUsersFromCheckboxes() {
            const container = document.getElementById('regularTaskNotifyUsers');
            if (!container) return [];
            return Array.from(container.querySelectorAll('input[name="regularNotifyUser"]:checked'))
                .map(cb => cb.value);
        }

        function updateRegularTaskFunctions() {
            const s = document.getElementById('regularTaskFunction');
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            s.innerHTML = `<option value="">${t('select')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)} (${f.assigneeIds?.length || 0} ${t('people')})</option>`).join('');
            
            // Оновлюємо фільтри
            const ff = document.getElementById('regularFunctionFilter');
            const af = document.getElementById('regularAssigneeFilter');
            if (ff) ff.innerHTML = `<option value="">${t('allFunctions')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
            if (af) af.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            // Оновлюємо select виконавця для регулярного завдання
            const rta = document.getElementById('regularTaskAssignee');
            if (rta) rta.innerHTML = `<option value="">${t('fromFunctionAuto')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
        }
        let regularChecklistItems = [];
        
        function renderRegularChecklist(items) {
            regularChecklistItems = items || [];
            const container = document.getElementById('regularTaskChecklist');
            if (!container) return;
            container.innerHTML = regularChecklistItems.map((item, i) => `
                <div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0.6rem;background:#f9fafb;border-radius:8px;">
                    <span style="flex:1;font-size:0.85rem;">${escapeHtml(typeof item === 'string' ? item : item.text || item)}</span>
                    <button type="button" onclick="removeRegularChecklistItem(${i})" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:0 4px;">&times;</button>
                </div>
            `).join('');
        }
        
        function addRegularChecklistItem() {
            const input = document.getElementById('regularChecklistInput');
            const text = input.value.trim();
            if (!text) return;
            regularChecklistItems.push({ text: text, done: false });
            input.value = '';
            renderRegularChecklist(regularChecklistItems);
        }
        
        function removeRegularChecklistItem(index) {
            regularChecklistItems.splice(index, 1);
            renderRegularChecklist(regularChecklistItems);
        }
        
        function getRegularChecklist() {
            return regularChecklistItems.map(item => ({
                text: typeof item === 'string' ? item : item.text || '',
                done: false
            }));
        }
        
        async function saveRegularTask(e) {
            e.preventDefault();
            
            if (isSaving) return;
            
            // Rate limiting
            if (!rateLimiter.check('saveRegularTask')) {
                showAlertModal(t('tooManyRequests'));
                return;
            }
            
            const funcName = document.getElementById('regularTaskFunction').value;
            const func = functions.find(f => f.name === funcName);
            const directAssignee = document.getElementById('regularTaskAssignee').value;
            
            if (!directAssignee && (!func || !func.assigneeIds?.length)) {
                showAlertModal(t('selectAssigneeOrFunction'));
                return;
            }
            
            const period = document.getElementById('regularTaskPeriod').value;
            const selectedDays = getSelectedDays();
            
            // Перевірка що вибраний хоча б один день для weekly
            if (period === 'weekly' && selectedDays.length === 0) {
                showAlertModal(t('selectAtLeastOneDay'));
                return;
            }
            
            // Валідація
            const taskData = {
                title: document.getElementById('regularTaskTitle').value.trim(),
                function: funcName,
                timeStart: document.getElementById('regularTaskTimeStart').value
            };
            
            const errors = validateRegularTaskData(taskData);
            if (errors.length > 0) {
                showAlertModal(errors.join('\n'));
                return;
            }
            
            isSaving = true;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            
            // Копіюємо editingId локально
            const currentEditingId = editingId;
            
            const data = {
                title: document.getElementById('regularTaskTitle').value.trim(),
                function: funcName,
                period: period,
                daysOfWeek: period === 'weekly' ? selectedDays : null,
                dayOfMonth: period !== 'weekly' ? document.getElementById('regularTaskDayOfMonth').value : null,
                timeStart: document.getElementById('regularTaskTimeStart').value,
                timeEnd: document.getElementById('regularTaskTimeMode').value === 'end' 
                    ? document.getElementById('regularTaskTimeEnd').value 
                    : calculateEndTime(document.getElementById('regularTaskTimeStart').value, parseInt(document.getElementById('regularTaskDuration').value)),
                duration: document.getElementById('regularTaskTimeMode').value === 'duration' 
                    ? parseInt(document.getElementById('regularTaskDuration').value) 
                    : null,
                expectedResult: document.getElementById('regularTaskExpectedResult').value.trim(),
                reportFormat: document.getElementById('regularTaskReportFormat').value.trim(),
                instruction: document.getElementById('regularTaskInstruction').value.trim(),
                notifyOnComplete: getRegularNotifyUsersFromCheckboxes(),
                priority: document.getElementById('regularTaskPriority').value || 'medium',
                requireReview: document.getElementById('regularTaskRequireReview').checked || false,
                assigneeId: document.getElementById('regularTaskAssignee').value || '',
                checklist: getRegularChecklist()
                // assigneeIds більше не зберігаємо - беруться з функції динамічно
            };
            
            try {
                if (currentEditingId) {
                    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    await db.collection('companies').doc(currentCompany).collection('regularTasks').doc(currentEditingId).update(data);
                    // Локальне оновлення
                    const idx = regularTasks.findIndex(rt => rt.id === currentEditingId);
                    if (idx >= 0) regularTasks[idx] = { ...regularTasks[idx], ...data };
                } else {
                    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    const docRef = await db.collection('companies').doc(currentCompany).collection('regularTasks').add(data);
                    // Локальне додавання
                    regularTasks.unshift({ id: docRef.id, ...data, createdAt: new Date() });
                }
                closeModal('regularTaskModal');
                if (currentRegularView === 'list') renderRegularTasks();
                else renderRegularWeekView();
                
                // Автогенерація завдань для нового/оновленого регулярного
                await autoGenerateRegularTasks();
                
                renderMyDay();
            } catch (error) {
                console.error('saveRegularTask error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            } finally {
                isSaving = false;
                if (submitBtn) submitBtn.disabled = false;
            }
        }

        async function generateFromRegular(id) {
            const rt = regularTasks.find(r => r.id === id);
            if (!rt) return;
            
            // Беремо виконавців з функції
            const func = functions.find(f => f.name === rt.function);
            if (!func || !func.assigneeIds?.length) {
                showAlertModal(t('noExecutorsInFunction'));
                return;
            }
            
            const assigneeIds = func.assigneeIds;
            
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 1);
            const deadlineDate = getLocalDateStr(deadline);
            
            // Визначаємо початок поточного періоду
            const now = new Date();
            let periodStart;
            if (rt.period === 'weekly') {
                // Понеділок поточного тижня
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                periodStart = getLocalDateStr(new Date(now.setDate(diff)));
            } else if (rt.period === 'monthly') {
                // 1-е число поточного місяця
                periodStart = getLocalDateStr(new Date(now.getFullYear(), now.getMonth(), 1));
            } else {
                // Квартал - 1-е число першого місяця кварталу
                const quarter = Math.floor(now.getMonth() / 3);
                periodStart = getLocalDateStr(new Date(now.getFullYear(), quarter * 3, 1));
            }
            
            const batch = db.batch();
            const generatedRefs = [];
            assigneeIds.forEach(assigneeId => {
                const ref = db.collection('companies').doc(currentCompany).collection('tasks').doc();
                generatedRefs.push({ ref, assigneeId });
                batch.set(ref, {
                    title: rt.title,
                    function: rt.function,
                    assigneeId: assigneeId,
                    assigneeName: users.find(u => u.id === assigneeId)?.name || '',
                    deadlineDate: deadlineDate,
                    deadlineTime: rt.timeStart || rt.time || '18:00',
                    deadline: deadlineDate + 'T' + (rt.timeStart || rt.time || '18:00'),
                    expectedResult: rt.expectedResult || '',
                    reportFormat: rt.reportFormat || '',
                    description: rt.instruction || '',
                    status: 'new',
                    priority: rt.priority || 'medium',
                    pinned: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdDate: getLocalDateStr(),
                    creatorId: currentUser.uid,
                    creatorName: t('systemUser'),
                    regularTaskId: id,
                    periodStart: periodStart
                });
            });
            
            await batch.commit();
            
            // Локальне оновлення з реальними ID
            generatedRefs.forEach(({ ref, assigneeId }) => {
                tasks.unshift({
                    id: ref.id,
                    title: rt.title,
                    function: rt.function,
                    assigneeId: assigneeId,
                    assigneeName: users.find(u => u.id === assigneeId)?.name || '',
                    deadlineDate: deadlineDate,
                    deadlineTime: rt.timeStart || rt.time || '18:00',
                    status: 'new',
                    priority: rt.priority || 'medium',
                    regularTaskId: id,
                    createdDate: getLocalDateStr(),
                    createdAt: new Date()
                });
            });
            
            showAlertModal(`${t('createdLabel')} ${assigneeIds.length} ${t('tasksWord')}`);
            renderMyDay();
            refreshCurrentView();
        }

        async function openTodayRegularTask(regularId) {
            const rt = regularTasks.find(r => r.id === regularId);
            if (!rt) return;
            
            const todayStr = getLocalDateStr(new Date());
            
            // Find existing generated task for today
            let todayTask = tasks.find(t => 
                t.regularTaskId === regularId && 
                (t.deadlineDate === todayStr || t.createdDate === todayStr)
            );
            
            if (!todayTask) {
                // Generate task and open it
                const func = functions.find(f => f.name === rt.function);
                if (!func || !func.assigneeIds?.length) {
                    showAlertModal(t('noExecutorsInFunction'));
                    return;
                }
                const assigneeId = func.assigneeIds[0];
                const ref = db.collection('companies').doc(currentCompany).collection('tasks').doc();
                const taskData = {
                    title: rt.title,
                    function: rt.function,
                    assigneeId: assigneeId,
                    assigneeName: users.find(u => u.id === assigneeId)?.name || '',
                    deadlineDate: todayStr,
                    deadlineTime: rt.timeStart || rt.time || '18:00',
                    expectedResult: rt.expectedResult || '',
                    reportFormat: rt.reportFormat || '',
                    description: rt.instruction || '',
                    status: 'new',
                    priority: rt.priority || 'medium',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdDate: todayStr,
                    creatorId: currentUser.uid,
                    regularTaskId: regularId
                };
                await ref.set(taskData);
                todayTask = { id: ref.id, ...taskData, createdAt: new Date() };
                tasks.unshift(todayTask);
                renderMyDay();
            }
            
            // Open the task modal
            openTaskModal(todayTask.id);
        }

        async function deleteRegularTask(id) {
            const rt = regularTasks.find(r => r.id === id);
            if (!rt) return;
            
            const taskName = rt.title || t('regularTaskFallback');
            
            // Оптимістичне видалення
            const rtCopy = { ...rt };
            regularTasks = regularTasks.filter(r => r.id !== id);
            if (currentRegularView === 'list') renderRegularTasks();
            else renderRegularWeekView();
            
            // Показуємо toast з можливістю undo
            showUndoToast(taskName, rtCopy, 'regularTask');
            
            try {
                await db.collection('companies').doc(currentCompany).collection('regularTasks').doc(id).delete();
                // Cleanup orphaned generated tasks — batch замість fire-and-forget
                const orphanTasks = tasks.filter(tk => tk.regularTaskId === id && tk.status !== 'done');
                if (orphanTasks.length > 0) {
                    const CHUNK = 450;
                    for (let i = 0; i < orphanTasks.length; i += CHUNK) {
                        const b = db.batch();
                        orphanTasks.slice(i, i + CHUNK).forEach(tk =>
                            b.delete(db.collection('companies').doc(currentCompany).collection('tasks').doc(tk.id))
                        );
                        await b.commit();
                    }
                }
                tasks = tasks.filter(tk => !(tk.regularTaskId === id && tk.status !== 'done'));
                renderMyDay(); refreshCurrentView();
            } catch (error) {
                // Rollback
                if (!regularTasks.find(r => r.id === id)) {
                    regularTasks.unshift(rtCopy);
                }
                deletedItemsStack = deletedItemsStack.filter(d => d.item.id !== id);
                if (currentRegularView === 'list') renderRegularTasks();
                else renderRegularWeekView();
                hideUndoToast();
                console.error('deleteRegularTask error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
        
        // Швидке виконання регулярного завдання
        async function completeRegularTask(id) {
            const rt = regularTasks.find(r => r.id === id);
            if (!rt) return;
            
            const func = functions.find(f => f.name === rt.function);
            if (!func || !func.assigneeIds?.length) {
                showAlertModal(t('noExecutorsInFunction'));
                return;
            }
            
            // Визначаємо період
            const now = new Date();
            let periodStart;
            if (rt.period === 'weekly') {
                // Для щотижневих з множинними днями - період = сьогодні
                periodStart = getLocalDateStr(now);
            } else if (rt.period === 'monthly') {
                periodStart = getLocalDateStr(new Date(now.getFullYear(), now.getMonth(), 1));
            } else {
                const quarter = Math.floor(now.getMonth() / 3);
                periodStart = getLocalDateStr(new Date(now.getFullYear(), quarter * 3, 1));
            }
            
            // Перевіряємо чи є вже завдання за цей період
            const existingTasks = tasks.filter(t => 
                t.regularTaskId === id && 
                t.periodStart === periodStart &&
                t.assigneeId === currentUser.uid
            );
            
            if (existingTasks.length > 0) {
                // Оновлюємо статус існуючого завдання
                const taskToUpdate = existingTasks[0];
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(taskToUpdate.id).update({
                    status: 'done',
                    completedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                logTaskChange(taskToUpdate.id, 'complete', { status: 'done' }, { status: taskToUpdate.status });
                // Локальне оновлення
                taskToUpdate.status = 'done';
                taskToUpdate.completedAt = new Date().toISOString();
            } else {
                // Створюємо нове і одразу виконане
                const today = getLocalDateStr();
                const newTaskData = {
                    title: rt.title,
                    function: rt.function,
                    assigneeId: currentUser.uid,
                    assigneeName: currentUserData?.name || currentUser.email,
                    deadlineDate: today,
                    deadlineTime: rt.timeStart || rt.time || '18:00',
                    deadline: today + 'T' + (rt.timeStart || rt.time || '18:00'),
                    expectedResult: rt.expectedResult || '',
                    reportFormat: rt.reportFormat || '',
                    description: rt.instruction || '',
                    status: 'done',
                    priority: 'medium',
                    pinned: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdDate: today,
                    creatorName: t('systemUser'),
                    regularTaskId: id,
                    periodStart: periodStart,
                    completedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                const docRef = await db.collection('companies').doc(currentCompany).collection('tasks').add(newTaskData);
                // Локальне додавання
                if (!tasks.some(t => t.id === docRef.id)) tasks.unshift({ id: docRef.id, ...newTaskData, createdAt: new Date(), completedAt: new Date().toISOString() });
            }
            
            renderMyDay();
            if (currentRegularView === 'list') renderRegularTasks();
            else renderRegularWeekView();
        }

        function filterRegularToday() {
            const today = new Date().getDay().toString();
            document.getElementById('regularDayFilter').value = today;
            document.getElementById('regularAssigneeFilter').value = currentUser.uid;
            applyRegularFilters();
        }
        
        function filterRegularMy() {
            const af = document.getElementById('regularAssigneeFilter');
            if (af.value === currentUser.uid) {
                af.value = ''; // toggle off
            } else {
                af.value = currentUser.uid;
            }
            applyRegularFilters();
        }
        
        function applyRegularFilters() {
            renderRegularTasks();
            renderRegularWeekView();
            renderMobileRegularDay();
            updateRegularFilterUI();
        }
        
        function updateRegularFilterUI() {
            const af = document.getElementById('regularAssigneeFilter')?.value;
            const ff = document.getElementById('regularFunctionFilter')?.value;
            const df = document.getElementById('regularDayFilter')?.value;
            
            // Підсвітка кнопки "Мої"
            const myBtn = document.getElementById('regularMyBtn');
            if (myBtn) {
                myBtn.classList.toggle('active', af === currentUser?.uid);
                if (af === currentUser?.uid) {
                    myBtn.style.background = 'var(--primary)';
                    myBtn.style.color = 'white';
                    myBtn.style.borderColor = 'var(--primary)';
                } else {
                    myBtn.style.background = '';
                    myBtn.style.color = '';
                    myBtn.style.borderColor = '';
                }
            }
            
            // Лічильник відфільтрованих
            const total = regularTasks.length;
            const filtered = getFilteredRegularTasks().length;
            const countEl = document.getElementById('regularFilterCount');
            if (countEl) {
                if (af || ff || df) {
                    countEl.textContent = `${filtered} / ${total}`;
                } else {
                    countEl.textContent = `${total}`;
                }
            }
        }
        
        function getFilteredRegularTasks() {
            const ff = document.getElementById('regularFunctionFilter')?.value;
            const af = document.getElementById('regularAssigneeFilter')?.value;
            const dayFilter = document.getElementById('regularDayFilter')?.value;
            
            const todayDate = new Date().getDate();
            const isLastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() === todayDate;
            
            return regularTasks.filter(rt => {
                if (ff && rt.function !== ff) return false;
                
                // Фільтр по виконавцю
                if (af) {
                    const func = functions.find(f => f.name === rt.function);
                    if (!func?.assigneeIds?.includes(af)) return false;
                }
                
                // Фільтр по дню
                if (dayFilter) {
                    if (rt.period === 'weekly') {
                        if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) {
                            if (!rt.daysOfWeek.includes(dayFilter)) return false;
                        } else if (rt.dayOfWeek) {
                            if (rt.dayOfWeek !== dayFilter) return false;
                        }
                    } else if (rt.period === 'daily') {
                        // daily проходить завжди
                    } else {
                        if (rt.dayOfMonth === 'last') {
                            if (!isLastDayOfMonth) return false;
                        } else {
                            if (parseInt(rt.dayOfMonth) !== todayDate) return false;
                        }
                    }
                }
                return true;
            });
        }
        
        function getRegularTaskCompletionStats(rt, daysBack = 30) {
            const now = new Date();
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - daysBack);
            
            // Count expected days
            let expectedDays = 0;
            for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
                const dow = d.getDay();
                if (rt.period === 'daily') expectedDays++;
                else if (rt.period === 'weekly') {
                    const daysArr = rt.daysOfWeek || (rt.dayOfWeek ? [rt.dayOfWeek] : []);
                    if (daysArr.includes(dow.toString())) expectedDays++;
                } else if (rt.period === 'monthly') {
                    const dom = d.getDate();
                    if (rt.dayOfMonth === 'last') {
                        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
                        if (dom === last) expectedDays++;
                    } else if (dom === parseInt(rt.dayOfMonth)) expectedDays++;
                }
            }
            
            // Count completed
            const cutoffStr = getLocalDateStr(cutoff);
            const completedTasks = tasks.filter(t => 
                t.regularTaskId === rt.id && 
                t.status === 'done' &&
                t.deadlineDate && t.deadlineDate >= cutoffStr
            );
            const completedDays = new Set(completedTasks.map(t => t.deadlineDate)).size;
            
            const pct = expectedDays > 0 ? Math.round(completedDays / expectedDays * 100) : 0;
            const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#ef4444';
            
            return { expected: expectedDays, completed: completedDays, pct, color };
        }

        function renderRegularTasks() {
            const c = document.getElementById('regularTasksContainer');
            
            // Оновлюємо селекти (одноразово)
            const assigneeSelect = document.getElementById('regularAssigneeFilter');
            const functionSelect = document.getElementById('regularFunctionFilter');
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            if (assigneeSelect && assigneeSelect.options.length <= 1) {
                assigneeSelect.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            }
            if (functionSelect && functionSelect.options.length <= 1) {
                functionSelect.innerHTML = `<option value="">${t('allFunctions')}</option>` + activeFunctions.map(f => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('');
            }
            
            let filtered = getFilteredRegularTasks();
            
            const pt = { weekly: t('weekly'), monthly: t('monthly'), quarterly: t('quarterly') };
            const days = {
                '0': t('daySun'),
                '1': t('dayMon'),
                '2': t('dayTue'),
                '3': t('dayWed'),
                '4': t('dayThu'),
                '5': t('dayFri'),
                '6': t('daySat')
            };
            
            // Показуємо поточний день у кнопці
            const todayDayName = days[new Date().getDay().toString()];
            const todayBtn = document.getElementById('regularTodayBtn');
            if (todayBtn) {
                todayBtn.innerHTML = `<i data-lucide="calendar-check" class="icon"></i> ${t('todaysTasks')} (${todayDayName})`;
                refreshIcons();
            }
            
            if (filtered.length === 0) {
                const dayFilter = document.getElementById('regularDayFilter')?.value;
                const noTasksMsg = dayFilter ? t('noRegularForDay') : t('noRegular');
                c.innerHTML = `<div class="empty-table"><h3>${noTasksMsg}</h3><p>${t('createRegular')}</p></div>`;
                return;
            }
            
            let html = `
                <table class="tasks-table">
                    <thead>
                        <tr>
                            <th>${t('title')}</th>
                            <th>${t('function')}</th>
                            <th>${t('schedule')}</th>
                            <th>${t('statusPeriod')}</th>
                            <th>${t('completion30d')}</th>
                            <th>${t('assignees')}</th>
                            <th>${t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            filtered.forEach(rt => {
                let scheduleText;
                const displayTime = rt.timeStart || rt.time || '10:00';
                
                // Підтримка старого формату daily
                if (rt.period === 'daily') {
                    scheduleText = `${t('daily')}, ${displayTime}`;
                } else if (rt.period === 'weekly') {
                    // Формуємо текст з вибраних днів
                    const daysList = rt.daysOfWeek || (rt.dayOfWeek ? [rt.dayOfWeek] : ['1']);
                    if (daysList.length === 7) {
                        scheduleText = `${t('daily')}, ${displayTime}`;
                    } else if (daysList.length === 5 && ['1','2','3','4','5'].every(d => daysList.includes(d))) {
                        scheduleText = `${t('monFri')}, ${displayTime}`;
                    } else {
                        const dayNames = daysList.map(d => days[d] || '').filter(Boolean);
                        scheduleText = `${dayNames.join(', ')}, ${displayTime}`;
                    }
                } else {
                    scheduleText = `${rt.dayOfMonth || '1'}-го, ${displayTime}`;
                }
                
                // Беремо виконавців з функції динамічно
                const func = functions.find(f => f.name === rt.function);
                const assigneeNames = func?.assigneeIds?.map(id => {
                    const u = users.find(x => x.id === id);
                    return u?.name || u?.email || '';
                }).filter(Boolean) || [];
                
                // Статус за поточний період
                const statusInfo = getRegularTaskStatus(rt);
                
                html += `
                    <tr>
                        <td>
                            <div style="font-weight:500;">${esc(rt.title)}</div>
                            ${rt.expectedResult ? `<div style="font-size:0.75rem;color:#7f8c8d;margin-top:2px;"><i data-lucide="target" class="icon icon-sm"></i> ${esc(rt.expectedResult.substring(0, 50))}${rt.expectedResult.length > 50 ? '...' : ''}</div>` : ''}
                        </td>
                        <td>${esc(rt.function) || '-'}</td>
                        <td>
                            <span class="status-badge" style="background:#f3e5f5;color:#7b1fa2;">${pt[rt.period] || rt.period}</span>
                            <div style="font-size:0.8rem;margin-top:4px;">${scheduleText}</div>
                        </td>
                        <td>
                            <span class="status-badge" style="background:${statusInfo.color}20;color:${statusInfo.color};font-weight:500;">
                                <i data-lucide="${statusInfo.lucideIcon}" class="icon icon-sm" style="color:${statusInfo.color}"></i> ${statusInfo.text}
                            </span>
                        </td>
                        <td>
                            ${(() => {
                                const stats = getRegularTaskCompletionStats(rt);
                                return `<div style="text-align:center;">
                                    <div style="font-size:1rem;font-weight:700;color:${stats.color};">${stats.pct}%</div>
                                    <div style="font-size:0.68rem;color:#9ca3af;">${stats.completed}/${stats.expected}</div>
                                    <div style="height:4px;background:#e5e7eb;border-radius:2px;margin-top:3px;">
                                        <div style="height:100%;width:${Math.min(stats.pct,100)}%;background:${stats.color};border-radius:2px;"></div>
                                    </div>
                                </div>`;
                            })()}
                        </td>
                        <td>
                            <div style="display:flex;flex-wrap:wrap;gap:2px;">
                                ${assigneeNames.slice(0, 2).map(n => `<span class="assignee-badge" style="font-size:0.7rem;">${n}</span>`).join('') || '-'}
                                ${assigneeNames.length > 2 ? `<span class="assignee-badge" style="font-size:0.7rem;">+${assigneeNames.length - 2}</span>` : ''}
                            </div>
                        </td>
                        <td>
                            <div class="action-btns">
                                ${statusInfo.status === 'notCreated' ? `
                                    <button class="action-btn" onclick="openTodayRegularTask('${escId(rt.id)}')" title="${t('openTask')}" style="background:#2196f3;color:white;"><i data-lucide="external-link" class="icon icon-sm"></i></button>
                                    <button class="action-btn" onclick="completeRegularTask('${escId(rt.id)}')" title="${t('markDone')}" style="background:#4caf50;color:white;"><i data-lucide="check" class="icon icon-sm"></i></button>
                                ` : statusInfo.status === 'inProgress' ? `
                                    <button class="action-btn" onclick="openTodayRegularTask('${escId(rt.id)}')" title="${t('openTask')}" style="background:#2196f3;color:white;"><i data-lucide="external-link" class="icon icon-sm"></i></button>
                                    <button class="action-btn" onclick="completeRegularTask('${escId(rt.id)}')" title="${t('markDone')}" style="background:#4caf50;color:white;"><i data-lucide="check" class="icon icon-sm"></i></button>
                                ` : `
                                    <button class="action-btn" onclick="openTodayRegularTask('${escId(rt.id)}')" title="${t('openTask')}" style="opacity:0.6;"><i data-lucide="external-link" class="icon icon-sm"></i></button>
                                `}
                                ${rt.instruction ? `<button class="action-btn" onclick="showInstruction('${escId(rt.id)}')" title="${t('instruction')}"><i data-lucide="book-open" class="icon icon-sm"></i></button>` : ''}
                                <button class="action-btn" onclick="openRegularTaskModal('${escId(rt.id)}')" title="${t('edit')}"><i data-lucide="pencil" class="icon icon-sm"></i></button>
                                <button class="action-btn" onclick="deleteRegularTask('${escId(rt.id)}')" title="${t('delete')}"><i data-lucide="trash-2" class="icon icon-sm"></i></button>
                            </div>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table>`;
            c.innerHTML = html;
            refreshIcons();
        }
        
        function showInstruction(id) {
            const rt = regularTasks.find(r => r.id === id);
            if (rt && rt.instruction) {
                showAlertModal(`${t('instructionLabel')}:\n\n${rt.instruction}`);
            }
        }
