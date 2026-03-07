// ============================================================
// TALKO Universal Webhook — Vercel Serverless
// Підтримує: Telegram, Instagram, Facebook
// POST /api/webhook/:companyId/:channel
// ============================================================

const admin = require('firebase-admin');

if (!admin.apps.length) {
    let pk = process.env.FIREBASE_PRIVATE_KEY || '';
    if (pk && !pk.includes('-----BEGIN')) {
        try { pk = Buffer.from(pk, 'base64').toString('utf8'); } catch(e) {} 
    }
    if (pk && pk.includes('\\n')) pk = pk.replace(/\\n/g, '\n');
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID || 'task-manager-44e84',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: pk || undefined,
        }),
    });
}
const db = admin.firestore();

module.exports = async (req, res) => {
    // Telegram webhook verification
    if (req.method === 'GET') {
        const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
        if (mode === 'subscribe') {
            const { companyId, channel } = req.query;
            if (companyId && channel) {
                const compDoc = await db.collection('companies').doc(companyId).get();
                const verifyToken = compDoc.data()?.integrations?.[channel]?.verifyToken;
                if (token === verifyToken) {
                    return res.status(200).send(challenge);
                }
            }
            return res.status(403).send('Forbidden');
        }
        return res.status(200).json({ ok: true });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { companyId, channel } = req.query;
    if (!companyId || !channel) return res.status(400).json({ error: 'Missing companyId or channel' });

    try {
        const body = req.body;
        let normalized = null;

        // ── Normalize by channel ──────────────────────────
        if (channel === 'telegram') {
            normalized = normalizeTelegram(body);
        } else if (channel === 'instagram' || channel === 'facebook') {
            normalized = normalizeMeta(body, channel);
        } else if (channel === 'viber') {
            normalized = normalizeViber(body);
        }

        if (!normalized) return res.status(200).json({ ok: true, skipped: true });

        // ── Load company integrations & flows ─────────────
        const compRef = db.collection('companies').doc(companyId);
        const [compDoc, flowsSnap] = await Promise.all([
            compRef.get(),
            compRef.collection('flows')
                .where('channel', '==', channel)
                .where('active', '==', true)
                .limit(10).get()
        ]);

        if (!compDoc.exists) return res.status(404).json({ error: 'Company not found' });
        const compData = compDoc.data();

        // ── Find or create session ────────────────────────
        const sessionId = `${channel}_${normalized.senderId}`;
        const sessionRef = compRef.collection('sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();

        let session = sessionDoc.exists ? sessionDoc.data() : {
            senderId: normalized.senderId,
            channel,
            senderName: normalized.senderName || '',
            currentFlowId: null,
            currentNodeIndex: 0,
            data: {},
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // ── Pick flow ─────────────────────────────────────
        let flow = null;
        if (session.currentFlowId) {
            flow = flowsSnap.docs.find(d => d.id === session.currentFlowId);
            if (flow) flow = { id: flow.id, ...flow.data() };
        }
        if (!flow && flowsSnap.docs.length > 0) {
            // Start first active flow
            const fd = flowsSnap.docs[0];
            flow = { id: fd.id, ...fd.data() };
            session.currentFlowId = flow.id;
            session.currentNodeIndex = 0;
        }

        // ── Process flow node ─────────────────────────────
        let reply = null;
        if (flow && flow.nodes && flow.nodes.length > 0) {
            const nodeIdx = session.currentNodeIndex || 0;
            const node = flow.nodes[nodeIdx];

            if (node) {
                // Save user answer to previous node
                if (nodeIdx > 0) {
                    const prevNode = flow.nodes[nodeIdx - 1];
                    if (prevNode?.saveAs) {
                        session.data[prevNode.saveAs] = normalized.text;
                    }
                }

                reply = await processNode(node, normalized, session, compData, compRef, channel);

                // Advance to next node
                session.currentNodeIndex = nodeIdx + 1;

                // If last node — create CRM lead
                if (session.currentNodeIndex >= flow.nodes.length) {
                    await createCRMLead(compRef, session, flow, channel, normalized);
                    session.currentFlowId = null;
                    session.currentNodeIndex = 0;
                    session.data = {};
                }
            }
        } else {
            // No flow — just save as lead directly
            await createCRMLead(compRef, session, null, channel, normalized);
            reply = { text: 'Дякуємо! Ми з вами зв\'яжемось.' };
        }

        // ── Save session ──────────────────────────────────
        session.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await sessionRef.set(session, { merge: true });

        // ── Send reply ────────────────────────────────────
        if (reply) {
            await sendReply(channel, normalized.senderId, reply, compData);
        }

        // Log incoming message
        await compRef.collection('sessions').doc(sessionId)
            .collection('messages').add({
                direction: 'in',
                text: normalized.text,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            }).catch(() => {});

        res.status(200).json({ ok: true });

    } catch (err) {
        console.error('[webhook] error:', err);
        res.status(200).json({ ok: true }); // Always 200 to Telegram
    }
};

// ── Normalizers ───────────────────────────────────────────
function normalizeTelegram(body) {
    const msg = body?.message || body?.callback_query?.message;
    if (!msg) return null;
    const from = body?.message?.from || body?.callback_query?.from;
    return {
        senderId: String(from?.id || ''),
        senderName: [from?.first_name, from?.last_name].filter(Boolean).join(' ') || from?.username || '',
        text: body?.message?.text || body?.callback_query?.data || '',
        raw: body,
    };
}

function normalizeMeta(body, channel) {
    try {
        const entry = body?.entry?.[0];
        const messaging = entry?.messaging?.[0] || entry?.changes?.[0]?.value?.messages?.[0];
        if (!messaging) return null;
        return {
            senderId: messaging.sender?.id || messaging.from || '',
            senderName: '',
            text: messaging.message?.text || messaging.text?.body || '',
            raw: body,
        };
    } catch { return null; }
}

function normalizeViber(body) {
    if (body?.event !== 'message') return null;
    return {
        senderId: body?.sender?.id || '',
        senderName: body?.sender?.name || '',
        text: body?.message?.text || '',
        raw: body,
    };
}

// ── Process Flow Node ─────────────────────────────────────
async function processNode(node, msg, session, compData, compRef, channel) {
    switch (node.type) {
        case 'message':
            return { text: node.text || '' };
        case 'buttons':
            return { text: node.text || '', buttons: node.buttons || [] };
        case 'question':
            if (node.saveAs) session.data[node.saveAs] = msg.text;
            return { text: node.text || '' };
        case 'ai_response': {
            const apiKey = compData.openaiApiKey;
            if (!apiKey) return { text: node.fallback || 'Дякуємо!' };
            try {
                const r = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: node.systemPrompt || 'You are a helpful assistant.' },
                            { role: 'user', content: msg.text }
                        ],
                        max_tokens: 300,
                    })
                });
                const data = await r.json();
                return { text: data.choices?.[0]?.message?.content || node.fallback || '' };
            } catch { return { text: node.fallback || 'Дякуємо!' }; }
        }
        case 'phone':
            session.data.phone = msg.text;
            return { text: node.text || 'Дякуємо! Ваш номер збережено.' };
        case 'email':
            session.data.email = msg.text;
            return { text: node.text || 'Дякуємо! Ваш email збережено.' };
        default:
            return null;
    }
}

