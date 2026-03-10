// =====================
    // NEXT TASK — AI-like task prioritization
    // =====================
'use strict';
    function getNextTask() {
        const todayStr = getLocalDateStr(new Date());
        const uid = currentUser?.uid;
        if (!uid) return null;
        
        const myActive = tasks.filter(t => 
            t.assigneeId === uid && t.status !== 'done' && t.status !== 'review'
        );
        
        if (myActive.length === 0) return null;
        
        // Priority: 1) overdue by severity, 2) high priority today, 3) today by time, 4) future
        myActive.sort((a, b) => {
            const aOverdue = a.deadlineDate && a.deadlineDate < todayStr ? 1 : 0;
            const bOverdue = b.deadlineDate && b.deadlineDate < todayStr ? 1 : 0;
            if (aOverdue !== bOverdue) return bOverdue - aOverdue; // overdue first
            
            const prioScore = { high: 3, medium: 2, low: 1 };
            const aPrio = prioScore[a.priority] || 2;
            const bPrio = prioScore[b.priority] || 2;
            if (aPrio !== bPrio) return bPrio - aPrio; // high priority first
            
            // By deadline date then time
            const aDate = a.deadlineDate || '9999';
            const bDate = b.deadlineDate || '9999';
            if (aDate !== bDate) return aDate.localeCompare(bDate);
            
            const aTime = a.deadlineTime || '23:59';
            const bTime = b.deadlineTime || '23:59';
            return aTime.localeCompare(bTime);
        });
        
        return myActive[0];
    }
    
    function openNextTask() {
        const next = getNextTask();
        if (!next) {
            showToast(t('noTasksForToday'), 'success', 2000);
            return;
        }
        openTaskModal(next.id);
    }
