// =====================
        // FUNCTIONS STRUCTURE VIEW
        // =====================
'use strict';
        let currentFunctionsView = 'cards';
        const DEFAULT_CATEGORIES = [t('funcCatManagement'), 'Люди', t('funcCatEngagement'), t('funcCatSales'), t('funcCatFinance'), t('funcCatPrep'), t('funcCatExecution'), t('funcCatLogistics')];
        
        function setFunctionsView(view) {
            currentFunctionsView = view;
            document.querySelectorAll('[data-fview]').forEach(b => {
                b.style.background = b.dataset.fview === view ? 'white' : 'transparent';
                b.style.fontWeight = b.dataset.fview === view ? '600' : '400';
            });
            document.getElementById('functionsContainer').style.display = view === 'cards' ? '' : 'none';
            document.getElementById('functionsStructureContainer').style.display = view === 'structure' ? '' : 'none';
            if (view === 'structure') renderFunctionsStructure();
            refreshIcons();
        }
        
        function getStructureCategories() {
            // Get categories from functions + defaults
            const fromFunctions = functions.filter(f => f.category).map(f => f.category);
            const saved = JSON.parse(localStorage.getItem('structCategories_' + (currentCompany || '')) || 'null');
            if (saved) return saved;
            // Build from existing + defaults
            const cats = [...new Set([...DEFAULT_CATEGORIES, ...fromFunctions])];
            return cats;
        }
        
        function saveStructureCategories(cats) {
            localStorage.setItem('structCategories_' + (currentCompany || ''), JSON.stringify(cats));
        }
        
        function renderFunctionsStructure() {
            const container = document.getElementById('functionsStructureContainer');
            const categories = getStructureCategories();
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            const todayStr = getLocalDateStr(new Date());
            
            let html = '<div class="struct-board">';
            
            categories.forEach((cat, colIdx) => {
                const colFuncs = activeFunctions.filter(f => f.category === cat);
                const unassigned = colIdx === 0 ? activeFunctions.filter(f => !f.category || !categories.includes(f.category)) : [];
                const allFuncs = [...colFuncs, ...unassigned];
                
                // Aggregate stats
                let totalPeople = 0, totalTasks = 0, totalRegular = 0, totalWeeklyMin = 0;
                allFuncs.forEach(f => {
                    totalPeople += f.assigneeIds?.length || 0;
                    totalTasks += tasks.filter(t => t.function === f.name && t.status !== 'done').length;
                    const fReg = regularTasks.filter(rt => rt.function === f.name);
                    totalRegular += fReg.length;
                    fReg.forEach(rt => {
                        let dur = rt.estimatedTime || 60;
                        if (rt.timeStart && rt.timeEnd) {
                            const [sh,sm] = rt.timeStart.split(':').map(Number);
                            const [eh,em] = rt.timeEnd.split(':').map(Number);
                            dur = (eh*60+em)-(sh*60+sm);
                            if (dur <= 0) dur = 60;
                        }
                        let dpw = 1;
                        if (rt.period === 'daily') dpw = 5;
                        else if (rt.period === 'weekly' && rt.daysOfWeek) dpw = rt.daysOfWeek.length;
                        else if (rt.period === 'monthly') dpw = 0.25;
                        totalWeeklyMin += dur * dpw;
                    });
                });
                const weeklyHrs = Math.round(totalWeeklyMin / 60 * 10) / 10;
                
                html += `
                <div class="struct-column" data-category="${esc(cat)}">
                    <div class="struct-col-header">
                        <span class="struct-col-title" contenteditable="true" onblur="renameCategory(${colIdx}, this.textContent.trim())" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${esc(cat)}</span>
                        <button onclick="removeCategory(${colIdx})" style="background:none;border:none;cursor:pointer;color:#d1d5db;padding:2px;" title="${t('delete')}"><i data-lucide="x" class="icon icon-sm"></i></button>
                    </div>
                    <div class="struct-col-stats">
                        <span><i data-lucide="users" class="icon icon-sm"></i> ${totalPeople}</span>
                        <span><i data-lucide="file-text" class="icon icon-sm"></i> ${totalTasks}</span>
                        <span><i data-lucide="repeat" class="icon icon-sm"></i> ${totalRegular}</span>
                        ${weeklyHrs > 0 ? `<span style="color:#0284c7;font-weight:600;"><i data-lucide="clock" class="icon icon-sm"></i> ${weeklyHrs}</span>` : ''}
                    </div>
                    <div class="struct-col-body" data-col-idx="${colIdx}" data-cat="${esc(cat)}"
                        ondragover="event.preventDefault();this.classList.add('drag-over');"
                        ondragleave="this.classList.remove('drag-over');"
                        ondrop="dropFunction(event, this);">
                        ${allFuncs.map(f => {
                            const fTasks = tasks.filter(t => t.function === f.name && t.status !== 'done').length;
                            const fReg = regularTasks.filter(rt => rt.function === f.name).length;
                            const overdue = tasks.filter(t => t.function === f.name && t.deadlineDate && t.deadlineDate < todayStr && t.status !== 'done').length;
                            return `
                            <div class="struct-func-card" draggable="true" data-func-id="${escId(f.id)}"
                                ondragstart="dragFunction(event, '${escId(f.id)}')"
                                ondragend="this.classList.remove('dragging');">
                                <div style="font-weight:600;margin-bottom:0.25rem;">${esc(f.name)}</div>
                                <div style="display:flex;gap:0.5rem;font-size:0.72rem;color:#6b7280;">
                                    <span><i data-lucide="users" class="icon icon-sm"></i> ${f.assigneeIds?.length || 0}</span>
                                    <span><i data-lucide="file-text" class="icon icon-sm"></i> ${fTasks}</span>
                                    <span><i data-lucide="repeat" class="icon icon-sm"></i> ${fReg}</span>
                                    ${overdue > 0 ? `<span style="color:#ef4444;font-weight:600;display:inline-flex;align-items:center;gap:2px;"><i data-lucide="alert-triangle" class="icon icon-sm"></i> ${overdue}</span>` : ''}
                                </div>
                                ${f.assigneeNames?.length ? `<div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:0.3rem;">${f.assigneeNames.slice(0,2).map(n => `<span style="font-size:0.65rem;background:#e8f5e9;color:#2e7d32;padding:1px 5px;border-radius:4px;">${esc(n)}</span>`).join('')}${f.assigneeNames.length > 2 ? `<span style="font-size:0.65rem;color:#9ca3af;">+${f.assigneeNames.length-2}</span>` : ''}</div>` : ''}
                            </div>`;
                        }).join('')}
                        ${allFuncs.length === 0 ? `<div style="text-align:center;padding:1rem;color:#d1d5db;font-size:0.78rem;">${t('dragHere')}</div>` : ''}
                    </div>
                </div>`;
            });
            
            html += `
                <div class="struct-add-col" onclick="addCategory()">
                    <span><i data-lucide="plus" class="icon icon-sm"></i> ${t('addCategory')}</span>
                </div>
            </div>`;
            
            container.innerHTML = html;
            refreshIcons();
        }
        
        let draggedFuncId = null;
        
        function dragFunction(event, funcId) {
            draggedFuncId = funcId;
            event.target.classList.add('dragging');
            event.dataTransfer.effectAllowed = 'move';
        }
        
        async function dropFunction(event, target) {
            event.preventDefault();
            target.classList.remove('drag-over');
            if (!draggedFuncId) return;
            
            const newCategory = target.dataset.cat;
            const func = functions.find(f => f.id === draggedFuncId);
            if (!func || func.category === newCategory) { draggedFuncId = null; return; }
            
            // Optimistic update
            func.category = newCategory;
            renderFunctionsStructure();
            
            // Save to Firestore
            try {
                await db.collection('companies').doc(currentCompany).collection('functions').doc(draggedFuncId).update({ category: newCategory });
            } catch(e) {
                console.error('Error updating category:', e);
                showToast(t('saveError'), 'error');
            }
            draggedFuncId = null;
        }
        
        function addCategory() {
            const name = prompt(t('categoryName'));
            if (!name || !name.trim()) return;
            const cats = getStructureCategories();
            if (cats.includes(name.trim())) { showToast(t('categoryExists'), 'warning'); return; }
            cats.push(name.trim());
            saveStructureCategories(cats);
            renderFunctionsStructure();
        }
        
        async function removeCategory(idx) {
            const cats = getStructureCategories();
            const cat = cats[idx];
            const funcsInCat = functions.filter(f => f.category === cat);
            if (funcsInCat.length > 0) {
                if (!await showConfirmModal((t('categoryHasFunctions')), { danger: true })) return;
                funcsInCat.forEach(f => { f.category = ''; });
                // Save to Firestore
                const batch = db.batch();
                funcsInCat.forEach(f => {
                    batch.update(db.collection('companies').doc(currentCompany).collection('functions').doc(f.id), { category: '' });
                });
                batch.commit().catch(e => console.error(e));
            }
            cats.splice(idx, 1);
            saveStructureCategories(cats);
            renderFunctionsStructure();
        }
        
        function renameCategory(idx, newName) {
            if (!newName) return;
            const cats = getStructureCategories();
            const oldName = cats[idx];
            if (oldName === newName) return;
            cats[idx] = newName;
            saveStructureCategories(cats);
            
            // Update functions with old category
            const funcsInCat = functions.filter(f => f.category === oldName);
            if (funcsInCat.length > 0) {
                const batch = db.batch();
                funcsInCat.forEach(f => {
                    f.category = newName;
                    batch.update(db.collection('companies').doc(currentCompany).collection('functions').doc(f.id), { category: newName });
                });
                batch.commit().catch(e => console.error(e));
            }
        }
        function openMergeFunctionsModal() {
            const list = document.getElementById('mergeFunctionsList');
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            
            list.innerHTML = activeFunctions.map(f => {
                const taskCount = tasks.filter(t => t.function === f.name).length;
                const regularCount = regularTasks.filter(rt => rt.function === f.name).length;
                const assigneeCount = f.assigneeIds?.length || 0;
                return `
                    <label style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 0.2s;" 
                           onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" name="mergeFunction" value="${esc(f.id)}" onchange="updateMergePreview()" 
                               style="width:18px;height:18px;accent-color:var(--primary);">
                        <div style="flex:1;">
                            <div style="font-weight:500;">${esc(f.name)}</div>
                            <div style="font-size:0.8rem;color:#6b7280;">
                                ${taskCount} ${t('tasksCount')} · ${regularCount} ${t('regularTasksCount')} · ${assigneeCount} ${t('assigneesCount')}
                            </div>
                        </div>
                    </label>
                `;
            }).join('');
            
            document.getElementById('mergedFunctionName').value = '';
            document.getElementById('mergePreview').style.display = 'none';
            document.getElementById('executeMergeBtn').disabled = true;
            
            document.getElementById('mergeFunctionsModal').style.display = 'block';
            refreshIcons();
        }
        
        function updateMergePreview() {
            const selected = Array.from(document.querySelectorAll('input[name="mergeFunction"]:checked')).map(cb => cb.value);
            const preview = document.getElementById('mergePreview');
            const content = document.getElementById('mergePreviewContent');
            const executeBtn = document.getElementById('executeMergeBtn');
            const nameInput = document.getElementById('mergedFunctionName');
            
            if (selected.length < 2) {
                preview.style.display = 'none';
                executeBtn.disabled = true;
                return;
            }
            
            if (selected.length > 5) {
                showAlertModal(t('mergeSelectMaxFive'));
                return;
            }
            
            // Рахуємо статистику
            const selectedFunctions = functions.filter(f => selected.includes(f.id));
            let totalTasks = 0;
            let totalRegular = 0;
            let allAssignees = new Set();
            
            selectedFunctions.forEach(f => {
                totalTasks += tasks.filter(t => t.function === f.name).length;
                totalRegular += regularTasks.filter(rt => rt.function === f.name).length;
                f.assigneeIds?.forEach(id => allAssignees.add(id));
            });
            
            content.innerHTML = `
                <div>• <strong>${totalTasks}</strong> ${t('tasksCount')}</div>
                <div>• <strong>${totalRegular}</strong> ${t('regularTasksCount')}</div>
                <div>• <strong>${allAssignees.size}</strong> ${t('assigneesCount')}</div>
                <div style="margin-top:0.5rem;font-size:0.85rem;color:#059669;">
                    ${t('mergedFrom')}: ${selectedFunctions.map(f => f.name).join(', ')}
                </div>
            `;
            
            preview.style.display = 'block';
            executeBtn.disabled = false;
            
            // Автозаповнення назви якщо порожня
            if (!nameInput.value) {
                nameInput.value = selectedFunctions[0]?.name || '';
            }
        }
        
        async function executeMergeFunctions() {
            const selected = Array.from(document.querySelectorAll('input[name="mergeFunction"]:checked')).map(cb => cb.value);
            const newName = document.getElementById('mergedFunctionName').value.trim();
            
            if (selected.length < 2) {
                showAlertModal(t('mergeSelectMinTwo'));
                return;
            }
            
            if (!newName) {
                showAlertModal(t('mergeEnterName'));
                return;
            }
            
            const executeBtn = document.getElementById('executeMergeBtn');
            executeBtn.disabled = true;
            executeBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span>';
            
            try {
                const selectedFunctions = functions.filter(f => selected.includes(f.id));
                
                // Збираємо всіх виконавців
                let allAssigneeIds = new Set();
                let allAssigneeNames = [];
                let headId = null;
                let headName = null;
                
                selectedFunctions.forEach(f => {
                    f.assigneeIds?.forEach(id => allAssigneeIds.add(id));
                    if (f.headId && !headId) {
                        headId = f.headId;
                        headName = f.headName;
                    }
                });
                
                // Отримуємо імена всіх виконавців
                allAssigneeIds = Array.from(allAssigneeIds);
                allAssigneeNames = allAssigneeIds.map(id => {
                    const user = users.find(u => u.id === id);
                    return user?.name || user?.email || '';
                }).filter(n => n);
                
                // Створюємо нову функцію
                const mergedFunctionData = {
                    name: newName,
                    description: `${t('mergedFrom')}: ${selectedFunctions.map(f => f.name).join(', ')}`,
                    headId: headId,
                    headName: headName,
                    assigneeIds: allAssigneeIds,
                    assigneeNames: allAssigneeNames,
                    mergedFrom: selectedFunctions.map(f => ({ id: f.id, name: f.name, mergedAt: new Date().toISOString() })),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'active'
                };
                
                const newFuncRef = await db.collection('companies').doc(currentCompany).collection('functions').add(mergedFunctionData);
                
                // Оновлюємо завдання - переносимо на нову функцію
                let batch = db.batch();
                let batchCount = 0;
                
                for (const f of selectedFunctions) {
                    // Оновлюємо tasks
                    const tasksToUpdate = tasks.filter(t => t.function === f.name);
                    for (const task of tasksToUpdate) {
                        const taskRef = db.collection('companies').doc(currentCompany).collection('tasks').doc(task.id);
                        batch.update(taskRef, { 
                            function: newName,
                            originalFunction: task.originalFunction || f.name
                        });
                        batchCount++;
                        
                        // Firebase batch limit = 500
                        if (batchCount >= 450) {
                            try {
                            await batch.commit();
                            } catch(err) {
                                console.error('[Batch] commit failed:', err);
                                showToast && showToast(t('savingError'), 'error');
                            }
                            batch = db.batch();
                            batchCount = 0;
                        }
                    }
                    
                    // Оновлюємо regularTasks
                    const regularToUpdate = regularTasks.filter(rt => rt.function === f.name);
                    for (const rt of regularToUpdate) {
                        const rtRef = db.collection('companies').doc(currentCompany).collection('regularTasks').doc(rt.id);
                        batch.update(rtRef, { 
                            function: newName,
                            originalFunction: rt.originalFunction || f.name
                        });
                        batchCount++;
                        
                        if (batchCount >= 450) {
                            try {
                            await batch.commit();
                            } catch(err) {
                                console.error('[Batch] commit failed:', err);
                                showToast && showToast(t('savingError'), 'error');
                            }
                            batch = db.batch();
                            batchCount = 0;
                        }
                    }
                    
                    // Архівуємо стару функцію (не видаляємо)
                    const funcRef = db.collection('companies').doc(currentCompany).collection('functions').doc(f.id);
                    batch.update(funcRef, {
                        status: 'archived',
                        archivedAt: new Date().toISOString(),
                        mergedInto: newFuncRef.id,
                        mergedIntoName: newName
                    });
                    batchCount++;
                }
                
                if (batchCount > 0) {
                    try {
                    await batch.commit();
                    } catch(err) {
                        console.error('[Batch] commit failed:', err);
                        showToast && showToast(t('savingError'), 'error');
                    }
                }
                
                closeModal('mergeFunctionsModal');
                
                // Оновлюємо локальні дані
                await loadAllData();
                
                showAlertModal(t('mergeSuccess'));
                
            } catch (error) {
                console.error('Merge functions error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            } finally {
                executeBtn.disabled = false;
                executeBtn.innerHTML = `<i data-lucide="git-merge" class="icon"></i> <span data-i18n="merge">${t('merge')}</span>`;
                refreshIcons();
            }
        }
