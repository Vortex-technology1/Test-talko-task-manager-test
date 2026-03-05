// ============================================================
// TALKO Telegram Bot — Vercel Serverless Function
// ============================================================
// v3.0: i18n (UA/RU/EN/PL), secure /connect, telegramIndex,
//       /evening digest, /focus, dedup protection
// ============================================================

const admin = require('firebase-admin');

// --- Firebase ---
if (!admin.apps.length) {
    let pk = process.env.FIREBASE_PRIVATE_KEY || '';
    if (pk && !pk.includes('-----BEGIN')) {
        try { pk = Buffer.from(pk, 'base64').toString('utf8'); } catch(e) {}
    }
    if (pk && pk.includes('\\n')) {
        pk = pk.replace(/\\n/g, '\n');
    }
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID || 'task-manager-44e84',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: pk || undefined,
        }),
    });
}
const db = admin.firestore();
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) console.error('WARNING: TELEGRAM_BOT_TOKEN not set');

// ========================
//  i18n — TRANSLATIONS
// ========================
const i18n = {
    ua: {
        // General
        connected: '✅ Підключено! 👤 {name}\n\nТепер отримуєте сповіщення. /help — як ставити завдання',
        codeNotFound: '❌ Код не знайдено.\nТАЛКО → Профіль → Telegram',
        welcome: '👋 <b>TALKO Task Manager</b>\n\n<b>Підключення (2 способи):</b>\n\n1️⃣ Через TALKO:\nПрофіль → Telegram → "Підключити"\n\n2️⃣ Тут: <code>/connect ваш@email.com</code>\n\nПісля підключення:\n• Отримуєте push-сповіщення\n• Ставите завдання з чату\n• Моніторите команду\n\n/help — деталі',
        notConnected: '❌ Підключіть: TALKO → Профіль → Telegram\nАбо: /connect email',
        notConnectedFull: '❌ Спочатку підключіть:\n1. TALKO → Профіль → Telegram\n2. Або: <code>/connect email</code>',
        unknownCmd: '❓ /help — список команд',
        cantUnderstand: '❓ Не зрозумів. /help — приклади',
        error: '❌ Помилка',
        unknownAction: '❌ Невідома дія',

        // Connect
        connectUsage: '❌ <code>/connect ваш@email.com</code>',
        emailNotFound: '❌ <b>{email}</b> не знайдено в TALKO.',
        alreadyConnected: '⚠️ Цей email вже підключений до іншого Telegram акаунту.\n\nЩоб переключити, відключіть старий в TALKO → Профіль → Telegram → "Відключити", потім підключіть заново.',
        verifyPrompt: '🔐 <b>Верифікація</b>\n\nДля безпеки, підтвердіть підключення:\n\n1️⃣ Відкрийте TALKO → Профіль → Telegram → "Підключити"\n2️⃣ Або введіть тут: <code>/verify {code}</code>\n\n⏰ Код дійсний 10 хвилин',
        verifyUsage: '❌ <code>/verify XXXX</code>',
        verifyExpired: '❌ Код протермінований. Спробуйте /connect знову.',
        verifyWrong: '❌ Код невірний або протермінований.',

        // Tasks
        taskCreated: '✅ <b>Створено</b>',
        taskDone: '✅ <b>Виконано!</b>',
        taskAlreadyDone: '⚡ Вже виконано',
        taskPostponed: '🔄 <b>Перенесено на {date}</b>',
        taskInProgress: '🚀 <b>В роботі</b>',
        taskAlreadyProgress: '⚡ Вже в роботі',
        taskNotFound: '❌ Завдання не знайдено',
        taskClosedCb: '✅ Завдання закрито!',
        taskProgressCb: '🚀 Взято в роботу!',
        postponedCb: '📅 Перенесено на {date}',

        // Status labels
        statusNew: '🆕 Нова',
        statusProgress: '🚀 В роботі',
        statusDone: '✅ Виконано',
        statusReview: '🔍 Перевірка',
        prioHigh: '🔴 Високий',
        prioMed: '🟡 Середній',
        prioLow: '🟢 Низький',
        noDeadline: 'Без дедлайну',

        // Today / Overdue
        todayClean: '✅ На сьогодні чисто!',
        noOverdue: '✅ Прострочених немає!',
        moreOverdue: '... ще {n} прострочених',

        // Team
        teamTitle: '👥 <b>Команда:</b>\n\n',
        tasks: 'завд.',
        overdueSuffix: 'простр.',

        // Weekly
        weeklyTitle: '📈 <b>Тижневий звіт</b>',
        created: 'Створено',
        completed: 'Виконано',
        overdue: 'Прострочено',
        efficiency: 'Ефективність',
        byPeople: '🏆 <b>По людях:</b>',

        // Evening
        eveningTitle: '🌆 <b>Вечірній звіт</b>',
        planVsFact: 'План vs Факт',
        doneToday: '✅ Виконано ({n}):',
        notDone: '❌ Не виконано ({n}):',
        overdueList: '⚠️ Прострочено ({n}):',
        tomorrowList: '📅 Завтра ({n}):',
        tomorrowFree: '📅 <b>Завтра:</b> вільно ✨',
        more: '... ще {n}',
        inProgressList: '🚀 В роботі ({n}):',

        // Notifications
        newTaskNotify: '📥 <b>Нове завдання</b>\n\n{title}\n\nВід: {creator}',
        taskCompletedNotify: '✅ <b>Виконано</b>\n\n{title}\n\nВиконав: {assignee}',
        taskReviewNotify: '🔍 <b>На перевірку</b>\n\n{title}\n\nВід: {assignee}',
        taskRejectedNotify: '↩️ <b>Повернуто</b>\n\n{title}',
        processStepNotify: '⚡ <b>Ваш крок в процесі</b>\n\n{process}\nКрок: {step}',
        overdueNotify: '⏰ <b>Прострочено!</b>\n\n{title}',

        // Queries
        allDoneWeek: '✅ Всі виконали хоча б 1 завдання за тиждень!',
        nothingDoneTitle: '⚠️ <b>Не виконали нічого за тиждень:</b>\n\n',
        personNotFound: '❌ Не знайшов "{name}" в завданнях',
        personDoneWeek: 'Виконано за тиждень',
        personActive: 'Активних',
        personOverdue: 'Прострочені:',
        nothingUrgent: '✅ Нічого термінового!',
        urgentTitle: '🔥 <b>Горить ({n}):</b>\n\n',
        dashboardTitle: '📊 <b>Стан справ:</b>\n\n',
        dashActive: 'Активних',
        dashToday: 'На сьогодні',
        dashOverdue: 'Прострочено',
        dashDoneTotal: 'Виконано всього',

        // Help
        help: '📖 <b>Команди:</b>\n\n' +
            '<b>📋 Завдання:</b>\n/today — мої на сьогодні\n/overdue — прострочені\n/evening — вечірній звіт\n/ai-digest — AI-підсумок дня 🤖\n\n' +
            '<b>👥 Команда:</b>\n/team — стан команди\n/weekly — тижневий звіт\n\n' +
            '<b>✏️ Створити завдання:</b>\n<code>Текст @Виконавець до ДД.ММ</code>\n\n' +
            '<b>Приклади:</b>\n• <code>Звіт @Олена до 25.03</code>\n• <code>Матеріали @Сергій завтра !!!</code>\n• <code>Перевірка сьогодні о 14:00</code>\n\n' +
            '!!! високий, ! низький\n\n' +
            '<b>💬 Запити:</b>\n• "що горить"\n• "скільки виконав Олена"\n• "хто нічого не зробив"\n• "стан справ"',
    },

    ru: {
        connected: '✅ Подключено! 👤 {name}\n\nТеперь вы получаете уведомления. /help — как ставить задачи',
        codeNotFound: '❌ Код не найден.\nТАЛКО → Профиль → Telegram',
        welcome: '👋 <b>TALKO Task Manager</b>\n\n<b>Подключение (2 способа):</b>\n\n1️⃣ Через TALKO:\nПрофиль → Telegram → "Подключить"\n\n2️⃣ Тут: <code>/connect ваш@email.com</code>\n\nПосле подключения:\n• Получаете push-уведомления\n• Ставите задачи из чата\n• Мониторите команду\n\n/help — подробности',
        notConnected: '❌ Подключите: TALKO → Профиль → Telegram\nИли: /connect email',
        notConnectedFull: '❌ Сначала подключите:\n1. TALKO → Профиль → Telegram\n2. Или: <code>/connect email</code>',
        unknownCmd: '❓ /help — список команд',
        cantUnderstand: '❓ Не понял. /help — примеры',
        error: '❌ Ошибка',
        unknownAction: '❌ Неизвестное действие',

        connectUsage: '❌ <code>/connect ваш@email.com</code>',
        emailNotFound: '❌ <b>{email}</b> не найден в TALKO.',
        alreadyConnected: '⚠️ Этот email уже подключён к другому Telegram аккаунту.\n\nЧтобы переключить, отключите старый в TALKO → Профиль → Telegram → "Отключить", затем подключите заново.',
        verifyPrompt: '🔐 <b>Верификация</b>\n\nДля безопасности, подтвердите подключение:\n\n1️⃣ Откройте TALKO → Профиль → Telegram → "Подключить"\n2️⃣ Или введите тут: <code>/verify {code}</code>\n\n⏰ Код действителен 10 минут',
        verifyUsage: '❌ <code>/verify XXXX</code>',
        verifyExpired: '❌ Код просрочен. Попробуйте /connect снова.',
        verifyWrong: '❌ Код неверный или просрочен.',

        taskCreated: '✅ <b>Создано</b>',
        taskDone: '✅ <b>Выполнено!</b>',
        taskAlreadyDone: '⚡ Уже выполнено',
        taskPostponed: '🔄 <b>Перенесено на {date}</b>',
        taskInProgress: '🚀 <b>В работе</b>',
        taskAlreadyProgress: '⚡ Уже в работе',
        taskNotFound: '❌ Задача не найдена',
        taskClosedCb: '✅ Задача закрыта!',
        taskProgressCb: '🚀 Взято в работу!',
        postponedCb: '📅 Перенесено на {date}',

        statusNew: '🆕 Новая',
        statusProgress: '🚀 В работе',
        statusDone: '✅ Выполнено',
        statusReview: '🔍 Проверка',
        prioHigh: '🔴 Высокий',
        prioMed: '🟡 Средний',
        prioLow: '🟢 Низкий',
        noDeadline: 'Без дедлайна',

        todayClean: '✅ На сегодня чисто!',
        noOverdue: '✅ Просроченных нет!',
        moreOverdue: '... ещё {n} просроченных',

        teamTitle: '👥 <b>Команда:</b>\n\n',
        tasks: 'задач',
        overdueSuffix: 'проср.',

        weeklyTitle: '📈 <b>Недельный отчёт</b>',
        created: 'Создано',
        completed: 'Выполнено',
        overdue: 'Просрочено',
        efficiency: 'Эффективность',
        byPeople: '🏆 <b>По людям:</b>',

        eveningTitle: '🌆 <b>Вечерний отчёт</b>',
        planVsFact: 'План vs Факт',
        doneToday: '✅ Выполнено ({n}):',
        notDone: '❌ Не выполнено ({n}):',
        overdueList: '⚠️ Просрочено ({n}):',
        tomorrowList: '📅 Завтра ({n}):',
        tomorrowFree: '📅 <b>Завтра:</b> свободно ✨',
        more: '... ещё {n}',
        inProgressList: '🚀 В работе ({n}):',

        newTaskNotify: '📥 <b>Новая задача</b>\n\n{title}\n\nОт: {creator}',
        taskCompletedNotify: '✅ <b>Выполнено</b>\n\n{title}\n\nВыполнил: {assignee}',
        taskReviewNotify: '🔍 <b>На проверку</b>\n\n{title}\n\nОт: {assignee}',
        taskRejectedNotify: '↩️ <b>Возвращено</b>\n\n{title}',
        processStepNotify: '⚡ <b>Ваш шаг в процессе</b>\n\n{process}\nШаг: {step}',
        overdueNotify: '⏰ <b>Просрочено!</b>\n\n{title}',

        allDoneWeek: '✅ Все выполнили хотя бы 1 задачу за неделю!',
        nothingDoneTitle: '⚠️ <b>Не выполнили ничего за неделю:</b>\n\n',
        personNotFound: '❌ Не нашёл "{name}" в задачах',
        personDoneWeek: 'Выполнено за неделю',
        personActive: 'Активных',
        personOverdue: 'Просроченные:',
        nothingUrgent: '✅ Ничего срочного!',
        urgentTitle: '🔥 <b>Горит ({n}):</b>\n\n',
        dashboardTitle: '📊 <b>Состояние дел:</b>\n\n',
        dashActive: 'Активных',
        dashToday: 'На сегодня',
        dashOverdue: 'Просрочено',
        dashDoneTotal: 'Выполнено всего',

        help: '📖 <b>Команды:</b>\n\n' +
            '<b>📋 Задачи:</b>\n/today — мои на сегодня\n/overdue — просроченные\n/evening — вечерний отчёт\n/ai-digest — AI-итог дня 🤖\n\n' +
            '<b>👥 Команда:</b>\n/team — состояние команды\n/weekly — недельный отчёт\n\n' +
            '<b>✏️ Создать задачу:</b>\n<code>Текст @Исполнитель до ДД.ММ</code>\n\n' +
            '<b>Примеры:</b>\n• <code>Отчёт @Елена до 25.03</code>\n• <code>Материалы @Сергей завтра !!!</code>\n• <code>Проверка сегодня в 14:00</code>\n\n' +
            '!!! высокий, ! низкий\n\n' +
            '<b>💬 Запросы:</b>\n• "что горит"\n• "сколько выполнил Елена"\n• "кто ничего не сделал"\n• "состояние дел"',
    },

    en: {
        connected: '✅ Connected! 👤 {name}\n\nYou will now receive notifications. /help — how to create tasks',
        codeNotFound: '❌ Code not found.\nTALKO → Profile → Telegram',
        welcome: '👋 <b>TALKO Task Manager</b>\n\n<b>Connect (2 ways):</b>\n\n1️⃣ Via TALKO:\nProfile → Telegram → "Connect"\n\n2️⃣ Here: <code>/connect your@email.com</code>\n\nAfter connecting:\n• Get push notifications\n• Create tasks from chat\n• Monitor your team\n\n/help — details',
        notConnected: '❌ Connect first: TALKO → Profile → Telegram\nOr: /connect email',
        notConnectedFull: '❌ Connect first:\n1. TALKO → Profile → Telegram\n2. Or: <code>/connect email</code>',
        unknownCmd: '❓ /help — list of commands',
        cantUnderstand: '❓ Didn\'t understand. /help — examples',
        error: '❌ Error',
        unknownAction: '❌ Unknown action',

        connectUsage: '❌ <code>/connect your@email.com</code>',
        emailNotFound: '❌ <b>{email}</b> not found in TALKO.',
        alreadyConnected: '⚠️ This email is already connected to another Telegram account.\n\nTo switch, disconnect the old one in TALKO → Profile → Telegram → "Disconnect", then reconnect.',
        verifyPrompt: '🔐 <b>Verification</b>\n\nFor security, confirm the connection:\n\n1️⃣ Open TALKO → Profile → Telegram → "Connect"\n2️⃣ Or enter here: <code>/verify {code}</code>\n\n⏰ Code valid for 10 minutes',
        verifyUsage: '❌ <code>/verify XXXX</code>',
        verifyExpired: '❌ Code expired. Try /connect again.',
        verifyWrong: '❌ Wrong or expired code.',

        taskCreated: '✅ <b>Created</b>',
        taskDone: '✅ <b>Done!</b>',
        taskAlreadyDone: '⚡ Already done',
        taskPostponed: '🔄 <b>Postponed to {date}</b>',
        taskInProgress: '🚀 <b>In progress</b>',
        taskAlreadyProgress: '⚡ Already in progress',
        taskNotFound: '❌ Task not found',
        taskClosedCb: '✅ Task closed!',
        taskProgressCb: '🚀 Taken to work!',
        postponedCb: '📅 Postponed to {date}',

        statusNew: '🆕 New',
        statusProgress: '🚀 In progress',
        statusDone: '✅ Done',
        statusReview: '🔍 Review',
        prioHigh: '🔴 High',
        prioMed: '🟡 Medium',
        prioLow: '🟢 Low',
        noDeadline: 'No deadline',

        todayClean: '✅ Nothing for today!',
        noOverdue: '✅ No overdue tasks!',
        moreOverdue: '... {n} more overdue',

        teamTitle: '👥 <b>Team:</b>\n\n',
        tasks: 'tasks',
        overdueSuffix: 'overdue',

        weeklyTitle: '📈 <b>Weekly report</b>',
        created: 'Created',
        completed: 'Completed',
        overdue: 'Overdue',
        efficiency: 'Efficiency',
        byPeople: '🏆 <b>By person:</b>',

        eveningTitle: '🌆 <b>Evening report</b>',
        planVsFact: 'Plan vs Fact',
        doneToday: '✅ Done ({n}):',
        notDone: '❌ Not done ({n}):',
        overdueList: '⚠️ Overdue ({n}):',
        tomorrowList: '📅 Tomorrow ({n}):',
        tomorrowFree: '📅 <b>Tomorrow:</b> free ✨',
        more: '... {n} more',
        inProgressList: '🚀 In progress ({n}):',

        newTaskNotify: '📥 <b>New task</b>\n\n{title}\n\nFrom: {creator}',
        taskCompletedNotify: '✅ <b>Completed</b>\n\n{title}\n\nBy: {assignee}',
        taskReviewNotify: '🔍 <b>For review</b>\n\n{title}\n\nFrom: {assignee}',
        taskRejectedNotify: '↩️ <b>Returned</b>\n\n{title}',
        processStepNotify: '⚡ <b>Your step in process</b>\n\n{process}\nStep: {step}',
        overdueNotify: '⏰ <b>Overdue!</b>\n\n{title}',

        allDoneWeek: '✅ Everyone completed at least 1 task this week!',
        nothingDoneTitle: '⚠️ <b>Did nothing this week:</b>\n\n',
        personNotFound: '❌ "{name}" not found in tasks',
        personDoneWeek: 'Done this week',
        personActive: 'Active',
        personOverdue: 'Overdue:',
        nothingUrgent: '✅ Nothing urgent!',
        urgentTitle: '🔥 <b>Urgent ({n}):</b>\n\n',
        dashboardTitle: '📊 <b>Dashboard:</b>\n\n',
        dashActive: 'Active',
        dashToday: 'Today',
        dashOverdue: 'Overdue',
        dashDoneTotal: 'Done total',

        help: '📖 <b>Commands:</b>\n\n' +
            '<b>📋 Tasks:</b>\n/today — my tasks for today\n/overdue — overdue\n/evening — evening report (Plan vs Fact)\n\n' +
            '<b>👥 Team:</b>\n/team — team status\n/weekly — weekly report\n\n' +
            '<b>✏️ Create task:</b>\n<code>Text @Assignee due DD.MM</code>\n\n' +
            '<b>Examples:</b>\n• <code>Report @Elena due 25.03</code>\n• <code>Materials @Sergiy tomorrow !!!</code>\n\n' +
            '!!! high, ! low priority',
    },

    pl: {
        connected: '✅ Połączono! 👤 {name}\n\nTeraz otrzymujesz powiadomienia. /help — jak tworzyć zadania',
        codeNotFound: '❌ Kod nie znaleziony.\nTALKO → Profil → Telegram',
        welcome: '👋 <b>TALKO Task Manager</b>\n\n<b>Połączenie (2 sposoby):</b>\n\n1️⃣ Przez TALKO:\nProfil → Telegram → "Połącz"\n\n2️⃣ Tutaj: <code>/connect twoj@email.com</code>\n\nPo połączeniu:\n• Otrzymujesz powiadomienia push\n• Tworzysz zadania z czatu\n• Monitorujesz zespół\n\n/help — szczegóły',
        notConnected: '❌ Połącz: TALKO → Profil → Telegram\nLub: /connect email',
        notConnectedFull: '❌ Najpierw połącz:\n1. TALKO → Profil → Telegram\n2. Lub: <code>/connect email</code>',
        unknownCmd: '❓ /help — lista komend',
        cantUnderstand: '❓ Nie zrozumiałem. /help — przykłady',
        error: '❌ Błąd',
        unknownAction: '❌ Nieznane działanie',

        connectUsage: '❌ <code>/connect twoj@email.com</code>',
        emailNotFound: '❌ <b>{email}</b> nie znaleziony w TALKO.',
        alreadyConnected: '⚠️ Ten email jest już połączony z innym kontem Telegram.\n\nAby zmienić, odłącz stary w TALKO → Profil → Telegram → "Odłącz", potem połącz ponownie.',
        verifyPrompt: '🔐 <b>Weryfikacja</b>\n\nDla bezpieczeństwa potwierdź połączenie:\n\n1️⃣ Otwórz TALKO → Profil → Telegram → "Połącz"\n2️⃣ Lub wpisz tutaj: <code>/verify {code}</code>\n\n⏰ Kod ważny 10 minut',
        verifyUsage: '❌ <code>/verify XXXX</code>',
        verifyExpired: '❌ Kod wygasł. Spróbuj /connect ponownie.',
        verifyWrong: '❌ Nieprawidłowy lub wygasły kod.',

        taskCreated: '✅ <b>Utworzono</b>',
        taskDone: '✅ <b>Wykonano!</b>',
        taskAlreadyDone: '⚡ Już wykonano',
        taskPostponed: '🔄 <b>Przeniesiono na {date}</b>',
        taskInProgress: '🚀 <b>W toku</b>',
        taskAlreadyProgress: '⚡ Już w toku',
        taskNotFound: '❌ Zadanie nie znalezione',
        taskClosedCb: '✅ Zadanie zamknięte!',
        taskProgressCb: '🚀 Wzięto do pracy!',
        postponedCb: '📅 Przeniesiono na {date}',

        statusNew: '🆕 Nowe',
        statusProgress: '🚀 W toku',
        statusDone: '✅ Wykonane',
        statusReview: '🔍 Przegląd',
        prioHigh: '🔴 Wysoki',
        prioMed: '🟡 Średni',
        prioLow: '🟢 Niski',
        noDeadline: 'Bez terminu',

        todayClean: '✅ Na dziś czysto!',
        noOverdue: '✅ Brak zaległych!',
        moreOverdue: '... jeszcze {n} zaległych',

        teamTitle: '👥 <b>Zespół:</b>\n\n',
        tasks: 'zadań',
        overdueSuffix: 'zaległ.',

        weeklyTitle: '📈 <b>Raport tygodniowy</b>',
        created: 'Utworzono',
        completed: 'Wykonano',
        overdue: 'Zaległe',
        efficiency: 'Wydajność',
        byPeople: '🏆 <b>Po osobach:</b>',

        eveningTitle: '🌆 <b>Raport wieczorny</b>',
        planVsFact: 'Plan vs Fakt',
        doneToday: '✅ Wykonano ({n}):',
        notDone: '❌ Nie wykonano ({n}):',
        overdueList: '⚠️ Zaległe ({n}):',
        tomorrowList: '📅 Jutro ({n}):',
        tomorrowFree: '📅 <b>Jutro:</b> wolne ✨',
        more: '... jeszcze {n}',
        inProgressList: '🚀 W toku ({n}):',

        newTaskNotify: '📥 <b>Nowe zadanie</b>\n\n{title}\n\nOd: {creator}',
        taskCompletedNotify: '✅ <b>Wykonano</b>\n\n{title}\n\nWykonał: {assignee}',
        taskReviewNotify: '🔍 <b>Do przeglądu</b>\n\n{title}\n\nOd: {assignee}',
        taskRejectedNotify: '↩️ <b>Zwrócono</b>\n\n{title}',
        processStepNotify: '⚡ <b>Twój krok w procesie</b>\n\n{process}\nKrok: {step}',
        overdueNotify: '⏰ <b>Zaległe!</b>\n\n{title}',

        allDoneWeek: '✅ Wszyscy wykonali co najmniej 1 zadanie w tym tygodniu!',
        nothingDoneTitle: '⚠️ <b>Nic nie zrobili w tym tygodniu:</b>\n\n',
        personNotFound: '❌ Nie znalazłem "{name}" w zadaniach',
        personDoneWeek: 'Wykonano w tym tygodniu',
        personActive: 'Aktywnych',
        personOverdue: 'Zaległe:',
        nothingUrgent: '✅ Nic pilnego!',
        urgentTitle: '🔥 <b>Pilne ({n}):</b>\n\n',
        dashboardTitle: '📊 <b>Stan rzeczy:</b>\n\n',
        dashActive: 'Aktywnych',
        dashToday: 'Na dziś',
        dashOverdue: 'Zaległych',
        dashDoneTotal: 'Wykonano łącznie',

        help: '📖 <b>Komendy:</b>\n\n' +
            '<b>📋 Zadania:</b>\n/today — moje na dziś\n/overdue — zaległe\n/evening — raport wieczorny (Plan vs Fakt)\n\n' +
            '<b>👥 Zespół:</b>\n/team — stan zespołu\n/weekly — raport tygodniowy\n\n' +
            '<b>✏️ Utwórz zadanie:</b>\n<code>Tekst @Wykonawca do DD.MM</code>\n\n' +
            '!!! wysoki, ! niski priorytet',
    },
};

