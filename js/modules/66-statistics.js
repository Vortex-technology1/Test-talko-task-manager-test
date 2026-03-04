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
    let statsCurrentScope = 'my';       // my | function | project | company
    let statsSelectedProjectId = '';     // for project scope
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
            // Convert week key to date range: "02-08.03.26"
            const [y, w] = k.split('-W');
            const year = parseInt(y);
            const week = parseInt(w);
            // Get Monday of that week (ISO)
            const jan1 = new Date(year, 0, 1);
            const dayOfWeek = jan1.getDay() || 7; // Mon=1
            const mondayOffset = (week - 1) * 7 - dayOfWeek + 2;
            const monday = new Date(year, 0, 1 + mondayOffset);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            const d1 = String(monday.getDate()).padStart(2, '0');
            const m1 = String(monday.getMonth() + 1).padStart(2, '0');
            const d2 = String(sunday.getDate()).padStart(2, '0');
            const m2 = String(sunday.getMonth() + 1).padStart(2, '0');
            const y2 = String(sunday.getFullYear()).slice(2);
            if (m1 === m2) {
                return d1 + '-' + d2 + '.' + m1 + '.' + y2;
            }
            return d1 + '.' + m1 + '-' + d2 + '.' + m2 + '.' + y2;
        }
        if (k.length === 7) {
            const ms = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
            const [y, m] = k.split('-');
            return ms[parseInt(m) - 1] + ' ' + y;
        }
        // Daily: 2026-03-04 → 04.03.26
        if (k.length === 10) {
            const [y, m, d] = k.split('-');
            return d + '.' + m + '.' + y.slice(2);
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
        if ((scope === 'company' || scope === 'project') && getUserRole() === 'employee') scope = 'my';
        statsCurrentScope = scope;

        document.querySelectorAll('[id^="statsScope"]').forEach(el => el.classList.remove('active'));
        const map = { my: 'My', function: 'Func', project: 'Project', company: 'Company' };
        const btn = document.getElementById('statsScope' + map[scope]);
        if (btn) btn.classList.add('active');

        // P0-3: show/hide function selector
        updateFunctionSelector();
        renderScopeBar();
        renderStatistics();
    }

    window.onStatsProjectChange = function(projectId) {
        statsSelectedProjectId = projectId;
        renderStatistics();
    };

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

            } else if (statsCurrentScope === 'project' && statsSelectedProjectId) {
                // Project view: pull project-scope entries
                const projSnap = await entriesRef()
                    .where('periodKey', '==', pk)
                    .where('scope', '==', 'project')
                    .where('scopeId', '==', statsSelectedProjectId)
                    .get();
                results = projSnap.docs.map(d => ({ id: d.id, ...d.data() }));

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
            alertEnabled: document.getElementById('metricAlertEnabled')?.value === 'true',
            alertThreshold: parseInt(document.getElementById('metricAlertThreshold')?.value) || 20,
            importance: document.getElementById('metricImportance')?.value || 'critical',
            isInverse: document.getElementById('metricIsInverse')?.checked || false,
            responsibleId: document.getElementById('metricResponsible')?.value || '',
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
        if (!await showConfirmModal(t('confirmDeleteMetric') || 'Видалити метрику та всі дані?', { danger: true })) return;
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
        } else if (statsCurrentScope === 'project' && statsSelectedProjectId) {
            scope = 'project';
            scopeId = statsSelectedProjectId;
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
    // Unit pill selector
    window.selectMetricUnit = function(unit) {
        document.getElementById('metricUnit').value = unit;
        document.querySelectorAll('#metricUnitPills .stats-pill').forEach(b => {
            const isActive = b.dataset.unit === unit;
            b.style.background = isActive ? 'var(--primary)' : 'white';
            b.style.color = isActive ? 'white' : 'var(--dark)';
            b.style.borderColor = isActive ? 'var(--primary)' : '#e5e7eb';
        });
    };

    // Importance pill selector
    window.selectMetricImportance = function(imp) {
        document.getElementById('metricImportance').value = imp;
        document.querySelectorAll('#metricImportancePills .stats-pill').forEach(b => {
            const isActive = b.dataset.imp === imp;
            b.style.background = isActive ? 'var(--primary)' : 'white';
            b.style.color = isActive ? 'white' : 'var(--dark)';
            b.style.borderColor = isActive ? 'var(--primary)' : '#e5e7eb';
            // Fix inner text color
            const sub = b.querySelector('span span');
            if (sub) sub.style.color = isActive ? 'rgba(255,255,255,0.8)' : '#9ca3af';
        });
    };

    function openMetricModal(mid) {
        statsEditingMetricId = mid || null;

        // Populate responsible dropdown with company users
        const respSel = document.getElementById('metricResponsible');
        if (respSel) {
            const us = typeof users !== 'undefined' ? users : [];
            respSel.innerHTML = '<option value="">Не призначено</option>' +
                us.map(u => '<option value="' + u.id + '">' + esc(u.name || u.email || u.id) + '</option>').join('');
        }

        // Populate functions list
        const fl = document.getElementById('metricFunctionsList');
        if (fl) {
            const fs = typeof functions !== 'undefined' ? functions : [];
            fl.innerHTML = fs.map(f =>
                '<label style="display:flex;align-items:center;gap:0.3rem;padding:0.35rem 0.7rem;background:#f3f4f6;border-radius:10px;font-size:0.8rem;cursor:pointer;">' +
                '<input type="checkbox" value="' + f.id + '" class="metric-func-cb" style="accent-color:var(--primary);"> ' + esc(f.name || f.title || '') +
                '</label>'
            ).join('');
        }

        // Show/hide delete button
        const delBtn = document.getElementById('metricDeleteBtn');
        if (delBtn) delBtn.style.display = mid ? 'flex' : 'none';

        if (mid) {
            const m = statsMetrics.find(x => x.id === mid);
            if (m) {
                document.getElementById('metricModalTitle').textContent = 'Редагувати показник';
                document.getElementById('metricName').value = m.name || '';
                document.getElementById('metricFrequency').value = m.frequency || 'weekly';
                document.getElementById('metricFrequency').disabled = true;
                document.getElementById('metricTarget').value = m.defaultTarget || '';
                document.getElementById('metricFormula').value = m.formula || '';
                document.getElementById('metricInputType').value = m.inputType || 'manual';
                document.getElementById('metricPrivacy').value = m.privacy || 'public';
                document.getElementById('metricIsInverse').checked = m.isInverse || false;
                // Set unit pills
                selectMetricUnit(m.unit || 'шт');
                // Set importance
                selectMetricImportance(m.importance || 'critical');
                // Set responsible
                if (respSel && m.responsibleId) respSel.value = m.responsibleId;
                // Set alert
                const alertEl = document.getElementById('metricAlertEnabled');
                if (alertEl) alertEl.value = m.alertEnabled ? 'true' : 'false';
                if (m.boundFunctions) {
                    document.querySelectorAll('.metric-func-cb').forEach(cb => {
                        cb.checked = !!m.boundFunctions[cb.value];
                    });
                }
            }
        } else {
            document.getElementById('metricModalTitle').textContent = 'Новий показник';
            document.getElementById('metricName').value = '';
            document.getElementById('metricFrequency').value = 'weekly';
            document.getElementById('metricFrequency').disabled = false;
            document.getElementById('metricTarget').value = '';
            document.getElementById('metricFormula').value = '';
            document.getElementById('metricInputType').value = 'manual';
            document.getElementById('metricPrivacy').value = 'public';
            document.getElementById('metricIsInverse').checked = false;
            selectMetricUnit('грн');
            selectMetricImportance('critical');
            if (respSel) respSel.value = '';
        }

        document.getElementById('metricModal').style.display = 'flex';
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
        const metricCount = statsMetrics.length;

        h.innerHTML = `
        <div class="stats-header">
            <div class="stats-header-title">${SVG.trendUp} <span style="font-size:1.1rem;font-weight:700;">Статистика</span></div>
            <div class="stats-header-actions">
                ${canEdit ? `<button class="stats-pill accent" onclick="openMetricModal()" style="background:var(--primary);color:white;border-color:var(--primary);font-weight:700;padding:0.45rem 1rem;">${SVG.plus} Метрика</button>` : ''}
                <button class="stats-pill" onclick="openQuickInputModal()" style="font-weight:600;">${SVG.edit} Внести дані</button>
                <button class="stats-pill" onclick="runAIAnalysis()" style="color:#7c3aed;border-color:#e9d5ff;">${SVG.sparkles} AI</button>
                <button class="stats-pill" onclick="openTrendsChart(statsMetrics[0]?.id || '')" style="color:#3b82f6;border-color:#dbeafe;">${SVG.barChart} Тренди</button>
            </div>
        </div>
        ${metricCount === 0 ? `
        <div style="text-align:center;padding:2.5rem 1rem;background:white;border-radius:16px;margin-top:1rem;border:2px dashed #e5e7eb;">
            <div style="margin-bottom:0.5rem;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
            <div style="font-weight:700;font-size:1rem;color:#374151;">Почніть з додавання показників</div>
            <div style="color:#9ca3af;font-size:0.85rem;margin:0.5rem 0 1rem;">Натисніть "+ Метрика" щоб створити перший показник (виручка, ліди, конверсія...)</div>
            ${canEdit ? `<button class="btn btn-success" onclick="openMetricModal()" style="padding:0.6rem 1.5rem;border-radius:14px;font-size:0.95rem;">
                ${SVG.plus} Додати перший показник
            </button>
            <div style="margin-top:1rem;display:flex;justify-content:center;gap:0.5rem;">
                <button class="btn btn-small" onclick="generateStatsDemoData()" style="font-size:0.78rem;background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb;">Завантажити демо-дані</button>
            </div>` : ''}
        </div>` : ''}`;
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
            scopes.push({ id: 'project', label: 'Проєкт' });
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
        // Project selector
        let projSel = '';
        if (statsCurrentScope === 'project') {
            const ps = typeof projects !== 'undefined' ? projects.filter(p => p.status === 'active') : [];
            if (ps.length > 0) {
                if (!statsSelectedProjectId && ps.length > 0) statsSelectedProjectId = ps[0].id;
                projSel = `<select class="stats-func-select" onchange="onStatsProjectChange(this.value)">
                    ${ps.map(p => `<option value="${p.id}" ${p.id === statsSelectedProjectId ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
                </select>`;
            }
        }

        sb.innerHTML = `
        <input type="hidden" id="statsPeriodTypeHidden" value="${curPT}">
        <div class="stats-bar">
            ${scopes.map(s => `<button class="stats-pill ${statsCurrentScope === s.id ? 'active' : ''}" onclick="setStatsScope('${s.id}')">${s.label}</button>`).join('')}
            ${funcSel}
            ${projSel}
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

        // Column headers = metric names with actions
        const impColors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22c55e' };
        metrics.forEach((m, mi) => {
            const color = METRIC_COLORS[mi % METRIC_COLORS.length];
            const privacy = m.privacy === 'owner_only' ? ` ${SVG.lock}` : m.privacy === 'restricted' ? ` ${SVG.eye}` : '';
            const unit = m.unit ? ` <sup style="font-weight:400;opacity:0.5;font-size:0.65rem;">${esc(m.unit)}</sup>` : '';
            const impColor = impColors[m.importance] || '#22c55e';
            const inverse = m.isInverse ? ' <span style="font-size:0.6rem;color:#ef4444;">↓</span>' : '';
            // Responsible name
            let respName = '';
            if (m.responsibleId) {
                const ru = (typeof users !== 'undefined' ? users : []).find(u => u.id === m.responsibleId);
                respName = ru ? esc(ru.name || ru.email || '').split(' ')[0] : '';
            }
            const role = getUserRole();
            const canEdit = role === 'owner' || role === 'manager' || role === 'admin';
            html += `<th>
                <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
                    <span style="display:flex;align-items:center;gap:4px;font-size:0.78rem;">
                        <span style="width:8px;height:8px;border-radius:50%;background:${impColor};flex-shrink:0;"></span>
                        ${esc(m.name)}${unit}${privacy}${inverse}
                    </span>
                    ${respName ? `<span style="font-size:0.62rem;font-weight:400;color:${color};">● ${respName}</span>` : ''}
                    <div style="display:flex;gap:4px;margin-top:2px;">
                        ${canEdit ? `<button class="stats-comment-btn" onclick="openMetricModal('${m.id}')" title="Редагувати" style="opacity:0.6;padding:3px 6px;">${SVG.settings}</button>` : ''}
                        ${canEdit ? `<button class="stats-comment-btn" onclick="deleteMetric('${m.id}')" title="Видалити" style="color:#ef4444;opacity:0.6;padding:3px 6px;">${SVG.trash}</button>` : ''}
                        <button class="stats-comment-btn" onclick="openTrendsChart('${m.id}')" title="Графік" style="opacity:0.6;padding:3px 6px;">${SVG.barChart}</button>
                    </div>
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
                    const entryId = entry?.id || '';
                    if (tgt && tgt > 0) {
                        const pct = Math.min(Math.round((val / tgt) * 100), 999);
                        // For inverse metrics (lower is better): flip colors
                        const isInv = m.isInverse || false;
                        const pctColor = isInv
                            ? (pct <= 100 ? '#22c55e' : pct <= 130 ? '#f59e0b' : '#ef4444')
                            : (pct >= 90 ? '#22c55e' : pct >= 70 ? '#f59e0b' : '#ef4444');
                        cellHtml = `
                        <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
                            <span class="stats-val" onclick="openMetricDetail('${m.id}','${pk}')">${formatted}</span>
                            <div class="stats-prog-wrap" style="min-width:60px;">
                                <div class="stats-prog-bar"><div class="stats-prog-fill" style="width:${Math.min(pct, 100)}%;background:${pctColor};"></div></div>
                                <span class="stats-prog-pct" style="color:${pctColor};">${pct}%</span>
                            </div>
                            ${entryId ? `<button class="stats-comment-btn stats-entry-del" onclick="deleteEntry('${entryId}')" title="Видалити запис" style="color:#d1d5db;opacity:0;transition:opacity 0.15s;">${SVG.trash}</button>` : ''}
                        </div>`;
                    } else {
                        cellHtml = `<div style="display:flex;align-items:center;gap:4px;justify-content:center;">
                            <span class="stats-val" onclick="openMetricDetail('${m.id}','${pk}')">${formatted}</span>
                            ${entryId ? `<button class="stats-comment-btn stats-entry-del" onclick="deleteEntry('${entryId}')" title="Видалити запис" style="color:#d1d5db;opacity:0;transition:opacity 0.15s;">${SVG.trash}</button>` : ''}
                        </div>`;
                    }
                } else {
                    cellHtml = `<span class="stats-val-empty" onclick="openMetricDetail('${m.id}','${pk}')" title="Натисніть для введення">+</span>`;
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
                '<h3 style="margin-bottom:0.5rem;">' + formatPeriodLabel(pk) + '</h3>' +
                md.map(m =>
                    '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;border-bottom:1px solid #e5e7eb;">' +
                    '<span>' + m.name + '</span>' +
                    '<span style="font-weight:700;">' + m.value + ' ' + m.unit +
                    (m.target > 0 ? ' / ' + m.target + ' (' + Math.round(m.value / m.target * 100) + '%)' : '') +
                    '</span></div>'
                ).join('') + '</div>' +
                '<div style="background:#eff6ff;padding:1rem;border-radius:12px;">' +
                '<h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg> ' + (t('aiReady') || 'AI підключення') + '</h3>' +
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
    // Delete single entry
    window.deleteEntry = async function(entryId) {
        if (!entryId) return;
        if (!await showConfirmModal(t('confirmDeleteEntry') || 'Видалити цей запис?', { danger: true })) return;
        try {
            await entriesRef().doc(entryId).delete();
            showToast(t('deleted') || 'Видалено', 'success');
            await renderStatistics();
        } catch (e) {
            console.error('[STATS] deleteEntry:', e);
            showToast('Помилка: ' + e.message, 'error');
        }
    };

    // ========================
    //  TRENDS CHART
    // ========================
    let trendsSelectedMetrics = [];
    let trendsChartType = 'line';

    window.openTrendsChart = function(metricId) {
        trendsSelectedMetrics = [metricId];
        trendsChartType = 'line';
        renderTrendsChart();
        document.getElementById('trendsChartModal').style.display = 'flex';
    };

    window.setTrendsChartType = function(type) {
        trendsChartType = type;
        document.getElementById('trendsChartLine')?.classList.toggle('active', type === 'line');
        document.getElementById('trendsChartBar')?.classList.toggle('active', type === 'bar');
        renderTrendsChart();
    };

    window.toggleTrendsMetric = function(mid) {
        const idx = trendsSelectedMetrics.indexOf(mid);
        if (idx >= 0) {
            if (trendsSelectedMetrics.length > 1) trendsSelectedMetrics.splice(idx, 1);
        } else {
            trendsSelectedMetrics.push(mid);
        }
        renderTrendsChart();
    };

    function renderTrendsChart() {
        const pillsC = document.getElementById('trendsMetricPills');
        const chartC = document.getElementById('trendsChartSvg');
        const legendC = document.getElementById('trendsChartLegend');
        if (!pillsC || !chartC) return;

        // Render metric selection pills
        const ms = statsMetrics.filter(m => canViewMetric(m));
        pillsC.innerHTML = ms.map((m, mi) => {
            const color = METRIC_COLORS[mi % METRIC_COLORS.length];
            const sel = trendsSelectedMetrics.includes(m.id);
            return `<button class="stats-pill ${sel ? '' : ''}" style="${sel ? 'background:' + color + ';color:white;border-color:' + color : ''}" onclick="toggleTrendsMetric('${m.id}')">${esc(m.name)}</button>`;
        }).join('');

        // Get data for selected metrics
        const selectedMs = ms.filter(m => trendsSelectedMetrics.includes(m.id));
        if (selectedMs.length === 0) { chartC.innerHTML = ''; return; }

        // Determine periods (12 back)
        const periodCount = 12;
        const freq = selectedMs[0].frequency || 'weekly';
        const periods = [];
        for (let i = periodCount - 1; i >= 0; i--) {
            periods.push(getStatsPeriodKey(-i, freq));
        }

        // Collect data series
        const series = selectedMs.map((m, mi) => {
            const color = METRIC_COLORS[statsMetrics.indexOf(m) % METRIC_COLORS.length];
            const values = periods.map(pk => {
                const e = getEntryForMetric(m.id, pk);
                return e ? (e.value || 0) : null;
            });
            const targets = periods.map(pk => {
                const t = getTargetForMetric(m.id, pk);
                return t ? (t.targetValue || 0) : null;
            });
            return { name: m.name, color, values, targets, unit: m.unit || '' };
        });

        // Find max value for scale
        let maxVal = 0;
        series.forEach(s => {
            s.values.forEach(v => { if (v !== null && v > maxVal) maxVal = v; });
            s.targets.forEach(v => { if (v !== null && v > maxVal) maxVal = v; });
        });
        if (maxVal === 0) maxVal = 100;
        maxVal = Math.ceil(maxVal * 1.15); // 15% headroom

        // SVG dimensions
        const W = 740, H = 320, PAD = { t: 20, r: 20, b: 40, l: 50 };
        const plotW = W - PAD.l - PAD.r;
        const plotH = H - PAD.t - PAD.b;

        let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:Inter,sans-serif;">`;

        // Grid lines + Y axis labels
        const gridSteps = 5;
        for (let i = 0; i <= gridSteps; i++) {
            const y = PAD.t + (plotH / gridSteps) * i;
            const val = Math.round(maxVal - (maxVal / gridSteps) * i);
            svg += `<line x1="${PAD.l}" y1="${y}" x2="${W - PAD.r}" y2="${y}" stroke="#f0f1f3" stroke-width="1"/>`;
            svg += `<text x="${PAD.l - 8}" y="${y + 4}" text-anchor="end" fill="#9ca3af" font-size="11">${val}</text>`;
        }

        // X axis labels
        const xStep = plotW / (periods.length - 1 || 1);
        periods.forEach((pk, pi) => {
            const x = PAD.l + pi * xStep;
            const label = pk.includes('-W') ? 'T' + pk.split('-W')[1] : pk.length === 7 ? pk.split('-')[1] : pk.split('-').slice(1).join('/');
            svg += `<text x="${x}" y="${H - 10}" text-anchor="middle" fill="#9ca3af" font-size="10">${label}</text>`;
        });

        // Draw series
        series.forEach((s, si) => {
            if (trendsChartType === 'line') {
                // Target area (semi-transparent)
                const hasTargets = s.targets.some(t => t !== null);
                if (hasTargets) {
                    let areaPath = '';
                    const tPoints = [];
                    s.targets.forEach((t, ti) => {
                        if (t !== null) {
                            const x = PAD.l + ti * xStep;
                            const y = PAD.t + plotH - (t / maxVal) * plotH;
                            tPoints.push({ x, y });
                        }
                    });
                    if (tPoints.length > 1) {
                        areaPath = `M${tPoints[0].x},${PAD.t + plotH}`;
                        tPoints.forEach(p => areaPath += ` L${p.x},${p.y}`);
                        areaPath += ` L${tPoints[tPoints.length - 1].x},${PAD.t + plotH} Z`;
                        svg += `<path d="${areaPath}" fill="${s.color}" opacity="0.08"/>`;
                        // Target line (dashed)
                        let tLine = '';
                        tPoints.forEach((p, pi) => tLine += (pi === 0 ? 'M' : ' L') + p.x + ',' + p.y);
                        svg += `<path d="${tLine}" fill="none" stroke="${s.color}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4"/>`;
                    }
                }

                // Value line + area
                const vPoints = [];
                s.values.forEach((v, vi) => {
                    if (v !== null) {
                        const x = PAD.l + vi * xStep;
                        const y = PAD.t + plotH - (v / maxVal) * plotH;
                        vPoints.push({ x, y, val: v });
                    }
                });

                if (vPoints.length > 1) {
                    // Area fill
                    let aPath = `M${vPoints[0].x},${PAD.t + plotH}`;
                    vPoints.forEach(p => aPath += ` L${p.x},${p.y}`);
                    aPath += ` L${vPoints[vPoints.length - 1].x},${PAD.t + plotH} Z`;
                    svg += `<path d="${aPath}" fill="${s.color}" opacity="0.12"/>`;

                    // Line
                    let lPath = '';
                    vPoints.forEach((p, pi) => lPath += (pi === 0 ? 'M' : ' L') + p.x + ',' + p.y);
                    svg += `<path d="${lPath}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

                    // Dots
                    vPoints.forEach(p => {
                        svg += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="white" stroke="${s.color}" stroke-width="2"/>`;
                    });
                }
            } else {
                // Bar chart
                const barW = Math.max(8, (xStep * 0.6) / series.length);
                const offset = si * barW - (series.length * barW) / 2 + barW / 2;
                s.values.forEach((v, vi) => {
                    if (v !== null) {
                        const x = PAD.l + vi * xStep + offset;
                        const barH = (v / maxVal) * plotH;
                        const y = PAD.t + plotH - barH;
                        svg += `<rect x="${x - barW / 2}" y="${y}" width="${barW}" height="${barH}" fill="${s.color}" rx="3" opacity="0.8"/>`;
                    }
                });
            }
        });

        svg += '</svg>';
        chartC.innerHTML = svg;

        // Legend
        if (legendC) {
            legendC.innerHTML = series.map(s =>
                `<span style="display:flex;align-items:center;gap:4px;">
                    <span style="width:10px;height:10px;border-radius:3px;background:${s.color};"></span>
                    ${esc(s.name)} ${s.unit ? '(' + esc(s.unit) + ')' : ''}
                </span>`
            ).join('') + (series.some(s => s.targets.some(t => t !== null)) ?
                '<span style="display:flex;align-items:center;gap:4px;"><span style="width:14px;border-top:2px dashed #9ca3af;"></span> План</span>' : '');
        }
    }

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
            showToast('Спочатку увійдіть в компанію', 'error'); return;
        }

        const niche = prompt('Виберіть нішу демо-даних:\n1 — Меблевий бізнес\n2 — Будівництво та ремонти\n3 — Медична клініка\n\nВведіть 1, 2 або 3:');
        if (!niche || !['1','2','3'].includes(niche.trim())) { showToast('Виберіть 1, 2 або 3', 'error'); return; }

        const now = new Date();
        const uid = currentUser.uid;
        const userName = users.find(u => u.id === uid)?.name || currentUser.email;
        const funcList = typeof functions !== 'undefined' ? functions : [];
        const funcIds = funcList.map(f => f.id);

        const NICHES = {
            '1': { name: 'Меблевий бізнес', metrics: [
                { name: 'Замовлення', unit: 'шт', freq: 'weekly', target: 28, privacy: 'public', v: 0.3 },
                { name: 'Виготовлено', unit: 'шт', freq: 'weekly', target: 24, privacy: 'public', v: 0.2 },
                { name: 'Виручка', unit: 'грн', freq: 'weekly', target: 320000, privacy: 'restricted', v: 0.25 },
                { name: 'Середній чек', unit: 'грн', freq: 'weekly', target: 12500, privacy: 'restricted', v: 0.15 },
                { name: 'Ліди з сайту', unit: 'шт', freq: 'weekly', target: 85, privacy: 'public', v: 0.35 },
                { name: 'Конверсія лід-замовлення', unit: '%', freq: 'weekly', target: 33, privacy: 'public', v: 0.2 },
                { name: 'Повернення', unit: 'шт', freq: 'weekly', target: 2, privacy: 'public', v: 0.6 },
                { name: 'Витрати матеріали', unit: 'грн', freq: 'weekly', target: 145000, privacy: 'owner_only', v: 0.15 },
                { name: 'Витрати реклама', unit: 'грн', freq: 'weekly', target: 18000, privacy: 'owner_only', v: 0.2 },
                { name: 'Собівартість', unit: 'грн', freq: 'weekly', target: 7200, privacy: 'restricted', v: 0.12 },
                { name: 'Простій', unit: 'год', freq: 'weekly', target: 4, privacy: 'public', v: 0.5 },
                { name: 'Брак', unit: 'шт', freq: 'weekly', target: 1, privacy: 'public', v: 0.8 },
                { name: 'Ефективність', unit: '%', freq: 'weekly', target: 87, privacy: 'public', v: 0.08 },
                { name: 'NPS', unit: 'балів', freq: 'monthly', target: 74, privacy: 'public', v: 0.1 },
                { name: 'Чистий прибуток', unit: 'грн', freq: 'monthly', target: 185000, privacy: 'owner_only', v: 0.2 },
                { name: 'Виробіток/працівник', unit: 'грн', freq: 'monthly', target: 42000, privacy: 'restricted', v: 0.15 },
                { name: 'План виробництва', unit: '%', freq: 'monthly', target: 92, privacy: 'public', v: 0.08 },
            ]},
            '2': { name: 'Будівництво та ремонти', metrics: [
                { name: 'Нові заявки', unit: 'шт', freq: 'weekly', target: 35, privacy: 'public', v: 0.3 },
                { name: 'Виїзди на обєкт', unit: 'шт', freq: 'weekly', target: 18, privacy: 'public', v: 0.25 },
                { name: 'Підписані договори', unit: 'шт', freq: 'weekly', target: 8, privacy: 'restricted', v: 0.3 },
                { name: 'Виручка', unit: 'грн', freq: 'weekly', target: 480000, privacy: 'restricted', v: 0.25 },
                { name: 'Середній чек', unit: 'грн', freq: 'weekly', target: 62000, privacy: 'restricted', v: 0.15 },
                { name: 'Конверсія заявка-договір', unit: '%', freq: 'weekly', target: 23, privacy: 'public', v: 0.2 },
                { name: 'Активних обєктів', unit: 'шт', freq: 'weekly', target: 12, privacy: 'public', v: 0.15 },
                { name: 'Завершено обєктів', unit: 'шт', freq: 'weekly', target: 3, privacy: 'public', v: 0.4 },
                { name: 'Прострочені дедлайни', unit: 'шт', freq: 'weekly', target: 1, privacy: 'public', v: 0.7 },
                { name: 'Витрати матеріали', unit: 'грн', freq: 'weekly', target: 210000, privacy: 'owner_only', v: 0.2 },
                { name: 'Витрати субпідряд', unit: 'грн', freq: 'weekly', target: 95000, privacy: 'owner_only', v: 0.3 },
                { name: 'Витрати реклама', unit: 'грн', freq: 'weekly', target: 22000, privacy: 'owner_only', v: 0.2 },
                { name: 'Фото до/після', unit: 'шт', freq: 'weekly', target: 6, privacy: 'public', v: 0.35 },
                { name: 'NPS', unit: 'балів', freq: 'monthly', target: 68, privacy: 'public', v: 0.12 },
                { name: 'Чистий прибуток', unit: 'грн', freq: 'monthly', target: 320000, privacy: 'owner_only', v: 0.22 },
                { name: 'Маржинальність', unit: '%', freq: 'monthly', target: 35, privacy: 'owner_only', v: 0.1 },
                { name: 'Відгуки Google', unit: 'шт', freq: 'monthly', target: 8, privacy: 'public', v: 0.4 },
            ]},
            '3': { name: 'Медична клініка', metrics: [
                { name: 'Первинних пацієнтів', unit: 'шт', freq: 'weekly', target: 42, privacy: 'public', v: 0.25 },
                { name: 'Повторних пацієнтів', unit: 'шт', freq: 'weekly', target: 65, privacy: 'public', v: 0.2 },
                { name: 'Дзвінки вхідні', unit: 'шт', freq: 'weekly', target: 180, privacy: 'public', v: 0.2 },
                { name: 'Конверсія дзвінок-запис', unit: '%', freq: 'weekly', target: 72, privacy: 'public', v: 0.1 },
                { name: 'Конверсія запис-прихід', unit: '%', freq: 'weekly', target: 85, privacy: 'public', v: 0.08 },
                { name: 'Виручка', unit: 'грн', freq: 'weekly', target: 520000, privacy: 'restricted', v: 0.2 },
                { name: 'Середній чек', unit: 'грн', freq: 'weekly', target: 4800, privacy: 'restricted', v: 0.12 },
                { name: 'Кількість послуг', unit: 'шт', freq: 'weekly', target: 285, privacy: 'public', v: 0.15 },
                { name: 'Завантаженість', unit: '%', freq: 'weekly', target: 78, privacy: 'restricted', v: 0.1 },
                { name: 'Скасовані записи', unit: 'шт', freq: 'weekly', target: 8, privacy: 'public', v: 0.4 },
                { name: 'Час очікування', unit: 'хв', freq: 'weekly', target: 12, privacy: 'public', v: 0.3 },
                { name: 'Витрати реклама', unit: 'грн', freq: 'weekly', target: 35000, privacy: 'owner_only', v: 0.2 },
                { name: 'Вартість ліда', unit: 'грн', freq: 'weekly', target: 280, privacy: 'owner_only', v: 0.25 },
                { name: 'Витрати матеріали', unit: 'грн', freq: 'weekly', target: 85000, privacy: 'owner_only', v: 0.15 },
                { name: 'NPS', unit: 'балів', freq: 'monthly', target: 82, privacy: 'public', v: 0.08 },
                { name: 'Чистий прибуток', unit: 'грн', freq: 'monthly', target: 380000, privacy: 'owner_only', v: 0.2 },
                { name: 'Відгуки Google', unit: 'шт', freq: 'monthly', target: 12, privacy: 'public', v: 0.35 },
                { name: 'Плинність персоналу', unit: '%', freq: 'monthly', target: 4, privacy: 'owner_only', v: 0.3 },
            ]},
        };

        const nicheData = NICHES[niche.trim()];
        if (!await showConfirmModal('Згенерувати ' + nicheData.metrics.length + ' метрик для "' + nicheData.name + '" з даними за 10 тижнів?', { danger: true })) return;

        showToast('Генерую "' + nicheData.name + '"...', 'info');
        try {
            const periodsMap = { daily: 10, weekly: 10, monthly: 6 };
            for (let mi = 0; mi < nicheData.metrics.length; mi++) {
                const dm = nicheData.metrics[mi];
                const funcBind = {};
                const funcIdx = mi % Math.max(funcIds.length, 1);
                if (funcIds.length > 0) funcBind[funcIds[funcIdx]] = true;
                const metricRef = await metricsRef().add({
                    name: dm.name, unit: dm.unit, frequency: dm.freq,
                    privacy: dm.privacy, inputType: 'manual', formula: '',
                    alertEnabled: dm.unit === '%', alertThreshold: 20,
                    importance: dm.name.includes('Виручка') || dm.name.includes('Прибуток') || dm.name.includes('Конверсія') ? 'critical' : dm.name.includes('Витрати') || dm.name.includes('Середній') ? 'high' : dm.name.includes('NPS') || dm.name.includes('Відгуки') ? 'medium' : 'low',
                    isInverse: dm.name.includes('Брак') || dm.name.includes('Простій') || dm.name.includes('Повернення') || dm.name.includes('Рекламації') || dm.name.includes('Прострочені') || dm.name.includes('Скасовані') || dm.name.includes('Плинність') || dm.name.includes('Час очікування') || dm.name.includes('Вартість ліда'),
                    responsibleId: (typeof users !== 'undefined' && users.length > 0) ? users[mi % users.length]?.id || '' : '',
                    boundFunctions: funcBind, autoSpec: null, createdBy: uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
                const metricId = metricRef.id;
                const periods = periodsMap[dm.freq] || 10;
                for (let i = 0; i < periods; i++) {
                    let pk;
                    if (dm.freq === 'daily') { const d = new Date(now); d.setDate(d.getDate() - i); pk = d.toISOString().split('T')[0]; }
                    else if (dm.freq === 'weekly') { const d = new Date(now); d.setDate(d.getDate() - i * 7); pk = toWeekKey(d); }
                    else { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); pk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
                    const age = (periods - i) / periods;
                    const trend = 0.85 + age * 0.2;
                    const noise = (Math.random() * 2 - 1) * (dm.v || 0.25);
                    let value = Math.round(dm.target * trend * (1 + noise));
                    if (dm.unit === '%' || dm.unit === 'балів') value = Math.max(1, Math.min(value, 98));
                    value = Math.max(0, value);
                    const tgtVar = dm.target * 0.05;
                    const periodTarget = Math.round(dm.target + (Math.random() * 2 - 1) * tgtVar);
                    await entriesRef().add({ metricId, periodType: dm.freq, periodKey: pk, scope: 'user', scopeId: uid, date: new Date().toISOString().split('T')[0], value, source: 'demo', isOverride: false, createdBy: uid, userName, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    await targetsRef().add({ metricId, periodKey: pk, periodType: dm.freq, scope: 'company', scopeId: currentCompany, targetValue: periodTarget, setBy: uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                }
            }
            showToast(nicheData.name + ' — ' + nicheData.metrics.length + ' метрик створено!', 'success');
            await loadMetrics();
            renderStatistics();
        } catch (e) { console.error('[STATS] demo:', e); showToast('Помилка: ' + e.message, 'error'); }
    }

    // ========================
    //  AUTO-METRICS ENGINE
    //  Варіант A: автоматичний зв'язок tasks → metricEntries
    // ========================

    // Типи авто-джерел
    const AUTO_SOURCES = {
        auto_tasks_done:       { label: 'Виконані задачі',   unit: 'шт' },
        auto_tasks_overdue:    { label: 'Прострочені задачі', unit: 'шт' },
        auto_tasks_review:     { label: 'На перевірці',       unit: 'шт' },
        auto_completion_rate:  { label: '% виконання',        unit: '%'  },
    };

    // Вибір джерела в UI metricModal
    window.selectMetricSource = function(source) {
        document.querySelectorAll('.metric-source-btn').forEach(btn => {
            const active = btn.dataset.source === source;
            btn.style.borderColor = active ? '#22c55e' : '#e5e7eb';
            btn.style.background  = active ? '#f0fdf4' : 'white';
            btn.style.color       = active ? '#16a34a' : '#374151';
            btn.style.fontWeight  = active ? '600' : '400';
        });
        document.getElementById('metricInputType').value = source === 'manual' ? 'manual' : 'auto';
        const autoBlock = document.getElementById('autoSpecBlock');
        const preview   = document.getElementById('autoSpecPreview');
        if (source !== 'manual') {
            autoBlock.style.display = 'block';
            // Зберігаємо тип у прихованому полі через autoSpec
            autoBlock.dataset.autoSource = source;
            if (preview) preview.textContent = AUTO_SOURCES[source]?.label || '';
            // Підставляємо одиницю виміру
            const unit = AUTO_SOURCES[source]?.unit;
            if (unit) { try { selectMetricUnit(unit); } catch(e){} }
        } else {
            autoBlock.style.display = 'none';
            autoBlock.dataset.autoSource = '';
        }
    };

    // Патч saveMetric — читає autoSource з UI кнопок перед збереженням
    const origSaveMetricFn = saveMetric;

    // ========================
    //  COMPUTE AUTO VALUE
    //  Рахує значення автометрики за period
    // ========================
    function computeAutoValue(metric, periodKey) {
        if (!metric?.autoSpec?.type) return null;
        const src = metric.autoSpec.type;
        if (!AUTO_SOURCES[src]) return null;

        const freq = metric.frequency || 'weekly';
        const allTasks = typeof tasks !== 'undefined' ? tasks : [];
        const boundFuncs = metric.boundFunctions ? Object.keys(metric.boundFunctions) : [];

        // Фільтруємо задачі за period
        const periodTasks = allTasks.filter(tk => {
            if (!isTaskInPeriod(tk, periodKey, freq)) return false;
            // Якщо є прив'язка до функцій — фільтруємо
            if (boundFuncs.length > 0) {
                const func = typeof functions !== 'undefined'
                    ? functions.find(f => f.name === tk.function)
                    : null;
                if (!func || !boundFuncs.includes(func.id)) return false;
            }
            return true;
        });

        if (src === 'auto_tasks_done') {
            return periodTasks.filter(tk => tk.status === 'done').length;
        }
        if (src === 'auto_tasks_overdue') {
            const today = getLocalDateStr ? getLocalDateStr() : new Date().toISOString().split('T')[0];
            return periodTasks.filter(tk =>
                tk.status !== 'done' && tk.deadlineDate && tk.deadlineDate < today
            ).length;
        }
        if (src === 'auto_tasks_review') {
            return periodTasks.filter(tk => tk.status === 'review').length;
        }
        if (src === 'auto_completion_rate') {
            const total = periodTasks.length;
            if (total === 0) return 0;
            const done = periodTasks.filter(tk => tk.status === 'done').length;
            return Math.round((done / total) * 100);
        }
        return null;
    }

    // Визначає чи задача потрапляє в period (по completedAt або deadlineDate)
    function isTaskInPeriod(tk, periodKey, freq) {
        // Для done — по completedAt; для решти — по deadlineDate
        let dateStr = null;
        if (tk.status === 'done' && tk.completedAt) {
            const d = tk.completedAt.toDate ? tk.completedAt.toDate() : new Date(tk.completedAt);
            dateStr = d.toISOString().split('T')[0];
        } else if (tk.deadlineDate) {
            dateStr = tk.deadlineDate;
        } else if (tk.createdDate) {
            dateStr = tk.createdDate;
        }
        if (!dateStr) return false;

        if (freq === 'daily') return dateStr === periodKey;
        if (freq === 'weekly') return toWeekKey(new Date(dateStr)) === periodKey;
        // monthly: YYYY-MM
        return dateStr.slice(0, 7) === periodKey;
    }

    // Патч getEntryForMetric — якщо метрика auto і немає ручного entry → повертаємо computed value
    const _origGetEntry = getEntryForMetric;
    // Перевизначаємо через замикання
    window._computeAutoForMetric = function(metric, periodKey) {
        if (!metric || metric.inputType !== 'auto') return null;
        const val = computeAutoValue(metric, periodKey);
        if (val === null) return null;
        return { value: val, _auto: true };
    };

    // Інтегруємо в renderStatistics: для auto метрик показуємо computed value
    const _origRenderStats = window.renderStatistics;
    window.renderStatistics = function() {
        // Перед рендером — проставляємо auto values в statsEntries (in-memory, без запису в Firestore)
        injectAutoValues();
        return _origRenderStats ? _origRenderStats() : renderStatistics();
    };

    function injectAutoValues() {
        if (!statsMetrics || !statsMetrics.length) return;
        const autoMetrics = statsMetrics.filter(m => m.inputType === 'auto' && m.autoSpec?.type);
        if (!autoMetrics.length) return;

        // Для кожної auto метрики і поточного + попередніх periods
        const offsets = [-2, -1, 0];
        autoMetrics.forEach(m => {
            offsets.forEach(offset => {
                const pk = getStatsPeriodKey(offset, m.frequency);
                // Якщо немає ручного entry — додаємо computed
                const existing = statsEntries.find(e => e.metricId === m.id && e.periodKey === pk);
                if (!existing) {
                    const val = computeAutoValue(m, pk);
                    if (val !== null) {
                        // Додаємо ephemeral entry (не пишемо в Firestore)
                        statsEntries.push({
                            id: `_auto_${m.id}_${pk}`,
                            metricId: m.id,
                            periodKey: pk,
                            periodType: m.frequency,
                            value: val,
                            _auto: true,
                            _ephemeral: true,
                            createdBy: currentUser?.uid || '',
                            scope: 'company',
                            scopeId: currentCompany,
                        });
                    }
                } else if (existing._ephemeral) {
                    // Оновлюємо ephemeral якщо tasks змінились
                    const val = computeAutoValue(m, pk);
                    if (val !== null) existing.value = val;
                }
            });
        });
    }

    // openMetricModal — відновлюємо source buttons при редагуванні
    const _origOpenMetricModal = window.openMetricModal;
    window.openMetricModal = function(mid) {
        _origOpenMetricModal(mid);
        // Після відкриття — встановлюємо source buttons
        setTimeout(() => {
            const m = mid ? statsMetrics.find(x => x.id === mid) : null;
            const src = m?.autoSpec?.type || 'manual';
            if (window.selectMetricSource) window.selectMetricSource(src);
        }, 50);
    };

    // openMetricModal вже переглядений — додаємо відновлення autoSpec.type з метрики при edit
    // (це робиться в setTimeout вище)

    // Також патчимо saveMetric щоб читав autoSource з UI кнопок
    window.saveMetric = async function() {
        const autoBlock = document.getElementById('autoSpecBlock');
        const autoSource = autoBlock?.dataset?.autoSource || '';
        const isAuto = autoSource && autoSource !== 'manual';

        // Встановлюємо hidden fields для оригінального saveMetric
        const inputTypeEl = document.getElementById('metricInputType');
        if (inputTypeEl) inputTypeEl.value = isAuto ? 'auto' : 'manual';

        // autoSpec type — записуємо через тимчасовий element
        if (isAuto) {
            let el = document.getElementById('autoSpecType');
            if (!el) {
                el = document.createElement('input');
                el.type = 'hidden'; el.id = 'autoSpecType';
                document.body.appendChild(el);
            }
            el.value = autoSource;
            // functionId — порожній (використовуються boundFunctions)
            let elF = document.getElementById('autoSpecFunction');
            if (!elF) {
                elF = document.createElement('input');
                elF.type = 'hidden'; elF.id = 'autoSpecFunction';
                document.body.appendChild(elF);
            }
            elF.value = '';
        }

        return origSaveMetricFn();
    };

    // Expose computeAutoValue для можливих зовнішніх викликів
    window.computeAutoValue = computeAutoValue;


    window.initStatistics = initStatistics;
    window.generateStatsDemoData = generateStatsDemoData;
    window.onStatsFunctionChange = onStatsFunctionChange;

    // Clear all stats data (admin only)
    window.clearAllStatsData = async function() {
        if (!currentCompany || !currentUser) return;
        if (!await showConfirmModal('ВИДАЛИТИ ВСІ метрики, записи та цілі?\n\nЦя дія незворотна — відновлення неможливе.', { danger: true })) return;

        showToast('Видаляю...', 'info');
        try {
            const collections = ['metrics', 'metricEntries', 'metricTargets', 'metricAggregates', 'metricInsights', 'metricAuditLog'];
            for (const col of collections) {
                const snap = await db.collection('companies').doc(currentCompany).collection(col).get();
                const batch = db.batch();
                let count = 0;
                snap.docs.forEach(d => { batch.delete(d.ref); count++; });
                if (count > 0) await batch.commit();
            }
            statsMetrics = []; statsEntries = []; statsTargets = []; statsAggregates = [];
            showToast('Всі Stats дані видалені', 'success');
            renderStatistics();
        } catch (e) {
            console.error('[STATS] clearAll:', e);
            showToast('Помилка: ' + e.message, 'error');
        }
    };
})();
