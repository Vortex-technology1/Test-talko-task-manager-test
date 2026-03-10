// =====================
        // AUTO-ADVANCE: Завершення завдання → автопросування процесу
        // =====================
'use strict';
        async function advanceProcessIfLinked(taskId) {
            // AUTO-ADVANCE вимкнено на фронті — обробляється тільки backend
            // trigger onProcessTaskCompleted (транзакційно, без дублювань)
            // Фронт лише показує toast якщо процес просунувся
            const task = tasks.find(t => t.id === taskId);
            if (!task?.processId) return;
            // Просто логуємо для debug, не рухаємо процес
            console.log('[Process] Task', taskId, 'done — waiting for backend trigger');
            return;
            
            const process = processes.find(p => p.id === task.processId);
            if (!process || process.status !== 'active') return;
            
            const template = processTemplates.find(t => t.id === process.templateId);
            if (!template?.steps?.length) return;
            
            const currentStepIndex = process.currentStep || 0;
            if (task.processStep !== currentStepIndex) {
                console.log('[Process] Task step', task.processStep, '!= current step', currentStepIndex, '— skip');
                return;
            }
            
            const currentStep = template.steps[currentStepIndex];
            const nextStepIndex = currentStepIndex + 1;
            const nextStep = template.steps[nextStepIndex];
            
            try {
                // Save step result for context chain
                const stepResult = {
                    step: currentStepIndex,
                    function: currentStep.function,
                    title: currentStep.title || currentStep.function,
                    completedBy: currentUser.uid,
                    completedByName: currentUserData?.name || currentUser?.email || '',
                    completedAt: new Date().toISOString(),
                    taskId: taskId,
                    // Collect result from task comments/report
                    result: task.completionComment || task.expectedResult || '',
                    trackedMinutes: task.timeLog ? task.timeLog.reduce((s, e) => s + (e.minutes || 0), 0) : 0
                };
                
                // History entry
                const historyEntry = {
                    step: currentStepIndex,
                    stepTitle: currentStep?.title || currentStep?.function || (t('stepN') + ' ' + (currentStepIndex + 1)),
                    completedAt: new Date().toISOString(),
                    completedBy: currentUser.uid,
                    completedByName: currentUserData?.name || '',
                    taskId: taskId,
                    auto: true,
                    slaMinutes: currentStep.slaMinutes || 0,
                    actualMinutes: stepResult.trackedMinutes
                };
                
                // Check next step function exists
                if (nextStep) {
                    const checkFunc = functions.find(f => f.name === nextStep.function);
                    if (!checkFunc?.assigneeIds?.length) {
                        showToast(t('noAssigneesInFunc') + ': ' + nextStep.function, 'error');
                        return;
                    }
                }
                
                const updateData = {
                    currentStep: nextStepIndex,
                    history: firebase.firestore.FieldValue.arrayUnion(historyEntry),
                    stepResults: firebase.firestore.FieldValue.arrayUnion(stepResult)
                };
                
                if (!nextStep) {
                    updateData.status = 'completed';
                    updateData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
                }
                
                // Transaction: prevent race
                const processRef = db.collection('companies').doc(currentCompany).collection('processes').doc(task.processId);
                const raceDetected = await db.runTransaction(async (tx) => {
                    const processDoc = await tx.get(processRef);
                    if (!processDoc.exists) return true;
                    const serverStep = processDoc.data().currentStep || 0;
                    if (serverStep !== currentStepIndex) {
                        console.log('[Process] Race detected: server step', serverStep, '!= local', currentStepIndex);
                        return true;
                    }
                    tx.update(processRef, updateData);
                    return false;
                });
                if (raceDetected) {
                    const freshDoc = await processRef.get();
                    if (freshDoc.exists) {
                        const pIdx = processes.findIndex(p => p.id === task.processId);
                        if (pIdx >= 0) processes[pIdx] = { id: freshDoc.id, ...freshDoc.data() };
                    }
                    return;
                }
                
                // Create task for next step
                if (nextStep) {
                    const func = functions.find(f => f.name === nextStep.function);
                    if (func?.assigneeIds?.length) {
                        // Smart assign: least loaded person OR head
                        const assigneeId = nextStep.smartAssign !== false && typeof getSmartAssignee === 'function'
                            ? getSmartAssignee(func)
                            : (func.headId || func.assigneeIds[0]);
                        const assignee = users.find(u => u.id === assigneeId);
                        
                        // Deadline calculation
                        let deadlineDate = getLocalDateStr();
                        if (process.deadline) {
                            const processDeadline = new Date(process.deadline + 'T18:00:00');
                            const remainingAfterThis = template.steps.slice(nextStepIndex + 1).reduce((sum, s) => sum + parseInt(s.slaMinutes || s.estimatedTime || 60), 0);
                            const stepDeadline = new Date(processDeadline.getTime() - remainingAfterThis * 60000);
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            deadlineDate = stepDeadline > tomorrow 
                                ? getLocalDateStr(stepDeadline)
                                : getLocalDateStr(tomorrow);
                        } else if (nextStep.slaMinutes) {
                            const slaDl = new Date(Date.now() + nextStep.slaMinutes * 60000);
                            deadlineDate = getLocalDateStr(slaDl);
                        }
                        
                        // Build context-rich instruction
                        const prevResults = (process.stepResults || []).concat([stepResult]);
                        let contextBlock = '';
                        if (prevResults.length > 0) {
                            contextBlock = `--- ${t('previousStepsLabel')} ---\n` +
                                prevResults.map((r, i) => 
                                    `${i+1}. ${r.title || r.function}: ${r.result || t('noComment')} [${r.completedByName}]`
                                ).join('\n') + '\n---\n\n';
                        }
                        
                        let fullInstruction = contextBlock;
                        if (process.objectName) fullInstruction += `[${process.objectName}]\n`;
                        fullInstruction += nextStep.instruction || '';
                        if (nextStep.expectedResult) {
                            fullInstruction += `\n\n${t('expectedResult')}: ${nextStep.expectedResult}`;
                        }
                        if (nextStep.controlQuestion) {
                            fullInstruction += `\n${t('controlQuestion')}: ${nextStep.controlQuestion}`;
                        }
                        
                        const taskData = {
                            title: `[${process.name}] ${nextStep.title || nextStep.name || nextStep.function}`,
                            function: nextStep.function,
                            assigneeId: assigneeId,
                            assigneeName: assignee?.name || assignee?.email || '',
                            instruction: fullInstruction,
                            description: fullInstruction,
                            expectedResult: nextStep.expectedResult || '',
                            estimatedTime: String(nextStep.slaMinutes || nextStep.estimatedTime || 60),
                            deadlineDate: deadlineDate,
                            deadlineTime: '18:00',
                            status: 'new',
                            priority: 'high',
                            processId: task.processId,
                            processStep: nextStepIndex,
                            processObject: process.objectName || '',
                            requireReview: nextStep.checkpoint || false,
                            createdBy: currentUser.uid,
                            creatorId: currentUser.uid,
                            createdDate: getLocalDateStr(),
                            deadline: deadlineDate + 'T18:00',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            creatorName: t('systemUser')
                        };
                        
                        const newTaskRef = await db.collection('companies').doc(currentCompany).collection('tasks').add(taskData);
                        
                        tasks.push({ id: newTaskRef.id, ...taskData, createdAt: new Date() });
                        
                        showToast(t('processAdvanced').replace('{name}', process.name).replace('{step}', nextStepIndex+1).replace('{total}', template.steps.length).replace('{stepName}', nextStep.title || nextStep.function), 'success');
                        addNotification('process', t('processAdvancedShort'), process.name + ' → ' + (nextStepIndex + 1) + '/' + template.steps.length, null);
                    } else {
                        showToast(t('processNoExecutors').replace('{func}', nextStep.function), 'error');
                    }
                } else {
                    showToast(t('processCompleted').replace('{name}', process.name), 'success');
                    addNotification('completed', t('processCompletedShort'), process.name, null);
                }
                
                // Update local state
                const pIdx = processes.findIndex(p => p.id === task.processId);
                if (pIdx >= 0) {
                    processes[pIdx].currentStep = nextStepIndex;
                    if (!processes[pIdx].stepResults) processes[pIdx].stepResults = [];
                    processes[pIdx].stepResults.push(stepResult);
                    if (!nextStep) processes[pIdx].status = 'completed';
                }
                
                if (document.getElementById('processesTab')?.style.display !== 'none') {
                    renderProcessBoard();
                }
                
            } catch (e) {
                console.error('[advanceProcess]', e);
                showToast(t('error') + ': ' + e.message, 'error');
            }
        }
        
        async function completeProcessStep(processId) {
            const process = processes.find(p => p.id === processId);
            if (!process) return;
            
            const template = processTemplates.find(t => t.id === process.templateId);
            if (!template?.steps?.length) {
                showAlertModal(t('templateNotFound'));
                return;
            }
            
            // Re-read from Firestore to prevent stale state after auto-advance
            try {
                const freshDoc = await db.collection('companies').doc(currentCompany).collection('processes').doc(processId).get();
                if (freshDoc.exists) {
                    const freshData = freshDoc.data();
                    process.currentStep = freshData.currentStep || 0;
                    process.status = freshData.status || 'active';
                    process.history = freshData.history || [];
                }
            } catch(e) { /* use local state as fallback */ }
            
            if (process.status === 'completed') {
                showToast(t('processCompleted').replace('{name}', process.name), 'info');
                return;
            }
            
            const currentStepIndex = Math.min(process.currentStep || 0, template.steps.length - 1);
            const currentStep = template.steps[currentStepIndex];
            
            // Перевіряємо чи є незавершене автозавдання для цього кроку
            const pendingAutoTask = tasks.find(t => 
                t.processId === processId && 
                t.processStep === currentStepIndex && 
                t.status !== 'done' && t.status !== 'review'
            );
            if (pendingAutoTask) {
                const skip = await showConfirmModal(t('skipStepConfirm').replace('{title}', pendingAutoTask.title));
                if (!skip) return;
            }
            
            // Перевіряємо права - чи користувач є членом функції поточного етапу
            const currentFunc = functions.find(f => f.name === currentStep.function);
            if (currentFunc && !currentFunc.assigneeIds?.includes(currentUser?.uid)) {
                // Дозволяємо також власникам/менеджерам
                const userRole = currentUserData?.role;
                if (userRole !== 'owner' && userRole !== 'manager') {
                    showAlertModal(t('onlyFunctionMembers'));
                    return;
                }
            }
            
            const nextStepIndex = currentStepIndex + 1;
            const nextStep = template.steps[nextStepIndex];
            
            try {
                const processRef = db.collection('companies').doc(currentCompany).collection('processes').doc(processId);
                
                // runTransaction — race protection: два менеджери не просунуть крок двічі
                const raceDetected = await db.runTransaction(async (tx) => {
                    const freshDoc = await tx.get(processRef);
                    if (!freshDoc.exists) return true;
                    const serverStep = freshDoc.data().currentStep || 0;
                    if (serverStep !== currentStepIndex) {
                        // Хтось вже просунув цей крок
                        return true;
                    }
                    const historyEntry = {
                        step: currentStepIndex,
                        stepTitle: currentStep.title || currentStep.function,
                        completedAt: new Date().toISOString(),
                        completedBy: currentUser.uid
                    };
                    const updateData = {
                        currentStep: nextStepIndex,
                        history: firebase.firestore.FieldValue.arrayUnion(historyEntry)
                    };
                    if (!nextStep) {
                        updateData.status = 'completed';
                        updateData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
                    }
                    tx.update(processRef, updateData);
                    return false;
                });
                
                if (raceDetected) {
                    showToast(t('processStepAlreadyCompleted') || 'Крок вже виконано іншим користувачем', 'info');
                    await loadProcessData();
                    renderProcessBoard();
                    return;
                }
                
                // Якщо є наступний етап - створюємо завдання
                if (nextStep) {
                    const func = functions.find(f => f.name === nextStep.function);
                    if (func?.assigneeIds?.length) {
                        const headId = func.headId || func.assigneeIds[0];
                        const head = users.find(u => u.id === headId);
                        
                        // Smart deadline calculation
                        let stepDeadlineDate = getLocalDateStr();
                        if (process.deadline) {
                            const processDeadline = new Date(process.deadline + 'T18:00:00');
                            const remainingAfterThis = template.steps.slice(nextStepIndex + 1).reduce((sum, s) => sum + parseInt(s.estimatedTime || 60), 0);
                            const stepDeadline = new Date(processDeadline.getTime() - remainingAfterThis * 60000);
                            const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
                            stepDeadlineDate = stepDeadline > tomorrow ? getLocalDateStr(stepDeadline) : getLocalDateStr(tomorrow);
                        }
                        
                        const newTaskData = {
                            title: `[${process.name}] ${nextStep.title || nextStep.function}`,
                            function: nextStep.function,
                            assigneeId: headId,
                            assigneeName: head?.name || head?.email || '',
                            instruction: nextStep.instruction || '',
                            estimatedTime: nextStep.estimatedTime || '60',
                            deadlineDate: stepDeadlineDate,
                            deadlineTime: '18:00',
                            status: 'new',
                            priority: 'high',
                            processId: processId,
                            processStep: nextStepIndex,
                            createdBy: currentUser.uid,
                            creatorId: currentUser.uid,
                            createdDate: getLocalDateStr(),
                            deadline: stepDeadlineDate + 'T18:00',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            creatorName: t('systemUser')
                        };
                        const docRef = await db.collection('companies').doc(currentCompany).collection('tasks').add(newTaskData);
                        // Локально додаємо задачу — без повного loadAllData()
                        tasks.unshift({ id: docRef.id, ...newTaskData, createdAt: new Date(), updatedAt: new Date() });
                    } else {
                        // Попередження якщо функція не має виконавців
                        showAlertModal(t('functionNoExecutorsWarning').replace('{name}', nextStep.function));
                    }
                }
                
                closeModal('viewProcessModal');
                await loadProcessData();
                // Замість loadAllData() — tasks[] вже оновлено локально, рендеримо точково
                renderProcessBoard();
                if (typeof renderMyDay === 'function') renderMyDay();
                refreshCurrentView();
                showAlertModal(nextStep ? t('stepCompleted') : t('processCompleted'));
                
            } catch (error) {
                console.error('completeProcessStep error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
