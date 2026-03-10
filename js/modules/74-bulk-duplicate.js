// =============================================
// MODULE 74 — BULK SELECT + DUPLICATE TASK
// =============================================
(function() {
    'use strict';
    let selectedTaskIds = new Set();
    let bulkModeActive = false;

    // ========================
    // BULK MODE TOGGLE
    // ========================
    window.toggleBulkMode = function() {
        bulkModeActive = !bulkModeActive;
        selectedTaskIds.clear();
        const bar = document.getElementById('bulkActionBar');
        const btn = document.getElementById('bulkModeBtn');
        if (bar) bar.style.display = bulkModeActive ? 'flex' : 'none';
        if (btn) {
            btn.style.background = bulkModeActive ? '#ef4444' : '#f3f4f6';
            btn.style.color = bulkModeActive ? 'white' : '#374151';
            btn.title = bulkModeActive ? 'Вийти з режиму вибору' : 'Виділити кілька задач';
            btn.innerHTML = bulkModeActive
                ? '<i data-lucide="x" class="icon icon-sm"></i>'
                : '<i data-lucide="check-square" class="icon icon-sm"></i>';
            if (typeof lucide !== 'undefined') refreshIcons();
        }
        refreshCurrentView();
    };

    window.isBulkModeActive = () => bulkModeActive;

    // ========================
    // SELECT / DESELECT задачу
    // ========================
    window.toggleBulkSelect = function(taskId, e) {
        if (e) e.stopPropagation();
        if (selectedTaskIds.has(taskId)) {
            selectedTaskIds.delete(taskId);
        } else {
            selectedTaskIds.add(taskId);
        }
        updateBulkUI();
    };

    window.isTaskSelected = (id) => selectedTaskIds.has(id);

    function updateBulkUI() {
        const count = selectedTaskIds.size;
        const counter = document.getElementById('bulkCounter');
        if (counter) counter.textContent = count > 0 ? `Обрано: ${count}` : 'Нічого не обрано';

        const actBtns = document.querySelectorAll('.bulk-action-btn');
        actBtns.forEach(b => b.disabled = count === 0);

        // Оновлюємо чекбокси в таблиці
        document.querySelectorAll('[data-bulk-id]').forEach(cb => {
            const id = cb.dataset.bulkId;
            cb.checked = selectedTaskIds.has(id);
            const row = cb.closest('tr') || cb.closest('.mobile-task-card');
            if (row) row.style.background = selectedTaskIds.has(id) ? '#f0fdf4' : '';
        });
    }

    window.bulkSelectAll = function() {
        const visible = document.querySelectorAll('[data-bulk-id]');
        const allSelected = visible.length > 0 && [...visible].every(cb => selectedTaskIds.has(cb.dataset.bulkId));
        if (allSelected) {
            visible.forEach(cb => selectedTaskIds.delete(cb.dataset.bulkId));
        } else {
            visible.forEach(cb => selectedTaskIds.add(cb.dataset.bulkId));
        }
        updateBulkUI();
    };

    // ========================
    // BULK DELETE
    // ========================
    window.bulkDelete = async function() {
        if (selectedTaskIds.size === 0) return;
        const confirmed = await showConfirmModal(
            `Видалити ${selectedTaskIds.size} завдань? Дію не можна скасувати.`,
            { danger: true }
        );
        if (!confirmed) return;

        const ids = [...selectedTaskIds];
        selectedTaskIds.clear();
        updateBulkUI();

        // Фільтруємо тільки ті де є право на видалення (як у bulkReassign)
        const deletableIds = ids.filter(id => {
            const task = tasks.find(t => t.id === id);
            return task && (typeof canEditTask === 'function' ? canEditTask(task) : true);
        });
        const skipped = ids.length - deletableIds.length;
        if (skipped > 0) {
            showToast(`Пропущено ${skipped} завдань — немає прав на видалення`, 'warning');
        }
        if (deletableIds.length === 0) return;

        // Збираємо підзадачі батьківських задач — cascade delete (ТЗ БАГ 4)
        const subtaskIds = tasks
            .filter(t => t.parentId && deletableIds.includes(t.parentId))
            .map(t => t.id);
        const allDeleteIds = [...new Set([...deletableIds, ...subtaskIds])];
        if (subtaskIds.length > 0) {
            showToast && showToast(`Також видаляємо ${subtaskIds.length} підзадач`, 'info');
        }

        let deleted = 0;
        // Батчимо по 450 — Firestore limit
        for (let i = 0; i < allDeleteIds.length; i += 450) {
            const chunk = allDeleteIds.slice(i, i + 450);
            const batch = firebase.firestore().batch();
            for (const id of chunk) {
                const ref = firebase.firestore()
                    .collection('companies').doc(currentCompany)
                    .collection('tasks').doc(id);
                batch.delete(ref);
            }
            try { await batch.commit(); deleted += chunk.length; } catch(e) { console.error('batch delete', e); }
        }
        try {
            tasks = tasks.filter(t => !allDeleteIds.includes(t.id));
            deleted = deletableIds.length;
            renderMyDay();
            refreshCurrentView();
            showToast(`Видалено ${deleted} завдань`, 'success');
            toggleBulkMode();
        } catch(err) {
            showAlertModal('Помилка видалення: ' + err.message);
        }
    };

    // ========================
    // BULK REASSIGN
    // ========================
    window.bulkReassign = function() {
        if (selectedTaskIds.size === 0) return;
        const ids = [...selectedTaskIds];
        const userOpts = (typeof users !== 'undefined')
            ? users.map(u => `<option value="${u.id}">${(u.name||u.email).replace(/</g,'&lt;')}</option>`).join('')
            : '';

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;padding:1rem;';
        overlay.innerHTML = `
            <div style="background:white;border-radius:16px;padding:1.5rem;width:100%;max-width:360px;">
                <h3 style="margin:0 0 1rem;font-size:1rem;">👤 Перепризначити ${ids.length} завдань</h3>
                <select id="bulkAssigneeSelect" style="width:100%;padding:0.5rem;border:1px solid #e5e7eb;border-radius:8px;font-size:0.88rem;margin-bottom:1rem;">
                    <option value="">— Оберіть виконавця —</option>
                    ${userOpts}
                </select>
                <div style="display:flex;gap:0.5rem;">
                    <button onclick="this.closest('div[style]').remove()" 
                        style="flex:1;padding:0.5rem;border:1px solid #e5e7eb;background:white;border-radius:8px;cursor:pointer;">
                        Скасувати
                    </button>
                    <button onclick="bulkReassignConfirm(${JSON.stringify(ids)})"
                        style="flex:2;padding:0.5rem;background:#22c55e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">
                        Перепризначити
                    </button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
    };

    window.bulkReassignConfirm = async function(ids) {
        const assigneeId = document.getElementById('bulkAssigneeSelect')?.value;
        if (!assigneeId) { showToast('Оберіть виконавця', 'error'); return; }
        const assignee = (typeof users !== 'undefined') ? users.find(u => u.id === assigneeId) : null;
        const assigneeName = assignee?.name || assignee?.email || '';

        document.querySelector('div[style*="z-index:999999"]')?.remove();

        // P1 FIX: фільтруємо тільки задачі де є права на редагування
        const editableIds = ids.filter(id => {
            const task = tasks.find(t => t.id === id);
            return task && (typeof canEditTask === 'function' ? canEditTask(task) : true);
        });
        if (editableIds.length < ids.length) {
            showToast(`Пропущено ${ids.length - editableIds.length} завдань — немає прав на редагування`, 'warning');
        }
        if (editableIds.length === 0) return;

        const batch = firebase.firestore().batch();
        for (const id of editableIds) {
            const ref = firebase.firestore()
                .collection('companies').doc(currentCompany)
                .collection('tasks').doc(id);
            batch.update(ref, {
                assigneeId,
                assigneeName,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        try {
            await batch.commit();
            tasks.forEach(t => {
                if (editableIds.includes(t.id)) { t.assigneeId = assigneeId; t.assigneeName = assigneeName; }
            });
            selectedTaskIds.clear();
            renderMyDay();
            refreshCurrentView();
            updateBulkUI();
            showToast(`${editableIds.length} завдань перепризначено → ${assigneeName}`, 'success');
            toggleBulkMode();
        } catch(err) {
            showAlertModal('Помилка: ' + err.message);
        }
    };

    // ========================
    // DUPLICATE TASK
    // ========================
    window.duplicateTask = async function(taskId) {
        const orig = tasks.find(t => t.id === taskId);
        if (!orig) return;

        const clone = Object.assign({}, orig);
        // Прибираємо поля що не клонуються
        delete clone.id;
        delete clone.createdAt;
        delete clone.updatedAt;
        delete clone.completedAt;
        delete clone.completedDate;
        delete clone.calendarEventId;
        delete clone.sentForReviewAt;
        delete clone.reviewedAt;
        delete clone.reviewedBy;
        delete clone._openedAt;
        // P1 FIX: копія стає самостійним завданням, а не підзавданням
        delete clone.parentId;
        delete clone.parentTitle;

        clone.title = `${orig.title} (копія)`;
        clone.status = 'new';
        clone.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        clone.createdDate = (typeof getLocalDateStr === 'function') ? getLocalDateStr(new Date()) : new Date().toISOString().split('T')[0];
        clone.creatorId = currentUser.uid;
        clone.creatorName = currentUserData?.name || currentUser.email;
        clone.pinned = false;
        clone.source = 'duplicate';

        try {
            const ref = await firebase.firestore()
                .collection('companies').doc(currentCompany)
                .collection('tasks').add(clone);

            tasks.unshift({ id: ref.id, ...clone, createdAt: new Date() });
            renderMyDay();
            refreshCurrentView();
            showToast('✓ Завдання скопійовано', 'success');

            // Відкриваємо копію для редагування
            setTimeout(() => openTaskModal(ref.id), 300);
        } catch(err) {
            showAlertModal('Помилка копіювання: ' + err.message);
        }
    };

    // ========================
    // ІНІЦІАЛІЗАЦІЯ UI
    // ========================
    window.initBulkUI = function() {
        // Кнопка режиму в toolbar
        const toolbar = document.querySelector('.tasks-toolbar, .filter-bar, #tasksToolbar');
        if (toolbar && !document.getElementById('bulkModeBtn')) {
            const btn = document.createElement('button');
            btn.id = 'bulkModeBtn';
            btn.title = 'Виділити кілька задач';
            btn.onclick = toggleBulkMode;
            btn.style.cssText = 'background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:0.4rem 0.6rem;cursor:pointer;display:flex;align-items:center;gap:0.3rem;font-size:0.8rem;color:#374151;';
            btn.innerHTML = '<i data-lucide="check-square" class="icon icon-sm"></i>';
            toolbar.appendChild(btn);
        }

        // Панель bulk actions
        if (!document.getElementById('bulkActionBar')) {
            const bar = document.createElement('div');
            bar.id = 'bulkActionBar';
            bar.style.cssText = 'display:none;position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:white;border:1px solid #e5e7eb;border-radius:14px;padding:0.6rem 1rem;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:9999;gap:0.5rem;align-items:center;flex-wrap:wrap;max-width:90vw;';
            bar.innerHTML = `
                <span id="bulkCounter" style="font-size:0.8rem;color:#6b7280;white-space:nowrap;">Нічого не обрано</span>
                <button class="bulk-action-btn" onclick="bulkSelectAll()" disabled
                    style="padding:0.35rem 0.7rem;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;cursor:pointer;font-size:0.78rem;">
                    Всі
                </button>
                <button class="bulk-action-btn" onclick="bulkReassign()" disabled
                    style="padding:0.35rem 0.7rem;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.78rem;">
                    👤 Змінити виконавця
                </button>
                <button class="bulk-action-btn" onclick="bulkDelete()" disabled
                    style="padding:0.35rem 0.7rem;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.78rem;">
                    🗑 Видалити
                </button>
                <button onclick="toggleBulkMode()"
                    style="padding:0.35rem 0.7rem;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;cursor:pointer;font-size:0.78rem;color:#6b7280;">
                    <span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span> Вийти
                </button>`;
            document.body.appendChild(bar);
        }
        if (typeof lucide !== 'undefined') refreshIcons();
    };

    // Ініціалізуємо після DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initBulkUI, 1500));
    } else {
        setTimeout(initBulkUI, 1500);
    }

})();
