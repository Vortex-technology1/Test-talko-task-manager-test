// =====================
        // PROCESSES (Направляючі форми)
        // =====================
        let processTemplates = [];
        let processes = [];
        let showCompletedProcesses = false;
        
        async function loadProcessData() {
            if (!currentCompany) return;
            
            try {
                // Завантажуємо шаблони
                const templatesSnap = await db.collection('companies').doc(currentCompany)
                    .collection('processTemplates').orderBy('name').get();
                processTemplates = templatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Завантажуємо процеси (активні або всі в залежності від фільтру)
                let processQuery = db.collection('companies').doc(currentCompany).collection('processes');
                if (!showCompletedProcesses) {
                    processQuery = processQuery.where('status', '==', 'active');
                }
                const processesSnap = await processQuery.get();
                processes = processesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                updateProcessTemplateFilter();
            } catch (error) {
                console.error('loadProcessData error:', error);
            }
        }
        
        function toggleShowCompletedProcesses() {
            showCompletedProcesses = !showCompletedProcesses;
            const btn = document.getElementById('toggleCompletedBtn');
            if (btn) {
                btn.classList.toggle('active', showCompletedProcesses);
            }
            loadProcessData().then(() => renderProcessBoard());
        }
        
        function updateProcessTemplateFilter() {
            const select = document.getElementById('processTemplateFilter');
            if (!select) return;
            select.innerHTML = `<option value="">${t('allProcesses')}</option>` + 
                processTemplates.map(pt => `<option value="${esc(pt.id)}">${esc(pt.name)}</option>`).join('');
        }
        
        function renderProcessBoard() {
            const container = document.getElementById('processBoard');
            const emptyState = document.getElementById('processesEmptyState');
            const filterValue = document.getElementById('processTemplateFilter')?.value;
            const assigneeFilter = document.getElementById('processAssigneeFilter')?.value;
            
            // Оновлюємо select виконавців (одноразово)
            const paf = document.getElementById('processAssigneeFilter');
            if (paf && paf.options.length <= 1) {
                paf.innerHTML = `<option value="">${t('allAssignees')}</option>` + users.map(u => `<option value="${esc(u.id)}">${esc(u.name || u.email)}</option>`).join('');
            }
            
            // Фільтруємо процеси
            let filteredProcesses = processes;
            if (filterValue) {
                filteredProcesses = filteredProcesses.filter(p => p.templateId === filterValue);
            }
            if (assigneeFilter) {
                filteredProcesses = filteredProcesses.filter(p => {
                    const template = processTemplates.find(t => t.id === p.templateId);
                    if (!template?.steps?.length) return false;
                    const currentStepIndex = Math.min(p.currentStep || 0, template.steps.length - 1);
                    const stepFunc = template.steps[currentStepIndex]?.function;
                    if (!stepFunc) return false;
                    const func = functions.find(f => f.name === stepFunc);
                    return func?.assigneeIds?.includes(assigneeFilter);
                });
            }
            
            if (filteredProcesses.length === 0) {
                container.style.display = 'none';
                emptyState.style.display = 'block';
                refreshIcons();
                return;
            }
            
            container.style.display = 'flex';
            emptyState.style.display = 'none';
            
            const todayStr = getLocalDateStr();
            
            // Сортуємо: активні overdue першими, потім по прогресу (менший прогрес = вище), завершені внизу
            const sorted = filteredProcesses.map(p => {
                const template = processTemplates.find(t => t.id === p.templateId);
                const totalSteps = template?.steps?.length || 1;
                const currentStep = p.status === 'completed' ? totalSteps : Math.min(p.currentStep || 0, totalSteps - 1);
                const percent = Math.round((currentStep / totalSteps) * 100);
                const isOverdue = p.status !== 'completed' && p.deadline && p.deadline < todayStr;
                return { ...p, template, totalSteps, currentStep, percent, isOverdue };
            }).sort((a, b) => {
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                if (a.isOverdue && !b.isOverdue) return -1;
                if (!a.isOverdue && b.isOverdue) return 1;
                return a.percent - b.percent;
            });
            
            container.innerHTML = sorted.map(p => renderProcessPipelineRow(p)).join('');
            
            // Оновлюємо лічильник
            const activeCount = processes.filter(p => p.status === 'active').length;
            const counter = document.getElementById('processesCounter');
            if (counter) {
                counter.textContent = activeCount > 0 ? activeCount : '';
                counter.style.display = activeCount > 0 ? 'inline' : 'none';
            }
            
            refreshIcons();
        }
        
        function renderProcessPipelineRow(process) {
            const template = process.template;
            if (!template?.steps?.length) return '';
            
            const totalSteps = process.totalSteps;
            const currentStep = process.currentStep;
            const percent = process.percent;
            const isCompleted = process.status === 'completed';
            const isOverdue = process.isOverdue;
            const todayStr = getLocalDateStr();
            
            // Знаходимо відповідального за поточний крок
            let currentAssignee = '';
            if (!isCompleted && template.steps[currentStep]) {
                const stepFunc = template.steps[currentStep].function;
                const func = functions.find(f => f.name === stepFunc);
                if (func?.assigneeIds?.length) {
                    const assignee = users.find(u => func.assigneeIds.includes(u.id));
                    currentAssignee = assignee?.name || '';
                }
            }
            
            // Pipeline steps — горизонтальні етапи
            const stepsHTML = template.steps.map((step, i) => {
                let cls = 'pending';
                if (isCompleted || i < currentStep) cls = 'done';
                else if (i === currentStep) cls = 'active';
                
                const label = step.function || `Крок ${i + 1}`;
                
                return `<div class="pipeline-step ${cls}" title="${esc(step.name || label)}">
                    <span class="pipeline-step-label">${esc(label)}</span>
                </div>`;
            }).join('<div class="pipeline-arrow">›</div>');
            
            // Deadline display
            let deadlineHTML = '';
            if (process.deadline) {
                if (isOverdue) {
                    const daysAgo = Math.floor((new Date(todayStr) - new Date(process.deadline)) / 86400000);
                    deadlineHTML = `<span class="overdue-badge"><i data-lucide="alert-circle" class="icon icon-sm"></i> ${daysAgo}д прострочено</span>`;
                } else {
                    const dp = process.deadline.split('-');
                    const dayNum = parseInt(dp[2]);
                    const monthShort = (typeof getMonthNames === 'function' ? getMonthNames() : ['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'])[parseInt(dp[1]) - 1];
                    deadlineHTML = `<span><i data-lucide="calendar" class="icon icon-sm"></i> ${dayNum} ${monthShort}</span>`;
                }
            }
            
            const rowClass = isCompleted ? 'completed' : (isOverdue ? 'overdue' : '');
            
            return `
                <div class="process-pipeline-row ${rowClass}" onclick="openViewProcessModal('${escId(process.id)}')">
                    <div class="process-row-top">
                        <div class="process-row-title">
                            ${isCompleted ? '<i data-lucide="check-circle" class="icon icon-sm" style="color:var(--primary);vertical-align:-2px;"></i> ' : ''}${esc(process.name)}
                        </div>
                        <div class="process-row-meta">
                            <span style="color:#888;font-size:0.75rem;">${esc(template.name)}</span>
                            ${process.objectName ? `<span style="font-size:0.72rem;background:#e0f2fe;color:#0369a1;padding:1px 6px;border-radius:4px;">${esc(process.objectName)}</span>` : ''}
                            ${currentAssignee ? `<span class="process-row-assignee"><i data-lucide="user" class="icon icon-sm"></i> ${esc(currentAssignee)}</span>` : ''}
                            ${deadlineHTML}
                            <span class="process-row-percent ${isCompleted ? 'complete' : ''}">${percent}%</span>
                        </div>
                    </div>
                    <div class="process-pipeline-steps">
                        ${stepsHTML}
                    </div>
                </div>
            `;
        }
