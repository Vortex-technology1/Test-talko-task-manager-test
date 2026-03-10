// =====================
// EVENT BUS — TALKO
// Центральна шина причинно-наслідкових зв'язків між модулями.
//
// АРХІТЕКТУРА:
//   Будь-який модуль може:
//     1. emit(event)   — опублікувати подію
//     2. on(type, fn)  — підписатись на подію
//
//   Події зберігаються в Firestore з TTL 7 днів.
//   Automation Engine читає непроцесовані події і виконує правила.
//
// ТИПИ ПОДІЙ:
//   bot.*         — боти і воронки
//   deal.*        — CRM угоди
//   client.*      — CRM клієнти
//   task.*        — завдання TALKO
//   invoice.*     — фінанси
//   form.*        — форми сайтів
//   contact.*     — контакти ботів
// =====================

// ─────────────────────────────────────────
// КОНСТАНТИ — типи подій
// ─────────────────────────────────────────
'use strict';
const TALKO_EVENTS = {

    // БОТ
    BOT_FLOW_COMPLETED:      'bot.flow_completed',      // лід пройшов воронку
    BOT_MESSAGE_RECEIVED:    'bot.message_received',    // нове повідомлення від юзера
    BOT_SUBSCRIBED:          'bot.subscribed',          // /start
    BOT_UNSUBSCRIBED:        'bot.unsubscribed',        // заблокував бота

    // CONTACT
    CONTACT_CREATED:         'contact.created',         // новий контакт з боту
    CONTACT_UPDATED:         'contact.updated',         // оновлення даних
    CONTACT_MESSAGE_SENT:    'contact.message_sent',    // менеджер написав вручну

    // DEAL
    DEAL_CREATED:            'deal.created',            // нова угода
    DEAL_STAGE_CHANGED:      'deal.stage_changed',      // переміщення по Kanban
    DEAL_WON:                'deal.won',                // угода виграна
    DEAL_LOST:               'deal.lost',               // угода програна
    DEAL_AMOUNT_CHANGED:     'deal.amount_changed',     // змінилась сума
    DEAL_ASSIGNED:           'deal.assigned',           // змінився відповідальний

    // CLIENT
    CLIENT_CREATED:          'client.created',          // новий клієнт
    CLIENT_UPDATED:          'client.updated',

    // TASK
    TASK_CREATED:            'task.created',            // нова задача
    TASK_COMPLETED:          'task.completed',          // задача виконана
    TASK_OVERDUE:            'task.overdue',            // прострочена
    TASK_LINKED_TO_DEAL:     'task.linked_to_deal',     // задача прив'язана до угоди

    // INVOICE / FINANCE
    INVOICE_CREATED:         'invoice.created',
    INVOICE_PAID:            'invoice.paid',            // → deal.won автоматично
    BUDGET_EXCEEDED:         'budget.exceeded',         // витрати > бюджет → задача

    // FORM / SITE
    FORM_SUBMITTED:          'form.submitted',          // заявка з сайту → лід у CRM
    SITE_VISITED:            'site.visited',            // відвідування сайту

    // BROADCAST
    BROADCAST_SENT:          'broadcast.sent',
    BROADCAST_FAILED:        'broadcast.failed',
};

// ─────────────────────────────────────────
// ВНУТРІШНІЙ РЕЄСТР ОБРОБНИКІВ
// ─────────────────────────────────────────
const _handlers = {};  // { 'event.type': [fn1, fn2, ...] }
const _eventQueue = []; // буфер для batch запису в Firestore

// ─────────────────────────────────────────
// ПІДПИСКА НА ПОДІЮ
// ─────────────────────────────────────────
function onTalkoEvent(eventType, handler) {
    if (!_handlers[eventType]) _handlers[eventType] = [];
    _handlers[eventType].push(handler);
}

