// =====================
    // FOCUS MODE - Конвеєрний режим виконання завдань
    // =====================
'use strict';
    const AI_TECH_LEAD_URL = 'https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-technical-lead';
    
    function getAiHelpUrl(taskTitle, taskDescription, taskFunction) {
        const prompt = encodeURIComponent(
            t('aiPromptHelp') + '\n' +
            t('aiPromptName') + ' ' + (taskTitle || '') + '\n' +
            `${taskFunction ? t('functionColon') + ': ' + taskFunction + '\n' : ''}` +
            `${taskDescription ? t('instructionColon') + ': ' + taskDescription + '\n' : ''}` +
            t('aiPromptExplain')
        );
        return AI_TECH_LEAD_URL + '?q=' + prompt;
    }
    
    function getAiHelpButton(taskTitle, taskDescription, taskFunction, size) {
        const url = getAiHelpUrl(taskTitle, taskDescription, taskFunction);
        if (size === 'small') {
            return `<a href="${url}" target="_blank" onclick="event.stopPropagation();" style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:0.7rem;color:#16a34a;text-decoration:none;white-space:nowrap;" title="${t('askAI')}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                AI
            </a>`;
        }
        if (size === 'medium') {
            return `<a href="${url}" target="_blank" onclick="event.stopPropagation();" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:0.8rem;color:#16a34a;text-decoration:none;font-weight:500;" title="${t('askAIAssistant')}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ${t('notClear')} ${t('askAI')}
            </a>`;
        }
        // large - for focus mode
        return `<a href="${url}" target="_blank" onclick="event.stopPropagation();" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;font-size:0.9rem;color:#16a34a;text-decoration:none;font-weight:600;margin-top:0.75rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ${t('notClear')} ${t('askAIAssistant')}
        </a>`;
    }
    
    let focusTasks = [];
    let focusCurrentIndex = 0;
    let focusTimerInterval = null;
    let focusTimerSeconds = 0;
    let focusTimerRunning = false;
    
    function getFocusTasks() {
        const today = new Date();
        const todayStr = getLocalDateStr(today);
        const todayDay = today.getDay();
        const result = [];
        
        const funcByName = {};
        functions.forEach(f => { funcByName[f.name] = f; });
        
        const generatedTaskIndex = {};
        tasks.forEach(t => {
            if (t.regularTaskId && t.deadlineDate === todayStr && t.assigneeId === currentUser?.uid) {
                if (!generatedTaskIndex[t.regularTaskId]) generatedTaskIndex[t.regularTaskId] = t;
            }
        });
        
        // Разові
        tasks.filter(t => {
            if (t.assigneeId !== currentUser?.uid) return false;
            if (t.status === 'done' || t.status === 'review') return false;
            if (t.deadlineDate === todayStr) return true;
            if (t.deadlineDate < todayStr) return true;
            return false;
        }).forEach(t => {
            result.push({
                id: t.id,
                title: t.title,
                time: t.deadlineTime || '',
                description: t.description || t.instruction || '',
                function: t.function || '',
                estimatedTime: parseInt(t.estimatedTime || t.duration || '60'),
                type: 'task',
                processId: t.processId || null,
                processStep: t.processStep,
                priority: t.priority || 'medium',
                overdue: t.deadlineDate < todayStr,
                checklist: t.checklist || [],
                originalTask: t
            });
        });
        
        // Регулярні (не виконані)
        regularTasks.forEach(rt => {
            const func = funcByName[rt.function];
            if (!func || !func.assigneeIds?.includes(currentUser?.uid)) return;
            
            let isToday = false;
            if (rt.period === 'daily') isToday = true;
            else if (rt.period === 'weekly') {
                if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) isToday = rt.daysOfWeek.includes(todayDay.toString());
                else if (rt.dayOfWeek) isToday = rt.dayOfWeek === todayDay.toString();
            } else if (rt.period === 'monthly') {
                const todayDate = today.getDate();
                isToday = rt.dayOfMonth === 'last' 
                    ? todayDate === new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
                    : todayDate === parseInt(rt.dayOfMonth);
            }
            if (!isToday) return;
            
            const gen = generatedTaskIndex[rt.id];
            if (gen?.status === 'done' || gen?.status === 'review') return;
            
            result.push({
                id: rt.id,
                generatedTaskId: gen?.id || null,
                title: rt.title,
                time: rt.timeStart || rt.time || '',
                description: rt.instruction || rt.description || '',
                function: rt.function || '',
                estimatedTime: parseInt(rt.estimatedTime || rt.duration || '30'),
                type: 'regular',
                processId: null,
                priority: 'medium',
                overdue: false,
                checklist: [],
                originalTask: gen || rt
            });
        });
        
        // Сортування: прострочені → по часу
        result.sort((a, b) => {
            if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
            return (a.time || '99:99').localeCompare(b.time || '99:99');
        });
        
        return result;
    }
    
    function startFocusMode() {
        focusTasks = getFocusTasks();
        if (focusTasks.length === 0) {
            showToast(t('noTasksToday'), 'info');
            return;
        }
        focusCurrentIndex = 0;
        document.getElementById('focusModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        renderFocusTask();
    }
    
    function closeFocusMode() {
        closeModal('focusModal');
        document.body.style.overflow = '';
        stopFocusTimer();
        renderMyDay();
    }
    
    function renderFocusTask() {
        const task = focusTasks[focusCurrentIndex];
        if (!task) {
            renderFocusComplete();
            return;
        }
        
        const total = focusTasks.length;
        const doneCount = focusCurrentIndex;
        const progressPercent = Math.round((doneCount / total) * 100);
        
        // Process badge
        let processBadge = '';
        if (task.processId) {
            const process = processes.find(p => p.id === task.processId);
            const template = process ? processTemplates.find(t => t.id === process.templateId) : null;
            if (process && template) {
                processBadge = `<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(139,92,246,0.1);border-radius:8px;font-size:0.8rem;color:#7c3aed;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    ${esc(process.name)} — ${t('stepNofTotal').replace('{n}', (task.processStep||0)+1).replace('{total}', template.steps.length)}
                </div>`;
            }
        }
        
        // Priority color
        const prioColors = { urgent: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280' };
        const prioNames = { urgent: t('priorityNames_urgent'), high: t('priorityNames_high'), medium: t('priorityNames_medium'), low: t('priorityNames_low') };
        
        // Checklist
        let checklistHtml = '';
        if (task.checklist?.length > 0) {
            checklistHtml = `<div style="margin-top:1rem;">
                <div style="font-size:0.8rem;font-weight:600;color:#6b7280;margin-bottom:0.5rem;">${t('checklistLabel')}:</div>
                ${task.checklist.map((item, i) => `
                    <label style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f3f4f6;cursor:pointer;font-size:0.9rem;" onclick="event.stopPropagation();">
                        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleFocusChecklist(${i})" style="width:18px;height:18px;accent-color:#22c55e;">
                        <span style="${item.done ? 'text-decoration:line-through;color:#9ca3af;' : ''}">${esc(item.text || item.title || item)}</span>
                    </label>
                `).join('')}
            </div>`;
        }
        
        // Estimated time for timer
        const estMinutes = task.estimatedTime || 30;
        
        const container = document.getElementById('focusContent');
        container.innerHTML = `
            <!-- Progress bar -->
            <div style="padding:1rem 1.5rem 0;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                    <span style="font-size:0.8rem;color:#9ca3af;">${t('taskNofM').replace('{n}', doneCount + 1).replace('{total}', total)}</span>
                    <span style="font-size:0.8rem;color:#9ca3af;">${progressPercent}%</span>
                </div>
                <div style="height:6px;background:#f3f4f6;border-radius:99px;overflow:hidden;">
                    <div style="height:100%;width:${progressPercent}%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:99px;transition:width 0.5s ease;"></div>
                </div>
            </div>
            
            <!-- Task card -->
            <div style="padding:1.5rem;flex:1;overflow-y:auto;">
                <!-- Status badges -->
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1rem;">
                    ${task.time ? `<div style="display:flex;align-items:center;gap:4px;padding:4px 10px;background:#f0fdf4;border-radius:8px;font-size:0.8rem;color:#16a34a;font-weight:500;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${esc(task.time)}
                    </div>` : ''}
                    <div style="display:flex;align-items:center;gap:4px;padding:4px 10px;background:${prioColors[task.priority]}15;border-radius:8px;font-size:0.8rem;color:${prioColors[task.priority]};font-weight:500;">
                        ${prioNames[task.priority] || task.priority}
                    </div>
                    ${task.function ? `<div style="padding:4px 10px;background:#f3f4f6;border-radius:8px;font-size:0.8rem;color:#6b7280;">${esc(task.function)}</div>` : ''}
                    ${task.overdue ? `<div style="padding:4px 10px;background:#fef2f2;border-radius:8px;font-size:0.8rem;color:#ef4444;font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${t('overdueStatus')}</div>` : ''}
                </div>
                
                ${processBadge}
                
                <!-- Title -->
                <h2 style="margin:1rem 0 0.5rem;font-size:1.4rem;font-weight:700;line-height:1.3;color:#1a1a1a;">${esc(task.title)}</h2>
                
                <!-- Timer -->
                <div style="display:flex;align-items:center;gap:1rem;margin:1.5rem 0;padding:1rem;background:#f9fafb;border-radius:12px;">
                    <div style="font-size:2rem;font-weight:700;font-variant-numeric:tabular-nums;color:#1a1a1a;letter-spacing:1px;" id="focusTimerDisplay">
                        ${String(Math.floor(estMinutes)).padStart(2,'0')}:00
                    </div>
                    <div style="display:flex;gap:0.5rem;">
                        <button onclick="toggleFocusTimer(${estMinutes})" id="focusTimerBtn" style="width:40px;height:40px;border:none;border-radius:50%;background:#22c55e;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                        <button onclick="resetFocusTimer(${estMinutes})" style="width:40px;height:40px;border:none;border-radius:50%;background:#f3f4f6;color:#6b7280;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                    </div>
                    <div style="font-size:0.75rem;color:#9ca3af;">
                        ${t('estMinutes').replace('{n}', estMinutes)}
                    </div>
                </div>
                
                <!-- Description / Instruction -->
                ${task.description ? `
                    <div style="margin:1rem 0;padding:1rem;background:#fffbeb;border-radius:12px;border-left:4px solid #f59e0b;">
                        <div style="font-size:0.75rem;font-weight:600;color:#92400e;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> ${t('instructionLabel')}</div>
                        <div style="font-size:0.9rem;color:#451a03;line-height:1.6;white-space:pre-line;">${esc(task.description)}</div>
                    </div>
                    ${getAiHelpButton(task.title, task.description, task.function, 'large')}
                ` : `
                    ${getAiHelpButton(task.title, '', task.function, 'large')}
                `}
                
                ${checklistHtml}
            </div>
            
            <!-- Action buttons - sticky bottom -->
            <div style="padding:1rem 1.5rem;border-top:1px solid #f3f4f6;background:white;display:flex;gap:0.75rem;">
                <button onclick="focusSkipTask()" style="flex:1;padding:1rem;border:2px solid #e5e7eb;border-radius:14px;background:white;font-size:0.95rem;font-weight:600;color:#6b7280;cursor:pointer;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg> ${t('skipAction')}
                </button>
                <button onclick="focusCompleteTask()" style="flex:2;padding:1rem;border:none;border-radius:14px;background:linear-gradient(135deg,#22c55e,#16a34a);font-size:1.05rem;font-weight:700;color:white;cursor:pointer;box-shadow:0 4px 14px rgba(34,197,94,0.4);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-3px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${t('doneAction')}
                </button>
            </div>
        `;
        
        // Reset timer
        stopFocusTimer();
        focusTimerSeconds = estMinutes * 60;
        focusTimerRunning = false;
        updateFocusTimerDisplay();
    }
    
    function renderFocusComplete() {
        const total = focusTasks.length;
        const container = document.getElementById('focusContent');
        container.innerHTML = `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;">
                <div style="width:80px;height:80px;background:#f0fdf4;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h2 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700;">${t('allTasksDone')}</h2>
                <p style="color:#6b7280;margin-bottom:2rem;">${total} ' + t('greatJobToday') + '</p>
                <button onclick="closeFocusMode()" style="padding:1rem 3rem;border:none;border-radius:14px;background:linear-gradient(135deg,#22c55e,#16a34a);font-size:1rem;font-weight:700;color:white;cursor:pointer;">
                    Закрити
                </button>
            </div>
        `;
    }
    
    async function focusCompleteTask() {
        const task = focusTasks[focusCurrentIndex];
        if (!task) return;
        
        stopFocusTimer();
        
        // Анімація
        const content = document.getElementById('focusContent');
        content.style.opacity = '0.5';
        content.style.transform = 'translateX(-30px)';
        
        try {
            if (task.type === 'regular') {
                // Для регулярних — toggleMyDayTask логіка
                const todayStr = getLocalDateStr();
                
                if (task.generatedTaskId) {
                    await db.collection('companies').doc(currentCompany).collection('tasks').doc(task.generatedTaskId).update({
                        status: 'done',
                        completedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    logTaskChange(task.generatedTaskId, 'complete', { status: 'done' }, { status: 'new' });
                    const local = tasks.find(t => t.id === task.generatedTaskId);
                    if (local) local.status = 'done';
                } else {
                    // Створюємо new task для regular
                    const rt = regularTasks.find(r => r.id === task.id);
                    const func = functions.find(f => f.name === rt?.function);
                    const headId = func?.headId || func?.assigneeIds?.[0] || currentUser.uid;
                    const head = users.find(u => u.id === headId);
                    
                    const ref = await db.collection('companies').doc(currentCompany).collection('tasks').add({
                        title: rt?.title || task.title,
                        function: rt?.function || '',
                        assigneeId: currentUser.uid,
                        assigneeName: currentUserData?.name || currentUser.email,
                        deadlineDate: todayStr,
                        deadlineTime: task.time || '18:00',
                        deadline: todayStr + 'T' + (task.time || '18:00'),
                        status: 'done',
                        priority: rt?.priority || 'medium',
                        pinned: false,
                        completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        regularTaskId: task.id,
                        autoGenerated: true,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        createdDate: todayStr,
                        creatorId: currentUser.uid,
                        creatorName: t('systemUser')
                    });
                    tasks.unshift({ id: ref.id, status: 'done', regularTaskId: task.id, deadlineDate: todayStr, deadlineTime: task.time || '18:00', assigneeId: currentUser.uid, autoGenerated: true, createdDate: todayStr, createdAt: new Date() });
                }
            } else {
                // Разове завдання
                const needsReview = shouldSendForReview(task.originalTask);
                const newStatus = needsReview ? 'review' : 'done';
                
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(task.id).update({
                    status: newStatus,
                    completedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                logTaskChange(task.id, 'complete', { status: newStatus }, { status: task.originalTask?.status || 'new' });
                
                const local = tasks.find(t => t.id === task.id);
                if (local) local.status = newStatus;
                
                // Автопросування процесу
                if (!needsReview) {
                    advanceProcessIfLinked(task.id);
                }
                // Автостатус проєкту
                if (task.projectId) autoUpdateProjectStatus(task.projectId);
                
                if (needsReview) {
                    showToast(t('sentForReview'), 'info');
                }
            }
        } catch (e) {
            console.error('focusComplete error:', e);
            showToast(t('error') + ': ' + e.message, 'error');
        }
        
        // Переходимо до наступного
        setTimeout(() => {
            focusCurrentIndex++;
            content.style.opacity = '1';
            content.style.transform = 'translateX(0)';
            renderFocusTask();
        }, 300);
    }
    
    function focusSkipTask() {
        stopFocusTimer();
        const content = document.getElementById('focusContent');
        content.style.opacity = '0.5';
        
        // Переміщуємо в кінець
        const skipped = focusTasks.splice(focusCurrentIndex, 1)[0];
        if (skipped) focusTasks.push(skipped);
        
        setTimeout(() => {
            content.style.opacity = '1';
            if (focusCurrentIndex >= focusTasks.length) focusCurrentIndex = 0;
            renderFocusTask();
        }, 200);
    }
    
    // Timer
    function toggleFocusTimer(estMinutes) {
        if (focusTimerRunning) {
            stopFocusTimer();
        } else {
            if (focusTimerSeconds <= 0) focusTimerSeconds = estMinutes * 60;
            focusTimerRunning = true;
            const btn = document.getElementById('focusTimerBtn');
            if (btn) btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            
            focusTimerInterval = setInterval(() => {
                focusTimerSeconds--;
                updateFocusTimerDisplay();
                if (focusTimerSeconds <= 0) {
                    stopFocusTimer();
                    // Vibrate + visual alert
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                    const display = document.getElementById('focusTimerDisplay');
                    if (display) { display.style.color = '#ef4444'; display.textContent = '00:00'; }
                }
            }, 1000);
        }
    }
    
    function stopFocusTimer() {
        focusTimerRunning = false;
        if (focusTimerInterval) clearInterval(focusTimerInterval);
        focusTimerInterval = null;
        const btn = document.getElementById('focusTimerBtn');
        if (btn) btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
    
    function resetFocusTimer(estMinutes) {
        stopFocusTimer();
        focusTimerSeconds = estMinutes * 60;
        updateFocusTimerDisplay();
        const display = document.getElementById('focusTimerDisplay');
        if (display) display.style.color = '#1a1a1a';
    }
    
    function updateFocusTimerDisplay() {
        const display = document.getElementById('focusTimerDisplay');
        if (!display) return;
        const m = Math.floor(focusTimerSeconds / 60);
        const s = focusTimerSeconds % 60;
        display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
    
    function toggleFocusChecklist(index) {
        const task = focusTasks[focusCurrentIndex];
        if (!task?.checklist?.[index]) return;
        task.checklist[index].done = !task.checklist[index].done;
    }
