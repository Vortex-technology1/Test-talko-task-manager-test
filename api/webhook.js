// ============================================================
// TALKO Universal Webhook — Vercel Serverless v4 FINAL
// ============================================================

const admin = require('firebase-admin');

let initError = null;
if (!admin.apps.length) {
    try {
        let pk = process.env.FIREBASE_PRIVATE_KEY || '';
        pk = pk.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || 'task-manager-44e84',
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: pk || undefined,
            }),
        });
    } catch(e) { initError = e.message; }
}
const db = initError ? null : admin.firestore();

module.exports = async (req, res) => {
    // ── GET: діагностика ─────────────────────────────────────
    if (req.method === 'GET') {
        const diag = { ok: true, initError: initError || null, env: {
            hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
            hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        }};
        try {
            if (!db) throw new Error('DB not initialized');
            await db.collection('companies').limit(1).get();
            diag.firebase = 'connected';
        } catch(e) { diag.firebase = 'ERROR: ' + e.message; }
        return res.status(200).json(diag);
    }

    if (req.method !== 'POST') return res.status(405).end();

    const { companyId, channel } = req.query;
    if (!companyId || !channel) return res.status(400).json({ error: 'Missing params' });

    try {
        const body = req.body;

        // ── Нормалізація повідомлення ────────────────────────
        let normalized = null;
        let callbackQueryId = null; // для answerCallbackQuery

        if (channel === 'telegram') {
            const msg = body?.message;
            const cb = body?.callback_query;
            if (!msg && !cb) return res.status(200).json({ ok: true, skipped: 'no message' });
            const from = msg?.from || cb?.from;
            if (!from) return res.status(200).json({ ok: true, skipped: 'no from' });
            normalized = {
                senderId: String(from.id),
                senderName: [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || '',
                text: msg?.text || cb?.data || '',
            };
            if (cb) callbackQueryId = cb.id;
        } else if (channel === 'facebook' || channel === 'instagram') {
            const messaging = body?.entry?.[0]?.messaging?.[0];
            if (!messaging) return res.status(200).json({ ok: true, skipped: 'no messaging' });
            normalized = { senderId: messaging.sender?.id || '', senderName: '', text: messaging.message?.text || '' };
        }

        if (!normalized) return res.status(200).json({ ok: true, skipped: 'unsupported channel' });

        console.log(`[webhook] ${channel} from ${normalized.senderId}: "${normalized.text}"`);

        const compRef = db.collection('companies').doc(companyId);

        // FIX 5: читаємо compData один раз для всього запиту
        const _compDoc = await compRef.get();
        const _compData = _compDoc.data() || {};

        // ── Знаходимо бот токен ──────────────────────────────
        let botToken = null, botDocId = null;
        let botsSnap = await compRef.collection('bots').where('channel', '==', channel).limit(5).get();
        if (!botsSnap.empty) {
            const bd = botsSnap.docs[0];
            botDocId = bd.id;
            botToken = bd.data().token || bd.data().botToken;
        }
        if (!botToken) {
            botToken = _compData?.integrations?.telegram?.botToken;
        }
        if (!botToken) return res.status(200).json({ ok: true, skipped: 'no token' });

        // Підтверджуємо callback_query одразу (прибирає "годинник" на кнопці)
        if (callbackQueryId && botToken) {
            fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackQueryId })
            }).catch(() => {});
        }

        // ── Сесія ─────────────────────────────────────────────
        const sessionId = `${channel}_${normalized.senderId}`;
        const sessionRef = compRef.collection('sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();
        let session = sessionDoc.exists ? sessionDoc.data() : {
            senderId: normalized.senderId, senderName: normalized.senderName || '',
            channel, currentFlowId: null, currentBotId: null,
            currentNodeId: null, waitingForInput: null,
            data: {}, tags: [],
        };

        // FIX 1: Deduplication — ігноруємо повторний update_id від Telegram
        const updateId = body?.update_id || body?.entry?.[0]?.id || null;
        if (updateId && session.lastUpdateId === updateId) {
            console.log('[webhook] Duplicate update_id, skipping:', updateId);
            return res.status(200).json({ ok: true, skipped: 'duplicate' });
        }
        if (updateId) session.lastUpdateId = updateId;

        const isStart = /^\/start/.test(normalized.text) || normalized.text === 'start';
        if (isStart) {
            Object.assign(session, { currentFlowId: null, currentNodeId: null, waitingForInput: null, data: {}, aiHistory: [] });
        }

        // ── Знаходимо флоу ───────────────────────────────────
        const currentBotId = botDocId || session.currentBotId;
        let flow = null;

        if (currentBotId) {
            const flowsRef = compRef.collection('bots').doc(currentBotId).collection('flows');

            // Якщо є активна сесія — продовжуємо той самий флоу
            if (session.currentFlowId && !isStart) {
                const fd = await flowsRef.doc(session.currentFlowId).get();
                if (fd.exists) flow = { id: fd.id, botId: currentBotId, ...fd.data() };
            }

            // Шукаємо по тригеру
            if (!flow) {
                const allFlows = await flowsRef.where('status', '==', 'active').limit(20).get();
                for (const fd of allFlows.docs) {
                    const trigger = fd.data().triggerKeyword || '/start';
                    if (isStart || normalized.text === trigger) {
                        flow = { id: fd.id, botId: currentBotId, ...fd.data() };
                        break;
                    }
                }
                // Fallback — перший активний флоу
                if (!flow && !allFlows.empty) {
                    flow = { id: allFlows.docs[0].id, botId: currentBotId, ...allFlows.docs[0].data() };
                }
            }
        }

        if (!flow) {
            if (isStart) await sendTg(botToken, normalized.senderId, 'Вітаємо! Бот активний ✅');
            return res.status(200).json({ ok: true, skipped: 'no flow' });
        }

        // ── Підвантажуємо canvasData + nodePrompts з підколекцій ──
        const flowDocRef = compRef.collection('bots').doc(currentBotId).collection('flows').doc(flow.id);

        // FIX 1: canvasData зберігається в підколекції, не в основному документі
        if (!flow.canvasData?.nodes?.length) {
            try {
                const canvasDoc = await flowDocRef.collection('canvasData').doc('layout').get();
                if (canvasDoc.exists) flow.canvasData = canvasDoc.data();
            } catch(e) { console.warn('[webhook] canvasData load error:', e.message); }
        }

        const promptsSnap = await flowDocRef.collection('nodePrompts').get();
        const nodePromptsMap = {};
        promptsSnap.forEach(doc => { nodePromptsMap[doc.id] = doc.data().aiSystem || ''; });

        const restorePrompts = (nodesList) => nodesList.map(n => {
            // FIX 2+3: перевіряємо обидва місця де може бути __ref
            const sysConfig = n.config?.aiSystem || '';
            const sysTop = n.aiSystem || '';
            const hasRef = sysConfig.startsWith('__ref:') || sysTop.startsWith('__ref:');
            if (hasRef) {
                const refId = (sysConfig.startsWith('__ref:') ? sysConfig : sysTop).replace('__ref:', '');
                const realPrompt = nodePromptsMap[refId] || '';
                const restored = JSON.parse(JSON.stringify(n));
                // Відновлюємо в обох місцях
                if (restored.config) restored.config.aiSystem = realPrompt;
                restored.aiSystem = realPrompt;
                return restored;
            }
            return n;
        });

        // ── Будуємо runtime nodes ─────────────────────────────
        // flow.nodes — лінійний масив (зберігається при saveFlow)
        // flow.canvasData.edges — з'єднання між вузлами
        let runtimeNodes = (flow.nodes || []).filter(n => n.id && n.type !== 'start' && n.type !== 'trigger');
        runtimeNodes = restorePrompts(runtimeNodes);

        // Fallback: якщо flow.nodes порожній — беремо з canvasData
        if (runtimeNodes.length === 0 && flow.canvasData?.nodes?.length) {
            runtimeNodes = restorePrompts(flow.canvasData.nodes
                .filter(n => n.id && n.type !== 'start'))
                .map(n => ({
                    id: n.id, type: n.type || 'message',
                    text: n.text || '',
                    nextNode: n.nextNode || null,
                    buttons: n.buttons || [],
                    options: n.options || [],
                    config: n.config || n,
                    aiSystem: n.config?.aiSystem || n.aiSystem || n.systemPrompt || '',
                    aiApiKey: n.config?.aiApiKey || n.aiApiKey || n.apiKey || null,
                    aiModel: n.config?.aiModel || n.aiModel || n.model || 'gpt-4o-mini',
                    saveAs: n.config?.saveAs || n.saveAs || null,
                    fallback: n.config?.fallback || n.fallback || null,
                }));
        }

        // Патчимо nextNode з canvasData.edges
        const edges = flow.canvasData?.edges || [];
        if (edges.length > 0) {
            runtimeNodes.forEach(n => {
                const outEdge = edges.find(e => e.fromNode === n.id && e.fromPort === 'out');
                if (outEdge && !n.nextNode) n.nextNode = outEdge.toNode;
                if (n.buttons?.length) {
                    n.buttons = n.buttons.map((b, i) => {
                        if (b.nextNode) return b;
                        const btnEdge = edges.find(e => e.fromNode === n.id && e.fromPort === `btn_${i}`);
                        return btnEdge ? { ...b, nextNode: btnEdge.toNode } : b;
                    });
                    n.options = n.buttons.map(b => ({ label: b.label, nextNode: b.nextNode }));
                }
            });
        }

        console.log(`[webhook] Flow: ${flow.id}, nodes: ${runtimeNodes.length}`);
        console.log(`[webhook] Nodes:`, runtimeNodes.map(n => `${n.id}:${n.type}`).join(', '));

        const nodeMap = {};
        runtimeNodes.forEach(n => { if (n.id) nodeMap[n.id] = n; });

        // ── Визначаємо стартовий вузол ───────────────────────
        const firstNode = runtimeNodes[0];
        let nodeId = (isStart || !session.currentNodeId) ? firstNode?.id : null;

        // ── Обробка кнопки або вводу ─────────────────────────
        if (!isStart && session.waitingForInput) {
            const waitNode = nodeMap[session.waitingForInput];
            if (waitNode) {
                if (waitNode.type === 'ai' || waitNode.type === 'ai_response') {
                    // AI вузол — просто продовжуємо, текст вже нормалізований
                    nodeId = waitNode.id;
                    session.waitingForInput = null;
                } else {
                    // Якщо прийшов btn_N — знаходимо реальний текст кнопки
                    let userInput = normalized.text;
                    const btnMatch = userInput.match(/^btn_(\d+)/);
                    if (btnMatch) {
                        const btnIdx = parseInt(btnMatch[1]);
                        const btn = waitNode.buttons?.[btnIdx] || waitNode.options?.[btnIdx];
                        if (btn) userInput = btn.label || btn.text || userInput;
                    }
                    if (waitNode.saveAs) session.data[waitNode.saveAs] = userInput;
                    normalized.text = userInput;
                    nodeId = resolveNext(waitNode, normalized.text);
                    session.waitingForInput = null;
                }
            } else {
                nodeId = session.currentNodeId || firstNode?.id;
            }
        }

        if (!nodeId) {
            await sessionRef.set(session, { merge: true });
            return res.status(200).json({ ok: true });
        }

        // ── Виконуємо ланцюг вузлів ──────────────────────────
        // FIX 3: _botToken НЕ зберігаємо в сесії (security) — передаємо через env
        // session._botToken = botToken; — ВИДАЛЕНО
        let safety = 0;
        while (nodeId && safety++ < 30) {
            const n = nodeMap[nodeId];
            if (!n) { console.log(`[webhook] Node not found: ${nodeId}`); break; }
            console.log(`[webhook] Executing node ${nodeId} type=${n.type}`);

            if (n.type === 'message') {
                const text = interp(n.text || '', session.data);
                if (!text.trim()) { nodeId = n.nextNode || null; continue; }
                await sendTyping(botToken, normalized.senderId);
                const btns = n.buttons?.length ? n.buttons : (n.options?.length ? n.options : null);
                await sendTg(botToken, normalized.senderId, text, btns);
                if (btns?.length) {
                    Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId,
                        currentNodeId: nodeId, waitingForInput: nodeId });
                    await sessionRef.set(session, { merge: true });
                    return res.status(200).json({ ok: true });
                }
                nodeId = n.nextNode || null;

            } else if (n.type === 'ai' || n.type === 'ai_response') {
                // AI вузол з пам'яттю
                if (!session.aiHistory) session.aiHistory = [];
                session.aiHistory.push({ role: 'user', content: normalized.text });
                if (session.aiHistory.length > 20) session.aiHistory = session.aiHistory.slice(-20);

                // Typing індикатор — шле кожні 4 сек поки AI думає (Telegram показує max 5 сек)
                let typingActive = true;
                const typingLoop = (async () => {
                    while (typingActive) {
                        await sendTyping(botToken, normalized.senderId);
                        await new Promise(r => setTimeout(r, 4000));
                    }
                })();

                // FIX 6: відправляємо ⏳ і зберігаємо message_id щоб потім відредагувати
                const isFirstAiMsg = !session.aiHistory || session.aiHistory.length <= 1;
                let thinkingMsgId = null;
                if (isFirstAiMsg) {
                    thinkingMsgId = await sendTgGetId(botToken, normalized.senderId, '⏳ Секунду, готую відповідь...');
                }

                const rawReply = await callAI(n, normalized.text, session, compRef, _compData);
                typingActive = false; // зупиняємо typing loop

                // Парсимо спеціальні теги з відповіді AI:
                // [BTN:текст] — динамічна кнопка
                // [DONE] — AI завершив збір даних, іти до наступного вузла
                // [SAVE:змінна=значення] — зберегти дані в сесію
                const btnMatches = [...rawReply.matchAll(/\[BTN:([^\]]+)\]/g)];
                const aiBtns = btnMatches.map((m, i) => ({ label: m[1], nextNode: null }));
                const isDone = rawReply.includes('[DONE]');

                // Парсимо [SAVE:key=value] теги
                const saveMatches = [...rawReply.matchAll(/\[SAVE:([^=\]]+)=([^\]]+)\]/g)];
                saveMatches.forEach(m => { session.data[m[1].trim()] = m[2].trim(); });

                // Чистимо відповідь від службових тегів
                const cleanReply = rawReply
                    .replace(/\[BTN:[^\]]+\]/g, '')
                    .replace(/\[DONE\]/g, '')
                    .replace(/\[SAVE:[^\]]+\]/g, '')
                    .trim();

                session.aiHistory.push({ role: 'assistant', content: cleanReply });
                // Зберігаємо останню AI відповідь для {{ai_response}} в наступних вузлах
                session.data.ai_response = cleanReply;

                if (cleanReply) {
                    // FIX 6: редагуємо ⏳ повідомлення якщо є message_id, інакше новим
                    if (thinkingMsgId) {
                        await editTg(botToken, normalized.senderId, thinkingMsgId, cleanReply, aiBtns.length ? aiBtns : null);
                    } else {
                        await sendTg(botToken, normalized.senderId, cleanReply, aiBtns.length ? aiBtns : null);
                    }
                }

                if (isDone && n.nextNode) {
                    // AI завершив — іти до наступного вузла в ланцюгу
                    console.log('[webhook] AI DONE → next node:', n.nextNode);
                    nodeId = n.nextNode;
                    // FIX 4: явно очищаємо waitingForInput щоб не застрягти в AI вузлі
                    session.waitingForInput = null;
                    session.currentNodeId = n.nextNode;
                    session.aiHistory = []; // очищаємо історію діалогу
                } else {
                    // AI продовжує діалог — залишаємось у вузлі
                    Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId,
                        currentNodeId: nodeId, waitingForInput: nodeId,
                        aiHistory: session.aiHistory });
                    await sessionRef.set(session, { merge: true });
                    return res.status(200).json({ ok: true });
                }

            } else if (n.type === 'pause') {
                Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId,
                    currentNodeId: n.nextNode || null, waitingForInput: nodeId });
                await sessionRef.set(session, { merge: true });
                return res.status(200).json({ ok: true });

            } else if (n.type === 'filter') {
                nodeId = evalFilter(n, session.data) ? n.trueNode : n.falseNode;

            } else if (n.type === 'action') {
                // Зберігаємо останню AI відповідь в session.data для {{ai_response}}
                if (session.aiHistory?.length) {
                    const lastAI = [...session.aiHistory].reverse().find(m => m.role === 'assistant');
                    if (lastAI) session.data.ai_response = lastAI.content;
                }
                await doAction(n, session, flow, botToken);
                nodeId = n.nextNode || null;

            } else if (n.type === 'api') {
                try {
                    const r = await fetch(n.url, { method: n.method || 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        ...(n.body ? { body: interp(n.body, session.data) } : {}) });
                    session.data._apiResponse = await r.text();
                } catch(e) { session.data._apiError = e.message; }
                nodeId = n.nextNode || null;

            } else if (n.type === 'end' || n.type === 'finish') {
                if (n.text) await sendTg(botToken, normalized.senderId, interp(n.text, session.data));
                await finish(session, flow, compRef, channel);
                nodeId = null;
                break;

            } else {
                nodeId = n.nextNode || null;
            }
        }

        // ── Зберігаємо сесію ─────────────────────────────────
        if (!nodeId) {
            // FIX 5: очищаємо дані сесії після завершення флоу
            Object.assign(session, {
                currentFlowId: null, currentNodeId: null, waitingForInput: null,
                data: {}, aiHistory: [], tags: [],
            });
        } else {
            Object.assign(session, { currentFlowId: flow.id, currentBotId: flow.botId, currentNodeId: nodeId });
        }
        session.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        // FIX 3: видаляємо технічні поля перед збереженням
        const { _botToken, ...sessionToSave } = session;
        await sessionRef.set(sessionToSave, { merge: true });
        return res.status(200).json({ ok: true });

    } catch(err) {
        console.error('[webhook] ERROR:', err.message, err.stack);
        return res.status(200).json({ ok: true }); // завжди 200 щоб Telegram не ретраїв
    }
};

