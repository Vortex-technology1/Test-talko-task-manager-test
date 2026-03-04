// =====================
    // AI STRUCTURE GENERATOR + IMPORT + ASSISTANTS CONFIG
    // =====================
    let generatedStructure = null;
    
    function openAiGeneratorModal() {
        if (currentUserData?.role !== 'owner' && currentUserData?.role !== 'admin' && !isSuperAdmin) {
            showToast(t('ownerOnly'), 'error'); return;
        }
        if (!currentCompany) {
            showToast(t('selectCompanyFirst'), 'error'); return;
        }
        document.getElementById('aiGenPrompt').value = '';
        document.getElementById('aiGenPreview').style.display = 'none';
        document.getElementById('aiGenLoading').style.display = 'none';
        document.getElementById('aiGenBtn').style.display = '';
        generatedStructure = null;
        document.getElementById('aiGeneratorModal').style.display = 'block';
        refreshIconsNow();
    }
    
    function openImportStructureModal() {
        if (currentUserData?.role !== 'owner' && currentUserData?.role !== 'admin' && !isSuperAdmin) {
            showToast(t('ownerOnly'), 'error'); return;
        }
        if (!currentCompany) {
            showToast(t('selectCompanyFirst'), 'error'); return;
        }
        document.getElementById('importJsonText').value = '';
        document.getElementById('importStructureModal').style.display = 'block';
    }
    
    async function runAiGenerator() {
        const prompt = document.getElementById('aiGenPrompt').value.trim();
        if (!prompt) return;
        
        document.getElementById('aiGenBtn').style.display = 'none';
        document.getElementById('aiGenLoading').style.display = 'block';
        document.getElementById('aiGenPreview').style.display = 'none';
        
        try {
            // Ensure structureGenerator assistant exists
            await ensureDefaultAssistants();
            
            // Call Cloud Function
            const aiAssistant = firebase.app().functions('europe-west1').httpsCallable('aiAssistant');
            const result = await aiAssistant({
                companyId: currentCompany,
                assistantId: 'structureGenerator',
                userMessage: prompt,
                contextData: {
                    existingFunctions: functions.map(f => f.name),
                    existingUsers: users.map(u => ({ name: u.name, role: u.role }))
                }
            });
            
            // Parse JSON from response
            let content = result.data.content;
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) content = jsonMatch[1];
            
            generatedStructure = JSON.parse(content);
            renderStructurePreview(generatedStructure);
            
        } catch (e) {
            console.error('AI Generator error:', e);
            showToast(t('aiGeneratorError'), 'error', 5000);
            document.getElementById('aiGenBtn').style.display = '';
        }
        
        document.getElementById('aiGenLoading').style.display = 'none';
    }
    
    function renderStructurePreview(data) {
        const container = document.getElementById('aiGenPreviewContent');
        let html = '';
        
        if (data.functions?.length) {
            html += `<div style="font-weight:600;margin-bottom:0.3rem;">${t('tabFunctions')} (${data.functions.length}):</div>`;
            data.functions.forEach(f => {
                html += `<div style="padding:0.3rem 0;border-bottom:1px solid #e5e7eb;">
                    <strong>${esc(f.name)}</strong> ${f.description ? `<span style="color:#6b7280;">— ${esc(f.description.substring(0, 60))}...</span>` : ''}
                    ${f.regularTasks?.length ? `<div style="font-size:0.72rem;color:#8b5cf6;margin-top:2px;">${f.regularTasks.length} рег. задач</div>` : ''}
                </div>`;
            });
        }
        
        if (data.processTemplates?.length) {
            html += `<div style="font-weight:600;margin-top:0.75rem;margin-bottom:0.3rem;">${t('processTemplates')} (${data.processTemplates.length}):</div>`;
            data.processTemplates.forEach(pt => {
                html += `<div style="padding:0.3rem 0;border-bottom:1px solid #e5e7eb;">
                    <strong>${esc(pt.name)}</strong>
                    <div style="font-size:0.72rem;color:#6b7280;">${pt.steps?.map(s => esc(s.function)).join(' → ')}</div>
                </div>`;
            });
        }
        
        if (data.taskTemplates?.length) {
            html += `<div style="font-weight:600;margin-top:0.75rem;margin-bottom:0.3rem;">${t('taskTemplates')} (${data.taskTemplates.length}):</div>`;
            data.taskTemplates.forEach(tt => {
                html += `<div style="padding:0.3rem 0;font-size:0.82rem;">${esc(tt.title)} <span style="color:#6b7280;">[${esc(tt.function || '')}]</span></div>`;
            });
        }
        
        container.innerHTML = html || '<p style="color:#6b7280;">' + t('emptyStructure') + '</p>';
        document.getElementById('aiGenPreview').style.display = 'block';
    }
    
    async function applyAiStructure() {
        if (!generatedStructure) return;
        await importStructure(generatedStructure);
        closeModal('aiGeneratorModal');
    }
    
    async function importStructureFromJson() {
        const text = document.getElementById('importJsonText').value.trim();
        if (!text) return;
        
        try {
            const data = JSON.parse(text);
            await importStructure(data);
            closeModal('importStructureModal');
        } catch (e) {
            showAlertModal('JSON parse error: ' + e.message);
        }
    }
    
    async function importStructure(data) {
        if (!currentCompany) return;
        const base = db.collection('companies').doc(currentCompany);
        
        let created = { functions: 0, regularTasks: 0, processTemplates: 0, taskTemplates: 0 };
        
        try {
            // 1. Create functions
            if (data.functions?.length) {
                for (const f of data.functions) {
                    // Skip if function with same name exists
                    if (functions.find(ef => ef.name === f.name)) continue;
                    
                    const funcData = {
                        name: f.name,
                        description: f.description || '',
                        status: 'active',
                        assigneeIds: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    const funcRef = await base.collection('functions').add(funcData);
                    functions.push({ id: funcRef.id, ...funcData, assigneeIds: [] });
                    created.functions++;
                    
                    // Create regular tasks for this function
                    if (f.regularTasks?.length) {
                        for (const rt of f.regularTasks) {
                            const rtData = {
                                title: rt.title,
                                function: f.name,
                                instruction: rt.instruction || rt.description || '',
                                scheduleType: rt.scheduleType || 'daily',
                                scheduleDays: rt.scheduleDays || [],
                                scheduleMonthDay: rt.scheduleMonthDay || null,
                                deadlineTime: rt.deadlineTime || '18:00',
                                startTime: rt.startTime || '',
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            };
                            await base.collection('regularTasks').add(rtData);
                            created.regularTasks++;
                        }
                    }
                }
            }
            
            // 2. Create process templates
            if (data.processTemplates?.length) {
                for (const pt of data.processTemplates) {
                    const ptData = {
                        name: pt.name,
                        description: pt.description || '',
                        steps: (pt.steps || []).map(s => ({
                            function: s.function,
                            title: s.title || '',
                            expectedResult: s.expectedResult || '',
                            controlQuestion: s.controlQuestion || '',
                            instruction: s.instruction || '',
                            slaMinutes: s.slaMinutes || 0,
                            checkpoint: s.checkpoint || false,
                            smartAssign: s.smartAssign !== false
                        })),
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        createdBy: currentUser.uid
                    };
                    await base.collection('processTemplates').add(ptData);
                    created.processTemplates++;
                }
            }
            
            // 3. Create task templates
            if (data.taskTemplates?.length) {
                for (const tt of data.taskTemplates) {
                    const ttData = {
                        title: tt.title,
                        function: tt.function || '',
                        description: tt.description || tt.instruction || '',
                        priority: tt.priority || 'medium',
                        estimatedTime: tt.estimatedTime || '60',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    await base.collection('taskTemplates').add(ttData);
                    created.taskTemplates++;
                }
            }
            
            // Reload
            await loadAllData();
            
            const msg = `${t('imported')}: ${created.functions} ${t('tabFunctions')}, ${created.regularTasks} ${t('tabRegular')}, ${created.processTemplates} ${t('processTemplates')}, ${created.taskTemplates} шаблонів`;
            showToast(msg, 'success', 5000);
            
        } catch (e) {
            console.error('Import error:', e);
            showToast(t('error') + ': ' + e.message, 'error');
        }
    }
