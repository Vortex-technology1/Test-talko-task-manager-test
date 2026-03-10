// =====================
// MODULE 80: LEARNING PLATFORM
// =====================
(function() {
    'use strict';

    // ── Course Data ──────────────────────────────────────────
        const AI_ASSISTANT_URL = 'https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-technical-lead';

    window.learningCourseData = window.learningCourseData || [];
    const learningCourseData = [
            {
                id: 0,
                title: "МАРШРУТ ПРОГРАМИ",
                title_ru: "МАРШРУТ ПРОГРАММЫ",
                subtitle: "Покрокова карта переходу від хаотичного управління до системного бізнесу",
                subtitle_ru: "Пошаговая карта перехода от хаотичного управления к системному бизнесу",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Що це таке</div>
    </div>
    <div class="lesson-block-content">
        <p>Більшість власників намагаються навести порядок у бізнесі хаотично.</p>
        <p style="margin-top:0.75rem;">Сьогодні займаються наймом.<br>Завтра — маркетингом.<br>Післязавтра — CRM або фінансами.</p>
        <p style="margin-top:0.75rem;">У результаті робота ведеться у різних напрямках, але система так і не з'являється.</p>
        <p style="margin-top:0.75rem;">Саме тому у програмі використовується <strong>маршрут систематизації бізнесу</strong>.</p>
        <p style="margin-top:0.75rem;">Це покрокова карта, яка показує:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>що потрібно налаштувати</li>
            <li>у якій послідовності це робити</li>
            <li>який результат має бути на кожному етапі</li>
        </ul>
        <p style="margin-top:0.75rem;">Фактично це маршрут від хаосу до системного бізнесу.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Як побудований маршрут</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom:1rem;">Маршрут складається з кількох ключових фаз.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 1</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Архітектура бізнесу</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Структура компанії, ролі, функції та зони відповідальності.</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 2</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Найм і команда</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Формування команди та результати роботи кожної ролі.</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 3</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Маркетинг і продажі</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Стабільний та прогнозований потік клієнтів.</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 4</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Фінанси і масштабування</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Контроль прибутку та підготовка до масштабування.</div>
            </div>
        </div>
    </div>
</div>

<div class="lesson-block" style="text-align:center;">
    <div class="lesson-block-content" style="padding:1.25rem;">
        <p style="color:#525252;font-size:0.9rem;margin-bottom:1rem;">Щоб побачити повну структуру програми, відкрийте карту маршруту.</p>
        <a href="#" onclick="event.preventDefault();window._openAlgoritm()" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:#22c55e;color:white;border-radius:12px;font-weight:700;font-size:0.95rem;text-decoration:none;">
            Відкрити маршрут програми →
        </a>
    </div>
</div>

<div class="result-block">
    <strong>Результат.</strong> Після ознайомлення з маршрутом ви будете розуміти: які етапи проходить систематизація, що саме потрібно зробити на кожному етапі та як рухатися по програмі далі.
</div>`,

                lessonContent_ru: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Что это такое</div>
    </div>
    <div class="lesson-block-content">
        <p>Большинство владельцев пытаются навести порядок в бизнесе хаотично.</p>
        <p style="margin-top:0.75rem;">Сегодня занимаются наймом.<br>Завтра — маркетингом.<br>Послезавтра — CRM или финансами.</p>
        <p style="margin-top:0.75rem;">В итоге работа ведётся в разных направлениях, но система так и не появляется.</p>
        <p style="margin-top:0.75rem;">Именно поэтому в программе используется <strong>маршрут систематизации бизнеса</strong>.</p>
        <p style="margin-top:0.75rem;">Это пошаговая карта, которая показывает:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>что нужно настроить</li>
            <li>в какой последовательности это делать</li>
            <li>какой результат должен быть на каждом этапе</li>
        </ul>
        <p style="margin-top:0.75rem;">Фактически это маршрут от хаоса к системному бизнесу.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Как построен маршрут</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom:1rem;">Маршрут состоит из нескольких ключевых фаз.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 1</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Архитектура бизнеса</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Структура компании, роли, функции и зоны ответственности.</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 2</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Найм и команда</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Формирование команды и результаты работы каждой роли.</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 3</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Маркетинг и продажи</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Стабильный и прогнозируемый поток клиентов.</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1rem;">
                <div style="font-size:0.7rem;font-weight:700;color:#16a34a;letter-spacing:0.08em;margin-bottom:0.35rem;">ФАЗА 4</div>
                <div style="font-weight:700;color:#1a1a1a;font-size:0.95rem;margin-bottom:0.4rem;">Финансы и масштабирование</div>
                <div style="font-size:0.82rem;color:#525252;line-height:1.5;">Контроль прибыли и подготовка к масштабированию.</div>
            </div>
        </div>
    </div>
</div>

<div class="lesson-block" style="text-align:center;">
    <div class="lesson-block-content" style="padding:1.25rem;">
        <p style="color:#525252;font-size:0.9rem;margin-bottom:1rem;">Чтобы увидеть полную структуру программы, откройте карту маршрута.</p>
        <a href="#" onclick="event.preventDefault();window._openAlgoritm()" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:#22c55e;color:white;border-radius:12px;font-weight:700;font-size:0.95rem;text-decoration:none;">
            Открыть маршрут программы →
        </a>
    </div>
</div>

<div class="result-block">
    <strong>Результат.</strong> После ознакомления с маршрутом вы будете понимать: какие этапы проходит систематизация, что именно нужно сделать на каждом этапе и как двигаться по программе дальше.
</div>`,

                homework: `<ol><li>Відкрийте маршрут програми</li><li>Ознайомтесь із фазами систематизації</li><li>Поверніться до цього уроку</li></ol>`,
                homework_ru: `<ol><li>Откройте маршрут программы</li><li>Ознакомьтесь с фазами систематизации</li><li>Вернитесь к этому уроку</li></ol>`,

                homeworkLink: null,
                homeworkLinkName: null,
                homeworkLinkName_ru: null,
                time: 15
            },
            {
                id: 1,
                title: "ЯК ПРАЦЮВАТИ З GOOGLE ДИСКОМ",
                title_ru: "КАК РАБОТАТЬ С GOOGLE ДИСКОМ",
                subtitle: "Підготовка робочого середовища програми",
                subtitle_ru: "Подготовка рабочей среды программы",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<div style="margin-bottom:1.25rem;padding:1rem 1.25rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:14px;display:flex;align-items:flex-start;gap:0.9rem;">
    <div style="width:40px;height:40px;background:#22c55e;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="22" height="22"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M12 15h.01M16 15h.01"/></svg>
    </div>
    <div>
        <div style="font-weight:700;color:#166534;font-size:0.95rem;margin-bottom:0.3rem;">У вас є AI-асистент</div>
        <div style="color:#15803d;font-size:0.85rem;line-height:1.6;">Якщо щось незрозуміло або виникнуть труднощі — напишіть асистенту суть завдання, і він проведе вас за руку крок за кроком.</div>
        <a href="https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-technical-lead" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;margin-top:0.65rem;padding:0.4rem 0.85rem;background:#22c55e;color:white;border-radius:8px;font-size:0.82rem;font-weight:600;text-decoration:none;">
            Відкрити AI-асистента →
        </a>
    </div>
</div>

<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Для чого це потрібно</div>
    </div>
    <div class="lesson-block-content">
        <p>У програмі всі матеріали систематизації бізнесу зберігаються у Google Диску.</p>
        <p style="margin-top:0.75rem;">Це дозволяє:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>зберігати всі документи в одному місці</li>
            <li>легко ділитися матеріалами з командою</li>
            <li>працювати з файлами з будь-якого пристрою</li>
        </ul>
        <p style="margin-top:0.75rem;">Фактично Google Диск буде вашим <strong>центром робочих документів</strong> у програмі.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Що потрібно зробити</div>
    </div>
    <div class="lesson-block-content">
        <p>У цьому уроці потрібно:</p>
        <div style="margin-top:0.75rem;display:grid;gap:0.6rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">1</span>
                <span style="font-size:0.9rem;color:#1a1a1a;">Створити робочу папку програми</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">2</span>
                <span style="font-size:0.9rem;color:#1a1a1a;">Створити у ній документи для роботи</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">3</span>
                <span style="font-size:0.9rem;color:#1a1a1a;">Налаштувати доступ</span>
            </div>
        </div>
        <p style="margin-top:0.9rem;color:#525252;font-size:0.875rem;">Це займе приблизно 5–10 хвилин.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">1</span>
            Створіть папку програми
        </div>
    </div>
    <div class="lesson-block-content">
        <p>У Google Диску створіть нову папку з назвою:</p>
        <div style="margin-top:0.6rem;padding:0.7rem 1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-family:monospace;font-size:0.9rem;color:#1a1a1a;">
            Систематизація TALKO — Ваше Ім'я
        </div>
        <p style="margin-top:0.6rem;color:#525252;font-size:0.875rem;">Це буде ваша основна папка для матеріалів програми.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">2</span>
            Створіть документи у папці
        </div>
    </div>
    <div class="lesson-block-content">
        <p>У папці потрібно створити:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>2 Google Документи</li>
            <li>1 Google Таблицю</li>
        </ul>
        <p style="margin-top:0.5rem;color:#525252;font-size:0.875rem;">Назви документів можна залишити будь-які.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">3</span>
            Налаштуйте доступ до папки
        </div>
    </div>
    <div class="lesson-block-content">
        <p>Натисніть <strong>«Поділитися»</strong>. В налаштуваннях оберіть:</p>
        <div style="margin-top:0.6rem;padding:0.7rem 1rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:0.875rem;color:#166534;font-weight:600;">
            Усі, хто має посилання — можуть коментувати
        </div>
        <p style="margin-top:0.6rem;color:#525252;font-size:0.875rem;">Після цього скопіюйте посилання на папку.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">4</span>
            Додайте посилання у систему
        </div>
    </div>
    <div class="lesson-block-content">
        <p>Вставте посилання на папку у поле домашнього завдання нижче.</p>
    </div>
</div>

<div class="result-block">
    <strong>Результат.</strong> Ваше робоче середовище готове — всі матеріали програми зберігатимуться в одному місці з правильним доступом.
</div>

<div style="margin-top:1.25rem;padding:1.1rem 1.25rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
    <div style="display:flex;align-items:flex-start;gap:0.75rem;">
        <div style="width:36px;height:36px;background:#f0fdf4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <div>
            <div style="font-weight:700;color:#1a1a1a;font-size:0.9rem;margin-bottom:0.3rem;">Потрібна допомога?</div>
            <div style="color:#525252;font-size:0.82rem;line-height:1.5;margin-bottom:0.75rem;">Якщо під час виконання виникнуть питання, скористайтесь технічним помічником. Він проведе вас через виконання крок за кроком.</div>
            <a href="https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-technical-lead" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.9rem;background:#22c55e;color:white;border-radius:8px;font-size:0.82rem;font-weight:600;text-decoration:none;">
                Отримати допомогу →
            </a>
        </div>
    </div>
</div>`,

                lessonContent_ru: `
<div style="margin-bottom:1.25rem;padding:1rem 1.25rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:14px;display:flex;align-items:flex-start;gap:0.9rem;">
    <div style="width:40px;height:40px;background:#22c55e;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="22" height="22"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M12 15h.01M16 15h.01"/></svg>
    </div>
    <div>
        <div style="font-weight:700;color:#166534;font-size:0.95rem;margin-bottom:0.3rem;">У вас есть AI-ассистент</div>
        <div style="color:#15803d;font-size:0.85rem;line-height:1.6;">Если что-то непонятно или возникнут трудности — напишите ассистенту суть задания, и он проведёт вас за руку шаг за шагом.</div>
        <a href="https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-technical-lead" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;margin-top:0.65rem;padding:0.4rem 0.85rem;background:#22c55e;color:white;border-radius:8px;font-size:0.82rem;font-weight:600;text-decoration:none;">
            Открыть AI-ассистента →
        </a>
    </div>
</div>

<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Для чего это нужно</div>
    </div>
    <div class="lesson-block-content">
        <p>В программе все материалы систематизации бизнеса хранятся в Google Диске.</p>
        <p style="margin-top:0.75rem;">Это позволяет:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>хранить все документы в одном месте</li>
            <li>легко делиться материалами с командой</li>
            <li>работать с файлами с любого устройства</li>
        </ul>
        <p style="margin-top:0.75rem;">Фактически Google Диск будет вашим <strong>центром рабочих документов</strong> в программе.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Что нужно сделать</div>
    </div>
    <div class="lesson-block-content">
        <p>В этом уроке нужно:</p>
        <div style="margin-top:0.75rem;display:grid;gap:0.6rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">1</span>
                <span style="font-size:0.9rem;color:#1a1a1a;">Создать рабочую папку программы</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">2</span>
                <span style="font-size:0.9rem;color:#1a1a1a;">Создать в ней документы для работы</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">3</span>
                <span style="font-size:0.9rem;color:#1a1a1a;">Настроить доступ</span>
            </div>
        </div>
        <p style="margin-top:0.9rem;color:#525252;font-size:0.875rem;">Это займёт около 5–10 минут.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">1</span>
            Создайте папку программы
        </div>
    </div>
    <div class="lesson-block-content">
        <p>В Google Диске создайте новую папку с названием:</p>
        <div style="margin-top:0.6rem;padding:0.7rem 1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-family:monospace;font-size:0.9rem;color:#1a1a1a;">
            Систематизация TALKO — Ваше Имя
        </div>
        <p style="margin-top:0.6rem;color:#525252;font-size:0.875rem;">Это будет ваша основная папка для материалов программы.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">2</span>
            Создайте документы в папке
        </div>
    </div>
    <div class="lesson-block-content">
        <p>В папке нужно создать:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>2 Google Документа</li>
            <li>1 Google Таблицу</li>
        </ul>
        <p style="margin-top:0.5rem;color:#525252;font-size:0.875rem;">Названия документов могут быть любыми.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">3</span>
            Настройте доступ к папке
        </div>
    </div>
    <div class="lesson-block-content">
        <p>Нажмите <strong>«Поделиться»</strong>. В настройках выберите:</p>
        <div style="margin-top:0.6rem;padding:0.7rem 1rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:0.875rem;color:#166534;font-weight:600;">
            Все, у кого есть ссылка — могут комментировать
        </div>
        <p style="margin-top:0.6rem;color:#525252;font-size:0.875rem;">После этого скопируйте ссылку на папку.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#22c55e;color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">4</span>
            Добавьте ссылку в систему
        </div>
    </div>
    <div class="lesson-block-content">
        <p>Вставьте ссылку на папку в поле домашнего задания ниже.</p>
    </div>
</div>

<div class="result-block">
    <strong>Результат.</strong> Ваша рабочая среда готова — все материалы программы будут храниться в одном месте с правильным доступом.
</div>

<div style="margin-top:1.25rem;padding:1.1rem 1.25rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
    <div style="display:flex;align-items:flex-start;gap:0.75rem;">
        <div style="width:36px;height:36px;background:#f0fdf4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <div>
            <div style="font-weight:700;color:#1a1a1a;font-size:0.9rem;margin-bottom:0.3rem;">Нужна помощь?</div>
            <div style="color:#525252;font-size:0.82rem;line-height:1.5;margin-bottom:0.75rem;">Если во время выполнения возникнут вопросы, воспользуйтесь техническим помощником. Он проведёт вас через выполнение шаг за шагом.</div>
            <a href="https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-technical-lead" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.9rem;background:#22c55e;color:white;border-radius:8px;font-size:0.82rem;font-weight:600;text-decoration:none;">
                Получить помощь →
            </a>
        </div>
    </div>
</div>`,

                homework: `<ol><li>Створіть папку <strong>Систематизація TALKO — Ваше Ім'я</strong></li><li>Створіть у ній 2 Google Документи та 1 Google Таблицю</li><li>Налаштуйте доступ: <em>Усі, хто має посилання — можуть коментувати</em></li><li>Вставте посилання на папку у поле нижче</li></ol>`,
                homework_ru: `<ol><li>Создайте папку <strong>Систематизация TALKO — Ваше Имя</strong></li><li>Создайте в ней 2 Google Документа и 1 Google Таблицу</li><li>Настройте доступ: <em>Все, у кого есть ссылка — могут комментировать</em></li><li>Вставьте ссылку на папку в поле ниже</li></ol>`,

                homeworkLink: null,
                homeworkLinkName: null,
                homeworkLinkName_ru: null,
                time: 15
            },
            {
                id: 2,
                title: "СЛОВНИК ТЕРМІНІВ + ЕФЕКТИВНЕ НАВЧАННЯ",
                title_ru: "СЛОВАРЬ ТЕРМИНОВ + ЭФФЕКТИВНОЕ ОБУЧЕНИЕ",
                subtitle: "Технологія навчання + прояснення 13 термінів",
                subtitle_ru: "Технология обучения + прояснение 13 терминов",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Чому більшість навчання не працює</div>
    </div>
    <div class="lesson-block-content">
        <p>Більшість людей витрачають роки на навчання, але не можуть застосувати знання на практиці.</p>
        <p style="margin-top:0.75rem;">Наприклад: університет — 5 років, тисячі годин лекцій, диплом. Але при цьому більшість випускників не працюють за спеціальністю.</p>
        <p style="margin-top:0.75rem;">Проблема не в людях. Проблема в тому, що в освіті відсутня <strong>технологія навчання</strong>.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Що таке технологія</div>
    </div>
    <div class="lesson-block-content">
        <p>Технологія — це послідовність дій, яка дає передбачуваний результат.</p>
        <p style="margin-top:0.75rem;">Наприклад, щоб приготувати яєчню:</p>
        <div style="margin-top:0.75rem;display:grid;gap:0.5rem;">
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">1</span>
                Увімкнути плиту
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">2</span>
                Поставити сковорідку
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">3</span>
                Розбити яйця
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">4</span>
                Почекати кілька хвилин
            </div>
        </div>
        <p style="margin-top:0.75rem;">Якщо виконати ці дії — результат гарантований. <strong>Навчання має працювати так само.</strong></p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Як працює правильне навчання</div>
    </div>
    <div class="lesson-block-content">
        <p>Ефективне навчання складається з трьох етапів:</p>
        <div style="margin-top:0.85rem;display:flex;align-items:center;gap:0;border-radius:10px;overflow:hidden;">
            <div style="flex:1;text-align:center;padding:0.8rem 0.5rem;background:#f0fdf4;border:1px solid #bbf7d0;">
                <div style="font-weight:700;color:#166534;font-size:0.875rem;">Зрозуміти</div>
            </div>
            <div style="padding:0 0.3rem;color:#22c55e;font-weight:700;font-size:1.1rem;">→</div>
            <div style="flex:1;text-align:center;padding:0.8rem 0.5rem;background:#f0fdf4;border:1px solid #bbf7d0;">
                <div style="font-weight:700;color:#166534;font-size:0.875rem;">Застосувати</div>
            </div>
            <div style="padding:0 0.3rem;color:#22c55e;font-weight:700;font-size:1.1rem;">→</div>
            <div style="flex:1;text-align:center;padding:0.8rem 0.5rem;background:#22c55e;">
                <div style="font-weight:700;color:white;font-size:0.875rem;">Навичка</div>
            </div>
        </div>
        <p style="margin-top:0.75rem;">Просто знати щось — недостатньо. Справжнє навчання завершується тоді, коли людина може <strong>застосувати знання у роботі</strong>.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Головна причина проблем у навчанні</div>
    </div>
    <div class="lesson-block-content">
        <p>Основна причина проблем у навчанні — <strong>незрозуміле слово</strong>.</p>
        <p style="margin-top:0.75rem;">Коли людина зустрічає слово, яке вона не розуміє:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>вона перестає розуміти матеріал</li>
            <li>починає втрачати інтерес</li>
            <li>намагається запам'ятати замість зрозуміти</li>
        </ul>
        <p style="margin-top:0.75rem;">У результаті знання не застосовуються.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Що таке концепт</div>
    </div>
    <div class="lesson-block-content">
        <p>Концепт — це ідея або уявлення про щось у вашому розумі. Концепт не можна просто запам'ятати. Його можна тільки <strong>сформувати через розуміння</strong>.</p>
        <p style="margin-top:0.75rem;">Наприклад, якщо у вас є концепт "стілець" — ви легко визначите, стілець це чи ні. Вам не потрібно згадувати визначення.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Чому це важливо у бізнесі</div>
    </div>
    <div class="lesson-block-content">
        <p>У бізнесі нерозуміння термінів часто створює проблеми.</p>
        <p style="margin-top:0.75rem;">Наприклад, ви говорите співробітнику: <em>"Підготуй план продажів"</em>. Але у вас різні концепти слова «план»:</p>
        <div style="margin-top:0.75rem;display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">
            <div style="padding:0.75rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
                <div style="font-size:0.72rem;font-weight:700;color:#16a34a;letter-spacing:0.06em;margin-bottom:0.3rem;">ДЛЯ ВАС</div>
                <div style="font-size:0.875rem;color:#1a1a1a;">Конкретні кроки та дії</div>
            </div>
            <div style="padding:0.75rem;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;">
                <div style="font-size:0.72rem;font-weight:700;color:#dc2626;letter-spacing:0.06em;margin-bottom:0.3rem;">ДЛЯ СПІВРОБІТНИКА</div>
                <div style="font-size:0.875rem;color:#1a1a1a;">Бажаний результат у цифрах</div>
            </div>
        </div>
        <p style="margin-top:0.75rem;">У результаті виникає нерозуміння. Одне слово — два різних концепти.</p>
    </div>
</div>

<div class="result-block">
    <strong>Висновок.</strong> Щоб навчатися швидко й ефективно — потрібно розуміти ключові терміни, формувати правильні концепти та використовувати їх у роботі. Саме для цього у програмі є словник термінів TALKO.
</div>

<div class="lesson-block" style="margin-top:1.25rem;">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Завдання</div>
    </div>
    <div class="lesson-block-content">
        <p>У програмі є список ключових термінів. У цьому уроці потрібно:</p>
        <div style="margin-top:0.75rem;display:grid;gap:0.5rem;">
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">1</span>
                <span style="font-size:0.875rem;">Пройти перші 13 термінів через асистента</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">2</span>
                <span style="font-size:0.875rem;">Зрозуміти їх значення</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">3</span>
                <span style="font-size:0.875rem;">Подумати, як вони використовуються у вашому бізнесі</span>
            </div>
        </div>
    </div>
</div>

<div style="margin-top:1.25rem;padding:1.1rem 1.25rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:14px;">
    <div style="font-weight:700;color:#166534;font-size:0.95rem;margin-bottom:0.3rem;">Асистент термінології</div>
    <div style="color:#15803d;font-size:0.85rem;line-height:1.5;margin-bottom:0.75rem;">Щоб швидко розібратися з термінами програми — скористайтесь асистентом. Він пояснить кожне поняття простими словами.</div>
    <a href="https://chatgpt.com/g/g-688c4d14d300819186e96a0226712dde-terminology-assistant" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.5rem 1rem;background:#22c55e;color:white;border-radius:9px;font-size:0.875rem;font-weight:700;text-decoration:none;">
        Відкрити асистента термінів →
    </a>
</div>`,

                lessonContent_ru: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Почему большинство обучения не работает</div>
    </div>
    <div class="lesson-block-content">
        <p>Большинство людей тратят годы на обучение, но не могут применить знания на практике.</p>
        <p style="margin-top:0.75rem;">Например: университет — 5 лет, тысячи часов лекций, диплом. Но при этом большинство выпускников не работают по специальности.</p>
        <p style="margin-top:0.75rem;">Проблема не в людях. Проблема в том, что в образовании отсутствует <strong>технология обучения</strong>.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Что такое технология</div>
    </div>
    <div class="lesson-block-content">
        <p>Технология — это последовательность действий, которая даёт предсказуемый результат.</p>
        <p style="margin-top:0.75rem;">Например, чтобы приготовить яичницу:</p>
        <div style="margin-top:0.75rem;display:grid;gap:0.5rem;">
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">1</span>
                Включить плиту
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">2</span>
                Поставить сковородку
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">3</span>
                Разбить яйца
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0.85rem;background:#f8fafc;border-radius:8px;font-size:0.875rem;color:#1a1a1a;">
                <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;flex-shrink:0;">4</span>
                Подождать несколько минут
            </div>
        </div>
        <p style="margin-top:0.75rem;">Если выполнить эти действия — результат гарантирован. <strong>Обучение должно работать так же.</strong></p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Как работает правильное обучение</div>
    </div>
    <div class="lesson-block-content">
        <p>Эффективное обучение состоит из трёх этапов:</p>
        <div style="margin-top:0.85rem;display:flex;align-items:center;gap:0;border-radius:10px;overflow:hidden;">
            <div style="flex:1;text-align:center;padding:0.8rem 0.5rem;background:#f0fdf4;border:1px solid #bbf7d0;">
                <div style="font-weight:700;color:#166534;font-size:0.875rem;">Понять</div>
            </div>
            <div style="padding:0 0.3rem;color:#22c55e;font-weight:700;font-size:1.1rem;">→</div>
            <div style="flex:1;text-align:center;padding:0.8rem 0.5rem;background:#f0fdf4;border:1px solid #bbf7d0;">
                <div style="font-weight:700;color:#166534;font-size:0.875rem;">Применить</div>
            </div>
            <div style="padding:0 0.3rem;color:#22c55e;font-weight:700;font-size:1.1rem;">→</div>
            <div style="flex:1;text-align:center;padding:0.8rem 0.5rem;background:#22c55e;">
                <div style="font-weight:700;color:white;font-size:0.875rem;">Навык</div>
            </div>
        </div>
        <p style="margin-top:0.75rem;">Просто знать что-то — недостаточно. Настоящее обучение завершается тогда, когда человек может <strong>применить знания в работе</strong>.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Главная причина проблем в обучении</div>
    </div>
    <div class="lesson-block-content">
        <p>Основная причина проблем в обучении — <strong>непонятное слово</strong>.</p>
        <p style="margin-top:0.75rem;">Когда человек встречает слово, которое он не понимает:</p>
        <ul style="margin-top:0.5rem;padding-left:1.2rem;line-height:1.9;">
            <li>он перестаёт понимать материал</li>
            <li>начинает терять интерес</li>
            <li>пытается запомнить вместо того, чтобы понять</li>
        </ul>
        <p style="margin-top:0.75rem;">В результате знания не применяются.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Что такое концепт</div>
    </div>
    <div class="lesson-block-content">
        <p>Концепт — это идея или представление о чём-то в вашем уме. Концепт нельзя просто запомнить. Его можно только <strong>сформировать через понимание</strong>.</p>
        <p style="margin-top:0.75rem;">Например, если у вас есть концепт "стул" — вы легко определите, стул это или нет. Вам не нужно вспоминать определение.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Почему это важно в бизнесе</div>
    </div>
    <div class="lesson-block-content">
        <p>В бизнесе непонимание терминов часто создаёт проблемы.</p>
        <p style="margin-top:0.75rem;">Например, вы говорите сотруднику: <em>"Подготовь план продаж"</em>. Но у вас разные концепты слова «план»:</p>
        <div style="margin-top:0.75rem;display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">
            <div style="padding:0.75rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
                <div style="font-size:0.72rem;font-weight:700;color:#16a34a;letter-spacing:0.06em;margin-bottom:0.3rem;">ДЛЯ ВАС</div>
                <div style="font-size:0.875rem;color:#1a1a1a;">Конкретные шаги и действия</div>
            </div>
            <div style="padding:0.75rem;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;">
                <div style="font-size:0.72rem;font-weight:700;color:#dc2626;letter-spacing:0.06em;margin-bottom:0.3rem;">ДЛЯ СОТРУДНИКА</div>
                <div style="font-size:0.875rem;color:#1a1a1a;">Желаемый результат в цифрах</div>
            </div>
        </div>
        <p style="margin-top:0.75rem;">В результате возникает недопонимание. Одно слово — два разных концепта.</p>
    </div>
</div>

<div class="result-block">
    <strong>Вывод.</strong> Чтобы учиться быстро и эффективно — нужно понимать ключевые термины, формировать правильные концепты и использовать их в работе. Именно для этого в программе есть словарь терминов TALKO.
</div>

<div class="lesson-block" style="margin-top:1.25rem;">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Задание</div>
    </div>
    <div class="lesson-block-content">
        <p>В программе есть список ключевых терминов. В этом уроке нужно:</p>
        <div style="margin-top:0.75rem;display:grid;gap:0.5rem;">
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">1</span>
                <span style="font-size:0.875rem;">Пройти первые 13 терминов через ассистента</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">2</span>
                <span style="font-size:0.875rem;">Понять их значение</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;background:#f0fdf4;border-radius:10px;">
                <span style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;">3</span>
                <span style="font-size:0.875rem;">Подумать, как они применяются в вашем бизнесе</span>
            </div>
        </div>
    </div>
</div>

<div style="margin-top:1.25rem;padding:1.1rem 1.25rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:14px;">
    <div style="font-weight:700;color:#166534;font-size:0.95rem;margin-bottom:0.3rem;">Ассистент терминологии</div>
    <div style="color:#15803d;font-size:0.85rem;line-height:1.5;margin-bottom:0.75rem;">Чтобы быстро разобраться с терминами программы — воспользуйтесь ассистентом. Он объяснит каждое понятие простыми словами.</div>
    <a href="https://chatgpt.com/g/g-688c4d14d300819186e96a0226712dde-terminology-assistant" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.5rem 1rem;background:#22c55e;color:white;border-radius:9px;font-size:0.875rem;font-weight:700;text-decoration:none;">
        Открыть ассистента терминов →
    </a>
</div>`,

                homework: `<ol><li>Відкрийте асистента термінів</li><li>Пройдіть перші 13 термінів</li><li>Подумайте, як вони застосовуються у вашому бізнесі</li></ol>`,
                homework_ru: `<ol><li>Откройте ассистента терминов</li><li>Пройдите первые 13 терминов</li><li>Подумайте, как они применяются в вашем бизнесе</li></ol>`,

                homeworkLink: null,
                homeworkLinkName: null,
                homeworkLinkName_ru: null,
                time: 15
            },
            {
                id: 3,
                title: "НАЛАШТУВАННЯ ДОСТУПУ ДО AI",
                title_ru: "НАСТРОЙКА ДОСТУПА К AI",
                subtitle: "ChatGPT та Claude AI — ваші робочі інструменти",
                subtitle_ru: "ChatGPT и Claude AI — ваши рабочие инструменты",
                
                videoLink: null,
                materialsLink: null,
                
                lessonContent: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Навіщо цей урок</div>
    </div>
    <div class="lesson-block-content">
        <p>Усі AI-асистенти програми працюють на базі <strong>ChatGPT</strong> та <strong>Claude AI</strong>. Щоб проходити уроки, вам потрібен доступ до цих платформ.</p>
        <p style="margin-top: 12px;">Цей урок допоможе налаштувати акаунти та авторизуватись.</p>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 1. Реєстрація в ChatGPT</div>
    </div>
    <div class="lesson-block-content">
        <p>ChatGPT — основна платформа для AI-асистентів програми.</p>
        <ol>
            <li>Перейдіть на <a href="https://chat.openai.com" target="_blank" style="color: var(--primary); font-weight: 600;">chat.openai.com</a></li>
            <li>Натисніть <strong>"Sign up"</strong> (або "Log in" якщо вже є акаунт)</li>
            <li>Зареєструйтесь через Google, Microsoft або email</li>
            <li>Підтвердіть email якщо потрібно</li>
        </ol>
        <div style="margin-top: 12px;">
            <a href="https://chat.openai.com" target="_blank" class="action-btn primary">
                
                Відкрити ChatGPT
            </a>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 2. Реєстрація в Claude AI</div>
    </div>
    <div class="lesson-block-content">
        <p>Claude AI — додатковий інструмент для складних задач.</p>
        <ol>
            <li>Перейдіть на <a href="https://claude.ai" target="_blank" style="color: var(--primary); font-weight: 600;">claude.ai</a></li>
            <li>Натисніть <strong>"Sign up"</strong></li>
            <li>Зареєструйтесь через Google або email</li>
            <li>Підтвердіть номер телефону (одноразово)</li>
        </ol>
        <div style="margin-top: 12px;">
            <a href="https://claude.ai" target="_blank" class="action-btn outline">
                
                Відкрити Claude AI
            </a>
        </div>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Важливо про VPN</div>
    </div>
    <div class="lesson-block-content">
        <p>Якщо сайти не відкриваються — увімкніть <strong>VPN</strong> (США, Європа, Канада).</p>
        <p style="margin-top: 8px;">Рекомендовані VPN: NordVPN, ExpressVPN, Surfshark або безкоштовні розширення для браузера.</p>
    </div>
</div>

<div class="lesson-block success">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Перевірка доступу</div>
    </div>
    <div class="lesson-block-content">
        <p>Після реєстрації перевірте, що все працює:</p>
        <ol>
            <li>Відкрийте будь-якого AI-асистента з програми</li>
            <li>Якщо відкривається діалог — все готово!</li>
            <li>Якщо просить авторизацію — увійдіть в акаунт</li>
        </ol>
    </div>
</div>
                `,

                lessonContent_ru: `<div class="lesson-block intro">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Почему это важно прежде всего</div>
    </div>
    <div class="lesson-block-content">
        <p>90% обучения не работает — не потому что люди глупые, а потому что отсутствует технология.</p>
        <p style="margin-top:8px;">Автошкола: несколько недель → человек едет. Университет: 5 лет → человек не может работать по специальности. <strong>В чём разница?</strong> Технология — это последовательность действий, которая даёт предсказуемый результат.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Закон обучения: воспроизведение → понимание → результат</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Запомнить ≠ понять.</strong> Настоящее знание не требует вспоминания — вы просто знаете, как знаете что огонь горячий.</p>
        <p style="margin-top:8px;">Главная причина неудач в обучении — <strong>непонятное слово</strong>. Одно пропущенное слово останавливает понимание всей темы. Как дырка в стене — можно красить слой за слоем, но дырка никуда не денется.</p>
        <ul style="margin-top:8px;">
            <li>Скучно и хочется отвлечься → есть непонятное слово</li>
            <li>Ощущение "что-то не укладывается" → есть непонятное слово</li>
            <li>Проблема всегда <strong>раньше</strong> — в предыдущем материале</li>
        </ul>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Что такое концепт и почему он важнее определения</div>
    </div>
    <div class="lesson-block-content">
        <p>Концепт — это идея в вашем уме, а не запомненное определение. <strong>Концепт нельзя запомнить — его можно только создать.</strong></p>
        <p style="margin-top:8px;">Пример: "план" для руководителя продаж = цифра которую хочу достичь. Для владельца = последовательность конкретных действий. Одно слово — два разных концепта — полное непонимание.</p>
        <p style="margin-top:8px;"><strong>Правило:</strong> никогда не спрашивайте значение слов у людей — они дают ложные определения. Используйте словарь или AI.</p>
    </div>
</div>

<div class="lesson-block">
    <div class="lesson-block-header">
        <div class="lesson-block-title">Навык = автоматизм через повторение</div>
    </div>
    <div class="lesson-block-content">
        <p>Понимание — это ещё не навык. Знать грамматику ≠ говорить на языке.</p>
        <p style="margin-top:8px;">Навык — это автоматизм: первые 30 часов за рулём — стресс и внимание на педалях. После — слушаешь музыку и едешь. Так же с управлением: первый раз отдать распоряжение — страшно. После 100 раз — естественно.</p>
        <p style="margin-top:8px;"><strong>Важно учиться сразу правильно</strong> — неправильный автоматизм будет мешать всю жизнь.</p>
    </div>
</div>

<div class="result-block">
    <strong>Ваше задание сейчас:</strong> прояснить первые 13 терминов программы через AI ассистента ниже. Только 13 — не больше. Ассистент может предложить идти дальше — остановитесь на 13-м.
</div>`,
                
                homework: `
<div class="lesson-block homework">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Домашнє завдання</div>
    </div>
    <div class="lesson-block-content">
        <div style="display: grid; gap: 12px; margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">1</span>
                <span style="flex: 1; min-width: 150px;">Зареєструйтесь в ChatGPT</span>
                <a href="https://chat.openai.com" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none;">Відкрити</a>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">2</span>
                <span style="flex: 1; min-width: 150px;">Зареєструйтесь в Claude AI</span>
                <a href="https://claude.ai" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none;">Відкрити</a>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">3</span>
                <span>Якщо обидва сайти відкриваються — готово!</span>
            </div>
        </div>
        <div style="padding: 16px; background: #f0fdf4; border-radius: 10px; border: 2px solid #22c55e;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                
                <span style="font-weight: 700; color: #166534; font-size: 15px;">НАПИШІТЬ «ГОТОВО»</span>
                
            </div>
            <textarea placeholder="Готово" style="width: 100%; min-height: 50px; padding: 12px; border: 1px solid #22c55e; border-radius: 8px; font-family: inherit; font-size: 14px; resize: vertical; background: white;"></textarea>
        </div>
    </div>
</div>
                `,

                homework_ru: `
<div class="lesson-block homework">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Домашнее задание</div>
    </div>
    <div class="lesson-block-content">
        <div style="display: grid; gap: 12px; margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">1</span>
                <span style="flex: 1; min-width: 150px;">Зарегистрируйтесь в ChatGPT</span>
                <a href="https://chat.openai.com" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none;">Открыть</a>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">2</span>
                <span style="flex: 1; min-width: 150px;">Зарегистрируйтесь в Claude AI</span>
                <a href="https://claude.ai" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none;">Открыть</a>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">3</span>
                <span>Если оба сайта открываются — готово!</span>
            </div>
        </div>
        <div style="padding: 16px; background: #f0fdf4; border-radius: 10px; border: 2px solid #22c55e;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                
                <span style="font-weight: 700; color: #166534; font-size: 15px;">НАПИШИТЕ «ГОТОВО»</span>
                
            </div>
            <textarea placeholder="Готово" style="width: 100%; min-height: 50px; padding: 12px; border: 1px solid #22c55e; border-radius: 8px; font-family: inherit; font-size: 14px; resize: vertical; background: white;"></textarea>
        </div>
    </div>
</div>
                `,
                
                homeworkLink: "https://chat.openai.com",
                homeworkLinkName: "→ Відкрити ChatGPT",
                homeworkLinkName_ru: "→ Открыть ChatGPT",
                time: 10
            },
            {
                id: 4,
                title: "СИСТЕМА РОЗПОРЯДЖЕНЬ",
                title_ru: "СИСТЕМА РАСПОРЯЖЕНИЙ",
                subtitle: "Як ставити завдання так, щоб їх виконували",
                subtitle_ru: "Как ставить задачи так, чтобы их выполняли",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l4-section { margin-bottom:1.75rem; }
.l4-section:last-child { margin-bottom:0; }
.l4-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l4-rule { display:flex; align-items:flex-start; gap:0.85rem; padding:0.85rem 1rem; background:#f8fafc; border-radius:10px; border-left:3px solid #22c55e; margin-bottom:0.5rem; }
.l4-rule:last-child { margin-bottom:0; }
.l4-rule-icon { width:36px; height:36px; background:#f0fdf4; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:0.1rem; }
.l4-rule-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l4-rule-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l4-grid7 { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
.l4-cell { padding:0.7rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; }
.l4-cell-label { font-size:0.68rem; font-weight:700; color:#16a34a; letter-spacing:0.07em; margin-bottom:0.2rem; }
.l4-cell-text { font-size:0.82rem; color:#374151; line-height:1.4; }
.l4-example { border-radius:10px; padding:0.9rem 1rem; }
.l4-example-bad { background:#fef2f2; border:1px solid #fecaca; margin-bottom:0.5rem; }
.l4-example-good { background:#f0fdf4; border:1px solid #bbf7d0; }
.l4-example-label { display:flex; align-items:center; gap:0.45rem; margin-bottom:0.5rem; font-weight:700; font-size:0.8rem; }
.l4-example-text { font-size:0.875rem; color:#374151; line-height:1.55; }
.l4-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l4-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l4-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l4-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l4-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l4-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l4-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l4-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.75rem; }
.l4-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.6rem; }
.l4-power { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem; margin-top:0.85rem; }
.l4-power-card { border-radius:11px; padding:0.9rem 0.6rem; text-align:center; }
.l4-power-num { font-size:1.5rem; font-weight:900; line-height:1.1; }
.l4-power-desc { font-size:0.75rem; color:#6b7280; margin-top:0.35rem; line-height:1.35; }
</style>

<div class="l4-section">
    <div class="l4-section-label">Вступ</div>
    <div class="l4-section-title">Чому більшість розпоряджень не виконується</div>
    <div class="l4-card">
        <p style="font-size:0.9rem;color:#374151;line-height:1.65;">Ви даєте завдання щодня. Через тиждень половина не виконана. Ви самі забуваєте що просили — співробітники теж.</p>
        <p style="font-size:0.9rem;color:#374151;line-height:1.65;margin-top:0.7rem;">У команді живе негласне правило: <strong>«Сказали раз і не нагадали — значить неважливо».</strong> Це не зла воля — це нормальна реакція людини, на яку звалюється купа задач.</p>
        <p style="font-size:0.9rem;color:#374151;line-height:1.65;margin-top:0.7rem;">Причина не в людях. Причина — у слабкій формі постановки задачі.</p>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Принцип</div>
    <div class="l4-section-title">Рівень влади визначає рівень виконання</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;">Є керівники, яким кажуть «тут душно» — і хтось одразу йде відкривати вікно. Є інші, які 10 разів нагадують «прибрати офіс» — і їх ігнорують. Різниця — не характер, а рівень влади.</p>
    <div class="l4-power">
        <div class="l4-power-card" style="background:#fef2f2;border:1px solid #fecaca;">
            <div class="l4-power-num" style="color:#ef4444;">1–10</div>
            <div class="l4-power-desc">Нагадуєте 10+ разів</div>
        </div>
        <div class="l4-power-card" style="background:#fff7ed;border:1px solid #fed7aa;">
            <div class="l4-power-num" style="color:#f97316;">40–60</div>
            <div class="l4-power-desc">Нагадуєте 2–3 рази</div>
        </div>
        <div class="l4-power-card" style="background:#f0fdf4;border:1px solid #bbf7d0;">
            <div class="l4-power-num" style="color:#22c55e;">80+</div>
            <div class="l4-power-desc">Сказали раз — виконали</div>
        </div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.55;margin-top:0.85rem;">Більшість власників зараз на рівні 20–30. Єдиний спосіб піднятися — систематично домагатися виконання кожного розпорядження. Кожне непроконтрольоване завдання — мінус до влади.</p>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Правила</div>
    <div class="l4-section-title">4 правила системи</div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
        <div>
            <div class="l4-rule-title">Тільки письмово</div>
            <div class="l4-rule-text">Усних розпоряджень не існує. Якщо сказали на нараді — одразу дублюйте письмово, навіть якщо треба взяти паузу.</div>
        </div>
    </div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div>
            <div class="l4-rule-title">Конкретна дата і час</div>
            <div class="l4-rule-text">«Скоро» і «пізніше» не існує. Без дедлайну завдання не буде виконано ніколи.</div>
        </div>
    </div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <div>
            <div class="l4-rule-title">Список усіх розпоряджень</div>
            <div class="l4-rule-text">Google таблиця: кому, що, термін, виконано. Без списку ви забуваєте контролювати — і руйнуєте свою владу.</div>
        </div>
    </div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div>
            <div class="l4-rule-title">Контроль на кожній зустрічі</div>
            <div class="l4-rule-text">Відкриваєте список і проходите по кожному пункту. Спокійно, без крику — поки не зрозуміють що ви не забудете.</div>
        </div>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Шаблон</div>
    <div class="l4-section-title">7 елементів правильного розпорядження</div>
    <div class="l4-grid7">
        <div class="l4-cell"><div class="l4-cell-label">КОМУ</div><div class="l4-cell-text">Конкретна посада + ПІБ. Не «відділу».</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ТЕРМІН</div><div class="l4-cell-text">Конкретна дата і час виконання</div></div>
        <div class="l4-cell"><div class="l4-cell-label">КОНТЕКСТ</div><div class="l4-cell-text">Чому, що змінилось, кого стосується</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ЗАВДАННЯ</div><div class="l4-cell-text">Конкретна дія + очікуваний результат</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ПРОДУКТ</div><div class="l4-cell-text">Що має бути готовим: документ, фото, звіт</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ЗВІТ</div><div class="l4-cell-text">Дедлайн звіту, формат, куди надсилати</div></div>
        <div class="l4-cell" style="grid-column:1/-1;"><div class="l4-cell-label">ДОКАЗ</div><div class="l4-cell-text">Скрін, файл або фото. Без доказу — не виконано.</div></div>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Приклад</div>
    <div class="l4-section-title">Неправильно vs Правильно</div>
    <div class="l4-example l4-example-bad">
        <div class="l4-example-label" style="color:#dc2626;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Неправильно
        </div>
        <div class="l4-example-text" style="color:#7f1d1d;font-style:italic;">«Прослідкуй, щоб усе було в порядку. Якщо будуть проблеми — повідом.»</div>
    </div>
    <div class="l4-example l4-example-good">
        <div class="l4-example-label" style="color:#16a34a;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
            Правильно
        </div>
        <div class="l4-example-text" style="color:#14532d;font-style:italic;">«До 13:00 перевірити 4 фото продукту, передати дизайнеру 5 банерів 1:5, надіслати звіт у Telegram до 19:00.»</div>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Інструмент</div>
    <div class="l4-tool">
        <div class="l4-tool-header">
            <div class="l4-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
                <div class="l4-tool-title">AI-генератор розпоряджень</div>
                <div class="l4-tool-desc">Опишіть завдання простими словами — система збере правильне розпорядження за шаблоном TALKO із 7 елементів.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-684be37e3bcc81918f64088a2bb094da-task-generator" target="_blank" class="l4-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Відкрити генератор
        </a>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l4-section { margin-bottom:1.75rem; }
.l4-section:last-child { margin-bottom:0; }
.l4-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l4-rule { display:flex; align-items:flex-start; gap:0.85rem; padding:0.85rem 1rem; background:#f8fafc; border-radius:10px; border-left:3px solid #22c55e; margin-bottom:0.5rem; }
.l4-rule:last-child { margin-bottom:0; }
.l4-rule-icon { width:36px; height:36px; background:#f0fdf4; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:0.1rem; }
.l4-rule-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l4-rule-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l4-grid7 { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
.l4-cell { padding:0.7rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; }
.l4-cell-label { font-size:0.68rem; font-weight:700; color:#16a34a; letter-spacing:0.07em; margin-bottom:0.2rem; }
.l4-cell-text { font-size:0.82rem; color:#374151; line-height:1.4; }
.l4-example { border-radius:10px; padding:0.9rem 1rem; }
.l4-example-bad { background:#fef2f2; border:1px solid #fecaca; margin-bottom:0.5rem; }
.l4-example-good { background:#f0fdf4; border:1px solid #bbf7d0; }
.l4-example-label { display:flex; align-items:center; gap:0.45rem; margin-bottom:0.5rem; font-weight:700; font-size:0.8rem; }
.l4-example-text { font-size:0.875rem; color:#374151; line-height:1.55; }
.l4-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l4-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l4-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l4-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l4-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l4-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l4-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l4-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.75rem; }
.l4-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.6rem; }
.l4-power { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem; margin-top:0.85rem; }
.l4-power-card { border-radius:11px; padding:0.9rem 0.6rem; text-align:center; }
.l4-power-num { font-size:1.5rem; font-weight:900; line-height:1.1; }
.l4-power-desc { font-size:0.75rem; color:#6b7280; margin-top:0.35rem; line-height:1.35; }
</style>

<div class="l4-section">
    <div class="l4-section-label">Введение</div>
    <div class="l4-section-title">Почему большинство распоряжений не выполняется</div>
    <div class="l4-card">
        <p style="font-size:0.9rem;color:#374151;line-height:1.65;">Вы даёте задания каждый день. Через неделю половина не выполнена. Вы сами забываете что просили — сотрудники тоже.</p>
        <p style="font-size:0.9rem;color:#374151;line-height:1.65;margin-top:0.7rem;">В команде живёт негласное правило: <strong>«Сказали раз и не напомнили — значит неважно».</strong> Это не злой умысел — это нормальная реакция человека, на которого валится куча задач.</p>
        <p style="font-size:0.9rem;color:#374151;line-height:1.65;margin-top:0.7rem;">Причина не в людях. Причина — в слабой форме постановки задачи.</p>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Принцип</div>
    <div class="l4-section-title">Уровень власти определяет уровень выполнения</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;">Есть руководители, которым говорят «здесь душно» — и кто-то сразу идёт открывать окно. Есть другие, которые 10 раз напоминают «убрать офис» — и их игнорируют. Разница — не характер, а уровень власти.</p>
    <div class="l4-power">
        <div class="l4-power-card" style="background:#fef2f2;border:1px solid #fecaca;">
            <div class="l4-power-num" style="color:#ef4444;">1–10</div>
            <div class="l4-power-desc">Напоминаете 10+ раз</div>
        </div>
        <div class="l4-power-card" style="background:#fff7ed;border:1px solid #fed7aa;">
            <div class="l4-power-num" style="color:#f97316;">40–60</div>
            <div class="l4-power-desc">Напоминаете 2–3 раза</div>
        </div>
        <div class="l4-power-card" style="background:#f0fdf4;border:1px solid #bbf7d0;">
            <div class="l4-power-num" style="color:#22c55e;">80+</div>
            <div class="l4-power-desc">Сказали раз — выполнили</div>
        </div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.55;margin-top:0.85rem;">Большинство владельцев сейчас на уровне 20–30. Единственный способ подняться — систематически добиваться выполнения каждого распоряжения. Каждое неконтролируемое задание — минус к власти.</p>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Правила</div>
    <div class="l4-section-title">4 правила системы</div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
        <div>
            <div class="l4-rule-title">Только письменно</div>
            <div class="l4-rule-text">Устных распоряжений не существует. Если сказали на совещании — сразу дублируйте письменно, даже если нужно взять паузу.</div>
        </div>
    </div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div>
            <div class="l4-rule-title">Конкретная дата и время</div>
            <div class="l4-rule-text">«Скоро» и «потом» не существует. Без дедлайна задание не будет выполнено никогда.</div>
        </div>
    </div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <div>
            <div class="l4-rule-title">Список всех распоряжений</div>
            <div class="l4-rule-text">Google таблица: кому, что, срок, выполнено. Без списка вы забываете контролировать — и разрушаете свою власть.</div>
        </div>
    </div>
    <div class="l4-rule">
        <div class="l4-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div>
            <div class="l4-rule-title">Контроль на каждой встрече</div>
            <div class="l4-rule-text">Открываете список и проходите по каждому пункту. Спокойно, без крика — пока не поймут, что вы не забудете.</div>
        </div>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Шаблон</div>
    <div class="l4-section-title">7 элементов правильного распоряжения</div>
    <div class="l4-grid7">
        <div class="l4-cell"><div class="l4-cell-label">КОМУ</div><div class="l4-cell-text">Конкретная должность + ФИО. Не «отделу».</div></div>
        <div class="l4-cell"><div class="l4-cell-label">СРОК</div><div class="l4-cell-text">Конкретная дата и время выполнения</div></div>
        <div class="l4-cell"><div class="l4-cell-label">КОНТЕКСТ</div><div class="l4-cell-text">Почему, что изменилось, кого касается</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ЗАДАНИЕ</div><div class="l4-cell-text">Конкретное действие + ожидаемый результат</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ПРОДУКТ</div><div class="l4-cell-text">Что должно быть готово: документ, фото, отчёт</div></div>
        <div class="l4-cell"><div class="l4-cell-label">ОТЧЁТ</div><div class="l4-cell-text">Дедлайн отчёта, формат, куда отправлять</div></div>
        <div class="l4-cell" style="grid-column:1/-1;"><div class="l4-cell-label">ДОКАЗАТЕЛЬСТВО</div><div class="l4-cell-text">Скрин, файл или фото. Без доказательства — не выполнено.</div></div>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Пример</div>
    <div class="l4-section-title">Неправильно vs Правильно</div>
    <div class="l4-example l4-example-bad">
        <div class="l4-example-label" style="color:#dc2626;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Неправильно
        </div>
        <div class="l4-example-text" style="color:#7f1d1d;font-style:italic;">«Проследи, чтобы всё было в порядке. Если будут проблемы — сообщи.»</div>
    </div>
    <div class="l4-example l4-example-good">
        <div class="l4-example-label" style="color:#16a34a;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
            Правильно
        </div>
        <div class="l4-example-text" style="color:#14532d;font-style:italic;">«До 13:00 проверить 4 фото продукта, передать дизайнеру 5 баннеров 1:5, отправить отчёт в Telegram до 19:00.»</div>
    </div>
</div>

<div class="l4-divider"></div>

<div class="l4-section">
    <div class="l4-section-label">Инструмент</div>
    <div class="l4-tool">
        <div class="l4-tool-header">
            <div class="l4-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
                <div class="l4-tool-title">AI-генератор распоряжений</div>
                <div class="l4-tool-desc">Опишите задание простыми словами — система составит правильное распоряжение по шаблону TALKO с 7 элементами.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-684be37e3bcc81918f64088a2bb094da-task-generator" target="_blank" class="l4-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Открыть генератор
        </a>
    </div>
</div>`,

                homework: `<ol><li>Складіть одне реальне розпорядження для співробітника</li><li>Перевірте, чи є всі 7 елементів</li><li>Відправте його реальному співробітнику</li><li>Напишіть, кому і яке розпорядження ви відправили</li></ol>`,
                homework_ru: `<ol><li>Составьте одно реальное распоряжение для сотрудника</li><li>Проверьте, есть ли все 7 элементов</li><li>Отправьте его реальному сотруднику</li><li>Напишите, кому и какое распоряжение вы отправили</li></ol>`,

                homeworkLink: null,
                homeworkLinkName: null,
                homeworkLinkName_ru: null,
                time: 15

            },
            {
                id: 5,
                title: "СИСТЕМА РАДАР",
                title_ru: "СИСТЕМА РАДАР",
                subtitle: "Як перестати бути «пожежником» для власної команди",
                subtitle_ru: "Как перестать быть «пожарным» для собственной команды",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l5-section { margin-bottom:1.75rem; }
.l5-section:last-child { margin-bottom:0; }
.l5-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l5-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l5-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l5-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l5-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l5-card p+p { margin-top:0.7rem; }
.l5-flow { display:flex; align-items:center; gap:0; border-radius:10px; overflow:hidden; margin:0.85rem 0; }
.l5-flow-item { flex:1; text-align:center; padding:0.75rem 0.4rem; background:#f0fdf4; border:1px solid #bbf7d0; }
.l5-flow-item.active { background:#22c55e; border-color:#22c55e; }
.l5-flow-item span { display:block; font-weight:700; font-size:0.8rem; }
.l5-flow-item.active span { color:white; }
.l5-flow-item span { color:#166534; }
.l5-flow-arrow { padding:0 0.2rem; color:#22c55e; font-weight:700; font-size:1rem; flex-shrink:0; }
.l5-block-list { display:grid; gap:0.55rem; margin-top:0.75rem; }
.l5-block-item { display:flex; align-items:flex-start; gap:0.8rem; padding:0.8rem 0.95rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l5-block-icon { width:34px; height:34px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l5-block-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l5-block-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l5-before-after { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-top:0.75rem; }
.l5-before { padding:0.85rem 0.95rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; }
.l5-after { padding:0.85rem 0.95rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; }
.l5-ba-label { font-size:0.7rem; font-weight:700; letter-spacing:0.06em; margin-bottom:0.5rem; }
.l5-ba-text { font-size:0.82rem; line-height:1.5; }
.l5-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l5-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l5-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l5-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l5-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l5-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l5-steps { display:grid; gap:0.5rem; margin-top:0.75rem; counter-reset:l5step; }
.l5-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 0.95rem; background:#f8fafc; border-radius:10px; counter-increment:l5step; }
.l5-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; }
.l5-step-text { font-size:0.875rem; color:#374151; line-height:1.5; padding-top:0.1rem; }
.l5-rule-box { margin-top:1rem; padding:1rem 1.1rem; background:linear-gradient(135deg,#f0fdf4,#dcfce7); border:1px solid #bbf7d0; border-radius:12px; }
.l5-rule-title { font-weight:700; color:#166534; font-size:0.875rem; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem; }
.l5-rule-text { font-size:0.85rem; color:#15803d; line-height:1.6; }
</style>

<div class="l5-section">
    <div class="l5-section-label">Проблема</div>
    <div class="l5-section-title">Керівник, який вирішує все сам — найдорожчий виконавець у компанії</div>
    <div class="l5-card">
        <p>У більшості компаній одна і та сама проблема повторюється щодня. Співробітник приходить до керівника не з рішенням, а з питанням:</p>
        <div style="margin:0.85rem 0;display:grid;gap:0.4rem;">
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Клієнт просить знижку. Що робити?</div>
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Постачальник затримує. Як бути?</div>
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Треба щось купити. Можна?</div>
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Хочу у відпустку. Погодьте.</div>
        </div>
        <p>На перший погляд здається — нормально. Але саме тут починається перевантаження керівника. Коли він постійно приймає чужі проблеми і сам їх вирішує, він перестає бути керівником і стає просто найдорожчим виконавцем у компанії.</p>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Помилка</div>
    <div class="l5-section-title">Основна помилка — приймати проблему в чистому вигляді</div>
    <div class="l5-card">
        <p>Коли підлеглий приносить проблему без аналізу, без даних і без запропонованого рішення — він фактично перекладає відповідальність наверх.</p>
        <p>Якщо керівник у цей момент одразу відповідає, що робити, відбуваються дві речі: керівник ще більше перевантажує себе, а співробітник стає менш відповідальним.</p>
        <p>Кожен раз, коли керівник вирішує проблему <em>за</em> співробітника, він знижує його рівень відповідальності.</p>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Рішення</div>
    <div class="l5-section-title">Що таке ЗРС — Закінчена робота співробітника</div>
    <div class="l5-card">
        <p>ЗРС — це принцип, за яким співробітник несе до керівника вже не «сиру проблему», а підготовлену управлінську одиницю.</p>
    </div>
    <div class="l5-flow" style="margin-top:0.85rem;">
        <div class="l5-flow-item"><span>Ситуація</span><span style="font-size:0.72rem;color:#6b7280;font-weight:400;margin-top:0.2rem;">що сталося</span></div>
        <div class="l5-flow-arrow">→</div>
        <div class="l5-flow-item"><span>Дані</span><span style="font-size:0.72rem;color:#6b7280;font-weight:400;margin-top:0.2rem;">факти і цифри</span></div>
        <div class="l5-flow-arrow">→</div>
        <div class="l5-flow-item active"><span>Рішення</span><span style="font-size:0.72rem;color:rgba(255,255,255,0.85);font-weight:400;margin-top:0.2rem;">пропозиція</span></div>
    </div>
    <p style="font-size:0.82rem;color:#525252;margin-top:0.75rem;line-height:1.5;">ЗРС = проблема, яку вже пропрацювали до рівня рішення. Не питання до керівника, а готова пропозиція на схвалення або відхилення.</p>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Методологія</div>
    <div class="l5-section-title">З чого складається ЗРС</div>
    <div class="l5-block-list">
        <div class="l5-block-item">
            <div class="l5-block-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
                <div class="l5-block-title">Ситуація</div>
                <div class="l5-block-text">Не «щось не так», а конкретне відхилення від норми. Наприклад: «підйомник зламався, а сьогодні має бути відвантаження» або «клієнт просить знижку і є ризик втрати контракту».</div>
            </div>
        </div>
        <div class="l5-block-item">
            <div class="l5-block-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
                <div class="l5-block-title">Дані</div>
                <div class="l5-block-text">Вся інформація, якої достатньо для прийняття рішення без додаткового допиту. Цифри, альтернативи, строки, наслідки, порівняння, вартість — все що прибирає туман.</div>
            </div>
        </div>
        <div class="l5-block-item">
            <div class="l5-block-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
                <div class="l5-block-title">Рішення</div>
                <div class="l5-block-text">Не «що робити?», а «я пропоную зробити ось так». Конкретно: що саме, хто робить, коли, за які гроші, на яких умовах.</div>
            </div>
        </div>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Ефект</div>
    <div class="l5-section-title">Що ЗРС змінює в команді</div>
    <div class="l5-before-after">
        <div class="l5-before">
            <div class="l5-ba-label" style="color:#dc2626;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                БЕЗ ЗРС
            </div>
            <div class="l5-ba-text" style="color:#7f1d1d;">
                Один запит — 10–15 хвилин уточнень, розмов, перепитувань. Керівник думає за співробітника.
            </div>
        </div>
        <div class="l5-after">
            <div class="l5-ba-label" style="color:#16a34a;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                З ЗРС
            </div>
            <div class="l5-ba-text" style="color:#14532d;">
                1 хвилина: схвалити / відхилити / повернути на доопрацювання. Рішення задокументоване.
            </div>
        </div>
    </div>
    <div style="display:grid;gap:0.5rem;margin-top:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Знімає перевантаження з керівника
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Підвищує відповідальність співробітників
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Формує управлінське мислення в команді
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Захищає обидві сторони — рішення задокументоване
        </div>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">AI-асистент</div>
    <div class="l5-section-title">Чому AI повинен стояти між співробітником і керівником</div>
    <div class="l5-card">
        <p>Навіть якщо ти пояснив методологію, співробітники ще якийсь час будуть приносити «сире». Не тому що погані — а тому що не звикли думати в цьому форматі.</p>
        <p>Саме тут потрібен AI-асистент. Його роль — не замінити керівника. Його роль — не пустити до керівника сире питання.</p>
    </div>
    <div class="l5-before-after" style="margin-top:0.85rem;">
        <div class="l5-before" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0.3rem;">
            <div class="l5-ba-label" style="color:#dc2626;">Було</div>
            <div style="font-size:0.82rem;color:#7f1d1d;line-height:1.5;">Співробітник → Керівник</div>
        </div>
        <div class="l5-after" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0.3rem;">
            <div class="l5-ba-label" style="color:#16a34a;">Стає</div>
            <div style="font-size:0.82rem;color:#14532d;line-height:1.6;">Співробітник → AI → ЗРС → Керівник</div>
        </div>
    </div>
    <p style="font-size:0.82rem;color:#525252;margin-top:0.75rem;line-height:1.5;">AI веде людину поетапно: виявляє ситуацію → добирає відсутні дані → змушує сформулювати рішення → збирає все у готову ЗРС. На виході — готовий текст: Ситуація / Дані / Рішення.</p>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Інструмент підготовки управлінського рішення</div>
    <div class="l5-tool">
        <div class="l5-tool-header">
            <div class="l5-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M12 15h.01M16 15h.01"/></svg>
            </div>
            <div>
                <div class="l5-tool-title">AI-асистент ЗРС</div>
                <div class="l5-tool-desc">Цей асистент працює за методологією «Закінчена робота співробітника». Перед тим як звернутися до керівника з питанням, співробітник проходить через асистента — описує ситуацію, збирає дані, формулює рішення.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-684bb075301481918669f787231e1af7-radar-ai-alex-talko" target="_blank" class="l5-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Відкрити AI-асистента ЗРС
        </a>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Тестування</div>
    <div class="l5-section-title">Як протестувати інструмент самому</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">Перш ніж дати це команді — протестуйте самі. Візьміть 5–10 реальних ситуацій, які зазвичай летять до вас:</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-bottom:0.85rem;">
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Клієнт просить знижку</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Співробітник хоче у відпустку</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Треба закупити матеріали</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Зірвався дедлайн</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Потрібен новий співробітник</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Обладнання зламалось</div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.5;">Асистент хороший, якщо після нього у вас не виникає 10 додаткових запитань. Якщо він не вимагає цифр і фактів — він поганий.</p>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Впровадження</div>
    <div class="l5-section-title">Як дати команді на використання</div>
    <div class="l5-steps">
        <div class="l5-step">
            <div class="l5-step-num">1</div>
            <div class="l5-step-text">Поясніть команді логіку: відтепер ми не носимо проблеми в сирому вигляді — ми носимо ЗРС. AI допомагає зробити це правильно.</div>
        </div>
        <div class="l5-step">
            <div class="l5-step-num">2</div>
            <div class="l5-step-text">Визначте, для яких типів запитів це обов'язково: знижки, закупівлі, відпустки, найм, нестандартні ситуації, зміни в процесах.</div>
        </div>
        <div class="l5-step">
            <div class="l5-step-num">3</div>
            <div class="l5-step-text">Введіть стандарт відповіді: якщо співробітник приходить без ЗРС — ви не вирішуєте питання. Відповідаєте: «Оформи через ЗРС і повернись з готовою пропозицією».</div>
        </div>
        <div class="l5-step">
            <div class="l5-step-num">4</div>
            <div class="l5-step-text">На старті перевіряйте жорстко. Перші 2–3 тижні система ламається якщо ви почнете «ну окей, цього разу скажу усно». Або ЗРС — або повернення на доопрацювання.</div>
        </div>
    </div>
    <div class="l5-rule-box">
        <div class="l5-rule-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="1.75" width="16" height="16"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            Правило для команди
        </div>
        <div class="l5-rule-text">Будь-яке питання, проблема, запит на погодження, закупівлю, найм, відпустку або нестандартна ситуація — спочатку проходить через AI-асистента ЗРС. До керівника ви приходите вже не з проблемою, а з готовою ЗРС.</div>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l5-section { margin-bottom:1.75rem; }
.l5-section:last-child { margin-bottom:0; }
.l5-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l5-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l5-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l5-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l5-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l5-card p+p { margin-top:0.7rem; }
.l5-flow { display:flex; align-items:center; gap:0; border-radius:10px; overflow:hidden; margin:0.85rem 0; }
.l5-flow-item { flex:1; text-align:center; padding:0.75rem 0.4rem; background:#f0fdf4; border:1px solid #bbf7d0; }
.l5-flow-item.active { background:#22c55e; border-color:#22c55e; }
.l5-flow-item span { display:block; font-weight:700; font-size:0.8rem; color:#166534; }
.l5-flow-item.active span { color:white; }
.l5-flow-arrow { padding:0 0.2rem; color:#22c55e; font-weight:700; font-size:1rem; flex-shrink:0; }
.l5-block-list { display:grid; gap:0.55rem; margin-top:0.75rem; }
.l5-block-item { display:flex; align-items:flex-start; gap:0.8rem; padding:0.8rem 0.95rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l5-block-icon { width:34px; height:34px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l5-block-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l5-block-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l5-before-after { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-top:0.75rem; }
.l5-before { padding:0.85rem 0.95rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; }
.l5-after { padding:0.85rem 0.95rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; }
.l5-ba-label { font-size:0.7rem; font-weight:700; letter-spacing:0.06em; margin-bottom:0.5rem; }
.l5-ba-text { font-size:0.82rem; line-height:1.5; }
.l5-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l5-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l5-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l5-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l5-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l5-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l5-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l5-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l5-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; }
.l5-step-text { font-size:0.875rem; color:#374151; line-height:1.5; padding-top:0.1rem; }
.l5-rule-box { margin-top:1rem; padding:1rem 1.1rem; background:linear-gradient(135deg,#f0fdf4,#dcfce7); border:1px solid #bbf7d0; border-radius:12px; }
.l5-rule-title { font-weight:700; color:#166534; font-size:0.875rem; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem; }
.l5-rule-text { font-size:0.85rem; color:#15803d; line-height:1.6; }
</style>

<div class="l5-section">
    <div class="l5-section-label">Проблема</div>
    <div class="l5-section-title">Руководитель, который решает всё сам — самый дорогой исполнитель в компании</div>
    <div class="l5-card">
        <p>В большинстве компаний одна и та же проблема повторяется каждый день. Сотрудник приходит к руководителю не с решением, а с вопросом:</p>
        <div style="margin:0.85rem 0;display:grid;gap:0.4rem;">
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Клиент просит скидку. Что делать?</div>
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Поставщик задерживает. Как быть?</div>
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Нужно что-то купить. Можно?</div>
            <div style="padding:0.55rem 0.85rem;background:white;border:1px solid #e2e8f0;border-radius:8px;font-size:0.85rem;color:#374151;">— Хочу в отпуск. Согласуйте.</div>
        </div>
        <p>На первый взгляд кажется — нормально. Но именно здесь начинается перегрузка руководителя. Когда он постоянно принимает чужие проблемы и сам их решает, он перестаёт быть руководителем и становится просто самым дорогим исполнителем в компании.</p>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Ошибка</div>
    <div class="l5-section-title">Основная ошибка — принимать проблему в чистом виде</div>
    <div class="l5-card">
        <p>Когда подчинённый приносит проблему без анализа, без данных и без предложенного решения — он фактически перекладывает ответственность наверх.</p>
        <p>Если руководитель в этот момент сразу отвечает, что делать, происходят две вещи: руководитель ещё больше перегружает себя, а сотрудник становится менее ответственным.</p>
        <p>Каждый раз, когда руководитель решает проблему <em>за</em> сотрудника, он снижает его уровень ответственности.</p>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Решение</div>
    <div class="l5-section-title">Что такое ЗРС — Законченная работа сотрудника</div>
    <div class="l5-card">
        <p>ЗРС — это принцип, по которому сотрудник несёт к руководителю уже не «сырую проблему», а подготовленную управленческую единицу.</p>
    </div>
    <div class="l5-flow" style="margin-top:0.85rem;">
        <div class="l5-flow-item"><span>Ситуация</span><span style="font-size:0.72rem;color:#6b7280;font-weight:400;margin-top:0.2rem;">что случилось</span></div>
        <div class="l5-flow-arrow">→</div>
        <div class="l5-flow-item"><span>Данные</span><span style="font-size:0.72rem;color:#6b7280;font-weight:400;margin-top:0.2rem;">факты и цифры</span></div>
        <div class="l5-flow-arrow">→</div>
        <div class="l5-flow-item active"><span>Решение</span><span style="font-size:0.72rem;color:rgba(255,255,255,0.85);font-weight:400;margin-top:0.2rem;">предложение</span></div>
    </div>
    <p style="font-size:0.82rem;color:#525252;margin-top:0.75rem;line-height:1.5;">ЗРС = проблема, которую уже проработали до уровня решения. Не вопрос к руководителю, а готовое предложение на утверждение или отклонение.</p>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Методология</div>
    <div class="l5-section-title">Из чего состоит ЗРС</div>
    <div class="l5-block-list">
        <div class="l5-block-item">
            <div class="l5-block-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
                <div class="l5-block-title">Ситуация</div>
                <div class="l5-block-text">Не «что-то не так», а конкретное отклонение от нормы. Например: «подъёмник сломался, а сегодня должна быть отгрузка» или «клиент просит скидку и есть риск потери контракта».</div>
            </div>
        </div>
        <div class="l5-block-item">
            <div class="l5-block-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
                <div class="l5-block-title">Данные</div>
                <div class="l5-block-text">Вся информация, которой достаточно для принятия решения без дополнительных вопросов. Цифры, альтернативы, сроки, последствия, сравнения, стоимость — всё что убирает туман.</div>
            </div>
        </div>
        <div class="l5-block-item">
            <div class="l5-block-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="18" height="18"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
                <div class="l5-block-title">Решение</div>
                <div class="l5-block-text">Не «что делать?», а «я предлагаю сделать вот так». Конкретно: что именно, кто делает, когда, за какие деньги, на каких условиях.</div>
            </div>
        </div>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Эффект</div>
    <div class="l5-section-title">Что ЗРС меняет в команде</div>
    <div class="l5-before-after">
        <div class="l5-before">
            <div class="l5-ba-label" style="color:#dc2626;">БЕЗ ЗРС</div>
            <div class="l5-ba-text" style="color:#7f1d1d;">Один запрос — 10–15 минут уточнений, разговоров, переспрашиваний. Руководитель думает за сотрудника.</div>
        </div>
        <div class="l5-after">
            <div class="l5-ba-label" style="color:#16a34a;">С ЗРС</div>
            <div class="l5-ba-text" style="color:#14532d;">1 минута: утвердить / отклонить / вернуть на доработку. Решение задокументировано.</div>
        </div>
    </div>
    <div style="display:grid;gap:0.5rem;margin-top:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Снимает перегрузку с руководителя
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Повышает ответственность сотрудников
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Формирует управленческое мышление в команде
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.85rem;background:#f8fafc;border-radius:9px;font-size:0.85rem;color:#374151;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Защищает обе стороны — решение задокументировано
        </div>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">AI-ассистент</div>
    <div class="l5-section-title">Почему AI должен стоять между сотрудником и руководителем</div>
    <div class="l5-card">
        <p>Даже если вы объяснили методологию, сотрудники ещё какое-то время будут приносить «сырое». Не потому что плохие — а потому что не привыкли думать в этом формате.</p>
        <p>Именно здесь нужен AI-ассистент. Его роль — не заменить руководителя. Его роль — не пустить к руководителю сырой вопрос.</p>
    </div>
    <div class="l5-before-after" style="margin-top:0.85rem;">
        <div class="l5-before" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0.3rem;">
            <div class="l5-ba-label" style="color:#dc2626;">Было</div>
            <div style="font-size:0.82rem;color:#7f1d1d;line-height:1.5;">Сотрудник → Руководитель</div>
        </div>
        <div class="l5-after" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0.3rem;">
            <div class="l5-ba-label" style="color:#16a34a;">Стало</div>
            <div style="font-size:0.82rem;color:#14532d;line-height:1.6;">Сотрудник → AI → ЗРС → Руководитель</div>
        </div>
    </div>
    <p style="font-size:0.82rem;color:#525252;margin-top:0.75rem;line-height:1.5;">AI ведёт человека поэтапно: выявляет ситуацию → добирает недостающие данные → заставляет сформулировать решение → собирает всё в готовую ЗРС. На выходе — готовый текст: Ситуация / Данные / Решение.</p>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Инструмент подготовки управленческого решения</div>
    <div class="l5-tool">
        <div class="l5-tool-header">
            <div class="l5-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M12 15h.01M16 15h.01"/></svg>
            </div>
            <div>
                <div class="l5-tool-title">AI-ассистент ЗРС</div>
                <div class="l5-tool-desc">Этот ассистент работает по методологии «Законченная работа сотрудника». Перед тем как обратиться к руководителю с вопросом, сотрудник проходит через ассистента — описывает ситуацию, собирает данные, формулирует решение.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-684bb075301481918669f787231e1af7-radar-ai-alex-talko" target="_blank" class="l5-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Открыть AI-ассистента ЗРС
        </a>
    </div>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Тестирование</div>
    <div class="l5-section-title">Как протестировать инструмент самому</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">Прежде чем дать это команде — протестируйте сами. Возьмите 5–10 реальных ситуаций, которые обычно летят к вам:</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-bottom:0.85rem;">
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Клиент просит скидку</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Сотрудник хочет в отпуск</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Нужно закупить материалы</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Сорвался дедлайн</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Нужен новый сотрудник</div>
        <div style="padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.82rem;color:#374151;">Оборудование сломалось</div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.5;">Ассистент хороший, если после него у вас не возникает 10 дополнительных вопросов. Если он не требует цифр и фактов — он плохой.</p>
</div>

<div class="l5-divider"></div>

<div class="l5-section">
    <div class="l5-section-label">Внедрение</div>
    <div class="l5-section-title">Как дать команде на использование</div>
    <div class="l5-steps">
        <div class="l5-step">
            <div class="l5-step-num">1</div>
            <div class="l5-step-text">Объясните команде логику: отныне мы не носим проблемы в сыром виде — мы носим ЗРС. AI помогает сделать это правильно.</div>
        </div>
        <div class="l5-step">
            <div class="l5-step-num">2</div>
            <div class="l5-step-text">Определите, для каких типов запросов это обязательно: скидки, закупки, отпуска, найм, нестандартные ситуации, изменения в процессах.</div>
        </div>
        <div class="l5-step">
            <div class="l5-step-num">3</div>
            <div class="l5-step-text">Введите стандарт ответа: если сотрудник приходит без ЗРС — вы не решаете вопрос. Отвечаете: «Оформи через ЗРС и вернись с готовым предложением».</div>
        </div>
        <div class="l5-step">
            <div class="l5-step-num">4</div>
            <div class="l5-step-text">На старте проверяйте жёстко. Первые 2–3 недели система ломается если вы начнёте «ну окей, на этот раз скажу устно». Или ЗРС — или возврат на доработку.</div>
        </div>
    </div>
    <div class="l5-rule-box">
        <div class="l5-rule-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="1.75" width="16" height="16"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            Правило для команды
        </div>
        <div class="l5-rule-text">Любой вопрос, проблема, запрос на согласование, закупку, найм, отпуск или нестандартная ситуация — сначала проходит через AI-ассистента ЗРС. К руководителю вы приходите уже не с проблемой, а с готовой ЗРС.</div>
    </div>
</div>`,

                homework: `<ol><li>Протестуйте AI-асистента на 3–5 реальних ситуаціях з вашого бізнесу</li><li>Оберіть 1 підлеглого і дайте йому інструмент у роботу</li><li>Попросіть перед наступним питанням пройти через AI</li><li>Напишіть у полі відповіді: для якої ролі впровадили і в яких ситуаціях будете використовувати</li></ol>`,
                homework_ru: `<ol><li>Протестируйте AI-ассистента на 3–5 реальных ситуациях из вашего бизнеса</li><li>Выберите 1 подчинённого и дайте ему инструмент в работу</li><li>Попросите перед следующим вопросом пройти через AI</li><li>Напишите в поле ответа: для какой роли внедрили и в каких ситуациях будете использовать</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-684bb075301481918669f787231e1af7-radar-ai-alex-talko",
                homeworkLinkName: "→ AI-асистент ЗРС",
                homeworkLinkName_ru: "→ AI-ассистент ЗРС",
                time: 20

            },
            {
                id: 6,
                title: "ТЕХНІЧНИЙ ПРОВІДНИК",
                title_ru: "ТЕХНИЧЕСКИЙ ПРОВОДНИК",
                subtitle: "AI-інструмент для покрокового налаштування технічних рішень",
                subtitle_ru: "AI-инструмент для пошагового внедрения технических решений",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l6-section { margin-bottom:1.75rem; }
.l6-section:last-child { margin-bottom:0; }
.l6-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l6-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l6-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l6-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l6-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l6-card p+p { margin-top:0.7rem; }
.l6-use-grid { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l6-use-item { display:flex; align-items:flex-start; gap:0.7rem; padding:0.75rem 0.9rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l6-use-icon { width:32px; height:32px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l6-use-text { font-size:0.875rem; color:#374151; line-height:1.5; padding-top:0.1rem; }
.l6-task-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l6-task-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l6-task-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l6-task-text { font-size:0.875rem; color:#374151; line-height:1.5; }
.l6-task-example { margin-top:0.5rem; padding:0.5rem 0.75rem; background:white; border:1px solid #e2e8f0; border-radius:7px; font-size:0.8rem; color:#6b7280; font-style:italic; }
.l6-instead { display:grid; gap:0.4rem; margin-top:0.75rem; }
.l6-instead-item { display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.85rem; background:#fef2f2; border-radius:8px; font-size:0.85rem; color:#7f1d1d; }
.l6-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l6-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l6-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l6-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l6-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l6-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l6-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l6-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f8fafc; border-radius:9px; font-size:0.875rem; color:#374151; }
</style>

<div class="l6-section">
    <div class="l6-section-label">Що це</div>
    <div class="l6-section-title">Технічний провідник — покроково до готового результату</div>
    <div class="l6-card">
        <p>Технічний провідник — це AI-інструмент, який допомагає налаштовувати типові технічні рішення для бізнесу без плутанини і хаосу.</p>
        <p>Ви просто описуєте, який результат хочете отримати — і провідник веде вас крок за кроком: що зробити, куди натиснути, що перевірити, що виправити якщо щось не працює.</p>
    </div>
    <div class="l6-use-grid">
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
            <div class="l6-use-text">Налаштування CRM та воронки продажів</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
            <div class="l6-use-text">Створення таблиць і дашбордів у Google Sheets</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></div>
            <div class="l6-use-text">Базові автоматизації і організація робочих інструментів</div>
        </div>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Коли відкривати</div>
    <div class="l6-section-title">Коли використовувати Технічного провідника</div>
    <div class="l6-use-grid">
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg></div>
            <div class="l6-use-text">Потрібно швидко налаштувати інструмент і не знаєте, з чого почати</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
            <div class="l6-use-text">Не хочеться витрачати час на пошук інструкцій у Google і YouTube</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
            <div class="l6-use-text">Потрібно дійти до робочого результату без залучення технічного спеціаліста</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div class="l6-use-text">Щось не працює і незрозуміло, де саме проблема</div>
        </div>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Для чого</div>
    <div class="l6-section-title">Щоб технічні налаштування не зупиняли вашу роботу</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.65rem;">Замість того щоб:</p>
    <div class="l6-instead">
        <div class="l6-instead-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Шукати рішення в Google і дивитися випадкові відео
        </div>
        <div class="l6-instead-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Писати технічним спеціалістам і чекати відповіді
        </div>
        <div class="l6-instead-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Відкладати задачу «на потім» бо не розумієте, що робити
        </div>
    </div>
    <p style="font-size:0.875rem;color:#374151;line-height:1.6;margin-top:0.85rem;">Ви просто відкриваєте інструмент і рухаєтесь до результату по кроках. Без зависань на технічних деталях.</p>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Інструмент</div>
    <div class="l6-tool">
        <div class="l6-tool-header">
            <div class="l6-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div>
                <div class="l6-tool-title">Технічний провідник</div>
                <div class="l6-tool-desc">AI-асистент для покрокового налаштування технічних рішень. Опишіть, що хочете отримати — і провідник проведе вас від старту до готового робочого результату.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-tekhnichnii-providnik" target="_blank" class="l6-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Відкрити Технічного провідника
        </a>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Ваше завдання</div>
    <div class="l6-section-title">Пройдіть реальну задачу до готового результату</div>
    <div class="l6-task-steps">
        <div class="l6-task-step">
            <div class="l6-task-num">1</div>
            <div class="l6-task-text">
                Відкрийте Технічного провідника і опишіть, що хочете отримати в результаті
                <div class="l6-task-example">«Налаштувати CRM для продажів» / «Створити дашборд у Google Sheets» / «Налаштувати просту автоматизацію для заявок»</div>
            </div>
        </div>
        <div class="l6-task-step">
            <div class="l6-task-num">2</div>
            <div class="l6-task-text">Якщо потрібно — додайте скрін. Провідник покаже, куди натискати або що виправити.</div>
        </div>
        <div class="l6-task-step">
            <div class="l6-task-num">3</div>
            <div class="l6-task-text">Пройдіть усі кроки до готового робочого результату.</div>
        </div>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Результат</div>
    <div class="l6-section-title">Після цього уроку у вас буде</div>
    <div class="l6-result-list">
        <div class="l6-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Протестований інструмент на реальній задачі
        </div>
        <div class="l6-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Розуміння, як швидко запускати технічні рішення без зависань
        </div>
        <div class="l6-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Інструмент, який можна використовувати для будь-якої наступної технічної задачі
        </div>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l6-section { margin-bottom:1.75rem; }
.l6-section:last-child { margin-bottom:0; }
.l6-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l6-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l6-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l6-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l6-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l6-card p+p { margin-top:0.7rem; }
.l6-use-grid { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l6-use-item { display:flex; align-items:flex-start; gap:0.7rem; padding:0.75rem 0.9rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l6-use-icon { width:32px; height:32px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l6-use-text { font-size:0.875rem; color:#374151; line-height:1.5; padding-top:0.1rem; }
.l6-task-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l6-task-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l6-task-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l6-task-text { font-size:0.875rem; color:#374151; line-height:1.5; }
.l6-task-example { margin-top:0.5rem; padding:0.5rem 0.75rem; background:white; border:1px solid #e2e8f0; border-radius:7px; font-size:0.8rem; color:#6b7280; font-style:italic; }
.l6-instead { display:grid; gap:0.4rem; margin-top:0.75rem; }
.l6-instead-item { display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.85rem; background:#fef2f2; border-radius:8px; font-size:0.85rem; color:#7f1d1d; }
.l6-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l6-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l6-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l6-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l6-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l6-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l6-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l6-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f8fafc; border-radius:9px; font-size:0.875rem; color:#374151; }
</style>

<div class="l6-section">
    <div class="l6-section-label">Что это</div>
    <div class="l6-section-title">Технический проводник — пошагово до готового результата</div>
    <div class="l6-card">
        <p>Технический проводник — это AI-инструмент, который помогает настраивать типовые технические решения для бизнеса без путаницы и хаоса.</p>
        <p>Вы просто описываете, какой результат хотите получить — и проводник ведёт вас шаг за шагом: что сделать, куда нажать, что проверить, что исправить если что-то не работает.</p>
    </div>
    <div class="l6-use-grid">
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
            <div class="l6-use-text">Настройка CRM и воронки продаж</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
            <div class="l6-use-text">Создание таблиц и дашбордов в Google Sheets</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></div>
            <div class="l6-use-text">Базовые автоматизации и организация рабочих инструментов</div>
        </div>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Когда открывать</div>
    <div class="l6-section-title">Когда использовать Технического проводника</div>
    <div class="l6-use-grid">
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg></div>
            <div class="l6-use-text">Нужно быстро настроить инструмент и непонятно, с чего начать</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
            <div class="l6-use-text">Не хочется тратить время на поиск инструкций в Google и YouTube</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
            <div class="l6-use-text">Нужно дойти до рабочего результата без привлечения технического специалиста</div>
        </div>
        <div class="l6-use-item">
            <div class="l6-use-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div class="l6-use-text">Что-то не работает и непонятно, где именно проблема</div>
        </div>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Для чего</div>
    <div class="l6-section-title">Чтобы технические настройки не останавливали вашу работу</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.65rem;">Вместо того чтобы:</p>
    <div class="l6-instead">
        <div class="l6-instead-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Искать решения в Google и смотреть случайные видео
        </div>
        <div class="l6-instead-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Писать техническим специалистам и ждать ответа
        </div>
        <div class="l6-instead-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Откладывать задачу «на потом» потому что не понятно, что делать
        </div>
    </div>
    <p style="font-size:0.875rem;color:#374151;line-height:1.6;margin-top:0.85rem;">Вы просто открываете инструмент и двигаетесь к результату по шагам. Без зависания на технических деталях.</p>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Инструмент</div>
    <div class="l6-tool">
        <div class="l6-tool-header">
            <div class="l6-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div>
                <div class="l6-tool-title">Технический проводник</div>
                <div class="l6-tool-desc">AI-ассистент для пошагового внедрения технических решений. Опишите, что хотите получить — и проводник проведёт вас от старта до готового рабочего результата.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-tekhnichnii-providnik" target="_blank" class="l6-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Открыть Технического проводника
        </a>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Ваше задание</div>
    <div class="l6-section-title">Пройдите реальную задачу до готового результата</div>
    <div class="l6-task-steps">
        <div class="l6-task-step">
            <div class="l6-task-num">1</div>
            <div class="l6-task-text">
                Откройте Технического проводника и опишите, что хотите получить в результате
                <div class="l6-task-example">«Настроить CRM для продаж» / «Создать дашборд в Google Sheets» / «Настроить простую автоматизацию для заявок»</div>
            </div>
        </div>
        <div class="l6-task-step">
            <div class="l6-task-num">2</div>
            <div class="l6-task-text">Если нужно — добавьте скрин. Проводник покажет, куда нажимать или что исправить.</div>
        </div>
        <div class="l6-task-step">
            <div class="l6-task-num">3</div>
            <div class="l6-task-text">Пройдите все шаги до готового рабочего результата.</div>
        </div>
    </div>
</div>

<div class="l6-divider"></div>

<div class="l6-section">
    <div class="l6-section-label">Результат</div>
    <div class="l6-section-title">После этого урока у вас будет</div>
    <div class="l6-result-list">
        <div class="l6-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Протестированный инструмент на реальной задаче
        </div>
        <div class="l6-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Понимание, как быстро запускать технические решения без зависаний
        </div>
        <div class="l6-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Инструмент, который можно использовать для любой следующей технической задачи
        </div>
    </div>
</div>`,

                homework: `<ol><li>Оберіть одну реальну технічну задачу і пройдіть її через Технічного провідника до готового результату</li><li>Напишіть у полі відповіді: яку задачу обрали, що вдалося налаштувати, який результат отримали</li></ol>`,
                homework_ru: `<ol><li>Выберите одну реальную техническую задачу и пройдите её через Технического проводника до готового результата</li><li>Напишите в поле ответа: какую задачу выбрали, что удалось настроить, какой результат получили</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-685640bc592881918743da9332b83f31-ai-alex-talko-tekhnichnii-providnik",
                homeworkLinkName: "→ Технічний провідник",
                homeworkLinkName_ru: "→ Технический проводник",
                time: 20
            },
            {
                id: 7,
                title: "ПІДГОТОВКА КОМАНДИ ДО ЗМІН",
                title_ru: "ПОДГОТОВКА КОМАНДЫ К ИЗМЕНЕНИЯМ",
                subtitle: "Як познайомити співробітників з проектом систематизації",
                subtitle_ru: "Как познакомить сотрудников с проектом систематизации",
                
                videoLink: null,
                materialsLink: null,
                
                lessonContent: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Навіщо цей урок</div>
    </div>
    <div class="lesson-block-content">
        <p>Коли власник починає зміни без узгодження з командою — виникає опір. Співробітники не розуміють <strong>навіщо</strong> зміни і <strong>до чого</strong> вони приведуть.</p>
        <p style="margin-top: 12px;">Цей урок допоможе правильно підготувати команду: пояснити суть змін, провести навчання і отримати підтримку ключових людей.</p>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">«Ой всьо…» — чому співробітники чинять опір?</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 12px 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px;">
            <p style="margin: 0;"><strong>Рекомендація:</strong> Якщо співробітник проявляє опір, образу або пасивну агресію — прочитайте цю статтю разом з ним. Нехай співробітник читає вголос.</p>
        </div>
        
        <details class="accordion-article" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <summary style="padding: 16px; background: #f9fafb; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; list-style: none;">
                
                Стаття: «Ой всьо…» або чому ваші співробітники не сприймають критику
            </summary>
            <div style="padding: 20px; background: white;">
                <h4 style="color: #dc2626; margin-bottom: 16px;">Знайома сцена?</h4>
                <p style="margin-bottom: 16px;">Ви спокійно кажете людині: «Ось тут треба підучитися. Ось так робити правильно».</p>
                <p style="margin-bottom: 16px;">І що у відповідь?</p>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li>кисле лице</li>
                    <li>образа</li>
                    <li>пасивна агресія</li>
                    <li>"ой всьо, я поняв(ла)"</li>
                    <li>мінімум дій, максимум емоцій</li>
                </ul>
                <p style="margin-bottom: 20px;">Хоча ви навіть не кричали.</p>
                
                <div style="padding: 16px; background: #fef2f2; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: 600;">Тут важливо зрозуміти одну неприємну річ:</p>
                    <p style="margin: 8px 0 0 0;">Більшість дорослих працює з психікою 12-річної дитини.<br>Виглядає 30+. Працює 20+. А реагує як школяр, якому вчитель сказав: "Треба підтягнути математику."</p>
                </div>
                
                <h4 style="margin-bottom: 12px;">Чому так?</h4>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">1. Бо вони плутають поради з нападом</p>
                    <p style="margin-bottom: 4px;"><strong>Доросла людина:</strong> "Я можу краще — дякую за уточнення."</p>
                    <p style="margin: 0;"><strong>Дитяча людина:</strong> "Ти сказав, що я поганий. Ой всьо."</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">2. Бо самооцінка крихка, як пластиковий стаканчик</p>
                    <p style="margin: 0;">Будь-яка ремарка = удар по «я хороший». Не витримує навіть легкий натяк, що щось можна зробити інакше. Слабка внутрішня опора → сильні зовнішні реакції.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">3. Бо їх ніхто не навчив розрізняти "я" і "мою дію"</p>
                    <p style="margin: 0;">"Ти зробив помилку" сприймається як "Ти — помилка." Людина з такою логікою приречена ображатися.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">4. Бо критика змушує дорослішати — а цього вони бояться</p>
                    <p style="margin-bottom: 8px;">Критика означає:</p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>визнати реальність</li>
                        <li>змінити поведінку</li>
                        <li>взяти відповідальність</li>
                    </ul>
                    <p style="margin: 8px 0 0 0;">Це боляче. Це дискомфортно. Це не дитяча модель. Тому включається: «ой всьо, я нічого не знаю, робіть самі»</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">5. Бо є глибока установка "я вже маю знати"</p>
                    <p style="margin: 0;">Дуже токсична. Якщо людина вірить, що вона повинна все вміти — то будь-яка порада = доказ слабкості. Не порадить — погано. Порада — теж погано. Парадокс інфантильності.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">6. Бо образа — це спосіб уникнути відповідальності</p>
                    <p style="margin: 0;">Коли працівник ображається, він знімає з себе вантаж дії. Образився → значить, він "жертва", а не виконавець. А жертва нічого не зобов'язана. Зручно. Неефективно. І дуже дорого для бізнесу.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">7. Бо ви говорите по-дорослому, а в них — дитячий фільтр</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Ваше:</strong> "Треба зробити ось так."</td>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Їхнє:</strong> "Мене принизили."</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Ваше:</strong> "Виправ помилку."</td>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Їхнє:</strong> "Мене не цінують."</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Ваше:</strong> "Потрібно навчатися."</td>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Їхнє:</strong> "Я недостатній."</td>
                        </tr>
                    </table>
                </div>
                
                <div style="padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="font-weight: 600; margin-bottom: 8px;">Гола правда</p>
                    <p style="margin: 0;">Не кожен працівник може працювати в компанії, де є стандарти, регламенти, інструкції і чіткі вимоги. Не тому, що вони «погані». А тому що їх психіка ще не доросла до професійної ролі. <strong>Компанія росте — не всі люди ростуть разом із нею.</strong></p>
                </div>
            </div>
        </details>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 1. Підготуйтесь до розмови</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Перед зустріччю:</strong></p>
        <ol>
            <li>Випишіть якості кожного ключового співробітника — чому він важливий</li>
            <li>Напишіть власні тези розмови</li>
            <li>Проговоріть кілька разів вголос</li>
            <li>Увімкніть диктофон під час розмови (для звіту консультанту)</li>
        </ol>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 2. Скрипт розмови (читайте це співробітнику)</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 16px; background: #f0fdf4; border-radius: 12px; border: 1px solid #22c55e; margin-bottom: 16px;">
            <p style="font-style: italic; color: #166534; margin-bottom: 12px;"> <strong>Приклад скрипту — адаптуйте під себе:</strong></p>
            
            <p style="margin-bottom: 12px;">«Вітаю! Наша компанія дійшла до певного рубежу. <strong>Ви — ключовий співробітник</strong>, підтримка та опора всієї компанії. Нам треба разом рухатись далі, розвивати діяльність.</p>
            
            <p style="margin-bottom: 12px;">Для цього ми удосконалюватимемо <strong>систему управління</strong>. Я вирішив брати участь у проекті систематизації бізнесу. У процесі цього консалтингу я наводитиму порядок у компанії, і в цьому мені потрібна буде <strong>ваша допомога</strong>.</p>
            
            <p style="margin-bottom: 12px;"><strong>Скажіть, як ви розумієте слово "управління"?</strong></p>
            
            <p style="margin-bottom: 12px;"><em>[Вислухайте відповідь, потім поясніть:]</em></p>
            
            <p style="margin-bottom: 12px;"><strong>Управління</strong> — це коли ми погоджуємо всі наші дії, щоб вони вели нас до однієї мети. Якщо в компанії добре налагоджено управління — дії кожного співробітника ведуть до загальної мети. Якщо погано — троє йдуть до мети, один йде в інший бік. В результаті рух сповільнюється.»</p>
        </div>
        
        <p style="font-weight: 600; margin-bottom: 12px;"> Замальовка для пояснення (намалюйте на папері):</p>
        
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 3. Розкажіть план змін (продовження скрипту)</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #22c55e;">
            <p style="margin-bottom: 16px;">«Робота буде цікавою і водночас складною. І, як ви розумієте, таку роботу не можна зробити самотужки, ми її робитимемо разом, і мені потрібна буде <strong>ваша підтримка та допомога</strong>.</p>
            
            <p style="margin-bottom: 16px;">Внаслідок цих змін я хочу сформувати <strong>команду керівників</strong>, які керуватимуть оперативною діяльністю компанії. Я хочу ростити виконавчого директора. Я хочу, щоб кожен керівник у нашій компанії професійно, усвідомлено займався управлінням. Я знаю, що нам є куди зростати у цьому питанні.</p>
            
            <p style="margin-bottom: 20px;"><strong>Хороша новина</strong> в тому, що ці зміни ми проводитимемо поступово і плавно протягом цього року. Ще одна гарна новина, що ці зміни матимуть початок та кінець. Ось план організаційних змін:»</p>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Перше</strong> — я опишу, що є основною метою нашої компанії. Що для компанії найголовніше, щоб вона продовжувала успішно існувати. Сформулюю стратегію цього року.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Друге</strong> — точно опишу наших клієнтів. Опишу наш головний продукт, за який клієнт платить саме нам, а не нашим конкурентам. <em>Це зрозуміло?</em></p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Третє</strong> — опишу всі функції, які необхідні для виробництва нашого продукту.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Четверте</strong> — ми разом перерозподілимо функції так, щоб врахувати навантаження і сконцентруватися на головному. На цьому етапі функції можуть бути переглянуті, опишемо посадові інструкції. Вчимося виконувати нові функції, розбиратися з тим, як їх виконувати. Почнемо освоювати професійні функції керівників. Частину функцій делегуватимемо, навчатимемо своїх помічників. <em>Це зрозуміло?</em></p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>П'яте</strong> — створимо кількісну оцінку результатів за основними функціями та в майбутньому по кожному співробітнику.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Шосте</strong> — створимо систему планування. Ми введемо планування завдань (щотижневе та щоденне) насамперед для керівників, а потім для інших співробітників.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Сьоме</strong> — ми впровадимо систему письмової комунікації, щоб швидко та чітко надавати інформацію один одному.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Восьме</strong> — з'являться регулярні координації серед керівників усіх підрозділів та на рівні відділів. З'являться збори персоналу та внутрішній PR.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Дев'яте</strong> — створимо систему фінансового планування. <em>Це зрозуміло?</em></p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px;">
                <p><strong>І нарешті</strong> — почнемо цикл стратегічного планування, який щороку повторюватимемо.</p>
            </div>
            
            <p style="margin-bottom: 12px;">«Всі ці частини єдиної системи управління дозволять нашій команді узгоджено працювати за єдиними правилами. Це зменшить хаотичність, додасть порядку та справедливості.</p>
            
            <p><strong>Що ви про це думаєте?</strong>»</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 4. Про навчання та час (продовження скрипту)</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #22c55e;">
            <p style="margin-bottom: 16px;">«Зміни в компанії вимагатимуть від кожного працівника <strong>витрат часу на навчання</strong>. Кожен повинен розуміти новації, щоб ми могли діяти по-новому. Без розуміння, у чому полягає зміна, навіщо вона необхідна і як треба діяти — результату не буде.</p>
            
            <p style="margin-bottom: 16px;">Наприклад, ми ніколи раніше не планували роботу на тиждень. Щоб почати це робити, необхідно дізнатися: навіщо потрібно планувати на тиждень, як планувати, спробувати зробити це вперше. Для цього необхідне навчання, тому цього року ми матимемо багато навчання.</p>
            
            <p style="margin-bottom: 16px;">Повинен попередити, що це навчання вимагатиме від вас іноді виходити на роботу в суботу, і, крім того, вам доведеться витратити близько <strong>10-20% вашого робочого часу</strong>.</p>
            
            <p style="margin-bottom: 16px;">Коли ми опануємо адміністративні функції, вони будуть забирати від 10% до 40% робочого часу залежно від посади. Чим вища посада, тим більше часу працівник витрачатиме на адміністративні функції. Адміністративні функції необхідні для підтримки порядку в організації.</p>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #22c55e;">
                <p style="font-weight: 600; margin-bottom: 8px;">Аналогія з кухнею:</p>
                <p>При цьому треба розуміти, що наведення порядку на кухні не призводить до того, що в сім'ї з'являється обід, а лише забирає час. Мало хто любить наводити лад, особливо на кухні.</p>
                <p style="margin-top: 8px;">Але якщо на кухні порядок, процес приготування їжі значно прискорюється, адже не доводиться витрачати час на пошук різних предметів — все, що необхідно, знаходиться під рукою.</p>
            </div>
            
            <p>Такий же ефект компанія отримує, якщо виконувати адміністративні функції. Стабільні правила взаємодії та стандартні процедури зменшують кількість зупинок у виробництві за подальшого зростання компанії.»</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 5. Відповіді на типові питання</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom: 16px; color: #6b7280;"><em>Не "підштовхуйте" співробітників до цих питань. Якщо вони їх задають — тоді відповідайте:</em></p>
        
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #22c55e;">
            <p style="font-weight: 600;">«Як торкнеться мене?»</p>
            <p style="color: #166534; margin-top: 8px;">→ «Як точно зараз не скажу, це стане більш зрозумілим у процесі. Що знаю точно — ми з вами обов'язково будь-які зміни погоджуватимемо.»</p>
        </div>
        
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #22c55e;">
            <p style="font-weight: 600;">«Навіщо нам щось міняти, у нас все й так непогано?»</p>
            <p style="color: #166534; margin-top: 8px;">→ «Пам'ятаєте, ми змінювали у компанії [навести приклад]…? Це спочатку виглядало дивним, складним та непотрібним, але тепер ми без цього не уявляємо життя компанії. Якщо вам щось здаватиметься дивним чи незрозумілим, я готовий це з вами обговорювати, пояснювати.»</p>
        </div>
        
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="font-weight: 600;">«Багато адміністрування — це погано!»</p>
            <p style="color: #166534; margin-top: 8px;">→ «Я розумію, у вас був різний досвід у цьому питанні. Пройдіть навчання і ми повернемося до цієї розмови. Тільки коли навчатиметесь, відкиньте для початку думку, що це погано, і розгляньте "з чистого аркуша" — постарайтеся це розглянути як нову ідею.»</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 6. Надішліть на навчання в Team Academy AI</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom: 12px;">Завершіть розмову так:</p>
        <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #22c55e; margin-bottom: 16px;">
            <p style="margin-bottom: 12px;">«Про подробиці всіх етапів впровадження системи управління ви зможете дізнатися, пройшовши <strong>навчання з AI-асистентом</strong>. Він розкаже про всі інструменти управління.</p>
            
            <p style="margin-bottom: 12px;">Ви можете відзначити місця, які викликають питання, та місця, які вам подобаються.</p>
            
            <p style="margin-bottom: 12px;"><strong>Чи готові ви пройти це навчання та заповнити тест до [ДАТА]</strong>, щоб ми з вами це обговорили і разом подивилися, що чекає на нашу компанію?</p>
            
            <p>Я готовий з вами обговорити цю інформацію будь-коли. Пропоную приблизно за 1 тиждень провести таке обговорення.»</p>
        </div>
        
        <div style="margin-top: 16px;">
            <a href="https://chatgpt.com/g/g-694ea789f6fc8191a90694aae93de819-team-academy-ai" target="_blank" class="action-btn primary">
                
                Team Academy AI — надішліть це посилання співробітникам
            </a>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">КРОК 7. Зберіть відповіді на тест</div>
    </div>
    <div class="lesson-block-content">
        <p>Після навчання співробітники відповідають на тест. Це підтверджує, що вони розуміють зміни.</p>
        <p style="margin-top: 12px; font-weight: 600;">Питання тесту (надішліть співробітникам):</p>
        <ol style="font-size: 14px; background: #f9fafb; padding: 16px 16px 16px 36px; border-radius: 8px; margin-top: 8px;">
            <li>Назвіть етапи розвитку компанії</li>
            <li>Чи можуть гроші бути метою компанії? Чому?</li>
            <li>У чому основна мета будь-якого бізнесу?</li>
            <li>Що таке задум компанії?</li>
            <li>Які рівні мотивації людей у компанії? Опишіть їх</li>
            <li>Який рівень мотивації є найціннішим? Чому?</li>
            <li>Що таке ЦКП? Розшифруйте кожне слово</li>
            <li>Чи повинен кожен співробітник знати свій ЦКП? Чому?</li>
            <li>Що таке посадова папка? Навіщо вона потрібна?</li>
            <li>Чи залежить продуктивність команди від найсильнішого гравця? Чому?</li>
            <li>Скільки відділень має бути в компанії за оргсхемою? Чому?</li>
            <li>Яке відділення йде найпершим? Чому?</li>
            <li>У чому різниця 2 та 6 відділень?</li>
            <li>Що таке план? З чого починати планування?</li>
            <li>Що таке координація і навіщо вона потрібна?</li>
            <li>Як часто має здійснюватися фінансове планування?</li>
            <li>Що таке фінансові резерви? Навіщо їх створювати?</li>
            <li>Як підвищити мотивацію співробітників на рівні "особиста вигода"?</li>
            <li>Чи може команда працювати на рівні "почуття обов'язку" при лідері на рівні "особова переконаність"?</li>
        </ol>
    </div>
</div>

<div class="lesson-block success">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Результат уроку</div>
    </div>
    <div class="lesson-block-content">
        <ul>
            <li> Ключові співробітники розуміють, що буде відбуватися</li>
            <li> Вони пройшли навчання і здали тест</li>
            <li> Вони готові підтримувати вас у змінах</li>
            <li> Опір мінімізовано через розуміння</li>
        </ul>
        <p style="margin-top: 16px;">Якщо таким чином розповісти ключовим співробітникам про своє рішення проводити організаційні зміни, вони краще розберуться з цим і будуть до них готові. <strong>Завдяки готовності ключових співробітників подальші зміни пройдуть усвідомлено та гладко.</strong></p>
    </div>
</div>
                `,

                lessonContent_ru: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Зачем этот урок</div>
    </div>
    <div class="lesson-block-content">
        <p>Когда собственник начинает изменения без согласования с командой — возникает сопротивление. Сотрудники не понимают <strong>зачем</strong> изменения и <strong>к чему</strong> они приведут.</p>
        <p style="margin-top: 12px;">Этот урок поможет правильно подготовить команду: объяснить суть изменений, провести обучение и получить поддержку ключевых людей.</p>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">«Ой всё…» — почему сотрудники сопротивляются?</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 12px 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px;">
            <p style="margin: 0;"><strong>Рекомендация:</strong> Если сотрудник проявляет сопротивление, обиду или пассивную агрессию — прочитайте эту статью вместе с ним. Пусть сотрудник читает вслух.</p>
        </div>
        
        <details class="accordion-article" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <summary style="padding: 16px; background: #f9fafb; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; list-style: none;">
                
                Статья: «Ой всё…» или почему ваши сотрудники не воспринимают критику
            </summary>
            <div style="padding: 20px; background: white;">
                <h4 style="color: #dc2626; margin-bottom: 16px;">Знакомая сцена?</h4>
                <p style="margin-bottom: 16px;">Вы спокойно говорите человеку: «Вот тут надо подучиться. Вот так делать правильно».</p>
                <p style="margin-bottom: 16px;">И что в ответ?</p>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li>кислое лицо</li>
                    <li>обида</li>
                    <li>пассивная агрессия</li>
                    <li>"ой всё, я понял(а)"</li>
                    <li>минимум действий, максимум эмоций</li>
                </ul>
                <p style="margin-bottom: 20px;">Хотя вы даже не кричали.</p>
                
                <div style="padding: 16px; background: #fef2f2; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: 600;">Тут важно понять одну неприятную вещь:</p>
                    <p style="margin: 8px 0 0 0;">Большинство взрослых работает с психикой 12-летнего ребёнка.<br>Выглядит 30+. Работает 20+. А реагирует как школьник, которому учитель сказал: "Надо подтянуть математику."</p>
                </div>
                
                <h4 style="margin-bottom: 12px;">Почему так?</h4>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">1. Потому что они путают советы с нападением</p>
                    <p style="margin-bottom: 4px;"><strong>Взрослый человек:</strong> "Я могу лучше — спасибо за уточнение."</p>
                    <p style="margin: 0;"><strong>Детский человек:</strong> "Ты сказал, что я плохой. Ой всё."</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">2. Потому что самооценка хрупкая, как пластиковый стаканчик</p>
                    <p style="margin: 0;">Любое замечание = удар по «я хороший». Не выдерживает даже лёгкий намёк, что что-то можно сделать иначе. Слабая внутренняя опора → сильные внешние реакции.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">3. Потому что их никто не научил различать "я" и "моё действие"</p>
                    <p style="margin: 0;">"Ты сделал ошибку" воспринимается как "Ты — ошибка." Человек с такой логикой обречён обижаться.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">4. Потому что критика заставляет взрослеть — а этого они боятся</p>
                    <p style="margin-bottom: 8px;">Критика означает:</p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>признать реальность</li>
                        <li>изменить поведение</li>
                        <li>взять ответственность</li>
                    </ul>
                    <p style="margin: 8px 0 0 0;">Это больно. Это дискомфортно. Это не детская модель. Поэтому включается: «ой всё, я ничего не знаю, делайте сами»</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">5. Потому что есть глубокая установка "я уже должен знать"</p>
                    <p style="margin: 0;">Очень токсичная. Если человек верит, что он должен всё уметь — то любой совет = доказательство слабости. Не посоветуешь — плохо. Совет — тоже плохо. Парадокс инфантильности.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">6. Потому что обида — это способ избежать ответственности</p>
                    <p style="margin: 0;">Когда работник обижается, он снимает с себя груз действия. Обиделся → значит, он "жертва", а не исполнитель. А жертва ничего не обязана. Удобно. Неэффективно. И очень дорого для бизнеса.</p>
                </div>
                
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                    <p style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">7. Потому что вы говорите по-взрослому, а у них — детский фильтр</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Ваше:</strong> "Надо сделать вот так."</td>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Их:</strong> "Меня унизили."</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Ваше:</strong> "Исправь ошибку."</td>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Их:</strong> "Меня не ценят."</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Ваше:</strong> "Нужно учиться."</td>
                            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Их:</strong> "Я недостаточный."</td>
                        </tr>
                    </table>
                </div>
                
                <div style="padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="font-weight: 600; margin-bottom: 8px;">Голая правда</p>
                    <p style="margin: 0;">Не каждый работник может работать в компании, где есть стандарты, регламенты, инструкции и чёткие требования. Не потому, что они «плохие». А потому что их психика ещё не доросла до профессиональной роли. <strong>Компания растёт — не все люди растут вместе с ней.</strong></p>
                </div>
            </div>
        </details>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 1. Подготовьтесь к разговору</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Перед встречей:</strong></p>
        <ol>
            <li>Выпишите качества каждого ключевого сотрудника — почему он важен</li>
            <li>Напишите собственные тезисы разговора</li>
            <li>Проговорите несколько раз вслух</li>
            <li>Включите диктофон во время разговора (для отчёта консультанту)</li>
        </ol>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 2. Скрипт разговора (читайте это сотруднику)</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 16px; background: #f0fdf4; border-radius: 12px; border: 1px solid #22c55e; margin-bottom: 16px;">
            <p style="font-style: italic; color: #166534; margin-bottom: 12px;"> <strong>Пример скрипта — адаптируйте под себя:</strong></p>
            
            <p style="margin-bottom: 12px;">«Приветствую! Наша компания дошла до определённого рубежа. <strong>Вы — ключевой сотрудник</strong>, поддержка и опора всей компании. Нам нужно вместе двигаться дальше, развивать деятельность.</p>
            
            <p style="margin-bottom: 12px;">Для этого мы будем совершенствовать <strong>систему управления</strong>. Я решил участвовать в проекте систематизации бизнеса. В процессе этого консалтинга я буду наводить порядок в компании, и в этом мне понадобится <strong>ваша помощь</strong>.</p>
            
            <p style="margin-bottom: 12px;"><strong>Скажите, как вы понимаете слово "управление"?</strong></p>
            
            <p style="margin-bottom: 12px;"><em>[Выслушайте ответ, затем объясните:]</em></p>
            
            <p style="margin-bottom: 12px;"><strong>Управление</strong> — это когда мы согласовываем все наши действия, чтобы они вели нас к одной цели. Если в компании хорошо налажено управление — действия каждого сотрудника ведут к общей цели. Если плохо — трое идут к цели, один идёт в другую сторону. В результате движение замедляется.»</p>
        </div>
        
        <p style="font-weight: 600; margin-bottom: 12px;"> Зарисовка для объяснения (нарисуйте на бумаге):</p>
        
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 3. Расскажите план изменений (продолжение скрипта)</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #22c55e;">
            <p style="margin-bottom: 16px;">«Работа будет интересной и одновременно сложной. И, как вы понимаете, такую работу нельзя сделать в одиночку, мы будем делать её вместе, и мне понадобится <strong>ваша поддержка и помощь</strong>.</p>
            
            <p style="margin-bottom: 16px;">В результате этих изменений я хочу сформировать <strong>команду руководителей</strong>, которые будут управлять оперативной деятельностью компании. Я хочу растить исполнительного директора. Я хочу, чтобы каждый руководитель в нашей компании профессионально, осознанно занимался управлением.</p>
            
            <p style="margin-bottom: 20px;"><strong>Хорошая новость</strong> в том, что эти изменения мы будем проводить постепенно и плавно в течение этого года. Ещё одна хорошая новость — эти изменения будут иметь начало и конец. Вот план организационных изменений:»</p>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Первое</strong> — я опишу, что является основной целью нашей компании. Что для компании самое главное, чтобы она продолжала успешно существовать. Сформулирую стратегию этого года.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Второе</strong> — точно опишу наших клиентов. Опишу наш главный продукт, за который клиент платит именно нам, а не нашим конкурентам. <em>Это понятно?</em></p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Третье</strong> — опишу все функции, необходимые для производства нашего продукта.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Четвёртое</strong> — мы вместе перераспределим функции так, чтобы учесть нагрузку и сконцентрироваться на главном. На этом этапе функции могут быть пересмотрены, опишем должностные инструкции. Учимся выполнять новые функции. Начнём осваивать профессиональные функции руководителей. Часть функций будем делегировать, обучать своих помощников. <em>Это понятно?</em></p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Пятое</strong> — создадим количественную оценку результатов по основным функциям и в будущем по каждому сотруднику.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Шестое</strong> — создадим систему планирования. Мы введём планирование задач (еженедельное и ежедневное) в первую очередь для руководителей, а затем для других сотрудников.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Седьмое</strong> — мы внедрим систему письменной коммуникации, чтобы быстро и чётко предоставлять информацию друг другу.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Восьмое</strong> — появятся регулярные координации среди руководителей всех подразделений и на уровне отделов. Появятся собрания персонала и внутренний PR.</p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 12px;">
                <p><strong>Девятое</strong> — создадим систему финансового планирования. <em>Это понятно?</em></p>
            </div>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px;">
                <p><strong>И наконец</strong> — начнём цикл стратегического планирования, который ежегодно будем повторять.</p>
            </div>
            
            <p style="margin-bottom: 12px;">«Все эти части единой системы управления позволят нашей команде согласованно работать по единым правилам. Это уменьшит хаотичность, добавит порядка и справедливости.</p>
            
            <p><strong>Что вы об этом думаете?</strong>»</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 4. Об обучении и времени (продолжение скрипта)</div>
    </div>
    <div class="lesson-block-content">
        <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #22c55e;">
            <p style="margin-bottom: 16px;">«Изменения в компании потребуют от каждого работника <strong>затрат времени на обучение</strong>. Каждый должен понимать нововведения, чтобы мы могли действовать по-новому. Без понимания, в чём состоит изменение, зачем оно необходимо и как нужно действовать — результата не будет.</p>
            
            <p style="margin-bottom: 16px;">Например, мы никогда раньше не планировали работу на неделю. Чтобы начать это делать, необходимо узнать: зачем нужно планировать на неделю, как планировать, попробовать сделать это впервые. Для этого необходимо обучение, поэтому в этом году у нас будет много обучения.</p>
            
            <p style="margin-bottom: 16px;">Должен предупредить, что это обучение потребует от вас иногда выходить на работу в субботу, и, кроме того, вам придётся потратить около <strong>10-20% вашего рабочего времени</strong>.</p>
            
            <p style="margin-bottom: 16px;">Когда мы освоим административные функции, они будут забирать от 10% до 40% рабочего времени в зависимости от должности. Чем выше должность, тем больше времени работник будет тратить на административные функции.</p>
            
            <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #22c55e;">
                <p style="font-weight: 600; margin-bottom: 8px;">Аналогия с кухней:</p>
                <p>При этом надо понимать, что наведение порядка на кухне не приводит к тому, что в семье появляется обед, а лишь забирает время. Мало кто любит наводить порядок, особенно на кухне.</p>
                <p style="margin-top: 8px;">Но если на кухне порядок, процесс приготовления пищи значительно ускоряется, ведь не приходится тратить время на поиск разных предметов — всё, что необходимо, находится под рукой.</p>
            </div>
            
            <p>Такой же эффект компания получает, если выполнять административные функции. Стабильные правила взаимодействия и стандартные процедуры уменьшают количество остановок в производстве при дальнейшем росте компании.»</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 5. Ответы на типичные вопросы</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom: 16px; color: #6b7280;"><em>Не "подталкивайте" сотрудников к этим вопросам. Если они их задают — тогда отвечайте:</em></p>
        
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #22c55e;">
            <p style="font-weight: 600;">«Как это коснётся меня?»</p>
            <p style="color: #166534; margin-top: 8px;">→ «Как точно сейчас не скажу, это станет более понятным в процессе. Что знаю точно — мы с вами обязательно любые изменения будем согласовывать.»</p>
        </div>
        
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #22c55e;">
            <p style="font-weight: 600;">«Зачем нам что-то менять, у нас всё и так неплохо?»</p>
            <p style="color: #166534; margin-top: 8px;">→ «Помните, мы меняли в компании [привести пример]…? Это сначала выглядело странным, сложным и ненужным, но теперь мы без этого не представляем жизнь компании. Если вам что-то будет казаться странным или непонятным, я готов это с вами обсуждать, объяснять.»</p>
        </div>
        
        <div style="padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="font-weight: 600;">«Много администрирования — это плохо!»</p>
            <p style="color: #166534; margin-top: 8px;">→ «Я понимаю, у вас был разный опыт в этом вопросе. Пройдите обучение и мы вернёмся к этому разговору. Только когда будете учиться, отбросьте для начала мысль, что это плохо, и рассмотрите "с чистого листа" — постарайтесь это рассмотреть как новую идею.»</p>
        </div>
    </div>
</div>
            <p style="color: #166534; margin-top: 4px;">→ «Как точно — пока не скажу, это станет понятным в процессе. Что знаю точно — любые изменения мы с вами обязательно будем согласовывать.»</p>
        </div>
        
        <div style="padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
            <p><strong>«Зачем что-то менять, у нас всё и так неплохо?»</strong></p>
            <p style="color: #166534; margin-top: 4px;">→ «Помните, мы меняли [приведите пример]? Сначала выглядело странно, но теперь мы без этого не представляем работу.»</p>
        </div>
<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 6. Отправьте на обучение в Team Academy AI</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom: 12px;">Завершите разговор так:</p>
        <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #22c55e; margin-bottom: 16px;">
            <p style="margin-bottom: 12px;">«О подробностях всех этапов внедрения системы управления вы сможете узнать, пройдя <strong>обучение с AI-ассистентом</strong>. Он расскажет обо всех инструментах управления.</p>
            
            <p style="margin-bottom: 12px;">Вы можете отметить места, которые вызывают вопросы, и места, которые вам нравятся.</p>
            
            <p style="margin-bottom: 12px;"><strong>Готовы ли вы пройти это обучение и заполнить тест до [ДАТА]</strong>, чтобы мы с вами это обсудили и вместе посмотрели, что ждёт нашу компанию?</p>
            
            <p>Я готов с вами обсудить эту информацию в любое время. Предлагаю примерно через 1 неделю провести такое обсуждение.»</p>
        </div>
        
        <div style="margin-top: 16px;">
            <a href="https://chatgpt.com/g/g-694ea789f6fc8191a90694aae93de819-team-academy-ai" target="_blank" class="action-btn primary">
                
                Team Academy AI — отправьте эту ссылку сотрудникам
            </a>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ШАГ 7. Соберите ответы на тест</div>
    </div>
    <div class="lesson-block-content">
        <p>После обучения сотрудники отвечают на тест. Это подтверждает, что они понимают изменения.</p>
        <p style="margin-top: 12px; font-weight: 600;">Вопросы теста (отправьте сотрудникам):</p>
        <ol style="font-size: 14px; background: #f9fafb; padding: 16px 16px 16px 36px; border-radius: 8px; margin-top: 8px;">
            <li>Назовите этапы развития компании</li>
            <li>Могут ли деньги быть целью компании? Почему?</li>
            <li>В чём основная цель любого бизнеса?</li>
            <li>Что такое замысел компании?</li>
            <li>Какие уровни мотивации людей в компании? Опишите их</li>
            <li>Какой уровень мотивации самый ценный? Почему?</li>
            <li>Что такое ЦКП? Расшифруйте каждое слово</li>
            <li>Должен ли каждый сотрудник знать свой ЦКП? Почему?</li>
            <li>Что такое должностная папка? Зачем она нужна?</li>
            <li>Зависит ли продуктивность команды от самого сильного игрока? Почему?</li>
            <li>Сколько отделений должно быть в компании по оргсхеме? Почему?</li>
            <li>Какое отделение идёт первым? Почему?</li>
            <li>В чём разница 2 и 6 отделений?</li>
            <li>Что такое план? С чего начинать планирование?</li>
            <li>Что такое координация и зачем она нужна?</li>
            <li>Как часто должно осуществляться финансовое планирование?</li>
            <li>Что такое финансовые резервы? Зачем их создавать?</li>
            <li>Как повысить мотивацию сотрудников на уровне "личная выгода"?</li>
            <li>Может ли команда работать на уровне "чувство долга" при лидере на уровне "личная убеждённость"?</li>
        </ol>
    </div>
</div>

<div class="lesson-block success">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Вывод</div>
    </div>
    <div class="lesson-block-content">
        <ul>
            <li> Ключевые сотрудники понимают, что будет происходить</li>
            <li> Они прошли обучение и сдали тест</li>
            <li> Они готовы поддерживать вас в изменениях</li>
            <li> Сопротивление минимизировано через понимание</li>
        </ul>
        <p style="margin-top: 16px;">Если таким образом рассказать ключевым сотрудникам о своём решении проводить организационные изменения, они лучше разберутся с этим и будут к ним готовы. <strong>Благодаря готовности ключевых сотрудников дальнейшие изменения пройдут осознанно и гладко.</strong></p>
    </div>
</div>
                `,
                
                homework: `
<div class="lesson-block homework">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Домашнє завдання</div>
    </div>
    <div class="lesson-block-content">
        <ol>
            <li>Визначте ключових співробітників (2-5 осіб)</li>
            <li>Підготуйте скрипт розмови (адаптуйте приклад під себе)</li>
            <li>Проведіть розмову з кожним (запишіть на диктофон)</li>
            <li>Надішліть їм посилання на Team Academy AI</li>
            <li>Зберіть відповіді на тест від кожного</li>
            <li>Завантажте скріни/фото відповідей у Google Документ</li>
            <li>Прикріпіть посилання на документ</li>
        </ol>
    </div>
</div>
                `,

                homework_ru: `
<div class="lesson-block homework">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Домашнее задание</div>
    </div>
    <div class="lesson-block-content">
        <ol>
            <li>Определите ключевых сотрудников (2-5 человек)</li>
            <li>Подготовьте скрипт разговора (адаптируйте пример под себя)</li>
            <li>Проведите разговор с каждым (запишите на диктофон)</li>
            <li>Отправьте им ссылку на Team Academy AI</li>
            <li>Соберите ответы на тест от каждого</li>
            <li>Загрузите скрины/фото ответов в Google Документ</li>
            <li>Прикрепите ссылку на документ</li>
        </ol>
    </div>
</div>
                `,
                
                homeworkLink: "https://chatgpt.com/g/g-694ea789f6fc8191a90694aae93de819-team-academy-ai",
                homeworkLinkName: "→ Team Academy AI",
                homeworkLinkName_ru: "→ Team Academy AI",
                time: 60
            },
            {
                id: 8,
                title: "АНАЛІЗ ВУЗЬКОГО МІСЦЯ БІЗНЕСУ",
                title_ru: "АНАЛИЗ УЗКОГО МЕСТА БИЗНЕСА",
                subtitle: "5 шарів, де насправді ховається проблема",
                subtitle_ru: "5 слоёв, где на самом деле скрывается проблема",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l8-section { margin-bottom:1.75rem; }
.l8-section:last-child { margin-bottom:0; }
.l8-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l8-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l8-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l8-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l8-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l8-card p+p { margin-top:0.7rem; }
.l8-symptoms { display:grid; gap:0.4rem; margin-top:0.75rem; }
.l8-symptom { display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.85rem; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:0.85rem; color:#92400e; }
.l8-layers { display:grid; gap:0.55rem; margin-top:0.75rem; }
.l8-layer { border-radius:11px; overflow:hidden; border:1px solid #e2e8f0; }
.l8-layer-header { display:flex; align-items:center; gap:0.65rem; padding:0.75rem 0.95rem; background:#f8fafc; }
.l8-layer-num { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; color:white; flex-shrink:0; }
.l8-layer-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; }
.l8-layer-body { padding:0.65rem 0.95rem 0.8rem; background:white; border-top:1px solid #f1f5f9; }
.l8-layer-sub { font-size:0.78rem; color:#6b7280; margin-bottom:0.35rem; }
.l8-layer-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l8-layer-tag { display:inline-block; margin-top:0.45rem; padding:0.2rem 0.55rem; border-radius:5px; font-size:0.72rem; font-weight:600; }
.l8-beliefs { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l8-belief { padding:0.7rem 0.9rem; background:#f8fafc; border-radius:9px; border-left:3px solid #e2e8f0; }
.l8-belief-quote { font-size:0.85rem; color:#374151; font-style:italic; margin-bottom:0.25rem; }
.l8-belief-result { font-size:0.78rem; color:#ef4444; }
.l8-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l8-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l8-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l8-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l8-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l8-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l8-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l8-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
</style>

<div class="l8-section">
    <div class="l8-section-label">Проблема</div>
    <div class="l8-section-title">Чому ви робите більше, а результат не змінюється</div>
    <div class="l8-card">
        <p>Багато власників працюють більше і більше — але результат майже не змінюється. З'являється відчуття: команда є, клієнти є, роботи багато. Але бізнес не росте.</p>
        <p>Причина не в зусиллях. Причина в тому, що <strong>зусилля спрямовані не туди</strong>. Більшість власників шукають рішення на рівні дій — більше реклами, більше продажів, більше контролю. Але справжня проблема може знаходитись набагато глибше.</p>
    </div>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Чому стандартні рішення не працюють</div>
    <div class="l8-section-title">Симптоми, які показують що проблема глибша ніж здається</div>
    <div class="l8-symptoms">
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>«У мене немає часу»</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Команда не бере відповідальність</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Продажі нестабільні</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Низька рентабельність</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Люди часто звільняються або втрачають мотивацію</div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.5;margin-top:0.75rem;">Якщо у вас є хоча б один з цих симптомів — проблема не на поверхні. Її треба шукати глибше.</p>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Методологія</div>
    <div class="l8-section-title">5 шарів бізнесу — де насправді ваше вузьке місце</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">Кожен бізнес має 5 рівнів. Проблема завжди знаходиться тільки на одному з них.</p>
    <div class="l8-layers">
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#22c55e;">1</div>
                <div class="l8-layer-title">Дії</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Що ви робите щодня: продажі, маркетинг, переговори, зустрічі</div>
                <div class="l8-layer-text">Якщо проблема тут — просто недостатньо активності. Рішення на поверхні.</div>
                <span class="l8-layer-tag" style="background:#f0fdf4;color:#16a34a;">Найлегше побачити</span>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#3b82f6;">2</div>
                <div class="l8-layer-title">Інструменти</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Система управління, делегування, статистики, планування</div>
                <div class="l8-layer-text">Якщо проблема тут — люди працюють хаотично, навіть якщо їх вистачає.</div>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#8b5cf6;">3</div>
                <div class="l8-layer-title">Бізнес-модель</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Як саме бізнес заробляє: маржа, масштабованість, структура продуктів</div>
                <div class="l8-layer-text">Якщо проблема тут — навіть при хорошій роботі грошей буде мало.</div>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#f97316;">4</div>
                <div class="l8-layer-title">Цілі та партнерства</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Чіткість мети, напрямок команди, конфлікти з партнерами</div>
                <div class="l8-layer-text">Якщо проблема тут — команда розфокусована і рухається в різні сторони.</div>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#ef4444;">5</div>
                <div class="l8-layer-title">Особистість власника</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Переконання, які впливають на всі рішення</div>
                <div class="l8-layer-text">Найглибший рівень. Саме тут часто ховається справжня причина проблем.</div>
                <span class="l8-layer-tag" style="background:#fef2f2;color:#dc2626;">Найважче побачити самостійно</span>
            </div>
        </div>
    </div>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Найглибший шар</div>
    <div class="l8-section-title">Переконання власника формують результат бізнесу</div>
    <div class="l8-card">
        <p>Переконання — це те, що формує рішення, а рішення формують результат. Цей шар найважче побачити самостійно, бо ці думки здаються «очевидними» і «правильними».</p>
    </div>
    <div class="l8-beliefs">
        <div class="l8-belief">
            <div class="l8-belief-quote">«Якщо хочеш зробити добре — зроби сам»</div>
            <div class="l8-belief-result">→ власник стає вузьким місцем, делегування не відбувається</div>
        </div>
        <div class="l8-belief">
            <div class="l8-belief-quote">«Консультант не знає мого бізнесу»</div>
            <div class="l8-belief-result">→ закритість до нових рішень і зовнішнього погляду</div>
        </div>
        <div class="l8-belief">
            <div class="l8-belief-quote">«Клієнти не готові платити більше»</div>
            <div class="l8-belief-result">→ підсвідомо занижуються ціни, маржа залишається низькою</div>
        </div>
        <div class="l8-belief">
            <div class="l8-belief-quote">«Я завжди правий»</div>
            <div class="l8-belief-result">→ помилки не аналізуються, зростання блокується</div>
        </div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.5;margin-top:0.85rem;">Найуспішніші власники — ті, хто залишається відкритим до зворотного зв'язку і готовим переглядати свої переконання.</p>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Результат уроку</div>
    <div class="l8-result-list">
        <div class="l8-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Визначите шар, де зараз ваше вузьке місце
        </div>
        <div class="l8-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Зрозумієте де шукати рішення — а не симптоми
        </div>
        <div class="l8-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Перестанете витрачати зусилля на поверхневі зміни
        </div>
    </div>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">AI-діагностика</div>
    <div class="l8-tool">
        <div class="l8-tool-header">
            <div class="l8-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
                <div class="l8-tool-title">AI Аналіз бізнесу — 5 шарів</div>
                <div class="l8-tool-desc">Самостійно визначити шар проблеми буває складно. AI-інструмент проводить коротку діагностику: задає питання по кожному шару і допомагає визначити, де зараз знаходиться ваше вузьке місце.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6856d5ef91608191918552480e1018eb-pie-analysis-methodology-5-layers-of-business" target="_blank" class="l8-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Пройти аналіз 5 шарів
        </a>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l8-section { margin-bottom:1.75rem; }
.l8-section:last-child { margin-bottom:0; }
.l8-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l8-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l8-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l8-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l8-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l8-card p+p { margin-top:0.7rem; }
.l8-symptoms { display:grid; gap:0.4rem; margin-top:0.75rem; }
.l8-symptom { display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.85rem; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:0.85rem; color:#92400e; }
.l8-layers { display:grid; gap:0.55rem; margin-top:0.75rem; }
.l8-layer { border-radius:11px; overflow:hidden; border:1px solid #e2e8f0; }
.l8-layer-header { display:flex; align-items:center; gap:0.65rem; padding:0.75rem 0.95rem; background:#f8fafc; }
.l8-layer-num { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; color:white; flex-shrink:0; }
.l8-layer-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; }
.l8-layer-body { padding:0.65rem 0.95rem 0.8rem; background:white; border-top:1px solid #f1f5f9; }
.l8-layer-sub { font-size:0.78rem; color:#6b7280; margin-bottom:0.35rem; }
.l8-layer-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l8-layer-tag { display:inline-block; margin-top:0.45rem; padding:0.2rem 0.55rem; border-radius:5px; font-size:0.72rem; font-weight:600; }
.l8-beliefs { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l8-belief { padding:0.7rem 0.9rem; background:#f8fafc; border-radius:9px; border-left:3px solid #e2e8f0; }
.l8-belief-quote { font-size:0.85rem; color:#374151; font-style:italic; margin-bottom:0.25rem; }
.l8-belief-result { font-size:0.78rem; color:#ef4444; }
.l8-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l8-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l8-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l8-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l8-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l8-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l8-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l8-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
</style>

<div class="l8-section">
    <div class="l8-section-label">Проблема</div>
    <div class="l8-section-title">Почему вы делаете больше, а результат не меняется</div>
    <div class="l8-card">
        <p>Многие владельцы работают всё больше и больше — но результат почти не меняется. Появляется ощущение: команда есть, клиенты есть, работы много. Но бизнес не растёт.</p>
        <p>Причина не в усилиях. Причина в том, что <strong>усилия направлены не туда</strong>. Большинство владельцев ищут решение на уровне действий — больше рекламы, больше продаж, больше контроля. Но настоящая проблема может находиться намного глубже.</p>
    </div>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Почему стандартные решения не работают</div>
    <div class="l8-section-title">Симптомы, которые показывают что проблема глубже чем кажется</div>
    <div class="l8-symptoms">
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>«У меня нет времени»</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Команда не берёт ответственность</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Продажи нестабильны</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Низкая рентабельность</div>
        <div class="l8-symptom"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.75" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Люди часто увольняются или теряют мотивацию</div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.5;margin-top:0.75rem;">Если у вас есть хотя бы один из этих симптомов — проблема не на поверхности. Её нужно искать глубже.</p>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Методология</div>
    <div class="l8-section-title">5 слоёв бизнеса — где на самом деле ваше узкое место</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">Каждый бизнес имеет 5 уровней. Проблема всегда находится только на одном из них.</p>
    <div class="l8-layers">
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#22c55e;">1</div>
                <div class="l8-layer-title">Действия</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Что вы делаете каждый день: продажи, маркетинг, переговоры, встречи</div>
                <div class="l8-layer-text">Если проблема здесь — просто недостаточно активности. Решение на поверхности.</div>
                <span class="l8-layer-tag" style="background:#f0fdf4;color:#16a34a;">Легче всего увидеть</span>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#3b82f6;">2</div>
                <div class="l8-layer-title">Инструменты</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Система управления, делегирование, статистики, планирование</div>
                <div class="l8-layer-text">Если проблема здесь — люди работают хаотично, даже если их достаточно.</div>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#8b5cf6;">3</div>
                <div class="l8-layer-title">Бизнес-модель</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Как именно бизнес зарабатывает: маржа, масштабируемость, структура продуктов</div>
                <div class="l8-layer-text">Если проблема здесь — даже при хорошей работе денег будет мало.</div>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#f97316;">4</div>
                <div class="l8-layer-title">Цели и партнёрства</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Чёткость цели, направление команды, конфликты с партнёрами</div>
                <div class="l8-layer-text">Если проблема здесь — команда расфокусирована и движется в разные стороны.</div>
            </div>
        </div>
        <div class="l8-layer">
            <div class="l8-layer-header">
                <div class="l8-layer-num" style="background:#ef4444;">5</div>
                <div class="l8-layer-title">Личность владельца</div>
            </div>
            <div class="l8-layer-body">
                <div class="l8-layer-sub">Убеждения, которые влияют на все решения</div>
                <div class="l8-layer-text">Самый глубокий уровень. Именно здесь часто скрывается настоящая причина проблем.</div>
                <span class="l8-layer-tag" style="background:#fef2f2;color:#dc2626;">Сложнее всего увидеть самостоятельно</span>
            </div>
        </div>
    </div>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Самый глубокий слой</div>
    <div class="l8-section-title">Убеждения владельца формируют результат бизнеса</div>
    <div class="l8-card">
        <p>Убеждения — это то, что формирует решения, а решения формируют результат. Этот слой сложнее всего увидеть самостоятельно, потому что эти мысли кажутся «очевидными» и «правильными».</p>
    </div>
    <div class="l8-beliefs">
        <div class="l8-belief">
            <div class="l8-belief-quote">«Хочешь сделать хорошо — сделай сам»</div>
            <div class="l8-belief-result">→ владелец становится узким местом, делегирование не происходит</div>
        </div>
        <div class="l8-belief">
            <div class="l8-belief-quote">«Консультант не знает мой бизнес»</div>
            <div class="l8-belief-result">→ закрытость к новым решениям и внешнему взгляду</div>
        </div>
        <div class="l8-belief">
            <div class="l8-belief-quote">«Клиенты не готовы платить больше»</div>
            <div class="l8-belief-result">→ подсознательно занижаются цены, маржа остаётся низкой</div>
        </div>
        <div class="l8-belief">
            <div class="l8-belief-quote">«Я всегда прав»</div>
            <div class="l8-belief-result">→ ошибки не анализируются, рост блокируется</div>
        </div>
    </div>
    <p style="font-size:0.82rem;color:#525252;line-height:1.5;margin-top:0.85rem;">Самые успешные владельцы — те, кто остаётся открытым к обратной связи и готов пересматривать свои убеждения.</p>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">Результат урока</div>
    <div class="l8-result-list">
        <div class="l8-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Определите слой, где сейчас ваше узкое место
        </div>
        <div class="l8-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Поймёте где искать решение — а не симптомы
        </div>
        <div class="l8-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Перестанете тратить усилия на поверхностные изменения
        </div>
    </div>
</div>

<div class="l8-divider"></div>

<div class="l8-section">
    <div class="l8-section-label">AI-диагностика</div>
    <div class="l8-tool">
        <div class="l8-tool-header">
            <div class="l8-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
                <div class="l8-tool-title">AI Анализ бизнеса — 5 слоёв</div>
                <div class="l8-tool-desc">Самостоятельно определить слой проблемы бывает сложно. AI-инструмент проводит короткую диагностику: задаёт вопросы по каждому слою и помогает определить, где сейчас находится ваше узкое место.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6856d5ef91608191918552480e1018eb-pie-analysis-methodology-5-layers-of-business" target="_blank" class="l8-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Пройти анализ 5 слоёв
        </a>
    </div>
</div>`,

                homework: `<ol><li>Пройдіть аналіз в AI-асистенті</li><li>Напишіть у полі відповіді:<br>— в якому шарі зараз ваше вузьке місце<br>— чому ви так вважаєте<br>— яку проблему це створює у вашому бізнесі</li></ol>`,
                homework_ru: `<ol><li>Пройдите анализ в AI-ассистенте</li><li>Напишите в поле ответа:<br>— в каком слое сейчас ваше узкое место<br>— почему вы так считаете<br>— какую проблему это создаёт в вашем бизнесе</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-6856d5ef91608191918552480e1018eb-pie-analysis-methodology-5-layers-of-business",
                homeworkLinkName: "→ AI Аналіз 5 шарів",
                homeworkLinkName_ru: "→ AI Анализ 5 слоёв",
                time: 20
            },
            {
                id: 9,
                title: "ЦІЛЬ, ЗАДУМ, ПРОДУКТ ОРГАНІЗАЦІЇ. ФУНКЦІОНАЛЬНА СТРУКТУРА ТА РОЛІ",
                title_ru: "ЦЕЛЬ, ЗАМЫСЕЛ, ПРОДУКТ ОРГАНИЗАЦИИ. ФУНКЦИОНАЛЬНАЯ СТРУКТУРА И РОЛИ",
                subtitle: "Фундамент системного бізнесу",
                subtitle_ru: "Фундамент системного бизнеса",
                
                videoLink: null,
                materialsLink: null,
                
                lessonContent: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Ціль уроку</div>
    </div>
    <div class="lesson-block-content">
        <p>Це <strong>найважливіший урок курсу</strong>. Ви зрозумієте фундаментальні речі, без яких неможливо побудувати системний бізнес:</p>
        <div style="margin-top: 12px; display: grid; gap: 8px;">
            <div style="padding: 10px 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">Що таке <strong>Ціль, Задум і Продукт</strong> організації</div>
            <div style="padding: 10px 12px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">Як побудувати <strong>Функціональну структуру</strong></div>
            <div style="padding: 10px 12px; background: #faf5ff; border-radius: 8px; border-left: 4px solid #8b5cf6;">Різниця між <strong>Функціями та Ролями</strong></div>
        </div>
    </div>
</div>

<!-- ==================== ЧАСТИНА 1: ЦІЛЬ ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 1. ЦІЛЬ ОРГАНІЗАЦІЇ</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Ціль організації</strong> — це кінцевий стан, якого хоче досягти компанія. Це "пункт призначення" на карті.</p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 10px 0; font-weight: 600;">Приклади цілей:</p>
            <div style="display: grid; gap: 8px;">
                <div style="padding: 10px; background: white; border-radius: 8px; border-left: 4px solid #22c55e;">
                    <p style="margin: 0; font-size: 13px;"><strong>Мережа клінік:</strong> "Стати найбільшою мережею стоматологій в області до 2027 року"</p>
                </div>
                <div style="padding: 10px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; font-size: 13px;"><strong>Виробництво:</strong> "Вийти на експорт в 5 країн ЄС протягом 3 років"</p>
                </div>
                <div style="padding: 10px; background: white; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0; font-size: 13px;"><strong>Сервісна компанія:</strong> "Досягти 10 000 постійних клієнтів і 50 млн виручки"</p>
                </div>
            </div>
        </div>
        
        <div style="padding: 14px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-weight: 600;">Важливо:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Ціль — це НЕ "заробляти гроші". Гроші — це наслідок досягнення цілі. Ціль відповідає на питання: <strong>"Куди ми йдемо?"</strong></p>
        </div>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Проблема більшості бізнесів</div>
    </div>
    <div class="lesson-block-content">
        <p>90% власників не можуть чітко сформулювати ціль своєї компанії. Вони кажуть:</p>
        <div style="display: grid; gap: 8px; margin: 12px 0;">
            <div style="display: flex; gap: 10px; padding: 10px; background: #fef2f2; border-radius: 8px;">
                
                <span>"Хочу більше заробляти" — це не ціль, це бажання</span>
            </div>
            <div style="display: flex; gap: 10px; padding: 10px; background: #fef2f2; border-radius: 8px;">
                
                <span>"Хочу розвиватись" — це не ціль, це напрямок</span>
            </div>
            <div style="display: flex; gap: 10px; padding: 10px; background: #fef2f2; border-radius: 8px;">
                
                <span>"Хочу вільний час" — це не ціль, це мрія</span>
            </div>
        </div>
        <p><strong>Без чіткої цілі</strong> неможливо побудувати систему, бо незрозуміло куди вона має вести.</p>
    </div>
</div>

<!-- ==================== ЧАСТИНА 2: ЗАДУМ ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 2. ЗАДУМ ОРГАНІЗАЦІЇ</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Задум</strong> — це спосіб досягнення цілі. Якщо ціль — це "куди", то задум — це "як саме".</p>
        
        <div style="background: #f0fdf4; padding: 14px; border-radius: 8px; margin: 14px 0;">
            <p style="margin: 0; font-weight: 600;">Формула:</p>
            <p style="margin: 6px 0 0 0; font-size: 15px;"><strong>Задум = Що ми робимо + Для кого + Яким способом</strong></p>
        </div>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 10px 0; font-weight: 600;">Приклади задумів:</p>
            <div style="display: grid; gap: 10px;">
                <div style="padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #22c55e;">
                    <p style="margin: 0; font-weight: 600; color: #166534;">Мережа клінік</p>
                    <p style="margin: 6px 0 0 0; font-size: 13px;">"Надаємо комплексні стоматологічні послуги сім'ям середнього класу через мережу зручно розташованих клінік з акцентом на профілактику та довгострокові відносини з пацієнтами"</p>
                </div>
                <div style="padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; font-weight: 600; color: #1e40af;">Виробництво меблів</p>
                    <p style="margin: 6px 0 0 0; font-size: 13px;">"Виготовляємо корпусні меблі на замовлення для власників квартир преміум-класу, використовуючи європейські матеріали та власне виробництво з коротким терміном виконання"</p>
                </div>
            </div>
        </div>
        
        <div style="padding: 14px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-weight: 600;">Навіщо потрібен задум?</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Задум визначає <strong>бізнес-модель</strong>. Від нього залежить: яка структура потрібна, які люди, які процеси, які ресурси. Два бізнеси з однаковою ціллю можуть мати абсолютно різні задуми.</p>
        </div>
    </div>
</div>

<!-- ==================== ЧАСТИНА 3: ПРОДУКТ ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 3. ПРОДУКТ ОРГАНІЗАЦІЇ</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Продукт організації</strong> — це кінцевий результат діяльності компанії, те, за що клієнт платить гроші.</p>
        
        <div style="background: #fef3c7; padding: 14px; border-radius: 8px; margin: 14px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-weight: 600;">Критично важливо:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Продукт — це НЕ послуга чи товар. Продукт — це <strong>результат для клієнта</strong>, цінність, яку він отримує.</p>
        </div>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 12px 0; font-weight: 600;">Різниця між послугою і продуктом:</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #e5e7eb; background: #fef2f2; text-align: left;">Послуга (ЩО робимо)</th>
                    <th style="padding: 10px; border: 1px solid #e5e7eb; background: #f0fdf4; text-align: left;">Продукт (ЩО отримує клієнт)</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">Лікування зубів</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Здорова посмішка без болю</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">Ремонт квартири</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Затишний дім, готовий до життя</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">Бухгалтерський облік</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Спокій власника: все законно і вчасно</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">Виготовлення меблів</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Функціональний простір під стиль життя</strong></td>
                </tr>
            </table>
        </div>
        
        <div style="padding: 14px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; font-weight: 600;">Чому це важливо?</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Коли ви розумієте продукт — ви розумієте, що насправді потрібно клієнту. Це змінює все: маркетинг, продажі, сервіс, ціноутворення.</p>
        </div>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Ланцюжок: Ціль → Задум → Продукт</div>
    </div>
    <div class="lesson-block-content">
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; font-weight: 600; color: #dc2626;">ЦІЛЬ</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">Куди ми йдемо? Який кінцевий стан?</p>
                </div>
                <div style="text-align: center; color: #9ca3af; font-size: 20px;">↓</div>
                <div style="padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; font-weight: 600; color: #d97706;">ЗАДУМ</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">Яким способом досягаємо цілі? Бізнес-модель.</p>
                </div>
                <div style="text-align: center; color: #9ca3af; font-size: 20px;">↓</div>
                <div style="padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #22c55e;">
                    <p style="margin: 0; font-weight: 600; color: #16a34a;">ПРОДУКТ</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">Що отримує клієнт? За що платить гроші?</p>
                </div>
            </div>
        </div>
        <p style="margin-top: 14px; font-size: 13px;"><strong>Приклад:</strong> Ціль — стати лідером ринку стоматології в місті. Задум — мережа клінік для сімей з фокусом на профілактику. Продукт — здорова посмішка всієї родини на все життя.</p>
    </div>
</div>

<!-- ==================== ЧАСТИНА 4: ФУНКЦІОНАЛЬНА СТРУКТУРА ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 4. ФУНКЦІОНАЛЬНА СТРУКТУРА</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Функціональна структура</strong> — це каркас організації, який показує ВСІ функції, необхідні для досягнення цілі та виробництва продукту.</p>
        
        <div style="background: #f0fdf4; padding: 14px; border-radius: 8px; margin: 14px 0;">
            <p style="margin: 0; font-weight: 600;">Ключова ідея:</p>
            <p style="margin: 6px 0 0 0;">Структура будується від <strong>ФУНКЦІЙ</strong>, а не від людей. Спочатку визначаємо що потрібно робити, потім — хто це буде робити.</p>
        </div>
        
        <p style="font-weight: 600; margin: 16px 0 10px 0;">7 базових функцій будь-якої організації:</p>
        
        <div style="display: grid; gap: 10px;">
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">1</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">АДМІНІСТРАТИВНА</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Керування, координація, планування, контроль</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #3b82f6; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">2</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">МАРКЕТИНГ</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Залучення клієнтів, реклама, просування, бренд</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #22c55e; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">3</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">ПРОДАЖІ</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Конвертація лідів в клієнтів, укладання угод</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #f59e0b; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">4</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">ВИРОБНИЦТВО / НАДАННЯ ПОСЛУГ</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Створення продукту, виконання замовлень</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #ef4444; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">5</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">ФІНАНСИ</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Облік, бюджетування, управління грошима</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #ec4899; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">6</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">ПЕРСОНАЛ (HR)</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Найм, навчання, мотивація, розвиток команди</p>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; align-items: flex-start;">
                <span style="background: #6366f1; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">7</span>
                <div>
                    <p style="margin: 0; font-weight: 600;">ЯКІСТЬ / КОНТРОЛЬ</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Стандарти, перевірки, покращення процесів</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Чому структура від функцій, а не від людей?</div>
    </div>
    <div class="lesson-block-content">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
                <th style="padding: 12px; border: 1px solid #e5e7eb; background: #fef2f2; text-align: left;"><span style="color: #ef4444; font-weight: bold;">✗</span> Структура від людей</th>
                <th style="padding: 12px; border: 1px solid #e5e7eb; background: #f0fdf4; text-align: left;"><span style="color: #22c55e; font-weight: bold;">✓</span> Структура від функцій</th>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">"Є Петро — він робить все"</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">"Є функція Продажі — її виконує Петро"</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Петро звільнився — хаос</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Петро звільнився — шукаємо людину на функцію</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Незрозуміло що робити новому</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Є опис функції — легко навчити</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Бізнес = залежність від людей</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Бізнес = система, що працює</td>
            </tr>
        </table>
    </div>
</div>

<!-- ==================== ЧАСТИНА 5: ІЄРАРХІЯ ФУНКЦІЯ → ОПЕРАЦІЇ ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 5. Ієрархія: від Функції до Операції</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom: 16px;">Кожна функція розкладається на менші елементи:</p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #8b5cf6;">
                <p style="font-weight: 700; margin: 0; color: #8b5cf6; font-size: 15px;">ФУНКЦІЯ</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b7280;">Область відповідальності. <em>Приклад: Продажі</em></p>
            </div>
            <div style="text-align: center; color: #9ca3af; font-size: 18px;">↓</div>
            <div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #3b82f6;">
                <p style="font-weight: 700; margin: 0; color: #3b82f6; font-size: 15px;">ОБОВ'ЯЗКИ</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b7280;"><strong>ЩО</strong> потрібно робити. <em>Приклад: Обробляти заявки, Проводити зустрічі, Укладати договори</em></p>
            </div>
            <div style="text-align: center; color: #9ca3af; font-size: 18px;">↓</div>
            <div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #22c55e;">
                <p style="font-weight: 700; margin: 0; color: #22c55e; font-size: 15px;">ПРОЦЕС (Направляюча форма)</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b7280;">Послідовність етапів від початку до результату. <em>Приклад: Процес продажу в 5 етапів</em></p>
            </div>
            <div style="text-align: center; color: #9ca3af; font-size: 18px;">↓</div>
            <div style="padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="font-weight: 700; margin: 0; color: #f59e0b; font-size: 15px;">ОПЕРАЦІЇ</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b7280;"><strong>ЯК</strong> виконується кожен крок. <em>Приклад: 1. Відкрити CRM 2. Знайти картку 3. Зателефонувати...</em></p>
            </div>
        </div>
        
        <div style="padding: 14px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-weight: 600;">Ключове розуміння:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;"><strong>Обов'язки</strong> = ЩО потрібно зробити (результат)<br><strong>Операції</strong> = ЯК це виконується (кроки)</p>
        </div>
    </div>
</div>

<!-- ==================== ЧАСТИНА 6: РОЛІ ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 6. ФУНКЦІЇ vs РОЛІ</div>
    </div>
    <div class="lesson-block-content">
        <p>Це одне з найважливіших розумінь для власника малого та середнього бізнесу.</p>
        
        <div style="display: grid; gap: 16px; margin: 16px 0;">
            <div style="padding: 16px; background: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
                <p style="margin: 0; font-weight: 700; color: #1e40af; font-size: 15px;">ФУНКЦІЯ</p>
                <p style="margin: 8px 0 0 0; font-size: 13px;">Це <strong>область роботи</strong>, яка існує незалежно від людей. Функція "Продажі" існує завжди — хтось має її виконувати.</p>
            </div>
            <div style="padding: 16px; background: #faf5ff; border-radius: 10px; border: 1px solid #e9d5ff;">
                <p style="margin: 0; font-weight: 700; color: #7c3aed; font-size: 15px;">РОЛЬ</p>
                <p style="margin: 8px 0 0 0; font-size: 13px;">Це <strong>капелюх</strong>, який надягає конкретна людина, коли виконує функцію. Одна людина може носити кілька "капелюхів".</p>
            </div>
        </div>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 12px 0; font-weight: 600;">Приклад для малого бізнесу:</p>
            <div style="display: grid; gap: 8px; font-size: 13px;">
                <div style="display: flex; gap: 8px; padding: 10px; background: white; border-radius: 8px;">
                    <span style="font-weight: 600; color: #3b82f6; min-width: 80px;">Марія:</span>
                    <span>Виконує функції <strong>Адміністратор + HR + Частково Фінанси</strong> = 3 ролі</span>
                </div>
                <div style="display: flex; gap: 8px; padding: 10px; background: white; border-radius: 8px;">
                    <span style="font-weight: 600; color: #22c55e; min-width: 80px;">Олег:</span>
                    <span>Виконує функції <strong>Продажі + Маркетинг</strong> = 2 ролі</span>
                </div>
                <div style="display: flex; gap: 8px; padding: 10px; background: white; border-radius: 8px;">
                    <span style="font-weight: 600; color: #8b5cf6; min-width: 80px;">Власник:</span>
                    <span>Виконує функції <strong>Директор + Продажі + Фінанси + Все інше</strong> = 5+ ролей</span>
                </div>
            </div>
        </div>
        
        <div style="padding: 14px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
            <p style="margin: 0; font-weight: 600;">Проблема більшості власників:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Власник носить 10-15 "капелюхів" одночасно і не розуміє чому втомлений. Він не бачить, скільки ФУНКЦІЙ насправді виконує, бо ніколи їх не виписував.</p>
        </div>
    </div>
</div>

<div class="lesson-block warning">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Функції ВЛАСНИКА vs функції ДИРЕКТОРА</div>
    </div>
    <div class="lesson-block-content">
        <p style="margin-bottom: 12px;">Це різні ролі з різними функціями:</p>
        
        <div style="display: grid; gap: 12px;">
            <div style="padding: 14px; background: #fef3c7; border-radius: 10px; border: 1px solid #fde68a;">
                <p style="margin: 0; font-weight: 700; color: #92400e;">ВЛАСНИК відповідає за:</p>
                <div style="margin-top: 8px; display: grid; gap: 4px; font-size: 13px;">
                    <div style="display: flex; gap: 8px;"><span style="color: #f59e0b;">•</span> Ідеологію та цінності компанії</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #f59e0b;">•</span> Стратегічний маркетинг (куди рухаємось)</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #f59e0b;">•</span> Координацію між напрямками</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #f59e0b;">•</span> Політики та етику</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #f59e0b;">•</span> Технологію (як працює бізнес)</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #f59e0b;">•</span> Фінанси (розподіл прибутку)</div>
                </div>
            </div>
            
            <div style="padding: 14px; background: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
                <p style="margin: 0; font-weight: 700; color: #1e40af;">ДИРЕКТОР відповідає за:</p>
                <div style="margin-top: 8px; display: grid; gap: 4px; font-size: 13px;">
                    <div style="display: flex; gap: 8px;"><span style="color: #3b82f6;">•</span> Оперативне управління</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #3b82f6;">•</span> Виконання планів</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #3b82f6;">•</span> Досягнення прибутку</div>
                    <div style="display: flex; gap: 8px;"><span style="color: #3b82f6;">•</span> Управління командою</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 14px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; font-size: 13px;"><strong>Ціль системного бізнесу:</strong> Власник виконує ТІЛЬКИ функції власника, а не бігає з 15 капелюхами.</p>
        </div>
    </div>
</div>

<!-- ==================== ЧАСТИНА 7: ПОЛІТИКИ ==================== -->

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТИНА 7. ПОЛІТИКИ — правила гри</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Політика</strong> — це письмова домовленість про те, як прийнято діяти в компанії.</p>
        
        <div style="display: grid; gap: 10px; margin: 14px 0;">
            <div style="padding: 12px 14px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <strong>1. Як тут прийнято діяти?</strong>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Стандарт поведінки</p>
            </div>
            <div style="padding: 12px 14px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong>2. Що можна, а що не можна?</strong>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Межі дозволеного</p>
            </div>
            <div style="padding: 12px 14px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                <strong>3. Що буде, якщо порушити?</strong>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Наслідки</p>
            </div>
        </div>
        
        <p style="font-weight: 600; margin: 16px 0 10px 0;">Приклади політик:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Запізнення</span>
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Знижки клієнтам</span>
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Робота з готівкою</span>
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Повернення товару</span>
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Використання телефону</span>
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Дрес-код</span>
            <span style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; font-size: 13px;">Конфіденційність</span>
        </div>
        
        <div style="margin-top: 14px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; font-size: 13px;"><strong>Без політик:</strong> "А мені ніхто не казав". <strong>З політиками:</strong> "Це правило компанії, ви його підписали".</p>
        </div>
    </div>
</div>

<!-- ==================== ПІДСУМОК ==================== -->

<div class="lesson-block success">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ПІДСУМОК: Як все пов'язано</div>
    </div>
    <div class="lesson-block-content">
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
            <div style="display: grid; gap: 10px;">
                <div style="display: flex; gap: 12px; padding: 12px; background: white; border-radius: 8px; align-items: center;">
                    <span style="background: #ef4444; color: white; padding: 6px 10px; border-radius: 6px; font-weight: 600;">1</span>
                    <div>
                        <p style="margin: 0; font-weight: 600;">ЦІЛЬ</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Куди йдемо</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; padding: 12px; background: white; border-radius: 8px; align-items: center;">
                    <span style="background: #f59e0b; color: white; padding: 6px 10px; border-radius: 6px; font-weight: 600;">2</span>
                    <div>
                        <p style="margin: 0; font-weight: 600;">ЗАДУМ</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Яким способом</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; padding: 12px; background: white; border-radius: 8px; align-items: center;">
                    <span style="background: #22c55e; color: white; padding: 6px 10px; border-radius: 6px; font-weight: 600;">3</span>
                    <div>
                        <p style="margin: 0; font-weight: 600;">ПРОДУКТ</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Що отримує клієнт</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; padding: 12px; background: white; border-radius: 8px; align-items: center;">
                    <span style="background: #3b82f6; color: white; padding: 6px 10px; border-radius: 6px; font-weight: 600;">4</span>
                    <div>
                        <p style="margin: 0; font-weight: 600;">ФУНКЦІОНАЛЬНА СТРУКТУРА</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Які функції потрібні для продукту</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; padding: 12px; background: white; border-radius: 8px; align-items: center;">
                    <span style="background: #8b5cf6; color: white; padding: 6px 10px; border-radius: 6px; font-weight: 600;">5</span>
                    <div>
                        <p style="margin: 0; font-weight: 600;">РОЛІ</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Хто виконує функції</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; padding: 12px; background: white; border-radius: 8px; align-items: center;">
                    <span style="background: #ec4899; color: white; padding: 6px 10px; border-radius: 6px; font-weight: 600;">6</span>
                    <div>
                        <p style="margin: 0; font-weight: 600;">ПОЛІТИКИ</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Правила гри для всіх</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="lesson-block success">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Що далі?</div>
    </div>
    <div class="lesson-block-content">
        <p style="font-size: 15px;">Тепер ви розумієте <strong>як все пов'язано</strong> в бізнесі: ціль → задум → продукт → функції → ролі → політики.</p>
        <p style="margin-top: 12px; padding: 14px; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #22c55e; font-size: 14px;">
            <strong>В наступному уроці</strong> ми перейдемо до практики — ви сформулюєте <strong>ціль та ідеальну картину</strong> вашого бізнесу.
        </p>
    </div>
</div>
                `,
                
                lessonContent_ru: `
<div class="lesson-block intro">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">Цель урока</div>
    </div>
    <div class="lesson-block-content">
        <p>Это <strong>самый важный урок курса</strong>. Вы поймёте фундаментальные вещи, без которых невозможно построить системный бизнес:</p>
        <div style="margin-top: 12px; display: grid; gap: 8px;">
            <div style="padding: 10px 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">Что такое <strong>Цель, Замысел и Продукт</strong> организации</div>
            <div style="padding: 10px 12px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">Как построить <strong>Функциональную структуру</strong></div>
            <div style="padding: 10px 12px; background: #faf5ff; border-radius: 8px; border-left: 4px solid #8b5cf6;">Разница между <strong>Функциями и Ролями</strong></div>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТЬ 1. ЦЕЛЬ ОРГАНИЗАЦИИ</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Цель организации</strong> — это конечное состояние, которого хочет достичь компания. Это "пункт назначения" на карте.</p>
        <div style="padding: 14px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 12px;">
            <p style="margin: 0; font-weight: 600;">Важно:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Цель — это НЕ "зарабатывать деньги". Деньги — это следствие достижения цели. Цель отвечает на вопрос: <strong>"Куда мы идём?"</strong></p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТЬ 2. ЗАМЫСЕЛ ОРГАНИЗАЦИИ</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Замысел</strong> — это способ достижения цели. Если цель — это "куда", то замысел — это "как именно".</p>
        <div style="background: #f0fdf4; padding: 14px; border-radius: 8px; margin: 14px 0;">
            <p style="margin: 0; font-weight: 600;">Формула:</p>
            <p style="margin: 6px 0 0 0; font-size: 15px;"><strong>Замысел = Что мы делаем + Для кого + Каким способом</strong></p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТЬ 3. ПРОДУКТ ОРГАНИЗАЦИИ</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Продукт</strong> — это то, за что клиент платит деньги. Не процесс, не услуга, а <strong>конечный результат</strong>, который получает клиент.</p>
        <div style="background: #f0fdf4; padding: 14px; border-radius: 8px; margin: 14px 0;">
            <p style="margin: 0; font-weight: 600;">ЦКП — Ценный Конечный Продукт:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;"><strong>Ценный</strong> — клиент готов платить. <strong>Конечный</strong> — завершённый, не требует доработки. <strong>Продукт</strong> — результат, не процесс.</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТЬ 4. ФУНКЦИОНАЛЬНАЯ СТРУКТУРА</div>
    </div>
    <div class="lesson-block-content">
        <p><strong>Функция</strong> — это набор действий, которые приводят к определённому результату.</p>
        <p style="margin-top: 12px;"><strong>Функциональная структура</strong> — это список ВСЕХ функций, необходимых для производства продукта.</p>
        <div style="padding: 14px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 12px;">
            <p style="margin: 0; font-weight: 600;">Зачем это нужно?</p>
            <p style="margin: 6px 0 0 0; font-size: 13px;">Когда все функции описаны — понятно что делать. Когда функции распределены по людям — понятно кто отвечает.</p>
        </div>
    </div>
</div>

<div class="lesson-block step">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ЧАСТЬ 5. ФУНКЦИЯ vs РОЛЬ</div>
    </div>
    <div class="lesson-block-content">
        <div style="display: grid; gap: 12px;">
            <div style="padding: 14px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
                <p style="margin: 0; font-weight: 600; color: #166534;">ФУНКЦИЯ — что нужно делать</p>
                <p style="margin: 6px 0 0 0; font-size: 13px;">"Вести бухгалтерию", "Продавать", "Закупать материалы"</p>
            </div>
            <div style="padding: 14px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; font-weight: 600; color: #1e40af;">РОЛЬ — кто это делает</p>
                <p style="margin: 6px 0 0 0; font-size: 13px;">"Бухгалтер Мария", "Менеджер Алексей", "Собственник Иван"</p>
            </div>
        </div>
        <p style="margin-top: 12px;"><strong>Важно:</strong> Один человек может выполнять несколько функций. Одна функция может быть распределена между несколькими людьми.</p>
    </div>
</div>

<div class="lesson-block success">
    <div class="lesson-block-header">
        
        <div class="lesson-block-title">ИТОГ: Как всё связано</div>
    </div>
    <div class="lesson-block-content">
        <p style="font-size: 15px;">Теперь вы понимаете <strong>как всё связано</strong> в бизнесе: цель → замысел → продукт → функции → роли.</p>
        <p style="margin-top: 12px; padding: 14px; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #22c55e; font-size: 14px;">
            <strong>В следующем уроке</strong> мы перейдём к практике — вы сформулируете <strong>цель и идеальную картину</strong> вашего бизнеса.
        </p>
    </div>
</div>
                `,
                
                homeworkLink: null,
                homeworkLinkName: null,
                homeworkLinkName_ru: null,
                time: 15
            },
            {
                id: 10,
                title: "ЦІЛЬ І ЗАДУМ",
                title_ru: "ЦЕЛЬ И ЗАМЫСЕЛ",
                subtitle: "Фундамент, на якому тримається управління, мотивація і розвиток бізнесу",
                subtitle_ru: "Фундамент, на котором держится управление, мотивация и развитие бизнеса",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l10-section { margin-bottom:1.75rem; }
.l10-section:last-child { margin-bottom:0; }
.l10-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l10-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l10-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l10-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l10-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l10-card p+p { margin-top:0.7rem; }
.l10-situations { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l10-situation { display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.9rem; background:#fef2f2; border:1px solid #fecaca; border-radius:9px; font-size:0.85rem; color:#7f1d1d; line-height:1.5; }
.l10-scale { display:grid; gap:0.4rem; margin-top:0.75rem; counter-reset:scalenum; }
.l10-scale-item { display:flex; align-items:flex-start; gap:0.75rem; padding:0.7rem 0.9rem; background:#f8fafc; border-radius:9px; border:1px solid #e2e8f0; counter-increment:scalenum; }
.l10-scale-num { width:26px; height:26px; background:#1a1a1a; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; flex-shrink:0; }
.l10-scale-title { font-weight:700; color:#1a1a1a; font-size:0.84rem; margin-bottom:0.15rem; }
.l10-scale-text { font-size:0.78rem; color:#525252; line-height:1.4; }
.l10-motivation { display:grid; gap:0.55rem; margin-top:0.75rem; }
.l10-motiv-item { padding:0.8rem 0.95rem; border-radius:10px; border:1px solid; }
.l10-motiv-header { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem; }
.l10-motiv-badge { font-size:0.68rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:4px; letter-spacing:0.04em; }
.l10-motiv-title { font-weight:700; font-size:0.875rem; }
.l10-motiv-text { font-size:0.82rem; line-height:1.5; }
.l10-examples { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l10-example { display:flex; align-items:flex-start; gap:0.7rem; padding:0.7rem 0.9rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:9px; }
.l10-example-icon { width:30px; height:30px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l10-example-label { font-weight:700; color:#1a1a1a; font-size:0.8rem; margin-bottom:0.15rem; }
.l10-example-text { font-size:0.82rem; color:#525252; line-height:1.45; }
.l10-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l10-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l10-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l10-step-body { flex:1; }
.l10-step-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l10-step-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l10-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l10-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l10-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l10-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l10-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l10-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l10-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l10-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l10-quote { margin:0.85rem 0; padding:0.9rem 1.1rem; background:linear-gradient(135deg,#f0fdf4,#dcfce7); border-left:3px solid #22c55e; border-radius:0 10px 10px 0; font-size:0.9rem; color:#166534; font-style:italic; line-height:1.6; }
.l10-schema { display:flex; align-items:center; gap:0.4rem; padding:0.85rem 1rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; margin-top:0.75rem; flex-wrap:wrap; }
.l10-schema-item { font-weight:700; color:#166534; font-size:0.85rem; }
.l10-schema-arrow { color:#22c55e; font-weight:700; }
.l10-bad-good { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-top:0.75rem; }
.l10-bad-col { padding:0.85rem 0.95rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; }
.l10-good-col { padding:0.85rem 0.95rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; }
.l10-col-label { font-size:0.7rem; font-weight:700; letter-spacing:0.06em; margin-bottom:0.5rem; }
.l10-col-items { display:grid; gap:0.35rem; }
.l10-col-item { font-size:0.82rem; line-height:1.45; }
</style>

<div class="l10-section">
    <div class="l10-section-label">Розділ 1</div>
    <div class="l10-section-title">Головна перешкода впровадження: чому команда саботує зміни</div>
    <div class="l10-card">
        <p>Кожен власник, який намагається навести лад у бізнесі, стикається з одним і тим же: найближчі, найлояльніші співробітники раптом починають чинити опір. Людина, якій ви довіряли роками, раптом виявляє незадоволення. Хтось подає у відставку. Інші починають ставити під сумнів ваші рішення.</p>
        <p>Здається, що це зрада. Але насправді — це закономірність.</p>
    </div>

    <div class="l10-section-label" style="margin-top:1rem;">Скільки коштує втрата одного співробітника</div>
    <div class="l10-card">
        <p>За міжнародними дослідженнями, втрата одного співробітника коштує від 6 до 12 місяців його зарплати. Якщо ваш керівник відділу отримує 40 000 грн на місяць — його звільнення обійдеться вам мінімум у 240 000 грн. Але це лише пряма, видима втрата.</p>
    </div>
    <div class="l10-situations">
        <div class="l10-situation"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Людина, яка звільняється, активно критикує вас перед рештою команди</div>
        <div class="l10-situation"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Інші співробітники починають сумніватися: «А може, він правий?»</div>
        <div class="l10-situation"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Ваш час іде на вирішення конфліктів замість розвитку бізнесу</div>
        <div class="l10-situation"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Пошук і адаптація нової людини займає від 2 до 6 місяців — і не гарантує результату</div>
    </div>

    <div class="l10-section-label" style="margin-top:1rem;">Чому люди опираються — справжня причина</div>
    <div class="l10-card">
        <p>Більшість власників думають, що опір — це нелояльність або лінь. Насправді причина набагато простіша: <strong>ви впроваджуєте зміни, бо бачите проблему. Але чи бачать її ваші співробітники?</strong></p>
        <p>Щоб змінити поведінку людини — потрібно дати їй більшу, значущу мету, яка переважить бажання зберегти статус-кво. Цілі повинні бути справді великими — такими, що викликають ентузіазм і бажання бути частиною чогось більшого.</p>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 2</div>
    <div class="l10-section-title">Мета і задум компанії — фундамент всього</div>
    <div class="l10-card">
        <p>Все у вашому бізнесі — структура, правила, мотивація команди, навіть конкретні рішення щодня — має спиратися на дві речі: мету і задум. Без них компанія схожа на корабель без компасу: рухається, але не знає куди.</p>
    </div>

    <div class="l10-section-label" style="margin-top:1rem;">Що таке мета</div>
    <div class="l10-card">
        <p>Мета — це основна ідея компанії. Вона відповідає на питання: <strong>для чого ми існуємо? Що зміниться у світі, якщо ми будемо успішні?</strong></p>
        <p>Типова помилка: «Моя мета — заробити гроші». Це все одно що сказати: «Мета мого існування — дихати». Технічно правда, але це не пояснює, навіщо ви обрали саме цей бізнес. Гроші — це енергія для досягнення мети. Але не сама мета.</p>
    </div>
    <div class="l10-examples">
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><div class="l10-example-label">Консалтингова компанія</div><div class="l10-example-text">Зробити малий бізнес розумнішим, ефективнішим і незалежним від власника</div></div>
        </div>
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><div class="l10-example-label">Стоматологія</div><div class="l10-example-text">Зробити людей здоровими і впевненими у своїй посмішці</div></div>
        </div>
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><div class="l10-example-label">Будівельна компанія</div><div class="l10-example-text">Створювати комфортне та безпечне житло для сімей</div></div>
        </div>
    </div>
    <div class="l10-quote">Запитайте себе: як змінюється життя людей завдяки моєму бізнесу? Що зникне зі світу, якщо моя компанія закриється?</div>

    <div class="l10-section-label" style="margin-top:1rem;">Що таке задум</div>
    <div class="l10-card">
        <p>Якщо мета відповідає на питання «навіщо», то задум відповідає на питання «як». Задум — це ваш унікальний спосіб досягати мети. Те, що ви робите — і чого свідомо <strong>НЕ</strong> робите.</p>
        <p>Важливо: задум не вигадують з нуля. Він відображає ваш реальний досвід і розуміння ринку. Він базується на тому, як ви вже досягаєте успіху — просто це ще не сформульовано.</p>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 3</div>
    <div class="l10-section-title">Адміністративна шкала — хребет бізнесу</div>
    <div class="l10-card">
        <p>Уявіть: у вас є нова ідея. Нова послуга, новий напрямок, нова акція. Як зрозуміти — це хороша ідея чи погана? Більшість власників вирішують «на відчуттях». Результат: витрачені гроші, час і розфокус.</p>
        <p>Великі компанії мають інструмент для перевірки будь-якої ідеї. Coca-Cola не починає продавати ковбасу. McDonald's не відкриває автосалони. Вони знають свій шлях — і кожна нова ідея перевіряється: чи вона на цьому шляху? Цей інструмент називається <strong>адміністративна шкала</strong>.</p>
    </div>
    <div class="l10-section-label" style="margin-top:1rem;">10 рівнів шкали (від найвищого до найнижчого)</div>
    <div class="l10-scale">
        <div class="l10-scale-item"><div class="l10-scale-num">1</div><div><div class="l10-scale-title">Мета</div><div class="l10-scale-text">Навіщо ми існуємо</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">2</div><div><div class="l10-scale-title">Задум</div><div class="l10-scale-text">Як саме ми досягаємо мети</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">3</div><div><div class="l10-scale-title">Політика</div><div class="l10-scale-text">Письмові правила, в яких рамках діємо</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">4</div><div><div class="l10-scale-title">Плани</div><div class="l10-scale-text">Що ми робимо в найближчий горизонт</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">5</div><div><div class="l10-scale-title">Програми</div><div class="l10-scale-text">Конкретні ініціативи для досягнення планів</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">6</div><div><div class="l10-scale-title">Проекти</div><div class="l10-scale-text">Деталізація конкретних завдань</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">7</div><div><div class="l10-scale-title">Накази</div><div class="l10-scale-text">Конкретні вказівки конкретним людям</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">8</div><div><div class="l10-scale-title">Ідеальна картина</div><div class="l10-scale-text">Як виглядає успішний результат</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">9</div><div><div class="l10-scale-title">Статистика</div><div class="l10-scale-text">Метрики, які показують чи рухаємося до мети</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">10</div><div><div class="l10-scale-title">Кінцевий продукт</div><div class="l10-scale-text">Що конкретно виробляє компанія або відділ</div></div></div>
    </div>
    <div class="l10-quote">Головний принцип: кожен рівень має відповідати іншим. Якщо ваш наказ суперечить меті — щось піде не так. Якщо план суперечить задуму — зусилля витрачаються даремно.</div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 4</div>
    <div class="l10-section-title">Політика компанії — правила, які рятують бізнес</div>
    <div class="l10-card">
        <p>Без чітких письмових правил кожен вирішує по-своєму. «Пацієнт просить знижку — давати?» «Клієнт залишив поганий відгук — як реагувати?» «Лікар запізнився — що говорити пацієнту?» І кожного разу — питання до вас.</p>
        <p>Політика компанії — це письмові правила, які говорять співробітникам, як діяти в різних ситуаціях. Не «як хочеш», а «як правильно для нашої компанії».</p>
    </div>
    <div class="l10-card" style="margin-top:0.6rem;">
        <p><strong>Класичний приклад з Apple:</strong> Стів Джобс мав чіткий задум — Apple контролює все: залізо, операційну систему і програмне забезпечення. Але він не записав це правило офіційно. Коли його звільнили, нове керівництво почало продавати ліцензії на macOS. Якість Apple впала, задум зруйнувався, компанія опинилася на межі банкрутства.</p>
    </div>
    <div class="l10-quote">Якщо немає письмових правил — ви самі стаєте заручником бізнесу. Вам доводиться особисто вирішувати кожну ситуацію і ви фізично не можете поїхати у відпустку.</div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 5</div>
    <div class="l10-section-title">Технологія бізнесу — як вийти з пастки «незамінних»</div>
    <div class="l10-card">
        <p>Скільки разів ви пояснювали одне й те саме? Новому співробітнику. Потім ще одному. Кожен раз — як вперше. Тому що «як треба робити» — у вашій голові, а не на папері.</p>
        <p>Технологія — це послідовність дій, яка дає передбачуваний результат. Не філософія. Не теорія. Чіткі кроки: роби так — отримаєш це.</p>
    </div>
    <div class="l10-section-label" style="margin-top:1rem;">Чотири наслідки роботи без описаних процесів</div>
    <div class="l10-situations">
        <div class="l10-situation" style="background:#fef2f2;border-color:#fecaca;color:#7f1d1d;"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Неможливо масштабувати.</strong> Хочете відкрити другу точку? Як ви передасте «як треба робити»? Ніяк — це тільки у вашій голові.</div></div>
        <div class="l10-situation" style="background:#fef2f2;border-color:#fecaca;color:#7f1d1d;"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Неможливо навчати людей.</strong> Новий співробітник приходить, ви витрачаєте тижні на навчання, він звільняється — і все спочатку.</div></div>
        <div class="l10-situation" style="background:#fef2f2;border-color:#fecaca;color:#7f1d1d;"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Неможливо контролювати якість.</strong> Як перевірити чи правильно зробили? Якщо немає стандарту — немає критерію.</div></div>
        <div class="l10-situation" style="background:#fef2f2;border-color:#fecaca;color:#7f1d1d;"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Ви стаєте заручником «незамінних».</strong> Є Петро, який «знає як». Без Петра — все зупиняється. Петро це знає. І користується цим.</div></div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 6</div>
    <div class="l10-section-title">Рівні мотивації — чому одні горять роботою, а іншим байдуже</div>
    <div class="l10-card">
        <p>Мотивація — це внутрішнє бажання щось робити. Не тому що змушують або платять, а тому що людина сама хоче. І важливий нюанс: мотивований новачок часто цінніший, ніж досвідчений байдужий — бо мотивований <em>вчиться</em>.</p>
    </div>
    <div class="l10-motivation">
        <div class="l10-motiv-item" style="background:#f0fdf4;border-color:#bbf7d0;">
            <div class="l10-motiv-header">
                <span class="l10-motiv-badge" style="background:#22c55e;color:white;">РІВЕНЬ 1</span>
                <span class="l10-motiv-title" style="color:#166534;">Почуття обов'язку</span>
            </div>
            <div class="l10-motiv-text" style="color:#166534;">Людина відчуває глибоку відповідальність за справу. Вона дбає про компанію більше, ніж про себе. Розуміє цілі компанії і відчуває: «Це — моя справа». Власники бізнесу і «старожили» часто перебувають на цьому рівні.</div>
        </div>
        <div class="l10-motiv-item" style="background:#eff6ff;border-color:#bfdbfe;">
            <div class="l10-motiv-header">
                <span class="l10-motiv-badge" style="background:#3b82f6;color:white;">РІВЕНЬ 2</span>
                <span class="l10-motiv-title" style="color:#1e40af;">Особиста переконаність</span>
            </div>
            <div class="l10-motiv-text" style="color:#1e3a8a;">Людина вірить у свої принципи і в цінність своєї роботи. Лікар, який справді хоче допомагати людям. Програміст, який пишається якістю коду. Вони роблять добре, бо для них це питання особистої честі.</div>
        </div>
        <div class="l10-motiv-item" style="background:#fff7ed;border-color:#fed7aa;">
            <div class="l10-motiv-header">
                <span class="l10-motiv-badge" style="background:#f97316;color:white;">РІВЕНЬ 3</span>
                <span class="l10-motiv-title" style="color:#c2410c;">Особиста вигода</span>
            </div>
            <div class="l10-motiv-text" style="color:#9a3412;">Людина шукає, що вона отримає особисто: бонус, кар'єрне зростання, нові навички. Це не погано — з цим можна і треба працювати. Але вона не буде «горіти» заради компанії.</div>
        </div>
        <div class="l10-motiv-item" style="background:#fef2f2;border-color:#fecaca;">
            <div class="l10-motiv-header">
                <span class="l10-motiv-badge" style="background:#ef4444;color:white;">РІВЕНЬ 4</span>
                <span class="l10-motiv-title" style="color:#b91c1c;">Гроші</span>
            </div>
            <div class="l10-motiv-text" style="color:#991b1b;">Найнижчий рівень. Людину цікавить тільки зарплата. Плати — працює. Не платиш — не працює. Жодної ініціативи, жодного «понаднорми заради результату».</div>
        </div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 7</div>
    <div class="l10-section-title">Як підвищувати мотивацію — єдиний інструмент, який працює завжди</div>
    <div class="l10-card">
        <p>Мотивація залежить від того, що людина вважає реальним. Гроші — реальні для всіх. А велика місія компанії, вплив на суспільство? Для одних — реально. Для інших — пусті красиві слова.</p>
        <p>Але ключовий момент: людина, яка чує тільки ритм, може навчитися чути більше — якщо буде слухати, аналізувати, тренуватися.</p>
    </div>
    <div class="l10-section-label" style="margin-top:1rem;">Формула підвищення мотивації</div>
    <div class="l10-schema">
        <span class="l10-schema-item">Показуєте ціль</span>
        <span class="l10-schema-arrow">→</span>
        <span class="l10-schema-item">Утримуєте увагу</span>
        <span class="l10-schema-arrow">→</span>
        <span class="l10-schema-item">Ціль стає реальною</span>
        <span class="l10-schema-arrow">→</span>
        <span class="l10-schema-item">Людина мотивована</span>
    </div>
    <div class="l10-card" style="margin-top:0.75rem;">
        <p>Утримувати увагу на великих цілях — важко. Коли є тиск і стрес — увага йде на виживання. Людина забуває про великі цілі, фокус — на рахунках і конфліктах. Рішення: <strong>постійно нагадувати</strong>. Регулярно розповідати про цілі. Показувати, як робота впливає на конкретних людей і клієнтів.</p>
    </div>
    <div class="l10-examples">
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>
            <div><div class="l10-example-label">Шиномонтаж</div><div class="l10-example-text">«Твоя робота рятує життя на дорозі. Кожна правильно встановлена шина — це безпека сім'ї»</div></div>
        </div>
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>
            <div><div class="l10-example-label">Стоматологія</div><div class="l10-example-text">«Ти повертаєш людям впевненість у собі. Це більше, ніж просто лікування зубів»</div></div>
        </div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 8</div>
    <div class="l10-section-title">Як донести цілі та задум до команди</div>
    <div class="l10-card">
        <p>Ви сформулювали мету і задум. Але якщо про це знаєте тільки ви — це нічого не змінить. Завдання: зробити так, щоб кожен у команді знав, куди рухається компанія — і чому.</p>
    </div>
    <div class="l10-section-label" style="margin-top:1rem;">Простий план з 4 кроків</div>
    <div class="l10-steps">
        <div class="l10-step">
            <div class="l10-step-num">1</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Створіть офіційний письмовий документ</div>
                <div class="l10-step-text">Не розмова, не «всі і так знають» — письмовий документ із підписом засновника. Три частини: мета компанії, задум і коротка історія. Підпис сигналізує команді: «Це серйозно. Це від першої особи».</div>
            </div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">2</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Офіційно презентуйте документ команді</div>
                <div class="l10-step-text">Зберіть всіх разом — на планерці, окремій зустрічі або щомісячних зборах. Головне — щоб були всі ключові люди.</div>
            </div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">3</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Запишіть виступ на відео</div>
                <div class="l10-step-text">Якщо хтось пропустив — надішліть відео. Новий співробітник — дайте подивитись у перший день. Через рік забули — можна переглянути і освіжити.</div>
            </div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">4</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Регулярно нагадуйте</div>
                <div class="l10-step-text">Мета і задум — це не «сказав один раз і забув». Повертайтеся до них на зборах, при прийнятті рішень, при поясненні змін. Це тримає всю команду на одній хвилі.</div>
            </div>
        </div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Розділ 9</div>
    <div class="l10-section-title">Як провести перше заняття — практичний алгоритм</div>
    <div class="l10-card">
        <p>Перше заняття, де ви презентуєте цілі і задум команді, задає тон всьому подальшому. Якщо зробите добре — співробітники підтримають зміни і почнуть рухатися разом. Якщо погано — сприймуть це як «чергову нісенітницю від шефа».</p>
        <p>Більшість співробітників сприймають нові інструменти як «зайве навантаження». Вирішення — <strong>спочатку мета, потім інструменти</strong>. Ніяк не навпаки.</p>
    </div>
    <div class="l10-section-label" style="margin-top:1rem;">4 результати першого заняття</div>
    <div class="l10-result-list" style="margin-top:0.5rem;">
        <div class="l10-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>«Ми — команда» — всі рухаються до спільної мети</div>
        <div class="l10-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Спільна мета — конкретна, з цифрами та ідеальною картиною</div>
        <div class="l10-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Навіщо вчитися — кожен розуміє, що це дасть особисто йому</div>
        <div class="l10-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Реальна підтримка змін — не формальна, а щира</div>
    </div>
    <div class="l10-section-label" style="margin-top:1rem;">7 кроків підготовки</div>
    <div class="l10-steps">
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">1</div><div class="l10-step-body"><div class="l10-step-title">Місце, час, список</div><div class="l10-step-text">Визначте де, коли і хто буде присутній. Повний список учасників.</div></div></div>
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">2</div><div class="l10-step-body"><div class="l10-step-title">Надішліть офіційне запрошення</div><div class="l10-step-text">Не «якщо зможете», а «обов'язково будьте». Це важливо для сприйняття серйозності.</div></div></div>
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">3</div><div class="l10-step-body"><div class="l10-step-title">Підготуйте тези</div><div class="l10-step-text">Запишіть тези для виступу, але не читайте з паперу. Має звучати природно, як ваші слова.</div></div></div>
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">4</div><div class="l10-step-body"><div class="l10-step-title">Створіть презентацію</div><div class="l10-step-text">Кілька слайдів з цілями та задумом, ідеальною картиною майбутнього і важливими фактами з історії компанії.</div></div></div>
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">5</div><div class="l10-step-body"><div class="l10-step-title">Відрепетируйте</div><div class="l10-step-text">Перед дзеркалом або перед довіреною людиною. Це допоможе почуватися впевнено.</div></div></div>
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">6</div><div class="l10-step-body"><div class="l10-step-title">Роздайте письмову політику</div><div class="l10-step-text">Всі учасники повинні отримати документ з цілями і задумом — на занятті або одразу після.</div></div></div>
        <div class="l10-step"><div class="l10-step-num" style="background:#6b7280;">7</div><div class="l10-step-body"><div class="l10-step-title">Зберіть відгуки</div><div class="l10-step-text">Дайте можливість відповісти на кілька запитань після заняття. Хто підтримує? Хто сумнівається?</div></div></div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Завдання</div>
    <div class="l10-section-title">Розробіть Політику цілей і задуму через AI-асистента</div>
    <div class="l10-steps">
        <div class="l10-step">
            <div class="l10-step-num">1</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Пройдіть діалог з AI-коучем цілей</div>
                <div class="l10-step-text">Асистент проведе вас через формулювання мети, задуму, ідеальної картини та історії бізнесу</div>
            </div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">2</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Збережіть результат у Google Docs</div>
                <div class="l10-step-text">На виході — готова «Політика цілей і задуму компанії» з підписом засновника</div>
            </div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">3</div>
            <div class="l10-step-body">
                <div class="l10-step-title">Проведіть презентацію для команди</div>
                <div class="l10-step-text">Зберіть усіх, розкажіть про мету і задум, запишіть виступ на відео</div>
            </div>
        </div>
    </div>
    <div style="margin-top:1rem;padding:0.85rem 1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;">
        <div style="font-weight:700;color:#166534;font-size:0.875rem;margin-bottom:0.3rem;">Час на впровадження</div>
        <div style="font-size:0.82rem;color:#15803d;line-height:1.5;">~3 години: 1 год на діалог з AI і підготовку документа + 2 год на проведення презентації для команди</div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Інструмент</div>
    <div class="l10-tool">
        <div class="l10-tool-header">
            <div class="l10-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
                <div class="l10-tool-title">AI-коуч цілей і задуму</div>
                <div class="l10-tool-desc">Асистент веде діалог і допомагає сформулювати мету, задум, ідеальну картину та історію компанії. На виході — готовий документ «Політика цілей і задуму» для підпису засновника і презентації команді.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6850f64368a08191b2c1e8cb233b7ebb-ai-kouch-konsultant-alex-talko-tochka-b" target="_blank" class="l10-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Розробити ціль і задум компанії
        </a>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l10-section { margin-bottom:1.75rem; }
.l10-section:last-child { margin-bottom:0; }
.l10-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l10-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l10-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l10-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l10-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l10-card p+p { margin-top:0.7rem; }
.l10-situations { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l10-situation { display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.9rem; background:#fef2f2; border:1px solid #fecaca; border-radius:9px; font-size:0.85rem; color:#7f1d1d; line-height:1.5; }
.l10-scale { display:grid; gap:0.4rem; margin-top:0.75rem; }
.l10-scale-item { display:flex; align-items:flex-start; gap:0.75rem; padding:0.7rem 0.9rem; background:#f8fafc; border-radius:9px; border:1px solid #e2e8f0; }
.l10-scale-num { width:26px; height:26px; background:#1a1a1a; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; flex-shrink:0; }
.l10-scale-title { font-weight:700; color:#1a1a1a; font-size:0.84rem; margin-bottom:0.15rem; }
.l10-scale-text { font-size:0.78rem; color:#525252; line-height:1.4; }
.l10-motivation { display:grid; gap:0.55rem; margin-top:0.75rem; }
.l10-motiv-item { padding:0.8rem 0.95rem; border-radius:10px; border:1px solid; }
.l10-motiv-header { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem; }
.l10-motiv-badge { font-size:0.68rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:4px; letter-spacing:0.04em; }
.l10-motiv-title { font-weight:700; font-size:0.875rem; }
.l10-motiv-text { font-size:0.82rem; line-height:1.5; }
.l10-examples { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l10-example { display:flex; align-items:flex-start; gap:0.7rem; padding:0.7rem 0.9rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:9px; }
.l10-example-icon { width:30px; height:30px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l10-example-label { font-weight:700; color:#1a1a1a; font-size:0.8rem; margin-bottom:0.15rem; }
.l10-example-text { font-size:0.82rem; color:#525252; line-height:1.45; }
.l10-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l10-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l10-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l10-step-body { flex:1; }
.l10-step-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l10-step-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l10-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l10-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l10-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l10-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l10-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l10-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l10-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l10-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l10-quote { margin:0.85rem 0; padding:0.9rem 1.1rem; background:linear-gradient(135deg,#f0fdf4,#dcfce7); border-left:3px solid #22c55e; border-radius:0 10px 10px 0; font-size:0.9rem; color:#166534; font-style:italic; line-height:1.6; }
.l10-schema { display:flex; align-items:center; gap:0.4rem; padding:0.85rem 1rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; margin-top:0.75rem; flex-wrap:wrap; }
.l10-schema-item { font-weight:700; color:#166534; font-size:0.85rem; }
.l10-schema-arrow { color:#22c55e; font-weight:700; }
</style>

<div class="l10-section">
    <div class="l10-section-label">Раздел 1</div>
    <div class="l10-section-title">Главное препятствие внедрения: почему команда саботирует изменения</div>
    <div class="l10-card">
        <p>Каждый владелец, который пытается навести порядок в бизнесе, сталкивается с одним и тем же: самые близкие, самые лояльные сотрудники вдруг начинают сопротивляться. Кажется, что это предательство. Но на самом деле — это закономерность.</p>
        <p>По международным исследованиям, потеря одного сотрудника обходится от 6 до 12 месяцев его зарплаты. Причина сопротивления проста: <strong>вы внедряете изменения, потому что видите проблему. Но видят ли её ваши сотрудники?</strong></p>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Раздел 2</div>
    <div class="l10-section-title">Цель и замысел компании — фундамент всего</div>
    <div class="l10-card">
        <p>Цель — это основная идея компании. Она отвечает на вопрос: <strong>для чего мы существуем? Что изменится в мире, если мы будем успешны?</strong></p>
        <p>Типичная ошибка: «Моя цель — заработать деньги». Деньги — это энергия для достижения цели. Но не сама цель.</p>
    </div>
    <div class="l10-examples">
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><div class="l10-example-label">Консалтинговая компания</div><div class="l10-example-text">Сделать малый бизнес умнее, эффективнее и независимым от владельца</div></div>
        </div>
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><div class="l10-example-label">Стоматология</div><div class="l10-example-text">Сделать людей здоровыми и уверенными в своей улыбке</div></div>
        </div>
        <div class="l10-example">
            <div class="l10-example-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><div class="l10-example-label">Строительная компания</div><div class="l10-example-text">Создавать комфортное и безопасное жильё для семей</div></div>
        </div>
    </div>
    <div class="l10-card" style="margin-top:0.75rem;">
        <p>Замысел — это ваш уникальный способ достигать цели. То, что вы делаете — и чего сознательно <strong>НЕ</strong> делаете. Замысел не придумывают с нуля — он отражает ваш реальный опыт и понимание рынка.</p>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Раздел 3</div>
    <div class="l10-section-title">Административная шкала — хребет бизнеса</div>
    <div class="l10-card">
        <p>Coca-Cola не начинает продавать колбасу. McDonald's не открывает автосалоны. Они знают свой путь — и каждая новая идея проверяется: она на этом пути? Этот инструмент называется <strong>административная шкала</strong>.</p>
    </div>
    <div class="l10-scale">
        <div class="l10-scale-item"><div class="l10-scale-num">1</div><div><div class="l10-scale-title">Цель</div><div class="l10-scale-text">Зачем мы существуем</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">2</div><div><div class="l10-scale-title">Замысел</div><div class="l10-scale-text">Как именно мы достигаем цели</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">3</div><div><div class="l10-scale-title">Политика</div><div class="l10-scale-text">Письменные правила, в рамках которых действуем</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">4</div><div><div class="l10-scale-title">Планы</div><div class="l10-scale-text">Что делаем в ближайший горизонт</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">5</div><div><div class="l10-scale-title">Программы</div><div class="l10-scale-text">Конкретные инициативы для достижения планов</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">6</div><div><div class="l10-scale-title">Проекты</div><div class="l10-scale-text">Детализация конкретных задач</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">7</div><div><div class="l10-scale-title">Приказы</div><div class="l10-scale-text">Конкретные указания конкретным людям</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">8</div><div><div class="l10-scale-title">Идеальная картина</div><div class="l10-scale-text">Как выглядит успешный результат</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">9</div><div><div class="l10-scale-title">Статистика</div><div class="l10-scale-text">Метрики, которые показывают движемся ли к цели</div></div></div>
        <div class="l10-scale-item"><div class="l10-scale-num">10</div><div><div class="l10-scale-title">Конечный продукт</div><div class="l10-scale-text">Что конкретно производит компания или отдел</div></div></div>
    </div>
    <div class="l10-quote">Главный принцип: каждый уровень должен соответствовать другим. Если ваш приказ противоречит цели — что-то пойдёт не так.</div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Разделы 4–5</div>
    <div class="l10-section-title">Политика и технология бизнеса</div>
    <div class="l10-card">
        <p>Политика компании — это письменные правила, которые говорят сотрудникам, как действовать в разных ситуациях. Без них каждый решает по-своему — и вы становитесь заложником бизнеса.</p>
        <p>Технология — это последовательность действий, которая даёт предсказуемый результат. Пока «как надо делать» живёт в вашей голове — бизнес невозможно масштабировать, обучать или контролировать по качеству.</p>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Разделы 6–7</div>
    <div class="l10-section-title">Уровни мотивации и как её повышать</div>
    <div class="l10-motivation">
        <div class="l10-motiv-item" style="background:#f0fdf4;border-color:#bbf7d0;">
            <div class="l10-motiv-header"><span class="l10-motiv-badge" style="background:#22c55e;color:white;">УРОВЕНЬ 1</span><span class="l10-motiv-title" style="color:#166534;">Чувство долга</span></div>
            <div class="l10-motiv-text" style="color:#166534;">Человек чувствует глубокую ответственность за дело, заботится о компании больше, чем о себе.</div>
        </div>
        <div class="l10-motiv-item" style="background:#eff6ff;border-color:#bfdbfe;">
            <div class="l10-motiv-header"><span class="l10-motiv-badge" style="background:#3b82f6;color:white;">УРОВЕНЬ 2</span><span class="l10-motiv-title" style="color:#1e40af;">Личная убеждённость</span></div>
            <div class="l10-motiv-text" style="color:#1e3a8a;">Верит в ценность своей работы. Делает хорошо, потому что это вопрос личной чести.</div>
        </div>
        <div class="l10-motiv-item" style="background:#fff7ed;border-color:#fed7aa;">
            <div class="l10-motiv-header"><span class="l10-motiv-badge" style="background:#f97316;color:white;">УРОВЕНЬ 3</span><span class="l10-motiv-title" style="color:#c2410c;">Личная выгода</span></div>
            <div class="l10-motiv-text" style="color:#9a3412;">Ищет бонус, карьерный рост, новые навыки. С этим можно и нужно работать.</div>
        </div>
        <div class="l10-motiv-item" style="background:#fef2f2;border-color:#fecaca;">
            <div class="l10-motiv-header"><span class="l10-motiv-badge" style="background:#ef4444;color:white;">УРОВЕНЬ 4</span><span class="l10-motiv-title" style="color:#b91c1c;">Деньги</span></div>
            <div class="l10-motiv-text" style="color:#991b1b;">Только зарплата. Никакой инициативы, никакой сверхурочной работы ради результата.</div>
        </div>
    </div>
    <div class="l10-schema">
        <span class="l10-schema-item">Показываете цель</span>
        <span class="l10-schema-arrow">→</span>
        <span class="l10-schema-item">Удерживаете внимание</span>
        <span class="l10-schema-arrow">→</span>
        <span class="l10-schema-item">Цель становится реальной</span>
        <span class="l10-schema-arrow">→</span>
        <span class="l10-schema-item">Человек мотивирован</span>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Задание</div>
    <div class="l10-section-title">Разработайте Политику целей и замысла через AI-ассистента</div>
    <div class="l10-steps">
        <div class="l10-step">
            <div class="l10-step-num">1</div>
            <div class="l10-step-body"><div class="l10-step-title">Пройдите диалог с AI-коучем целей</div><div class="l10-step-text">Ассистент проведёт вас через формулировку цели, замысла, идеальной картины и истории бизнеса</div></div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">2</div>
            <div class="l10-step-body"><div class="l10-step-title">Сохраните результат в Google Docs</div><div class="l10-step-text">На выходе — готовый документ «Политика целей и замысла компании» с подписью основателя</div></div>
        </div>
        <div class="l10-step">
            <div class="l10-step-num">3</div>
            <div class="l10-step-body"><div class="l10-step-title">Проведите презентацию для команды</div><div class="l10-step-text">Соберите всех, расскажите о цели и замысле, запишите выступление на видео</div></div>
        </div>
    </div>
</div>

<div class="l10-divider"></div>

<div class="l10-section">
    <div class="l10-section-label">Инструмент</div>
    <div class="l10-tool">
        <div class="l10-tool-header">
            <div class="l10-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
                <div class="l10-tool-title">AI-коуч целей и замысла</div>
                <div class="l10-tool-desc">Ассистент ведёт диалог и помогает сформулировать цель, замысел, идеальную картину и историю компании. На выходе — готовый документ «Политика целей и замысла» для подписи основателя и презентации команде.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6850f64368a08191b2c1e8cb233b7ebb-ai-kouch-konsultant-alex-talko-tochka-b" target="_blank" class="l10-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Разработать цель и замысел компании
        </a>
    </div>
</div>`,

                homework: `<ol><li>Пройдіть діалог з AI-коучем цілей</li><li>Створіть документ «Політика цілей і задуму компанії» у Google Docs і прикріпіть посилання</li><li>Проведіть презентацію для команди — розкажіть мету і задум, запишіть на відео</li><li>Напишіть у полі відповіді: яку мету ви сформулювали і яка була найскладніша частина діалогу з AI</li></ol>`,
                homework_ru: `<ol><li>Пройдите диалог с AI-коучем целей</li><li>Создайте документ «Политика целей и замысла компании» в Google Docs и прикрепите ссылку</li><li>Проведите презентацию для команды — расскажите цель и замысел, запишите на видео</li><li>Напишите в поле ответа: какую цель вы сформулировали и что было сложнее всего в диалоге с AI</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-6850f64368a08191b2c1e8cb233b7ebb-ai-kouch-konsultant-alex-talko-tochka-b",
                homeworkLinkName: "→ AI-коуч цілей",
                homeworkLinkName_ru: "→ AI-коуч целей",
                time: 180
            },
            {
                id: 11,
                title: "ПРОДУКТ ОРГАНІЗАЦІЇ",
                title_ru: "ПРОДУКТ ОРГАНИЗАЦИИ",
                subtitle: "Що насправді виробляє ваш бізнес — і як це зробити зрозумілим для команди",
                subtitle_ru: "Что на самом деле производит ваш бизнес — и как сделать это понятным для команды",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l11-section { margin-bottom:1.75rem; }
.l11-section:last-child { margin-bottom:0; }
.l11-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l11-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l11-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l11-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l11-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l11-card p+p { margin-top:0.7rem; }
.l11-compare { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-top:0.75rem; }
.l11-bad { padding:0.85rem 0.95rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; }
.l11-good { padding:0.85rem 0.95rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; }
.l11-compare-label { font-size:0.7rem; font-weight:700; letter-spacing:0.06em; margin-bottom:0.5rem; }
.l11-compare-text { font-size:0.82rem; line-height:1.5; }
.l11-rule { display:flex; align-items:flex-start; gap:0.85rem; padding:0.85rem 1rem; background:#f8fafc; border-radius:10px; border-left:3px solid #22c55e; margin-bottom:0.5rem; }
.l11-rule:last-child { margin-bottom:0; }
.l11-rule-icon { width:34px; height:34px; background:#f0fdf4; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l11-rule-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l11-rule-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l11-roles { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l11-role { padding:0.75rem 0.95rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l11-role-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.3rem; display:flex; align-items:center; gap:0.5rem; }
.l11-role-product { font-size:0.82rem; color:#16a34a; font-style:italic; }
.l11-role-desc { font-size:0.78rem; color:#6b7280; margin-top:0.2rem; line-height:1.4; }
.l11-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l11-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l11-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l11-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l11-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l11-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l11-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l11-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l11-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l11-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l11-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l11-step-text { font-size:0.875rem; color:#374151; line-height:1.5; }
</style>

<div class="l11-section">
    <div class="l11-section-label">Проблема</div>
    <div class="l11-section-title">Чому команда не розуміє, що від неї очікують</div>
    <div class="l11-card">
        <p>Більшість компаній можуть описати, що вони <em>роблять</em>. Але не можуть чітко відповісти, який <em>результат</em> вони створюють для клієнта.</p>
        <p>Ця різниця критична. Коли команда розуміє процес, але не розуміє продукт — вона оцінює свою роботу через зусилля, а не через результат. «Я зателефонував 20 разів» замість «клієнт підписав контракт».</p>
        <p>Відсутність чіткого продукту породжує головну управлінську проблему: <strong>неможливо оцінити, чи добре людина справляється зі своєю роллю</strong>.</p>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Концепція</div>
    <div class="l11-section-title">Що таке Продукт організації</div>
    <div class="l11-card">
        <p>Продукт організації — це цінний кінцевий результат, який отримує клієнт. Не дія, не процес, не послуга як абстракція — а конкретна зміна, яка відбувається в житті або бізнесі клієнта після взаємодії з вами.</p>
    </div>
    <div class="l11-compare">
        <div class="l11-bad">
            <div class="l11-compare-label" style="color:#dc2626;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="12" height="12" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Процес
            </div>
            <div class="l11-compare-text" style="color:#7f1d1d;">«Ми проводимо консультації», «Ми надаємо юридичні послуги», «Ми займаємося рекламою»</div>
        </div>
        <div class="l11-good">
            <div class="l11-compare-label" style="color:#16a34a;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="12" height="12" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                Продукт
            </div>
            <div class="l11-compare-text" style="color:#14532d;">«Власник бізнесу виходить з операційки за 65 днів», «Справа виграна в суді», «+40% заявок за місяць»</div>
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">3 критерії</div>
    <div class="l11-section-title">Яким має бути правильний продукт</div>
    <div class="l11-rule">
        <div class="l11-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
        <div>
            <div class="l11-rule-title">Конкретний і вимірюваний</div>
            <div class="l11-rule-text">Продукт можна побачити, перевірити, передати. «Звіт готовий» — не продукт. «Звіт з аналізом 5 конкурентів і рекомендаціями, затверджений керівником» — продукт.</div>
        </div>
    </div>
    <div class="l11-rule">
        <div class="l11-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="17" height="17"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div>
            <div class="l11-rule-title">Цінний для наступного в ланцюжку</div>
            <div class="l11-rule-text">Кожна роль передає результат наступній ролі або клієнту. Продукт менеджера з продажів — підписаний договір. Продукт бухгалтера — здана вчасно звітність.</div>
        </div>
    </div>
    <div class="l11-rule">
        <div class="l11-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="17" height="17"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <div>
            <div class="l11-rule-title">Закінчений — а не «у процесі»</div>
            <div class="l11-rule-text">Продукт — це те, що можна здати і прийняти. Половина роботи — не продукт. «Заявка оброблена і передана у виробництво» — продукт.</div>
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Структура</div>
    <div class="l11-section-title">Продукти ролей — як це виглядає на практиці</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">Кожна роль у компанії має свій продукт. Разом вони створюють головний продукт організації.</p>
    <div class="l11-roles">
        <div class="l11-role">
            <div class="l11-role-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                Менеджер з продажів
            </div>
            <div class="l11-role-product">Продукт: підписаний договір з новим клієнтом</div>
            <div class="l11-role-desc">Не «провів зустрічі» і не «обробив заявки» — а конкретний підписаний договір</div>
        </div>
        <div class="l11-role">
            <div class="l11-role-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                Адміністратор клініки
            </div>
            <div class="l11-role-product">Продукт: пацієнт записаний, прийшов і задоволений сервісом</div>
            <div class="l11-role-desc">Не «відповів на дзвінки» — а заповнений запис і позитивний досвід пацієнта</div>
        </div>
        <div class="l11-role">
            <div class="l11-role-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                Керівник відділу
            </div>
            <div class="l11-role-product">Продукт: відділ виконав план у встановлений термін</div>
            <div class="l11-role-desc">Не «провів наради і поставив задачі» — а план виконано командою</div>
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Навіщо це потрібно</div>
    <div class="l11-section-title">Що змінюється, коли продукт визначений</div>
    <div class="l11-result-list">
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Можна оцінювати роботу через результат, а не через присутність
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Кожен співробітник розуміє, що саме від нього очікується
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Легше делегувати — є чітке визначення «зроблено»
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Зникають суперечки «я ж старався» — важливий результат, а не зусилля
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            З'являється основа для системи мотивації через продукт
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Завдання</div>
    <div class="l11-section-title">Розробіть Політику продукту організації через AI-асистента</div>
    <div class="l11-steps">
        <div class="l11-step">
            <div class="l11-step-num">1</div>
            <div class="l11-step-text">Відкрийте AI-асистента і пройдіть діалог — він проведе вас через визначення головного продукту компанії і продуктів ключових ролей</div>
        </div>
        <div class="l11-step">
            <div class="l11-step-num">2</div>
            <div class="l11-step-text">На виході ви отримаєте готовий документ «Політика продукту організації» — збережіть його в Google Docs</div>
        </div>
        <div class="l11-step">
            <div class="l11-step-num">3</div>
            <div class="l11-step-text">Проведіть коротку презентацію для команди — поясніть, що таке продукт ролі і чому це важливо для кожного</div>
        </div>
    </div>
    <div style="margin-top:1rem;padding:0.85rem 1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;">
        <div style="font-weight:700;color:#166534;font-size:0.875rem;margin-bottom:0.3rem;">Час на впровадження</div>
        <div style="font-size:0.82rem;color:#15803d;line-height:1.5;">~3 години: 1 год на діалог з AI і підготовку документа + 2 год на проведення презентації для команди</div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Інструмент</div>
    <div class="l11-tool">
        <div class="l11-tool-header">
            <div class="l11-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
                <div class="l11-tool-title">AI-коуч продукту організації</div>
                <div class="l11-tool-desc">Асистент веде діалог і допомагає сформулювати головний продукт компанії та продукти ключових ролей. На виході — готова Політика продукту організації.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6851a1db22ac81918521e73ffdd1d6e2-ai-kouch-konsultant-alex-talko-produkt-tskp" target="_blank" class="l11-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Розробити продукт організації
        </a>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l11-section { margin-bottom:1.75rem; }
.l11-section:last-child { margin-bottom:0; }
.l11-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l11-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l11-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l11-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l11-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l11-card p+p { margin-top:0.7rem; }
.l11-compare { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-top:0.75rem; }
.l11-bad { padding:0.85rem 0.95rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; }
.l11-good { padding:0.85rem 0.95rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; }
.l11-compare-label { font-size:0.7rem; font-weight:700; letter-spacing:0.06em; margin-bottom:0.5rem; }
.l11-compare-text { font-size:0.82rem; line-height:1.5; }
.l11-rule { display:flex; align-items:flex-start; gap:0.85rem; padding:0.85rem 1rem; background:#f8fafc; border-radius:10px; border-left:3px solid #22c55e; margin-bottom:0.5rem; }
.l11-rule:last-child { margin-bottom:0; }
.l11-rule-icon { width:34px; height:34px; background:#f0fdf4; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l11-rule-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l11-rule-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l11-roles { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l11-role { padding:0.75rem 0.95rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l11-role-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.3rem; display:flex; align-items:center; gap:0.5rem; }
.l11-role-product { font-size:0.82rem; color:#16a34a; font-style:italic; }
.l11-role-desc { font-size:0.78rem; color:#6b7280; margin-top:0.2rem; line-height:1.4; }
.l11-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l11-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l11-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l11-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l11-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l11-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l11-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l11-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l11-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l11-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l11-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l11-step-text { font-size:0.875rem; color:#374151; line-height:1.5; }
</style>

<div class="l11-section">
    <div class="l11-section-label">Проблема</div>
    <div class="l11-section-title">Почему команда не понимает, что от неё ожидают</div>
    <div class="l11-card">
        <p>Большинство компаний могут описать, что они <em>делают</em>. Но не могут чётко ответить, какой <em>результат</em> они создают для клиента.</p>
        <p>Это различие критично. Когда команда понимает процесс, но не понимает продукт — она оценивает свою работу через усилия, а не через результат. «Я позвонил 20 раз» вместо «клиент подписал контракт».</p>
        <p>Отсутствие чёткого продукта порождает главную управленческую проблему: <strong>невозможно оценить, хорошо ли человек справляется со своей ролью</strong>.</p>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Концепция</div>
    <div class="l11-section-title">Что такое Продукт организации</div>
    <div class="l11-card">
        <p>Продукт организации — это ценный конечный результат, который получает клиент. Не действие, не процесс, не услуга как абстракция — а конкретное изменение, которое происходит в жизни или бизнесе клиента после взаимодействия с вами.</p>
    </div>
    <div class="l11-compare">
        <div class="l11-bad">
            <div class="l11-compare-label" style="color:#dc2626;">Процесс</div>
            <div class="l11-compare-text" style="color:#7f1d1d;">«Мы проводим консультации», «Мы оказываем юридические услуги», «Мы занимаемся рекламой»</div>
        </div>
        <div class="l11-good">
            <div class="l11-compare-label" style="color:#16a34a;">Продукт</div>
            <div class="l11-compare-text" style="color:#14532d;">«Владелец выходит из операционки за 65 дней», «Дело выиграно в суде», «+40% заявок за месяц»</div>
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">3 критерия</div>
    <div class="l11-section-title">Каким должен быть правильный продукт</div>
    <div class="l11-rule">
        <div class="l11-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
        <div>
            <div class="l11-rule-title">Конкретный и измеримый</div>
            <div class="l11-rule-text">Продукт можно увидеть, проверить, передать. «Отчёт готов» — не продукт. «Отчёт с анализом 5 конкурентов и рекомендациями, утверждённый руководителем» — продукт.</div>
        </div>
    </div>
    <div class="l11-rule">
        <div class="l11-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="17" height="17"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div>
            <div class="l11-rule-title">Ценный для следующего в цепочке</div>
            <div class="l11-rule-text">Каждая роль передаёт результат следующей роли или клиенту. Продукт менеджера по продажам — подписанный договор. Продукт бухгалтера — сданная вовремя отчётность.</div>
        </div>
    </div>
    <div class="l11-rule">
        <div class="l11-rule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="17" height="17"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <div>
            <div class="l11-rule-title">Завершённый — а не «в процессе»</div>
            <div class="l11-rule-text">Продукт — это то, что можно сдать и принять. Половина работы — не продукт. «Заявка обработана и передана в производство» — продукт.</div>
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Структура</div>
    <div class="l11-section-title">Продукты ролей — как это выглядит на практике</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">Каждая роль в компании имеет свой продукт. Вместе они создают главный продукт организации.</p>
    <div class="l11-roles">
        <div class="l11-role">
            <div class="l11-role-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                Менеджер по продажам
            </div>
            <div class="l11-role-product">Продукт: подписанный договор с новым клиентом</div>
            <div class="l11-role-desc">Не «провёл встречи» и не «обработал заявки» — а конкретный подписанный договор</div>
        </div>
        <div class="l11-role">
            <div class="l11-role-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                Администратор клиники
            </div>
            <div class="l11-role-product">Продукт: пациент записан, пришёл и доволен сервисом</div>
            <div class="l11-role-desc">Не «ответил на звонки» — а заполненная запись и положительный опыт пациента</div>
        </div>
        <div class="l11-role">
            <div class="l11-role-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                Руководитель отдела
            </div>
            <div class="l11-role-product">Продукт: отдел выполнил план в установленный срок</div>
            <div class="l11-role-desc">Не «провёл совещания и поставил задачи» — а план выполнен командой</div>
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Зачем это нужно</div>
    <div class="l11-section-title">Что меняется, когда продукт определён</div>
    <div class="l11-result-list">
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Можно оценивать работу через результат, а не через присутствие
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Каждый сотрудник понимает, что именно от него ожидается
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Легче делегировать — есть чёткое определение «сделано»
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Исчезают споры «я же старался» — важен результат, а не усилия
        </div>
        <div class="l11-result-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
            Появляется основа для системы мотивации через продукт
        </div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Задание</div>
    <div class="l11-section-title">Разработайте Политику продукта организации через AI-ассистента</div>
    <div class="l11-steps">
        <div class="l11-step">
            <div class="l11-step-num">1</div>
            <div class="l11-step-text">Откройте AI-ассистента и пройдите диалог — он проведёт вас через определение главного продукта компании и продуктов ключевых ролей</div>
        </div>
        <div class="l11-step">
            <div class="l11-step-num">2</div>
            <div class="l11-step-text">На выходе вы получите готовый документ «Политика продукта организации» — сохраните его в Google Docs</div>
        </div>
        <div class="l11-step">
            <div class="l11-step-num">3</div>
            <div class="l11-step-text">Проведите короткую презентацию для команды — объясните, что такое продукт роли и почему это важно для каждого</div>
        </div>
    </div>
    <div style="margin-top:1rem;padding:0.85rem 1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;">
        <div style="font-weight:700;color:#166534;font-size:0.875rem;margin-bottom:0.3rem;">Время на внедрение</div>
        <div style="font-size:0.82rem;color:#15803d;line-height:1.5;">~3 часа: 1 час на диалог с AI и подготовку документа + 2 часа на проведение презентации для команды</div>
    </div>
</div>

<div class="l11-divider"></div>

<div class="l11-section">
    <div class="l11-section-label">Инструмент</div>
    <div class="l11-tool">
        <div class="l11-tool-header">
            <div class="l11-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
                <div class="l11-tool-title">AI-коуч продукта организации</div>
                <div class="l11-tool-desc">Ассистент ведёт диалог и помогает сформулировать главный продукт компании и продукты ключевых ролей. На выходе — готовая Политика продукта организации.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6851a1db22ac81918521e73ffdd1d6e2-ai-kouch-konsultant-alex-talko-produkt-tskp" target="_blank" class="l11-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Разработать продукт организации
        </a>
    </div>
</div>`,

                homework: `<ol><li>Пройдіть діалог з AI-коучем продукту</li><li>Створіть документ «Політика продукту організації» у Google Docs і прикріпіть посилання</li><li>Проведіть презентацію для команди — поясніть продукт ролі кожному</li><li>Напишіть у полі відповіді: який головний продукт вашої компанії і продукт якої ролі виявився найскладнішим для формулювання</li></ol>`,
                homework_ru: `<ol><li>Пройдите диалог с AI-коучем продукта</li><li>Создайте документ «Политика продукта организации» в Google Docs и прикрепите ссылку</li><li>Проведите презентацию для команды — объясните продукт роли каждому</li><li>Напишите в поле ответа: какой главный продукт вашей компании и продукт какой роли оказался сложнее всего сформулировать</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-6851a1db22ac81918521e73ffdd1d6e2-ai-kouch-konsultant-alex-talko-produkt-tskp",
                homeworkLinkName: "→ AI-коуч продукту",
                homeworkLinkName_ru: "→ AI-коуч продукта",
                time: 180
            },
            {
                id: 12,
                title: "ФУНКЦІОНАЛЬНА СТРУКТУРА ТА РОЛІ",
                title_ru: "ФУНКЦИОНАЛЬНАЯ СТРУКТУРА И РОЛИ",
                subtitle: "Як організувати роботу так, щоб бізнес працював без вас",
                subtitle_ru: "Как организовать работу так, чтобы бизнес работал без вас",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l12-section { margin-bottom:1.75rem; }
.l12-section:last-child { margin-bottom:0; }
.l12-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l12-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l12-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l12-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l12-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l12-card p+p { margin-top:0.7rem; }
.l12-quote { margin:0.85rem 0; padding:0.9rem 1.1rem; background:linear-gradient(135deg,#f0fdf4,#dcfce7); border-left:3px solid #22c55e; border-radius:0 10px 10px 0; font-size:0.875rem; color:#166534; font-style:italic; line-height:1.6; }
.l12-reasons { display:grid; gap:0.6rem; margin-top:0.75rem; }
.l12-reason { border-radius:11px; overflow:hidden; border:1px solid #e2e8f0; }
.l12-reason-header { display:flex; align-items:center; gap:0.7rem; padding:0.75rem 0.95rem; background:#f8fafc; }
.l12-reason-num { width:28px; height:28px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; flex-shrink:0; }
.l12-reason-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; }
.l12-reason-body { padding:0.65rem 0.95rem 0.8rem; background:white; border-top:1px solid #f1f5f9; font-size:0.85rem; color:#525252; line-height:1.55; }
.l12-problems { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l12-problem { display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.9rem; background:#fef2f2; border:1px solid #fecaca; border-radius:9px; font-size:0.85rem; color:#7f1d1d; line-height:1.5; }
.l12-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l12-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l12-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l12-step-body { flex:1; }
.l12-step-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l12-step-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l12-functions { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l12-fn { padding:0.75rem 0.95rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l12-fn-header { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.3rem; }
.l12-fn-num { font-size:0.7rem; font-weight:700; color:#9ca3af; }
.l12-fn-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; }
.l12-fn-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l12-fn-stat { display:inline-block; margin-top:0.4rem; padding:0.2rem 0.55rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:5px; font-size:0.72rem; font-weight:600; color:#16a34a; }
.l12-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l12-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l12-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l12-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l12-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l12-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l12-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l12-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l12-mgr { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l12-mgr-item { display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 0.9rem; background:#f8fafc; border-radius:10px; border-left:3px solid #22c55e; }
.l12-mgr-icon { width:32px; height:32px; background:#f0fdf4; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l12-mgr-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l12-mgr-text { font-size:0.82rem; color:#525252; line-height:1.5; }
</style>

<div class="l12-section">
    <div class="l12-section-label">Вступ</div>
    <div class="l12-section-title">Чому при зростанні стає не легше, а важче</div>
    <div class="l12-card">
        <p>Є питання, з яким рано чи пізно стикається кожен власник малого бізнесу: чому при зростанні стає не легше, а важче? Більше людей — більше хаосу. Більше замовлень — більше помилок. Більше виручки — більше головного болю.</p>
        <p>Відповідь, як правило, одна: бізнес не організований. Не в сенсі «зареєстрований» — а в сенсі «кожна робота закріплена за конкретною людиною, і всі частини взаємодіють між собою».</p>
        <p>Функціональна структура — це фундамент, без якого будь-яка система, CRM, автоматизація чи мотивація — просто надбудова на піску.</p>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 1</div>
    <div class="l12-section-title">Що означає «організувати бізнес» — і чому більшість це розуміє неправильно</div>
    <div class="l12-card">
        <p>Організувати — це розкласти все по поличках і налагодити роботу так, щоб досягти того, чого хочеш. Як прибрати в кімнаті: кожна річ має своє місце. Не тому що так красиво, а тому що коли річ лежить на своєму місці — ти знаєш де вона і можеш нею скористатись.</p>
        <p>Але більшість власників під «організувати» розуміють щось інше: «найняти більше людей», «купити CRM», «провести нараду», «написати регламент». Це все — інструменти. А організація — це принцип, який стоїть за ними.</p>
        <p>У бізнесі те саме що з кімнатою: кожна категорія роботи — у своєму «відсіку». Кожна функція має своє місце, і всі знають де вона знаходиться.</p>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 2</div>
    <div class="l12-section-title">Що таке «функція» — і чому це найважливіше слово в управлінні</div>
    <div class="l12-card">
        <p>«Функція» — це конкретна робота, яку хтось виконує. Простіше кажучи: «за що ти відповідаєш». Не посада. Не назва. Не запис у трудовій. А реальна відповідь на питання: <strong>що саме ти робиш і що після тебе залишається?</strong></p>
        <p>У бізнесі функції — це аналоги позицій у футболі. Є той, хто знаходить клієнтів. Є той, хто продає. Є той, хто виробляє. Є той, хто доставляє. Є той, хто рахує гроші. Кожна з цих робіт — окрема функція.</p>
    </div>
    <div class="l12-quote">Бізнес — це пазл, де кожна частинка — окрема функція: продажі, реклама, гроші, виробництво, люди, доставка. Якщо хоча б одна частинка випала — картинка неповна. Пазл не складається.</div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 3</div>
    <div class="l12-section-title">Чотири причини, чому треба ділити роботу на функції</div>
    <p style="font-size:0.875rem;color:#525252;line-height:1.6;margin-bottom:0.75rem;">«Навіщо все це ускладнювати? Просто найму людей і скажу: робіть що треба». Це найпоширеніша думка власника, який застряг. «Роби що треба» — це найдорожча команда, яку ви можете дати.</p>
    <div class="l12-reasons">
        <div class="l12-reason">
            <div class="l12-reason-header">
                <div class="l12-reason-num">1</div>
                <div class="l12-reason-title">Маленьке завдання легше пояснити і передати</div>
            </div>
            <div class="l12-reason-body">Коли робота не поділена — ви передаєте людині щось величезне і розмите. «Займися маркетингом». «Контролюй виробництво». Що це означає? З чого починати? Для більшості людей — це стрес і параліч. Вони або роблять що завгодно (не те, що потрібно), або не роблять нічого і чекають конкретики.</div>
        </div>
        <div class="l12-reason">
            <div class="l12-reason-header">
                <div class="l12-reason-num">2</div>
                <div class="l12-reason-title">Легше побачити, що зроблено, а що ні</div>
            </div>
            <div class="l12-reason-body">Як список покупок: хліб — є, молоко — є, яйця — немає. Одразу видно чого не вистачає. Коли роботи не поділені — ви не можете зробити такий список. «Маркетинг» — він є чи немає? Щось робиться. А що саме? Достатньо? Правильно? Незрозуміло. І вам доводиться або довіряти наосліп, або контролювати кожен крок вручну.</div>
        </div>
        <div class="l12-reason">
            <div class="l12-reason-header">
                <div class="l12-reason-num">3</div>
                <div class="l12-reason-title">Якщо щось не працює — можна замінити одну частину</div>
            </div>
            <div class="l12-reason-body">Зламалась лампочка в фарі — міняєте лампочку, не весь автомобіль. Коли є чіткі функції — ви точно знаєте де проблема. Функція «генерація лідів» — 50 заявок, добре. Функція «конверсія в угоду» — 5% при нормі 20%. Ось де зламалась лампочка. Міняємо лампочку — а не увесь відділ.</div>
        </div>
        <div class="l12-reason">
            <div class="l12-reason-header">
                <div class="l12-reason-num">4</div>
                <div class="l12-reason-title">Люди стають майстрами</div>
            </div>
            <div class="l12-reason-body">Коли людина довго робить одну справу — вона в ній росте. Стає експертом. Робить швидше, краще, з меншою кількістю помилок. Хірург-кардіолог, який робить лише операції на серці — оперує набагато краще, ніж хірург-загальнопрактик, який робить все підряд. Спеціалізація — це не обмеження. Це шлях до майстерності.</div>
        </div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 4</div>
    <div class="l12-section-title">Генрі Форд і революція функцій — як поділ роботи змінив світ</div>
    <div class="l12-card">
        <p>До Форда автомобіль був предметом розкоші — як сьогодні яхта або приватний літак. Один майстер робив автомобіль від початку до кінця: і болти закручував, і двигун збирав, і кузов підганяв. Майстер мав бути кваліфікованим у всьому — а значить, таких людей було мало і коштували вони дорого.</p>
        <p>Форд зробив інакше: кожен робітник виконує одну просту операцію. Один закручує болти зліва. Інший — справа. Третій кріпить колеса. Четвертий встановлює сидіння. Один конкретний рух. Один конкретний результат.</p>
    </div>
    <div class="l12-quote">Поділ роботи на чіткі функції — це не бюрократія і не ускладнення. Це шлях до більшої продуктивності, нижчих витрат і кращої якості одночасно.</div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 5</div>
    <div class="l12-section-title">Бізнес — це конвеєр. Як рухається робота від початку до кінця</div>
    <div class="l12-card">
        <p>Є одна ідея, яка повністю змінює погляд на бізнес: <strong>бізнес — це конвеєр</strong>. У будь-якому бізнесі є потік: щось приходить (замовлення, клієнт, запит) → з цим щось роблять (обробляють, перетворюють) → щось виходить (задоволений клієнт, оплачений рахунок). Між «приходить» і «виходить» — ланцюжок функцій. Кожна функція приймає щось від попередньої, робить свою частину і передає наступній.</p>
    </div>
    <div class="l12-card" style="margin-top:0.6rem;">
        <p><strong>Реальний кейс:</strong> компанія відправила товар клієнту без документів. Клієнт сказав: «Терміново потрібно, оплачу завтра». Товар отримав — і відмовився платити. «Де документи? Нема документів — нема оплати». Одна пропущена ланка — не було функції контролю документів, ніхто за це не відповідав — обійшлась компанії в піврічний бюджет.</p>
    </div>
    <div class="l12-quote">Мало просто поділити роботу. Функції мають передавати роботу одна одній. Якщо між ними немає передачі — кожна функція живе у своєму «підводному човні».</div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 6</div>
    <div class="l12-section-title">Пастка «зробити самому» — і чому вона руйнує бізнес</div>
    <div class="l12-card">
        <p>«Мої працівники не роблять як треба. Простіше зробити самому». Якщо ви хоч раз так думали — ви вже потрапили в пастку. Коли власник намагається замінити людей собою — він стає найдорожчим і найнезамінимішим виконавцем у своєму ж бізнесі.</p>
        <p>Вихід — не «найняти кращих людей». Вихід — організувати роботу так, щоб звичайні люди давали передбачуваний результат. Це і є функціональна структура.</p>
    </div>
    <div class="l12-section-label" style="margin-top:1rem;">Дві дії, коли команда не справляється</div>
    <div class="l12-steps">
        <div class="l12-step">
            <div class="l12-step-num" style="background:#ef4444;">1</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Погасити пожежу</div>
                <div class="l12-step-text">Вирішити проблему, яка горить прямо зараз. Це вимушено, але необхідно. Але якщо зупинитись тут — пожежа спалахне знову.</div>
            </div>
        </div>
        <div class="l12-step">
            <div class="l12-step-num" style="background:#22c55e;">2</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Побудувати систему</div>
                <div class="l12-step-text">Організувати роботу так, щоб такі пожежі більше не виникали. Визначити функції. Описати як вони взаємодіють. Поставити людей на свої місця. Перша дія — витрати. Друга — інвестиція.</div>
            </div>
        </div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 7</div>
    <div class="l12-section-title">Пастка «багатоверстатника» — коли одна людина робить все</div>
    <div class="l12-card">
        <p>Малий бізнес часто виглядає так: є Сергій. Сергій — і продавець, і бухгалтер, і завгосп, і оператор соцмереж, і кур'єр при необхідності. Здається, це добре: одна людина, яка вміє все. Насправді — це катастрофа в уповільненому режимі.</p>
        <p>Чим більше функцій у людини — тим складніше нею керувати. У неї завжди є відмазка: «Я іншим займався». І технічно вона права.</p>
    </div>
    <div class="l12-problems">
        <div class="l12-problem"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Важко знайти.</strong> Де взяти людину, яка вміє і продавати, і рахувати, і з постачальниками, і в соцмережах? Таких або немає, або їм нудно і вони йдуть.</div></div>
        <div class="l12-problem"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Важко навчити.</strong> Навчити людину 5 різним справам — у 5 разів довше і дорожче. І при цьому жодній вона не буде навчена добре.</div></div>
        <div class="l12-problem"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Важко керувати.</strong> Завжди є причина чому конкретна робота не зроблена. Немає чіткої функції — немає чіткого KPI — немає об'єктивної оцінки.</div></div>
    </div>
    <div class="l12-card" style="margin-top:0.75rem;">
        <p>Коли бізнес маленький — одна людина робить кілька функцій. Це нормально на старті. Але різниця між «так виходить» і «так і треба»: <strong>якщо ви знаєте всі функції і бачите їх на карті — ви керуєте усвідомлено</strong>. Ви знаєте, що Сергій зараз робить функцію продажів. І коли з'являться гроші — точно знаєте кого наймати першим.</p>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 8</div>
    <div class="l12-section-title">Карта бізнесу — як побачити всі функції і знайти «діри»</div>
    <div class="l12-card">
        <p>Найнебезпечніший тип проблеми в бізнесі — та, яку ви не бачите. Не та, де горить і болить. А та, де тихо втрачаються гроші, і ви навіть не розумієте чому.</p>
        <p>Власник добре знає своє ремесло: лікар чудово лікує, кравець чудово шиє. Але у бізнесу є десятки функцій, які ніяк не пов'язані з основним ремеслом — і власник просто не знає, що вони існують.</p>
    </div>
    <div class="l12-section-label" style="margin-top:1rem;">Приклад: звичайний роздрібний магазин — мінімум 6 функцій</div>
    <div class="l12-functions">
        <div class="l12-fn">
            <div class="l12-fn-header"><span class="l12-fn-num">Функція 1</span><span class="l12-fn-title">Визначити що продаємо і кому</span></div>
            <div class="l12-fn-text">Який товар? Хто покупець? Яка цінова категорія? Яка ніша? Це не разове рішення при відкритті — це регулярна робота. Ринок змінюється. Покупці змінюються.</div>
        </div>
        <div class="l12-fn">
            <div class="l12-fn-header"><span class="l12-fn-num">Функція 2</span><span class="l12-fn-title">Як люди дізнаються про нас</span></div>
            <div class="l12-fn-text">Реклама, вивіска, соцмережі, сарафанне радіо, партнерства. Якщо цього немає або це відбувається само собою — у вас немає функції маркетингу. Є лише удача.</div>
        </div>
        <div class="l12-fn">
            <div class="l12-fn-header"><span class="l12-fn-num">Функція 3</span><span class="l12-fn-title">Як виглядає магазин</span></div>
            <div class="l12-fn-text">Вітрина, оформлення, навігація, атмосфера.</div>
            <div class="l12-fn-stat">+30–40% трафіку від привабливого зовнішнього вигляду</div>
        </div>
        <div class="l12-fn">
            <div class="l12-fn-header"><span class="l12-fn-num">Функція 4</span><span class="l12-fn-title">Як розкладений товар</span></div>
            <div class="l12-fn-text">Мерчандайзинг — це ціла наука. Де стоїть товар, як він підсвічений, що знаходиться поряд — все це впливає на середній чек.</div>
            <div class="l12-fn-stat">+20–25% продажів при правильному мерчандайзингу</div>
        </div>
        <div class="l12-fn">
            <div class="l12-fn-header"><span class="l12-fn-num">Функція 5</span><span class="l12-fn-title">Як продаємо</span></div>
            <div class="l12-fn-text">Скрипти консультантів, робота на касі, як відповідаємо на питання, як пропонуємо супутні товари. Без цієї функції магазин — просто склад, з якого люди беруть те, за чим прийшли, і йдуть.</div>
        </div>
        <div class="l12-fn">
            <div class="l12-fn-header"><span class="l12-fn-num">Функція 6</span><span class="l12-fn-title">Як повертаємо покупців</span></div>
            <div class="l12-fn-text">Програми лояльності, розсилки, акції для постійних клієнтів, робота з відгуками.</div>
            <div class="l12-fn-stat">Утримання клієнта в 5–7 разів дешевше ніж залучення нового</div>
        </div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 9</div>
    <div class="l12-section-title">Одна зламана ланка — і система стоїть. Роль керівника</div>
    <div class="l12-card">
        <p>Власники часто думають після побудови структури: «Все, розписав функції, призначив людей, тепер воно само їде». Ні. Після побудови структури з'являється нова критична роль: керівник, який стежить за тим, щоб всі ланки працювали.</p>
        <p>Уявіть годинник. Десятки шестерень, кожна виконує свою функцію. Якщо хоча б одна зубчаста ланка зламалась — годинник зупиняється. Не важливо, що всі інші 99 шестерень в ідеальному стані.</p>
    </div>
    <div class="l12-section-label" style="margin-top:1rem;">Три завдання керівника в організованому бізнесі</div>
    <div class="l12-mgr">
        <div class="l12-mgr-item">
            <div class="l12-mgr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
            <div><div class="l12-mgr-title">Бачити</div><div class="l12-mgr-text">Мати інформацію про те, що відбувається в кожній функції — не через наради раз на тиждень, а через систему показників, яка дає сигнал в реальному часі.</div></div>
        </div>
        <div class="l12-mgr-item">
            <div class="l12-mgr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div><div class="l12-mgr-title">Помічати</div><div class="l12-mgr-text">Бачити проблеми до того, як вони стали катастрофою. Якщо менеджер продав вдвічі менше цього тижня — це сигнал. Ранній сигнал коштує значно дешевше, ніж пізня реакція.</div></div>
        </div>
        <div class="l12-mgr-item">
            <div class="l12-mgr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div><div class="l12-mgr-title">Виправляти</div><div class="l12-mgr-text">Швидко втручатися і вирішувати. Не «потім розберемось» — а зараз, поки мала проблема не стала великою.</div></div>
        </div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Розділ 10</div>
    <div class="l12-section-title">Три кроки побудови функціональної структури — з чого починати</div>
    <div class="l12-steps">
        <div class="l12-step">
            <div class="l12-step-num">1</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Розібратись із «сировиною»</div>
                <div class="l12-step-text">Що приходить у ваш бізнес? Звідки беруться замовлення? Хто ваш клієнт? Що ви отримуєте на вході — і що має бути на виході? Більшість власників не можуть чітко відповісти. «Ну, клієнти звертаються...» Як? Звідки? Через що? Без відповіді на це — ви не можете побудувати конвеєр.</div>
            </div>
        </div>
        <div class="l12-step">
            <div class="l12-step-num">2</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Визначити всі кроки трансформації</div>
                <div class="l12-step-text">Що треба зробити, щоб перетворити «сировину» на «готовий продукт»? Випишіть всі кроки — не думайте поки про людей, просто всі дії між «прийшло» і «вийшло». Кожна дія — потенційна функція. На цьому етапі ви знаходите кроки, яких зараз не робите взагалі: «Стоп, а хто у нас контролює якість перед відправкою?» — «Ніхто». Ось ваша «діра».</div>
            </div>
        </div>
        <div class="l12-step">
            <div class="l12-step-num">3</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Поставити людей на місця</div>
                <div class="l12-step-text">До кожної функції — призначте відповідального. «Відповідальний» — не означає «виконує сам». Але він повинен знати, що ця функція — його зона відповідальності. І ви обидва маєте знати: ця робота зроблена або не зроблена.</div>
            </div>
        </div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Підсумок</div>
    <div class="l12-section-title">Що таке функціональна структура і навіщо вона вам</div>
    <div class="l12-card">
        <p>Функціональна структура — це не оргструктура зі стрілочками і квадратиками. Це відповідь на питання: <strong>які роботи мають виконуватись у вашому бізнесі, хто за кожну відповідає і як вони передають роботу одна одній.</strong></p>
        <p>Це фундамент. Без нього CRM — просто база даних, якою ніхто не користується. Регламенти — папери, які ніхто не читає. Мотивація — хаотичні бонуси, які нікого не мотивують.</p>
    </div>
    <div class="l12-result-list">
        <div class="l12-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Зрозумієте які функції є у вашому бізнесі — і яких немає</div>
        <div class="l12-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Знайдете «діри» — де тихо втрачаються гроші</div>
        <div class="l12-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Зможете осмислено ставити людей на конкретні ролі</div>
        <div class="l12-result-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Перестанете бути «найнезамінимішим виконавцем» у власному бізнесі</div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Завдання</div>
    <div class="l12-section-title">Розробіть функціональну структуру вашого бізнесу через AI-асистента</div>
    <div class="l12-steps">
        <div class="l12-step">
            <div class="l12-step-num">1</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Пройдіть діалог з AI-коучем структури</div>
                <div class="l12-step-text">Асистент проведе вас через визначення всіх функцій вашого бізнесу, знайде «діри» і допоможе розподілити ролі</div>
            </div>
        </div>
        <div class="l12-step">
            <div class="l12-step-num">2</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Збережіть результат у Google Docs</div>
                <div class="l12-step-text">На виході — готова «Функціональна карта бізнесу» з переліком функцій і відповідальних</div>
            </div>
        </div>
        <div class="l12-step">
            <div class="l12-step-num">3</div>
            <div class="l12-step-body">
                <div class="l12-step-title">Проведіть презентацію для команди</div>
                <div class="l12-step-text">Покажіть кожному його функцію і зону відповідальності — це ключовий момент впровадження</div>
            </div>
        </div>
    </div>
    <div style="margin-top:1rem;padding:0.85rem 1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;">
        <div style="font-weight:700;color:#166534;font-size:0.875rem;margin-bottom:0.3rem;">Час на впровадження</div>
        <div style="font-size:0.82rem;color:#15803d;line-height:1.5;">~3 години: 1 год на діалог з AI і підготовку карти + 2 год на презентацію команді</div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Інструмент</div>
    <div class="l12-tool">
        <div class="l12-tool-header">
            <div class="l12-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </div>
            <div>
                <div class="l12-tool-title">AI-коуч функціональної структури</div>
                <div class="l12-tool-desc">Асистент веде діалог і допомагає побудувати повну карту функцій вашого бізнесу: визначає всі роботи, знаходить «діри» і розподіляє відповідальність. На виході — готова Функціональна карта бізнесу.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-68584f3314848191b812f6c0abaaae9e-ai-kouch-konsultant-alex-talko-orgstruktura" target="_blank" class="l12-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Розробити функціональну структуру
        </a>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l12-section { margin-bottom:1.75rem; }
.l12-section:last-child { margin-bottom:0; }
.l12-divider { height:1px; background:#e2e8f0; margin:1.75rem 0; }
.l12-section-label { font-size:0.7rem; font-weight:700; letter-spacing:0.09em; color:#9ca3af; text-transform:uppercase; margin-bottom:0.65rem; }
.l12-section-title { font-size:1rem; font-weight:700; color:#1a1a1a; margin-bottom:0.65rem; }
.l12-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.1rem; }
.l12-card p { font-size:0.9rem; color:#374151; line-height:1.65; }
.l12-card p+p { margin-top:0.7rem; }
.l12-quote { margin:0.85rem 0; padding:0.9rem 1.1rem; background:linear-gradient(135deg,#f0fdf4,#dcfce7); border-left:3px solid #22c55e; border-radius:0 10px 10px 0; font-size:0.875rem; color:#166534; font-style:italic; line-height:1.6; }
.l12-reasons { display:grid; gap:0.6rem; margin-top:0.75rem; }
.l12-reason { border-radius:11px; overflow:hidden; border:1px solid #e2e8f0; }
.l12-reason-header { display:flex; align-items:center; gap:0.7rem; padding:0.75rem 0.95rem; background:#f8fafc; }
.l12-reason-num { width:28px; height:28px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; flex-shrink:0; }
.l12-reason-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; }
.l12-reason-body { padding:0.65rem 0.95rem 0.8rem; background:white; border-top:1px solid #f1f5f9; font-size:0.85rem; color:#525252; line-height:1.55; }
.l12-problems { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l12-problem { display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.9rem; background:#fef2f2; border:1px solid #fecaca; border-radius:9px; font-size:0.85rem; color:#7f1d1d; line-height:1.5; }
.l12-steps { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l12-step { display:flex; align-items:flex-start; gap:0.75rem; padding:0.8rem 0.95rem; background:#f8fafc; border-radius:10px; }
.l12-step-num { width:24px; height:24px; background:#22c55e; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:0.05rem; }
.l12-step-body { flex:1; }
.l12-step-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l12-step-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l12-functions { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l12-fn { padding:0.75rem 0.95rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
.l12-fn-header { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.3rem; }
.l12-fn-num { font-size:0.7rem; font-weight:700; color:#9ca3af; }
.l12-fn-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; }
.l12-fn-text { font-size:0.82rem; color:#525252; line-height:1.5; }
.l12-fn-stat { display:inline-block; margin-top:0.4rem; padding:0.2rem 0.55rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:5px; font-size:0.72rem; font-weight:600; color:#16a34a; }
.l12-result-list { display:grid; gap:0.45rem; margin-top:0.75rem; }
.l12-result-item { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.85rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; font-size:0.875rem; color:#166534; font-weight:500; }
.l12-tool { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.1rem 1.25rem; }
.l12-tool-header { display:flex; align-items:flex-start; gap:0.85rem; }
.l12-tool-icon { width:40px; height:40px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l12-tool-title { font-weight:700; color:#1a1a1a; font-size:0.95rem; margin-bottom:0.25rem; }
.l12-tool-desc { font-size:0.82rem; color:#525252; line-height:1.5; }
.l12-btn { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.85rem; padding:0.5rem 1.05rem; background:#22c55e; color:white; border-radius:9px; font-size:0.85rem; font-weight:700; text-decoration:none; }
.l12-mgr { display:grid; gap:0.5rem; margin-top:0.75rem; }
.l12-mgr-item { display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 0.9rem; background:#f8fafc; border-radius:10px; border-left:3px solid #22c55e; }
.l12-mgr-icon { width:32px; height:32px; background:#f0fdf4; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.l12-mgr-title { font-weight:700; color:#1a1a1a; font-size:0.875rem; margin-bottom:0.2rem; }
.l12-mgr-text { font-size:0.82rem; color:#525252; line-height:1.5; }
</style>

<div class="l12-section">
    <div class="l12-section-label">Введение</div>
    <div class="l12-section-title">Почему при росте становится не легче, а тяжелее</div>
    <div class="l12-card">
        <p>Больше людей — больше хаоса. Больше заказов — больше ошибок. Больше выручки — больше головной боли. Ответ, как правило, один: бизнес не организован. Не в смысле «зарегистрирован» — а в смысле «каждая работа закреплена за конкретным человеком, и все части взаимодействуют между собой».</p>
        <p>Функциональная структура — это фундамент, без которого любая система, CRM, автоматизация или мотивация — просто надстройка на песке.</p>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Разделы 1–2</div>
    <div class="l12-section-title">Что такое «организовать» и что такое «функция»</div>
    <div class="l12-card">
        <p>Организовать — это разложить всё по полочкам так, чтобы достичь того, чего хочешь. Большинство владельцев под «организовать» понимают: «нанять больше людей», «купить CRM», «написать регламент». Это всё — инструменты. А организация — это принцип, который стоит за ними.</p>
        <p>«Функция» — это конкретная работа, которую кто-то выполняет. <strong>Что именно ты делаешь и что после тебя остаётся?</strong> Не должность, не название — реальный ответ на этот вопрос.</p>
    </div>
    <div class="l12-quote">Бизнес — это пазл, где каждая частица — отдельная функция: продажи, реклама, деньги, производство, люди, доставка. Если хотя бы одна выпала — картинка неполная.</div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Раздел 3</div>
    <div class="l12-section-title">Четыре причины делить работу на функции</div>
    <div class="l12-reasons">
        <div class="l12-reason">
            <div class="l12-reason-header"><div class="l12-reason-num">1</div><div class="l12-reason-title">Маленькое задание легче объяснить и передать</div></div>
            <div class="l12-reason-body">«Займись маркетингом» — для большинства людей это стресс и паралич. Они либо делают что угодно (не то, что нужно), либо ждут конкретики.</div>
        </div>
        <div class="l12-reason">
            <div class="l12-reason-header"><div class="l12-reason-num">2</div><div class="l12-reason-title">Легче увидеть, что сделано, а что нет</div></div>
            <div class="l12-reason-body">Как список покупок: хлеб — есть, молоко — есть, яйца — нет. Без разделения функций вы не можете сделать такой список — и вам приходится контролировать каждый шаг вручную.</div>
        </div>
        <div class="l12-reason">
            <div class="l12-reason-header"><div class="l12-reason-num">3</div><div class="l12-reason-title">Если что-то не работает — можно заменить одну часть</div></div>
            <div class="l12-reason-body">Когда есть чёткие функции — вы точно знаете где проблема. Функция «конверсия в сделку» — 5% при норме 20%. Вот где сломалась лампочка. Меняем лампочку — а не весь отдел.</div>
        </div>
        <div class="l12-reason">
            <div class="l12-reason-header"><div class="l12-reason-num">4</div><div class="l12-reason-title">Люди становятся мастерами</div></div>
            <div class="l12-reason-body">Хирург-кардиолог, который делает только операции на сердце — оперирует намного лучше, чем хирург-общепрактик. Специализация — это не ограничение. Это путь к мастерству.</div>
        </div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Разделы 4–5</div>
    <div class="l12-section-title">Генри Форд и бизнес-конвейер</div>
    <div class="l12-card">
        <p>До Форда один мастер делал автомобиль от начала до конца. Форд сделал иначе: каждый рабочий выполняет одну простую операцию. Один конкретный результат. Разделение работы на чёткие функции — это путь к большей производительности, меньшим затратам и лучшему качеству одновременно.</p>
        <p>Бизнес — это конвейер. Между «пришло» и «вышло» — цепочка функций. Каждая функция принимает что-то от предыдущей, делает свою часть и передаёт следующей. Если хотя бы одно звено пропущено — система ломается.</p>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Разделы 6–7</div>
    <div class="l12-section-title">Ловушка «сделаю сам» и ловушка «многостаночника»</div>
    <div class="l12-card">
        <p>Когда владелец пытается заменить людей собой — он становится самым дорогим и самым незаменимым исполнителем в собственном бизнесе. Выход — не «нанять лучших людей». Выход — организовать работу так, чтобы обычные люди давали предсказуемый результат.</p>
    </div>
    <div class="l12-problems">
        <div class="l12-problem"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Тяжело найти</strong> — таких людей либо нет, либо им скучно и они уходят</div></div>
        <div class="l12-problem"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Тяжело обучить</strong> — 5 разным делам в 5 раз дольше, и ни одному не обучен хорошо</div></div>
        <div class="l12-problem"><svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.75" width="14" height="14" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><div><strong>Тяжело управлять</strong> — нет чёткой функции, нет KPI, нет объективной оценки</div></div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Раздел 8</div>
    <div class="l12-section-title">Карта бизнеса — как найти «дыры»</div>
    <div class="l12-card">
        <p>Самый опасный тип проблемы в бизнесе — та, которую вы не видите. Где тихо теряются деньги, и вы даже не понимаете почему. Пример: обычный розничный магазин — минимум 6 функций. Большинство владельцев работают только с 2–3.</p>
    </div>
    <div class="l12-functions">
        <div class="l12-fn"><div class="l12-fn-header"><span class="l12-fn-num">Функция 1</span><span class="l12-fn-title">Определить что продаём и кому</span></div><div class="l12-fn-text">Регулярная работа — рынок и покупатели меняются</div></div>
        <div class="l12-fn"><div class="l12-fn-header"><span class="l12-fn-num">Функция 2</span><span class="l12-fn-title">Как люди узнают о нас</span></div><div class="l12-fn-text">Реклама, соцсети, партнёрства. Если нет — у вас нет маркетинга. Есть только удача.</div></div>
        <div class="l12-fn"><div class="l12-fn-header"><span class="l12-fn-num">Функция 3</span><span class="l12-fn-title">Как выглядит магазин</span></div><div class="l12-fn-text">Витрина, оформление, атмосфера.</div><div class="l12-fn-stat">+30–40% трафика от привлекательного вида</div></div>
        <div class="l12-fn"><div class="l12-fn-header"><span class="l12-fn-num">Функция 4</span><span class="l12-fn-title">Мерчандайзинг</span></div><div class="l12-fn-text">Где стоит товар, как подсвечен — всё влияет на средний чек.</div><div class="l12-fn-stat">+20–25% продаж при правильном мерчандайзинге</div></div>
        <div class="l12-fn"><div class="l12-fn-header"><span class="l12-fn-num">Функция 5</span><span class="l12-fn-title">Как продаём</span></div><div class="l12-fn-text">Скрипты, работа на кассе, предложение сопутствующих товаров. Без этого магазин — просто склад.</div></div>
        <div class="l12-fn"><div class="l12-fn-header"><span class="l12-fn-num">Функция 6</span><span class="l12-fn-title">Как возвращаем покупателей</span></div><div class="l12-fn-text">Программы лояльности, рассылки, акции для постоянных.</div><div class="l12-fn-stat">Удержание в 5–7 раз дешевле привлечения</div></div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Разделы 9–10</div>
    <div class="l12-section-title">Роль руководителя и три шага построения структуры</div>
    <div class="l12-mgr">
        <div class="l12-mgr-item"><div class="l12-mgr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div><div><div class="l12-mgr-title">Видеть</div><div class="l12-mgr-text">Система показателей по каждой функции в реальном времени</div></div></div>
        <div class="l12-mgr-item"><div class="l12-mgr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div><div class="l12-mgr-title">Замечать</div><div class="l12-mgr-text">Видеть проблемы до того, как они стали катастрофой</div></div></div>
        <div class="l12-mgr-item"><div class="l12-mgr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><div class="l12-mgr-title">Исправлять</div><div class="l12-mgr-text">Быстро вмешиваться — не «потом разберёмся», а сейчас</div></div></div>
    </div>
    <div class="l12-steps" style="margin-top:0.75rem;">
        <div class="l12-step"><div class="l12-step-num">1</div><div class="l12-step-body"><div class="l12-step-title">Разобраться с «сырьём»</div><div class="l12-step-text">Что приходит в ваш бизнес? Откуда берутся заказы? Без ответа — нельзя построить конвейер</div></div></div>
        <div class="l12-step"><div class="l12-step-num">2</div><div class="l12-step-body"><div class="l12-step-title">Определить все шаги трансформации</div><div class="l12-step-text">Что нужно сделать между «пришло» и «вышло»? Здесь вы найдёте шаги, которых сейчас нет вообще</div></div></div>
        <div class="l12-step"><div class="l12-step-num">3</div><div class="l12-step-body"><div class="l12-step-title">Поставить людей на места</div><div class="l12-step-text">К каждой функции — назначить ответственного. Оба знают: эта работа сделана или нет</div></div></div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Задание</div>
    <div class="l12-section-title">Разработайте функциональную структуру вашего бизнеса через AI-ассистента</div>
    <div class="l12-steps">
        <div class="l12-step"><div class="l12-step-num">1</div><div class="l12-step-body"><div class="l12-step-title">Пройдите диалог с AI-коучем структуры</div><div class="l12-step-text">Ассистент проведёт через определение всех функций бизнеса и поможет распределить роли</div></div></div>
        <div class="l12-step"><div class="l12-step-num">2</div><div class="l12-step-body"><div class="l12-step-title">Сохраните результат в Google Docs</div><div class="l12-step-text">На выходе — готовая «Функциональная карта бизнеса» с перечнем функций и ответственных</div></div></div>
        <div class="l12-step"><div class="l12-step-num">3</div><div class="l12-step-body"><div class="l12-step-title">Проведите презентацию для команды</div><div class="l12-step-text">Покажите каждому его функцию и зону ответственности</div></div></div>
    </div>
</div>

<div class="l12-divider"></div>

<div class="l12-section">
    <div class="l12-section-label">Инструмент</div>
    <div class="l12-tool">
        <div class="l12-tool-header">
            <div class="l12-tool-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </div>
            <div>
                <div class="l12-tool-title">AI-коуч функциональной структуры</div>
                <div class="l12-tool-desc">Ассистент ведёт диалог и помогает построить полную карту функций вашего бизнеса: определяет все работы, находит «дыры» и распределяет ответственность. На выходе — готовая Функциональная карта бизнеса.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-68584f3314848191b812f6c0abaaae9e-ai-kouch-konsultant-alex-talko-orgstruktura" target="_blank" class="l12-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Разработать функциональную структуру
        </a>
    </div>
</div>`,

                homework: `<ol><li>Пройдіть діалог з AI-коучем функціональної структури</li><li>Створіть «Функціональну карту бізнесу» у Google Docs і прикріпіть посилання</li><li>Проведіть презентацію для команди — покажіть кожному його функцію і зону відповідальності</li><li>Напишіть у полі відповіді: яку «діру» ви знайшли — функцію, за яку зараз ніхто не відповідає</li></ol>`,
                homework_ru: `<ol><li>Пройдите диалог с AI-коучем функциональной структуры</li><li>Создайте «Функциональную карту бизнеса» в Google Docs и прикрепите ссылку</li><li>Проведите презентацию для команды — покажите каждому его функцию</li><li>Напишите в поле ответа: какую «дыру» вы нашли — функцию, за которую сейчас никто не отвечает</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-68584f3314848191b812f6c0abaaae9e-ai-kouch-konsultant-alex-talko-orgstruktura",
                homeworkLinkName: "→ AI-коуч структури",
                homeworkLinkName_ru: "→ AI-коуч структуры",
                time: 180
            },
            {
                id: 13,
                title: "СИСТЕМА СТАТИСТИК",
                title_ru: "СИСТЕМА СТАТИСТИК",
                subtitle: "Як бачити бізнес у цифрах — і чому тиждень важливіший за місяць",
                subtitle_ru: "Как видеть бизнес в цифрах — и почему неделя важнее месяца",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l13-s{margin-bottom:1.75rem}.l13-s:last-child{margin-bottom:0}
.l13-div{height:1px;background:#e2e8f0;margin:1.75rem 0}
.l13-lbl{font-size:.7rem;font-weight:700;letter-spacing:.09em;color:#9ca3af;text-transform:uppercase;margin-bottom:.65rem}
.l13-title{font-size:1rem;font-weight:700;color:#1a1a1a;margin-bottom:.65rem}
.l13-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem 1.1rem}
.l13-card p{font-size:.9rem;color:#374151;line-height:1.65}
.l13-card p+p{margin-top:.7rem}
.l13-quote{margin:.85rem 0;padding:.9rem 1.1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-left:3px solid #22c55e;border-radius:0 10px 10px 0;font-size:.875rem;color:#166534;font-style:italic;line-height:1.6}
.l13-err{display:grid;gap:.5rem;margin-top:.75rem}
.l13-err-item{padding:.8rem .95rem;background:#fef2f2;border:1px solid #fecaca;border-radius:10px}
.l13-err-title{font-weight:700;color:#dc2626;font-size:.875rem;margin-bottom:.3rem}
.l13-err-text{font-size:.82rem;color:#7f1d1d;line-height:1.5}
.l13-tw{overflow-x:auto;margin-top:.75rem}
.l13-t{width:100%;border-collapse:collapse;font-size:.82rem}
.l13-t th{background:#f0fdf4;color:#166534;font-weight:700;padding:.55rem .75rem;text-align:left;border:1px solid #bbf7d0;font-size:.75rem}
.l13-t td{padding:.55rem .75rem;border:1px solid #e2e8f0;color:#374151;line-height:1.4}
.l13-t tr:nth-child(even) td{background:#f8fafc}
.l13-res{display:grid;gap:.45rem;margin-top:.75rem}
.l13-res-item{display:flex;align-items:center;gap:.6rem;padding:.6rem .85rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:9px;font-size:.875rem;color:#166534;font-weight:500}
.l13-tool{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.1rem 1.25rem}
.l13-th{display:flex;align-items:flex-start;gap:.85rem}
.l13-ti{width:40px;height:40px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.l13-tt{font-weight:700;color:#1a1a1a;font-size:.95rem;margin-bottom:.25rem}
.l13-td{font-size:.82rem;color:#525252;line-height:1.5}
.l13-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:.85rem;padding:.5rem 1.05rem;background:#22c55e;color:white;border-radius:9px;font-size:.85rem;font-weight:700;text-decoration:none}
</style>

<div class="l13-s">
    <div class="l13-lbl">Головна проблема</div>
    <div class="l13-title">Без цифр ви бачите не реальність, а свою інтерпретацію</div>
    <div class="l13-card">
        <p>Більшість власників вважають, що добре розуміють свій бізнес. «Якщо записів багато — все добре. Якщо мало — треба рекламу». Здається логічним. Але якщо все так зрозуміло — чому щотижня є пожежі? Чому раптом падають продажі і незрозуміло чому? Чому в маркетинг вклали гроші, а результат «то є, то нема»?</p>
        <p>Проблеми в бізнесі майже ніколи не виникають раптово. Вони накопичуються тижнями — повільно, непомітно. Людина бачить невелике погіршення, пояснює це «сезоном» або «особливим місяцем». Поки проблема не стала величезною — на неї не звертають уваги. Тоді вже важко щось виправити.</p>
    </div>
    <div class="l13-quote">Статистики вирішують саме це: роблять невидиме — видимим.</div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Розділ 1</div>
    <div class="l13-title">Що таке статистика — і чим вона відрізняється від «показника»</div>
    <div class="l13-card">
        <p>Статистика — це <strong>кількісний вимір результату конкретної функції, який проводиться щотижня і порівнюється з попереднім тижнем</strong>. Не раз на місяць. Не «приблизно». Щотижня, у цифрах, на графіку.</p>
        <p>Різниця між статистикою і «показником» — у способі застосування. Показник — це просто число. Статистика — це число в динаміці. Вас цікавить не те, що продажі цього тижня склали 80 000 грн, а те, що минулого було 95 000. <strong>Тренд важливіший за точку.</strong></p>
    </div>
    <div class="l13-card" style="margin-top:.6rem">
        <p><strong>Метафора — приладова дошка автомобіля.</strong> Ви не можете вести автомобіль із закритими очима, лише зрідка підглядаючи на дорогу. Але саме так керує бізнесом власник без статистик. Приладова дошка потрібна не щоб «відслідковувати», а щоб вчасно помітити: температура двигуна росте, пальне закінчується, тиск у шинах падає.</p>
    </div>
    <div class="l13-quote">Місяць — надто великий горизонт для управління. Якщо вранці взяли неправильний напрям — до вечора ви за кілька кілометрів від маршруту. Щотижневі статистики — це звіряння з компасом кожні кілька годин.</div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Розділ 2</div>
    <div class="l13-title">Статистика і ЦКП — що і як вимірювати</div>
    <div class="l13-card">
        <p>Кожна функція має свій Цінний Кінцевий Продукт (ЦКП) — конкретний результат, який вона виробляє. Статистика — це кількісний вимір цього продукту.</p>
    </div>
    <div class="l13-tw">
        <table class="l13-t">
            <thead><tr><th>Функція</th><th>ЦКП</th><th>Статистика</th></tr></thead>
            <tbody>
                <tr><td>Секретар</td><td>Правильно спрямовані дзвінки</td><td>Кількість правильно спрямованих дзвінків</td></tr>
                <tr><td>Продажі</td><td>Підписані договори</td><td>Сума замовлень за договорами (грн)</td></tr>
                <tr><td>Фінанси</td><td>Отримані оплати</td><td>Сума отриманих оплат (грн)</td></tr>
                <tr><td>Дизайн</td><td>Затверджені макети</td><td>Кількість макетів, схвалених клієнтом</td></tr>
                <tr><td>Доставка</td><td>Вчасно доставлена продукція</td><td>Вартість доставленої продукції (грн)</td></tr>
            </tbody>
        </table>
    </div>
    <div class="l13-quote">Головна статистика компанії — не гроші. Гроші — результат. Наприклад, головна статистика TALKO — кількість компаній, у яких впроваджено систему управління.</div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Три помилки</div>
    <div class="l13-title">Як не треба вибирати статистику</div>
    <div class="l13-err">
        <div class="l13-err-item">
            <div class="l13-err-title">Помилка 1: відсотки замість кількості</div>
            <div class="l13-err-text">«Секретар правильно спрямував 100% дзвінків» — якщо надійшло 2 дзвінки замість 40, статистика 100% нічого не покаже. ЦКП не виконано, але виглядає ідеально.</div>
        </div>
        <div class="l13-err-item">
            <div class="l13-err-title">Помилка 2: зворотні статистики як головні</div>
            <div class="l13-err-text">«Кількість незірваних замовлень» — якщо замовлень взагалі не було, статистика ідеальна. Зворотні показники можуть бути допоміжними, але головна — завжди про обсяг виробленого продукту.</div>
        </div>
        <div class="l13-err-item">
            <div class="l13-err-title">Помилка 3: статистика «готовності», а не результату</div>
            <div class="l13-err-text">«Я був доступний весь тиждень» — це не ЦКП. Статистика вимірює реальний продукт, а не наміри.</div>
        </div>
    </div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Результат уроку</div>
    <div class="l13-res">
        <div class="l13-res-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Розумієте різницю між статистикою і показником — тренд vs точка</div>
        <div class="l13-res-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Вмієте пов'язати кожну функцію з її ЦКП і правильною статистикою</div>
        <div class="l13-res-item"><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.75" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>Уникаєте трьох типових помилок при виборі метрики</div>
    </div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Інструмент</div>
    <div class="l13-tool">
        <div class="l13-th">
            <div class="l13-ti">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
                <div class="l13-tt">AI-асистент системи статистик</div>
                <div class="l13-td">Проведе вас через визначення ЦКП кожної функції і допоможе сформулювати правильні статистики. На виході — готовий перелік метрик для впровадження на платформі.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6851a70e282481918ad5c2894ff30b13-statistics" target="_blank" class="l13-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Розробити систему статистик
        </a>
    </div>
</div>`,

                lessonContent_ru: `
<style>
.l13-s{margin-bottom:1.75rem}.l13-s:last-child{margin-bottom:0}
.l13-div{height:1px;background:#e2e8f0;margin:1.75rem 0}
.l13-lbl{font-size:.7rem;font-weight:700;letter-spacing:.09em;color:#9ca3af;text-transform:uppercase;margin-bottom:.65rem}
.l13-title{font-size:1rem;font-weight:700;color:#1a1a1a;margin-bottom:.65rem}
.l13-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem 1.1rem}
.l13-card p{font-size:.9rem;color:#374151;line-height:1.65}
.l13-card p+p{margin-top:.7rem}
.l13-quote{margin:.85rem 0;padding:.9rem 1.1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-left:3px solid #22c55e;border-radius:0 10px 10px 0;font-size:.875rem;color:#166534;font-style:italic;line-height:1.6}
.l13-err{display:grid;gap:.5rem;margin-top:.75rem}
.l13-err-item{padding:.8rem .95rem;background:#fef2f2;border:1px solid #fecaca;border-radius:10px}
.l13-err-title{font-weight:700;color:#dc2626;font-size:.875rem;margin-bottom:.3rem}
.l13-err-text{font-size:.82rem;color:#7f1d1d;line-height:1.5}
.l13-tw{overflow-x:auto;margin-top:.75rem}
.l13-t{width:100%;border-collapse:collapse;font-size:.82rem}
.l13-t th{background:#f0fdf4;color:#166534;font-weight:700;padding:.55rem .75rem;text-align:left;border:1px solid #bbf7d0;font-size:.75rem}
.l13-t td{padding:.55rem .75rem;border:1px solid #e2e8f0;color:#374151;line-height:1.4}
.l13-t tr:nth-child(even) td{background:#f8fafc}
.l13-res{display:grid;gap:.45rem;margin-top:.75rem}
.l13-res-item{display:flex;align-items:center;gap:.6rem;padding:.6rem .85rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:9px;font-size:.875rem;color:#166534;font-weight:500}
.l13-tool{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.1rem 1.25rem}
.l13-th{display:flex;align-items:flex-start;gap:.85rem}
.l13-ti{width:40px;height:40px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.l13-tt{font-weight:700;color:#1a1a1a;font-size:.95rem;margin-bottom:.25rem}
.l13-td{font-size:.82rem;color:#525252;line-height:1.5}
.l13-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:.85rem;padding:.5rem 1.05rem;background:#22c55e;color:white;border-radius:9px;font-size:.85rem;font-weight:700;text-decoration:none}
</style>

<div class="l13-s">
    <div class="l13-lbl">Главная проблема</div>
    <div class="l13-title">Без цифр вы видите не реальность, а свою интерпретацию</div>
    <div class="l13-card">
        <p>Большинство владельцев считают, что хорошо понимают свой бизнес. «Если записей много — всё хорошо. Если мало — нужна реклама». Кажется логичным. Но если всё так понятно — почему каждую неделю пожары? Почему вдруг падают продажи и непонятно почему?</p>
        <p>Проблемы в бизнесе почти никогда не возникают внезапно. Они накапливаются неделями — медленно, незаметно. Человек видит небольшое ухудшение, объясняет «сезоном». Пока проблема не стала огромной — на неё не обращают внимания.</p>
    </div>
    <div class="l13-quote">Статистики решают именно это: делают невидимое — видимым.</div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Раздел 1</div>
    <div class="l13-title">Что такое статистика — и чем она отличается от «показателя»</div>
    <div class="l13-card">
        <p>Статистика — это <strong>количественное измерение результата конкретной функции, которое проводится еженедельно и сравнивается с предыдущей неделей</strong>. Не раз в месяц. Не «примерно». Каждую неделю, в цифрах, на графике.</p>
        <p>Вас интересует не то, что продажи этой недели составили 80 000 грн, а то, что на прошлой было 95 000. <strong>Тренд важнее точки.</strong></p>
    </div>
    <div class="l13-quote">Месяц — слишком большой горизонт для управления. Если утром взяли неправильное направление — к вечеру вы в нескольких километрах от маршрута. Еженедельные статистики — это сверка с компасом каждые несколько часов.</div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Раздел 2</div>
    <div class="l13-title">Статистика и ЦКП — что и как измерять</div>
    <div class="l13-tw">
        <table class="l13-t">
            <thead><tr><th>Функция</th><th>ЦКП</th><th>Статистика</th></tr></thead>
            <tbody>
                <tr><td>Секретарь</td><td>Правильно направленные звонки</td><td>Количество правильно направленных звонков</td></tr>
                <tr><td>Продажи</td><td>Подписанные договоры</td><td>Сумма заказов по договорам (грн)</td></tr>
                <tr><td>Финансы</td><td>Полученные оплаты</td><td>Сумма полученных оплат (грн)</td></tr>
                <tr><td>Дизайн</td><td>Утверждённые макеты</td><td>Количество макетов, одобренных клиентом</td></tr>
                <tr><td>Доставка</td><td>Вовремя доставленная продукция</td><td>Стоимость доставленной продукции (грн)</td></tr>
            </tbody>
        </table>
    </div>
    <div class="l13-quote">Главная статистика компании — не деньги. Деньги — результат. Например, главная статистика TALKO — количество компаний, в которых внедрена система управления.</div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Три ошибки</div>
    <div class="l13-title">Как не надо выбирать статистику</div>
    <div class="l13-err">
        <div class="l13-err-item">
            <div class="l13-err-title">Ошибка 1: проценты вместо количества</div>
            <div class="l13-err-text">«Секретарь направил 100% звонков правильно» — если поступило 2 звонка вместо 40, статистика 100% ничего не покажет. ЦКП не выполнен, но выглядит идеально.</div>
        </div>
        <div class="l13-err-item">
            <div class="l13-err-title">Ошибка 2: обратные статистики как главные</div>
            <div class="l13-err-text">«Количество несорванных заказов» — если заказов вообще не было, статистика идеальная. Обратные показатели могут быть вспомогательными, но главная — всегда об объёме произведённого продукта.</div>
        </div>
        <div class="l13-err-item">
            <div class="l13-err-title">Ошибка 3: статистика «готовности», а не результата</div>
            <div class="l13-err-text">«Я был доступен всю неделю» — это не ЦКП. Статистика измеряет реальный продукт, а не намерения.</div>
        </div>
    </div>
</div>

<div class="l13-div"></div>

<div class="l13-s">
    <div class="l13-lbl">Инструмент</div>
    <div class="l13-tool">
        <div class="l13-th">
            <div class="l13-ti">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
                <div class="l13-tt">AI-ассистент системы статистик</div>
                <div class="l13-td">Проведёт вас через определение ЦКП каждой функции и поможет сформулировать правильные статистики. На выходе — готовый перечень метрик для внедрения на платформе.</div>
            </div>
        </div>
        <a href="https://chatgpt.com/g/g-6851a70e282481918ad5c2894ff30b13-statistics" target="_blank" class="l13-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Разработать систему статистик
        </a>
    </div>
</div>`,

                homework: `<ol><li>Пройдіть діалог з AI-асистентом статистик</li><li>Для кожної функції визначте ЦКП і відповідну статистику</li><li>Напишіть у полі відповіді: яка головна статистика вашої компанії і чому саме вона</li></ol>`,
                homework_ru: `<ol><li>Пройдите диалог с AI-ассистентом статистик</li><li>Для каждой функции определите ЦКП и соответствующую статистику</li><li>Напишите в поле ответа: какая главная статистика вашей компании и почему именно она</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-6851a70e282481918ad5c2894ff30b13-statistics",
                homeworkLinkName: "→ AI-асистент статистик",
                homeworkLinkName_ru: "→ AI-ассистент статистик",
                time: 60
            },
            {
                id: 14,
                title: "ВПРОВАДЖЕННЯ НА ПЛАТФОРМІ",
                title_ru: "ВНЕДРЕНИЕ НА ПЛАТФОРМЕ",
                subtitle: "Запитайте AI-асистента — він пояснить що і як робити",
                subtitle_ru: "Спросите AI-ассистента — он объяснит что и как делать",
                hideAiBlock: true,

                videoLink: null,
                materialsLink: null,

                lessonContent: `
<style>
.l14-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem 1.1rem;margin-bottom:.75rem}
.l14-card p{font-size:.9rem;color:#374151;line-height:1.65}
.l14-tool{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.1rem 1.25rem}
.l14-th{display:flex;align-items:flex-start;gap:.85rem}
.l14-ti{width:40px;height:40px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.l14-tt{font-weight:700;color:#1a1a1a;font-size:.95rem;margin-bottom:.25rem}
.l14-td{font-size:.82rem;color:#525252;line-height:1.5}
.l14-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:.85rem;padding:.5rem 1.05rem;background:#22c55e;color:white;border-radius:9px;font-size:.85rem;font-weight:700;text-decoration:none}
</style>

<div class="l14-card">
    <p>Це практичний урок — впровадження на платформі, на якій ви зараз знаходитесь. Запитайте AI-асистента: він пояснить що робити і в якому порядку.</p>
</div>

<div class="l14-tool">
    <div class="l14-th">
        <div class="l14-ti"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div>
            <div class="l14-tt">TALKO Task Manager Support</div>
            <div class="l14-td">AI-асистент підкаже як користуватись платформою і що робити далі.</div>
        </div>
    </div>
    <a href="https://chatgpt.com/g/g-69382bfa841881918aff7b50aa25a4f9-talko-task-manager-support" target="_blank" class="l14-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Запитати AI-асистента
    </a>
</div>`,

                lessonContent_ru: `
<style>
.l14-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem 1.1rem;margin-bottom:.75rem}
.l14-card p{font-size:.9rem;color:#374151;line-height:1.65}
.l14-tool{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.1rem 1.25rem}
.l14-th{display:flex;align-items:flex-start;gap:.85rem}
.l14-ti{width:40px;height:40px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.l14-tt{font-weight:700;color:#1a1a1a;font-size:.95rem;margin-bottom:.25rem}
.l14-td{font-size:.82rem;color:#525252;line-height:1.5}
.l14-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:.85rem;padding:.5rem 1.05rem;background:#22c55e;color:white;border-radius:9px;font-size:.85rem;font-weight:700;text-decoration:none}
</style>

<div class="l14-card">
    <p>Это практический урок — внедрение на платформе, на которой вы сейчас находитесь. Спросите AI-ассистента: он объяснит что делать и в каком порядке.</p>
</div>

<div class="l14-tool">
    <div class="l14-th">
        <div class="l14-ti"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.75" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div>
            <div class="l14-tt">TALKO Task Manager Support</div>
            <div class="l14-td">AI-ассистент подскажет как пользоваться платформой и что делать дальше.</div>
        </div>
    </div>
    <a href="https://chatgpt.com/g/g-69382bfa841881918aff7b50aa25a4f9-talko-task-manager-support" target="_blank" class="l14-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Спросить AI-ассистента
    </a>
</div>`,

                homework: `<ol><li>Запитайте AI-асистента і розпочніть роботу на платформі</li></ol>`,
                homework_ru: `<ol><li>Спросите AI-ассистента и начните работу на платформе</li></ol>`,

                homeworkLink: "https://chatgpt.com/g/g-69382bfa841881918aff7b50aa25a4f9-talko-task-manager-support",
                homeworkLinkName: "→ TALKO Support",
                homeworkLinkName_ru: "→ TALKO Support",
                time: 30
            }
        ];

    // ── State ─────────────────────────────────────────────────
    let learningProgress = {};     // { moduleId: { completed, homeworkDone, homeworkText } }
    let currentLearningModule = null;
    // Use TALKO main lang - read from localStorage key used by translations module
    function getLearningLang() {
        return localStorage.getItem('talko_lang') || 'ua';
    }

    // ── Firestore helpers ─────────────────────────────────────
    // Use same pattern as 76-coordination: firebase.firestore() + window.currentCompany
    function _db() { return firebase.firestore(); }
    function _companyId() { return typeof currentCompany !== 'undefined' ? currentCompany : null; }
    function _uid() { return typeof currentUser !== 'undefined' && currentUser ? currentUser.uid : null; }

    function lProgressRef() {
        const cid = _companyId();
        const uid = _uid();
        if (!cid || !uid) return null;
        return _db()
            .collection('companies').doc(cid)
            .collection('users').doc(uid);
    }

    async function loadLearningProgress() {
        const ref = lProgressRef();
        if (!ref) {
            // No Firestore access - just render with empty progress
            updateModulesFromLearningProgress();
            renderLearning();
            return;
        }
        try {
            const snap = await ref.get();
            if (snap.exists) {
                learningProgress = snap.data().learningProgress || {};
            }
        } catch(e) {
            console.warn('[Learning] Load progress error:', e);
        }
        updateModulesFromLearningProgress();
        renderLearning();
    }

    async function saveLearningProgress() {
        const ref = lProgressRef();
        if (!ref) return;
        try {
            await ref.set({ learningProgress }, { merge: true });
        } catch(e) {
            console.warn('[Learning] Save progress error:', e);
        }
    }

    // ── Progress helpers ──────────────────────────────────────
    function updateModulesFromLearningProgress() {
        learningCourseData.forEach(module => {
            const p = learningProgress[module.id];
            if (p) {
                module.completed = !!p.completed;
                module.homeworkCompleted = !!p.homeworkDone;
            } else {
                module.completed = false;
                module.homeworkCompleted = false;
            }
        });
    }

    function getLearningStats() {
        const total = learningCourseData.length;
        const completed = learningCourseData.filter(m => m.completed).length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, pct };
    }

    // ── Main Render ───────────────────────────────────────────
    function renderLearning() {
        const root = document.getElementById('learningTab');
        if (!root) return;

        const stats = getLearningStats();
        const isRu = getLearningLang() === 'ru';

        root.innerHTML = `
        <div class="learning-wrap">
            <!-- Header -->
            <div class="learning-header">
                <div class="learning-header-title">
                    <i data-lucide="graduation-cap" class="icon" style="color:#22c55e;width:24px;height:24px;"></i>
                    <span>${isRu ? 'Программа обучения' : 'Програма навчання'}</span>
                </div>
    
            </div>

            <!-- Stats bar -->
            <div class="learning-stats">
                <div class="learning-stat">
                    <div class="learning-stat-value">${stats.pct}%</div>
                    <div class="learning-stat-label">${isRu ? 'Прогресс' : 'Прогрес'}</div>
                </div>
                <div class="learning-stat">
                    <div class="learning-stat-value">${stats.completed}/${stats.total}</div>
                    <div class="learning-stat-label">${isRu ? 'Модулей' : 'Модулів'}</div>
                </div>
                <div class="learning-progress-bar-wrap">
                    
                </div>
            </div>

            <!-- Modules list -->
            <div class="learning-modules-list" id="learningModulesList">
                ${learningCourseData.map(module => renderModuleCard(module, isRu)).join('')}
            </div>
        </div>`;

        if (window.refreshIcons) window.refreshIcons();
    }

    function renderModuleCard(module, isRu) {
        const title = isRu ? (module.title_ru || module.title) : module.title;
        const subtitle = isRu ? (module.subtitle_ru || module.subtitle || '') : (module.subtitle || '');
        const isCompleted = module.completed;
        const isAvailable = module.id === 0 || (learningCourseData[module.id - 1] && learningCourseData[module.id - 1].completed) || module.id <= 3;

        return `
        <div class="l-module-card ${isCompleted ? 'completed' : ''} ${!isAvailable ? 'locked' : ''}" 
             onclick="window._openLearningModule(${module.id})"
             style="cursor:pointer;">
            <div class="l-module-icon ${isCompleted ? 'completed' : isAvailable ? 'available' : 'locked'}">
                ${isCompleted
                    ? '<i data-lucide="check-circle" class="icon" style="width:20px;height:20px;"></i>'
                    : !isAvailable
                        ? '<i data-lucide="lock" class="icon" style="width:20px;height:20px;"></i>'
                        : `<span style="font-weight:700;font-size:0.9rem;">${module.id}</span>`
                }
            </div>
            <div class="l-module-info">
                <div class="l-module-title">${title}</div>
                ${subtitle ? `<div class="l-module-subtitle">${subtitle}</div>` : ''}
                ${module.time ? `<div class="l-module-time"><i data-lucide="clock" class="icon" style="width:12px;height:12px;"></i> ${module.time} хв</div>` : ''}
            </div>
            <div class="l-module-arrow">
                <i data-lucide="${isCompleted ? 'check' : 'chevron-right'}" class="icon" style="width:18px;height:18px;color:${isCompleted ? '#22c55e' : '#9ca3af'};"></i>
            </div>
        </div>`;
    }

    // ── Open Module Detail ────────────────────────────────────
    // ── Algoritm Route (Module 0 special view) ────────────────
    window._openAlgoritm = function() {
        const root = document.getElementById('learningTab');
        if (!root) return;
        root.innerHTML = `
        <div class="learning-wrap" style="padding:0 0 4rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;padding:1rem 1.5rem 0.5rem;position:sticky;top:0;background:white;z-index:10;border-bottom:1px solid #e5e7eb;">
                <button class="l-back-btn" onclick="window._openLearningModule(0)" style="display:flex;align-items:center;gap:0.4rem;background:none;border:none;color:#6b7280;font-size:0.875rem;cursor:pointer;">
                    ← Назад до модуля
                </button>
                <span style="font-weight:700;color:#1a1a1a;">Маршрут програми</span>
            </div>
            <style>
        :root {
            --primary: #22c55e;
            --primary-dark: #16a34a;
            --primary-light: rgba(34, 197, 94, 0.1);
            --bg-dark: #0a0f0a;
            --bg-light: #f9fafb;
            --bg-card: #ffffff;
            --text-dark: #1a1a1a;
            --text-gray: #525252;
            --text-light: #94a3b8;
            --border: #e2e8f0;
            --red: #ef4444;
            --orange: #f59e0b;
            --blue: #3b82f6;
            --purple: #8b5cf6;
        }





.algoritm-wrap .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px 16px;
        }

        /* Header */
.algoritm-wrap .page-header {
            background: var(--bg-dark);
            padding: 24px 0;
            margin-bottom: 24px;
        }

.algoritm-wrap .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
        }

.algoritm-wrap .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

.algoritm-wrap .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #fff;
            font-weight: 700;
            font-size: 18px;
        }

.algoritm-wrap .logo-icon {
            width: 40px;
            height: 40px;
            background: var(--primary);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

.algoritm-wrap .logo-icon svg {
            width: 22px;
            height: 22px;
            color: var(--bg-dark);
        }

.algoritm-wrap .page-title {
            color: #fff;
            font-size: 24px;
            font-weight: 700;
        }

.algoritm-wrap .page-title span {
            color: var(--primary);
        }

        /* Progress Bar */
.algoritm-wrap .progress-section {
            background: var(--bg-card);
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 24px;
            border: 1px solid var(--border);
        }

.algoritm-wrap .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

.algoritm-wrap .progress-label {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-gray);
        }

.algoritm-wrap .progress-value {
            font-weight: 700;
            font-size: 14px;
            color: var(--primary);
        }

.algoritm-wrap .progress-bar {
            height: 8px;
            background: var(--border);
            border-radius: 4px;
            overflow: hidden;
        }

.algoritm-wrap .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--primary-dark));
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        /* Stats */
.algoritm-wrap .stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }

.algoritm-wrap .stat-card {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 16px 20px;
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 12px;
        }

.algoritm-wrap .stat-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

.algoritm-wrap .stat-icon svg {
            width: 22px;
            height: 22px;
        }

.algoritm-wrap .stat-icon.green {
            background: var(--primary-light);
        }

.algoritm-wrap .stat-icon.green svg {
            color: var(--primary);
        }

.algoritm-wrap .stat-icon.orange {
            background: rgba(245, 158, 11, 0.1);
        }

.algoritm-wrap .stat-icon.orange svg {
            color: var(--orange);
        }

.algoritm-wrap .stat-icon.blue {
            background: rgba(59, 130, 246, 0.1);
        }

.algoritm-wrap .stat-icon.blue svg {
            color: var(--blue);
        }

.algoritm-wrap .stat-icon.gray {
            background: rgba(148, 163, 184, 0.1);
        }

.algoritm-wrap .stat-icon.gray svg {
            color: var(--text-light);
        }

.algoritm-wrap .stat-content h4 {
            font-size: 24px;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 2px;
        }

.algoritm-wrap .stat-content p {
            font-size: 13px;
            color: var(--text-gray);
        }

        /* Table Container */
.algoritm-wrap .table-container {
            background: var(--bg-card);
            border-radius: 16px;
            border: 1px solid var(--border);
            overflow: hidden;
        }

.algoritm-wrap .table-header-bar {
            background: var(--bg-dark);
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

.algoritm-wrap .table-title {
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

.algoritm-wrap .table-title svg {
            width: 20px;
            height: 20px;
            color: var(--primary);
        }

.algoritm-wrap .table-actions {
            display: flex;
            gap: 8px;
        }

.algoritm-wrap .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

.algoritm-wrap .btn svg {
            width: 16px;
            height: 16px;
        }

.algoritm-wrap .btn-primary {
            background: var(--primary);
            color: #fff;
        }

.algoritm-wrap .btn-primary:hover {
            background: var(--primary-dark);
        }

.algoritm-wrap .btn-outline-light {
            background: transparent;
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

.algoritm-wrap .btn-outline-light:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        /* Table */
.algoritm-wrap .table-scroll {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1100px;
        }

        th {
            background: var(--bg-light);
            padding: 14px 16px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: var(--text-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }

        td {
            padding: 16px;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
            vertical-align: middle;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover {
            background: rgba(34, 197, 94, 0.02);
        }

        /* Step Column */
.algoritm-wrap .step-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }

.algoritm-wrap .step-number {
            width: 32px;
            height: 32px;
            background: var(--primary-light);
            color: var(--primary-dark);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
        }

.algoritm-wrap .step-number.completed {
            background: var(--primary);
            color: #fff;
        }

.algoritm-wrap .step-number.active {
            background: var(--orange);
            color: #fff;
        }

.algoritm-wrap .step-info h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 2px;
        }

.algoritm-wrap .step-info p {
            font-size: 12px;
            color: var(--text-gray);
        }

        /* Status Badge */
.algoritm-wrap .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }

.algoritm-wrap .status-badge:hover {
            transform: scale(1.02);
        }

.algoritm-wrap .status-badge svg {
            width: 14px;
            height: 14px;
        }

.algoritm-wrap .status-completed {
            background: var(--primary-light);
            color: var(--primary-dark);
        }

.algoritm-wrap .status-in-progress {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
        }

.algoritm-wrap .status-waiting {
            background: rgba(59, 130, 246, 0.1);
            color: var(--blue);
        }

.algoritm-wrap .status-locked {
            background: rgba(148, 163, 184, 0.1);
            color: var(--text-light);
        }

        /* Tool Cell */
.algoritm-wrap .tool-cell {
            display: flex;
            align-items: center;
            gap: 10px;
        }

.algoritm-wrap .tool-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

.algoritm-wrap .tool-icon svg {
            width: 18px;
            height: 18px;
        }

.algoritm-wrap .tool-icon.ai {
            background: rgba(139, 92, 246, 0.1);
        }

.algoritm-wrap .tool-icon.ai svg {
            color: var(--purple);
        }

.algoritm-wrap .tool-icon.video {
            background: rgba(239, 68, 68, 0.1);
        }

.algoritm-wrap .tool-icon.video svg {
            color: var(--red);
        }

.algoritm-wrap .tool-icon.doc {
            background: rgba(59, 130, 246, 0.1);
        }

.algoritm-wrap .tool-icon.doc svg {
            color: var(--blue);
        }

.algoritm-wrap .tool-icon.excel {
            background: rgba(34, 197, 94, 0.1);
        }

.algoritm-wrap .tool-icon.excel svg {
            color: var(--primary);
        }

.algoritm-wrap .tool-icon.chat {
            background: rgba(245, 158, 11, 0.1);
        }

.algoritm-wrap .tool-icon.chat svg {
            color: var(--orange);
        }

.algoritm-wrap .tool-icon.platform {
            background: var(--primary-light);
        }

.algoritm-wrap .tool-icon.platform svg {
            color: var(--primary-dark);
        }

.algoritm-wrap .tool-icon.folder {
            background: rgba(59, 130, 246, 0.1);
        }

.algoritm-wrap .tool-icon.folder svg {
            color: var(--blue);
        }

.algoritm-wrap .tool-icon.team {
            background: rgba(245, 158, 11, 0.1);
        }

.algoritm-wrap .tool-icon.team svg {
            color: var(--orange);
        }

.algoritm-wrap .tool-icon.present {
            background: rgba(239, 68, 68, 0.1);
        }

.algoritm-wrap .tool-icon.present svg {
            color: var(--red);
        }

.algoritm-wrap .tool-name {
            font-weight: 500;
        }

        /* Task Cell */
.algoritm-wrap .task-text {
            max-width: 280px;
            line-height: 1.4;
        }

        /* Date Cell */
.algoritm-wrap .date-cell {
            white-space: nowrap;
        }

.algoritm-wrap .date-planned {
            color: var(--text-gray);
            font-size: 13px;
        }

.algoritm-wrap .date-input {
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 13px;
            font-family: inherit;
            color: var(--text-dark);
            background: #fff;
        }

        /* Time Cell */
.algoritm-wrap .time-cell {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text-gray);
        }

.algoritm-wrap .time-cell svg {
            width: 14px;
            height: 14px;
            color: var(--text-light);
        }

        /* Comment Cell */
.algoritm-wrap .comment-cell {
            max-width: 200px;
            font-size: 13px;
            color: var(--text-gray);
        }

.algoritm-wrap .comment-cell.empty {
            color: var(--text-light);
            font-style: italic;
        }

        /* Phase Divider */
.algoritm-wrap .phase-row td {
            background: var(--bg-dark);
            color: #fff;
            padding: 12px 16px;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

.algoritm-wrap .phase-row:hover td {
            background: var(--bg-dark);
        }

.algoritm-wrap .phase-label {
            display: flex;
            align-items: center;
            gap: 10px;
        }

.algoritm-wrap .phase-label svg {
            width: 18px;
            height: 18px;
            color: var(--primary);
        }

        /* Sub-phase */
.algoritm-wrap .subphase-row td {
            background: rgba(34, 197, 94, 0.05);
            color: var(--primary-dark);
            padding: 10px 16px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-left: 3px solid var(--primary);
        }

.algoritm-wrap .subphase-row:hover td {
            background: rgba(34, 197, 94, 0.08);
        }

        /* Responsive */
        @media (max-width: 1024px) {
.algoritm-wrap .stats-row {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 640px) {
.algoritm-wrap .stats-row {
                grid-template-columns: 1fr;
            }

.algoritm-wrap .header-content {
                flex-direction: column;
                align-items: flex-start;
            }

.algoritm-wrap .page-title {
                font-size: 20px;
            }
        }
</style>
<div class="algoritm-wrap"><!-- Header -->
    

    <div class="container">
        <!-- Progress -->
        <div class="progress-section">
            <div class="progress-header">
                <span class="progress-label">Загальний прогрес</span>
                <span class="progress-value">0 з 100 кроків (0%)</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-icon green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="stat-content">
                    <h4>0</h4>
                    <p>Виконано</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <div class="stat-content">
                    <h4>0</h4>
                    <p>В процесі</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="stat-content">
                    <h4>100</h4>
                    <p>Очікує</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon gray">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div class="stat-content">
                    <h4>0</h4>
                    <p>Заблоковано</p>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="table-container">
            <div class="table-header-bar">
                <div class="table-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    План впровадження
                </div>
                <div class="table-actions">
                    <button class="btn btn-outline-light" style="display:none">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Експорт в Excel
                    </button>
                </div>
            </div>

            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 280px;">Крок</th>
                            <th style="width: 130px;">Статус</th>
                            <th style="width: 180px;">Інструмент</th>
                            <th style="width: 300px;">Що потрібно зробити</th>
                            <th style="width: 120px;">Планова дата</th>
                            <th style="width: 90px;">Час</th>
                            <th>Коментар</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- ФАЗА 1: АРХІТЕКТУРА БІЗНЕСУ -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                    Фаза 1: Архітектура бізнесу
                                </div>
                            </td>
                        </tr>

                        <!-- Крок 1 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">1</div>
                                    <div class="step-info">
                                        <h4>Словник термінів</h4>
                                        <p>Основи системи</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати словник термінів та понять з AI-асистентом</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 2 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">2</div>
                                    <div class="step-info">
                                        <h4>Завдання та розпорядження</h4>
                                        <p>Як ставити правильно</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати як ставити завдання та розпорядження</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 3 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">3</div>
                                    <div class="step-info">
                                        <h4>Система Радар</h4>
                                        <p>Попередження проблем</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI Радар</span>
                                </div>
                            </td>
                            <td class="task-text">Розібратися з системою Радар — щоб люди не приходили з проблемою</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 4 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">4</div>
                                    <div class="step-info">
                                        <h4>Впровадження Радар</h4>
                                        <p>Для команди</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Команда</span>
                                </div>
                            </td>
                            <td class="task-text">Дати людям систему і пояснити як використовувати AI Радар</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 5 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">5</div>
                                    <div class="step-info">
                                        <h4>Система Компас</h4>
                                        <p>Напрямок руху</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI Компас</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати систему Компас з AI-асистентом</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 6 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">6</div>
                                    <div class="step-info">
                                        <h4>Технічний провідник</h4>
                                        <p>Налаштування систем</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">Техн. провідник</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-інструмент для покрокового налаштування CRM, таблиць, ботів</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 7 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">7</div>
                                    <div class="step-info">
                                        <h4>Папка на Google Drive</h4>
                                        <p>Систематизація TALKO</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon folder">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                    </div>
                                    <span class="tool-name">Google Drive</span>
                                </div>
                            </td>
                            <td class="task-text">Створити папку "Систематизація TALKO" на Google Drive</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    15 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 8 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">8</div>
                                    <div class="step-info">
                                        <h4>Техн. провідник команді</h4>
                                        <p>Впровадження</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Команда</span>
                                </div>
                            </td>
                            <td class="task-text">Дати співробітникам Технічний провідник для використання</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 9 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">9</div>
                                    <div class="step-info">
                                        <h4>Асистент розвитку</h4>
                                        <p>Самоаналіз та мислення</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI Розвиток</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати асистента для самоаналізу: інструменти, бізнес-модель, цілі, переконання</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 10 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">10</div>
                                    <div class="step-info">
                                        <h4>Розмова з командою</h4>
                                        <p>Плани систематизації</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Команда</span>
                                </div>
                            </td>
                            <td class="task-text">Провести розмову зі співробітниками щодо планів систематизації та наступних кроків</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Ціль та ідеальна картина -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Ціль, задум та ідеальна картина</td>
                        </tr>

                        <!-- Крок 10 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">11</div>
                                    <div class="step-info">
                                        <h4>Ціль та ідеальна картина</h4>
                                        <p>Формування політики</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Пройти асистента "Ціль, задум та ідеальна картина" та сформувати політику</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    90 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 11 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">12</div>
                                    <div class="step-info">
                                        <h4>Презентація цілі</h4>
                                        <p>Тезиси для команди</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon present">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Презентація</span>
                                </div>
                            </td>
                            <td class="task-text">Створити презентацію та тезиси до цілі та ідеальної картини</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 12 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">13</div>
                                    <div class="step-info">
                                        <h4>Впровадження цілі</h4>
                                        <p>Донесення команді</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Впровадження</span>
                                </div>
                            </td>
                            <td class="task-text">Провести впровадження цілі та ідеальної картини для команди</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Продукт організації -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Продукт організації</td>
                        </tr>

                        <!-- Крок 13 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">14</div>
                                    <div class="step-info">
                                        <h4>Продукт організації</h4>
                                        <p>Політика продукту</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Пройти асистента "Продукт організації" та створити політику</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    90 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 14 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">15</div>
                                    <div class="step-info">
                                        <h4>Презентація продукту</h4>
                                        <p>Підготовка матеріалів</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon present">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Презентація</span>
                                </div>
                            </td>
                            <td class="task-text">Підготувати презентацію продукту організації</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 15 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">16</div>
                                    <div class="step-info">
                                        <h4>Впровадження продукту</h4>
                                        <p>Донесення команді</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Впровадження</span>
                                </div>
                            </td>
                            <td class="task-text">Провести впровадження продукту для команди</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Структура -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Структура</td>
                        </tr>

                        <!-- Крок 16 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">17</div>
                                    <div class="step-info">
                                        <h4>Структура</h4>
                                        <p>Регламент</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI Структура</span>
                                </div>
                            </td>
                            <td class="task-text">Пройти асистента "Структура" та створити регламент</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    90 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 17 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">18</div>
                                    <div class="step-info">
                                        <h4>Презентація структури</h4>
                                        <p>Підготовка</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon present">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Презентація</span>
                                </div>
                            </td>
                            <td class="task-text">Провести презентацію структури</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 18 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">19</div>
                                    <div class="step-info">
                                        <h4>Впровадження структури</h4>
                                        <p>Донесення команді</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Впровадження</span>
                                </div>
                            </td>
                            <td class="task-text">Провести впровадження структури для команди</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Статистики та платформа -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Статистики та платформа</td>
                        </tr>

                        <!-- Крок 19 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">20</div>
                                    <div class="step-info">
                                        <h4>Статистики</h4>
                                        <p>Довідник метрик</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI Статистики</span>
                                </div>
                            </td>
                            <td class="task-text">Пройти асистента "Статистики" та створити довідник</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 20 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">21</div>
                                    <div class="step-info">
                                        <h4>Платформа: Структура</h4>
                                        <p>Освоєння модуля</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Структура</span>
                                </div>
                            </td>
                            <td class="task-text">Освоїти платформу "Структура"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 21 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">22</div>
                                    <div class="step-info">
                                        <h4>Платформа: Статистики</h4>
                                        <p>Освоєння модуля</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Статистики</span>
                                </div>
                            </td>
                            <td class="task-text">Освоїти платформу "Статистики"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 22 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">23</div>
                                    <div class="step-info">
                                        <h4>Платформа: Таск-трекер</h4>
                                        <p>Освоєння модуля</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Таски</span>
                                </div>
                            </td>
                            <td class="task-text">Освоїти платформу "Таск-трекер"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Вузьке місце та таски -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Вузьке місце та практика</td>
                        </tr>

                        <!-- Крок 23 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">24</div>
                                    <div class="step-info">
                                        <h4>Аналіз вузького місця</h4>
                                        <p>Знаходження проблеми</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    </div>
                                    <span class="tool-name">Аналіз</span>
                                </div>
                            </td>
                            <td class="task-text">Провести аналіз вузького місця бізнесу</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 24 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">25</div>
                                    <div class="step-info">
                                        <h4>План вузького місця</h4>
                                        <p>Розпорядження</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">План</span>
                                </div>
                            </td>
                            <td class="task-text">Скласти план вузького місця та розбити на розпорядження</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 25 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">26</div>
                                    <div class="step-info">
                                        <h4>Розпорядження в таски</h4>
                                        <p>Внесення в систему</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Таски</span>
                                </div>
                            </td>
                            <td class="task-text">Внести розпорядження в таск-трекер</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 26 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">27</div>
                                    <div class="step-info">
                                        <h4>Додати співробітника</h4>
                                        <p>В таск-трекер</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Таски</span>
                                </div>
                            </td>
                            <td class="task-text">Додати співробітника в таск-трекер</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    15 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 27 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">28</div>
                                    <div class="step-info">
                                        <h4>Створити 4 функції</h4>
                                        <p>В таск-трекері</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Таски</span>
                                </div>
                            </td>
                            <td class="task-text">Створити 4 функції в таск-трекері</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 28 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">29</div>
                                    <div class="step-info">
                                        <h4>Регулярні завдання</h4>
                                        <p>Додати в таск-трекер</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon platform">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    </div>
                                    <span class="tool-name">TALKO Таски</span>
                                </div>
                            </td>
                            <td class="task-text">Додати кілька регулярних завдань до таск-трекера</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Журнал управлінських збоїв -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Журнал управлінських збоїв</td>
                        </tr>

                        <!-- Крок 29 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">30</div>
                                    <div class="step-info">
                                        <h4>AI: Журнал збоїв</h4>
                                        <p>Розбір системи</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Журнал управлінських збоїв"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 30 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">31</div>
                                    <div class="step-info">
                                        <h4>Excel: Журнал збоїв</h4>
                                        <p>Створення таблиці</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon excel">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Excel</span>
                                </div>
                            </td>
                            <td class="task-text">Створити Excel-таблицю журналу збоїв (дати в рядках, параметри в колонках)</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 31 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">32</div>
                                    <div class="step-info">
                                        <h4>Впровадження: Журнал</h4>
                                        <p>Щоденне ведення</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon team">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="tool-name">Впровадження</span>
                                </div>
                            </td>
                            <td class="task-text">Впровадити щоденне ведення журналу управлінських збоїв</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>
                        <!-- ========================================== -->
                        <!-- ФАЗА 2: НАЙМ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                                    Фаза 2: Найм
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Створення пропозицій -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Створення пропозицій — оффери, від яких не відмовляються</td>
                        </tr>

                        <!-- Крок 29 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">33</div>
                                    <div class="step-info">
                                        <h4>AI: Створення пропозицій</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Створення пропозицій"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 30 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">34</div>
                                    <div class="step-info">
                                        <h4>Документ: Пропозиції</h4>
                                        <p>Створення офферів</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документ з пропозиціями/офферами</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Формування заявки -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Формування заявки — правильне формулювання потреби</td>
                        </tr>

                        <!-- Крок 32 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">35</div>
                                    <div class="step-info">
                                        <h4>AI: Формування заявки</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Формування заявки"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 33 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">36</div>
                                    <div class="step-info">
                                        <h4>Документ: Заявка</h4>
                                        <p>Шаблон заявки</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документ/шаблон заявки на найм</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Опис функції -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Опис функції — що саме робитиме людина</td>
                        </tr>

                        <!-- Крок 35 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">37</div>
                                    <div class="step-info">
                                        <h4>AI: Опис функції</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Опис функції"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 36 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">38</div>
                                    <div class="step-info">
                                        <h4>Документ: Опис функції</h4>
                                        <p>Посадові інструкції</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документи з описом функцій/посад</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Утримання співробітників -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Утримання співробітників — як зробити, щоб не звільнялися</td>
                        </tr>

                        <!-- Крок 38 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">39</div>
                                    <div class="step-info">
                                        <h4>AI: Утримання</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Утримання співробітників"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 39 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">40</div>
                                    <div class="step-info">
                                        <h4>Документ: Утримання</h4>
                                        <p>Політика утримання</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документ з політикою утримання</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Співбесіда та випробування -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Співбесіда та випробування — структурований відбір та тестування</td>
                        </tr>

                        <!-- Крок 41 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">41</div>
                                    <div class="step-info">
                                        <h4>AI: Співбесіда</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Співбесіда та випробування"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 42 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">42</div>
                                    <div class="step-info">
                                        <h4>Документ: Співбесіда</h4>
                                        <p>Чек-лист та тести</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити чек-лист співбесіди та тестові завдання</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Система наставництва -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Система наставництва — підтримка нового співробітника</td>
                        </tr>

                        <!-- Крок 44 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">43</div>
                                    <div class="step-info">
                                        <h4>AI: Наставництво</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Система наставництва"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 45 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">44</div>
                                    <div class="step-info">
                                        <h4>Документ: Наставництво</h4>
                                        <p>Програма менторства</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документ з програмою наставництва</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Онбордінг + AI -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок: Онбордінг + AI-асистент — автоматизація введення в посаду</td>
                        </tr>

                        <!-- Крок 47 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">45</div>
                                    <div class="step-info">
                                        <h4>AI: Онбордінг</h4>
                                        <p>Розбір асистента</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI Онбордінг</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати AI-асистента "Онбордінг"</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 48 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">46</div>
                                    <div class="step-info">
                                        <h4>Документ: Онбордінг</h4>
                                        <p>Програма введення</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документ з програмою онбордінгу</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 3: ФІНАНСИ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    Фаза 3: Фінанси
                                </div>
                            </td>
                        </tr>

                        <!-- Крок 50 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">47</div>
                                    <div class="step-info">
                                        <h4>Бізнес-калькулятор</h4>
                                        <p>Перевірка фін. цілі</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/></svg>
                                    </div>
                                    <span class="tool-name">AI Калькулятор</span>
                                </div>
                            </td>
                            <td class="task-text">Перевірка реальності твоєї фінансової цілі</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 51 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">48</div>
                                    <div class="step-info">
                                        <h4>Аналіз ніші</h4>
                                        <p>Перевірка потенціалу</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Проаналізувати чи можна на цій ніші заробити заплановану суму грошей</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 52 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">49</div>
                                    <div class="step-info">
                                        <h4>Три кити контролю</h4>
                                        <p>P&L, Cash Flow, Баланс</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">P&L, Cash Flow, Баланс — основа фінансової грамотності</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 53 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">50</div>
                                    <div class="step-info">
                                        <h4>7 департаментів</h4>
                                        <p>Контроль витрат</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Прив'язати витрати до департаментів та функцій бізнесу</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 54 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">51</div>
                                    <div class="step-info">
                                        <h4>Excel: Витрати</h4>
                                        <p>Файл департаментів</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon excel">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Excel</span>
                                </div>
                            </td>
                            <td class="task-text">Створити файл Excel з витратами, департаментами та функціями</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 55 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">52</div>
                                    <div class="step-info">
                                        <h4>Бенчмарки по нішах</h4>
                                        <p>Еталонні % витрат</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Еталонні % витрат для різних типів бізнесу</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    15 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 56 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">53</div>
                                    <div class="step-info">
                                        <h4>Тренажер витрат</h4>
                                        <p>Заповнення таблиці</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon excel">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Тренажер</span>
                                </div>
                            </td>
                            <td class="task-text">Заповни таблицю витрат для свого бізнесу</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 4: МАРКЕТИНГ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                    Фаза 4: Маркетинг (Реклама → Сайт → Бот → Фільтрація → Діалог → Консультація → Продаж → Аналітика)
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Основа і контроль -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Основа і контроль — чітка ціль, метрики, де зливаються гроші</td>
                        </tr>

                        <!-- Крок 53 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">54</div>
                                    <div class="step-info">
                                        <h4>AI: Основа маркетингу</h4>
                                        <p>Ціль та метрики</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: чітка ціль маркетингу, правильні метрики, де зливаються гроші</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 54 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">55</div>
                                    <div class="step-info">
                                        <h4>Документ: Ціль маркетингу</h4>
                                        <p>Метрики та контроль</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити документ: ціль маркетингу, ключові метрики, точки контролю</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Офер і тексти -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: Офер і тексти, які продають — сильний офер, фільтрація нецільових</td>
                        </tr>

                        <!-- Крок 55 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">56</div>
                                    <div class="step-info">
                                        <h4>AI: Офер та тексти</h4>
                                        <p>Що продає</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: сильний офер під нішу, тексти що фільтрують, AI як інструмент</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 56 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">57</div>
                                    <div class="step-info">
                                        <h4>Документ: Офер</h4>
                                        <p>Тексти для реклами</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити офер та рекламні тексти, які фільтрують нецільових</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Сайт -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 3: Сайт, який не зливає трафік — лендінг, логіка дії, інтеграція</td>
                        </tr>

                        <!-- Крок 57 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">58</div>
                                    <div class="step-info">
                                        <h4>AI: Структура сайту</h4>
                                        <p>Лендінг що конвертує</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: простий лендінг, логіка що веде до дії, інтеграція з ботом</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 58 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">59</div>
                                    <div class="step-info">
                                        <h4>Документ: ТЗ на сайт</h4>
                                        <p>Структура лендінгу</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити ТЗ на лендінг: структура, тексти, інтеграції</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Telegram-воронка -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 4: Telegram-воронка і бот — автовідбір, кваліфікація, мінус 80% рутини</td>
                        </tr>

                        <!-- Крок 59 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">60</div>
                                    <div class="step-info">
                                        <h4>AI: Telegram-воронка</h4>
                                        <p>Бот та кваліфікація</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: автовідбір клієнтів, кваліфікаційні питання, прогрів</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 60 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">61</div>
                                    <div class="step-info">
                                        <h4>Документ: ТЗ на бот</h4>
                                        <p>Логіка воронки</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити ТЗ на Telegram-бот: логіка воронки, питання, повідомлення</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Реклама -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 5: Реклама без хаосу — схема запуску, контроль бюджету, стабільні заявки</td>
                        </tr>

                        <!-- Крок 61 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">62</div>
                                    <div class="step-info">
                                        <h4>AI: Запуск реклами</h4>
                                        <p>Схема без зливів</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: схема запуску реклами, контроль бюджету, відмова від зливів</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 62 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">63</div>
                                    <div class="step-info">
                                        <h4>Документ: План реклами</h4>
                                        <p>Бюджет та контроль</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити план запуску реклами: бюджет, етапи, точки контролю</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Продажі в переписці -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 6: Продажі в переписці — шаблони, структура консультації, даунсел</td>
                        </tr>

                        <!-- Крок 63 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">64</div>
                                    <div class="step-info">
                                        <h4>AI: Продажі в переписці</h4>
                                        <p>Шаблони та скрипти</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: шаблони переписок, структура консультації, даунсел</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 64 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">65</div>
                                    <div class="step-info">
                                        <h4>Документ: Скрипти продажів</h4>
                                        <p>Шаблони переписок</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити скрипти продажів в переписці та структуру консультації</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Аналітика -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 7: Аналітика і масштабування — ключові цифри, звіти, точки росту</td>
                        </tr>

                        <!-- Крок 65 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">66</div>
                                    <div class="step-info">
                                        <h4>AI: Аналітика</h4>
                                        <p>Ключові цифри</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: ключові цифри, аналіз воронки, точки росту без збільшення бюджету</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 66 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">67</div>
                                    <div class="step-info">
                                        <h4>Excel: Звіти маркетингу</h4>
                                        <p>Шаблони аналітики</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon excel">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                                    </div>
                                    <span class="tool-name">Excel</span>
                                </div>
                            </td>
                            <td class="task-text">Створити Excel-шаблони звітів маркетингу та аналізу воронки</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 5: ДЕЛЕГУВАННЯ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                                    Фаза 5: Делегування
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Етапи делегування -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Етапи делегування — розуміння процесу передачі функцій</td>
                        </tr>

                        <!-- Крок 68 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">68</div>
                                    <div class="step-info">
                                        <h4>AI: Етапи делегування</h4>
                                        <p>Послідовність кроків</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати етапи делегування: від підготовки до повної передачі функції</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 69 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">69</div>
                                    <div class="step-info">
                                        <h4>Документ: Етапи</h4>
                                        <p>Чек-лист делегування</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити чек-лист етапів делегування для використання</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Опис функції -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: Опис функції — що робить людина на посаді</td>
                        </tr>

                        <!-- Крок 70 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">70</div>
                                    <div class="step-info">
                                        <h4>AI: Опис функції</h4>
                                        <p>Структура та зміст</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: що таке опис функції, з чого складається, як писати</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Бізнес-процес та направляюча форма -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 3: Бізнес-процес та направляюча форма — алгоритми роботи</td>
                        </tr>

                        <!-- Крок 71 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">71</div>
                                    <div class="step-info">
                                        <h4>AI: Бізнес-процес</h4>
                                        <p>Направляюча форма</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: що таке опис бізнес-процесу, направляюча форма, етапи з продуктами</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Інструкції -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 4: Інструкції — детальні покрокові алгоритми</td>
                        </tr>

                        <!-- Крок 72 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">72</div>
                                    <div class="step-info">
                                        <h4>AI: Інструкції</h4>
                                        <p>Як писати та структурувати</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: що таке інструкція, як правильно писати, рівень деталізації</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Передача функції -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 5: Передача функції — як правильно передати роботу</td>
                        </tr>

                        <!-- Крок 73 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">73</div>
                                    <div class="step-info">
                                        <h4>AI: Передача функції</h4>
                                        <p>Алгоритм передачі</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: як правильно передавати функцію, що підготувати, як контролювати</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Папки співробітника -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 6: Папка штатного співробітника vs Посадова папка</td>
                        </tr>

                        <!-- Крок 74 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">74</div>
                                    <div class="step-info">
                                        <h4>AI: Папка співробітника</h4>
                                        <p>Що містить</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: папка штатного співробітника — що містить, для чого потрібна</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 75 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">75</div>
                                    <div class="step-info">
                                        <h4>AI: Посадова папка</h4>
                                        <p>Різниця та зміст</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: посадова папка — що містить, різниця від папки співробітника</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 76 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">76</div>
                                    <div class="step-info">
                                        <h4>Документ: Шаблони папок</h4>
                                        <p>Структура папок</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити шаблони папки штатного співробітника та посадової папки</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Проведення делегування -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 7: Як провести делегування — практична передача</td>
                        </tr>

                        <!-- Крок 77 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">77</div>
                                    <div class="step-info">
                                        <h4>AI: Проведення делегування</h4>
                                        <p>Практичний алгоритм</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: як провести делегування крок за кроком, що говорити</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Форма ППФ -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 8: Форма ППФ — документ передачі функції</td>
                        </tr>

                        <!-- Крок 78 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">78</div>
                                    <div class="step-info">
                                        <h4>AI: Форма ППФ</h4>
                                        <p>Протокол передачі</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: форма ППФ (протокол передачі функції), як заповнювати</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 79 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">79</div>
                                    <div class="step-info">
                                        <h4>Документ: Форма ППФ</h4>
                                        <p>Шаблон протоколу</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити шаблон форми ППФ для використання при делегуванні</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Місяць координації -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 9: Місяць координації — супровід нової людини на посаді</td>
                        </tr>

                        <!-- Крок 80 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">80</div>
                                    <div class="step-info">
                                        <h4>AI: Місяць координації</h4>
                                        <p>Навіщо та як</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: для чого місяць координувати нову людину, що робити, як контролювати</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 81 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">81</div>
                                    <div class="step-info">
                                        <h4>Документ: План координації</h4>
                                        <p>Чек-лист на місяць</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити план координації на місяць: щоденні/тижневі точки контролю</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 6: СИСТЕМА ПЛАНУВАННЯ ТА КОМУНІКАЦІЇ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    Фаза 6: Система планування та комунікації
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Основи планування -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Основи планування — навіщо і як планувати</td>
                        </tr>

                        <!-- Крок 82 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">82</div>
                                    <div class="step-info">
                                        <h4>AI: Основи планування</h4>
                                        <p>Принципи та підходи</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: основи планування, рівні планів, зв'язок з цілями</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Система комунікації -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: Система комунікації — як спілкуватися в команді</td>
                        </tr>

                        <!-- Крок 83 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">83</div>
                                    <div class="step-info">
                                        <h4>AI: Система комунікації</h4>
                                        <p>Канали та правила</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: канали комунікації, правила спілкування, ескалація проблем</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 84 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">84</div>
                                    <div class="step-info">
                                        <h4>Документ: Політика комунікації</h4>
                                        <p>Правила для команди</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити політику комунікації: канали, час відповіді, формати</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Наради та зустрічі -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 3: Наради та зустрічі — ефективні комунікації</td>
                        </tr>

                        <!-- Крок 85 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">85</div>
                                    <div class="step-info">
                                        <h4>AI: Наради та зустрічі</h4>
                                        <p>Як проводити ефективно</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: типи нарад, структура зустрічі, протоколювання рішень</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 86 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">86</div>
                                    <div class="step-info">
                                        <h4>Документ: Регламент нарад</h4>
                                        <p>Шаблони та правила</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити регламент нарад: типи, частота, шаблон протоколу</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 7: СИСТЕМА КООРДИНАЦІЙ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    Фаза 7: Система координацій
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Що таке координація -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Що таке координація — синхронізація роботи команди</td>
                        </tr>

                        <!-- Крок 87 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">87</div>
                                    <div class="step-info">
                                        <h4>AI: Основи координації</h4>
                                        <p>Навіщо та як</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: що таке координація, відмінність від контролю, роль керівника</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Щоденна координація -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: Щоденна координація — daily standup</td>
                        </tr>

                        <!-- Крок 88 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">88</div>
                                    <div class="step-info">
                                        <h4>AI: Щоденна координація</h4>
                                        <p>Daily standup</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: щоденна координація, формат, питання, тривалість</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    30 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Тижнева координація -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 3: Тижнева координація — weekly review</td>
                        </tr>

                        <!-- Крок 89 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">89</div>
                                    <div class="step-info">
                                        <h4>AI: Тижнева координація</h4>
                                        <p>Weekly review</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: тижнева координація, аналіз результатів, планування тижня</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 90 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">90</div>
                                    <div class="step-info">
                                        <h4>Документ: Система координацій</h4>
                                        <p>Регламент та шаблони</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити систему координацій: щоденна, тижнева, місячна</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 8: СИСТЕМА ТАКТИЧНОГО ПЛАНУВАННЯ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                    Фаза 8: Система тактичного планування
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Тактичне планування -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Основи тактичного планування — місяць/квартал</td>
                        </tr>

                        <!-- Крок 91 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">91</div>
                                    <div class="step-info">
                                        <h4>AI: Тактичне планування</h4>
                                        <p>Місяць та квартал</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: тактичне планування, горизонт місяць/квартал, декомпозиція цілей</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: OKR та KPI -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: OKR та KPI — метрики досягнення</td>
                        </tr>

                        <!-- Крок 92 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">92</div>
                                    <div class="step-info">
                                        <h4>AI: OKR та KPI</h4>
                                        <p>Метрики результатів</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: OKR та KPI, як ставити, як відстежувати, каскадування</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 93 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">93</div>
                                    <div class="step-info">
                                        <h4>Документ: Тактичний план</h4>
                                        <p>Шаблон на квартал</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити шаблон тактичного плану на квартал з OKR</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 9: СТРАТЕГІЧНЕ ПЛАНУВАННЯ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                                    Фаза 9: Стратегічне планування
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Стратегія -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Основи стратегії — бачення на 1-3-5 років</td>
                        </tr>

                        <!-- Крок 94 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">94</div>
                                    <div class="step-info">
                                        <h4>AI: Основи стратегії</h4>
                                        <p>Бачення та місія</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: стратегічне планування, бачення, місія, горизонт 1-3-5 років</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Стратегічний аналіз -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: Стратегічний аналіз — SWOT, конкуренти, ринок</td>
                        </tr>

                        <!-- Крок 95 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">95</div>
                                    <div class="step-info">
                                        <h4>AI: Стратегічний аналіз</h4>
                                        <p>SWOT та ринок</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: SWOT-аналіз, аналіз конкурентів, позиціонування</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 96 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">96</div>
                                    <div class="step-info">
                                        <h4>Документ: Стратегічний план</h4>
                                        <p>План на 1-3 роки</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити стратегічний план: бачення, цілі, ключові ініціативи</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    90 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- ========================================== -->
                        <!-- ФАЗА 10: АВТОМАТИЗАЦІЯ -->
                        <!-- ========================================== -->
                        <tr class="phase-row">
                            <td colspan="7">
                                <div class="phase-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    Фаза 10: Автоматизація
                                </div>
                            </td>
                        </tr>

                        <!-- Підфаза: Основи автоматизації -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 1: Основи автоматизації — що і навіщо автоматизувати</td>
                        </tr>

                        <!-- Крок 97 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">97</div>
                                    <div class="step-info">
                                        <h4>AI: Основи автоматизації</h4>
                                        <p>Що автоматизувати</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: що варто автоматизувати, пріоритети, ROI автоматизації</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: AI в бізнесі -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 2: AI в бізнесі — практичне застосування</td>
                        </tr>

                        <!-- Крок 98 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">98</div>
                                    <div class="step-info">
                                        <h4>AI: AI в бізнесі</h4>
                                        <p>Практичні кейси</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: AI для бізнесу, чат-боти, асистенти, генерація контенту</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Підфаза: Інтеграції та автоматизації -->
                        <tr class="subphase-row">
                            <td colspan="7">Блок 3: Інтеграції — з'єднання систем</td>
                        </tr>

                        <!-- Крок 99 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">99</div>
                                    <div class="step-info">
                                        <h4>AI: Інтеграції</h4>
                                        <p>З'єднання систем</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon ai">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>
                                    </div>
                                    <span class="tool-name">AI-асистент</span>
                                </div>
                            </td>
                            <td class="task-text">Розібрати: інтеграції між системами, Zapier, Make, API</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    45 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                        <!-- Крок 100 -->
                        <tr>
                            <td>
                                <div class="step-cell">
                                    <div class="step-number">100</div>
                                    <div class="step-info">
                                        <h4>Документ: План автоматизації</h4>
                                        <p>Roadmap впровадження</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-waiting">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Очікує
                                </span>
                            </td>
                            <td>
                                <div class="tool-cell">
                                    <div class="tool-icon doc">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span class="tool-name">Документ</span>
                                </div>
                            </td>
                            <td class="task-text">Створити план автоматизації: пріоритети, інструменти, терміни</td>
                            <td class="date-cell">
                                <input type="date" class="date-input">
                            </td>
                            <td>
                                <div class="time-cell">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    60 хв
                                </div>
                            </td>
                            <td class="comment-cell empty">—</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    </div>
        </div>`;
    };



    // ── Mark complete ─────────────────────────────────────────
    window._toggleLearningComplete = function(moduleId, done) {
        if (!learningProgress[moduleId]) learningProgress[moduleId] = {};
        learningProgress[moduleId].completed = done;
        updateModulesFromLearningProgress();
        saveLearningProgress();
        window._openLearningModule(moduleId);
    };

    // ── Save homework ─────────────────────────────────────────
    window._saveLearningHomework = function(moduleId) {
        const ta = document.getElementById('learningHwTextarea');
        if (!ta) return;
        if (!learningProgress[moduleId]) learningProgress[moduleId] = {};
        learningProgress[moduleId].homeworkText = ta.value;
        learningProgress[moduleId].homeworkDone = ta.value.trim().length > 0;
        saveLearningProgress();
        window._openLearningModule(moduleId);
    };

    // ── Init (called when tab opens) ──────────────────────────
    window.initLearning = function() {
        loadLearningProgress();
    };

    // ── Re-render on tab switch ───────────────────────────────
    window.renderLearning = renderLearning;

    // ── AI Assistant block ───────────────────────────────────
        window.learningCourseData = learningCourseData;

window._openAIAssistant = function(moduleTitle, homeworkText) {
        const prompt = `У мене завдання з програми навчання TALKO:\n\nМодуль: ${moduleTitle}\n${homeworkText ? 'Домашнє завдання: ' + homeworkText + '\n' : ''}\nЯк мені це виконати? Проведи мене крок за кроком.`;
        navigator.clipboard.writeText(prompt).catch(() => {});
        window.open(AI_ASSISTANT_URL, '_blank');
    };

    function renderAIBlock(module, isRu) {
        const title = isRu ? (module.title_ru || module.title) : module.title;
        const hwRaw = isRu ? (module.homework_ru || module.homework || '') : (module.homework || '');
        // Витягуємо тільки текст з <li> елементів, ігноруємо заголовки блоку
        const hwItems = [];
        const liMatches = hwRaw.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
        liMatches.forEach(li => hwItems.push(li.replace(/<[^>]*>/g, '').trim()));
        const hw = hwItems.length ? hwItems.join('; ') : hwRaw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
        const prompt = isRu
            ? `У меня задание из программы обучения TALKO:\n\nМодуль: ${title}\n${hw ? 'Домашнее задание: ' + hw + '\n' : ''}\nКак мне это выполнить? Проведи меня шаг за шагом.`
            : `У мене завдання з програми навчання TALKO:\n\nМодуль: ${title}\n${hw ? 'Домашнє завдання: ' + hw + '\n' : ''}\nЯк мені це виконати? Проведи мене крок за кроком.`;
        const btnText = isRu ? 'Запитати AI асистента' : 'Запитати AI асистента';
        const descText = isRu
            ? 'Зайдіть в AI асистента, натисніть кнопку нижче — промпт скопіюється автоматично. Вставте його в чат і асистент проведе вас через виконання.'
            : 'Зайдіть в AI асистента, натисніть кнопку нижче — промпт скопіюється автоматично. Вставте його в чат і асистент проведе вас через виконання.';
        return `
        <div class="l-ai-block">
            <div class="l-ai-block-header">
                <div class="l-ai-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" width="26" height="26"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M12 15h.01M16 15h.01"/></svg></div>
                <div>
                    <div class="l-ai-title">AI Технічний провідник</div>
                    <div class="l-ai-desc">${descText}</div>
                </div>
            </div>
            <div class="l-ai-prompt-preview">${prompt.replace(/\\n/g,'<br>').replace(/\n/g,'<br>')}</div>
            <button class="l-ai-btn" onclick="navigator.clipboard.writeText(\`${prompt}\`).catch(()=>{});window.open('${AI_ASSISTANT_URL}','_blank')">
                ${btnText} →
            </button>
        </div>`;
    }


    window._openLearningModule = function(moduleId) {
        const module = learningCourseData.find(m => m.id === moduleId);
        if (!module) return;
        currentLearningModule = module;
        const isRu = getLearningLang() === 'ru';

        const title = isRu ? (module.title_ru || module.title) : module.title;
        const subtitle = isRu ? (module.subtitle_ru || module.subtitle || '') : (module.subtitle || '');
        const content = isRu ? (module.lessonContent_ru || module.lessonContent || '') : (module.lessonContent || '');
        const isCompleted = module.completed;
        const hwText = (learningProgress[moduleId] || {}).homeworkText || '';
        const hwDone = (learningProgress[moduleId] || {}).homeworkDone || false;

        const root = document.getElementById('learningTab');
        root.innerHTML = `
        <div class="learning-wrap">
            <div class="learning-module-nav">
                <button class="l-back-btn" onclick="window._closeLearningModule()">
                    <i data-lucide="arrow-left" class="icon" style="width:18px;height:18px;"></i>
                    ${isRu ? 'Назад' : 'Назад'}
                </button>

            </div>

            <div class="l-module-detail">
                <div class="l-detail-header">
                    <div class="l-detail-num">${moduleId}</div>
                    <div>
                        <div class="l-detail-title">${title}</div>
                        ${subtitle ? `<div class="l-detail-subtitle">${subtitle}</div>` : ''}
                        ${module.time ? `<div class="l-module-time" style="margin-top:4px;"><i data-lucide="clock" class="icon" style="width:12px;height:12px;"></i> ${module.time} хв</div>` : ''}
                    </div>
                </div>

                ${module.videoLink ? `
                <div class="l-links-row">
                    <a href="${module.videoLink}" target="_blank" class="l-link-btn video">
                        <i data-lucide="play-circle" class="icon" style="width:16px;height:16px;"></i>
                        ${isRu ? 'Видео' : 'Відео'}
                    </a>
                    ${module.materialsLink ? `<a href="${module.materialsLink}" target="_blank" class="l-link-btn materials">
                        <i data-lucide="file-text" class="icon" style="width:16px;height:16px;"></i>
                        ${isRu ? 'Материалы' : 'Матеріали'}
                    </a>` : ''}
                </div>` : ''}

                <!-- Lesson content -->
                <div class="l-lesson-content">
                    ${content}
                </div>

                <!-- AI Assistant block — disabled globally -->

                <!-- Homework block -->
                ${module.homework ? (() => {
                    const hwHtml = isRu ? (module.homework_ru || module.homework) : module.homework;
                    const liItems2 = [];
                    const liM = hwHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
                    liM.forEach(li => liItems2.push(li.replace(/<[^>]*>/g, '').trim()));
                    const hwLinkUrl = module.homeworkLink || null;
                    const hwLinkName = isRu ? (module.homeworkLinkName_ru || module.homeworkLinkName || '') : (module.homeworkLinkName || '');
                    return `
                <div class="l-homework-block">
                    <div class="l-homework-title">
                        <i data-lucide="pencil" class="icon" style="width:16px;height:16px;color:#f59e0b;"></i>
                        ${isRu ? 'Домашнее задание' : 'Домашнє завдання'}
                    </div>
                    ${liItems2.length
                        ? `<ol style="margin:0.5rem 0 0.75rem 1.2rem;padding:0;color:#374151;font-size:0.9rem;line-height:1.7;">${liItems2.map(t => `<li>${t}</li>`).join('')}</ol>`
                        : `<div class="l-homework-desc">${hwHtml}</div>`
                    }
                    ${hwLinkUrl ? `<a href="${hwLinkUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.5rem 1rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:10px;font-size:0.875rem;color:#16a34a;text-decoration:none;font-weight:600;margin-bottom:0.75rem;">${hwLinkName || '→ AI-асистент'}</a>` : ''}
                    <textarea class="l-homework-textarea" id="learningHwTextarea" placeholder="${isRu ? 'Введите ваш ответ...' : 'Введіть вашу відповідь...'}">${hwText}</textarea>
                    <div class="l-homework-actions">
                        ${hwDone ? `<span class="l-hw-done-badge"><i data-lucide="check" class="icon" style="width:14px;height:14px;"></i> ${isRu ? 'Выполнено' : 'Виконано'}</span>` : ''}
                        <button class="l-btn-save-hw" onclick="window._saveLearningHomework(${moduleId})">
                            ${isRu ? 'Сохранить' : 'Зберегти'}
                        </button>
                    </div>
                </div>`;
                })() : ''}

                <!-- Complete button -->
                <div class="l-complete-row">
                    ${isCompleted
                        ? `<button class="l-btn-completed" onclick="window._toggleLearningComplete(${moduleId}, false)">
                            <i data-lucide="check-circle" class="icon" style="width:18px;height:18px;"></i>
                            ${isRu ? 'Пройден ✓' : 'Пройдено ✓'}
                           </button>`
                        : `<button class="l-btn-complete" onclick="window._toggleLearningComplete(${moduleId}, true)">
                            ${isRu ? 'Отметить как пройденный' : 'Позначити як пройдений'}
                           </button>`
                    }
                </div>
            </div>
        </div>`;

        if (window.refreshIcons) window.refreshIcons();
    };

    // ── Back ──────────────────────────────────────────────────
    window._closeLearningModule = function() {
        currentLearningModule = null;
        renderLearning();
    };




})(); // END IIFE