// ── Helpers ───────────────────────────────────────────────

function resolveNext(node, userText) {
    // Пошук по btn_N індексу (формат callback_data)
    const btnMatch = String(userText || '').match(/^btn_(\d+)/);
    const idx = btnMatch ? parseInt(btnMatch[1]) : -1;

    if (node.buttons?.length) {
        if (idx >= 0 && node.buttons[idx]?.nextNode) return node.buttons[idx].nextNode;
        const b = node.buttons.find(b => b.label === userText || b.value === userText);
        if (b?.nextNode) return b.nextNode;
    }
    if (node.options?.length) {
        if (idx >= 0 && node.options[idx]?.nextNode) return node.options[idx].nextNode;
        const o = node.options.find(o => o.label === userText || o.value === userText);
        if (o?.nextNode) return o.nextNode;
    }
    return node.nextNode || null;
}

function interp(text, data) {
    // FIX 6: замінюємо змінні але екрануємо щоб не ламати HTML в sendTg
    return (text || '').replace(/\{\{(\w+)\}\}/g, (_, k) => {
        const val = data[k] || '';
        // Якщо значення вже містить HTML теги — не чіпаємо (наприклад ai_response)
        return String(val);
    });
}

function evalFilter(node, data) {
    // Підтримуємо обидва формати полів: condVar/condOp/condVal і variable/operator/value
    const varName = node.condVar || node.variable || node.conditionField || '';
    const op = node.condOp || node.operator || node.conditionOp || 'exists';
    const expected = node.condVal || node.value || node.conditionValue || '';
    const val = data[varName] || '';
    switch(op) {
        case 'eq': case 'equals': return String(val) === String(expected);
        case 'neq': return String(val) !== String(expected);
        case 'contains': return String(val).toLowerCase().includes(String(expected).toLowerCase());
        case 'gt': return parseFloat(val) > parseFloat(expected);
        case 'lt': return parseFloat(val) < parseFloat(expected);
        case 'exists': return !!val;
        case 'not_exists': return !val;
        case 'starts_with': return String(val).startsWith(String(expected));
        default: return !!val;
    }
}

