// BUSINESS STRUCTURE - Module 65 (iframe + postMessage bridge)
// ============================================================
// TM = source of truth for functions (companies/{companyId}/functions/)
// TM → iframe: sends functions[] via postMessage on every change
// iframe → TM: sends canvas-only updates (position, connections, CRUD) via postMessage
// iframe listens ONLY to functionConnections/ in Firestore (not functions/)
// ============================================================

'use strict';
let _bizIframeReady = false;

function showBizStructureTab() {
    var c = document.getElementById("bizstructureTab");
    if (!c) return;
    if (!currentCompany) {
        c.innerHTML = "<p style=\"padding:20px;color:#888;\">" + t('loadingCompany') + "</p>";
        return;
    }
    var f = document.getElementById("bizIframe");
    var expectedSrc = "biz-structure.html?company=" + encodeURIComponent(currentCompany) + "&_v=" + Date.now();
    if (!f) {
        f = document.createElement("iframe");
        f.id = "bizIframe";
        f.src = expectedSrc;
        f.style.width = "100%";
        f.style.height = "calc(100vh - 130px)";
        f.style.border = "none";
        f.style.display = "block";
        c.innerHTML = "";
        c.appendChild(f);
    }
    // Send current functions to iframe (it may already be loaded)
    sendFunctionsToIframe();
}

function hideBizStructureTab() {}

// Send functions[] array to iframe via postMessage
function sendFunctionsToIframe() {
    var f = document.getElementById("bizIframe");
    if (!f || !f.contentWindow) {
        dbg('[BIZ-BRIDGE] sendFunctionsToIframe: iframe not found in DOM');
        return;
    }
    
    if (!_bizIframeReady) {
        dbg('[BIZ-BRIDGE] sendFunctionsToIframe: iframe not ready yet');
        return;
    }
    
    dbg('[BIZ-BRIDGE] Sending', functions.length, 'functions to iframe');
    
    try {
        f.contentWindow.postMessage({
            type: 'FUNCTIONS_UPDATE',
            functions: functions.map(fn => ({
                id: fn.id,
                name: fn.name || '',
                description: fn.description || '',
                headId: fn.headId || '',
                headName: fn.headName || '',
                assigneeIds: fn.assigneeIds || [],
                assigneeNames: fn.assigneeNames || [],
                color: fn.color || '',
                canvas: fn.canvas || null,
                canvasData: fn.canvasData || null,
                createdAt: fn.createdAt || null,
                updatedAt: fn.updatedAt || null,
                status: fn.status || ''
            })),
            companyId: currentCompany
        }, '*');
        dbg('[BIZ-BRIDGE] postMessage sent successfully');
    } catch (e) {
        console.error('[BIZ-BRIDGE] postMessage error:', e);
    }
}

