// =====================
        // SWIPE TO COMPLETE (Event Delegation)
        // =====================
'use strict';
        let swipeState = {
            startX: 0,
            currentX: 0,
            isDragging: false,
            activeCard: null
        };
        
        function initSwipeHandlers() {
            // Event delegation - one listener for all cards
            const container = document.getElementById('mobileTasksList');
            if (!container || container.dataset.swipeInit) return;
            
            container.dataset.swipeInit = 'true';
            
            container.addEventListener('touchstart', (e) => {
                const card = e.target.closest('.mobile-task-card');
                if (!card) return;
                
                swipeState.startX = e.touches[0].clientX;
                swipeState.isDragging = true;
                swipeState.activeCard = card;
                swipeState.currentX = 0;
                card.classList.add('swiping');
            }, { passive: true });
            
            container.addEventListener('touchmove', (e) => {
                if (!swipeState.isDragging || !swipeState.activeCard) return;
                
                const card = swipeState.activeCard;
                const content = card.querySelector('.mobile-task-content');
                const leftBg = card.querySelector('.swipe-action-bg.left');
                const rightBg = card.querySelector('.swipe-action-bg.right');
                const canComplete = card.dataset.canComplete === 'true';
                
                if (!content) return;
                
                swipeState.currentX = e.touches[0].clientX - swipeState.startX;
                
                // Limit swipe distance
                const maxSwipe = 120;
                swipeState.currentX = Math.max(-maxSwipe, Math.min(maxSwipe, swipeState.currentX));
                
                // Apply transform
                content.style.transform = `translateX(${swipeState.currentX}px)`;
                
                // Show appropriate background
                if (swipeState.currentX > 30 && canComplete) {
                    leftBg?.classList.add('visible');
                    rightBg?.classList.remove('visible');
                } else if (swipeState.currentX < -30) {
                    rightBg?.classList.add('visible');
                    leftBg?.classList.remove('visible');
                } else {
                    leftBg?.classList.remove('visible');
                    rightBg?.classList.remove('visible');
                }
            }, { passive: true });
            
            container.addEventListener('touchend', () => {
                if (!swipeState.isDragging || !swipeState.activeCard) return;
                
                const card = swipeState.activeCard;
                const content = card.querySelector('.mobile-task-content');
                const leftBg = card.querySelector('.swipe-action-bg.left');
                const rightBg = card.querySelector('.swipe-action-bg.right');
                const canComplete = card.dataset.canComplete === 'true';
                const taskId = card.dataset.taskId;
                
                const didSwipe = Math.abs(swipeState.currentX) > 10;
                
                swipeState.isDragging = false;
                card.classList.remove('swiping');
                
                const threshold = 80;
                
                // Complete task (swipe right)
                if (swipeState.currentX > threshold && canComplete) {
                    content.style.transform = `translateX(100%)`;
                    content.style.opacity = '0';
                    setTimeout(() => {
                        quickCompleteTask(taskId);
                    }, 200);
                    swipeState.activeCard = null;
                    return;
                }
                
                // Delete task (swipe left) — підвищений поріг для захисту
                if (swipeState.currentX < -(threshold + 30)) {
                    // Haptic warning before delete
                    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
                    content.style.transform = `translateX(-100%)`;
                    content.style.opacity = '0';
                    setTimeout(() => { deleteTask(taskId); }, 250);
                    swipeState.activeCard = null;
                    return;
                }
                
                // Reset position
                if (content) content.style.transform = '';
                leftBg?.classList.remove('visible');
                rightBg?.classList.remove('visible');
                
                // Блокуємо click якщо був swipe (щоб не відкрити модалку після свайпу)
                if (didSwipe && content) {
                    content.style.pointerEvents = 'none';
                    setTimeout(() => { content.style.pointerEvents = ''; }, 50);
                }
                swipeState.currentX = 0;
                swipeState.activeCard = null;
            });
        }
