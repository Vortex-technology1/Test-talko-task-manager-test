// =====================
        // DEMO DATA
        // =====================
        
        function openDemoDataModal() {
            if (!isSuperAdmin) {
                showToast(t('superAdminOnly'), 'error');
                return;
            }
            document.getElementById('demoDataModal').style.display = 'flex';
            refreshIcons();
        }
        
        function closeDemoDataModal() {
            document.getElementById('demoDataModal').style.display = 'none';
        }
        
        async function clearAllCompanyData() {
            if (!isSuperAdmin) return;
            if (!currentCompany) return;
            
            const confirmText = t('deleteAllConfirmText');
            const input = prompt(`Введіть "${confirmText}" щоб підтвердити повне видалення всіх даних компанії (крім користувачів):`);
            if (input !== confirmText) {
                if (input !== null) showToast(t('textMismatch'), 'error');
                return;
            }
            
            closeDemoDataModal();
            showToast(t('deletingData'), 'info');
            
            try {
                const companyRef = db.collection('companies').doc(currentCompany);
                const collections = ['tasks', 'regularTasks', 'functions', 'processTemplates', 'processes', 'projects', 'completedTasks', 'tasksArchive'];
                
                let totalDeleted = 0;
                for (const col of collections) {
                    const snap = await companyRef.collection(col).get();
                    if (snap.empty) continue;
                    
                    // Firestore batch max 500
                    const chunks = [];
                    let chunk = [];
                    snap.docs.forEach(doc => {
                        chunk.push(doc.ref);
                        if (chunk.length === 499) { chunks.push(chunk); chunk = []; }
                    });
                    if (chunk.length) chunks.push(chunk);
                    
                    for (const refs of chunks) {
                        const batch = db.batch();
                        refs.forEach(ref => batch.delete(ref));
                        await batch.commit();
                        totalDeleted += refs.length;
                    }
                }
                
                // Очистити локальні масиви
                tasks = []; regularTasks = []; functions = []; processes = []; processTemplates = []; projects = [];
                openProjectId = null;
                
                await loadAllData();
                showToast(t('deletedNRecords').replace('{n}', totalDeleted), 'success');
            } catch (e) {
                console.error('[ClearData]', e);
                showToast(t('deleteError') + ': ' + e.message, 'error');
            }
        }
        
        async function loadDemoData(type) {
            if (!currentCompany) {
                showAlertModal(t('createCompanyFirst'));
                closeDemoDataModal();
                return;
            }
            
            if (!await showConfirmModal(t('loadDemoConfirm'), { danger: true })) {
                return;
            }
            
            closeDemoDataModal();
            
            try {
                if (type === 'clinic') {
                    await loadClinicDemoData();
                } else if (type === 'manufacturing') {
                    await loadManufacturingDemoData();
                } else if (type === 'furniture') {
                    await loadFurnitureDemoData();
                } else if (type === 'construction') {
                    await loadConstructionDemoData();
                }
                
                await loadAllData();
                showAlertModal(t('demoDataLoaded'));
            } catch (e) {
                console.error('Error loading demo data:', e);
                showAlertModal(t('loadError') + e.message);
            }
        }
        
        async function loadClinicDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            // Demo users (if not exist)
            const demoUsers = [
                { name: 'Марія Коваленко', email: 'maria@demo.clinic', role: 'employee' },
                { name: 'Олег Петренко', email: 'oleg@demo.clinic', role: 'employee' },
                { name: 'Анна Шевченко', email: 'anna@demo.clinic', role: 'employee' }
            ];
            
            const userIds = [];
            for (const user of demoUsers) {
                const userRef = companyRef.collection('users').doc();
                batch.set(userRef, { ...user, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(userRef.id);
            }
            
            // Functions for clinic
            const clinicFunctions = [
                { name: 'Адміністрування', description: 'Запис пацієнтів, документообіг, організація роботи', assigneeIds: [userIds[0]] },
                { name: 'Лікування', description: 'Прийом пацієнтів, консультації, процедури', assigneeIds: [userIds[1]] },
                { name: 'Маркетинг', description: 'Залучення пацієнтів, реклама, соцмережі', assigneeIds: [userIds[0], userIds[2]] },
                { name: 'Закупівлі', description: 'Замовлення матеріалів, обладнання, розхідники', assigneeIds: [userIds[2]] },
                { name: 'Фінанси', description: 'Рахунки, звіти, бухгалтерія', assigneeIds: [userIds[0]] }
            ];
            
            const funcRefs = [];
            for (const func of clinicFunctions) {
                const funcRef = companyRef.collection('functions').doc();
                batch.set(funcRef, { ...func, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: funcRef.id, ...func });
            }
            
            // Regular tasks for clinic
            const clinicRegularTasks = [
                { title: 'Обдзвін пацієнтів на завтра', function: 'Адміністрування', period: 'weekly', daysOfWeek: ['1','2','3','4'], timeStart: '09:00', timeEnd: '09:30', instruction: 'Зателефонувати всім пацієнтам, записаним на завтра. Підтвердити візит. Нагадати про підготовку.', expectedResult: 'Всі пацієнти підтверджені або перенесені' },
                { title: 'Замовлення розхідних матеріалів', function: 'Закупівлі', period: 'weekly', daysOfWeek: ['5'], timeStart: '14:00', timeEnd: '15:00', instruction: 'Перевірити залишки матеріалів. Сформувати замовлення. Відправити постачальнику.', expectedResult: 'Замовлення відправлене постачальнику' },
                { title: 'Публікація в соцмережах', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['1','3','5'], timeStart: '11:00', timeEnd: '11:45', instruction: 'Підготувати та опублікувати контент в Instagram та Facebook. Мінімум 1 пост + 2 stories.', expectedResult: 'Пост опублікований, stories виставлені' },
                { title: 'Фінансовий звіт за тиждень', function: 'Фінанси', period: 'weekly', daysOfWeek: ['5'], timeStart: '17:00', timeEnd: '18:00', instruction: 'Підготувати звіт по виручці, витратах, прибутку за тиждень.', expectedResult: 'Звіт в Google Sheets оновлений' },
                { title: 'Планёрка з командою', function: 'Адміністрування', period: 'weekly', daysOfWeek: ['1'], timeStart: '08:30', timeEnd: '09:00', instruction: 'Обговорити план на тиждень, проблеми, завдання кожному.', expectedResult: 'Протокол наради, завдання делеговані' },
                { title: 'Аналіз відгуків пацієнтів', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['3'], timeStart: '16:00', timeEnd: '16:30', instruction: 'Перевірити Google Maps, Facebook, Instagram на нові відгуки. Відповісти на кожен.', expectedResult: 'Всі відгуки оброблені, відповіді надані' },
                { title: 'Місячний звіт керівнику', function: 'Фінанси', period: 'monthly', dayOfMonth: 'last', timeStart: '16:00', timeEnd: '18:00', instruction: 'Підготувати повний місячний звіт: фінанси, пацієнти, маркетинг, проблеми.', expectedResult: 'Звіт презентований керівнику' },
                { title: 'Ревізія обладнання', function: 'Закупівлі', period: 'monthly', dayOfMonth: '15', timeStart: '10:00', timeEnd: '11:30', instruction: 'Перевірити стан обладнання, скласти список необхідного ремонту/заміни.', expectedResult: 'Акт ревізії підписаний' }
            ];
            
            for (const rt of clinicRegularTasks) {
                const rtRef = companyRef.collection('regularTasks').doc();
                batch.set(rtRef, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            // Sample tasks for today/tomorrow
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Завдання прив'язані до ФУНКЦІЙ, виконавці беруться автоматично
            // Коли людина звільняється - видаляємо її з функції, нові завдання падають на нового співробітника
            const d3ago = new Date(today); d3ago.setDate(d3ago.getDate() - 3);
            const d5ago = new Date(today); d5ago.setDate(d5ago.getDate() - 5);
            const d7ago = new Date(today); d7ago.setDate(d7ago.getDate() - 7);
            const clinicTasks = [
                { title: 'Первинна консультація - Іванов І.І.', function: 'Лікування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '10:00', estimatedTime: '45', expectedResult: 'Діагноз, план лікування' },
                { title: 'Підготувати рекламну акцію', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '15:00', estimatedTime: '120', expectedResult: 'Готовий макет та текст акції' },
                { title: 'Замовити нові рукавички та маски', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', estimatedTime: '30', expectedResult: 'Замовлення оформлене' },
                { title: 'Оплатити рахунок за оренду', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '16:00', estimatedTime: '15', expectedResult: 'Рахунок оплачено' },
                { title: 'Оновити прайс-лист послуг', function: 'Адміністрування', status: 'progress', priority: 'low', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '18:00', expectedResult: 'Новий прайс затверджений' },
                { title: 'Відправити результати аналізів Сидоренку', function: 'Лікування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '12:00', expectedResult: 'Результати надіслані на email' },
                { title: 'Перевірити терміни придатності медикаментів', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(d7ago), deadlineTime: '10:00', expectedResult: 'Список прострочених, замовлення на заміну' },
                { title: 'Налаштувати email-розсилку пацієнтам', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '16:00', expectedResult: 'Шаблон розсилки готовий', reviewRejectedAt: new Date(Date.now() - 86400000).toISOString(), reviewRejectReason: 'Текст не відповідає бренду' },
                { title: 'Підготувати план закупівель на квартал', function: 'Закупівлі', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '14:00', expectedResult: 'План затверджений', reviewRejectedAt: new Date(Date.now() - 2*86400000).toISOString(), reviewRejectReason: 'Бюджет перевищений на 20%' },
                { title: 'Звіт по задоволеності пацієнтів', function: 'Маркетинг', status: 'review', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', expectedResult: 'Звіт з NPS та рекомендаціями' }
            ];
            
            for (const task of clinicTasks) {
                // Знаходимо функцію і беремо першого виконавця з неї
                const func = clinicFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                // Знаходимо ім'я виконавця по індексу в userIds
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, { 
                    ...task,
                    assigneeId: assigneeId,
                    assigneeName: assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + task.deadlineTime))
                });
            }
            
            // Завдання для поточного користувача (Owner) — щоб показувались в "Мій день"
            const ownerName = currentUserData?.name || currentUser.email;
            const ownerUserId = users.find(u => u.email === currentUser.email)?.id || currentUser.uid;
            const ownerTasks = [
                { title: 'Перевірити фінансовий звіт за тиждень', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', estimatedTime: '30', expectedResult: 'Звіт перевірений, коментарі надані' },
                { title: 'Затвердити план маркетингу на місяць', function: 'Маркетинг', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', estimatedTime: '45', expectedResult: 'План затверджений або повернутий на доробку' },
                { title: 'Провести нараду з командою', function: 'Адміністрування', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '10:00', estimatedTime: '30', expectedResult: 'Протокол наради, задачі розподілені' },
                { title: 'Переглянути відгуки пацієнтів', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '16:00', estimatedTime: '20', expectedResult: 'Відповіді на відгуки, план покращень' },
                { title: 'Стратегічна зустріч з партнером', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '11:00', estimatedTime: '60', expectedResult: 'Домовленість про співпрацю' },
                { title: 'Підписати договір з постачальником', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '15:00', estimatedTime: '20', expectedResult: 'Договір підписаний' },
                { title: 'Проаналізувати KPI команди', function: 'Адміністрування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', estimatedTime: '45', expectedResult: 'Звіт по KPI з рекомендаціями' },
                { title: 'Оновити стандарти обслуговування', function: 'Лікування', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '18:00', estimatedTime: '60', expectedResult: 'Нові стандарти затверджені' }
            ];
            
            for (const task of ownerTasks) {
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, {
                    ...task,
                    assigneeId: ownerUserId,
                    assigneeName: ownerName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + task.deadlineTime))
                });
            }
            
            // Бізнес-процеси (шаблони) для клініки
            const clinicProcessTemplates = [
                {
                    name: 'Прийом нового пацієнта',
                    description: 'Повний цикл від запису до завершення лікування',
                    steps: [
                        { name: 'Запис пацієнта', function: 'Адміністрування', estimatedTime: '15', instruction: 'Зібрати контактні дані, причину звернення, записати на зручний час' },
                        { name: 'Нагадування про візит', function: 'Адміністрування', estimatedTime: '5', instruction: 'Зателефонувати за день до візиту, підтвердити запис' },
                        { name: 'Первинний огляд', function: 'Лікування', estimatedTime: '30', instruction: 'Провести огляд, зібрати анамнез, поставити попередній діагноз' },
                        { name: 'Складання плану лікування', function: 'Лікування', estimatedTime: '20', instruction: 'Розробити план лікування, погодити з пацієнтом' },
                        { name: 'Виставлення рахунку', function: 'Фінанси', estimatedTime: '10', instruction: 'Підготувати рахунок згідно плану лікування' },
                        { name: 'Проведення процедур', function: 'Лікування', estimatedTime: '60', instruction: 'Виконати заплановані процедури' },
                        { name: 'Контрольний огляд', function: 'Лікування', estimatedTime: '20', instruction: 'Перевірити результат лікування' }
                    ]
                },
                {
                    name: 'Закупівля обладнання',
                    description: 'Процес придбання нового медичного обладнання',
                    steps: [
                        { name: 'Формування потреби', function: 'Лікування', estimatedTime: '30', instruction: 'Описати яке обладнання потрібно, характеристики, бюджет' },
                        { name: 'Пошук постачальників', function: 'Закупівлі', estimatedTime: '120', instruction: 'Знайти 3-5 постачальників, запросити КП' },
                        { name: 'Порівняння пропозицій', function: 'Закупівлі', estimatedTime: '60', instruction: 'Порівняти ціни, умови, гарантії' },
                        { name: 'Погодження з керівництвом', function: 'Фінанси', estimatedTime: '30', instruction: 'Представити варіанти, отримати схвалення' },
                        { name: 'Оформлення замовлення', function: 'Закупівлі', estimatedTime: '30', instruction: 'Підписати договір, внести передоплату' },
                        { name: 'Прийом та перевірка', function: 'Закупівлі', estimatedTime: '60', instruction: 'Прийняти обладнання, перевірити комплектність' },
                        { name: 'Введення в експлуатацію', function: 'Лікування', estimatedTime: '60', instruction: 'Встановити, налаштувати, навчити персонал' }
                    ]
                },
                {
                    name: 'Маркетингова кампанія',
                    description: 'Запуск рекламної кампанії для залучення пацієнтів',
                    steps: [
                        { name: 'Визначення цілей', function: 'Маркетинг', estimatedTime: '60', instruction: 'Визначити цільову аудиторію, KPI, бюджет' },
                        { name: 'Розробка креативів', function: 'Маркетинг', estimatedTime: '180', instruction: 'Створити банери, тексти, відео' },
                        { name: 'Погодження матеріалів', function: 'Адміністрування', estimatedTime: '30', instruction: 'Перевірити відповідність мед. законодавству' },
                        { name: 'Налаштування реклами', function: 'Маркетинг', estimatedTime: '120', instruction: 'Запустити кампанії в Google Ads, Facebook' },
                        { name: 'Моніторинг результатів', function: 'Маркетинг', estimatedTime: '30', instruction: 'Щоденно перевіряти показники, коригувати' },
                        { name: 'Звіт про результати', function: 'Маркетинг', estimatedTime: '60', instruction: 'Підготувати фінальний звіт по кампанії' }
                    ]
                }
            ];
            
            for (const template of clinicProcessTemplates) {
                const templateRef = companyRef.collection('processTemplates').doc();
                batch.set(templateRef, {
                    ...template,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Запускаємо 1 процес з кожного шаблону
                if (template.name === 'Прийом нового пацієнта') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Пацієнт Іванов І.І. — імплантація',
                        templateId: templateRef.id,
                        currentStep: 3,
                        status: 'active',
                        assigneeId: userIds[1],
                        deadline: getLocalDateStr(new Date(Date.now() + 5 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                if (template.name === 'Маркетингова кампанія') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Акція "Безкоштовна консультація"',
                        templateId: templateRef.id,
                        currentStep: 1,
                        status: 'active',
                        assigneeId: userIds[2],
                        deadline: getLocalDateStr(new Date(Date.now() + 14 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            
            // Demo projects for clinic
            const clinicProjects = [
                {
                    name: 'Відкриття другої філії',
                    description: 'Планування та запуск нової локації клініки в Луцьку',
                    color: '#3b82f6',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 30 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 90 * 86400000))
                },
                {
                    name: 'Впровадження CRM системи',
                    description: 'Автоматизація запису пацієнтів та нагадувань',
                    color: '#8b5cf6',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 14 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 45 * 86400000))
                },
                {
                    name: 'Сертифікація ISO 9001',
                    description: 'Підготовка документації та проходження аудиту',
                    color: '#f59e0b',
                    status: 'paused',
                    startDate: getLocalDateStr(new Date(Date.now() - 60 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 120 * 86400000))
                }
            ];
            
            const projectRefs = [];
            for (const proj of clinicProjects) {
                const projRef = companyRef.collection('projects').doc();
                batch.set(projRef, {
                    ...proj,
                    creatorId: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                projectRefs.push(projRef.id);
            }
            
            // Додаємо задачі з прив'язкою до проєктів
            const projectTasks = [
                // Проект 0: Відкриття другої філії (7 завдань)
                { title: 'Знайти приміщення для другої філії', function: 'Адміністрування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 7 * 86400000)), projectId: projectRefs[0] },
                { title: 'Отримати ліцензію МОЗ', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: projectRefs[0] },
                { title: 'Ремонт та облаштування кабінетів', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 45 * 86400000)), projectId: projectRefs[0] },
                { title: 'Закупівля обладнання для філії', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 40 * 86400000)), projectId: projectRefs[0] },
                { title: 'Набір персоналу для філії', function: 'Адміністрування', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 50 * 86400000)), projectId: projectRefs[0] },
                { title: 'Підключити філію до IT-інфраструктури', function: 'Адміністрування', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 55 * 86400000)), projectId: projectRefs[0] },
                { title: 'Маркетинг відкриття нової локації', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 60 * 86400000)), projectId: projectRefs[0] },
                // Проект 1: Впровадження CRM (6 завдань)
                { title: 'Порівняти CRM: Bitrix vs HubSpot vs TALKO', function: 'Маркетинг', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() - 3 * 86400000)), projectId: projectRefs[1] },
                { title: 'Налаштувати автоматичні нагадування', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 10 * 86400000)), projectId: projectRefs[1] },
                { title: 'Навчити персонал роботі з CRM', function: 'Адміністрування', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(new Date(Date.now() + 20 * 86400000)), projectId: projectRefs[1] },
                { title: 'Імпорт бази пацієнтів в CRM', function: 'Маркетинг', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 5 * 86400000)), projectId: projectRefs[1] },
                { title: 'Налаштувати воронку продажів', function: 'Маркетинг', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 8 * 86400000)), projectId: projectRefs[1] },
                { title: 'Інтеграція CRM з телефонією', function: 'Адміністрування', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 15 * 86400000)), projectId: projectRefs[1] }
            ];
            
            for (const task of projectTasks) {
                const func = clinicFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, {
                    ...task,
                    assigneeId, assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            await batch.commit();
        }
        
        async function loadManufacturingDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            // Demo users
            const demoUsers = [
                { name: 'Сергій Мельник', email: 'sergiy@demo.factory', role: 'employee' },
                { name: 'Віктор Бондаренко', email: 'viktor@demo.factory', role: 'employee' },
                { name: 'Ірина Ткаченко', email: 'iryna@demo.factory', role: 'employee' }
            ];
            
            const userIds = [];
            for (const user of demoUsers) {
                const userRef = companyRef.collection('users').doc();
                batch.set(userRef, { ...user, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(userRef.id);
            }
            
            // Functions for manufacturing
            const mfgFunctions = [
                { name: 'Виробництво', description: 'Управління виробничим процесом, контроль лінії', assigneeIds: [userIds[0]] },
                { name: 'Контроль якості', description: 'Перевірка продукції, стандарти, брак', assigneeIds: [userIds[1]] },
                { name: 'Логістика', description: 'Відвантаження, доставка, склад', assigneeIds: [userIds[2]] },
                { name: 'Постачання', description: 'Закупівля сировини, комплектуючих', assigneeIds: [userIds[2]] },
                { name: 'Обслуговування', description: 'Ремонт обладнання, профілактика', assigneeIds: [userIds[0], userIds[1]] }
            ];
            
            const funcRefs = [];
            for (const func of mfgFunctions) {
                const funcRef = companyRef.collection('functions').doc();
                batch.set(funcRef, { ...func, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: funcRef.id, ...func });
            }
            
            // Regular tasks for manufacturing
            const mfgRegularTasks = [
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '1', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів, рівень мастила, тиск, температуру.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '2', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '3', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '4', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '5', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Контроль якості партії', function: 'Контроль якості', period: 'weekly', dayOfWeek: '2', time: '14:00', estimatedTime: '60', instruction: 'Вибіркова перевірка продукції, заповнення журналу якості.' },
                { title: 'Контроль якості партії', function: 'Контроль якості', period: 'weekly', dayOfWeek: '4', time: '14:00', estimatedTime: '60', instruction: 'Вибіркова перевірка продукції.' },
                { title: 'Інвентаризація складу', function: 'Логістика', period: 'weekly', dayOfWeek: '5', time: '16:00', estimatedTime: '90', instruction: 'Перевірити залишки готової продукції та сировини. Оновити систему.' },
                { title: 'Замовлення сировини', function: 'Постачання', period: 'weekly', dayOfWeek: '1', time: '10:00', estimatedTime: '45', instruction: 'Проаналізувати потреби на тиждень, сформувати замовлення постачальникам.' },
                { title: 'Технічне обслуговування обладнання', function: 'Обслуговування', period: 'monthly', dayOfMonth: '1', time: '08:00', estimatedTime: '240', instruction: 'Повне ТО всіх верстатів: мастило, фільтри, калібрування.' },
                { title: 'Звіт по виробництву за місяць', function: 'Виробництво', period: 'monthly', dayOfMonth: 'last', time: '15:00', estimatedTime: '120', instruction: 'Підготувати звіт: обсяг виробництва, простої, брак, ефективність.' }
            ];
            
            for (const rt of mfgRegularTasks) {
                const rtRef = companyRef.collection('regularTasks').doc();
                batch.set(rtRef, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            // Sample tasks - виконавці беруться з функцій автоматично
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const mfgTasks = [
                { title: 'Виготовити партію 500 од. - Замовлення #1247', function: 'Виробництво', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', estimatedTime: '360', expectedResult: '500 одиниць готової продукції' },
                { title: 'Перевірити якість партії #1245', function: 'Контроль якості', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', estimatedTime: '60', expectedResult: 'Звіт про якість, % браку' },
                { title: 'Відвантаження клієнту ТОВ "Альфа"', function: 'Логістика', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '09:00', estimatedTime: '90', expectedResult: 'Товар відвантажено, ТТН підписана' },
                { title: 'Замовити комплектуючі до верстата #3', function: 'Постачання', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', estimatedTime: '30', expectedResult: 'Замовлення оформлене' },
                { title: 'Ремонт конвеєра - лінія 2', function: 'Обслуговування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '11:00', estimatedTime: '120', expectedResult: 'Конвеєр працює' }
            ];
            
            for (const task of mfgTasks) {
                // Знаходимо функцію і беремо першого виконавця з неї
                const func = mfgFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                // Знаходимо ім'я виконавця по індексу в userIds
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, { 
                    ...task,
                    assigneeId: assigneeId,
                    assigneeName: assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + task.deadlineTime))
                });
            }
            
            // Бізнес-процеси (шаблони) для виробництва
            const mfgProcessTemplates = [
                {
                    name: 'Виконання замовлення клієнта',
                    description: 'Повний цикл від отримання замовлення до відвантаження',
                    steps: [
                        { name: 'Отримання та підтвердження замовлення', function: 'Логістика', estimatedTime: '30', instruction: 'Отримати замовлення, перевірити наявність матеріалів, підтвердити терміни клієнту' },
                        { name: 'Перевірка сировини на складі', function: 'Постачання', estimatedTime: '30', instruction: 'Перевірити наявність всієї сировини, при потребі терміново замовити' },
                        { name: 'Планування виробництва', function: 'Виробництво', estimatedTime: '45', instruction: 'Скласти графік виробництва, розподілити по лініях' },
                        { name: 'Виготовлення продукції', function: 'Виробництво', estimatedTime: '480', instruction: 'Виготовити продукцію згідно специфікації' },
                        { name: 'Контроль якості партії', function: 'Контроль якості', estimatedTime: '60', instruction: 'Перевірити продукцію на відповідність стандартам' },
                        { name: 'Пакування та маркування', function: 'Логістика', estimatedTime: '60', instruction: 'Запакувати продукцію, нанести маркування' },
                        { name: 'Оформлення документів', function: 'Логістика', estimatedTime: '30', instruction: 'Підготувати ТТН, рахунок-фактуру, сертифікати' },
                        { name: 'Відвантаження клієнту', function: 'Логістика', estimatedTime: '60', instruction: 'Завантажити продукцію, передати документи водію' }
                    ]
                },
                {
                    name: 'Закупівля сировини',
                    description: 'Процес поповнення запасів сировини',
                    steps: [
                        { name: 'Аналіз потреб', function: 'Постачання', estimatedTime: '45', instruction: 'Проаналізувати залишки, визначити потребу на місяць' },
                        { name: 'Запит комерційних пропозицій', function: 'Постачання', estimatedTime: '60', instruction: 'Відправити запити 3-5 постачальникам' },
                        { name: 'Порівняння та вибір постачальника', function: 'Постачання', estimatedTime: '30', instruction: 'Порівняти ціни, терміни, якість' },
                        { name: 'Оформлення замовлення', function: 'Постачання', estimatedTime: '30', instruction: 'Підписати договір/специфікацію, оплатити' },
                        { name: 'Приймання на склад', function: 'Логістика', estimatedTime: '60', instruction: 'Прийняти сировину, перевірити кількість і якість' },
                        { name: 'Вхідний контроль якості', function: 'Контроль якості', estimatedTime: '45', instruction: 'Перевірити сировину на відповідність специфікації' },
                        { name: 'Оприбуткування в системі', function: 'Логістика', estimatedTime: '20', instruction: 'Внести дані в облікову систему' }
                    ]
                },
                {
                    name: 'Ремонт обладнання',
                    description: 'Процес усунення несправності обладнання',
                    steps: [
                        { name: 'Фіксація несправності', function: 'Виробництво', estimatedTime: '15', instruction: 'Зафіксувати що зламалось, симптоми, коли виникло' },
                        { name: 'Діагностика', function: 'Обслуговування', estimatedTime: '60', instruction: 'Визначити причину поломки, необхідні запчастини' },
                        { name: 'Замовлення запчастин', function: 'Постачання', estimatedTime: '30', instruction: 'Замовити необхідні запчастини (якщо немає на складі)' },
                        { name: 'Проведення ремонту', function: 'Обслуговування', estimatedTime: '180', instruction: 'Виконати ремонтні роботи' },
                        { name: 'Тестування', function: 'Обслуговування', estimatedTime: '30', instruction: 'Перевірити роботу обладнання після ремонту' },
                        { name: 'Введення в експлуатацію', function: 'Виробництво', estimatedTime: '15', instruction: 'Повернути обладнання в роботу, зробити запис в журналі' }
                    ]
                }
            ];
            
            for (const template of mfgProcessTemplates) {
                const templateRef = companyRef.collection('processTemplates').doc();
                batch.set(templateRef, {
                    ...template,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Запускаємо процеси
                if (template.name === 'Виконання замовлення клієнта') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Замовлення #1247 — ТОВ "Альфа"',
                        templateId: templateRef.id,
                        currentStep: 4,
                        status: 'active',
                        assigneeId: userIds[0],
                        deadline: getLocalDateStr(new Date(Date.now() + 3 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    const procRef2 = companyRef.collection('processes').doc();
                    batch.set(procRef2, {
                        name: 'Замовлення #1250 — ФОП Петренко',
                        templateId: templateRef.id,
                        currentStep: 1,
                        status: 'active',
                        assigneeId: userIds[2],
                        deadline: getLocalDateStr(new Date(Date.now() + 10 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                if (template.name === 'Ремонт обладнання') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Ремонт конвеєра — лінія 2',
                        templateId: templateRef.id,
                        currentStep: 3,
                        status: 'active',
                        assigneeId: userIds[0],
                        deadline: getLocalDateStr(new Date(Date.now() - 1 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            
            // Demo projects for manufacturing
            const mfgProjects = [
                {
                    name: 'Запуск нової виробничої лінії',
                    description: 'Монтаж та налагодження лінії #4 для нового продукту',
                    color: '#ef4444',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 20 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 60 * 86400000))
                },
                {
                    name: 'Автоматизація складу',
                    description: 'Впровадження WMS системи та штрихкодування',
                    color: '#3b82f6',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 7 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 45 * 86400000))
                },
                {
                    name: 'Зменшення браку на 50%',
                    description: 'Аналіз причин браку, навчання персоналу, нові стандарти',
                    color: '#22c55e',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 45 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 30 * 86400000))
                }
            ];
            
            const mfgProjectRefs = [];
            for (const proj of mfgProjects) {
                const projRef = companyRef.collection('projects').doc();
                batch.set(projRef, {
                    ...proj,
                    creatorId: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                mfgProjectRefs.push(projRef.id);
            }
            
            // Задачі з прив'язкою до проєктів
            const mfgProjectTasks = [
                // Проект 0: Запуск нової виробничої лінії (8 завдань)
                { title: 'Фундамент під лінію #4', function: 'Виробництво', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 5 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Монтаж обладнання лінії #4', function: 'Обслуговування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 14 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Тестовий запуск лінії #4', function: 'Виробництво', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Підключення електрики 380V', function: 'Обслуговування', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 3 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Калібрування датчиків лінії #4', function: 'Контроль якості', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 25 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Навчання операторів лінії #4', function: 'Виробництво', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 35 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Закупівля сировини для тестового запуску', function: 'Постачання', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 10 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Узгодження графіку змін для лінії #4', function: 'Виробництво', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(new Date(Date.now() + 28 * 86400000)), projectId: mfgProjectRefs[0] },
                // Проект 1: Автоматизація складу (7 завдань)
                { title: 'Обрати WMS систему', function: 'Логістика', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() - 2 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Закупити сканери штрихкодів', function: 'Постачання', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 7 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Розмітка зон зберігання', function: 'Логістика', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 8 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Налаштування WMS під наш склад', function: 'Логістика', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 12 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Інтеграція WMS з 1С', function: 'Логістика', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 20 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Навчання комірників роботі зі сканерами', function: 'Логістика', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 25 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Тестова інвентаризація з WMS', function: 'Логістика', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: mfgProjectRefs[1] },
                // Проект 2: Зменшення браку на 50% (7 завдань)
                { title: 'Аналіз причин браку за 6 місяців', function: 'Контроль якості', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 10 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Навчання операторів новим стандартам', function: 'Виробництво', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 14 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Встановити датчики контролю на лінії #1-3', function: 'Обслуговування', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 4 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Розробити чек-листи контролю якості', function: 'Контроль якості', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() - 7 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Впровадити систему звітів по браку', function: 'Контроль якості', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 5 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Заміна зношеного інструменту', function: 'Постачання', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 3 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Контрольний замір браку через 30 днів', function: 'Контроль якості', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: mfgProjectRefs[2] }
            ];
            
            for (const task of mfgProjectTasks) {
                const func = mfgFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, {
                    ...task,
                    assigneeId, assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            await batch.commit();
        }

        async function loadFurnitureDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            const demoUsers = [
                { name: 'Дмитро Савчук', email: 'dmytro@demo.furniture', role: 'employee' },
                { name: 'Наталія Коваль', email: 'natalia@demo.furniture', role: 'employee' },
                { name: 'Андрій Лисенко', email: 'andriy@demo.furniture', role: 'employee' },
                { name: 'Оксана Білик', email: 'oksana@demo.furniture', role: 'employee' }
            ];
            
            const userIds = [];
            for (const u of demoUsers) {
                const ref = companyRef.collection('users').doc();
                batch.set(ref, { ...u, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(ref.id);
            }
            
            const funcs = [
                { name: 'Продажі', description: 'Консультації клієнтів, оформлення замовлень, воронка продажів', assigneeIds: [userIds[1]] },
                { name: 'Виробництво', description: 'Виготовлення меблів, збірка, фурнітура', assigneeIds: [userIds[0], userIds[2]] },
                { name: 'Дизайн', description: 'Проєктування, 3D-візуалізація, підбір матеріалів', assigneeIds: [userIds[2]] },
                { name: 'Закупівлі', description: 'Матеріали, фурнітура, тканини, постачальники', assigneeIds: [userIds[0]] },
                { name: 'Доставка та монтаж', description: 'Логістика, збірка у клієнта, рекламації', assigneeIds: [userIds[0], userIds[2]] },
                { name: 'Маркетинг', description: 'Реклама, соцмережі, фото контент, виставки', assigneeIds: [userIds[1], userIds[3]] },
                { name: 'Фінанси', description: 'Рахунки, оплати, собівартість, прибуток', assigneeIds: [userIds[3]] }
            ];
            
            const funcRefs = [];
            for (const f of funcs) {
                const ref = companyRef.collection('functions').doc();
                batch.set(ref, { ...f, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: ref.id, ...f });
            }
            
            const regularTasks = [
                { title: 'Обробка нових заявок з сайту', function: 'Продажі', period: 'weekly', daysOfWeek: ['1','2','3','4','5'], timeStart: '09:00', timeEnd: '09:30', instruction: 'Перевірити CRM на нові заявки, передзвонити протягом 30 хв.', expectedResult: 'Всі заявки оброблені, статуси оновлені в CRM' },
                { title: 'Планёрка виробництва', function: 'Виробництво', period: 'weekly', daysOfWeek: ['1'], timeStart: '08:00', timeEnd: '08:30', instruction: 'Розподілити замовлення на тиждень, визначити пріоритети.', expectedResult: 'Графік виробництва на тиждень затверджений' },
                { title: 'Перевірка складських залишків', function: 'Закупівлі', period: 'weekly', daysOfWeek: ['2','5'], timeStart: '10:00', timeEnd: '10:45', instruction: 'Перевірити залишки ДСП, МДФ, фурнітури. Замовити якщо < мін. запас.', expectedResult: 'Дефіцитні позиції замовлені' },
                { title: 'Фото нових виробів для каталогу', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['3'], timeStart: '14:00', timeEnd: '15:00', instruction: 'Зфотографувати готові вироби перед відправкою. Мін. 5 фото з різних ракурсів.', expectedResult: '5+ фото в папці Google Drive' },
                { title: 'Контент для Instagram та Facebook', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['1','3','5'], timeStart: '11:00', timeEnd: '11:45', instruction: 'Підготувати та опублікувати пост: фото виробу + ціна + переваги.', expectedResult: 'Пост опублікований в 2 соцмережі' },
                { title: 'Фінансовий звіт за тиждень', function: 'Фінанси', period: 'weekly', daysOfWeek: ['5'], timeStart: '16:00', timeEnd: '17:00', instruction: 'Звіт: виручка, витрати на матеріали, ФОП, чистий прибуток.', expectedResult: 'Таблиця з P&L за тиждень' },
                { title: 'Розрахунок собівартості нових виробів', function: 'Фінанси', period: 'monthly', dayOfMonth: '1', timeStart: '10:00', timeEnd: '12:00', instruction: 'Перерахувати собівартість з урахуванням нових цін на матеріали.', expectedResult: 'Оновлений прайс з маржинальністю' },
                { title: 'Інвентаризація виробництва', function: 'Виробництво', period: 'monthly', dayOfMonth: '15', timeStart: '08:00', timeEnd: '10:00', instruction: 'Перевірити стан інструменту, верстатів, залишки матеріалів в цеху.', expectedResult: 'Акт інвентаризації' }
            ];
            
            for (const rt of regularTasks) {
                const ref = companyRef.collection('regularTasks').doc();
                batch.set(ref, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
            const d3ago = new Date(today); d3ago.setDate(d3ago.getDate() - 3);
            const d5ago = new Date(today); d5ago.setDate(d5ago.getDate() - 5);
            
            const tasksList = [
                { title: 'Кухня "Модерн" — замовлення #412', function: 'Виробництво', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', expectedResult: 'Кухня зібрана, готова до доставки' },
                { title: 'Шафа-купе для Петренко — 3D проєкт', function: 'Дизайн', status: 'review', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', expectedResult: '3D візуалізація погоджена клієнтом' },
                { title: 'Доставка та монтаж — Коваленко', function: 'Доставка та монтаж', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '10:00', expectedResult: 'Меблі встановлені, акт підписаний' },
                { title: 'Замовити фурнітуру Blum', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', expectedResult: 'Замовлення відправлене постачальнику' },
                { title: 'Рекламація — скрип дверцят у Іванченко', function: 'Доставка та монтаж', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '15:00', expectedResult: 'Проблема усунена, клієнт задоволений' },
                { title: 'Комерційна пропозиція для офісу "Альфа Груп"', function: 'Продажі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '18:00', expectedResult: 'КП з цінами та візуалізацією надіслана' },
                { title: 'Розробити дизайн стенду для виставки', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', expectedResult: 'Макет стенду затверджений', reviewRejectedAt: new Date(Date.now() - 86400000).toISOString(), reviewRejectReason: 'Не відповідає фірмовому стилю' },
                { title: 'Стіл "Лофт" — замовлення #415', function: 'Виробництво', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', expectedResult: 'Стіл готовий' },
                { title: 'Оплатити рахунок за ДСП Egger', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '16:00', expectedResult: 'Рахунок оплачений' }
            ];
            
            for (const task of tasksList) {
                const func = funcs.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                const idx = userIds.indexOf(assigneeId);
                const assigneeName = idx >= 0 ? demoUsers[idx].name : '';
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...task, assigneeId, assigneeName, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp(), deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + (task.deadlineTime || '18:00'))) });
            }
            
            // Business processes
            const processTemplates = [
                {
                    name: 'Виконання замовлення клієнта',
                    description: 'Від заявки до монтажу у клієнта',
                    steps: [
                        { name: 'Прийом замовлення', function: 'Продажі', estimatedTime: '30', instruction: 'Зафіксувати побажання, бюджет, терміни. Підписати договір.' },
                        { name: 'Замір приміщення', function: 'Дизайн', estimatedTime: '120', instruction: 'Виїхати на замір. Зафіксувати розміри, фото, особливості приміщення.' },
                        { name: '3D-проєктування', function: 'Дизайн', estimatedTime: '240', instruction: 'Створити 3D модель. Підібрати матеріали та кольори. Погодити з клієнтом.' },
                        { name: 'Розрахунок собівартості', function: 'Фінанси', estimatedTime: '60', instruction: 'Розрахувати собівартість: матеріали + робота + доставка. Підготувати рахунок.' },
                        { name: 'Закупівля матеріалів', function: 'Закупівлі', estimatedTime: '120', instruction: 'Замовити ДСП/МДФ, фурнітуру, скло, фасади за специфікацією.' },
                        { name: 'Виготовлення', function: 'Виробництво', estimatedTime: '960', instruction: 'Розкрій → кромлення → свердління → збірка → перевірка.' },
                        { name: 'Контроль якості', function: 'Виробництво', estimatedTime: '60', instruction: 'Перевірити зібраний виріб: геометрія, фурнітура, поверхня, колір.' },
                        { name: 'Доставка та монтаж', function: 'Доставка та монтаж', estimatedTime: '240', instruction: 'Доставити, зібрати у клієнта, підписати акт приймання.' }
                    ]
                },
                {
                    name: 'Рекламація клієнта',
                    description: 'Обробка скарги та усунення проблеми',
                    steps: [
                        { name: 'Прийом скарги', function: 'Продажі', estimatedTime: '15', instruction: 'Зафіксувати проблему, фото, контакти. Вибачитись.' },
                        { name: 'Діагностика проблеми', function: 'Виробництво', estimatedTime: '60', instruction: 'Визначити причину: виробничий брак, транспортування, монтаж.' },
                        { name: 'Усунення дефекту', function: 'Доставка та монтаж', estimatedTime: '120', instruction: 'Виїхати до клієнта, усунути проблему або замінити деталь.' },
                        { name: 'Контроль задоволеності', function: 'Продажі', estimatedTime: '10', instruction: 'Подзвонити через 3 дні, переконатись що все ОК. Запросити відгук.' }
                    ]
                }
            ];
            
            for (const tpl of processTemplates) {
                const tplRef = companyRef.collection('processTemplates').doc();
                batch.set(tplRef, { ...tpl, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                if (tpl.name === 'Виконання замовлення клієнта') {
                    for (const proc of [
                        { name: 'Кухня "Модерн" — Петренко', currentStep: 6, status: 'active', assigneeId: userIds[0], deadline: getLocalDateStr(new Date(Date.now() + 5*86400000)) },
                        { name: 'Шафа-купе — Іванченко О.', currentStep: 3, status: 'active', assigneeId: userIds[2], deadline: getLocalDateStr(new Date(Date.now() + 14*86400000)) },
                        { name: 'Офісні меблі — "Альфа Груп"', currentStep: 1, status: 'active', assigneeId: userIds[1], deadline: getLocalDateStr(new Date(Date.now() + 30*86400000)) }
                    ]) {
                        const pRef = companyRef.collection('processes').doc();
                        batch.set(pRef, { ...proc, templateId: tplRef.id, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    }
                }
            }
            
            // Projects
            const projects = [
                { name: 'Запуск інтернет-магазину', description: 'Сайт з каталогом, калькулятором і онлайн-замовленням', color: '#3b82f6', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 14*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 60*86400000)) },
                { name: 'Вихід на ринок Польщі', description: 'Адаптація каталогу, логістика, маркетинг для PL ринку', color: '#8b5cf6', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 7*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 90*86400000)) },
                { name: 'Оновлення виробничого цеху', description: 'Нове обладнання, вентиляція, організація простору', color: '#f59e0b', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 30*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 45*86400000)) }
            ];
            const projRefs = [];
            for (const p of projects) {
                const ref = companyRef.collection('projects').doc();
                batch.set(ref, { ...p, creatorId: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                projRefs.push(ref.id);
            }
            
            const projTasks = [
                { title: 'Обрати платформу для сайту', function: 'Маркетинг', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()-7*86400000)), projectId: projRefs[0] },
                { title: 'Фотосесія каталогу (50 виробів)', function: 'Маркетинг', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+14*86400000)), projectId: projRefs[0] },
                { title: 'Налаштувати онлайн-калькулятор', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+30*86400000)), projectId: projRefs[0] },
                { title: 'SEO та запуск реклами', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+45*86400000)), projectId: projRefs[0] },
                { title: 'Переклад каталогу на польську', function: 'Маркетинг', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+20*86400000)), projectId: projRefs[1] },
                { title: 'Знайти логістичного партнера в PL', function: 'Доставка та монтаж', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+30*86400000)), projectId: projRefs[1] },
                { title: 'Купити ЧПУ-фрезер', function: 'Закупівлі', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+14*86400000)), projectId: projRefs[2] },
                { title: 'Монтаж вентиляції в цеху', function: 'Виробництво', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+21*86400000)), projectId: projRefs[2] }
            ];
            for (const t of projTasks) {
                const func = funcs.find(f => f.name === t.function);
                const aid = func?.assigneeIds?.[0] || null;
                const ai = userIds.indexOf(aid);
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...t, assigneeId: aid, assigneeName: ai >= 0 ? demoUsers[ai].name : '', createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            await batch.commit();
        }

        async function loadConstructionDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            const demoUsers = [
                { name: 'Віталій Крищук', email: 'vitaliy@demo.build', role: 'employee' },
                { name: 'Роман Гаврилюк', email: 'roman@demo.build', role: 'employee' },
                { name: 'Олена Мартинюк', email: 'olena@demo.build', role: 'employee' },
                { name: 'Ігор Степаненко', email: 'igor@demo.build', role: 'employee' }
            ];
            
            const userIds = [];
            for (const u of demoUsers) {
                const ref = companyRef.collection('users').doc();
                batch.set(ref, { ...u, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(ref.id);
            }
            
            const funcs = [
                { name: 'Управління об\'єктами', description: 'Координація робіт на будмайданчиках, графіки, контроль', assigneeIds: [userIds[0]] },
                { name: 'Кошторис та тендери', description: 'Розрахунки, комерційні пропозиції, тендерна документація', assigneeIds: [userIds[2]] },
                { name: 'Закупівля матеріалів', description: 'Будматеріали, інструмент, техніка, постачальники', assigneeIds: [userIds[1]] },
                { name: 'Бригади та персонал', description: 'Розподіл бригад, графіки, ФОП, табель', assigneeIds: [userIds[0], userIds[1]] },
                { name: 'Проєктування', description: 'Проєктна документація, дозволи, погодження', assigneeIds: [userIds[2]] },
                { name: 'Контроль якості', description: 'Перевірка робіт, акти прихованих робіт, стандарти', assigneeIds: [userIds[0], userIds[3]] },
                { name: 'Безпека', description: 'Охорона праці, ТБ, допуски, інструктажі', assigneeIds: [userIds[3]] },
                { name: 'Фінанси', description: 'Оплати підрядникам, рахунки, бюджет об\'єктів', assigneeIds: [userIds[2], userIds[3]] }
            ];
            
            const funcRefs = [];
            for (const f of funcs) {
                const ref = companyRef.collection('functions').doc();
                batch.set(ref, { ...f, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: ref.id, ...f });
            }
            
            const regularTasks = [
                { title: 'Ранковий обхід об\'єктів', function: 'Управління об\'єктами', period: 'weekly', daysOfWeek: ['1','2','3','4','5'], timeStart: '08:00', timeEnd: '09:00', instruction: 'Перевірити: бригади на місцях, матеріали доставлені, безпека ОК, прогрес за вчора.', expectedResult: 'Звіт по кожному об\'єкту в чат' },
                { title: 'Планёрка з бригадирами', function: 'Бригади та персонал', period: 'weekly', daysOfWeek: ['1'], timeStart: '07:30', timeEnd: '08:00', instruction: 'План на тиждень: хто де працює, які матеріали потрібні, дедлайни.', expectedResult: 'Графік робіт на тиждень' },
                { title: 'Перевірка залишків на складі', function: 'Закупівля матеріалів', period: 'weekly', daysOfWeek: ['2','5'], timeStart: '10:00', timeEnd: '10:45', instruction: 'Цемент, арматура, цегла, пісок, утеплювач — перевірити і замовити якщо < 3 дні запасу.', expectedResult: 'Замовлення на дефіцитні позиції' },
                { title: 'Фотозвіт з об\'єктів', function: 'Управління об\'єктами', period: 'weekly', daysOfWeek: ['3','5'], timeStart: '16:00', timeEnd: '16:30', instruction: 'Фото прогресу кожного об\'єкту. Мін. 5 фото/об\'єкт. Завантажити в папку.', expectedResult: 'Фото в Google Drive по папках об\'єктів' },
                { title: 'Інструктаж з техніки безпеки', function: 'Безпека', period: 'weekly', daysOfWeek: ['1'], timeStart: '07:00', timeEnd: '07:30', instruction: 'Провести інструктаж для нових працівників та нагадування для постійних.', expectedResult: 'Журнал ТБ підписаний' },
                { title: 'Табель робочого часу', function: 'Бригади та персонал', period: 'weekly', daysOfWeek: ['5'], timeStart: '17:00', timeEnd: '17:30', instruction: 'Заповнити табель за тиждень по кожній бригаді.', expectedResult: 'Табель в Excel' },
                { title: 'Фінансовий звіт по об\'єктах', function: 'Фінанси', period: 'weekly', daysOfWeek: ['5'], timeStart: '16:00', timeEnd: '17:00', instruction: 'Витрати vs бюджет по кожному об\'єкту. Сигнали якщо перевищення >10%.', expectedResult: 'Звіт бюджет/факт' },
                { title: 'Перевірка дозвільних документів', function: 'Проєктування', period: 'monthly', dayOfMonth: '1', timeStart: '10:00', timeEnd: '12:00', instruction: 'Перевірити терміни дозволів, ліцензій, страховок. Продовжити якщо потрібно.', expectedResult: 'Всі документи актуальні' }
            ];
            
            for (const rt of regularTasks) {
                const ref = companyRef.collection('regularTasks').doc();
                batch.set(ref, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
            const d3ago = new Date(today); d3ago.setDate(d3ago.getDate() - 3);
            const d5ago = new Date(today); d5ago.setDate(d5ago.getDate() - 5);
            const d7ago = new Date(today); d7ago.setDate(d7ago.getDate() - 7);
            
            const tasksList = [
                { title: 'Залити фундамент — секція Б', function: 'Управління об\'єктами', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', expectedResult: 'Фундамент залитий, вібрування виконано' },
                { title: 'Замовити арматуру 12мм — 5 тонн', function: 'Закупівля матеріалів', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', expectedResult: 'Арматура замовлена, доставка через 2 дні' },
                { title: 'Підписати акт прихованих робіт — об\'єкт "Озерна"', function: 'Контроль якості', status: 'review', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '15:00', expectedResult: 'Акт підписаний інженером та замовником' },
                { title: 'Кошторис на утеплення фасаду', function: 'Кошторис та тендери', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '18:00', expectedResult: 'Кошторис з деталізацією', reviewRejectedAt: new Date(Date.now()-86400000).toISOString(), reviewRejectReason: 'Не враховано вартість лісів' },
                { title: 'Перевести бригаду Кравченка на об\'єкт "Парковий"', function: 'Бригади та персонал', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '08:00', expectedResult: 'Бригада на новому об\'єкті' },
                { title: 'Оплатити підряднику за електромонтаж', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(d7ago), deadlineTime: '16:00', expectedResult: 'Оплата виконана' },
                { title: 'Усунення зауважень інспекції', function: 'Безпека', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', expectedResult: 'Зауваження усунені, фотозвіт' },
                { title: 'Монтаж вікон — поверхи 3-5', function: 'Управління об\'єктами', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '17:00', expectedResult: 'Вікна встановлені на 3-5 поверхах' },
                { title: 'Тендерна пропозиція — ЖК "Сонячний"', function: 'Кошторис та тендери', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '12:00', expectedResult: 'Пакет тендерної документації' }
            ];
            
            for (const task of tasksList) {
                const func = funcs.find(f => f.name === task.function);
                const aid = func?.assigneeIds?.[0] || null;
                const ai = userIds.indexOf(aid);
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...task, assigneeId: aid, assigneeName: ai >= 0 ? demoUsers[ai].name : '', createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp(), deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + (task.deadlineTime || '18:00'))) });
            }
            
            // Business processes
            const processTemplates = [
                {
                    name: 'Будівництво об\'єкту',
                    description: 'Повний цикл від проєкту до здачі',
                    steps: [
                        { name: 'Проєктування та дозволи', function: 'Проєктування', estimatedTime: '2400', instruction: 'Розробити проєкт, отримати дозвіл на будівництво, погодження.' },
                        { name: 'Підготовка майданчика', function: 'Управління об\'єктами', estimatedTime: '480', instruction: 'Огородження, тимчасове електропостачання, побутовки.' },
                        { name: 'Земляні роботи та фундамент', function: 'Управління об\'єктами', estimatedTime: '960', instruction: 'Котлован, армування, заливка фундаменту.' },
                        { name: 'Зведення каркасу', function: 'Управління об\'єктами', estimatedTime: '1920', instruction: 'Стіни, перекриття, покрівля.' },
                        { name: 'Інженерні мережі', function: 'Управління об\'єктами', estimatedTime: '960', instruction: 'Електрика, водопостачання, каналізація, опалення.' },
                        { name: 'Оздоблювальні роботи', function: 'Управління об\'єктами', estimatedTime: '1440', instruction: 'Штукатурка, фарбування, підлога, плитка.' },
                        { name: 'Контроль та здача', function: 'Контроль якості', estimatedTime: '240', instruction: 'Перевірка якості, усунення дефектів, акт здачі-приймання.' }
                    ]
                },
                {
                    name: 'Тендерна пропозиція',
                    description: 'Підготовка та подача тендерної документації',
                    steps: [
                        { name: 'Аналіз тендерних умов', function: 'Кошторис та тендери', estimatedTime: '120', instruction: 'Вивчити вимоги, терміни, критерії оцінки.' },
                        { name: 'Розрахунок кошторису', function: 'Кошторис та тендери', estimatedTime: '480', instruction: 'Деталізований кошторис з розцінками та матеріалами.' },
                        { name: 'Формування пакету документів', function: 'Кошторис та тендери', estimatedTime: '240', instruction: 'Ліцензії, досвід, фін. звітність, гарантії.' },
                        { name: 'Подача та презентація', function: 'Кошторис та тендери', estimatedTime: '120', instruction: 'Подати документи, при потребі — презентація замовнику.' }
                    ]
                }
            ];
            
            for (const tpl of processTemplates) {
                const tplRef = companyRef.collection('processTemplates').doc();
                batch.set(tplRef, { ...tpl, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                if (tpl.name === 'Будівництво об\'єкту') {
                    for (const proc of [
                        { name: 'ЖК "Озерна" — корпус А', currentStep: 5, status: 'active', assigneeId: userIds[0], deadline: getLocalDateStr(new Date(Date.now() + 60*86400000)) },
                        { name: 'Котедж "Парковий 12"', currentStep: 3, status: 'active', assigneeId: userIds[0], deadline: getLocalDateStr(new Date(Date.now() + 30*86400000)) }
                    ]) {
                        const pRef = companyRef.collection('processes').doc();
                        batch.set(pRef, { ...proc, templateId: tplRef.id, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    }
                }
                if (tpl.name === 'Тендерна пропозиція') {
                    const pRef = companyRef.collection('processes').doc();
                    batch.set(pRef, { name: 'Тендер ЖК "Сонячний"', templateId: tplRef.id, currentStep: 2, status: 'active', assigneeId: userIds[2], deadline: getLocalDateStr(new Date(Date.now() + 3*86400000)), createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                }
            }
            
            // Projects
            const projects = [
                { name: 'ЖК "Озерна" — корпус А', description: '9-поверховий житловий будинок, 54 квартири', color: '#ef4444', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 90*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 180*86400000)) },
                { name: 'Котедж "Парковий 12"', description: 'Приватний котедж 280 м², під ключ', color: '#3b82f6', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 30*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 90*86400000)) },
                { name: 'Тендер ЖК "Сонячний"', description: 'Підготовка до тендеру на генпідряд', color: '#f59e0b', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 7*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 14*86400000)) }
            ];
            const projRefs = [];
            for (const p of projects) {
                const ref = companyRef.collection('projects').doc();
                batch.set(ref, { ...p, creatorId: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                projRefs.push(ref.id);
            }
            
            const projTasks = [
                { title: 'Монтаж перекриття 6-го поверху', function: 'Управління об\'єктами', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+5*86400000)), projectId: projRefs[0] },
                { title: 'Прокладка каналізації 1-3 поверхи', function: 'Управління об\'єктами', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()-10*86400000)), projectId: projRefs[0] },
                { title: 'Замовити ліфтове обладнання', function: 'Закупівля матеріалів', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+20*86400000)), projectId: projRefs[0] },
                { title: 'Заливка фундаменту — котедж', function: 'Управління об\'єктами', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()-15*86400000)), projectId: projRefs[1] },
                { title: 'Мурування стін 1-го поверху', function: 'Управління об\'єктами', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+7*86400000)), projectId: projRefs[1] },
                { title: 'Проєкт інженерних мереж котеджу', function: 'Проєктування', status: 'review', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+3*86400000)), projectId: projRefs[1] },
                { title: 'Збір тендерної документації', function: 'Кошторис та тендери', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+3*86400000)), projectId: projRefs[2] },
                { title: 'Кошторис генпідряду ЖК "Сонячний"', function: 'Кошторис та тендери', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+5*86400000)), projectId: projRefs[2] }
            ];
            for (const t of projTasks) {
                const func = funcs.find(f => f.name === t.function);
                const aid = func?.assigneeIds?.[0] || null;
                const ai = userIds.indexOf(aid);
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...t, assigneeId: aid, assigneeName: ai >= 0 ? demoUsers[ai].name : '', createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            await batch.commit();
        }
        let mobileFilters = {
            type: '',
            date: '',
            status: [],
            function: '',
            assignee: ''
        };
        
        function openFilterModal() {
            const modal = document.getElementById('filterModal');
            modal.style.display = 'flex';
            
            // Sync desktop status multi-select to mobile
            mobileFilters.status = getSelectedStatuses();
            
            // Populate function chips
            const funcContainer = document.getElementById('filterFunctionChips');
            const activeFuncs = functions.filter(f => f.status !== 'archived');
            funcContainer.innerHTML = '<div class="filter-chip selected" data-value="" onclick="selectFilterChip(this, \'function\')">' + t('all') + '</div>';
            activeFuncs.forEach(f => {
                const selected = mobileFilters.function === f.name ? 'selected' : '';
                funcContainer.innerHTML += `<div class="filter-chip ${selected}" data-value="${esc(f.name)}" onclick="selectFilterChip(this, 'function')">${esc(f.name)}</div>`;
            });
            
            // Populate assignee chips
            const assigneeContainer = document.getElementById('filterAssigneeChips');
            assigneeContainer.innerHTML = '<div class="filter-chip selected" data-value="" onclick="selectFilterChip(this, \'assignee\')">' + t('all') + '</div>';
            users.forEach(u => {
                const name = u.name || u.email.split('@')[0];
                const selected = mobileFilters.assignee === u.id ? 'selected' : '';
                assigneeContainer.innerHTML += `<div class="filter-chip ${selected}" data-value="${esc(u.id)}" onclick="selectFilterChip(this, 'assignee')">${esc(name)}</div>`;
            });
            
            // Sync current filters
            syncFilterChips();
            refreshIcons();
        }
        
        function closeFilterModal() {
            closeModal('filterModal');
        }
        
        function selectFilterChip(chip, category) {
            if (category === 'status') {
                // Multi-select logic for status
                const val = chip.dataset.value;
                if (val === '') {
                    // "Всі" clicked - deselect all specific statuses
                    mobileFilters.status = [];
                    chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
                    chip.classList.add('selected');
                } else {
                    // Toggle specific status
                    const allChip = chip.parentElement.querySelector('.filter-chip[data-value=""]');
                    if (chip.classList.contains('selected')) {
                        chip.classList.remove('selected');
                        mobileFilters.status = mobileFilters.status.filter(s => s !== val);
                    } else {
                        chip.classList.add('selected');
                        mobileFilters.status.push(val);
                    }
                    // Remove "Всі" selection if specific selected
                    if (mobileFilters.status.length > 0) {
                        allChip?.classList.remove('selected');
                    }
                    // If none selected, highlight "Всі"
                    if (mobileFilters.status.length === 0) {
                        allChip?.classList.add('selected');
                    }
                    // If all 4 selected, treat as "Всі"
                    if (mobileFilters.status.length === 4) {
                        mobileFilters.status = [];
                        chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
                        allChip?.classList.add('selected');
                    }
                }
            } else {
                // Single-select for other categories
                chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                mobileFilters[category] = chip.dataset.value;
            }
        }
        
        function syncFilterChips() {
            // Sync type
            document.querySelectorAll('#filterTypeChips .filter-chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.value === mobileFilters.type);
            });
            // Sync date
            document.querySelectorAll('#filterDateChips .filter-chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.value === mobileFilters.date);
            });
            // Sync status (multi-select)
            document.querySelectorAll('#filterStatusChips .filter-chip').forEach(c => {
                const val = c.dataset.value;
                if (val === '') {
                    c.classList.toggle('selected', mobileFilters.status.length === 0);
                } else {
                    c.classList.toggle('selected', mobileFilters.status.includes(val));
                }
            });
        }
        
        function applyFiltersAndClose() {
            // Apply filters to desktop selects
            document.getElementById('taskTypeFilter').value = mobileFilters.type;
            syncTaskTypeTabs();
            document.getElementById('dateFilter').value = mobileFilters.date;
            setStatusFilterFromArray(mobileFilters.status);
            document.getElementById('functionFilter').value = mobileFilters.function;
            document.getElementById('assigneeFilter').value = mobileFilters.assignee;
            
            // Update filter count badge
            updateFilterCount();
            
            // Update quick filter buttons
            updateQuickFilterButtons();
            
            renderTasks();
            closeFilterModal();
        }
        
        function clearAllFilters() {
            mobileFilters = { type: '', date: '', status: [], function: '', assignee: '' };
            document.querySelectorAll('.filter-chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.value === '');
            });
            applyFiltersAndClose();
        }
        
        function updateFilterCount() {
            let count = 0;
            Object.entries(mobileFilters).forEach(([key, v]) => {
                if (key === 'status') {
                    if (Array.isArray(v) && v.length > 0) count++;
                } else {
                    if (v !== '') count++;
                }
            });
            const badge = document.getElementById('activeFilterCount');
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        }
        
        function setMobileQuickFilter(filter) {
            // Toggle behavior
            if (filter === 'my') {
                mobileFilters.type = mobileFilters.type === 'my' ? '' : 'my';
                mobileFilters.date = '';
            } else if (filter === 'today') {
                mobileFilters.date = mobileFilters.date === 'today' ? '' : 'today';
                mobileFilters.type = '';
            }
            
            // Apply to desktop filters
            document.getElementById('taskTypeFilter').value = mobileFilters.type;
            document.getElementById('dateFilter').value = mobileFilters.date;
            
            updateQuickFilterButtons();
            updateFilterCount();
            renderTasks();
        }
        
        function updateQuickFilterButtons() {
            document.querySelectorAll('.mobile-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            if (mobileFilters.type === 'my') {
                document.querySelector('.mobile-filter-btn[onclick*="my"]')?.classList.add('active');
            }
            if (mobileFilters.date === 'today') {
                document.querySelector('.mobile-filter-btn[onclick*="today"]')?.classList.add('active');
            }
        }
        
        // Update bottom nav active state =====================
        // DEMO DATA
        // =====================
        
        function openDemoDataModal() {
            if (!isSuperAdmin) {
                showToast(t('superAdminOnly'), 'error');
                return;
            }
            document.getElementById('demoDataModal').style.display = 'flex';
            refreshIcons();
        }
        
        function closeDemoDataModal() {
            document.getElementById('demoDataModal').style.display = 'none';
        }
        
        async function clearAllCompanyData() {
            if (!isSuperAdmin) return;
            if (!currentCompany) return;
            
            const confirmText = t('deleteAllConfirmText');
            const input = prompt(`Введіть "${confirmText}" щоб підтвердити повне видалення всіх даних компанії (крім користувачів):`);
            if (input !== confirmText) {
                if (input !== null) showToast(t('textMismatch'), 'error');
                return;
            }
            
            closeDemoDataModal();
            showToast(t('deletingData'), 'info');
            
            try {
                const companyRef = db.collection('companies').doc(currentCompany);
                const collections = ['tasks', 'regularTasks', 'functions', 'processTemplates', 'processes', 'projects', 'completedTasks', 'tasksArchive'];
                
                let totalDeleted = 0;
                for (const col of collections) {
                    const snap = await companyRef.collection(col).get();
                    if (snap.empty) continue;
                    
                    // Firestore batch max 500
                    const chunks = [];
                    let chunk = [];
                    snap.docs.forEach(doc => {
                        chunk.push(doc.ref);
                        if (chunk.length === 499) { chunks.push(chunk); chunk = []; }
                    });
                    if (chunk.length) chunks.push(chunk);
                    
                    for (const refs of chunks) {
                        const batch = db.batch();
                        refs.forEach(ref => batch.delete(ref));
                        await batch.commit();
                        totalDeleted += refs.length;
                    }
                }
                
                // Очистити локальні масиви
                tasks = []; regularTasks = []; functions = []; processes = []; processTemplates = []; projects = [];
                openProjectId = null;
                
                await loadAllData();
                showToast(t('deletedNRecords').replace('{n}', totalDeleted), 'success');
            } catch (e) {
                console.error('[ClearData]', e);
                showToast(t('deleteError') + ': ' + e.message, 'error');
            }
        }
        
        async function loadDemoData(type) {
            if (!currentCompany) {
                showAlertModal(t('createCompanyFirst'));
                closeDemoDataModal();
                return;
            }
            
            if (!await showConfirmModal(t('loadDemoConfirm'), { danger: true })) {
                return;
            }
            
            closeDemoDataModal();
            
            try {
                if (type === 'clinic') {
                    await loadClinicDemoData();
                } else if (type === 'manufacturing') {
                    await loadManufacturingDemoData();
                } else if (type === 'furniture') {
                    await loadFurnitureDemoData();
                } else if (type === 'construction') {
                    await loadConstructionDemoData();
                }
                
                await loadAllData();
                showAlertModal(t('demoDataLoaded'));
            } catch (e) {
                console.error('Error loading demo data:', e);
                showAlertModal(t('loadError') + e.message);
            }
        }
        
        async function loadClinicDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            // Demo users (if not exist)
            const demoUsers = [
                { name: 'Марія Коваленко', email: 'maria@demo.clinic', role: 'employee' },
                { name: 'Олег Петренко', email: 'oleg@demo.clinic', role: 'employee' },
                { name: 'Анна Шевченко', email: 'anna@demo.clinic', role: 'employee' }
            ];
            
            const userIds = [];
            for (const user of demoUsers) {
                const userRef = companyRef.collection('users').doc();
                batch.set(userRef, { ...user, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(userRef.id);
            }
            
            // Functions for clinic
            const clinicFunctions = [
                { name: 'Адміністрування', description: 'Запис пацієнтів, документообіг, організація роботи', assigneeIds: [userIds[0]] },
                { name: 'Лікування', description: 'Прийом пацієнтів, консультації, процедури', assigneeIds: [userIds[1]] },
                { name: 'Маркетинг', description: 'Залучення пацієнтів, реклама, соцмережі', assigneeIds: [userIds[0], userIds[2]] },
                { name: 'Закупівлі', description: 'Замовлення матеріалів, обладнання, розхідники', assigneeIds: [userIds[2]] },
                { name: 'Фінанси', description: 'Рахунки, звіти, бухгалтерія', assigneeIds: [userIds[0]] }
            ];
            
            const funcRefs = [];
            for (const func of clinicFunctions) {
                const funcRef = companyRef.collection('functions').doc();
                batch.set(funcRef, { ...func, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: funcRef.id, ...func });
            }
            
            // Regular tasks for clinic
            const clinicRegularTasks = [
                { title: 'Обдзвін пацієнтів на завтра', function: 'Адміністрування', period: 'weekly', daysOfWeek: ['1','2','3','4'], timeStart: '09:00', timeEnd: '09:30', instruction: 'Зателефонувати всім пацієнтам, записаним на завтра. Підтвердити візит. Нагадати про підготовку.', expectedResult: 'Всі пацієнти підтверджені або перенесені' },
                { title: 'Замовлення розхідних матеріалів', function: 'Закупівлі', period: 'weekly', daysOfWeek: ['5'], timeStart: '14:00', timeEnd: '15:00', instruction: 'Перевірити залишки матеріалів. Сформувати замовлення. Відправити постачальнику.', expectedResult: 'Замовлення відправлене постачальнику' },
                { title: 'Публікація в соцмережах', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['1','3','5'], timeStart: '11:00', timeEnd: '11:45', instruction: 'Підготувати та опублікувати контент в Instagram та Facebook. Мінімум 1 пост + 2 stories.', expectedResult: 'Пост опублікований, stories виставлені' },
                { title: 'Фінансовий звіт за тиждень', function: 'Фінанси', period: 'weekly', daysOfWeek: ['5'], timeStart: '17:00', timeEnd: '18:00', instruction: 'Підготувати звіт по виручці, витратах, прибутку за тиждень.', expectedResult: 'Звіт в Google Sheets оновлений' },
                { title: 'Планёрка з командою', function: 'Адміністрування', period: 'weekly', daysOfWeek: ['1'], timeStart: '08:30', timeEnd: '09:00', instruction: 'Обговорити план на тиждень, проблеми, завдання кожному.', expectedResult: 'Протокол наради, завдання делеговані' },
                { title: 'Аналіз відгуків пацієнтів', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['3'], timeStart: '16:00', timeEnd: '16:30', instruction: 'Перевірити Google Maps, Facebook, Instagram на нові відгуки. Відповісти на кожен.', expectedResult: 'Всі відгуки оброблені, відповіді надані' },
                { title: 'Місячний звіт керівнику', function: 'Фінанси', period: 'monthly', dayOfMonth: 'last', timeStart: '16:00', timeEnd: '18:00', instruction: 'Підготувати повний місячний звіт: фінанси, пацієнти, маркетинг, проблеми.', expectedResult: 'Звіт презентований керівнику' },
                { title: 'Ревізія обладнання', function: 'Закупівлі', period: 'monthly', dayOfMonth: '15', timeStart: '10:00', timeEnd: '11:30', instruction: 'Перевірити стан обладнання, скласти список необхідного ремонту/заміни.', expectedResult: 'Акт ревізії підписаний' }
            ];
            
            for (const rt of clinicRegularTasks) {
                const rtRef = companyRef.collection('regularTasks').doc();
                batch.set(rtRef, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            // Sample tasks for today/tomorrow
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Завдання прив'язані до ФУНКЦІЙ, виконавці беруться автоматично
            // Коли людина звільняється - видаляємо її з функції, нові завдання падають на нового співробітника
            const d3ago = new Date(today); d3ago.setDate(d3ago.getDate() - 3);
            const d5ago = new Date(today); d5ago.setDate(d5ago.getDate() - 5);
            const d7ago = new Date(today); d7ago.setDate(d7ago.getDate() - 7);
            const clinicTasks = [
                { title: 'Первинна консультація - Іванов І.І.', function: 'Лікування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '10:00', estimatedTime: '45', expectedResult: 'Діагноз, план лікування' },
                { title: 'Підготувати рекламну акцію', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '15:00', estimatedTime: '120', expectedResult: 'Готовий макет та текст акції' },
                { title: 'Замовити нові рукавички та маски', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', estimatedTime: '30', expectedResult: 'Замовлення оформлене' },
                { title: 'Оплатити рахунок за оренду', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '16:00', estimatedTime: '15', expectedResult: 'Рахунок оплачено' },
                { title: 'Оновити прайс-лист послуг', function: 'Адміністрування', status: 'progress', priority: 'low', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '18:00', expectedResult: 'Новий прайс затверджений' },
                { title: 'Відправити результати аналізів Сидоренку', function: 'Лікування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '12:00', expectedResult: 'Результати надіслані на email' },
                { title: 'Перевірити терміни придатності медикаментів', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(d7ago), deadlineTime: '10:00', expectedResult: 'Список прострочених, замовлення на заміну' },
                { title: 'Налаштувати email-розсилку пацієнтам', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '16:00', expectedResult: 'Шаблон розсилки готовий', reviewRejectedAt: new Date(Date.now() - 86400000).toISOString(), reviewRejectReason: 'Текст не відповідає бренду' },
                { title: 'Підготувати план закупівель на квартал', function: 'Закупівлі', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '14:00', expectedResult: 'План затверджений', reviewRejectedAt: new Date(Date.now() - 2*86400000).toISOString(), reviewRejectReason: 'Бюджет перевищений на 20%' },
                { title: 'Звіт по задоволеності пацієнтів', function: 'Маркетинг', status: 'review', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', expectedResult: 'Звіт з NPS та рекомендаціями' }
            ];
            
            for (const task of clinicTasks) {
                // Знаходимо функцію і беремо першого виконавця з неї
                const func = clinicFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                // Знаходимо ім'я виконавця по індексу в userIds
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, { 
                    ...task,
                    assigneeId: assigneeId,
                    assigneeName: assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + task.deadlineTime))
                });
            }
            
            // Завдання для поточного користувача (Owner) — щоб показувались в "Мій день"
            const ownerName = currentUserData?.name || currentUser.email;
            const ownerUserId = users.find(u => u.email === currentUser.email)?.id || currentUser.uid;
            const ownerTasks = [
                { title: 'Перевірити фінансовий звіт за тиждень', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', estimatedTime: '30', expectedResult: 'Звіт перевірений, коментарі надані' },
                { title: 'Затвердити план маркетингу на місяць', function: 'Маркетинг', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', estimatedTime: '45', expectedResult: 'План затверджений або повернутий на доробку' },
                { title: 'Провести нараду з командою', function: 'Адміністрування', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '10:00', estimatedTime: '30', expectedResult: 'Протокол наради, задачі розподілені' },
                { title: 'Переглянути відгуки пацієнтів', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '16:00', estimatedTime: '20', expectedResult: 'Відповіді на відгуки, план покращень' },
                { title: 'Стратегічна зустріч з партнером', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '11:00', estimatedTime: '60', expectedResult: 'Домовленість про співпрацю' },
                { title: 'Підписати договір з постачальником', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '15:00', estimatedTime: '20', expectedResult: 'Договір підписаний' },
                { title: 'Проаналізувати KPI команди', function: 'Адміністрування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', estimatedTime: '45', expectedResult: 'Звіт по KPI з рекомендаціями' },
                { title: 'Оновити стандарти обслуговування', function: 'Лікування', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '18:00', estimatedTime: '60', expectedResult: 'Нові стандарти затверджені' }
            ];
            
            for (const task of ownerTasks) {
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, {
                    ...task,
                    assigneeId: ownerUserId,
                    assigneeName: ownerName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + task.deadlineTime))
                });
            }
            
            // Бізнес-процеси (шаблони) для клініки
            const clinicProcessTemplates = [
                {
                    name: 'Прийом нового пацієнта',
                    description: 'Повний цикл від запису до завершення лікування',
                    steps: [
                        { name: 'Запис пацієнта', function: 'Адміністрування', estimatedTime: '15', instruction: 'Зібрати контактні дані, причину звернення, записати на зручний час' },
                        { name: 'Нагадування про візит', function: 'Адміністрування', estimatedTime: '5', instruction: 'Зателефонувати за день до візиту, підтвердити запис' },
                        { name: 'Первинний огляд', function: 'Лікування', estimatedTime: '30', instruction: 'Провести огляд, зібрати анамнез, поставити попередній діагноз' },
                        { name: 'Складання плану лікування', function: 'Лікування', estimatedTime: '20', instruction: 'Розробити план лікування, погодити з пацієнтом' },
                        { name: 'Виставлення рахунку', function: 'Фінанси', estimatedTime: '10', instruction: 'Підготувати рахунок згідно плану лікування' },
                        { name: 'Проведення процедур', function: 'Лікування', estimatedTime: '60', instruction: 'Виконати заплановані процедури' },
                        { name: 'Контрольний огляд', function: 'Лікування', estimatedTime: '20', instruction: 'Перевірити результат лікування' }
                    ]
                },
                {
                    name: 'Закупівля обладнання',
                    description: 'Процес придбання нового медичного обладнання',
                    steps: [
                        { name: 'Формування потреби', function: 'Лікування', estimatedTime: '30', instruction: 'Описати яке обладнання потрібно, характеристики, бюджет' },
                        { name: 'Пошук постачальників', function: 'Закупівлі', estimatedTime: '120', instruction: 'Знайти 3-5 постачальників, запросити КП' },
                        { name: 'Порівняння пропозицій', function: 'Закупівлі', estimatedTime: '60', instruction: 'Порівняти ціни, умови, гарантії' },
                        { name: 'Погодження з керівництвом', function: 'Фінанси', estimatedTime: '30', instruction: 'Представити варіанти, отримати схвалення' },
                        { name: 'Оформлення замовлення', function: 'Закупівлі', estimatedTime: '30', instruction: 'Підписати договір, внести передоплату' },
                        { name: 'Прийом та перевірка', function: 'Закупівлі', estimatedTime: '60', instruction: 'Прийняти обладнання, перевірити комплектність' },
                        { name: 'Введення в експлуатацію', function: 'Лікування', estimatedTime: '60', instruction: 'Встановити, налаштувати, навчити персонал' }
                    ]
                },
                {
                    name: 'Маркетингова кампанія',
                    description: 'Запуск рекламної кампанії для залучення пацієнтів',
                    steps: [
                        { name: 'Визначення цілей', function: 'Маркетинг', estimatedTime: '60', instruction: 'Визначити цільову аудиторію, KPI, бюджет' },
                        { name: 'Розробка креативів', function: 'Маркетинг', estimatedTime: '180', instruction: 'Створити банери, тексти, відео' },
                        { name: 'Погодження матеріалів', function: 'Адміністрування', estimatedTime: '30', instruction: 'Перевірити відповідність мед. законодавству' },
                        { name: 'Налаштування реклами', function: 'Маркетинг', estimatedTime: '120', instruction: 'Запустити кампанії в Google Ads, Facebook' },
                        { name: 'Моніторинг результатів', function: 'Маркетинг', estimatedTime: '30', instruction: 'Щоденно перевіряти показники, коригувати' },
                        { name: 'Звіт про результати', function: 'Маркетинг', estimatedTime: '60', instruction: 'Підготувати фінальний звіт по кампанії' }
                    ]
                }
            ];
            
            for (const template of clinicProcessTemplates) {
                const templateRef = companyRef.collection('processTemplates').doc();
                batch.set(templateRef, {
                    ...template,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Запускаємо 1 процес з кожного шаблону
                if (template.name === 'Прийом нового пацієнта') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Пацієнт Іванов І.І. — імплантація',
                        templateId: templateRef.id,
                        currentStep: 3,
                        status: 'active',
                        assigneeId: userIds[1],
                        deadline: getLocalDateStr(new Date(Date.now() + 5 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                if (template.name === 'Маркетингова кампанія') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Акція "Безкоштовна консультація"',
                        templateId: templateRef.id,
                        currentStep: 1,
                        status: 'active',
                        assigneeId: userIds[2],
                        deadline: getLocalDateStr(new Date(Date.now() + 14 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            
            // Demo projects for clinic
            const clinicProjects = [
                {
                    name: 'Відкриття другої філії',
                    description: 'Планування та запуск нової локації клініки в Луцьку',
                    color: '#3b82f6',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 30 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 90 * 86400000))
                },
                {
                    name: 'Впровадження CRM системи',
                    description: 'Автоматизація запису пацієнтів та нагадувань',
                    color: '#8b5cf6',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 14 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 45 * 86400000))
                },
                {
                    name: 'Сертифікація ISO 9001',
                    description: 'Підготовка документації та проходження аудиту',
                    color: '#f59e0b',
                    status: 'paused',
                    startDate: getLocalDateStr(new Date(Date.now() - 60 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 120 * 86400000))
                }
            ];
            
            const projectRefs = [];
            for (const proj of clinicProjects) {
                const projRef = companyRef.collection('projects').doc();
                batch.set(projRef, {
                    ...proj,
                    creatorId: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                projectRefs.push(projRef.id);
            }
            
            // Додаємо задачі з прив'язкою до проєктів
            const projectTasks = [
                // Проект 0: Відкриття другої філії (7 завдань)
                { title: 'Знайти приміщення для другої філії', function: 'Адміністрування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 7 * 86400000)), projectId: projectRefs[0] },
                { title: 'Отримати ліцензію МОЗ', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: projectRefs[0] },
                { title: 'Ремонт та облаштування кабінетів', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 45 * 86400000)), projectId: projectRefs[0] },
                { title: 'Закупівля обладнання для філії', function: 'Адміністрування', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 40 * 86400000)), projectId: projectRefs[0] },
                { title: 'Набір персоналу для філії', function: 'Адміністрування', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 50 * 86400000)), projectId: projectRefs[0] },
                { title: 'Підключити філію до IT-інфраструктури', function: 'Адміністрування', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 55 * 86400000)), projectId: projectRefs[0] },
                { title: 'Маркетинг відкриття нової локації', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 60 * 86400000)), projectId: projectRefs[0] },
                // Проект 1: Впровадження CRM (6 завдань)
                { title: 'Порівняти CRM: Bitrix vs HubSpot vs TALKO', function: 'Маркетинг', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() - 3 * 86400000)), projectId: projectRefs[1] },
                { title: 'Налаштувати автоматичні нагадування', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 10 * 86400000)), projectId: projectRefs[1] },
                { title: 'Навчити персонал роботі з CRM', function: 'Адміністрування', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(new Date(Date.now() + 20 * 86400000)), projectId: projectRefs[1] },
                { title: 'Імпорт бази пацієнтів в CRM', function: 'Маркетинг', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 5 * 86400000)), projectId: projectRefs[1] },
                { title: 'Налаштувати воронку продажів', function: 'Маркетинг', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 8 * 86400000)), projectId: projectRefs[1] },
                { title: 'Інтеграція CRM з телефонією', function: 'Адміністрування', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 15 * 86400000)), projectId: projectRefs[1] }
            ];
            
            for (const task of projectTasks) {
                const func = clinicFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, {
                    ...task,
                    assigneeId, assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            await batch.commit();
        }
        
        async function loadManufacturingDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            // Demo users
            const demoUsers = [
                { name: 'Сергій Мельник', email: 'sergiy@demo.factory', role: 'employee' },
                { name: 'Віктор Бондаренко', email: 'viktor@demo.factory', role: 'employee' },
                { name: 'Ірина Ткаченко', email: 'iryna@demo.factory', role: 'employee' }
            ];
            
            const userIds = [];
            for (const user of demoUsers) {
                const userRef = companyRef.collection('users').doc();
                batch.set(userRef, { ...user, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(userRef.id);
            }
            
            // Functions for manufacturing
            const mfgFunctions = [
                { name: 'Виробництво', description: 'Управління виробничим процесом, контроль лінії', assigneeIds: [userIds[0]] },
                { name: 'Контроль якості', description: 'Перевірка продукції, стандарти, брак', assigneeIds: [userIds[1]] },
                { name: 'Логістика', description: 'Відвантаження, доставка, склад', assigneeIds: [userIds[2]] },
                { name: 'Постачання', description: 'Закупівля сировини, комплектуючих', assigneeIds: [userIds[2]] },
                { name: 'Обслуговування', description: 'Ремонт обладнання, профілактика', assigneeIds: [userIds[0], userIds[1]] }
            ];
            
            const funcRefs = [];
            for (const func of mfgFunctions) {
                const funcRef = companyRef.collection('functions').doc();
                batch.set(funcRef, { ...func, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: funcRef.id, ...func });
            }
            
            // Regular tasks for manufacturing
            const mfgRegularTasks = [
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '1', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів, рівень мастила, тиск, температуру.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '2', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '3', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '4', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Ранкова перевірка обладнання', function: 'Виробництво', period: 'weekly', dayOfWeek: '5', time: '07:30', estimatedTime: '30', instruction: 'Перевірити стан всіх верстатів.' },
                { title: 'Контроль якості партії', function: 'Контроль якості', period: 'weekly', dayOfWeek: '2', time: '14:00', estimatedTime: '60', instruction: 'Вибіркова перевірка продукції, заповнення журналу якості.' },
                { title: 'Контроль якості партії', function: 'Контроль якості', period: 'weekly', dayOfWeek: '4', time: '14:00', estimatedTime: '60', instruction: 'Вибіркова перевірка продукції.' },
                { title: 'Інвентаризація складу', function: 'Логістика', period: 'weekly', dayOfWeek: '5', time: '16:00', estimatedTime: '90', instruction: 'Перевірити залишки готової продукції та сировини. Оновити систему.' },
                { title: 'Замовлення сировини', function: 'Постачання', period: 'weekly', dayOfWeek: '1', time: '10:00', estimatedTime: '45', instruction: 'Проаналізувати потреби на тиждень, сформувати замовлення постачальникам.' },
                { title: 'Технічне обслуговування обладнання', function: 'Обслуговування', period: 'monthly', dayOfMonth: '1', time: '08:00', estimatedTime: '240', instruction: 'Повне ТО всіх верстатів: мастило, фільтри, калібрування.' },
                { title: 'Звіт по виробництву за місяць', function: 'Виробництво', period: 'monthly', dayOfMonth: 'last', time: '15:00', estimatedTime: '120', instruction: 'Підготувати звіт: обсяг виробництва, простої, брак, ефективність.' }
            ];
            
            for (const rt of mfgRegularTasks) {
                const rtRef = companyRef.collection('regularTasks').doc();
                batch.set(rtRef, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            // Sample tasks - виконавці беруться з функцій автоматично
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const mfgTasks = [
                { title: 'Виготовити партію 500 од. - Замовлення #1247', function: 'Виробництво', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', estimatedTime: '360', expectedResult: '500 одиниць готової продукції' },
                { title: 'Перевірити якість партії #1245', function: 'Контроль якості', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', estimatedTime: '60', expectedResult: 'Звіт про якість, % браку' },
                { title: 'Відвантаження клієнту ТОВ "Альфа"', function: 'Логістика', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '09:00', estimatedTime: '90', expectedResult: 'Товар відвантажено, ТТН підписана' },
                { title: 'Замовити комплектуючі до верстата #3', function: 'Постачання', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', estimatedTime: '30', expectedResult: 'Замовлення оформлене' },
                { title: 'Ремонт конвеєра - лінія 2', function: 'Обслуговування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '11:00', estimatedTime: '120', expectedResult: 'Конвеєр працює' }
            ];
            
            for (const task of mfgTasks) {
                // Знаходимо функцію і беремо першого виконавця з неї
                const func = mfgFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                // Знаходимо ім'я виконавця по індексу в userIds
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, { 
                    ...task,
                    assigneeId: assigneeId,
                    assigneeName: assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + task.deadlineTime))
                });
            }
            
            // Бізнес-процеси (шаблони) для виробництва
            const mfgProcessTemplates = [
                {
                    name: 'Виконання замовлення клієнта',
                    description: 'Повний цикл від отримання замовлення до відвантаження',
                    steps: [
                        { name: 'Отримання та підтвердження замовлення', function: 'Логістика', estimatedTime: '30', instruction: 'Отримати замовлення, перевірити наявність матеріалів, підтвердити терміни клієнту' },
                        { name: 'Перевірка сировини на складі', function: 'Постачання', estimatedTime: '30', instruction: 'Перевірити наявність всієї сировини, при потребі терміново замовити' },
                        { name: 'Планування виробництва', function: 'Виробництво', estimatedTime: '45', instruction: 'Скласти графік виробництва, розподілити по лініях' },
                        { name: 'Виготовлення продукції', function: 'Виробництво', estimatedTime: '480', instruction: 'Виготовити продукцію згідно специфікації' },
                        { name: 'Контроль якості партії', function: 'Контроль якості', estimatedTime: '60', instruction: 'Перевірити продукцію на відповідність стандартам' },
                        { name: 'Пакування та маркування', function: 'Логістика', estimatedTime: '60', instruction: 'Запакувати продукцію, нанести маркування' },
                        { name: 'Оформлення документів', function: 'Логістика', estimatedTime: '30', instruction: 'Підготувати ТТН, рахунок-фактуру, сертифікати' },
                        { name: 'Відвантаження клієнту', function: 'Логістика', estimatedTime: '60', instruction: 'Завантажити продукцію, передати документи водію' }
                    ]
                },
                {
                    name: 'Закупівля сировини',
                    description: 'Процес поповнення запасів сировини',
                    steps: [
                        { name: 'Аналіз потреб', function: 'Постачання', estimatedTime: '45', instruction: 'Проаналізувати залишки, визначити потребу на місяць' },
                        { name: 'Запит комерційних пропозицій', function: 'Постачання', estimatedTime: '60', instruction: 'Відправити запити 3-5 постачальникам' },
                        { name: 'Порівняння та вибір постачальника', function: 'Постачання', estimatedTime: '30', instruction: 'Порівняти ціни, терміни, якість' },
                        { name: 'Оформлення замовлення', function: 'Постачання', estimatedTime: '30', instruction: 'Підписати договір/специфікацію, оплатити' },
                        { name: 'Приймання на склад', function: 'Логістика', estimatedTime: '60', instruction: 'Прийняти сировину, перевірити кількість і якість' },
                        { name: 'Вхідний контроль якості', function: 'Контроль якості', estimatedTime: '45', instruction: 'Перевірити сировину на відповідність специфікації' },
                        { name: 'Оприбуткування в системі', function: 'Логістика', estimatedTime: '20', instruction: 'Внести дані в облікову систему' }
                    ]
                },
                {
                    name: 'Ремонт обладнання',
                    description: 'Процес усунення несправності обладнання',
                    steps: [
                        { name: 'Фіксація несправності', function: 'Виробництво', estimatedTime: '15', instruction: 'Зафіксувати що зламалось, симптоми, коли виникло' },
                        { name: 'Діагностика', function: 'Обслуговування', estimatedTime: '60', instruction: 'Визначити причину поломки, необхідні запчастини' },
                        { name: 'Замовлення запчастин', function: 'Постачання', estimatedTime: '30', instruction: 'Замовити необхідні запчастини (якщо немає на складі)' },
                        { name: 'Проведення ремонту', function: 'Обслуговування', estimatedTime: '180', instruction: 'Виконати ремонтні роботи' },
                        { name: 'Тестування', function: 'Обслуговування', estimatedTime: '30', instruction: 'Перевірити роботу обладнання після ремонту' },
                        { name: 'Введення в експлуатацію', function: 'Виробництво', estimatedTime: '15', instruction: 'Повернути обладнання в роботу, зробити запис в журналі' }
                    ]
                }
            ];
            
            for (const template of mfgProcessTemplates) {
                const templateRef = companyRef.collection('processTemplates').doc();
                batch.set(templateRef, {
                    ...template,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Запускаємо процеси
                if (template.name === 'Виконання замовлення клієнта') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Замовлення #1247 — ТОВ "Альфа"',
                        templateId: templateRef.id,
                        currentStep: 4,
                        status: 'active',
                        assigneeId: userIds[0],
                        deadline: getLocalDateStr(new Date(Date.now() + 3 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    const procRef2 = companyRef.collection('processes').doc();
                    batch.set(procRef2, {
                        name: 'Замовлення #1250 — ФОП Петренко',
                        templateId: templateRef.id,
                        currentStep: 1,
                        status: 'active',
                        assigneeId: userIds[2],
                        deadline: getLocalDateStr(new Date(Date.now() + 10 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                if (template.name === 'Ремонт обладнання') {
                    const procRef = companyRef.collection('processes').doc();
                    batch.set(procRef, {
                        name: 'Ремонт конвеєра — лінія 2',
                        templateId: templateRef.id,
                        currentStep: 3,
                        status: 'active',
                        assigneeId: userIds[0],
                        deadline: getLocalDateStr(new Date(Date.now() - 1 * 86400000)),
                        createdBy: currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            
            // Demo projects for manufacturing
            const mfgProjects = [
                {
                    name: 'Запуск нової виробничої лінії',
                    description: 'Монтаж та налагодження лінії #4 для нового продукту',
                    color: '#ef4444',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 20 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 60 * 86400000))
                },
                {
                    name: 'Автоматизація складу',
                    description: 'Впровадження WMS системи та штрихкодування',
                    color: '#3b82f6',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 7 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 45 * 86400000))
                },
                {
                    name: 'Зменшення браку на 50%',
                    description: 'Аналіз причин браку, навчання персоналу, нові стандарти',
                    color: '#22c55e',
                    status: 'active',
                    startDate: getLocalDateStr(new Date(Date.now() - 45 * 86400000)),
                    deadline: getLocalDateStr(new Date(Date.now() + 30 * 86400000))
                }
            ];
            
            const mfgProjectRefs = [];
            for (const proj of mfgProjects) {
                const projRef = companyRef.collection('projects').doc();
                batch.set(projRef, {
                    ...proj,
                    creatorId: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                mfgProjectRefs.push(projRef.id);
            }
            
            // Задачі з прив'язкою до проєктів
            const mfgProjectTasks = [
                // Проект 0: Запуск нової виробничої лінії (8 завдань)
                { title: 'Фундамент під лінію #4', function: 'Виробництво', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 5 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Монтаж обладнання лінії #4', function: 'Обслуговування', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 14 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Тестовий запуск лінії #4', function: 'Виробництво', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Підключення електрики 380V', function: 'Обслуговування', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 3 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Калібрування датчиків лінії #4', function: 'Контроль якості', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 25 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Навчання операторів лінії #4', function: 'Виробництво', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 35 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Закупівля сировини для тестового запуску', function: 'Постачання', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 10 * 86400000)), projectId: mfgProjectRefs[0] },
                { title: 'Узгодження графіку змін для лінії #4', function: 'Виробництво', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(new Date(Date.now() + 28 * 86400000)), projectId: mfgProjectRefs[0] },
                // Проект 1: Автоматизація складу (7 завдань)
                { title: 'Обрати WMS систему', function: 'Логістика', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() - 2 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Закупити сканери штрихкодів', function: 'Постачання', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 7 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Розмітка зон зберігання', function: 'Логістика', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 8 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Налаштування WMS під наш склад', function: 'Логістика', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 12 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Інтеграція WMS з 1С', function: 'Логістика', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 20 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Навчання комірників роботі зі сканерами', function: 'Логістика', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 25 * 86400000)), projectId: mfgProjectRefs[1] },
                { title: 'Тестова інвентаризація з WMS', function: 'Логістика', status: 'new', priority: 'low', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: mfgProjectRefs[1] },
                // Проект 2: Зменшення браку на 50% (7 завдань)
                { title: 'Аналіз причин браку за 6 місяців', function: 'Контроль якості', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 10 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Навчання операторів новим стандартам', function: 'Виробництво', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 14 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Встановити датчики контролю на лінії #1-3', function: 'Обслуговування', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() - 4 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Розробити чек-листи контролю якості', function: 'Контроль якості', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() - 7 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Впровадити систему звітів по браку', function: 'Контроль якості', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now() + 5 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Заміна зношеного інструменту', function: 'Постачання', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 3 * 86400000)), projectId: mfgProjectRefs[2] },
                { title: 'Контрольний замір браку через 30 днів', function: 'Контроль якості', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now() + 30 * 86400000)), projectId: mfgProjectRefs[2] }
            ];
            
            for (const task of mfgProjectTasks) {
                const func = mfgFunctions.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                const assigneeIndex = userIds.indexOf(assigneeId);
                const assigneeName = assigneeIndex >= 0 ? demoUsers[assigneeIndex].name : '';
                const taskRef = companyRef.collection('tasks').doc();
                batch.set(taskRef, {
                    ...task,
                    assigneeId, assigneeName,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            await batch.commit();
        }

        async function loadFurnitureDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            const demoUsers = [
                { name: 'Дмитро Савчук', email: 'dmytro@demo.furniture', role: 'employee' },
                { name: 'Наталія Коваль', email: 'natalia@demo.furniture', role: 'employee' },
                { name: 'Андрій Лисенко', email: 'andriy@demo.furniture', role: 'employee' },
                { name: 'Оксана Білик', email: 'oksana@demo.furniture', role: 'employee' }
            ];
            
            const userIds = [];
            for (const u of demoUsers) {
                const ref = companyRef.collection('users').doc();
                batch.set(ref, { ...u, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(ref.id);
            }
            
            const funcs = [
                { name: 'Продажі', description: 'Консультації клієнтів, оформлення замовлень, воронка продажів', assigneeIds: [userIds[1]] },
                { name: 'Виробництво', description: 'Виготовлення меблів, збірка, фурнітура', assigneeIds: [userIds[0], userIds[2]] },
                { name: 'Дизайн', description: 'Проєктування, 3D-візуалізація, підбір матеріалів', assigneeIds: [userIds[2]] },
                { name: 'Закупівлі', description: 'Матеріали, фурнітура, тканини, постачальники', assigneeIds: [userIds[0]] },
                { name: 'Доставка та монтаж', description: 'Логістика, збірка у клієнта, рекламації', assigneeIds: [userIds[0], userIds[2]] },
                { name: 'Маркетинг', description: 'Реклама, соцмережі, фото контент, виставки', assigneeIds: [userIds[1], userIds[3]] },
                { name: 'Фінанси', description: 'Рахунки, оплати, собівартість, прибуток', assigneeIds: [userIds[3]] }
            ];
            
            const funcRefs = [];
            for (const f of funcs) {
                const ref = companyRef.collection('functions').doc();
                batch.set(ref, { ...f, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: ref.id, ...f });
            }
            
            const regularTasks = [
                { title: 'Обробка нових заявок з сайту', function: 'Продажі', period: 'weekly', daysOfWeek: ['1','2','3','4','5'], timeStart: '09:00', timeEnd: '09:30', instruction: 'Перевірити CRM на нові заявки, передзвонити протягом 30 хв.', expectedResult: 'Всі заявки оброблені, статуси оновлені в CRM' },
                { title: 'Планёрка виробництва', function: 'Виробництво', period: 'weekly', daysOfWeek: ['1'], timeStart: '08:00', timeEnd: '08:30', instruction: 'Розподілити замовлення на тиждень, визначити пріоритети.', expectedResult: 'Графік виробництва на тиждень затверджений' },
                { title: 'Перевірка складських залишків', function: 'Закупівлі', period: 'weekly', daysOfWeek: ['2','5'], timeStart: '10:00', timeEnd: '10:45', instruction: 'Перевірити залишки ДСП, МДФ, фурнітури. Замовити якщо < мін. запас.', expectedResult: 'Дефіцитні позиції замовлені' },
                { title: 'Фото нових виробів для каталогу', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['3'], timeStart: '14:00', timeEnd: '15:00', instruction: 'Зфотографувати готові вироби перед відправкою. Мін. 5 фото з різних ракурсів.', expectedResult: '5+ фото в папці Google Drive' },
                { title: 'Контент для Instagram та Facebook', function: 'Маркетинг', period: 'weekly', daysOfWeek: ['1','3','5'], timeStart: '11:00', timeEnd: '11:45', instruction: 'Підготувати та опублікувати пост: фото виробу + ціна + переваги.', expectedResult: 'Пост опублікований в 2 соцмережі' },
                { title: 'Фінансовий звіт за тиждень', function: 'Фінанси', period: 'weekly', daysOfWeek: ['5'], timeStart: '16:00', timeEnd: '17:00', instruction: 'Звіт: виручка, витрати на матеріали, ФОП, чистий прибуток.', expectedResult: 'Таблиця з P&L за тиждень' },
                { title: 'Розрахунок собівартості нових виробів', function: 'Фінанси', period: 'monthly', dayOfMonth: '1', timeStart: '10:00', timeEnd: '12:00', instruction: 'Перерахувати собівартість з урахуванням нових цін на матеріали.', expectedResult: 'Оновлений прайс з маржинальністю' },
                { title: 'Інвентаризація виробництва', function: 'Виробництво', period: 'monthly', dayOfMonth: '15', timeStart: '08:00', timeEnd: '10:00', instruction: 'Перевірити стан інструменту, верстатів, залишки матеріалів в цеху.', expectedResult: 'Акт інвентаризації' }
            ];
            
            for (const rt of regularTasks) {
                const ref = companyRef.collection('regularTasks').doc();
                batch.set(ref, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
            const d3ago = new Date(today); d3ago.setDate(d3ago.getDate() - 3);
            const d5ago = new Date(today); d5ago.setDate(d5ago.getDate() - 5);
            
            const tasksList = [
                { title: 'Кухня "Модерн" — замовлення #412', function: 'Виробництво', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', expectedResult: 'Кухня зібрана, готова до доставки' },
                { title: 'Шафа-купе для Петренко — 3D проєкт', function: 'Дизайн', status: 'review', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '14:00', expectedResult: '3D візуалізація погоджена клієнтом' },
                { title: 'Доставка та монтаж — Коваленко', function: 'Доставка та монтаж', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '10:00', expectedResult: 'Меблі встановлені, акт підписаний' },
                { title: 'Замовити фурнітуру Blum', function: 'Закупівлі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', expectedResult: 'Замовлення відправлене постачальнику' },
                { title: 'Рекламація — скрип дверцят у Іванченко', function: 'Доставка та монтаж', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '15:00', expectedResult: 'Проблема усунена, клієнт задоволений' },
                { title: 'Комерційна пропозиція для офісу "Альфа Груп"', function: 'Продажі', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '18:00', expectedResult: 'КП з цінами та візуалізацією надіслана' },
                { title: 'Розробити дизайн стенду для виставки', function: 'Маркетинг', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', expectedResult: 'Макет стенду затверджений', reviewRejectedAt: new Date(Date.now() - 86400000).toISOString(), reviewRejectReason: 'Не відповідає фірмовому стилю' },
                { title: 'Стіл "Лофт" — замовлення #415', function: 'Виробництво', status: 'done', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', expectedResult: 'Стіл готовий' },
                { title: 'Оплатити рахунок за ДСП Egger', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '16:00', expectedResult: 'Рахунок оплачений' }
            ];
            
            for (const task of tasksList) {
                const func = funcs.find(f => f.name === task.function);
                const assigneeId = func?.assigneeIds?.[0] || null;
                const idx = userIds.indexOf(assigneeId);
                const assigneeName = idx >= 0 ? demoUsers[idx].name : '';
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...task, assigneeId, assigneeName, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp(), deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + (task.deadlineTime || '18:00'))) });
            }
            
            // Business processes
            const processTemplates = [
                {
                    name: 'Виконання замовлення клієнта',
                    description: 'Від заявки до монтажу у клієнта',
                    steps: [
                        { name: 'Прийом замовлення', function: 'Продажі', estimatedTime: '30', instruction: 'Зафіксувати побажання, бюджет, терміни. Підписати договір.' },
                        { name: 'Замір приміщення', function: 'Дизайн', estimatedTime: '120', instruction: 'Виїхати на замір. Зафіксувати розміри, фото, особливості приміщення.' },
                        { name: '3D-проєктування', function: 'Дизайн', estimatedTime: '240', instruction: 'Створити 3D модель. Підібрати матеріали та кольори. Погодити з клієнтом.' },
                        { name: 'Розрахунок собівартості', function: 'Фінанси', estimatedTime: '60', instruction: 'Розрахувати собівартість: матеріали + робота + доставка. Підготувати рахунок.' },
                        { name: 'Закупівля матеріалів', function: 'Закупівлі', estimatedTime: '120', instruction: 'Замовити ДСП/МДФ, фурнітуру, скло, фасади за специфікацією.' },
                        { name: 'Виготовлення', function: 'Виробництво', estimatedTime: '960', instruction: 'Розкрій → кромлення → свердління → збірка → перевірка.' },
                        { name: 'Контроль якості', function: 'Виробництво', estimatedTime: '60', instruction: 'Перевірити зібраний виріб: геометрія, фурнітура, поверхня, колір.' },
                        { name: 'Доставка та монтаж', function: 'Доставка та монтаж', estimatedTime: '240', instruction: 'Доставити, зібрати у клієнта, підписати акт приймання.' }
                    ]
                },
                {
                    name: 'Рекламація клієнта',
                    description: 'Обробка скарги та усунення проблеми',
                    steps: [
                        { name: 'Прийом скарги', function: 'Продажі', estimatedTime: '15', instruction: 'Зафіксувати проблему, фото, контакти. Вибачитись.' },
                        { name: 'Діагностика проблеми', function: 'Виробництво', estimatedTime: '60', instruction: 'Визначити причину: виробничий брак, транспортування, монтаж.' },
                        { name: 'Усунення дефекту', function: 'Доставка та монтаж', estimatedTime: '120', instruction: 'Виїхати до клієнта, усунути проблему або замінити деталь.' },
                        { name: 'Контроль задоволеності', function: 'Продажі', estimatedTime: '10', instruction: 'Подзвонити через 3 дні, переконатись що все ОК. Запросити відгук.' }
                    ]
                }
            ];
            
            for (const tpl of processTemplates) {
                const tplRef = companyRef.collection('processTemplates').doc();
                batch.set(tplRef, { ...tpl, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                if (tpl.name === 'Виконання замовлення клієнта') {
                    for (const proc of [
                        { name: 'Кухня "Модерн" — Петренко', currentStep: 6, status: 'active', assigneeId: userIds[0], deadline: getLocalDateStr(new Date(Date.now() + 5*86400000)) },
                        { name: 'Шафа-купе — Іванченко О.', currentStep: 3, status: 'active', assigneeId: userIds[2], deadline: getLocalDateStr(new Date(Date.now() + 14*86400000)) },
                        { name: 'Офісні меблі — "Альфа Груп"', currentStep: 1, status: 'active', assigneeId: userIds[1], deadline: getLocalDateStr(new Date(Date.now() + 30*86400000)) }
                    ]) {
                        const pRef = companyRef.collection('processes').doc();
                        batch.set(pRef, { ...proc, templateId: tplRef.id, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    }
                }
            }
            
            // Projects
            const projects = [
                { name: 'Запуск інтернет-магазину', description: 'Сайт з каталогом, калькулятором і онлайн-замовленням', color: '#3b82f6', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 14*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 60*86400000)) },
                { name: 'Вихід на ринок Польщі', description: 'Адаптація каталогу, логістика, маркетинг для PL ринку', color: '#8b5cf6', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 7*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 90*86400000)) },
                { name: 'Оновлення виробничого цеху', description: 'Нове обладнання, вентиляція, організація простору', color: '#f59e0b', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 30*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 45*86400000)) }
            ];
            const projRefs = [];
            for (const p of projects) {
                const ref = companyRef.collection('projects').doc();
                batch.set(ref, { ...p, creatorId: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                projRefs.push(ref.id);
            }
            
            const projTasks = [
                { title: 'Обрати платформу для сайту', function: 'Маркетинг', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()-7*86400000)), projectId: projRefs[0] },
                { title: 'Фотосесія каталогу (50 виробів)', function: 'Маркетинг', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+14*86400000)), projectId: projRefs[0] },
                { title: 'Налаштувати онлайн-калькулятор', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+30*86400000)), projectId: projRefs[0] },
                { title: 'SEO та запуск реклами', function: 'Маркетинг', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+45*86400000)), projectId: projRefs[0] },
                { title: 'Переклад каталогу на польську', function: 'Маркетинг', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+20*86400000)), projectId: projRefs[1] },
                { title: 'Знайти логістичного партнера в PL', function: 'Доставка та монтаж', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+30*86400000)), projectId: projRefs[1] },
                { title: 'Купити ЧПУ-фрезер', function: 'Закупівлі', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+14*86400000)), projectId: projRefs[2] },
                { title: 'Монтаж вентиляції в цеху', function: 'Виробництво', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+21*86400000)), projectId: projRefs[2] }
            ];
            for (const t of projTasks) {
                const func = funcs.find(f => f.name === t.function);
                const aid = func?.assigneeIds?.[0] || null;
                const ai = userIds.indexOf(aid);
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...t, assigneeId: aid, assigneeName: ai >= 0 ? demoUsers[ai].name : '', createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            await batch.commit();
        }

        async function loadConstructionDemoData() {
            const batch = db.batch();
            const companyRef = db.collection('companies').doc(currentCompany);
            
            const demoUsers = [
                { name: 'Віталій Крищук', email: 'vitaliy@demo.build', role: 'employee' },
                { name: 'Роман Гаврилюк', email: 'roman@demo.build', role: 'employee' },
                { name: 'Олена Мартинюк', email: 'olena@demo.build', role: 'employee' },
                { name: 'Ігор Степаненко', email: 'igor@demo.build', role: 'employee' }
            ];
            
            const userIds = [];
            for (const u of demoUsers) {
                const ref = companyRef.collection('users').doc();
                batch.set(ref, { ...u, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                userIds.push(ref.id);
            }
            
            const funcs = [
                { name: 'Управління об\'єктами', description: 'Координація робіт на будмайданчиках, графіки, контроль', assigneeIds: [userIds[0]] },
                { name: 'Кошторис та тендери', description: 'Розрахунки, комерційні пропозиції, тендерна документація', assigneeIds: [userIds[2]] },
                { name: 'Закупівля матеріалів', description: 'Будматеріали, інструмент, техніка, постачальники', assigneeIds: [userIds[1]] },
                { name: 'Бригади та персонал', description: 'Розподіл бригад, графіки, ФОП, табель', assigneeIds: [userIds[0], userIds[1]] },
                { name: 'Проєктування', description: 'Проєктна документація, дозволи, погодження', assigneeIds: [userIds[2]] },
                { name: 'Контроль якості', description: 'Перевірка робіт, акти прихованих робіт, стандарти', assigneeIds: [userIds[0], userIds[3]] },
                { name: 'Безпека', description: 'Охорона праці, ТБ, допуски, інструктажі', assigneeIds: [userIds[3]] },
                { name: 'Фінанси', description: 'Оплати підрядникам, рахунки, бюджет об\'єктів', assigneeIds: [userIds[2], userIds[3]] }
            ];
            
            const funcRefs = [];
            for (const f of funcs) {
                const ref = companyRef.collection('functions').doc();
                batch.set(ref, { ...f, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                funcRefs.push({ id: ref.id, ...f });
            }
            
            const regularTasks = [
                { title: 'Ранковий обхід об\'єктів', function: 'Управління об\'єктами', period: 'weekly', daysOfWeek: ['1','2','3','4','5'], timeStart: '08:00', timeEnd: '09:00', instruction: 'Перевірити: бригади на місцях, матеріали доставлені, безпека ОК, прогрес за вчора.', expectedResult: 'Звіт по кожному об\'єкту в чат' },
                { title: 'Планёрка з бригадирами', function: 'Бригади та персонал', period: 'weekly', daysOfWeek: ['1'], timeStart: '07:30', timeEnd: '08:00', instruction: 'План на тиждень: хто де працює, які матеріали потрібні, дедлайни.', expectedResult: 'Графік робіт на тиждень' },
                { title: 'Перевірка залишків на складі', function: 'Закупівля матеріалів', period: 'weekly', daysOfWeek: ['2','5'], timeStart: '10:00', timeEnd: '10:45', instruction: 'Цемент, арматура, цегла, пісок, утеплювач — перевірити і замовити якщо < 3 дні запасу.', expectedResult: 'Замовлення на дефіцитні позиції' },
                { title: 'Фотозвіт з об\'єктів', function: 'Управління об\'єктами', period: 'weekly', daysOfWeek: ['3','5'], timeStart: '16:00', timeEnd: '16:30', instruction: 'Фото прогресу кожного об\'єкту. Мін. 5 фото/об\'єкт. Завантажити в папку.', expectedResult: 'Фото в Google Drive по папках об\'єктів' },
                { title: 'Інструктаж з техніки безпеки', function: 'Безпека', period: 'weekly', daysOfWeek: ['1'], timeStart: '07:00', timeEnd: '07:30', instruction: 'Провести інструктаж для нових працівників та нагадування для постійних.', expectedResult: 'Журнал ТБ підписаний' },
                { title: 'Табель робочого часу', function: 'Бригади та персонал', period: 'weekly', daysOfWeek: ['5'], timeStart: '17:00', timeEnd: '17:30', instruction: 'Заповнити табель за тиждень по кожній бригаді.', expectedResult: 'Табель в Excel' },
                { title: 'Фінансовий звіт по об\'єктах', function: 'Фінанси', period: 'weekly', daysOfWeek: ['5'], timeStart: '16:00', timeEnd: '17:00', instruction: 'Витрати vs бюджет по кожному об\'єкту. Сигнали якщо перевищення >10%.', expectedResult: 'Звіт бюджет/факт' },
                { title: 'Перевірка дозвільних документів', function: 'Проєктування', period: 'monthly', dayOfMonth: '1', timeStart: '10:00', timeEnd: '12:00', instruction: 'Перевірити терміни дозволів, ліцензій, страховок. Продовжити якщо потрібно.', expectedResult: 'Всі документи актуальні' }
            ];
            
            for (const rt of regularTasks) {
                const ref = companyRef.collection('regularTasks').doc();
                batch.set(ref, { ...rt, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
            const d3ago = new Date(today); d3ago.setDate(d3ago.getDate() - 3);
            const d5ago = new Date(today); d5ago.setDate(d5ago.getDate() - 5);
            const d7ago = new Date(today); d7ago.setDate(d7ago.getDate() - 7);
            
            const tasksList = [
                { title: 'Залити фундамент — секція Б', function: 'Управління об\'єктами', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '17:00', expectedResult: 'Фундамент залитий, вібрування виконано' },
                { title: 'Замовити арматуру 12мм — 5 тонн', function: 'Закупівля матеріалів', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '12:00', expectedResult: 'Арматура замовлена, доставка через 2 дні' },
                { title: 'Підписати акт прихованих робіт — об\'єкт "Озерна"', function: 'Контроль якості', status: 'review', priority: 'high', deadlineDate: getLocalDateStr(today), deadlineTime: '15:00', expectedResult: 'Акт підписаний інженером та замовником' },
                { title: 'Кошторис на утеплення фасаду', function: 'Кошторис та тендери', status: 'progress', priority: 'medium', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '18:00', expectedResult: 'Кошторис з деталізацією', reviewRejectedAt: new Date(Date.now()-86400000).toISOString(), reviewRejectReason: 'Не враховано вартість лісів' },
                { title: 'Перевести бригаду Кравченка на об\'єкт "Парковий"', function: 'Бригади та персонал', status: 'new', priority: 'medium', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '08:00', expectedResult: 'Бригада на новому об\'єкті' },
                { title: 'Оплатити підряднику за електромонтаж', function: 'Фінанси', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(d7ago), deadlineTime: '16:00', expectedResult: 'Оплата виконана' },
                { title: 'Усунення зауважень інспекції', function: 'Безпека', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(d3ago), deadlineTime: '17:00', expectedResult: 'Зауваження усунені, фотозвіт' },
                { title: 'Монтаж вікон — поверхи 3-5', function: 'Управління об\'єктами', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(d5ago), deadlineTime: '17:00', expectedResult: 'Вікна встановлені на 3-5 поверхах' },
                { title: 'Тендерна пропозиція — ЖК "Сонячний"', function: 'Кошторис та тендери', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(tomorrow), deadlineTime: '12:00', expectedResult: 'Пакет тендерної документації' }
            ];
            
            for (const task of tasksList) {
                const func = funcs.find(f => f.name === task.function);
                const aid = func?.assigneeIds?.[0] || null;
                const ai = userIds.indexOf(aid);
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...task, assigneeId: aid, assigneeName: ai >= 0 ? demoUsers[ai].name : '', createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp(), deadline: firebase.firestore.Timestamp.fromDate(new Date(task.deadlineDate + 'T' + (task.deadlineTime || '18:00'))) });
            }
            
            // Business processes
            const processTemplates = [
                {
                    name: 'Будівництво об\'єкту',
                    description: 'Повний цикл від проєкту до здачі',
                    steps: [
                        { name: 'Проєктування та дозволи', function: 'Проєктування', estimatedTime: '2400', instruction: 'Розробити проєкт, отримати дозвіл на будівництво, погодження.' },
                        { name: 'Підготовка майданчика', function: 'Управління об\'єктами', estimatedTime: '480', instruction: 'Огородження, тимчасове електропостачання, побутовки.' },
                        { name: 'Земляні роботи та фундамент', function: 'Управління об\'єктами', estimatedTime: '960', instruction: 'Котлован, армування, заливка фундаменту.' },
                        { name: 'Зведення каркасу', function: 'Управління об\'єктами', estimatedTime: '1920', instruction: 'Стіни, перекриття, покрівля.' },
                        { name: 'Інженерні мережі', function: 'Управління об\'єктами', estimatedTime: '960', instruction: 'Електрика, водопостачання, каналізація, опалення.' },
                        { name: 'Оздоблювальні роботи', function: 'Управління об\'єктами', estimatedTime: '1440', instruction: 'Штукатурка, фарбування, підлога, плитка.' },
                        { name: 'Контроль та здача', function: 'Контроль якості', estimatedTime: '240', instruction: 'Перевірка якості, усунення дефектів, акт здачі-приймання.' }
                    ]
                },
                {
                    name: 'Тендерна пропозиція',
                    description: 'Підготовка та подача тендерної документації',
                    steps: [
                        { name: 'Аналіз тендерних умов', function: 'Кошторис та тендери', estimatedTime: '120', instruction: 'Вивчити вимоги, терміни, критерії оцінки.' },
                        { name: 'Розрахунок кошторису', function: 'Кошторис та тендери', estimatedTime: '480', instruction: 'Деталізований кошторис з розцінками та матеріалами.' },
                        { name: 'Формування пакету документів', function: 'Кошторис та тендери', estimatedTime: '240', instruction: 'Ліцензії, досвід, фін. звітність, гарантії.' },
                        { name: 'Подача та презентація', function: 'Кошторис та тендери', estimatedTime: '120', instruction: 'Подати документи, при потребі — презентація замовнику.' }
                    ]
                }
            ];
            
            for (const tpl of processTemplates) {
                const tplRef = companyRef.collection('processTemplates').doc();
                batch.set(tplRef, { ...tpl, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                if (tpl.name === 'Будівництво об\'єкту') {
                    for (const proc of [
                        { name: 'ЖК "Озерна" — корпус А', currentStep: 5, status: 'active', assigneeId: userIds[0], deadline: getLocalDateStr(new Date(Date.now() + 60*86400000)) },
                        { name: 'Котедж "Парковий 12"', currentStep: 3, status: 'active', assigneeId: userIds[0], deadline: getLocalDateStr(new Date(Date.now() + 30*86400000)) }
                    ]) {
                        const pRef = companyRef.collection('processes').doc();
                        batch.set(pRef, { ...proc, templateId: tplRef.id, createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    }
                }
                if (tpl.name === 'Тендерна пропозиція') {
                    const pRef = companyRef.collection('processes').doc();
                    batch.set(pRef, { name: 'Тендер ЖК "Сонячний"', templateId: tplRef.id, currentStep: 2, status: 'active', assigneeId: userIds[2], deadline: getLocalDateStr(new Date(Date.now() + 3*86400000)), createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                }
            }
            
            // Projects
            const projects = [
                { name: 'ЖК "Озерна" — корпус А', description: '9-поверховий житловий будинок, 54 квартири', color: '#ef4444', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 90*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 180*86400000)) },
                { name: 'Котедж "Парковий 12"', description: 'Приватний котедж 280 м², під ключ', color: '#3b82f6', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 30*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 90*86400000)) },
                { name: 'Тендер ЖК "Сонячний"', description: 'Підготовка до тендеру на генпідряд', color: '#f59e0b', status: 'active', startDate: getLocalDateStr(new Date(Date.now() - 7*86400000)), deadline: getLocalDateStr(new Date(Date.now() + 14*86400000)) }
            ];
            const projRefs = [];
            for (const p of projects) {
                const ref = companyRef.collection('projects').doc();
                batch.set(ref, { ...p, creatorId: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                projRefs.push(ref.id);
            }
            
            const projTasks = [
                { title: 'Монтаж перекриття 6-го поверху', function: 'Управління об\'єктами', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+5*86400000)), projectId: projRefs[0] },
                { title: 'Прокладка каналізації 1-3 поверхи', function: 'Управління об\'єктами', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()-10*86400000)), projectId: projRefs[0] },
                { title: 'Замовити ліфтове обладнання', function: 'Закупівля матеріалів', status: 'new', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+20*86400000)), projectId: projRefs[0] },
                { title: 'Заливка фундаменту — котедж', function: 'Управління об\'єктами', status: 'done', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()-15*86400000)), projectId: projRefs[1] },
                { title: 'Мурування стін 1-го поверху', function: 'Управління об\'єктами', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+7*86400000)), projectId: projRefs[1] },
                { title: 'Проєкт інженерних мереж котеджу', function: 'Проєктування', status: 'review', priority: 'medium', deadlineDate: getLocalDateStr(new Date(Date.now()+3*86400000)), projectId: projRefs[1] },
                { title: 'Збір тендерної документації', function: 'Кошторис та тендери', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+3*86400000)), projectId: projRefs[2] },
                { title: 'Кошторис генпідряду ЖК "Сонячний"', function: 'Кошторис та тендери', status: 'progress', priority: 'high', deadlineDate: getLocalDateStr(new Date(Date.now()+5*86400000)), projectId: projRefs[2] }
            ];
            for (const t of projTasks) {
                const func = funcs.find(f => f.name === t.function);
                const aid = func?.assigneeIds?.[0] || null;
                const ai = userIds.indexOf(aid);
                const ref = companyRef.collection('tasks').doc();
                batch.set(ref, { ...t, assigneeId: aid, assigneeName: ai >= 0 ? demoUsers[ai].name : '', createdBy: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            
            await batch.commit();
        }
        let mobileFilters = {
            type: '',
            date: '',
            status: [],
            function: '',
            assignee: ''
        };
        
        function openFilterModal() {
            const modal = document.getElementById('filterModal');
            modal.style.display = 'flex';
            
            // Sync desktop status multi-select to mobile
            mobileFilters.status = getSelectedStatuses();
            
            // Populate function chips
            const funcContainer = document.getElementById('filterFunctionChips');
            const activeFuncs = functions.filter(f => f.status !== 'archived');
            funcContainer.innerHTML = '<div class="filter-chip selected" data-value="" onclick="selectFilterChip(this, \'function\')">' + t('all') + '</div>';
            activeFuncs.forEach(f => {
                const selected = mobileFilters.function === f.name ? 'selected' : '';
                funcContainer.innerHTML += `<div class="filter-chip ${selected}" data-value="${esc(f.name)}" onclick="selectFilterChip(this, 'function')">${esc(f.name)}</div>`;
            });
            
            // Populate assignee chips
            const assigneeContainer = document.getElementById('filterAssigneeChips');
            assigneeContainer.innerHTML = '<div class="filter-chip selected" data-value="" onclick="selectFilterChip(this, \'assignee\')">' + t('all') + '</div>';
            users.forEach(u => {
                const name = u.name || u.email.split('@')[0];
                const selected = mobileFilters.assignee === u.id ? 'selected' : '';
                assigneeContainer.innerHTML += `<div class="filter-chip ${selected}" data-value="${esc(u.id)}" onclick="selectFilterChip(this, 'assignee')">${esc(name)}</div>`;
            });
            
            // Sync current filters
            syncFilterChips();
            refreshIcons();
        }
        
        function closeFilterModal() {
            closeModal('filterModal');
        }
        
        function selectFilterChip(chip, category) {
            if (category === 'status') {
                // Multi-select logic for status
                const val = chip.dataset.value;
                if (val === '') {
                    // "Всі" clicked - deselect all specific statuses
                    mobileFilters.status = [];
                    chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
                    chip.classList.add('selected');
                } else {
                    // Toggle specific status
                    const allChip = chip.parentElement.querySelector('.filter-chip[data-value=""]');
                    if (chip.classList.contains('selected')) {
                        chip.classList.remove('selected');
                        mobileFilters.status = mobileFilters.status.filter(s => s !== val);
                    } else {
                        chip.classList.add('selected');
                        mobileFilters.status.push(val);
                    }
                    // Remove "Всі" selection if specific selected
                    if (mobileFilters.status.length > 0) {
                        allChip?.classList.remove('selected');
                    }
                    // If none selected, highlight "Всі"
                    if (mobileFilters.status.length === 0) {
                        allChip?.classList.add('selected');
                    }
                    // If all 4 selected, treat as "Всі"
                    if (mobileFilters.status.length === 4) {
                        mobileFilters.status = [];
                        chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
                        allChip?.classList.add('selected');
                    }
                }
            } else {
                // Single-select for other categories
                chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                mobileFilters[category] = chip.dataset.value;
            }
        }
        
        function syncFilterChips() {
            // Sync type
            document.querySelectorAll('#filterTypeChips .filter-chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.value === mobileFilters.type);
            });
            // Sync date
            document.querySelectorAll('#filterDateChips .filter-chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.value === mobileFilters.date);
            });
            // Sync status (multi-select)
            document.querySelectorAll('#filterStatusChips .filter-chip').forEach(c => {
                const val = c.dataset.value;
                if (val === '') {
                    c.classList.toggle('selected', mobileFilters.status.length === 0);
                } else {
                    c.classList.toggle('selected', mobileFilters.status.includes(val));
                }
            });
        }
        
        function applyFiltersAndClose() {
            // Apply filters to desktop selects
            document.getElementById('taskTypeFilter').value = mobileFilters.type;
            syncTaskTypeTabs();
            document.getElementById('dateFilter').value = mobileFilters.date;
            setStatusFilterFromArray(mobileFilters.status);
            document.getElementById('functionFilter').value = mobileFilters.function;
            document.getElementById('assigneeFilter').value = mobileFilters.assignee;
            
            // Update filter count badge
            updateFilterCount();
            
            // Update quick filter buttons
            updateQuickFilterButtons();
            
            renderTasks();
            closeFilterModal();
        }
        
        function clearAllFilters() {
            mobileFilters = { type: '', date: '', status: [], function: '', assignee: '' };
            document.querySelectorAll('.filter-chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.value === '');
            });
            applyFiltersAndClose();
        }
        
        function updateFilterCount() {
            let count = 0;
            Object.entries(mobileFilters).forEach(([key, v]) => {
                if (key === 'status') {
                    if (Array.isArray(v) && v.length > 0) count++;
                } else {
                    if (v !== '') count++;
                }
            });
            const badge = document.getElementById('activeFilterCount');
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        }
        
        function setMobileQuickFilter(filter) {
            // Toggle behavior
            if (filter === 'my') {
                mobileFilters.type = mobileFilters.type === 'my' ? '' : 'my';
                mobileFilters.date = '';
            } else if (filter === 'today') {
                mobileFilters.date = mobileFilters.date === 'today' ? '' : 'today';
                mobileFilters.type = '';
            }
            
            // Apply to desktop filters
            document.getElementById('taskTypeFilter').value = mobileFilters.type;
            document.getElementById('dateFilter').value = mobileFilters.date;
            
            updateQuickFilterButtons();
            updateFilterCount();
            renderTasks();
        }
        
        function updateQuickFilterButtons() {
            document.querySelectorAll('.mobile-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            if (mobileFilters.type === 'my') {
                document.querySelector('.mobile-filter-btn[onclick*="my"]')?.classList.add('active');
            }
            if (mobileFilters.date === 'today') {
                document.querySelector('.mobile-filter-btn[onclick*="today"]')?.classList.add('active');
            }
        }
        
        // Update bottom nav active state
        const originalSwitchTab = window.switchTab;
        window.switchTab = function(tab) {
            originalSwitchTab(tab);
            
            // Update bottom nav
            document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tab) {
                    btn.classList.add('active');
                }
            });
        };
