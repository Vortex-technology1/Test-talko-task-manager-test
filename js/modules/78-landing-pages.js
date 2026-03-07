// ============================================================
// 78-landing-pages.js — TALKO Landing Pages Manager v1.0
// Менеджер лендінгів: збереження HTML, slug, прив'язка воронки
// ============================================================
(function () {
    'use strict';

    let lpPages = [];
    let lpFunnels = [];
    let lpUnsubscribe = null;
    let lpCurrentTab = 'pages'; // pages | funnels

    // ── Init ───────────────────────────────────────────────
    window.initLandingPagesModule = async function () {
        if (!window.currentCompanyId) return;
        renderLPShell();
        await loadLPData();
    };

    function renderLPShell() {
        const container = document.getElementById('marketingContainer');
        if (!container) return;
        container.innerHTML = `
            <div id="lpModule" style="padding:0.75rem;">
                <!-- Sub-tabs -->
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;background:white;border-radius:12px;padding:0.4rem;box-shadow:var(--shadow);">
                    <button onclick="lpSwitchTab('pages')" id="lpTabPages"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:#22c55e;color:white;transition:all 0.2s;">
                        <i data-lucide="layout" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>Лендінги
                    </button>
                    <button onclick="lpSwitchTab('funnels')" id="lpTabFunnels"
                        style="flex:1;padding:0.5rem;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;background:transparent;color:#525252;transition:all 0.2s;">
                        <i data-lucide="git-branch" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>Воронки
                    </button>
                </div>
                <div id="lpPagesView"></div>
                <div id="lpFunnelsView" style="display:none;"></div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }

    window.lpSwitchTab = function (tab) {
        lpCurrentTab = tab;
        ['pages', 'funnels'].forEach(t => {
            const btn = document.getElementById('lpTab' + t.charAt(0).toUpperCase() + t.slice(1));
            const view = document.getElementById('lp' + t.charAt(0).toUpperCase() + t.slice(1) + 'View');
            if (btn) { btn.style.background = t === tab ? '#22c55e' : 'transparent'; btn.style.color = t === tab ? 'white' : '#525252'; }
            if (view) view.style.display = t === tab ? '' : 'none';
        });
        if (tab === 'pages') renderPagesView();
        if (tab === 'funnels') renderFunnelsView();
        if (window.lucide) lucide.createIcons();
    };

    // ── Load Data ──────────────────────────────────────────
    async function loadLPData() {
        if (!window.currentCompanyId) return;
        const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);

        // Live landing pages
        if (lpUnsubscribe) lpUnsubscribe();
        lpUnsubscribe = base.collection('landingPages').orderBy('createdAt', 'desc')
            .onSnapshot(snap => {
                lpPages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                if (lpCurrentTab === 'pages') renderPagesView();
            });

        // Load funnels
        const fSnap = await base.collection('funnels').orderBy('createdAt', 'desc').get();
        lpFunnels = fSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        renderPagesView();
    }

    // ── Pages View ─────────────────────────────────────────
    function renderPagesView() {
        const container = document.getElementById('lpPagesView');
        if (!container || lpCurrentTab !== 'pages') return;

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
                <div>
                    <div style="font-weight:700;font-size:1rem;color:#1a1a1a;">Лендінги</div>
                    <div style="font-size:0.78rem;color:#6b7280;">${lpPages.length} сторінок</div>
                </div>
                <button onclick="openCreatePageModal()" style="display:flex;align-items:center;gap:0.4rem;padding:0.55rem 1rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    <i data-lucide="plus" style="width:16px;height:16px;"></i> Новий лендінг
                </button>
            </div>

            ${lpPages.length === 0 ? `
                <div style="text-align:center;padding:3rem;background:white;border-radius:12px;box-shadow:var(--shadow);">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;">🚀</div>
                    <div style="font-weight:600;color:#1a1a1a;margin-bottom:0.4rem;">Ще немає лендінгів</div>
                    <div style="font-size:0.85rem;color:#6b7280;margin-bottom:1rem;">Створіть перший лендінг і підключіть AI воронку</div>
                    <button onclick="openCreatePageModal()" style="padding:0.6rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;">+ Створити лендінг</button>
                </div>` : `
                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                    ${lpPages.map(page => renderPageCard(page)).join('')}
                </div>`}
        `;
        if (window.lucide) lucide.createIcons();
    }

    function renderPageCard(page) {
        const funnel = lpFunnels.find(f => f.id === page.funnelId);
        const publicUrl = getPublicUrl(page);
        const statusColor = page.status === 'active' ? '#22c55e' : '#9ca3af';
        const statusLabel = page.status === 'active' ? 'Активний' : 'Чернетка';

        return `
            <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);border-left:3px solid ${statusColor};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;">
                            <span style="font-weight:700;font-size:0.95rem;color:#1a1a1a;">${escHtml(page.name)}</span>
                            <span style="font-size:0.7rem;background:${statusColor}22;color:${statusColor};padding:0.15rem 0.5rem;border-radius:20px;font-weight:600;">${statusLabel}</span>
                        </div>
                        <div style="font-size:0.78rem;color:#6b7280;margin-bottom:0.4rem;">
                            /${escHtml(page.slug)} ${funnel ? `· <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span> ${escHtml(funnel.name)}` : '· без воронки'}
                        </div>
                        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                            <span style="font-size:0.78rem;color:#3b82f6;background:#eff6ff;padding:0.15rem 0.5rem;border-radius:6px;">
                                ${escHtml(publicUrl)}
                            </span>
                            <button onclick="copyToClipboard('${escHtml(publicUrl)}')" style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:2px;" title="Копіювати посилання">
                                <i data-lucide="copy" style="width:13px;height:13px;"></i>
                            </button>
                        </div>
                    </div>
                    <div style="display:flex;gap:0.4rem;align-items:center;">
                        <button onclick="togglePageStatus('${page.id}','${page.status}')"
                            style="padding:0.35rem 0.65rem;background:${page.status === 'active' ? '#fee2e2' : '#f0fdf4'};color:${page.status === 'active' ? '#ef4444' : '#16a34a'};border:none;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600;">
                            ${page.status === 'active' ? 'Деактивувати' : 'Активувати'}
                        </button>
                        <button onclick="openEditPageModal('${page.id}')"
                            style="padding:0.35rem 0.65rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.78rem;">
                            Редагувати
                        </button>
                        <button onclick="confirmDeletePage('${page.id}')"
                            style="padding:0.35rem 0.5rem;background:#fee2e2;color:#ef4444;border:none;border-radius:8px;cursor:pointer;">
                            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                        </button>
                    </div>
                </div>
                <div style="display:flex;gap:1rem;margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid #f0f0f0;">
                    <span style="font-size:0.78rem;color:#6b7280;">
                        <i data-lucide="users" style="width:12px;height:12px;display:inline;vertical-align:middle;"></i>
                        ${page.leadsCount || 0} лідів
                    </span>
                    <span style="font-size:0.78rem;color:#6b7280;">
                        Створено: ${page.createdAt?.toDate ? page.createdAt.toDate().toLocaleDateString('uk-UA') : '—'}
                    </span>
                </div>
            </div>`;
    }

    function getPublicUrl(page) {
        const host = window.location.hostname === 'localhost' ? 'localhost:3000' : window.location.hostname;
        return `https://${host}/p/${window.currentCompanyId}/${page.slug}`;
    }

    window.copyToClipboard = function (text) {
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast('Посилання скопійовано', 'success');
        });
    };

    window.togglePageStatus = async function (pageId, currentStatus) {
        const newStatus = currentStatus === 'active' ? 'draft' : 'active';
        try {
            await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('landingPages').doc(pageId)
                .update({ status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            if (typeof showToast === 'function') showToast(newStatus === 'active' ? 'Лендінг активовано' : 'Лендінг деактивовано', 'success');
        } catch (e) { console.error(e); }
    };

    window.confirmDeletePage = function (pageId) {
        if (!confirm('Видалити лендінг? Це незворотно.')) return;
        firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('landingPages').doc(pageId).delete()
            .then(() => { if (typeof showToast === 'function') showToast('Видалено', 'success'); })
            .catch(e => console.error(e));
    };

    // ── Create/Edit Page Modal ─────────────────────────────
    window.openCreatePageModal = function () { openPageModal(null); };
    window.openEditPageModal = function (pageId) {
        const page = lpPages.find(p => p.id === pageId);
        openPageModal(page);
    };

    function openPageModal(page) {
        const isEdit = !!page;
        const html = `
            <div id="lpPageOverlay" onclick="if(event.target===this)closeLPPageModal()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto;">
                <div style="background:white;border-radius:16px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.2);margin:auto;">
                    <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white;z-index:1;border-radius:16px 16px 0 0;">
                        <div style="font-weight:700;font-size:1rem;">${isEdit ? 'Редагувати лендінг' : 'Новий лендінг'}</div>
                        <button onclick="closeLPPageModal()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">

                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА ЛЕНДІНГУ *</label>
                            <input id="lpPageName" value="${escHtml(page?.name || '')}" placeholder="Наприклад: Лендінг для стоматології"
                                style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;"
                                oninput="lpAutoSlug(this.value)">
                        </div>

                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">SLUG (URL) *</label>
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <span style="font-size:0.82rem;color:#6b7280;white-space:nowrap;">/p/${window.currentCompanyId}/</span>
                                <input id="lpPageSlug" value="${escHtml(page?.slug || '')}" placeholder="moya-klinika"
                                    style="flex:1;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;"
                                    oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9-]/g,'')">
                            </div>
                            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">Тільки латиниця, цифри, дефіс</div>
                        </div>

                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ВОРОНКА (AI чат)</label>
                            <select id="lpPageFunnel" style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;">
                                <option value="">— Без воронки —</option>
                                ${lpFunnels.map(f => `<option value="${f.id}" ${page?.funnelId === f.id ? 'selected' : ''}>${escHtml(f.name)}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">HTML КОД ЛЕНДІНГУ</label>
                            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:0.5rem;margin-bottom:0.4rem;">
                                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.3rem;">💡 Підказка: додайте кнопку з <code style="background:#f0fdf4;padding:1px 4px;border-radius:3px;">data-talko-funnel="open"</code> щоб відкривати чат</div>
                                <div style="font-size:0.75rem;color:#6b7280;">Приклад: <code style="background:#f0fdf4;padding:1px 4px;border-radius:3px;">&lt;button data-talko-funnel="open"&gt;Записатися&lt;/button&gt;</code></div>
                            </div>
                            <textarea id="lpPageHtml" placeholder="&lt;!DOCTYPE html&gt;&#10;&lt;html&gt;...&lt;/html&gt;"
                                style="width:100%;min-height:200px;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.8rem;font-family:monospace;resize:vertical;box-sizing:border-box;">${escHtml(page?.htmlContent || lpDefaultTemplate())}</textarea>
                            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.2rem;">Максимум 500KB</div>
                        </div>

                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">СТАТУС</label>
                            <select id="lpPageStatus" style="width:100%;padding:0.6rem 0.75rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;background:white;">
                                <option value="draft" ${(!page || page.status === 'draft') ? 'selected' : ''}>Чернетка</option>
                                <option value="active" ${page?.status === 'active' ? 'selected' : ''}>Активний</option>
                            </select>
                        </div>

                    </div>
                    <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;position:sticky;bottom:0;background:white;border-radius:0 0 16px 16px;">
                        <button onclick="closeLPPageModal()" style="padding:0.55rem 1rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                        <button onclick="previewLPHtml()" style="padding:0.55rem 1rem;background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;border-radius:8px;cursor:pointer;font-weight:600;">👁 Прев'ю</button>
                        <button onclick="saveLandingPage('${page?.id || ''}')" style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Зберегти</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        if (window.lucide) lucide.createIcons();
    }

    window.closeLPPageModal = function () {
        document.getElementById('lpPageOverlay')?.remove();
    };

    window.lpAutoSlug = function (name) {
        const slugInput = document.getElementById('lpPageSlug');
        if (!slugInput || slugInput.value) return; // don't overwrite existing
        slugInput.value = name.toLowerCase()
            .replace(/[іїєа-яёА-ЯЁІЇЄa-zA-Z0-9]/g, c => {
                const map = { 'і': 'i', 'ї': 'yi', 'є': 'ye', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya' };
                return map[c] || c;
            })
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .slice(0, 50);
    };

    window.previewLPHtml = function () {
        const html = document.getElementById('lpPageHtml')?.value;
        if (!html) return;
        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
    };

    window.saveLandingPage = async function (existingId) {
        const name = document.getElementById('lpPageName')?.value.trim();
        const slug = document.getElementById('lpPageSlug')?.value.trim();
        const htmlContent = document.getElementById('lpPageHtml')?.value.trim();
        const funnelId = document.getElementById('lpPageFunnel')?.value || null;
        const status = document.getElementById('lpPageStatus')?.value || 'draft';

        if (!name) { alert('Введіть назву'); return; }
        if (!slug) { alert('Введіть slug'); return; }
        if (!/^[a-z0-9-]+$/.test(slug)) { alert('Slug: тільки латиниця, цифри, дефіс'); return; }

        // Check HTML size
        const htmlBytes = new Blob([htmlContent || '']).size;
        if (htmlBytes > 500 * 1024) { alert('HTML занадто великий (максимум 500KB)'); return; }

        const btn = document.querySelector('#lpPageOverlay button[onclick*="saveLandingPage"]');
        if (btn) { btn.textContent = 'Зберігаємо...'; btn.disabled = true; }

        try {
            const base = firebase.firestore().collection('companies').doc(window.currentCompanyId);

            // Check slug uniqueness (exclude current page)
            const slugCheck = await base.collection('landingPages').where('slug', '==', slug).get();
            const conflict = slugCheck.docs.find(d => d.id !== existingId);
            if (conflict) { alert('Такий slug вже зайнятий'); if (btn) { btn.textContent = '✓ Зберегти'; btn.disabled = false; } return; }

            // Save HTML to Firebase Storage
            let storageRef = null;
            if (htmlContent) {
                const storage = firebase.storage();
                const path = `companies/${window.currentCompanyId}/landingPages/${slug}/index.html`;
                storageRef = storage.ref(path);
                await storageRef.putString(htmlContent, 'raw', { contentType: 'text/html' });
            }

            const data = {
                name, slug, funnelId: funnelId || null, status,
                htmlStoragePath: storageRef ? `companies/${window.currentCompanyId}/landingPages/${slug}/index.html` : null,
                htmlContent: htmlContent ? htmlContent.slice(0, 10000) : '', // store preview in firestore, full in storage
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (existingId) {
                await base.collection('landingPages').doc(existingId).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                data.leadsCount = 0;
                await base.collection('landingPages').add(data);
            }

            closeLPPageModal();
            if (typeof showToast === 'function') showToast(existingId ? 'Лендінг оновлено ✓' : 'Лендінг створено ✓', 'success');
        } catch (err) {
            console.error('saveLandingPage error:', err);
            alert('Помилка: ' + err.message);
            if (btn) { btn.textContent = '✓ Зберегти'; btn.disabled = false; }
        }
    };

    function lpDefaultTemplate() {
        return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лендінг</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; }
        .hero { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; text-align: center; padding: 4rem 2rem; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; }
        .cta-btn { background: white; color: #16a34a; padding: 1rem 2.5rem; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s; }
        .cta-btn:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <section class="hero">
        <h1>Заголовок вашого лендінгу</h1>
        <p>Опис вашої пропозиції. Що отримає клієнт?</p>
        <!-- data-talko-funnel="open" — ця кнопка відкриє AI чат -->
        <button class="cta-btn" data-talko-funnel="open">Записатися безкоштовно</button>
    </section>
</body>
</html>`;
    }

    // ── Funnels View ───────────────────────────────────────
    function renderFunnelsView() {
        const container = document.getElementById('lpFunnelsView');
        if (!container || lpCurrentTab !== 'funnels') return;

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
                <div>
                    <div style="font-weight:700;font-size:1rem;color:#1a1a1a;">AI Воронки</div>
                    <div style="font-size:0.78rem;color:#6b7280;">${lpFunnels.length} воронок</div>
                </div>
                <button onclick="openCreateFunnelModal()" style="display:flex;align-items:center;gap:0.4rem;padding:0.55rem 1rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.85rem;">
                    <i data-lucide="plus" style="width:16px;height:16px;"></i> Нова воронка
                </button>
            </div>

            ${lpFunnels.length === 0 ? `
                <div style="text-align:center;padding:3rem;background:white;border-radius:12px;box-shadow:var(--shadow);">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="16" y1="15" x2="16" y2="15.01"/></svg></span></div>
                    <div style="font-weight:600;color:#1a1a1a;margin-bottom:0.4rem;">Ще немає воронок</div>
                    <div style="font-size:0.85rem;color:#6b7280;margin-bottom:1rem;">Створіть AI воронку для збору лідів</div>
                    <button onclick="openCreateFunnelModal()" style="padding:0.6rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;">+ Створити воронку</button>
                </div>` : `
                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                    ${lpFunnels.map(f => renderFunnelCard(f)).join('')}
                </div>`}
        `;
        if (window.lucide) lucide.createIcons();
    }

    function renderFunnelCard(funnel) {
        const stepsCount = (funnel.steps || []).length;
        const linkedPages = lpPages.filter(p => p.funnelId === funnel.id).length;

        return `
            <div style="background:white;border-radius:12px;padding:1rem;box-shadow:var(--shadow);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                    <div>
                        <div style="font-weight:700;font-size:0.95rem;color:#1a1a1a;margin-bottom:0.3rem;">${escHtml(funnel.name)}</div>
                        <div style="font-size:0.78rem;color:#6b7280;">${stepsCount} кроків · ${linkedPages} лендінгів · ${funnel.leadsCount || 0} лідів</div>
                    </div>
                    <div style="display:flex;gap:0.4rem;">
                        <button onclick="openFunnelEditor('${funnel.id}')" style="padding:0.4rem 0.75rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;">
                            <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></span>️ Редагувати
                        </button>
                        <button onclick="confirmDeleteFunnel('${funnel.id}')" style="padding:0.4rem 0.5rem;background:#fee2e2;color:#ef4444;border:none;border-radius:8px;cursor:pointer;">
                            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                        </button>
                    </div>
                </div>
                ${funnel.calendlyUrl ? `<div style="margin-top:0.5rem;font-size:0.75rem;color:#6b7280;">📅 Calendly: ${escHtml(funnel.calendlyUrl)}</div>` : ''}
            </div>`;
    }

    window.confirmDeleteFunnel = function (funnelId) {
        if (!confirm('Видалити воронку?')) return;
        firebase.firestore().collection('companies').doc(window.currentCompanyId)
            .collection('funnels').doc(funnelId).delete()
            .then(async () => {
                lpFunnels = lpFunnels.filter(f => f.id !== funnelId);
                renderFunnelsView();
                if (typeof showToast === 'function') showToast('Видалено', 'success');
            });
    };

    // ── Create Funnel Modal (quick) ────────────────────────
    window.openCreateFunnelModal = function () {
        const html = `
            <div id="lpCreateFunnelOverlay" onclick="if(event.target===this)document.getElementById('lpCreateFunnelOverlay').remove()"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;">
                <div style="background:white;border-radius:16px;width:100%;max-width:420px;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
                    <div style="padding:1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;">Нова воронка</div>
                        <button onclick="document.getElementById('lpCreateFunnelOverlay').remove()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.3rem;"><span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>
                    </div>
                    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">НАЗВА ВОРОНКИ *</label>
                            <input id="newFunnelName" placeholder="Наприклад: Запис на консультацію"
                                style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-size:0.78rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.3rem;">ПОСИЛАННЯ CALENDLY (опційно)</label>
                            <input id="newFunnelCalendly" placeholder="https://calendly.com/your-link"
                                style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.9rem;box-sizing:border-box;">
                        </div>
                    </div>
                    <div style="padding:1rem 1.25rem;border-top:1px solid #f0f0f0;display:flex;gap:0.5rem;justify-content:flex-end;">
                        <button onclick="document.getElementById('lpCreateFunnelOverlay').remove()" style="padding:0.55rem 1rem;background:#f9fafb;color:#525252;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;">Скасувати</button>
                        <button onclick="saveNewFunnel()" style="padding:0.55rem 1.25rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Створити</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('newFunnelName')?.focus();
    };

    window.saveNewFunnel = async function () {
        const name = document.getElementById('newFunnelName')?.value.trim();
        if (!name) { alert('Введіть назву'); return; }
        try {
            const ref = await firebase.firestore().collection('companies').doc(window.currentCompanyId)
                .collection('funnels').add({
                    name,
                    calendlyUrl: document.getElementById('newFunnelCalendly')?.value.trim() || null,
                    steps: [],
                    leadsCount: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            document.getElementById('lpCreateFunnelOverlay')?.remove();
            // Redirect to editor
            const newFunnel = { id: ref.id, name, steps: [], leadsCount: 0 };
            lpFunnels.unshift(newFunnel);
            openFunnelEditor(ref.id);
            if (typeof showToast === 'function') showToast('Воронку створено ✓', 'success');
        } catch (err) {
            alert('Помилка: ' + err.message);
        }
    };

    // ── Funnel Editor → module 79 ──────────────────────────
    window.openFunnelEditor = function (funnelId) {
        if (typeof openFunnelEditorModule === 'function') {
            openFunnelEditorModule(funnelId);
        } else {
            alert('Редактор воронок завантажується... Спробуйте ще раз.');
        }
    };

    // ── Utilities ──────────────────────────────────────────
    function escHtml(str) {
        if (!str && str !== 0) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── Tab switch hook ────────────────────────────────────
    const _origST = window.switchTab;
    window.switchTab = function (tab) {
        if (_origST) _origST(tab);
        if (tab === 'marketing') {
            if (window.isFeatureEnabled && window.isFeatureEnabled('marketing')) {
                if (typeof initLandingPagesModule === 'function' && lpPages.length === 0 && lpFunnels.length === 0) {
                    initLandingPagesModule();
                } else {
                    renderPagesView();
                }
            }
        }
    };

    window.destroyLandingPagesModule = function () {
        if (lpUnsubscribe) lpUnsubscribe();
        lpUnsubscribe = null;
    };

})();
