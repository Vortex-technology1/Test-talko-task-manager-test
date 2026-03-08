// ============================================================
// TALKO Universal Webhook — Vercel Serverless v2
// POST /api/webhook?companyId=X&channel=telegram
// Flows: companies/{id}/bots/{botId}/flows/{flowId}
// ============================================================

const admin = require('firebase-admin');

let initError = null;
if (!admin.apps.length) {
    try {
        let pk = process.env.FIREBASE_PRIVATE_KEY || '';
        pk = pk.replace(/\\n/g, '\n');
        if (!pk.includes('-----BEGIN') && pk.length > 100) {
            try { pk = Buffer.from(pk, 'base64').toString('utf8'); } catch(e) {}
        }
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || 'task-manager-44e84',
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: pk || undefined,
            }),
        });
    } catch(e) {
        initError = e.message;
    }
}
const db = initError ? null : admin.firestore();

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        // Діагностика — перевіряємо env та Firebase
        const diag = {
            ok: true,
            service: 'TALKO Webhook v2',
            initError: initError || null,
            env: {
                hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
                hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
                hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
                projectId: process.env.FIREBASE_PROJECT_ID || 'NOT SET',
            },
            query: req.query,
        };
        // Спробуємо підключитись до Firebase
        try {
            if (!db) throw new Error('DB not initialized: ' + initError);
            await db.collection('companies').limit(1).get();
            diag.firebase = 'connected';
        } catch(e) {
            diag.firebase = 'ERROR: ' + e.message;
        }
        return res.status(200).json(diag);
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { companyId, channel } = req.query;
    if (!companyId || !channel) return res.status(400).json({ error: 'Missing params' });

    try {
        const body = req.body;
        let normalized = channel === 'telegram' ? normalizeTelegram(body) :
                         (channel === 'instagram' || channel === 'facebook') ? normalizeMeta(body) : null;

        if (!normalized) return res.status(200).json({ ok: true, skipped: 'no message' });
        console.log(`[webhook] ${channel} from ${normalized.senderId}: "${normalized.text}"`);

        const compRef = db.collection('companies').doc(companyId);

        // Знаходимо бот по каналу
        let botToken = null, botDocId = null;
        let botsSnap = await compRef.collection('bots')
            .where('channel', '==', channel)
            .where('status', '==', 'active').limit(5).get();

        // Fallback: якщо бот без status поля (старі боти) — беремо будь-який бот цього каналу
        if (botsSnap.empty) {
            botsSnap = await compRef.collection('bots')
                .where('channel', '==', channel).limit(5).get();
        }

        if (!botsSnap.empty) {
            const bd = botsSnap.docs[0];
            botDocId = bd.id;
            botToken = bd.data().token || bd.data().botToken;
        } else {
            const compDoc = await compRef.get();
            botToken = compDoc.data()?.integrations?.telegram?.botToken;
        }

        if (!botToken) {
            console.log('[webhook] No bot token');
            return res.status(200).json({ ok: true, skipped: 'no token' });
        }

        // Сесія
        const sessionId = `${channel}_${normalized.senderId}`;
        const sessionRef = compRef.collection('sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();
        let session = sessionDoc.exists ? sessionDoc.data() : {
            senderId: normalized.senderId, senderName: normalized.senderName || '',
            channel, currentFlowId: null, currentBotId: null,
            currentNodeId: null, waitingForInput: null,
            data: {}, tags: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const isStart = /^\/start/.test(normalized.text) || normalized.text === 'start';
        if (isStart) {
            session.currentFlowId = null; session.currentNodeId = null;
            session.waitingForInput = null; session.data = {};
        }

        const currentBotId = botDocId || session.currentBotId;

        // Знаходимо флоу
        let flow = null;
        if (currentBotId) {
            const flowsRef = compRef.collection('bots').doc(currentBotId).collection('flows');
            if (session.currentFlowId && !isStart) {
                const fd = await flowsRef.doc(session.currentFlowId).get();
                if (fd.exists) flow = { id: fd.id, botId: currentBotId, ...fd.data() };
            }
            if (!flow) {
                const allFlows = await flowsRef.limit(20).get();
                for (const fd of allFlows.docs) {
                    const trigger = fd.data().triggerKeyword || '/start';
                    if (isStart || normalized.text === trigger) {
                        flow = { id: fd.id, botId: currentBotId, ...fd.data() };
                        break;
                    }
                }
                if (!flow && allFlows.docs.length > 0) {
                    const fd = allFlows.docs[0];
                    flow = { id: fd.id, botId: currentBotId, ...fd.data() };
                }
            }
        }

        if (!flow) {
            if (isStart) await sendTg(botToken, normalized.senderId, 'Вітаємо! Бот активний ✅');
            return res.status(200).json({ ok: true, skipped: 'no flow' });
        }

        console.log(`[webhook] Flow: ${flow.id}, nodes: ${flow.nodes?.length || 0}`);
        console.log(`[webhook] Node types:`, (flow.nodes||[]).map(n=>n.id+':'+n.type).join(', '));

        // Будуємо map вузлів
        const nodeMap = {};
        (flow.nodes || []).forEach(n => { if (n.id) nodeMap[n.id] = n; });

        // Визначаємо поточний вузол — пропускаємо start/trigger вузли
        const firstRealNode = (flow.nodes || []).find(n => n.type !== 'start' && n.type !== 'trigger');
        let nodeId = (!isStart && session.currentNodeId) ? session.currentNodeId : (firstRealNode?.id || flow.nodes?.[0]?.id || null);
        console.log(`[webhook] firstRealNode: ${firstRealNode?.id}, nodeId: ${nodeId}, isStart: ${isStart}`);

        // Обробляємо відповідь якщо чекали
        if (!isStart && session.waitingForInput) {
            const waitNode = nodeMap[session.waitingForInput];
            if (waitNode) {
                if (waitNode.saveAs) session.data[waitNode.saveAs] = normalized.text;
                nodeId = resolveNext(waitNode, normalized.text);
                session.waitingForInput = null;
                if (!nodeId) {
                    await finish(session, flow, compRef, channel);
                    Object.assign(session, { currentFlowId:null, currentNodeId:null, waitingForInput:null });
                    await sessionRef.set(session, { merge:true });
                    return res.status(200).json({ ok: true });
                }
            }
        }

        // Виконуємо ланцюг вузлів
        let safety = 0;
        while (nodeId && safety++ < 30) {
            const n = nodeMap[nodeId];
            if (!n) break;
            console.log(`[webhook] Node ${nodeId} type=${n.type}`);

            if (n.type === 'message') {
                const text = interp(n.text || n.config?.text || '', session.data);
                const btns = n.options?.length ? n.options : (n.buttons?.length ? n.buttons : null);
                await sendTg(botToken, normalized.senderId, text, btns);
                if (btns?.length) {
                    // Чекаємо відповідь на кнопку
                    Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId,
                        currentNodeId: nodeId, waitingForInput: nodeId });
                    await sessionRef.set(session, { merge: true });
                    return res.status(200).json({ ok: true });
                }
                nodeId = n.nextNode || null;

            } else if (n.type === 'pause') {
                Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId,
                    currentNodeId: n.nextNode || null, waitingForInput: nodeId });
                await sessionRef.set(session, { merge: true });
                return res.status(200).json({ ok: true });

            } else if (n.type === 'ai' || n.type === 'ai_response') {
                const reply = await callAI(n, normalized.text, session, compRef);
                await sendTg(botToken, normalized.senderId, reply);
                nodeId = n.nextNode || null;

            } else if (n.type === 'action') {
                await doAction(n, session);
                nodeId = n.nextNode || null;

            } else if (n.type === 'filter') {
                nodeId = evalFilter(n, session.data) ? n.trueNode : n.falseNode;

            } else if (n.type === 'end' || n.type === 'finish') {
                if (n.text) await sendTg(botToken, normalized.senderId, interp(n.text, session.data));
                await finish(session, flow, compRef, channel);
                nodeId = null;
                break;

            } else if (n.type === 'api') {
                try {
                    const r = await fetch(n.url, { method: n.method||'GET',
                        headers:{'Content-Type':'application/json'},
                        ...(n.body?{body:interp(n.body,session.data)}:{}) });
                    session.data._apiResponse = await r.text();
                } catch(e) { session.data._apiError = e.message; }
                nodeId = n.nextNode || null;

            } else {
                nodeId = n.nextNode || null;
            }
        }

        if (!nodeId) {
            Object.assign(session, { currentFlowId:null, currentNodeId:null, waitingForInput:null });
        } else {
            Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId, currentNodeId: nodeId });
        }

        session.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await sessionRef.set(session, { merge: true });
        await logMsg(compRef, sessionId, 'in', normalized.text);
        return res.status(200).json({ ok: true });

    } catch (err) {
        console.error('[webhook] ERROR:', err.message, err.stack);
        return res.status(200).json({ ok: true });
    }
};

