// =============================================
// MODULE 72 — GLOBAL SEARCH v3
// =============================================

(function() {
    let activeIndex = -1;
    let currentResults = [];

    // Search history on focus
    document.addEventListener('focusin', function(e) {
        if (e.target && e.target.id === 'globalSearchInput') {
            if (!e.target.value) showSearchHistory('globalSearchResults');
        }
    });

    // FIX БАГ A: pointerdown listener один раз, поза globalSearch()
    function setupResultsListener(containerId) {
        const r = document.getElementById(containerId);
        if (!r || r._gsearchListenerSet) return;
        r._gsearchListenerSet = true;
        r.addEventListener('pointerdown', function(e) {
            const item = e.target.closest('.gsearch-item');
            if (item) {
                e.preventDefault();
                const idx = parseInt(item.dataset.idx, 10);
                selectResult(idx, containerId === 'mobileSearchResults');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        setupResultsListener('globalSearchResults');
        setupResultsListener('mobileSearchResults');
        initMobileSearchBtn();
    });
    setTimeout(function() {
        setupResultsListener('globalSearchResults');
        setupResultsListener('mobileSearchResults');
        initMobileSearchBtn();
    }, 800);

    // Ctrl+K / Cmd+K
    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const inp = document.getElementById('globalSearchInput');
            if (inp) { inp.focus(); inp.select(); }
            return;
        }
        if (e.key === 'Escape') {
            const r = document.getElementById('globalSearchResults');
            const rm = document.getElementById('mobileSearchResults');
            const panelOpen = (r && r.style.display !== 'none') ||
                              (rm && rm.style.display !== 'none');
            if (panelOpen) {
                e.stopPropagation();
                hideGlobalSearch();
            }
            // FIX БАГ G: якщо пошук закритий — не заважаємо іншим Escape handlers
            return;
        }
        // Клавіатурна навігація
        const inp = document.getElementById('globalSearchInput');
        if (document.activeElement === inp) {
            if (e.key === 'ArrowDown') { e.preventDefault(); navigateSearch(1); }
            if (e.key === 'ArrowUp')   { e.preventDefault(); navigateSearch(-1); }
            if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); selectResult(activeIndex, false); }
        }
    });

    function navigateSearch(dir) {
        if (!currentResults.length) return;
        activeIndex = Math.max(0, Math.min(currentResults.length - 1, activeIndex + dir));
        highlightActive();
    }

    function highlightActive() {
        document.querySelectorAll('.gsearch-item').forEach((el, i) => {
            el.style.background = i === activeIndex ? '#f0fdf4' : '';
            el.style.outline = i === activeIndex ? '2px solid #22c55e' : '';
        });
        const active = document.querySelectorAll('.gsearch-item')[activeIndex];
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    window.hideGlobalSearch = function() {
        const r = document.getElementById('globalSearchResults');
        if (r) r.style.display = 'none';
        activeIndex = -1;
    };

    // FIX БАГ F: sanitize для badgeColor
    function safeCssColor(val) {
        if (!val) return '#6b7280';
        if (/^#[0-9a-fA-F]{3,6}$/.test(val)) return val;
        const named = {red:'#ef4444',green:'#22c55e',blue:'#3b82f6',orange:'#f97316',purple:'#8b5cf6',gray:'#6b7280'};
        return named[val] || '#6b7280';
    }

    const safeEsc = (str) => String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const highlight = (str, q) => safeEsc(str).replace(
        new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'),
        '<mark>$1</mark>'
    );

    function buildResults(q) {
        const results = [];

        // ЗАВДАННЯ
        if (typeof tasks !== 'undefined') {
            tasks.filter(t =>
                (t.title||'').toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q)
            ).slice(0, 5).forEach(t => {
                const statusColor = t.status==='done'?'#22c55e':t.status==='progress'?'#3b82f6':'#f59e0b';
                const assignee = (typeof users!=='undefined') ? users.find(u=>u.id===t.assigneeId) : null;
                const assigneeName = assignee ? (assignee.name||assignee.email).split(' ')[0] : '';
                const today = (typeof getLocalDateStr==='function') ? getLocalDateStr(new Date()) : '';
                const isOverdue = t.deadlineDate && t.deadlineDate < today && t.status !== 'done';
                results.push({
                    category:'Завдання', categoryIcon:'📋',
                    title: t.title||'(без назви)',
                    subtitle: [assigneeName, t.deadlineDate].filter(Boolean).join(' · '),
                    badge: t.status==='done'?'Виконано':t.status==='progress'?'В роботі':'Нове',
                    badgeColor: statusColor, overdue: isOverdue,
                    action: () => { if (typeof openTaskModal==='function') openTaskModal(t.id); }
                });
            });
        }

        // СПІВРОБІТНИКИ
        if (typeof users !== 'undefined') {
            users.filter(u =>
                (u.name||'').toLowerCase().includes(q) ||
                (u.email||'').toLowerCase().includes(q) ||
                (u.role||'').toLowerCase().includes(q)
            ).slice(0, 4).forEach(u => {
                const userTasks = (typeof tasks!=='undefined') ? tasks.filter(t=>t.assigneeId===u.id&&t.status!=='done') : [];
                const roleMap = {owner:'Власник',manager:'Менеджер',admin:'Адмін',employee:'Співробітник'};
                results.push({
                    category:'Співробітники', categoryIcon:'👤',
                    title: u.name||u.email,
                    subtitle: `${u.email} · ${userTasks.length} активних`,
                    badge: roleMap[u.role]||u.role,
                    badgeColor: u.role==='owner'?'#22c55e':u.role==='manager'?'#f97316':'#6b7280',
                    action: () => {
                        if (typeof switchTab==='function') switchTab('users');
                        setTimeout(() => {
                            document.querySelectorAll('.user-card').forEach(card => {
                                if (card.getAttribute('onclick')?.includes(u.id)) {
                                    card.scrollIntoView({behavior:'smooth',block:'center'});
                                    card.style.outline='2px solid #22c55e';
                                    setTimeout(()=>card.style.outline='',2000);
                                }
                            });
                        }, 400);
                    }
                });
            });
        }

        // ФУНКЦІЇ
        if (typeof functions !== 'undefined') {
            functions.filter(f => f.status!=='archived' && (
                (f.name||'').toLowerCase().includes(q) || (f.description||'').toLowerCase().includes(q)
            )).slice(0, 3).forEach(f => {
                const ids = f.assigneeIds||(f.assigneeId?[f.assigneeId]:[]);
                const names = (typeof users!=='undefined')
                    ? ids.map(id=>{const u=users.find(u=>u.id===id);return u?(u.name||u.email).split(' ')[0]:null;}).filter(Boolean).join(', ')
                    : '';
                results.push({
                    category:'Функції', categoryIcon:'⚙️',
                    title: f.name, subtitle: names||'Без відповідального',
                    badge:'Функція', badgeColor:'#8b5cf6',
                    // FIX БАГ E: scroll до функції після switchTab
                    action: () => {
                        if (typeof switchTab==='function') switchTab('functions');
                        setTimeout(() => {
                            // Реальний клас: .function-card, onclick містить id функції
                            const cards = document.querySelectorAll('.function-card');
                            let found = false;
                            cards.forEach(card => {
                                if (!found && card.getAttribute('onclick')?.includes(f.id)) {
                                    found = true;
                                    card.scrollIntoView({behavior:'smooth',block:'center'});
                                    card.style.outline='2px solid #8b5cf6';
                                    setTimeout(()=>card.style.outline='',2000);
                                }
                            });
                        }, 500);
                    }
                });
            });
        }

        // ПРОЄКТИ
        if (typeof projects !== 'undefined') {
            projects.filter(p =>
                (p.name||'').toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q)
            ).slice(0, 3).forEach(p => {
                const taskCount = (typeof tasks!=='undefined') ? tasks.filter(t=>t.projectId===p.id&&t.status!=='done').length : 0;
                results.push({
                    category:'Проєкти', categoryIcon:'📁',
                    title: p.name, subtitle:`${taskCount} активних завдань`,
                    badge:'Проєкт', badgeColor:'#3b82f6',
                    action: () => {
                        if (typeof switchTab==='function') switchTab('projects');
                        setTimeout(() => {
                            // Реальний клас: .project-card, onclick openProjectDetail(p.id)
                            const cards = document.querySelectorAll('.project-card');
                            let found = false;
                            cards.forEach(card => {
                                if (!found && card.getAttribute('onclick')?.includes(p.id)) {
                                    found = true;
                                    card.scrollIntoView({behavior:'smooth',block:'center'});
                                    card.style.outline='2px solid #3b82f6';
                                    setTimeout(()=>card.style.outline='',2000);
                                }
                            });
                        }, 500);
                    }
                });
            });
        }

        // ПРОЦЕСИ
        if (typeof processes !== 'undefined') {
            processes.filter(p =>
                (p.name||'').toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q)
            ).slice(0, 2).forEach(p => {
                const desc = p.description||'';
                results.push({
                    category:'Процеси', categoryIcon:'🔄',
                    title: p.name,
                    subtitle: desc.length>60 ? desc.substring(0,60)+'…' : desc,
                    badge:'Процес', badgeColor:'#06b6d4',
                    action: () => {
                        if (typeof switchTab==='function') switchTab('processes');
                        setTimeout(() => {
                            // Реальний клас: .process-pipeline-row, onclick openViewProcessModal(id)
                            const rows = document.querySelectorAll('.process-pipeline-row');
                            let found = false;
                            rows.forEach(row => {
                                if (!found && row.getAttribute('onclick')?.includes(p.id)) {
                                    found = true;
                                    row.scrollIntoView({behavior:'smooth',block:'center'});
                                    row.style.outline='2px solid #06b6d4';
                                    setTimeout(()=>row.style.outline='',2000);
                                }
                            });
                        }, 500);
                    }
                });
            });
        }

        return results;
    }

    function renderResults(results, q, containerId) {
        const r = document.getElementById(containerId);
        if (!r) return;

        if (results.length === 0) {
            r.style.display = 'block';
            r.innerHTML = `<div style="padding:1.5rem;text-align:center;color:#9ca3af;font-size:0.85rem;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">🔍</div>
                Нічого не знайдено за "<strong>${safeEsc(q)}</strong>"
            </div>`;
            return;
        }

        const grouped = {};
        results.forEach((res, idx) => {
            if (!grouped[res.category]) grouped[res.category] = {icon:res.categoryIcon,items:[]};
            grouped[res.category].items.push({...res, _flatIdx:idx});
        });

        let html = '';
        Object.entries(grouped).forEach(([cat, data]) => {
            html += `<div style="padding:0.5rem 0.75rem 0.2rem;font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;display:flex;align-items:center;gap:0.35rem;">
                <span>${data.icon}</span><span>${cat}</span></div>`;
            data.items.forEach(res => {
                const bc = safeCssColor(res.badgeColor);
                html += `<div class="gsearch-item" data-idx="${res._flatIdx}"
                    style="display:flex;align-items:center;gap:0.75rem;padding:0.55rem 0.75rem;cursor:pointer;border-radius:8px;margin:1px 4px;transition:background 0.1s;"
                    onmouseover="this.style.background='#f3f4f6'"
                    onmouseout="this.style.background=''">
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:0.88rem;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                            ${res.overdue?'<span style="color:#ef4444;margin-right:4px;">⚠</span>':''}${highlight(res.title,q)}
                        </div>
                        ${res.subtitle?`<div style="font-size:0.75rem;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${safeEsc(res.subtitle)}</div>`:''}
                    </div>
                    ${res.badge?`<span style="font-size:0.7rem;font-weight:600;color:${bc};background:${bc}18;border-radius:4px;padding:2px 6px;white-space:nowrap;">${safeEsc(res.badge)}</span>`:''}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>`;
            });
        });

        r.style.display = 'block';
        r.innerHTML = `<div style="padding:4px 0;">${html}</div>
            <div style="padding:0.4rem 0.75rem;border-top:1px solid #f3f4f6;font-size:0.7rem;color:#d1d5db;display:flex;justify-content:space-between;">
                <span>↑↓ навігація · Enter · Esc</span><span>${results.length} результатів</span>
            </div>`;
    }

    // ---- Search History ----
    const SEARCH_HISTORY_KEY = 'talko_search_history';
    function getSearchHistory() {
        try { return JSON.parse(sessionStorage.getItem(SEARCH_HISTORY_KEY) || '[]'); } catch { return []; }
    }
    function saveToSearchHistory(q) {
        if (!q || q.length < 2) return;
        const h = getSearchHistory().filter(x => x !== q);
        h.unshift(q);
        try { sessionStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(h.slice(0, 5))); } catch {}
    }
    function showSearchHistory(containerId) {
        const history = getSearchHistory();
        const container = document.getElementById(containerId);
        if (!container || history.length === 0) return;
        container.style.display = 'block';
        container.innerHTML = `
            <div style="padding:0.5rem 0.75rem;font-size:0.72rem;color:#9ca3af;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center;">
                <span>Останні запити</span>
                <button onclick="clearSearchHistory('${containerId}')" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:0.72rem;padding:0;">✕ очистити</button>
            </div>
            ${history.map(h => `
                <div class="gsearch-item" onclick="fillSearchQuery(${JSON.stringify(h)})" 
                     style="padding:0.5rem 0.75rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:#374151;">
                    <i data-lucide="clock" style="width:14px;height:14px;color:#9ca3af;flex-shrink:0;"></i>
                    ${h.replace(/</g,'&lt;')}
                </div>`).join('')}`;
        if (typeof lucide !== 'undefined') refreshIcons();
    }
    window.clearSearchHistory = function(containerId) {
        try { sessionStorage.removeItem(SEARCH_HISTORY_KEY); } catch {}
        const c = document.getElementById(containerId);
        if (c) c.style.display = 'none';
    };
    window.fillSearchQuery = function(q) {
        const inp = document.getElementById('globalSearchInput');
        if (inp) { inp.value = q; inp.dispatchEvent(new Event('input')); inp.focus(); }
    };
    // ---- End Search History ----

    window.globalSearch = function(query, mode) {
        const q = (query||'').trim().toLowerCase();
        activeIndex = -1;

        const desktopR = document.getElementById('globalSearchResults');
        const mobileR  = document.getElementById('mobileSearchResults');

        if (q.length < 1) {
            if (desktopR) desktopR.style.display = 'none';
            if (mobileR)  mobileR.style.display  = 'none';
            currentResults = [];
            return;
        }

        currentResults = buildResults(q);

        if (mode === 'mobile') {
            if (desktopR) desktopR.style.display = 'none';
            renderResults(currentResults, q, 'mobileSearchResults');
        } else {
            if (mobileR) mobileR.style.display = 'none';
            saveToSearchHistory(q);
            renderResults(currentResults, q, 'globalSearchResults');
        }
    };

    function selectResult(idx, isMobile) {
        const res = currentResults[idx];
        if (!res) return;
        res.action && res.action();
        hideGlobalSearch();
        // FIX БАГ D: очищаємо правильний input
        if (isMobile) {
            closeMobileSearch();
        } else {
            const inp = document.getElementById('globalSearchInput');
            if (inp) inp.value = '';
            if (document.getElementById('globalSearchResults'))
                document.getElementById('globalSearchResults').style.display = 'none';
        }
        currentResults = [];
        activeIndex = -1;
    }
    window.selectResult = selectResult;

    // --- МОБІЛЬНИЙ ПОШУК ---
    window.toggleMobileSearch = function() {
        const panel = document.getElementById('mobileSearchPanel');
        if (!panel) return;
        if (panel.style.display !== 'none') {
            closeMobileSearch();
        } else {
            panel.style.display = 'block';
            setTimeout(() => {
                const inp = document.getElementById('mobileSearchInput');
                if (inp) inp.focus();
            }, 100);
        }
    };

    window.closeMobileSearch = function() {
        const panel = document.getElementById('mobileSearchPanel');
        if (panel) panel.style.display = 'none';
        // FIX БАГ D: очищаємо mobile input
        const inp = document.getElementById('mobileSearchInput');
        if (inp) inp.value = '';
        const r = document.getElementById('mobileSearchResults');
        if (r) { r.style.display = 'none'; r.innerHTML = ''; }
        currentResults = [];
        activeIndex = -1;
    };

    // FIX БАГ C: show-mobile-only через JS, не клас
    function initMobileSearchBtn() {
        const btn = document.getElementById('mobileSearchBtn');
        if (!btn) return;
        btn.style.display = window.innerWidth < 768 ? 'flex' : 'none';
    }
    window.addEventListener('resize', initMobileSearchBtn);
    window.initMobileSearchBtn = initMobileSearchBtn;

})();
