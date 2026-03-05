// =====================
        // FILE ATTACHMENTS
        // =====================
        
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
        const ALLOWED_EXTENSIONS = ['pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','webp','zip','txt','csv'];
        
        function getFileIconClass(filename) {
            const ext = (filename || '').split('.').pop().toLowerCase();
            if (['pdf'].includes(ext)) return 'pdf';
            if (['doc', 'docx', 'txt'].includes(ext)) return 'doc';
            if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
            if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'img';
            return 'other';
        }
        
        function getFileIconLabel(filename) {
            const ext = (filename || '').split('.').pop().toUpperCase();
            return ext.slice(0, 4);
        }
        
        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' ' + t('bytesB');
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' ' + t('kilobytesKB');
            return (bytes / (1024 * 1024)).toFixed(1) + ' ' + t('megabytesMB');
        }
        
        function isImageFile(filename) {
            const ext = (filename || '').split('.').pop().toLowerCase();
            return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);
        }
        
        // Load and render files for a task
        function loadTaskFiles(taskId) {
            if (!taskId) {
                document.getElementById('taskFilesList').innerHTML = '';
                document.getElementById('fileCount').textContent = '0';
                return;
            }
            
            const task = tasks.find(t => t.id === taskId);
            const files = task?.files || [];
            renderTaskFiles(files);
        }
        
        function renderTaskFiles(files) {
            const listEl = document.getElementById('taskFilesList');
            const countEl = document.getElementById('fileCount');
            
            countEl.textContent = files.length;
            
            if (files.length === 0) {
                listEl.innerHTML = '';
                return;
            }
            
            // Визначаємо creatorId задачі для мітки
            const task = editingId ? tasks.find(t => t.id === editingId) : null;
            const taskCreatorId = task?.creatorId;
            
            listEl.innerHTML = files.map((file, index) => {
                const iconClass = getFileIconClass(file.name);
                const iconLabel = getFileIconLabel(file.name);
                const isImg = isImageFile(file.name);
                const canDelete = currentUserData?.role !== 'employee' || 
                                  file.uploadedBy === currentUser?.uid;
                
                // Мітка: постановник = ТЗ, виконавець = Результат
                const isCreatorFile = file.uploadedBy === taskCreatorId;
                const roleBadge = isCreatorFile
                    ? '<span class="file-role-badge creator">ТЗ</span>'
                    : '<span class="file-role-badge executor">Результат</span>';
                
                return `
                    <div class="task-file-item ${isImg ? 'image-preview' : ''}">
                        <div class="file-preview-row">
                            <div class="task-file-icon ${iconClass}">${iconLabel}</div>
                            <div class="task-file-info">
                                <div class="task-file-name" title="${esc(file.name)}">${roleBadge} ${esc(file.name)}</div>
                                <div class="task-file-meta">
                                    <span>${formatFileSize(file.size || 0)}</span>
                                    <span>${esc(file.uploadedByName || '')}</span>
                                    ${file.uploadedAt ? `<span>${formatCommentTime(file.uploadedAt)}</span>` : ''}
                                </div>
                            </div>
                            <div class="task-file-actions">
                                <button onclick="downloadTaskFile('${escId(file.url)}')" title="${t('download')}">
                                    <i data-lucide="download" class="icon icon-sm"></i>
                                </button>
                                ${canDelete ? `<button class="delete-file" onclick="deleteTaskFile(${index})" title="${t('delete')}">
                                    <i data-lucide="trash-2" class="icon icon-sm"></i>
                                </button>` : ''}
                            </div>
                        </div>
                        ${isImg ? `<img src="${esc(file.url)}" class="file-preview-img" alt="${esc(file.name)}" onclick="window.open('${escId(file.url)}', '_blank')" loading="lazy">` : ''}
                    </div>
                `;
            }).join('');
            
            refreshIcons();
        }
        
        function downloadTaskFile(url) {
            window.open(url, '_blank');
        }
        
        async function deleteTaskFile(fileIndex) {
            if (!editingId) return;
            if (!await showConfirmModal(t('deleteFileConfirm'), { danger: true })) return;
            
            const task = tasks.find(t => t.id === editingId);
            if (!task || !task.files || !task.files[fileIndex]) return;
            
            const file = task.files[fileIndex];
            
            try {
                // Delete from Storage
                if (file.storagePath) {
                    try {
                        await storage.ref(file.storagePath).delete();
                    } catch (e) {
                        console.warn('Storage delete failed (file may not exist):', e);
                    }
                }
                
                // Remove from task
                const updatedFiles = [...task.files];
                updatedFiles.splice(fileIndex, 1);
                
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(editingId)
                    .update({ files: updatedFiles });
                
                task.files = updatedFiles;
                renderTaskFiles(updatedFiles);
                showToast(t('fileDeleted'), 'success');
            } catch (error) {
                console.error('deleteTaskFile error:', error);
                showToast(t('fileDeleteError'), 'error');
            }
        }
        
        function handleFileDrop(e) {
            e.preventDefault();
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                uploadFiles(files);
            }
        }
        
        function handleFileSelect(e) {
            const files = e.target.files;
            if (files && files.length > 0) {
                uploadFiles(files);
            }
            // Reset input so same file can be selected again
            e.target.value = '';
        }
        
        async function uploadFiles(fileList) {
            if (!editingId || !currentCompany || !currentUser) {
                showToast(t('saveTaskBeforeFiles'), 'warning');
                return;
            }
            
            const filesToUpload = Array.from(fileList);
            
            // Validate
            for (const file of filesToUpload) {
                if (file.size > MAX_FILE_SIZE) {
                    showToast(t('fileTooBig').replace('{name}', file.name), 'error');
                    return;
                }
                const ext = file.name.split('.').pop().toLowerCase();
                if (!ALLOWED_EXTENSIONS.includes(ext)) {
                    showToast(t('fileTypeNotSupported').replace('{ext}', ext), 'error');
                    return;
                }
            }
            
            const progressEl = document.getElementById('fileUploadProgress');
            const progressFill = document.getElementById('fileProgressFill');
            const progressText = document.getElementById('fileProgressText');
            progressEl.style.display = 'block';
            
            const task = tasks.find(t => t.id === editingId);
            const existingFiles = task?.files || [];
            const newFiles = [];
            
            try {
                for (let i = 0; i < filesToUpload.length; i++) {
                    const file = filesToUpload[i];
                    progressText.textContent = t('uploadProgress').replace('{i}', i + 1).replace('{total}', filesToUpload.length).replace('{name}', file.name);
                    progressFill.style.width = '10%';
                    
                    // Generate unique path
                    const timestamp = Date.now();
                    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const storagePath = `companies/${currentCompany}/tasks/${editingId}/${timestamp}_${safeName}`;
                    
                    const storageRef = storage.ref(storagePath);
                    
                    // Upload with progress tracking
                    const uploadTask = storageRef.put(file);
                    
                    await new Promise((resolve, reject) => {
                        uploadTask.on('state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                progressFill.style.width = progress + '%';
                            },
                            (error) => reject(error),
                            () => resolve()
                        );
                    });
                    
                    // Get download URL
                    const url = await storageRef.getDownloadURL();
                    
                    newFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        url: url,
                        storagePath: storagePath,
                        uploadedBy: currentUser.uid,
                        uploadedByName: currentUserData?.name || currentUser.email,
                        uploadedAt: new Date().toISOString()
                    });
                }
                
                // Save to Firestore
                const allFiles = [...existingFiles, ...newFiles];
                await db.collection('companies').doc(currentCompany)
                    .collection('tasks').doc(editingId)
                    .update({ files: allFiles });
                
                // Update local
                if (task) task.files = allFiles;
                renderTaskFiles(allFiles);
                
                progressFill.style.width = '100%';
                progressText.textContent = t('filesUploaded').replace('{n}', newFiles.length);
                
                setTimeout(() => {
                    progressEl.style.display = 'none';
                    progressFill.style.width = '0%';
                }, 2000);
                
                showToast(t('filesUploaded').replace('{n}', newFiles.length), 'success');
                
            } catch (error) {
                console.error('uploadFiles error:', error);
                progressEl.style.display = 'none';
                showToast(t('fileUploadError') + ': ' + error.message, 'error');
            }
        }
        
        // Clean up comments listener when closing modal
        const originalCloseModal = window.closeModal;
        window.closeModal = function(modalId) {
            if (modalId === 'taskModal') {
                if (commentsUnsubscribe) {
                    commentsUnsubscribe();
                    commentsUnsubscribe = null;
                    currentTaskIdForComments = null;
                }
                // Зупиняємо time tracker
                if (timeTrackerInterval) {
                    stopTimeTracker();
                }
            }
            if (originalCloseModal) {
                originalCloseModal(modalId);
            }
        };
