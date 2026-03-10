// ============================================================
// 77-crm.js — TALKO CRM v2.0
// Колекції: crm_deals, crm_clients, crm_pipeline, crm_activities, crm_stats
// Event Bus інтеграція для автоматичного створення угод з ботів
// Kanban з Drag&Drop, картка угоди, AI Summary, активності
// ============================================================
(function () {
'use strict';

// ── State ──────────────────────────────────────────────────
let crm = {
    deals:     [],
    clients:   [],
    pipeline:  null,
    pipelines: [],
    stats:     null,
    unsubs:    [],
    subTab:    'kanban',
    activeDealId: null,
    dragDealId:   null,
    loading:   true,
};

// ── Init ───────────────────────────────────────────────────
window.initCRMModule = async function () {
    if (!window.currentCompanyId) return;
    _renderShell();
    try {
        await _loadAll();
    } catch(e) {
        console.error('[CRM] loadAll error:', e.message);
        const c = document.getElementById('crmViewKanban');
        if (c) c.innerHTML = '<div style="padding:1.5rem;text-align:center;color:#ef4444;font-size:0.82rem;">' +
            'Помилка завантаження CRM: ' + e.message + '<br>' +
            '<button onclick="window.initCRMModule()" style="margin-top:0.5rem;padding:0.4rem 0.8rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;">Повторити</button>' +
            '</div>';
        crm.loading = false;
        return;
    }
    _listenEventBus();
};

function _renderShell() {
    const container = document.getElementById('crmContainer');
    if (!container) return;
    container.innerHTML = `
    <div style="padding:0.75rem;">
        <div style="display:flex;gap:0.3rem;margin-bottom:0.75rem;background:white;
            border-radius:12px;padding:0.3rem;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            ${[
                ['kanban',    'Воронка',   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'],
                ['clients',   'Клієнти',   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'],
                ['analytics', 'Аналітика', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'],
            ].map(([id, label, icon]) => `
                <button id="crmTab_${id}" onclick="crmSwitch('${id}')"
                    style="flex:1;padding:0.42rem 0.5rem;border:none;border-radius:8px;cursor:pointer;
                    font-size:0.78rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:4px;
                    background:${id==='kanban'?'#22c55e':'transparent'};
                    color:${id==='kanban'?'white':'#525252'};transition:all 0.2s;">
                    ${icon} ${label}
                </button>`).join('')}
        </div>
        <div id="crmViewKanban"></div>
        <div id="crmViewClients" style="display:none;"></div>
        <div id="crmViewAnalytics" style="display:none;"></div>
    </div>`;
}

window.crmSwitch = function(tab) {
    crm.subTab = tab;
    ['kanban','clients','analytics'].forEach(t => {
        const btn  = document.getElementById('crmTab_' + t);
        const view = document.getElementById('crmView' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn)  { btn.style.background = t===tab?'#22c55e':'transparent'; btn.style.color = t===tab?'white':'#525252'; }
        if (view) view.style.display = t===tab ? '' : 'none';
    });
    if (tab==='kanban')    _renderKanban();
    if (tab==='clients')   _renderClients();
    if (tab==='analytics') _renderAnalytics();
};

// ── Завантаження ───────────────────────────────────────────
async function _loadAll() {
    const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
    crm.unsubs.forEach(u => u && u());
    crm.unsubs = [];

    const pipSnap = await base.collection('crm_pipeline').get(); // no orderBy — index may not exist yet
    crm.pipelines = pipSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (crm.pipelines.length === 0) await _createDefaultPipeline();
    crm.pipeline = crm.pipelines.find(p => p.isDefault) || crm.pipelines[0];

    const dealUnsub = base.collection('crm_deals')
        .where('pipelineId', '==', crm.pipeline.id)
        .limit(200)
        .onSnapshot(snap => {
            crm.deals = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                .sort((a,b) => (b.createdAt?.toMillis?.()??0) - (a.createdAt?.toMillis?.()??0));
            crm.loading = false;
            if (crm.subTab === 'kanban') _renderKanban();
            _updateNavBadge();
        });
    crm.unsubs.push(dealUnsub);

    const clientSnap = await base.collection('crm_clients')
        .limit(100).get();
    crm.clients = clientSnap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function _createDefaultPipeline() {
    const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
    const stages = [
        { id: 'new',         label: 'Новий лід',  color: '#6b7280', order: 0 },
        { id: 'contact',     label: 'Контакт',    color: '#3b82f6', order: 1 },
        { id: 'negotiation', label: 'Переговори', color: '#f97316', order: 2 },
        { id: 'proposal',    label: 'Пропозиція', color: '#8b5cf6', order: 3 },
        { id: 'closing',     label: 'Закриття',   color: '#f59e0b', order: 4 },
        { id: 'won',         label: 'Виграно',    color: '#22c55e', order: 5 },
        { id: 'lost',        label: 'Програно',   color: '#ef4444', order: 6 },
    ];
    const ref = await base.collection('crm_pipeline').add({
        name: 'Основна воронка', isDefault: true, stages,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    crm.pipelines = [{ id: ref.id, name: 'Основна воронка', isDefault: true, stages }];
    crm.pipeline  = crm.pipelines[0];
}

function _updateNavBadge() {
    const badge = document.getElementById('crmNavBadge');
    if (!badge) return;
    const n = crm.deals.filter(d => d.stage === 'new').length;
    badge.textContent = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
}

function _listenEventBus() {
    if (typeof onTalkoEvent !== 'function') return;
    onTalkoEvent(window.TALKO_EVENTS && window.TALKO_EVENTS.DEAL_CREATED, function() {
        if (typeof showToast === 'function') showToast('Новий лід у CRM', 'success');
    });
}

// ══════════════════════════════════════════════════════════
// KANBAN
// ══════════════════════════════════════════════════════════
function _renderKanban() {
    const c = document.getElementById('crmViewKanban');
    if (!c) return;

    if (crm.loading) {
        c.innerHTML = '<div style="text-align:center;padding:3rem;color:#9ca3af;">Завантаження...</div>';
        return;
    }

    const stages   = (crm.pipeline && crm.pipeline.stages ? [...crm.pipeline.stages] : []).sort(function(a,b){ return a.order-b.order; });
    const visStages = stages.filter(function(s){ return s.id !== 'lost'; });
    const lostStage = stages.find(function(s){ return s.id === 'lost'; });

    const total   = crm.deals.length;
    const won     = crm.deals.filter(function(d){ return d.stage==='won'; }).length;
    const active  = crm.deals.filter(function(d){ return d.stage!=='won' && d.stage!=='lost'; }).length;
    const revenue = crm.deals.filter(function(d){ return d.stage==='won'; }).reduce(function(s,d){ return s+(d.amount||0); }, 0);
    const pipeline = crm.deals.filter(function(d){ return d.stage!=='won' && d.stage!=='lost'; }).reduce(function(s,d){ return s+(d.amount||0); }, 0);

    var headerCards = [
        ['Всього угод', total,         '#374151', '📋'],
        ['Активних',   active,         '#3b82f6', '🔄'],
        ['Виграно',    won,            '#22c55e', '🏆'],
        ['Revenue',    _fmt(revenue),  '#16a34a', '💰'],
        ['Pipeline',   _fmt(pipeline), '#8b5cf6', '📈'],
    ];

    c.innerHTML =
        '<div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap;">' +
        headerCards.map(function(item){
            return '<div style="flex:1;min-width:90px;background:white;border-radius:12px;' +
                'padding:0.6rem 0.75rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);border-top:3px solid ' + item[2] + ';">' +
                '<div style="font-size:0.95rem;font-weight:700;color:' + item[2] + ';">' + item[3] + ' ' + item[1] + '</div>' +
                '<div style="font-size:0.67rem;color:#9ca3af;margin-top:1px;">' + item[0] + '</div>' +
                '</div>';
        }).join('') +
        '<button onclick="crmOpenCreateDeal()" style="padding:0.6rem 1rem;background:#22c55e;color:white;' +
        'border:none;border-radius:12px;cursor:pointer;font-weight:700;font-size:0.82rem;white-space:nowrap;">' +
        '+ Угода</button>' +
        '</div>' +
        '<div style="overflow-x:auto;padding-bottom:0.5rem;">' +
        '<div style="display:flex;gap:0.6rem;min-width:max-content;align-items:flex-start;">' +
        visStages.map(function(stage){ return _kanbanCol(stage); }).join('') +
        _kanbanColLost(lostStage) +
        '</div></div>';
}

function _kanbanCol(stage) {
    var deals = crm.deals.filter(function(d){ return d.stage === stage.id; });
    var amt   = deals.reduce(function(s,d){ return s+(d.amount||0); }, 0);

    return '<div data-stage="' + stage.id + '" ' +
        'style="width:230px;background:#f8fafc;border-radius:14px;padding:0.65rem;' +
        'min-height:150px;flex-shrink:0;border-top:3px solid ' + stage.color + ';" ' +
        'ondragover="crmDragOver(event)" ondragleave="crmDragLeave(event)" ondrop="crmDrop(event,\'' + stage.id + '\')">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">' +
        '<div>' +
        '<div style="font-weight:700;font-size:0.82rem;color:#1a1a1a;">' + _esc(stage.label) + '</div>' +
        '<div style="font-size:0.68rem;color:#9ca3af;">' + deals.length + ' угод' + (amt > 0 ? ' · ' + _fmt(amt) : '') + '</div>' +
        '</div>' +
        '<button onclick="crmOpenCreateDeal(\'' + stage.id + '\')" ' +
        'style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:2px;font-size:1rem;">+</button>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:0.45rem;" id="crmCol_' + stage.id + '">' +
        (deals.length > 0 ? deals.map(function(d){ return _dealCard(d); }).join('') :
            '<div style="text-align:center;padding:1.5rem 0.5rem;color:#d1d5db;font-size:0.74rem;' +
            'border:2px dashed #e5e7eb;border-radius:10px;">Перетягни сюди</div>') +
        '</div></div>';
}

function _kanbanColLost(stage) {
    if (!stage) return '';
    var deals = crm.deals.filter(function(d){ return d.stage === 'lost'; });
    return '<div data-stage="lost" ' +
        'style="width:150px;background:#fff5f5;border-radius:14px;padding:0.65rem;' +
        'min-height:80px;flex-shrink:0;border-top:3px solid #ef4444;opacity:0.85;" ' +
        'ondragover="crmDragOver(event)" ondragleave="crmDragLeave(event)" ondrop="crmDrop(event,\'lost\')">' +
        '<div style="font-weight:700;font-size:0.78rem;color:#ef4444;margin-bottom:0.4rem;">' +
        'x Програно (' + deals.length + ')</div>' +
        '<div style="display:flex;flex-direction:column;gap:0.35rem;">' +
        deals.slice(0,5).map(function(d){
            return '<div onclick="crmOpenDeal(\'' + d.id + '\')" ' +
                'style="background:white;border-radius:8px;padding:0.45rem 0.5rem;cursor:pointer;' +
                'font-size:0.72rem;color:#6b7280;border-left:3px solid #ef4444;">' +
                _esc((d.clientName||d.title||'').slice(0,22)) + '</div>';
        }).join('') +
        (deals.length > 5 ? '<div style="font-size:0.68rem;color:#9ca3af;text-align:center;">+' + (deals.length-5) + ' ще</div>' : '') +
        '</div></div>';
}

function _dealCard(deal) {
    var avatarColors = ['#22c55e','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
    var avatarColor  = avatarColors[(deal.clientName||'').charCodeAt(0) % 6 || 0];
    var initial      = (deal.clientName||deal.title||'?').charAt(0).toUpperCase();
    var date         = deal.updatedAt && deal.updatedAt.toDate ? _relTime(deal.updatedAt.toDate()) : '';
    var sourceIcon   = {telegram:'📱',instagram:'📷',site_form:'🌐',manual:'👤'}[deal.source] || '📋';

    return '<div draggable="true" data-deal-id="' + deal.id + '" ' +
        'ondragstart="crmDragStart(event,\'' + deal.id + '\')" ' +
        'onclick="crmOpenDeal(\'' + deal.id + '\')" ' +
        'style="background:white;border-radius:10px;padding:0.65rem;cursor:pointer;' +
        'box-shadow:0 1px 4px rgba(0,0,0,0.07);border:1.5px solid #f1f5f9;transition:all 0.15s;" ' +
        'onmouseenter="this.style.boxShadow=\'0 4px 14px rgba(34,197,94,0.15)\';this.style.borderColor=\'#bbf7d0\';this.style.transform=\'translateY(-1px)\'" ' +
        'onmouseleave="this.style.boxShadow=\'0 1px 4px rgba(0,0,0,0.07)\';this.style.borderColor=\'#f1f5f9\';this.style.transform=\'\'">' +
        '<div style="font-weight:700;font-size:0.82rem;color:#1a1a1a;margin-bottom:0.4rem;' +
        'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
        _esc(deal.title || deal.clientName || 'Угода') + '</div>' +
        '<div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.4rem;">' +
        '<div style="width:20px;height:20px;border-radius:50%;background:' + avatarColor + ';' +
        'display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:0.65rem;flex-shrink:0;">' +
        initial + '</div>' +
        '<span style="font-size:0.74rem;color:#525252;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">' +
        _esc(deal.clientName || '—') + '</span>' +
        '<span style="font-size:0.78rem;">' + sourceIcon + '</span>' +
        '</div>' +
        (deal.clientNiche ? '<div style="font-size:0.68rem;background:#f0fdf4;color:#16a34a;padding:1px 6px;' +
        'border-radius:8px;display:inline-block;margin-bottom:0.35rem;font-weight:600;">' +
        _esc(deal.clientNiche) + '</div>' : '') +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.2rem;">' +
        '<span style="font-size:0.8rem;font-weight:700;color:' + (deal.amount?'#16a34a':'#d1d5db') + ';">' +
        (deal.amount ? _fmt(deal.amount) : '—') + '</span>' +
        '<span style="font-size:0.65rem;color:#9ca3af;">' + date + '</span>' +
        '</div></div>';
}

// ── Drag & Drop ────────────────────────────────────────────
window.crmDragStart = function(e, dealId) {
    crm.dragDealId = dealId;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
};

window.crmDragOver = function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.style.background = '#f0fdf4';
};

window.crmDragLeave = function(e) {
    var stage = e.currentTarget.dataset.stage;
    e.currentTarget.style.background = stage === 'lost' ? '#fff5f5' : '#f8fafc';
};

window.crmDrop = async function(e, newStage) {
    e.preventDefault();
    var stage = e.currentTarget.dataset.stage;
    e.currentTarget.style.background = stage === 'lost' ? '#fff5f5' : '#f8fafc';
    if (!crm.dragDealId) return;
    var deal = crm.deals.find(function(d){ return d.id === crm.dragDealId; });
    crm.dragDealId = null;
    if (!deal || deal.stage === newStage) return;
    var oldStage = deal.stage;
    deal.stage = newStage;
    _renderKanban();
    try {
        var dealRef = firebase.firestore().doc('companies/' + window.currentCompanyId + '/crm_deals/' + deal.id);
        await dealRef.update({ stage: newStage, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        await dealRef.collection('history').add({
            type: 'stage_changed', from: oldStage, to: newStage,
            by: (window.currentUser && window.currentUser.email) || 'manager',
            at: firebase.firestore.FieldValue.serverTimestamp(),
        });
        if (typeof emitTalkoEvent === 'function' && window.TALKO_EVENTS) {
            await emitTalkoEvent(window.TALKO_EVENTS.DEAL_STAGE_CHANGED, {
                dealId: deal.id, clientName: deal.clientName,
                fromStage: oldStage, toStage: newStage,
                pipelineId: deal.pipelineId, amount: deal.amount,
            });
        }
        if (typeof showToast === 'function') showToast('Стадію змінено → ' + _stageLabel(newStage), 'success');
    } catch(err) {
        console.error('[CRM] drop:', err);
        deal.stage = oldStage;
        _renderKanban();
    }
};

function _stageLabel(stageId) {
    var stages = crm.pipeline && crm.pipeline.stages ? crm.pipeline.stages : [];
    var s = stages.find(function(s){ return s.id === stageId; });
    return s ? s.label : stageId;
}

// ══════════════════════════════════════════════════════════
// КАРТКА УГОДИ
// ══════════════════════════════════════════════════════════
window.crmOpenDeal = function(dealId) {
    crm.activeDealId = dealId;
    var deal = crm.deals.find(function(d){ return d.id === dealId; });
    if (!deal) return;
    document.getElementById('crmDealOverlay') && document.getElementById('crmDealOverlay').remove();

    document.body.insertAdjacentHTML('beforeend',
        '<div id="crmDealOverlay" onclick="if(event.target===this)crmCloseDeal()" ' +
        'style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10020;' +
        'display:flex;align-items:center;justify-content:center;padding:1rem;">' +
        '<div style="background:white;border-radius:16px;width:100%;max-width:580px;' +
        'max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.2);">' +
        '<div style="padding:1rem 1.25rem 0.75rem;border-bottom:1px solid #f1f5f9;' +
        'display:flex;justify-content:space-between;align-items:flex-start;' +
        'position:sticky;top:0;background:white;z-index:1;">' +
        '<div>' +
        '<div style="font-weight:700;font-size:1rem;color:#1a1a1a;">' + _esc(deal.title||deal.clientName||'Угода') + '</div>' +
        '<div style="font-size:0.72rem;color:#9ca3af;margin-top:2px;">' + _esc(deal.clientName||'') +
        (deal.clientNiche ? ' · <span style="color:#16a34a;">' + _esc(deal.clientNiche) + '</span>' : '') +
        ' · ' + (deal.source||'manual') + '</div>' +
        '</div>' +
        '<button onclick="crmCloseDeal()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.2rem;">x</button>' +
        '</div>' +
        '<div style="display:flex;border-bottom:1px solid #f1f5f9;">' +
        [['details','Деталі'],['activity','Активності'],['ai','AI Аналіз']].map(function(item, i){
            return '<button id="crmDT_' + item[0] + '" onclick="crmDealTab(\'' + item[0] + '\')" ' +
                'style="flex:1;padding:0.55rem;border:none;border-bottom:2px solid ' + (i===0?'#22c55e':'transparent') + ';' +
                'background:none;cursor:pointer;font-size:0.8rem;font-weight:' + (i===0?'700':'500') + ';' +
                'color:' + (i===0?'#22c55e':'#6b7280') + ';transition:all 0.15s;">' + item[1] + '</button>';
        }).join('') +
        '</div>' +
        '<div id="crmDealContent" style="padding:1.25rem;">' + _dealDetailsHTML(deal) + '</div>' +
        '<div style="padding:0.75rem 1.25rem;border-top:1px solid #f1f5f9;' +
        'display:flex;justify-content:space-between;align-items:center;' +
        'position:sticky;bottom:0;background:white;">' +
        '<button onclick="crmDeleteDeal(\'' + dealId + '\')" ' +
        'style="padding:0.45rem 0.85rem;background:#fff5f5;color:#ef4444;' +
        'border:1.5px solid #fecaca;border-radius:8px;cursor:pointer;font-size:0.78rem;">Видалити</button>' +
        '<div style="display:flex;gap:0.4rem;">' +
        '<button onclick="crmCloseDeal()" style="padding:0.45rem 0.85rem;background:#f9fafb;color:#525252;' +
        'border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.78rem;">Закрити</button>' +
        '<button onclick="crmSaveDeal(\'' + dealId + '\')" style="padding:0.45rem 1rem;background:#22c55e;color:white;' +
        'border:none;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:700;">Зберегти</button>' +
        '</div></div></div></div>');
};

window.crmCloseDeal = function() {
    var el = document.getElementById('crmDealOverlay');
    if (el) el.remove();
    crm.activeDealId = null;
};

window.crmDealTab = function(tab) {
    ['details','activity','ai'].forEach(function(t) {
        var btn = document.getElementById('crmDT_' + t);
        if (btn) {
            btn.style.borderBottomColor = t===tab ? '#22c55e' : 'transparent';
            btn.style.fontWeight = t===tab ? '700' : '500';
            btn.style.color = t===tab ? '#22c55e' : '#6b7280';
        }
    });
    var deal = crm.deals.find(function(d){ return d.id === crm.activeDealId; });
    if (!deal) return;
    var content = document.getElementById('crmDealContent');
    if (!content) return;
    if (tab === 'details')  content.innerHTML = _dealDetailsHTML(deal);
    if (tab === 'activity') _loadActivityTab(deal);
    if (tab === 'ai')       _loadAITab(deal);
};

function _dealDetailsHTML(deal) {
    var stages = crm.pipeline && crm.pipeline.stages ? crm.pipeline.stages : [];
    var inp = 'width:100%;padding:0.48rem 0.6rem;border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.83rem;box-sizing:border-box;font-family:inherit;';
    var lbl = 'font-size:0.68rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.3rem;';

    return '<div style="display:flex;flex-direction:column;gap:0.85rem;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">' +
        '<div><label style="' + lbl + '">Назва угоди</label>' +
        '<input id="df_title" value="' + _esc(deal.title||'') + '" style="' + inp + '"></div>' +
        '<div><label style="' + lbl + '">Стадія</label>' +
        '<select id="df_stage" style="' + inp + 'background:white;cursor:pointer;">' +
        stages.map(function(s){ return '<option value="' + s.id + '" ' + (deal.stage===s.id?'selected':'') + '>' + _esc(s.label) + '</option>'; }).join('') +
        '</select></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">' +
        '<div><label style="' + lbl + '">Сума</label>' +
        '<input id="df_amount" type="number" value="' + (deal.amount||'') + '" placeholder="0" style="' + inp + '"></div>' +
        '<div><label style="' + lbl + '">Очікуване закриття</label>' +
        '<input id="df_expectedClose" type="date" value="' + (deal.expectedClose||'') + '" style="' + inp + 'cursor:pointer;"></div></div>' +
        '<div style="background:#f8fafc;border-radius:10px;padding:0.75rem;">' +
        '<label style="' + lbl + '">Клієнт</label>' +
        '<div style="display:flex;align-items:center;gap:0.5rem;">' +
        '<div style="width:32px;height:32px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:0.8rem;flex-shrink:0;">' +
        (deal.clientName||'?').charAt(0).toUpperCase() + '</div>' +
        '<div style="flex:1;"><div style="font-weight:700;font-size:0.85rem;">' + _esc(deal.clientName||'—') + '</div>' +
        '<div style="font-size:0.72rem;color:#6b7280;">' + (deal.clientNiche?_esc(deal.clientNiche)+' · ':'') + (deal.source||'manual') + '</div></div>' +
        (deal.botContactId ? '<button onclick="bpSwitch && bpSwitch(\'chat\')" style="padding:0.3rem 0.55rem;background:#eff6ff;color:#3b82f6;border:none;border-radius:7px;cursor:pointer;font-size:0.72rem;">Чат</button>' : '') +
        '</div></div>' +
        (deal.leadData ? '<div><label style="' + lbl + '">Дані з воронки</label>' +
        '<div style="background:#f0fdf4;border-radius:10px;padding:0.75rem;border-left:3px solid #22c55e;display:flex;flex-direction:column;gap:0.4rem;">' +
        (deal.leadData.role ? '<div style="font-size:0.78rem;"><b>Роль:</b> ' + _esc(deal.leadData.role) + '</div>' : '') +
        (deal.leadData.mainProblem ? '<div style="font-size:0.78rem;"><b>Проблема:</b> ' + _esc(deal.leadData.mainProblem) + '</div>' : '') +
        (deal.leadData.mainGoal ? '<div style="font-size:0.78rem;"><b>Ціль:</b> ' + _esc(deal.leadData.mainGoal) + '</div>' : '') +
        (deal.leadData.aiSummary ? '<div style="font-size:0.78rem;color:#16a34a;font-style:italic;">"' + _esc(deal.leadData.aiSummary.slice(0,200)) + '"</div>' : '') +
        '</div></div>' : '') +
        '<div><label style="' + lbl + '">Нотатка менеджера</label>' +
        '<textarea id="df_note" rows="3" style="' + inp + 'resize:vertical;" placeholder="Нотатки...">' + _esc(deal.note||'') + '</textarea></div>' +
        '</div>';
}

window.crmSaveDeal = async function(dealId) {
    var deal = crm.deals.find(function(d){ return d.id === dealId; });
    if (!deal) return;
    var title    = document.getElementById('df_title') && document.getElementById('df_title').value.trim();
    var stage    = document.getElementById('df_stage') && document.getElementById('df_stage').value;
    var amount   = parseFloat(document.getElementById('df_amount') && document.getElementById('df_amount').value) || 0;
    var note     = document.getElementById('df_note') && document.getElementById('df_note').value.trim();
    var expClose = document.getElementById('df_expectedClose') && document.getElementById('df_expectedClose').value;
    var updates  = { title: title||deal.title, stage: stage||deal.stage, amount: amount, note: note, expectedClose: expClose||null, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    try {
        await firebase.firestore().doc('companies/' + window.currentCompanyId + '/crm_deals/' + dealId).update(updates);
        if (stage !== deal.stage && typeof emitTalkoEvent === 'function' && window.TALKO_EVENTS) {
            await emitTalkoEvent(window.TALKO_EVENTS.DEAL_STAGE_CHANGED, { dealId: dealId, fromStage: deal.stage, toStage: stage, clientName: deal.clientName, amount: amount });
        }
        Object.assign(deal, updates);
        crmCloseDeal();
        if (typeof showToast === 'function') showToast('Угоду збережено', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

window.crmDeleteDeal = async function(dealId) {
    if (!confirm('Видалити угоду?')) return;
    try {
        await firebase.firestore().doc('companies/' + window.currentCompanyId + '/crm_deals/' + dealId).delete();
        crmCloseDeal();
        if (typeof showToast === 'function') showToast('Угоду видалено', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ── Активності ─────────────────────────────────────────────
async function _loadActivityTab(deal) {
    var content = document.getElementById('crmDealContent');
    if (!content) return;
    content.innerHTML = '<div style="color:#9ca3af;text-align:center;padding:1rem;">Завантаження...</div>';
    try {
        var snap = await firebase.firestore()
            .collection('companies/' + window.currentCompanyId + '/crm_deals/' + deal.id + '/history')
            .orderBy('at', 'desc').limit(30).get();
        var events = snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
        content.innerHTML =
            '<div style="display:flex;flex-direction:column;gap:0.5rem;">' +
            '<div style="background:#f8fafc;border-radius:10px;padding:0.75rem;margin-bottom:0.5rem;">' +
            '<div style="font-size:0.72rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.5rem;">Додати запис</div>' +
            '<div style="display:flex;gap:0.4rem;">' +
            '<select id="actType" style="padding:0.4rem;border:1.5px solid #e5e7eb;border-radius:8px;font-size:0.78rem;background:white;">' +
            '<option value="note">Нотатка</option><option value="call">Дзвінок</option>' +
            '<option value="meeting">Зустріч</option><option value="email">Email</option>' +
            '</select>' +
            '<input id="actText" placeholder="Опис..." onkeydown="if(event.key===\'Enter\')crmAddActivity(\'' + deal.id + '\')" ' +
            'style="flex:1;padding:0.4rem 0.5rem;border:1.5px solid #e5e7eb;border-radius:8px;font-size:0.78rem;">' +
            '<button onclick="crmAddActivity(\'' + deal.id + '\')" style="padding:0.4rem 0.65rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.78rem;">+</button>' +
            '</div></div>' +
            (events.length === 0 ? '<div style="text-align:center;padding:1.5rem;color:#9ca3af;font-size:0.8rem;">Активностей ще немає</div>' :
            events.map(function(ev) {
                var icons = { stage_changed:'🔄', note:'📝', call:'📞', meeting:'🤝', email:'✉️', created:'🎯' };
                var icon = icons[ev.type] || '📌';
                var time = ev.at && ev.at.toDate ? ev.at.toDate().toLocaleDateString('uk-UA', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
                var text = ev.text || '';
                if (ev.type === 'stage_changed') text = _stageLabel(ev.from) + ' → ' + _stageLabel(ev.to);
                if (ev.type === 'created') text = 'Угоду створено';
                return '<div style="display:flex;gap:0.6rem;align-items:flex-start;">' +
                    '<div style="width:28px;height:28px;border-radius:50%;background:#f0fdf4;display:flex;align-items:center;justify-content:center;font-size:0.82rem;flex-shrink:0;">' + icon + '</div>' +
                    '<div style="flex:1;"><div style="font-size:0.8rem;color:#374151;">' + _esc(text) + '</div>' +
                    '<div style="font-size:0.68rem;color:#9ca3af;">' + _esc(ev.by||'') + ' · ' + time + '</div></div>' +
                    '</div>';
            }).join('')) +
            '</div>';
    } catch(e) {
        content.innerHTML = '<div style="color:#ef4444;padding:1rem;font-size:0.8rem;">Помилка: ' + _esc(e.message) + '</div>';
    }
}

window.crmAddActivity = async function(dealId) {
    var type = document.getElementById('actType') && document.getElementById('actType').value || 'note';
    var textEl = document.getElementById('actText');
    var text = textEl && textEl.value.trim();
    if (!text) return;
    if (textEl) textEl.value = '';
    try {
        await firebase.firestore()
            .collection('companies/' + window.currentCompanyId + '/crm_deals/' + dealId + '/history')
            .add({ type: type, text: text, by: (window.currentUser && window.currentUser.email)||'manager', at: firebase.firestore.FieldValue.serverTimestamp() });
        var deal = crm.deals.find(function(d){ return d.id === dealId; });
        if (deal) _loadActivityTab(deal);
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ── AI Аналіз ──────────────────────────────────────────────
async function _loadAITab(deal) {
    var content = document.getElementById('crmDealContent');
    if (!content) return;
    if (deal.aiAnalysis) {
        content.innerHTML =
            '<div style="background:#f0fdf4;border-radius:12px;padding:1rem;border-left:3px solid #22c55e;">' +
            '<div style="font-size:0.72rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.5rem;">AI Аналіз угоди</div>' +
            '<div style="font-size:0.83rem;color:#374151;line-height:1.6;white-space:pre-wrap;">' + _esc(deal.aiAnalysis) + '</div>' +
            '</div>' +
            '<button onclick="crmRunAI(\'' + deal.id + '\')" style="margin-top:0.75rem;width:100%;padding:0.5rem;' +
            'background:#f0fdf4;color:#16a34a;border:1.5px solid #bbf7d0;border-radius:9px;cursor:pointer;font-size:0.8rem;font-weight:600;">Оновити аналіз</button>';
        return;
    }
    content.innerHTML =
        '<div style="text-align:center;padding:1.5rem;">' +
        '<div style="font-size:2rem;margin-bottom:0.5rem;">🤖</div>' +
        '<div style="font-weight:700;font-size:0.88rem;margin-bottom:0.35rem;">AI Аналіз угоди</div>' +
        '<div style="font-size:0.78rem;color:#6b7280;margin-bottom:1rem;">Ймовірність закриття, ризики, наступний крок</div>' +
        '<button onclick="crmRunAI(\'' + deal.id + '\')" ' +
        'style="padding:0.6rem 1.5rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.85rem;">Запустити аналіз</button>' +
        '</div>';
}

window.crmRunAI = async function(dealId) {
    var deal = crm.deals.find(function(d){ return d.id === dealId; });
    if (!deal) return;
    var content = document.getElementById('crmDealContent');
    if (content) content.innerHTML = '<div style="text-align:center;padding:2rem;color:#6b7280;">⏳ AI аналізує угоду...</div>';
    try {
        var compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
        var apiKey = compDoc.data() && (compDoc.data().openaiApiKey || compDoc.data().anthropicApiKey);
        if (!apiKey) {
            if (content) content.innerHTML = '<div style="color:#ef4444;padding:1rem;text-align:center;font-size:0.82rem;">API ключ не встановлений. Додайте в Налаштуваннях ботів.</div>';
            return;
        }
        var prompt = 'Ти CRM аналітик. Проаналізуй угоду:\n' +
            'Клієнт: ' + (deal.clientName||'—') + '\n' +
            'Ніша: ' + (deal.clientNiche||'—') + '\n' +
            'Стадія: ' + _stageLabel(deal.stage) + '\n' +
            'Сума: ' + (deal.amount ? _fmt(deal.amount) : 'не вказана') + '\n' +
            (deal.leadData && deal.leadData.role ? 'Роль: ' + deal.leadData.role + '\n' : '') +
            (deal.leadData && deal.leadData.mainProblem ? 'Проблема: ' + deal.leadData.mainProblem + '\n' : '') +
            (deal.leadData && deal.leadData.mainGoal ? 'Ціль: ' + deal.leadData.mainGoal + '\n' : '') +
            'Нотатка: ' + (deal.note||'—') + '\n\n' +
            'Дай: 1) Оцінку ймовірності закриття (0-100%) 2) Ключовий ризик 3) Наступний конкретний крок 4) Рекомендований текст повідомлення клієнту\n' +
            'Відповідь: лаконічно, 150-200 слів, українською.';
        var response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 600, messages: [{ role: 'user', content: prompt }] }),
        });
        var data = await response.json();
        var analysis = (data.content && data.content[0] && data.content[0].text) || 'Не вдалось отримати аналіз';
        await firebase.firestore().doc('companies/' + window.currentCompanyId + '/crm_deals/' + dealId)
            .update({ aiAnalysis: analysis, aiAnalyzedAt: firebase.firestore.FieldValue.serverTimestamp() });
        deal.aiAnalysis = analysis;
        _loadAITab(deal);
    } catch(e) {
        if (content) content.innerHTML = '<div style="color:#ef4444;padding:1rem;font-size:0.8rem;">Помилка: ' + _esc(e.message) + '</div>';
    }
};

// ══════════════════════════════════════════════════════════
// СТВОРЕННЯ УГОДИ
// ══════════════════════════════════════════════════════════
window.crmOpenCreateDeal = function(defaultStage) {
    var el = document.getElementById('crmCreateDealOverlay');
    if (el) el.remove();
    var stages = crm.pipeline && crm.pipeline.stages ? crm.pipeline.stages : [];
    var inp = 'width:100%;padding:0.5rem 0.6rem;border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.83rem;box-sizing:border-box;font-family:inherit;';
    var lbl = 'font-size:0.68rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.3rem;';
    document.body.insertAdjacentHTML('beforeend',
        '<div id="crmCreateDealOverlay" onclick="if(event.target===this)this.remove()" ' +
        'style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10025;' +
        'display:flex;align-items:center;justify-content:center;padding:1rem;">' +
        '<div style="background:white;border-radius:16px;width:100%;max-width:440px;">' +
        '<div style="padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;' +
        'display:flex;justify-content:space-between;align-items:center;">' +
        '<div style="font-weight:700;font-size:0.95rem;">Нова угода</div>' +
        '<button onclick="document.getElementById(\'crmCreateDealOverlay\').remove()" ' +
        'style="background:none;border:none;cursor:pointer;color:#9ca3af;">x</button></div>' +
        '<div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">' +
        '<div><label style="' + lbl + '">Назва угоди</label>' +
        '<input id="nd_title" placeholder="Консультація, Проект..." style="' + inp + '" autofocus></div>' +
        '<div><label style="' + lbl + '">Клієнт</label>' +
        '<input id="nd_client" placeholder="Ім\'я або компанія..." style="' + inp + '"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">' +
        '<div><label style="' + lbl + '">Стадія</label>' +
        '<select id="nd_stage" style="' + inp + 'background:white;cursor:pointer;">' +
        stages.map(function(s){ return '<option value="' + s.id + '" ' + ((defaultStage||'new')===s.id?'selected':'') + '>' + _esc(s.label) + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label style="' + lbl + '">Сума</label>' +
        '<input id="nd_amount" type="number" placeholder="0" style="' + inp + '"></div></div>' +
        '<div><label style="' + lbl + '">Ніша / Тип бізнесу</label>' +
        '<input id="nd_niche" placeholder="Стоматологія, Будівництво..." style="' + inp + '"></div>' +
        '</div>' +
        '<div style="padding:0.75rem 1.25rem;border-top:1px solid #f1f5f9;display:flex;justify-content:flex-end;gap:0.4rem;">' +
        '<button onclick="document.getElementById(\'crmCreateDealOverlay\').remove()" ' +
        'style="padding:0.5rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.82rem;">Скасувати</button>' +
        '<button onclick="crmCreateDeal()" ' +
        'style="padding:0.5rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.82rem;">Створити</button>' +
        '</div></div></div>');
    var nd = document.getElementById('nd_title');
    if (nd) nd.focus();
};

window.crmCreateDeal = async function() {
    var title  = document.getElementById('nd_title') && document.getElementById('nd_title').value.trim();
    var client = document.getElementById('nd_client') && document.getElementById('nd_client').value.trim();
    var stage  = document.getElementById('nd_stage') && document.getElementById('nd_stage').value || 'new';
    var amount = parseFloat(document.getElementById('nd_amount') && document.getElementById('nd_amount').value) || 0;
    var niche  = document.getElementById('nd_niche') && document.getElementById('nd_niche').value.trim();
    if (!title && !client) { alert('Введіть назву або ім\'я клієнта'); return; }
    try {
        var db = firebase.firestore();
        var dealRef = await db.collection('companies/' + window.currentCompanyId + '/crm_deals').add({
            title: title||client, clientName: client||title, clientNiche: niche||'',
            stage: stage, pipelineId: crm.pipeline && crm.pipeline.id || '',
            amount: amount, source: 'manual',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        await dealRef.collection('history').add({ type: 'created', by: (window.currentUser && window.currentUser.email)||'manager', at: firebase.firestore.FieldValue.serverTimestamp() });
        db.doc('companies/' + window.currentCompanyId + '/crm_stats/main').set({ totalDeals: firebase.firestore.FieldValue.increment(1) }, { merge: true }).catch(function(){});
        var el = document.getElementById('crmCreateDealOverlay');
        if (el) el.remove();
        if (typeof showToast === 'function') showToast('Угоду створено', 'success');
        if (typeof emitTalkoEvent === 'function' && window.TALKO_EVENTS) {
            emitTalkoEvent(window.TALKO_EVENTS.DEAL_CREATED, { dealId: dealRef.id, clientName: client||title, stage: stage, amount: amount });
        }
    } catch(e) { alert('Помилка: ' + e.message); }
};

// ══════════════════════════════════════════════════════════
// КЛІЄНТИ
// ══════════════════════════════════════════════════════════
function _renderClients() {
    var c = document.getElementById('crmViewClients');
    if (!c) return;
    c.innerHTML =
        '<div style="margin-bottom:0.6rem;display:flex;gap:0.4rem;">' +
        '<div style="position:relative;flex:1;">' +
        '<input id="crmClientSearch" type="text" placeholder="Пошук клієнта..." ' +
        'oninput="crmFilterClients(this.value)" ' +
        'style="width:100%;padding:0.45rem 0.5rem 0.45rem 1.8rem;border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.82rem;box-sizing:border-box;">' +
        '</div></div>' +
        '<div id="crmClientList" style="display:flex;flex-direction:column;gap:0.4rem;">' +
        _clientListHTML(crm.clients) + '</div>';
}

window.crmFilterClients = function(q) {
    var list = document.getElementById('crmClientList');
    if (!list) return;
    var filtered = q ? crm.clients.filter(function(c){
        return (c.name||'').toLowerCase().includes(q.toLowerCase()) || (c.phone||'').includes(q);
    }) : crm.clients;
    list.innerHTML = _clientListHTML(filtered);
};

function _clientListHTML(clients) {
    if (!clients.length) return '<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:0.8rem;">Клієнтів не знайдено</div>';
    var avatarColors = ['#22c55e','#3b82f6','#8b5cf6','#f59e0b'];
    return clients.map(function(cl) {
        var dealCount = crm.deals.filter(function(d){ return d.clientId===cl.id || d.clientName===cl.name; }).length;
        var avatarColor = avatarColors[(cl.name||'').charCodeAt(0) % 4 || 0];
        return '<div style="background:white;border-radius:12px;padding:0.75rem;' +
            'box-shadow:0 1px 4px rgba(0,0,0,0.06);display:flex;align-items:center;gap:0.6rem;">' +
            '<div style="width:36px;height:36px;border-radius:50%;background:' + avatarColor + ';' +
            'display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:0.9rem;flex-shrink:0;">' +
            (cl.name||'?').charAt(0).toUpperCase() + '</div>' +
            '<div style="flex:1;min-width:0;">' +
            '<div style="font-weight:700;font-size:0.85rem;">' + _esc(cl.name||'Без імені') + '</div>' +
            '<div style="font-size:0.72rem;color:#6b7280;">' + (cl.phone?_esc(cl.phone)+' · ':'') + (cl.niche?_esc(cl.niche):'—') + '</div>' +
            '</div>' +
            (dealCount > 0 ? '<span style="background:#f0fdf4;color:#16a34a;font-size:0.7rem;padding:2px 7px;border-radius:8px;font-weight:700;">' + dealCount + ' угод</span>' : '') +
            '</div>';
    }).join('');
}

// ══════════════════════════════════════════════════════════
// АНАЛІТИКА
// ══════════════════════════════════════════════════════════
function _renderAnalytics() {
    var c = document.getElementById('crmViewAnalytics');
    if (!c) return;
    var stages  = crm.pipeline && crm.pipeline.stages ? crm.pipeline.stages : [];
    var total   = crm.deals.length;
    var won     = crm.deals.filter(function(d){ return d.stage==='won'; }).length;
    var lost    = crm.deals.filter(function(d){ return d.stage==='lost'; }).length;
    var revenue = crm.deals.filter(function(d){ return d.stage==='won'; }).reduce(function(s,d){ return s+(d.amount||0); }, 0);
    var avgDeal = won > 0 ? Math.round(revenue/won) : 0;
    var convRate = total > 0 ? Math.round(won/total*100) : 0;
    var kpis = [['Конверсія', convRate+'%', '#22c55e'],['Revenue', _fmt(revenue), '#16a34a'],['Avg Deal', _fmt(avgDeal), '#3b82f6'],['Програно', lost, '#ef4444']];
    var byStage = stages.map(function(s){ return Object.assign({}, s, { count: crm.deals.filter(function(d){ return d.stage===s.id; }).length, amount: crm.deals.filter(function(d){ return d.stage===s.id; }).reduce(function(sm,d){ return sm+(d.amount||0); }, 0) }); });
    var sources = crm.deals.reduce(function(acc, d){ var src=d.source||'manual'; acc[src]=(acc[src]||0)+1; return acc; }, {});
    c.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:0.65rem;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">' +
        kpis.map(function(k){ return '<div style="background:white;border-radius:12px;padding:0.75rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);border-top:3px solid ' + k[2] + ';"><div style="font-size:1.1rem;font-weight:700;color:' + k[2] + ';">' + k[1] + '</div><div style="font-size:0.7rem;color:#9ca3af;">' + k[0] + '</div></div>'; }).join('') +
        '</div>' +
        '<div style="background:white;border-radius:14px;padding:1rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
        '<div style="font-weight:700;font-size:0.85rem;margin-bottom:0.75rem;">Розподіл по стадіях</div>' +
        byStage.filter(function(s){ return s.count>0; }).map(function(s){ var pct=total>0?Math.round(s.count/total*100):0; return '<div style="margin-bottom:0.5rem;"><div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-size:0.76rem;font-weight:600;">' + _esc(s.label) + '</span><span style="font-size:0.72rem;color:#6b7280;">' + s.count + ' · ' + _fmt(s.amount) + '</span></div><div style="background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden;"><div style="height:100%;background:' + s.color + ';width:' + pct + '%;border-radius:4px;"></div></div></div>'; }).join('') +
        '</div>' +
        '<div style="background:white;border-radius:14px;padding:1rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
        '<div style="font-weight:700;font-size:0.85rem;margin-bottom:0.75rem;">Джерела лідів</div>' +
        (Object.keys(sources).length > 0 ? Object.entries(sources).map(function(e){ var icons={telegram:'📱',instagram:'📷',site_form:'🌐',manual:'👤'}; return '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.8rem;"><span>' + (icons[e[0]]||'📋') + ' ' + e[0] + '</span><span style="font-weight:700;color:#22c55e;">' + e[1] + '</span></div>'; }).join('') : '<div style="color:#9ca3af;font-size:0.8rem;">Немає даних</div>') +
        '</div></div>';
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════
function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function _fmt(n) {
    var num = parseFloat(n) || 0;
    if (num === 0) return '0';
    if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num/1000).toFixed(0) + 'k';
    return num.toLocaleString('uk-UA');
}
function _relTime(d) {
    var diff = Date.now() - d.getTime(), m = Math.floor(diff/60000);
    if (m < 1)  return 'щойно';
    if (m < 60) return m + 'хв';
    var h = Math.floor(m/60);
    if (h < 24) return h + 'год';
    return Math.floor(h/24) + 'дн';
}

// ── switchTab hook ─────────────────────────────────────────
var _origST = window.switchTab;
window.switchTab = function(tab) {
    if (_origST) _origST(tab);
    if (tab === 'crm') {
        if (window.isFeatureEnabled && window.isFeatureEnabled('crm')) {
            if (!crm.pipeline) {
                window.initCRMModule();
            } else if (crm.subTab === 'kanban') {
                _renderKanban();
            }
        }
    }
};

})();
