// ============================================================
// 94-sites-builder.js — TALKO Sites Builder v1.0
// Двоколонний редактор: ліво=панель, право=прев'ю
// ============================================================
(function () {
'use strict';

let sb = {
    siteId:   null,
    site:     null,
    blocks:   [],
    activeBlockIdx: null,
    saving:   false,
    panelTab: 'blocks', // blocks | seo
};

const BLOCK_TYPES = [
    { type:'hero',      icon:'🦸', label:'Hero' },
    { type:'benefits',  icon:'✅', label:'Переваги' },
    { type:'services',  icon:'🛎', label:'Послуги' },
    { type:'reviews',   icon:'⭐', label:'Відгуки' },
    { type:'faq',       icon:'❓', label:'FAQ' },
    { type:'form',      icon:'📋', label:'Форма' },
    { type:'team',      icon:'👥', label:'Команда' },
    { type:'prices',    icon:'💰', label:'Ціни' },
    { type:'gallery',   icon:'🖼', label:'Галерея' },
    { type:'about',     icon:'ℹ️',  label:'Про нас' },
];

// ── Init ───────────────────────────────────────────────────
window.initSitesBuilder = function (siteId) {
    sb.siteId = siteId;
    sb.activeBlockIdx = null;
    _renderBuilderShell();
    _loadSite();
};

function _renderBuilderShell() {
    const c = document.getElementById('sitesContainer');
    if (!c) return;
    c.innerHTML = `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 100px);">
        <!-- Топ хедер -->
        <div style="display:flex;align-items:center;justify-content:space-between;
            padding:0.5rem 0.75rem;background:white;border-bottom:1.5px solid #f1f5f9;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <button onclick="window.initSitesModule()"
                    style="padding:0.35rem 0.6rem;background:#f9fafb;border:1px solid #e5e7eb;
                    border-radius:8px;cursor:pointer;font-size:0.8rem;">← Назад</button>
                <span id="sbSiteName" style="font-weight:700;font-size:0.9rem;color:#1a1a1a;"></span>
                <span id="sbStatusBadge" style="font-size:0.65rem;padding:2px 8px;border-radius:8px;"></span>
            </div>
            <div style="display:flex;gap:0.4rem;">
                <button onclick="sbTogglePreview()"
                    style="padding:0.4rem 0.7rem;background:#f1f5f9;border:none;border-radius:8px;
                    cursor:pointer;font-size:0.78rem;" title="Прев'ю">👁 Прев'ю</button>
                <button onclick="sbSave()"
                    style="padding:0.4rem 1rem;background:#22c55e;color:white;border:none;
                    border-radius:8px;cursor:pointer;font-weight:700;font-size:0.82rem;">
                    💾 Зберегти
                </button>
            </div>
        </div>

        <!-- Двоколонний layout -->
        <div style="display:flex;flex:1;overflow:hidden;">
            <!-- Ліво: панель блоків -->
            <div id="sbPanel" style="width:300px;flex-shrink:0;background:#f9fafb;
                border-right:1.5px solid #f1f5f9;overflow-y:auto;display:flex;flex-direction:column;">

                <!-- Панель табів -->
                <div style="display:flex;border-bottom:1px solid #e5e7eb;background:white;flex-shrink:0;">
                    <button onclick="sbPanelTab('blocks')" id="sbPanelTab_blocks"
                        style="flex:1;padding:0.5rem;background:none;border:none;border-bottom:2px solid #22c55e;
                        cursor:pointer;font-size:0.75rem;font-weight:600;color:#22c55e;">Блоки</button>
                    <button onclick="sbPanelTab('seo')" id="sbPanelTab_seo"
                        style="flex:1;padding:0.5rem;background:none;border:none;border-bottom:2px solid transparent;
                        cursor:pointer;font-size:0.75rem;font-weight:500;color:#6b7280;">SEO & Аналітика</button>
                </div>

                <!-- Панель блоків (blocks tab) -->
                <div id="sbPanelBlocks" style="display:flex;flex-direction:column;flex:1;">

                <!-- Бібліотека блоків -->
                <div style="padding:0.6rem 0.75rem;border-bottom:1px solid #e5e7eb;">
                    <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.4rem;">
                        Додати блок
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
                        ${BLOCK_TYPES.map(bt => `
                        <button onclick="sbAddBlock('${bt.type}')"
                            style="padding:0.3rem 0.5rem;background:white;border:1px solid #e5e7eb;
                            border-radius:7px;cursor:pointer;font-size:0.72rem;display:flex;
                            align-items:center;gap:0.25rem;transition:all 0.1s;"
                            onmouseenter="this.style.borderColor='#22c55e';this.style.background='#f0fdf4'"
                            onmouseleave="this.style.borderColor='#e5e7eb';this.style.background='white'">
                            ${bt.icon} ${bt.label}
                        </button>`).join('')}
                    </div>
                </div>

                <!-- Список блоків сайту -->
                <div style="padding:0.6rem 0.75rem;">
                    <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:0.4rem;">
                        Структура сайту
                    </div>
                    <div id="sbBlockList" style="display:flex;flex-direction:column;gap:0.3rem;"></div>
                </div>

                </div><!-- /sbPanelBlocks -->

                <!-- Редагування блоку -->
                <div id="sbBlockEditor" style="padding:0.75rem;border-top:1.5px solid #e5e7eb;display:none;flex:1;"></div>
            </div>

                <!-- SEO & Analytics panel -->
                <div id="sbPanelSeo" style="display:none;flex-direction:column;flex:1;padding:0.75rem;gap:0.75rem;overflow-y:auto;">
                    <div id="sbSeoContent"></div>
                </div>

            <!-- Право: прев'ю -->
            <div id="sbPreview" style="flex:1;overflow-y:auto;background:#e5e7eb;padding:1rem;">
                <div id="sbPreviewInner"
                    style="max-width:640px;margin:0 auto;background:white;border-radius:12px;
                    overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);min-height:400px;">
                    <div style="text-align:center;padding:3rem;color:#9ca3af;">Завантаження...</div>
                </div>
            </div>
        </div>
    </div>`;
}

async function _loadSite() {
    try {
        const doc = await window.companyRef()
            .collection(window.DB_COLS.SITES).doc( + '/sites/' + sb.siteId).get();
        if (!doc.exists) { (window.showToast && showToast('Сайт не знайдено','warning')); window.initSitesModule(); return; }
        sb.site   = { id: doc.id, ...doc.data() };
        sb.blocks = sb.site.blocks || [];
        _updateHeader();
        _renderBlockList();
        _renderPreview();
    } catch(e) {
        console.error('[Builder]', e);
        if (typeof showToast === 'function') showToast('Помилка завантаження: ' + e.message, 'error');
    }
}

function _updateHeader() {
    const nameEl   = document.getElementById('sbSiteName');
    const statusEl = document.getElementById('sbStatusBadge');
    if (nameEl)   nameEl.textContent = sb.site.name || 'Без назви';
    if (statusEl) {
        const pub = sb.site.status === 'published';
        statusEl.textContent = pub ? '● Опублікований' : '○ Чернетка';
        statusEl.style.background = pub ? '#f0fdf4' : '#f9fafb';
        statusEl.style.color      = pub ? '#16a34a' : '#9ca3af';
    }
}

// ── Список блоків ──────────────────────────────────────────
function _renderBlockList() {
    const c = document.getElementById('sbBlockList');
    if (!c) return;

    if (!sb.blocks.length) {
        c.innerHTML = '<div style="font-size:0.75rem;color:#9ca3af;text-align:center;padding:0.5rem;">Блоків немає</div>';
        return;
    }

    c.innerHTML = sb.blocks.map((block, i) => {
        const bt   = BLOCK_TYPES.find(b => b.type === block.type) || { icon:'📦', label: block.type };
        const active = i === sb.activeBlockIdx;
        return `
        <div onclick="sbSelectBlock(${i})"
            style="display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.5rem;
            background:${active ? '#f0fdf4' : 'white'};border:1.5px solid ${active ? '#22c55e' : '#e5e7eb'};
            border-radius:8px;cursor:pointer;transition:all 0.12s;">
            <span style="font-size:0.85rem;">${bt.icon}</span>
            <span style="flex:1;font-size:0.75rem;font-weight:${active ? '700' : '500'};color:#374151;">
                ${bt.label}${block.title ? ' — ' + _esc(block.title).substring(0,20) : ''}
            </span>
            <div style="display:flex;gap:0.2rem;">
                ${i > 0 ? `<button onclick="event.stopPropagation();sbMoveBlock(${i},-1)"
                    style="padding:1px 4px;background:none;border:none;cursor:pointer;font-size:0.7rem;color:#9ca3af;"
                    title="Вгору">↑</button>` : ''}
                ${i < sb.blocks.length-1 ? `<button onclick="event.stopPropagation();sbMoveBlock(${i},1)"
                    style="padding:1px 4px;background:none;border:none;cursor:pointer;font-size:0.7rem;color:#9ca3af;"
                    title="Вниз">↓</button>` : ''}
                <button onclick="event.stopPropagation();sbRemoveBlock(${i})"
                    style="padding:1px 4px;background:none;border:none;cursor:pointer;font-size:0.7rem;color:#ef4444;"
                    title="Видалити">✕</button>
            </div>
        </div>`;
    }).join('');
}

// ── Вибір/редагування блоку ────────────────────────────────
window.sbSelectBlock = function (idx) {
    sb.activeBlockIdx = idx;
    _renderBlockList();
    _renderBlockEditor(idx);
    _renderPreview();
    // Scroll preview до блоку
    const el = document.getElementById('sbPreviewBlock_' + idx);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'center' });
};

