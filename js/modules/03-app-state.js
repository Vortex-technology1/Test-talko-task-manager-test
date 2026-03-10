// =====================

        // DEBUG flag — встановити true в DevTools: window.DEBUG = true
'use strict';
        window.DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const dbg = (...args) => window.DEBUG && console.log('[TALKO]', ...args);
        window.dbg = dbg;

        // ══════════════════════════════════════════════════════
        // TALKO NAMESPACE — централізований container для globals
        // Замість 400+ window.xyz → window.TALKO.domain.fn()
        // Backward compat: window.crmXxx = TALKO.crm.xxx (aliases)
        // ══════════════════════════════════════════════════════
        window.TALKO = window.TALKO || {
            // Домени (заповнюються відповідними модулями)
            crm:   {},   // 77-crm.js
            bots:  {},   // 83-bots-contacts.js
            sites: {},   // 93-sites-list, 94-sites-builder, 95-sites-forms
            stats: {},   // 66-statistics.js
            nav:   {},   // 35-helpers.js
            intg:  {},   // 96-integrations.js
            learn: {},   // 80-learning-engine.js
            events:{},   // 84-event-bus.js

            // Утиліти спільного використання
            utils: {
                // HTML escape — єдина реалізація для всіх модулів
                esc: function(s) {
                    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
                        .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
                },
                // Format number
                fmt: function(n) {
                    if (!n && n !== 0) return '—';
                    return Number(n).toLocaleString('uk-UA');
                },
            },

            // Version для debugging
            _v: '2.0.0',
            _build: new Date().toISOString().slice(0,10),
        };

        // Backward compat alias для htmlEsc
        window.htmlEsc = window.TALKO.utils.esc;

        // ══════════════════════════════════════════════════════
        // DB HELPERS — централізований доступ до Firestore paths
        // Замість `firebase.firestore().collection('companies').doc(currentCompanyId)`
        // використовуй: window.companyRef() або window.companyCol('tasks')
        // ══════════════════════════════════════════════════════
        window.companyRef = function() {
            if (!window.currentCompanyId) return null;
            return firebase.firestore().doc('companies/' + window.currentCompanyId);
        };
        window.companyCol = function(collectionName) {
            if (!window.currentCompanyId) return null;
            return firebase.firestore().collection('companies/' + window.currentCompanyId + '/' + collectionName);
        };
        window.companyDoc = function(collectionName, docId) {
            if (!window.currentCompanyId) return null;
            return firebase.firestore().doc('companies/' + window.currentCompanyId + '/' + collectionName + '/' + docId);
        };

        // Колекції — константи (запобігає опечаткам в назвах)
        window.DB_COLS = {
            TASKS:           'tasks',
            REGULAR_TASKS:   'regularTasks',
            USERS:           'users',
            FUNCTIONS:       'functions',
            PROJECTS:        'projects',
            PROCESSES:       'processes',
            CRM_DEALS:       'crm_deals',
            CRM_CLIENTS:     'crm_clients',
            CRM_PIPELINE:    'crm_pipeline',
            CRM_ACTIVITIES:  'crm_activities',
            CRM_STATS:       'crm_stats',
            BOTS:            'bots',
            FLOWS:           'flows',
            CONTACTS:        'contacts',
            SITES:           'sites',
            FUNNELS:         'funnels',
            METRICS:         'metrics',
            METRIC_ENTRIES:  'metricEntries',
            BROADCASTS:      'broadcasts',
            EVENTS:          'events',
        };
        // APP STATE
        // =====================
        const SUPERADMIN_EMAIL = 'management.talco@gmail.com';
        let currentUser = null;
        let currentCompany = null;
        let currentUserData = null;
        let isSuperAdmin = false;
        let tasks = [];
        let users = [];
        let functions = [];
        let regularTasks = [];
        let projects = [];
        let editingId = null;
        
        // Race condition protection
        let isLoading = false;
        let isSaving = false;
        let loadingVersion = 0; // Tracks which load operation is current
        
        // Debounce utility
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Debounced render functions for performance
        const debouncedRenderMyDay = debounce(() => renderMyDay(), 100);
        const debouncedRenderTasks = debounce(() => renderTasks(), 100);
        const debouncedRenderCalendar = debounce(() => renderCalendar(), 100);
        
        // ═══ COALESCED RENDER — batches all render calls into single RAF ═══
        let _coalescePending = false;
        let _coalesceMyDay = false;
        let _coalesceView = false;
        
        function scheduleRender(myDay = true, view = true) {
            if (myDay) _coalesceMyDay = true;
            if (view) _coalesceView = true;
            if (_coalescePending) return;
            _coalescePending = true;
            requestAnimationFrame(() => {
                _coalescePending = false;
                if (_coalesceMyDay) { _coalesceMyDay = false; renderMyDay(); }
                if (_coalesceView) { _coalesceView = false; refreshCurrentView(); }
                updateOverdueBadges();
            });
        }