// Fallback: ua
function t(key, lang, vars = {}) {
    const l = i18n[lang] || i18n.ua;
    let text = l[key] || i18n.ua[key] || key;
    for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
}

// Detect language: user profile → Telegram language_code → default ua
function detectLang(userData, tgLangCode) {
    // 1. TALKO profile language (set in web interface)
    if (userData?.language) {
        const map = { 'ua': 'ua', 'uk': 'ua', 'ru': 'ru', 'en': 'en', 'pl': 'pl' };
        return map[userData.language] || 'ua';
    }
    // 2. Telegram language_code
    if (tgLangCode) {
        if (tgLangCode.startsWith('uk')) return 'ua';
        if (tgLangCode.startsWith('ru')) return 'ru';
        if (tgLangCode.startsWith('en')) return 'en';
        if (tgLangCode.startsWith('pl')) return 'pl';
    }
    return 'ua';
}

// ========================
//  TELEGRAM API
// ========================
async function tg(method, body) {
    return fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(r => r.json());
}
const send = (chatId, text, opts = {}) =>
    tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...opts });

const sendButtons = (chatId, text, buttons) =>
    send(chatId, text, { reply_markup: { inline_keyboard: buttons } });

const editMsg = (chatId, msgId, text, opts = {}) =>
    tg('editMessageText', { chat_id: chatId, message_id: msgId, text, parse_mode: 'HTML', ...opts });

