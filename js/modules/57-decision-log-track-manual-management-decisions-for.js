// =====================
    // DECISION LOG — track manual management decisions for AGI learning
    // =====================
'use strict';
    function logDecision(type, details) {
        if (!currentCompany || !currentUser) return;
        const entry = {
            type, // reassign, deadline_change, escalation_manual, priority_change, process_override
            details,
            date: getLocalDateStr(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: currentUser.uid,
            userName: currentUserData?.name || currentUser.email
        };
        
        db.collection('companies').doc(currentCompany)
            .collection('decisions').add(entry).catch(() => {});
    }
