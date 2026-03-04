// =====================
    // AI ASSISTANTS CONFIG (owner panel)
    // =====================
    function openAiAssistantsModal() {
        if (!isSuperAdmin) {
            showToast(t('adminOnlyTalko'), 'error'); return;
        }
        loadAiAssistants();
        loadAiApiKey();
        document.getElementById('aiAssistantsModal').style.display = 'block';
        refreshIconsNow();
    }
    
    async function loadAiApiKey() {
        // Global API key in settings/ai
        const doc = await db.collection('settings').doc('ai').get();
        const key = doc.exists ? (doc.data()?.openaiApiKey || '') : '';
        document.getElementById('aiApiKeyInput').value = key ? key.substring(0, 8) + '...' : '';
    }
    
    async function saveAiApiKey() {
        const key = document.getElementById('aiApiKeyInput').value.trim();
        if (!key || key.includes('...')) return;
        await db.collection('settings').doc('ai').set({ openaiApiKey: key }, { merge: true });
        // Also save to current company if exists (for Cloud Function fallback)
        if (currentCompany) {
            await db.collection('companies').doc(currentCompany).update({ openaiApiKey: key }).catch(() => {});
        }
        showToast(t('apiKeySaved'), 'success');
        document.getElementById('aiApiKeyInput').value = key.substring(0, 8) + '...';
    }
    
    async function loadAiAssistants() {
        // Global assistants in settings/aiAssistants
        const snap = await db.collection('settings').doc('ai')
            .collection('assistants').get();
        
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const container = document.getElementById('aiAssistantsList');
        
        if (list.length === 0) {
            container.innerHTML = '<p style="color:#6b7280;text-align:center;">' + t('noAssistantsHint') + '</p>';
            return;
        }
        
        container.innerHTML = list.map(a => `
            <div style="padding:0.75rem;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                    <strong>${esc(a.name || a.id)}</strong>
                    <span style="font-size:0.7rem;background:#f3f4f6;padding:2px 6px;border-radius:4px;">${esc(a.model || 'gpt-4o-mini')}</span>
                </div>
                <textarea onchange="updateAssistantPrompt('${escId(a.id)}', this.value)" style="width:100%;min-height:80px;border:1px solid #e5e7eb;border-radius:6px;padding:0.5rem;font-size:0.75rem;resize:vertical;">${esc(a.systemPrompt || '')}</textarea>
                <div style="display:flex;gap:0.5rem;margin-top:0.3rem;">
                    <select onchange="updateAssistantModel('${escId(a.id)}', this.value)" style="font-size:0.75rem;padding:0.2rem;border:1px solid #e5e7eb;border-radius:4px;">
                        <option value="gpt-4o-mini" ${a.model === 'gpt-4o-mini' ? 'selected' : ''}>GPT-4o Mini ($)</option>
                        <option value="gpt-4.1-mini" ${a.model === 'gpt-4.1-mini' ? 'selected' : ''}>GPT-4.1 Mini ($)</option>
                        <option value="gpt-4.1" ${a.model === 'gpt-4.1' ? 'selected' : ''}>GPT-4.1 ($$)</option>
                        <option value="gpt-4o" ${a.model === 'gpt-4o' ? 'selected' : ''}>GPT-4o ($$)</option>
                        <option value="gpt-5.2" ${a.model === 'gpt-5.2' ? 'selected' : ''}>GPT-5.2 ($$$)</option>
                    </select>
                    <button onclick="deleteAiAssistant('${escId(a.id)}')" class="btn btn-small btn-danger" style="font-size:0.7rem;padding:2px 8px;">
                        <i data-lucide="trash-2" class="icon icon-sm"></i>
                    </button>
                </div>
            </div>
        `).join('');
        refreshIconsNow();
    }
    
    async function addAiAssistant() {
        const name = prompt(t('assistantName'));
        if (!name) return;
        
        await db.collection('settings').doc('ai')
            .collection('assistants').add({
                name,
                systemPrompt: '',
                model: 'gpt-4o-mini',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        loadAiAssistants();
    }
    
    async function updateAssistantPrompt(id, prompt) {
        await db.collection('settings').doc('ai')
            .collection('assistants').doc(id).update({ systemPrompt: prompt });
    }
    
    async function updateAssistantModel(id, model) {
        await db.collection('settings').doc('ai')
            .collection('assistants').doc(id).update({ model });
    }
    
    async function deleteAiAssistant(id) {
        if (!await showConfirmModal(t('deleteAssistant'), { danger: true })) return;
        await db.collection('settings').doc('ai')
            .collection('assistants').doc(id).delete();
        loadAiAssistants();
    }
    
    async function ensureDefaultAssistants() {
        // Global: settings/ai/assistants/structureGenerator
        const ref = db.collection('settings').doc('ai')
            .collection('assistants').doc('structureGenerator');
        const doc = await ref.get();
        
        if (!doc.exists) {
            await ref.set({
                name: t('structureGenerator'),
                model: 'gpt-5.2',
                systemPrompt: `Ти — AI-консультант з організації бізнесу. Генеруй структуру компанії у форматі JSON.

ФОРМАТ ВІДПОВІДІ (тільки JSON, без пояснень):
{
  "functions": [
    {
      "name": "Назва функції",
      "description": "Що робить ця функція",
      "regularTasks": [
        {
          "title": "Назва регулярної задачі",
          "instruction": "Що конкретно робити",
          "scheduleType": "daily|weekly|monthly",
          "scheduleDays": [1,2,3,4,5],
          "deadlineTime": "18:00"
        }
      ]
    }
  ],
  "processTemplates": [
    {
      "name": "Назва процесу",
      "description": "Опис",
      "steps": [
        {
          "function": "Назва функції (з functions вище)",
          "title": "Назва кроку",
          "expectedResult": "Що має бути зроблено",
          "controlQuestion": "Як перевірити?",
          "instruction": "Інструкція виконавцю",
          "slaMinutes": 480,
          "checkpoint": false,
          "smartAssign": true
        }
      ]
    }
  ]
}

ПРАВИЛА:
- Генеруй 5-10 функцій під конкретний бізнес
- Кожна функція — 2-5 регулярних задач
- 2-4 шаблони бізнес-процесів
- scheduleDays: 1=Пн, 2=Вт, ... 5=Пт, 6=Сб, 0=Нд
- slaMinutes: реалістичний час на крок (240=4год, 480=8год, 1440=1день)
- Пиши українською
- Тільки JSON у відповіді, без markdown`,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }
