// =====================
        // SWIPE BETWEEN TABS
        // =====================
'use strict';
        const mobileTabs = ['tasks', 'projects', 'control', 'regular', 'users'];
        let tabSwipeStartX = 0;
        let tabSwipeStartY = 0;
        let isTabSwiping = false;
        
        function initTabSwipeGestures() {
            const mainInterface = document.getElementById('mainInterface');
            if (!mainInterface || mainInterface.dataset.tabSwipeInit) return;
            
            mainInterface.dataset.tabSwipeInit = 'true';
            
            mainInterface.addEventListener('touchstart', (e) => {
                // Ignore if swiping on a task card or modal
                if (e.target.closest('.mobile-task-card') || 
                    e.target.closest('.modal') ||
                    e.target.closest('.filter-chips') ||
                    e.target.closest('input') ||
                    e.target.closest('select') ||
                    e.target.closest('button')) {
                    return;
                }
                
                tabSwipeStartX = e.touches[0].clientX;
                tabSwipeStartY = e.touches[0].clientY;
                isTabSwiping = true;
            }, { passive: true });
            
            mainInterface.addEventListener('touchmove', (e) => {
                if (!isTabSwiping) return;
                
                const diffX = e.touches[0].clientX - tabSwipeStartX;
                const diffY = e.touches[0].clientY - tabSwipeStartY;
                
                // If scrolling vertically, cancel swipe
                if (Math.abs(diffY) > Math.abs(diffX)) {
                    isTabSwiping = false;
                }
            }, { passive: true });
            
            mainInterface.addEventListener('touchend', (e) => {
                if (!isTabSwiping) return;
                isTabSwiping = false;
                
                const diffX = e.changedTouches[0].clientX - tabSwipeStartX;
                const threshold = 100;
                
                // Get current tab
                const activeTab = document.querySelector('.tab-content.active');
                if (!activeTab) return;
                
                const currentTabId = activeTab.id.replace('Tab', '');
                const currentIndex = mobileTabs.indexOf(currentTabId);
                
                if (currentIndex === -1) return;
                
                // Swipe right = previous tab
                if (diffX > threshold && currentIndex > 0) {
                    const prevTab = mobileTabs[currentIndex - 1];
                    switchTab(prevTab);
                    showTabSwipeIndicator('←');
                }
                
                // Swipe left = next tab
                if (diffX < -threshold && currentIndex < mobileTabs.length - 1) {
                    const nextTab = mobileTabs[currentIndex + 1];
                    switchTab(nextTab);
                    showTabSwipeIndicator('→');
                }
            });
        }
        
        function showTabSwipeIndicator(direction) {
            // Brief visual feedback
            const indicator = document.createElement('div');
            indicator.className = 'tab-swipe-indicator';
            indicator.textContent = direction;
            document.body.appendChild(indicator);
            
            setTimeout(() => indicator.remove(), 300);
        }
        
        // Init on load
        document.addEventListener('DOMContentLoaded', initTabSwipeGestures);
