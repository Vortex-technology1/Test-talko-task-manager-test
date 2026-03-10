// ============================================================
// api/funnel-ai.js — TALKO AI Funnel Proxy v1.0
// Vercel Serverless Function — проксі до OpenAI/Anthropic
// Ключ читається з Firebase Admin (ніколи не в браузері)
// ============================================================

const admin = require('firebase-admin');

// Firebase Admin init (singleton)
if (!admin.apps.length) {
    let pk = process.env.FIREBASE_PRIVATE_KEY || '';
    if (pk && !pk.includes('-----BEGIN')) {
        try { pk = Buffer.from(pk, 'base64').toString('utf8'); } catch (e) {}
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

// Simple in-memory rate limiter (per IP, resets on cold start)
const ipRequests = new Map();
const RATE_LIMIT = 10;    // max requests
const RATE_WINDOW = 600000; // 10 minutes in ms

function checkRateLimit(ip) {
    const now = Date.now();
    const record = ipRequests.get(ip);
    if (!record || now - record.windowStart > RATE_WINDOW) {
        ipRequests.set(ip, { count: 1, windowStart: now });
        return true;
    }
    if (record.count >= RATE_LIMIT) return false;
    record.count++;
    return true;
}

module.exports = async function handler(req, res) {
    // ── CORS — тільки наш домен ─────────────────────────────
    const ALLOWED_ORIGINS = [
        'https://test-talko-task.vercel.app',
        'http://localhost:5500',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
    ];
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // ── Firebase Auth: перевіряємо ID token ──────────────────
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: missing Bearer token' });
    }
    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(authHeader.slice(7));
    } catch(e) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }

    // Rate limit
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: 'Забагато запитів. Спробуйте через 10 хвилин.' });
    }

    try {
        const { companyId, stepPrompt, leadData, provider } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: 'companyId is required' });
        }

        // Get API key from Firebase (server-side only, never exposed to browser)
        let apiKey = null;
        let resolvedProvider = provider || 'openai';

        // First try company-level BYOK key
        const companyDoc = await db.collection('companies').doc(companyId).get();
        if (companyDoc.exists) {
            const compData = companyDoc.data();
            if (resolvedProvider === 'anthropic' && compData.anthropicApiKey) {
                apiKey = compData.anthropicApiKey;
            } else if (compData.openaiApiKey) {
                apiKey = compData.openaiApiKey;
                resolvedProvider = 'openai';
            }
        }

        // Fallback to global key
        if (!apiKey) {
            const globalDoc = await db.collection('settings').doc('ai').get();
            if (globalDoc.exists) {
                apiKey = globalDoc.data()?.openaiApiKey;
                resolvedProvider = 'openai';
            }
        }

        if (!apiKey) {
            return res.status(402).json({ error: 'API ключ не налаштований. Зверніться до адміністратора.' });
        }

        // Build messages
        const leadSummary = leadData ? Object.entries(leadData).map(([k, v]) => `${k}: ${v}`).join('\n') : '';
        const systemPrompt = `[TALKO FUNNEL SYSTEM]
Ти AI асистент воронки продажів. Відповідай коротко, тепло, по суті.
Зібрані дані клієнта:\n${leadSummary || 'Поки немає'}

---
${stepPrompt || 'Допоможи клієнту і запропонуй записатися на консультацію.'}`;

        let responseText = '';

        if (resolvedProvider === 'anthropic') {
            // Anthropic Claude
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 400,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: 'Допоможи мені з вибором.' }]
                })
            });

            if (!response.ok) {
                const err = await response.text();
                console.error('Anthropic error:', err);
                return res.status(502).json({ error: 'Помилка AI сервісу' });
            }

            const data = await response.json();
            responseText = data.content?.[0]?.text || 'Вибачте, спробуйте ще раз.';

        } else {
            // OpenAI
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    max_tokens: 400,
                    temperature: 0.7,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: 'Допоможи мені з вибором.' }
                    ]
                })
            });

            if (!response.ok) {
                const err = await response.text();
                console.error('OpenAI error:', err);
                return res.status(502).json({ error: 'Помилка AI сервісу' });
            }

            const data = await response.json();
            responseText = data.choices?.[0]?.message?.content || 'Вибачте, спробуйте ще раз.';
        }

        return res.status(200).json({ response: responseText });

    } catch (error) {
        console.error('funnel-ai error:', error);
        return res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
};
