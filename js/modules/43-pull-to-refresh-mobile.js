// =====================
        // PULL-TO-REFRESH (mobile)
        // =====================
        
        // Skeleton loading helpers
'use strict';
        let skeletonShown = false;
        
        function showSkeletonLoading() {
            // Показуємо skeleton тільки якщо контент порожній (перше завантаження)
            const mydayContent = document.getElementById('mydayContent');
            if (!mydayContent || mydayContent.children.length > 0) return;
            if (skeletonShown) return;
            skeletonShown = true;
            
            const skeletonHTML = Array.from({ length: 5 }, () => `
                <div class="skeleton-card">
                    <div class="skeleton-line long"></div>
                    <div class="skeleton-row" style="margin-top:0.3rem;">
                        <div class="skeleton-circle"></div>
                        <div class="skeleton-line short" style="margin:0;flex:1;"></div>
                    </div>
                </div>
            `).join('');
            
            mydayContent.innerHTML = `<div id="skeletonContainer">${skeletonHTML}</div>`;
        }
        
        function hideSkeletonLoading() {
            const skeleton = document.getElementById('skeletonContainer');
            if (skeleton) skeleton.remove();
            skeletonShown = false;
        }
        function initPullToRefresh() {
            const mainEl = document.getElementById('mainInterface');
            if (!mainEl || mainEl.dataset.ptrInit) return;
            mainEl.dataset.ptrInit = 'true';
            
            const indicator = document.getElementById('ptrIndicator');
            let startY = 0;
            let currentDeltaY = 0;
            let pulling = false;
            let refreshing = false;
            const threshold = 60;
            
            mainEl.addEventListener('touchstart', (e) => {
                if (refreshing) return;
                if (window.scrollY > 5) return;
                startY = e.touches[0].clientY;
                currentDeltaY = 0;
                pulling = true;
            }, { passive: true });
            
            mainEl.addEventListener('touchmove', (e) => {
                if (!pulling || refreshing) return;
                currentDeltaY = e.touches[0].clientY - startY;
                if (currentDeltaY > 20 && currentDeltaY < threshold * 2.5) {
                    indicator.classList.add('pulling');
                    indicator.classList.remove('refreshing');
                } else if (currentDeltaY <= 20) {
                    indicator.classList.remove('pulling');
                }
            }, { passive: true });
            
            mainEl.addEventListener('touchend', async () => {
                if (!pulling || refreshing) return;
                pulling = false;
                
                // Перевіряємо що реально потягнули достатньо (не випадковий тик)
                if (currentDeltaY >= threshold && indicator.classList.contains('pulling')) {
                    indicator.classList.remove('pulling');
                    indicator.classList.add('refreshing');
                    refreshing = true;
                    
                    try {
                        await loadAllData();
                    } catch (e) {
                        console.error('PTR refresh error:', e);
                    }
                    
                    indicator.classList.remove('refreshing');
                    refreshing = false;
                } else {
                    indicator.classList.remove('pulling');
                }
                currentDeltaY = 0;
            }, { passive: true });
        }
        
        document.addEventListener('DOMContentLoaded', initPullToRefresh);
