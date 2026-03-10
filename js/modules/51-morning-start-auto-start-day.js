// =====================
    // MORNING START — auto-start day
    // =====================
'use strict';
    function checkMorningStart() {
        // Morning modal disabled
        return;
    }
    
    function startMyDay() {
        document.getElementById('morningOverlay')?.remove();
        const next = getNextTask();
        if (next) openTaskModal(next.id);
    }
    
    function dismissMorning() {
        document.getElementById('morningOverlay')?.remove();
    }
