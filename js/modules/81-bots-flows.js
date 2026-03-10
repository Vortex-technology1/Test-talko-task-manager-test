// ============================================================
// 80-bots-flows.js — TALKO Flow Builder (Telegram Bots) v1.0
// UI для створення і управління ботами / flow-сценаріями
// ============================================================
(function () {
    'use strict';

    let botsFlows = [];
    let botsUnsubscribe = null;
    let botsCurrentFlowId = null;
    let botsCurrentBotId = null; // FIX: track botId for correct Firestore path
    let botsFlowNodes = [];
    let botsSelectedNodeId = null;
    let botsSubTab = 'list'; // list | editor | sessions

    // ── Init ───────────────────────────────────────────────
    window.initBotsModule = async function () {
        if (!window.currentCompanyId) return;
        renderBotsShell();
        await loadBotsData();
    };

    function renderBotsShell() {
        const container = document.getElementById('botsContainer');
        if (!container) return;
        container.innerHTML = `
            <div id="botsModule" style="padding:0.75rem;">
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;background:white;border-radius:12px;padding:0.4rem;box-shadow:var(--shadow);">
                    <button onclick="botsSwitchTab('list')" id="botsTabList"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:#22c55e;color:white;transition:all 0.2s;">
                        <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span> Боти
                    </button>
                    <button onclick="botsSwitchTab('sessions')" id="botsTabSessions"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:transparent;color:#525252;transition:all 0.2s;">
                        <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> Сесії
                    </button>
                    <button onclick="botsSwitchTab('settings')" id="botsTabSettings"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:transparent;color:#525252;transition:all 0.2s;">
                        <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></span>️ Налаштування
                    </button>
                </div>
                <div id="botsListView"></div>
                <div id="botsSessionsView" style="display:none;"></div>
                <div id="botsSettingsView" style="display:none;"></div>
            </div>`;
        if (window.lucide) lucide.createIcons();
    }

    window.botsSwitchTab = function (tab) {
        botsSubTab = tab;
        ['list','sessions','settings'].forEach(t => {
            const btn = document.getElementById('botsTab' + t.charAt(0).toUpperCase() + t.slice(1));
            const view = document.getElementById('bots' + t.charAt(0).toUpperCase() + t.slice(1) + 'View');
            if (btn) { btn.style.background = t === tab ? '#22c55e' : 'transparent'; btn.style.color = t === tab ? 'white' : '#525252'; }
            if (view) view.style.display = t === tab ? '' : 'none';
        });
        if (tab === 'list') renderBotsListView();
        if (tab === 'sessions') renderBotsSessionsView();
        if (tab === 'settings') renderBotsSettingsView();
        if (window.lucide) lucide.createIcons();
    };

    // ── Data ───────────────────────────────────────────────
    async function loadBotsData() {
        if (!window.currentCompanyId) return;
        const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
        if (botsUnsubscribe) botsUnsubscribe();

        // FIX: спочатку знаходимо бот документ, потім читаємо flows з правильного шляху
        try {
            const botsSnap = await base.collection('bots').limit(5).get();
            if (!botsSnap.empty) {
                botsCurrentBotId = botsSnap.docs[0].id;
                window._currentBotId = botsCurrentBotId;
                botsUnsubscribe = base.collection('bots').doc(botsCurrentBotId).collection('flows')
                    .orderBy('createdAt', 'desc').limit(100)
                    .onSnapshot(snap => {
                        botsFlows = snap.docs.map(d => ({ id: d.id, botId: botsCurrentBotId, ...d.data() }));
                        if (botsSubTab === 'list') renderBotsListView();
                    });
            } else {
                // Fallback: старий плоский шлях
                botsUnsubscribe = base.collection('flows')
                    .orderBy('createdAt', 'desc').limit(100)
                    .onSnapshot(snap => {
                        botsFlows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                        if (botsSubTab === 'list') renderBotsListView();
                    });
            }
        } catch(e) {
            console.error('[loadBotsData]', e);
        }
    }

    // ── List View ──────────────────────────────────────────
    function renderBotsListView() {
        const container = document.getElementById('botsListView');
        if (!container || botsSubTab !== 'list') return;

        const channelIcons = { telegram: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.9.5-1 1-.1.4.1.9.4 1.2l4 4L4 15l-2 1 1 2 2-1 3.8 1.2 4 4c.3.3.8.5 1.2.4.5-.1.9-.5 1-1z"/></svg></span>', instagram: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M8 6V4h8v2"/></svg></span>', whatsapp: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>', web: '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>' };
        const statusColors = { active: '#22c55e', draft: '#9ca3af', paused: '#f97316' };

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
                <div>
                    <div style="font-weight:700;font-size:1rem;">Чат-боти</div>
                    <div style="font-size:0.78rem;color:#6b7280;">${botsFlows.length} ботів</div>
                </div>
                <button onclick="openCreateFlowModal()" style="display:flex;align-items:center;gap:0.4rem;padding:0.55rem 1rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    + Новий бот
                </button>
            </div>

            ${botsFlows.length === 0 ? `
                <div style="text-align:center;padding:3rem;background:white;border-radius:12px;box-shadow:var(--shadow);">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span></div>
                    <div style="font-weight:600;margin-bottom:0.4rem;">Ботів поки немає</div>
                    <div style="font-size:0.85rem;color:#6b7280;margin-bottom:1rem;">Створіть першого бота і налаштуйте автоматичні сценарії</div>
                    <button onclick="openCreateFlowModal()" style="padding:0.6rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;">+ Створити бота</button>
                </div>` : `
                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                    ${botsFlows.map(flow => `
                        <div style="background:white;border-radius:14px;padding:1.1rem 1.25rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);border-left:4px solid ${statusColors[flow.status] || '#9ca3af'};transition:box-shadow 0.2s;">
                            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
                                <div style="flex:1;min-width:0;">
                                    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.35rem;flex-wrap:wrap;">
                                        <span style="font-size:1.2rem;">${channelIcons[flow.channel] || '📱'}</span>
                                        <span style="font-weight:700;font-size:1rem;color:#111827;">${escH(flow.name)}</span>
                                        <span style="font-size:0.72rem;background:${statusColors[flow.status] || '#9ca3af'}20;color:${statusColors[flow.status] || '#9ca3af'};padding:0.2rem 0.6rem;border-radius:20px;font-weight:700;letter-spacing:0.02em;">
                                            ${flow.status === 'active' ? '🟢 active' : flow.status === 'paused' ? '⏸ paused' : '⚫ draft'}
                                        </span>
                                    </div>
                                    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                                        <span style="font-size:0.78rem;color:#6b7280;">📡 ${flow.channel || 'telegram'}</span>
                                        <span style="font-size:0.78rem;color:#6b7280;">🔷 ${(flow.nodes || []).length} вузлів</span>
                                        <span style="font-size:0.78rem;color:#6b7280;">👥 ${flow.sessionCount || 0} сесій</span>
                                        ${flow.triggerKeyword ? `<span style="font-size:0.78rem;color:#6b7280;">🔑 <code style="background:#f3f4f6;padding:1px 5px;border-radius:4px;font-size:0.75rem;">${escH(flow.triggerKeyword)}</code></span>` : ''}
                                    </div>
                                    ${flow.deepLink || flow.slug ? `<div style="margin-top:0.5rem;display:flex;align-items:center;gap:6px;"><div style="font-size:0.73rem;color:#9ca3af;word-break:break-all;flex:1;">${escH(flow.deepLink || flow.slug)}</div><button onclick="event.stopPropagation();navigator.clipboard.writeText('${escH(flow.deepLink || flow.slug)}').catch(()=>{})" style="font-size:0.7rem;padding:2px 7px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:5px;cursor:pointer;color:#374151;white-space:nowrap;">Копіювати</button></div>` : ''}
                                </div>
                                <div style="display:flex;gap:0.4rem;flex-shrink:0;">
                                    <button onclick="toggleFlowStatus('${flow.id}','${flow.status}')"
                                        title="${flow.status === 'active' ? 'Поставити на паузу' : 'Активувати ланцюг'}"
                                        style="padding:0.45rem 0.9rem;background:${flow.status==='active'?'#fee2e2':'#f0fdf4'};color:${flow.status==='active'?'#ef4444':'#16a34a'};border:1.5px solid ${flow.status==='active'?'#fca5a5':'#86efac'};border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;">
                                        ${flow.status === 'active' ? '⏸ Пауза' : '▶ Активувати'}
                                    </button>
                                    <button onclick="openFlowEditor('${flow.id}')" title="Редагувати"
                                        style="padding:0.45rem 0.9rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;">
                                        ✏ Редагувати
                                    </button>
                                    <button onclick="confirmDeleteFlow('${flow.id}')" title="Видалити"
                                        style="padding:0.45rem 0.7rem;background:#fee2e2;color:#ef4444;border:none;border-radius:8px;cursor:pointer;font-size:1rem;font-weight:600;line-height:1;">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>`}
        `;
        if (window.lucide) lucide.createIcons();
    }

    window.toggleFlowStatus = async function (flowId, currentStatus) {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        const compRef = firebase.firestore().collection('companies').doc(window.currentCompanyId);
        // FIX: correct path
        const ref = botsCurrentBotId
            ? compRef.collection('bots').doc(botsCurrentBotId).collection('flows').doc(flowId)
            : compRef.collection('flows').doc(flowId);
        await ref.update({ status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        if (typeof showToast === 'function') showToast(newStatus === 'active' ? '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span> Бота активовано' : '⏸ Бота на паузі', 'success');
    };

    window.confirmDeleteFlow = function (flowId) {
        if (!confirm('Видалити бота? Активні сесії будуть зупинені.')) return;
        const compRef = firebase.firestore().collection('companies').doc(window.currentCompanyId);
        // FIX: correct path
        const ref = botsCurrentBotId
            ? compRef.collection('bots').doc(botsCurrentBotId).collection('flows').doc(flowId)
            : compRef.collection('flows').doc(flowId);
        ref.delete().then(() => { if (typeof showToast === 'function') showToast('Видалено', 'success'); });
    };

    // ── Create Flow Modal ──────────────────────────────────
    window.openCreateFlowModal = function () {
        const html = `
            <div id="botsCreateOverlay" onclick="if(event.target===this)this.remove()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;">
                <div style="background:white;border-radius:16px;width:100%;max-width:440px;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
                    <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;">Новий бот</div>
                        <button onclick="document.getElementById('botsCreateOverlay').remove()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА БОТА *</label>
                            <input id="newFlowName" placeholder="Наприклад: Запис на прийом"
                                style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">КАНАЛ</label>
                            <select id="newFlowChannel" style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;">
                                <option value="telegram"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.9.5-1 1-.1.4.1.9.4 1.2l4 4L4 15l-2 1 1 2 2-1 3.8 1.2 4 4c.3.3.8.5 1.2.4.5-.1.9-.5 1-1z"/></svg></span> Telegram</option>
                                <option value="instagram"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M8 6V4h8v2"/></svg></span> Instagram</option>
                                <option value="whatsapp"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> WhatsApp</option>
                                <option value="web"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span> Web Widget</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТРИГЕР (ключове слово або /start)</label>
                            <input id="newFlowTrigger" placeholder="/start або записатись"
                                style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                    </div>
                    <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                        <button onclick="document.getElementById('botsCreateOverlay').remove()" style="padding:0.55rem 1rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                        <button onclick="saveNewFlow()" style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Створити</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('newFlowName')?.focus();
    };

    window.saveNewFlow = async function () {
        const name = document.getElementById('newFlowName')?.value.trim();
        if (!name) { alert('Введіть назву'); return; }
        try {
            const db = firebase.firestore();
            const compRef = db.collection('companies').doc(window.currentCompanyId);
            const channel = document.getElementById('newFlowChannel')?.value || 'telegram';

            // FIX: якщо немає botId — створюємо бот документ
            if (!botsCurrentBotId) {
                const botDoc = await compRef.collection('bots').add({
                    channel,
                    token: '',
                    status: 'active',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                botsCurrentBotId = botDoc.id;
                window._currentBotId = botsCurrentBotId;
            }

            const ref = await compRef.collection('bots').doc(botsCurrentBotId).collection('flows').add({
                name,
                channel,
                triggerKeyword: document.getElementById('newFlowTrigger')?.value.trim() || '/start',
                status: 'draft',
                nodes: [],
                sessionCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            document.getElementById('botsCreateOverlay')?.remove();
            if (typeof showToast === 'function') showToast('Бота створено ✓', 'success');
            openFlowEditor(ref.id, botsCurrentBotId);
        } catch (err) { alert('Помилка: ' + err.message); }
    };

    // ── Flow Node Editor (slide-in panel) ──────────────────
    window.openFlowEditor = async function (flowId, botId) {
        botsCurrentFlowId = flowId;
        botsSelectedNodeId = null;
        const resolvedBotId = botId || botsCurrentBotId || window._currentBotId || null;

        // FIX: читаємо з правильного шляху
        const db = firebase.firestore();
        const compRef = db.collection('companies').doc(window.currentCompanyId);
        let docSnap = null;
        if (resolvedBotId) {
            docSnap = await compRef.collection('bots').doc(resolvedBotId).collection('flows').doc(flowId).get();
        }
        if (!docSnap || !docSnap.exists) {
            // Fallback: плоский шлях
            docSnap = await compRef.collection('flows').doc(flowId).get();
        }
        if (!docSnap.exists) return;
        const flowData = { id: docSnap.id, ...docSnap.data() };
        botsFlowNodes = JSON.parse(JSON.stringify(flowData.nodes || []));

        window._currentBotId = resolvedBotId;
        openFlowCanvas(flowData.id, resolvedBotId);
    };

    function renderFlowEditorPanel(flowData) {
        document.getElementById('botsEditorOverlay')?.remove();
        const nodeTypes = [
            ['message','Повідомлення','<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>'],
            ['question','Питання','❓'],
            ['buttons','Кнопки','🔘'],
            ['condition','Умова','<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>'],
            ['ai','AI відповідь','<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span>'],
            ['delay','Затримка','⏳'],
            ['talko_task','Задача TALKO','<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span>'],
            ['talko_deal','Угода CRM','<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></span>'],
            ['tag','Тег контакту','🏷️'],
            ['human','Передати менеджеру','👤'],
            ['end','Завершення','🏁'],
        ];

        const html = `
            <div id="botsEditorOverlay"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10001;display:flex;align-items:stretch;justify-content:flex-end;">
                <div style="background:white;width:100%;max-width:720px;display:flex;flex-direction:column;overflow:hidden;box-shadow:-8px 0 32px rgba(0,0,0,0.15);">

                    <!-- Header -->
                    <div style="padding:1rem 1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                        <div>
                            <div style="font-weight:700;font-size:1rem;">${escH(flowData.name)} <span style="font-size:0.75rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:2px 8px;color:#6b7280;font-weight:500;">${flowData.channel}</span></div>
                            <div style="font-size:0.78rem;color:#6b7280;margin-top:1px;">${botsFlowNodes.length} вузлів · тригер: <code style="background:#f0fdf4;color:#16a34a;padding:1px 5px;border-radius:4px;">${escH(flowData.triggerKeyword || '/start')}</code></div>
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            <button onclick="saveFlowNodes()" style="padding:0.45rem 0.9rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;">💾 Зберегти</button>
                            <button onclick="document.getElementById('botsEditorOverlay').remove()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                        </div>
                    </div>

                    <!-- Body: nodes list + editor -->
                    <div style="display:flex;flex:1;min-height:0;overflow:hidden;">

                        <!-- Nodes list -->
                        <div style="width:260px;flex-shrink:0;border-right:1px solid #f0f0f0;overflow-y:auto;padding:0.75rem;background:#f9fafb;display:flex;flex-direction:column;gap:0.75rem;">
                            <div>
                                <div style="font-size:0.72rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.4rem;">ВУЗЛИ СЦЕНАРІЮ</div>
                                <div id="botsNodesList"></div>
                            </div>
                            <div>
                                <div style="font-size:0.72rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.4rem;">ДОДАТИ ВУЗОЛ</div>
                                <div style="display:flex;flex-direction:column;gap:0.3rem;">
                                    ${nodeTypes.map(([type,label,icon]) => `
                                        <button onclick="addFlowNode('${type}')"
                                            style="text-align:left;padding:0.4rem 0.6rem;background:white;border:1px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:0.78rem;display:flex;align-items:center;gap:0.4rem;transition:background 0.15s;"
                                            onmouseenter="this.style.background='#f0fdf4'" onmouseleave="this.style.background='white'">
                                            <span style="font-size:0.85rem;">${icon}</span>${label}
                                        </button>`).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Node editor -->
                        <div style="flex:1;overflow-y:auto;padding:1rem;" id="botsNodeEditor">
                            <div style="text-align:center;padding:3rem 1rem;color:#9ca3af;">
                                <div style="font-size:2rem;margin-bottom:0.5rem;">👈</div>
                                <div>Виберіть вузол або додайте новий</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        renderBotsNodesList();
        if (window.lucide) lucide.createIcons();
    }

    // ── Nodes List ─────────────────────────────────────────
    function renderBotsNodesList() {
        const container = document.getElementById('botsNodesList');
        if (!container) return;
        const icons = { message:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>', question:'❓', buttons:'🔘', condition:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>', ai:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span>', delay:'⏳', talko_task:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span>', talko_deal:'<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></span>', tag:'🏷️', human:'👤', end:'🏁' };

        if (botsFlowNodes.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:1rem;color:#9ca3af;font-size:0.8rem;">Вузлів немає</div>';
            return;
        }

        container.innerHTML = botsFlowNodes.map((node, i) => `
            <div onclick="selectFlowNode('${node.id}')" data-node-id="${node.id}"
                style="padding:0.45rem 0.6rem;border-radius:7px;cursor:pointer;margin-bottom:0.25rem;background:${botsSelectedNodeId===node.id?'#f0fdf4':'white'};border:1px solid ${botsSelectedNodeId===node.id?'#22c55e':'#e5e7eb'};transition:all 0.15s;display:flex;align-items:center;gap:0.4rem;">
                <span style="font-size:0.82rem;">${icons[node.type]||'📋'}</span>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:0.78rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escH(node.name||node.type)}</div>
                    <div style="font-size:0.68rem;color:#9ca3af;">${node.type}</div>
                </div>
                <div style="display:flex;flex-direction:column;">
                    ${i>0?`<button onclick="event.stopPropagation();moveNode('${node.id}',-1)" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:0.65rem;padding:1px;">▲</button>`:''}
                    ${i<botsFlowNodes.length-1?`<button onclick="event.stopPropagation();moveNode('${node.id}',1)" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:0.65rem;padding:1px;">▼</button>`:''}
                </div>
                <button onclick="event.stopPropagation();deleteFlowNode('${node.id}')" style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:0.72rem;padding:2px;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
            </div>`).join('');
    }

    window.addFlowNode = function (type) {
        const id = 'node_' + Date.now();
        const names = { message:'Повідомлення', question:'Питання', buttons:'Вибір', condition:'Умова', ai:'AI', delay:'Затримка', talko_task:'Задача', talko_deal:'Угода', tag:'Тег', human:'Менеджер', end:'Завершення' };
        botsFlowNodes.push({ id, type, name: names[type]||type, text:'', options:[], saveAs:null, condition:null, delay:0, taskTitle:'', dealTitle:'', tagName:'', aiPrompt:'', nextNode:null });
        renderBotsNodesList();
        selectFlowNode(id);
    };

    window.deleteFlowNode = function (nodeId) {
        if (!confirm('Видалити вузол?')) return;
        botsFlowNodes = botsFlowNodes.filter(n => n.id !== nodeId);
        if (botsSelectedNodeId === nodeId) {
            botsSelectedNodeId = null;
            const ed = document.getElementById('botsNodeEditor');
            if (ed) ed.innerHTML = '<div style="text-align:center;padding:3rem;color:#9ca3af;">Виберіть вузол</div>';
        }
        renderBotsNodesList();
    };

    window.moveNode = function (nodeId, dir) {
        const idx = botsFlowNodes.findIndex(n => n.id === nodeId);
        if (idx < 0) return;
        const ni = idx + dir;
        if (ni < 0 || ni >= botsFlowNodes.length) return;
        [botsFlowNodes[idx], botsFlowNodes[ni]] = [botsFlowNodes[ni], botsFlowNodes[idx]];
        renderBotsNodesList();
    };

    window.selectFlowNode = function (nodeId) {
        botsSelectedNodeId = nodeId;
        renderBotsNodesList();
        renderNodeEditor(nodeId);
    };

    // ── Node Editor ────────────────────────────────────────
    function renderNodeEditor(nodeId) {
        const node = botsFlowNodes.find(n => n.id === nodeId);
        const container = document.getElementById('botsNodeEditor');
        if (!node || !container) return;

        const allNodes = botsFlowNodes.filter(n => n.id !== nodeId);
        const nextOpts = allNodes.map(n => `<option value="${n.id}" ${node.nextNode===n.id?'selected':''}>${escH(n.name||n.type)}</option>`).join('');

        let specific = '';

        if (node.type === 'message') {
            specific = field('ТЕКСТ ПОВІДОМЛЕННЯ') + textarea(node.text, `updateNode('${nodeId}','text',this.value)`);
        }

        if (node.type === 'question') {
            specific = field('ПИТАННЯ') + textarea(node.text, `updateNode('${nodeId}','text',this.value)`) +
                field('ЗБЕРЕГТИ ВІДПОВІДЬ ЯК') + input(node.saveAs||'', `updateNode('${nodeId}','saveAs',this.value)`, 'answer');
        }

        if (node.type === 'buttons') {
            specific = field('ТЕКСТ ПЕРЕД КНОПКАМИ') + textarea(node.text, `updateNode('${nodeId}','text',this.value)`) +
                `<div><label style="${lbl()}">КНОПКИ</label>
                <div id="nodeOpts_${nodeId}" style="display:flex;flex-direction:column;gap:0.4rem;margin-bottom:0.4rem;">
                    ${(node.options||[]).map((o,i) => `
                        <div style="display:flex;gap:0.4rem;align-items:center;">
                            <input value="${escH(o.text)}" placeholder="Текст" onblur="updateNodeOpt('${nodeId}',${i},'text',this.value)"
                                style="flex:1;padding:0.4rem 0.5rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.82rem;">
                            <select onchange="updateNodeOpt('${nodeId}',${i},'nextNode',this.value)"
                                style="flex:1;padding:0.4rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.75rem;background:white;">
                                <option value="">→ авто</option>
                                ${allNodes.map(n=>`<option value="${n.id}" ${o.nextNode===n.id?'selected':''}>${escH(n.name||n.type)}</option>`).join('')}
                            </select>
                            <button onclick="removeNodeOpt('${nodeId}',${i})" style="background:#fee2e2;border:none;color:#ef4444;border-radius:5px;cursor:pointer;padding:3px 6px;font-size:0.72rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                        </div>`).join('')}
                </div>
                <button onclick="addNodeOpt('${nodeId}')" style="width:100%;padding:0.4rem;background:#f0fdf4;color:#16a34a;border:1px dashed #bbf7d0;border-radius:6px;cursor:pointer;font-size:0.8rem;">+ Додати кнопку</button>
                </div>`;
        }

        if (node.type === 'condition') {
            specific = field('ПОЛЕ ДЛЯ ПЕРЕВІРКИ') + input(node.conditionField||'', `updateNode('${nodeId}','conditionField',this.value)`, 'phone') +
                field('ОПЕРАТОР') + `<select onchange="updateNode('${nodeId}','conditionOp',this.value)" style="width:100%;padding:0.55rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;margin-bottom:0.75rem;">
                    ${['exists','not_exists','equals','contains','starts_with'].map(op=>`<option value="${op}" ${node.conditionOp===op?'selected':''}>${{exists:'існує',not_exists:'не існує',equals:'=',contains:'містить',starts_with:'починається з'}[op]||op}</option>`).join('')}
                </select>` +
                field('ЗНАЧЕННЯ (для =, містить, починається з)') + input(node.conditionValue||'', `updateNode('${nodeId}','conditionValue',this.value)`, '') +
                `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                    <div><label style="${lbl()}">ЯКЩО ТАК →</label>
                        <select onchange="updateNode('${nodeId}','nextNodeTrue',this.value||null)" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.8rem;background:white;">
                            <option value="">→ авто</option>${nextOpts}
                        </select>
                    </div>
                    <div><label style="${lbl()}">ЯКЩО НІ →</label>
                        <select onchange="updateNode('${nodeId}','nextNodeFalse',this.value||null)" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.8rem;background:white;">
                            <option value="">→ авто</option>${nextOpts}
                        </select>
                    </div>
                </div>`;
        }

        if (node.type === 'ai') {
            specific = field('СИСТЕМНИЙ ПРОМПТ') + textarea(node.aiPrompt||'', `updateNode('${nodeId}','aiPrompt',this.value)`, 'Ти консультант. Дані клієнта: {session.data}') +
                field('ПРОВАЙДЕР') + `<select onchange="updateNode('${nodeId}','aiProvider',this.value)" style="width:100%;padding:0.55rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;margin-bottom:0.75rem;">
                    <option value="openai" ${node.aiProvider!=='anthropic'?'selected':''}>OpenAI GPT-4o-mini</option>
                    <option value="anthropic" ${node.aiProvider==='anthropic'?'selected':''}>Anthropic claude-haiku</option>
                </select>`;
        }

        if (node.type === 'delay') {
            specific = field('ЗАТРИМКА (хвилин)') + input(node.delay||0, `updateNode('${nodeId}','delay',parseInt(this.value)||0)`, '60', 'number');
        }

        if (node.type === 'talko_task') {
            specific = field('ЗАГОЛОВОК ЗАДАЧІ') + input(node.taskTitle||'', `updateNode('${nodeId}','taskTitle',this.value)`, 'Опрацювати ліда') +
                field('ВІДПОВІДАЛЬНИЙ (роль)') + `<select onchange="updateNode('${nodeId}','taskAssignRole',this.value)" style="width:100%;padding:0.55rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;margin-bottom:0.75rem;">
                    <option value="owner">Власник</option>
                    <option value="manager">Менеджер</option>
                </select>` +
                field('ПРІОРИТЕТ') + `<select onchange="updateNode('${nodeId}','taskPriority',this.value)" style="width:100%;padding:0.55rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;">
                    <option value="high">🔴 Високий</option>
                    <option value="medium" selected>🟡 Середній</option>
                    <option value="low">🟢 Низький</option>
                </select>`;
        }

        if (node.type === 'talko_deal') {
            specific = field('НАЗВА УГОДИ') + input(node.dealTitle||'', `updateNode('${nodeId}','dealTitle',this.value)`, '{contact.name} — запит з боту') +
                field('СТАДІЯ') + input(node.dealStage||'new', `updateNode('${nodeId}','dealStage',this.value)`, 'new');
        }

        if (node.type === 'tag') {
            specific = field('ТЕГ') + input(node.tagName||'', `updateNode('${nodeId}','tagName',this.value)`, 'telegram-bot');
        }

        if (node.type === 'human') {
            specific = `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:0.75rem;font-size:0.82rem;color:#9a3412;margin-bottom:0.75rem;">
                👤 Цей вузол передає розмову живому менеджеру. Бот надішле сповіщення в TALKO і зупинить автоматичні відповіді до вирішення.
            </div>` + field('ПОВІДОМЛЕННЯ ДЛЯ КЛІЄНТА') + textarea(node.text||'Дякую! Зараз передам вас до менеджера.', `updateNode('${nodeId}','text',this.value)`);
        }

        if (node.type === 'end') {
            specific = field('ФІНАЛЬНЕ ПОВІДОМЛЕННЯ') + textarea(node.text||'Дякуємо за звернення! До зустрічі. <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg></span>', `updateNode('${nodeId}','text',this.value)`);
        }

        const showNextNode = !['buttons','condition','end'].includes(node.type);

        container.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <div>
                    <label style="${lbl()}">НАЗВА ВУЗЛА</label>
                    <input value="${escH(node.name||'')}" onblur="updateNode('${nodeId}','name',this.value)"
                        style="width:100%;padding:0.55rem 0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;font-weight:600;box-sizing:border-box;">
                </div>
                ${specific}
                ${showNextNode ? `<div>
                    <label style="${lbl()}">НАСТУПНИЙ ВУЗОЛ</label>
                    <select onchange="updateNode('${nodeId}','nextNode',this.value||null)"
                        style="width:100%;padding:0.55rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;">
                        <option value="">— Автоматично —</option>${nextOpts}
                    </select>
                </div>` : ''}
            </div>`;
    }

    function lbl() { return 'font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;'; }
    function field(label) { return `<div style="margin-bottom:0.75rem;"><label style="${lbl()}">${label}</label>`; }
    function input(val, onblur, placeholder, type) { return `<input type="${type||'text'}" value="${escH(String(val))}" onblur="${onblur}" placeholder="${placeholder||''}" style="width:100%;padding:0.55rem 0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;"></div>`; }
    function textarea(val, onblur, placeholder) { return `<textarea onblur="${onblur}" style="width:100%;min-height:90px;padding:0.55rem 0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;resize:vertical;font-family:inherit;box-sizing:border-box;" placeholder="${placeholder||''}">${escH(val||'')}</textarea></div>`; }

    window.updateNode = function (nodeId, field, value) {
        const node = botsFlowNodes.find(n => n.id === nodeId);
        if (node) { node[field] = value; renderBotsNodesList(); }
    };
    window.addNodeOpt = function (nodeId) {
        const node = botsFlowNodes.find(n => n.id === nodeId);
        if (!node) return;
        if (!node.options) node.options = [];
        node.options.push({ text: 'Варіант ' + (node.options.length + 1), nextNode: null });
        renderNodeEditor(nodeId); renderBotsNodesList();
    };
    window.updateNodeOpt = function (nodeId, idx, field, value) {
        const node = botsFlowNodes.find(n => n.id === nodeId);
        if (node?.options?.[idx]) node.options[idx][field] = value || null;
    };
    window.removeNodeOpt = function (nodeId, idx) {
        const node = botsFlowNodes.find(n => n.id === nodeId);
        if (!node?.options) return;
        node.options.splice(idx, 1);
        renderNodeEditor(nodeId);
    };

    // ── Save ───────────────────────────────────────────────
    window.saveFlowNodes = async function () {
        if (!botsCurrentFlowId) return;
        try {
            const compRef = firebase.firestore().collection('companies').doc(window.currentCompanyId);
            // FIX: correct path
            const ref = botsCurrentBotId
                ? compRef.collection('bots').doc(botsCurrentBotId).collection('flows').doc(botsCurrentFlowId)
                : compRef.collection('flows').doc(botsCurrentFlowId);
            await ref.update({ nodes: botsFlowNodes, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            if (typeof showToast === 'function') showToast('Збережено ✓', 'success');
        } catch (e) { alert('Помилка: ' + e.message); }
    };

    // ── Sessions View ──────────────────────────────────────
    async function renderBotsSessionsView() {
        const container = document.getElementById('botsSessionsView');
        if (!container || botsSubTab !== 'sessions') return;
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;">Завантаження...</div>';

        try {
            const snap = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('sessions').orderBy('updatedAt', 'desc').limit(100).get();
            const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));

            container.innerHTML = `
                <div style="font-weight:700;font-size:1rem;margin-bottom:1rem;">Активні сесії (${sessions.length})</div>
                ${sessions.length === 0 ? '<div style="text-align:center;padding:2rem;color:#9ca3af;background:white;border-radius:12px;box-shadow:var(--shadow);">Сесій поки немає</div>' :
                `<div style="display:flex;flex-direction:column;gap:0.5rem;">
                    ${sessions.map(s => {
                        const statusColor = s.status === 'active' ? '#22c55e' : s.status === 'waiting_human' ? '#f97316' : '#9ca3af';
                        const flow = botsFlows.find(f => f.id === s.flowId);
                        return `<div style="background:white;border-radius:10px;padding:0.75rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:0.75rem;">
                            <div style="width:10px;height:10px;border-radius:50%;background:${statusColor};flex-shrink:0;"></div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-weight:600;font-size:0.85rem;">${escH(s.contactName || s.chatId || 'Анонім')}</div>
                                <div style="font-size:0.75rem;color:#6b7280;">${flow?.name || s.flowId || ''} · ${s.currentNodeId || 'вузол 0'}</div>
                            </div>
                            <div style="font-size:0.72rem;color:#9ca3af;">${s.lastActivity?.toDate ? relTime(s.lastActivity.toDate()) : ''}</div>
                            ${s.status === 'waiting_human' ? `<button onclick="resolveHumanSession('${s.id}')" style="padding:0.3rem 0.6rem;background:#22c55e;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;">Вирішити</button>` : ''}
                        </div>`;
                    }).join('')}
                </div>`}`;
        } catch (e) {
            container.innerHTML = '<div style="color:#ef4444;padding:1rem;">Помилка завантаження</div>';
        }
    }

    window.resolveHumanSession = async function (sessionId) {
        await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('sessions').doc(sessionId)
            .update({ status: 'resolved', resolvedAt: firebase.firestore.FieldValue.serverTimestamp() });
        if (typeof showToast === 'function') showToast('Сесію вирішено', 'success');
        renderBotsSessionsView();
    };

    // ── Settings View ──────────────────────────────────────
    async function renderBotsSettingsView() {
        const container = document.getElementById('botsSettingsView');
        if (!container || botsSubTab !== 'settings') return;

        const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
        const compData = compDoc.data() || {};
        const integrations = compData.integrations || {};
        const webhookBase = `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=`;

        const channelStatus = (ch) => {
            const ok = integrations[ch]?.connected;
            return ok
                ? `<span style="color:#22c55e;font-size:0.78rem;font-weight:600;">● Підключено</span>`
                : `<span style="color:#9ca3af;font-size:0.78rem;">○ Не підключено</span>`;
        };

        container.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">

                <!-- TELEGRAM -->
                <div style="background:white;border-radius:12px;padding:1.25rem;box-shadow:var(--shadow);">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 6.75a2.25 2.25 0 0 0 .126 4.238l3.553 1.184 1.184 3.553a2.25 2.25 0 0 0 4.238.126l6.75-16.5a2.242 2.242 0 0 0-.329-2.566z"/></svg>
                            <span style="font-weight:700;font-size:0.95rem;">Telegram</span>
                        </div>
                        ${channelStatus('telegram')}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.6rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">Bot Token (від @BotFather)</label>
                            <div style="display:flex;gap:0.5rem;">
                                <input type="password" id="tgBotToken"
                                    value="${integrations.telegram?.botToken ? '••••••••' + (integrations.telegram.botToken).slice(-6) : ''}"
                                    placeholder="123456789:AAF..."
                                    style="flex:1;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                                <button onclick="botsConnectTelegram()" style="padding:0.55rem 1rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;white-space:nowrap;">Підключити</button>
                            </div>
                        </div>
                        ${integrations.telegram?.connected ? `
                        <div style="background:#f0fdf4;border-radius:8px;padding:0.6rem 0.75rem;font-size:0.78rem;color:#166534;">
                            Вебхук: <code style="word-break:break-all;">${webhookBase}telegram</code>
                        </div>
                        <button onclick="botsDisconnectChannel('telegram')" style="align-self:flex-start;padding:0.35rem 0.75rem;background:#fee2e2;color:#ef4444;border:none;border-radius:6px;cursor:pointer;font-size:0.78rem;">Відключити</button>
                        ` : `
                        <div style="font-size:0.78rem;color:#6b7280;">
                            1. Створіть бота через <a href="https://t.me/BotFather" target="_blank" style="color:#22c55e;">@BotFather</a> → скопіюйте токен<br>
                            2. Вставте токен вище → натисніть "Підключити"<br>
                            3. Система автоматично встановить вебхук
                        </div>
                        `}
                    </div>
                </div>

                <!-- INSTAGRAM -->
                <div style="background:white;border-radius:12px;padding:1.25rem;box-shadow:var(--shadow);">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            <span style="font-weight:700;font-size:0.95rem;">Instagram</span>
                        </div>
                        ${channelStatus('instagram')}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.6rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">Page Access Token</label>
                            <div style="display:flex;gap:0.5rem;">
                                <input type="password" id="igPageToken"
                                    value="${integrations.instagram?.pageToken ? '••••••' + (integrations.instagram.pageToken).slice(-6) : ''}"
                                    placeholder="EAABwzL..."
                                    style="flex:1;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                                <button onclick="botsConnectMeta('instagram')" style="padding:0.55rem 1rem;background:#e1306c;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;white-space:nowrap;">Підключити</button>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">Verify Token (довільний рядок)</label>
                            <input type="text" id="igVerifyToken"
                                value="${integrations.instagram?.verifyToken || ''}"
                                placeholder="talko_verify_123"
                                style="width:100%;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
                        </div>
                        ${integrations.instagram?.connected ? `
                        <div style="background:#fff0f6;border-radius:8px;padding:0.6rem 0.75rem;font-size:0.78rem;color:#831843;">
                            Вебхук URL: <code style="word-break:break-all;">${webhookBase}instagram</code><br>
                            Додайте цей URL в Meta Developer Console → Webhooks
                        </div>
                        <button onclick="botsDisconnectChannel('instagram')" style="align-self:flex-start;padding:0.35rem 0.75rem;background:#fee2e2;color:#ef4444;border:none;border-radius:6px;cursor:pointer;font-size:0.78rem;">Відключити</button>
                        ` : `
                        <div style="font-size:0.78rem;color:#6b7280;">
                            1. Створіть додаток на <a href="https://developers.facebook.com" target="_blank" style="color:#22c55e;">developers.facebook.com</a><br>
                            2. Отримайте Page Access Token<br>
                            3. Вставте токен і Verify Token → "Підключити"<br>
                            4. Додайте Webhook URL в Meta Console
                        </div>
                        `}
                    </div>
                </div>

                <!-- FACEBOOK -->
                <div style="background:white;border-radius:12px;padding:1.25rem;box-shadow:var(--shadow);">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1877f2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            <span style="font-weight:700;font-size:0.95rem;">Facebook Messenger</span>
                        </div>
                        ${channelStatus('facebook')}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.6rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">Page Access Token</label>
                            <div style="display:flex;gap:0.5rem;">
                                <input type="password" id="fbPageToken"
                                    value="${integrations.facebook?.pageToken ? '••••••' + (integrations.facebook.pageToken).slice(-6) : ''}"
                                    placeholder="EAABwzL..."
                                    style="flex:1;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                                <button onclick="botsConnectMeta('facebook')" style="padding:0.55rem 1rem;background:#1877f2;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;white-space:nowrap;">Підключити</button>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">Verify Token</label>
                            <input type="text" id="fbVerifyToken"
                                value="${integrations.facebook?.verifyToken || ''}"
                                placeholder="talko_verify_456"
                                style="width:100%;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
                        </div>
                        ${integrations.facebook?.connected ? `
                        <div style="background:#eff6ff;border-radius:8px;padding:0.6rem 0.75rem;font-size:0.78rem;color:#1e3a8a;">
                            Вебхук URL: <code style="word-break:break-all;">${webhookBase}facebook</code>
                        </div>
                        <button onclick="botsDisconnectChannel('facebook')" style="align-self:flex-start;padding:0.35rem 0.75rem;background:#fee2e2;color:#ef4444;border:none;border-radius:6px;cursor:pointer;font-size:0.78rem;">Відключити</button>
                        ` : `
                        <div style="font-size:0.78rem;color:#6b7280;">
                            1. Той самий Meta Developer додаток<br>
                            2. Підключіть Messenger product<br>
                            3. Отримайте Page Access Token для своєї сторінки
                        </div>
                        `}
                    </div>
                </div>

                <!-- AI KEYS -->
                <div style="background:white;border-radius:12px;padding:1.25rem;box-shadow:var(--shadow);">
                    <h3 style="font-weight:700;font-size:0.9rem;margin-bottom:0.75rem;color:#374151;">AI Ключі (для AI вузлів у флоу)</h3>
                    <div style="display:flex;flex-direction:column;gap:0.6rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">OpenAI API Key</label>
                            <div style="display:flex;gap:0.5rem;">
                                <input type="password" id="botsOpenAIKey" value="${compData.openaiApiKey ? '••••••••' + compData.openaiApiKey.slice(-4) : ''}"
                                    placeholder="sk-..." style="flex:1;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                                <button onclick="saveBotApiKey('openai')" style="padding:0.55rem 0.9rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;">Зберегти</button>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">Anthropic API Key</label>
                            <div style="display:flex;gap:0.5rem;">
                                <input type="password" id="botsAnthropicKey" value="${compData.anthropicApiKey ? '••••••••' + compData.anthropicApiKey.slice(-4) : ''}"
                                    placeholder="sk-ant-..." style="flex:1;padding:0.55rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;">
                                <button onclick="saveBotApiKey('anthropic')" style="padding:0.55rem 0.9rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;">Зберегти</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // ── Connect Telegram ──────────────────────────────────────
    window.botsConnectTelegram = async function() {
        const token = document.getElementById('tgBotToken')?.value.trim();
        if (!token || token.includes('•')) {
            if (typeof showToast === 'function') showToast('Введіть Bot Token', 'error');
            return;
        }
        try {
            if (typeof showToast === 'function') showToast('Підключаємо...', 'info');

            // Встановлюємо вебхук через Telegram API
            const webhookUrl = `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=telegram`;
            const tgRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: webhookUrl, allowed_updates: ['message', 'callback_query'] }),
            });
            const tgData = await tgRes.json();
            if (!tgData.ok) throw new Error(tgData.description || 'Telegram error');

            // Отримуємо інфо про бота
            const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
            const meData = await meRes.json();
            const botName = meData.result?.username || 'bot';

            // Зберігаємо в Firestore — integrations + bots підколекція
            const compRef = firebase.firestore().collection('companies').doc(window.currentCompanyId);
            await compRef.update({
                'integrations.telegram.botToken': token,
                'integrations.telegram.botName': botName,
                'integrations.telegram.webhookUrl': webhookUrl,
                'integrations.telegram.connected': true,
                'integrations.telegram.connectedAt': firebase.firestore.FieldValue.serverTimestamp(),
            });

            // FIX: створюємо/оновлюємо документ в bots підколекції
            const botsSnap2 = await compRef.collection('bots').where('channel', '==', 'telegram').limit(1).get();
            if (botsSnap2.empty) {
                const newBot = await compRef.collection('bots').add({
                    channel: 'telegram', token, botName,
                    webhookUrl, status: 'active',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                botsCurrentBotId = newBot.id;
                window._currentBotId = newBot.id;
            } else {
                botsCurrentBotId = botsSnap2.docs[0].id;
                window._currentBotId = botsCurrentBotId;
                await compRef.collection('bots').doc(botsCurrentBotId).update({ token, botName, webhookUrl });
            }

            if (typeof showToast === 'function') showToast(`Telegram @${botName} підключено!`, 'success');
            renderBotsSettingsView();
        } catch(e) {
            if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
        }
    };

    // ── Connect Meta (Instagram/Facebook) ────────────────────
    window.botsConnectMeta = async function(channel) {
        const tokenId = channel === 'instagram' ? 'igPageToken' : 'fbPageToken';
        const verifyId = channel === 'instagram' ? 'igVerifyToken' : 'fbVerifyToken';
        const token = document.getElementById(tokenId)?.value.trim();
        const verifyToken = document.getElementById(verifyId)?.value.trim();
        if (!token || token.includes('•')) {
            if (typeof showToast === 'function') showToast('Введіть Page Access Token', 'error');
            return;
        }
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId).update({
                [`integrations.${channel}.pageToken`]: token,
                [`integrations.${channel}.verifyToken`]: verifyToken || 'talko_verify',
                [`integrations.${channel}.connected`]: true,
                [`integrations.${channel}.connectedAt`]: firebase.firestore.FieldValue.serverTimestamp(),
            });
            if (typeof showToast === 'function') showToast(`${channel} підключено! Додайте Webhook URL в Meta Console.`, 'success');
            renderBotsSettingsView();
        } catch(e) {
            if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
        }
    };

    // ── Disconnect Channel ────────────────────────────────────
    window.botsDisconnectChannel = async function(channel) {
        if (!confirm(`Відключити ${channel}?`)) return;
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId).update({
                [`integrations.${channel}.connected`]: false,
            });
            if (typeof showToast === 'function') showToast(`${channel} відключено`, 'success');
            renderBotsSettingsView();
        } catch(e) {
            if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
        }
    };

    window.saveBotApiKey = async function (provider) {
        const inputId = provider === 'openai' ? 'botsOpenAIKey' : 'botsAnthropicKey';
        const key = document.getElementById(inputId)?.value.trim();
        if (!key || key.includes('•')) return;
        const field = provider === 'openai' ? 'openaiApiKey' : 'anthropicApiKey';
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .update({ [field]: key });
            if (typeof showToast === 'function') showToast('Ключ збережено ✓', 'success');
            document.getElementById(inputId).value = '••••••••' + key.slice(-4);
        } catch (e) { alert('Помилка: ' + e.message); }
    };

    // ── Helpers ────────────────────────────────────────────
    function escH(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function relTime(d) {
        const diff = Date.now() - d.getTime();
        const m = Math.floor(diff/60000);
        if (m<1) return 'щойно'; if (m<60) return m+'хв';
        const h = Math.floor(m/60); if (h<24) return h+'год';
        return Math.floor(h/24)+'дн';
    }

    // ── Tab hook ───────────────────────────────────────────
    const _origST = window.switchTab;
    window.switchTab = function (tab) {
        if (_origST) _origST(tab);
        if (tab === 'bots') {
            if (window.isFeatureEnabled && window.isFeatureEnabled('bots')) {
                if (typeof initBotsModule === 'function' && botsFlows.length === 0) {
                    initBotsModule();
                } else {
                    renderBotsListView();
                }
            }
        }
    };

    window.destroyBotsModule = function () {
        if (botsUnsubscribe) botsUnsubscribe();
        botsUnsubscribe = null;
    };

})();
