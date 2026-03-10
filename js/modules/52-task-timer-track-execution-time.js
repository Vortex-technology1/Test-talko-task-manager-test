// =====================
    // TASK TIMER — track execution time
    // =====================
'use strict';
    let activeTimer = null;
    let timerInterval = null;
    
    function startTaskTimer(taskId) {
        if (activeTimer && activeTimer.taskId === taskId) return; // already running
        stopTaskTimer(false); // stop previous
        
        activeTimer = {
            taskId,
            startTime: Date.now()
        };
        
        // Зберігаємо в localStorage для відновлення після перезавантаження
        try {
            localStorage.setItem('talko_activeTimer', JSON.stringify({
                taskId,
                startTime: activeTimer.startTime
            }));
        } catch(e) { console.error('[52-timer]', e.message); }
        
        updateTimerDisplay(taskId);
        timerInterval = setInterval(() => updateTimerDisplay(taskId), 1000);
        
        // Save start time to Firestore
        if (currentCompany) {
            db.collection('companies').doc(currentCompany).collection('tasks').doc(taskId)
                .update({ timerStartedAt: firebase.firestore.FieldValue.serverTimestamp() })
                .catch(() => {});
        }
        
        const btn = document.getElementById('timerBtn_' + taskId);
        if (btn) {
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            btn.style.background = '#ef4444';
            btn.onclick = () => stopTaskTimer(true);
        }
    }
    
    function stopTaskTimer(save) {
        if (!activeTimer) return;
        
        // Очищаємо збережений таймер
        try { localStorage.removeItem('talko_activeTimer'); } catch(e) { console.error('[52-timer]', e.message); }
        
        clearInterval(timerInterval);
        timerInterval = null;
        
        if (save && currentCompany) {
            const elapsed = Math.round((Date.now() - activeTimer.startTime) / 60000); // minutes
            if (elapsed < 1) { activeTimer = null; return; } // less than 1 min — ignore
            
            const taskId = activeTimer.taskId;
            const entry = {
                minutes: elapsed,
                date: new Date().toISOString(),
                userName: currentUserData?.name || currentUser?.email || '',
                userId: currentUser?.uid
            };
            
            db.collection('companies').doc(currentCompany).collection('tasks').doc(taskId)
                .update({ 
                    timeLog: firebase.firestore.FieldValue.arrayUnion(entry),
                    timerStartedAt: null
                }).catch(() => {});
            
            // Update local
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                if (!task.timeLog) task.timeLog = [];
                task.timeLog.push(entry);
            }
            
            showToast(`${elapsed} ${t('min')} ${t('tracked')}`, 'success', 2000);
        }
        
        // Reset button
        const btn = document.getElementById('timerBtn_' + activeTimer.taskId);
        if (btn) {
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
            btn.style.background = '#22c55e';
            const tid = activeTimer.taskId;
            btn.onclick = () => startTaskTimer(tid);
        }
        
        const display = document.getElementById('timerDisplay_' + activeTimer.taskId);
        if (display) display.textContent = '';
        
        activeTimer = null;
    }
    
    function updateTimerDisplay(taskId) {
        if (!activeTimer || activeTimer.taskId !== taskId) return;
        const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        const display = document.getElementById('timerDisplay_' + taskId);
        if (display) display.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    function getTimerButtonHtml(taskId) {
        const isRunning = activeTimer?.taskId === taskId;
        const icon = isRunning 
            ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            : '<polygon points="5 3 19 12 5 21 5 3"/>';
        const color = isRunning ? '#ef4444' : '#22c55e';
        const action = isRunning ? `stopTaskTimer(true)` : `startTaskTimer('${escId(taskId)}')`;
        
        return `<button id="timerBtn_${escId(taskId)}" onclick="event.stopPropagation();${action}" style="display:flex;align-items:center;gap:4px;padding:3px 8px;background:${color};color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:600;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${icon}</svg>
            <span id="timerDisplay_${escId(taskId)}" style="min-width:28px;"></span>
        </button>`;

        // ─── ВІДНОВЛЕННЯ ТАЙМЕРА ПІСЛЯ ПЕРЕЗАВАНТАЖЕННЯ ─────────────
        window.restoreActiveTimer = function() {
            try {
                const saved = localStorage.getItem('talko_activeTimer');
                if (!saved) return;
                const { taskId, startTime } = JSON.parse(saved);
                
                // Перевіряємо чи задача існує і не виконана
                const task = (typeof tasks !== 'undefined' ? tasks : [])
                    .find(t => t.id === taskId && t.status !== 'done');
                if (!task) { localStorage.removeItem('talko_activeTimer'); return; }
                
                // Відновлюємо без повторного запису в localStorage
                activeTimer = { taskId, startTime };
                updateTimerDisplay(taskId);
                timerInterval = setInterval(() => updateTimerDisplay(taskId), 1000);
                
                typeof showToast === 'function' && showToast(
                    `⏱ Таймер відновлено: ${task.title.slice(0, 30)}`, 'info'
                );
            } catch(e) {
                try { localStorage.removeItem('talko_activeTimer'); } catch(e2) {}
            }
        };

    }
