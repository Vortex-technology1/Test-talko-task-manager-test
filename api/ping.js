// Ping endpoint — щоб Vercel функція не засинала
module.exports = (req, res) => {
    res.status(200).json({ ok: true, ts: Date.now() });
};