// ── Utils ─────────────────────────────────────────────────

function normalizeTelegram(body) {
    const msg = body?.message, cb = body?.callback_query;
    if (!msg && !cb) return null;
    const from = msg?.from || cb?.from;
    if (!from) return null;
    return {
        senderId: String(from.id),
        senderName: [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || '',
        text: msg?.text || cb?.data || '',
    };
}

function normalizeMeta(body) {
    try {
        const messaging = body?.entry?.[0]?.messaging?.[0];
        if (!messaging) return null;
        return { senderId: messaging.sender?.id || '', senderName: '', text: messaging.message?.text || '' };
    } catch { return null; }
}

function resolveNext(node, userText) {
    if (node.options?.length) {
        const m = node.options.find(o => o.label===userText || o.value===userText || o.id===userText);
        if (m?.nextNode) return m.nextNode;
    }
    return node.nextNode || null;
}

function interp(text, data) {
    return (text||'').replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] || '');
}

function evalFilter(node, data) {
    const val = data[node.variable] || '';
    switch(node.operator) {
        case 'eq': return val === node.value;
        case 'neq': return val !== node.value;
        case 'contains': return String(val).includes(node.value);
        case 'gt': return parseFloat(val) > parseFloat(node.value);
        case 'lt': return parseFloat(val) < parseFloat(node.value);
        default: return !!val;
    }
}