async function doAction(node, session, flow, botToken) {
    if (node.actionType === 'set_var') {
        try {
            const p = typeof node.actionPayload === 'string' ? JSON.parse(node.actionPayload) : node.actionPayload;
            if (p?.variable) session.data[p.variable] = p.value || '';
        } catch {}
    } else if (node.actionType === 'set_tag' || node.actionType === 'add_tag') {
        if (!session.tags) session.tags = [];
        if (node.actionPayload) session.tags.push(node.actionPayload);
    } else if (node.actionType === 'notify_admin') {
        const chatId = node.config?.notifyChatId || node.notifyChatId;
        // Використовуємо окремий адмін бот для сповіщень
        const adminToken = process.env.ADMIN_BOT_TOKEN || botToken;
        if (chatId && adminToken) {
            const flowDisplayName = node.config?.notifyFlowName || flow?.name || flow?.title || '';
        let text = node.config?.notifyText || node.notifyText || '🔔 Новий лід: {{senderName}}';
            text = text
                .replace(/\{\{senderName\}\}/g, session.senderName || '')
                .replace(/\{\{senderId\}\}/g, session.senderId || '')
                .replace(/\{\{channel\}\}/g, session.channel || '')
                .replace(/\{\{flowName\}\}/g, flowDisplayName || session.currentFlowId || '')
                .replace(/\{\{flowId\}\}/g, session.currentFlowId || '')
                .replace(/\{\{(\w+)\}\}/g, (_, k) => {
                    const val = session.data?.[k] || '';
                    // FIX 8: truncate великі значення щоб не перевищити ліміт Telegram 4096 символів
                    return String(val).slice(0, 800);
                });
            // Загальний truncate повідомлення
            if (text.length > 4000) text = text.slice(0, 4000) + '...';
            await sendTg(adminToken, chatId, text).catch(() => {});
        }
    }
}