function _renderBlockEditor(idx) {
    const c = document.getElementById('sbBlockEditor');
    if (!c) return;
    const block = sb.blocks[idx];
    if (!block) { c.style.display = 'none'; return; }
    c.style.display = 'block';
    const bt = BLOCK_TYPES.find(b => b.type === block.type) || { icon:'📦', label: block.type };

    const inp = 'width:100%;padding:0.4rem 0.5rem;border:1.5px solid #e5e7eb;border-radius:7px;font-size:0.78rem;box-sizing:border-box;font-family:inherit;margin-bottom:0.4rem;';

    let fields = '';

    if (block.type === 'hero') {
        fields = `
        <div><label style="${lbl}">Заголовок</label>
        <input value="${_esc(block.title||'')}" oninput="sbUpdateBlock(${idx},'title',this.value)" style="${inp}"></div>
        <div><label style="${lbl}">Підзаголовок</label>
        <input value="${_esc(block.subtitle||'')}" oninput="sbUpdateBlock(${idx},'subtitle',this.value)" style="${inp}"></div>
        <div><label style="${lbl}">Кнопка CTA</label>
        <input value="${_esc(block.cta||'')}" oninput="sbUpdateBlock(${idx},'cta',this.value)" style="${inp}"></div>
        <div><label style="${lbl}">Фон</label>
        <input type="color" value="${block.bgColor||'#0a0f1a'}" oninput="sbUpdateBlock(${idx},'bgColor',this.value)"
            style="width:100%;height:32px;border:none;border-radius:7px;cursor:pointer;margin-bottom:0.4rem;"></div>`;
    } else if (block.type === 'form') {
        fields = `
        <div><label style="${lbl}">Заголовок форми</label>
        <input value="${_esc(block.title||'')}" oninput="sbUpdateBlock(${idx},'title',this.value)" style="${inp}"></div>
        <div><label style="${lbl}">Підзаголовок</label>
        <input value="${_esc(block.subtitle||'')}" oninput="sbUpdateBlock(${idx},'subtitle',this.value)" style="${inp}"></div>
        <div><label style="${lbl}">Поля форми</label>
        <div style="display:flex;flex-direction:column;gap:0.3rem;">
            ${['name','phone','email','message','telegram'].map(f => `
            <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;cursor:pointer;">
                <input type="checkbox" ${(block.fields||[]).includes(f)?'checked':''}
                    onchange="sbToggleFormField(${idx},'${f}',this.checked)"
                    style="width:14px;height:14px;accent-color:#22c55e;">
                ${{name:"Ім'я",phone:'Телефон',email:'Email',message:'Повідомлення',telegram:'Telegram'}[f]}
            </label>`).join('')}
        </div></div>
        <div style="margin-top:0.4rem;"><label style="${lbl}">Текст кнопки</label>
        <input value="${_esc(block.cta||'Відправити')}" oninput="sbUpdateBlock(${idx},'cta',this.value)" style="${inp}"></div>`;
    } else if (['benefits','services','reviews','faq','team','prices'].includes(block.type)) {
        fields = `
        <div><label style="${lbl}">Заголовок секції</label>
        <input value="${_esc(block.title||'')}" oninput="sbUpdateBlock(${idx},'title',this.value)" style="${inp}"></div>
        <div style="font-size:0.72rem;color:#6b7280;background:#f9fafb;padding:0.4rem;border-radius:7px;margin-top:0.2rem;">
            Для редагування елементів — натисни на блок у прев'ю
        </div>`;
    } else {
        fields = `
        <div><label style="${lbl}">Заголовок</label>
        <input value="${_esc(block.title||'')}" oninput="sbUpdateBlock(${idx},'title',this.value)" style="${inp}"></div>`;
    }

    c.innerHTML = `
    <div style="font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;
        margin-bottom:0.6rem;display:flex;align-items:center;gap:0.3rem;">
        ${bt.icon} ${bt.label}
    </div>
    ${fields}`;
}

