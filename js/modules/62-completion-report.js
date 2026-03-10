// =====================
    // COMPLETION REPORT — підтвердження виконання
    // =====================
'use strict';
    let completionReportTaskId = null;
    let completionReportCallback = null;
    
    function requiresCompletionReport(task) {
        if (!task) return false;
        // Explicit flag takes priority
        if (task.requireReport === true) return true;
        if (task.requireReport === false) return false;
        // Default: require if expectedResult or reportFormat is set
        return !!(task.reportFormat || task.expectedResult);
    }
    
    function showCompletionReport(taskId, callback) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) { callback(); return; }
        
        completionReportTaskId = taskId;
        completionReportCallback = callback;
        
        const body = document.getElementById('completionReportBody');
        
        let html = '';
        
        if (task.expectedResult) {
            html += `<div style="margin-bottom:1rem;padding:0.75rem;background:#f0fdf4;border-radius:10px;border-left:3px solid #22c55e;">
                <div style="font-size:0.7rem;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;">${t('expectedResultTitle')}</div>
                <div style="font-size:0.85rem;color:#1a1a1a;">${esc(task.expectedResult)}</div>
            </div>`;
        }
        
        if (task.reportFormat) {
            html += `<div style="margin-bottom:1rem;padding:0.75rem;background:#fffbeb;border-radius:10px;border-left:3px solid #f59e0b;">
                <div style="font-size:0.7rem;font-weight:600;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;">${t('reportFormatTitle')}</div>
                <div style="font-size:0.85rem;color:#1a1a1a;">${esc(task.reportFormat)}</div>
            </div>`;
        }
        
        html += `<div style="margin-top:0.75rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">${t('completionCommentLabel')}</label>
            <textarea id="completionReportText" style="width:100%;min-height:60px;border:1px solid #e5e7eb;border-radius:10px;padding:0.6rem;font-size:0.85rem;resize:vertical;font-family:inherit;" placeholder="${t('completionReportPlaceholder')}"></textarea>
        </div>`;
        
        body.innerHTML = html;
        document.getElementById('completionReportModal').style.display = 'block';
    }
    
    function closeCompletionReport(proceed) {
        closeModal('completionReportModal');
        if (!proceed && completionReportCallback) {
            // Cancelled — rollback optimistic update
            completingTaskIds.delete(completionReportTaskId);
            const taskIndex = tasks.findIndex(t => t.id === completionReportTaskId);
            if (taskIndex >= 0) {
                tasks[taskIndex].status = tasks[taskIndex]._prevStatus || 'progress';
                delete tasks[taskIndex]._prevStatus;
                renderMyDay();
                refreshCurrentView();
            }
        }
        completionReportTaskId = null;
        completionReportCallback = null;
    }
    
    async function submitCompletionReport() {
        const text = document.getElementById('completionReportText')?.value?.trim() || '';
        const taskId = completionReportTaskId;
        const callback = completionReportCallback;
        
        // Save completion note as comment
        if (text && taskId) {
            try {
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(taskId)
                    .collection('comments').add({
                        text: t('reportPrefix') + ' ' + text,
                        authorId: currentUser.uid,
                        authorName: currentUserData?.name || currentUser.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                // Also save as completionNote on task
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(taskId)
                    .update({ completionNote: text });
            } catch(e) {
                console.error('Save completion note error:', e);
            }
        }
        
        closeModal('completionReportModal');
        
        // Proceed with actual completion
        if (callback) callback();
        completionReportTaskId = null;
        completionReportCallback = null;
    }