async function callAI(node, userText, session, compRef, compData) {
    try {
        // FIX 5: compData передається зовні щоб уникнути зайвого Firestore read
        if (!compData) {
            const compDoc = await compRef.get();
            compData = compDoc.data() || {};
        }
        const provider = node.config?.aiProvider || node.aiProvider || 'openai';
        const model = node.config?.aiModel || node.aiModel || node.model || 'gpt-4o-mini';
        const apiKey = node.config?.aiApiKey || node.aiApiKey
            || compData[provider + 'ApiKey']
            || compData.openaiApiKey
            || process.env.OPENAI_API_KEY;

        console.log('[callAI] provider:', provider, 'model:', model, 'apiKey exists:', !!apiKey);
        if (!apiKey) return node.config?.fallback || node.fallback || 'Вибачте, AI недоступний.';

        const sysPrompt = (node.config?.aiSystem || node.aiSystem || node.systemPrompt || 'You are helpful.')
            + '\n\nВАЖЛИВО: Завжди відповідай ТІЛЬКИ українською мовою.';
        const messages = [
            { role: 'system', content: sysPrompt },
            ...(session.aiHistory || []),
            { role: 'user', content: userText }
        ];

        let responseText = null;

        // FIX 2: Timeout 25 сек щоб не зависнути
        const aiAbort = new AbortController();
        const aiTimeout = setTimeout(() => aiAbort.abort(), 25000);

        // ── OpenAI / Deepseek (same API format) ──────────────
        if (provider === 'openai' || provider === 'deepseek' || model.startsWith('gpt-') || model.startsWith('o3') || model.startsWith('o4') || model.startsWith('o1') || model.startsWith('deepseek')) {
            const baseUrl = (provider === 'deepseek' || model.startsWith('deepseek'))
                ? 'https://api.deepseek.com/v1/chat/completions'
                : 'https://api.openai.com/v1/chat/completions';
            const r = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                signal: aiAbort.signal,
                body: JSON.stringify({
                    model,
                    ...(model.startsWith('o3') || model.startsWith('o4') || model.startsWith('gpt-5')
                        ? { max_completion_tokens: 1500 }
                        : { max_tokens: 1500 }),
                    messages
                })
            });
            clearTimeout(aiTimeout);
            const d = await r.json();
            console.log('[callAI] status:', r.status, 'error:', d.error?.message || 'none');
            responseText = d.choices?.[0]?.message?.content || null;

        // ── Anthropic Claude ──────────────────────────────────
        } else if (provider === 'anthropic' || model.startsWith('claude')) {
            const r = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                signal: aiAbort.signal,
                body: JSON.stringify({
                    model, max_tokens: 1500,
                    system: sysPrompt,
                    messages: (session.aiHistory || []).concat([{ role: 'user', content: userText }])
                })
            });
            clearTimeout(aiTimeout);
            const d = await r.json();
            console.log('[callAI] Anthropic status:', r.status, 'error:', d.error?.message || 'none');
            responseText = d.content?.[0]?.text || null;

        // ── Google Gemini ─────────────────────────────────────
        } else if (provider === 'google' || model.startsWith('gemini')) {
            const geminiModel = model || 'gemini-2.0-flash';
            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: sysPrompt + '\n\n' + userText }] }]
                })
            });
            const d = await r.json();
            console.log('[callAI] Google status:', r.status, 'error:', d.error?.message || 'none');
            responseText = d.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }

        return responseText || node.config?.fallback || node.fallback || 'Дякуємо!';
    } catch(e) {
        clearTimeout(aiTimeout);
        if (e.name === 'AbortError') {
            console.error('[callAI] TIMEOUT after 25s');
            return node.config?.fallback || node.fallback || 'Вибачте, відповідь зайняла надто довго. Спробуйте ще раз.';
        }
        console.error('[callAI]', e.message);
        return node.config?.fallback || node.fallback || 'Виникла помилка.';
    }
}

