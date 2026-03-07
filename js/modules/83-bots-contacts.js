// ============================================================
// TALKO Bots Module — UPGRADE PATCH
// Додає: Контакти, Чат, Розсилка, Deep Links, Blocked list
// Вставляється ПІСЛЯ 81-bots-flows.js як 83-bots-contacts.js
// ============================================================
(function () {
'use strict';

// ══════════════════════════════════════════════════════════
// 1. ПАТЧ: розширюємо renderBotsShell — додаємо нові таби
// ══════════════════════════════════════════════════════════
const _origInitBots = window.initBotsModule;
window.initBotsModule = async function () {
    if (!window.currentCompanyId) return;
    renderBotsShellV2();
    await loadBotsDataV2();
};

let botsFlowsV2 = [];
let botsUnsubV2 = null;
let botsSubTabV2 = 'flows'; // flows | contacts | chat | broadcast | settings

async function loadBotsDataV2() {
    if (!window.currentCompanyId) return;
    const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
    if (botsUnsubV2) botsUnsubV2();
    botsUnsubV2 = base.collection('flows')
        .orderBy('createdAt', 'desc').limit(100)
        .onSnapshot(snap => {
            botsFlowsV2 = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (botsSubTabV2 === 'flows') renderFlowsTab();
        });
}

function renderBotsShellV2() {
    const container = document.getElementById('botsContainer');
    if (!container) return;

    const tabs = [
        ['flows',     'Ланцюги',   '⛓'],
        ['contacts',  'Контакти',  '👥'],
        ['chat',      'Чат',       '💬'],
        ['broadcast', 'Розсилка',  '📢'],
        ['settings',  'Налаштування','⚙'],
    ];

    container.innerHTML = `
        <div id="botsModuleV2" style="padding:0.75rem;">
            <!-- Tab bar -->
            <div style="display:flex;gap:0.3rem;margin-bottom:1rem;background:white;
                border-radius:12px;padding:0.35rem;box-shadow:var(--shadow);overflow-x:auto;">
                ${tabs.map(([id,label,icon]) => `
                    <button id="botsTabBtn_${id}" onclick="botsSwitchV2('${id}')"
                        style="flex:1;min-width:70px;padding:0.45rem 0.5rem;border:none;border-radius:8px;
                        cursor:pointer;font-size:0.78rem;font-weight:600;white-space:nowrap;
                        background:${id==='flows'?'#22c55e':'transparent'};
                        color:${id==='flows'?'white':'#525252'};transition:all 0.2s;">
                        ${icon} ${label}
                    </button>`).join('')}
            </div>
            <!-- Views -->
            <div id="botsViewFlows"></div>
            <div id="botsViewContacts" style="display:none;"></div>
            <div id="botsViewChat" style="display:none;"></div>
            <div id="botsViewBroadcast" style="display:none;"></div>
            <div id="botsViewSettings" style="display:none;"></div>
        </div>`;

    renderFlowsTab();
}

window.botsSwitchV2 = function(tab) {
    botsSubTabV2 = tab;
    const tabs = ['flows','contacts','chat','broadcast','settings'];
    tabs.forEach(t => {
        const btn = document.getElementById(`botsTabBtn_${t}`);
        const view = document.getElementById(`botsView${t.charAt(0).toUpperCase()+t.slice(1)}`);
        if (btn) { btn.style.background = t===tab ? '#22c55e' : 'transparent'; btn.style.color = t===tab ? 'white' : '#525252'; }
        if (view) view.style.display = t===tab ? '' : 'none';
    });
    if (tab==='flows')     renderFlowsTab();
    if (tab==='contacts')  renderContactsTab();
    if (tab==='chat')      renderChatTab();
    if (tab==='broadcast') renderBroadcastTab();
    if (tab==='settings')  renderSettingsTabV2();
};

// ══════════════════════════════════════════════════════════
// 2. ЛАНЦЮГИ (flows) — з deep link
// ══════════════════════════════════════════════════════════
function renderFlowsTab() {
    const c = document.getElementById('botsViewFlows');
    if (!c) return;

    const integrations = window._botsIntegrations || {};
    const botUsername = integrations.telegram?.botName || '';

    const statusColors = { active:'#22c55e', draft:'#9ca3af', paused:'#f97316' };
    const channelIcon  = { telegram:'✈️', instagram:'📸', whatsapp:'💬', web:'🌐' };

    c.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <div>
                <div style="font-weight:700;font-size:1rem;">Ланцюги</div>
                <div style="font-size:0.75rem;color:#6b7280;">${botsFlowsV2.length} ланцюгів</div>
            </div>
            <button onclick="openCreateFlowModalV2()"
                style="padding:0.5rem 1rem;background:#22c55e;color:white;border:none;
                border-radius:10px;cursor:pointer;font-weight:600;font-size:0.84rem;">
                + Новий ланцюг
            </button>
        </div>

        ${botsFlowsV2.length === 0 ? `
            <div style="text-align:center;padding:3rem;background:white;border-radius:12px;box-shadow:var(--shadow);">
                <div style="font-size:2.5rem;margin-bottom:0.75rem;">⛓</div>
                <div style="font-weight:600;margin-bottom:0.4rem;">Ланцюгів поки немає</div>
                <div style="font-size:0.85rem;color:#6b7280;margin-bottom:1rem;">Створіть перший ланцюг сценарію</div>
                <button onclick="openCreateFlowModalV2()" style="padding:0.6rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;">+ Створити</button>
            </div>` : `
            <div style="display:flex;flex-direction:column;gap:0.6rem;">
                ${botsFlowsV2.map(flow => {
                    const deepLink = botUsername
                        ? `https://t.me/${botUsername}?start=${flow.id}`
                        : `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=telegram&flow=${flow.id}`;
                    return `
                    <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);
                        border-left:3px solid ${statusColors[flow.status]||'#9ca3af'};">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">
                                    <span>${channelIcon[flow.channel]||'🤖'}</span>
                                    <span style="font-weight:700;font-size:0.9rem;">${escH(flow.name)}</span>
                                    <span style="font-size:0.68rem;background:${statusColors[flow.status]||'#9ca3af'}22;
                                        color:${statusColors[flow.status]||'#9ca3af'};padding:1px 6px;border-radius:20px;font-weight:600;">
                                        ${flow.status||'draft'}
                                    </span>
                                </div>
                                <div style="font-size:0.74rem;color:#6b7280;">
                                    Тригер: <code style="background:#f0fdf4;color:#16a34a;padding:1px 4px;border-radius:3px;">${escH(flow.triggerKeyword||'/start')}</code>
                                    · ${(flow.nodes||[]).length} вузлів · ${flow.sessionCount||0} сесій
                                </div>
                                <!-- Deep link -->
                                <div style="margin-top:0.5rem;display:flex;align-items:center;gap:0.4rem;">
                                    <div style="font-size:0.72rem;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                                        flex:1;background:#f9fafb;border-radius:5px;padding:3px 6px;border:1px solid #e5e7eb;">
                                        ${deepLink}
                                    </div>
                                    <button onclick="copyDeepLink('${deepLink}')"
                                        style="padding:3px 8px;background:#eff6ff;color:#3b82f6;border:none;border-radius:5px;cursor:pointer;font-size:0.7rem;white-space:nowrap;flex-shrink:0;">
                                        Копіювати
                                    </button>
                                </div>
                            </div>
                            <div style="display:flex;gap:0.35rem;flex-shrink:0;">
                                <button onclick="openFlowCanvas('${flow.id}')"
                                    style="padding:0.4rem 0.7rem;background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;font-size:0.78rem;font-weight:600;">
                                    ✏ Редагувати
                                </button>
                                <button onclick="toggleFlowStatusV2('${flow.id}','${flow.status}')"
                                    style="padding:0.4rem 0.6rem;background:${flow.status==='active'?'#fee2e2':'#f0fdf4'};
                                    color:${flow.status==='active'?'#ef4444':'#16a34a'};border:none;border-radius:7px;cursor:pointer;font-size:0.75rem;">
                                    ${flow.status==='active'?'Пауза':'▶ Старт'}
                                </button>
                                <button onclick="showFlowQR('${flow.id}','${deepLink}')"
                                    style="padding:0.4rem 0.6rem;background:#f0f9ff;color:#0284c7;border:none;border-radius:7px;cursor:pointer;font-size:0.75rem;">
                                    QR
                                </button>
                                <button onclick="confirmDeleteFlowV2('${flow.id}')"
                                    style="padding:0.4rem 0.5rem;background:#fee2e2;color:#ef4444;border:none;border-radius:7px;cursor:pointer;font-size:0.75rem;">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>`; }).join('')}
            </div>`}`;
}

