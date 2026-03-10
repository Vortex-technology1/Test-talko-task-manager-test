// ============================================================
// 77-crm.js — TALKO CRM v3.0 (AmoCRM style)
// Clean UI: no emojis, SVG icons, minimal design
// ============================================================
(function () {
'use strict';

// ── SVG Icons ──────────────────────────────────────────────
const I = {
    deal:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    user:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    phone:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    money:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    chart:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    plus:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    close:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    edit:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    note:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    call:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    meet:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    ai:       '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    arrow:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    tg:       '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    web:      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    ig:       '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    check:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    funnel:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    users:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};

// ── State ──────────────────────────────────────────────────
let crm = {
    deals: [], clients: [], pipeline: null, pipelines: [],
    stats: null, unsubs: [], subTab: 'kanban',
    activeDealId: null, dragDealId: null, loading: true,
};

// ── Init ───────────────────────────────────────────────────
window.initCRMModule = async function () {
    if (!window.currentCompanyId) return;
    _renderShell();
    try {
        await _loadAll();
    } catch(e) {
        console.error('[CRM]', e.message);
        const c = document.getElementById('crmViewKanban');
        if (c) c.innerHTML = `<div style="padding:2rem;text-align:center;color:#ef4444;font-size:0.82rem;">
            Помилка: ${e.message}<br>
            <button onclick="window.initCRMModule()" style="margin-top:0.75rem;padding:0.4rem 1rem;
            background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;">Повторити</button></div>`;
        crm.loading = false;
    }
    _listenEventBus();
};

// ── Shell ──────────────────────────────────────────────────
function _renderShell() {
    const container = document.getElementById('crmContainer');
    if (!container) return;

    const tabs = [
        ['kanban',    I.funnel, 'Воронка'],
        ['clients',   I.users,  'Клієнти'],
        ['analytics', I.chart,  'Аналітика'],
    ];

    container.innerHTML = `
    <div style="height:calc(100vh - 56px);display:flex;flex-direction:column;background:#f4f5f7;">

        <!-- Top bar -->
        <div style="background:white;border-bottom:1px solid #e8eaed;padding:0 1rem;
            display:flex;align-items:center;justify-content:space-between;height:48px;flex-shrink:0;">
            <div style="display:flex;gap:0;height:100%;">
                ${tabs.map(([id, icon, label]) => `
                <button onclick="crmSwitchTab('${id}')" id="crmTab_${id}"
                    style="display:flex;align-items:center;gap:0.4rem;padding:0 1rem;
                    height:100%;background:none;border:none;border-bottom:2px solid transparent;
                    cursor:pointer;font-size:0.82rem;font-weight:500;color:#6b7280;
                    transition:all 0.15s;">
                    ${icon} ${label}
                </button>`).join('')}
            </div>
            <button onclick="crmOpenCreateDeal()"
                style="display:flex;align-items:center;gap:0.35rem;padding:0.4rem 0.9rem;
                background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;
                font-size:0.81rem;font-weight:600;">
                ${I.plus} Угода
            </button>
        </div>

        <!-- Content -->
        <div style="flex:1;overflow:hidden;">
            <div id="crmViewKanban" style="height:100%;overflow:auto;"></div>
            <div id="crmViewClients" style="height:100%;overflow:auto;display:none;padding:1rem;"></div>
            <div id="crmViewAnalytics" style="height:100%;overflow:auto;display:none;padding:1rem;"></div>
        </div>
    </div>`;

    crmSwitchTab('kanban');
}

window.crmSwitchTab = function(tab) {
    crm.subTab = tab;
    ['kanban','clients','analytics'].forEach(t => {
        const view = document.getElementById('crmView' + t.charAt(0).toUpperCase() + t.slice(1));
        const btn  = document.getElementById('crmTab_' + t);
        if (view) view.style.display = t === tab ? '' : 'none';
        if (btn) {
            btn.style.borderBottomColor = t === tab ? '#22c55e' : 'transparent';
            btn.style.color = t === tab ? '#22c55e' : '#6b7280';
            btn.style.fontWeight = t === tab ? '600' : '500';
        }
    });
    if (tab === 'kanban')    _renderKanban();
    if (tab === 'clients')   _renderClients();
    if (tab === 'analytics') _renderAnalytics();
};

// ── Load ───────────────────────────────────────────────────
async function _loadAll() {
    const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
    crm.unsubs.forEach(u => u && u());
    crm.unsubs = [];

    const pipSnap = await base.collection('crm_pipeline').get();
    crm.pipelines = pipSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!crm.pipelines.length) await _createDefaultPipeline();
    crm.pipeline = crm.pipelines.find(p => p.isDefault) || crm.pipelines[0];

    const dealUnsub = base.collection('crm_deals')
        .where('pipelineId', '==', crm.pipeline.id)
        .limit(200)
        .onSnapshot(snap => {
            crm.deals = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
            crm.loading = false;
            if (crm.subTab === 'kanban') _renderKanban();
        }, err => { console.error('[CRM deals]', err); crm.loading = false; });
    crm.unsubs.push(dealUnsub);

    const clientSnap = await base.collection('crm_clients').limit(100).get();
    crm.clients = clientSnap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function _createDefaultPipeline() {
    const stages = [
        { id:'new',         label:'Новий',        color:'#6b7280', order:0 },
        { id:'contact',     label:'Контакт',      color:'#3b82f6', order:1 },
        { id:'negotiation', label:'Переговори',   color:'#8b5cf6', order:2 },
        { id:'proposal',    label:'Пропозиція',   color:'#f59e0b', order:3 },
        { id:'closing',     label:'Закриття',     color:'#f97316', order:4 },
        { id:'won',         label:'Виграно',      color:'#22c55e', order:5 },
        { id:'lost',        label:'Програно',     color:'#ef4444', order:6 },
    ];
    const ref = await firebase.firestore()
        .collection('companies').doc(window.currentCompanyId)
        .collection('crm_pipeline').add({
            name:'Основна воронка', isDefault:true, stages,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    crm.pipelines = [{ id: ref.id, name:'Основна воронка', isDefault:true, stages }];
    crm.pipeline  = crm.pipelines[0];
}

// ── Event Bus ──────────────────────────────────────────────
function _listenEventBus() {
    if (typeof window.TALKO_EVENTS === 'undefined') return;
    window.addEventListener('talko:event', function(e) {
        const ev = e.detail;
        if (ev && ev.type === window.TALKO_EVENTS?.DEAL_CREATED) {
            if (typeof showToast === 'function') showToast('Новий лід у CRM', 'success');
        }
    });
}

// ══════════════════════════════════════════════════════════
// KANBAN
// ══════════════════════════════════════════════════════════
function _renderKanban() {
    const c = document.getElementById('crmViewKanban');
    if (!c) return;

    if (crm.loading) {
        c.innerHTML = '<div style="text-align:center;padding:4rem;color:#9ca3af;font-size:0.85rem;">Завантаження...</div>';
        return;
    }

    const stages    = (crm.pipeline?.stages || []).slice().sort((a,b) => a.order - b.order);
    const mainStages = stages.filter(s => s.id !== 'lost');
    const lostStage  = stages.find(s => s.id === 'lost');

    const total    = crm.deals.length;
    const active   = crm.deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
    const won      = crm.deals.filter(d => d.stage === 'won').length;
    const revenue  = crm.deals.filter(d => d.stage === 'won').reduce((s,d) => s+(d.amount||0), 0);
    const pipeline = crm.deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((s,d) => s+(d.amount||0), 0);

    c.innerHTML = `
    <!-- Stats row -->
    <div style="display:flex;gap:1px;background:#e8eaed;border-bottom:1px solid #e8eaed;">
        ${[
            ['Угод', total],
            ['Активних', active],
            ['Виграно', won],
            ['Revenue', _fmt(revenue)],
            ['Pipeline', _fmt(pipeline)],
        ].map(([l,v]) => `
        <div style="flex:1;background:white;padding:0.65rem 1rem;">
            <div style="font-size:1rem;font-weight:700;color:#1a1a1a;">${v}</div>
            <div style="font-size:0.68rem;color:#9ca3af;margin-top:1px;">${l}</div>
        </div>`).join('')}
    </div>

    <!-- Kanban board -->
    <div style="display:flex;gap:0;height:calc(100% - 57px);overflow-x:auto;">
        ${mainStages.map(s => _kanbanCol(s)).join('')}
        ${lostStage ? _kanbanColLost(lostStage) : ''}
    </div>`;
}

function _kanbanCol(stage) {
    const deals = crm.deals.filter(d => d.stage === stage.id);
    const amt   = deals.reduce((s,d) => s+(d.amount||0), 0);

    return `
    <div data-stage="${stage.id}"
        style="min-width:220px;flex:1;background:#f4f5f7;border-right:1px solid #e8eaed;
        display:flex;flex-direction:column;max-height:100%;"
        ondragover="crmDragOver(event)" ondragleave="crmDragLeave(event)" ondrop="crmDrop(event,'${stage.id}')">

        <!-- Col header -->
        <div style="padding:0.65rem 0.75rem;background:white;border-bottom:1px solid #e8eaed;
            border-top:3px solid ${stage.color};flex-shrink:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:0.78rem;font-weight:700;color:#374151;">${_esc(stage.label)}</span>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span style="font-size:0.68rem;color:#9ca3af;">${deals.length}</span>
                    <button onclick="crmOpenCreateDeal('${stage.id}')"
                        style="width:20px;height:20px;background:#f4f5f7;border:none;border-radius:4px;
                        cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;"
                        title="Додати угоду">${I.plus}</button>
                </div>
            </div>
            ${amt > 0 ? `<div style="font-size:0.68rem;color:#9ca3af;margin-top:2px;">${_fmt(amt)}</div>` : ''}
        </div>

        <!-- Cards -->
        <div style="flex:1;overflow-y:auto;padding:0.5rem;display:flex;flex-direction:column;gap:0.4rem;"
            id="crmCol_${stage.id}">
            ${deals.length ? deals.map(d => _dealCard(d)).join('') : `
            <div style="margin-top:0.5rem;border:2px dashed #dde1e7;border-radius:8px;
                padding:1.5rem 0.5rem;text-align:center;color:#c4c9d4;font-size:0.72rem;">
                Перетягни сюди
            </div>`}
        </div>
    </div>`;
}

function _kanbanColLost(stage) {
    const deals = crm.deals.filter(d => d.stage === 'lost');
    return `
    <div data-stage="lost"
        style="width:160px;flex-shrink:0;background:#fef2f2;border-left:1px solid #e8eaed;
        display:flex;flex-direction:column;max-height:100%;"
        ondragover="crmDragOver(event)" ondragleave="crmDragLeave(event)" ondrop="crmDrop(event,'lost')">
        <div style="padding:0.65rem 0.75rem;border-bottom:1px solid #fecaca;border-top:3px solid #ef4444;flex-shrink:0;">
            <span style="font-size:0.78rem;font-weight:700;color:#ef4444;">${_esc(stage.label)}</span>
            <span style="font-size:0.68rem;color:#fca5a5;margin-left:0.35rem;">${deals.length}</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:0.5rem;display:flex;flex-direction:column;gap:0.3rem;">
            ${deals.slice(0,8).map(d => `
            <div onclick="crmOpenDeal('${d.id}')"
                style="background:white;border-radius:6px;padding:0.4rem 0.5rem;cursor:pointer;
                border-left:2px solid #ef4444;font-size:0.72rem;color:#6b7280;
                overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                title="${_esc(d.clientName||d.title||'')}">
                ${_esc((d.clientName||d.title||'Угода').slice(0,24))}
            </div>`).join('')}
            ${deals.length > 8 ? `<div style="font-size:0.68rem;color:#fca5a5;text-align:center;padding:0.25rem;">+${deals.length-8}</div>` : ''}
        </div>
    </div>`;
}

function _dealCard(deal) {
    const colors  = ['#22c55e','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899'];
    const color   = colors[(deal.clientName||'a').charCodeAt(0) % colors.length];
    const initial = (deal.clientName || deal.title || '?').charAt(0).toUpperCase();
    const date    = deal.updatedAt?.toDate ? _relTime(deal.updatedAt.toDate()) : '';
    const srcIcon = { telegram: I.tg, instagram: I.ig, site_form: I.web, manual: I.user }[deal.source] || I.deal;

    return `
    <div draggable="true" data-deal-id="${deal.id}"
        ondragstart="crmDragStart(event,'${deal.id}')"
        onclick="crmOpenDeal('${deal.id}')"
        style="background:white;border-radius:7px;padding:0.65rem;cursor:pointer;
        border:1px solid #e8eaed;transition:box-shadow 0.15s,border-color 0.15s;"
        onmouseenter="this.style.boxShadow='0 2px 12px rgba(0,0,0,0.1)';this.style.borderColor='#c7d2fe'"
        onmouseleave="this.style.boxShadow='none';this.style.borderColor='#e8eaed'">

        <!-- Title -->
        <div style="font-size:0.8rem;font-weight:600;color:#1f2937;margin-bottom:0.45rem;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${_esc(deal.title || deal.clientName || 'Угода')}
        </div>

        <!-- Client row -->
        <div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.4rem;">
            <div style="width:18px;height:18px;border-radius:50%;background:${color};
                display:flex;align-items:center;justify-content:center;
                font-size:0.6rem;font-weight:700;color:white;flex-shrink:0;">${initial}</div>
            <span style="font-size:0.72rem;color:#6b7280;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${_esc(deal.clientName || '—')}
            </span>
            <span style="color:#9ca3af;">${srcIcon}</span>
        </div>

        ${deal.clientNiche ? `
        <div style="font-size:0.65rem;background:#f0fdf4;color:#16a34a;padding:1px 6px;
            border-radius:4px;display:inline-block;margin-bottom:0.4rem;font-weight:500;">
            ${_esc(deal.clientNiche)}
        </div>` : ''}

        <!-- Amount + date -->
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.78rem;font-weight:700;color:${deal.amount ? '#16a34a' : '#d1d5db'};">
                ${deal.amount ? _fmt(deal.amount) : '—'}
            </span>
            <span style="font-size:0.62rem;color:#d1d5db;">${date}</span>
        </div>
    </div>`;
}

// ── Drag & Drop ────────────────────────────────────────────
window.crmDragStart = function(e, dealId) {
    crm.dragDealId = dealId;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if(e.currentTarget) e.currentTarget.style.opacity = '0.4'; }, 0);
};
window.crmDragOver = function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const col = e.currentTarget;
    col.style.background = col.dataset.stage === 'lost' ? '#fee2e2' : '#eef2ff';
};
window.crmDragLeave = function(e) {
    const col = e.currentTarget;
    col.style.background = col.dataset.stage === 'lost' ? '#fef2f2' : '#f4f5f7';
};
window.crmDrop = async function(e, newStage) {
    e.preventDefault();
    const col = e.currentTarget;
    col.style.background = col.dataset.stage === 'lost' ? '#fef2f2' : '#f4f5f7';
    if (!crm.dragDealId) return;
    const deal = crm.deals.find(d => d.id === crm.dragDealId);
    crm.dragDealId = null;
    if (!deal || deal.stage === newStage) return;
    const oldStage = deal.stage;
    deal.stage = newStage;
    _renderKanban();
    try {
        const ref = firebase.firestore().doc(`companies/${window.currentCompanyId}/crm_deals/${deal.id}`);
        await ref.update({ stage: newStage, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        await ref.collection('history').add({
            type:'stage_changed', from:oldStage, to:newStage,
            by: window.currentUser?.email || 'manager',
            at: firebase.firestore.FieldValue.serverTimestamp(),
        });
        if (typeof emitTalkoEvent === 'function' && window.TALKO_EVENTS) {
            await emitTalkoEvent(window.TALKO_EVENTS.DEAL_STAGE_CHANGED, {
                dealId:deal.id, clientName:deal.clientName,
                fromStage:oldStage, toStage:newStage,
                pipelineId:deal.pipelineId, amount:deal.amount,
            });
        }
        if (typeof showToast === 'function') showToast(_stageLabel(newStage), 'success');
    } catch(err) {
        console.error('[CRM drop]', err);
        deal.stage = oldStage;
        _renderKanban();
    }
};

// ══════════════════════════════════════════════════════════
// КАРТКА УГОДИ
// ══════════════════════════════════════════════════════════
window.crmOpenDeal = function(dealId) {
    crm.activeDealId = dealId;
    const deal = crm.deals.find(d => d.id === dealId);
    if (!deal) return;
    document.getElementById('crmDealOverlay')?.remove();

    const stages = crm.pipeline?.stages || [];
    const inp = 'width:100%;padding:0.45rem 0.55rem;border:1px solid #e8eaed;border-radius:6px;font-size:0.82rem;box-sizing:border-box;font-family:inherit;background:white;';
    const lbl = 'font-size:0.68rem;font-weight:600;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:0.25rem;letter-spacing:0.03em;';

    document.body.insertAdjacentHTML('beforeend', `
    <div id="crmDealOverlay" onclick="if(event.target===this)crmCloseDeal()"
        style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:10020;
        display:flex;align-items:stretch;justify-content:flex-end;">
        <div style="background:white;width:100%;max-width:520px;display:flex;flex-direction:column;
            box-shadow:-8px 0 32px rgba(0,0,0,0.12);">

            <!-- Header -->
            <div style="padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;
                display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <div>
                    <div style="font-weight:700;font-size:0.95rem;color:#111827;">
                        ${_esc(deal.title || deal.clientName || 'Угода')}
                    </div>
                    <div style="font-size:0.72rem;color:#9ca3af;margin-top:2px;">
                        ${_esc(deal.clientName || '')}
                        ${deal.clientNiche ? ` · ${_esc(deal.clientNiche)}` : ''}
                    </div>
                </div>
                <div style="display:flex;gap:0.4rem;align-items:center;">
                    <button onclick="crmDeleteDeal('${deal.id}')"
                        style="padding:0.35rem;background:none;border:1px solid #e8eaed;border-radius:6px;
                        cursor:pointer;color:#9ca3af;display:flex;align-items:center;"
                        title="Видалити">${I.trash}</button>
                    <button onclick="crmCloseDeal()"
                        style="padding:0.35rem;background:none;border:1px solid #e8eaed;border-radius:6px;
                        cursor:pointer;color:#9ca3af;display:flex;align-items:center;">${I.close}</button>
                </div>
            </div>

            <!-- Sub-tabs -->
            <div style="display:flex;border-bottom:1px solid #f1f5f9;flex-shrink:0;">
                ${[['details','Деталі'],['activity','Активності'],['ai','AI']].map(([id,label]) => `
                <button onclick="crmDealTab('${deal.id}','${id}')" id="cdt_${id}"
                    style="flex:1;padding:0.6rem;background:none;border:none;border-bottom:2px solid transparent;
                    cursor:pointer;font-size:0.8rem;font-weight:500;color:#6b7280;transition:all 0.15s;">
                    ${label}
                </button>`).join('')}
            </div>

            <!-- Content -->
            <div id="crmDealContent" style="flex:1;overflow-y:auto;padding:1.25rem;"></div>

            <!-- Footer -->
            <div style="padding:0.75rem 1.25rem;border-top:1px solid #f1f5f9;flex-shrink:0;
                display:flex;gap:0.5rem;justify-content:flex-end;">
                <button onclick="crmSaveDeal('${deal.id}')"
                    style="padding:0.5rem 1.25rem;background:#22c55e;color:white;border:none;
                    border-radius:7px;cursor:pointer;font-weight:600;font-size:0.82rem;">
                    Зберегти
                </button>
            </div>
        </div>
    </div>`);

    crmDealTab(deal.id, 'details');
};

window.crmDealTab = function(dealId, tab) {
    const deal = crm.deals.find(d => d.id === dealId);
    if (!deal) return;
    ['details','activity','ai'].forEach(t => {
        const btn = document.getElementById('cdt_' + t);
        if (btn) {
            btn.style.borderBottomColor = t === tab ? '#22c55e' : 'transparent';
            btn.style.color = t === tab ? '#22c55e' : '#6b7280';
            btn.style.fontWeight = t === tab ? '600' : '500';
        }
    });
    if (tab === 'details')  _renderDealDetails(deal);
    if (tab === 'activity') _loadActivityTab(deal);
    if (tab === 'ai')       _loadAITab(deal);
};

function _renderDealDetails(deal) {
    const content = document.getElementById('crmDealContent');
    if (!content) return;
    const stages = crm.pipeline?.stages || [];
    const inp = 'width:100%;padding:0.45rem 0.55rem;border:1px solid #e8eaed;border-radius:6px;font-size:0.82rem;box-sizing:border-box;font-family:inherit;';
    const lbl = 'font-size:0.68rem;font-weight:600;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:0.25rem;letter-spacing:0.03em;';
    const row = 'margin-bottom:0.9rem;';

    content.innerHTML = `
    <div style="${row}">
        <label style="${lbl}">Назва угоди</label>
        <input id="dd_title" value="${_esc(deal.title||deal.clientName||'')}" style="${inp}">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.9rem;">
        <div>
            <label style="${lbl}">Стадія</label>
            <select id="dd_stage" style="${inp}background:white;cursor:pointer;">
                ${stages.map(s => `<option value="${s.id}" ${s.id===deal.stage?'selected':''}>${_esc(s.label)}</option>`).join('')}
            </select>
        </div>
        <div>
            <label style="${lbl}">Сума</label>
            <input id="dd_amount" type="number" value="${deal.amount||''}" placeholder="0" style="${inp}">
        </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.9rem;">
        <div>
            <label style="${lbl}">Клієнт</label>
            <input id="dd_client" value="${_esc(deal.clientName||'')}" style="${inp}">
        </div>
        <div>
            <label style="${lbl}">Ніша</label>
            <input id="dd_niche" value="${_esc(deal.clientNiche||'')}" style="${inp}">
        </div>
    </div>
    <div style="${row}">
        <label style="${lbl}">Дедлайн</label>
        <input id="dd_close" type="date" value="${deal.expectedClose||''}" style="${inp}">
    </div>
    <div style="${row}">
        <label style="${lbl}">Нотатка</label>
        <textarea id="dd_note" rows="3" style="${inp}resize:vertical;">${_esc(deal.note||'')}</textarea>
    </div>
    ${deal.leadData && Object.keys(deal.leadData).some(k => deal.leadData[k]) ? `
    <div style="background:#f8fafc;border-radius:8px;padding:0.75rem;border:1px solid #e8eaed;">
        <div style="font-size:0.68rem;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:0.5rem;">Дані з боту</div>
        ${[['Роль','role'],['Проблема','mainProblem'],['Ціль','mainGoal']].map(([l,k]) =>
            deal.leadData[k] ? `<div style="font-size:0.78rem;margin-bottom:0.25rem;"><span style="color:#9ca3af;">${l}: </span>${_esc(deal.leadData[k])}</div>` : ''
        ).join('')}
    </div>` : ''}`;
}

window.crmCloseDeal = function() {
    document.getElementById('crmDealOverlay')?.remove();
    crm.activeDealId = null;
};

window.crmSaveDeal = async function(dealId) {
    const deal = crm.deals.find(d => d.id === dealId);
    if (!deal) return;
    const title  = document.getElementById('dd_title')?.value.trim();
    const stage  = document.getElementById('dd_stage')?.value;
    const amount = parseFloat(document.getElementById('dd_amount')?.value) || 0;
    const client = document.getElementById('dd_client')?.value.trim();
    const niche  = document.getElementById('dd_niche')?.value.trim();
    const note   = document.getElementById('dd_note')?.value.trim();
    const expClose = document.getElementById('dd_close')?.value || null;

    try {
        const updates = { title:title||deal.title, stage:stage||deal.stage, amount, clientName:client||deal.clientName, clientNiche:niche, note, expectedClose:expClose||null, updatedAt:firebase.firestore.FieldValue.serverTimestamp() };
        await firebase.firestore().doc(`companies/${window.currentCompanyId}/crm_deals/${dealId}`).update(updates);
        if (stage !== deal.stage && typeof emitTalkoEvent === 'function' && window.TALKO_EVENTS) {
            await emitTalkoEvent(window.TALKO_EVENTS.DEAL_STAGE_CHANGED, { dealId, fromStage:deal.stage, toStage:stage, clientName:deal.clientName, amount });
        }
        Object.assign(deal, updates);
        crmCloseDeal();
        if (typeof showToast === 'function') showToast('Збережено', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

window.crmDeleteDeal = async function(dealId) {
    if (!confirm('Видалити угоду?')) return;
    try {
        await firebase.firestore().doc(`companies/${window.currentCompanyId}/crm_deals/${dealId}`).delete();
        crmCloseDeal();
        if (typeof showToast === 'function') showToast('Видалено', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ── Активності ─────────────────────────────────────────────
async function _loadActivityTab(deal) {
    const content = document.getElementById('crmDealContent');
    if (!content) return;
    content.innerHTML = '<div style="text-align:center;padding:1.5rem;color:#9ca3af;font-size:0.82rem;">Завантаження...</div>';
    try {
        const snap = await firebase.firestore()
            .collection(`companies/${window.currentCompanyId}/crm_deals/${deal.id}/history`)
            .orderBy('at','desc').limit(30).get();
        const events = snap.docs.map(d => ({ id:d.id, ...d.data() }));

        const actIcons = { stage_changed:I.arrow, note:I.note, call:I.call, meeting:I.meet, email:I.mail, created:I.check };

        content.innerHTML = `
        <!-- Add activity -->
        <div style="background:#f8fafc;border-radius:8px;padding:0.75rem;margin-bottom:1rem;border:1px solid #e8eaed;">
            <div style="display:flex;gap:0.4rem;">
                <select id="actType" style="padding:0.4rem;border:1px solid #e8eaed;border-radius:6px;font-size:0.78rem;background:white;">
                    <option value="note">Нотатка</option>
                    <option value="call">Дзвінок</option>
                    <option value="meeting">Зустріч</option>
                    <option value="email">Email</option>
                </select>
                <input id="actText" placeholder="Опис дії..."
                    onkeydown="if(event.key==='Enter')crmAddActivity('${deal.id}')"
                    style="flex:1;padding:0.4rem 0.5rem;border:1px solid #e8eaed;border-radius:6px;font-size:0.78rem;">
                <button onclick="crmAddActivity('${deal.id}')"
                    style="padding:0.4rem 0.65rem;background:#22c55e;color:white;border:none;
                    border-radius:6px;cursor:pointer;font-size:0.78rem;display:flex;align-items:center;">
                    ${I.plus}
                </button>
            </div>
        </div>

        <!-- Timeline -->
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${events.length === 0 ? '<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:0.8rem;">Активностей ще немає</div>' :
            events.map(ev => {
                const icon = actIcons[ev.type] || I.note;
                const time = ev.at?.toDate ? ev.at.toDate().toLocaleString('uk-UA',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
                let text = ev.text || '';
                if (ev.type === 'stage_changed') text = _stageLabel(ev.from) + ' → ' + _stageLabel(ev.to);
                if (ev.type === 'created') text = 'Угоду створено';
                return `
                <div style="display:flex;gap:0.65rem;align-items:flex-start;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#f0fdf4;
                        display:flex;align-items:center;justify-content:center;color:#22c55e;flex-shrink:0;">
                        ${icon}
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:0.8rem;color:#374151;">${_esc(text)}</div>
                        <div style="font-size:0.68rem;color:#9ca3af;margin-top:2px;">${_esc(ev.by||'')} · ${time}</div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    } catch(e) {
        if (content) content.innerHTML = `<div style="color:#ef4444;padding:1rem;font-size:0.8rem;">Помилка: ${_esc(e.message)}</div>`;
    }
}

window.crmAddActivity = async function(dealId) {
    const type   = document.getElementById('actType')?.value || 'note';
    const textEl = document.getElementById('actText');
    const text   = textEl?.value.trim();
    if (!text) return;
    if (textEl) textEl.value = '';
    try {
        await firebase.firestore()
            .collection(`companies/${window.currentCompanyId}/crm_deals/${dealId}/history`)
            .add({ type, text, by: window.currentUser?.email||'manager', at: firebase.firestore.FieldValue.serverTimestamp() });
        const deal = crm.deals.find(d => d.id === dealId);
        if (deal) _loadActivityTab(deal);
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ── AI Аналіз ──────────────────────────────────────────────
async function _loadAITab(deal) {
    const content = document.getElementById('crmDealContent');
    if (!content) return;

    if (deal.aiAnalysis) {
        content.innerHTML = `
        <div style="background:#f0fdf4;border-radius:8px;padding:1rem;border:1px solid #bbf7d0;margin-bottom:0.75rem;">
            <div style="font-size:0.68rem;font-weight:700;color:#16a34a;text-transform:uppercase;margin-bottom:0.5rem;letter-spacing:0.04em;">
                AI Аналіз угоди
            </div>
            <div style="font-size:0.82rem;color:#374151;line-height:1.6;white-space:pre-wrap;">${_esc(deal.aiAnalysis)}</div>
        </div>
        <button onclick="crmRunAI('${deal.id}')"
            style="width:100%;padding:0.5rem;background:white;color:#22c55e;
            border:1px solid #bbf7d0;border-radius:7px;cursor:pointer;font-size:0.8rem;font-weight:600;">
            Оновити аналіз
        </button>`;
        return;
    }

    content.innerHTML = `
    <div style="text-align:center;padding:2rem 1rem;">
        <div style="width:48px;height:48px;background:#f0fdf4;border-radius:12px;
            margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;color:#22c55e;">
            ${I.ai}
        </div>
        <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.35rem;">AI Аналіз угоди</div>
        <div style="font-size:0.78rem;color:#6b7280;margin-bottom:1.25rem;">
            Ймовірність закриття, ризики, наступний крок
        </div>
        <button onclick="crmRunAI('${deal.id}')"
            style="padding:0.6rem 1.5rem;background:#22c55e;color:white;border:none;
            border-radius:8px;cursor:pointer;font-weight:600;font-size:0.84rem;">
            Запустити аналіз
        </button>
    </div>`;
}

window.crmRunAI = async function(dealId) {
    const deal    = crm.deals.find(d => d.id === dealId);
    if (!deal) return;
    const content = document.getElementById('crmDealContent');
    if (content) content.innerHTML = '<div style="text-align:center;padding:2rem;color:#6b7280;font-size:0.82rem;">Аналізую угоду...</div>';
    try {
        const compDoc  = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
        const apiKey   = compDoc.data()?.anthropicApiKey || compDoc.data()?.openaiApiKey;
        if (!apiKey) {
            if (content) content.innerHTML = '<div style="color:#ef4444;padding:1rem;text-align:center;font-size:0.82rem;">API ключ не встановлений</div>';
            return;
        }
        const prompt = `Ти CRM аналітик. Проаналізуй угоду:\nКлієнт: ${deal.clientName||'—'}\nНіша: ${deal.clientNiche||'—'}\nСтадія: ${_stageLabel(deal.stage)}\nСума: ${deal.amount ? _fmt(deal.amount) : 'не вказана'}\n${deal.leadData?.mainProblem ? 'Проблема: ' + deal.leadData.mainProblem + '\n' : ''}${deal.leadData?.mainGoal ? 'Ціль: ' + deal.leadData.mainGoal + '\n' : ''}Нотатка: ${deal.note||'—'}\n\nДай: 1) Ймовірність закриття % 2) Ключовий ризик 3) Наступний конкретний крок 4) Рекомендований текст повідомлення\nВідповідь: лаконічно, 150-200 слів, українською.`;
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:600, messages:[{role:'user',content:prompt}] }),
        });
        const data     = await response.json();
        const analysis = data.content?.[0]?.text || 'Не вдалось отримати аналіз';
        await firebase.firestore().doc(`companies/${window.currentCompanyId}/crm_deals/${dealId}`)
            .update({ aiAnalysis:analysis, aiAnalyzedAt:firebase.firestore.FieldValue.serverTimestamp() });
        deal.aiAnalysis = analysis;
        _loadAITab(deal);
    } catch(e) {
        if (content) content.innerHTML = `<div style="color:#ef4444;padding:1rem;font-size:0.8rem;">Помилка: ${_esc(e.message)}</div>`;
    }
};

// ══════════════════════════════════════════════════════════
// СТВОРЕННЯ УГОДИ
// ══════════════════════════════════════════════════════════
window.crmOpenCreateDeal = function(defaultStage) {
    document.getElementById('crmCreateDealOverlay')?.remove();
    const stages = crm.pipeline?.stages || [];
    const inp = 'width:100%;padding:0.45rem 0.55rem;border:1px solid #e8eaed;border-radius:6px;font-size:0.82rem;box-sizing:border-box;font-family:inherit;';
    const lbl = 'font-size:0.68rem;font-weight:600;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:0.25rem;';

    document.body.insertAdjacentHTML('beforeend', `
    <div id="crmCreateDealOverlay" onclick="if(event.target===this)this.remove()"
        style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:10025;
        display:flex;align-items:center;justify-content:center;padding:1rem;">
        <div style="background:white;border-radius:10px;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
            <div style="padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;
                display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:0.9rem;color:#111827;">Нова угода</span>
                <button onclick="document.getElementById('crmCreateDealOverlay').remove()"
                    style="background:none;border:none;cursor:pointer;color:#9ca3af;
                    display:flex;align-items:center;">${I.close}</button>
            </div>
            <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                <div>
                    <label style="${lbl}">Назва угоди</label>
                    <input id="nd_title" placeholder="Консультація, Проект..." style="${inp}" autofocus>
                </div>
                <div>
                    <label style="${lbl}">Клієнт</label>
                    <input id="nd_client" placeholder="Ім'я або компанія..." style="${inp}">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                    <div>
                        <label style="${lbl}">Стадія</label>
                        <select id="nd_stage" style="${inp}background:white;cursor:pointer;">
                            ${stages.map(s => `<option value="${s.id}" ${(defaultStage||'new')===s.id?'selected':''}>${_esc(s.label)}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="${lbl}">Сума</label>
                        <input id="nd_amount" type="number" placeholder="0" style="${inp}">
                    </div>
                </div>
                <div>
                    <label style="${lbl}">Ніша</label>
                    <input id="nd_niche" placeholder="Стоматологія, Будівництво..." style="${inp}">
                </div>
            </div>
            <div style="padding:0.75rem 1.25rem;border-top:1px solid #f1f5f9;display:flex;justify-content:flex-end;gap:0.4rem;">
                <button onclick="document.getElementById('crmCreateDealOverlay').remove()"
                    style="padding:0.45rem 1rem;background:white;border:1px solid #e8eaed;
                    border-radius:6px;cursor:pointer;font-size:0.82rem;color:#374151;">
                    Скасувати
                </button>
                <button onclick="crmCreateDeal()"
                    style="padding:0.45rem 1.25rem;background:#22c55e;color:white;border:none;
                    border-radius:6px;cursor:pointer;font-weight:600;font-size:0.82rem;">
                    Створити
                </button>
            </div>
        </div>
    </div>`);
    document.getElementById('nd_title')?.focus();
};

window.crmCreateDeal = async function() {
    const title  = document.getElementById('nd_title')?.value.trim();
    const client = document.getElementById('nd_client')?.value.trim();
    const stage  = document.getElementById('nd_stage')?.value || 'new';
    const amount = parseFloat(document.getElementById('nd_amount')?.value) || 0;
    const niche  = document.getElementById('nd_niche')?.value.trim();
    if (!title && !client) { alert("Введіть назву або ім'я клієнта"); return; }
    try {
        const ref = await firebase.firestore()
            .collection(`companies/${window.currentCompanyId}/crm_deals`).add({
                title: title||client, clientName: client||title, clientNiche: niche||'',
                stage, pipelineId: crm.pipeline?.id || '',
                amount, source:'manual',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        await ref.collection('history').add({ type:'created', by: window.currentUser?.email||'manager', at: firebase.firestore.FieldValue.serverTimestamp() });
        document.getElementById('crmCreateDealOverlay')?.remove();
        if (typeof showToast === 'function') showToast('Угоду створено', 'success');
        if (typeof emitTalkoEvent === 'function' && window.TALKO_EVENTS) {
            emitTalkoEvent(window.TALKO_EVENTS.DEAL_CREATED, { dealId:ref.id, clientName:client||title, stage, amount });
        }
    } catch(e) { alert('Помилка: ' + e.message); }
};

// ══════════════════════════════════════════════════════════
// КЛІЄНТИ
// ══════════════════════════════════════════════════════════
function _renderClients() {
    const c = document.getElementById('crmViewClients');
    if (!c) return;
    c.innerHTML = `
    <div style="max-width:640px;margin:0 auto;">
        <div style="margin-bottom:0.75rem;">
            <input id="crmClientSearch" type="text" placeholder="Пошук клієнта..."
                oninput="crmFilterClients(this.value)"
                style="width:100%;padding:0.5rem 0.75rem;border:1px solid #e8eaed;
                border-radius:8px;font-size:0.82rem;box-sizing:border-box;background:white;">
        </div>
        <div id="crmClientList">${_clientListHTML(crm.clients)}</div>
    </div>`;
}

window.crmFilterClients = function(q) {
    const list = document.getElementById('crmClientList');
    if (!list) return;
    const filtered = q ? crm.clients.filter(c =>
        (c.name||'').toLowerCase().includes(q.toLowerCase()) || (c.phone||'').includes(q)
    ) : crm.clients;
    list.innerHTML = _clientListHTML(filtered);
};

function _clientListHTML(clients) {
    if (!clients.length) return '<div style="text-align:center;padding:3rem;color:#9ca3af;font-size:0.82rem;">Клієнтів не знайдено</div>';
    const colors = ['#22c55e','#3b82f6','#8b5cf6','#f59e0b'];
    return clients.map(cl => {
        const deals = crm.deals.filter(d => d.clientId===cl.id || d.clientName===cl.name).length;
        const color = colors[(cl.name||'').charCodeAt(0) % 4];
        return `
        <div style="background:white;border-radius:8px;padding:0.75rem;
            border:1px solid #e8eaed;margin-bottom:0.4rem;display:flex;align-items:center;gap:0.65rem;">
            <div style="width:36px;height:36px;border-radius:50%;background:${color};
                display:flex;align-items:center;justify-content:center;
                font-weight:700;color:white;font-size:0.88rem;flex-shrink:0;">
                ${(cl.name||'?').charAt(0).toUpperCase()}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:0.85rem;color:#111827;">${_esc(cl.name||'Без імені')}</div>
                <div style="font-size:0.72rem;color:#9ca3af;">
                    ${cl.phone ? _esc(cl.phone) + ' · ' : ''}${cl.niche ? _esc(cl.niche) : '—'}
                </div>
            </div>
            ${deals > 0 ? `<span style="background:#f0fdf4;color:#16a34a;font-size:0.7rem;
                padding:2px 8px;border-radius:12px;font-weight:600;">${deals} угод</span>` : ''}
        </div>`;
    }).join('');
}

// ══════════════════════════════════════════════════════════
// АНАЛІТИКА
// ══════════════════════════════════════════════════════════
function _renderAnalytics() {
    const c = document.getElementById('crmViewAnalytics');
    if (!c) return;
    const stages   = crm.pipeline?.stages || [];
    const total    = crm.deals.length;
    const won      = crm.deals.filter(d => d.stage==='won').length;
    const lost     = crm.deals.filter(d => d.stage==='lost').length;
    const revenue  = crm.deals.filter(d => d.stage==='won').reduce((s,d) => s+(d.amount||0), 0);
    const avgDeal  = won > 0 ? Math.round(revenue/won) : 0;
    const conv     = total > 0 ? Math.round(won/total*100) : 0;

    const kpis = [
        ['Конверсія', conv+'%', '#22c55e'],
        ['Revenue', _fmt(revenue), '#16a34a'],
        ['Avg Deal', _fmt(avgDeal), '#3b82f6'],
        ['Програно', lost, '#ef4444'],
    ];
    const byStage = stages.map(s => ({
        ...s,
        count: crm.deals.filter(d => d.stage===s.id).length,
        amount: crm.deals.filter(d => d.stage===s.id).reduce((sm,d) => sm+(d.amount||0), 0),
    }));
    const sources = crm.deals.reduce((acc, d) => {
        const src = d.source||'manual'; acc[src]=(acc[src]||0)+1; return acc;
    }, {});
    const srcIcons = { telegram:I.tg, instagram:I.ig, site_form:I.web, manual:I.user };

    c.innerHTML = `
    <div style="max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:0.75rem;">
        <!-- KPI cards -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
            ${kpis.map(([l,v,col]) => `
            <div style="background:white;border-radius:8px;padding:0.9rem;border:1px solid #e8eaed;border-top:3px solid ${col};">
                <div style="font-size:1.2rem;font-weight:700;color:${col};">${v}</div>
                <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">${l}</div>
            </div>`).join('')}
        </div>

        <!-- By stage -->
        <div style="background:white;border-radius:8px;padding:1rem;border:1px solid #e8eaed;">
            <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.75rem;color:#111827;">Розподіл по стадіях</div>
            ${byStage.filter(s => s.count > 0).map(s => {
                const pct = total > 0 ? Math.round(s.count/total*100) : 0;
                return `
                <div style="margin-bottom:0.6rem;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                        <span style="font-size:0.78rem;font-weight:500;color:#374151;">${_esc(s.label)}</span>
                        <span style="font-size:0.72rem;color:#9ca3af;">${s.count} · ${_fmt(s.amount)}</span>
                    </div>
                    <div style="background:#f1f5f9;border-radius:3px;height:6px;overflow:hidden;">
                        <div style="height:100%;background:${s.color};width:${pct}%;border-radius:3px;transition:width 0.3s;"></div>
                    </div>
                </div>`;
            }).join('')}
        </div>

        <!-- Sources -->
        <div style="background:white;border-radius:8px;padding:1rem;border:1px solid #e8eaed;">
            <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.75rem;color:#111827;">Джерела лідів</div>
            ${Object.keys(sources).length ? Object.entries(sources).map(([src, cnt]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;
                padding:0.4rem 0;border-bottom:1px solid #f9fafb;">
                <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:#374151;">
                    ${srcIcons[src] || I.deal}
                    ${{ telegram:'Telegram', instagram:'Instagram', site_form:'Сайт', manual:'Вручну' }[src] || src}
                </div>
                <span style="font-weight:700;font-size:0.82rem;color:#22c55e;">${cnt}</span>
            </div>`).join('') : '<div style="color:#9ca3af;font-size:0.8rem;">Немає даних</div>'}
        </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════
function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function _fmt(n) {
    const num = parseFloat(n) || 0;
    if (!num) return '0';
    if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num/1000).toFixed(0) + 'k';
    return num.toLocaleString('uk-UA');
}
function _relTime(d) {
    const diff = Date.now() - d.getTime(), m = Math.floor(diff/60000);
    if (m < 1)  return 'щойно';
    if (m < 60) return m + 'хв';
    const h = Math.floor(m/60);
    if (h < 24) return h + 'год';
    return Math.floor(h/24) + 'дн';
}
function _stageLabel(id) {
    return crm.pipeline?.stages?.find(s => s.id === id)?.label || id;
}

// ── switchTab hook ─────────────────────────────────────────
const _origST = window.switchTab;
window.switchTab = function(tab) {
    if (_origST) _origST(tab);
    if (tab === 'crm') {
        if (!crm.pipeline) window.initCRMModule();
        else if (crm.subTab === 'kanban') _renderKanban();
    }
};

})();