const answerCallback = (cbId, text) =>
    tg('answerCallbackQuery', { callback_query_id: cbId, text });

// ========================
//  USER LOOKUP — OPTIMIZED
// ========================
async function findByChatId(chatId) {
    const chatIdStr = String(chatId);
    const indexDoc = await db.collection('telegramIndex').doc(chatIdStr).get();
    if (indexDoc.exists) {
        const { companyId, userId } = indexDoc.data();
        const userDoc = await db.collection('companies').doc(companyId)
            .collection('users').doc(userId).get();
        if (userDoc.exists && userDoc.data().telegramChatId === chatIdStr) {
            return { uid: userId, cid: companyId, data: userDoc.data(), ref: userDoc.ref };
        }
        await db.collection('telegramIndex').doc(chatIdStr).delete().catch(() => {});
    }
    const companies = await db.collection('companies').get();
    for (const c of companies.docs) {
        const snap = await c.ref.collection('users')
            .where('telegramChatId', '==', chatIdStr).limit(1).get();
        if (!snap.empty) {
            const d = snap.docs[0];
            await db.collection('telegramIndex').doc(chatIdStr).set({
                companyId: c.id, userId: d.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }).catch(() => {});
            return { uid: d.id, cid: c.id, data: d.data(), ref: d.ref };
        }
    }
    return null;
}