const lbl = 'font-size:0.67rem;font-weight:700;color:#9ca3af;text-transform:uppercase;display:block;margin-bottom:0.2rem;';

// ── Операції з блоками ─────────────────────────────────────
window.sbUpdateBlock = function (idx, field, value) {
    if (!sb.blocks[idx]) return;
    sb.blocks[idx][field] = value;
    _renderPreview();
};

window.sbToggleFormField = function (idx, field, checked) {
    if (!sb.blocks[idx]) return;
    let fields = [...(sb.blocks[idx].fields || [])];
    if (checked && !fields.includes(field)) fields.push(field);
    if (!checked) fields = fields.filter(f => f !== field);
    sb.blocks[idx].fields = fields;
    _renderPreview();
};

window.sbAddBlock = function (type) {
    const newBlock = _defaultBlock(type, sb.blocks.length);
    sb.blocks.push(newBlock);
    sb.activeBlockIdx = sb.blocks.length - 1;
    _renderBlockList();
    _renderPreview();
    _renderBlockEditor(sb.activeBlockIdx);
    if (typeof showToast === 'function') showToast('Блок додано', 'success');
};

window.sbMoveBlock = function (idx, dir) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sb.blocks.length) return;
    [sb.blocks[idx], sb.blocks[newIdx]] = [sb.blocks[newIdx], sb.blocks[idx]];
    sb.blocks.forEach((b, i) => b.order = i);
    if (sb.activeBlockIdx === idx) sb.activeBlockIdx = newIdx;
    _renderBlockList();
    _renderPreview();
};

