// =====================
    // DAILY SNAPSHOT — data for future AGI analysis
    // =====================
'use strict';
    async function saveDailySnapshot() {
        if (!currentCompany || !currentUser) return;
        const todayStr = getLocalDateStr();
        const key = `snapshot_${currentCompany}_${todayStr}`;
        if (localStorage.getItem(key)) return;
        
        // Only owner/manager saves snapshots
        if (currentUserData?.role !== 'owner' && currentUserData?.role !== 'admin') return;
        
        const activeTasks = tasks.filter(t => t.status !== 'done');
        const overdueTasks = activeTasks.filter(t => t.deadlineDate && t.deadlineDate < todayStr);
        const doneTodayTasks = tasks.filter(t => t.status === 'done' && t.completedAt && getDateStr(t.completedAt) === todayStr);
        
        // Per-user load
        const userLoads = users.map(u => ({
            uid: u.id,
            name: u.name || u.email,
            active: activeTasks.filter(t => t.assigneeId === u.id).length,
            overdue: overdueTasks.filter(t => t.assigneeId === u.id).length,
            doneToday: doneTodayTasks.filter(t => t.assigneeId === u.id).length
        }));
        
        // Per-function load
        const funcLoads = functions.map(f => ({
            name: f.name,
            active: activeTasks.filter(t => t.function === f.name).length,
            overdue: overdueTasks.filter(t => t.function === f.name).length
        }));
        
        // Process status
        const activeProc = processes.filter(p => p.status === 'active').length;
        const overdueProc = processes.filter(p => p.status === 'active' && p.deadline && p.deadline < todayStr).length;
        
        // SLA breaches
        const slaBreaches = processes.filter(p => {
            if (p.status !== 'active') return false;
            const tpl = processTemplates.find(t => t.id === p.templateId);
            if (!tpl?.steps) return false;
            const step = tpl.steps[p.currentStep || 0];
            // If step has SLA and task exists and is overdue
            return step?.slaMinutes && tasks.some(t => 
                t.processId === p.id && t.processStep === (p.currentStep || 0) && 
                t.status !== 'done' && t.deadlineDate && t.deadlineDate < todayStr
            );
        }).length;
        
        const snapshot = {
            date: todayStr,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            totals: {
                tasks: tasks.length,
                active: activeTasks.length,
                overdue: overdueTasks.length,
                doneToday: doneTodayTasks.length,
                users: users.length,
                functions: functions.length,
                activeProcesses: activeProc,
                overdueProcesses: overdueProc,
                slaBreaches: slaBreaches
            },
            userLoads,
            funcLoads,
            createdBy: currentUser.uid
        };
        
        try {
            await db.collection('companies').doc(currentCompany)
                .collection('snapshots').doc(todayStr).set(snapshot);
            localStorage.setItem(key, '1');
            console.log('[Snapshot] Daily snapshot saved for', todayStr);
        } catch (e) {
            console.warn('[Snapshot] Failed:', e.message);
        }
    }
