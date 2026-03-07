// ============================================================
// 77-crm.js — TALKO CRM Module v1.0
// Kanban воронка угод + Контакти + Налаштування
// ============================================================
(function () {
    'use strict';

    // ── State ──────────────────────────────────────────────
    let crmContacts = [];
    let crmDeals = [];
    let crmPipelines = [];
    let crmUnsubscribes = [];
    let crmCurrentPipelineId = null;
    let crmCurrentSubTab = 'pipeline'; // pipeline | contacts | settings
    let crmDragDeal = null;
    let crmEditingDealId = null;
    let crmEditingContactId = null;
    let crmEditingPipelineId = null;

    // ── Init ───────────────────────────────────────────────
    window.initCRMModule = async function () {
        if (!window.currentCompanyId) return;
        renderCRMShell();
        await loadCRMData();
    };

    function renderCRMShell() {
        const container = document.getElementById('crmContainer');
        if (!container) return;
        container.innerHTML = `
            <div id="crmModule" style="padding:0.75rem;">

                <!-- Sub-tabs -->
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;background:white;border-radius:12px;padding:0.4rem;box-shadow:var(--shadow);">
                    <button onclick="crmSwitchSubTab('pipeline')" id="crmTabPipeline"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:#22c55e;color:white;transition:all 0.2s;">
                        <i data-lucide="layout-dashboard" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>Воронка
                    </button>
                    <button onclick="crmSwitchSubTab('contacts')" id="crmTabContacts"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:transparent;color:#525252;transition:all 0.2s;">
                        <i data-lucide="users" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>Контакти
                    </button>
                    <button onclick="crmSwitchSubTab('settings')" id="crmTabSettings"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:transparent;color:#525252;transition:all 0.2s;">
                        <i data-lucide="settings" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>Налаштування
                    </button>
                </div>

                <!-- Content areas -->
                <div id="crmPipelineView"></div>
                <div id="crmContactsView" style="display:none;"></div>
                <div id="crmSettingsView" style="display:none;"></div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }

    window.crmSwitchSubTab = function (tab) {
        crmCurrentSubTab = tab;
        ['pipeline', 'contacts', 'settings'].forEach(t => {
            const btn = document.getElementById('crmTab' + t.charAt(0).toUpperCase() + t.slice(1));
            const view = document.getElementById('crm' + t.charAt(0).toUpperCase() + t.slice(1) + 'View');
            if (btn) {
                btn.style.background = t === tab ? '#22c55e' : 'transparent';
                btn.style.color = t === tab ? 'white' : '#525252';
            }
            if (view) view.style.display = t === tab ? '' : 'none';
        });
        if (tab === 'pipeline') renderPipelineView();
        if (tab === 'contacts') renderContactsView();
        if (tab === 'settings') renderSettingsView();
        if (window.lucide) lucide.createIcons();
    };

    // ── Firebase Loaders ───────────────────────────────────
    async function loadCRMData() {
        if (!window.currentCompanyId) return;
        crmUnsubscribes.forEach(u => u && u());
        crmUnsubscribes = [];

        const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);

        // Load pipelines
        const pipSnap = await base.collection('pipelines').get();
        crmPipelines = pipSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Create default pipeline if none
        if (crmPipelines.length === 0) {
            await createDefaultPipeline();
        }

        crmCurrentPipelineId = (crmPipelines.find(p => p.isDefault) || crmPipelines[0])?.id;

        // Live contacts
        const contUnsub = base.collection('contacts')
            .orderBy('lastActivity', 'desc').limit(500)
            .onSnapshot(snap => {
                crmContacts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                if (crmCurrentSubTab === 'contacts') renderContactsView();
                updateCRMBadge();
            });
        crmUnsubscribes.push(contUnsub);

        // Live deals
        const dealUnsub = base.collection('deals')
            .orderBy('createdAt', 'desc').limit(500)
            .onSnapshot(snap => {
                crmDeals = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                if (crmCurrentSubTab === 'pipeline') renderPipelineView();
                updateCRMBadge();
            });
        crmUnsubscribes.push(dealUnsub);

        renderPipelineView();
    }

    async function createDefaultPipeline() {
        const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
        const ref = await base.collection('pipelines').add({
            name: 'Основна воронка',
            isDefault: true,
            stages: [
                { id: 'new',         label: 'Новий лід',      color: '#6b7280', order: 0 },
                { id: 'qualified',   label: 'Кваліфікований', color: '#3b82f6', order: 1 },
                { id: 'negotiation', label: 'Переговори',      color: '#f97316', order: 2 },
                { id: 'proposal',    label: 'Пропозиція',      color: '#8b5cf6', order: 3 },
                { id: 'won',         label: 'Виграно',         color: '#22c55e', order: 4 },
                { id: 'lost',        label: 'Програно',        color: '#ef4444', order: 5 },
            ],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        crmPipelines = [{ id: ref.id, name: 'Основна воронка', isDefault: true, stages: [
            { id: 'new', label: 'Новий лід', color: '#6b7280', order: 0 },
            { id: 'qualified', label: 'Кваліфікований', color: '#3b82f6', order: 1 },
            { id: 'negotiation', label: 'Переговори', color: '#f97316', order: 2 },
            { id: 'proposal', label: 'Пропозиція', color: '#8b5cf6', order: 3 },
            { id: 'won', label: 'Виграно', color: '#22c55e', order: 4 },
            { id: 'lost', label: 'Програно', color: '#ef4444', order: 5 },
        ]}];
        crmCurrentPipelineId = ref.id;
    }

    function updateCRMBadge() {
        const badge = document.getElementById('crmNavBadge');
        if (!badge) return;
        const newCount = crmDeals.filter(d => d.stage === 'new').length;
        if (newCount > 0) {
            badge.textContent = newCount;
            badge.style.display = '';
        } else {
            badge.style.display = 'none';
        }
    }

    // ── Pipeline / Kanban View ─────────────────────────────
    function renderPipelineView() {
        const container = document.getElementById('crmPipelineView');
        if (!container || crmCurrentSubTab !== 'pipeline') return;

        const pipeline = crmPipelines.find(p => p.id === crmCurrentPipelineId);
        if (!pipeline) {
            container.innerHTML = '<p style="color:#6b7280;text-align:center;padding:2rem;">Воронку не знайдено</p>';
            return;
        }

        const stages = [...(pipeline.stages || [])].sort((a, b) => a.order - b.order);

        // Stats
        const totalDeals = crmDeals.filter(d => d.pipelineId === crmCurrentPipelineId).length;
        const wonDeals = crmDeals.filter(d => d.pipelineId === crmCurrentPipelineId && d.stage === 'won').length;
        const totalAmount = crmDeals
            .filter(d => d.pipelineId === crmCurrentPipelineId && d.stage !== 'lost')
            .reduce((s, d) => s + (d.amount || 0), 0);

        container.innerHTML = `
            <!-- Header -->
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
                <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                    <div style="background:white;border-radius:10px;padding:0.6rem 1rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:0.5rem;">
                        <i data-lucide="briefcase" style="width:16px;height:16px;color:#22c55e;"></i>
                        <span style="font-size:0.8rem;color:#6b7280;">Угод:</span>
                        <span style="font-weight:700;color:#1a1a1a;">${totalDeals}</span>
                    </div>
                    <div style="background:white;border-radius:10px;padding:0.6rem 1rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:0.5rem;">
                        <i data-lucide="trophy" style="width:16px;height:16px;color:#22c55e;"></i>
                        <span style="font-size:0.8rem;color:#6b7280;">Закрито:</span>
                        <span style="font-weight:700;color:#22c55e;">${wonDeals}</span>
                    </div>
                    <div style="background:white;border-radius:10px;padding:0.6rem 1rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:0.5rem;">
                        <i data-lucide="banknote" style="width:16px;height:16px;color:#3b82f6;"></i>
                        <span style="font-size:0.8rem;color:#6b7280;">Сума:</span>
                        <span style="font-weight:700;color:#1a1a1a;">${formatAmount(totalAmount)}</span>
                    </div>
                </div>
                <button onclick="openCreateDealModal()" style="display:flex;align-items:center;gap:0.4rem;padding:0.55rem 1rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    <i data-lucide="plus" style="width:16px;height:16px;"></i> Нова угода
                </button>
            </div>

            <!-- Kanban Board -->
            <div style="overflow-x:auto;padding-bottom:0.5rem;">
                <div id="crmKanbanBoard" style="display:flex;gap:0.75rem;min-width:max-content;align-items:flex-start;">
                    ${stages.map(stage => renderKanbanColumn(stage, pipeline.id)).join('')}
                </div>
            </div>
        `;

        if (window.lucide) lucide.createIcons();
        initDragDrop();
    }

    function renderKanbanColumn(stage, pipelineId) {
        const deals = crmDeals.filter(d => d.pipelineId === pipelineId && d.stage === stage.id);
        const stageAmount = deals.reduce((s, d) => s + (d.amount || 0), 0);

        return `
            <div class="crm-kanban-col" data-stage="${stage.id}"
                style="width:240px;background:#f9fafb;border-radius:12px;padding:0.75rem;min-height:200px;flex-shrink:0;"
                ondragover="crmDragOver(event)" ondrop="crmDrop(event,'${stage.id}')">
                <!-- Column Header -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:3px solid ${stage.color};">
                    <div>
                        <div style="font-weight:700;font-size:0.85rem;color:#1a1a1a;">${stage.label}</div>
                        <div style="font-size:0.75rem;color:#6b7280;">${deals.length} угод${stageAmount > 0 ? ' · ' + formatAmount(stageAmount) : ''}</div>
                    </div>
                    <button onclick="openCreateDealModal('${stage.id}')" style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:2px;border-radius:6px;display:flex;align-items:center;" title="Додати угоду">
                        <i data-lucide="plus" style="width:16px;height:16px;"></i>
                    </button>
                </div>
                <!-- Cards -->
                <div style="display:flex;flex-direction:column;gap:0.5rem;" id="stage-${stage.id}">
                    ${deals.map(deal => renderDealCard(deal)).join('')}
                </div>
            </div>
        `;
    }

    function renderDealCard(deal) {
        const contact = crmContacts.find(c => c.id === deal.contactId);
        const initials = getInitials(deal.title || contact?.name || '?');
        const sourceIcon = { telegram: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.9.5-1 1-.1.4.1.9.4 1.2l4 4L4 15l-2 1 1 2 2-1 3.8 1.2 4 4c.3.3.8.5 1.2.4.5-.1.9-.5 1-1z"/></svg></span>', instagram: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M8 6V4h8v2"/></svg></span>', web: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>', direct: '👤' }[deal.source] || '📋';
        const relDate = deal.updatedAt?.toDate ? relativeTime(deal.updatedAt.toDate()) : '';

        return `
            <div class="crm-deal-card" draggable="true" data-deal-id="${deal.id}"
                ondragstart="crmDragStart(event,'${deal.id}')"
                onclick="openDealModal('${deal.id}')"
                style="background:white;border-radius:10px;padding:0.75rem;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.07);border:1px solid #f0fdf4;transition:box-shadow 0.15s,transform 0.15s;"
                onmouseenter="this.style.boxShadow='0 4px 12px rgba(34,197,94,0.15)';this.style.transform='translateY(-1px)'"
                onmouseleave="this.style.boxShadow='0 1px 4px rgba(0,0,0,0.07)';this.style.transform=''">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
                    <div style="font-weight:600;font-size:0.85rem;color:#1a1a1a;line-height:1.3;flex:1;margin-right:0.5rem;">${escHtml(deal.title || 'Без назви')}</div>
                    <span style="font-size:0.8rem;">${sourceIcon}</span>
                </div>
                ${contact ? `<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.4rem;">
                    <div style="width:20px;height:20px;border-radius:50%;background:#22c55e;color:white;font-size:0.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${initials}</div>
                    <span style="font-size:0.78rem;color:#525252;">${escHtml(contact.name || contact.phone || '')}</span>
                </div>` : ''}
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    ${deal.amount ? `<span style="font-size:0.8rem;font-weight:700;color:#16a34a;">${formatAmount(deal.amount)}</span>` : '<span></span>'}
                    ${relDate ? `<span style="font-size:0.72rem;color:#9ca3af;">${relDate}</span>` : ''}
                </div>
            </div>
        `;
    }

    // ── Drag & Drop ────────────────────────────────────────
    function initDragDrop() {
        // handled via inline handlers
    }

    window.crmDragStart = function (e, dealId) {
        crmDragDeal = dealId;
        e.dataTransfer.effectAllowed = 'move';
    };

    window.crmDragOver = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const col = e.currentTarget;
        col.style.background = '#f0fdf4';
    };

    window.crmDrop = async function (e, newStage) {
        e.preventDefault();
        e.currentTarget.style.background = '#f9fafb';
        if (!crmDragDeal) return;
        const deal = crmDeals.find(d => d.id === crmDragDeal);
        if (!deal || deal.stage === newStage) { crmDragDeal = null; return; }

        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('deals').doc(crmDragDeal)
                .update({ stage: newStage, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            if (typeof showToast === 'function') showToast('Стадію оновлено', 'success');
        } catch (err) {
            console.error('CRM drop error:', err);
        }
        crmDragDeal = null;
    };

    // ── Deal Modal ─────────────────────────────────────────
    window.openDealModal = function (dealId) {
        const deal = crmDeals.find(d => d.id === dealId);
        if (!deal) return;
        crmEditingDealId = dealId;
        const contact = crmContacts.find(c => c.id === deal.contactId);
        const pipeline = crmPipelines.find(p => p.id === deal.pipelineId);
        const stages = pipeline?.stages || [];

        const html = `
            <div id="crmDealOverlay" onclick="if(event.target===this)closeCRMDealModal()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;">
                <div style="background:white;border-radius:16px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
                    <!-- Header -->
                    <div style="padding:1.25rem 1.25rem 0.75rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:flex-start;">
                        <div>
                            <div style="font-size:1rem;font-weight:700;color:#1a1a1a;margin-bottom:0.2rem;">${escHtml(deal.title || 'Угода')}</div>
                            <div style="font-size:0.8rem;color:#9ca3af;">ID: ${dealId.slice(0,8)}</div>
                        </div>
                        <button onclick="closeCRMDealModal()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;line-height:1;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <!-- Sub tabs -->
                    <div style="display:flex;gap:0;border-bottom:1px solid #f0f0f0;">
                        ${['overview','contact','notes'].map((t,i) => `
                            <button onclick="crmDealTab('${t}')" id="crmDT_${t}"
                                style="flex:1;padding:0.6rem;border:none;border-bottom:2px solid ${i===0?'#22c55e':'transparent'};background:none;cursor:pointer;font-size:0.82rem;font-weight:${i===0?'700':'500'};color:${i===0?'#22c55e':'#6b7280'};transition:all 0.2s;">
                                ${{ overview:'Огляд', contact:'Контакт', notes:'Нотатки' }[t]}
                            </button>`).join('')}
                    </div>
                    <!-- Tab content -->
                    <div id="crmDealTabContent" style="padding:1.25rem;">
                        ${renderDealOverviewTab(deal, contact, stages)}
                    </div>
                    <!-- Footer -->
                    <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                        <button onclick="confirmDeleteDeal('${dealId}')" style="padding:0.5rem 1rem;background:#fee2e2;color:#ef4444;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;">Видалити</button>
                        <button onclick="closeCRMDealModal()" style="padding:0.5rem 1rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.82rem;">Закрити</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        if (window.lucide) lucide.createIcons();
    };

    window.crmDealTab = function (tab) {
        const deal = crmDeals.find(d => d.id === crmEditingDealId);
        if (!deal) return;
        const contact = crmContacts.find(c => c.id === deal.contactId);
        const pipeline = crmPipelines.find(p => p.id === deal.pipelineId);
        const stages = pipeline?.stages || [];

        ['overview','contact','notes'].forEach(t => {
            const btn = document.getElementById('crmDT_' + t);
            if (btn) {
                btn.style.borderBottomColor = t === tab ? '#22c55e' : 'transparent';
                btn.style.fontWeight = t === tab ? '700' : '500';
                btn.style.color = t === tab ? '#22c55e' : '#6b7280';
            }
        });

        const content = document.getElementById('crmDealTabContent');
        if (!content) return;
        if (tab === 'overview') content.innerHTML = renderDealOverviewTab(deal, contact, stages);
        if (tab === 'contact') content.innerHTML = renderDealContactTab(deal, contact);
        if (tab === 'notes') content.innerHTML = renderDealNotesTab(deal);
        if (window.lucide) lucide.createIcons();
    };

    function renderDealOverviewTab(deal, contact, stages) {
        return `
            <div style="display:flex;flex-direction:column;gap:1rem;">
                <div>
                    <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА УГОДИ</label>
                    <input id="crmDealTitleInput" value="${escHtml(deal.title || '')}"
                        style="width:100%;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;"
                        onblur="saveDealField('title',this.value)">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                    <div>
                        <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">СТАДІЯ</label>
                        <select onchange="updateDealStage(this.value)"
                            style="width:100%;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;box-sizing:border-box;">
                            ${stages.map(s => `<option value="${s.id}" ${deal.stage === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">СУМА</label>
                        <input type="number" value="${deal.amount || ''}" placeholder="0"
                            style="width:100%;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;"
                            onblur="saveDealField('amount',parseFloat(this.value)||0)">
                    </div>
                </div>
                ${contact ? `
                <div style="background:#f0fdf4;border-radius:10px;padding:0.75rem;display:flex;align-items:center;gap:0.75rem;">
                    <div style="width:36px;height:36px;border-radius:50%;background:#22c55e;color:white;font-size:0.85rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${getInitials(contact.name || contact.phone || '?')}</div>
                    <div>
                        <div style="font-weight:600;font-size:0.88rem;">${escHtml(contact.name || contact.phone || '')}</div>
                        <div style="font-size:0.78rem;color:#6b7280;">${escHtml(contact.phone || '')} ${contact.email ? '· ' + escHtml(contact.email) : ''}</div>
                    </div>
                </div>` : ''}
                <div>
                    <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ДЖЕРЕЛО</label>
                    <div style="font-size:0.88rem;color:#1a1a1a;">${deal.source || '—'}</div>
                </div>
                <div>
                    <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ДАТА СТВОРЕННЯ</label>
                    <div style="font-size:0.88rem;color:#1a1a1a;">${deal.createdAt?.toDate ? deal.createdAt.toDate().toLocaleDateString('uk-UA') : '—'}</div>
                </div>
            </div>`;
    }

    function renderDealContactTab(deal, contact) {
        if (!contact) return '<p style="color:#6b7280;text-align:center;padding:2rem;">Контакт не прив\'язаний</p>';
        const vars = contact.variables || {};
        return `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                    <div>
                        <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ІМ'Я</label>
                        <div style="font-size:0.9rem;font-weight:600;">${escHtml(contact.name || '—')}</div>
                    </div>
                    <div>
                        <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТЕЛЕФОН</label>
                        <a href="tel:${contact.phone}" style="font-size:0.9rem;color:#22c55e;text-decoration:none;font-weight:600;">${escHtml(contact.phone || '—')}</a>
                    </div>
                </div>
                ${contact.email ? `<div>
                    <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">EMAIL</label>
                    <div style="font-size:0.9rem;">${escHtml(contact.email)}</div>
                </div>` : ''}
                ${Object.keys(vars).length > 0 ? `
                <div>
                    <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.5rem;">ДАНІ З ВОРОНКИ</label>
                    <div style="background:#f9fafb;border-radius:8px;padding:0.75rem;display:flex;flex-direction:column;gap:0.4rem;">
                        ${Object.entries(vars).map(([k,v]) => `
                            <div style="display:flex;gap:0.5rem;">
                                <span style="font-size:0.78rem;color:#6b7280;min-width:100px;">${escHtml(k)}:</span>
                                <span style="font-size:0.78rem;color:#1a1a1a;font-weight:500;">${escHtml(String(v))}</span>
                            </div>`).join('')}
                    </div>
                </div>` : ''}
                <div>
                    <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТЕГИ</label>
                    <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
                        ${(contact.tags || []).map(tag => `<span style="background:#f0fdf4;color:#16a34a;padding:0.2rem 0.6rem;border-radius:20px;font-size:0.75rem;font-weight:600;">${escHtml(tag)}</span>`).join('')}
                        ${(contact.tags || []).length === 0 ? '<span style="color:#9ca3af;font-size:0.82rem;">Немає тегів</span>' : ''}
                    </div>
                </div>
            </div>`;
    }

    function renderDealNotesTab(deal) {
        const notes = deal.notes || [];
        return `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <div style="display:flex;gap:0.5rem;">
                    <textarea id="crmNoteInput" placeholder="Додати нотатку..."
                        style="flex:1;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;resize:vertical;min-height:60px;font-family:inherit;"></textarea>
                    <button onclick="addDealNote()" style="padding:0.5rem 0.75rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;align-self:flex-end;white-space:nowrap;">+ Додати</button>
                </div>
                <div id="crmNotesList" style="display:flex;flex-direction:column;gap:0.5rem;">
                    ${notes.length === 0 ? '<p style="color:#9ca3af;text-align:center;font-size:0.85rem;padding:1rem;">Нотаток поки немає</p>' :
                        notes.slice().reverse().map(n => `
                            <div style="background:#f9fafb;border-radius:8px;padding:0.65rem 0.75rem;">
                                <div style="font-size:0.85rem;color:#1a1a1a;margin-bottom:0.3rem;">${escHtml(n.text)}</div>
                                <div style="font-size:0.72rem;color:#9ca3af;">${n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString('uk-UA', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : ''}</div>
                            </div>`).join('')}
                </div>
            </div>`;
    }

    window.closeCRMDealModal = function () {
        document.getElementById('crmDealOverlay')?.remove();
        crmEditingDealId = null;
    };

    window.saveDealField = async function (field, value) {
        if (!crmEditingDealId) return;
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('deals').doc(crmEditingDealId)
                .update({ [field]: value, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        } catch (e) { console.error(e); }
    };

    window.updateDealStage = async function (stage) {
        if (!crmEditingDealId) return;
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('deals').doc(crmEditingDealId)
                .update({ stage, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            if (typeof showToast === 'function') showToast('Стадію оновлено', 'success');
        } catch (e) { console.error(e); }
    };

    window.addDealNote = async function () {
        const input = document.getElementById('crmNoteInput');
        if (!input || !input.value.trim() || !crmEditingDealId) return;
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('deals').doc(crmEditingDealId)
                .update({
                    notes: firebase.firestore.FieldValue.arrayUnion({
                        text: input.value.trim(),
                        createdAt: firebase.firestore.Timestamp.now()
                    }),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            input.value = '';
            if (typeof showToast === 'function') showToast('Нотатку додано', 'success');
        } catch (e) { console.error(e); }
    };

    window.confirmDeleteDeal = function (dealId) {
        if (!confirm('Видалити угоду? Це незворотно.')) return;
        firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('deals').doc(dealId).delete()
            .then(() => {
                closeCRMDealModal();
                if (typeof showToast === 'function') showToast('Угоду видалено', 'success');
            }).catch(e => console.error(e));
    };

    // ── Create Deal Modal ──────────────────────────────────
    window.openCreateDealModal = function (preStage) {
        const pipeline = crmPipelines.find(p => p.id === crmCurrentPipelineId);
        const stages = pipeline?.stages || [];

        const html = `
            <div id="crmCreateDealOverlay" onclick="if(event.target===this)closeCreateDealModal()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;">
                <div style="background:white;border-radius:16px;width:100%;max-width:440px;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
                    <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;font-size:1rem;">Нова угода</div>
                        <button onclick="closeCreateDealModal()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА УГОДИ *</label>
                            <input id="newDealTitle" placeholder="Наприклад: Імплантація — Іван Петренко"
                                style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                            <div>
                                <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ІМ'Я КЛІЄНТА</label>
                                <input id="newDealContactName" placeholder="Ім'я"
                                    style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТЕЛЕФОН</label>
                                <input id="newDealPhone" placeholder="+380..."
                                    style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                            <div>
                                <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">СУМА</label>
                                <input id="newDealAmount" type="number" placeholder="0"
                                    style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">СТАДІЯ</label>
                                <select id="newDealStage"
                                    style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;box-sizing:border-box;">
                                    ${stages.map(s => `<option value="${s.id}" ${s.id === preStage ? 'selected' : ''}>${s.label}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ДЖЕРЕЛО</label>
                            <select id="newDealSource" style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;box-sizing:border-box;">
                                <option value="direct">Прямий контакт</option>
                                <option value="web">Сайт</option>
                                <option value="telegram">Telegram</option>
                                <option value="instagram">Instagram</option>
                                <option value="referral">Рекомендація</option>
                            </select>
                        </div>
                    </div>
                    <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                        <button onclick="closeCreateDealModal()" style="padding:0.55rem 1rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                        <button onclick="saveNewDeal()" style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Створити</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('newDealTitle')?.focus();
    };

    window.closeCreateDealModal = function () {
        document.getElementById('crmCreateDealOverlay')?.remove();
    };

    window.saveNewDeal = async function () {
        const title = document.getElementById('newDealTitle')?.value.trim();
        if (!title) { alert('Введіть назву угоди'); return; }

        const contactName = document.getElementById('newDealContactName')?.value.trim();
        const phone = document.getElementById('newDealPhone')?.value.trim();
        const amount = parseFloat(document.getElementById('newDealAmount')?.value) || 0;
        const stage = document.getElementById('newDealStage')?.value || 'new';
        const source = document.getElementById('newDealSource')?.value || 'direct';

        try {
            const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
            const now = firebase.firestore.FieldValue.serverTimestamp();
            const nowTs = firebase.firestore.Timestamp.now();

            // Create or find contact
            let contactId = null;
            if (contactName || phone) {
                // Check if contact exists by phone
                if (phone) {
                    const existing = await base.collection('contacts').where('phone', '==', phone).limit(1).get();
                    if (!existing.empty) {
                        contactId = existing.docs[0].id;
                    }
                }
                if (!contactId) {
                    const cRef = await base.collection('contacts').add({
                        name: contactName || '',
                        phone: phone || '',
                        source,
                        tags: [],
                        variables: {},
                        status: 'active',
                        lastActivity: nowTs,
                        createdAt: now
                    });
                    contactId = cRef.id;
                }
            }

            await base.collection('deals').add({
                title,
                contactId,
                pipelineId: crmCurrentPipelineId,
                stage,
                amount,
                currency: 'UAH',
                source,
                notes: [],
                createdAt: now,
                updatedAt: now
            });

            closeCreateDealModal();
            if (typeof showToast === 'function') showToast('Угоду створено ✓', 'success');
        } catch (err) {
            console.error('saveNewDeal error:', err);
            alert('Помилка збереження: ' + err.message);
        }
    };

    // ── Contacts View ──────────────────────────────────────
    let crmContactsSearch = '';

    function renderContactsView() {
        const container = document.getElementById('crmContactsView');
        if (!container || crmCurrentSubTab !== 'contacts') return;

        const filtered = crmContacts.filter(c => {
            if (!crmContactsSearch) return true;
            const q = crmContactsSearch.toLowerCase();
            return (c.name || '').toLowerCase().includes(q) ||
                   (c.phone || '').includes(q) ||
                   (c.email || '').toLowerCase().includes(q);
        });

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap;">
                <input type="search" placeholder="Пошук за ім'ям, телефоном..."
                    value="${escHtml(crmContactsSearch)}"
                    oninput="crmContactsSearch=this.value;renderContactsFromGlobal()"
                    style="flex:1;min-width:200px;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:10px;font-size:0.85rem;background:white;">
                <button onclick="openCreateContactModal()" style="padding:0.55rem 1rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.85rem;white-space:nowrap;">
                    + Контакт
                </button>
            </div>

            ${filtered.length === 0 ? `
                <div style="text-align:center;padding:3rem;color:#9ca3af;">
                    <div style="font-size:2rem;margin-bottom:0.5rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span></div>
                    <div>${crmContactsSearch ? 'Нічого не знайдено' : 'Контактів поки немає'}</div>
                </div>` : `
                <div style="background:white;border-radius:12px;box-shadow:var(--shadow);overflow:hidden;">
                    ${filtered.map((c, i) => `
                        <div onclick="openContactModal('${c.id}')"
                            style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;cursor:pointer;border-bottom:${i < filtered.length-1 ? '1px solid #f0f0f0' : 'none'};transition:background 0.15s;"
                            onmouseenter="this.style.background='#f9fafb'" onmouseleave="this.style.background=''">
                            <div style="width:36px;height:36px;border-radius:50%;background:#22c55e;color:white;font-size:0.85rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${getInitials(c.name || c.phone || '?')}</div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-weight:600;font-size:0.88rem;color:#1a1a1a;">${escHtml(c.name || c.phone || 'Без імені')}</div>
                                <div style="font-size:0.78rem;color:#6b7280;">${escHtml(c.phone || '')}${c.email ? ' · ' + escHtml(c.email) : ''}</div>
                            </div>
                            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.2rem;">
                                ${(c.tags||[]).slice(0,2).map(t => `<span style="background:#f0fdf4;color:#16a34a;padding:0.1rem 0.45rem;border-radius:20px;font-size:0.7rem;font-weight:600;">${escHtml(t)}</span>`).join('')}
                                <span style="font-size:0.7rem;color:#9ca3af;">${c.source || ''}</span>
                            </div>
                        </div>`).join('')}
                </div>`}
        `;
    }

    window.renderContactsFromGlobal = function () {
        renderContactsView();
    };

    window.openCreateContactModal = function () {
        const html = `
            <div id="crmCreateContactOverlay" onclick="if(event.target===this)closeCreateContactModal()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;">
                <div style="background:white;border-radius:16px;width:100%;max-width:400px;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
                    <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;">Новий контакт</div>
                        <button onclick="closeCreateContactModal()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ІМ'Я</label>
                            <input id="newContactName" placeholder="Ім'я та прізвище" style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТЕЛЕФОН</label>
                            <input id="newContactPhone" placeholder="+380..." style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">EMAIL</label>
                            <input id="newContactEmail" placeholder="email@example.com" style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ДЖЕРЕЛО</label>
                            <select id="newContactSource" style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;box-sizing:border-box;">
                                <option value="direct">Прямий контакт</option>
                                <option value="web">Сайт</option>
                                <option value="telegram">Telegram</option>
                                <option value="instagram">Instagram</option>
                                <option value="referral">Рекомендація</option>
                            </select>
                        </div>
                    </div>
                    <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                        <button onclick="closeCreateContactModal()" style="padding:0.55rem 1rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                        <button onclick="saveNewContact()" style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Зберегти</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('newContactName')?.focus();
    };

    window.closeCreateContactModal = function () {
        document.getElementById('crmCreateContactOverlay')?.remove();
    };

    window.saveNewContact = async function () {
        const name = document.getElementById('newContactName')?.value.trim();
        const phone = document.getElementById('newContactPhone')?.value.trim();
        if (!name && !phone) { alert('Введіть ім\'я або телефон'); return; }
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('contacts').add({
                    name: name || '',
                    phone: phone || '',
                    email: document.getElementById('newContactEmail')?.value.trim() || '',
                    source: document.getElementById('newContactSource')?.value || 'direct',
                    tags: [], variables: {}, status: 'active',
                    lastActivity: firebase.firestore.Timestamp.now(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            closeCreateContactModal();
            if (typeof showToast === 'function') showToast('Контакт створено ✓', 'success');
        } catch (err) {
            alert('Помилка: ' + err.message);
        }
    };

    window.openContactModal = function (contactId) {
        const contact = crmContacts.find(c => c.id === contactId);
        if (!contact) return;
        const contactDeals = crmDeals.filter(d => d.contactId === contactId);

        const html = `
            <div id="crmContactOverlay" onclick="if(event.target===this)document.getElementById('crmContactOverlay').remove()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;">
                <div style="background:white;border-radius:16px;width:100%;max-width:460px;max-height:85vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
                    <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                        <div style="display:flex;align-items:center;gap:0.75rem;">
                            <div style="width:44px;height:44px;border-radius:50%;background:#22c55e;color:white;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center;">${getInitials(contact.name || contact.phone || '?')}</div>
                            <div>
                                <div style="font-weight:700;font-size:1rem;">${escHtml(contact.name || 'Без імені')}</div>
                                <div style="font-size:0.8rem;color:#6b7280;">${escHtml(contact.phone || '')} ${contact.email ? '· ' + escHtml(contact.email) : ''}</div>
                            </div>
                        </div>
                        <button onclick="document.getElementById('crmContactOverlay').remove()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">
                        <div>
                            <div style="font-size:0.78rem;color:#6b7280;font-weight:600;margin-bottom:0.5rem;">УГОДИ (${contactDeals.length})</div>
                            ${contactDeals.length === 0 ? '<p style="color:#9ca3af;font-size:0.85rem;">Немає угод</p>' :
                                contactDeals.map(d => {
                                    const pipeline = crmPipelines.find(p => p.id === d.pipelineId);
                                    const stage = pipeline?.stages?.find(s => s.id === d.stage);
                                    return `<div onclick="document.getElementById('crmContactOverlay').remove();openDealModal('${d.id}')"
                                        style="background:#f9fafb;border-radius:8px;padding:0.65rem 0.75rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;"
                                        onmouseenter="this.style.background='#f0fdf4'" onmouseleave="this.style.background='#f9fafb'">
                                        <span style="font-size:0.85rem;font-weight:600;">${escHtml(d.title)}</span>
                                        <span style="font-size:0.75rem;background:${stage?.color||'#6b7280'}22;color:${stage?.color||'#6b7280'};padding:0.2rem 0.6rem;border-radius:20px;font-weight:600;">${stage?.label||d.stage}</span>
                                    </div>`;
                                }).join('')}
                        </div>
                        <button onclick="document.getElementById('crmContactOverlay').remove();openCreateDealModal('new')" style="width:100%;padding:0.55rem;background:#f0fdf4;color:#16a34a;border:1px dashed #bbf7d0;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                            + Створити угоду для цього контакту
                        </button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
    };

    // ── Settings View ──────────────────────────────────────
    function renderSettingsView() {
        const container = document.getElementById('crmSettingsView');
        if (!container || crmCurrentSubTab !== 'settings') return;
        const pipeline = crmPipelines.find(p => p.id === crmCurrentPipelineId);
        const stages = [...(pipeline?.stages || [])].sort((a, b) => a.order - b.order);

        container.innerHTML = `
            <div style="background:white;border-radius:12px;padding:1.25rem;box-shadow:var(--shadow);margin-bottom:1rem;">
                <h3 style="font-size:0.95rem;font-weight:700;color:#1a1a1a;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">
                    <i data-lucide="sliders" style="width:16px;height:16px;color:#22c55e;"></i> Стадії воронки
                </h3>
                <div id="crmStagesList" style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem;">
                    ${stages.map((s, i) => `
                        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;background:#f9fafb;border-radius:8px;border-left:3px solid ${s.color};">
                            <input type="color" value="${s.color}" onchange="updateStageColor('${s.id}',this.value)"
                                style="width:28px;height:28px;border:none;border-radius:4px;cursor:pointer;padding:0;background:none;">
                            <input value="${escHtml(s.label)}" onblur="updateStageLabel('${s.id}',this.value)"
                                style="flex:1;padding:0.35rem 0.5rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;">
                            <span style="font-size:0.75rem;color:#9ca3af;min-width:20px;text-align:center;">${crmDeals.filter(d=>d.stage===s.id).length}</span>
                            ${['won','lost'].includes(s.id) ? '' : `<button onclick="deleteStage('${s.id}')" style="background:none;border:none;cursor:pointer;color:#ef4444;padding:2px;" title="Видалити"><i data-lucide="x" style="width:14px;height:14px;"></i></button>`}
                        </div>`).join('')}
                </div>
                <button onclick="addNewStage()" style="width:100%;padding:0.55rem;background:#f0fdf4;color:#16a34a;border:1px dashed #bbf7d0;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    + Додати стадію
                </button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }

    window.updateStageLabel = async function (stageId, label) {
        if (!label.trim()) return;
        await updatePipelineStage(stageId, { label: label.trim() });
    };

    window.updateStageColor = async function (stageId, color) {
        await updatePipelineStage(stageId, { color });
    };

    window.deleteStage = async function (stageId) {
        const count = crmDeals.filter(d => d.stage === stageId).length;
        if (count > 0) { alert(`Неможливо видалити: в цій стадії є ${count} угод`); return; }
        if (!confirm('Видалити стадію?')) return;
        const pipeline = crmPipelines.find(p => p.id === crmCurrentPipelineId);
        if (!pipeline) return;
        const newStages = pipeline.stages.filter(s => s.id !== stageId);
        await savePipelineStages(newStages);
        renderSettingsView();
    };

    window.addNewStage = async function () {
        const label = prompt('Назва нової стадії:');
        if (!label?.trim()) return;
        const pipeline = crmPipelines.find(p => p.id === crmCurrentPipelineId);
        if (!pipeline) return;
        const maxOrder = Math.max(...(pipeline.stages || []).map(s => s.order), -1);
        const newStages = [...(pipeline.stages || []), {
            id: 'stage_' + Date.now(),
            label: label.trim(),
            color: '#6b7280',
            order: maxOrder + 1
        }];
        await savePipelineStages(newStages);
        renderSettingsView();
    };

    async function updatePipelineStage(stageId, updates) {
        const pipeline = crmPipelines.find(p => p.id === crmCurrentPipelineId);
        if (!pipeline) return;
        const newStages = pipeline.stages.map(s => s.id === stageId ? { ...s, ...updates } : s);
        await savePipelineStages(newStages);
    }

    async function savePipelineStages(stages) {
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('pipelines').doc(crmCurrentPipelineId)
                .update({ stages });
            // Update local
            const idx = crmPipelines.findIndex(p => p.id === crmCurrentPipelineId);
            if (idx >= 0) crmPipelines[idx].stages = stages;
            if (typeof showToast === 'function') showToast('Збережено', 'success');
        } catch (err) { console.error(err); }
    }

    // ── Utilities ──────────────────────────────────────────
    function escHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function getInitials(name) {
        const parts = (name || '').trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return (name || '?').slice(0, 2).toUpperCase();
    }

    function formatAmount(n) {
        if (!n) return '0 ₴';
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'М ₴';
        if (n >= 1000) return (n / 1000).toFixed(0) + 'К ₴';
        return n.toLocaleString('uk-UA') + ' ₴';
    }

    function relativeTime(date) {
        const diff = Date.now() - date.getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'щойно';
        if (m < 60) return m + ' хв';
        const h = Math.floor(m / 60);
        if (h < 24) return h + ' год';
        const d = Math.floor(h / 24);
        if (d < 30) return d + ' дн';
        return date.toLocaleDateString('uk-UA');
    }

    // ── Cleanup ────────────────────────────────────────────
    window.destroyCRMModule = function () {
        crmUnsubscribes.forEach(u => u && u());
        crmUnsubscribes = [];
    };

    // ── Tab Switch Hook ────────────────────────────────────
    const _origST = window.switchTab;
    window.switchTab = function (tab) {
        if (_origST) _origST(tab);
        if (tab === 'crm') {
            if (window.isFeatureEnabled && window.isFeatureEnabled('crm')) {
                if (typeof initCRMModule === 'function' && crmPipelines.length === 0) {
                    initCRMModule();
                } else {
                    renderPipelineView();
                }
            }
        }
    };

})();
