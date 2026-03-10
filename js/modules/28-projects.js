// =====================
        // PROJECTS
        // =====================
'use strict';
        let currentProjectView = 'grid';
        let openProjectId = null;
        
        function openProjectModal(projectId = null) {
            const project = projectId ? projects.find(p => p.id === projectId) : null;
            document.getElementById('projectEditId').value = projectId || '';
            document.getElementById('projectName').value = project?.name || '';
            document.getElementById('projectStartDate').value = project?.startDate || getLocalDateStr();
            document.getElementById('projectDeadline').value = project?.deadline || '';
            document.getElementById('projectDescription').value = project?.description || '';
            document.getElementById('projectPlannedRevenue').value = project?.plannedRevenue || '';
            document.getElementById('projectPlannedMaterialCost').value = project?.plannedMaterialCost || '';
            document.getElementById('projectPlannedLaborCost').value = project?.plannedLaborCost || '';
            document.getElementById('projectClientName').value = project?.clientName || '';
            
            const color = project?.color || '#22c55e';
            // Reset all, then set matching
            document.querySelectorAll('input[name="projectColor"]').forEach(r => r.checked = false);
            const colorInput = document.querySelector(`input[name="projectColor"][value="${color}"]`);
            if (colorInput) colorInput.checked = true;
            else document.querySelector('input[name="projectColor"]').checked = true; // fallback to first
            
            document.getElementById('projectModalTitle').textContent = project ? t('editProject') : t('newProject');
            document.getElementById('projectModal').style.display = 'block';
            refreshIconsNow();
        }
        
        let isSavingProject = false;
        async function saveProject(e) {
            e.preventDefault();
            if (isSavingProject) return;
            isSavingProject = true;
            const submitBtn = document.querySelector('#projectForm button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            const id = document.getElementById('projectEditId').value;
            const data = {
                name: document.getElementById('projectName').value.trim(),
                startDate: document.getElementById('projectStartDate').value,
                deadline: document.getElementById('projectDeadline').value,
                description: document.getElementById('projectDescription').value.trim(),
                color: document.querySelector('input[name="projectColor"]:checked')?.value || '#22c55e',
                plannedRevenue: parseFloat(document.getElementById('projectPlannedRevenue')?.value) || 0,
                plannedMaterialCost: parseFloat(document.getElementById('projectPlannedMaterialCost')?.value) || 0,
                plannedLaborCost: parseFloat(document.getElementById('projectPlannedLaborCost')?.value) || 0,
                clientName: document.getElementById('projectClientName')?.value?.trim() || '',
            };
            if (!data.name) { isSavingProject = false; if (submitBtn) submitBtn.disabled = false; return; }
            
            try {
                const base = db.collection('companies').doc(currentCompany).collection('projects');
                if (id) {
                    // Не перезаписуємо status при редагуванні
                    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    await base.doc(id).update(data);
                    const idx = projects.findIndex(p => p.id === id);
                    if (idx >= 0) projects[idx] = { ...projects[idx], ...data };
                } else {
                    data.status = 'active';
                    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    data.creatorId = currentUser.uid;
                    const ref = await base.add(data);
                    projects.unshift({ id: ref.id, ...data });
                }
                closeModal('projectModal');
                renderProjects();
                updateProjectSelects();
            } catch (err) {
                console.error('[Projects] Save error:', err);
                showToast(t('error') + ': ' + t('save'), 'error');
            } finally {
                isSavingProject = false;
                if (submitBtn) submitBtn.disabled = false;
            }
        }
        
        async function deleteProject(projectId) {
            if (currentUserData?.role === 'employee') { showToast(t('noPermissionTask'), 'error'); return; }
            const s = getProjectStats(projectId);
            const stageCount = (typeof window.projectStages !== 'undefined' ? window.projectStages : []).filter(st => st.projectId === projectId).length;
            let msg = s.total > 0 
                ? (t('deleteProjectWithTasks')).replace('{total}', s.total).replace('{undone}', s.total - s.done)
                : (t('deleteEmptyProject'));
            if (stageCount > 0) msg += `\n\nТакож буде видалено ${stageCount} етапів та пов'язані матеріали.`;
            if (!await showConfirmModal(msg, { danger: true })) return;
            try {
                const base = db.collection('companies').doc(currentCompany);
                const orphaned = tasks.filter(t => t.projectId === projectId);
                const pStages = (typeof window.projectStages !== 'undefined' ? window.projectStages : []).filter(st => st.projectId === projectId);
                const pMats = (typeof window.projectMaterials !== 'undefined' ? window.projectMaterials : []).filter(m => m.projectId === projectId);
                
                // Збираємо всі ops: delete project + unlink tasks + delete stages + delete materials
                const ops = [];
                ops.push({ type: 'delete', ref: base.collection('projects').doc(projectId) });
                orphaned.forEach(t => ops.push({ type: 'update', ref: base.collection('tasks').doc(t.id), data: { projectId: '', stageId: '' } }));
                pStages.forEach(st => ops.push({ type: 'delete', ref: base.collection('projectStages').doc(st.id) }));
                pMats.forEach(m => ops.push({ type: 'delete', ref: base.collection('projectMaterials').doc(m.id) }));
                
                // Chunked commit — Firestore limit 500 ops/batch
                const CHUNK = 450;
                for (let i = 0; i < ops.length; i += CHUNK) {
                    const chunk = ops.slice(i, i + CHUNK);
                    const batch = db.batch();
                    chunk.forEach(op => {
                        if (op.type === 'delete') batch.delete(op.ref);
                        else batch.update(op.ref, op.data);
                    });
                    try {
                    await batch.commit();
                    } catch(err) {
                        console.error('[Batch] commit failed:', err);
                        showToast && showToast(t('savingError'), 'error');
                    }
                }
                
                // Оновлюємо локальний стан
                orphaned.forEach(t => { t.projectId = ''; t.stageId = ''; });
                projects = projects.filter(p => p.id !== projectId);
                if (typeof window.projectStages !== 'undefined') window.projectStages = window.projectStages.filter(s => s.projectId !== projectId);
                if (typeof window.projectMaterials !== 'undefined') window.projectMaterials = window.projectMaterials.filter(m => m.projectId !== projectId);
                
                if (openProjectId === projectId) closeProjectDetail();
                renderProjects();
                updateProjectSelects();
                let msg2 = '';
                if (orphaned.length > 0) msg2 += orphaned.length + ' задач відв\'язано. ';
                if (pStages.length > 0) msg2 += pStages.length + ' етапів видалено. ';
                if (msg2) showToast(msg2, 'info');
            } catch (err) {
                console.error('[Projects] Delete error:', err);
                showToast('Помилка видалення: ' + err.message, 'error');
            }
        }
        
        function getProjectStats(projectId) {
            const projectTasks = tasks.filter(t => t.projectId === projectId && isTaskVisibleToUser(t));
            const total = projectTasks.length;
            const done = projectTasks.filter(t => t.status === 'done').length;
            const inProgress = projectTasks.filter(t => t.status === 'progress').length;
            const review = projectTasks.filter(t => t.status === 'review').length;
            const overdue = projectTasks.filter(t => t.deadlineDate && t.deadlineDate < getLocalDateStr() && t.status !== 'done' && t.status !== 'review').length;
            const percent = total > 0 ? Math.round((done / total) * 100) : 0;
            
            // FIX 3: Конфлікт дедлайнів
            const project = projects.find(p => p.id === projectId);
            const deadlineConflicts = [];
            if (project?.deadline) {
                projectTasks.forEach(t => {
                    if (t.deadlineDate && t.deadlineDate > project.deadline && t.status !== 'done') {
                        deadlineConflicts.push(t);
                    }
                });
            }
            
            return { total, done, inProgress, review, overdue, percent, tasks: projectTasks, deadlineConflicts };
        }
        
        // FIX 4: Автооновлення статусу проекту
        const _projectStatusTimers = {};
        
        async function autoUpdateProjectStatus(projectId) {
            if (!projectId) return;
            const project = projects.find(p => p.id === projectId);
            if (!project || project.status === 'paused') return;
            
            // Debounce: coalesce rapid updates (batch complete etc)
            if (_projectStatusTimers[projectId]) clearTimeout(_projectStatusTimers[projectId]);
            _projectStatusTimers[projectId] = setTimeout(() => {
                delete _projectStatusTimers[projectId];
                _doProjectStatusUpdate(projectId);
            }, 500);
        }
        
        async function _doProjectStatusUpdate(projectId) {
            const project = projects.find(p => p.id === projectId);
            if (!project || project.status === 'paused') return;
            
            const allProjectTasks = tasks.filter(t => t.projectId === projectId);
            const total = allProjectTasks.length;
            if (total === 0) return;
            
            const doneCount = allProjectTasks.filter(t => t.status === 'done').length;
            const activeCount = allProjectTasks.filter(t => t.status === 'progress' || t.status === 'review').length;
            
            let newStatus = project.status;
            if (doneCount === total) newStatus = 'completed';
            else if (project.status === 'completed' && doneCount < total) newStatus = 'active';
            else if (doneCount > 0 || activeCount > 0) newStatus = 'active';
            
            if (newStatus !== project.status) {
                const oldStatus = project.status;
                project.status = newStatus;
                try {
                    const projRef = db.collection('companies').doc(currentCompany).collection('projects').doc(projectId);
                    await db.runTransaction(async (tx) => {
                        const doc = await tx.get(projRef);
                        if (!doc.exists) return;
                        const serverStatus = doc.data().status;
                        // Only update if no one else changed it
                        if (serverStatus === oldStatus) {
                            tx.update(projRef, { status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                        } else {
                            project.status = serverStatus; // sync from server
                        }
                    });
                    if (project.status === newStatus) {
                        const label = newStatus === 'completed' ? t('projectCompleted') : t('projectActive');
                        showToast(t('projectStatusChanged').replace('{name}', project.name).replace('{status}', label), 'success');
                    }
                } catch(e) {
                    project.status = oldStatus;
                    console.warn('autoUpdateProjectStatus error:', e);
                }
                renderProjects();
                if (openProjectId === projectId) renderProjectDetail(projectId);
            }
        }
        
        function setProjectView(view) {
            currentProjectView = view;
            const tab = document.getElementById('projectsTab');
            if (tab) tab.querySelectorAll('.calendar-view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
            renderProjects();
        }
        
        function renderProjects() {
            const container = document.getElementById('projectsContent');
            const emptyState = document.getElementById('projectsEmptyState');
            const detailView = document.getElementById('projectDetailView');
            const header = document.getElementById('projectsHeader');
            
            if (openProjectId) {
                container.style.display = 'none';
                emptyState.style.display = 'none';
                header.style.display = 'none';
                detailView.style.display = 'block';
                renderProjectDetail(openProjectId);
                return;
            }
            
            detailView.style.display = 'none';
            header.style.display = 'flex';
            
            const statusFilter = document.getElementById('projectStatusFilter')?.value || '';
            let filtered = projects;
            if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
            
            const counter = document.getElementById('projectsCounter');
            const activeCount = projects.filter(p => p.status === 'active').length;
            if (counter) { counter.textContent = activeCount || ''; counter.style.display = activeCount ? 'inline' : 'none'; }
            
            if (filtered.length === 0) {
                container.style.display = 'none';
                emptyState.style.display = 'block';
                // Show different message if projects exist but filter hides them
                if (projects.length > 0 && statusFilter) {
                    emptyState.innerHTML = `<div style="text-align:center;padding:2rem;">
                        <div style="margin-bottom:0.5rem;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                        <div style="font-weight:600;">Немає проєктів зі статусом "${statusFilter === 'active' ? 'Активний' : statusFilter === 'completed' ? 'Завершений' : 'Пауза'}"</div>
                        <div style="color:#9ca3af;font-size:0.85rem;margin:0.5rem 0;">Всього проєктів: ${projects.length}</div>
                        <button class="btn btn-small" onclick="document.getElementById('projectStatusFilter').value='';renderProjects();" style="margin-top:0.5rem;">Показати всі</button>
                    </div>`;
                }
                return;
            }
            
            container.style.display = 'block';
            emptyState.style.display = 'none';
            
            // Sync view switcher buttons
            const tab = document.getElementById('projectsTab');
            if (tab) tab.querySelectorAll('.calendar-view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === currentProjectView));
            
            if (currentProjectView === 'grid') renderProjectsGrid(container, filtered);
            else if (currentProjectView === 'list') renderProjectsList(container, filtered);
            else if (currentProjectView === 'timeline') renderProjectsTimeline(container, filtered);
            
            refreshIcons();
        }
        
        function renderProjectsGrid(container, filtered) {
            const todayStr = getLocalDateStr();
            container.innerHTML = `<div class="projects-grid">${filtered.map(p => {
                const s = getProjectStats(p.id);
                const isOverdue = p.deadline && p.deadline < todayStr && p.status === 'active';
                return `
                <div class="project-card" style="--pc:${safeColor(p.color)};" onclick="openProjectDetail('${escId(p.id)}')">
                    <div style="position:absolute;top:0;left:0;right:0;height:4px;background:${safeColor(p.color)};border-radius:12px 12px 0 0;"></div>
                    <div class="project-card-header">
                        <div class="project-card-title">${esc(p.name)}</div>
                        <span class="project-card-status ${['active','paused','completed'].includes(p.status) ? p.status : 'active'}">${p.status === 'active' ? t('projectActive') : p.status === 'completed' ? t('projectCompleted') : t('projectPaused')}</span>
                    </div>
                    ${p.description ? `<div class="project-card-desc">${esc(p.description)}</div>` : ''}
                    <div class="project-card-stats">
                        <span><i data-lucide="clipboard-list" class="icon icon-sm"></i> ${s.total} ${t('tasksWord')}</span>
                        <span><i data-lucide="check-circle" class="icon icon-sm"></i> ${s.done} ${t('doneWord')}</span>
                        ${s.overdue > 0 ? `<span style="color:var(--danger);font-weight:600;"><i data-lucide="alert-circle" class="icon icon-sm"></i> ${s.overdue} ${t('overdueWord')}</span>` : ''}
                        ${s.deadlineConflicts.length > 0 ? `<span style="color:#ea580c;font-weight:600;"><i data-lucide="alert-triangle" class="icon icon-sm"></i> ${s.deadlineConflicts.length} ${t('pastDeadline')}</span>` : ''}
                    </div>
                    <div class="project-progress-bar"><div class="project-progress-fill" style="width:${s.percent}%;background:${safeColor(p.color)};"></div></div>
                    <div class="project-progress-label"><span>${s.done}/${s.total}</span><span>${s.percent}%</span></div>
                    ${p.deadline ? `<div class="project-card-deadline ${isOverdue ? 'overdue' : ''}"><i data-lucide="calendar" class="icon icon-sm"></i> ${formatDateShort(p.deadline)}</div>` : ''}
                </div>`;
            }).join('')}</div>`;
        }
        
        function renderProjectsList(container, filtered) {
            const todayStr = getLocalDateStr();
            container.innerHTML = `<table class="projects-list-table"><thead><tr>
                <th>${t('nameLabel')}</th><th>${t('statusLabel')}</th><th>${t('tasksWord')}</th><th>${t('progressLabel')}</th><th>${t('deadline')}</th><th></th>
            </tr></thead><tbody>${filtered.map(p => {
                const s = getProjectStats(p.id);
                const isOverdue = p.deadline && p.deadline < todayStr && p.status === 'active';
                return `<tr onclick="openProjectDetail('${escId(p.id)}')">
                    <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${safeColor(p.color)};margin-right:0.5rem;vertical-align:middle;"></span><strong>${esc(p.name)}</strong></td>
                    <td><span class="project-card-status ${['active','paused','completed'].includes(p.status) ? p.status : 'active'}">${p.status === 'active' ? t('projectActive') : p.status === 'completed' ? t('projectCompleted') : t('projectPaused')}</span></td>
                    <td>${s.done}/${s.total}</td>
                    <td><div class="project-progress-bar" style="width:100px;display:inline-block;vertical-align:middle;"><div class="project-progress-fill" style="width:${s.percent}%;background:${safeColor(p.color)};"></div></div> ${s.percent}%</td>
                    <td class="${isOverdue ? 'project-card-deadline overdue' : ''}">${p.deadline ? formatDateShort(p.deadline) : '—'}</td>
                    <td><button class="action-btn" onclick="event.stopPropagation();openProjectModal('${escId(p.id)}')" title="Edit"><i data-lucide="pencil" class="icon icon-sm"></i></button></td>
                </tr>`;
            }).join('')}</tbody></table>`;
        }
        
        function renderProjectsTimeline(container, filtered) {
            const todayStr = getLocalDateStr();
            const today = new Date();
            
            // Визначаємо діапазон: мін startDate — макс deadline (+30 днів)
            let minDate = new Date();
            let maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 60);
            
            filtered.forEach(p => {
                if (p.startDate) { const d = new Date(p.startDate); if (d < minDate) minDate = d; }
                if (p.deadline) { const d = new Date(p.deadline); if (d > maxDate) maxDate = d; }
            });
            
            minDate.setDate(minDate.getDate() - 7);
            maxDate.setDate(maxDate.getDate() + 7);
            
            const totalDays = Math.ceil((maxDate - minDate) / 86400000);
            
            // Генеруємо header тижнів
            const weeks = [];
            const d = new Date(minDate);
            while (d <= maxDate) {
                const weekNum = getWeekNumber(d);
                if (!weeks.length || weeks[weeks.length - 1].num !== weekNum) {
                    weeks.push({ num: weekNum, start: new Date(d), days: 0 });
                }
                weeks[weeks.length - 1].days++;
                d.setDate(d.getDate() + 1);
            }
            
            const headerHTML = weeks.map(w => {
                const pct = (w.days / totalDays * 100).toFixed(2);
                const monthShort = (typeof getMonthNames === 'function' ? getMonthNames() : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])[w.start.getMonth()];
                return `<div class="timeline-header-label" style="flex:${pct};">${monthShort} T${w.num}</div>`;
            }).join('');
            
            const rowsHTML = filtered.map(p => {
                const s = getProjectStats(p.id);
                const start = p.startDate ? new Date(p.startDate) : today;
                const end = p.deadline ? new Date(p.deadline) : new Date(start.getTime() + 30 * 86400000);
                
                const leftPct = Math.max(0, (start - minDate) / (maxDate - minDate) * 100);
                const widthPct = Math.min(100 - leftPct, Math.max(2, (end - start) / (maxDate - minDate) * 100));
                
                return `
                <div class="timeline-row">
                    <div class="timeline-row-label" onclick="openProjectDetail('${escId(p.id)}')" style="color:${safeColor(p.color)};">${esc(p.name)}</div>
                    <div class="timeline-row-bar-area">
                        <div class="timeline-bar" title="${esc(p.name)}: ${s.percent}% (${s.done}/${s.total})" style="left:${leftPct}%;width:${widthPct}%;background:${safeColor(p.color)};" onclick="openProjectDetail('${escId(p.id)}')">
                            <div class="timeline-bar-progress" style="width:${s.percent}%;"></div>
                            ${s.percent}% (${s.done}/${s.total})
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            // Лінія "Сьогодні" — рахуємо в JS
            const todayPctNum = ((today - minDate) / (maxDate - minDate) * 100);
            
            container.innerHTML = `
                <div class="project-timeline" style="overflow-x:auto;">
                    <div style="min-width:800px;">
                        <div class="hide-desktop" style="text-align:center;font-size:0.7rem;color:#9ca3af;padding:4px;">← Прокрутіть вправо →</div>
                        <div class="timeline-header">${headerHTML}</div>
                        <div style="position:relative;">
                            <div style="position:absolute;left:calc(180px + (100% - 180px) * ${todayPctNum / 100});top:0;bottom:0;width:2px;background:#ef4444;opacity:0.5;z-index:1;"></div>
                            ${rowsHTML}
                        </div>
                    </div>
                </div>`;
        }
        
        function getWeekNumber(d) {
            const oneJan = new Date(d.getFullYear(), 0, 1);
            return Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
        }
        
        // === PROJECT DETAIL VIEW ===
        function openProjectDetail(projectId) {
            openProjectId = projectId;
            renderProjects();
        }
        
        function openTaskForProject(projectId) {
            openTaskModal();
            requestAnimationFrame(() => {
                setTimeout(() => {
                    updateProjectSelects(projectId);
                    const sel = document.getElementById('taskProject');
                    if (sel) sel.value = projectId;
                    updateTaskStageSelect(projectId, '');
                }, 0);
            });
        }
        
        window.openTaskForProjectStage = function(projectId, stageId) {
            openTaskModal();
            requestAnimationFrame(() => {
                setTimeout(() => {
                    updateProjectSelects(projectId);
                    const sel = document.getElementById('taskProject');
                    if (sel) sel.value = projectId;
                    updateTaskStageSelect(projectId, stageId);
                }, 50);
            });
        };
        
        function closeProjectDetail() {
            openProjectId = null;
            document.getElementById('projectDetailView').style.display = 'none';
            document.getElementById('projectsContent').style.display = 'block';
            document.getElementById('projectsHeader').style.display = 'flex';
            renderProjects();
        }
        
        function renderProjectDetail(projectId) {
            const project = projects.find(p => p.id === projectId);
            if (!project) { closeProjectDetail(); return; }
            
            // Load stages and materials async
            if (typeof window.loadProjectStages === 'function') {
                Promise.all([
                    window.loadProjectStages(projectId),
                    window.loadProjectMaterials(projectId),
                    typeof window.loadQualityChecks === 'function' ? window.loadQualityChecks(projectId) : Promise.resolve([]),
                ]).then(() => {
                    // Re-render stages section
                    const sv = document.getElementById('projectStagesView');
                    if (sv && typeof window.renderStagesList === 'function') {
                        sv.innerHTML = window.renderStagesList(projectId);
                    }
                });
            }
            
            const s = getProjectStats(projectId);
            const container = document.getElementById('projectDetailContent');
            
            const statusOptions = ['active', 'paused', 'completed'].map(st => 
                `<option value="${st}" ${project.status === st ? 'selected' : ''}>${st === 'active' ? t('projectActive') : st === 'completed' ? t('projectCompleted') : t('projectPaused')}</option>`
            ).join('');
            
            // Board columns
            const columns = [
                { key: 'new', label: t('statusNew'), color: '#3b82f6' },
                { key: 'progress', label: t('statusProgress'), color: '#f59e0b' },
                { key: 'review', label: t('statusReview'), color: '#8b5cf6' },
                { key: 'done', label: t('statusDone'), color: '#22c55e' }
            ];
            
            const boardHTML = columns.map(col => {
                const colTasks = s.tasks.filter(t => t.status === col.key);
                return `
                <div class="project-board-col">
                    <div class="project-board-col-header" style="border-bottom-color:${col.color};">
                        <span>${col.label}</span>
                        <span style="background:${col.color};color:white;font-size:0.7rem;padding:0.1rem 0.4rem;border-radius:8px;">${colTasks.length}</span>
                    </div>
                    <div class="project-board-col-cards">
                        ${colTasks.length === 0 ? '<div style="text-align:center;color:#ccc;font-size:0.8rem;padding:1rem;">—</div>' : ''}
                        ${colTasks.map(t => {
                            const assignee = t.assigneeName || '';
                            return `
                            <div class="project-task-card priority-${t.priority || 'medium'}" onclick="openTaskModal('${escId(t.id)}')">
                                <div class="project-task-card-title">${esc(t.title)}</div>
                                <div class="project-task-card-meta">
                                    ${assignee ? `<span><i data-lucide="user" class="icon icon-sm"></i> ${esc(assignee)}</span>` : ''}
                                    ${t.deadlineDate ? `<span><i data-lucide="calendar" class="icon icon-sm"></i> ${formatDateShort(t.deadlineDate)}</span>` : ''}
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>`;
            }).join('');
            
            container.innerHTML = `
                <div class="project-detail-header">
                    <div class="project-detail-back" onclick="closeProjectDetail()">
                        <i data-lucide="arrow-left" class="icon"></i>
                        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${safeColor(project.color)};"></span>
                        ${esc(project.name)}
                    </div>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                        <button class="btn btn-success btn-small" onclick="openTaskForProject('${escId(projectId)}')" style="min-height:36px;"><i data-lucide="plus" class="icon icon-sm"></i> ${t('addTask') || 'Завдання'}</button>
                        <select class="filter-select" onchange="updateProjectStatus('${escId(projectId)}', this.value)" style="font-size:0.8rem;padding:0.3rem;min-height:36px;">${statusOptions}</select>
                        <button class="btn btn-small" onclick="openProjectModal('${escId(projectId)}')" style="min-height:36px;" title="${t('edit') || 'Редагувати'}" aria-label="${t('edit') || 'Редагувати'}"><i data-lucide="pencil" class="icon icon-sm"></i></button>
                        <div style="width:1px;height:24px;background:#e5e7eb;margin:0 12px;"></div>
                        <button class="btn btn-small" onclick="deleteProject('${escId(projectId)}')" title="${t('deleteProject') || 'Видалити проєкт'} — незворотна дія" aria-label="${t('deleteProject') || 'Видалити проєкт'} — незворотна дія" style="background:#fee2e2;color:#dc2626;border-color:#fecaca;min-height:36px;margin-left:auto;"><i data-lucide="trash-2" class="icon icon-sm"></i></button>
                    </div>
                </div>
                
                <div style="display:flex;gap:1.5rem;margin-bottom:1rem;flex-wrap:wrap;">
                    <div style="background:white;border-radius:10px;padding:0.75rem 1.25rem;border:1px solid #e5e7eb;flex:1;min-width:120px;">
                        <div style="font-size:0.75rem;color:var(--gray);">${t('totalTasks')}</div>
                        <div style="font-size:1.5rem;font-weight:700;">${s.total}</div>
                    </div>
                    <div style="background:white;border-radius:10px;padding:0.75rem 1.25rem;border:1px solid #e5e7eb;flex:1;min-width:120px;">
                        <div style="font-size:0.75rem;color:var(--gray);">${t('statusDone')}</div>
                        <div style="font-size:1.5rem;font-weight:700;color:var(--primary);">${s.done}</div>
                    </div>
                    <div style="background:white;border-radius:10px;padding:0.75rem 1.25rem;border:1px solid #e5e7eb;flex:1;min-width:120px;">
                        <div style="font-size:0.75rem;color:var(--gray);">${t('completionRate')}</div>
                        <div style="font-size:1.5rem;font-weight:700;color:${safeColor(project.color)};">${s.percent}%</div>
                    </div>
                    ${s.overdue > 0 ? `<div style="background:#fef2f2;border-radius:10px;padding:0.75rem 1.25rem;border:1px solid #fecaca;flex:1;min-width:120px;">
                        <div style="font-size:0.75rem;color:var(--danger);">${t('overdueLabel2')}</div>
                        <div style="font-size:1.5rem;font-weight:700;color:var(--danger);">${s.overdue}</div>
                    </div>` : ''}
                    ${project.plannedRevenue ? `<div style="background:white;border-radius:10px;padding:0.75rem 1.25rem;border:1px solid #e5e7eb;flex:1;min-width:120px;">
                        <div style="font-size:0.75rem;color:var(--gray);">Бюджет</div>
                        <div style="font-size:1.1rem;font-weight:700;">${Number(project.plannedRevenue).toLocaleString()} ₴</div>
                        ${project.plannedMaterialCost || project.plannedLaborCost ? `<div style="font-size:0.68rem;color:#9ca3af;">Мат: ${Number(project.plannedMaterialCost || 0).toLocaleString()} | Робота: ${Number(project.plannedLaborCost || 0).toLocaleString()}</div>` : ''}
                    </div>` : ''}
                    ${project.clientName ? `<div style="background:white;border-radius:10px;padding:0.75rem 1.25rem;border:1px solid #e5e7eb;flex:1;min-width:120px;">
                        <div style="font-size:0.75rem;color:var(--gray);">Клієнт</div>
                        <div style="font-size:0.95rem;font-weight:600;">${esc(project.clientName)}</div>
                    </div>` : ''}
                </div>
                
                <div class="project-progress-bar" style="height:8px;margin-bottom:1rem;">
                    <div class="project-progress-fill" style="width:${s.percent}%;background:${safeColor(project.color)};"></div>
                </div>
                
                ${s.deadlineConflicts.length > 0 ? `
                <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:0.75rem 1rem;margin-bottom:1rem;display:flex;gap:0.5rem;align-items:flex-start;">
                    <i data-lucide="alert-triangle" class="icon" style="width:18px;height:18px;color:#ea580c;flex-shrink:0;margin-top:2px;"></i>
                    <div>
                        <div style="font-weight:600;font-size:0.85rem;color:#c2410c;margin-bottom:0.25rem;">
                            ${s.deadlineConflicts.length} ${t('tasksExceedDeadline')} (${formatDateShort(project.deadline)})
                        </div>
                        <div style="font-size:0.8rem;color:#9a3412;">
                            ${s.deadlineConflicts.slice(0, 3).map(t => `• ${esc(t.title)} — ${formatDateShort(t.deadlineDate)}`).join('<br>')}
                            ${s.deadlineConflicts.length > 3 ? `<br>...та ще ${s.deadlineConflicts.length - 3}` : ''}
                        </div>
                    </div>
                </div>` : ''}
                
                <!-- View Switcher -->
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
                    <button class="calendar-view-btn active" onclick="switchProjectView('board', this)" style="padding:0.4rem 0.8rem;font-size:0.8rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        Kanban
                    </button>
                    <button class="calendar-view-btn" onclick="switchProjectView('stages', this)" style="padding:0.4rem 0.8rem;font-size:0.8rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                        Етапи
                    </button>
                    <button class="calendar-view-btn" onclick="switchProjectView('gantt', this)" style="padding:0.4rem 0.8rem;font-size:0.8rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><line x1="4" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>
                        Gantt
                    </button>
                    <button class="calendar-view-btn" onclick="switchProjectView('standards', this)" style="padding:0.4rem 0.8rem;font-size:0.8rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Стандарти
                    </button>
                </div>
                
                <div id="projectBoardView" class="project-board-columns">${boardHTML}</div>
                <div id="projectStagesView" style="display:none;">${typeof renderStagesList === 'function' ? renderStagesList(projectId) : '<div>Loading stages...</div>'}</div>
                <div id="projectGanttView" style="display:none;">${renderProjectGantt(s.tasks, project)}</div>
                <div id="projectStandardsView" style="display:none;"><div id="standardsListContainer"></div></div>
            `;
            
            refreshIcons();
        }
        
        function switchProjectView(view, btn) {
            document.getElementById('projectBoardView').style.display = view === 'board' ? '' : 'none';
            const stagesView = document.getElementById('projectStagesView');
            if (stagesView) stagesView.style.display = view === 'stages' ? '' : 'none';
            document.getElementById('projectGanttView').style.display = view === 'gantt' ? '' : 'none';
            const stdView = document.getElementById('projectStandardsView');
            if (stdView) {
                stdView.style.display = view === 'standards' ? '' : 'none';
                if (view === 'standards' && typeof window.loadWorkStandards === 'function') {
                    window.loadWorkStandards().then(() => {
                        if (typeof window.renderStandardsList === 'function') window.renderStandardsList();
                    });
                }
            }
            btn.parentElement.querySelectorAll('.calendar-view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        
        function renderProjectGantt(projectTasks, project) {
            if (!projectTasks.length) return '<div style="text-align:center;color:#999;padding:2rem;">' + t('noTasksForGantt') + '</div>';
            
            const today = new Date();
            const todayStr = getLocalDateStr(today);
            
            // Find date range
            const dates = projectTasks
                .filter(t => t.deadlineDate)
                .map(t => new Date(t.deadlineDate));
            
            if (dates.length === 0) return '<div style="text-align:center;color:#999;padding:2rem;">Завдання без дат — Gantt неможливий</div>';
            
            // Add today to range
            dates.push(today);
            
            let minDate = new Date(Math.min(...dates));
            let maxDate = new Date(Math.max(...dates));
            
            // Pad range: 2 days before, 3 days after
            minDate.setDate(minDate.getDate() - 2);
            maxDate.setDate(maxDate.getDate() + 3);
            
            // Generate day columns
            const days = [];
            const d = new Date(minDate);
            while (d <= maxDate) {
                days.push(new Date(d));
                d.setDate(d.getDate() + 1);
            }
            
            const totalDays = days.length;
            const dayWidth = Math.max(36, Math.floor(800 / totalDays));
            const chartWidth = dayWidth * totalDays;
            
            // Status colors
            const statusColors = {
                new: { bg: '#dbeafe', border: '#3b82f6' },
                progress: { bg: '#fef3c7', border: '#f59e0b' },
                review: { bg: '#e0e7ff', border: '#6366f1' },
                done: { bg: '#d1fae5', border: '#10b981' }
            };
            
            const statusLabels = { new: t('statusNew'), progress: t('statusProgress'), review: t('statusReview'), done: t('statusDone') };
            
            // Sort tasks by date
            const sorted = [...projectTasks].sort((a, b) => {
                const da = a.deadlineDate || '9999';
                const db = b.deadlineDate || '9999';
                return da.localeCompare(db);
            });
            
            // Day headers
            const months = getMonthNames();
            const dayNames = [t('daySun'), t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat')];
            
            let headerHTML = days.map((day, i) => {
                const isToday = getLocalDateStr(day) === todayStr;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return `<div style="width:${dayWidth}px;min-width:${dayWidth}px;text-align:center;font-size:0.65rem;padding:4px 0;${isToday ? 'background:#f0fdf4;font-weight:700;color:#16a34a;' : isWeekend ? 'color:#d1d5db;' : 'color:#9ca3af;'}">
                    <div>${day.getDate() === 1 || i === 0 ? months[day.getMonth()] : ''}</div>
                    <div style="font-size:0.75rem;font-weight:${isToday ? '700' : '500'};">${day.getDate()}</div>
                    <div>${dayNames[day.getDay()]}</div>
                </div>`;
            }).join('');
            
            // Task rows
            let rowsHTML = sorted.map(task => {
                const color = statusColors[task.status] || statusColors.new;
                const assignee = task.assigneeName ? esc(task.assigneeName).split(' ')[0] : '';
                
                if (!task.deadlineDate) {
                    return `<div style="display:flex;align-items:center;height:36px;border-bottom:1px solid #f3f4f6;">
                        <div style="width:100%;padding:0 8px;font-size:0.75rem;color:#d1d5db;font-style:italic;">
                            ${esc(task.title)} — без дати
                        </div>
                    </div>`;
                }
                
                const taskDate = new Date(task.deadlineDate);
                const durationDays = Math.max(1, Math.ceil((parseInt(task.estimatedTime || task.duration || '60')) / 480)); // 8h workday
                const startDate = new Date(taskDate);
                startDate.setDate(startDate.getDate() - durationDays + 1);
                
                // Calculate position
                const startOffset = Math.max(0, Math.round((startDate - minDate) / 86400000));
                const barWidth = Math.max(1, durationDays);
                const leftPx = startOffset * dayWidth;
                const widthPx = barWidth * dayWidth - 4;
                
                const isOverdue = task.deadlineDate < todayStr && task.status !== 'done';
                
                return `<div style="display:flex;align-items:center;height:36px;border-bottom:1px solid #f3f4f6;position:relative;">
                    <div style="position:absolute;left:${leftPx + 2}px;width:${widthPx}px;height:24px;background:${color.bg};border:1.5px solid ${color.border};border-radius:4px;display:flex;align-items:center;padding:0 6px;cursor:pointer;overflow:hidden;${isOverdue ? 'border-color:#ef4444;background:#fef2f2;' : ''}" onclick="openTaskModal('${escId(task.id)}')" title="${esc(task.title)} — ${statusLabels[task.status] || task.status}${assignee ? ' (' + assignee + ')' : ''}">
                        <span style="font-size:0.65rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${isOverdue ? '#ef4444' : '#374151'};">${esc(task.title)}</span>
                    </div>
                </div>`;
            }).join('');
            
            // Today marker
            const todayOffset = Math.round((today - minDate) / 86400000);
            const todayPx = todayOffset * dayWidth + Math.floor(dayWidth / 2);
            
            // Left labels
            let labelsHTML = sorted.map(task => {
                const color = statusColors[task.status] || statusColors.new;
                const assignee = task.assigneeName ? esc(task.assigneeName).split(' ')[0] : '';
                return `<div style="height:36px;display:flex;align-items:center;border-bottom:1px solid #f3f4f6;padding:0 8px;gap:6px;">
                    <div style="width:6px;height:6px;border-radius:50%;background:${color.border};flex-shrink:0;"></div>
                    <span style="font-size:0.7rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;color:#374151;" title="${esc(task.title)}">${esc(task.title)}</span>
                    ${assignee ? `<span style="font-size:0.6rem;color:#9ca3af;">${assignee}</span>` : ''}
                </div>`;
            }).join('');
            
            return `
                <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
                    <div style="display:flex;">
                        <!-- Labels column -->
                        <div style="width:200px;min-width:200px;border-right:1px solid #e5e7eb;flex-shrink:0;">
                            <div style="height:54px;display:flex;align-items:center;padding:0 8px;font-size:0.75rem;font-weight:600;color:#6b7280;border-bottom:1px solid #e5e7eb;">Завдання</div>
                            ${labelsHTML}
                        </div>
                        <!-- Chart area -->
                        <div style="flex:1;overflow-x:auto;">
                            <div style="min-width:${chartWidth}px;position:relative;">
                                <!-- Day headers -->
                                <div style="display:flex;border-bottom:1px solid #e5e7eb;">${headerHTML}</div>
                                <!-- Bars -->
                                <div style="position:relative;">
                                    <!-- Today line -->
                                    <div style="position:absolute;top:0;bottom:0;left:${todayPx}px;width:2px;background:#22c55e;z-index:2;opacity:0.6;"></div>
                                    ${rowsHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
        
        async function updateProjectStatus(projectId, status) {
            // Попередження при ручному завершенні з незавершеними задачами
            if (status === 'completed') {
                const s = getProjectStats(projectId);
                const undone = s.total - s.done;
                if (undone > 0 && !await showConfirmModal(t('confirmProjectComplete').replace('{n}', undone), { danger: false })) {
                    // Повернути select назад
                    renderProjectDetail(projectId);
                    return;
                }
            }
            try {
                await db.collection('companies').doc(currentCompany).collection('projects').doc(projectId).update({ status });
                const proj = projects.find(x => x.id === projectId);
                if (proj) proj.status = status;
                renderProjectDetail(projectId);
                renderProjects();
                updateProjectSelects();
            } catch (e) { console.error(e); }
        }
        
        function updateProjectSelects(forceIncludeId) {
            const sel = document.getElementById('taskProject');
            if (!sel) return;
            const current = forceIncludeId || sel.value;
            const activeProjects = projects.filter(p => p.status === 'active');
            const currentProject = current ? projects.find(p => p.id === current) : null;
            const showProjects = [...activeProjects];
            if (currentProject && !showProjects.find(p => p.id === currentProject.id)) {
                showProjects.push(currentProject);
            }
            sel.innerHTML = '<option value="" data-i18n="noProject">Без проєкту</option>' + 
                showProjects.map(p => {
                    const suffix = p.status !== 'active' ? ` (${p.status === 'completed' ? t('completedProjectStatus') : t('pausedProjectStatus')})` : '';
                    return `<option value="${esc(p.id)}">${esc(p.name)}${suffix}</option>`;
                }).join('');
            sel.value = current;
        }
        
        // Stage select — loads stages for selected project
        function updateTaskStageSelect(projectId, selectedStageId) {
            const sel = document.getElementById('taskStage');
            if (!sel) return;
            if (!projectId) {
                sel.innerHTML = '<option value="">Без етапу</option>';
                sel.disabled = true;
                return;
            }
            sel.disabled = false;
            // Load stages async
            if (typeof window.loadProjectStages === 'function') {
                window.loadProjectStages(projectId).then(stages => {
                    sel.innerHTML = '<option value="">Без етапу</option>' +
                        stages.sort((a,b) => (a.order||0)-(b.order||0)).map(s => {
                            const statusIcon = s.status === 'done' ? '&check;' : s.status === 'blocked' ? '!' : s.status === 'in_progress' ? '&rsaquo;' : '&circ;';
                            return `<option value="${s.id}" ${s.id === selectedStageId ? 'selected' : ''}>${statusIcon} ${s.order}. ${esc(s.name)}</option>`;
                        }).join('');
                    if (selectedStageId) sel.value = selectedStageId;
                });
            }
        }
        
        window.onTaskProjectChange = function() {
            const projectId = document.getElementById('taskProject')?.value || '';
            updateTaskStageSelect(projectId, '');
        };
        
        // Sanitize color for style attribute — only allow hex colors
        function safeColor(color, fallback = '#22c55e') {
            if (!color) return fallback;
            return /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : fallback;
        }
        

        // === ШАБЛОНИ ===
        function openProcessTemplatesModal() {
            renderTemplatesList();
            document.getElementById('processTemplatesModal').style.display = 'block';
            refreshIcons();
        }
        
        function renderTemplatesList() {
            const container = document.getElementById('processTemplatesList');
            
            if (processTemplates.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="padding:2rem;">
                        <i data-lucide="file-cog" class="icon icon-lg" style="color:var(--gray);"></i>
                        <p>${t('noTemplates')}</p>
                    </div>
                `;
                refreshIcons();
                return;
            }
            
            container.innerHTML = processTemplates.map(template => {
                const stepsPreview = template.steps?.map(s => esc(s.function)).join(' → ') || '';
                const activeCount = processes.filter(p => p.templateId === template.id).length;
                
                return `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;border-bottom:1px solid #e5e7eb;">
                        <div style="flex:1;">
                            <div style="font-weight:600;margin-bottom:0.25rem;">${esc(template.name)}</div>
                            <div style="font-size:0.8rem;color:var(--gray);">
                                ${stepsPreview}
                                ${activeCount > 0 ? `<span style="margin-left:0.5rem;background:#dbeafe;color:#1d4ed8;padding:0.15rem 0.5rem;border-radius:10px;font-size:0.75rem;">${activeCount} ${t('activeProcesses')}</span>` : ''}
                            </div>
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            <button class="btn btn-small" onclick="event.stopPropagation(); openEditTemplateModal('${escId(template.id)}')">
                                <i data-lucide="pencil" class="icon icon-sm"></i>
                            </button>
                            <button class="btn btn-small btn-danger" onclick="event.stopPropagation(); deleteProcessTemplate('${escId(template.id)}')">
                                <i data-lucide="trash-2" class="icon icon-sm"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            refreshIcons();
        }
        
        function openEditTemplateModal(templateId = null) {
            const template = templateId ? processTemplates.find(t => t.id === templateId) : null;
            
            document.getElementById('processTemplateId').value = templateId || '';
            document.getElementById('processTemplateName').value = template?.name || '';
            document.getElementById('processTemplateDescription').value = template?.description || '';
            
            // Рендеримо етапи
            const stepsContainer = document.getElementById('templateStepsContainer');
            if (template?.steps?.length) {
                stepsContainer.innerHTML = template.steps.map((step, i) => renderTemplateStepEditor(step, i)).join('');
            } else {
                stepsContainer.innerHTML = '<p style="color:var(--gray);text-align:center;padding:1rem;">' + t('addStep') + '</p>';
            }
            
            document.getElementById('editTemplateTitle').innerHTML = `<i data-lucide="file-cog" class="icon"></i> ${template ? t('editTemplate') : t('newTemplate')}`;
            
            closeModal('processTemplatesModal');
            document.getElementById('editProcessTemplateModal').style.display = 'block';
            refreshIcons();
        }
        
        function renderTemplateStepEditor(step, index) {
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            const funcOptions = activeFunctions.map(f => 
                `<option value="${esc(f.name)}" ${f.name === step.function ? 'selected' : ''}>${esc(f.name)}</option>`
            ).join('');
            
            const expanded = step.expectedResult || step.controlQuestion || step.instruction || step.slaMinutes;
            
            return `
                <div class="process-template-step" data-index="${index}">
                    <span class="step-number">${index + 1}</span>
                    <div style="flex:1;">
                        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem;">
                            <select class="form-select step-function" style="flex:1;min-width:120px;" onchange="updateStepFunction(${index}, this.value)">
                                <option value="">${t('stepFunction')}</option>
                                ${funcOptions}
                            </select>
                            <input type="text" class="form-input step-title" placeholder="${t('stepTitle')}" value="${esc(step.title || '')}" style="flex:1;min-width:120px;">
                        </div>
                        <div style="display:flex;gap:0.3rem;align-items:center;">
                            <select class="form-select step-sla" style="width:90px;font-size:0.75rem;padding:0.25rem;">
                                <option value="" ${!step.slaMinutes ? 'selected' : ''}>${t('noSLA')}</option>
                                <option value="30" ${step.slaMinutes == 30 ? 'selected' : ''}>30 ${t('min')}</option>
                                <option value="60" ${step.slaMinutes == 60 ? 'selected' : ''}>1 ${t('hour')}</option>
                                <option value="120" ${step.slaMinutes == 120 ? 'selected' : ''}>2 ${t('hour')}</option>
                                <option value="240" ${step.slaMinutes == 240 ? 'selected' : ''}>4 ${t('hour')}</option>
                                <option value="480" ${step.slaMinutes == 480 ? 'selected' : ''}>8 ${t('hour')}</option>
                                <option value="1440" ${step.slaMinutes == 1440 ? 'selected' : ''}>1 ${t('day')}</option>
                                <option value="2880" ${step.slaMinutes == 2880 ? 'selected' : ''}>2 ${t('days')}</option>
                                <option value="4320" ${step.slaMinutes == 4320 ? 'selected' : ''}>3 ${t('days')}</option>
                            </select>
                            <label style="font-size:0.7rem;color:#6b7280;display:flex;align-items:center;gap:3px;">
                                <input type="checkbox" class="step-checkpoint" ${step.checkpoint ? 'checked' : ''}> ${t('checkpoint')}
                            </label>
                            <label style="font-size:0.7rem;color:#6b7280;display:flex;align-items:center;gap:3px;">
                                <input type="checkbox" class="step-smartassign" ${step.smartAssign !== false ? 'checked' : ''}> ${t('smartAssign')}
                            </label>
                            <button type="button" onclick="toggleStepDetails(${index})" style="background:none;border:none;cursor:pointer;font-size:0.7rem;color:#3b82f6;">${t('details')}</button>
                        </div>
                        <div class="step-details" id="stepDetails_${index}" style="display:${expanded ? 'block' : 'none'};margin-top:0.3rem;">
                            <input type="text" class="form-input step-expectedResult" placeholder="${t('expectedResult')}" value="${esc(step.expectedResult || '')}" style="font-size:0.8rem;margin-bottom:0.25rem;">
                            <input type="text" class="form-input step-controlQuestion" placeholder="${t('controlQuestion')}" value="${esc(step.controlQuestion || '')}" style="font-size:0.8rem;margin-bottom:0.25rem;">
                            <textarea class="form-textarea step-instruction" placeholder="${t('instruction')}" style="font-size:0.8rem;min-height:40px;">${esc(step.instruction || '')}</textarea>
                        </div>
                    </div>
                    <button type="button" class="btn btn-small btn-danger" onclick="removeTemplateStep(${index})" style="padding:0.3rem 0.5rem;align-self:start;">
                        <i data-lucide="x" class="icon icon-sm"></i>
                    </button>
                </div>
            `;
        }
        
        function addTemplateStep() {
            const container = document.getElementById('templateStepsContainer');
            const steps = container.querySelectorAll('.process-template-step');
            const newIndex = steps.length;
            
            // Видаляємо placeholder якщо є
            if (steps.length === 0) {
                container.innerHTML = '';
            }
            
            container.insertAdjacentHTML('beforeend', renderTemplateStepEditor({ function: '', title: '' }, newIndex));
            refreshIcons();
        }
        
        function removeTemplateStep(index) {
            const container = document.getElementById('templateStepsContainer');
            const steps = Array.from(container.querySelectorAll('.process-template-step'));
            
            if (steps[index]) {
                steps[index].remove();
            }
            
            // Перенумеровуємо
            container.querySelectorAll('.process-template-step').forEach((step, i) => {
                step.dataset.index = i;
                step.querySelector('.step-number').textContent = i + 1;
            });
            
            if (container.querySelectorAll('.process-template-step').length === 0) {
                container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:1rem;">' + t('addStep') + '</p>';
            }
        }
        
        function updateStepFunction(index, value) {
            // Зберігаємо в data атрибут
        }
        
        function updateStepTitle(index, value) {
            // Зберігаємо в data атрибут
        }
        
        function toggleStepDetails(index) {
            const el = document.getElementById('stepDetails_' + index);
            if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
        
        function getTemplateStepsFromEditor() {
            const container = document.getElementById('templateStepsContainer');
            const steps = [];
            
            container.querySelectorAll('.process-template-step').forEach(stepEl => {
                const funcSelect = stepEl.querySelector('.step-function');
                const titleInput = stepEl.querySelector('.step-title');
                
                if (funcSelect?.value) {
                    steps.push({
                        function: funcSelect.value,
                        title: titleInput?.value || '',
                        expectedResult: stepEl.querySelector('.step-expectedResult')?.value || '',
                        controlQuestion: stepEl.querySelector('.step-controlQuestion')?.value || '',
                        instruction: stepEl.querySelector('.step-instruction')?.value || '',
                        slaMinutes: parseInt(stepEl.querySelector('.step-sla')?.value) || 0,
                        checkpoint: stepEl.querySelector('.step-checkpoint')?.checked || false,
                        smartAssign: stepEl.querySelector('.step-smartassign')?.checked !== false
                    });
                }
            });
            
            return steps;
        }
        
        async function saveProcessTemplate(e) {
            e.preventDefault();
            
            const templateId = document.getElementById('processTemplateId').value;
            const name = document.getElementById('processTemplateName').value.trim();
            const description = document.getElementById('processTemplateDescription').value.trim();
            const steps = getTemplateStepsFromEditor();
            
            if (!name) {
                showAlertModal(t('templateName'));
                return;
            }
            
            if (steps.length < 2) {
                showAlertModal(t('minTwoSteps'));
                return;
            }
            
            // Валідація: перевіряємо що всі функції існують
            const activeFunctions = functions.filter(f => f.status !== 'archived');
            const missingFunctions = steps.filter(s => !activeFunctions.find(f => f.name === s.function));
            if (missingFunctions.length > 0) {
                showAlertModal(t('functionsNotFound') + ': ' + missingFunctions.map(s => s.function).join(', '));
                return;
            }
            
            try {
                const data = {
                    name,
                    description,
                    steps,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                if (templateId) {
                    await db.collection('companies').doc(currentCompany).collection('processTemplates').doc(templateId).update(data);
                } else {
                    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    data.createdBy = currentUser.uid;
                    await db.collection('companies').doc(currentCompany).collection('processTemplates').add(data);
                }
                
                closeModal('editProcessTemplateModal');
                await loadProcessData();
                renderProcessBoard();
                showAlertModal(t('templateSaved'));
                
            } catch (error) {
                console.error('saveProcessTemplate error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
        
        async function deleteProcessTemplate(templateId) {
            if (!await showConfirmModal(t('deleteTemplateConfirm'), { danger: true })) {
                return;
            }
            
            try {
                await db.collection('companies').doc(currentCompany).collection('processTemplates').doc(templateId).delete();
                await loadProcessData();
                renderTemplatesList();
                renderProcessBoard();
            } catch (error) {
                console.error('deleteProcessTemplate error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
        
        // === ЗАПУСК ПРОЦЕСУ ===
        function openStartProcessModal() {
            const select = document.getElementById('startProcessTemplate');
            select.innerHTML = `<option value="">${t('select')}</option>` + 
                processTemplates.map(pt => `<option value="${esc(pt.id)}">${esc(pt.name)}</option>`).join('');
            
            document.getElementById('startProcessName').value = '';
            document.getElementById('startProcessDeadline').value = '';
            document.getElementById('startProcessPreview').style.display = 'none';
            
            document.getElementById('startProcessModal').style.display = 'block';
            refreshIcons();
        }
        
        function updateStartProcessPreview() {
            const templateId = document.getElementById('startProcessTemplate').value;
            const preview = document.getElementById('startProcessPreview');
            const stepsContainer = document.getElementById('startProcessSteps');
            
            if (!templateId) {
                preview.style.display = 'none';
                return;
            }
            
            const template = processTemplates.find(t => t.id === templateId);
            if (!template?.steps) {
                preview.style.display = 'none';
                return;
            }
            
            stepsContainer.innerHTML = template.steps.map((step, i) => `
                <span style="display:flex;align-items:center;gap:0.25rem;padding:0.4rem 0.75rem;background:white;border-radius:20px;font-size:0.85rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                    <span style="width:20px;height:20px;background:var(--primary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:600;">${i + 1}</span>
                    ${esc(step.function)}
                </span>
                ${i < template.steps.length - 1 ? '<i data-lucide="arrow-right" class="icon icon-sm" style="color:var(--gray);"></i>' : ''}
            `).join('');
            
            preview.style.display = 'block';
            refreshIcons();
        }
        
        // === SMART ASSIGN — find least loaded person in function ===
        function getSmartAssignee(func) {
            if (!func?.assigneeIds?.length) return null;
            if (func.assigneeIds.length === 1) return func.assigneeIds[0];
            
            // Count active tasks per person in this function
            const todayStr = getLocalDateStr();
            const loads = func.assigneeIds.map(uid => {
                const activeTasks = tasks.filter(t => 
                    t.assigneeId === uid && t.status !== 'done' && 
                    t.function === func.name
                ).length;
                const overdue = tasks.filter(t =>
                    t.assigneeId === uid && t.status !== 'done' &&
                    t.deadlineDate && t.deadlineDate < todayStr
                ).length;
                return { uid, load: activeTasks + overdue * 2 }; // overdue weighs double
            });
            
            loads.sort((a, b) => a.load - b.load);
            return loads[0].uid;
        }
        
        async function startProcess(e) {
            e.preventDefault();
            
            const templateId = document.getElementById('startProcessTemplate').value;
            const name = document.getElementById('startProcessName').value.trim();
            const deadline = document.getElementById('startProcessDeadline').value;
            const processObject = document.getElementById('startProcessObject')?.value?.trim() || '';
            
            if (!templateId || !name) return;
            
            const template = processTemplates.find(t => t.id === templateId);
            if (!template?.steps?.length) return;
            
            const firstStep = template.steps[0];
            const firstFunc = functions.find(f => f.name === firstStep.function);
            
            if (!firstFunc) {
                showAlertModal(t('functionNotExists').replace('{name}', firstStep.function));
                return;
            }
            
            if (!firstFunc.assigneeIds?.length) {
                showAlertModal(t('functionNoExecutors').replace('{name}', firstStep.function));
                return;
            }
            
            try {
                const processData = {
                    templateId,
                    name,
                    objectName: processObject,
                    deadline: deadline || null,
                    status: 'active',
                    currentStep: 0,
                    stepResults: [],
                    history: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: currentUser.uid
                };
                
                const processRef = await db.collection('companies').doc(currentCompany).collection('processes').add(processData);
                
                // Smart assign or head
                const assigneeId = firstStep.smartAssign !== false
                    ? getSmartAssignee(firstFunc)
                    : (firstFunc.headId || firstFunc.assigneeIds[0]);
                const assignee = users.find(u => u.id === assigneeId);
                
                // Smart deadline
                let firstDeadlineDate = new Date().toISOString().split('T')[0];
                if (deadline) {
                    const pdl = new Date(deadline + 'T18:00:00');
                    const remAfter = template.steps.slice(1).reduce((s, st) => s + parseInt(st.slaMinutes || st.estimatedTime || 60), 0);
                    const sdl = new Date(pdl.getTime() - remAfter * 60000);
                    const tmw = new Date(); tmw.setDate(tmw.getDate() + 1);
                    firstDeadlineDate = sdl > tmw ? sdl.toISOString().split('T')[0] : tmw.toISOString().split('T')[0];
                } else if (firstStep.slaMinutes) {
                    // SLA-based deadline
                    const slaDl = new Date(Date.now() + firstStep.slaMinutes * 60000);
                    firstDeadlineDate = getLocalDateStr(slaDl);
                }
                
                // Build instruction with context
                let fullInstruction = firstStep.instruction || '';
                if (processObject) {
                    fullInstruction = (processObject ? `[${processObject}]\n` : '') + fullInstruction;
                }
                if (firstStep.expectedResult) {
                    fullInstruction += `\n\n${t('expectedResult')}: ${firstStep.expectedResult}`;
                }
                if (firstStep.controlQuestion) {
                    fullInstruction += `\n${t('controlQuestion')}: ${firstStep.controlQuestion}`;
                }
                
                const taskData = {
                    title: `[${name}] ${firstStep.title || firstStep.name || firstStep.function}`,
                    function: firstStep.function,
                    assigneeId: assigneeId,
                    assigneeName: assignee?.name || assignee?.email || '',
                    instruction: fullInstruction,
                    description: fullInstruction,
                    expectedResult: firstStep.expectedResult || '',
                    estimatedTime: String(firstStep.slaMinutes || firstStep.estimatedTime || 60),
                    deadlineDate: firstDeadlineDate,
                    deadlineTime: '18:00',
                    status: 'new',
                    priority: 'high',
                    processId: processRef.id,
                    processStep: 0,
                    processObject: processObject,
                    requireReview: firstStep.checkpoint || false,
                    createdBy: currentUser.uid,
                    creatorId: currentUser.uid,
                    createdDate: getLocalDateStr(),
                    deadline: firstDeadlineDate + 'T18:00',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    creatorName: t('systemUser')
                };
                
                await db.collection('companies').doc(currentCompany).collection('tasks').add(taskData);
                
                closeModal('startProcessModal');
                await loadProcessData();
                renderProcessBoard();
                renderMyDay();
                refreshCurrentView();
                showToast(t('processStarted'), 'success');
                
            } catch (error) {
                console.error('startProcess error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
        
        // === ПЕРЕГЛЯД ПРОЦЕСУ ===
        function openViewProcessModal(processId) {
            const process = processes.find(p => p.id === processId);
            if (!process) return;
            
            const template = processTemplates.find(t => t.id === process.templateId);
            
            if (!template) {
                document.getElementById('viewProcessTitle').innerHTML = `<i data-lucide="git-branch" class="icon"></i> ${esc(process.name)}`;
                document.getElementById('viewProcessContent').innerHTML = `
                    <div style="text-align:center;padding:2rem;color:var(--gray);">
                        <i data-lucide="alert-triangle" class="icon icon-lg" style="margin-bottom:1rem;"></i>
                        <p>${t('templateDeleted')}</p>
                    </div>`;
                document.getElementById('viewProcessModal').style.display = 'block';
                refreshIcons();
                return;
            }
            
            const safeCurrentStep = Math.min(process.currentStep || 0, template.steps.length - 1);
            const stepResults = process.stepResults || [];
            
            document.getElementById('viewProcessTitle').innerHTML = `<i data-lucide="git-branch" class="icon"></i> ${esc(process.name)}`;
            
            const content = document.getElementById('viewProcessContent');
            content.innerHTML = `
                ${process.objectName ? `
                <div style="margin-bottom:1rem;padding:0.6rem 1rem;background:#f0f9ff;border-radius:8px;display:flex;align-items:center;gap:0.5rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    <span style="font-weight:600;color:#0369a1;">${esc(process.objectName)}</span>
                </div>` : ''}
                
                <div style="margin-bottom:1.5rem;">
                    <div style="font-size:0.85rem;color:var(--gray);margin-bottom:0.5rem;">${t('processFlow')}</div>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        ${(template?.steps || []).map((step, i) => {
                            let statusColor = 'var(--gray)';
                            let statusIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>';
                            let bgColor = '#f9fafb';
                            
                            const isCompleted = process.status === 'completed' || i < safeCurrentStep;
                            const isCurrent = i === safeCurrentStep && process.status !== 'completed';
                            
                            if (isCompleted) {
                                statusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:-2px;"><polyline points="20 6 9 17 4 12"/></svg>';
                                statusColor = 'var(--primary)';
                            } else if (isCurrent) {
                                statusIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="8"/></svg>';
                                statusColor = 'var(--info)';
                                bgColor = '#eff6ff';
                            }
                            
                            // Find step result
                            const result = stepResults.find(r => r.step === i);
                            
                            // SLA info
                            let slaHtml = '';
                            if (step.slaMinutes) {
                                const slaH = step.slaMinutes >= 60 ? Math.round(step.slaMinutes / 60) + 'h' : step.slaMinutes + 'm';
                                if (result?.actualMinutes && result.actualMinutes > step.slaMinutes) {
                                    slaHtml = `<span style="font-size:0.68rem;background:#fef2f2;color:#ef4444;padding:1px 5px;border-radius:3px;">SLA ${slaH} / ${Math.round(result.actualMinutes)}m</span>`;
                                } else if (result?.actualMinutes) {
                                    slaHtml = `<span style="font-size:0.68rem;background:#f0fdf4;color:#16a34a;padding:1px 5px;border-radius:3px;">SLA ${slaH}</span>`;
                                } else {
                                    slaHtml = `<span style="font-size:0.68rem;background:#f3f4f6;color:#6b7280;padding:1px 5px;border-radius:3px;">SLA ${slaH}</span>`;
                                }
                            }
                            
                            // Checkpoint badge
                            const checkpointBadge = step.checkpoint ? '<span style="font-size:0.68rem;background:#fef3c7;color:#b45309;padding:1px 5px;border-radius:3px;">Checkpoint</span>' : '';
                            
                            return `
                                <div style="padding:0.75rem;background:${bgColor};border-radius:8px;border-left:3px solid ${statusColor};">
                                    <div style="display:flex;align-items:center;gap:0.75rem;">
                                        <span style="color:${statusColor};font-weight:600;width:20px;">${statusIcon}</span>
                                        <div style="flex:1;">
                                            <div style="font-weight:500;">${esc(step.title || step.function)} ${slaHtml} ${checkpointBadge}</div>
                                            <div style="font-size:0.78rem;color:var(--gray);">${esc(step.function)}${step.expectedResult ? ` — ${esc(step.expectedResult)}` : ''}</div>
                                        </div>
                                        ${isCurrent ? `
                                            <button class="btn btn-small btn-success" onclick="completeProcessStep('${escId(processId)}')">
                                                <i data-lucide="check" class="icon icon-sm"></i> ${t('completeStep')}
                                            </button>
                                        ` : ''}
                                    </div>
                                    ${result ? `
                                        <div style="margin-top:0.4rem;padding-top:0.4rem;border-top:1px solid #e5e7eb;font-size:0.78rem;">
                                            <span style="color:var(--primary);font-weight:500;">${esc(result.completedByName || '')}</span>
                                            <span style="color:var(--gray);">${result.completedAt ? new Date(result.completedAt).toLocaleDateString() : ''}</span>
                                            ${result.result ? `<div style="margin-top:2px;color:#374151;background:white;padding:4px 8px;border-radius:4px;">${esc(result.result)}</div>` : ''}
                                        </div>` : ''}
                                </div>
                            `;
                        }).join('') || ''}
                    </div>
                </div>
                
                ${process.deadline ? `
                <div style="font-size:0.82rem;color:var(--gray);margin-bottom:0.5rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    ${t('deadline')}: <strong>${process.deadline}</strong>
                </div>` : ''}
                
                <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;">
                    <button class="btn btn-danger btn-small" onclick="deleteProcess('${escId(processId)}')" style="opacity:0.7;">
                        <i data-lucide="trash-2" class="icon icon-sm"></i> ${t('deleteProcess')}
                    </button>
                </div>
            `;
            
            document.getElementById('viewProcessModal').style.display = 'block';
            refreshIcons();
        }
        
        async function deleteProcess(processId) {
            if (!await showConfirmModal(t('deleteProcessConfirm'), { danger: true })) return;
            
            try {
                await db.collection('companies').doc(currentCompany).collection('processes').doc(processId).delete();
                
                // Cleanup: знімаємо processId з пов'язаних задач
                const linkedTasks = tasks.filter(tk => tk.processId === processId);
                for (const tk of linkedTasks) {
                    tk.processId = '';
                    tk.processStep = null;
                    db.collection('companies').doc(currentCompany).collection('tasks').doc(tk.id)
                        .update({ processId: '', processStep: null }).catch(() => {});
                }
                
                closeModal('viewProcessModal');
                await loadProcessData();
                renderProcessBoard();
            } catch (error) {
                console.error('deleteProcess error:', error);
                showAlertModal(t('error') + ': ' + error.message);
            }
        }