async function sendTg(token, chatId, text, buttons) {
    if (!token || !chatId) return;
    // Конвертуємо markdown bold/italic в HTML для Telegram
    let safeText = (text || ' ').trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    // Відновлюємо тільки базові теги які Telegram підтримує
    safeText = safeText
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    const payload = { chat_id: chatId, text: safeText, parse_mode: 'HTML' };
    if (buttons?.length) {
        // Кожна кнопка на окремому рядку (Telegram обрізає довгі рядки)
        payload.reply_markup = { inline_keyboard: buttons.map((b, i) => [
            b.url
                ? { text: b.label || b.text || '?', url: b.url }
                : { text: b.label || b.text || '?', callback_data: `btn_${i}` }
        ])};
    }
    try {
        const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const result = await r.json();
        if (!result.ok) console.error('[sendTg] Error:', result.description, JSON.stringify(payload).slice(0, 200));
    } catch(e) { console.error('[sendTg] fetch error:', e.message); }
}

// Показує індикатор "бот друкує..." в Telegram
async function sendTyping(token, chatId) {
    if (!token || !chatId) return;
    try {
        fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, action: 'typing' })
        }).catch(() => {});
    } catch(e) {}
}

// Відправляє повідомлення і повертає message_id
async function sendTgGetId(token, chatId, text) {
    if (!token || !chatId) return null;
    let safeText = (text || ' ').trim().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    try {
        const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: safeText, parse_mode: 'HTML' })
        });
        const result = await r.json();
        return result.ok ? result.result?.message_id : null;
    } catch(e) { return null; }
}