async function doAction(node, session) {
    if (node.actionType === 'set_var') {
        try {
            const p = typeof node.actionPayload === 'string' ? JSON.parse(node.actionPayload) : node.actionPayload;
            if (p?.variable) session.data[p.variable] = p.value || '';
        } catch {}
    } else if (node.actionType === 'set_tag' || node.actionType === 'add_tag') {
        if (!session.tags) session.tags = [];
        if (node.actionPayload) session.tags.push(node.actionPayload);
    }
}

async function callAI(node, userText, session, compRef) {
    try {
        const compDoc = await compRef.get();
        const apiKey = node.aiApiKey || compDoc.data()?.openaiApiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) return node.fallback || 'Дякуємо!';
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: node.model||'gpt-4o-mini', max_tokens:500,
                messages:[{role:'system',content:node.systemPrompt||'You are helpful.'},{role:'user',content:userText}] })
        });
        const d = await r.json();
        return d.choices?.[0]?.message?.content || node.fallback || 'Дякуємо!';
    } catch { return node.fallback || 'Виникла помилка.'; }
}

async function sendTg(token, chatId, text, buttons) {
    if (!token || !chatId) return;
    const payload = { chat_id: chatId, text: (text||' ').trim(), parse_mode: 'HTML' };
    if (buttons?.length) {
        payload.reply_markup = { inline_keyboard: [
            buttons.map(b => b.url
                ? { text: b.label||b.text||'?', url: b.url }
                : { text: b.label||b.text||'?', callback_data: b.value||b.label||b.id||'?' }
            )
        ]};
    }
    try {
        const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
        });
        const result = await r.json();
        if (!result.ok) console.error('[sendTg]', result.description);
    } catch(e) { console.error('[sendTg] error:', e.message); }
}

async function finish(session, flow, compRef, channel) {
    try {
        await compRef.collection('leads').add({
            senderId: session.senderId, senderName: session.senderName||'',
            channel, flowId: flow?.id||null, flowName: flow?.name||null,
            data: session.data||{}, tags: session.tags||[],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch(e) { console.error('[finish]', e.message); }
}

async function logMsg(compRef, sessionId, dir, text) {
    try {
        await compRef.collection('sessions').doc(sessionId).collection('messages').add({
            direction: dir, text: text||'', timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch {}
}
