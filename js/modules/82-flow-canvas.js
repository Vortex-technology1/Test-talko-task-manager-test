// ============================================================
// TALKO Flow Canvas Builder v3.0
// Div-based canvas (не SVG foreignObject)
// Архітектура: SendPulse-style
// ============================================================
(function () {
'use strict';

// ── State ──────────────────────────────────────────────────
let fc = {
    flowId: null,
    flowData: null,
    nodes: [],      // [{id,type,x,y,config,outputs}]
    edges: [],      // [{id,fromNode,fromPort,toNode,toPort}]
    selected: null,
    pan: {x:80, y:60},
    scale: 1,
    dragging: null, // {nodeId,startMX,startMY,origX,origY}
    connecting: null, // {fromNode,fromPort,startX,startY}
    panning: false,
    panStart: null,
    history: [],
    historyIdx: -1,
};

const W = 220; // node width

// ── Node config ────────────────────────────────────────────
const NODES = {
    start:      {label:'Старт',       color:'#22c55e', border:'#16a34a', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21"/></svg></span>',  outputs:['out']},
    message:    {label:'Повідомлення',color:'#22c55e', border:'#16a34a', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>', outputs:['out','btn']},
    action:     {label:'Дія',         color:'#f59e0b', border:'#d97706', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>', outputs:['out']},
    filter:     {label:'Фільтр',      color:'#f97316', border:'#ea580c', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg></span>', outputs:['yes','no']},
    pause:      {label:'Пауза',       color:'#64748b', border:'#475569', icon:'⏸',  outputs:['out']},
    ai:         {label:'ШІ Агент',    color:'#8b5cf6', border:'#7c3aed', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span>', outputs:['out']},
    api:        {label:'Запит API',   color:'#0ea5e9', border:'#0284c7', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></span>',  outputs:['ok','err']},
    sheets:     {label:'Google Sheets',color:'#10b981',border:'#059669', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>', outputs:['out']},
    random:     {label:'Випадково',   color:'#ec4899', border:'#db2777', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg></span>',  outputs:['a','b']},
    repeat:     {label:'Повтор',      color:'#14b8a6', border:'#0d9488', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></span>',  outputs:['out','end']},
    crm:        {label:'Угода CRM',   color:'#22c55e', border:'#16a34a', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></span>', outputs:['out']},
    end:        {label:'Кінець',      color:'#94a3b8', border:'#64748b', icon:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></span>',  outputs:[]},
};

const PORT_LABELS = {
    out:'Продовжити', btn:'Кнопка', yes:'Так', no:'Ні',
    ok:'Успішно', err:'Помилка', a:'Гілка А', b:'Гілка Б',
    end:'Завершити',
};

// ── Open ───────────────────────────────────────────────────
window.openFlowCanvas = async function(flowId, botId) {
    fc.flowId = flowId;
    fc.botId = botId || window._currentBotId || null;
    // Зберігаємо стан canvas для відновлення після рефрешу
    try { localStorage.setItem('talko_canvas_state', JSON.stringify({ flowId, botId: fc.botId })); } catch(e) {}
    const flowRef = fc.botId
        ? firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('bots').doc(fc.botId).collection('flows').doc(flowId)
        : firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('flows').doc(flowId);
    const snap = await flowRef.get();
    if (!snap.exists) return;
    fc.flowData = {id: snap.id, ...snap.data()};

    // Підвантажуємо великі AI промпти з nodePrompts підколекції
    const promptsSnap = await flowRef.collection('nodePrompts').get();
    const nodePromptsMap = {};
    promptsSnap.forEach(doc => { nodePromptsMap[doc.id] = doc.data().aiSystem || ''; });

    // Функція для відновлення __ref посилань в реальні промпти
    const restoreNodePrompts = (nodesList) => (nodesList || []).map(n => {
        const sys = n.config?.aiSystem || n.aiSystem || '';
        if (sys.startsWith('__ref:')) {
            const refId = sys.replace('__ref:', '');
            const realPrompt = nodePromptsMap[refId] || '';
            const restored = JSON.parse(JSON.stringify(n));
            if (restored.config?.aiSystem !== undefined) restored.config.aiSystem = realPrompt;
            if (restored.aiSystem !== undefined) restored.aiSystem = realPrompt;
            return restored;
        }
        return n;
    });

    // Load nodes/edges from stored JSON
    const stored = fc.flowData.canvasData || null;
    if (stored) {
        // canvasData.nodes зберігається як {...config, _x, _y, outputs, id, type}
        // Треба відновити структуру {id, type, x, y, config, outputs}
        fc.nodes = restoreNodePrompts(stored.nodes || []).map(n => {
            const nodeType = n.type || 'message';
            return {
                id: n.id,
                type: nodeType,
                x: n._x !== undefined ? n._x : (n.x !== undefined ? n.x : 80),
                y: n._y !== undefined ? n._y : (n.y !== undefined ? n.y : 200),
                outputs: n.outputs || NODES[nodeType]?.outputs || ['out'],
                config: { ...n, type: nodeType, id: n.id },
            };
        });
        fc.edges = stored.edges || [];
        // Якщо немає start вузла — додаємо автоматично
        if (!fc.nodes.find(n => n.type === 'start')) {
            const minX = fc.nodes.length ? Math.min(...fc.nodes.map(n=>n.x)) : 360;
            const minY = fc.nodes.length ? Math.min(...fc.nodes.map(n=>n.y)) : 200;
            const startNode = {id:'start_0', type:'start', x: minX - 280, y: minY,
                config:{triggerKeyword: fc.flowData.triggerKeyword || '/start'},
                outputs: ['out']};
            fc.nodes.unshift(startNode);
            // З'єднуємо start з першим вузлом
            if (fc.nodes.length > 1) {
                const firstId = fc.nodes[1].id;
                if (firstId && !fc.edges.find(e=>e.fromNode==='start_0')) {
                    fc.edges.unshift({id:'e_start_out', fromNode:'start_0', fromPort:'out', toNode:firstId, toPort:'in'});
                }
            }
        }
    } else {
        // Migrate old linear nodes or fresh start
        const oldNodes = fc.flowData.nodes || [];
        if (oldNodes.length === 0) {
            fc.nodes = [{id:'start_0', type:'start', x:80, y:200,
                config:{triggerKeyword: fc.flowData.triggerKeyword || '/start'},
                outputs: ['out']}];
        } else {
            fc.nodes = oldNodes.map((n,i) => ({
                id: n.id,
                type: n.type || 'message',
                x: n._x !== undefined ? n._x : 80 + i*280,
                y: n._y !== undefined ? n._y : 200,
                config: n,
                outputs: NODES[n.type]?.outputs || ['out'],
            }));
            fc.edges = oldNodes.flatMap(n => {
                const edges = [];
                if (n.nextNode) edges.push({id:`e_${n.id}_out`, fromNode:n.id, fromPort:'out', toNode:n.nextNode, toPort:'in'});
                (n.options||[]).forEach((o,i) => {
                    if (o.nextNode) edges.push({id:`e_${n.id}_btn${i}`, fromNode:n.id, fromPort:`btn_${i}`, toNode:o.nextNode, toPort:'in'});
                });
                return edges;
            });
        }
    }

    fc.selected = null;
    fc.pan = {x:80, y:60};
    fc.scale = 1;
    fc.history = [];
    fc.historyIdx = -1;

    mountCanvas();
    renderAll();
    setTimeout(fitView, 100);
};

// ── Mount DOM ──────────────────────────────────────────────
function mountCanvas() {
    document.getElementById('fcRoot')?.remove();

    const root = document.createElement('div');
    root.id = 'fcRoot';
    root.style.cssText = [
        'position:fixed;inset:0;z-index:10010',
        'display:flex;flex-direction:column',
        'background:#f9fafb;font-family:system-ui,sans-serif',
        'user-select:none',
    ].join(';');

    root.innerHTML = `
    <!-- TOOLBAR -->
    <div id="fcToolbar" style="height:48px;background:#1e293b;display:flex;align-items:center;
        gap:8px;padding:0 12px;flex-shrink:0;border-bottom:2px solid #334155;z-index:10;">

        <button id="fcBtnBack" title="Назад до списку"
            style="padding:6px 12px;background:#334155;border:none;border-radius:8px;color:white;
            cursor:pointer;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;">
            <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span> Назад
        </button>

        <div style="width:1px;height:28px;background:#334155;"></div>

        <div style="color:white;font-weight:700;font-size:14px;max-width:200px;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" id="fcFlowTitle"></div>
        <span id="fcChannelBadge" style="background:#334155;color:#94a3b8;
            font-size:11px;padding:2px 8px;border-radius:4px;"></span>

        <div style="flex:1;"></div>

        <!-- Undo/Redo -->
        <button id="fcBtnUndo" title="Скасувати (Ctrl+Z)"
            style="padding:6px 10px;background:#334155;border:none;border-radius:7px;
            color:#94a3b8;cursor:pointer;font-size:14px;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg></span></button>
        <button id="fcBtnRedo" title="Повторити (Ctrl+Y)"
            style="padding:6px 10px;background:#334155;border:none;border-radius:7px;
            color:#94a3b8;cursor:pointer;font-size:14px;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5V17"/></svg></span></button>

        <div style="width:1px;height:28px;background:#334155;"></div>

        <!-- Zoom -->
        <button id="fcBtnZoomOut" style="padding:6px 10px;background:#334155;border:none;
            border-radius:7px;color:white;cursor:pointer;font-size:16px;">−</button>
        <span id="fcZoomPct" style="color:#94a3b8;font-size:12px;min-width:40px;text-align:center;">100%</span>
        <button id="fcBtnZoomIn" style="padding:6px 10px;background:#334155;border:none;
            border-radius:7px;color:white;cursor:pointer;font-size:16px;">+</button>
        <button id="fcBtnFit" title="По екрану" style="padding:6px 10px;background:#334155;
            border:none;border-radius:7px;color:white;cursor:pointer;font-size:12px;">⤢</button>

        <div style="width:1px;height:28px;background:#334155;"></div>

        <button id="fcBtnToggleStatus"
            style="padding:7px 14px;background:#334155;border:none;border-radius:8px;
            color:#94a3b8;cursor:pointer;font-weight:600;font-size:12px;">
            draft
        </button>
        <button id="fcBtnSave"
            style="padding:7px 18px;background:#22c55e;border:none;border-radius:8px;
            color:white;cursor:pointer;font-weight:700;font-size:13px;">
            Зберегти
        </button>
        <button id="fcBtnClose" title="Закрити"
            style="padding:6px 10px;background:#334155;border:none;border-radius:7px;
            color:#94a3b8;cursor:pointer;font-size:18px;line-height:1;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
    </div>

    <!-- BODY -->
    <div style="flex:1;display:flex;min-height:0;overflow:hidden;">

        <!-- LEFT SIDEBAR -->
        <div id="fcSidebar" style="width:72px;background:#1e293b;border-right:1px solid #334155;
            overflow-y:auto;flex-shrink:0;display:flex;flex-direction:column;
            align-items:center;padding:8px 0;gap:4px;z-index:5;">
        </div>

        <!-- CANVAS AREA -->
        <div id="fcCanvasWrap" style="flex:1;position:relative;overflow:hidden;cursor:grab;">
            <!-- dot grid bg -->
            <canvas id="fcBgCanvas" style="position:absolute;inset:0;pointer-events:none;z-index:0;"></canvas>
            <!-- edges SVG -->
            <svg id="fcEdgesSVG" style="position:absolute;inset:0;width:100%;height:100%;
                overflow:visible;pointer-events:none;z-index:1;">
                <defs>
                    <marker id="arrowHead" markerWidth="10" markerHeight="7"
                        refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
                    </marker>
                    <marker id="arrowHeadGreen" markerWidth="10" markerHeight="7"
                        refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
                    </marker>
                    <marker id="arrowHeadBlue" markerWidth="10" markerHeight="7"
                        refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
                    </marker>
                </defs>
                <g id="fcEdgesGroup" style="pointer-events:all;"></g>
                <path id="fcTempEdge" fill="none" stroke="#22c55e" stroke-width="2"
                    stroke-dasharray="6,4" style="display:none;pointer-events:none;" marker-end="url(#arrowHeadGreen)"/>
            </svg>
            <!-- nodes layer -->
            <div id="fcNodesLayer" style="position:absolute;inset:0;z-index:2;"></div>
        </div>

        <!-- RIGHT PANEL -->
        <div id="fcRightPanel" style="width:300px;background:#1e293b;border-left:1px solid #334155;
            overflow-y:auto;flex-shrink:0;z-index:5;">
            <div id="fcPropPanel" style="padding:16px;">
                <div style="text-align:center;padding:48px 16px;color:#475569;">
                    <div style="font-size:32px;margin-bottom:8px;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19V5"/><path d="m5 12 7-7 7 7"/></svg></span></div>
                    <div style="font-size:13px;">Клікніть на вузол<br>для редагування</div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.appendChild(root);

    // Fill sidebar
    buildSidebar();

    // Toolbar events
    document.getElementById('fcBtnBack').onclick = closeCanvas;
    document.getElementById('fcBtnClose').onclick = closeCanvas;
    document.getElementById('fcBtnSave').onclick = saveFlow;

    // Toggle flow status button
    const statusBtn = document.getElementById('fcBtnToggleStatus');
    if (statusBtn && fc.flowData) {
        const st = fc.flowData.status || 'draft';
        statusBtn.textContent = st === 'active' ? '🟢 active' : '⚫ draft';
        statusBtn.style.background = st === 'active' ? '#dcfce7' : '#334155';
        statusBtn.style.color = st === 'active' ? '#16a34a' : '#94a3b8';
        statusBtn.onclick = async function() {
            const cur = fc.flowData.status || 'draft';
            const next = cur === 'active' ? 'draft' : 'active';
            try {
                const ref = fc.botId
                    ? firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('bots').doc(fc.botId).collection('flows').doc(fc.flowId)
                    : firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('flows').doc(fc.flowId);
                await ref.update({ status: next });
                fc.flowData.status = next;
                statusBtn.textContent = next === 'active' ? '🟢 active' : '⚫ draft';
                statusBtn.style.background = next === 'active' ? '#dcfce7' : '#334155';
                statusBtn.style.color = next === 'active' ? '#16a34a' : '#94a3b8';
                if (typeof showToast === 'function') showToast(next === 'active' ? '🟢 Флоу активовано' : '⚫ Флоу на паузі', 'success');
            } catch(e) { alert('Помилка: ' + e.message); }
        };
    }
    document.getElementById('fcBtnZoomIn').onclick = () => doZoom(0.15);
    document.getElementById('fcBtnZoomOut').onclick = () => doZoom(-0.15);
    document.getElementById('fcBtnFit').onclick = fitView;
    document.getElementById('fcBtnUndo').onclick = undo;
    document.getElementById('fcBtnRedo').onclick = redo;
    document.getElementById('fcFlowTitle').textContent = fc.flowData.name || 'Без назви';
    document.getElementById('fcChannelBadge').textContent = fc.flowData.channel || 'telegram';

    // Canvas events
    const wrap = document.getElementById('fcCanvasWrap');
    wrap.addEventListener('mousedown', onWrapMouseDown);
    wrap.addEventListener('mousemove', onWrapMouseMove);
    wrap.addEventListener('mouseup', onWrapMouseUp);
    wrap.addEventListener('mouseleave', onWrapMouseUp);
    wrap.addEventListener('wheel', onWrapWheel, {passive:false});
    wrap.addEventListener('dblclick', onWrapDblClick);

    // Keyboard
    document.addEventListener('keydown', onKeyDown);

    // Draw BG
    drawBg();
    window.addEventListener('resize', drawBg);
}

function closeCanvas() {
    try { localStorage.removeItem('talko_canvas_state'); } catch(e) {}
    document.getElementById('fcRoot')?.remove();
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', drawBg);
}

// ── Sidebar ────────────────────────────────────────────────
function buildSidebar() {
    const sb = document.getElementById('fcSidebar');
    if (!sb) return;

    // Apple-style: кольорові іконки в SF-style квадратах
    sb.style.width = '72px';
    sb.style.minWidth = '72px';
    sb.style.background = '#ffffff';
    sb.style.borderRight = '1px solid #e5e7eb';
    sb.style.padding = '8px 6px';
    sb.style.gap = '2px';

    const items = [
        ['message', '#3b82f6', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, 'Повідом.'],
        ['action',  '#f59e0b', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, 'Дія'],
        ['filter',  '#8b5cf6', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg>`, 'Фільтр'],
        ['pause',   '#64748b', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`, 'Пауза'],
        ['ai',      '#22c55e', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg>`, 'ШІ Агент'],
        ['api',     '#06b6d4', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`, 'API'],
        ['sheets',  '#16a34a', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, 'Sheets'],
        ['random',  '#ec4899', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`, 'Випадк.'],
        ['repeat',  '#f97316', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`, 'Повтор'],
        ['crm',     '#6366f1', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`, 'CRM'],
        ['end',     '#ef4444', `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>`, 'Кінець'],
    ];

    // AI Воронка — окрема кнопка внизу сайдбара
    const aiFunnelBtn = `
        <div style="margin-top:8px;border-top:1px solid #e5e7eb;padding-top:8px;">
            <div onclick="fcOpenAiFunnelModal()"
                title="AI Асистент воронки"
                style="width:60px;display:flex;flex-direction:column;align-items:center;
                gap:4px;padding:6px 4px;border-radius:10px;cursor:pointer;
                transition:background 0.12s;"
                onmouseenter="this.style.background='#f0fdf4'"
                onmouseleave="this.style.background='transparent'">
                <div style="width:36px;height:36px;border-radius:9px;
                    background:linear-gradient(135deg,#22c55e,#8b5cf6);
                    display:flex;align-items:center;justify-content:center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/>
                        <path d="M18 2v4h4"/>
                    </svg>
                </div>
                <div style="font-size:9.5px;color:#22c55e;text-align:center;
                    line-height:1.2;font-weight:600;">AI
Воронка</div>
            </div>
        </div>`;

    sb.innerHTML = items.map(([type, color, svg, label]) => `
        <div draggable="true" data-sbtype="${type}"
            title="${NODES[type]?.label || label}"
            style="width:60px;display:flex;flex-direction:column;align-items:center;
            gap:4px;padding:6px 4px;border-radius:10px;cursor:grab;
            transition:background 0.12s;"
            onmouseenter="this.style.background='#f3f4f6'"
            onmouseleave="this.style.background='transparent'">
            <div style="width:36px;height:36px;border-radius:9px;background:${color};
                display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${svg}
            </div>
            <div style="font-size:9.5px;color:#6b7280;text-align:center;
                line-height:1.2;font-weight:500;">${label}</div>
        </div>`
    ).join('') + aiFunnelBtn;

    // Drag from sidebar → canvas
    sb.querySelectorAll('[data-sbtype]').forEach(el => {
        el.addEventListener('dragstart', e => {
            e.dataTransfer.setData('nodeType', el.dataset.sbtype);
        });
    });
    const wrap = document.getElementById('fcCanvasWrap');
    wrap.addEventListener('dragover', e => { e.preventDefault(); });
    wrap.addEventListener('drop', e => {
        e.preventDefault();
        const type = e.dataTransfer.getData('nodeType');
        if (!type) return;
        const rect = wrap.getBoundingClientRect();
        const cx = (e.clientX - rect.left - fc.pan.x) / fc.scale;
        const cy = (e.clientY - rect.top - fc.pan.y) / fc.scale;
        addNode(type, snap(cx - W/2), snap(cy - 40));
    });
}
// ── Render All ─────────────────────────────────────────────
function renderAll() {
    renderNodes();
    renderEdges();
}

// ── Nodes ──────────────────────────────────────────────────
function renderNodes() {
    const layer = document.getElementById('fcNodesLayer');
    if (!layer) return;
    layer.innerHTML = '';
    fc.nodes.forEach(n => {
        const el = buildNodeEl(n);
        layer.appendChild(el);
    });
    applyTransformToNodes();
}

function buildNodeEl(node) {
    // ── START ──────────────────────────────────────────────
    if (node.type === 'start') {
        const el = document.createElement('div');
        el.id = `fcn_${node.id}`;
        el.dataset.nid = node.id;
        el.style.cssText = `position:absolute;left:${node.x}px;top:${node.y}px;
            width:110px;height:38px;border-radius:19px;background:#22c55e;
            border:none;box-shadow:0 2px 8px rgba(34,197,94,0.35);
            cursor:grab;display:flex;align-items:center;justify-content:center;
            gap:6px;z-index:2;user-select:none;`;
        el.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
            <span style="font-size:13px;font-weight:700;color:white;">Старт</span>
            <div data-port-out="${node.id}" data-port-id="out"
                style="position:absolute;right:-7px;top:50%;transform:translateY(-50%);
                width:14px;height:14px;border-radius:50%;background:#16a34a;
                border:2.5px solid white;cursor:crosshair;z-index:3;"
                onmouseenter="this.style.transform='translateY(-50%) scale(1.3)'"
                onmouseleave="this.style.transform='translateY(-50%) scale(1)'"
            ></div>`;
        el.addEventListener('mousedown', e => onNodeMouseDown(e, node.id));
        el.querySelectorAll('[data-port-out]').forEach(portEl => {
            portEl.addEventListener('mousedown', e => {
                e.stopPropagation();
                onPortMouseDown(e, node.id, portEl.dataset.portId);
            });
        });
        return el;
    }

    const cfg = NODES[node.type] || NODES.message;
    const isSelected = fc.selected === node.id;
    const preview = getPreview(node);
    const outputs = node.outputs || cfg.outputs || ['out'];
    const buttons = node.config?.buttons || [];

    const el = document.createElement('div');
    el.id = `fcn_${node.id}`;
    el.dataset.nid = node.id;
    el.style.cssText = [
        `position:absolute`,
        `left:${node.x}px`,
        `top:${node.y}px`,
        `width:${W}px`,
        `border-radius:12px`,
        `background:white`,
        `border:2px solid ${isSelected ? cfg.color : '#e5e7eb'}`,
        `box-shadow:${isSelected ? `0 0 0 3px ${cfg.color}25,` : ''}0 2px 10px rgba(0,0,0,0.10)`,
        `cursor:pointer`,
        `transition:border-color 0.15s,box-shadow 0.15s`,
        `overflow:visible`,
        `font-family:system-ui,sans-serif`,
    ].join(';');

    // ── IN port ────────────────────────────────────────────
    const inPortHTML = `
        <div data-port-in="${node.id}"
            style="position:absolute;left:-7px;top:50%;transform:translateY(-50%);
            width:14px;height:14px;border-radius:50%;background:white;
            border:2.5px solid #9ca3af;cursor:crosshair;z-index:3;transition:border-color 0.15s;"
            onmouseenter="this.style.borderColor='${cfg.color}'"
            onmouseleave="this.style.borderColor='#9ca3af'"
            title="Вхід"></div>`;

    // ── OUT ports ──────────────────────────────────────────
    const totalPorts = outputs.length;
    const outPortsHTML = outputs.map((portId, i) => {
        let label = PORT_LABELS[portId];
        if (!label && portId.startsWith('btn_')) {
            const btnIdx = parseInt(portId.replace('btn_', ''), 10);
            label = buttons[btnIdx]?.label || `Кнопка ${btnIdx + 1}`;
        }
        if (!label) label = portId;
        const connected = fc.edges.some(e => e.fromNode === node.id && e.fromPort === portId);
        const isErr = portId === 'no' || portId === 'err';
        const portColor = isErr ? '#ef4444' : cfg.color;
        const topPct = totalPorts === 1 ? 50 : 20 + (i / (totalPorts - 1)) * 60;
        return `
        <div style="position:absolute;right:-7px;top:${topPct}%;transform:translateY(-50%);z-index:3;display:flex;align-items:center;">
            ${totalPorts > 1 ? `<span style="position:absolute;right:17px;top:18px;font-size:9px;
                color:${isErr ? '#ef4444' : '#6b7280'};white-space:nowrap;font-weight:500;
                background:white;padding:1px 5px;border-radius:4px;
                border:1px solid ${isErr ? '#fca5a5' : '#e5e7eb'};pointer-events:none;">${label}</span>` : ''}
            <div data-port-out="${node.id}" data-port-id="${portId}"
                style="width:14px;height:14px;border-radius:50%;
                background:${connected ? portColor : 'white'};
                border:2.5px solid ${connected ? portColor : '#9ca3af'};
                cursor:crosshair;transition:all 0.15s;"
                title="${label}"
                onmouseenter="this.style.background='${portColor}';this.style.borderColor='${portColor}';this.style.transform='scale(1.3)'"
                onmouseleave="this.style.background='${connected ? portColor : 'white'}';this.style.borderColor='${connected ? portColor : '#9ca3af'}';this.style.transform='scale(1)'"
            ></div>
        </div>`;
    }).join('');

    // ── Body content ───────────────────────────────────────
    const btnsHTML = buttons.length ? `
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px;">
            ${buttons.map(b => `
                <div style="padding:5px 10px;background:#f9fafb;border:1.5px solid #e5e7eb;
                    border-radius:7px;font-size:10.5px;color:#374151;font-weight:500;
                    display:flex;align-items:center;gap:5px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5"><polygon points="5,3 19,12 5,21"/></svg>
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(b.label||'Кнопка')}</span>
                </div>`).join('')}
        </div>` : '';

    const aiSnippet = node.type === 'ai' && node.config?.systemPrompt ? `
        <div style="margin-top:6px;padding:5px 8px;background:#faf5ff;
            border:1px solid #e9d5ff;border-radius:6px;font-size:10px;color:#7c3aed;
            line-height:1.4;overflow:hidden;display:-webkit-box;
            -webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${esc(node.config.systemPrompt.slice(0,90))}
        </div>` : '';

    el.innerHTML = `
        ${inPortHTML}
        <div style="background:${cfg.color};border-radius:10px 10px 0 0;
            padding:9px 13px;display:flex;align-items:center;gap:8px;">
            <span style="display:flex;align-items:center;color:white;">${cfg.icon}</span>
            <span style="font-weight:600;font-size:12.5px;color:white;flex:1;
                overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cfg.label}</span>
            <div data-del="${node.id}" title="Видалити"
                style="width:20px;height:20px;border-radius:5px;background:rgba(0,0,0,0.18);
                display:flex;align-items:center;justify-content:center;cursor:pointer;
                flex-shrink:0;transition:background 0.15s;"
                onmouseenter="this.style.background='rgba(239,68,68,0.75)'"
                onmouseleave="this.style.background='rgba(0,0,0,0.18)'">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
        </div>
        <div style="padding:10px 13px 12px;min-height:42px;">
            ${preview
                ? `<div style="font-size:11px;color:#4b5563;line-height:1.5;
                    overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;
                    -webkit-box-orient:vertical;">${esc(preview)}</div>`
                : `<div style="font-size:11px;color:#9ca3af;font-style:italic;">Клікніть для налаштування</div>`
            }
            ${node.type === 'ai' ? aiSnippet : btnsHTML}
        </div>
        ${outPortsHTML}
    `;

    // ── Events ──────────────────────────────────────────────
    el.addEventListener('mousedown', e => onNodeMouseDown(e, node.id));

    el.querySelectorAll('[data-port-out]').forEach(portEl => {
        portEl.addEventListener('mousedown', e => {
            e.stopPropagation();
            onPortMouseDown(e, node.id, portEl.dataset.portId);
        });
    });

    el.querySelectorAll('[data-del]').forEach(delEl => {
        delEl.addEventListener('mousedown', e => {
            e.stopPropagation();
            e.preventDefault();
            if (confirm(`Видалити вузол "${cfg.label}"?`)) {
                pushHistory();
                fc.nodes = fc.nodes.filter(n => n.id !== node.id);
                fc.edges = fc.edges.filter(ed => ed.fromNode !== node.id && ed.toNode !== node.id);
                if (fc.selected === node.id) { fc.selected = null; renderPropPanel(); }
                renderAll();
            }
        });
    });

    return el;
}

function applyTransformToNodes() {
    const layer = document.getElementById('fcNodesLayer');
    if (!layer) return;
    layer.style.transform = `translate(${fc.pan.x}px,${fc.pan.y}px) scale(${fc.scale})`;
    layer.style.transformOrigin = '0 0';
}

// ── Edges (SVG) ────────────────────────────────────────────
function renderEdges() {
    const g = document.getElementById('fcEdgesGroup');
    if (!g) return;
    const svg = document.getElementById('fcEdgesSVG');

    // Apply same transform to SVG edges group
    g.setAttribute('transform', `translate(${fc.pan.x},${fc.pan.y}) scale(${fc.scale})`);

    g.innerHTML = '';
    fc.edges.forEach(edge => {
        const fromNode = fc.nodes.find(n => n.id === edge.fromNode);
        const toNode = fc.nodes.find(n => n.id === edge.toNode);
        if (!fromNode || !toNode) return;

        const from = getOutPortPos(fromNode, edge.fromPort);
        const to = getInPortPos(toNode);

        const isSelected = fc.selected === edge.fromNode || fc.selected === edge.toNode;
        const portColor = (edge.fromPort === 'no' || edge.fromPort === 'err') ? '#ef4444' : '#3b82f6';
        const color = isSelected ? portColor : '#3b82f6';
        const markerId = isSelected
            ? (portColor === '#22c55e' ? 'arrowHeadGreen' : 'arrowHeadBlue')
            : 'arrowHead';

        const path = bezier(from.x, from.y, to.x, to.y);

        // Hit area
        const hit = document.createElementNS('http://www.w3.org/2000/svg','path');
        hit.setAttribute('d', path);
        hit.setAttribute('fill','none');
        hit.setAttribute('stroke','transparent');
        hit.setAttribute('stroke-width','16');
        hit.style.cursor = 'pointer';
        hit.style.pointerEvents = 'stroke';
        hit.title = 'Клікни щоб видалити';
        // Підсвітка при наведенні
        hit.addEventListener('mouseenter', () => {
            line.setAttribute('stroke', '#ef4444');
            line.setAttribute('stroke-width', '2.5');
        });
        hit.addEventListener('mouseleave', () => {
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', '2');
        });
        hit.addEventListener('click', e => {
            e.stopPropagation();
            pushHistory();
            fc.edges = fc.edges.filter(ed => ed.id !== edge.id);
            renderEdges();
        });

        const line = document.createElementNS('http://www.w3.org/2000/svg','path');
        line.setAttribute('d', path);
        line.setAttribute('fill','none');
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width','2.5');
        line.setAttribute('marker-end', `url(#${markerId})`);

        // Port label on edge — pill з фоном, позиціонується біля порту виходу
        let portLabel = PORT_LABELS[edge.fromPort];
        if (!portLabel && edge.fromPort?.startsWith('btn_')) {
            const btnIdx = parseInt(edge.fromPort.replace('btn_', ''), 10);
            portLabel = fromNode.config?.buttons?.[btnIdx]?.label || `Кнопка ${btnIdx + 1}`;
        }
        if (portLabel) {
            const lx = from.x + 16;
            const ly = from.y - 8;
            const fontSize = 9;
            const approxW = portLabel.length * 5.4 + 10;

            const pill = document.createElementNS('http://www.w3.org/2000/svg','rect');
            pill.setAttribute('x', lx - approxW/2);
            pill.setAttribute('y', ly - fontSize - 1);
            pill.setAttribute('width', approxW);
            pill.setAttribute('height', fontSize + 6);
            pill.setAttribute('rx', '4');
            pill.setAttribute('fill', 'white');
            pill.setAttribute('stroke', color);
            pill.setAttribute('stroke-width', '1');
            pill.style.pointerEvents = 'none';

            const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
            txt.setAttribute('x', lx);
            txt.setAttribute('y', ly);
            txt.setAttribute('text-anchor','middle');
            txt.setAttribute('fill', color);
            txt.setAttribute('font-size', String(fontSize));
            txt.setAttribute('font-weight', '600');
            txt.setAttribute('font-family','system-ui,sans-serif');
            txt.style.pointerEvents = 'none';
            txt.textContent = portLabel;
            g.appendChild(pill);
            g.appendChild(txt);
        }

        g.appendChild(hit);
        g.appendChild(line);
    });
}

function getOutPortPos(node, portId) {
    const outputs = node.outputs || NODES[node.type]?.outputs || ['out'];
    const idx = outputs.indexOf(portId);
    const total = outputs.length;
    const topPct = total === 1 ? 0.5 : 0.25 + (idx / (total-1)) * 0.5;
    const h = getNodeHeight(node);
    return { x: node.x + W, y: node.y + h * topPct };
}

function getInPortPos(node) {
    const h = getNodeHeight(node);
    return { x: node.x, y: node.y + h * 0.5 };
}

function getNodeHeight(node) {
    const preview = getPreview(node);
    const outputCount = (node.outputs || NODES[node.type]?.outputs || ['out']).length;
    return 36 + 40 + (preview ? Math.ceil(preview.length/28)*16 : 0) + Math.max(0,(outputCount-1)*10);
}

function bezier(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (dx >= 40) {
        // Ціль справа — стандартна S-крива
        const cp = Math.max(60, dx * 0.5);
        return `M${x1},${y1} C${x1+cp},${y1} ${x2-cp},${y2} ${x2},${y2}`;
    } else if (dx >= -40) {
        // Ціль майже по вертикалі — пряма з невеликим відхиленням
        const cpY = Math.max(60, absDy * 0.5);
        return `M${x1},${y1} C${x1},${y1+cpY} ${x2},${y2-cpY} ${x2},${y2}`;
    } else {
        // Ціль зліва — обгинаємо через зовнішній бік (не через вузли)
        const offsetX = Math.min(120, absDx * 0.6 + 60);
        const offsetY = Math.max(80, absDy * 0.3 + 60);
        // Виходимо вправо від source, заходимо вправо до target
        return `M${x1},${y1} C${x1+offsetX},${y1} ${x1+offsetX},${y2+offsetY} ${(x1+x2)/2},${y2+offsetY} C${x2-offsetX},${y2+offsetY} ${x2-offsetX},${y2} ${x2},${y2}`;
    }
}

// ── Background Dots ────────────────────────────────────────
function drawBg() {
    const cnv = document.getElementById('fcBgCanvas');
    if (!cnv) return;
    const wrap = document.getElementById('fcCanvasWrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    cnv.width = rect.width;
    cnv.height = rect.height;
    const ctx = cnv.getContext('2d');
    ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.fillStyle = '#d1d5db';
    const spacing = 24 * fc.scale;
    const offsetX = fc.pan.x % spacing;
    const offsetY = fc.pan.y % spacing;
    const r = Math.max(1, fc.scale * 1.2);
    for (let x = offsetX; x < cnv.width + spacing; x += spacing) {
        for (let y = offsetY; y < cnv.height + spacing; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI*2);
            ctx.fill();
        }
    }
}

// ── Transform ──────────────────────────────────────────────
function applyTransform() {
    applyTransformToNodes();
    renderEdges();
    drawBg();
    const pct = document.getElementById('fcZoomPct');
    if (pct) pct.textContent = Math.round(fc.scale*100)+'%';
}

function doZoom(delta, cx, cy) {
    const wrap = document.getElementById('fcCanvasWrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    cx = cx ?? rect.width/2;
    cy = cy ?? rect.height/2;
    const oldScale = fc.scale;
    fc.scale = Math.max(0.25, Math.min(2, fc.scale + delta));
    const ds = fc.scale/oldScale - 1;
    fc.pan.x -= (cx - fc.pan.x) * ds;
    fc.pan.y -= (cy - fc.pan.y) * ds;
    applyTransform();
}

function fitView() {
    if (!fc.nodes.length) return;
    const wrap = document.getElementById('fcCanvasWrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const pad = 80;
    const minX = Math.min(...fc.nodes.map(n=>n.x));
    const minY = Math.min(...fc.nodes.map(n=>n.y));
    const maxX = Math.max(...fc.nodes.map(n=>n.x+W));
    const maxY = Math.max(...fc.nodes.map(n=>n.y+getNodeHeight(n)));
    const scaleX = (rect.width-pad*2) / (maxX-minX||1);
    const scaleY = (rect.height-pad*2) / (maxY-minY||1);
    fc.scale = Math.min(scaleX, scaleY, 1.3);
    fc.pan.x = -minX*fc.scale + (rect.width-(maxX-minX)*fc.scale)/2;
    fc.pan.y = -minY*fc.scale + (rect.height-(maxY-minY)*fc.scale)/2;
    applyTransform();
}

// ── Mouse Events ───────────────────────────────────────────
function onNodeMouseDown(e, nodeId) {
    if (e.button !== 0) return;
    e.stopPropagation();

    // Select
    if (fc.selected !== nodeId) {
        fc.selected = nodeId;
        renderAll();
        renderPropPanel();
    }

    // Start drag
    fc.dragging = {
        nodeId,
        startMX: e.clientX,
        startMY: e.clientY,
        origX: fc.nodes.find(n=>n.id===nodeId)?.x || 0,
        origY: fc.nodes.find(n=>n.id===nodeId)?.y || 0,
    };
}

function onPortMouseDown(e, nodeId, portId) {
    if (e.button !== 0) return;
    e.stopPropagation();
    const wrap = document.getElementById('fcCanvasWrap');
    const rect = wrap.getBoundingClientRect();
    const node = fc.nodes.find(n=>n.id===nodeId);
    if (!node) return;
    const pos = getOutPortPos(node, portId);
    const sx = pos.x * fc.scale + fc.pan.x;
    const sy = pos.y * fc.scale + fc.pan.y;
    fc.connecting = {fromNode:nodeId, fromPort:portId, startX:sx, startY:sy};
}

function onWrapMouseDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest('[data-nid]')) return;
    if (e.target.closest('[data-port-out]')) return;
    if (e.target.closest('[data-port-in]')) return;

    // Deselect
    if (fc.selected) {
        fc.selected = null;
        renderAll();
        renderPropPanel();
    }

    // Pan
    fc.panning = true;
    fc.panStart = { x: e.clientX - fc.pan.x, y: e.clientY - fc.pan.y };
    const wrap = document.getElementById('fcCanvasWrap');
    if (wrap) wrap.style.cursor = 'grabbing';
}

function onWrapMouseMove(e) {
    if (fc.panning && fc.panStart) {
        fc.pan.x = e.clientX - fc.panStart.x;
        fc.pan.y = e.clientY - fc.panStart.y;
        applyTransform();
        return;
    }

    if (fc.dragging) {
        const dx = (e.clientX - fc.dragging.startMX) / fc.scale;
        const dy = (e.clientY - fc.dragging.startMY) / fc.scale;
        const node = fc.nodes.find(n=>n.id===fc.dragging.nodeId);
        if (node) {
            node.x = snap(fc.dragging.origX + dx);
            node.y = snap(fc.dragging.origY + dy);
            // Move only the specific node div (perf)
            const el = document.getElementById(`fcn_${node.id}`);
            if (el) { el.style.left = node.x+'px'; el.style.top = node.y+'px'; }
            renderEdges();
        }
        return;
    }

    if (fc.connecting) {
        const wrap = document.getElementById('fcCanvasWrap');
        const rect = wrap.getBoundingClientRect();
        const tx = (e.clientX - rect.left - fc.pan.x) / fc.scale;
        const ty = (e.clientY - rect.top - fc.pan.y) / fc.scale;
        const from = getOutPortPos(fc.nodes.find(n=>n.id===fc.connecting.fromNode), fc.connecting.fromPort);
        const tempEdge = document.getElementById('fcTempEdge');
        if (tempEdge) {
            tempEdge.style.display = '';
            tempEdge.setAttribute('d', bezier(from.x, from.y, tx, ty));
            tempEdge.setAttribute('transform', `translate(${fc.pan.x},${fc.pan.y}) scale(${fc.scale})`);
        }
        return;
    }
}

function onWrapMouseUp(e) {
    const wrap = document.getElementById('fcCanvasWrap');
    if (wrap) wrap.style.cursor = 'grab';

    if (fc.panning) { fc.panning = false; fc.panStart = null; return; }

    if (fc.dragging) {
        pushHistory();
        fc.dragging = null;
        return;
    }

    if (fc.connecting) {
        const tempEdge = document.getElementById('fcTempEdge');
        if (tempEdge) tempEdge.style.display = 'none';

        // Find target node under mouse
        const wrap = document.getElementById('fcCanvasWrap');
        const rect = wrap.getBoundingClientRect();
        const mx = (e.clientX - rect.left - fc.pan.x) / fc.scale;
        const my = (e.clientY - rect.top - fc.pan.y) / fc.scale;

        const target = fc.nodes.find(n => {
            if (n.id === fc.connecting.fromNode) return false;
            const h = getNodeHeight(n);
            return mx >= n.x-20 && mx <= n.x+W+20 && my >= n.y-20 && my <= n.y+h+20;
        });

        if (target) {
            // Remove existing edge from same port
            pushHistory();
            fc.edges = fc.edges.filter(ed => !(ed.fromNode===fc.connecting.fromNode && ed.fromPort===fc.connecting.fromPort));
            fc.edges.push({
                id: `e_${fc.connecting.fromNode}_${fc.connecting.fromPort}_${Date.now()}`,
                fromNode: fc.connecting.fromNode,
                fromPort: fc.connecting.fromPort,
                toNode: target.id,
                toPort: 'in',
            });
            renderAll();
        }

        fc.connecting = null;
    }
}

function onWrapWheel(e) {
    e.preventDefault();
    const wrap = document.getElementById('fcCanvasWrap');
    const rect = wrap.getBoundingClientRect();
    doZoom(e.deltaY > 0 ? -0.08 : 0.08, e.clientX-rect.left, e.clientY-rect.top);
}

function onWrapDblClick(e) {
    // Dblclick empty canvas <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span> add message node
    if (e.target.closest('[data-nid]')) return;
    const wrap = document.getElementById('fcCanvasWrap');
    const rect = wrap.getBoundingClientRect();
    const cx = (e.clientX - rect.left - fc.pan.x) / fc.scale;
    const cy = (e.clientY - rect.top - fc.pan.y) / fc.scale;
    addNode('message', snap(cx - W/2), snap(cy - 40));
}

// ── Add Node ───────────────────────────────────────────────
function addNode(type, x, y) {
    pushHistory();
    const id = `node_${Date.now()}`;
    const cfg = NODES[type] || NODES.message;
    const node = {
        id, type,
        x: x ?? 200,
        y: y ?? 200,
        config: {id, type, name: cfg.label},
        outputs: [...(cfg.outputs || ['out'])],
    };
    fc.nodes.push(node);
    fc.selected = id;
    renderAll();
    renderPropPanel();
}
window.fcAddNode = addNode;

// ── AI Воронка Modal ───────────────────────────────────────
window.fcSetActionType = function(val) {
    if (!fc.selected) return;
    const node = fc.nodes.find(n => n.id === fc.selected);
    if (!node) return;
    node.config.actionType = val;
    renderPropPanel();
};

window.fcOpenAiFunnelModal = function() {
    if (document.getElementById('fcAiFunnelModal')) return;
    const modal = document.createElement('div');
    modal.id = 'fcAiFunnelModal';
    modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.7);
        z-index:9999;display:flex;align-items:center;justify-content:center;`;
    modal.innerHTML = `
        <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;
            padding:24px;width:520px;max-height:80vh;overflow-y:auto;position:relative;">
            <button onclick="document.getElementById('fcAiFunnelModal').remove()"
                style="position:absolute;top:12px;right:12px;background:none;border:none;
                color:#94a3b8;font-size:20px;cursor:pointer;">✕</button>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
                <div style="width:36px;height:36px;border-radius:9px;
                    background:linear-gradient(135deg,#22c55e,#8b5cf6);
                    display:flex;align-items:center;justify-content:center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18 2v4h4"/></svg>
                </div>
                <div>
                    <div style="color:white;font-weight:700;font-size:15px;">AI Асистент воронки</div>
                    <div style="color:#64748b;font-size:11px;">Опиши бізнес — отримай готову воронку</div>
                </div>
            </div>
            <div style="margin-bottom:12px;">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">Опишіть ваш бізнес і ціль воронки:</div>
                <textarea id="fcAiFunnelInput" rows="4"
                    placeholder="Наприклад: Стоматологічна клініка в Києві, 3 лікарі. Ціль — записати людину на безкоштовну консультацію через Telegram бот. Аудиторія — люди 25-45 років."
                    style="width:100%;padding:10px;background:#0f172a;border:1px solid #334155;
                    border-radius:8px;color:white;font-size:12px;box-sizing:border-box;resize:vertical;"></textarea>
            </div>
            <div style="display:flex;gap:8px;margin-bottom:12px;">
                <button onclick="fcRunAiFunnel('funnel')"
                    style="flex:1;padding:10px;background:linear-gradient(135deg,#22c55e,#16a34a);
                    border:none;border-radius:8px;color:white;font-weight:600;font-size:12px;cursor:pointer;">
                    Згенерувати воронку
                </button>
                <button onclick="fcRunAiFunnel('prompt')"
                    style="flex:1;padding:10px;background:#334155;
                    border:none;border-radius:8px;color:#94a3b8;font-weight:600;font-size:12px;cursor:pointer;">
                    Промпт для AI вузла
                </button>
            </div>
            <div id="fcAiFunnelResult" style="display:none;">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">Результат:</div>
                <div id="fcAiFunnelResultText"
                    style="background:#0f172a;border:1px solid #334155;border-radius:8px;
                    padding:12px;color:#e2e8f0;font-size:12px;white-space:pre-wrap;
                    max-height:300px;overflow-y:auto;line-height:1.6;"></div>
                <button onclick="fcCopyFunnelResult()"
                    style="margin-top:8px;width:100%;padding:8px;background:#22c55e22;
                    border:1px solid #22c55e;border-radius:8px;color:#22c55e;
                    font-size:11px;cursor:pointer;">Копіювати результат</button>
            </div>
            <div id="fcAiFunnelLoader" style="display:none;text-align:center;padding:20px;color:#64748b;font-size:12px;">
                Генерую воронку...
            </div>
        </div>`;
    document.body.appendChild(modal);
};

window.fcRunAiFunnel = async function(mode) {
    const input = document.getElementById('fcAiFunnelInput')?.value?.trim();
    if (!input) return alert('Опишіть бізнес');
    document.getElementById('fcAiFunnelLoader').style.display = 'block';
    document.getElementById('fcAiFunnelResult').style.display = 'none';

    const systemPrompt = mode === 'funnel'
        ? `Ти — експерт з Telegram маркетингу і воронок продажів. 
Твоя задача — написати готову воронку повідомлень для Telegram бота.
Структура воронки:
1. Привітання + цінність (1 повідомлення)
2. Кваліфікаційне питання (з кнопками відповіді)
3. Наступне питання (з кнопками)
4. Презентація оферу / результату
5. Заклик до дії (CTA)

Для кожного повідомлення пиши:
[ПОВІДОМЛЕННЯ 1]
Текст: ...
Кнопки: Варіант 1 | Варіант 2

Пиши коротко, без води. Мова — українська.`
        : `Ти — експерт з AI асистентів для бізнесу.
Напиши системний промпт для AI бота в Telegram.
Промпт має:
- Визначати роль і ціль бота
- Описувати стиль спілкування
- Містити правила кваліфікації клієнта
- Вказувати як збирати контакти
- Як пропонувати продукт/послугу
Формат: готовий текст промпту який можна вставити в поле "Системний промпт" AI вузла.
Мова — українська.`;

    try {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 2000,
                system: systemPrompt,
                messages: [{ role: 'user', content: input }]
            })
        });
        const data = await resp.json();
        const result = data.content?.[0]?.text || 'Помилка генерації';
        document.getElementById('fcAiFunnelResultText').textContent = result;
        document.getElementById('fcAiFunnelResult').style.display = 'block';
    } catch(e) {
        document.getElementById('fcAiFunnelResultText').textContent = 'Помилка: ' + e.message;
        document.getElementById('fcAiFunnelResult').style.display = 'block';
    }
    document.getElementById('fcAiFunnelLoader').style.display = 'none';
};

window.fcCopyFunnelResult = function() {
    const text = document.getElementById('fcAiFunnelResultText')?.textContent || '';
    navigator.clipboard.writeText(text).then(() => showToast('Скопійовано!', 'success'));
};

// ── Керування кнопками в повідомленні ──────────────────────
window.fcAddButton = function() {
    const node = fc.nodes.find(n => n.id === fc.selected);
    if (!node) return;
    pushHistory();
    if (!node.config.buttons) node.config.buttons = [];
    node.config.buttons.push({ id: `btn_${node.config.buttons.length}`, label: '', url: null });
    node.outputs = ['out', ...node.config.buttons.map((_,i) => `btn_${i}`)];
    renderPropPanel();
    renderNodes();
    renderEdges();
    // Фокус на нове поле
    setTimeout(() => {
        const inp = document.getElementById(`fcp_btn_label_${node.config.buttons.length - 1}`);
        if (inp) inp.focus();
    }, 50);
};

window.fcUpdateButton = function(idx) {
    const node = fc.nodes.find(n => n.id === fc.selected);
    if (!node || !node.config.buttons?.[idx]) return;
    const labelEl = document.getElementById(`fcp_btn_label_${idx}`);
    const urlEl = document.getElementById(`fcp_btn_url_${idx}`);
    node.config.buttons[idx].label = labelEl?.value || '';
    node.config.buttons[idx].url = urlEl?.value?.trim() || null;
    renderNodes(); // оновити картку без повного перемальовування панелі
};

window.fcEditButton = function(idx) {
    // Більше не потрібен — редагування inline
};

window.fcRemoveButton = function(idx) {
    const node = fc.nodes.find(n => n.id === fc.selected);
    if (!node || !node.config.buttons) return;
    pushHistory();
    // Видаляємо з'єднання цього порту
    const portId = `btn_${idx}`;
    fc.edges = fc.edges.filter(e => !(e.fromNode === node.id && e.fromPort === portId));
    node.config.buttons.splice(idx, 1);
    // Перенумеровуємо
    node.config.buttons = node.config.buttons.map((b,i) => ({...b, id:`btn_${i}`}));
    node.outputs = node.config.buttons.length > 0
        ? ['out', ...node.config.buttons.map((_,i) => `btn_${i}`)]
        : ['out'];
    renderPropPanel();
    renderNodes();
    renderEdges();
};

window.fcSetAiProvider = function(provider) {
    if (!fc.selectedNode) return;
    // Зберігаємо поточний ключ перед перемалюванням
    const currentKey = document.getElementById('fcp_aiApiKey')?.value || '';
    fc.selectedNode.config.aiProvider = provider;
    fc.selectedNode.config.aiApiKey = currentKey;
    renderPropsPanel(fc.selectedNode);
};

// ── Property Panel ─────────────────────────────────────────
function renderPropPanel() {
    const panel = document.getElementById('fcPropPanel');
    if (!panel) return;

    if (!fc.selected) {
        panel.innerHTML = `<div style="text-align:center;padding:48px 16px;color:#475569;">
            <div style="font-size:32px;margin-bottom:8px;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19V5"/><path d="m5 12 7-7 7 7"/></svg></span></div>
            <div style="font-size:13px;">Клікніть на вузол<br>для редагування</div>
        </div>`;
        return;
    }

    const node = fc.nodes.find(n=>n.id===fc.selected);
    if (!node) return;
    const cfg = NODES[node.type] || NODES.message;
    const d = node.config || {};

    const fld = (label, html) => `
        <div style="margin-bottom:12px;">
            <div style="font-size:10px;font-weight:700;color:#64748b;
                text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">${label}</div>
            ${html}
        </div>`;

    const inp = (id, val, ph='') => `<input id="fcp_${id}"
        value="${escAttr(val||'')}" placeholder="${ph}"
        style="width:100%;padding:8px;background:#0f172a;border:1px solid #334155;
        border-radius:7px;color:white;font-size:12px;box-sizing:border-box;">`;

    const ta = (id, val, ph='', rows=4) => `<textarea id="fcp_${id}"
        placeholder="${ph}" rows="${rows}"
        style="width:100%;padding:8px;background:#0f172a;border:1px solid #334155;
        border-radius:7px;color:white;font-size:12px;box-sizing:border-box;resize:vertical;"
        >${esc(val||'')}</textarea>`;

    const sel = (id, options, cur) => `<select id="fcp_${id}"
        style="width:100%;padding:8px;background:#0f172a;border:1px solid #334155;
        border-radius:7px;color:white;font-size:12px;box-sizing:border-box;">
        ${options.map(([v,l])=>`<option value="${v}" ${cur===v?'selected':''}>${l}</option>`).join('')}
    </select>`;

    let fields = '';

    switch (node.type) {
        case 'start':
            fields = fld('Тригер (ключове слово)', inp('triggerKeyword', d.triggerKeyword, '/start'));
            break;
        case 'message': {
            const btns = d.buttons || [];
            const btnRows = btns.map((b,i) => `
                <div style="background:#0f172a;border:1px solid #334155;border-radius:8px;
                    padding:8px;margin-bottom:8px;">
                    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
                        <div style="flex:1;">
                            <div style="font-size:9px;color:#64748b;margin-bottom:3px;">ТЕКСТ КНОПКИ</div>
                            <input id="fcp_btn_label_${i}" value="${escAttr(b.label||'')}"
                                placeholder="Наприклад: Продовжити"
                                style="width:100%;padding:6px 8px;background:#1e293b;border:1px solid #475569;
                                border-radius:6px;color:white;font-size:12px;box-sizing:border-box;"
                                oninput="fcUpdateButton(${i})">
                        </div>
                        <button onclick="fcRemoveButton(${i})"
                            style="padding:6px 8px;background:#fef2f2;border:1px solid #fecaca;
                            border-radius:6px;cursor:pointer;font-size:11px;color:#ef4444;
                            flex-shrink:0;margin-top:16px;">✕</button>
                    </div>
                    <div>
                        <div style="font-size:9px;color:#64748b;margin-bottom:3px;">
                            URL ПОСИЛАННЯ <span style="color:#475569;">(необов'язково — для кнопки-посилання)</span>
                        </div>
                        <input id="fcp_btn_url_${i}" value="${escAttr(b.url||'')}"
                            placeholder="https://..."
                            style="width:100%;padding:6px 8px;background:#1e293b;border:1px solid #475569;
                            border-radius:6px;color:#38bdf8;font-size:12px;box-sizing:border-box;"
                            oninput="fcUpdateButton(${i})">
                    </div>
                </div>`).join('');

            fields = `
                <div style="margin-bottom:12px;">
                    <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">ПОВІДОМЛЕННЯ</div>
                    <textarea id="fcp_text" rows="5" placeholder="Введіть текст повідомлення..."
                        style="width:100%;padding:10px;background:#0f172a;border:1px solid #334155;
                        border-radius:7px;color:white;font-size:13px;resize:vertical;box-sizing:border-box;
                        line-height:1.5;">${escAttr(d.text||'')}</textarea>
                </div>
                <div style="margin-bottom:12px;">
                    <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">КНОПКИ</div>
                    <div id="fcBtnList">${btnRows}</div>
                    <button onclick="fcAddButton()"
                        style="width:100%;padding:8px;background:transparent;border:1px dashed #334155;
                        border-radius:8px;color:#64748b;font-size:12px;cursor:pointer;
                        transition:all 0.15s;"
                        onmouseover="this.style.borderColor='#22c55e';this.style.color='#22c55e';"
                        onmouseout="this.style.borderColor='#334155';this.style.color='#64748b';">
                        + Додати кнопку
                    </button>
                </div>
                <div style="margin-bottom:12px;">
                    <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">ЗБЕРЕГТИ ВІДПОВІДЬ У ЗМІННУ</div>
                    ${inp('saveAs', d.saveAs, 'напр: phone')}
                </div>`;
            break;
        }
        case 'action': {
            const aType = d.actionType || 'set_var';
            const notifyFields = aType === 'notify_admin' ? `
                <div style="background:#0f172a;border:1px solid #22c55e33;border-radius:10px;padding:10px;margin-top:8px;">
                    <div style="font-size:10px;color:#22c55e;font-weight:700;margin-bottom:8px;text-transform:uppercase;">Налаштування сповіщення</div>
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Chat ID менеджера
                        <a href="https://t.me/userinfobot" target="_blank" style="color:#3b82f6;margin-left:4px;font-size:9px;">Дізнатись ID →</a>
                    </div>
                    <input id="fcp_notifyChatId" type="text" value="${d.notifyChatId||''}"
                        placeholder="123456789"
                        style="width:100%;padding:8px;background:#1e293b;border:1px solid #334155;
                        border-radius:7px;color:white;font-size:11px;box-sizing:border-box;margin-bottom:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Назва воронки</div>
                    <input id="fcp_notifyFlowName" type="text" value="${d.notifyFlowName||''}"
                        placeholder="напр: МК Бізнес 60 хвилин"
                        style="width:100%;padding:8px;background:#1e293b;border:1px solid #334155;
                        border-radius:7px;color:white;font-size:11px;box-sizing:border-box;margin-bottom:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Текст повідомлення</div>
                    <textarea id="fcp_notifyText" rows="3"
                        placeholder="Новий лід: {{senderName}} розпочав діалог"
                        style="width:100%;padding:8px;background:#1e293b;border:1px solid #334155;
                        border-radius:7px;color:white;font-size:11px;box-sizing:border-box;resize:vertical;">${d.notifyText||'🔔 Новий лід: {{senderName}}\nКанал: {{channel}}\nВоронка: {{flowName}}\nДані: {{ai_response}}'}</textarea>
                </div>` : fld('Параметри (JSON)', ta('actionPayload', d.actionPayload, '{"variable":"phone","value":"{{input}}"}', 3));
            const actionSel = `<select id="fcp_actionType"
                onchange="fcSetActionType(this.value)"
                style="width:100%;padding:8px;background:#0f172a;border:1px solid #334155;
                border-radius:7px;color:white;font-size:12px;box-sizing:border-box;">
                ${[['set_var','Встановити змінну'],['set_tag','Додати тег'],
                   ['remove_tag','Видалити тег'],['notify_admin','Сповістити менеджера'],
                   ['start_flow','Запустити інший флоу'],['stop_flow','Зупинити флоу']]
                   .map(([v,l])=>`<option value="${v}" ${aType===v?'selected':''}>${l}</option>`).join('')}
            </select>`;
            fields = fld('Тип дії', actionSel) + notifyFields;
            break;
        }
        case 'filter':
            fields = fld('Змінна', inp('condVar', d.condVar, 'phone'))
                + fld('Оператор', sel('condOp',
                    [['=','= Дорівнює'],['!=','≠ Не дорівнює'],
                     ['contains','Містить'],['exists','Існує'],['!exists','Не існує'],
                     ['>','> Більше'],['<','< Менше']], d.condOp||'='))
                + fld('Значення', inp('condVal', d.condVal, ''))
                + `<div style="font-size:10px;color:#64748b;margin-top:4px;">
                    <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"/></svg></span> Вихід "Так" <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span> умова виконується<br>
                    <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"/></svg></span> Вихід "Ні" <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span> умова не виконується</div>`;
            break;
        case 'pause':
            fields = fld('Затримка', `<div style="display:flex;gap:6px;">
                <input id="fcp_delay" type="number" value="${d.delay||5}" min="1"
                    style="flex:1;padding:8px;background:#0f172a;border:1px solid #334155;
                    border-radius:7px;color:white;font-size:12px;">
                ${sel('delayUnit',[['seconds','секунд'],['minutes','хвилин'],['hours','годин'],['days','днів']], d.delayUnit||'seconds')}
                </div>`)
                + `<div style="font-size:10px;color:#64748b;margin-top:4px;">
                    Продовжувати ланцюжок: Завжди</div>`;
            break;
        case 'ai': {
            const aiProvider = d.aiProvider || 'openai';

            // Тільки синхронне читання кешу (await заборонено в switch/case)
            const fallbackModels = {
                openai:    [
                    ['gpt-5-mini-2025-08-07','GPT-5 mini (швидкий, дешевий) ⭐'],
                    ['gpt-5.4','GPT-5.4 (найрозумніший)'],
                    ['gpt-4.1-mini','GPT-4.1 mini (швидкий)'],
                    ['gpt-4.1','GPT-4.1 (розумний)'],
                    ['gpt-4o-mini','GPT-4o mini (стабільний)'],
                    ['gpt-4o','GPT-4o'],
                    ['gpt-4.1-nano','GPT-4.1 nano (найдешевший)'],
                    ['o4-mini','o4-mini (мислить)'],
                    ['o3','o3 (глибоке мислення)'],
                    ['deepseek-chat','Deepseek Chat (дешевий)'],
                ],
                anthropic: [
                    ['claude-sonnet-4-6','Claude Sonnet 4.6 NEW'],
                    ['claude-opus-4-6','Claude Opus 4.6 NEW'],
                    ['claude-haiku-4-5-20251001','Claude Haiku 4.5 (швидкий)'],
                    ['claude-sonnet-4-5','Claude Sonnet 4.5'],
                    ['claude-opus-4-5','Claude Opus 4.5'],
                ],
                google:    [
                    ['gemini-2.5-pro','Gemini 2.5 Pro NEW'],
                    ['gemini-2.0-flash','Gemini 2.0 Flash (швидкий)'],
                    ['gemini-1.5-pro','Gemini 1.5 Pro'],
                ],
            };
            const allModels = window._cachedAiModels || fallbackModels;
            const modelOptions = allModels[aiProvider] || fallbackModels[aiProvider] || fallbackModels.openai;

            // Якщо кеш порожній — завантажуємо async і перемалюємо
            if (!window._cachedAiModels) {
                firebase.firestore().collection('settings').doc('aiModels').get()
                    .then(snap => {
                        if (snap.exists) {
                            window._cachedAiModels = snap.data();
                            // Перемалюємо панель з новими моделями
                            if (fc.selected) renderPropPanel();
                        }
                    }).catch(() => {});
            }

            // Спробуємо підтягнути збережений ключ компанії
            const savedKey = d.aiApiKey || '';

            fields = `<div style="background:#0f172a;border:1px solid #22c55e33;border-radius:10px;padding:10px;margin-bottom:10px;">
                <div style="font-size:10px;color:#22c55e;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">🔑 AI Провайдер</div>
                <div style="display:flex;gap:6px;margin-bottom:8px;">
                    ${['openai','anthropic','google'].map(p => `
                        <button onclick="fcSetAiProvider('${p}')"
                            style="flex:1;padding:5px 4px;border:1px solid ${aiProvider===p?'#22c55e':'#334155'};
                            border-radius:7px;background:${aiProvider===p?'#22c55e22':'transparent'};
                            color:${aiProvider===p?'#22c55e':'#94a3b8'};font-size:10px;font-weight:600;cursor:pointer;">
                            ${p==='openai'?'OpenAI':p==='anthropic'?'Anthropic':'Google'}
                        </button>`).join('')}
                </div>
                <div style="margin-bottom:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">
                        API Ключ
                        <a href="${aiProvider==='openai'?'https://platform.openai.com/api-keys':aiProvider==='anthropic'?'https://console.anthropic.com/settings/keys':'https://aistudio.google.com/app/apikey'}"
                            target="_blank" style="color:#3b82f6;margin-left:4px;font-size:9px;">Отримати ключ →</a>
                    </div>
                    <input id="fcp_aiApiKey" type="password" value="${savedKey}"
                        placeholder="${aiProvider==='openai'?'sk-...':aiProvider==='anthropic'?'sk-ant-...':'AIza...'}"
                        style="width:100%;padding:8px;background:#1e293b;border:1px solid #334155;
                        border-radius:7px;color:white;font-size:11px;box-sizing:border-box;">
                    <div style="font-size:9px;color:#475569;margin-top:3px;">
                        Зберігається тільки для цього ланцюга
                    </div>
                </div>
            </div>`
                + fld('Системний промпт', ta('aiSystem', d.aiSystem, 'Ти — помічник компанії {{company_name}}. Відповідай коротко та по суті українською мовою.', 4))
                + fld('Модель', sel('aiModel', modelOptions, d.aiModel || modelOptions[0][0]))
                + fld('Зберегти відповідь у змінну', inp('saveAs', d.saveAs, 'ai_response'))
                + fld('Запасна відповідь', inp('fallback', d.fallback, 'Вибачте, спробуйте пізніше'))
                + `<div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:8px;margin-top:8px;">
                    <div style="font-size:10px;color:#64748b;line-height:1.5;">
                        <b style="color:#94a3b8;">Як використати:</b><br>
                        1. Обери провайдера (OpenAI / Anthropic / Google)<br>
                        2. Вставте API ключ з сайту провайдера<br>
                        3. Напиши системний промпт — хто цей бот<br>
                        4. Обери модель — mini/haiku для швидких відповідей
                    </div>
                </div>`;
            break;
        }
        case 'api':
            fields = fld('Метод + URL', `<div style="display:flex;gap:6px;">
                ${sel('apiMethod',[['POST','POST'],['GET','GET'],['PUT','PUT'],['PATCH','PATCH'],['DELETE','DELETE']], d.apiMethod||'POST')}
                ${inp('apiUrl', d.apiUrl, 'https://api.example.com/lead')}
                </div>`)
                + fld('Headers (JSON)', ta('apiHeaders', d.apiHeaders, '{"Content-Type":"application/json"}', 2))
                + fld('Body (JSON шаблон)', ta('apiBody', d.apiBody, '{"phone":"{{phone}}","name":"{{name}}"}', 3))
                + fld('Зберегти response у змінну', inp('saveAs', d.saveAs, 'api_response'));
            break;
        case 'sheets':
            fields = fld('Spreadsheet ID', inp('sheetsId', d.sheetsId, '1BxiMV...'))
                + fld('Назва листа', inp('sheetsName', d.sheetsName, 'Leads'))
                + fld('Маппінг колонок (JSON)', ta('sheetsMapping', d.sheetsMapping,
                    '{"A":"{{name}}","B":"{{phone}}","C":"{{date}}"}', 3));
            break;
        case 'random':
            fields = fld('Розподіл %', `<div style="display:flex;gap:6px;align-items:center;">
                <span style="color:#94a3b8;font-size:12px;">А:</span>
                <input id="fcp_splitA" type="number" value="${d.splitA||50}" min="1" max="99"
                    style="width:60px;padding:8px;background:#0f172a;border:1px solid #334155;
                    border-radius:7px;color:white;font-size:12px;">
                <span style="color:#94a3b8;font-size:12px;">% · Б:</span>
                <input id="fcp_splitB" type="number" value="${d.splitB||50}" min="1" max="99"
                    style="width:60px;padding:8px;background:#0f172a;border:1px solid #334155;
                    border-radius:7px;color:white;font-size:12px;">
                <span style="color:#94a3b8;font-size:12px;">%</span>
                </div>`);
            break;
        case 'repeat':
            fields = fld('Кількість повторів', inp('repeatCount', d.repeatCount, '3'))
                + fld('Інтервал (секунди)', inp('repeatInterval', d.repeatInterval, '60'))
                + fld('Умова виходу (змінна)', inp('exitVar', d.exitVar, 'confirmed'));
            break;
        case 'crm':
            fields = fld('Назва угоди', inp('dealTitle', d.dealTitle, 'Новий лід з бота'))
                + fld('Сума', inp('amount', d.amount, '0'))
                + fld('Воронка (pipeline ID)', inp('pipelineId', d.pipelineId, 'default'));
            break;
        case 'end':
            fields = fld('Фінальне повідомлення', ta('text', d.text, 'Дякуємо! Ми зв\'яжемось.', 2));
            break;
        default:
            fields = fld('Текст', ta('text', d.text, ''));
    }

    panel.innerHTML = `
        <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;
                padding-bottom:12px;border-bottom:1px solid #334155;">
                <div style="width:36px;height:36px;border-radius:8px;background:${cfg.color};
                    display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">
                    ${cfg.icon}
                </div>
                <div>
                    <div style="color:white;font-weight:700;font-size:14px;">${cfg.label}</div>
                    <div style="color:#475569;font-size:10px;">${node.id}</div>
                </div>
            </div>
            ${fields}
            <button onclick="fcApplyNodeData('${node.id}')"
                style="width:100%;padding:10px;background:#22c55e;border:none;border-radius:8px;
                color:white;cursor:pointer;font-weight:700;font-size:13px;margin-top:4px;">
                <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Застосувати
            </button>
            ${node.type !== 'start' ? `
            <button onclick="fcDeleteNode('${node.id}')"
                style="width:100%;padding:8px;background:transparent;border:1px solid #334155;
                border-radius:8px;color:#ef4444;cursor:pointer;font-size:12px;margin-top:6px;">
                Видалити вузол
            </button>` : ''}
        </div>`;
}

window.fcApplyNodeData = function(nodeId) {
    const node = fc.nodes.find(n=>n.id===nodeId);
    if (!node) return;
    pushHistory();
    const get = id => document.getElementById(`fcp_${id}`)?.value?.trim()||'';

    switch(node.type) {
        case 'start':
            node.config.triggerKeyword = get('triggerKeyword') || '/start';
            break;
        case 'message':
            node.config.text = get('text');
            node.config.saveAs = get('saveAs') || null;
            // Читаємо кнопки з inline полів
            if (node.config.buttons?.length) {
                node.config.buttons = node.config.buttons.map((b, i) => ({
                    ...b,
                    label: document.getElementById(`fcp_btn_label_${i}`)?.value || b.label || '',
                    url: document.getElementById(`fcp_btn_url_${i}`)?.value?.trim() || null,
                }));
            }
            node.outputs = (node.config.buttons||[]).length > 0
                ? ['out', ...(node.config.buttons||[]).map((_,i)=>`btn_${i}`)]
                : ['out'];
            break;
        case 'action':
            node.config.actionType = get('actionType');
            node.config.actionPayload = get('actionPayload');
            node.config.notifyChatId = document.getElementById('fcp_notifyChatId')?.value?.trim() || null;
            node.config.notifyText = document.getElementById('fcp_notifyText')?.value || null;
            node.config.notifyFlowName = document.getElementById('fcp_notifyFlowName')?.value?.trim() || null;
            break;
        case 'filter':
            node.config.condVar = get('condVar');
            node.config.condOp = get('condOp');
            node.config.condVal = get('condVal');
            break;
        case 'pause':
            node.config.delay = parseInt(get('delay'))||5;
            node.config.delayUnit = get('delayUnit');
            break;
        case 'ai':
            node.config.aiSystem = get('aiSystem');
            node.config.aiModel = get('aiModel');
            node.config.aiApiKey = get('aiApiKey') || null;
            node.config.aiProvider = get('aiProvider') || fc.selectedNode?.config?.aiProvider || 'openai';
            node.config.saveAs = get('saveAs') || null;
            node.config.fallback = get('fallback');
            break;
        case 'api':
            node.config.apiMethod = get('apiMethod');
            node.config.apiUrl = get('apiUrl');
            node.config.apiHeaders = get('apiHeaders');
            node.config.apiBody = get('apiBody');
            node.config.saveAs = get('saveAs') || null;
            break;
        case 'sheets':
            node.config.sheetsId = get('sheetsId');
            node.config.sheetsName = get('sheetsName');
            node.config.sheetsMapping = get('sheetsMapping');
            break;
        case 'random':
            node.config.splitA = parseInt(get('splitA'))||50;
            node.config.splitB = parseInt(get('splitB'))||50;
            break;
        case 'repeat':
            node.config.repeatCount = parseInt(get('repeatCount'))||3;
            node.config.repeatInterval = parseInt(get('repeatInterval'))||60;
            node.config.exitVar = get('exitVar');
            break;
        case 'crm':
            node.config.dealTitle = get('dealTitle');
            node.config.amount = parseFloat(get('amount'))||0;
            node.config.pipelineId = get('pipelineId');
            break;
        case 'end':
            node.config.text = get('text');
            break;
        default:
            node.config.text = get('text');
    }

    renderAll();
    renderPropPanel();
    // Автозберігаємо в Firestore після Застосувати
    saveFlow();
};

window.fcDeleteNode = function(nodeId) {
    if (!confirm('Видалити вузол?')) return;
    pushHistory();
    fc.nodes = fc.nodes.filter(n=>n.id!==nodeId);
    fc.edges = fc.edges.filter(e=>e.fromNode!==nodeId&&e.toNode!==nodeId);
    fc.selected = null;
    renderAll();
    renderPropPanel();
};

// ── Save ───────────────────────────────────────────────────
async function saveFlow() {
    const btn = document.getElementById('fcBtnSave');
    if (btn) btn.textContent = 'Збереження...';

    // Build canvasData (source of truth)
    const canvasData = {
        nodes: fc.nodes.map(n => ({ ...n.config, id:n.id, type:n.type, _x:n.x, _y:n.y, outputs:n.outputs, config:n.config||{} })),
        edges: fc.edges,
        version: Date.now(),
    };

    // Also build runtime nodes array (for webhook.js)
    const edgeMap = {};
    fc.edges.forEach(e => {
        if (!edgeMap[e.fromNode]) edgeMap[e.fromNode] = {};
        edgeMap[e.fromNode][e.fromPort] = e.toNode;
    });

    const startNode = fc.nodes.find(n=>n.type==='start');
    const triggerKeyword = startNode?.config?.triggerKeyword || '/start';
    const firstNodeId = startNode ? (edgeMap[startNode.id]?.out || null) : null;

    const runtimeNodes = fc.nodes
        .filter(n=>n.type!=='start')
        .map(n => {
            const ports = edgeMap[n.id] || {};
            const d = {...n.config, id:n.id, type:n.type, _x:n.x, _y:n.y, config:n.config||{}};
            if (n.type==='filter') { d.trueNode=ports.yes||null; d.falseNode=ports.no||null; }
            else if (n.type==='random') { d.branchA=ports.a||null; d.branchB=ports.b||null; }
            else if (n.type==='ai'||n.type==='api') { d.nextNode=ports.ok||ports.out||null; d.errorNode=ports.err||null; }
            else if (n.type==='message'&&n.config.buttons?.length) {
                d.nextNode = ports.out || null;
                d.options = (n.config.buttons||[]).map((b,i)=>({...b, nextNode:ports[`btn_${i}`]||null}));
            } else { d.nextNode=ports.out||null; }
            return d;
        });

    // Sort: first node connected to start goes first
    const ordered = firstNodeId
        ? [runtimeNodes.find(n=>n.id===firstNodeId), ...runtimeNodes.filter(n=>n.id!==firstNodeId)].filter(Boolean)
        : runtimeNodes;

    try {
        const saveRef = fc.botId
            ? firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('bots').doc(fc.botId).collection('flows').doc(fc.flowId)
            : firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('flows').doc(fc.flowId);

        // Firestore не приймає undefined — замінюємо на null
        const sanitize = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => v === undefined ? null : v));

        // Виносимо великі aiSystem промпти в окрему підколекцію nodePrompts
        // щоб не перевищувати ліміт 1MB на документ флоу
        const promptsRef = saveRef.collection('nodePrompts');
        const stripPrompts = (nodesList) => nodesList.map(n => {
            const aiText = n.config?.aiSystem || n.aiSystem || '';
            if (aiText && aiText.length > 300) {
                promptsRef.doc(n.id).set({ aiSystem: aiText, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                const stripped = JSON.parse(JSON.stringify(n));
                if (stripped.config?.aiSystem) stripped.config.aiSystem = '__ref:' + n.id;
                if (stripped.aiSystem) stripped.aiSystem = '__ref:' + n.id;
                return stripped;
            }
            return n;
        });

        const strippedCanvas = { ...canvasData, nodes: stripPrompts(canvasData.nodes) };
        const strippedNodes = stripPrompts(ordered);

        await saveRef.update({
                canvasData: sanitize(strippedCanvas),
                nodes: sanitize(strippedNodes),
                triggerKeyword: triggerKeyword || '/start',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        if (btn) btn.textContent = 'Зберегти';
        if (typeof showToast === 'function') showToast('✅ Флоу збережено', 'success');
    } catch(e) {
        if (btn) btn.textContent = 'Зберегти';
        alert('Помилка: ' + e.message);
    }
}

// ── Undo/Redo ──────────────────────────────────────────────
function pushHistory() {
    const state = JSON.stringify({nodes:fc.nodes, edges:fc.edges});
    fc.history = fc.history.slice(0, fc.historyIdx+1);
    fc.history.push(state);
    if (fc.history.length > 50) fc.history.shift();
    fc.historyIdx = fc.history.length - 1;
}

function undo() {
    if (fc.historyIdx <= 0) return;
    fc.historyIdx--;
    const state = JSON.parse(fc.history[fc.historyIdx]);
    fc.nodes = state.nodes; fc.edges = state.edges;
    renderAll();
}

function redo() {
    if (fc.historyIdx >= fc.history.length-1) return;
    fc.historyIdx++;
    const state = JSON.parse(fc.history[fc.historyIdx]);
    fc.nodes = state.nodes; fc.edges = state.edges;
    renderAll();
}

// ── Keyboard ───────────────────────────────────────────────
function onKeyDown(e) {
    if (!document.getElementById('fcRoot')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if ((e.ctrlKey||e.metaKey) && e.key==='z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey||e.metaKey) && e.key==='y') { e.preventDefault(); redo(); }
    if ((e.ctrlKey||e.metaKey) && e.key==='s') { e.preventDefault(); saveFlow(); }
    if (e.key==='Escape') { fc.selected=null; renderAll(); renderPropPanel(); }
    if ((e.key==='Delete'||e.key==='Backspace') && fc.selected) {
        const node = fc.nodes.find(n=>n.id===fc.selected);
        if (node && node.type!=='start') window.fcDeleteNode(fc.selected);
    }
}

// ── Preview ────────────────────────────────────────────────
function getPreview(node) {
    const d = node.config||{};
    if (d.triggerKeyword) return 'Тригер: ' + d.triggerKeyword;
    if (d.text) return d.text.slice(0,80);
    if (d.aiSystem) return 'AI: ' + d.aiSystem.slice(0,60);
    if (d.apiUrl) return d.apiMethod+' '+d.apiUrl.slice(0,40);
    if (d.dealTitle) return d.dealTitle;
    if (d.delay) return `${d.delay} ${d.delayUnit||'секунд'}`;
    if (d.condVar) return `${d.condVar} ${d.condOp||'='} ${d.condVal||'?'}`;
    if (d.splitA) return `А: ${d.splitA}% / Б: ${d.splitB||50}%`;
    return '';
}

// ── Helpers ────────────────────────────────────────────────
function snap(v) { return Math.round(v/20)*20; }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

})();