// Редагує існуюче повідомлення
async function editTg(token, chatId, messageId, text, buttons) {
    if (!token || !chatId || !messageId) return;
    let safeText = (text || ' ').trim()
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
        .replace(/\*(.*?)\*/g,'<i>$1</i>')
        .replace(/`(.*?)`/g,'<code>$1</code>');
    const payload = { chat_id: chatId, message_id: messageId, text: safeText, parse_mode: 'HTML' };
    if (buttons?.length) {
        payload.reply_markup = { inline_keyboard: buttons.map((b,i) => [
            b.url ? { text: b.label||b.text||'?', url: b.url }
                  : { text: b.label||b.text||'?', callback_data: `btn_${i}` }
        ])};
    }
    try {
        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
    } catch(e) { console.error('[editTg]', e.message); }
}

async function finish(session, flow, compRef, channel) {
    try {
        // Зберігаємо лід
        await compRef.collection('leads').add({
            senderId: session.senderId, senderName: session.senderName || '',
            channel, flowId: flow?.id || null, data: session.data || {}, tags: session.tags || [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // FIX 4: Upsert контакт по senderId (не дублюємо при повторних проходах)
        const contactId = `${channel}_${session.senderId}`;
        await compRef.collection('contacts').doc(contactId).set({
            senderId: session.senderId,
            senderName: session.senderName || '',
            channel,
            lastFlowId: flow?.id || null,
            lastData: session.data || {},
            tags: session.tags || [],
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        // Якщо перший раз — додаємо createdAt
        await compRef.collection('contacts').doc(contactId).set({
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }).catch(() => {});

    } catch(e) { console.error('[finish]', e.message); }
}