async function findByCode(code) {
    // БАГ 7 FIX: спочатку шукаємо в глобальному індексі telegramCodeIndex
    const indexDoc = await db.collection('telegramCodeIndex').doc(code).get().catch(() => null);
    if (indexDoc && indexDoc.exists) {
        const { companyId, userId } = indexDoc.data();
        const userDoc = await db.collection('companies').doc(companyId)
            .collection('users').doc(userId).get().catch(() => null);
        if (userDoc && userDoc.exists) {
            return { uid: userId, cid: companyId, data: userDoc.data(), ref: userDoc.ref };
        }
    }
    // Fallback: full scan (для старих записів без індексу)
    const companies = await db.collection('companies').get();
    for (const c of companies.docs) {
        const snap = await c.ref.collection('users')
            .where('telegramCode', '==', code).limit(1).get();
        if (!snap.empty) {
            const d = snap.docs[0];
            // Записуємо в індекс для наступного разу
            await db.collection('telegramCodeIndex').doc(code).set({
                companyId: c.id, userId: d.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }).catch(() => {});
            return { uid: d.id, cid: c.id, data: d.data(), ref: d.ref };
        }
    }
    return null;
}

async function findByEmail(email) {
    const emailLow = email.toLowerCase();
    // БАГ 7 FIX: спочатку шукаємо в глобальному індексі telegramEmailIndex
    const indexDoc = await db.collection('telegramEmailIndex').doc(emailLow.replace(/[.]/g,'_')).get().catch(() => null);
    if (indexDoc && indexDoc.exists) {
        const { companyId, userId } = indexDoc.data();
        const userDoc = await db.collection('companies').doc(companyId)
            .collection('users').doc(userId).get().catch(() => null);
        if (userDoc && userDoc.exists) {
            return { uid: userId, cid: companyId, data: userDoc.data(), ref: userDoc.ref };
        }
    }
    // Fallback: full scan
    const companies = await db.collection('companies').get();
    for (const c of companies.docs) {
        const snap = await c.ref.collection('users')
            .where('email', '==', emailLow).limit(1).get();
        if (!snap.empty) {
            const d = snap.docs[0];
            await db.collection('telegramEmailIndex').doc(emailLow.replace(/[.]/g,'_')).set({
                companyId: c.id, userId: d.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }).catch(() => {});
            return { uid: d.id, cid: c.id, data: d.data(), ref: d.ref };
        }
    }
    return null;
}

async function findAssignee(cid, q) {
    if (!q) return null;
    const low = q.toLowerCase().trim();
    const snap = await db.collection('companies').doc(cid).collection('users').get();
    let best = null;
    for (const d of snap.docs) {
        const u = d.data();
        const n = (u.name || '').toLowerCase();
        if (n === low) return { id: d.id, ...u };
        if (n.includes(low) || low.includes(n.split(' ')[0])) best = { id: d.id, ...u };
    }
    return best;
}

async function updateTelegramIndex(chatId, companyId, userId) {
    await db.collection('telegramIndex').doc(String(chatId)).set({
        companyId, userId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});
}

// ========================
//  PARSE TASK
// ========================
// ========================
//  ПАРСИНГ ДАТИ/ЧАСУ (базові утиліти)
// ========================
function extractDateTimePrio(text) {
    let msg = text.replace(/@\w+bot\b/gi, '').trim();
    let who = null, date = null, time = '18:00', prio = 'medium';
    const wm = msg.match(/@([А-Яа-яІіЇїЄєҐґA-Za-z_]+)/);
    if (wm) { who = wm[1]; msg = msg.replace(wm[0], '').trim(); }
    const dd = [
        { r: /(?:до|by)\s+(\d{1,2})\.(\d{1,2})\.(\d{4})/i, f: m => `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}` },
        { r: /(?:до|by)\s+(\d{1,2})\.(\d{1,2})/i,           f: m => { const y=new Date().getFullYear(); return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; }},
        { r: /завтра|tomorrow/i,        f: () => { const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; }},
        { r: /сьогодні|сегодня|today/i, f: () => new Date().toISOString().split('T')[0] },
        { r: /післязавтра|послезавтра/i, f: () => { const d=new Date(); d.setDate(d.getDate()+2); return d.toISOString().split('T')[0]; }},
    ];
    for (const p of dd) { const m = msg.match(p.r); if (m) { date = p.f(m); msg = msg.replace(m[0],'').trim(); break; }}
    const tm = msg.match(/[ово]\s*(\d{1,2}):(\d{2})/);
    if (tm) { time = `${tm[1].padStart(2,'0')}:${tm[2]}`; msg = msg.replace(tm[0],'').trim(); }
    if (msg.includes('!!!'))      { prio = 'high'; msg = msg.replace(/!!!+/g,'').trim(); }
    else if (msg.includes('!!'))  { prio = 'high'; msg = msg.replace(/!!+/g,'').trim(); }
    else if (msg.includes('!'))   { prio = 'low';  msg = msg.replace(/!+/g,'').trim(); }
    return { msg: msg.trim(), date, time, prio, who };
}

// ========================
//  AI-ПАРСЕР: розкладає довгий текст по блоках завдання
// ========================
async function parseTaskSmart(text) {
    const { msg, date, time, prio, who } = extractDateTimePrio(text);

    // Короткий текст — без AI
    if (msg.length < 80) {
        return { title: msg.replace(/\s+/g,' ').trim(), description:'', expectedResult:'', reportFormat:'', who, date, time, prio };
    }

    try {
        const prompt = `Розбий текст завдання на JSON поля. Відповідай ТІЛЬКИ JSON без пояснень і без markdown.

Текст: ${JSON.stringify(msg)}

Поля JSON:
- title: коротка назва (до 100 символів), перша фраза або суть
- description: детальний опис що треба зробити
- expectedResult: очікуваний результат — що буде на виході (документ, рішення, файл)
- reportFormat: як звітувати — фото, відео, посилання, повідомлення

Правила:
- title завжди заповнений
- Якщо є мітки "результат:", "очікуваний результат:", "результат завдання:" — це expectedResult
- Якщо є "форма звіту:", "звіт:", "звітувати:" — це reportFormat
- Якщо є "опис:", "деталі:", "завдання:" — це description
- Без явних міток: перший рядок = title, наступні = description
- Порожні поля = ""`;

        const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY || '',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 400,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!resp.ok) throw new Error(`API ${resp.status}`);
        const data = await resp.json();
        const raw = (data.content?.[0]?.text || '').replace(/```json|```/g,'').trim();
        const parsed = JSON.parse(raw);

        return {
            title:          (parsed.title          || msg.substring(0, 100)).trim(),
            description:    (parsed.description    || '').trim(),
            expectedResult: (parsed.expectedResult || '').trim(),
            reportFormat:   (parsed.reportFormat   || '').trim(),
            who, date, time, prio,
        };
    } catch(err) {
        console.warn('[parseTaskSmart] fallback:', err.message);
        const lines = msg.split('\n').map(l => l.trim()).filter(Boolean);
        return {
            title:          lines[0]?.substring(0, 150) || msg.substring(0, 150),
            description:    lines.slice(1).join('\n').trim(),
            expectedResult: '',
            reportFormat:   '',
            who, date, time, prio,
        };
    }
}

