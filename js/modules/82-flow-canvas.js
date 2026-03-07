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
    start:      {label:'Старт',       color:'#22c55e', border:'#16a34a', icon:'▶',  outputs:['out']},
    message:    {label:'Повідомлення',color:'#6366f1', border:'#4f46e5', icon:'💬', outputs:['out','btn']},
    action:     {label:'Дія',         color:'#f59e0b', border:'#d97706', icon:'⚡', outputs:['out']},
    filter:     {label:'Фільтр',      color:'#f97316', border:'#ea580c', icon:'⟨⟩', outputs:['yes','no']},
    pause:      {label:'Пауза',       color:'#64748b', border:'#475569', icon:'⏸',  outputs:['out']},
    ai:         {label:'ШІ Агент',    color:'#8b5cf6', border:'#7c3aed', icon:'🤖', outputs:['out','err']},
    api:        {label:'Запит API',   color:'#0ea5e9', border:'#0284c7', icon:'⟳',  outputs:['ok','err']},
    sheets:     {label:'Google Sheets',color:'#10b981',border:'#059669', icon:'📊', outputs:['out']},
    random:     {label:'Випадково',   color:'#ec4899', border:'#db2777', icon:'⁇',  outputs:['a','b']},
    repeat:     {label:'Повтор',      color:'#14b8a6', border:'#0d9488', icon:'↺',  outputs:['out','end']},
    crm:        {label:'Угода CRM',   color:'#22c55e', border:'#16a34a', icon:'💼', outputs:['out']},
    end:        {label:'Кінець',      color:'#94a3b8', border:'#64748b', icon:'■',  outputs:[]},
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
    const flowRef = fc.botId
        ? firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('bots').doc(fc.botId).collection('flows').doc(flowId)
        : firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('flows').doc(flowId);
    const snap = await flowRef.get();
    if (!snap.exists) return;
    fc.flowData = {id: snap.id, ...snap.data()};

    // Load nodes/edges from stored JSON
    const stored = fc.flowData.canvasData || null;
    if (stored) {
        fc.nodes = stored.nodes || [];
        fc.edges = stored.edges || [];
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
        'background:#f1f5f9;font-family:system-ui,sans-serif',
        'user-select:none',
    ].join(';');

    root.innerHTML = `
    <!-- TOOLBAR -->
    <div id="fcToolbar" style="height:52px;background:#1e293b;display:flex;align-items:center;
        gap:8px;padding:0 12px;flex-shrink:0;border-bottom:2px solid #334155;z-index:10;">

        <button id="fcBtnBack" title="Назад до списку"
            style="padding:6px 12px;background:#334155;border:none;border-radius:8px;color:white;
            cursor:pointer;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;">
            ← Назад
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
            color:#94a3b8;cursor:pointer;font-size:14px;">↩</button>
        <button id="fcBtnRedo" title="Повторити (Ctrl+Y)"
            style="padding:6px 10px;background:#334155;border:none;border-radius:7px;
            color:#94a3b8;cursor:pointer;font-size:14px;">↪</button>

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

        <button id="fcBtnSave"
            style="padding:7px 18px;background:#22c55e;border:none;border-radius:8px;
            color:white;cursor:pointer;font-weight:700;font-size:13px;">
            Зберегти
        </button>
        <button id="fcBtnClose" title="Закрити"
            style="padding:6px 10px;background:#334155;border:none;border-radius:7px;
            color:#94a3b8;cursor:pointer;font-size:18px;line-height:1;">✕</button>
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
                <g id="fcEdgesGroup"></g>
                <path id="fcTempEdge" fill="none" stroke="#22c55e" stroke-width="2"
                    stroke-dasharray="6,4" style="display:none;" marker-end="url(#arrowHeadGreen)"/>
            </svg>
            <!-- nodes layer -->
            <div id="fcNodesLayer" style="position:absolute;inset:0;z-index:2;"></div>
        </div>

        <!-- RIGHT PANEL -->
        <div id="fcRightPanel" style="width:300px;background:#1e293b;border-left:1px solid #334155;
            overflow-y:auto;flex-shrink:0;z-index:5;">
            <div id="fcPropPanel" style="padding:16px;">
                <div style="text-align:center;padding:48px 16px;color:#475569;">
                    <div style="font-size:32px;margin-bottom:8px;">⬆</div>
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
    document.getElementById('fcRoot')?.remove();
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', drawBg);
}

// ── Sidebar ────────────────────────────────────────────────
function buildSidebar() {
    const sb = document.getElementById('fcSidebar');
    if (!sb) return;
    const items = [
        ['message','💬','Повідом.'],
        ['action','⚡','Дія'],
        ['filter','⟨⟩','Фільтр'],
        ['pause','⏸','Пауза'],
        ['ai','🤖','ШІ Агент'],
        ['api','⟳','API'],
        ['sheets','📊','Sheets'],
        ['random','⁇','Випадк.'],
        ['repeat','↺','Повтор'],
        ['crm','💼','CRM'],
        ['end','■','Кінець'],
    ];
    sb.innerHTML = items.map(([type, icon, label]) => {
        const cfg = NODES[type];
        return `<div draggable="true" data-sbtype="${type}"
            title="${cfg.label}"
            style="width:56px;display:flex;flex-direction:column;align-items:center;
            gap:3px;padding:8px 4px;border-radius:8px;cursor:grab;
            transition:background 0.15s;"
            onmouseenter="this.style.background='#334155'"
            onmouseleave="this.style.background='transparent'">
            <div style="font-size:18px;line-height:1;">${icon}</div>
            <div style="font-size:9px;color:#94a3b8;text-align:center;line-height:1.2;">${label}</div>
        </div>`;
    }).join('');

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
    const cfg = NODES[node.type] || NODES.message;
    const isSelected = fc.selected === node.id;
    const d = node.config || {};

    const el = document.createElement('div');
    el.id = `fcn_${node.id}`;
    el.dataset.nid = node.id;
    el.style.cssText = [
        `position:absolute`,
        `left:${node.x}px`,
        `top:${node.y}px`,
        `width:${W}px`,
        `border-radius:10px`,
        `background:white`,
        `border:2px solid ${isSelected ? cfg.color : '#e2e8f0'}`,
        `box-shadow:${isSelected ? `0 0 0 3px ${cfg.color}33,` : ''}0 4px 16px rgba(0,0,0,0.12)`,
        `cursor:pointer`,
        `transition:border-color 0.15s,box-shadow 0.15s`,
        `overflow:visible`,
    ].join(';');

    const preview = getPreview(node);
    const outputs = node.outputs || cfg.outputs || ['out'];

    // IN port (left center) — except start
    const inPortHTML = node.type !== 'start' ? `
        <div data-port-in="${node.id}"
            style="position:absolute;left:-8px;top:50%;transform:translateY(-50%);
            width:14px;height:14px;border-radius:50%;background:#94a3b8;
            border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);
            cursor:crosshair;z-index:3;"
            title="Вхід"></div>
    ` : '';

    // OUT ports (right side)
    const outPortsHTML = outputs.map((portId, i) => {
        const label = PORT_LABELS[portId] || portId;
        const connected = fc.edges.some(e => e.fromNode === node.id && e.fromPort === portId);
        const portColor = portId === 'yes' || portId === 'ok' || portId === 'out' ? cfg.color :
                          portId === 'no' || portId === 'err' ? '#ef4444' : '#94a3b8';
        const totalPorts = outputs.length;
        const topPct = totalPorts === 1 ? 50 : 25 + (i / (totalPorts-1)) * 50;
        return `
        <div style="position:absolute;right:-70px;top:${topPct}%;transform:translateY(-50%);
            display:flex;align-items:center;gap:4px;z-index:3;">
            <span style="font-size:9px;color:#64748b;white-space:nowrap;">${label}</span>
            <div data-port-out="${node.id}" data-port-id="${portId}"
                style="width:14px;height:14px;border-radius:50%;
                background:${connected ? portColor : '#e2e8f0'};
                border:2px solid ${connected ? portColor : '#94a3b8'};
                cursor:crosshair;transition:all 0.15s;flex-shrink:0;"
                title="Перетягни щоб з'єднати"
                onmouseenter="this.style.transform='scale(1.4)';this.style.background='${portColor}'"
                onmouseleave="this.style.transform='scale(1)';this.style.background='${connected?portColor:'#e2e8f0'}'"
            ></div>
        </div>`;
    }).join('');

    el.innerHTML = `
        ${inPortHTML}
        <!-- HEADER -->
        <div style="background:${cfg.color};border-radius:8px 8px 0 0;
            padding:8px 12px;display:flex;align-items:center;gap:6px;position:relative;">
            <span style="font-size:14px;">${cfg.icon}</span>
            <span style="font-weight:700;font-size:12px;color:white;flex:1;
                overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cfg.label}</span>
            ${node.type !== 'start' ? `
            <div data-del="${node.id}" title="Видалити"
                style="width:18px;height:18px;background:rgba(0,0,0,0.25);border-radius:4px;
                display:flex;align-items:center;justify-content:center;cursor:pointer;
                font-size:11px;color:white;flex-shrink:0;"
                onmouseenter="this.style.background='rgba(239,68,68,0.8)'"
                onmouseleave="this.style.background='rgba(0,0,0,0.25)'">✕</div>
            ` : ''}
        </div>
        <!-- BODY -->
        <div style="padding:10px 12px;min-height:40px;">
            ${preview
                ? `<div style="font-size:11px;color:#475569;line-height:1.4;
                    overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;
                    -webkit-box-orient:vertical;">${esc(preview)}</div>`
                : `<div style="font-size:11px;color:#94a3b8;font-style:italic;">
                    Клікніть для налаштування</div>`
            }
        </div>
        <!-- OUT PORTS -->
        ${outPortsHTML}
    `;

    // Events
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
        const portColor = edge.fromPort === 'no' || edge.fromPort === 'err' ? '#ef4444' :
                          edge.fromPort === 'yes' || edge.fromPort === 'ok' ? '#22c55e' : '#3b82f6';
        const color = isSelected ? portColor : '#94a3b8';
        const markerId = isSelected
            ? (portColor === '#22c55e' ? 'arrowHeadGreen' : 'arrowHeadBlue')
            : 'arrowHead';

        const path = bezier(from.x, from.y, to.x, to.y);

        // Hit area
        const hit = document.createElementNS('http://www.w3.org/2000/svg','path');
        hit.setAttribute('d', path);
        hit.setAttribute('fill','none');
        hit.setAttribute('stroke','transparent');
        hit.setAttribute('stroke-width','12');
        hit.style.cursor = 'pointer';
        hit.style.pointerEvents = 'stroke';
        hit.title = 'Клікни для видалення';
        hit.addEventListener('click', e => {
            e.stopPropagation();
            if (confirm('Видалити з\'єднання?')) {
                pushHistory();
                fc.edges = fc.edges.filter(ed => ed.id !== edge.id);
                renderEdges();
            }
        });

        const line = document.createElementNS('http://www.w3.org/2000/svg','path');
        line.setAttribute('d', path);
        line.setAttribute('fill','none');
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width','2');
        line.setAttribute('marker-end', `url(#${markerId})`);

        // Port label on edge
        const portLabel = PORT_LABELS[edge.fromPort];
        if (portLabel && fromNode.outputs?.length > 1) {
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2 - 8;
            const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
            txt.setAttribute('x', mx);
            txt.setAttribute('y', my);
            txt.setAttribute('text-anchor','middle');
            txt.setAttribute('fill', color);
            txt.setAttribute('font-size','10');
            txt.setAttribute('font-family','system-ui,sans-serif');
            txt.textContent = portLabel;
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
    const dx = Math.abs(x2-x1);
    const cp = Math.max(60, dx*0.55);
    return `M${x1},${y1} C${x1+cp},${y1} ${x2-cp},${y2} ${x2},${y2}`;
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
    ctx.fillStyle = '#cbd5e1';
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
    // Dblclick empty canvas → add message node
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

// ── Property Panel ─────────────────────────────────────────
function renderPropPanel() {
    const panel = document.getElementById('fcPropPanel');
    if (!panel) return;

    if (!fc.selected) {
        panel.innerHTML = `<div style="text-align:center;padding:48px 16px;color:#475569;">
            <div style="font-size:32px;margin-bottom:8px;">⬆</div>
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
        case 'message':
            fields = fld('Текст повідомлення', ta('text', d.text, 'Введіть текст...'))
                + fld('Кнопки (кожна з нового рядка)', ta('buttonsRaw', (d.buttons||[]).map(b=>b.label).join('\n'), 'Варіант 1\nВаріант 2', 3))
                + fld('Зберегти відповідь у змінну', inp('saveAs', d.saveAs, 'напр: phone'));
            break;
        case 'action':
            fields = fld('Тип дії', sel('actionType',
                [['set_var','Встановити змінну'],['set_tag','Додати тег'],
                 ['remove_tag','Видалити тег'],['notify_admin','Сповістити менеджера'],
                 ['start_flow','Запустити інший флоу'],['stop_flow','Зупинити флоу']],
                d.actionType||'set_var'))
                + fld('Параметри (JSON)', ta('actionPayload', d.actionPayload, '{"variable":"phone","value":"{{input}}"}', 3));
            break;
        case 'filter':
            fields = fld('Змінна', inp('condVar', d.condVar, 'phone'))
                + fld('Оператор', sel('condOp',
                    [['=','= Дорівнює'],['!=','≠ Не дорівнює'],
                     ['contains','Містить'],['exists','Існує'],['!exists','Не існує'],
                     ['>','> Більше'],['<','< Менше']], d.condOp||'='))
                + fld('Значення', inp('condVal', d.condVal, ''))
                + `<div style="font-size:10px;color:#64748b;margin-top:4px;">
                    ● Вихід "Так" → умова виконується<br>
                    ● Вихід "Ні" → умова не виконується</div>`;
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
        case 'ai':
            fields = fld('Системний промпт', ta('aiSystem', d.aiSystem, 'Ти — помічник компанії...', 4))
                + fld('Модель', sel('aiModel',
                    [['gpt-4o-mini','GPT-4o mini'],['gpt-4o','GPT-4o'],['claude-sonnet-4-5','Claude Sonnet']], d.aiModel||'gpt-4o-mini'))
                + fld('Зберегти відповідь у змінну', inp('saveAs', d.saveAs, 'ai_response'))
                + fld('Запасна відповідь', inp('fallback', d.fallback, 'Вибачте, спробуйте пізніше'));
            break;
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
                ✓ Застосувати
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
            const rawBtns = get('buttonsRaw').split('\n').map(s=>s.trim()).filter(Boolean);
            node.config.buttons = rawBtns.map((l,i)=>({id:`btn_${i}`,label:l}));
            // Rebuild outputs: out + one per button
            node.outputs = rawBtns.length > 0
                ? ['out', ...rawBtns.map((_,i)=>`btn_${i}`)]
                : ['out'];
            break;
        case 'action':
            node.config.actionType = get('actionType');
            node.config.actionPayload = get('actionPayload');
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
    if (typeof showToast === 'function') showToast('Вузол збережено ✓', 'success');
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
        nodes: fc.nodes.map(n => ({...n.config, _x:n.x, _y:n.y, outputs:n.outputs})),
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
            const d = {...n.config, _x:n.x, _y:n.y};
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
        await saveRef.update({
                canvasData,
                nodes: ordered,
                triggerKeyword,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        if (btn) btn.textContent = 'Зберегти';
        if (typeof showToast === 'function') showToast('Флоу збережено ✓', 'success');
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
    if (d.text) return d.text.slice(0,80);
    if (d.triggerKeyword) return 'Тригер: ' + d.triggerKeyword;
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