window.sbRemoveBlock = async function (idx) {
    if (!(await (window.showConfirmModal ? showConfirmModal('Видалити блок?',{danger:true}) : Promise.resolve(confirm('Видалити блок?'))))) return;
    sb.blocks.splice(idx, 1);
    if (sb.activeBlockIdx >= sb.blocks.length) sb.activeBlockIdx = sb.blocks.length - 1;
    _renderBlockList();
    _renderPreview();
    _renderBlockEditor(sb.activeBlockIdx);
};

function _defaultBlock(type, order) {
    const defaults = {
        hero:     { type:'hero',     order, title:'Заголовок сайту', subtitle:'Ваша головна перевага', cta:'Залишити заявку', bgColor:'#0a0f1a', textColor:'#ffffff' },
        benefits: { type:'benefits', order, title:'Наші переваги', items:[{icon:'⭐',title:'Перевага 1',text:'Опис'},{icon:'✅',title:'Перевага 2',text:'Опис'},{icon:'🏆',title:'Перевага 3',text:'Опис'}]},
        services: { type:'services', order, title:'Послуги', items:[{title:'Послуга 1',price:'від 500 грн',text:'Опис'},{title:'Послуга 2',price:'від 800 грн',text:'Опис'}]},
        reviews:  { type:'reviews',  order, title:'Відгуки', items:[{name:'Клієнт 1',rating:5,text:'Чудовий сервіс!'},{name:'Клієнт 2',rating:5,text:'Рекомендую!'}]},
        faq:      { type:'faq',      order, title:'Питання та відповіді', items:[{question:'Питання 1?',answer:'Відповідь 1.'},{question:'Питання 2?',answer:'Відповідь 2.'}]},
        form:     { type:'form',     order, title:'Залишити заявку', subtitle:'Зв\'яжемося за 15 хвилин', fields:['name','phone'], cta:'Відправити' },
        team:     { type:'team',     order, title:'Команда', items:[{name:'Спеціаліст 1',role:'Посада',photo:''}]},
        prices:   { type:'prices',   order, title:'Ціни', items:[{title:'Базовий',price:'990 грн',features:['Опція 1','Опція 2']}]},
        gallery:  { type:'gallery',  order, title:'Наші роботи', items:[]},
        about:    { type:'about',    order, title:'Про нас', text:'Розкажіть про себе', photo:''},
    };
    return defaults[type] || { type, order, title: type };
}

