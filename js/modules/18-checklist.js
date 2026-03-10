// =====================
        // CHECKLIST
        // =====================
'use strict';
        let checklistCounter = 0;
        
        function addChecklistItem(text = '', checked = false) {
            checklistCounter++;
            const id = 'cl_' + checklistCounter;
            const container = document.getElementById('taskChecklist');
            const item = document.createElement('div');
            item.id = id;
            item.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;';
            item.innerHTML = `
                <input type="checkbox" ${checked ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--primary);flex-shrink:0;">
                <input type="text" value="${esc(text)}" placeholder="${t('checklistItemPlaceholder')}" 
                       style="flex:1;padding:0.4rem 0.5rem;border:1px solid #e5e7eb;border-radius:6px;font-size:0.85rem;"
                       onkeydown="if(event.key==='Enter'){event.preventDefault();addChecklistItem();this.parentElement.nextElementSibling?.querySelector('input[type=text]')?.focus();}">
                <button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#ef4444;padding:2px;">
                    <i data-lucide="x" class="icon icon-sm"></i>
                </button>
            `;
            container.appendChild(item);
            refreshIcons();
            // Фокус на нове поле
            if (!text) item.querySelector('input[type="text"]').focus();
        }
        
        function getChecklistData() {
            const items = [];
            document.querySelectorAll('#taskChecklist > div').forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                const textInput = item.querySelector('input[type="text"]');
                if (textInput && textInput.value.trim()) {
                    items.push({ text: textInput.value.trim(), done: checkbox?.checked || false });
                }
            });
            return items;
        }
        
        function renderChecklist(checklist) {
            const container = document.getElementById('taskChecklist');
            container.innerHTML = '';
            checklistCounter = 0;
            if (!checklist || !Array.isArray(checklist)) return;
            checklist.forEach(item => addChecklistItem(item.text, item.done));
        }