// ── Create CRM Lead ───────────────────────────────────────
async function createCRMLead(compRef, session, flow, channel, msg) {
    const channelLabels = { telegram: 'Telegram', instagram: 'Instagram', facebook: 'Facebook', viber: 'Viber' };

    // Create or update contact
    const contactData = {
        name: session.data.name || session.senderName || msg.senderName || `${channelLabels[channel]} ${msg.senderId}`,
        phone: session.data.phone || '',
        email: session.data.email || '',
        source: channel,
        externalId: `${channel}_${msg.senderId}`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        notes: session.data.notes || '',
        tags: [channel],
    };

    // Check if contact exists
    const existingContacts = await compRef.collection('contacts')
        .where('externalId', '==', contactData.externalId).limit(1).get();

    let contactId;
    if (!existingContacts.empty) {
        contactId = existingContacts.docs[0].id;
        await compRef.collection('contacts').doc(contactId).update({
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } else {
        const contactRef = await compRef.collection('contacts').add(contactData);
        contactId = contactRef.id;
    }

    // Get first pipeline
    const pipelinesSnap = await compRef.collection('pipelines').limit(1).get();
    const pipelineId = pipelinesSnap.empty ? 'default' : pipelinesSnap.docs[0].id;
    const firstStage = pipelinesSnap.empty ? 'Новий лід' : (pipelinesSnap.docs[0].data().stages?.[0]?.name || 'Новий лід');

    // Create deal
    await compRef.collection('deals').add({
        title: `${channelLabels[channel]}: ${contactData.name}`,
        contactId,
        contactName: contactData.name,
        pipelineId,
        stage: firstStage,
        source: channel,
        flowId: flow?.id || null,
        flowName: flow?.name || null,
        collectedData: session.data || {},
        amount: 0,
        status: 'open',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}

// ── Send Reply ─────────────────────────────────────────────
async function sendReply(channel, senderId, reply, compData) {
    if (channel === 'telegram') {
        const token = compData?.integrations?.telegram?.botToken;
        if (!token) return;
        const payload = { chat_id: senderId, text: reply.text, parse_mode: 'HTML' };
        if (reply.buttons?.length) {
            payload.reply_markup = {
                inline_keyboard: [reply.buttons.map(b => ({ text: b.label, callback_data: b.value || b.label }))]
            };
        }
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    }
    // Instagram/Facebook — через Graph API (потребує page access token)
    // Viber — через Viber API
}