// ── Прев'ю ─────────────────────────────────────────────────
function _renderPreview() {
    const c = document.getElementById('sbPreviewInner');
    if (!c) return;
    const theme = sb.site?.theme || { primaryColor:'#22c55e' };
    const primary = theme.primaryColor || '#22c55e';

    if (!sb.blocks.length) {
        c.innerHTML = `<div style="text-align:center;padding:3rem;color:#9ca3af;">
            <div style="font-size:2rem;margin-bottom:0.5rem;">🌐</div>
            Додай перший блок з панелі зліва
        </div>`;
        return;
    }

    c.innerHTML = sb.blocks.map((block, i) => {
        const active = i === sb.activeBlockIdx;
        const wrapper = (inner) => `
        <div id="sbPreviewBlock_${i}" onclick="sbSelectBlock(${i})"
            style="position:relative;cursor:pointer;outline:${active ? '2px solid '+primary : 'none'};
            outline-offset:-2px;transition:outline 0.1s;">
            ${active ? `<div style="position:absolute;top:4px;right:4px;background:${primary};color:white;
                font-size:0.6rem;padding:2px 6px;border-radius:4px;z-index:10;font-weight:700;">
                редагується</div>` : ''}
            ${inner}
        </div>`;

        if (block.type === 'hero') {
            return wrapper(`
            <div style="background:${block.bgColor||'#0a0f1a'};color:${block.textColor||'#fff'};
                padding:3rem 1.5rem;text-align:center;">
                <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 0.75rem;line-height:1.2;">
                    ${_esc(block.title||'Заголовок')}</h1>
                <p style="font-size:0.9rem;opacity:0.8;margin:0 0 1.5rem;max-width:480px;margin-inline:auto;">
                    ${_esc(block.subtitle||'')}</p>
                <button style="padding:0.7rem 2rem;background:${primary};color:white;border:none;
                    border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;">
                    ${_esc(block.cta||'Залишити заявку')}</button>
            </div>`);
        }
        if (block.type === 'benefits') {
            const items = block.items || [];
            return wrapper(`
            <div style="padding:2rem 1.5rem;background:#f9fafb;">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 1.25rem;">
                    ${_esc(block.title||'Переваги')}</h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;">
                    ${items.map(item => `
                    <div style="background:white;border-radius:12px;padding:1rem;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.07);">
                        <div style="font-size:1.5rem;margin-bottom:0.35rem;">${item.icon||'⭐'}</div>
                        <div style="font-weight:700;font-size:0.82rem;margin-bottom:0.25rem;">${_esc(item.title||'')}</div>
                        <div style="font-size:0.72rem;color:#6b7280;">${_esc(item.text||'')}</div>
                    </div>`).join('')}
                </div>
            </div>`);
        }
        if (block.type === 'services') {
            const items = block.items || [];
            return wrapper(`
            <div style="padding:2rem 1.5rem;">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 1.25rem;">
                    ${_esc(block.title||'Послуги')}</h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.75rem;">
                    ${items.map(item => `
                    <div style="border:1.5px solid #e5e7eb;border-radius:12px;padding:1rem;">
                        <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.25rem;">${_esc(item.title||'')}</div>
                        <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.5rem;">${_esc(item.text||'')}</div>
                        <div style="font-size:0.85rem;font-weight:700;color:${primary};">${_esc(item.price||'')}</div>
                    </div>`).join('')}
                </div>
            </div>`);
        }
        if (block.type === 'reviews') {
            const items = block.items || [];
            return wrapper(`
            <div style="padding:2rem 1.5rem;background:#f9fafb;">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 1.25rem;">
                    ${_esc(block.title||'Відгуки')}</h2>
                <div style="display:flex;flex-direction:column;gap:0.6rem;">
                    ${items.map(item => `
                    <div style="background:white;border-radius:12px;padding:0.9rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;">
                            <div style="width:32px;height:32px;background:${primary};border-radius:50%;
                                display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8rem;">
                                ${_esc((item.name||'?').charAt(0))}</div>
                            <div>
                                <div style="font-weight:700;font-size:0.8rem;">${_esc(item.name||'')}</div>
                                <div style="color:#f59e0b;font-size:0.75rem;">${'★'.repeat(item.rating||5)}</div>
                            </div>
                        </div>
                        <div style="font-size:0.78rem;color:#374151;">${_esc(item.text||'')}</div>
                    </div>`).join('')}
                </div>
            </div>`);
        }
        if (block.type === 'faq') {
            const items = block.items || [];
            return wrapper(`
            <div style="padding:2rem 1.5rem;">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 1.25rem;">
                    ${_esc(block.title||'FAQ')}</h2>
                ${items.map(item => `
                <details style="margin-bottom:0.5rem;border:1.5px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                    <summary style="padding:0.75rem 1rem;cursor:pointer;font-weight:600;font-size:0.83rem;">
                        ${_esc(item.question||'')}</summary>
                    <div style="padding:0.5rem 1rem 0.75rem;font-size:0.78rem;color:#374151;border-top:1px solid #f1f5f9;">
                        ${_esc(item.answer||'')}</div>
                </details>`).join('')}
            </div>`);
        }
        if (block.type === 'form') {
            const fields = block.fields || ['name','phone'];
            const fieldLabels = {name:"Ім'я",phone:'Телефон',email:'Email',message:'Повідомлення',telegram:'Telegram'};
            return wrapper(`
            <div style="padding:2rem 1.5rem;background:linear-gradient(135deg,${primary}15,${primary}05);">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 0.35rem;">
                    ${_esc(block.title||'Залишити заявку')}</h2>
                ${block.subtitle ? `<p style="text-align:center;font-size:0.8rem;color:#6b7280;margin:0 0 1rem;">${_esc(block.subtitle)}</p>` : ''}
                <div style="max-width:360px;margin:0 auto;display:flex;flex-direction:column;gap:0.5rem;">
                    ${fields.map(f => `
                    <input placeholder="${fieldLabels[f]||f}" style="padding:0.6rem 0.75rem;
                        border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.83rem;width:100%;box-sizing:border-box;" disabled>`).join('')}
                    <button style="padding:0.65rem;background:${primary};color:white;border:none;
                        border-radius:9px;font-weight:700;font-size:0.85rem;cursor:pointer;">
                        ${_esc(block.cta||'Відправити')}</button>
                </div>
            </div>`);
        }
        if (block.type === 'team') {
            const items = block.items || [];
            return wrapper(`
            <div style="padding:2rem 1.5rem;background:#f9fafb;">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 1.25rem;">
                    ${_esc(block.title||'Команда')}</h2>
                <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;">
                    ${items.map(item => `
                    <div style="text-align:center;width:120px;">
                        <div style="width:64px;height:64px;background:${primary};border-radius:50%;
                            margin:0 auto 0.4rem;display:flex;align-items:center;justify-content:center;
                            color:white;font-size:1.2rem;font-weight:700;">
                            ${_esc((item.name||'?').charAt(0))}</div>
                        <div style="font-weight:700;font-size:0.78rem;">${_esc(item.name||'')}</div>
                        <div style="font-size:0.7rem;color:#6b7280;">${_esc(item.role||'')}</div>
                    </div>`).join('')}
                </div>
            </div>`);
        }
        if (block.type === 'prices') {
            const items = block.items || [];
            return wrapper(`
            <div style="padding:2rem 1.5rem;">
                <h2 style="text-align:center;font-size:1.2rem;font-weight:700;margin:0 0 1.25rem;">
                    ${_esc(block.title||'Ціни')}</h2>
                <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;">
                    ${items.map(item => `
                    <div style="border:2px solid ${primary};border-radius:14px;padding:1.25rem;min-width:140px;text-align:center;">
                        <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.5rem;">${_esc(item.title||'')}</div>
                        <div style="font-size:1.3rem;font-weight:800;color:${primary};margin-bottom:0.6rem;">${_esc(item.price||'')}</div>
                        ${(item.features||[]).map(f=>`<div style="font-size:0.72rem;color:#6b7280;margin-bottom:0.2rem;">✓ ${_esc(f)}</div>`).join('')}
                    </div>`).join('')}
                </div>
            </div>`);
        }
        // Дефолт для gallery, about, etc.
        return wrapper(`
        <div style="padding:1.5rem;text-align:center;background:#f9fafb;">
            <div style="font-size:0.9rem;font-weight:700;color:#374151;">${_esc(block.title||block.type)}</div>
        </div>`);
    }).join('');
}

window.sbTogglePreview = function () {
    const panel = document.getElementById('sbPanel');
    if (panel) panel.style.display = panel.style.display === 'none' ? '' : 'none';
};

// ── Зберегти ───────────────────────────────────────────────
window.sbSave = async function () {
    if (sb.saving) return;
    sb.saving = true;
    const btn = document.querySelector('[onclick="sbSave()"]');
    if (btn) { btn.textContent = 'Зберігаю...'; btn.disabled = true; }
    try {
        await window.companyRef()
            .collection(window.DB_COLS.SITES).doc( + '/sites/' + sb.siteId)
            .update({
                blocks:    sb.blocks,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        if (typeof showToast === 'function') showToast('Збережено ✓', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    } finally {
        sb.saving = false;
        if (btn) { btn.textContent = '💾 Зберегти'; btn.disabled = false; }
    }
};

// ══════════════════════════════════════════════════════════
// SEO & ANALYTICS PANEL
// ══════════════════════════════════════════════════════════
window.sbPanelTab = function(tab) {
    sb.panelTab = tab;
    const blocksEl = document.getElementById('sbPanelBlocks');
    const seoEl    = document.getElementById('sbPanelSeo');
    const bBtn     = document.getElementById('sbPanelTab_blocks');
    const sBtn     = document.getElementById('sbPanelTab_seo');
    if (blocksEl) blocksEl.style.display = tab === 'blocks' ? 'flex' : 'none';
    if (seoEl)    seoEl.style.display    = tab === 'seo'    ? 'flex' : 'none';
    if (bBtn) { bBtn.style.borderBottomColor = tab==='blocks'?'#22c55e':'transparent'; bBtn.style.color=tab==='blocks'?'#22c55e':'#6b7280'; bBtn.style.fontWeight=tab==='blocks'?'600':'500'; }
    if (sBtn) { sBtn.style.borderBottomColor = tab==='seo'?'#22c55e':'transparent'; sBtn.style.color=tab==='seo'?'#22c55e':'#6b7280'; sBtn.style.fontWeight=tab==='seo'?'600':'500'; }
    if (tab === 'seo') _renderSeoPanel();
};

function _renderSeoPanel() {
    const c = document.getElementById('sbSeoContent');
    if (!c || !sb.site) return;
    const s = sb.site;
    const inp  = 'width:100%;padding:0.4rem 0.5rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.78rem;box-sizing:border-box;font-family:inherit;';
    const ta   = inp + 'resize:vertical;';
    const lbl  = 'font-size:0.67rem;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:0.2rem;letter-spacing:0.03em;';
    const sec  = 'margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #f1f5f9;';
    const head = 'font-size:0.78rem;font-weight:700;color:#111827;margin-bottom:0.6rem;display:flex;align-items:center;gap:0.35rem;';

    c.innerHTML = `
    <style>
    .seo-section { margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid #f1f5f9; }
    .seo-section:last-child { border-bottom:none; }
    </style>

    <!-- SEO Meta -->
    <div class="seo-section">
        <div style="${head}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            SEO Meta
        </div>
        <div style="margin-bottom:0.5rem;">
            <label style="${lbl}">Title (заголовок сторінки)</label>
            <input id="seo_title" value="${_esc(s.seoTitle||s.name||'')}" placeholder="Назва сторінки для Google" style="${inp}">
        </div>
        <div style="margin-bottom:0.5rem;">
            <label style="${lbl}">Description</label>
            <textarea id="seo_desc" rows="2" placeholder="Опис для пошукових систем..." style="${ta}">${_esc(s.seoDescription||'')}</textarea>
        </div>
        <div style="margin-bottom:0.5rem;">
            <label style="${lbl}">Keywords</label>
            <input id="seo_keywords" value="${_esc(s.seoKeywords||'')}" placeholder="ключові, слова, через кому" style="${inp}">
        </div>
        <div>
            <label style="${lbl}">OG Image URL (соц мережі)</label>
            <input id="seo_ogimage" value="${_esc(s.seoOgImage||'')}" placeholder="https://..." style="${inp}">
        </div>
    </div>

    <!-- Google Analytics -->
    <div class="seo-section">
        <div style="${head}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            Google Analytics / GTM
        </div>
        <div style="margin-bottom:0.5rem;">
            <label style="${lbl}">GA4 Measurement ID</label>
            <input id="seo_ga4" value="${_esc(s.analyticsGA4||'')}" placeholder="G-XXXXXXXXXX" style="${inp}">
            <div style="font-size:0.65rem;color:#9ca3af;margin-top:2px;">Google Analytics 4</div>
        </div>
        <div>
            <label style="${lbl}">GTM Container ID</label>
            <input id="seo_gtm" value="${_esc(s.analyticsGTM||'')}" placeholder="GTM-XXXXXXX" style="${inp}">
            <div style="font-size:0.65rem;color:#9ca3af;margin-top:2px;">Google Tag Manager</div>
        </div>
    </div>

    <!-- Meta Pixel -->
    <div class="seo-section">
        <div style="${head}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Meta (Facebook) Pixel
        </div>
        <div>
            <label style="${lbl}">Pixel ID</label>
            <input id="seo_fbpixel" value="${_esc(s.analyticsMetaPixel||'')}" placeholder="1234567890123456" style="${inp}">
        </div>
    </div>

    <!-- TikTok Pixel -->
    <div class="seo-section">
        <div style="${head}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            TikTok Pixel
        </div>
        <div>
            <label style="${lbl}">TikTok Pixel ID</label>
            <input id="seo_tiktok" value="${_esc(s.analyticsTikTok||'')}" placeholder="CXXXXXXXXXXXXXXXX" style="${inp}">
        </div>
    </div>

    <!-- Custom Head Code -->
    <div class="seo-section">
        <div style="${head}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Custom &lt;head&gt; код
        </div>
        <div>
            <label style="${lbl}">Довільний код в &lt;head&gt;</label>
            <textarea id="seo_headcode" rows="4"
                placeholder="<!-- Вставте будь-який скрипт, тег або код -->" style="${ta}font-family:monospace;font-size:0.72rem;">${_esc(s.analyticsHeadCode||'')}</textarea>
            <div style="font-size:0.65rem;color:#9ca3af;margin-top:2px;">
                Підтримка: Hotjar, Clarity, LiveChat, Intercom, будь-який інший pixel
            </div>
        </div>
    </div>

    <!-- Save -->
    <button onclick="sbSaveSeo()"
        style="width:100%;padding:0.5rem;background:#22c55e;color:white;border:none;
        border-radius:7px;cursor:pointer;font-weight:700;font-size:0.82rem;">
        Зберегти SEO & Аналітику
    </button>`;
}

window.sbSaveSeo = async function() {
    const updates = {
        seoTitle:          document.getElementById('seo_title')?.value.trim()    || '',
        seoDescription:    document.getElementById('seo_desc')?.value.trim()     || '',
        seoKeywords:       document.getElementById('seo_keywords')?.value.trim() || '',
        seoOgImage:        document.getElementById('seo_ogimage')?.value.trim()  || '',
        analyticsGA4:      document.getElementById('seo_ga4')?.value.trim()      || '',
        analyticsGTM:      document.getElementById('seo_gtm')?.value.trim()      || '',
        analyticsMetaPixel:document.getElementById('seo_fbpixel')?.value.trim()  || '',
        analyticsTikTok:   document.getElementById('seo_tiktok')?.value.trim()   || '',
        analyticsHeadCode: document.getElementById('seo_headcode')?.value        || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
        await window.companyRef()
            .collection(window.DB_COLS.SITES).doc( + '/sites/' + sb.siteId)
            .update(updates);
        Object.assign(sb.site, updates);
        if (typeof showToast === 'function') showToast('SEO збережено ✓', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Помилка: ' + e.message, 'error');
    }
};

// ══════════════════════════════════════════════════════════
// PUBLIC HTML GENERATOR — вставляє аналітику в <head>
// ══════════════════════════════════════════════════════════
window.sbBuildPublicHtml = function(site, blocksHtml) {
    const s = site || sb.site || {};
    const ga4     = s.analyticsGA4       || '';
    const gtm     = s.analyticsGTM       || '';
    const fbPixel = s.analyticsMetaPixel || '';
    const tiktok  = s.analyticsTikTok    || '';
    const custom  = s.analyticsHeadCode  || '';

    const ga4Code = ga4 ? `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"><\/script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga4}');
    <\/script>` : '';

    const gtmCode = gtm ? `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtm}');<\/script>` : '';

    const fbCode = fbPixel ? `
    <!-- Meta Pixel -->
    <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${fbPixel}');
    fbq('track', 'PageView');
    <\/script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${fbPixel}&ev=PageView&noscript=1"/></noscript>` : '';

    const tiktokCode = tiktok ? `
    <!-- TikTok Pixel -->
    <script>
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
      ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
      ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");
      o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
      var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${tiktok}');ttq.page();
    }(window, document, 'ttq');
    <\/script>` : '';

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${_esc(s.seoTitle || s.name || 'Сайт')}</title>
    ${s.seoDescription ? `<meta name="description" content="${_esc(s.seoDescription)}">` : ''}
    ${s.seoKeywords    ? `<meta name="keywords"    content="${_esc(s.seoKeywords)}">` : ''}
    ${s.seoOgImage     ? `<meta property="og:image" content="${_esc(s.seoOgImage)}">` : ''}
    <meta property="og:title" content="${_esc(s.seoTitle || s.name || '')}">
    ${s.seoDescription ? `<meta property="og:description" content="${_esc(s.seoDescription)}">` : ''}
    ${ga4Code}
    ${gtmCode}
    ${fbCode}
    ${tiktokCode}
    ${custom}
</head>
<body>
    ${gtm ? `<!-- GTM noscript --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
    ${blocksHtml || ''}
</body>
</html>`;
};

function _esc(s) {
    // Shared via TALKO.utils.esc — local fallback for load order safety
    if (window.TALKO?.utils?.esc) return window.TALKO.utils.esc(s);
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

    // ── TALKO namespace ───────────────────────────────────────
    if (window.TALKO) {
        window.TALKO.sites = Object.assign(window.TALKO.sites||{}, {
            initBuilder: window.initSitesBuilder,
            save: window.sbSave,
            saveSeo: window.sbSaveSeo,
            addBlock: window.sbAddBlock,
            removeBlock: window.sbRemoveBlock,
            panelTab: window.sbPanelTab,
            buildHtml: window.sbBuildPublicHtml,
        });
    }

})();
