// ============================================================
// TALKO Bots Platform v2.0
// Структура: Company <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Bots <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Flows (ланцюги)
// Модулі: Ланцюги, Контакти, Чат, Розсилка, Налаштування
// ============================================================
(function () {
'use strict';

// ── State ──────────────────────────────────────────────────
let bp = {
    bots: [],           // [{id, name, channel, token, connected, ...}]
    activeBotId: null,  // поточний бот
    flows: [],          // flows поточного бота
    contacts: [],
    subTab: 'bots',     // bots | flows | contacts | chat | broadcast | settings
    botsUnsub: null,
    flowsUnsub: null,
    activeChatContactId: null,
    chatUnsub: null,
    contactsFilter: 'all',
};

// ── Init ───────────────────────────────────────────────────
window.initBotsModule = async function () {
    if (!window.currentCompanyId) return;
    renderShell();
    loadBots();
};

function loadBots() {
    if (bp.botsUnsub) bp.botsUnsub();
    bp.botsUnsub = firebase.firestore()
        .collection('companies').doc(window.currentCompanyId)
        .collection('bots')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snap => {
            bp.bots = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (bp.subTab === 'bots') renderBotsTab();
            if (bp.activeBotId && bp.subTab === 'flows') renderFlowsHeader();
        });
}

// ── Shell ──────────────────────────────────────────────────
function lcIcons(el) {
    if (window.lucide) {
        try { lucide.createIcons({ nameAttr: 'data-lucide', attrs: { 'stroke-width': 2 }, nodes: el ? [el] : undefined }); } catch(e) {}
    }
}

function renderShell() {
    const container = document.getElementById('botsContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="padding:0.75rem;">
            <!-- Tab bar -->
            <div id="bpTabBar" style="display:flex;gap:0.3rem;margin-bottom:0.75rem;background:white;
                border-radius:12px;padding:0.3rem;box-shadow:var(--shadow);overflow-x:auto;flex-shrink:0;">
            </div>
            <!-- Views -->
            <div id="bpViewBots"></div>
            <div id="bpViewFlows" style="display:none;"></div>
            <div id="bpViewContacts" style="display:none;"></div>
            <div id="bpViewChat" style="display:none;"></div>
            <div id="bpViewBroadcast" style="display:none;"></div>
            <div id="bpViewSettings" style="display:none;"></div>
        </div>`;
    lcIcons(container);

    renderTabBar(['bots']);
    renderBotsTab();
}

function renderTabBar(visibleTabs) {
    const bar = document.getElementById('bpTabBar');
    if (!bar) return;
    const all = [
        ['bots',      '<i data-lucide="bot" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', 'Боти'],
        ['flows',     '<i data-lucide="link" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>',  'Ланцюги'],
        ['contacts',  '<i data-lucide="users" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', 'Контакти'],
        ['chat',      '<i data-lucide="message-square" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', 'Чат'],
        ['broadcast', '<i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', 'Розсилка'],
        ['settings',  '<i data-lucide="settings" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i>',  'Налаштування'],
    ];
    bar.innerHTML = all.filter(([id]) => visibleTabs.includes(id)).map(([id, icon, label]) => `
        <button id="bpTab_${id}" onclick="bpSwitch('${id}')"
            style="flex:1;min-width:60px;padding:0.4rem 0.5rem;border:none;border-radius:8px;
            cursor:pointer;font-size:0.75rem;font-weight:600;white-space:nowrap;
            background:${id===bp.subTab?'#22c55e':'transparent'};
            color:${id===bp.subTab?'white':'#525252'};transition:all 0.2s;">
            ${icon} ${label}
        </button>`).join('');
}

window.bpSwitch = function(tab) {
    bp.subTab = tab;
    const all = ['bots','flows','contacts','chat','broadcast','settings'];
    all.forEach(t => {
        const btn = document.getElementById(`bpTab_${t}`);
        const view = document.getElementById(`bpView${t.charAt(0).toUpperCase()+t.slice(1)}`);
        if (btn) { btn.style.background = t===tab?'#22c55e':'transparent'; btn.style.color = t===tab?'white':'#525252'; }
        if (view) view.style.display = t===tab?'':'none';
    });
    if (tab==='bots')      renderBotsTab();
    if (tab==='flows')     renderFlowsTab();
    if (tab==='contacts')  renderContactsTab();
    if (tab==='chat')      renderChatTab();
    if (tab==='broadcast') renderBroadcastTab();
    if (tab==='settings')  renderSettingsTab();
};

// ══════════════════════════════════════════════════════════
// 1. БОТИ — список всіх ботів компанії
// ══════════════════════════════════════════════════════════
function renderBotsTab() {
    const c = document.getElementById('bpViewBots');
    if (!c) return;

    const channelColors = { telegram:'#3b82f6', instagram:'#e1306c', whatsapp:'#25d366', web:'#6366f1' };
    const channelIcons  = { telegram:'<i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', instagram:'<i data-lucide="camera" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', whatsapp:'<i data-lucide="message-square" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>', web:'<i data-lucide="globe" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>' };

    c.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <div>
                <div style="font-weight:700;font-size:1rem;">Мої боти</div>
                <div style="font-size:0.74rem;color:#6b7280;">${bp.bots.length} ботів</div>
            </div>
            <button onclick="openCreateBotModal()"
                style="padding:0.5rem 1rem;background:#22c55e;color:white;border:none;
                border-radius:10px;cursor:pointer;font-weight:600;font-size:0.84rem;">
                + Новий бот
            </button>
        </div>

        ${bp.bots.length === 0 ? `
        <div style="text-align:center;padding:3rem;background:white;border-radius:16px;box-shadow:var(--shadow);">
            <div style="font-size:3rem;margin-bottom:0.75rem;"><i data-lucide="bot" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i></div>
            <div style="font-weight:700;font-size:1rem;margin-bottom:0.4rem;">Ботів поки немає</div>
            <div style="font-size:0.84rem;color:#6b7280;margin-bottom:1.25rem;">
                Підключіть Telegram бота або інший канал<br>і створіть перший ланцюг сценарію
            </div>
            <button onclick="openCreateBotModal()"
                style="padding:0.65rem 1.5rem;background:#22c55e;color:white;border:none;
                border-radius:10px;cursor:pointer;font-weight:600;">
                + Підключити бота
            </button>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:0.6rem;">
            ${bp.bots.map(bot => {
                const color = channelColors[bot.channel] || '#6b7280';
                const icon = channelIcons[bot.channel] || '<i data-lucide="bot" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>';
                return `
                <div style="background:white;border-radius:14px;padding:1rem;
                    box-shadow:var(--shadow);border-left:4px solid ${bot.connected?color:'#e5e7eb'};">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;">
                        <div style="display:flex;align-items:center;gap:0.6rem;flex:1;min-width:0;">
                            <div style="width:42px;height:42px;border-radius:12px;
                                background:${color}18;display:flex;align-items:center;
                                justify-content:center;font-size:1.3rem;flex-shrink:0;">
                                ${icon}
                            </div>
                            <div style="min-width:0;">
                                <div style="font-weight:700;font-size:0.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                    ${escH(bot.name)}
                                </div>
                                <div style="font-size:0.74rem;color:#6b7280;margin-top:1px;">
                                    ${bot.channel} · @${escH(bot.username||'—')}
                                    · <span style="color:${bot.connected?'#22c55e':'#ef4444'};font-weight:600;">
                                        ${bot.connected?'● Підключено':'○ Не підключено'}
                                    </span>
                                </div>
                                <div style="font-size:0.72rem;color:#9ca3af;margin-top:2px;">
                                    ${(bot.flowCount||0)} ланцюгів · ${(bot.contactCount||0)} контактів
                                </div>
                            </div>
                        </div>
                        <div style="display:flex;gap:0.3rem;flex-shrink:0;">
                            <button onclick="openBot('${bot.id}')"
                                style="padding:0.45rem 0.8rem;background:#22c55e;color:white;
                                border:none;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:600;">
                                Відкрити <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i>
                            </button>
                            <button onclick="openBotSettings('${bot.id}')"
                                style="padding:0.45rem 0.6rem;background:#f9fafb;border:1px solid #e5e7eb;
                                border-radius:8px;cursor:pointer;font-size:0.8rem;">
                                <i data-lucide="settings" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i>
                            </button>
                            <button onclick="confirmDeleteBot('${bot.id}')"
                                style="padding:0.45rem 0.6rem;background:#fee2e2;color:#ef4444;
                                border:none;border-radius:8px;cursor:pointer;font-size:0.8rem;">
                                <i data-lucide="x" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
    lcIcons(c); }).join('')}
        </div>`}`;
}

// ── Відкрити бота <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> показати його ланцюги ─────────────────
window.openBot = function(botId) {
    bp.activeBotId = botId;
    const bot = bp.bots.find(b=>b.id===botId);

    // Показуємо всі таби
    renderTabBar(['bots','flows','contacts','chat','broadcast','settings']);
    bpSwitch('flows');

    // Підписуємось на flows цього бота
    if (bp.flowsUnsub) bp.flowsUnsub();
    bp.flowsUnsub = firebase.firestore()
        .collection('companies').doc(window.currentCompanyId)
        .collection('bots').doc(botId)
        .collection('flows')
        .orderBy('createdAt','desc')
        .onSnapshot(snap => {
            bp.flows = snap.docs.map(d=>({id:d.id,...d.data()}));
            if (bp.subTab==='flows') renderFlowsTab();
        });
};

// ══════════════════════════════════════════════════════════
// 2. ЛАНЦЮГИ — список flows поточного бота
// ══════════════════════════════════════════════════════════
function renderFlowsTab() {
    const c = document.getElementById('bpViewFlows');
    if (!c) return;

    const bot = bp.bots.find(b=>b.id===bp.activeBotId);
    const statusColors = { active:'#22c55e', draft:'#9ca3af', paused:'#f97316' };

    // Deep link base
    const botUsername = bot?.username || '';
    const webhookBase = `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=${bot?.channel||'telegram'}&botId=${bp.activeBotId}&flow=`;

    c.innerHTML = `
        <!-- Bot breadcrumb -->
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;
            background:white;border-radius:10px;padding:0.6rem 0.75rem;box-shadow:var(--shadow);">
            <button onclick="bpSwitch('bots')"
                style="background:none;border:none;cursor:pointer;color:#6b7280;font-size:0.82rem;padding:0;">
                <i data-lucide="bot" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Всі боти
            </button>
            <span style="color:#9ca3af;">›</span>
            <span style="font-weight:700;font-size:0.85rem;color:#374151;">
                ${escH(bot?.name||'Бот')}
            </span>
            <span style="background:${bot?.connected?'#f0fdf4':'#fee2e2'};
                color:${bot?.connected?'#22c55e':'#ef4444'};
                font-size:0.68rem;padding:1px 6px;border-radius:10px;font-weight:600;">
                ${bot?.connected?'● Online':'○ Offline'}
            </span>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
            <div style="font-weight:700;font-size:0.95rem;">Ланцюги бота</div>
            <button onclick="openCreateFlowModal()"
                style="padding:0.45rem 0.9rem;background:#22c55e;color:white;border:none;
                border-radius:9px;cursor:pointer;font-weight:600;font-size:0.82rem;">
                + Новий ланцюг
            </button>
        </div>

        ${bp.flows.length === 0 ? `
        <div style="text-align:center;padding:2.5rem;background:white;border-radius:14px;box-shadow:var(--shadow);">
            <div style="font-size:2.5rem;margin-bottom:0.6rem;"><i data-lucide="link" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i></div>
            <div style="font-weight:600;margin-bottom:0.3rem;">Ланцюгів поки немає</div>
            <div style="font-size:0.82rem;color:#6b7280;margin-bottom:1rem;">
                Ланцюг — це сценарій діалогу з користувачем
            </div>
            <button onclick="openCreateFlowModal()"
                style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:9px;cursor:pointer;font-weight:600;">
                + Створити ланцюг
            </button>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
            ${bp.flows.map(flow => {
                const deepLink = botUsername
                    ? `https://t.me/${botUsername}?start=${flow.id}`
                    : webhookBase + flow.id;
                return `
                <div style="background:white;border-radius:12px;padding:0.85rem;
                    box-shadow:var(--shadow);border-left:3px solid ${statusColors[flow.status]||'#9ca3af'};">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;">
                        <div style="flex:1;min-width:0;">
                            <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.2rem;">
                                <span style="font-weight:700;font-size:0.88rem;">${escH(flow.name)}</span>
                                <span style="font-size:0.68rem;background:${statusColors[flow.status]||'#9ca3af'}18;
                                    color:${statusColors[flow.status]||'#9ca3af'};padding:1px 6px;border-radius:10px;font-weight:600;">
                                    ${flow.status||'draft'}
                                </span>
                            </div>
                            <div style="font-size:0.73rem;color:#6b7280;">
                                Тригер: <code style="background:#f0fdf4;color:#16a34a;padding:1px 4px;border-radius:3px;">${escH(flow.triggerKeyword||'/start')}</code>
                                · ${(flow.nodes?.length||0)} вузлів · ${flow.sessionCount||0} сесій
                            </div>
                            <!-- Deep link -->
                            <div style="margin-top:0.4rem;display:flex;align-items:center;gap:0.35rem;">
                                <div style="font-size:0.7rem;color:#6b7280;flex:1;overflow:hidden;
                                    text-overflow:ellipsis;white-space:nowrap;background:#f9fafb;
                                    border:1px solid #e5e7eb;border-radius:5px;padding:2px 6px;">
                                    <i data-lucide="link" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i> ${deepLink}
                                </div>
                                <button onclick="copyLink('${deepLink}')"
                                    style="padding:2px 7px;background:#eff6ff;color:#3b82f6;border:none;
                                    border-radius:4px;cursor:pointer;font-size:0.68rem;white-space:nowrap;flex-shrink:0;">
                                    Копіювати
                                </button>
                                <button onclick="showQR('${encodeURIComponent(deepLink)}')"
                                    style="padding:2px 7px;background:#f0fdf4;color:#16a34a;border:none;
                                    border-radius:4px;cursor:pointer;font-size:0.68rem;flex-shrink:0;">
                                    QR
                                </button>
                            </div>
                        </div>
                        <div style="display:flex;gap:0.3rem;flex-shrink:0;">
                            <button onclick="editFlow('${flow.id}')"
                                style="padding:0.38rem 0.65rem;background:#22c55e;color:white;
                                border:none;border-radius:7px;cursor:pointer;font-size:0.76rem;font-weight:600;">
                                <i data-lucide="pencil" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Редагувати
                            </button>
                            <button onclick="toggleFlowStatus('${flow.id}','${flow.status}')"
                                style="padding:0.38rem 0.55rem;background:${flow.status==='active'?'#fee2e2':'#f0fdf4'};
                                color:${flow.status==='active'?'#ef4444':'#16a34a'};border:none;
                                border-radius:7px;cursor:pointer;font-size:0.73rem;">
                                ${flow.status==='active'?'⏸':'▶'}
                            </button>
                            <button onclick="deleteFlow('${flow.id}')"
                                style="padding:0.38rem 0.5rem;background:#fee2e2;color:#ef4444;
                                border:none;border-radius:7px;cursor:pointer;font-size:0.73rem;">
                                <i data-lucide="x" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
    lcIcons(c); }).join('')}
        </div>`}`;
}

// ══════════════════════════════════════════════════════════
// 3. CREATE BOT MODAL
// ══════════════════════════════════════════════════════════
window.openCreateBotModal = function() {
    document.getElementById('bpCreateBot')?.remove();
    document.body.insertAdjacentHTML('beforeend', `
        <div id="bpCreateBot" onclick="if(event.target===this)this.remove()"
            style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10020;
            display:flex;align-items:center;justify-content:center;padding:1rem;">
            <div style="background:white;border-radius:16px;width:100%;max-width:440px;">
                <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-weight:700;font-size:1rem;">Підключити нового бота</div>
                    <button onclick="document.getElementById('bpCreateBot').remove()"
                        style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><i data-lucide="x" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i></button>
                </div>
                <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">КАНАЛ</label>
                        <select id="bpNewBotChannel"
                            onchange="updateBotTokenHint(this.value)"
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.88rem;background:white;">
                            <option value="telegram"><i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Telegram</option>
                            <option value="instagram"><i data-lucide="camera" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Instagram</option>
                            <option value="whatsapp"><i data-lucide="message-square" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> WhatsApp Business</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА БОТА</label>
                        <input id="bpNewBotName" placeholder="Наприклад: Запис на консультацію"
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.88rem;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;" id="bpTokenLabel">BOT TOKEN (від @BotFather)</label>
                        <input id="bpNewBotToken" placeholder="123456789:AAF..."
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.88rem;box-sizing:border-box;">
                        <div id="bpTokenHint" style="font-size:0.72rem;color:#6b7280;margin-top:0.3rem;">
                            1. Відкрий @BotFather <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> /newbot <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> скопіюй токен
                        </div>
                    </div>
                </div>
                <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                    <button onclick="document.getElementById('bpCreateBot').remove()"
                        style="padding:0.55rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                    <button onclick="createAndConnectBot()"
                        style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">
                        <i data-lucide="check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Підключити
                    </button>
                </div>
            </div>
        </div>`);
    document.getElementById('bpNewBotName')?.focus();
};

window.updateBotTokenHint = function(channel) {
    const label = document.getElementById('bpTokenLabel');
    const hint = document.getElementById('bpTokenHint');
    if (channel === 'telegram') {
        if (label) label.textContent = 'BOT TOKEN (від @BotFather)';
        if (hint) hint.textContent = '1. Відкрий @BotFather <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> /newbot <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> скопіюй токен';
    } else if (channel === 'instagram') {
        if (label) label.textContent = 'PAGE ACCESS TOKEN';
        if (hint) hint.textContent = 'Отримай в Meta Developer Console <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Instagram <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Page Access Token';
    }
};

window.createAndConnectBot = async function() {
    const name = document.getElementById('bpNewBotName')?.value.trim();
    const token = document.getElementById('bpNewBotToken')?.value.trim();
    const channel = document.getElementById('bpNewBotChannel')?.value || 'telegram';
    if (!name) { alert('Введіть назву бота'); return; }
    if (!token) { alert('Введіть токен'); return; }

    const btn = document.querySelector('[onclick="createAndConnectBot()"]');
    if (btn) { btn.textContent = 'Підключення...'; }

    try {
        let username = '';
        let connected = false;
        const webhookUrl = `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=${channel}`;

        if (channel === 'telegram') {
            // Verify token + set webhook
            const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
            const meData = await meRes.json();
            if (!meData.ok) throw new Error('Невірний токен: ' + (meData.description||''));
            username = meData.result.username || '';

            const whRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ url: webhookUrl, allowed_updates: ['message','callback_query'] }),
            });
            const whData = await whRes.json();
            connected = whData.ok;
        } else {
            connected = false; // Manual webhook setup for other channels
        }

        // Save bot to Firestore
        const botRef = await firebase.firestore()
            .collection('companies').doc(window.currentCompanyId)
            .collection('bots').add({
                name,
                channel,
                token,
                username,
                webhookUrl,
                connected,
                flowCount: 0,
                contactCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

        // Also save token in integrations for webhook.js compatibility
        await firebase.firestore().collection('companies').doc(window.currentCompanyId).update({
            [`integrations.${channel}.botToken`]: token,
            [`integrations.${channel}.botName`]: username,
            [`integrations.${channel}.webhookUrl`]: webhookUrl,
            [`integrations.${channel}.connected`]: connected,
        });

        document.getElementById('bpCreateBot')?.remove();
        if (typeof showToast === 'function') showToast(connected ? `<i data-lucide="check-circle" style="width:14px;height:14px;display:inline-block;vertical-align:middle;color:#22c55e;"></i> Бот @${username} підключено!` : 'Бот створено. Налаштуйте вебхук вручну.', 'success');
        openBot(botRef.id);
    } catch(e) {
        if (btn) btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Підключити';
        alert('Помилка: ' + e.message);
    }
};

window.openBotSettings = async function(botId) {
    bp.activeBotId = botId;
    renderTabBar(['bots','flows','contacts','chat','broadcast','settings']);
    bpSwitch('settings');
};

window.confirmDeleteBot = function(botId) {
    if (!confirm('Видалити бота і всі його ланцюги?')) return;
    firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('bots').doc(botId).delete()
        .then(() => { if (typeof showToast === 'function') showToast('Бота видалено', 'success'); });
};

// ══════════════════════════════════════════════════════════
// 4. CREATE FLOW MODAL
// ══════════════════════════════════════════════════════════
window.openCreateFlowModal = function() {
    document.getElementById('bpCreateFlow')?.remove();
    document.body.insertAdjacentHTML('beforeend', `
        <div id="bpCreateFlow" onclick="if(event.target===this)this.remove()"
            style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10020;
            display:flex;align-items:center;justify-content:center;padding:1rem;">
            <div style="background:white;border-radius:16px;width:100%;max-width:400px;">
                <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;">
                    <div style="font-weight:700;">Новий ланцюг</div>
                    <button onclick="document.getElementById('bpCreateFlow').remove()"
                        style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><i data-lucide="x" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i></button>
                </div>
                <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.6rem;">
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА *</label>
                        <input id="bpFlowName" placeholder="Наприклад: Запис на прийом"
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.88rem;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТРИГЕР</label>
                        <input id="bpFlowTrigger" placeholder="/start або ключове слово"
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.88rem;box-sizing:border-box;">
                    </div>
                </div>
                <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                    <button onclick="document.getElementById('bpCreateFlow').remove()"
                        style="padding:0.55rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                    <button onclick="saveNewFlow()"
                        style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;"><i data-lucide="check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Створити</button>
                </div>
            </div>
        </div>`);
    document.getElementById('bpFlowName')?.focus();
};

window.saveNewFlow = async function() {
    const name = document.getElementById('bpFlowName')?.value.trim();
    if (!name) { alert('Введіть назву'); return; }
    const bot = bp.bots.find(b=>b.id===bp.activeBotId);
    try {
        const ref = await firebase.firestore()
            .collection('companies').doc(window.currentCompanyId)
            .collection('bots').doc(bp.activeBotId)
            .collection('flows').add({
                name,
                channel: bot?.channel || 'telegram',
                triggerKeyword: document.getElementById('bpFlowTrigger')?.value.trim() || '/start',
                status: 'draft',
                nodes: [],
                sessionCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        // Update bot flowCount
        await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('bots').doc(bp.activeBotId)
            .update({ flowCount: firebase.firestore.FieldValue.increment(1) });

        document.getElementById('bpCreateFlow')?.remove();
        if (typeof showToast === 'function') showToast('Ланцюг створено <i data-lucide="check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i>', 'success');
        editFlow(ref.id);
    } catch(e) { alert('Помилка: ' + e.message); }
};

window.editFlow = function(flowId) {
    // Pass botId context to canvas
    window._currentBotId = bp.activeBotId;
    openFlowCanvas(flowId, bp.activeBotId);
};

window.toggleFlowStatus = async function(flowId, status) {
    const newStatus = status === 'active' ? 'paused' : 'active';
    await firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('bots').doc(bp.activeBotId)
        .collection('flows').doc(flowId)
        .update({ status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    if (typeof showToast === 'function') showToast(newStatus==='active'?'▶ Активовано':'⏸ Пауза', 'success');
};

window.deleteFlow = function(flowId) {
    if (!confirm('Видалити ланцюг?')) return;
    firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('bots').doc(bp.activeBotId)
        .collection('flows').doc(flowId).delete()
        .then(() => { if (typeof showToast === 'function') showToast('Видалено', 'success'); });
};

// ══════════════════════════════════════════════════════════
// 5. КОНТАКТИ
// ══════════════════════════════════════════════════════════
async function renderContactsTab() {
    const c = document.getElementById('bpViewContacts');
    if (!c) return;
    c.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;">Завантаження...</div>';

    try {
        const snap = await firebase.firestore()
            .collection('companies').doc(window.currentCompanyId)
            .collection('contacts')
            .orderBy('createdAt','desc').limit(200).get();
        bp.contacts = snap.docs.map(d=>({id:d.id,...d.data()}))
            .filter(ct => ct.source && ['telegram','instagram','facebook','viber'].includes(ct.source));
        renderContactsList(c);
    } catch(e) {
        c.innerHTML = `<div style="color:#ef4444;padding:1rem;">Помилка: ${e.message}</div>`;
    lcIcons(c);
    lcIcons(c);
    }
}

function renderContactsList(c) {
    const filters = [['all','Всі'],['active','Активні'],['blocked','Заблокували'],['unsubscribed','Відписались']];
    const filtered = bp.contactsFilter==='all' ? bp.contacts : bp.contacts.filter(ct=>ct.botStatus===bp.contactsFilter);
    const total   = bp.contacts.length;
    const blocked = bp.contacts.filter(ct=>ct.botStatus==='blocked').length;
    const active  = bp.contacts.filter(ct=>!ct.botStatus||ct.botStatus==='active').length;

    c.innerHTML = `
        <div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">
            ${[['<i data-lucide="users" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Всього',total,'#3b82f6'],['<i data-lucide="check-circle" style="width:14px;height:14px;display:inline-block;vertical-align:middle;color:#22c55e;"></i> Активних',active,'#22c55e'],['<i data-lucide="ban" style="width:16px;height:16px;display:inline-block;vertical-align:middle;color:#ef4444;"></i> Заблокували',blocked,'#ef4444']]
              .map(([l,v,col])=>`<div style="flex:1;background:white;border-radius:10px;padding:0.6rem;
                box-shadow:var(--shadow);text-align:center;border-top:2px solid ${col};">
                <div style="font-size:1.1rem;font-weight:700;color:${col};">${v}</div>
                <div style="font-size:0.67rem;color:#6b7280;">${l}</div></div>`).join('')}
        </div>
        <div style="display:flex;gap:0.25rem;margin-bottom:0.6rem;background:white;border-radius:9px;padding:0.25rem;box-shadow:var(--shadow);">
            ${filters.map(([id,label])=>`<button onclick="bpFilterContacts('${id}')"
                style="flex:1;padding:0.38rem;border:none;border-radius:6px;cursor:pointer;font-size:0.72rem;font-weight:600;
                background:${bp.contactsFilter===id?'#22c55e':'transparent'};
                color:${bp.contactsFilter===id?'white':'#525252'};">${label}</button>`).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:0.35rem;">
            ${filtered.length===0
              ? '<div style="text-align:center;padding:1.5rem;background:white;border-radius:10px;color:#9ca3af;font-size:0.82rem;">Контактів немає</div>'
              : filtered.map(ct=>{
                const blocked=ct.botStatus==='blocked', unsub=ct.botStatus==='unsubscribed';
                const col=blocked?'#ef4444':unsub?'#f97316':'#22c55e';
                const status=blocked?'<i data-lucide="ban" style="width:16px;height:16px;display:inline-block;vertical-align:middle;color:#ef4444;"></i> Заблокував':unsub?'<i data-lucide="hand" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Відписався':'<i data-lucide="check-circle" style="width:14px;height:14px;display:inline-block;vertical-align:middle;color:#22c55e;"></i> Активний';
                return `<div style="background:white;border-radius:9px;padding:0.65rem;box-shadow:var(--shadow);
                    display:flex;align-items:center;gap:0.5rem;${blocked?'border-left:3px solid #ef4444;':''}">
                    <div style="width:32px;height:32px;border-radius:50%;background:${col}18;
                        display:flex;align-items:center;justify-content:center;font-weight:700;color:${col};font-size:0.85rem;flex-shrink:0;">
                        ${(ct.name||'?').charAt(0).toUpperCase()}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;font-size:0.83rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escH(ct.name||'Без імені')}</div>
                        <div style="font-size:0.7rem;color:#6b7280;">${ct.phone||ct.externalId||'—'} · ${ct.source||''}</div>
                    </div>
                    <div style="text-align:right;flex-shrink:0;">
                        <div style="font-size:0.68rem;color:${col};font-weight:600;">${status}</div>
                    </div>
                    <button onclick="bpOpenChat('${ct.id}')" ${blocked?'disabled':''} 
                        style="padding:0.3rem 0.55rem;background:#eff6ff;color:#3b82f6;border:none;
                        border-radius:6px;cursor:pointer;font-size:0.7rem;flex-shrink:0;
                        ${blocked?'opacity:0.4;pointer-events:none;':''}"><i data-lucide="message-square" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i></button>
                </div>`;
    lcIcons(c); }).join('')}
        </div>`;
}

window.bpFilterContacts = function(f) { bp.contactsFilter=f; const c=document.getElementById('bpViewContacts'); if(c) renderContactsList(c); };

// ══════════════════════════════════════════════════════════
// 6. ЧАТ
// ══════════════════════════════════════════════════════════
async function renderChatTab() {
    const c = document.getElementById('bpViewChat');
    if (!c) return;

    if (!bp.contacts.length) {
        const snap = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('contacts').orderBy('createdAt','desc').limit(50).get();
        bp.contacts = snap.docs.map(d=>({id:d.id,...d.data()}));
    }

    c.innerHTML = `
        <div style="display:flex;gap:0.5rem;height:520px;">
            <div style="width:130px;flex-shrink:0;background:white;border-radius:12px;
                box-shadow:var(--shadow);overflow-y:auto;display:flex;flex-direction:column;">
                <div style="padding:0.5rem 0.6rem;font-size:0.7rem;font-weight:700;color:#6b7280;
                    text-transform:uppercase;border-bottom:1px solid #f0f0f0;flex-shrink:0;">Контакти</div>
                <div style="flex:1;overflow-y:auto;">
                    ${bp.contacts.map(ct=>`
                        <div onclick="bpOpenChat('${ct.id}')"
                            style="padding:0.5rem 0.6rem;cursor:pointer;border-bottom:1px solid #f9fafb;
                            background:${ct.id===bp.activeChatContactId?'#f0fdf4':'transparent'};"
                            onmouseenter="this.style.background='#f0fdf4'"
                            onmouseleave="this.style.background='${ct.id===bp.activeChatContactId?'#f0fdf4':'transparent'}'">
                            <div style="font-size:0.76rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                ${escH(ct.name||'Анонім')}
                            </div>
                            <div style="font-size:0.63rem;color:#9ca3af;">${ct.source||'tg'}</div>
                        </div>`).join('')}
                </div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;background:white;
                border-radius:12px;box-shadow:var(--shadow);overflow:hidden;">
                <div id="bpChatHeader" style="padding:0.7rem 0.85rem;border-bottom:1px solid #f0f0f0;
                    font-size:0.84rem;font-weight:600;color:#374151;flex-shrink:0;">
                    Оберіть контакт <i data-lucide="arrow-left" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i>
                </div>
                <div id="bpChatMsgs" style="flex:1;overflow-y:auto;padding:0.75rem;
                    display:flex;flex-direction:column;gap:0.4rem;background:#f8fafc;"></div>
                <div style="padding:0.5rem;border-top:1px solid #f0f0f0;display:flex;gap:0.35rem;flex-shrink:0;">
                    <input id="bpChatInput" placeholder="Повідомлення..."
                        style="flex:1;padding:0.48rem 0.65rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.83rem;"
                        onkeydown="if(event.key==='Enter')bpSendMsg()">
                    <button onclick="bpSendMsg()"
                        style="padding:0.48rem 0.9rem;background:#22c55e;color:white;border:none;
                        border-radius:8px;cursor:pointer;font-weight:600;font-size:0.84rem;"><i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i></button>
                </div>
            </div>
        </div>`;
    lcIcons(c);

    if (bp.activeChatContactId) bpOpenChat(bp.activeChatContactId);
}

window.bpOpenChat = async function(contactId) {
    bp.activeChatContactId = contactId;
    if (bp.subTab !== 'chat') { bpSwitch('chat'); await new Promise(r=>setTimeout(r,150)); }

    const ct = bp.contacts.find(c=>c.id===contactId);
    const header = document.getElementById('bpChatHeader');
    if (header && ct) {
        header.innerHTML = `<div style="display:flex;align-items:center;gap:0.5rem;">
            <div style="width:26px;height:26px;border-radius:50%;background:#22c55e22;
                display:flex;align-items:center;justify-content:center;font-weight:700;color:#22c55e;font-size:0.75rem;">
                ${(ct.name||'?').charAt(0).toUpperCase()}
            </div>
            <div>
                <div style="font-weight:700;font-size:0.84rem;">${escH(ct.name||'Анонім')}</div>
                <div style="font-size:0.68rem;color:#6b7280;">${ct.externalId||''} · ${ct.source||'telegram'}</div>
            </div>
            ${ct.botStatus==='blocked'?'<span style="margin-left:auto;font-size:0.68rem;color:#ef4444;background:#fee2e2;padding:2px 6px;border-radius:4px;"><i data-lucide="ban" style="width:16px;height:16px;display:inline-block;vertical-align:middle;color:#ef4444;"></i> Заблокував</span>':''}
        </div>`;
    }

    if (bp.chatUnsub) bp.chatUnsub();
    const sessionId = `telegram_${ct?.externalId?.replace('telegram_','')||contactId}`;
    bp.chatUnsub = firebase.firestore()
        .collection('companies').doc(window.currentCompanyId)
        .collection('sessions').doc(sessionId)
        .collection('messages').orderBy('timestamp','asc').limit(100)
        .onSnapshot(snap => {
            const msgs = snap.docs.map(d=>({id:d.id,...d.data()}));
            const msgsDiv = document.getElementById('bpChatMsgs');
            if (!msgsDiv) return;
            if (!msgs.length) {
                msgsDiv.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:0.8rem;">Повідомлень немає</div>';
                return;
            }
            msgsDiv.innerHTML = msgs.map(m=>{
                const out=m.direction==='out';
                return `<div style="display:flex;justify-content:${out?'flex-end':'flex-start'};">
                    <div style="max-width:78%;padding:0.45rem 0.7rem;border-radius:${out?'10px 10px 2px 10px':'10px 10px 10px 2px'};
                        background:${out?'#22c55e':'white'};color:${out?'white':'#374151'};
                        font-size:0.8rem;box-shadow:0 1px 3px rgba(0,0,0,0.07);line-height:1.4;">
                        ${escH(m.text||'')}
                    </div>
                </div>`;
            }).join('');
            msgsDiv.scrollTop = msgsDiv.scrollHeight;
        });
};

window.bpSendMsg = async function() {
    const input = document.getElementById('bpChatInput');
    const text = input?.value.trim();
    if (!text || !bp.activeChatContactId) return;
    const ct = bp.contacts.find(c=>c.id===bp.activeChatContactId);
    const sessionId = `telegram_${ct?.externalId?.replace('telegram_','')||bp.activeChatContactId}`;
    input.value = '';

    await firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('sessions').doc(sessionId)
        .collection('messages').add({
            direction:'out', text, sentBy:'operator',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

    const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
    const token = compDoc.data()?.integrations?.telegram?.botToken;
    const telegramId = ct?.externalId?.replace('telegram_','');
    if (token && telegramId) {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ chat_id: telegramId, text }),
        });
    }
};

// ══════════════════════════════════════════════════════════
// 7. РОЗСИЛКА
// ══════════════════════════════════════════════════════════
async function renderBroadcastTab() {
    const c = document.getElementById('bpViewBroadcast');
    if (!c) return;
    let history = [];
    try {
        const snap = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('broadcasts').orderBy('createdAt','desc').limit(20).get();
        history = snap.docs.map(d=>({id:d.id,...d.data()}));
    } catch(e) {}

    const activeCount = bp.contacts.filter(ct=>!ct.botStatus||ct.botStatus==='active').length;

    c.innerHTML = `
        <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);margin-bottom:0.6rem;">
            <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.75rem;"><i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Нова розсилка</div>
            <div style="display:flex;flex-direction:column;gap:0.55rem;">
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.25rem;">АУДИТОРІЯ</label>
                    <select id="bpBcastAudience" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;background:white;">
                        <option value="all">Всі активні (${activeCount})</option>
                        <option value="telegram">Тільки Telegram</option>
                        <option value="instagram">Тільки Instagram</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.25rem;">ТЕКСТ</label>
                    <textarea id="bpBcastText" rows="3" placeholder="Текст повідомлення..."
                        style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;resize:vertical;box-sizing:border-box;"></textarea>
                </div>
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.25rem;">АБО ЗАПУСТИТИ ЛАНЦЮГ</label>
                    <select id="bpBcastFlow" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;background:white;">
                        <option value="">— Не запускати —</option>
                        ${bp.flows.map(f=>`<option value="${f.id}">${escH(f.name)}</option>`).join('')}
                    </select>
                </div>
                <button onclick="bpSendBroadcast()"
                    style="padding:0.6rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.84rem;">
                    <i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Надіслати
                </button>
            </div>
        </div>
        <div style="font-weight:700;font-size:0.84rem;margin-bottom:0.4rem;color:#374151;">Історія</div>
        ${history.length===0
          ? '<div style="text-align:center;padding:1.25rem;background:white;border-radius:10px;color:#9ca3af;font-size:0.8rem;">Розсилок ще не було</div>'
          : history.map(b=>`<div style="background:white;border-radius:9px;padding:0.7rem;box-shadow:var(--shadow);margin-bottom:0.35rem;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:0.82rem;font-weight:600;">${escH(b.text?.slice(0,50)||b.flowName||'Розсилка')}</div>
                    <div style="font-size:0.7rem;color:#6b7280;">${b.audience||'all'} · ${b.createdAt?.toDate?relTime(b.createdAt.toDate()):''}</div>
                </div>
                <div style="font-size:0.75rem;text-align:right;">
                    <div style="color:#22c55e;"><i data-lucide="check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> ${b.sent||0}</div>
                    <div style="color:#ef4444;"><i data-lucide="x" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i> ${b.failed||0}</div>
                </div>
            </div>`).join('')}`;
    lcIcons(c);
}

window.bpSendBroadcast = async function() {
    const text = document.getElementById('bpBcastText')?.value.trim();
    const flowId = document.getElementById('bpBcastFlow')?.value;
    const audience = document.getElementById('bpBcastAudience')?.value||'all';
    if (!text && !flowId) { alert('Введіть текст або оберіть ланцюг'); return; }
    if (!confirm(`Надіслати розсилку? Аудиторія: ${audience}`)) return;

    const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
    const token = compDoc.data()?.integrations?.telegram?.botToken;

    let targets = bp.contacts.filter(ct=>!ct.botStatus||ct.botStatus==='active');
    if (audience==='telegram') targets=targets.filter(ct=>ct.source==='telegram');
    if (audience==='instagram') targets=targets.filter(ct=>ct.source==='instagram');

    let sent=0, failed=0;
    for (const ct of targets) {
        try {
            if (ct.source==='telegram' && token) {
                const tid = ct.externalId?.replace('telegram_','');
                if (tid) {
                    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
                        method:'POST', headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({chat_id:tid, text:text||'<i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Повідомлення від бота'}),
                    });
                    const d = await res.json();
                    if (d.ok) sent++;
                    else { if (d.error_code===403) await firebase.firestore().collection('companies').doc(window.currentCompanyId).collection('contacts').doc(ct.id).update({botStatus:'blocked'}); failed++; }
                }
            }
        } catch(e) { failed++; }
    }

    await firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('broadcasts').add({
            text:text||'', flowId:flowId||null,
            flowName:bp.flows.find(f=>f.id===flowId)?.name||'',
            audience, sent, failed, total:targets.length,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

    if (typeof showToast==='function') showToast(`Надіслано: ${sent}, помилок: ${failed}`, 'success');
    renderBroadcastTab();
};

// ══════════════════════════════════════════════════════════
// 8. НАЛАШТУВАННЯ БОТА
// ══════════════════════════════════════════════════════════
async function renderSettingsTab() {
    const c = document.getElementById('bpViewSettings');
    if (!c) return;
    const bot = bp.bots.find(b=>b.id===bp.activeBotId);
    if (!bot) { c.innerHTML = '<div style="padding:1rem;color:#9ca3af;">Оберіть бота</div>'; return; }

    const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
    const compData = compDoc.data()||{};

    c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);">
                <div style="font-weight:700;font-size:0.88rem;margin-bottom:0.75rem;">
                    ${bot.channel==='telegram'?'<i data-lucide="send" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>':'<i data-lucide="camera" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>'} ${escH(bot.name)}
                </div>
                <div style="font-size:0.78rem;color:#6b7280;margin-bottom:0.75rem;">
                    Username: @${escH(bot.username||'—')}<br>
                    Вебхук: <span style="color:${bot.connected?'#22c55e':'#ef4444'};">
                        ${bot.connected?'<i data-lucide="check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i> Підключено':'<i data-lucide="x" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i> Не підключено'}
                    </span>
                </div>
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ОНОВИТИ ТОКЕН</label>
                    <div style="display:flex;gap:0.4rem;">
                        <input type="password" id="bpSettingsToken"
                            value="${bot.token ? '•••'+bot.token.slice(-6) : ''}"
                            placeholder="Новий токен..."
                            style="flex:1;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;">
                        <button onclick="bpReconnectBot('${bot.id}')"
                            style="padding:0.5rem 0.8rem;background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;font-size:0.8rem;font-weight:600;">
                            Переп.
                        </button>
                    </div>
                </div>
                <button onclick="confirmDeleteBot('${bot.id}')"
                    style="margin-top:0.75rem;padding:0.45rem 1rem;background:#fee2e2;color:#ef4444;
                    border:none;border-radius:7px;cursor:pointer;font-size:0.8rem;">
                    Видалити бота
                </button>
            </div>
            <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);">
                <div style="font-weight:700;font-size:0.88rem;margin-bottom:0.6rem;"><i data-lucide="bot" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> AI Ключ</div>
                <div style="display:flex;gap:0.4rem;">
                    <input type="password" id="botsOpenAIKey"
                        value="${compData.openaiApiKey?'•••'+compData.openaiApiKey.slice(-4):''}"
                        placeholder="sk-..."
                        style="flex:1;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;">
                    <button onclick="saveBotApiKey('openai')"
                        style="padding:0.5rem 0.8rem;background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;font-size:0.8rem;font-weight:600;">
                        Зберегти
                    </button>
                </div>
            </div>
        </div>`;
    lcIcons(c);
    lcIcons(c);
}

window.bpReconnectBot = async function(botId) {
    const tokenEl = document.getElementById('bpSettingsToken');
    const token = tokenEl?.value.trim();
    if (!token || token.includes('•')) { alert('Введіть новий токен'); return; }
    try {
        const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const meData = await meRes.json();
        if (!meData.ok) throw new Error(meData.description);
        const webhookUrl = `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=telegram`;
        await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ url: webhookUrl }),
        });
        await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('bots').doc(botId)
            .update({ token, username: meData.result.username, connected: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        if (typeof showToast==='function') showToast('<i data-lucide="check-circle" style="width:14px;height:14px;display:inline-block;vertical-align:middle;color:#22c55e;"></i> Переп. успішно', 'success');
        renderSettingsTab();
    } catch(e) { alert('Помилка: '+e.message); }
};

// ── Helpers ────────────────────────────────────────────────
window.copyLink = function(link) {
    navigator.clipboard.writeText(link).then(()=>{ if(typeof showToast==='function') showToast('Скопійовано <i data-lucide="check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></i>','success'); });
};
window.showQR = function(encodedLink) {
    const link = decodeURIComponent(encodedLink);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    document.body.insertAdjacentHTML('beforeend',`
        <div onclick="this.remove()" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10030;
            display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <div style="background:white;border-radius:16px;padding:1.5rem;text-align:center;max-width:260px;" onclick="event.stopPropagation()">
                <div style="font-weight:700;margin-bottom:1rem;">QR-код</div>
                <img src="${qrUrl}" style="width:200px;height:200px;border-radius:8px;">
                <div style="font-size:0.7rem;color:#6b7280;margin-top:0.6rem;word-break:break-all;">${link}</div>
                <button onclick="this.closest('[style*=fixed]').remove()"
                    style="margin-top:0.75rem;padding:0.45rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;font-weight:600;">
                    Закрити
                </button>
            </div>
        </div>`);
};

function escH(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function relTime(d) {
    const diff = Date.now()-d.getTime(), m=Math.floor(diff/60000);
    if(m<1) return 'щойно'; if(m<60) return m+'хв';
    const h=Math.floor(m/60); if(h<24) return h+'год';
    return Math.floor(h/24)+'дн';
}

// ── Tab hook ───────────────────────────────────────────────
const _origST = window.switchTab;
window.switchTab = function(tab) {
    if (_origST) _origST(tab);
    if (tab==='bots' && window.isFeatureEnabled?.('bots')) window.initBotsModule();
};

})();
