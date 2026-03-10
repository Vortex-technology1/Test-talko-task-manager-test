// =============================================
        // AUDIT LOG — Логування змін задач
        // =============================================
        
'use strict';
        const AUDIT_FIELD_LABELS = {
            title: t('auditFieldTitle'), status: t('auditFieldStatus'), assigneeId: t('auditFieldAssignee'),
            deadlineDate: t('auditFieldDeadline'), deadlineTime: t('auditFieldTime'), priority: t('auditFieldPriority'),
            description: t('description'), expectedResult: t('expectedResult'),
            projectId: t('project'), 'function': t('functionColon'), requireReview: t('review'),
            checklist: t('auditFieldChecklist'), coExecutorIds: t('auditFieldCoExecutors'), observerIds: t('auditFieldObservers')
        };
        
        const AUDIT_ICONS = {
            created: { icon: '+', bg: '#dcfce7' },
            status: { icon: '~', bg: '#dbeafe' },
            reassign: { icon: '@', bg: '#e0e7ff' },
            deadline: { icon: '#', bg: '#fef3c7' },
            edit: { icon: '/', bg: '#f3f4f6' },
            delete: { icon: 'x', bg: '#fee2e2' },
            complete: { icon: 'v', bg: '#dcfce7' },
            reopen: { icon: 'o', bg: '#fef3c7' },
            review: { icon: '*', bg: '#e0e7ff' },
            escalation: { icon: '!', bg: '#fee2e2' }
        };
        
        const _logDebounce = new Map();
        
        async function logTaskChange(taskId, action, changes, oldTask) {
            if (!currentCompany || !taskId) return;
            
            // Debounce: same task + action within 2s = skip
            const dKey = taskId + '_' + action;
            const now = Date.now();
            if (_logDebounce.has(dKey) && now - _logDebounce.get(dKey) < 2000) return;
            _logDebounce.set(dKey, now);
            if (_logDebounce.size > 100) {
                for (const [k, v] of _logDebounce) { if (now - v > 10000) _logDebounce.delete(k); }
            }
            
            try {
                const entry = {
                    action: action,
                    userId: currentUserData?.id || '',
                    userName: currentUserData?.name || currentUserData?.email || 'Unknown',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    changes: changes || {}
                };
                
                // Зберігаємо старі та нові значення
                if (oldTask && changes) {
                    const details = {};
                    for (const field of Object.keys(changes)) {
                        details[field] = {
                            from: oldTask[field] ?? '',
                            to: changes[field] ?? ''
                        };
                    }
                    entry.details = details;
                }
                
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(taskId)
                    .collection('history').add(entry);
            } catch (e) {
                console.warn('[AuditLog] Error:', e.message);
            }
        }
        
        async function loadTaskHistory(taskId) {
            const container = document.getElementById('historyList');
            const countEl = document.getElementById('historyCount');
            const section = document.getElementById('taskHistorySection');
            
            if (!container || !currentCompany || !taskId) return;
            
            section?.classList.remove('hidden');
            container.innerHTML = '<p style="color:var(--gray);text-align:center;font-size:0.85rem;padding:0.5rem;" data-i18n="uploading">Завантаження...</p>';
            
            try {
                const snap = await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(taskId)
                    .collection('history')
                    .orderBy('timestamp', 'desc')
                    .limit(50)
                    .get();
                
                if (countEl) countEl.textContent = snap.size;
                
                if (snap.empty) {
                    container.innerHTML = '<p style="color:var(--gray);text-align:center;font-size:0.85rem;padding:1rem;">' + t('noRecordsYet') + '</p>';
                    return;
                }
                
                let html = '';
                snap.forEach(doc => {
                    const entry = doc.data();
                    html += renderAuditEntry(entry);
                });
                container.innerHTML = html;
                
            } catch (e) {
                console.warn('[AuditLog] Load error:', e.message);
                container.innerHTML = '<p style="color:var(--gray);text-align:center;font-size:0.85rem;padding:1rem;">' + t('loadError') + '</p>';
            }
        }
        
        function renderAuditEntry(entry) {
            const iconData = AUDIT_ICONS[entry.action] || AUDIT_ICONS.edit;
            const time = entry.timestamp?.toDate?.() 
                ? entry.timestamp.toDate().toLocaleString('uk-UA', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
                : '';
            
            let actionText = '';
            switch (entry.action) {
                case 'created': actionText = t('auditCreated'); break;
                case 'complete': actionText = t('auditCompleted'); break;
                case 'reopen': actionText = t('auditReopened'); break;
                case 'review': actionText = t('auditAccepted'); break;
                case 'delete': actionText = t('auditDeleted'); break;
                case 'escalation': actionText = t('auditEscalation'); break;
                default: actionText = formatChangeDetails(entry); break;
            }
            
            return `<div class="audit-entry">
                <div class="audit-icon" style="background:${iconData.bg}">${iconData.icon}</div>
                <div class="audit-body">
                    <div><span class="audit-user">${esc(entry.userName)}</span> <span class="audit-action">${actionText}</span></div>
                    <div class="audit-time">${time}</div>
                </div>
            </div>`;
        }
        
        function formatChangeDetails(entry) {
            if (!entry.details) return t('auditChanged');
            const parts = [];
            for (const [field, vals] of Object.entries(entry.details)) {
                const label = AUDIT_FIELD_LABELS[field] || field;
                if (field === 'status') {
                    parts.push(`${t('auditChangedStatus')}: <span class="audit-value">${getStatusLabel(vals.from)}</span> → <span class="audit-value">${getStatusLabel(vals.to)}</span>`);
                } else if (field === 'assigneeId') {
                    const fromUser = users.find(u => u.id === vals.from);
                    const toUser = users.find(u => u.id === vals.to);
                    parts.push(`${t('auditReassigned')}: <span class="audit-value">${esc(fromUser?.name || vals.from || '—')}</span> → <span class="audit-value">${esc(toUser?.name || vals.to)}</span>`);
                } else if (field === 'deadlineDate' || field === 'deadlineTime') {
                    parts.push(`${t('auditChanged')} ${label.toLowerCase()}: <span class="audit-value">${esc(vals.from || '—')}</span> → <span class="audit-value">${esc(String(vals.to))}</span>`);
                } else if (field === 'priority') {
                    parts.push(`${t('auditChangedPriority')}: <span class="audit-value">${vals.from}</span> → <span class="audit-value">${vals.to}</span>`);
                } else {
                    parts.push(`${t('auditChanged')} ${label.toLowerCase()}`);
                }
            }
            return parts.join(', ') || t('auditChanged');
        }
        
        function getStatusLabel(status) {
            const map = { todo: t('auditStatusWaiting'), in_progress: t('auditStatusInProgress'), review: t('auditStatusReview'), done: t('auditStatusDone') };
            return map[status] || status || '—';
        }
        
        function toggleHistorySection() {
            const list = document.getElementById('historyList');
            const chevron = document.getElementById('historyChevron');
            if (!list) return;
            const isHidden = list.style.display === 'none';
            list.style.display = isHidden ? 'block' : 'none';
            if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : '';
        }