window.copyDeepLink = function(link) {
    navigator.clipboard.writeText(link).then(() => {
        if (typeof showToast === 'function') showToast('Посилання скопійовано ✓', 'success');
    });
};

window.showFlowQR = function(flowId, link) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    const html = `
        <div onclick="if(event.target===this)this.remove()" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);
            z-index:10020;display:flex;align-items:center;justify-content:center;">
            <div style="background:white;border-radius:16px;padding:1.5rem;text-align:center;max-width:280px;">
                <div style="font-weight:700;margin-bottom:1rem;">QR-код для ланцюга</div>
                <img src="${qrUrl}" style="width:200px;height:200px;border-radius:8px;">
                <div style="font-size:0.75rem;color:#6b7280;margin-top:0.75rem;word-break:break-all;">${link}</div>
                <button onclick="this.closest('[style*=fixed]').remove()"
                    style="margin-top:1rem;padding:0.5rem 1.5rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">
                    Закрити
                </button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
};

window.openCreateFlowModalV2 = function() {
    const html = `
        <div id="botsCreateV2" onclick="if(event.target===this)this.remove()"
            style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10020;
            display:flex;align-items:center;justify-content:center;padding:1rem;">
            <div style="background:white;border-radius:16px;width:100%;max-width:420px;">
                <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-weight:700;">Новий ланцюг</div>
                    <button onclick="document.getElementById('botsCreateV2').remove()"
                        style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;">✕</button>
                </div>
                <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА *</label>
                        <input id="v2FlowName" placeholder="Наприклад: Запис на консультацію"
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">КАНАЛ</label>
                        <select id="v2FlowChannel" style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;">
                            <option value="telegram">✈️ Telegram</option>
                            <option value="instagram">📸 Instagram</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.75rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ТРИГЕР</label>
                        <input id="v2FlowTrigger" placeholder="/start або ключове слово"
                            style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                    </div>
                </div>
                <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                    <button onclick="document.getElementById('botsCreateV2').remove()"
                        style="padding:0.55rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                    <button onclick="saveNewFlowV2()"
                        style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Створити</button>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('v2FlowName')?.focus();
};

