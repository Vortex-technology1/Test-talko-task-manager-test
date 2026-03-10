// =====================
        // AUTO-ARCHIVE DONE TASKS (> 30 days)
        // =====================
'use strict';
        async function autoArchiveDoneTasks() {
            if (!currentCompany) return;
            
            // Run once per day max
            const lastArchiveKey = `lastArchive_${currentCompany}`;
            const lastArchive = localStorage.getItem(lastArchiveKey);
            const today = getLocalDateStr();
            if (lastArchive === today) return;
            
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                const base = db.collection('companies').doc(currentCompany);
                
                // Filter done tasks from already-loaded local array
                // This avoids: 1) composite index requirement 2) Timestamp vs string type mismatch
                const oldDoneTasks = tasks.filter(t => {
                    if (t.status !== 'done') return false;
                    // Check createdAt - can be Firestore Timestamp, ISO string, or Date
                    let created;
                    if (t.createdAt?.toDate) {
                        created = t.createdAt.toDate();
                    } else if (t.createdAt) {
                        created = new Date(t.createdAt);
                    } else {
                        return false;
                    }
                    return created < thirtyDaysAgo;
                });
                
                if (oldDoneTasks.length === 0) {
                    localStorage.setItem(lastArchiveKey, today);
                    return;
                }
                
                // Firestore batch limit = 500 operations. Each task = 2 ops (set+delete) → max 250/batch
                const BATCH_SIZE = 250;
                const committedIds = new Set();
                
                for (let i = 0; i < oldDoneTasks.length; i += BATCH_SIZE) {
                    const chunk = oldDoneTasks.slice(i, i + BATCH_SIZE);
                    const batch = db.batch();
                    
                    chunk.forEach(task => {
                        const archiveRef = base.collection('tasksArchive').doc(task.id);
                        const taskRef = base.collection('tasks').doc(task.id);
                        
                        const archiveData = {};
                        Object.keys(task).forEach(key => {
                            if (key !== 'id') archiveData[key] = task[key];
                        });
                        archiveData.archivedAt = firebase.firestore.FieldValue.serverTimestamp();
                        
                        batch.set(archiveRef, archiveData);
                        batch.delete(taskRef);
                    });
                    
                    try {
                        await batch.commit();
                        chunk.forEach(t => committedIds.add(t.id));
                    } catch (batchError) {
                        console.error(`[autoArchive] Batch ${i / BATCH_SIZE + 1} failed:`, batchError);
                        break; // Зупиняємо подальші batch, не втрачаємо дані
                    }
                }
                
                if (committedIds.size > 0) {
                    console.log(`[autoArchive] Archived ${committedIds.size} done tasks older than 30 days`);
                    tasks = tasks.filter(t => !committedIds.has(t.id));
                }
                
                localStorage.setItem(lastArchiveKey, today);
            } catch (error) {
                console.error('autoArchiveDoneTasks error:', error);
                // Non-critical — don't block UI, just log
            }
        }
