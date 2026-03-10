// ============================================================
// api/ai-crm.js — TALKO AI CRM Analyzer (Vercel Serverless)
// Проксі до Anthropic API — key НІКОЛИ не йде в браузер
//
// Flow: Browser → POST /api/ai-crm { dealId, companyId }
//       + Authorization: Bearer <Firebase ID Token>
//   → verifyIdToken → read deal from Firestore
//   → call Anthropic API (key в env)
//   → return { analysis }
// ============================================================

const admin = require('firebase-admin');

// Firebase Admin init (singleton)
if (!admin.apps.length) {
    let pk = process.env.FIREBASE_PRIVATE_KEY || '';
    if (pk && !pk.includes('-----BEGIN')) {
        try { pk = Buffer.from(pk, 'base64').toString('utf8'); } catch(e) {}
    }
    pk = pk.replace(/\\n/g, '\n');
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId:   process.env.FIREBASE_PROJECT_ID || 'task-manager-44e84',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey:  pk || undefined,
        }),
    });
}

const db = admin.firestore();

// Дозволені origin-и (тільки наш домен)
const ALLOWED_ORIGINS = [
    'https://test-talko-task.vercel.app',
    'http://localhost:5500',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
];

module.exports = async function handler(req, res) {
    // ── CORS ────────────────────────────────────────────────
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // ── Auth: перевіряємо Firebase ID token ─────────────────
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: missing Bearer token' });
    }
    const idToken = authHeader.slice(7);

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch(e) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
    const uid = decodedToken.uid;

    // ── Params ───────────────────────────────────────────────
    const { dealId, companyId } = req.body || {};
    if (!dealId || !companyId) {
        return res.status(400).json({ error: 'dealId і companyId обовʼязкові' });
    }

    // ── Verify: user is member of this company ───────────────
    const memberRef = db.doc(`companies/${companyId}/users/${uid}`);
    const memberSnap = await memberRef.get().catch(() => null);
    if (!memberSnap || !memberSnap.exists) {
        return res.status(403).json({ error: 'Forbidden: not a company member' });
    }

    // ── Read deal ────────────────────────────────────────────
    const dealRef = db.doc(`companies/${companyId}/crm_deals/${dealId}`);
    const dealSnap = await dealRef.get().catch(() => null);
    if (!dealSnap || !dealSnap.exists) {
        return res.status(404).json({ error: 'Deal not found' });
    }
    const deal = { id: dealId, ...dealSnap.data() };

    // ── Get Anthropic API key from company settings ──────────
    // Key зберігається в Firestore, читається тут — ніколи не в браузері
    const compSnap = await db.doc(`companies/${companyId}`).get().catch(() => null);
    const apiKey = compSnap?.data()?.anthropicApiKey || compSnap?.data()?.openaiApiKey
                   || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        return res.status(400).json({ error: 'API ключ не встановлений. Додайте в Інтеграціях.' });
    }

    // ── Build prompt ─────────────────────────────────────────
    const stageLabels = {
        new:'Новий', contacted:'Контакт', qualified:'Кваліфікований',
        proposal:'Пропозиція', negotiation:'Переговори', won:'Виграно', lost:'Програно',
    };
    const stageLabel = stageLabels[deal.stage] || deal.stage || '—';
    const fmtAmount = (n) => n ? Number(n).toLocaleString('uk-UA') + ' грн' : 'не вказано';

    const prompt = `Ти CRM аналітик. Проаналізуй угоду:
Клієнт: ${deal.clientName || '—'}
Ніша: ${deal.clientNiche || '—'}
Стадія: ${stageLabel}
Сума: ${fmtAmount(deal.amount)}
${deal.leadData?.mainProblem ? 'Проблема клієнта: ' + deal.leadData.mainProblem + '\n' : ''}${deal.leadData?.mainGoal ? 'Ціль клієнта: ' + deal.leadData.mainGoal + '\n' : ''}Нотатка: ${deal.note || '—'}

Дай:
1) Ймовірність закриття %
2) Ключовий ризик (1 речення)
3) Наступний конкретний крок (1 речення)
4) Рекомендований текст повідомлення клієнту

Відповідь: лаконічно, 150-200 слів, українською.`;

    // ── Call Anthropic ───────────────────────────────────────
    let analysis;
    try {
        const isAnthropic = !apiKey.startsWith('sk-') || apiKey.startsWith('sk-ant');
        let response, data;

        if (isAnthropic) {
            response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 600,
                    messages: [{ role: 'user', content: prompt }],
                }),
            });
            data = await response.json();
            analysis = data.content?.[0]?.text || 'Не вдалось отримати аналіз';
        } else {
            // OpenAI fallback
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    max_tokens: 600,
                    messages: [{ role: 'user', content: prompt }],
                }),
            });
            data = await response.json();
            analysis = data.choices?.[0]?.message?.content || 'Не вдалось отримати аналіз';
        }

        if (!response.ok) {
            console.error('[ai-crm] API error:', response.status, JSON.stringify(data).slice(0, 200));
            return res.status(502).json({ error: 'AI API error: ' + (data.error?.message || response.status) });
        }
    } catch(e) {
        console.error('[ai-crm] fetch error:', e.message);
        return res.status(500).json({ error: 'Network error: ' + e.message });
    }

    // ── Save analysis to Firestore ───────────────────────────
    try {
        await dealRef.update({
            aiAnalysis:    analysis,
            aiAnalyzedAt:  admin.firestore.FieldValue.serverTimestamp(),
            aiAnalyzedBy:  uid,
        });
    } catch(e) {
        console.error('[ai-crm] Firestore write error:', e.message);
        // Не фейлимо запит — аналіз є, тільки save не вдалося
    }

    return res.status(200).json({ analysis });
};