// Синхронний parseTask — для коротких/сумісності
function parseTask(text) {
    const { msg, date, time, prio, who } = extractDateTimePrio(text);
    return { title: msg.replace(/\s+/g,' ').trim(), description:'', expectedResult:'', reportFormat:'', who, date, time, prio };
}


// ========================
//  INLINE КНОПКИ
// ========================
function taskButtons(taskId, companyId) {
    return [
        [
            { text: '✅ Готово', callback_data: `done:${companyId}:${taskId}` },
            { text: '🔄 +1 день', callback_data: `postpone:${companyId}:${taskId}` },
        ],
        [
            { text: '📎 Деталі', callback_data: `details:${companyId}:${taskId}` },
            { text: '🚀 В роботу', callback_data: `progress:${companyId}:${taskId}` },
        ],
    ];
}

// ========================
//  CALLBACK HANDLER
// ========================
async function handleCallback(cbQuery) {
    const cbId = cbQuery.id;
    const chatId = cbQuery.message.chat.id;
    const msgId = cbQuery.message.message_id;
    const data = cbQuery.data;

    const [action, cid, taskId] = data.split(':');
    if (!action || !cid || !taskId) return answerCallback(cbId, '❌');

    // Get user for language
    const u = await findByChatId(chatId);
    const lang = u ? detectLang(u.data) : 'ua';

    const taskRef = db.collection('companies').doc(cid).collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();
    if (!taskDoc.exists) return answerCallback(cbId, t('taskNotFound', lang));
    const task = taskDoc.data();

    switch (action) {
        case 'done': {
            if (task.status === 'done') return answerCallback(cbId, t('taskAlreadyDone', lang));
            // БАГ 2 FIX: перевіряємо requireReview перед закриттям
            if (task.requireReview) {
                await taskRef.update({
                    status: 'review',
                    sentForReviewAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                await editMsg(chatId, msgId,
                    `🔍 ${t('sentForReview', lang) || 'Завдання відправлено на перевірку'}\n\n${task.title}\n👤 ${task.assigneeName || '—'}`
                );
                return answerCallback(cbId, t('sentForReview', lang) || 'Відправлено на перевірку');
            }
            await taskRef.update({
                status: 'done',
                completedAt: admin.firestore.FieldValue.serverTimestamp(),
                completedDate: new Date().toISOString().split('T')[0],
                completionSource: 'telegram',
                completedBy: task.assigneeId || '',
            });
            await editMsg(chatId, msgId,
                `${t('taskDone', lang)}\n\n<s>${task.title}</s>\n👤 ${task.assigneeName || '—'}`
            );
            if (task.notifyOnComplete?.length) {
                for (const uid of task.notifyOnComplete) {
                    if (uid === task.assigneeId) continue;
                    await notifyUser(cid, uid, 'task_completed', { taskTitle: task.title, assigneeName: task.assigneeName });
                }
            }
            return answerCallback(cbId, t('taskClosedCb', lang));
        }
        case 'postpone': {
            const oldDate = task.deadlineDate || new Date().toISOString().split('T')[0];
            const newDate = new Date(oldDate + 'T12:00:00');
            newDate.setDate(newDate.getDate() + 1);
            const newDateStr = newDate.toISOString().split('T')[0];
            await taskRef.update({
                deadlineDate: newDateStr,
                deadline: newDateStr + 'T' + (task.deadlineTime || '18:00'),
                overdueNotified: false, sentReminders: [],
            });
            const pr = task.priority==='high'?'🔴':task.priority==='low'?'🟢':'🟡';
            await editMsg(chatId, msgId,
                `${t('taskPostponed', lang, { date: newDateStr })}\n\n${pr} ${task.title}\n👤 ${task.assigneeName || '—'} 📅 ${newDateStr}`,
                { reply_markup: { inline_keyboard: taskButtons(taskId, cid) } }
            );
            return answerCallback(cbId, t('postponedCb', lang, { date: newDateStr }));
        }
        case 'progress': {
            if (task.status === 'progress') return answerCallback(cbId, t('taskAlreadyProgress', lang));
            await taskRef.update({ status: 'progress' });
            const pr = task.priority==='high'?'🔴':task.priority==='low'?'🟢':'🟡';
            const dl = task.deadlineDate ? ` 📅 ${task.deadlineDate}` : '';
            await editMsg(chatId, msgId,
                `${t('taskInProgress', lang)}\n\n${pr} ${task.title}\n👤 ${task.assigneeName || '—'}${dl}`,
                { reply_markup: { inline_keyboard: taskButtons(taskId, cid) } }
            );
            return answerCallback(cbId, t('taskProgressCb', lang));
        }
        case 'details': {
            const st = t({ new: 'statusNew', progress: 'statusProgress', done: 'statusDone', review: 'statusReview' }[task.status] || 'statusNew', lang);
            const pr = t(task.priority === 'high' ? 'prioHigh' : task.priority === 'low' ? 'prioLow' : 'prioMed', lang);
            const dl = task.deadlineDate ? `📅 ${task.deadlineDate}` : t('noDeadline', lang);
            const desc = task.description ? `\n\n📝 ${task.description.substring(0, 800)}` : '';
            const result = task.expectedResult ? `\n🎯 ${task.expectedResult}` : '';
            const func = task.function ? `\n📂 ${task.function}` : '';
            await send(chatId,
                `📎 <b>${task.title}</b>\n\n${st}\n👤 ${task.assigneeName || '—'}\n${dl} ${task.deadlineTime || ''}\n${pr}${func}${result}${desc}\n\n🕐 ${task.createdDate || '—'}\n👨‍💼 ${task.creatorName || '—'}`,
                { reply_markup: { inline_keyboard: taskButtons(taskId, cid) } }
            );
            return answerCallback(cbId, '');
        }
        default:
            return answerCallback(cbId, t('unknownAction', lang));
    }
}

// ========================
//  COMMANDS
// ========================
async function cmdStart(chatId, tgId, tgUser, args, tgLang) {
    if (args && args.length >= 6) {
        const user = await findByCode(args);
        if (user) {
            await user.ref.update({
                telegramChatId: String(chatId), telegramUserId: String(tgId), telegramUsername: tgUser || '',
            });
            await updateTelegramIndex(chatId, user.cid, user.uid);
            const lang = detectLang(user.data, tgLang);
            return send(chatId, t('connected', lang, { name: user.data.name || user.data.email }));
        }
        const lang = detectLang(null, tgLang);
        return send(chatId, t('codeNotFound', lang));
    }
    const lang = detectLang(null, tgLang);
    return send(chatId, t('welcome', lang));
}

async function cmdConnect(chatId, tgId, tgUser, email, tgLang) {
    const lang = detectLang(null, tgLang);
    if (!email || !email.includes('@')) return send(chatId, t('connectUsage', lang));
    const user = await findByEmail(email);
    if (!user) return send(chatId, t('emailNotFound', lang, { email }));
    if (user.data.telegramChatId && user.data.telegramChatId !== String(chatId)) {
        return send(chatId, t('alreadyConnected', lang));
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await user.ref.update({
        telegramConnectCode: code,
        telegramConnectChatId: String(chatId),
        telegramConnectTgId: String(tgId),
        telegramConnectTgUser: tgUser || '',
        telegramConnectExpires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    return send(chatId, t('verifyPrompt', lang, { code }));
}

async function cmdVerify(chatId, tgId, tgUser, code, tgLang) {
    const lang = detectLang(null, tgLang);
    if (!code || code.length < 4) return send(chatId, t('verifyUsage', lang));
    const companies = await db.collection('companies').get();
    for (const c of companies.docs) {
        const snap = await c.ref.collection('users')
            .where('telegramConnectCode', '==', code)
            .where('telegramConnectChatId', '==', String(chatId)).limit(1).get();
        if (!snap.empty) {
            const d = snap.docs[0]; const data = d.data();
            if (data.telegramConnectExpires && new Date(data.telegramConnectExpires) < new Date()) {
                return send(chatId, t('verifyExpired', lang));
            }
            await d.ref.update({
                telegramChatId: String(chatId), telegramUserId: String(tgId), telegramUsername: tgUser || '',
                telegramConnectCode: admin.firestore.FieldValue.delete(),
                telegramConnectChatId: admin.firestore.FieldValue.delete(),
                telegramConnectTgId: admin.firestore.FieldValue.delete(),
                telegramConnectTgUser: admin.firestore.FieldValue.delete(),
                telegramConnectExpires: admin.firestore.FieldValue.delete(),
            });
            await updateTelegramIndex(chatId, c.id, d.id);
            const uLang = detectLang(data, tgLang);
            return send(chatId, t('connected', uLang, { name: data.name || data.email }));
        }
    }
    return send(chatId, t('verifyWrong', lang));
}

async function cmdFocus(chatId, u, lang) {
    // БАГ 4 FIX: реалізація /focus — найважливіше завдання зараз
    const today = new Date().toISOString().split('T')[0];
    const snap = await db.collection('companies').doc(u.cid)
        .collection('tasks')
        .where('assigneeId', '==', u.uid)
        .where('status', 'in', ['new', 'progress'])
        .get();
    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Пріоритет: прострочені > сьогодні > high priority > решта
    const overdue = tasks.filter(t => t.deadlineDate && t.deadlineDate < today);
    const todayTasks = tasks.filter(t => t.deadlineDate === today);
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.deadlineDate);

    const focusTask = overdue[0] || todayTasks[0] || highPriority[0] || tasks[0];
    if (!focusTask) return send(chatId, t('todayClean', lang));

    const pr = focusTask.priority === 'high' ? '🔴' : focusTask.priority === 'low' ? '🟢' : '🟡';
    const dl = focusTask.deadlineDate ? `\n📅 ${focusTask.deadlineDate}` : '';
    const isOverdue = focusTask.deadlineDate && focusTask.deadlineDate < today;
    const prefix = isOverdue ? '⚠️ Прострочено! ' : '🎯 Фокус зараз: ';

    await sendButtons(chatId,
        `${prefix}\n\n${pr} <b>${focusTask.title}</b>${dl}\n👤 ${focusTask.assigneeName || '—'}`,
        taskButtons(focusTask.id, u.cid)
    );
}

async function cmdToday(chatId, u, lang) {
    const today = new Date().toISOString().split('T')[0];
    const snap = await db.collection('companies').doc(u.cid)
        .collection('tasks').where('assigneeId','==',u.uid).where('status','in',['new','progress']).get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(t2 => t2.deadlineDate === today) // БАГ 6 FIX: прибрано завдання без дедлайну
        .sort((a,b) => {
            // БАГ 10 FIX: завдання без дедлайну завжди в кінець
            if (!a.deadlineTime && b.deadlineTime) return 1;
            if (a.deadlineTime && !b.deadlineTime) return -1;
            return (a.deadlineTime||'').localeCompare(b.deadlineTime||'');
        });
    if (!list.length) return send(chatId, t('todayClean', lang));
    for (const tk of list) {
        const tm = tk.deadlineTime ? ` ⏰ ${tk.deadlineTime}` : '';
        const pr = tk.priority==='high'?'🔴':tk.priority==='low'?'🟢':'🟡';
        await sendButtons(chatId, `${pr} <b>${tk.title}</b>${tm}\n👤 ${tk.assigneeName || '—'}`, taskButtons(tk.id, u.cid));
    }
}

async function cmdOverdue(chatId, u, lang) {
    const today = new Date().toISOString().split('T')[0];
    const snap = await db.collection('companies').doc(u.cid)
        .collection('tasks').where('status','in',['new','progress']).get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(tk => tk.deadlineDate && tk.deadlineDate < today && tk.assigneeId === u.uid);
    if (!list.length) return send(chatId, t('noOverdue', lang));
    for (const tk of list.slice(0, 10)) {
        const pr = tk.priority==='high'?'🔴':tk.priority==='low'?'🟢':'🟡';
        await sendButtons(chatId, `⚠️ ${pr} <b>${tk.title}</b>\n👤 ${tk.assigneeName || '—'} 📅 ${tk.deadlineDate}`, taskButtons(tk.id, u.cid));
    }
    if (list.length > 10) await send(chatId, t('moreOverdue', lang, { n: list.length - 10 }));
}

async function cmdTeam(chatId, u, lang) {
    const today = new Date().toISOString().split('T')[0];
    const snap = await db.collection('companies').doc(u.cid)
        .collection('tasks').where('status','in',['new','progress']).get();
    const byP = {};
    snap.docs.forEach(d => {
        const tk=d.data(); const n=tk.assigneeName||'—';
        if(!byP[n]) byP[n]={a:0,o:0}; byP[n].a++;
        if(tk.deadlineDate && tk.deadlineDate<today) byP[n].o++;
    });
    let msg = t('teamTitle', lang);
    Object.entries(byP).sort((a,b)=>b[1].a-a[1].a).forEach(([n,d]) => {
        msg += `• <b>${n}</b>: ${d.a} ${t('tasks', lang)}${d.o?` ⚠️${d.o} ${t('overdueSuffix', lang)}`:''}\n`;
    });
    return send(chatId, msg);
}

async function cmdWeekly(chatId, u, lang) {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];
    const snap = await db.collection('companies').doc(u.cid).collection('tasks').get();
    let created = 0, completed = 0, overdue = 0;
    const byP = {};
    snap.docs.forEach(d => {
        const tk = d.data(); const n = tk.assigneeName || '—';
        if (!byP[n]) byP[n] = { done: 0, overdue: 0, active: 0 };
        if (tk.createdDate && tk.createdDate >= weekAgoStr) created++;
        if (tk.status === 'done' && tk.completedDate && tk.completedDate >= weekAgoStr) { completed++; byP[n].done++; }
        if (tk.status !== 'done' && tk.deadlineDate && tk.deadlineDate < todayStr) { overdue++; byP[n].overdue++; }
        if (tk.status !== 'done') byP[n].active++;
    });
    const eff = created > 0 ? Math.round((completed / created) * 100) : 0;
    let msg = `${t('weeklyTitle', lang)}\n📅 ${weekAgoStr} — ${todayStr}\n\n`;
    msg += `📝 ${t('created', lang)}: <b>${created}</b>\n✅ ${t('completed', lang)}: <b>${completed}</b>\n⚠️ ${t('overdue', lang)}: <b>${overdue}</b>\n📊 ${t('efficiency', lang)}: <b>${eff}%</b>\n\n`;
    const sorted = Object.entries(byP).sort((a, b) => b[1].done - a[1].done);
    if (sorted.length > 0) {
        msg += `${t('byPeople', lang)}\n`;
        sorted.forEach(([n, s]) => {
            const warn = s.overdue > 0 ? ` ⚠️${s.overdue}` : '';
            msg += `• <b>${n}</b>: ✅${s.done} | 📋${s.active}${warn}\n`;
        });
    }
    return send(chatId, msg);
}

// ========================
//  /ai-digest — AI-аналіз дня для власника
// ========================
async function cmdAIDigest(chatId, u, lang) {
    const isOwnerOrMgr = u.data?.role === 'owner' || u.data?.role === 'manager';
    if (!isOwnerOrMgr) {
        await send(chatId, '❌ Digest доступний тільки власнику або менеджеру');
        return;
    }

    await send(chatId, '🤖 Аналізую день...');

    try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Збираємо задачі за сьогодні
        const [doneSnap, overdueSnap, reviewSnap] = await Promise.all([
            db.collection('companies').doc(u.cid).collection('tasks')
                .where('completedDate', '==', today).limit(50).get(),
            db.collection('companies').doc(u.cid).collection('tasks')
                .where('deadlineDate', '<', today).where('status', 'in', ['new','progress']).limit(30).get(),
            db.collection('companies').doc(u.cid).collection('tasks')
                .where('status', '==', 'review').limit(20).get(),
        ]);

        const done = doneSnap.docs.map(d => d.data());
        const overdue = overdueSnap.docs.map(d => d.data());
        const review = reviewSnap.docs.map(d => d.data());

        if (done.length === 0 && overdue.length === 0 && review.length === 0) {
            await send(chatId, '📊 За сьогодні даних немає.');
            return;
        }

        // Готуємо дані для AI
        const summary = {
            date: today,
            done: done.map(t => ({ title: t.title, assignee: t.assigneeName, fn: t.function })),
            overdue: overdue.map(t => ({ title: t.title, assignee: t.assigneeName, deadline: t.deadlineDate, days: Math.floor((new Date() - new Date(t.deadlineDate)) / 86400000) })),
            review: review.map(t => ({ title: t.title, assignee: t.assigneeName })),
        };

        const prompt = `Ти аналізуєш робочий день компанії. Дай короткий підсумок (3-6 речень) у форматі Telegram без markdown.

Дані дня (${today}):
- Виконано задач: ${done.length} (${done.map(t=>t.title).slice(0,5).join(', ')}${done.length>5?'...':''})
- Прострочено: ${overdue.length} задач (${overdue.map(t=>t.title+' ('+t.assigneeName+', '+t.days+'д)').slice(0,3).join(', ')}${overdue.length>3?'...':''})
- На перевірці: ${review.length} задач

Структура відповіді:
1. Коротко про результат дня (1 речення)
2. Головний ризик або проблема (1-2 речення, якщо є)
3. Рекомендація власнику що зробити завтра вранці (1-2 речення)

Пиши по-українськи, коротко і конкретно.`;

        const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY || '',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 500,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!resp.ok) throw new Error(`API ${resp.status}`);
        const data = await resp.json();
        const analysis = data.content?.[0]?.text || 'Не вдалося отримати аналіз.';

        const msg = `📊 *AI-Дайджест дня* (${today})

` +
            `✅ Виконано: ${done.length}
` +
            `🔴 Прострочено: ${overdue.length}
` +
            `🔍 На перевірці: ${review.length}

` +
            `🤖 ${analysis}`;

        await send(chatId, msg);
    } catch(err) {
        console.error('[ai-digest]', err);
        await send(chatId, '❌ Помилка: ' + err.message);
    }
}

async function cmdEvening(chatId, u, lang) {
    const todayStr = new Date().toISOString().split('T')[0];
    const userName = u.data.name || u.data.email || '';
    const snap = await db.collection('companies').doc(u.cid)
        .collection('tasks').where('assigneeId', '==', u.uid).get();
    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const doneToday = tasks.filter(tk => tk.status === 'done' && tk.completedDate === todayStr);
    const missedToday = tasks.filter(tk => tk.deadlineDate === todayStr && tk.status !== 'done');
    const overdueT = tasks.filter(tk => tk.deadlineDate && tk.deadlineDate < todayStr && tk.status !== 'done');
    const tmrw = new Date(); tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = tmrw.toISOString().split('T')[0];
    const tomorrow = tasks.filter(tk => tk.deadlineDate === tmrwStr && tk.status !== 'done')
        .sort((a, b) => (a.deadlineTime || '').localeCompare(b.deadlineTime || ''));
    const inProgress = tasks.filter(tk => tk.status === 'progress');

    const planned = doneToday.length + missedToday.length;
    const score = planned > 0 ? Math.round((doneToday.length / planned) * 100) : 100;
    const emoji = score >= 80 ? '🟢' : score >= 50 ? '🟡' : '🔴';

    let msg = `${t('eveningTitle', lang)}\n👤 ${userName}\n\n`;
    msg += `${emoji} <b>${t('planVsFact', lang)}: ${doneToday.length}/${planned} (${score}%)</b>\n\n`;

    if (doneToday.length > 0) {
        msg += `${t('doneToday', lang, { n: doneToday.length })}\n`;
        doneToday.slice(0, 8).forEach(tk => { msg += `  • <s>${tk.title}</s>\n`; });
        if (doneToday.length > 8) msg += `  ${t('more', lang, { n: doneToday.length - 8 })}\n`;
        msg += `\n`;
    }
    if (missedToday.length > 0) {
        msg += `${t('notDone', lang, { n: missedToday.length })}\n`;
        missedToday.forEach(tk => { msg += `  • ${tk.title}\n`; });
        msg += `\n`;
    }
    if (overdueT.length > 0) {
        msg += `${t('overdueList', lang, { n: overdueT.length })}\n`;
        overdueT.slice(0, 5).forEach(tk => { msg += `  • ${tk.title} (📅 ${tk.deadlineDate})\n`; });
        if (overdueT.length > 5) msg += `  ${t('more', lang, { n: overdueT.length - 5 })}\n`;
        msg += `\n`;
    }
    if (inProgress.length > 0) {
        msg += `${t('inProgressList', lang, { n: inProgress.length })}\n`;
        inProgress.slice(0, 5).forEach(tk => { const dl = tk.deadlineDate ? ` 📅 ${tk.deadlineDate}` : ''; msg += `  • ${tk.title}${dl}\n`; });
        msg += `\n`;
    }
    if (tomorrow.length > 0) {
        msg += `${t('tomorrowList', lang, { n: tomorrow.length })}\n`;
        tomorrow.slice(0, 8).forEach(tk => {
            const tm = tk.deadlineTime ? ` ⏰ ${tk.deadlineTime}` : '';
            const pr = tk.priority==='high'?'🔴':tk.priority==='low'?'🟢':'🟡';
            msg += `  ${pr} ${tk.title}${tm}\n`;
        });
        if (tomorrow.length > 8) msg += `  ${t('more', lang, { n: tomorrow.length - 8 })}\n`;
    } else {
        msg += `${t('tomorrowFree', lang)}\n`;
    }
    return send(chatId, msg);
}

// ========================
//  CREATE TASK
// ========================
async function createTask(u, p) {
    let aId = u.uid, aName = u.data.name || u.data.email;
    if (p.who) {
        const a = await findAssignee(u.cid, p.who);
        if (a) { aId = a.id; aName = a.name || a.email; }
    }
    const dt = p.date || new Date().toISOString().split('T')[0];
    // БАГ 9 FIX: отримуємо налаштування компанії для дефолтних полів
    let companyDefaults = {};
    try {
        const companyDoc = await db.collection('companies').doc(u.cid).get();
        if (companyDoc.exists) companyDefaults = companyDoc.data() || {};
    } catch(e) {}

    const data = {
        title: p.title, function: '', projectId: '',
        assigneeId: aId, assigneeName: aName,
        deadlineDate: dt, deadlineTime: p.time, deadline: dt+'T'+p.time,
        estimatedTime: '', priority: p.prio, status: 'new',
        expectedResult: p.expectedResult || '',   // AI-розпізнане
        reportFormat:   p.reportFormat   || '',   // AI-розпізнане
        description:    p.description    || '',   // AI-розпізнане
        notifyOnComplete: [u.uid], notifyOnReminder: [u.uid],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdDate: new Date().toISOString().split('T')[0],
        creatorId: u.uid, creatorName: u.data.name || u.data.email,
        pinned: false, source: 'telegram',
        // БАГ 9 FIX: обов'язкові поля для сумісності з веб
        requireReview: companyDefaults.defaultRequireReview || false,
        checklist: [],
        coExecutorIds: [],
        coExecutorNames: [],
        observerIds: [],
    };
    const ref = await db.collection('companies').doc(u.cid).collection('tasks').add(data);
    return { id: ref.id, aId, aName, ...data };
}

// ========================
//  NOTIFICATIONS
// ========================
async function notifyUser(cid, uid, type, data) {
    try {
        const doc = await db.collection('companies').doc(cid).collection('users').doc(uid).get();
        if (!doc.exists) return;
        const userData = doc.data();
        const chatId = userData.telegramChatId;
        if (!chatId) return;
        const lang = detectLang(userData);
        const taskId = data.taskId || '';

        const keyMap = {
            new_task: 'newTaskNotify', task_completed: 'taskCompletedNotify',
            task_review: 'taskReviewNotify', task_rejected: 'taskRejectedNotify',
            process_step: 'processStepNotify', overdue: 'overdueNotify',
        };
        const text = t(keyMap[type] || 'newTaskNotify', lang, {
            title: data.taskTitle || '', creator: data.creatorName || '',
            assignee: data.assigneeName || '', process: data.processName || '', step: data.stepName || '',
        });

        if (taskId && (type === 'new_task' || type === 'task_review' || type === 'overdue')) {
            await sendButtons(chatId, text, taskButtons(taskId, cid));
        } else {
            await send(chatId, text);
        }
    } catch (e) { console.error('notifyUser:', e.message); }
}

async function notifyUsers(cid, userIds, type, data) {
    if (!userIds?.length) return;
    await Promise.allSettled(userIds.map(uid => notifyUser(cid, uid, type, data)));
}

// ========================
//  NATURAL LANGUAGE QUERIES
// ========================
async function handleQuery(chatId, u, text, lang) {
    const low = text.toLowerCase();
    const todayStr = new Date().toISOString().split('T')[0];
    const snap = await db.collection('companies').doc(u.cid).collection('tasks').get();
    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const active = tasks.filter(tk => tk.status !== 'done');
    const done = tasks.filter(tk => tk.status === 'done');

    // "хто нічого не зробив" / "кто ничего не сделал" / "who did nothing"
    if (/хто.*(нічого|не виконав|не зробив|лінується|відстає)|кто.*(ничего|не выполнил|не сделал|ленится)|who.*(nothing|didn)/i.test(low)) {
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        const usersSnap = await db.collection('companies').doc(u.cid).collection('users').get();
        const allUsers = {};
        usersSnap.docs.forEach(d => { allUsers[d.data().name || d.data().email] = 0; });
        done.forEach(tk => {
            if (tk.completedDate && tk.completedDate >= weekAgoStr && tk.assigneeName) {
                allUsers[tk.assigneeName] = (allUsers[tk.assigneeName] || 0) + 1;
            }
        });
        const lazy = Object.entries(allUsers).filter(([_, c]) => c === 0);
        if (lazy.length === 0) return send(chatId, t('allDoneWeek', lang));
        let msg = t('nothingDoneTitle', lang);
        lazy.forEach(([n]) => { msg += `• ${n}\n`; });
        return send(chatId, msg);
    }

    // "скільки виконав X" / "сколько выполнил X" / "stats X"
    const personMatch = low.match(/(?:скільки|статистика|що зробив|результат|звіт|сколько|что сделал|stats)\s+(?:виконав\s+|выполнил\s+)?([а-яіїєґa-z]+)/i)
        || low.match(/([а-яіїєґa-z]+)\s+(?:скільки|статистика|результат|сколько|stats)/i);
    if (personMatch) {
        const name = personMatch[1].toLowerCase();
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        const personTasks = tasks.filter(tk => (tk.assigneeName || '').toLowerCase().includes(name));
        if (personTasks.length === 0) return send(chatId, t('personNotFound', lang, { name: personMatch[1] }));
        const pName = personTasks[0].assigneeName;
        const pActive = personTasks.filter(tk => tk.status !== 'done');
        const pDoneWeek = personTasks.filter(tk => tk.status === 'done' && tk.completedDate && tk.completedDate >= weekAgoStr);
        const pOverdue = pActive.filter(tk => tk.deadlineDate && tk.deadlineDate < todayStr);
        let msg = `👤 <b>${pName}</b>\n\n`;
        msg += `✅ ${t('personDoneWeek', lang)}: <b>${pDoneWeek.length}</b>\n`;
        msg += `📋 ${t('personActive', lang)}: <b>${pActive.length}</b>\n`;
        msg += `⚠️ ${t('overdue', lang)}: <b>${pOverdue.length}</b>\n`;
        if (pOverdue.length > 0) {
            msg += `\n<b>${t('personOverdue', lang)}</b>\n`;
            pOverdue.slice(0, 5).forEach(tk => { msg += `• ${tk.title} (📅 ${tk.deadlineDate})\n`; });
        }
        return send(chatId, msg);
    }

    // "що горить" / "что горит" / "urgent"
    if (/горить|термінов|urgent|критичн|найважлив|горит|срочн/i.test(low)) {
        const urgent = active.filter(tk =>
            tk.priority === 'high' || (tk.deadlineDate && tk.deadlineDate <= todayStr)
        ).sort((a, b) => (a.deadlineDate || '').localeCompare(b.deadlineDate || ''));
        if (urgent.length === 0) return send(chatId, t('nothingUrgent', lang));
        let msg = t('urgentTitle', lang, { n: urgent.length });
        urgent.slice(0, 10).forEach(tk => {
            const ov = tk.deadlineDate && tk.deadlineDate < todayStr ? '⚠️' : '🔴';
            msg += `${ov} ${tk.title}\n👤 ${tk.assigneeName || '—'} 📅 ${tk.deadlineDate || '—'}\n\n`;
        });
        return send(chatId, msg);
    }

    // "скільки завдань" / "сколько задач" / "dashboard"
    if (/скільки.*завдань|загальн.*статистик|стан справ|як справи|дашборд|сколько.*задач|состояние дел|как дела|dashboard/i.test(low)) {
        const act = active.length;
        const dn = done.length;
        const ov = active.filter(tk => tk.deadlineDate && tk.deadlineDate < todayStr).length;
        const todayCount = active.filter(tk => tk.deadlineDate === todayStr).length;
        let msg = t('dashboardTitle', lang);
        msg += `📋 ${t('dashActive', lang)}: <b>${act}</b>\n📅 ${t('dashToday', lang)}: <b>${todayCount}</b>\n`;
        msg += `⚠️ ${t('dashOverdue', lang)}: <b>${ov}</b>\n✅ ${t('dashDoneTotal', lang)}: <b>${dn}</b>\n`;
        return send(chatId, msg);
    }

    return null;
}

// ========================
//  WEBHOOK HANDLER
// ========================
// БАГ 5 FIX: dedup захист від дублікатів Telegram webhook
const _processedUpdates = new Set();

module.exports = async function handler(req, res) {
    if (req.method === 'GET') return res.status(200).json({ ok: true, bot: 'TALKO' });

    // Перевірка Telegram webhook secret token
    // Встановлюється через setWebhook з параметром secret_token
    const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (WEBHOOK_SECRET) {
        const incomingSecret = req.headers['x-telegram-bot-api-secret-token'];
        if (incomingSecret !== WEBHOOK_SECRET) {
            console.warn('[TG] Webhook secret mismatch — rejected');
            return res.status(403).json({ ok: false });
        }
    }

    if (req.query?.action === 'notify') {
        try {
            const { type, userId, userIds, companyId, ...data } = req.body;
            if (userIds) await notifyUsers(companyId, userIds, type, data);
            else if (userId) await notifyUser(companyId, userId, type, data);
            return res.status(200).json({ ok: true });
        } catch (e) { return res.status(200).json({ ok: false, error: e.message }); }
    }

    try {
        const body = req.body || {};
        // БАГ 5 FIX: ігноруємо дублікати
        if (body.update_id) {
            if (_processedUpdates.has(body.update_id)) {
                return res.status(200).json({ ok: true, dedup: true });
            }
            _processedUpdates.add(body.update_id);
            if (_processedUpdates.size > 1000) {
                _processedUpdates.delete(_processedUpdates.values().next().value);
            }
        }
        if (body.callback_query) {
            await handleCallback(body.callback_query);
            return res.status(200).json({ ok: true });
        }

        const msg = body.message;
        if (!msg?.text) return res.status(200).json({ ok: true });

        const chatId = msg.chat.id;
        const tgId = msg.from.id;
        const tgUser = msg.from.username || '';
        const tgLang = msg.from.language_code || '';
        const text = msg.text.trim();

        if (text.startsWith('/')) {
            const [rawCmd, ...rest] = text.split(/\s+/);
            const cmd = rawCmd.toLowerCase().replace(/@\w+/g, '');
            const args = rest.join(' ');

            if (cmd === '/start') { await cmdStart(chatId, tgId, tgUser, args, tgLang); return res.status(200).json({ ok: true }); }
            if (cmd === '/connect') { await cmdConnect(chatId, tgId, tgUser, args, tgLang); return res.status(200).json({ ok: true }); }
            if (cmd === '/verify') { await cmdVerify(chatId, tgId, tgUser, args, tgLang); return res.status(200).json({ ok: true }); }

            const u = await findByChatId(chatId);
            if (!u) {
                const lang = detectLang(null, tgLang);
                await send(chatId, t('notConnected', lang));
                return res.status(200).json({ ok: true });
            }
            const lang = detectLang(u.data, tgLang);

            if (cmd === '/help') { await send(chatId, t('help', lang)); }
            else if (cmd === '/focus') await cmdFocus(chatId, u, lang);
        else if (cmd === '/today') await cmdToday(chatId, u, lang);
            else if (cmd === '/overdue') await cmdOverdue(chatId, u, lang);
            else if (cmd === '/team') await cmdTeam(chatId, u, lang);
            else if (cmd === '/weekly') await cmdWeekly(chatId, u, lang);
            else if (cmd === '/evening') await cmdEvening(chatId, u, lang);
            else if (cmd === '/ai-digest' || cmd === '/digest') await cmdAIDigest(chatId, u, lang);
            else await send(chatId, t('unknownCmd', lang));

            return res.status(200).json({ ok: true });
        }

        const u = await findByChatId(chatId);
        if (!u) {
            const lang = detectLang(null, tgLang);
            await send(chatId, t('notConnectedFull', lang));
            return res.status(200).json({ ok: true });
        }
        const lang = detectLang(u.data, tgLang);

        // Smart routing: long messages or messages with @ are likely tasks, not NLP queries
        const looksLikeTask = text.length > 60 || /@[А-Яа-яІіЇїЄєҐґA-Za-z]/.test(text);

        if (!looksLikeTask) {
            const queryResult = await handleQuery(chatId, u, text, lang);
            if (queryResult) return res.status(200).json({ ok: true });
        }

        const p = await parseTaskSmart(text);  // AI розкладає по блоках
        if (!p.title || p.title.length < 2) {
            await send(chatId, t('cantUnderstand', lang));
            return res.status(200).json({ ok: true });
        }

        const task = await createTask(u, p);
        const dl = task.deadlineDate ? ` 📅 ${task.deadlineDate}` : '';
        const tm = task.deadlineTime !== '18:00' ? ` ⏰ ${task.deadlineTime}` : '';
        const pr = task.priority==='high'?'🔴':task.priority==='low'?'🟢':'🟡';
        // Показуємо що AI розклав, якщо заповнені блоки
        const extras = [
            p.expectedResult ? `📋 ${p.expectedResult.substring(0,60)}${p.expectedResult.length>60?'…':''}` : '',
            p.reportFormat   ? `📝 Звіт: ${p.reportFormat.substring(0,40)}${p.reportFormat.length>40?'…':''}` : '',
        ].filter(Boolean).join('\n');

        await sendButtons(chatId,
            `${t('taskCreated', lang)}\n\n${pr} ${task.title}\n👤 ${task.aName}${dl}${tm}${extras ? '\n\n' + extras : ''}`,
            taskButtons(task.id, u.cid)
        );

        if (task.aId !== u.uid) {
            await notifyUser(u.cid, task.aId, 'new_task', {
                taskId: task.id, taskTitle: task.title,
                creatorName: u.data.name || u.data.email,
            });
        }

        return res.status(200).json({ ok: true });
    } catch (e) {
        console.error('Bot error:', e);
        return res.status(200).json({ ok: true });
    }
};

module.exports.notifyUser = notifyUser;
module.exports.notifyUsers = notifyUsers;
