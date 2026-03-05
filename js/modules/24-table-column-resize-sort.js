// =====================
        // TABLE COLUMN RESIZE + SORT
        // =====================
        let taskSortField = localStorage.getItem('taskSortField') || '';
        let taskSortDir = localStorage.getItem('taskSortDir') || 'asc';
        let hideCompletedTasks = localStorage.getItem('hideCompletedTasks') === 'true';
        
        function sortTasksBy(field) {
            if (taskSortField === field) {
                taskSortDir = taskSortDir === 'asc' ? 'desc' : 'asc';
            } else {
                taskSortField = field;
                taskSortDir = 'asc';
            }
            localStorage.setItem('taskSortField', taskSortField);
            localStorage.setItem('taskSortDir', taskSortDir);
            renderTasks();
        }
        
        function toggleHideCompleted() {
            hideCompletedTasks = !hideCompletedTasks;
            localStorage.setItem('hideCompletedTasks', hideCompletedTasks);
            const btn = document.getElementById('hideCompletedBtn');
            if (btn) btn.classList.toggle('active', hideCompletedTasks);
            renderTasks();
        }
        
        function initTableColumnResize() {
            const table = document.querySelector('.tasks-table');
            if (!table) return;

            // Знімаємо фіксований layout — таблиця тепер flexible
            table.style.tableLayout = 'auto';
            table.style.width = '100%';

            const handles = document.querySelectorAll('.col-resize-handle');
            handles.forEach(handle => {
                handle.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const th = handle.parentElement;
                    const startX = e.clientX;
                    const startWidth = th.offsetWidth;
                    handle.classList.add('resizing');

                    const onMove = (e2) => {
                        const newWidth = Math.max(60, startWidth + (e2.clientX - startX));
                        th.style.width = newWidth + 'px';
                        th.style.minWidth = newWidth + 'px';
                    };
                    const onUp = () => {
                        handle.classList.remove('resizing');
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                        saveColumnWidths();
                    };
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                });
            });
        }
        
        function saveColumnWidths() {
            const ths = document.querySelectorAll('.tasks-table th');
            const table = document.querySelector('.tasks-table');
            if (!ths.length || !table) return;
            const tableWidth = table.offsetWidth;
            // Зберігаємо у % від ширини таблиці
            const widths = Array.from(ths).map(th => 
                parseFloat(((th.offsetWidth / tableWidth) * 100).toFixed(2))
            );
            localStorage.setItem('taskColumnWidths', JSON.stringify(widths));
        }
        
        function restoreColumnWidths() {
            const saved = localStorage.getItem('taskColumnWidths');
            if (!saved) return;
            try {
                const widths = JSON.parse(saved);
                const ths = document.querySelectorAll('.tasks-table th');
                if (!ths.length) return;
                ths.forEach((th, i) => {
                    if (widths[i]) {
                        // Відновлюємо у % — таблиця масштабується разом з вікном
                        th.style.width = widths[i] + '%';
                        th.style.minWidth = '';
                    }
                });
            } catch(e) {}
        }
        
        function setTaskTypeFilter(btn) {
            const val = btn.dataset.value;
            document.getElementById('taskTypeFilter').value = val;
            // Update tab styles
            document.querySelectorAll('.task-type-tab').forEach(t => {
                if (t.dataset.value === val) {
                    t.style.background = '#22c55e';
                    t.style.color = 'white';
                    t.classList.add('active');
                } else {
                    t.style.background = 'transparent';
                    t.style.color = '#555';
                    t.classList.remove('active');
                }
            });
            renderTasks();
        }
        
        function syncTaskTypeTabs() {
            const val = document.getElementById('taskTypeFilter').value;
            document.querySelectorAll('.task-type-tab').forEach(t => {
                if (t.dataset.value === val) {
                    t.style.background = '#22c55e';
                    t.style.color = 'white';
                    t.classList.add('active');
                } else {
                    t.style.background = 'transparent';
                    t.style.color = '#555';
                    t.classList.remove('active');
                }
            });
        }
        
        function clearTaskFilters() {
            document.getElementById('taskTypeFilter').value = '';
            document.getElementById('dateFilter').value = '';
            setStatusFilterFromArray([]);
            document.getElementById('functionFilter').value = '';
            document.getElementById('assigneeFilter').value = '';
            const searchInput = document.getElementById('taskSearchInput');
            if (searchInput) { searchInput.value = ''; searchInput.style.width = '120px'; }
            const mobileSearch = document.getElementById('mobileTaskSearchInput');
            if (mobileSearch) mobileSearch.value = '';
            document.getElementById('customDateRange').style.display = 'none';
            document.getElementById('dateFrom').value = '';
            document.getElementById('dateTo').value = '';
            syncTaskTypeTabs();
            renderTasks();
        }
        
        // Export dropdown
        function toggleExportDropdown(e) {
            e.stopPropagation();
            const dd = document.getElementById('exportDropdown');
            dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
            if (dd.style.display === 'block') {
                refreshIcons();
                setTimeout(() => document.addEventListener('click', closeExportDropdown, { once: true }), 10);
            }
        }
        function closeExportDropdown() {
            document.getElementById('exportDropdown').style.display = 'none';
        }
        
        function getExportData() {
            const st = { new: t('statusNewLabel'), progress: t('statusProgressLabel'), review: t('statusReviewLabel'), done: t('statusDoneLabel') };
            return tasks.filter(t => isTaskVisibleToUser(t)).map(task => {
                const { date, time } = parseDeadline(task);
                return {
                    [t('taskName')]: task.title || '',
                    [t('assignee')]: task.assigneeName || '',
                    [t('createdBy')]: task.creatorName || '',
                    [t('deadline')]: date ? (date + (time ? ' ' + time : '')) : '',
                    [t('status')]: st[task.status] || task.status,
                    [t('functionLabel')]: task.function || '',
                    [t('priority')]: task.priority === 'high' ? t('priorityNames_high') : task.priority === 'low' ? t('priorityNames_low') : t('priorityNames_medium'),
                    [t('description')]: task.description || task.instruction || ''
                };
            });
        }

        function exportTasksCSV() {
            const data = getExportData();
            if (data.length === 0) { showToast(t('noTasksForExport'), 'info'); return; }
            const headers = Object.keys(data[0]);
            let csv = headers.join(',') + '\n';
            data.forEach(row => {
                csv += headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
            });
            const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tasks_' + getLocalDateStr() + '.csv';
            link.click();
        }
        
        function exportTasksXLSX() {
            const data = getExportData();
            if (data.length === 0) { showToast(t('noTasksForExport'), 'info'); return; }
            const headers = Object.keys(data[0]);
            
            // Build XLSX using XML spreadsheet format (no library needed)
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<?mso-application progid="Excel.Sheet"?>\n';
            xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
            xml += '<Styles><Style ss:ID="header"><Font ss:Bold="1" ss:Size="11"/><Interior ss:Color="#22c55e" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF" ss:Bold="1"/></Style>';
            xml += '<Style ss:ID="wrap"><Alignment ss:WrapText="1" ss:Vertical="Top"/></Style></Styles>\n';
            xml += '<Worksheet ss:Name="' + t('tasks') + '"><Table>\n';
            
            // Column widths
            const colWidths = [250, 150, 120, 120, 80, 120, 80, 300];
            colWidths.forEach(w => { xml += `<Column ss:Width="${w}"/>\n`; });
            
            // Header row
            xml += '<Row ss:Height="24">';
            headers.forEach(h => { xml += `<Cell ss:StyleID="header"><Data ss:Type="String">${h}</Data></Cell>`; });
            xml += '</Row>\n';
            
            // Data rows
            data.forEach(row => {
                xml += '<Row>';
                headers.forEach(h => {
                    const val = (row[h] || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    xml += `<Cell ss:StyleID="wrap"><Data ss:Type="String">${val}</Data></Cell>`;
                });
                xml += '</Row>\n';
            });
            
            xml += '</Table></Worksheet></Workbook>';
            
            const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tasks_' + getLocalDateStr() + '.xlsx';
            link.click();
        }
        
        // Inline status cycle: new → progress → done (або review)
        // Inline deadline editing — клік на дату в таблиці
        function inlineEditDeadline(event, taskId, currentDate) {
            event.stopPropagation();
            const td = event.currentTarget;
            
            // Якщо вже є input — не дублюємо
            if (td.querySelector('input')) return;
            
            const task = tasks.find(t => t.id === taskId);
            const originalHTML = td.innerHTML;
            
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex;gap:4px;align-items:center;';
            
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.value = currentDate || '';
            dateInput.style.cssText = 'width:130px;padding:0.25rem;border:2px solid #22c55e;border-radius:8px;font-size:0.85rem;outline:none;';
            
            const timeInput = document.createElement('input');
            timeInput.type = 'time';
            timeInput.value = task?.deadlineTime || '';
            timeInput.style.cssText = 'width:90px;padding:0.25rem;border:2px solid #22c55e;border-radius:8px;font-size:0.85rem;outline:none;';
            
            wrap.appendChild(dateInput);
            wrap.appendChild(timeInput);
            td.innerHTML = '';
            td.appendChild(wrap);
            dateInput.focus();
            
            let saved = false;
            async function save() {
                if (saved) return;
                const newDate = dateInput.value;
                const newTime = timeInput.value;
                if (newDate === (currentDate || '') && newTime === (task?.deadlineTime || '')) {
                    td.innerHTML = originalHTML;
                    return;
                }
                saved = true;
                
                const oldDate = task?.deadlineDate;
                const oldTime = task?.deadlineTime;
                
                try {
                    const updateData = { 
                        deadlineDate: newDate || '', 
                        deadlineTime: newTime || '',
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
                    };
                    if (newDate) {
                        updateData.deadline = newDate + 'T' + (newTime || '23:59');
                    }
                    await db.collection('companies').doc(currentCompany).collection('tasks').doc(taskId).update(updateData);
                    
                    if (task) {
                        task.deadlineDate = newDate;
                        task.deadlineTime = newTime;
                    }
                    
                    logTaskChange(taskId, 'deadline', { deadlineDate: newDate, deadlineTime: newTime }, { deadlineDate: oldDate, deadlineTime: oldTime });
                    refreshCurrentView();
                    showToast(t('deadlineUpdated'), 'success');
                } catch (e) {
                    td.innerHTML = originalHTML;
                    showToast(t('error') + ': ' + e.message, 'error');
                }
            }
            
            dateInput.addEventListener('change', () => {}); // just update value
            timeInput.addEventListener('change', () => {}); // just update value
            
            function handleBlur() {
                setTimeout(() => {
                    if (wrap.contains(document.activeElement)) return; // still inside wrap
                    if (!saved) {
                        const newDate = dateInput.value;
                        const newTime = timeInput.value;
                        if (newDate !== (currentDate || '') || newTime !== (task?.deadlineTime || '')) {
                            save();
                        } else {
                            td.innerHTML = originalHTML;
                        }
                    }
                }, 200);
            }
            dateInput.addEventListener('blur', handleBlur);
            timeInput.addEventListener('blur', handleBlur);
            
            dateInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') td.innerHTML = originalHTML; });
            timeInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') td.innerHTML = originalHTML; });
        }
        
        async function cycleTaskStatus(taskId, e) {
            e.stopPropagation();
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex < 0) return;
            const task = tasks[taskIndex];
            
            // Permission check
            if (!canEditTask(task)) {
                showToast(t('noPermissionTask'), 'error');
                return;
            }
            
            // Визначаємо наступний статус
            let newStatus;
            if (task.status === 'new') newStatus = 'progress';
            else if (task.status === 'progress') newStatus = shouldSendForReview(task) ? 'review' : 'done';
            else if (task.status === 'review') {
                // Review → викликаємо повноцінний accept (з reviewedAt/reviewedBy)
                acceptReviewTask(taskId);
                return;
            }
            else if (task.status === 'done') newStatus = 'progress';
            else return;
            
            const originalTask = deepCloneTask(tasks[taskIndex]);
            
            tasks[taskIndex].status = newStatus;
            if (newStatus === 'done') tasks[taskIndex].completedAt = new Date().toISOString();
            else tasks[taskIndex].completedAt = null;
            
            renderMyDay();
            refreshCurrentView();
            
            try {
                const update = { status: newStatus, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
                if (newStatus === 'done') {
                    update.completedAt = firebase.firestore.FieldValue.serverTimestamp();
                    update.completedBy = currentUser.uid;
                } else {
                    update.completedAt = null;
                }
                if (newStatus === 'review') {
                    update.sentForReviewAt = firebase.firestore.FieldValue.serverTimestamp();
                }
                await db.collection('companies').doc(currentCompany).collection('tasks').doc(taskId).update(update);
                if (newStatus === 'done') advanceProcessIfLinked(taskId);
                if (newStatus === 'review') showToast(t('taskSentForReview'), 'info');
                // Автостатус проекту
                if (task.projectId) autoUpdateProjectStatus(task.projectId);
                // AUDIT LOG
                logTaskChange(taskId, newStatus === 'done' ? 'complete' : 'status', { status: newStatus }, { status: originalTask.status });
            } catch(err) {
                tasks[taskIndex] = originalTask;
                renderMyDay();
                refreshCurrentView();
                showToast(t('error') + ': ' + err.message, 'error');
            }
        }
        
        // Sync search inputs (desktop ↔ mobile)
        function syncSearchInputs(source) {
            const desktop = document.getElementById('taskSearchInput');
            const mobile = document.getElementById('mobileTaskSearchInput');
            if (source === desktop && mobile) mobile.value = desktop.value;
            else if (source === mobile && desktop) desktop.value = mobile.value;
        }
        
        function formatDateShort(dateStr) {
            if (!dateStr) return '-';
            try {
                const parts = dateStr.split('-');
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[2]);
                const monthShort = getMonthNames();
                return `${day} ${monthShort[month]}`;
            } catch(e) { return dateStr; }
        }
