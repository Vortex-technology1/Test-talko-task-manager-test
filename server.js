// ============================================================
// TALKO Webhook Server — Railway (Express wrapper)
// ============================================================

const express = require('express');
const app = express();
app.use(express.json());

// Підключаємо існуючий webhook handler
const webhookHandler = require('./api/webhook');

app.get('/api/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/api/webhook', webhookHandler);
app.post('/api/webhook', webhookHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TALKO webhook running on port ${PORT}`));
