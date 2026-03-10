// ============================================================
// 93-sites-list.js — TALKO Sites v1.0
// Список сайтів компанії + створення + видалення
// Firestore: companies/{id}/sites/{siteId}
// ============================================================
(function () {
'use strict';

let sl = {
    sites:   [],
    unsub:   null,
    loading: true,
};

// ── Init ───────────────────────────────────────────────────
window.initSitesModule = async function () {
    if (!window.currentCompanyId) return;
    _renderShell();
    _loadSites();
};

function _renderShell() {
    const c = document.getElementById('sitesContainer');
    if (!c) return;
    c.innerHTML = `
    <div style="padding:0.75rem;">
        <!-- Хедер -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
            <div>
                <div style="font-weight:700;font-size:1rem;color:#1a1a1a;">Мої сайти</div>
                <div style="font-size:0.72rem;color:#9ca3af;">Лендінги, форми, аналітика</div>
            </div>
            <button onclick="sitesOpenCreate()"
                style="padding:0.5rem 1rem;background:#22c55e;color:white;border:none;
                border-radius:10px;cursor:pointer;font-weight:700;font-size:0.82rem;
                display:flex;align-items:center;gap:0.4rem;box-shadow:0 2px 8px rgba(34,197,94,0.3);">
                + Новий сайт
            </button>
        </div>
        <div id="sitesList"></div>
    </div>`;
}

function _loadSites() {
    if (sl.unsub) sl.unsub();
    const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);
    sl.unsub = base.collection('sites').orderBy('createdAt', 'desc')
        .onSnapshot(snap => {
            sl.sites   = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            sl.loading = false;
            _renderList();
        }, err => {
            console.error('[Sites]', err);
            sl.loading = false;
            _renderList();
        });
}

// ── Список сайтів ──────────────────────────────────────────
function _renderList() {
    const c = document.getElementById('sitesList');
    if (!c) return;

    if (sl.loading) {
        c.innerHTML = '<div style="text-align:center;padding:3rem;color:#9ca3af;">Завантаження...</div>';
        return;
    }

    if (sl.sites.length === 0) {
        c.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
            <div style="font-size:3rem;margin-bottom:0.75rem;">🌐</div>
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:0.35rem;">Сайтів ще немає</div>
            <div style="font-size:0.8rem;color:#6b7280;margin-bottom:1.25rem;">
                Створи перший лендінг за 30 хвилин без коду
            </div>
            <button onclick="sitesOpenCreate()"
                style="padding:0.6rem 1.5rem;background:#22c55e;color:white;border:none;
                border-radius:10px;cursor:pointer;font-weight:700;font-size:0.85rem;">
                Створити сайт
            </button>
        </div>`;
        return;
    }

    c.innerHTML = `
    <!-- Статистика -->
    <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap;">
        ${[
            ['Всього сайтів', sl.sites.length, '#374151'],
            ['Опублікованих', sl.sites.filter(s=>s.status==='published').length, '#22c55e'],
            ['Чернеток', sl.sites.filter(s=>s.status!=='published').length, '#9ca3af'],
        ].map(([l,v,col]) => `
        <div style="flex:1;min-width:90px;background:white;border-radius:12px;
            padding:0.6rem 0.75rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);border-top:3px solid ${col};">
            <div style="font-size:1rem;font-weight:700;color:${col};">${v}</div>
            <div style="font-size:0.67rem;color:#9ca3af;">${l}</div>
        </div>`).join('')}
    </div>

    <!-- Картки сайтів -->
    <div style="display:flex;flex-direction:column;gap:0.6rem;">
        ${sl.sites.map(site => _siteCard(site)).join('')}
    </div>`;
}

function _siteCard(site) {
    const isPublished = site.status === 'published';
    const blocksCount = (site.blocks || []).length;
    const createdAt   = site.createdAt?.toDate ? site.createdAt.toDate().toLocaleDateString('uk-UA') : '';
    const niche       = site.niche || '';

    const nicheColors = {
        dental: '#3b82f6', construction: '#f97316', legal: '#8b5cf6',
        auto: '#06b6d4', beauty: '#ec4899', fitness: '#22c55e', education: '#f59e0b',
    };
    const nicheColor = nicheColors[site.nicheKey] || '#6b7280';

    return `
    <div style="background:white;border-radius:14px;padding:1rem;
        box-shadow:0 1px 6px rgba(0,0,0,0.07);border:1.5px solid #f1f5f9;
        transition:all 0.15s;"
        onmouseenter="this.style.borderColor='#bbf7d0';this.style.boxShadow='0 4px 14px rgba(34,197,94,0.12)'"
        onmouseleave="this.style.borderColor='#f1f5f9';this.style.boxShadow='0 1px 6px rgba(0,0,0,0.07)'">

        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;">
            <!-- Ліво: info -->
            <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;flex-wrap:wrap;">
                    <span style="font-weight:700;font-size:0.92rem;color:#1a1a1a;">${_esc(site.name || 'Без назви')}</span>
                    <span style="font-size:0.65rem;padding:1px 7px;border-radius:8px;font-weight:600;
                        background:${isPublished ? '#f0fdf4' : '#f9fafb'};
                        color:${isPublished ? '#16a34a' : '#9ca3af'};">
                        ${isPublished ? '● Опублікований' : '○ Чернетка'}
                    </span>
                    ${niche ? `<span style="font-size:0.65rem;padding:1px 7px;border-radius:8px;
                        background:#f1f5f9;color:${nicheColor};font-weight:600;">${_esc(niche)}</span>` : ''}
                </div>

                ${site.description ? `<div style="font-size:0.78rem;color:#6b7280;margin-bottom:0.4rem;
                    overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${_esc(site.description)}</div>` : ''}

                <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
                    <span style="font-size:0.72rem;color:#9ca3af;">📦 ${blocksCount} блоків</span>
                    ${site.visits ? `<span style="font-size:0.72rem;color:#9ca3af;">👁 ${site.visits} відвідувань</span>` : ''}
                    ${site.formSubmissions ? `<span style="font-size:0.72rem;color:#22c55e;font-weight:600;">📋 ${site.formSubmissions} заявок</span>` : ''}
                    ${createdAt ? `<span style="font-size:0.68rem;color:#d1d5db;">${createdAt}</span>` : ''}
                </div>
            </div>

            <!-- Право: кнопки -->
            <div style="display:flex;flex-direction:column;gap:0.35rem;flex-shrink:0;">
                <button onclick="sitesOpenBuilder('${site.id}')"
                    style="padding:0.4rem 0.7rem;background:#22c55e;color:white;border:none;
                    border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700;white-space:nowrap;">
                    ✏️ Редагувати
                </button>
                <button onclick="sitesOpenForms('${site.id}')"
                    style="padding:0.4rem 0.7rem;background:#eff6ff;color:#3b82f6;border:none;
                    border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:600;">
                    📋 Форми
                </button>
                <div style="display:flex;gap:0.3rem;">
                    ${isPublished && site.publicUrl ? `
                    <button onclick="window.open('${_esc(site.publicUrl)}','_blank')"
                        style="flex:1;padding:0.35rem;background:#f0fdf4;color:#16a34a;border:none;
                        border-radius:7px;cursor:pointer;font-size:0.72rem;" title="Відкрити сайт">🔗</button>` : ''}
                    <button onclick="sitesTogglePublish('${site.id}','${site.status}')"
                        style="flex:1;padding:0.35rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;
                        border-radius:7px;cursor:pointer;font-size:0.72rem;" title="${isPublished ? 'Зняти' : 'Опублікувати'}">
                        ${isPublished ? '📴' : '🚀'}
                    </button>
                    <button onclick="sitesDelete('${site.id}','${_esc(site.name || '')}')"
                        style="flex:1;padding:0.35rem;background:#fff5f5;color:#ef4444;border:none;
                        border-radius:7px;cursor:pointer;font-size:0.72rem;" title="Видалити">🗑</button>
                </div>
            </div>
        </div>
    </div>`;
}

// ── Створення сайту ────────────────────────────────────────
window.sitesOpenCreate = function () {
    document.getElementById('sitesCreateOverlay')?.remove();

    const niches = [
        { key: 'dental',       label: '🦷 Стоматологія',  template: 'Dental Pro' },
        { key: 'construction', label: '🏗 Будівництво',    template: 'Build & Repair' },
        { key: 'legal',        label: '⚖️ Юристи',         template: 'Legal Expert' },
        { key: 'auto',         label: '🚗 Авто',           template: 'AutoService' },
        { key: 'beauty',       label: '💆 Краса',          template: 'Beauty Studio' },
        { key: 'fitness',      label: '🏋 Фітнес',         template: 'FitLife' },
        { key: 'education',    label: '📚 Освіта',         template: 'Online Course' },
        { key: 'custom',       label: '✏️ З нуля',         template: null },
    ];

    const inp = 'width:100%;padding:0.5rem 0.6rem;border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.83rem;box-sizing:border-box;font-family:inherit;';

    document.body.insertAdjacentHTML('beforeend', `
    <div id="sitesCreateOverlay" onclick="if(event.target===this)this.remove()"
        style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10030;
        display:flex;align-items:center;justify-content:center;padding:1rem;">
        <div style="background:white;border-radius:16px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;">
            <div style="padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;
                display:flex;justify-content:space-between;align-items:center;">
                <div style="font-weight:700;font-size:0.95rem;">Новий сайт</div>
                <button onclick="document.getElementById('sitesCreateOverlay').remove()"
                    style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.2rem;">✕</button>
            </div>
            <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                <div>
                    <label style="font-size:0.68rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.3rem;">Назва сайту</label>
                    <input id="sc_name" placeholder="Стоматологія Dr.Іваненко, Ремонт квартир Київ..."
                        style="${inp}" autofocus>
                </div>
                <div>
                    <label style="font-size:0.68rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.3rem;">Опис (необов'язково)</label>
                    <input id="sc_desc" placeholder="Короткий опис для чого цей сайт..."
                        style="${inp}">
                </div>
                <div>
                    <label style="font-size:0.68rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.5rem;">Шаблон (ніша)</label>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;" id="sc_niches">
                        ${niches.map(n => `
                        <div onclick="sitesSelectNiche('${n.key}')" id="scn_${n.key}"
                            style="padding:0.5rem 0.6rem;border:2px solid #e5e7eb;border-radius:10px;
                            cursor:pointer;font-size:0.78rem;font-weight:500;transition:all 0.15s;
                            display:flex;align-items:center;gap:0.4rem;">
                            ${_esc(n.label)}
                        </div>`).join('')}
                    </div>
                </div>
            </div>
            <div style="padding:0.75rem 1.25rem;border-top:1px solid #f1f5f9;display:flex;justify-content:flex-end;gap:0.4rem;">
                <button onclick="document.getElementById('sitesCreateOverlay').remove()"
                    style="padding:0.5rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.82rem;">
                    Скасувати
                </button>
                <button onclick="sitesCreate()"
                    style="padding:0.5rem 1.25rem;background:#22c55e;color:white;border:none;
                    border-radius:8px;cursor:pointer;font-weight:700;font-size:0.82rem;">
                    Створити →
                </button>
            </div>
        </div>
    </div>`);

    document.getElementById('sc_name')?.focus();
};

let _selectedNiche = 'custom';
window.sitesSelectNiche = function (key) {
    _selectedNiche = key;
    document.querySelectorAll('[id^="scn_"]').forEach(el => {
        el.style.borderColor = '#e5e7eb';
        el.style.background  = 'white';
        el.style.color       = '#374151';
    });
    const sel = document.getElementById('scn_' + key);
    if (sel) {
        sel.style.borderColor = '#22c55e';
        sel.style.background  = '#f0fdf4';
        sel.style.color       = '#16a34a';
    }
};

window.sitesCreate = async function () {
    const name = document.getElementById('sc_name')?.value.trim();
    if (!name) { alert('Введіть назву сайту'); return; }
    const desc = document.getElementById('sc_desc')?.value.trim() || '';

    const nicheTemplates = {
        dental:       { niche: 'Стоматологія',  blocks: ['hero','benefits','services','team','reviews','form'] },
        construction: { niche: 'Будівництво',   blocks: ['hero','services','gallery','reviews','form'] },
        legal:        { niche: 'Юристи',        blocks: ['hero','services','team','faq','form'] },
        auto:         { niche: 'Авто',          blocks: ['hero','services','prices','reviews','form'] },
        beauty:       { niche: 'Краса',         blocks: ['hero','services','team','portfolio','form'] },
        fitness:      { niche: 'Фітнес',        blocks: ['hero','programs','team','prices','form'] },
        education:    { niche: 'Освіта',        blocks: ['hero','program','about','reviews','prices','form'] },
        custom:       { niche: '',              blocks: ['hero'] },
    };

    const tmpl  = nicheTemplates[_selectedNiche] || nicheTemplates.custom;
    const blocks = tmpl.blocks.map((type, i) => _defaultBlock(type, i));

    try {
        const db   = firebase.firestore();
        const ref  = await db.collection('companies').doc(window.currentCompanyId)
            .collection('sites').add({
                name, description: desc,
                niche:    tmpl.niche,
                nicheKey: _selectedNiche,
                status:   'draft',
                blocks,
                theme: { primaryColor: '#22c55e', fontFamily: 'Inter', borderRadius: '12px' },
                visits:           0,
                formSubmissions:  0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

        document.getElementById('sitesCreateOverlay')?.remove();
        if (typeof showToast === 'function') showToast('Сайт створено ✓', 'success');

        // Одразу відкриваємо редактор
        sitesOpenBuilder(ref.id);
    } catch (e) {
        alert('Помилка: ' + e.message);
    }
};

function _defaultBlock(type, order) {
    const defaults = {
        hero:     { type:'hero',     order, title:'Заголовок сайту', subtitle:'Підзаголовок з вашою головною перевагою', cta:'Залишити заявку', bgColor:'#0a0f1a', textColor:'#ffffff' },
        benefits: { type:'benefits', order, title:'Наші переваги', items:[
            { icon:'⭐', title:'Перевага 1', text:'Опис першої переваги' },
            { icon:'✅', title:'Перевага 2', text:'Опис другої переваги' },
            { icon:'🏆', title:'Перевага 3', text:'Опис третьої переваги' },
        ]},
        services: { type:'services', order, title:'Наші послуги', items:[
            { title:'Послуга 1', price:'від 500 грн', text:'Короткий опис' },
            { title:'Послуга 2', price:'від 800 грн', text:'Короткий опис' },
            { title:'Послуга 3', price:'від 1200 грн', text:'Короткий опис' },
        ]},
        reviews:  { type:'reviews', order, title:'Відгуки клієнтів', items:[
            { name:'Клієнт 1', rating:5, text:'Дуже задоволений сервісом!' },
            { name:'Клієнт 2', rating:5, text:'Рекомендую всім!' },
        ]},
        faq:      { type:'faq', order, title:'Часті питання', items:[
            { question:'Питання 1?', answer:'Відповідь на питання 1.' },
            { question:'Питання 2?', answer:'Відповідь на питання 2.' },
        ]},
        form:     { type:'form', order, title:'Залишити заявку', subtitle:'Ми зв\'яжемося з вами протягом 15 хвилин', fields:['name','phone'], cta:'Відправити' },
        team:     { type:'team', order, title:'Наша команда', items:[ { name:'Спеціаліст 1', role:'Посада', photo:'' } ]},
        prices:   { type:'prices', order, title:'Ціни', items:[ { title:'Базовий', price:'990 грн', features:['Опція 1','Опція 2'] } ]},
        gallery:  { type:'gallery', order, title:'Наші роботи', items:[] },
        programs: { type:'programs', order, title:'Програми', items:[ { title:'Програма 1', text:'Опис' } ]},
        about:    { type:'about', order, title:'Про автора', text:'Розкажіть про себе', photo:'' },
        portfolio:{ type:'portfolio', order, title:'Портфоліо', items:[] },
    };
    return defaults[type] || { type, order, title: type };
}

// ── Дії з сайтом ──────────────────────────────────────────
window.sitesTogglePublish = async function (siteId, currentStatus) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
        await firebase.firestore()
            .doc('companies/' + window.currentCompanyId + '/sites/' + siteId)
            .update({ status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        if (typeof showToast === 'function')
            showToast(newStatus === 'published' ? '🚀 Сайт опублікований!' : 'Сайт знято з публікації', 'success');
    } catch (e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

window.sitesDelete = async function (siteId, name) {
    if (!confirm('Видалити сайт "' + name + '"?\nВсі блоки та форми будуть видалені.')) return;
    try {
        await firebase.firestore()
            .doc('companies/' + window.currentCompanyId + '/sites/' + siteId).delete();
        if (typeof showToast === 'function') showToast('Сайт видалено', 'success');
    } catch (e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// Переходи в інші модулі (94, 95)
window.sitesOpenBuilder = function (siteId) {
    if (typeof window.initSitesBuilder === 'function') {
        window.initSitesBuilder(siteId);
    } else {
        if (typeof showToast === 'function') showToast('Редактор завантажується...', 'success');
    }
};

window.sitesOpenForms = function (siteId) {
    if (typeof window.initSitesForms === 'function') {
        window.initSitesForms(siteId);
    } else {
        if (typeof showToast === 'function') showToast('Конструктор форм завантажується...', 'success');
    }
};

// ── Helper ─────────────────────────────────────────────────
function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── switchTab hook ─────────────────────────────────────────
const _origST = window.switchTab;
window.switchTab = function (tab) {
    if (_origST) _origST(tab);
    if (tab === 'sites') {
        const btn = document.getElementById('sitesNavBtn');
        if (btn) btn.style.display = '';
        if (!sl.sites.length && !sl.loading) {
            window.initSitesModule();
        } else {
            _renderList();
        }
    }
};

// Показуємо кнопку якщо feature увімкнена
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        if (window.isFeatureEnabled && window.isFeatureEnabled('sites')) {
            const btn = document.getElementById('sitesNavBtn');
            if (btn) btn.style.display = '';
        }
    }, 1500);
});

})();