// Listen for messages FROM iframe
window.addEventListener('message', async function(event) {
    // Validate origin — only accept from same origin
    if (event.origin !== window.location.origin) return;
    if (!event.data || !event.data.type) return;
    
    const msg = event.data;
    
    // Log all biz-related messages
    if (msg.type.startsWith('BIZ_') || msg.type.startsWith('CANVAS_') || msg.type.startsWith('FUNCTION_')) {
        dbg('[BIZ-BRIDGE] Received message:', msg.type);
    }
    
    switch (msg.type) {
        
        case 'BIZ_IFRAME_READY':
            _bizIframeReady = true;
            dbg('[BIZ-BRIDGE] iframe ready! functions available:', functions.length);
            sendFunctionsToIframe();
            break;
            
        case 'CANVAS_POSITION_UPDATE':
            // Card moved/resized on canvas — update only canvas fields
            if (msg.functionId && currentCompany) {
                try {
                    await db.collection('companies').doc(currentCompany)
                        .collection('functions').doc(msg.functionId)
                        .update({
                            canvas: msg.canvas,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    var fn = functions.find(f => f.id === msg.functionId);
                    if (fn) fn.canvas = msg.canvas;
                } catch (e) {
                    console.error('[BIZ-BRIDGE] position update error:', e);
                }
            }
            break;
            
        case 'CANVAS_BATCH_POSITION_UPDATE':
            // Multiple cards moved (e.g. after auto-layout) — batch update
            if (msg.updates && msg.updates.length > 0 && currentCompany) {
                try {
                    var batch = db.batch();
                    var bc = 0;
                    for (var u of msg.updates) {
                        if (u.functionId) {
                            batch.update(
                                db.collection('companies').doc(currentCompany)
                                    .collection('functions').doc(u.functionId),
                                { canvas: u.canvas, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }
                            );
                            var fn2 = functions.find(f => f.id === u.functionId);
                            if (fn2) fn2.canvas = u.canvas;
                            if (++bc >= 450) { await batch.commit(); batch = db.batch(); bc = 0; }
                        }
                    }
                    if (bc > 0) await batch.commit();
                } catch (e) {
                    console.error('[BIZ-BRIDGE] batch position update error:', e);
                }
            }
            break;
            
        case 'CANVAS_DATA_UPDATE':
            // Canvas-specific fields edited (kpi, tags, stats, notes, link, color)
            if (msg.functionId && currentCompany) {
                try {
                    await db.collection('companies').doc(currentCompany)
                        .collection('functions').doc(msg.functionId)
                        .update({
                            canvasData: msg.canvasData,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    var fn3 = functions.find(f => f.id === msg.functionId);
                    if (fn3) fn3.canvasData = msg.canvasData;
                } catch (e) {
                    console.error('[BIZ-BRIDGE] canvasData update error:', e);
                }
            }
            break;
            
        case 'FUNCTION_CREATED_ON_CANVAS':
            // New function created on canvas — create in Firestore
            if (currentCompany && msg.functionData) {
                try {
                    var data = {
                        name: msg.functionData.name || t('newFunctionFallback'),
                        headId: '',
                        headName: msg.functionData.responsible || '',
                        description: msg.functionData.notes || '',
                        assigneeIds: [],
                        assigneeNames: msg.functionData.employees || [],
                        canvas: msg.functionData.canvas || { x: 100, y: 100, width: 220, height: 140 },
                        canvasData: {
                            kpi: msg.functionData.kpi || '',
                            tags: msg.functionData.tags || [],
                            statisticsArray: msg.functionData.statisticsArray || [],
                            link: msg.functionData.link || '',
                            notes: msg.functionData.notes || '',
                            color: msg.functionData.color || 'default'
                        },
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    var docRef = await db.collection('companies').doc(currentCompany)
                        .collection('functions').add(data);
                    
                    functions.unshift({ id: docRef.id, ...data, createdAt: new Date(), updatedAt: new Date() });
                    renderFunctions();
                    updateSelects();
                    
                    // Send back confirmed ID
                    var iframe = document.getElementById("bizIframe");
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                            type: 'FUNCTION_CREATED_CONFIRMED',
                            tempId: msg.functionData.tempId || '',
                            realId: docRef.id
                        }, '*');
                    }
                    
                    // Also send full update so iframe has fresh data
                    setTimeout(sendFunctionsToIframe, 300);
                } catch (e) {
                    console.error('[BIZ-BRIDGE] create function error:', e);
                }
            }
            break;
            
        case 'FUNCTION_DELETED_ON_CANVAS':
            // Delete function + connections atomically
            if (msg.functionId && currentCompany) {
                try {
                    var batch2 = db.batch();
                    
                    batch2.delete(
                        db.collection('companies').doc(currentCompany)
                            .collection('functions').doc(msg.functionId)
                    );
                    
                    var cs1 = await db.collection('companies').doc(currentCompany)
                        .collection('functionConnections')
                        .where('from', '==', msg.functionId).get();
                    var cs2 = await db.collection('companies').doc(currentCompany)
                        .collection('functionConnections')
                        .where('to', '==', msg.functionId).get();
                    
                    cs1.docs.forEach(d => batch2.delete(d.ref));
                    cs2.docs.forEach(d => batch2.delete(d.ref));
                    
                    await batch2.commit();
                    
                    functions = functions.filter(f => f.id !== msg.functionId);
                    renderFunctions();
                    updateSelects();
                } catch (e) {
                    console.error('[BIZ-BRIDGE] delete function error:', e);
                }
            }
            break;
            
        case 'FUNCTION_UPDATED_ON_CANVAS':
            // Name/description edited on canvas — update shared fields
            if (msg.functionId && msg.updates && currentCompany) {
                try {
                    var updateData = {};
                    if (msg.updates.name !== undefined) updateData.name = msg.updates.name;
                    if (msg.updates.description !== undefined) updateData.description = msg.updates.description;
                    if (msg.updates.canvas !== undefined) updateData.canvas = msg.updates.canvas;
                    if (msg.updates.canvasData !== undefined) updateData.canvasData = msg.updates.canvasData;
                    if (msg.updates.headName !== undefined) updateData.headName = msg.updates.headName;
                    updateData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                    
                    await db.collection('companies').doc(currentCompany)
                        .collection('functions').doc(msg.functionId)
                        .update(updateData);
                    
                    // Update local state (without serverTimestamp sentinel)
                    var fn4 = functions.find(f => f.id === msg.functionId);
                    if (fn4) {
                        if (msg.updates.name !== undefined) fn4.name = msg.updates.name;
                        if (msg.updates.description !== undefined) fn4.description = msg.updates.description;
                        if (msg.updates.canvas !== undefined) fn4.canvas = msg.updates.canvas;
                        if (msg.updates.canvasData !== undefined) fn4.canvasData = msg.updates.canvasData;
                        if (msg.updates.headName !== undefined) fn4.headName = msg.updates.headName;
                        fn4.updatedAt = new Date();
                    }
                    renderFunctions();
                    updateSelects();
                } catch (e) {
                    console.error('[BIZ-BRIDGE] update function error:', e);
                }
            }
            break;
    }
});
