// ============================================================
// MODULE 66 — STATISTICS / METRICS v1.2
// ============================================================
// Fixes: P0-1 function scope aggregation, P0-2 upsert keys,
// P0-3 function selector, P1-1 target scopeId, P1-2 whitelist,
// P2-1 scoped loadEntries
// ============================================================
(function() {
    'use strict';

    // ========================
    //  STATE
    // ========================
    let statsMetrics = [];
    let statsEntries = [];
    let statsTargets = [];
    let statsCurrentScope = 'my';       // my | function | company
    let statsCurrentView = 'dashboard'; // dashboard | table | charts
    let statsPeriodOffset = 0;
    let statsEditingMetricId = null;
    let statsPeriodType = 'weekly';
    let statsSelectedFunctionId = null; // P0-3: explicit function selection

    // ========================
    //  PERIOD HELPERS
    // ========================
    function getStatsPeriodType() {
        return document.getElementById('statsPeriodType')?.value || 'weekly';
    }

    function toWeekKey(d) {
        const dt = new Date(d);
        dt.setHours(12, 0, 0, 0);
        const dow = dt.getDay() || 7;
        dt.setDate(dt.getDate() - dow + 4);
        const y = dt.getFullYear();
        const j1 = new Date(y, 0, 1);
        const wn = Math.ceil(((dt - j1) / 864e5 + j1.getDay() + 1) / 7);
        return y + '-W' + String(wn).padStart(2, '0');
    }

    // getStatsPeriodKey moved to render section (supports explicit freq param)

    function formatPeriodLabel(k) {
        if (!k) return '';
        if (k.includes('-W')) {
            const [y, w] = k.split('-W');
            return (t('week') || 'Тиждень') + ' ' + parseInt(w) + ', ' + y;
        }
        if (k.length === 7) {
            const ms = ['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
            const [y, m] = k.split('-');
            return ms[parseInt(m) - 1] + ' ' + y;
        }
        return k;
    }

    function statsNavigatePeriod(dir) {
        statsPeriodOffset += dir;
        renderStatistics();
    }

    // ========================
    //  SCOPE CONTROL
    // ========================
    function setStatsScope(scope) {
        // P1-4: employee cannot see company scope
        if (scope === 'company' && getUserRole() === 'employee') scope = 'my';
        statsCurrentScope = scope;

        document.querySelectorAll('[id^="statsScope"]').forEach(el => el.classList.remove('active'));
        const map = { my: 'My', function: 'Func', company: 'Company' };
        const btn = document.getElementById('statsScope' + map[scope]);
        if (btn) btn.classList.add('active');

        // P0-3: show/hide function selector
        updateFunctionSelector();
        renderStatistics();
    }

    function setStatsView(v) {
        statsCurrentView = v;
        document.querySelectorAll('[data-sview]').forEach(el => {
            el.classList.toggle('active', el.dataset.sview === v);
            el.style.background = el.dataset.sview === v ? 'white' : 'transparent';
        });
        renderStatistics();
    }

    // P0-3: Function selector dropdown for multi-function users
    function updateFunctionSelector() {
        const container = document.getElementById('statsFunctionSelector');
        if (!container) return;

        if (statsCurrentScope !== 'function') {
            container.style.display = 'none';
            return;
        }

        const user = users.find(u => u.id === currentUser?.uid);
        const userFuncIds = user?.functions ? Object.keys(user.functions) : [];
        const funcs = (typeof functions !== 'undefined' ? functions : [])
            .filter(f => getUserRole() === 'owner' || userFuncIds.includes(f.id));

        if (funcs.length === 0) {
            container.style.display = 'none';
            return;
        }

        // Auto-select: restore last or pick first
        if (!statsSelectedFunctionId || !funcs.find(f => f.id === statsSelectedFunctionId)) {
            try { statsSelectedFunctionId = localStorage.getItem('talko_stats_last_func'); } catch(e) {}
            if (!statsSelectedFunctionId || !funcs.find(f => f.id === statsSelectedFunctionId)) {
                statsSelectedFunctionId = funcs[0].id;
            }
        }

        container.style.display = 'flex';
        container.innerHTML = '<select id="statsFuncDropdown" onchange="onStatsFunctionChange(this.value)" ' +
            'style="padding:0.4rem 0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;font-weight:500;">' +
            funcs.map(f =>
                '<option value="' + f.id + '"' + (f.id === statsSelectedFunctionId ? ' selected' : '') + '>' +
                esc(f.name || f.title || '') + '</option>'
            ).join('') + '</select>';
    }

    function onStatsFunctionChange(fid) {
        statsSelectedFunctionId = fid;
        try { localStorage.setItem('talko_stats_last_func', fid); } catch(e) {}
        renderStatistics();
    }

    // P0-3: Get user IDs that belong to a specific function
    function getUsersInFunction(functionId) {
        if (!functionId) return [];
        return users
            .filter(u => u.functions && u.functions[functionId])
            .map(u => u.id);
    }

    // ========================
    //  ACCESS CONTROL
    // ========================
    function getUserRole() {
        return (users.find(u => u.id === currentUser?.uid))?.role || 'employee';
    }

    function canViewStats() {
        if (!currentUser || !currentCompany) return false;
        const u = users.find(u => u.id === currentUser.uid);
        return u ? (u.role === 'owner' || u.canViewStatsTab !== false) : false;
    }

    // P1-2: Fixed whitelist logic
    function canViewMetric(m) {
        if (!currentUser) return false;
        const u = users.find(u => u.id === currentUser.uid);
        if (!u) return false;
        if (u.role === 'owner') return true;
        if (m.privacy === 'owner_only') return false;

        // P1-2: If user has useMetricWhitelist flag or allowedMetricIds field exists,
        // treat it as strict whitelist (even if empty = nothing visible)
        if (u.useMetricWhitelist || (u.allowedMetricIds && typeof u.allowedMetricIds === 'object')) {
            return !!(u.allowedMetricIds && u.allowedMetricIds[m.id]);
        }

        // No whitelist → check function bindings
        if (m.boundFunctions && u.functions) {
            for (const fid of Object.keys(u.functions)) {
                if (m.boundFunctions[fid]) return true;
            }
        }
        return m.privacy === 'public';
    }

    function canEditMetrics() {
        const r = getUserRole();
        return r === 'owner' || r === 'manager';
    }

    function showStatsTabIfAllowed() {
        const s = canViewStats();
        const tb = document.getElementById('statisticsTabBtn');
        const mb = document.getElementById('statsMobileBtn');
        if (tb) tb.style.display = s ? '' : 'none';
        if (mb) mb.style.display = s ? '' : 'none';
    }

    let statsAggregates = []; // pre-computed by Cloud Functions

    function aggregatesRef() { return db.collection('companies').doc(currentCompany).collection('metricAggregates'); }

    async function loadAggregates(pk) {
        if (!currentCompany || !pk) return;
        try {
            const s = await aggregatesRef().where('periodKey', '==', pk).get();
            statsAggregates = s.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.error('[STATS] loadAggregates:', e); }
    }

    // ========================
    //  FIRESTORE
    // ========================
    function metricsRef() { return db.collection('companies').doc(currentCompany).collection('metrics'); }
    function entriesRef() { return db.collection('companies').doc(currentCompany).collection('metricEntries'); }
    function targetsRef() { return db.collection('companies').doc(currentCompany).collection('metricTargets'); }
    function insightsRef() { return db.collection('companies').doc(currentCompany).collection('metricInsights'); }

    async function loadMetrics() {
        if (!currentCompany) return;
        try {
            const s = await metricsRef().orderBy('createdAt', 'desc').get();
            statsMetrics = s.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.error('[STATS] loadMetrics:', e); }
    }

    // P2-1 + P1-2: Scoped loadEntries — minimize data pulled per role/scope
    async function loadEntries(pk) {
        if (!currentCompany || !pk) return;
        try {
            const role = getUserRole();
            let results = [];

            if (role === 'employee' && statsCurrentScope === 'my') {
                // Employee "my" view: only own entries
                const s = await entriesRef()
                    .where('periodKey', '==', pk)
                    .where('createdBy', '==', currentUser.uid)
                    .get();
                results = s.docs.map(d => ({ id: d.id, ...d.data() }));

            } else if (statsCurrentScope === 'function' && statsSelectedFunctionId) {
                // Function view: pull function-scope entries for this function
                const funcSnap = await entriesRef()
                    .where('periodKey', '==', pk)
                    .where('scope', '==', 'function')
                    .where('scopeId', '==', statsSelectedFunctionId)
                    .get();
                results = funcSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                // Also pull user-scope entries from people in this function
                const usersInFunc = getUsersInFunction(statsSelectedFunctionId);
                if (usersInFunc.length > 0) {
                    // Firestore 'in' supports up to 30 values
                    const chunks = [];
                    for (let i = 0; i < usersInFunc.length; i += 30) {
                        chunks.push(usersInFunc.slice(i, i + 30));
                    }
                    for (const chunk of chunks) {
                        const userSnap = await entriesRef()
                            .where('periodKey', '==', pk)
                            .where('scope', '==', 'user')
                            .where('createdBy', 'in', chunk)
                            .get();
                        results.push(...userSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                    }
                }

            } else {
                // Owner/manager company view or fallback: pull all for period
                const s = await entriesRef().where('periodKey', '==', pk).get();
                results = s.docs.map(d => ({ id: d.id, ...d.data() }));
            }

            statsEntries = results;
        } catch (e) { console.error('[STATS] loadEntries:', e); }
    }

    async function loadTargets() {
        if (!currentCompany) return;
        try {
            const s = await targetsRef().get();
            statsTargets = s.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.error('[STATS] loadTargets:', e); }
    }

    // ========================
    //  SAVE METRIC
    // ========================
    async function saveMetric() {
        if (!canEditMetrics()) { showToast(t('noPermission') || 'Немає доступу', 'error'); return; }
        const name = document.getElementById('metricName')?.value?.trim();
        if (!name) { showToast(t('enterName') || 'Введіть назву', 'error'); return; }

        // Metric limit: max 50 per company
        if (!statsEditingMetricId && statsMetrics.length >= 50) {
            showToast(t('metricLimit') || 'Максимум 50 метрик на компанію', 'error');
            return;
        }

        const data = {
            name,
            unit: document.getElementById('metricUnit')?.value || 'шт',
            frequency: document.getElementById('metricFrequency')?.value || 'weekly',
            inputType: document.getElementById('metricInputType')?.value || 'manual',
            privacy: document.getElementById('metricPrivacy')?.value || 'public',
            formula: document.getElementById('metricFormula')?.value?.trim() || '',
            alertEnabled: document.getElementById('metricAlertEnabled')?.checked || false,
            alertThreshold: parseInt(document.getElementById('metricAlertThreshold')?.value) || 20,
            boundFunctions: {},
            autoSpec: null,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        document.querySelectorAll('#metricFunctionsList input[type="checkbox"]:checked').forEach(cb => {
            data.boundFunctions[cb.value] = true;
        });

        if (data.inputType === 'auto') {
            data.autoSpec = {
                type: document.getElementById('autoSpecType')?.value || 'task_count',
                functionId: document.getElementById('autoSpecFunction')?.value || '',
            };
        }

        try {
            if (statsEditingMetricId) {
                // P0-1: frequency is immutable after creation — don't update it
                delete data.frequency;
                await metricsRef().doc(statsEditingMetricId).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                data.createdBy = currentUser.uid;
                const ref = await metricsRef().add(data);
                const tv = parseFloat(document.getElementById('metricTarget')?.value);
                if (tv > 0) {
                    // Create target per current scope context
                    const targetScope = statsCurrentScope === 'function' && statsSelectedFunctionId
                        ? 'function' : 'company';
                    const targetScopeId = targetScope === 'function'
                        ? statsSelectedFunctionId : currentCompany;

                    await targetsRef().add({
                        metricId: ref.id,
                        periodKey: getStatsPeriodKey(0),
                        periodType: data.frequency,
                        scope: targetScope,
                        scopeId: targetScopeId,
                        targetValue: tv,
                        setBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                }
            }
            closeModal('metricModal');
            showToast(t('saved') || 'Збережено', 'success');
            await loadMetrics();
            renderStatistics();
        } catch (e) {
            console.error('[STATS] saveMetric:', e);
            showToast(t('error') || 'Помилка', 'error');
        }
    }

    async function deleteMetric(mid) {
        if (!confirm(t('confirmDeleteMetric') || 'Видалити метрику та всі дані?')) return;
        try {
            const batch = db.batch();
            batch.delete(metricsRef().doc(mid));
            for (const coll of [entriesRef(), targetsRef(), insightsRef()]) {
                const s = await coll.where('metricId', '==', mid).get();
                s.docs.forEach(d => batch.delete(d.ref));
            }
            await batch.commit();
            showToast(t('deleted') || 'Видалено', 'success');
            await loadMetrics();
            renderStatistics();
        } catch (e) { console.error('[STATS] deleteMetric:', e); }
    }

    // ========================
    //  SAVE ENTRY (P0-2: correct upsert keys)
    // ========================
    async function saveEntry(metricId, value, dateStr) {
        if (!currentCompany || !metricId) return;

        const metric = statsMetrics.find(m => m.id === metricId);
        const pt = metric?.frequency || getStatsPeriodType();
        const d = new Date(dateStr || new Date());
        const iso = d.toISOString().split('T')[0];

        let pk;
        if (pt === 'daily') pk = iso;
        else if (pt === 'weekly') pk = toWeekKey(d);
        else pk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

        // Determine scope+scopeId
        let scope = 'user';
        let scopeId = currentUser.uid;

        if (statsCurrentScope === 'function' && statsSelectedFunctionId) {
            scope = 'function';
            scopeId = statsSelectedFunctionId;
        } else if (statsCurrentScope === 'company') {
            scope = 'company';
            scopeId = currentCompany;
        }

        const data = {
            metricId, periodType: pt, periodKey: pk,
            scope, scopeId, date: iso,
            value: parseFloat(value) || 0,
            source: 'manual',
            // P0-2: function/company entries are explicit overrides
            isOverride: scope !== 'user',
            createdBy: currentUser.uid,
            userName: users.find(u => u.id === currentUser.uid)?.name || currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        try {
            // P0-2: Different upsert keys based on scope
            let query = entriesRef()
                .where('metricId', '==', metricId)
                .where('periodKey', '==', pk)
                .where('scope', '==', scope)
                .where('scopeId', '==', scopeId);

            // For user scope: include createdBy (each person has own entry)
            // For function/company: one entry per scope (no createdBy filter)
            if (scope === 'user') {
                query = query.where('createdBy', '==', currentUser.uid);
            }

            const ex = await query.limit(1).get();

            if (!ex.empty) {
                await ex.docs[0].ref.update({
                    value: data.value,
                    date: iso,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                await entriesRef().add(data);
            }
        } catch (e) { console.error('[STATS] saveEntry:', e); }
    }

    // ========================
    //  DATA HELPERS
    // ========================

    // P0-1 + P1-1: Use aggregates when available, fallback to raw entries
    function getEntryForMetric(mid, pk) {
        if (statsCurrentScope === 'my') {
            return statsEntries.find(e =>
                e.metricId === mid && e.periodKey === pk && e.createdBy === currentUser.uid
            );
        }

        if (statsCurrentScope === 'function') {
            const fid = statsSelectedFunctionId;
            if (!fid) return null;

            // Try aggregate first (pre-computed by Cloud Function)
            const agg = statsAggregates.find(a =>
                a.metricId === mid && a.periodKey === pk && a.scope === 'function' && a.scopeId === fid
            );
            if (agg) return { value: agg.sum, _agg: true, _fromAggregate: true };

            // Fallback: priority chain from raw entries
            const funcEntry = statsEntries.find(e =>
                e.metricId === mid && e.periodKey === pk &&
                e.scope === 'function' && e.scopeId === fid
            );
            if (funcEntry) return funcEntry;

            const usersInFunc = getUsersInFunction(fid);
            const userEntries = statsEntries.filter(e =>
                e.metricId === mid && e.periodKey === pk &&
                e.scope === 'user' && usersInFunc.includes(e.createdBy)
            );
            if (userEntries.length === 0) return null;
            return { value: userEntries.reduce((s, e) => s + (e.value || 0), 0), _agg: true };
        }

        // Company scope
        const compAgg = statsAggregates.find(a =>
            a.metricId === mid && a.periodKey === pk && a.scope === 'company'
        );
        if (compAgg) return { value: compAgg.sum, _agg: true, _fromAggregate: true };

        // Fallback: strict priority chain
        const compEntry = statsEntries.find(e =>
            e.metricId === mid && e.periodKey === pk && e.scope === 'company'
        );
        if (compEntry) return compEntry;

        const funcEntries = statsEntries.filter(e =>
            e.metricId === mid && e.periodKey === pk && e.scope === 'function'
        );
        if (funcEntries.length > 0) {
            return { value: funcEntries.reduce((s, e) => s + (e.value || 0), 0), _agg: true };
        }

        const userEntries = statsEntries.filter(e =>
            e.metricId === mid && e.periodKey === pk && e.scope === 'user'
        );
        if (userEntries.length === 0) return null;
        return { value: userEntries.reduce((s, e) => s + (e.value || 0), 0), _agg: true };
    }

    // P1-1: Target lookup with scopeId
    function getTargetForMetric(mid, pk) {
        const sc = statsCurrentScope === 'my' ? 'user' : statsCurrentScope === 'function' ? 'function' : 'company';
        const sid = statsCurrentScope === 'my' ? currentUser.uid :
                    statsCurrentScope === 'function' ? statsSelectedFunctionId :
                    currentCompany;

        // Exact match: metricId + periodKey + scope + scopeId
        return statsTargets.find(t2 =>
                t2.metricId === mid && t2.periodKey === pk && t2.scope === sc && t2.scopeId === sid
            ) ||
            // Fallback: metricId + scope + scopeId (any period)
            statsTargets.find(t2 =>
                t2.metricId === mid && t2.scope === sc && t2.scopeId === sid
            ) ||
            // Last fallback: any target for this metric
            statsTargets.find(t2 => t2.metricId === mid);
    }

    // ========================
    //  QUICK INPUT
    // ========================
    function openQuickInputModal() {
        const p = document.getElementById('quickInputDatePicker');
        if (p) p.value = new Date().toISOString().split('T')[0];

        const c = document.getElementById('quickInputList');
        if (!c) return;

        const vis = statsMetrics.filter(m => m.inputType === 'manual' && canViewMetric(m));
        c.innerHTML = vis.map(m =>
            '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem;background:#f9fafb;border-radius:12px;">' +
                '<div style="flex:1;">' +
                    '<div style="font-weight:600;font-size:0.9rem;">' + esc(m.name) + '</div>' +
                    '<div style="font-size:0.75rem;color:var(--gray);">' + esc(m.unit) + ' · ' + (t(m.frequency) || m.frequency) + '</div>' +
                '</div>' +
                '<input type="number" class="input quick-input-value" data-metric-id="' + m.id + '" ' +
                    'placeholder="—" style="width:100px;text-align:center;font-size:1.1rem;font-weight:600;">' +
                '<div style="font-size:0.8rem;color:var(--gray);min-width:30px;">' + esc(m.unit) + '</div>' +
            '</div>'
        ).join('');

        openModal('quickInputModal');
    }

    async function saveQuickInput() {
        const date = document.getElementById('quickInputDatePicker')?.value;
        const inputs = document.querySelectorAll('.quick-input-value');
        let saved = 0;

        for (const inp of inputs) {
            const raw = inp.value.trim();
            if (raw === '') continue; // Not touched = skip. "0" = valid data
            await saveEntry(inp.dataset.metricId, parseFloat(raw) || 0, date);
            saved++;
        }

        closeModal('quickInputModal');
        if (saved > 0) {
            showToast((t('saved') || 'Збережено') + ': ' + saved, 'success');
            await loadEntries(getStatsPeriodKey(statsPeriodOffset));
            renderStatistics();
        }
    }

    // ========================
    //  METRIC MODAL
    // ========================
    function openMetricModal(mid) {
        statsEditingMetricId = mid || null;

        const fl = document.getElementById('metricFunctionsList');
        if (fl) {
            const fs = typeof functions !== 'undefined' ? functions : [];
            fl.innerHTML = fs.map(f =>
                '<label style="display:flex;align-items:center;gap:0.3rem;padding:0.3rem 0.6rem;background:#f3f4f6;border-radius:8px;font-size:0.8rem;cursor:pointer;">' +
                '<input type="checkbox" value="' + f.id + '" class="metric-func-cb"> ' + esc(f.name || f.title || '') +
                '</label>'
            ).join('');
        }

        const af = document.getElementById('autoSpecFunction');
        if (af) {
            const fs = typeof functions !== 'undefined' ? functions : [];
            af.innerHTML = '<option value="">' + (t('allFunctions') || 'Всі функції') + '</option>' +
                fs.map(f => '<option value="' + f.id + '">' + esc(f.name || f.title || '') + '</option>').join('');
        }

        if (mid) {
            const m = statsMetrics.find(x => x.id === mid);
            if (m) {
                document.getElementById('metricModalTitle').textContent = t('editMetric') || 'Редагувати';
                document.getElementById('metricName').value = m.name || '';
                document.getElementById('metricUnit').value = m.unit || 'шт';
                document.getElementById('metricFrequency').value = m.frequency || 'weekly';
                document.getElementById('metricFrequency').disabled = true; // P0-1: immutable
                document.getElementById('metricInputType').value = m.inputType || 'manual';
                document.getElementById('metricPrivacy').value = m.privacy || 'public';
                document.getElementById('metricFormula').value = m.formula || '';
                document.getElementById('metricAlertEnabled').checked = m.alertEnabled || false;
                document.getElementById('metricAlertThreshold').value = m.alertThreshold || 20;
                if (m.boundFunctions) {
                    document.querySelectorAll('.metric-func-cb').forEach(cb => {
                        cb.checked = !!m.boundFunctions[cb.value];
                    });
                }
                toggleAutoSpec();
            }
        } else {
            document.getElementById('metricModalTitle').textContent = t('addMetric') || 'Нова метрика';
            document.getElementById('metricName').value = '';
            document.getElementById('metricUnit').value = 'шт';
            document.getElementById('metricFrequency').value = 'weekly';
            document.getElementById('metricFrequency').disabled = false; // P0-1: editable for new
            document.getElementById('metricInputType').value = 'manual';
            document.getElementById('metricPrivacy').value = 'public';
            document.getElementById('metricFormula').value = '';
            document.getElementById('metricTarget').value = '';
            document.getElementById('metricAlertEnabled').checked = false;
        }
        openModal('metricModal');
    }

    function toggleAutoSpec() {
        const b = document.getElementById('autoSpecBlock');
        if (b) b.style.display = document.getElementById('metricInputType')?.value === 'auto' ? 'block' : 'none';
    }


    // ========================
    //  SVG ICONS (inline, no emoji)
    // ========================
    const SVG = {
        plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
        calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        barChart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        trendUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
        chevL: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
        chevR: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
        alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
        comment: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        target: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        lock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        eye: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    };

    const METRIC_COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#06b6d4','#84cc16','#a855f7','#e11d48','#0ea5e9','#eab308'];

    // ========================
    //  RENDER: HEADER BAR
    // ========================
    function renderHeaderBar() {
        const h = document.getElementById('statsHeaderBar');
        if (!h) return;
        const role = getUserRole();
        const canEdit = role === 'owner' || role === 'manager' || role === 'admin';

        h.innerHTML = `
        <div class="stats-header">
            <div class="stats-header-title">${SVG.trendUp} ${t('tabStatistics') || 'Метрики'}</div>
            <div class="stats-header-actions">
                ${canEdit ? `<button class="stats-pill accent" onclick="openMetricModal()">${SVG.plus} ${t('addMetric') || 'Метрика'}</button>` : ''}
                <button class="stats-pill" onclick="openQuickInputModal()">${SVG.edit} ${t('quickInput') || 'Внести дані'}</button>
                <button class="stats-pill" onclick="runAIAnalysis()" style="color:#7c3aed;border-color:#e9d5ff;">${SVG.sparkles} AI</button>
            </div>
        </div>`;
    }

    // ========================
    //  RENDER: SCOPE + PERIOD BAR
    // ========================
    function renderScopeBar() {
        const sb = document.getElementById('statsScopeBar');
        if (!sb) return;

        const role = getUserRole();
        const scopes = [
            { id: 'my', label: t('scopeMy') || 'Моє' },
            { id: 'function', label: t('scopeFunction') || 'Функції' },
        ];
        if (role === 'owner' || role === 'manager' || role === 'admin') {
            scopes.push({ id: 'company', label: t('scopeCompany') || 'Компанія' });
        }

        const periodTypes = [
            { v: 'daily', l: t('daily') || 'День' },
            { v: 'weekly', l: t('weekly') || 'Тиждень' },
            { v: 'monthly', l: t('monthly') || 'Місяць' },
        ];
        const curPT = document.getElementById('statsPeriodTypeHidden')?.value || statsPeriodType || 'weekly';
        const pk = getStatsPeriodKey(statsPeriodOffset);

        // Function selector
        let funcSel = '';
        if (statsCurrentScope === 'function') {
            const fs = typeof functions !== 'undefined' ? functions : [];
            if (fs.length > 0) {
                funcSel = `<select class="stats-func-select" onchange="onStatsFunctionChange(this.value)">
                    ${fs.map(f => `<option value="${f.id}" ${f.id === statsSelectedFunctionId ? 'selected' : ''}>${f.name}</option>`).join('')}
                </select>`;
            }
        }

        sb.innerHTML = `
        <input type="hidden" id="statsPeriodTypeHidden" value="${curPT}">
        <div class="stats-bar">
            ${scopes.map(s => `<button class="stats-pill ${statsCurrentScope === s.id ? 'active' : ''}" onclick="setStatsScope('${s.id}')">${s.label}</button>`).join('')}
            ${funcSel}
            <div class="stats-bar-sep"></div>
            ${periodTypes.map(p => `<button class="stats-pill ${curPT === p.v ? 'active' : ''}" onclick="setStatsPeriodType('${p.v}')">${p.l}</button>`).join('')}
            <div class="stats-bar-sep"></div>
            <div class="stats-period-nav">
                <button onclick="statsNavigatePeriod(-1)">${SVG.chevL}</button>
                <span>${formatPeriodLabel(pk)}</span>
                <button onclick="statsNavigatePeriod(1)">${SVG.chevR}</button>
            </div>
        </div>`;
    }

    // Period type switcher
    window.setStatsPeriodType = function(pt) {
        statsPeriodType = pt;
        const h = document.getElementById('statsPeriodTypeHidden');
        if (h) h.value = pt;
        statsPeriodOffset = 0;
        renderStatistics();
    };

    // ========================
    //  RENDER: MAIN
    // ========================
    async function renderStatistics() {
        if (!currentCompany) return;
        showStatsTabIfAllowed();
        renderHeaderBar();
        renderScopeBar();

        const c = document.getElementById('statisticsContainer');
        if (!c) return;

        const pk = getStatsPeriodKey(statsPeriodOffset);

        // Show loading
        c.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;"><div class="spinner" style="margin:0 auto;"></div></div>';

        try {
            await Promise.all([loadMetrics(), loadEntries(pk), loadTargets(), loadAggregates(pk)]);
        } catch (e) {
            console.error('[STATS] load error:', e);
        }

        const ms = statsMetrics.filter(m => canViewMetric(m));
        if (ms.length === 0) {
            c.innerHTML = `<div class="stats-empty">
                <div class="stats-empty-icon">${SVG.trendUp}</div>
                <h3>${t('noMetrics') || 'Метрик ще немає'}</h3>
                <p>${t('noMetricsHint') || 'Створіть першу метрику'}</p>
                <button class="stats-pill accent" onclick="openMetricModal()" style="margin-top:1rem;">${SVG.plus} ${t('addMetric') || 'Метрика'}</button>
            </div>`;
            return;
        }

        // KPI debts
        renderKpiDebts(ms, pk);

        // Group by frequency
        const groups = {};
        ms.forEach(m => {
            const freq = m.frequency || 'weekly';
            if (!groups[freq]) groups[freq] = [];
            groups[freq].push(m);
        });

        const freqLabels = {
            daily: { icon: SVG.calendar, label: t('daily') || 'Щоденні', color: '#3b82f6' },
            weekly: { icon: SVG.calendar, label: t('weekly') || 'Щотижневі', color: '#22c55e' },
            monthly: { icon: SVG.barChart, label: t('monthly') || 'Щомісячні', color: '#8b5cf6' },
        };

        let html = '';
        for (const [freq, metrics] of Object.entries(groups)) {
            const fl = freqLabels[freq] || freqLabels.weekly;
            html += renderFrequencyGroup(freq, metrics, fl);
        }

        c.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ========================
    //  RENDER: FREQUENCY GROUP (table)
    // ========================
    function renderFrequencyGroup(freq, metrics, fl) {
        // Generate period keys for last N periods
        const periodCount = freq === 'daily' ? 7 : freq === 'weekly' ? 8 : 6;
        const periods = [];
        for (let i = 0; i < periodCount; i++) {
            periods.push(getStatsPeriodKey(-i, freq));
        }
        const currentPk = getStatsPeriodKey(0, freq);

        let html = `
        <div class="stats-section">
            <div class="stats-section-icon" style="background:${fl.color};">${fl.icon}</div>
            <span class="stats-section-title">${fl.label}</span>
            <span class="stats-section-count">(${metrics.length})</span>
        </div>
        <div class="stats-table-wrap">
            <table class="stats-table">
                <thead><tr>
                    <th style="min-width:150px;">${freq === 'daily' ? 'День' : freq === 'weekly' ? 'Тиждень' : 'Місяць'}</th>`;

        // Column headers = metric names
        metrics.forEach((m, mi) => {
            const color = METRIC_COLORS[mi % METRIC_COLORS.length];
            const privacy = m.privacy === 'owner_only' ? ` ${SVG.lock}` : m.privacy === 'restricted' ? ` ${SVG.eye}` : '';
            const unit = m.unit ? ` <span style="font-weight:400;opacity:0.6;">${m.unit}</span>` : '';
            html += `<th>
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                    <span style="display:flex;align-items:center;gap:4px;">
                        <span class="stats-metric-dot" style="background:${color};"></span>
                        ${esc(m.name)}${unit}${privacy}
                    </span>
                </div>
            </th>`;
        });
        html += `<th style="width:40px;"></th></tr></thead><tbody>`;

        // Rows = periods
        periods.forEach((pk, pi) => {
            const isCurrent = pk === currentPk;
            html += `<tr${isCurrent ? ' class="stats-period-row"' : ''}>`;
            html += `<td><span>${formatPeriodLabel(pk)}${isCurrent ? '<span class="stats-period-current">зараз</span>' : ''}</span></td>`;

            metrics.forEach((m, mi) => {
                const entry = getEntryForMetric(m.id, pk);
                const target = getTargetForMetric(m.id, pk);
                const val = entry ? entry.value : null;
                const tgt = target ? target.targetValue : null;
                const color = METRIC_COLORS[mi % METRIC_COLORS.length];

                let cellHtml = '';
                if (val !== null && val !== undefined) {
                    // Value + progress
                    const formatted = formatValue(val, m.unit);
                    if (tgt && tgt > 0) {
                        const pct = Math.min(Math.round((val / tgt) * 100), 999);
                        const pctColor = pct >= 90 ? '#22c55e' : pct >= 70 ? '#f59e0b' : '#ef4444';
                        cellHtml = `
                        <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
                            <span class="stats-val" onclick="openMetricDetail('${m.id}','${pk}')">${formatted}</span>
                            <div class="stats-prog-wrap" style="min-width:60px;">
                                <div class="stats-prog-bar"><div class="stats-prog-fill" style="width:${Math.min(pct, 100)}%;background:${pctColor};"></div></div>
                                <span class="stats-prog-pct" style="color:${pctColor};">${pct}%</span>
                            </div>
                        </div>`;
                    } else {
                        cellHtml = `<span class="stats-val" onclick="openMetricDetail('${m.id}','${pk}')">${formatted}</span>`;
                    }
                } else {
                    cellHtml = `<span class="stats-val-empty" onclick="openMetricDetail('${m.id}','${pk}')">—</span>`;
                }
                html += `<td>${cellHtml}</td>`;
            });

            // Row actions (comment)
            html += `<td><button class="stats-comment-btn" onclick="openPeriodComment('${pk}')" title="Коментар">${SVG.comment}</button></td>`;
            html += `</tr>`;
        });

        html += '</tbody></table></div>';
        return html;
    }

    // Period key generator with explicit frequency
    function getStatsPeriodKey(offset, freq) {
        const f = freq || statsPeriodType || 'weekly';
        const now = new Date();
        if (f === 'daily') {
            const d = new Date(now);
            d.setDate(d.getDate() + offset);
            return d.toISOString().split('T')[0];
        } else if (f === 'weekly') {
            const d = new Date(now);
            d.setDate(d.getDate() + offset * 7);
            return toWeekKey(d);
        } else {
            const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        }
    }

    function formatValue(val, unit) {
        if (val === null || val === undefined) return '—';
        if (unit === 'UAH' || unit === 'грн' || unit === '$' || unit === '€') {
            return Number(val).toLocaleString('uk-UA');
        }
        return String(val);
    }

    function esc(s) { return String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    // ========================
    //  RENDER: KPI DEBTS
    // ========================
    function renderKpiDebts(ms, pk) {
        const d = document.getElementById('statsKpiDebts');
        if (!d) return;
        const debts = ms.filter(m => {
            if ((m.frequency || 'weekly') !== (statsPeriodType || 'weekly')) return false;
            const entry = getEntryForMetric(m.id, pk);
            return !entry;
        });
        if (debts.length === 0) { d.style.display = 'none'; return; }
        d.style.display = 'block';
        d.innerHTML = `<div class="stats-debt-banner">
            <div class="stats-debt-icon">${SVG.alert}</div>
            <div class="stats-debt-text">
                <strong>${debts.length} ${t('kpiDebts') || 'незаповнених метрик'}</strong>
                <span>${debts.map(m => esc(m.name)).join(', ')}</span>
            </div>
            <button class="stats-pill" onclick="openQuickInputModal()">${t('fillNow') || 'Заповнити'}</button>
        </div>`;
    }

    // ========================
    //  METRIC DETAIL MODAL
    // ========================
    window.openMetricDetail = function(metricId, periodKey) {
        const m = statsMetrics.find(x => x.id === metricId);
        if (!m) return;

        const entry = getEntryForMetric(metricId, periodKey);
        const target = getTargetForMetric(metricId, periodKey);
        const val = entry ? entry.value : '';
        const tgt = target ? target.targetValue : '';
        const mi = statsMetrics.indexOf(m);
        const color = METRIC_COLORS[mi % METRIC_COLORS.length];

        const role = getUserRole();
        const canEdit = role === 'owner' || role === 'manager' || role === 'admin';

        const html = `
        <div class="stats-detail-header">
            <div class="stats-detail-icon" style="background:${color}20;color:${color};">${SVG.target}</div>
            <div>
                <div class="stats-detail-title">${esc(m.name)}</div>
                <div class="stats-detail-sub">${esc(m.unit || '')} &bull; ${formatPeriodLabel(periodKey)}</div>
            </div>
            ${canEdit ? `<button class="stats-pill" style="margin-left:auto;" onclick="openMetricModal('${metricId}')">${SVG.settings} Налаштування</button>` : ''}
        </div>

        <div class="stats-detail-grid">
            <div class="stats-detail-card">
                <div class="stats-detail-card-label">${t('fact') || 'Факт'}</div>
                <div class="stats-detail-card-value" style="color:${color};">${val !== '' ? formatValue(val, m.unit) : '—'}</div>
            </div>
            <div class="stats-detail-card">
                <div class="stats-detail-card-label">${t('target') || 'Ціль'}</div>
                <div class="stats-detail-card-value" style="color:#6b7280;">${tgt !== '' ? formatValue(tgt, m.unit) : '—'}</div>
            </div>
            <div class="stats-detail-card">
                <div class="stats-detail-card-label">%</div>
                <div class="stats-detail-card-value" style="color:${val && tgt ? (val/tgt >= 0.9 ? '#22c55e' : val/tgt >= 0.7 ? '#f59e0b' : '#ef4444') : '#d1d5db'};">
                    ${val && tgt ? Math.round((val / tgt) * 100) + '%' : '—'}
                </div>
            </div>
        </div>

        <div style="display:grid;gap:0.75rem;">
            <div>
                <label style="font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:4px;">${t('fact') || 'Факт'}</label>
                <input type="number" id="metricDetailValue" value="${val}" class="stats-inline-input" style="width:100%;" placeholder="0">
            </div>
            <div>
                <label style="font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:4px;">${t('target') || 'Ціль періоду'}</label>
                <input type="number" id="metricDetailTarget" value="${tgt}" class="stats-inline-input" style="width:100%;" placeholder="0" ${!canEdit ? 'disabled' : ''}>
            </div>
            <div>
                <label style="font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:4px;">${t('comment') || 'Коментар'}</label>
                <textarea id="metricDetailComment" class="stats-comment-area" placeholder="${t('commentHint') || 'Додайте коментар до цього періоду...'}">${esc(entry?.comment || '')}</textarea>
            </div>
            <button class="stats-pill accent" style="justify-content:center;padding:0.6rem;" onclick="saveMetricDetail('${metricId}','${periodKey}')">
                ${SVG.check} ${t('saveAll') || 'Зберегти'}
            </button>
        </div>`;

        openModal('metricModal', html, esc(m.name));
    };

    // Open generic modal (reuses existing modal system)
    function openModal(id, bodyHtml, title) {
        // Use metricModal or create temp
        let modal = document.getElementById('metricModal');
        if (!modal) {
            // Use quick input modal as fallback
            modal = document.getElementById('quickInputModal');
        }
        if (!modal) return;

        // Override modal content
        const body = modal.querySelector('.modal-body') || modal.querySelector('[class*="body"]');
        const titleEl = modal.querySelector('.modal-title') || modal.querySelector('h3');
        if (body) body.innerHTML = bodyHtml;
        if (titleEl) titleEl.textContent = title || '';
        modal.style.display = 'flex';
    }

    // Save metric detail (value + target + comment)
    window.saveMetricDetail = async function(metricId, periodKey) {
        const valInput = document.getElementById('metricDetailValue');
        const tgtInput = document.getElementById('metricDetailTarget');
        const cmtInput = document.getElementById('metricDetailComment');

        const val = valInput ? parseFloat(valInput.value) : null;
        const tgt = tgtInput ? parseFloat(tgtInput.value) : null;
        const cmt = cmtInput ? cmtInput.value.trim() : '';

        if (val === null || isNaN(val)) {
            showToast(t('enterValue') || 'Введіть значення', 'error');
            return;
        }

        try {
            const uid = currentUser.uid;
            const userName = users.find(u => u.id === uid)?.name || currentUser.email;
            const scope = statsCurrentScope;
            const scopeId = scope === 'function' ? statsSelectedFunctionId : scope === 'company' ? currentCompany : uid;

            // Save entry (upsert)
            const upsertKey = scope === 'user'
                ? `${metricId}_${periodKey}_${scope}_${scopeId}_${uid}`
                : `${metricId}_${periodKey}_${scope}_${scopeId}`;

            const existing = statsEntries.find(e =>
                e.metricId === metricId && e.periodKey === periodKey &&
                ((scope === 'user' && e.createdBy === uid) || (scope !== 'user' && e.scope === scope && e.scopeId === scopeId))
            );

            const entryData = {
                metricId,
                periodType: statsPeriodType || 'weekly',
                periodKey,
                scope,
                scopeId,
                date: new Date().toISOString().split('T')[0],
                value: val,
                comment: cmt,
                source: 'manual',
                isOverride: scope !== 'user',
                createdBy: uid,
                userName,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            if (existing?.id) {
                await entriesRef().doc(existing.id).update(entryData);
            } else {
                entryData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await entriesRef().add(entryData);
            }

            // Save target if changed
            if (tgt !== null && !isNaN(tgt)) {
                const existingTarget = statsTargets.find(t =>
                    t.metricId === metricId && t.periodKey === periodKey
                );
                const targetData = {
                    metricId,
                    periodKey,
                    periodType: statsPeriodType || 'weekly',
                    scope: statsCurrentScope === 'function' ? 'function' : 'company',
                    scopeId: statsCurrentScope === 'function' ? statsSelectedFunctionId : currentCompany,
                    targetValue: tgt,
                    setBy: uid,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                };
                if (existingTarget?.id) {
                    await targetsRef().doc(existingTarget.id).update(targetData);
                } else {
                    targetData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    await targetsRef().add(targetData);
                }
            }

            // Close modal
            const modal = document.getElementById('metricModal');
            if (modal) modal.style.display = 'none';
            const qm = document.getElementById('quickInputModal');
            if (qm) qm.style.display = 'none';

            showToast(t('saved') || 'Збережено', 'success');
            await renderStatistics();
        } catch (e) {
            console.error('[STATS] saveMetricDetail:', e);
            showToast('Помилка: ' + e.message, 'error');
        }
    };

    // Period comment (placeholder)
    window.openPeriodComment = function(pk) {
        showToast('Коментарі до періоду — coming soon', 'info');
    };

    // ========================
    //  AI ANALYSIS
    // ========================
    async function runAIAnalysis() {
        const pk = getStatsPeriodKey(statsPeriodOffset);
        const vis = statsMetrics.filter(m => canViewMetric(m));
        if (!vis.length) { showToast(t('noMetrics') || 'Немає метрик', 'error'); return; }

        openModal('aiAnalysisModal');
        const ct = document.getElementById('aiAnalysisContent');
        if (ct) ct.innerHTML = '<div style="text-align:center;padding:2rem;"><div class="spinner"></div></div>';

        const md = vis.map(m => {
            const e = getEntryForMetric(m.id, pk);
            const tg = getTargetForMetric(m.id, pk);
            return { name: m.name, unit: m.unit, value: e?.value || 0, target: tg?.targetValue || 0 };
        });

        const prompt = 'AI-аналітик бізнес-метрик. Період: ' + pk + '\n\n' +
            md.map(m => '- ' + m.name + ': факт=' + m.value + ' ' + m.unit + (m.target > 0 ? ', ціль=' + m.target : '')).join('\n') +
            '\n\nЗадачі: 1) Вузькі місця 2) Причини 3) Рішення з +/- 4) План задач 5) Прогноз';

        if (ct) {
            ct.innerHTML = '<div style="padding:1rem;">' +
                '<div style="background:#f0fdf4;padding:1rem;border-radius:12px;margin-bottom:1rem;">' +
                '<h3 style="margin-bottom:0.5rem;">📊 ' + formatPeriodLabel(pk) + '</h3>' +
                md.map(m =>
                    '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;border-bottom:1px solid #e5e7eb;">' +
                    '<span>' + m.name + '</span>' +
                    '<span style="font-weight:700;">' + m.value + ' ' + m.unit +
                    (m.target > 0 ? ' / ' + m.target + ' (' + Math.round(m.value / m.target * 100) + '%)' : '') +
                    '</span></div>'
                ).join('') + '</div>' +
                '<div style="background:#eff6ff;padding:1rem;border-radius:12px;">' +
                '<h3>🤖 ' + (t('aiReady') || 'AI підключення') + '</h3>' +
                '<details style="margin-top:0.5rem;"><summary style="cursor:pointer;font-size:0.8rem;color:var(--info);">' +
                (t('showPrompt') || 'Промпт') + '</summary>' +
                '<pre style="font-size:0.7rem;white-space:pre-wrap;background:#f9fafb;padding:0.5rem;border-radius:8px;margin-top:0.5rem;max-height:200px;overflow-y:auto;">' +
                esc(prompt) + '</pre></details></div></div>';
        }
    }

    // ========================
    //  INIT
    // ========================
    function initStatistics() {
        showStatsTabIfAllowed();
    }

    // ========================
    //  GLOBAL EXPORTS
    // ========================
    window.renderStatistics = renderStatistics;
    window.openMetricModal = openMetricModal;
    window.saveMetric = saveMetric;
    window.deleteMetric = deleteMetric;
    window.openQuickInputModal = openQuickInputModal;
    window.saveQuickInput = saveQuickInput;
    window.runAIAnalysis = runAIAnalysis;
    window.setStatsView = setStatsView;
    window.setStatsScope = setStatsScope;
    window.statsNavigatePeriod = statsNavigatePeriod;
    window.toggleAutoSpec = toggleAutoSpec;
    window.showStatsTabIfAllowed = showStatsTabIfAllowed;
    // ========================
    //  DEMO DATA GENERATOR
    // ========================
    async function generateStatsDemoData() {
        if (!currentCompany || !currentUser) {
            showToast('Спочатку увійдіть в компанію', 'error');
            return;
        }

        if (!confirm('Згенерувати 5 демо-метрик з даними за 4 тижні? Існуючі метрики не будуть видалені.')) return;

        const now = new Date();
        const uid = currentUser.uid;
        const userName = users.find(u => u.id === uid)?.name || currentUser.email;
        const funcList = typeof functions !== 'undefined' ? functions : [];
        const funcId = funcList.length > 0 ? funcList[0].id : null;

        const demoMetrics = [
            { name: 'Кількість лідів', unit: 'шт', frequency: 'weekly', privacy: 'public', inputType: 'manual', targets: [40, 45, 50, 55] },
            { name: 'Виручка', unit: 'UAH', frequency: 'weekly', privacy: 'restricted', inputType: 'manual', targets: [100000, 110000, 120000, 130000] },
            { name: 'Конверсія', unit: '%', frequency: 'weekly', privacy: 'public', inputType: 'manual', targets: [15, 16, 17, 18] },
            { name: 'NPS клієнтів', unit: 'шт', frequency: 'monthly', privacy: 'owner_only', inputType: 'manual', targets: [70, 72, 75, 78] },
            { name: 'Час відповіді', unit: 'хв', frequency: 'daily', privacy: 'public', inputType: 'manual', targets: [30, 25, 20, 15] },
        ];

        showToast('Генерую демо-дані...', 'info');

        try {
            for (const dm of demoMetrics) {
                const metricData = {
                    name: dm.name,
                    unit: dm.unit,
                    frequency: dm.frequency,
                    privacy: dm.privacy,
                    inputType: dm.inputType,
                    formula: '',
                    alertEnabled: dm.name === 'Конверсія',
                    alertThreshold: 20,
                    boundFunctions: funcId ? { [funcId]: true } : {},
                    autoSpec: null,
                    createdBy: uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                };

                const metricRef = await metricsRef().add(metricData);
                const metricId = metricRef.id;

                // Generate entries for 4 periods back
                for (let i = 0; i < 4; i++) {
                    let pk;
                    const offset = -(i);
                    if (dm.frequency === 'daily') {
                        const d = new Date(now);
                        d.setDate(d.getDate() + offset);
                        pk = d.toISOString().split('T')[0];
                    } else if (dm.frequency === 'weekly') {
                        const d = new Date(now);
                        d.setDate(d.getDate() + offset * 7);
                        pk = toWeekKey(d);
                    } else {
                        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
                        pk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                    }

                    // Random value around target (±30%)
                    const target = dm.targets[i] || dm.targets[0];
                    const variance = target * 0.3;
                    const value = Math.round(target + (Math.random() * 2 - 1) * variance);

                    await entriesRef().add({
                        metricId,
                        periodType: dm.frequency,
                        periodKey: pk,
                        scope: 'user',
                        scopeId: uid,
                        date: new Date().toISOString().split('T')[0],
                        value: Math.max(0, value),
                        source: 'demo',
                        isOverride: false,
                        createdBy: uid,
                        userName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                    // Create target
                    await targetsRef().add({
                        metricId,
                        periodKey: pk,
                        periodType: dm.frequency,
                        scope: 'company',
                        scopeId: currentCompany,
                        targetValue: target,
                        setBy: uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                }
            }

            showToast('Демо-дані створені! Перейдіть на вкладку Метрики.', 'success');
            await loadMetrics();
            renderStatistics();
        } catch (e) {
            console.error('[STATS] generateDemoData:', e);
            showToast('Помилка: ' + e.message, 'error');
        }
    }

    window.initStatistics = initStatistics;
    window.generateStatsDemoData = generateStatsDemoData;
    window.onStatsFunctionChange = onStatsFunctionChange;
})();
