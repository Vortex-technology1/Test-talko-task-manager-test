// =============================================
// MODULE 69: AI BOTTLENECK + OWNER PROJECT DASHBOARD
// Phase 3 — Intelligence layer
// =============================================
(function() {
    'use strict';

    // Дедуплікація cost_overrun — один запис в Firestore на проєкт на день
    const _costOverrunEmitted = new Set();

    // ========================
    //  OWNER PROJECT DASHBOARD
    // ========================
    function renderOwnerProjectDashboard() {
        const container = document.getElementById('ownerProjectDashboard');
        if (!container) return;

        const role = currentUserData?.role || 'employee';
        if (role !== 'owner' && role !== 'admin' && role !== 'manager') {
            container.innerHTML = '';
            return;
        }

        const activeProjects = projects.filter(p => p.status === 'active');
        const stages = typeof window.projectStages !== 'undefined' ? window.projectStages : [];
        const mats = typeof window.projectMaterials !== 'undefined' ? window.projectMaterials : [];

        if (activeProjects.length === 0) {
            container.innerHTML = '';
            return;
        }

        // Collect alerts
        const alerts = [];

        activeProjects.forEach(p => {
            const pStages = stages.filter(s => s.projectId === p.id);
            const pTasks = tasks.filter(t => t.projectId === p.id);
            const pMats = mats.filter(m => m.projectId === p.id);

            // Blocked stages
            const blocked = pStages.filter(s => s.status === 'blocked');
            blocked.forEach(s => {
                alerts.push({
                    type: 'blocked',
                    severity: 'critical',
                    project: p,
                    stage: s,
                    message: `Етап "${s.name}" заблоковано${s.blockedReason === 'materials' ? ' (матеріали)' : s.blockedReason === 'rework' ? ' (переробка)' : ''}`,
                });
            });

            // Overdue tasks
            const today = getLocalDateStr(new Date());
            const overdue = pTasks.filter(t => t.status !== 'done' && t.deadlineDate && t.deadlineDate < today);
            if (overdue.length > 0) {
                alerts.push({
                    type: 'overdue',
                    severity: overdue.length >= 5 ? 'critical' : 'warning',
                    project: p,
                    message: `${overdue.length} прострочених задач`,
                });
            }

            // Missing materials (needed but overdue delivery)
            const lateMats = pMats.filter(m =>
                m.status !== 'delivered' && m.status !== 'used' &&
                m.plannedDeliveryDate && m.plannedDeliveryDate < today
            );
            if (lateMats.length > 0) {
                alerts.push({
                    type: 'material',
                    severity: 'warning',
                    project: p,
                    message: `${lateMats.length} матеріалів із запізненням`,
                });
            }

            // Budget overrun (if we can calc)
            if (p.plannedRevenue && p.plannedMaterialCost) {
                const actualMatCost = pMats.reduce((s, m) => s + (m.costActual || 0), 0);
                if (actualMatCost > p.plannedMaterialCost * 1.1) {
                    alerts.push({
                        type: 'budget',
                        severity: 'warning',
                        project: p,
                        message: `Перевитрата матеріалів: ${Math.round(actualMatCost).toLocaleString()} / ${Math.round(p.plannedMaterialCost).toLocaleString()} ₴`,
                    });
                    // Emit cost_overrun event — один раз на проєкт на добу
                    if (typeof window.createProjectEvent === 'function') {
                        const dedupeKey = p.id + ':' + new Date().toISOString().split('T')[0];
                        if (!_costOverrunEmitted.has(dedupeKey)) {
                            _costOverrunEmitted.add(dedupeKey);
                            window.createProjectEvent('cost_overrun', {
                                projectId: p.id,
                                extra: {
                                    actual: Math.round(actualMatCost),
                                    planned: Math.round(p.plannedMaterialCost),
                                    overrunPct: Math.round((actualMatCost / p.plannedMaterialCost - 1) * 100),
                                }
                            });
                        }
                    }
                }
            }
        });

        // Sort alerts: critical first
        alerts.sort((a, b) => (a.severity === 'critical' ? 0 : 1) - (b.severity === 'critical' ? 0 : 1));

        // Render
        let html = `<div style="margin-bottom:1.5rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                <h3 style="font-size:1rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;margin:0;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    Проєкти (${activeProjects.length})
                    ${alerts.length > 0 ? `<span style="background:#ef4444;color:white;font-size:0.68rem;padding:2px 8px;border-radius:8px;">${alerts.filter(a=>a.severity==='critical').length} критичних</span>` : ''}
                </h3>
                <button onclick="openAIBottleneckAnalysis()" style="border:none;background:#f3e8ff;color:#7c3aed;padding:6px 14px;border-radius:10px;font-size:0.78rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    AI Аналіз
                </button>
            </div>`;

        // Alerts block
        if (alerts.length > 0) {
            html += `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:0.75rem;margin-bottom:0.75rem;">
                ${alerts.slice(0, 6).map(a => {
                    const icon = '';
                    const bg = a.severity === 'critical' ? '#fee2e2' : '#fef3c7';
                    return `<div style="display:flex;align-items:center;gap:0.5rem;padding:4px 0;font-size:0.78rem;">
                        <span>${icon}</span>
                        <span style="font-weight:600;color:#6b7280;">${esc(a.project.name)}</span>
                        <span style="flex:1;">${a.message}</span>
                    </div>`;
                }).join('')}
                ${alerts.length > 6 ? `<div style="font-size:0.72rem;color:#9ca3af;text-align:center;margin-top:4px;">...і ще ${alerts.length - 6} повідомлень</div>` : ''}
            </div>`;
        }

        // Project cards
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:0.75rem;">`;
        activeProjects.forEach(p => {
            const pStages = stages.filter(s => s.projectId === p.id);
            const pTasks = tasks.filter(t => t.projectId === p.id);
            const doneTasks = pTasks.filter(t => t.status === 'done').length;
            const total = pTasks.length;
            const pct = total > 0 ? Math.round((doneTasks / total) * 100) : 0;
            const blockedCount = pStages.filter(s => s.status === 'blocked').length;
            const doneStages = pStages.filter(s => s.status === 'done').length;
            const color = p.color || '#22c55e';

            html += `<div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:0.75rem 1rem;cursor:pointer;border-left:4px solid ${color};" onclick="openProjectDetail('${p.id}')">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-weight:700;font-size:0.88rem;">${esc(p.name)}</span>
                    ${blockedCount > 0 ? `<span style="background:#fee2e2;color:#dc2626;font-size:0.65rem;padding:2px 6px;border-radius:6px;">${blockedCount} blocked</span>` : ''}
                </div>
                ${p.clientName ? `<div style="font-size:0.72rem;color:#9ca3af;">${esc(p.clientName)}</div>` : ''}
                <div style="display:flex;gap:0.75rem;margin-top:6px;font-size:0.72rem;color:#6b7280;">
                    <span>Задачі: ${doneTasks}/${total}</span>
                    <span>Етапи: ${doneStages}/${pStages.length}</span>
                    ${p.plannedRevenue ? `<span>Бюджет: ${Number(p.plannedRevenue).toLocaleString()}₴</span>` : ''}
                </div>
                <div style="height:5px;background:#f3f4f6;border-radius:3px;margin-top:6px;">
                    <div style="height:100%;width:${pct}%;background:${color};border-radius:3px;transition:width 0.3s;"></div>
                </div>
            </div>`;
        });
        html += `</div></div>`;

        container.innerHTML = html;
    }

    // ========================
    //  AI BOTTLENECK DETECTION
    // ========================
    async function analyzeBottlenecks(projectId) {
        const project = projectId ? projects.find(p => p.id === projectId) : null;
        const stages = typeof window.projectStages !== 'undefined' ? window.projectStages : [];
        const mats = typeof window.projectMaterials !== 'undefined' ? window.projectMaterials : [];
        const qcs = typeof window.qualityChecks !== 'undefined' ? window.qualityChecks : [];

        const scope = projectId
            ? { stages: stages.filter(s => s.projectId === projectId), tasks: tasks.filter(t => t.projectId === projectId), mats: mats.filter(m => m.projectId === projectId) }
            : { stages, tasks, mats };

        const today = getLocalDateStr(new Date());
        const bottlenecks = [];

        // 1. Blocked stages analysis
        const blockedStages = scope.stages.filter(s => s.status === 'blocked');
        blockedStages.forEach(s => {
            const stageMats = scope.mats.filter(m => m.stageId === s.id);
            const undelivered = stageMats.filter(m => m.status !== 'delivered' && m.status !== 'used');
            const stageQCs = qcs.filter(q => q.stageId === s.id && q.status === 'rejected');

            let cause = 'Невідома причина блокування';
            let solutions = [];

            if (s.blockedReason === 'materials' && undelivered.length > 0) {
                cause = `Не доставлено ${undelivered.length} матеріалів: ${undelivered.map(m => m.name).join(', ')}`;
                solutions = [
                    { action: 'Зв\'язатися з постачальником для прискорення', risk: 'Низький', speed: 'Швидко' },
                    { action: 'Знайти альтернативного постачальника', risk: 'Середній', speed: '1-2 дні' },
                    { action: 'Переключити бригаду на інший етап', risk: 'Низький', speed: 'Одразу' },
                ];
            } else if (s.blockedReason === 'rework' || stageQCs.length > 0) {
                cause = `QC відхилено. Потрібна переробка.`;
                solutions = [
                    { action: 'Призначити досвідченого майстра на переробку', risk: 'Низький', speed: '1-2 дні' },
                    { action: 'Переглянути стандарт — можливо занадто жорсткі вимоги', risk: 'Середній', speed: 'Швидко' },
                    { action: 'Провести навчання для бригади', risk: 'Низький', speed: '3-5 днів' },
                ];
            }

            bottlenecks.push({
                type: 'stage_blocked',
                severity: 'critical',
                entity: s.name,
                projectName: project?.name || '',
                cause,
                solutions,
            });
        });

        // 2. Overdue tasks by function — pattern detection
        const funcOverdue = {};
        scope.tasks.filter(t => t.status !== 'done' && t.deadlineDate && t.deadlineDate < today).forEach(t => {
            const f = t.function || 'Без функції';
            if (!funcOverdue[f]) funcOverdue[f] = [];
            funcOverdue[f].push(t);
        });

        Object.entries(funcOverdue).forEach(([funcName, arr]) => {
            if (arr.length >= 3) {
                bottlenecks.push({
                    type: 'function_overload',
                    severity: arr.length >= 5 ? 'critical' : 'warning',
                    entity: funcName,
                    projectName: project?.name || 'Всі проєкти',
                    cause: `${arr.length} прострочених задач у функції "${funcName}". Можливо: перевантаження, некомпетентність, або нереалістичні дедлайни.`,
                    solutions: [
                        { action: 'Перерозподілити задачі на інших виконавців', risk: 'Низький', speed: 'Одразу' },
                        { action: 'Переглянути дедлайни — встановити реалістичні', risk: 'Низький', speed: 'Швидко' },
                        { action: 'Додати людину в функцію (тимчасово)', risk: 'Середній', speed: '1-3 дні' },
                        { action: 'Провести розмову з відповідальним для з\'ясування причин', risk: 'Низький', speed: 'Швидко' },
                    ],
                });
            }
        });

        // 3. Stages without progress (stalled)
        scope.stages.filter(s => s.status === 'in_progress').forEach(s => {
            const stageTasks = scope.tasks.filter(t => t.stageId === s.id);
            const activeDays = s.actualStartDate
                ? Math.floor((new Date() - new Date(s.actualStartDate)) / 86400000)
                : 0;
            const progress = s.progressPct || 0;

            if (activeDays > 5 && progress < 20) {
                bottlenecks.push({
                    type: 'stalled_stage',
                    severity: 'warning',
                    entity: s.name,
                    projectName: project?.name || '',
                    cause: `Етап в роботі ${activeDays} днів, але прогрес лише ${progress}%. ${stageTasks.length === 0 ? 'Немає задач — етап без конкретних кроків.' : `${stageTasks.filter(t=>t.status==='done').length}/${stageTasks.length} задач виконано.`}`,
                    solutions: [
                        { action: 'Декомпозувати етап на конкретні задачі', risk: 'Низький', speed: 'Швидко' },
                        { action: 'З\'ясувати реальну причину з відповідальним', risk: 'Низький', speed: 'Одразу' },
                        { action: 'Змінити відповідального', risk: 'Середній', speed: '1 день' },
                    ],
                });
            }
        });

        // 4. Material delays pattern
        const lateMatsBySupplier = {};
        scope.mats.filter(m =>
            m.status !== 'delivered' && m.status !== 'used' &&
            m.plannedDeliveryDate && m.plannedDeliveryDate < today
        ).forEach(m => {
            const sup = m.supplierName || 'Невідомий';
            if (!lateMatsBySupplier[sup]) lateMatsBySupplier[sup] = [];
            lateMatsBySupplier[sup].push(m);
        });

        Object.entries(lateMatsBySupplier).forEach(([sup, arr]) => {
            if (arr.length >= 2) {
                bottlenecks.push({
                    type: 'supplier_issue',
                    severity: 'warning',
                    entity: sup,
                    projectName: project?.name || 'Всі проєкти',
                    cause: `Постачальник "${sup}" затримав ${arr.length} позицій: ${arr.map(m => m.name).join(', ')}`,
                    solutions: [
                        { action: 'Терміновий дзвінок постачальнику з вимогою термінів', risk: 'Низький', speed: 'Одразу' },
                        { action: 'Знайти альтернативного постачальника', risk: 'Середній', speed: '1-2 дні' },
                        { action: 'Замовити аналог з іншого джерела', risk: 'Середній', speed: '1-3 дні' },
                    ],
                });
            }
        });

        return bottlenecks;
    }

    // ========================
    //  AI ANALYSIS MODAL
    // ========================
    window.openAIBottleneckAnalysis = async function(projectId) {
        let modal = document.getElementById('aiBottleneckModal');
        if (!modal) {
            modal = document.createElement('div'); modal.id = 'aiBottleneckModal'; modal.className = 'modal';
            modal.innerHTML = '<div class="modal-content" style="max-width:700px;max-height:85vh;overflow-y:auto;"></div>';
            document.body.appendChild(modal);
        }

        modal.querySelector('.modal-content').innerHTML = `
            <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;">
                <h2 style="font-size:1.1rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    AI Аналіз вузьких місць
                </h2>
                <span class="close" onclick="closeModal('aiBottleneckModal')" style="font-size:1.5rem;cursor:pointer;">&times;</span>
            </div>
            <div style="text-align:center;padding:2rem;"><div class="spinner" style="width:24px;height:24px;border-width:3px;margin:0 auto;"></div><div style="margin-top:0.5rem;color:#9ca3af;font-size:0.85rem;">Аналізую дані...</div></div>`;
        modal.style.display = 'flex';

        // Load data first
        if (typeof window.loadProjectStages === 'function') {
            await Promise.all([
                projectId ? window.loadProjectStages(projectId) : window.loadProjectStages(),
                projectId ? window.loadProjectMaterials(projectId) : window.loadProjectMaterials(),
                typeof window.loadQualityChecks === 'function' ? window.loadQualityChecks(projectId) : Promise.resolve([]),
            ]);
        }

        const bottlenecks = await analyzeBottlenecks(projectId);

        const severityColors = { critical: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
        const severityLabels = { critical: 'Критично', warning: 'Увага', info: 'Інфо' };
        const typeIcons = {
            stage_blocked: '', function_overload: '', stalled_stage: '',
            supplier_issue: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>', budget_overrun: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
        };

        let html = `
        <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;">
            <h2 style="font-size:1.1rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                AI Аналіз ${projectId ? '"' + esc((projects.find(p=>p.id===projectId)||{}).name || '') + '"' : 'всіх проєктів'}
            </h2>
            <span class="close" onclick="closeModal('aiBottleneckModal')" style="font-size:1.5rem;cursor:pointer;">&times;</span>
        </div>`;

        if (bottlenecks.length === 0) {
            html += `<div style="text-align:center;padding:2rem;">
                <div style="margin-bottom:0.5rem;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg></div>
                <div style="font-weight:700;font-size:1rem;">Вузьких місць не знайдено</div>
                <div style="color:#9ca3af;font-size:0.85rem;margin-top:0.25rem;">Всі проєкти працюють в нормі</div>
            </div>`;
        } else {
            html += `<div style="background:#fef2f2;border-radius:12px;padding:0.75rem 1rem;margin-bottom:1rem;">
                <span style="font-weight:700;color:#dc2626;">Знайдено ${bottlenecks.length} вузьких місць</span>
                <span style="font-size:0.78rem;color:#9ca3af;margin-left:0.5rem;">${bottlenecks.filter(b=>b.severity==='critical').length} критичних</span>
            </div>`;

            bottlenecks.forEach((b, i) => {
                const color = severityColors[b.severity] || '#9ca3af';
                const label = severityLabels[b.severity] || '';
                const icon = typeIcons[b.type] || '';

                html += `<div style="border:1px solid #e5e7eb;border-left:4px solid ${color};border-radius:12px;padding:0.75rem 1rem;margin-bottom:0.75rem;${b.severity==='critical'?'background:#fef2f2;':''}">
                    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:6px;">
                        <span style="font-size:1.1rem;">${icon}</span>
                        <span style="font-weight:700;font-size:0.9rem;">${esc(b.entity)}</span>
                        <span style="font-size:0.65rem;padding:2px 6px;border-radius:6px;background:${color}20;color:${color};font-weight:600;">${label}</span>
                        ${b.projectName ? `<span style="font-size:0.68rem;color:#9ca3af;">— ${esc(b.projectName)}</span>` : ''}
                    </div>
                    <div style="font-size:0.82rem;color:#374151;margin-bottom:8px;">${esc(b.cause)}</div>
                    <div style="font-size:0.72rem;font-weight:600;color:#6b7280;margin-bottom:4px;">Варіанти рішень:</div>
                    ${b.solutions.map((s, si) => `
                        <div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;font-size:0.78rem;">
                            <span style="min-width:18px;height:18px;border-radius:50%;background:${color}15;color:${color};font-size:0.65rem;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${si+1}</span>
                            <span style="flex:1;">${esc(s.action)}</span>
                            <span style="font-size:0.65rem;color:#9ca3af;white-space:nowrap;">${esc(s.speed)}</span>
                        </div>
                    `).join('')}
                    ${b.type === 'function_overload' ? `<button onclick="createTasksFromBottleneck('${esc(b.entity)}','${b.type}')" style="margin-top:6px;border:none;background:#f0fdf4;color:#16a34a;font-size:0.72rem;padding:4px 12px;border-radius:8px;cursor:pointer;font-weight:600;">→ Створити задачу на перерозподіл</button>` : ''}
                    ${b.type === 'supplier_issue' ? `<button onclick="createTasksFromBottleneck('${esc(b.entity)}','${b.type}')" style="margin-top:6px;border:none;background:#eff6ff;color:#3b82f6;font-size:0.72rem;padding:4px 12px;border-radius:8px;cursor:pointer;font-weight:600;">→ Створити задачу на закупівлю</button>` : ''}
                </div>`;
            });
        }

        modal.querySelector('.modal-content').innerHTML = html;
    };

    // Create tasks from bottleneck recommendations
    window.createTasksFromBottleneck = async function(entity, type) {
        let title = '', description = '';

        if (type === 'function_overload') {
            title = `Перерозподілити задачі: ${entity}`;
            description = `AI виявив перевантаження функції "${entity}". Потрібно:\n1. Переглянути список прострочених задач\n2. Перепризначити частину на інших\n3. Скоригувати дедлайни нереалістичних задач`;
        } else if (type === 'supplier_issue') {
            title = `Вирішити затримку постачальника: ${entity}`;
            description = `AI виявив систематичну затримку від "${entity}". Потрібно:\n1. Зв'язатися з постачальником\n2. Отримати нові терміни\n3. При потребі — знайти альтернативу`;
        }

        try {
            const newTask = {
                title,
                description,
                status: 'new',
                priority: 'high',
                deadlineDate: getLocalDateStr(new Date(Date.now() + 86400000)),
                assigneeId: currentUser.uid,
                assigneeName: currentUserData?.name || currentUser.email || '',
                creatorId: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            const ref = await db.collection('companies').doc(currentCompany).collection('tasks').add(newTask);
            // Оновлюємо локальний масив без повного reload
            if (typeof tasks !== 'undefined') {
                tasks.unshift({ ...newTask, id: ref.id, createdAt: new Date(), updatedAt: new Date() });
            }
            showToast('Задачу створено', 'success');
            // Оновлюємо всі активні views
            if (typeof renderMyDay === 'function') renderMyDay();
            if (typeof refreshCurrentView === 'function') refreshCurrentView();
            if (typeof renderControl === 'function') {
                const controlTab = document.getElementById('controlTab');
                if (controlTab && controlTab.classList.contains('active')) renderControl();
            }
        } catch (e) {
            showToast('Помилка: ' + e.message, 'error');
        }
    };

    // ========================
    //  PROJECT HEALTH SCORE
    // ========================
    function calcProjectHealth(projectId) {
        const pStages = (typeof window.projectStages !== 'undefined' ? window.projectStages : []).filter(s => s.projectId === projectId);
        const pTasks = tasks.filter(t => t.projectId === projectId);
        const pMats = (typeof window.projectMaterials !== 'undefined' ? window.projectMaterials : []).filter(m => m.projectId === projectId);
        const today = getLocalDateStr(new Date());

        let score = 100;

        // Blocked stages: -15 each
        score -= pStages.filter(s => s.status === 'blocked').length * 15;

        // Overdue tasks: -3 each
        score -= pTasks.filter(t => t.status !== 'done' && t.deadlineDate && t.deadlineDate < today).length * 3;

        // Late materials: -5 each
        score -= pMats.filter(m => m.status !== 'delivered' && m.status !== 'used' && m.plannedDeliveryDate && m.plannedDeliveryDate < today).length * 5;

        // No stages defined: -10
        if (pStages.length === 0 && pTasks.length > 0) score -= 10;

        return Math.max(0, Math.min(100, score));
    }

    // ========================
    //  ADD AI BUTTON TO PROJECT DETAIL
    // ========================
    // Hook into renderProjectDetail to add AI button
    const _origRenderProjectDetail = window.renderProjectDetail;
    if (_origRenderProjectDetail) {
        window.renderProjectDetail = function(projectId) {
            _origRenderProjectDetail(projectId);

            // Add AI button and health score after header renders
            requestAnimationFrame(() => {
                const header = document.querySelector('.project-detail-header');
                if (!header) return;

                // Check if already added
                if (header.querySelector('.ai-bottleneck-btn')) return;

                const health = calcProjectHealth(projectId);
                const healthColor = health >= 80 ? '#22c55e' : health >= 50 ? '#f59e0b' : '#ef4444';

                const aiBtn = document.createElement('button');
                aiBtn.className = 'btn btn-small ai-bottleneck-btn';
                aiBtn.style.cssText = 'padding:0.3rem 0.6rem;font-size:0.78rem;background:#f3e8ff;color:#7c3aed;border-color:#e9d5ff;';
                aiBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-2px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> AI`;
                aiBtn.onclick = () => window.openAIBottleneckAnalysis(projectId);

                const healthBadge = document.createElement('span');
                healthBadge.style.cssText = `font-size:0.72rem;padding:2px 8px;border-radius:8px;background:${healthColor}15;color:${healthColor};font-weight:700;`;
                healthBadge.textContent = `${health}%`;
                healthBadge.title = 'Health Score';

                const btnContainer = header.querySelector('div:last-child');
                if (btnContainer) {
                    btnContainer.prepend(healthBadge);
                    btnContainer.prepend(aiBtn);
                }
            });
        };
    }

    // ========================
    //  HOOK INTO CONTROL DASHBOARD
    // ========================
    // Add project overview to existing control tab
    const _origRenderControl = window.renderControl;
    if (typeof _origRenderControl === 'function') {
        window.renderControl = function() {
            _origRenderControl();
            renderOwnerProjectDashboard();
        };
    }

    // ========================
    //  EXPORTS
    // ========================
    window.renderOwnerProjectDashboard = renderOwnerProjectDashboard;
    window.analyzeBottlenecks = analyzeBottlenecks;
    window.calcProjectHealth = calcProjectHealth;

})();
