// =====================
        // COMMENTS SYSTEM
        // =====================
        
        let currentTaskIdForComments = null;
        let commentsUnsubscribe = null;
        
        // Initialize comments when opening task modal for editing
        function initTaskComments(taskId) {
            currentTaskIdForComments = taskId;
            const section = document.getElementById('taskCommentsSection');
            
            if (!taskId) {
                // New task - hide comments
                section.classList.add('hidden');
                document.getElementById('taskHistorySection')?.classList.add('hidden');
                return;
            }
            
            // Show comments section for existing tasks
            section.classList.remove('hidden');
            loadComments(taskId);
            loadTaskFiles(taskId);
            
            // Load audit history
            loadTaskHistory(taskId);
            
            // Re-initialize lucide icons for comment section
            if (typeof lucide !== 'undefined') {
                refreshIcons();
            }
        }
        
        // Load comments with real-time listener
        function loadComments(taskId) {
            const listEl = document.getElementById('commentsList');
            const countEl = document.getElementById('commentCount');
            
            // Unsubscribe from previous listener
            if (commentsUnsubscribe) {
                commentsUnsubscribe();
            }
            
            listEl.innerHTML = '<div class="comments-loading" data-i18n="uploading">Завантаження...</div>';
            
            // Real-time listener for comments
            commentsUnsubscribe = db.collection('companies').doc(currentCompany)
                .collection('tasks').doc(taskId)
                .collection('comments')
                .orderBy('createdAt', 'asc')
                .onSnapshot(snapshot => {
                    const comments = [];
                    snapshot.forEach(doc => {
                        comments.push({ id: doc.id, ...doc.data() });
                    });
                    
                    renderComments(comments);
                    countEl.textContent = comments.length;
                    
                    // Синхронізуємо denormalized count якщо розходиться
                    const localTask = tasks.find(t => t.id === taskId);
                    if (localTask && (localTask.commentCount || 0) !== comments.length) {
                        localTask.commentCount = comments.length;
                        db.collection('companies').doc(currentCompany)
                            .collection('tasks').doc(taskId)
                            .update({ commentCount: comments.length })
                            .catch(() => {});
                    }
                }, error => {
                    console.error('Error loading comments:', error);
                    listEl.innerHTML = '<div class="comments-empty">Помилка завантаження</div>';
                });
        }
        
        // Linkify — convert URLs to clickable links (after escaping HTML)
        function linkifyText(escapedText) {
            if (!escapedText) return '';
            // Match URLs in already-escaped text
            const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
            return escapedText.replace(urlRegex, function(url) {
                // Trim trailing punctuation that's likely not part of URL
                let cleanUrl = url.replace(/[.,;:!?)]+$/, '');
                let trailing = url.slice(cleanUrl.length);
                return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>${trailing}`;
            });
        }
        
        // Render comments list
        function renderComments(comments) {
            const listEl = document.getElementById('commentsList');
            const currentUserId = currentUser?.uid;
            
            if (comments.length === 0) {
                listEl.innerHTML = `
                    <div class="comments-empty">
                        <div class="comments-empty-icon"><i data-lucide="message-circle" class="icon icon-xl"></i></div>
                        <span data-i18n="noComments">Ще немає коментарів</span>
                    </div>
                `;
                return;
            }
            
            listEl.innerHTML = comments.map(comment => {
                const isOwn = comment.authorId === currentUserId;
                const canDelete = isOwn || isManagerOrAbove();
                const time = formatCommentTime(comment.createdAt);
                const edited = comment.editedAt ? ' <span style="font-size:0.7rem;color:#9ca3af;">(ред.)</span>' : '';

                // Escape HTML, linkify URLs, highlight @mentions
                const safeText = highlightMentions(linkifyText(escapeHtml(comment.text)));

                return `
                    <div class="comment-item ${isOwn ? 'own-comment' : ''}" data-comment-id="${comment.id}">
                        <div class="comment-header">
                            <span class="comment-author">${escapeHtml(comment.authorName || t('unknown'))}</span>
                            <span class="comment-time">${time}${edited}</span>
                            <div class="comment-actions" style="margin-left:auto;display:flex;gap:0.25rem;opacity:0;transition:opacity 0.15s;">
                                ${isOwn ? `<button onclick="editComment('${comment.id}')" title="Редагувати"
                                    style="background:none;border:none;cursor:pointer;padding:2px 4px;color:#6b7280;font-size:0.75rem;border-radius:4px;">✏️</button>` : ''}
                                ${canDelete ? `<button onclick="deleteComment('${comment.id}')" title="Видалити"
                                    style="background:none;border:none;cursor:pointer;padding:2px 4px;color:#ef4444;font-size:0.75rem;border-radius:4px;">🗑</button>` : ''}
                            </div>
                        </div>
                        <div class="comment-text" id="comment-text-${comment.id}">${safeText}</div>
                        <div class="comment-edit-form" id="comment-edit-${comment.id}" style="display:none;margin-top:0.4rem;">
                            <textarea style="width:100%;border:1px solid #e5e7eb;border-radius:8px;padding:0.4rem;font-size:0.85rem;resize:vertical;min-height:60px;"
                                id="comment-edit-input-${comment.id}">${escapeHtml(comment.text)}</textarea>
                            <div style="display:flex;gap:0.4rem;margin-top:0.3rem;">
                                <button onclick="saveCommentEdit('${comment.id}')"
                                    style="padding:0.25rem 0.6rem;background:#22c55e;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.78rem;">Зберегти</button>
                                <button onclick="cancelCommentEdit('${comment.id}')"
                                    style="padding:0.25rem 0.6rem;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;cursor:pointer;font-size:0.78rem;">Скасувати</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Показуємо кнопки при ховері
            listEl.querySelectorAll('.comment-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const acts = item.querySelector('.comment-actions');
                    if (acts) acts.style.opacity = '1';
                });
                item.addEventListener('mouseleave', () => {
                    const acts = item.querySelector('.comment-actions');
                    if (acts) acts.style.opacity = '0';
                });
            });
            
            // Scroll to bottom
            listEl.scrollTop = listEl.scrollHeight;
        }
        
        // Highlight @mentions in comment text
        function highlightMentions(text) {
            return text.replace(/@([А-Яа-яІіЇїЄєҐґA-Za-z0-9_]+)/g,
                '<span style="color:#3b82f6;font-weight:500;">@$1</span>');
        }

        // Edit comment
        window.editComment = function(commentId) {
            document.getElementById('comment-text-' + commentId).style.display = 'none';
            document.getElementById('comment-edit-' + commentId).style.display = 'block';
            const inp = document.getElementById('comment-edit-input-' + commentId);
            if (inp) { inp.focus(); inp.selectionStart = inp.value.length; }
        };
        window.cancelCommentEdit = function(commentId) {
            document.getElementById('comment-text-' + commentId).style.display = '';
            document.getElementById('comment-edit-' + commentId).style.display = 'none';
        };
        window.saveCommentEdit = async function(commentId) {
            const inp = document.getElementById('comment-edit-input-' + commentId);
            const newText = inp?.value?.trim();
            if (!newText) return;
            try {
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(currentTaskIdForComments)
                    .collection('comments').doc(commentId)
                    .update({ text: newText, editedAt: firebase.firestore.FieldValue.serverTimestamp() });
                cancelCommentEdit(commentId);
            } catch(e) { showToast('Помилка редагування', 'error'); }
        };

        // Delete comment
        window.deleteComment = async function(commentId) {
            const ok = await showConfirmModal('Видалити коментар?', { danger: true });
            if (!ok) return;
            try {
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(currentTaskIdForComments)
                    .collection('comments').doc(commentId).delete();
                db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(currentTaskIdForComments)
                    .update({ commentCount: firebase.firestore.FieldValue.increment(-1) })
                    .catch(() => {});
            } catch(e) { showToast('Помилка видалення', 'error'); }
        };

        // Format comment timestamp
        function formatCommentTime(timestamp) {
            if (!timestamp) return '';
            
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            
            // Less than 1 minute
            if (diff < 60000) return t('justNow');
            
            // Less than 1 hour
            if (diff < 3600000) {
                const mins = Math.floor(diff / 60000);
                return `${mins} хв тому`;
            }
            
            // Today
            if (date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
            }
            
            // Yesterday
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return t('yesterdayLabel') + ' ' + date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
            }
            
            // Older
            return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }) + 
                   ' ' + date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Send new comment
        async function sendComment() {
            const input = document.getElementById('commentInput');
            const btn = document.getElementById('sendCommentBtn');
            const text = input.value.trim();
            
            if (!text || !currentTaskIdForComments || !currentUser) return;
            
            btn.disabled = true;
            
            try {
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(currentTaskIdForComments)
                    .collection('comments')
                    .add({
                        text: text,
                        authorId: currentUser.uid,
                        authorName: currentUserData?.name || currentUser.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                
                // Denormalized count — для відображення на картці без subcollection query
                db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(currentTaskIdForComments)
                    .update({ commentCount: firebase.firestore.FieldValue.increment(1) })
                    .catch(() => {}); // non-blocking
                
                // Оновлюємо локально
                const localTask = tasks.find(t => t.id === currentTaskIdForComments);
                if (localTask) localTask.commentCount = (localTask.commentCount || 0) + 1;
                
                input.value = '';
                input.style.height = 'auto';
            } catch (error) {
                console.error('Error sending comment:', error);
                showToast(t('commentSendError'), 'error');
            } finally {
                btn.disabled = false;
            }
        }
        
        // Handle Enter key + @mentions dropdown in comment input
        function handleCommentKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                // Якщо відкритий mentions dropdown — вибираємо першого, не відправляємо
                const dropdown = document.getElementById('mentionsDropdown');
                if (dropdown && dropdown.style.display !== 'none') {
                    const first = dropdown.querySelector('.mention-item');
                    if (first) { first.click(); return; }
                }
                e.preventDefault();
                sendComment();
            }
            if (e.key === 'Escape') {
                hideMentionsDropdown();
            }
        }

        // @mentions dropdown
        function handleCommentInput(e) {
            const inp = e.target;
            const val = inp.value;
            const pos = inp.selectionStart;

            // Знаходимо @ перед курсором
            const beforeCursor = val.substring(0, pos);
            const atMatch = beforeCursor.match(/@([А-Яа-яІіЇїЄєҐґA-Za-z0-9_]*)$/);

            if (!atMatch) { hideMentionsDropdown(); return; }

            const query = atMatch[1].toLowerCase();
            const filtered = (typeof users !== 'undefined' ? users : [])
                .filter(u => (u.name || u.email || '').toLowerCase().includes(query))
                .slice(0, 5);

            if (!filtered.length) { hideMentionsDropdown(); return; }

            showMentionsDropdown(filtered, inp, atMatch[0]);
        }

        function showMentionsDropdown(userList, inp, matchStr) {
            let dropdown = document.getElementById('mentionsDropdown');
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.id = 'mentionsDropdown';
                dropdown.style.cssText = 'position:absolute;background:white;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.12);z-index:99999;min-width:180px;max-height:200px;overflow-y:auto;';
                document.body.appendChild(dropdown);
            }
            const rect = inp.getBoundingClientRect();
            dropdown.style.left = rect.left + 'px';
            dropdown.style.top = (rect.bottom + window.scrollY + 4) + 'px';
            dropdown.style.display = 'block';
            dropdown.innerHTML = userList.map(u => `
                <div class="mention-item" onclick="insertMention('${(u.name||u.email).replace(/'/g,'')}')" 
                    style="padding:0.5rem 0.75rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;"
                    onmouseenter="this.style.background='#f0fdf4'" onmouseleave="this.style.background=''">
                    <span style="width:26px;height:26px;background:#22c55e;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:600;flex-shrink:0;">
                        ${(u.name||u.email||'?')[0].toUpperCase()}
                    </span>
                    ${(u.name||u.email||'').replace(/</g,'&lt;')}
                </div>`).join('');
        }

        function hideMentionsDropdown() {
            const d = document.getElementById('mentionsDropdown');
            if (d) d.style.display = 'none';
        }

        window.insertMention = function(name) {
            const inp = document.getElementById('commentInput');
            if (!inp) return;
            const val = inp.value;
            const pos = inp.selectionStart;
            const beforeCursor = val.substring(0, pos);
            const afterCursor = val.substring(pos);
            const newBefore = beforeCursor.replace(/@[А-Яа-яІіЇїЄєҐґA-Za-z0-9_]*$/, '@' + name + ' ');
            inp.value = newBefore + afterCursor;
            inp.selectionStart = inp.selectionEnd = newBefore.length;
            inp.focus();
            hideMentionsDropdown();
        };

        // Закриваємо dropdown при кліку поза ним
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#mentionsDropdown') && !e.target.closest('#commentInput')) {
                hideMentionsDropdown();
            }
        });
