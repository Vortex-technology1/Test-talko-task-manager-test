// ============================================================
// 95-sites-forms.js — TALKO Sites Forms v1.0
// Конструктор форм + submissions + → CRM автоматично
// ============================================================
(function () {
'use strict';

let sf = {
    siteId:   null,
    site:     null,
    forms:    [],
    activeFormId: null,
    view:     'list', // list | editor | submissions
};

// ── Init ───────────────────────────────────────────────────
window.initSitesForms = function (siteId) {
    sf.siteId = siteId;
    sf.view   = 'list';
    sf.activeFormId = null;
    _renderFormsShell();
    _loadSiteAndForms();
};

function _renderFormsShell() {
    const c = document.getElementById('sitesContainer');
    if (!c) return;
    c.innerHTML = `
    <div style="padding:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
            <button onclick="window.initSitesModule()"
                style="padding:0.35rem 0.6rem;background:#f9fafb;border:1px solid #e5e7eb;
                border-radius:8px;cursor:pointer;font-size:0.8rem;">← Сайти</button>
            <span id="sfSiteName" style="font-weight:700;font-size:0.9rem;"></span>
            <span style="color:#9ca3af;font-size:0.8rem;">/ Форми</span>
        </div>
        <div id="sfContent"></div>
    </div>`;
}

async function _loadSiteAndForms() {
    try {
        const db = firebase.firestore();
        const siteDoc = await window.companyDoc('sites/' + sf.siteId).get();
        sf.site = { id: siteDoc.id, ...siteDoc.data() };
        const nameEl = document.getElementById('sfSiteName');
        if (nameEl) nameEl.textContent = sf.site.name || 'Сайт';

        const formsSnap = await window.companyDoc('sites/' + sf.siteId).collection('forms')
            .orderBy('createdAt','desc').get();
        sf.forms = formsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        _renderView();
    } catch(e) {
        console.error('[Forms]', e);
        _renderView();
    }
}

function _renderView() {
    if (sf.view === 'list')        _renderFormsList();
    else if (sf.view === 'editor') _renderFormEditor();
    else if (sf.view === 'submissions') _renderSubmissions();
}

// ── Список форм ────────────────────────────────────────────
function _renderFormsList() {
    const c = document.getElementById('sfContent');
    if (!c) return;

    // Кнопка створити + список
    c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <div style="font-size:0.72rem;color:#9ca3af;">${sf.forms.length} форм</div>
        <button onclick="sfOpenCreate()"
            style="padding:0.4rem 0.9rem;background:#22c55e;color:white;border:none;
            border-radius:9px;cursor:pointer;font-weight:700;font-size:0.8rem;">
            + Нова форма
        </button>
    </div>
    ${sf.forms.length === 0 ? `
    <div style="text-align:center;padding:3rem 1rem;background:white;border-radius:14px;
        box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <div style="font-size:2.5rem;margin-bottom:0.5rem;">📋</div>
        <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.3rem;">Форм ще немає</div>
        <div style="font-size:0.78rem;color:#6b7280;margin-bottom:1rem;">
            Кожна форма автоматично відправляє ліда в CRM
        </div>
        <button onclick="sfOpenCreate()"
            style="padding:0.5rem 1.25rem;background:#22c55e;color:white;border:none;
            border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;">
            Створити форму
        </button>
    </div>` : sf.forms.map(form => _formCard(form)).join('')}`;
}

function _formCard(form) {
    const fieldLabels = {name:"Ім'я",phone:'Телефон',email:'Email',message:'Повідомлення',telegram:'Telegram'};
    const fields = (form.fields||[]).map(f => fieldLabels[f]||f).join(', ');
    const submissions = form.submissionsCount || 0;

    return `
    <div style="background:white;border-radius:12px;padding:1rem;
        box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1.5px solid #f1f5f9;margin-bottom:0.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;">
            <div style="flex:1;">
                <div style="font-weight:700;font-size:0.88rem;margin-bottom:0.2rem;">${_esc(form.name||'Форма')}</div>
                <div style="font-size:0.72rem;color:#9ca3af;margin-bottom:0.4rem;">
                    Поля: ${_esc(fields || 'не задані')}
                </div>
                <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                    <span style="font-size:0.72rem;color:#22c55e;font-weight:600;">📥 ${submissions} заявок</span>
                    ${form.crmIntegration ? '<span style="font-size:0.7rem;background:#f0fdf4;color:#16a34a;padding:1px 6px;border-radius:6px;">→ CRM</span>' : ''}
                    ${form.telegramNotify ? '<span style="font-size:0.7rem;background:#eff6ff;color:#3b82f6;padding:1px 6px;border-radius:6px;">→ Telegram</span>' : ''}
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.3rem;flex-shrink:0;">
                <button onclick="sfOpenEditor('${form.id}')"
                    style="padding:0.35rem 0.7rem;background:#22c55e;color:white;border:none;
                    border-radius:7px;cursor:pointer;font-size:0.73rem;font-weight:700;">
                    ✏️ Ред.
                </button>
                <button onclick="sfOpenSubmissions('${form.id}')"
                    style="padding:0.35rem 0.7rem;background:#eff6ff;color:#3b82f6;border:none;
                    border-radius:7px;cursor:pointer;font-size:0.73rem;font-weight:600;">
                    📋 Заявки
                </button>
                <button onclick="sfDelete('${form.id}','${_esc(form.name||'')}')"
                    style="padding:0.35rem 0.7rem;background:#fff5f5;color:#ef4444;border:none;
                    border-radius:7px;cursor:pointer;font-size:0.73rem;">
                    🗑
                </button>
            </div>
        </div>
    </div>`;
}

// ── Створення форми ────────────────────────────────────────
window.sfOpenCreate = function () {
    document.getElementById('sfCreateOverlay')?.remove();
    const inp = 'width:100%;padding:0.45rem 0.55rem;border:1.5px solid #e5e7eb;border-radius:8px;font-size:0.8rem;box-sizing:border-box;font-family:inherit;';
    document.body.insertAdjacentHTML('beforeend', `
    <div id="sfCreateOverlay" onclick="if(event.target===this)this.remove()"
        style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10035;
        display:flex;align-items:center;justify-content:center;padding:1rem;">
        <div style="background:white;border-radius:16px;width:100%;max-width:420px;">
            <div style="padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;
                display:flex;justify-content:space-between;align-items:center;">
                <div style="font-weight:700;font-size:0.9rem;">Нова форма</div>
                <button onclick="document.getElementById('sfCreateOverlay').remove()"
                    style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.2rem;">✕</button>
            </div>
            <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                <div>
                    <label style="font-size:0.67rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.25rem;">Назва форми</label>
                    <input id="sfc_name" placeholder="Запис на консультацію..." style="${inp}" autofocus>
                </div>
                <div>
                    <label style="font-size:0.67rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.35rem;">Поля форми</label>
                    <div style="display:flex;flex-direction:column;gap:0.3rem;">
                        ${[
                            {key:'name', label:"Ім'я", checked:true},
                            {key:'phone',label:'Телефон', checked:true},
                            {key:'email',label:'Email', checked:false},
                            {key:'message',label:'Повідомлення', checked:false},
                            {key:'telegram',label:'Telegram', checked:false},
                        ].map(f => `
                        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;cursor:pointer;
                            padding:0.3rem;border-radius:6px;"
                            onmouseenter="this.style.background='#f9fafb'"
                            onmouseleave="this.style.background='none'">
                            <input type="checkbox" id="sfc_${f.key}" ${f.checked?'checked':''}
                                style="width:15px;height:15px;accent-color:#22c55e;">
                            ${_esc(f.label)}
                        </label>`).join('')}
                    </div>
                </div>
                <div style="border-top:1px solid #f1f5f9;padding-top:0.6rem;">
                    <label style="font-size:0.67rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.35rem;">Інтеграції</label>
                    <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;cursor:pointer;margin-bottom:0.3rem;">
                        <input type="checkbox" id="sfc_crm" checked style="width:15px;height:15px;accent-color:#22c55e;">
                        Автоматично створювати ліда в CRM
                    </label>
                    <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;cursor:pointer;">
                        <input type="checkbox" id="sfc_tg" style="width:15px;height:15px;accent-color:#22c55e;">
                        Сповіщення в Telegram менеджеру
                    </label>
                </div>
            </div>
            <div style="padding:0.75rem 1.25rem;border-top:1px solid #f1f5f9;display:flex;justify-content:flex-end;gap:0.4rem;">
                <button onclick="document.getElementById('sfCreateOverlay').remove()"
                    style="padding:0.45rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.8rem;">
                    Скасувати
                </button>
                <button onclick="sfCreate()"
                    style="padding:0.45rem 1.25rem;background:#22c55e;color:white;border:none;
                    border-radius:8px;cursor:pointer;font-weight:700;font-size:0.8rem;">
                    Створити
                </button>
            </div>
        </div>
    </div>`);
};

window.sfCreate = async function () {
    const name = document.getElementById('sfc_name')?.value.trim();
    if (!name) { if(window.showToast)showToast("Введіть назву форми",'warning'); else alert("Введіть назву форми"); return; }

    const fields = ['name','phone','email','message','telegram']
        .filter(k => document.getElementById('sfc_' + k)?.checked);
    const crmIntegration   = document.getElementById('sfc_crm')?.checked || false;
    const telegramNotify   = document.getElementById('sfc_tg')?.checked  || false;

    try {
        const db  = firebase.firestore();
        const ref = await db
            .collection(window.currentCompanyId + '/sites/' + sf.siteId + '/forms')
            .add({
                name, fields, crmIntegration, telegramNotify,
                cta: 'Відправити',
                title: name,
                subtitle: '',
                submissionsCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        document.getElementById('sfCreateOverlay')?.remove();
        sf.forms.unshift({ id: ref.id, name, fields, crmIntegration, telegramNotify, submissionsCount: 0 });
        if (typeof showToast === 'function') showToast('Форму створено ✓', 'success');
        sfOpenEditor(ref.id);
    } catch(e) { if(window.showToast)showToast('Помилка: ' + e.message,'error'); else alert('Помилка: ' + e.message); }
};

// ── Редактор форми ─────────────────────────────────────────
window.sfOpenEditor = function (formId) {
    sf.activeFormId = formId;
    sf.view = 'editor';
    _renderFormEditor();
};

async function _renderFormEditor() {
    const c = document.getElementById('sfContent');
    if (!c) return;

    let form = sf.forms.find(f => f.id === sf.activeFormId);
    if (!form) {
        try {
            const doc = await firebase.firestore()
                .doc(window.currentCompanyId + '/sites/' + sf.siteId + '/forms/' + sf.activeFormId).get();
            form = { id: doc.id, ...doc.data() };
            sf.forms.push(form);
        } catch(e) { return; }
    }

    const fieldLabels = {name:"Ім'я",phone:'Телефон',email:'Email',message:'Повідомлення',telegram:'Telegram'};
    const inp = 'width:100%;padding:0.45rem 0.55rem;border:1.5px solid #e5e7eb;border-radius:8px;font-size:0.8rem;box-sizing:border-box;font-family:inherit;margin-bottom:0.5rem;';

    c.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
        <button onclick="window._sfGoBack()"
            style="padding:0.3rem 0.6rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:0.78rem;">
            ← Форми
        </button>
        <span style="font-weight:700;font-size:0.88rem;">${_esc(form.name||'Форма')}</span>
    </div>

    <div style="background:white;border-radius:14px;padding:1.25rem;box-shadow:0 1px 6px rgba(0,0,0,0.06);margin-bottom:0.75rem;">
        <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.6rem;">Налаштування форми</div>

        <label style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.2rem;">Назва</label>
        <input id="sfe_name" value="${_esc(form.name||'')}" style="${inp}">

        <label style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.2rem;">Заголовок над формою</label>
        <input id="sfe_title" value="${_esc(form.title||'')}" placeholder="Залишити заявку" style="${inp}">

        <label style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.2rem;">Підзаголовок</label>
        <input id="sfe_subtitle" value="${_esc(form.subtitle||'')}" placeholder="Зв'яжемося за 15 хвилин" style="${inp}">

        <label style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.2rem;">Текст кнопки</label>
        <input id="sfe_cta" value="${_esc(form.cta||'Відправити')}" style="${inp}">
    </div>

    <div style="background:white;border-radius:14px;padding:1.25rem;box-shadow:0 1px 6px rgba(0,0,0,0.06);margin-bottom:0.75rem;">
        <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.6rem;">Поля форми</div>
        ${Object.entries(fieldLabels).map(([key,label]) => `
        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;cursor:pointer;
            padding:0.4rem;border-radius:8px;margin-bottom:0.2rem;"
            onmouseenter="this.style.background='#f9fafb'"
            onmouseleave="this.style.background='none'">
            <input type="checkbox" id="sfe_field_${key}" ${(form.fields||[]).includes(key)?'checked':''}
                style="width:15px;height:15px;accent-color:#22c55e;">
            <span style="flex:1;">${_esc(label)}</span>
            ${key==='name'||key==='phone' ? '<span style="font-size:0.65rem;color:#9ca3af;">рекомендовано</span>' : ''}
        </label>`).join('')}
    </div>

    <div style="background:white;border-radius:14px;padding:1.25rem;box-shadow:0 1px 6px rgba(0,0,0,0.06);margin-bottom:0.75rem;">
        <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.6rem;">Інтеграції</div>
        <label style="display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer;margin-bottom:0.6rem;">
            <input type="checkbox" id="sfe_crm" ${form.crmIntegration?'checked':''}
                style="width:15px;height:15px;accent-color:#22c55e;margin-top:2px;">
            <div>
                <div style="font-size:0.82rem;font-weight:600;">→ Створювати ліда в CRM</div>
                <div style="font-size:0.7rem;color:#9ca3af;">Кожна заявка → новий лід в воронці</div>
            </div>
        </label>
        <label style="display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer;">
            <input type="checkbox" id="sfe_tg" ${form.telegramNotify?'checked':''}
                style="width:15px;height:15px;accent-color:#22c55e;margin-top:2px;">
            <div>
                <div style="font-size:0.82rem;font-weight:600;">→ Сповіщення в Telegram</div>
                <div style="font-size:0.7rem;color:#9ca3af;">Менеджер отримає повідомлення з заявкою</div>
            </div>
        </label>
    </div>

    <button onclick="sfSaveForm('${form.id}')"
        style="width:100%;padding:0.65rem;background:#22c55e;color:white;border:none;
        border-radius:10px;cursor:pointer;font-weight:700;font-size:0.88rem;margin-bottom:0.75rem;">
        💾 Зберегти форму
    </button>

    <!-- Прев'ю форми -->
    <div style="background:white;border-radius:14px;padding:1.25rem;box-shadow:0 1px 6px rgba(0,0,0,0.06);">
        <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.6rem;">Прев'ю</div>
        <div id="sfePreview"></div>
    </div>`;

    // Прев'ю в реальному часі
    ['sfe_name','sfe_title','sfe_subtitle','sfe_cta'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', _sfUpdatePreview);
    });
    Object.keys(fieldLabels).forEach(key => {
        document.getElementById('sfe_field_' + key)?.addEventListener('change', _sfUpdatePreview);
    });
    _sfUpdatePreview();
}

function _sfUpdatePreview() {
    const c = document.getElementById('sfePreview');
    if (!c) return;
    const title    = document.getElementById('sfe_title')?.value || 'Залишити заявку';
    const subtitle = document.getElementById('sfe_subtitle')?.value || '';
    const cta      = document.getElementById('sfe_cta')?.value || 'Відправити';
    const fields   = ['name','phone','email','message','telegram']
        .filter(k => document.getElementById('sfe_field_' + k)?.checked);
    const labels   = {name:"Ім'я",phone:'Телефон',email:'Email',message:'Повідомлення',telegram:'Telegram'};

    c.innerHTML = `
    <div style="background:linear-gradient(135deg,#f0fdf4,#f9fafb);border-radius:10px;padding:1.25rem;text-align:center;">
        <div style="font-size:1rem;font-weight:700;margin-bottom:0.2rem;">${_esc(title)}</div>
        ${subtitle ? `<div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.75rem;">${_esc(subtitle)}</div>` : '<div style="margin-bottom:0.75rem;"></div>'}
        <div style="display:flex;flex-direction:column;gap:0.4rem;max-width:300px;margin:0 auto;">
            ${fields.map(f => `
            <input placeholder="${_esc(labels[f]||f)}" disabled
                style="padding:0.5rem 0.65rem;border:1.5px solid #e5e7eb;border-radius:8px;
                font-size:0.8rem;background:white;width:100%;box-sizing:border-box;">`).join('')}
            <button disabled style="padding:0.55rem;background:#22c55e;color:white;border:none;
                border-radius:8px;font-weight:700;font-size:0.82rem;cursor:default;opacity:0.85;">
                ${_esc(cta)}</button>
        </div>
    </div>`;
}

window.sfSaveForm = async function (formId) {
    const name     = document.getElementById('sfe_name')?.value.trim();
    if (!name) { if(window.showToast)showToast('Введіть назву','warning'); else alert('Введіть назву'); return; }
    const fields = ['name','phone','email','message','telegram']
        .filter(k => document.getElementById('sfe_field_' + k)?.checked);
    const data = {
        name,
        title:           document.getElementById('sfe_title')?.value.trim() || '',
        subtitle:        document.getElementById('sfe_subtitle')?.value.trim() || '',
        cta:             document.getElementById('sfe_cta')?.value.trim() || 'Відправити',
        fields,
        crmIntegration:  document.getElementById('sfe_crm')?.checked || false,
        telegramNotify:  document.getElementById('sfe_tg')?.checked  || false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
        await window.companyRef()
            .collection(window.DB_COLS.SITES).doc( + '/sites/' + sf.siteId + '/forms/' + formId)
            .update(data);
        // Оновлюємо кеш
        const idx = sf.forms.findIndex(f => f.id === formId);
        if (idx >= 0) sf.forms[idx] = { ...sf.forms[idx], ...data };
        if (typeof showToast === 'function') showToast('Форму збережено ✓', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ── Submissions ────────────────────────────────────────────
window._sfGoBack = function() { sf.view = 'list'; _renderView(); };
window.sfOpenSubmissions = async function (formId) {
    sf.activeFormId = formId;
    sf.view = 'submissions';
    const c = document.getElementById('sfContent');
    if (!c) return;

    const form = sf.forms.find(f => f.id === formId);
    c.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
        <button onclick="window._sfGoBack()"
            style="padding:0.3rem 0.6rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:0.78rem;">
            ← Форми
        </button>
        <span style="font-weight:700;font-size:0.88rem;">Заявки: ${_esc(form?.name||'')}</span>
    </div>
    <div id="sfSubmList"><div style="text-align:center;padding:2rem;color:#9ca3af;">Завантаження...</div></div>`;

    try {
        const snap = await firebase.firestore()
            .collection(window.currentCompanyId + '/sites/' + sf.siteId + '/forms/' + formId + '/submissions')
            .orderBy('createdAt','desc').limit(50).get();

        const submissions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const el = document.getElementById('sfSubmList');
        if (!el) return;

        if (!submissions.length) {
            el.innerHTML = `<div style="text-align:center;padding:3rem;background:white;border-radius:14px;">
                <div style="font-size:2rem;margin-bottom:0.5rem;">📭</div>
                <div style="font-weight:700;font-size:0.88rem;">Заявок ще немає</div>
            </div>`;
            return;
        }

        el.innerHTML = `
        <div style="margin-bottom:0.5rem;font-size:0.72rem;color:#9ca3af;">${submissions.length} заявок</div>
        ${submissions.map(sub => {
            const date = sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleString('uk-UA') : '';
            const fields = sub.fields || {};
            return `
            <div style="background:white;border-radius:12px;padding:0.9rem;
                box-shadow:0 1px 4px rgba(0,0,0,0.06);margin-bottom:0.5rem;
                border-left:3px solid #22c55e;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;margin-bottom:0.4rem;">
                    <div style="font-weight:700;font-size:0.85rem;">${_esc(fields.name||fields.phone||'Заявка')}</div>
                    <div style="font-size:0.68rem;color:#9ca3af;flex-shrink:0;">${date}</div>
                </div>
                ${Object.entries(fields).map(([k,v]) => v ? `
                <div style="font-size:0.75rem;color:#374151;margin-bottom:0.15rem;">
                    <span style="color:#9ca3af;">${{name:"Ім'я",phone:'Телефон',email:'Email',message:'Повідомлення',telegram:'Telegram'}[k]||k}:</span>
                    ${_esc(String(v))}
                </div>` : '').join('')}
                ${sub.crmDealId ? `<div style="margin-top:0.4rem;font-size:0.68rem;background:#f0fdf4;color:#16a34a;
                    padding:2px 7px;border-radius:6px;display:inline-block;">✓ Лід в CRM</div>` : ''}
            </div>`;
        }).join('')}`;
    } catch(e) {
        const el = document.getElementById('sfSubmList');
        if (el) el.innerHTML = `<div style="color:#ef4444;font-size:0.8rem;text-align:center;padding:1rem;">Помилка: ${_esc(e.message)}</div>`;
    }
};

// ── Видалення форми ────────────────────────────────────────
window.sfDelete = async function (formId, name) {
    if (!(await (window.showConfirmModal ? showConfirmModal('Видалити форму "' + name + '"?\nВсі заявки будуть видалені.',{danger:true}) : Promise.resolve(confirm('Видалити форму "' + name + '"?\nВсі заявки будуть видалені.'))))) return;
    try {
        await window.companyRef()
            .collection(window.DB_COLS.SITES).doc( + '/sites/' + sf.siteId + '/forms/' + formId).delete();
        sf.forms = sf.forms.filter(f => f.id !== formId);
        if (typeof showToast === 'function') showToast('Форму видалено', 'success');
        _renderFormsList();
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ── Public API: обробка submit з лендінгу ──────────────────
// Виклик: window.sfHandleSubmit(siteId, formId, fields)
window.sfHandleSubmit = async function (siteId, formId, fieldsData) {
    try {
        const db = firebase.firestore();
        const cRef = window.companyRef();
        const formRef = db.doc(base + '/sites/' + siteId + '/forms/' + formId);
        const formDoc = await formRef.get();
        if (!formDoc.exists) return { ok: false, error: 'Form not found' };
        const form = formDoc.data();

        // Зберегти submission
        const submRef = await db
            .collection(base + '/sites/' + siteId + '/forms/' + formId + '/submissions')
            .add({
                fields: fieldsData,
                siteId, formId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

        // +1 до лічильника
        formRef.update({ submissionsCount: firebase.firestore.FieldValue.increment(1) });

        // → CRM: створити ліда
        let crmDealId = null;
        if (form.crmIntegration && typeof window._actionCreateClientAndDeal === 'function') {
            const result = await window._actionCreateClientAndDeal({
                clientName: fieldsData.name || fieldsData.phone || 'Заявка з сайту',
                phone:      fieldsData.phone || '',
                email:      fieldsData.email || '',
                source:     'site_form',
                note:       'Форма: ' + (form.name||'') + '. ' + (fieldsData.message||''),
                leadData:   { mainProblem: fieldsData.message || '' },
            });
            crmDealId = result?.dealId || null;
            if (crmDealId) submRef.update({ crmDealId });
        }

        return { ok: true, submissionId: submRef.id, crmDealId };
    } catch(e) {
        console.error('[Forms Submit]', e);
        return { ok: false, error: e.message };
    }
};

function _esc(s) {
    // Shared via TALKO.utils.esc — local fallback for load order safety
    if (window.TALKO?.utils?.esc) return window.TALKO.utils.esc(s);
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// expose _renderView for inline onclick
window._sfRenderView = function() { _renderView(); };

    // ── TALKO namespace ───────────────────────────────────────
    if (window.TALKO) {
        window.TALKO.sites = Object.assign(window.TALKO.sites||{}, {
            initForms: window.initSitesForms,
            openForms: window.sfOpenEditor,
            saveForm: window.sfSaveForm,
            handleSubmit: window.sfHandleSubmit,
        });
    }

})();