// ─────────────────────────────────────────
// ПУБЛІКАЦІЯ ПОДІЇ
// ─────────────────────────────────────────
async function emitTalkoEvent(eventType, payload = {}, options = {}) {
    if (!currentUser || !window.currentCompanyId) return;

    const event = {
        type: eventType,
        payload,
        triggeredBy: options.triggeredBy || 'user',   // 'user' | 'bot' | 'system'
        triggeredByUserId: currentUser.uid,
        companyId: window.currentCompanyId,
        processed: false,
        // TTL: автоматичне видалення через 7 днів (Cloud Function або ручний cleanup)
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // 1. Виконуємо локальних обробників синхронно (UI реагує миттєво)
    _dispatchLocally(eventType, event);

    // 2. Зберігаємо в Firestore (для automation engine і аудиту)
    try {
        const ref = db.collection(`companies/${window.currentCompanyId}/events`);
        await ref.add(event);
    } catch (err) {
        console.warn('[EventBus] Failed to persist event:', eventType, err);
        // Не кидаємо помилку — локальна обробка вже відбулась
    }

    // 3. Запускаємо automation engine
    _runAutomationRules(event);
}

// ─────────────────────────────────────────
// ЛОКАЛЬНА ДИСПЕТЧЕРИЗАЦІЯ
// ─────────────────────────────────────────
function _dispatchLocally(eventType, event) {
    const handlers = _handlers[eventType] || [];
    const wildcardHandlers = _handlers['*'] || [];

    [...handlers, ...wildcardHandlers].forEach(fn => {
        try {
            fn(event);
        } catch (err) {
            console.error('[EventBus] Handler error for', eventType, err);
        }
    });
}

// ─────────────────────────────────────────
// AUTOMATION ENGINE — вбудована логіка
// ─────────────────────────────────────────
// Виконується в браузері для MVP.
// В майбутньому переїде в Cloud Functions.
// ─────────────────────────────────────────

const _defaultAutomationRules = [
    // БОТ → CRM: лід завершив воронку → створити клієнта + угоду
    {
        id: 'bot_flow_to_crm',
        triggerEvent: TALKO_EVENTS.BOT_FLOW_COMPLETED,
        condition: null, // завжди
        action: _actionCreateClientAndDeal,
        description: 'Лід з боту → CRM клієнт + угода "Новий лід"',
    },

    // DEAL: угода перейшла в "Пропозиція" → задача "Підготувати КП"
    {
        id: 'deal_proposal_task',
        triggerEvent: TALKO_EVENTS.DEAL_STAGE_CHANGED,
        condition: (e) => e.payload.toStage === 'Пропозиція',
        action: _actionCreateTask,
        actionParams: (e) => ({
            title: `Підготувати КП для ${e.payload.clientName || e.payload.dealTitle}`,
            deadlineOffset: '+2d',
            dealId: e.payload.dealId,
            clientId: e.payload.clientId,
            assigneeId: e.payload.assignedToId,
        }),
        description: 'Угода → Пропозиція → задача КП +2 дні',
    },

    // DEAL: угода перейшла в "Закриття" → задача "Фінальний дзвінок"
    {
        id: 'deal_closing_task',
        triggerEvent: TALKO_EVENTS.DEAL_STAGE_CHANGED,
        condition: (e) => e.payload.toStage === 'Закриття',
        action: _actionCreateTask,
        actionParams: (e) => ({
            title: `Фінальний дзвінок: ${e.payload.clientName || e.payload.dealTitle}`,
            deadlineOffset: '+1d',
            dealId: e.payload.dealId,
            clientId: e.payload.clientId,
            assigneeId: e.payload.assignedToId,
        }),
        description: 'Угода → Закриття → задача дзвінок +1 день',
    },

    // DEAL WON → задача "Виставити рахунок"
    {
        id: 'deal_won_invoice_task',
        triggerEvent: TALKO_EVENTS.DEAL_WON,
        condition: null,
        action: _actionCreateTask,
        actionParams: (e) => ({
            title: `Виставити рахунок: ${e.payload.clientName || e.payload.dealTitle}`,
            deadlineOffset: '+0d',
            dealId: e.payload.dealId,
            clientId: e.payload.clientId,
            assigneeId: e.payload.assignedToId,
            priority: 'high',
        }),
        description: 'Угода виграна → задача виставити рахунок',
    },

    // INVOICE PAID → deal.won автоматично
    {
        id: 'invoice_paid_deal_won',
        triggerEvent: TALKO_EVENTS.INVOICE_PAID,
        condition: (e) => !!e.payload.dealId,
        action: _actionMarkDealWon,
        description: 'Інвойс оплачено → угода "Виграно"',
    },

    // FORM SUBMITTED → лід у CRM
    {
        id: 'form_to_crm',
        triggerEvent: TALKO_EVENTS.FORM_SUBMITTED,
        condition: (e) => e.payload.crmIntegration === true,
        action: _actionCreateClientAndDeal,
        description: 'Форма сайту → CRM клієнт + угода',
    },

    // BUDGET EXCEEDED → задача попередження
    {
        id: 'budget_exceeded_task',
        triggerEvent: TALKO_EVENTS.BUDGET_EXCEEDED,
        condition: null,
        action: _actionCreateTask,
        actionParams: (e) => ({
            title: `⚠️ Перевищення бюджету: ${e.payload.taskTitle}`,
            deadlineOffset: '+0d',
            dealId: e.payload.dealId,
            assigneeId: e.payload.managerId,
            priority: 'high',
        }),
        description: 'Бюджет перевищено → задача-попередження менеджеру',
    },
];

async function _runAutomationRules(event) {
    // Завантажуємо кастомні правила компанії + default
    const customRules = await _loadCustomRules();
    const allRules = [..._defaultAutomationRules, ...customRules];

    for (const rule of allRules) {
        if (rule.triggerEvent !== event.type) continue;
        if (rule.condition && !rule.condition(event)) continue;

        try {
            const params = rule.actionParams ? rule.actionParams(event) : {};
            await rule.action(event, params);
            console.log(`[Automation] Rule fired: ${rule.id}`);
        } catch (err) {
            console.error(`[Automation] Rule failed: ${rule.id}`, err);
        }
    }
}

// ─────────────────────────────────────────
// ACTIONS — конкретні дії автоматизації
// ─────────────────────────────────────────

// Дія: створити клієнта + угоду в CRM
async function _actionCreateClientAndDeal(event, params = {}) {
    const p = event.payload;
    const companyId = window.currentCompanyId;
    const batch = db.batch();
    const now = firebase.firestore.FieldValue.serverTimestamp();

    // 1. Перевіряємо чи клієнт вже є (по senderId або phone)
    let clientId = null;
    if (p.senderId || p.phone) {
        const existing = await _findExistingClient(companyId, p.senderId, p.phone);
        if (existing) {
            clientId = existing.id;
            // Оновлюємо дані клієнта якщо прийшли нові
            batch.update(
                db.doc(`companies/${companyId}/crm_clients/${clientId}`),
                { updatedAt: now, ...( p.phone ? { phone: p.phone } : {} ) }
            );
        }
    }

    // 2. Якщо клієнта немає — створюємо
    if (!clientId) {
        const clientRef = db.collection(`companies/${companyId}/crm_clients`).doc();
        clientId = clientRef.id;
        batch.set(clientRef, {
            id: clientId,
            name: p.senderName || p.name || 'Невідомий',
            type: 'person',
            phone: p.phone || '',
            telegram: p.username ? `@${p.username}` : '',
            niche: p.business_type || '',
            source: event.type === TALKO_EVENTS.FORM_SUBMITTED ? 'site_form' : 'bot',
            // Дані з воронки
            role: p.role || '',
            mainProblem: p.main_problem || '',
            mainGoal: p.main_goal || '',
            searchTime: p.search_time || '',
            aiSummary: p.ai_response || '',
            // Зв'язок з контактом боту
            botContactId: p.contactId || null,
            senderId: p.senderId || null,
            deals: [],
            tags: p.tags || [],
            createdAt: now,
            updatedAt: now,
        });
    }

    // 3. Завантажуємо дефолтну воронку
    const pipeline = await _getDefaultPipeline(companyId);
    // stage зберігаємо як ID (не label) — CRM v2.0 очікує id ('new', 'contact', etc.)
    const firstStageId    = pipeline?.stages?.[0]?.id    || 'new';
    const firstStageColor = pipeline?.stages?.[0]?.color || '#6b7280';

    // 4. Створюємо угоду
    const dealRef = db.collection(`companies/${companyId}/crm_deals`).doc();
    const dealId = dealRef.id;

    batch.set(dealRef, {
        id: dealId,
        title: p.dealTitle || `Лід: ${p.senderName || p.name || 'Невідомий'}`,
        clientId,
        clientName: p.senderName || p.name || '',
        clientNiche: p.business_type || '',
        stage: firstStageId,
        stageColor: firstStageColor,
        status: 'open',
        result: null,
        amount: 0,
        currency: 'UAH',
        probability: pipeline?.stages?.[0]?.probability || 10,
        assignedToId: p.assignedToId || currentUser?.uid || null,
        assignedToName: p.assignedToName || '',
        source: event.type === TALKO_EVENTS.FORM_SUBMITTED ? 'site_form' : 'bot',
        sourceId: p.contactId || p.submissionId || null,
        botContactId: p.contactId || null,
        // Дані з воронки для контексту менеджера
        leadData: {
            role: p.role || '',
            mainProblem: p.main_problem || '',
            mainGoal: p.main_goal || '',
            searchTime: p.search_time || '',
            aiSummary: p.ai_response || '',
        },
        taskIds: [],
        tags: p.tags || [],
        notes: [],
        expectedClose: null,
        closedAt: null,
        paidAt: null,
        invoiceId: null,
        pipelineId: pipeline?.id || 'default',
        createdAt: now,
        updatedAt: now,
    });

    // 5. Перший запис в history угоди
    const histRef = db.doc(`companies/${companyId}/crm_deals/${dealId}/history/created`);
    batch.set(histRef, {
        type: 'created',
        stage: firstStageId,
        note: event.type === TALKO_EVENTS.FORM_SUBMITTED
            ? 'Угода створена автоматично із форми сайту'
            : 'Угода створена автоматично із Telegram воронки',
        by: 'system',
        byName: 'TALKO System',
        at: now,
    });

    // 6. Оновлюємо агрегат crm_stats
    const statsRef = db.doc(`companies/${companyId}/crm_stats/main`);
    batch.set(statsRef, {
        totalDeals: firebase.firestore.FieldValue.increment(1),
        updatedAt: now,
    }, { merge: true });

    await batch.commit();

    // 7. Emit нових подій (ланцюгова реакція)
    await emitTalkoEvent(TALKO_EVENTS.CLIENT_CREATED, { clientId, companyId }, { triggeredBy: 'system' });
    await emitTalkoEvent(TALKO_EVENTS.DEAL_CREATED, {
        dealId,
        clientId,
        clientName: p.senderName || p.name || '',
        dealTitle: `Лід: ${p.senderName || p.name || ''}`,
        stage: firstStageId,
        assignedToId: p.assignedToId || currentUser?.uid,
        assignedToName: p.assignedToName || '',
    }, { triggeredBy: 'system' });

    // 8. Нотифікація менеджеру
    _notifyManager(companyId, {
        title: '🎯 Новий лід',
        body: `${p.senderName || 'Невідомий'} — ${p.business_type || 'без ніші'}`,
        dealId,
        clientId,
    });

    return { clientId, dealId };
}

// Дія: створити задачу TALKO прив'язану до угоди
async function _actionCreateTask(event, params = {}) {
    if (!params.title) return;
    const companyId = window.currentCompanyId;

    const deadline = _calcDeadline(params.deadlineOffset || '+1d');

    const taskRef = db.collection(`companies/${companyId}/tasks`).doc();
    const taskId = taskRef.id;
    const now = firebase.firestore.FieldValue.serverTimestamp();

    await taskRef.set({
        id: taskId,
        title: params.title,
        status: 'new',
        priority: params.priority || 'medium',
        assigneeId: params.assigneeId || currentUser?.uid || null,
        creatorId: currentUser?.uid || 'system',
        deadlineDate: deadline,
        // Зв'язок з CRM
        dealId: params.dealId || null,
        clientId: params.clientId || null,
        // Автоматично створена
        autoCreated: true,
        autoRuleId: params.ruleId || null,
        createdAt: now,
        updatedAt: now,
    });

    // Оновлюємо список taskIds в угоді
    if (params.dealId) {
        await db.doc(`companies/${companyId}/crm_deals/${params.dealId}`).update({
            taskIds: firebase.firestore.FieldValue.arrayUnion(taskId),
            updatedAt: now,
        });
    }

    await emitTalkoEvent(TALKO_EVENTS.TASK_CREATED, {
        taskId,
        title: params.title,
        dealId: params.dealId,
        autoCreated: true,
    }, { triggeredBy: 'system' });

    return taskId;
}

// Дія: угода → Виграно
async function _actionMarkDealWon(event) {
    const { dealId, invoiceId, amount } = event.payload;
    if (!dealId) return;
    const companyId = window.currentCompanyId;
    const now = firebase.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();

    batch.update(db.doc(`companies/${companyId}/crm_deals/${dealId}`), {
        status: 'closed',
        result: 'won',
        closedAt: now,
        paidAt: now,
        invoiceId: invoiceId || null,
        ...(amount ? { amount } : {}),
        updatedAt: now,
    });

    // Запис в history
    batch.set(
        db.collection(`companies/${companyId}/crm_deals/${dealId}/history`).doc(),
        {
            type: 'won',
            note: invoiceId ? `Інвойс ${invoiceId} оплачено` : 'Угода позначена як виграна',
            by: event.triggeredBy || 'system',
            byName: event.triggeredBy === 'user' ? currentUser?.displayName : 'TALKO System',
            at: now,
        }
    );

    // Оновлюємо агрегат
    batch.set(db.doc(`companies/${companyId}/crm_stats/main`), {
        totalWon: firebase.firestore.FieldValue.increment(1),
        wonAmount: firebase.firestore.FieldValue.increment(amount || 0),
        updatedAt: now,
    }, { merge: true });

    await batch.commit();

    await emitTalkoEvent(TALKO_EVENTS.DEAL_WON, {
        dealId,
        amount: amount || 0,
    }, { triggeredBy: 'system' });
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

// Знаходимо існуючого клієнта по senderId або phone
async function _findExistingClient(companyId, senderId, phone) {
    const col = db.collection(`companies/${companyId}/crm_clients`);

    if (senderId) {
        const snap = await col.where('senderId', '==', senderId).limit(1).get();
        if (!snap.empty) return snap.docs[0];
    }
    if (phone) {
        const snap = await col.where('phone', '==', phone).limit(1).get();
        if (!snap.empty) return snap.docs[0];
    }
    return null;
}

// Завантажуємо дефолтну воронку компанії
async function _getDefaultPipeline(companyId) {
    // Кешуємо щоб не читати при кожній події
    if (window._talko_pipeline_cache?.[companyId]) {
        return window._talko_pipeline_cache[companyId];
    }

    const snap = await db.collection(`companies/${companyId}/crm_pipeline`)
        .limit(1).get();

    if (!snap.empty) {
        const pipeline = { id: snap.docs[0].id, ...snap.docs[0].data() };
        if (!window._talko_pipeline_cache) window._talko_pipeline_cache = {};
        window._talko_pipeline_cache[companyId] = pipeline;
        return pipeline;
    }

    // Якщо воронки ще немає — створюємо дефолтну
    return _createDefaultPipeline(companyId);
}

// Створюємо дефолтну воронку при першому запуску
async function _createDefaultPipeline(companyId) {
    const pipeline = {
        name: 'Основна воронка',
        stages: [
            { id: 'new_lead',     name: 'Новий лід',    color: '#3b82f6', probability: 10 },
            { id: 'contact',      name: 'Контакт',      color: '#8b5cf6', probability: 25 },
            { id: 'negotiation',  name: 'Переговори',   color: '#f59e0b', probability: 50 },
            { id: 'proposal',     name: 'Пропозиція',   color: '#f97316', probability: 70 },
            { id: 'closing',      name: 'Закриття',     color: '#ef4444', probability: 85 },
            { id: 'won',          name: 'Виграно',      color: '#22c55e', probability: 100 },
        ],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection(`companies/${companyId}/crm_pipeline`).add(pipeline);
    return { id: ref.id, ...pipeline };
}

// Розраховуємо дедлайн задачі
function _calcDeadline(offset) {
    const now = new Date();
    const match = offset.match(/^([+-])(\d+)([dhm])$/);
    if (!match) return null;

    const [, sign, num, unit] = match;
    const ms = { d: 86400000, h: 3600000, m: 60000 }[unit] * parseInt(num);
    const result = new Date(now.getTime() + (sign === '+' ? ms : -ms));
    return result.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Нотифікація менеджеру (через Telegram якщо підключений, або UI toast)
function _notifyManager(companyId, { title, body, dealId }) {
    // UI нотифікація
    if (typeof showToast === 'function') {
        showToast(`${title}: ${body}`, 'success');
    }

    // TODO: push нотифікація через Firebase Cloud Messaging
    // TODO: Telegram нотифікація через webhook
}

// Завантаження кастомних правил з Firestore
async function _loadCustomRules() {
    if (!window.currentCompanyId) return [];

    // Кеш на 5 хвилин
    const CACHE_KEY = '_talko_rules_cache';
    const cache = window[CACHE_KEY];
    if (cache && Date.now() - cache.ts < 5 * 60 * 1000) return cache.rules;

    try {
        const snap = await db
            .collection(`companies/${window.currentCompanyId}/automation_rules`)
            .where('active', '==', true)
            .get();

        const rules = snap.docs.map(doc => {
            const d = doc.data();
            return {
                id: doc.id,
                triggerEvent: d.triggerEvent,
                condition: d.condition ? new Function('e', d.condition) : null,
                action: _getActionByType(d.actionType),
                actionParams: d.actionParams ? (e) => ({
                    ...d.actionParams,
                    ...( d.actionParams.titleTemplate
                        ? { title: _interpolate(d.actionParams.titleTemplate, e.payload) }
                        : {}
                    )
                }) : null,
                description: d.description || '',
            };
        }).filter(r => r.action); // тільки якщо action відомий

        window[CACHE_KEY] = { rules, ts: Date.now() };
        return rules;
    } catch {
        return [];
    }
}

// Маппінг типу дії → функція
function _getActionByType(type) {
    const map = {
        'create_task':             _actionCreateTask,
        'create_client_and_deal':  _actionCreateClientAndDeal,
        'mark_deal_won':           _actionMarkDealWon,
    };
    return map[type] || null;
}

// Інтерполяція рядків: "Завдання для {clientName}" → "Завдання для Іван"
function _interpolate(template, data) {
    return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || '');
}

// ─────────────────────────────────────────
// ПУБЛІЧНЕ API
// ─────────────────────────────────────────
window.TALKO_EVENTS = TALKO_EVENTS;
window.emitTalkoEvent = emitTalkoEvent;
window.onTalkoEvent = onTalkoEvent;

// Очищення кешу воронки при зміні компанії
onTalkoEvent('*', (e) => {
    if (e.type === 'company.changed') {
        window._talko_pipeline_cache = {};
        window._talko_rules_cache = null;
    }
});

// ─────────────────────────────────────────
// CLEANUP: видалення старих подій (TTL)
// Запускається раз при старті, якщо є права
// ─────────────────────────────────────────
async function _cleanupExpiredEvents() {
    if (!window.currentCompanyId) return;
    try {
        const snap = await db
            .collection(`companies/${window.currentCompanyId}/events`)
            .where('expiresAt', '<', new Date())
            .limit(50) // batch по 50 щоб не перевантажити
            .get();

        if (snap.empty) return;

        const batch = db.batch();
        snap.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`[EventBus] Cleaned ${snap.size} expired events`);
    } catch {
        // Ігноруємо помилки cleanup — не критично
    }
}

// Запускаємо cleanup через 30 сек після старту (не блокуємо UI)
setTimeout(_cleanupExpiredEvents, 30000);

// ── TALKO namespace registration ───────────────────────────
if (window.TALKO) {
    window.TALKO.events = {
        emit: typeof emitTalkoEvent !== 'undefined' ? emitTalkoEvent : window.emitTalkoEvent,
        on:   typeof onTalkoEvent   !== 'undefined' ? onTalkoEvent   : window.onTalkoEvent,
    };
}