window.saveNewFlowV2 = async function() {
    const name = document.getElementById('v2FlowName')?.value.trim();
    if (!name) { alert('Введіть назву'); return; }
    try {
        const ref = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('flows').add({
                name,
                channel: document.getElementById('v2FlowChannel')?.value || 'telegram',
                triggerKeyword: document.getElementById('v2FlowTrigger')?.value.trim() || '/start',
                status: 'draft',
                nodes: [],
                sessionCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        document.getElementById('botsCreateV2')?.remove();
        if (typeof showToast === 'function') showToast('Ланцюг створено ✓', 'success');
        openFlowCanvas(ref.id);
    } catch(e) { alert('Помилка: ' + e.message); }
};

window.toggleFlowStatusV2 = async function(flowId, status) {
    const newStatus = status === 'active' ? 'paused' : 'active';
    await firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('flows').doc(flowId)
        .update({ status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    if (typeof showToast === 'function') showToast(newStatus === 'active' ? '▶ Ланцюг активовано' : '⏸ Ланцюг на паузі', 'success');
};

window.confirmDeleteFlowV2 = function(flowId) {
    if (!confirm('Видалити ланцюг? Активні сесії будуть зупинені.')) return;
    firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('flows').doc(flowId).delete()
        .then(() => { if (typeof showToast === 'function') showToast('Видалено', 'success'); });
};

// ══════════════════════════════════════════════════════════
// 3. КОНТАКТИ — список + хто заблокував
// ══════════════════════════════════════════════════════════
let botsContacts = [];
let botsContactsFilter = 'all'; // all | active | blocked | unsubscribed

async function renderContactsTab() {
    const c = document.getElementById('botsViewContacts');
    if (!c) return;
    c.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;">Завантаження...</div>';

    try {
        const snap = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('contacts')
            .where('source', 'in', ['telegram','instagram','facebook','viber'])
            .orderBy('createdAt', 'desc').limit(200).get();
        botsContacts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderContactsList();
    } catch(e) {
        // Fallback без фільтру
        try {
            const snap2 = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('contacts').orderBy('createdAt', 'desc').limit(200).get();
            botsContacts = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
            renderContactsList();
        } catch(e2) {
            c.innerHTML = '<div style="color:#ef4444;padding:1rem;">Помилка завантаження</div>';
        }
    }
}

function renderContactsList() {
    const c = document.getElementById('botsViewContacts');
    if (!c) return;

    const filters = [
        ['all','Всі'],['active','Активні'],['blocked','Заблокували'],['unsubscribed','Відписались']
    ];

    const filtered = botsContactsFilter === 'all' ? botsContacts
        : botsContacts.filter(ct => ct.botStatus === botsContactsFilter);

    const total = botsContacts.length;
    const blocked = botsContacts.filter(ct => ct.botStatus === 'blocked').length;
    const active = botsContacts.filter(ct => !ct.botStatus || ct.botStatus === 'active').length;

    c.innerHTML = `
        <!-- Stats row -->
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
            ${[
                ['👥 Всього', total, '#3b82f6'],
                ['✅ Активних', active, '#22c55e'],
                ['🚫 Заблокували', blocked, '#ef4444'],
            ].map(([label,val,color]) => `
                <div style="flex:1;background:white;border-radius:10px;padding:0.6rem;
                    box-shadow:var(--shadow);text-align:center;border-top:2px solid ${color};">
                    <div style="font-size:1.1rem;font-weight:700;color:${color};">${val}</div>
                    <div style="font-size:0.68rem;color:#6b7280;">${label}</div>
                </div>`).join('')}
        </div>

        <!-- Filter tabs -->
        <div style="display:flex;gap:0.3rem;margin-bottom:0.75rem;background:white;
            border-radius:10px;padding:0.3rem;box-shadow:var(--shadow);">
            ${filters.map(([id,label]) => `
                <button onclick="filterContacts('${id}')"
                    style="flex:1;padding:0.4rem;border:none;border-radius:7px;cursor:pointer;
                    font-size:0.75rem;font-weight:600;
                    background:${botsContactsFilter===id?'#22c55e':'transparent'};
                    color:${botsContactsFilter===id?'white':'#525252'};">${label}</button>
            `).join('')}
        </div>

        <!-- Contact list -->
        <div style="display:flex;flex-direction:column;gap:0.4rem;">
            ${filtered.length === 0 ? `<div style="text-align:center;padding:2rem;background:white;border-radius:12px;color:#9ca3af;">Контактів немає</div>` :
            filtered.map(ct => {
                const isBlocked = ct.botStatus === 'blocked';
                const isUnsub = ct.botStatus === 'unsubscribed';
                const statusColor = isBlocked ? '#ef4444' : isUnsub ? '#f97316' : '#22c55e';
                const statusLabel = isBlocked ? '🚫 Заблокував' : isUnsub ? '👋 Відписався' : '✅ Активний';
                return `
                <div style="background:white;border-radius:10px;padding:0.75rem;box-shadow:var(--shadow);
                    display:flex;align-items:center;gap:0.6rem;
                    ${isBlocked?'opacity:0.75;border-left:3px solid #ef4444;':''}">
                    <div style="width:36px;height:36px;border-radius:50%;background:${statusColor}22;
                        display:flex;align-items:center;justify-content:center;font-size:0.85rem;
                        font-weight:700;color:${statusColor};flex-shrink:0;">
                        ${(ct.name||'?').charAt(0).toUpperCase()}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                            ${escH(ct.name||'Без імені')}
                        </div>
                        <div style="font-size:0.72rem;color:#6b7280;">
                            ${ct.phone||ct.email||ct.externalId||'—'}
                            · ${ct.source||'telegram'}
                        </div>
                    </div>
                    <div style="text-align:right;flex-shrink:0;">
                        <div style="font-size:0.68rem;color:${statusColor};font-weight:600;">${statusLabel}</div>
                        <div style="font-size:0.68rem;color:#9ca3af;">${ct.createdAt?.toDate?relTimeV2(ct.createdAt.toDate()):''}</div>
                    </div>
                    <button onclick="openChatWithContact('${ct.id}')"
                        style="padding:0.3rem 0.6rem;background:#eff6ff;color:#3b82f6;border:none;
                        border-radius:6px;cursor:pointer;font-size:0.72rem;flex-shrink:0;
                        ${isBlocked?'opacity:0.5;pointer-events:none;':''}">
                        💬 Чат
                    </button>
                </div>`; }).join('')}
        </div>`;
}

window.filterContacts = function(filter) {
    botsContactsFilter = filter;
    renderContactsList();
};

// ══════════════════════════════════════════════════════════
// 4. ЧАТ З КОНТАКТОМ
// ══════════════════════════════════════════════════════════
let activeChatContactId = null;
let chatMessages = [];
let chatUnsubscribe = null;

async function renderChatTab(contactId) {
    const c = document.getElementById('botsViewChat');
    if (!c) return;

    // Contact list sidebar + chat area
    c.innerHTML = `
        <div style="display:flex;gap:0.5rem;height:500px;">
            <!-- Contacts sidebar -->
            <div id="chatSidebar" style="width:140px;flex-shrink:0;background:white;
                border-radius:12px;box-shadow:var(--shadow);overflow-y:auto;">
                <div style="padding:0.5rem;font-size:0.72rem;font-weight:700;color:#6b7280;
                    text-transform:uppercase;border-bottom:1px solid #f0f0f0;">Контакти</div>
                <div id="chatContactList" style="display:flex;flex-direction:column;"></div>
            </div>
            <!-- Chat area -->
            <div style="flex:1;display:flex;flex-direction:column;background:white;
                border-radius:12px;box-shadow:var(--shadow);overflow:hidden;">
                <div id="chatHeader" style="padding:0.75rem;border-bottom:1px solid #f0f0f0;
                    font-size:0.85rem;font-weight:600;color:#374151;">
                    Оберіть контакт зліва
                </div>
                <div id="chatMessages" style="flex:1;overflow-y:auto;padding:0.75rem;
                    display:flex;flex-direction:column;gap:0.5rem;background:#f8fafc;">
                </div>
                <div id="chatInput" style="padding:0.5rem;border-top:1px solid #f0f0f0;
                    display:flex;gap:0.4rem;">
                    <input id="chatMsgInput" placeholder="Написати повідомлення..."
                        style="flex:1;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;"
                        onkeydown="if(event.key==='Enter')sendChatMsg()">
                    <button onclick="sendChatMsg()"
                        style="padding:0.5rem 0.9rem;background:#22c55e;color:white;border:none;
                        border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;">→</button>
                </div>
            </div>
        </div>`;

    // Load contacts for sidebar
    loadChatContactList(contactId);
}

async function loadChatContactList(selectId) {
    const list = document.getElementById('chatContactList');
    if (!list) return;

    const contacts = botsContacts.length > 0 ? botsContacts :
        (await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('contacts').orderBy('createdAt','desc').limit(50).get())
            .docs.map(d=>({id:d.id,...d.data()}));

    list.innerHTML = contacts.map(ct => `
        <div onclick="openChatWithContact('${ct.id}')"
            style="padding:0.5rem;cursor:pointer;border-bottom:1px solid #f9fafb;
            background:${ct.id===activeChatContactId?'#f0fdf4':'transparent'};
            transition:background 0.15s;"
            onmouseenter="this.style.background='#f0fdf4'"
            onmouseleave="this.style.background='${ct.id===activeChatContactId?'#f0fdf4':'transparent'}'">
            <div style="font-size:0.78rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${escH(ct.name||'Анонім')}
            </div>
            <div style="font-size:0.65rem;color:#9ca3af;">${ct.source||'telegram'}</div>
        </div>`).join('');

    if (selectId || contacts[0]) {
        openChatWithContact(selectId || contacts[0].id);
    }
}

window.openChatWithContact = async function(contactId) {
    // Switch to chat tab if not there
    if (botsSubTabV2 !== 'chat') {
        botsSwitchV2('chat');
        await new Promise(r => setTimeout(r, 100));
    }

    activeChatContactId = contactId;
    const contact = botsContacts.find(ct=>ct.id===contactId) ||
        (await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('contacts').doc(contactId).get()).data();

    const header = document.getElementById('chatHeader');
    if (header && contact) {
        header.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:28px;height:28px;border-radius:50%;background:#22c55e22;
                    display:flex;align-items:center;justify-content:center;font-weight:700;
                    color:#22c55e;font-size:0.8rem;">
                    ${(contact.name||'?').charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style="font-weight:700;font-size:0.85rem;">${escH(contact.name||'Анонім')}</div>
                    <div style="font-size:0.7rem;color:#6b7280;">${contact.phone||contact.externalId||''} · ${contact.source||'telegram'}</div>
                </div>
                ${contact.botStatus==='blocked' ? '<span style="margin-left:auto;font-size:0.7rem;color:#ef4444;background:#fee2e2;padding:2px 6px;border-radius:4px;">🚫 Заблокував бота</span>' : ''}
            </div>`;
    }

    // Load messages
    if (chatUnsubscribe) chatUnsubscribe();
    const msgsDiv = document.getElementById('chatMessages');
    if (msgsDiv) msgsDiv.innerHTML = '<div style="text-align:center;padding:1rem;color:#9ca3af;font-size:0.8rem;">Завантаження...</div>';

    const sessionId = `telegram_${contact?.externalId?.replace('telegram_','')||contactId}`;
    chatUnsubscribe = firebase.firestore()
        .collection('companies').doc(window.currentCompanyId)
        .collection('sessions').doc(sessionId)
        .collection('messages')
        .orderBy('timestamp','asc').limit(100)
        .onSnapshot(snap => {
            chatMessages = snap.docs.map(d=>({id:d.id,...d.data()}));
            renderChatMessages(contact);
        });
};

function renderChatMessages(contact) {
    const msgsDiv = document.getElementById('chatMessages');
    if (!msgsDiv) return;

    if (chatMessages.length === 0) {
        msgsDiv.innerHTML = `<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:0.8rem;">
            Повідомлень ще немає.<br>Напишіть першим або запустіть ланцюг.
        </div>`;
        return;
    }

    msgsDiv.innerHTML = chatMessages.map(msg => {
        const isOut = msg.direction === 'out';
        return `
            <div style="display:flex;justify-content:${isOut?'flex-end':'flex-start'};">
                <div style="max-width:80%;padding:0.5rem 0.75rem;border-radius:${isOut?'12px 12px 2px 12px':'12px 12px 12px 2px'};
                    background:${isOut?'#22c55e':'white'};color:${isOut?'white':'#374151'};
                    font-size:0.82rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);line-height:1.4;">
                    ${escH(msg.text||'')}
                    <div style="font-size:0.62rem;opacity:0.6;margin-top:2px;text-align:right;">
                        ${msg.timestamp?.toDate?relTimeV2(msg.timestamp.toDate()):''}
                    </div>
                </div>
            </div>`;
    }).join('');

    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

window.sendChatMsg = async function() {
    const input = document.getElementById('chatMsgInput');
    const text = input?.value.trim();
    if (!text || !activeChatContactId) return;

    const contact = botsContacts.find(ct=>ct.id===activeChatContactId);
    const sessionId = `telegram_${contact?.externalId?.replace('telegram_','')||activeChatContactId}`;

    input.value = '';

    // Save to Firestore
    await firebase.firestore()
        .collection('companies').doc(window.currentCompanyId)
        .collection('sessions').doc(sessionId)
        .collection('messages').add({
            direction: 'out',
            text,
            sentBy: 'operator',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

    // Send via Telegram if connected
    const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
    const token = compDoc.data()?.integrations?.telegram?.botToken;
    const telegramId = contact?.externalId?.replace('telegram_','');
    if (token && telegramId) {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ chat_id: telegramId, text }),
        });
    }
};

// ══════════════════════════════════════════════════════════
// 5. РОЗСИЛКА (Broadcast)
// ══════════════════════════════════════════════════════════
async function renderBroadcastTab() {
    const c = document.getElementById('botsViewBroadcast');
    if (!c) return;

    // Load broadcast history
    let broadcasts = [];
    try {
        const snap = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('broadcasts').orderBy('createdAt','desc').limit(30).get();
        broadcasts = snap.docs.map(d=>({id:d.id,...d.data()}));
    } catch(e) {}

    const activeContacts = botsContacts.filter(ct=>!ct.botStatus||ct.botStatus==='active').length || '?';

    c.innerHTML = `
        <!-- Create broadcast -->
        <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);margin-bottom:0.75rem;">
            <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.75rem;">📢 Нова розсилка</div>
            <div style="display:flex;flex-direction:column;gap:0.6rem;">
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.25rem;">АУДИТОРІЯ</label>
                    <select id="broadcastAudience" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.83rem;background:white;">
                        <option value="all">Всі активні контакти (${activeContacts})</option>
                        <option value="telegram">Тільки Telegram</option>
                        <option value="instagram">Тільки Instagram</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.25rem;">ТЕКСТ ПОВІДОМЛЕННЯ</label>
                    <textarea id="broadcastText" rows="4" placeholder="Введіть текст розсилки..."
                        style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.83rem;resize:vertical;box-sizing:border-box;"></textarea>
                </div>
                <div>
                    <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.25rem;">АБО ЗАПУСТИТИ ЛАНЦЮГ</label>
                    <select id="broadcastFlow" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.83rem;background:white;">
                        <option value="">— Не запускати —</option>
                        ${botsFlowsV2.map(f=>`<option value="${f.id}">${escH(f.name)}</option>`).join('')}
                    </select>
                </div>
                <button onclick="sendBroadcast()"
                    style="padding:0.6rem;background:#22c55e;color:white;border:none;border-radius:8px;
                    cursor:pointer;font-weight:700;font-size:0.85rem;">
                    📢 Надіслати розсилку
                </button>
            </div>
        </div>

        <!-- History -->
        <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.5rem;color:#374151;">
            Історія розсилок
        </div>
        ${broadcasts.length === 0 ? `
            <div style="text-align:center;padding:1.5rem;background:white;border-radius:10px;color:#9ca3af;font-size:0.82rem;">
                Розсилок ще не було
            </div>` :
        broadcasts.map(b => `
            <div style="background:white;border-radius:10px;padding:0.75rem;box-shadow:var(--shadow);margin-bottom:0.4rem;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:0.82rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                            ${escH(b.text||b.flowName||'Розсилка')}
                        </div>
                        <div style="font-size:0.7rem;color:#6b7280;margin-top:2px;">
                            ${b.audience||'all'} · ${b.createdAt?.toDate?relTimeV2(b.createdAt.toDate()):''}
                        </div>
                    </div>
                    <div style="text-align:right;font-size:0.72rem;flex-shrink:0;margin-left:0.5rem;">
                        <div style="color:#22c55e;">✓ ${b.sent||0} надіслано</div>
                        <div style="color:#ef4444;">${b.failed||0} помилок</div>
                    </div>
                </div>
            </div>`).join('')}`;
}

window.sendBroadcast = async function() {
    const text = document.getElementById('broadcastText')?.value.trim();
    const flowId = document.getElementById('broadcastFlow')?.value;
    const audience = document.getElementById('broadcastAudience')?.value || 'all';

    if (!text && !flowId) { alert('Введіть текст або оберіть ланцюг'); return; }
    if (!confirm(`Надіслати розсилку? Аудиторія: ${audience}`)) return;

    const btn = document.querySelector('[onclick="sendBroadcast()"]');
    if (btn) btn.textContent = 'Надсилання...';

    // Get company data (Telegram token)
    const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
    const token = compDoc.data()?.integrations?.telegram?.botToken;

    // Filter contacts
    let targets = botsContacts.filter(ct => !ct.botStatus || ct.botStatus === 'active');
    if (audience === 'telegram') targets = targets.filter(ct => ct.source === 'telegram');
    if (audience === 'instagram') targets = targets.filter(ct => ct.source === 'instagram');

    let sent = 0, failed = 0;

    for (const ct of targets) {
        try {
            if (ct.source === 'telegram' && token) {
                const telegramId = ct.externalId?.replace('telegram_','');
                if (telegramId) {
                    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({ chat_id: telegramId, text: text || '📢 Нове повідомлення від бота' }),
                    });
                    const data = await res.json();
                    if (data.ok) { sent++; }
                    else if (data.error_code === 403) {
                        // User blocked bot — оновлюємо статус
                        await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                            .collection('contacts').doc(ct.id).update({ botStatus: 'blocked' });
                        failed++;
                    } else { failed++; }
                }
            }
        } catch(e) { failed++; }
    }

    // Save broadcast to history
    const flowName = botsFlowsV2.find(f=>f.id===flowId)?.name || '';
    await firebase.firestore().collection('companies').doc(window.currentCompanyId)
        .collection('broadcasts').add({
            text: text || '',
            flowId: flowId || null,
            flowName,
            audience,
            sent,
            failed,
            total: targets.length,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

    if (btn) btn.textContent = '📢 Надіслати розсилку';
    if (typeof showToast === 'function') showToast(`Надіслано: ${sent}, помилок: ${failed}`, 'success');
    renderBroadcastTab();
};

// ══════════════════════════════════════════════════════════
// 6. НАЛАШТУВАННЯ (перевикористовуємо Settings)
// ══════════════════════════════════════════════════════════
async function renderSettingsTabV2() {
    const c = document.getElementById('botsViewSettings');
    if (!c) return;
    // Proxy to existing settings renderer
    c.innerHTML = '<div id="botsSettingsView"></div>';
    if (typeof renderBotsSettingsView === 'function') {
        // Call original but redefine container
        const orig = document.getElementById('botsSettingsView');
        if (orig) {
            // Trigger original settings render
            window._botsSubTabBackup = window.botsSubTab;
            // Render inline
            const compDoc = await firebase.firestore().collection('companies').doc(window.currentCompanyId).get();
            const compData = compDoc.data() || {};
            window._botsIntegrations = compData.integrations || {};
            renderSettingsInline(c, compData);
        }
    }
}

async function renderSettingsInline(c, compData) {
    const integrations = compData.integrations || {};
    const webhookBase = `${location.origin}/api/webhook?companyId=${window.currentCompanyId}&channel=`;
    const channelStatus = ch => integrations[ch]?.connected
        ? '<span style="color:#22c55e;font-size:0.75rem;font-weight:600;">● Підключено</span>'
        : '<span style="color:#9ca3af;font-size:0.75rem;">○ Не підключено</span>';

    c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <!-- Telegram -->
            <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                    <div style="display:flex;align-items:center;gap:0.4rem;">
                        <span style="font-size:1.1rem;">✈️</span>
                        <span style="font-weight:700;font-size:0.9rem;">Telegram</span>
                    </div>
                    ${channelStatus('telegram')}
                </div>
                <div style="display:flex;gap:0.4rem;">
                    <input type="password" id="tgTokenV2"
                        value="${integrations.telegram?.botToken ? '•••'+integrations.telegram.botToken.slice(-6) : ''}"
                        placeholder="123456:AAF..."
                        style="flex:1;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;">
                    <button onclick="botsConnectTelegram()"
                        style="padding:0.5rem 0.8rem;background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;font-size:0.8rem;font-weight:600;">
                        Підключити
                    </button>
                </div>
                ${integrations.telegram?.connected ? `
                    <div style="margin-top:0.5rem;font-size:0.72rem;color:#6b7280;">
                        Бот: @${integrations.telegram.botName||'—'}<br>
                        Webhook: <span style="color:#22c55e;">✓ встановлено</span>
                    </div>
                    <button onclick="botsDisconnectChannel('telegram')"
                        style="margin-top:0.4rem;padding:0.3rem 0.75rem;background:#fee2e2;color:#ef4444;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;">
                        Відключити
                    </button>` : `
                    <div style="margin-top:0.5rem;font-size:0.75rem;color:#6b7280;">
                        Вебхук буде встановлено автоматично
                    </div>`}
            </div>

            <!-- OpenAI Key -->
            <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);">
                <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.6rem;">🤖 AI Ключі</div>
                <div style="display:flex;gap:0.4rem;margin-bottom:0.4rem;">
                    <input type="password" id="botsOpenAIKey"
                        value="${compData.openaiApiKey ? '•••'+compData.openaiApiKey.slice(-4) : ''}"
                        placeholder="sk-..."
                        style="flex:1;padding:0.5rem;border:1px solid #e5e7eb;border-radius:7px;font-size:0.82rem;">
                    <button onclick="saveBotApiKey('openai')"
                        style="padding:0.5rem 0.8rem;background:#22c55e;color:white;border:none;border-radius:7px;cursor:pointer;font-size:0.8rem;font-weight:600;">
                        Зберегти
                    </button>
                </div>
            </div>
        </div>`;
}

// ══════════════════════════════════════════════════════════
// 7. HELPERS
// ══════════════════════════════════════════════════════════
function escH(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function relTimeV2(d) {
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff/60000);
    if (m<1) return 'щойно';
    if (m<60) return m+'хв';
    const h = Math.floor(m/60);
    if (h<24) return h+'год';
    return Math.floor(h/24)+'дн';
}

// Intercept switchTab для ботів
const _origSwitchTab = window.switchTab;
window.switchTab = function(tab) {
    if (_origSwitchTab) _origSwitchTab(tab);
    if (tab === 'bots') {
        if (window.isFeatureEnabled && window.isFeatureEnabled('bots')) {
            window.initBotsModule();
        }
    }
};

})();
