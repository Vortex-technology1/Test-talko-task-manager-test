// =====================
        // USER CHECKBOXES (co-executors, observers)
        // =====================
'use strict';
        function renderUserCheckboxes(containerId, selectedIds = []) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const uid = containerId + '_ms';
            const selectedSet = new Set(selectedIds);
            
            // Count selected
            const selCount = selectedIds.length;
            const selNames = users.filter(u => selectedSet.has(u.id)).map(u => u.name || u.email).slice(0, 3).join(', ');
            const moreText = selCount > 3 ? ` +${selCount - 3}` : '';
            const btnLabel = selCount > 0 ? `${selNames}${moreText}` : t('selectPlaceholder');
            
            container.innerHTML = `
                <div class="user-multiselect" id="${uid}" style="position:relative;width:100%;">
                    <div class="user-ms-toggle" onclick="toggleUserMultiSelect('${uid}')" 
                         style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;background:white;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-size:0.85rem;min-height:38px;transition:border-color 0.2s;">
                        <span class="user-ms-label" style="color:${selCount ? '#1a1a1a' : '#9ca3af'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${esc(btnLabel)}</span>
                        <span style="color:#9ca3af;margin-left:0.5rem;display:flex;align-items:center;gap:0.3rem;">
                            ${selCount ? '<span style="background:#22c55e;color:white;font-size:0.7rem;padding:1px 6px;border-radius:10px;font-weight:600;">'+selCount+'</span>' : ''}
                            <i data-lucide="chevron-down" class="icon" style="width:14px;height:14px;"></i>
                        </span>
                    </div>
                    <div class="user-ms-dropdown" style="display:none;position:absolute;top:100%;left:0;right:0;margin-top:4px;background:white;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:200;max-height:240px;overflow:hidden;">
                        <div style="padding:0.4rem;border-bottom:1px solid #f3f4f6;">
                            <input type="text" placeholder="" data-i18n-placeholder="search" 
                                   oninput="filterUserMultiSelect('${uid}', this.value)"
                                   style="width:100%;padding:0.4rem 0.6rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.82rem;outline:none;" 
                                   onfocus="this.style.borderColor='#22c55e'" onblur="this.style.borderColor='#e5e7eb'">
                        </div>
                        <div class="user-ms-list" style="overflow-y:auto;max-height:190px;padding:0.25rem;">
                            ${users.map(user => {
                                const checked = selectedSet.has(user.id);
                                const roleIcon = user.role === 'owner' ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg> ' : user.role === 'manager' ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ' : '';
                                return `<label class="user-ms-item" data-name="${esc((user.name || user.email).toLowerCase())}" 
                                                style="display:flex;align-items:center;gap:0.5rem;padding:0.45rem 0.6rem;cursor:pointer;border-radius:6px;font-size:0.84rem;transition:background 0.1s;${checked ? 'background:#f0fdf4;' : ''}" 
                                                onmouseover="if(!this.querySelector('input').checked)this.style.background='#f9fafb'" 
                                                onmouseout="if(!this.querySelector('input').checked)this.style.background=''">
                                    <input type="checkbox" value="${user.id}" ${checked ? 'checked' : ''} 
                                           style="width:16px;height:16px;accent-color:#22c55e;flex-shrink:0;" 
                                           onchange="onUserMultiSelectChange('${uid}', '${containerId}')">
                                    <span>${roleIcon}${esc(user.name || user.email)}</span>
                                </label>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
            refreshIcons();
        }
        
        function resetDropdownPosition(dd) {
            dd.style.position = 'absolute';
            dd.style.top = '100%';
            dd.style.bottom = '';
            dd.style.left = '0';
            dd.style.right = '0';
            dd.style.width = '';
            dd.style.zIndex = '200';
            dd.style.maxHeight = '';
            dd.style.marginTop = '4px';
        }
        
        function toggleUserMultiSelect(uid) {
            const wrap = document.getElementById(uid);
            if (!wrap) return;
            const dd = wrap.querySelector('.user-ms-dropdown');
            const toggle = wrap.querySelector('.user-ms-toggle');
            const isOpen = dd.style.display !== 'none';
            const isMobile = window.innerWidth < 768;
            
            // Close all other dropdowns
            document.querySelectorAll('.user-ms-dropdown').forEach(d => { d.style.display = 'none'; resetDropdownPosition(d); });
            document.querySelectorAll('.user-ms-toggle').forEach(t => t.style.borderColor = '#d1d5db');
            
            if (!isOpen) {
                if (isMobile) {
                    // Mobile: inline — просто розгортаємо під toggle (position:relative)
                    dd.style.position = 'relative';
                    dd.style.top = '';
                    dd.style.left = '';
                    dd.style.right = '';
                    dd.style.bottom = '';
                    dd.style.width = '100%';
                    dd.style.zIndex = '';
                    dd.style.maxHeight = '200px';
                    dd.style.marginTop = '4px';
                } else {
                    // Desktop: fixed to escape overflow clipping
                    const rect = toggle.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const ddHeight = 240;
                    
                    dd.style.position = 'fixed';
                    dd.style.left = rect.left + 'px';
                    dd.style.width = rect.width + 'px';
                    dd.style.zIndex = '9999';
                    dd.style.marginTop = '';
                    
                    if (spaceBelow >= ddHeight || spaceBelow >= rect.top) {
                        dd.style.top = rect.bottom + 4 + 'px';
                        dd.style.bottom = '';
                        dd.style.maxHeight = Math.min(ddHeight, spaceBelow - 8) + 'px';
                    } else {
                        dd.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
                        dd.style.top = '';
                        dd.style.maxHeight = Math.min(ddHeight, rect.top - 8) + 'px';
                    }
                }
                
                dd.style.display = 'block';
                toggle.style.borderColor = '#22c55e';
                const inp = dd.querySelector('input[type="text"]');
                if (inp && !isMobile) setTimeout(() => inp.focus(), 50);
                
                // Close on outside click or scroll (desktop only)
                const closeHandler = (e) => {
                    if (!wrap.contains(e.target) && !dd.contains(e.target)) {
                        dd.style.display = 'none';
                        resetDropdownPosition(dd);
                        toggle.style.borderColor = '#d1d5db';
                        document.removeEventListener('click', closeHandler);
                        if (!isMobile) document.removeEventListener('scroll', scrollHandler, true);
                    }
                };
                const scrollHandler = (e) => {
                    if (dd.contains(e.target)) return;
                    dd.style.display = 'none';
                    resetDropdownPosition(dd);
                    toggle.style.borderColor = '#d1d5db';
                    document.removeEventListener('click', closeHandler);
                    document.removeEventListener('scroll', scrollHandler, true);
                };
                setTimeout(() => {
                    document.addEventListener('click', closeHandler);
                    if (!isMobile) {
                        document.addEventListener('scroll', scrollHandler, true);
                        // Додатково вішаємо на scroll модального контейнера
                        const modalScroller = dd.closest('.modal-body, .modal-content, .task-modal-body') ||
                            (() => {
                                let el = dd.parentElement;
                                while (el && el !== document.body) {
                                    const s = window.getComputedStyle(el);
                                    if (s.overflowY === 'auto' || s.overflowY === 'scroll') return el;
                                    el = el.parentElement;
                                }
                                return null;
                            })();
                        if (modalScroller) modalScroller.addEventListener('scroll', scrollHandler, { passive: true });
                    }
                }, 10);
            }
        }
        
        function filterUserMultiSelect(uid, query) {
            const wrap = document.getElementById(uid);
            if (!wrap) return;
            const q = query.toLowerCase();
            wrap.querySelectorAll('.user-ms-item').forEach(item => {
                item.style.display = item.dataset.name.includes(q) ? 'flex' : 'none';
            });
        }
        
        function onUserMultiSelectChange(uid, containerId) {
            const wrap = document.getElementById(uid);
            if (!wrap) return;
            // Update toggle label
            const checked = Array.from(wrap.querySelectorAll('.user-ms-item input:checked'));
            const names = checked.map(cb => {
                const label = cb.closest('.user-ms-item');
                return label ? label.querySelector('span').textContent.trim() : '';
            });
            const count = checked.length;
            const labelEl = wrap.querySelector('.user-ms-label');
            if (count === 0) {
                labelEl.textContent = t('selectPlaceholder');
                labelEl.style.color = '#9ca3af';
            } else {
                labelEl.textContent = names.slice(0, 3).join(', ') + (count > 3 ? ` +${count - 3}` : '');
                labelEl.style.color = '#1a1a1a';
            }
            // Update counter badge
            const badge = wrap.querySelector('.user-ms-toggle');
            const existingBadge = badge.querySelector('span[style*="background:#22c55e"]');
            if (existingBadge) {
                if (count > 0) { existingBadge.textContent = count; existingBadge.style.display = ''; }
                else existingBadge.style.display = 'none';
            }
            // Update item bg
            wrap.querySelectorAll('.user-ms-item').forEach(item => {
                const cb = item.querySelector('input');
                item.style.background = cb.checked ? '#f0fdf4' : '';
            });
        }
        
        function getSelectedUsersFromCheckboxes(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return [];
            return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        }
