// =====================
    // TASK TEMPLATES
    // =====================
    let taskTemplates = [];
    
    function toggleAddTaskMenu(event) {
        event.stopPropagation();
        const menu = document.getElementById('addTaskMenu');
        const isOpen = menu.style.display !== 'none';
        menu.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            document.addEventListener('click', closeAddTaskMenu, { once: true });
        }
        refreshIcons();
    }
    
    function closeAddTaskMenu() {
        const menu = document.getElementById('addTaskMenu');
        if (menu) menu.style.display = 'none';
    }
    
    async function loadTaskTemplates() {
        if (!currentCompany) return;
        try {
            const snap = await db.collection('companies').doc(currentCompany).collection('taskTemplates').orderBy('title').get();
            taskTemplates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch(e) { console.error('loadTaskTemplates:', e); }
    }
    
    function openTemplatePickerModal() {
        loadTaskTemplates().then(() => {
            const body = document.getElementById('templatePickerBody');
            if (taskTemplates.length === 0) {
                body.innerHTML = `
                    <div style="text-align:center;padding:2rem;color:#6b7280;">
                        <i data-lucide="inbox" class="icon" style="width:40px;height:40px;color:#d1d5db;display:block;margin:0 auto 0.75rem;"></i>
                        <p style="margin-bottom:1rem;">${t('noTemplates')}</p>
                        <button class="btn btn-success" onclick="closeModal('templatePickerModal');openManageTemplatesModal();">
                            <i data-lucide="plus" class="icon icon-sm"></i> ${t('createTemplate')}
                        </button>
                    </div>`;
            } else {
                body.innerHTML = `
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        ${taskTemplates.map(tpl => `
                        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.65rem;background:#f9fafb;border-radius:8px;cursor:pointer;transition:background 0.15s;" 
                            onclick="createTaskFromTemplate('${escId(tpl.id)}')"
                            onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='#f9fafb'">
                            <div style="width:36px;height:36px;border-radius:8px;background:${tpl.color || '#e0e7ff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i data-lucide="${tpl.icon || 'file-text'}" class="icon icon-sm" style="color:${tpl.iconColor || '#4338ca'};"></i>
                            </div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-weight:600;font-size:0.85rem;">${esc(tpl.title)}</div>
                                ${tpl.function ? `<div style="font-size:0.72rem;color:#6b7280;">${esc(tpl.function)}${tpl.estimatedTime ? ' · ' + tpl.estimatedTime + ' ' + (t('min')) : ''}</div>` : ''}
                            </div>
                            <i data-lucide="chevron-right" class="icon icon-sm" style="color:#d1d5db;"></i>
                        </div>`).join('')}
                    </div>`;
            }
            document.getElementById('templatePickerModal').style.display = 'block';
            refreshIcons();
        });
    }
    
    function createTaskFromTemplate(templateId) {
        const tpl = taskTemplates.find(t => t.id === templateId);
        if (!tpl) return;
        closeModal('templatePickerModal');
        
        // Open task modal and fill with template data
        openTaskModal();
        
        setTimeout(() => {
            if (tpl.title) document.getElementById('taskTitle').value = tpl.title;
            if (tpl.function) document.getElementById('taskFunction').value = tpl.function;
            if (tpl.priority) document.getElementById('taskPriority').value = tpl.priority;
            if (tpl.expectedResult) document.getElementById('taskExpectedResult').value = tpl.expectedResult;
            if (tpl.reportFormat) document.getElementById('taskReportFormat').value = tpl.reportFormat;
            if (tpl.description) document.getElementById('taskDescription').value = tpl.description;
            if (tpl.estimatedTime) document.getElementById('taskEstimatedTime').value = tpl.estimatedTime;
            if (tpl.requireReview !== undefined) document.getElementById('taskRequireReview').checked = tpl.requireReview;
            if (tpl.requireReport !== undefined) document.getElementById('taskRequireReport').checked = tpl.requireReport;
            if (tpl.checklist?.length) renderChecklist(tpl.checklist);
            
            // Trigger function change to update assignee
            const funcSelect = document.getElementById('taskFunction');
            if (funcSelect) funcSelect.dispatchEvent(new Event('change'));
            
            showToast(t('templateApplied'), 'success', 2000);
        }, 200);
    }
    
    function openManageTemplatesModal() {
        loadTaskTemplates().then(() => renderManageTemplates());
        document.getElementById('manageTemplatesModal').style.display = 'block';
    }
    
    function renderManageTemplates() {
        const body = document.getElementById('manageTemplatesBody');
        
        let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <span style="font-size:0.85rem;color:#6b7280;">${taskTemplates.length} ${t('templatesCount')}</span>
                <button class="btn btn-success btn-small" onclick="openTemplateEditor()">
                    <i data-lucide="plus" class="icon icon-sm"></i> ${t('createTemplate')}
                </button>
            </div>
            <div id="templateEditorArea"></div>`;
        
        if (taskTemplates.length > 0) {
            html += `<div style="display:flex;flex-direction:column;gap:0.4rem;">
                ${taskTemplates.map(tpl => `
                <div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem;background:#f9fafb;border-radius:8px;">
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;font-size:0.85rem;">${esc(tpl.title)}</div>
                        <div style="font-size:0.72rem;color:#6b7280;">${esc(tpl.function || '')}${tpl.expectedResult ? ' · ' + esc(tpl.expectedResult).substring(0,40) : ''}</div>
                    </div>
                    <button class="action-btn" onclick="editTemplate('${escId(tpl.id)}')" title="${t('edit')}"><i data-lucide="pencil" class="icon icon-sm"></i></button>
                    <button class="action-btn" onclick="deleteTemplate('${escId(tpl.id)}')" title="${t('delete')}" style="color:#ef4444;"><i data-lucide="trash-2" class="icon icon-sm"></i></button>
                </div>`).join('')}
            </div>`;
        }
        
        body.innerHTML = html;
        refreshIcons();
    }
    
    function openTemplateEditor(templateId) {
        const tpl = templateId ? taskTemplates.find(t => t.id === templateId) : {};
        const area = document.getElementById('templateEditorArea');
        
        const funcOptions = functions.filter(f => f.status !== 'archived')
            .map(f => `<option value="${esc(f.name)}" ${tpl.function === f.name ? 'selected' : ''}>${esc(f.name)}</option>`).join('');
        
        area.innerHTML = `
        <div style="background:#f0fdf4;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #dcfce7;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                <div style="grid-column:1/-1;">
                    <label style="font-size:0.75rem;font-weight:600;color:#374151;">${t('taskName')} *</label>
                    <input type="text" id="tplTitle" value="${esc(tpl.title || '')}" style="width:100%;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;" placeholder="${t('taskName')}">
                </div>
                <div>
                    <label style="font-size:0.75rem;font-weight:600;color:#374151;">${t('function')}</label>
                    <select id="tplFunction" style="width:100%;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;">
                        <option value="">—</option>${funcOptions}
                    </select>
                </div>
                <div>
                    <label style="font-size:0.75rem;font-weight:600;color:#374151;">${t('estimatedTime')}</label>
                    <input type="number" id="tplEstimatedTime" value="${tpl.estimatedTime || ''}" style="width:100%;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;" placeholder="60">
                </div>
                <div style="grid-column:1/-1;">
                    <label style="font-size:0.75rem;font-weight:600;color:#374151;">${t('expectedResult')}</label>
                    <input type="text" id="tplExpectedResult" value="${esc(tpl.expectedResult || '')}" style="width:100%;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;">
                </div>
                <div style="grid-column:1/-1;">
                    <label style="font-size:0.75rem;font-weight:600;color:#374151;">${t('reportFormat')}</label>
                    <input type="text" id="tplReportFormat" value="${esc(tpl.reportFormat || '')}" style="width:100%;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;" placeholder="${t('reportFormatPlaceholder')}">
                </div>
                <div style="grid-column:1/-1;">
                    <label style="font-size:0.75rem;font-weight:600;color:#374151;">${t('instruction')}</label>
                    <textarea id="tplDescription" style="width:100%;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;min-height:60px;resize:vertical;">${esc(tpl.description || '')}</textarea>
                </div>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                <button class="btn btn-success" onclick="saveTemplate('${templateId || ''}')" style="flex:1;">
                    <i data-lucide="check" class="icon icon-sm"></i> ${t('save')}
                </button>
                <button class="btn" onclick="document.getElementById('templateEditorArea').innerHTML='';renderManageTemplates();">
                    ${t('cancel')}
                </button>
            </div>
        </div>`;
        refreshIcons();
    }
    
    function editTemplate(id) { openTemplateEditor(id); }
    
    async function saveTemplate(id) {
        const title = document.getElementById('tplTitle').value.trim();
        if (!title) { showAlertModal(t('enterName')); return; }
        
        const data = {
            title,
            function: document.getElementById('tplFunction').value,
            estimatedTime: document.getElementById('tplEstimatedTime').value,
            expectedResult: document.getElementById('tplExpectedResult').value.trim(),
            reportFormat: document.getElementById('tplReportFormat').value.trim(),
            description: document.getElementById('tplDescription').value.trim(),
            requireReview: true,
            requireReport: !!(document.getElementById('tplExpectedResult').value.trim() || document.getElementById('tplReportFormat').value.trim()),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        try {
            if (id) {
                await db.collection('companies').doc(currentCompany).collection('taskTemplates').doc(id).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                data.createdBy = currentUser.uid;
                await db.collection('companies').doc(currentCompany).collection('taskTemplates').add(data);
            }
            await loadTaskTemplates();
            document.getElementById('templateEditorArea').innerHTML = '';
            renderManageTemplates();
            showToast(t('saved'), 'success', 2000);
        } catch(e) {
            console.error('saveTemplate:', e);
            showAlertModal(t('error') + ': ' + e.message);
        }
    }
    
    async function deleteTemplate(id) {
        if (!await showConfirmModal(t('confirmDelete'), { danger: true })) return;
        try {
            await db.collection('companies').doc(currentCompany).collection('taskTemplates').doc(id).delete();
            taskTemplates = taskTemplates.filter(t => t.id !== id);
            renderManageTemplates();
        } catch(e) {
            console.error('deleteTemplate:', e);
        }
    }
