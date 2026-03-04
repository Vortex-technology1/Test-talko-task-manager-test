// =====================
    // MANUAL INCIDENTS (Journal)
    // =====================
    window._manualIncidents = [];
    
    async function loadManualIncidents() {
        if (!currentCompany) return;
        try {
            const snap = await db.collection('companies').doc(currentCompany)
                .collection('incidents').orderBy('createdAt', 'desc').limit(100).get();
            window._manualIncidents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch(e) { 
            // Firestore rules may not include 'incidents' collection yet — silent fail
            window._manualIncidents = [];
        }
    }
    
    function toggleAddIncidentForm() {
        const area = document.getElementById('addIncidentFormArea');
        if (!area) return;
        if (area.style.display !== 'none') {
            area.style.display = 'none';
            area.innerHTML = '';
            return;
        }
        
        const userOptions = users.map(u => `<option value="${esc(u.name || u.email)}">${esc(u.name || u.email)}</option>`).join('');
        
        area.innerHTML = `
        <div style="background:#f9fafb;border-radius:10px;padding:1rem;border:1px solid #e5e7eb;">
            <div style="font-weight:600;font-size:0.9rem;margin-bottom:0.75rem;"><i data-lucide="flag" class="icon icon-sm" style="color:#ef4444;"></i> ${t('addIncident')}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                <div style="grid-column:1/-1;">
                    <input type="text" id="incidentTitle" placeholder="${t('whatHappened')}" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                </div>
                <div>
                    <select id="incidentCategory" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                        <option value="people">${t('cat_people')}</option>
                        <option value="process">${t('cat_process')}</option>
                        <option value="finance">${t('cat_finance')}</option>
                        <option value="clients">${t('cat_clients')}</option>
                        <option value="quality">${t('cat_quality')}</option>
                        <option value="other">${t('cat_other')}</option>
                    </select>
                </div>
                <div>
                    <select id="incidentSeverity" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                        <option value="1">${t('severityLow')}</option>
                        <option value="2" selected>${t('severityMedium')}</option>
                        <option value="3">${t('severityHigh')}</option>
                    </select>
                </div>
                <div style="grid-column:1/-1;">
                    <select id="incidentResponsible" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                        <option value="">— ${t('responsible')} —</option>
                        ${userOptions}
                    </select>
                </div>
                <div style="grid-column:1/-1;">
                    <textarea id="incidentDescription" placeholder="${t('incidentDetails')}" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;min-height:50px;resize:vertical;"></textarea>
                </div>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                <button class="btn btn-success" onclick="saveIncident()" style="flex:1;">
                    <i data-lucide="check" class="icon icon-sm"></i> ${t('save')}
                </button>
                <button class="btn" onclick="toggleAddIncidentForm();">${t('cancel')}</button>
            </div>
        </div>`;
        area.style.display = 'block';
        refreshIcons();
        document.getElementById('incidentTitle').focus();
    }
    
    async function saveIncident() {
        const title = document.getElementById('incidentTitle').value.trim();
        if (!title) { showAlertModal(t('enterName')); return; }
        
        const data = {
            title,
            category: document.getElementById('incidentCategory').value,
            severity: parseInt(document.getElementById('incidentSeverity').value),
            responsible: document.getElementById('incidentResponsible').value,
            description: document.getElementById('incidentDescription').value.trim(),
            date: getLocalDateStr(new Date()),
            resolved: false,
            createdBy: currentUser.uid,
            createdByName: currentUserData?.name || currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        try {
            const ref = await db.collection('companies').doc(currentCompany)
                .collection('incidents').add(data);
            window._manualIncidents.unshift({ id: ref.id, ...data, createdAt: new Date() });
            toggleAddIncidentForm();
            renderControl();
            showToast(t('incidentSaved'), 'success', 2000);
        } catch(e) {
            console.error('saveIncident:', e);
            showAlertModal(t('error') + ': ' + e.message);
        }
    }
    
    async function resolveIncident(id) {
        try {
            await db.collection('companies').doc(currentCompany)
                .collection('incidents').doc(id).update({ resolved: true, resolvedAt: firebase.firestore.FieldValue.serverTimestamp(), resolvedBy: currentUser.uid });
            const inc = window._manualIncidents.find(i => i.id === id);
            if (inc) inc.resolved = true;
            renderControl();
            showToast(t('incidentResolved'), 'success', 2000);
        } catch(e) {
            console.error('resolveIncident:', e);
        }
    }
