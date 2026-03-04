const CACHE_VERSION = '2026-03-04-stats-v3.0';
const CACHE_NAME = `talko-tasks-${CACHE_VERSION}`;

// Static assets to precache
const PRECACHE_URLS = [
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'css/animations-misc.css',
  'css/base.css',
  'css/components.css',
  'css/filters-structure.css',
  'css/focus-mode.css',
  'css/kanban-calendar.css',
  'css/mobile.css',
  'css/modals-auth.css',
  'css/myday.css',
  'css/projects.css',
  'css/tables-forms.css',
  'css/undo-toast.css',
  'css/variables.css',
  'js/modules/01-translations.js',
  'js/modules/02-firebase-config.js',
  'js/modules/03-app-state.js',
  'js/modules/04-google-calendar-config.js',
  'js/modules/05-auth-functions.js',
  'js/modules/06-auth-state-listener.js',
  'js/modules/07-data-loading.js',
  'js/modules/08-notifications-sound-badge-title.js',
  'js/modules/09-auto-generate-regular-tasks.js',
  'js/modules/10-auto-archive-done-tasks-30-days.js',
  'js/modules/11-archive-ui.js',
  'js/modules/12-my-day-popup.js',
  'js/modules/13-tasks.js',
  'js/modules/14-reminders-functions.js',
  'js/modules/15-validation-security.js',
  'js/modules/16-review-system.js',
  'js/modules/17-feat-006-time-tracking.js',
  'js/modules/18-checklist.js',
  'js/modules/19-user-checkboxes-co-executors-observers.js',
  'js/modules/20-feat-007-deadline-change-validation.js',
  'js/modules/21-calendar-view.js',
  'js/modules/22-my-day-rendering.js',
  'js/modules/23-status-multi-select-filter.js',
  'js/modules/24-table-column-resize-sort.js',
  'js/modules/25-functions.js',
  'js/modules/26-functions-structure-view.js',
  'js/modules/27-processes.js',
  'js/modules/28-projects.js',
  'js/modules/29-auto-advance.js',
  'js/modules/30-regular-tasks.js',
  'js/modules/31-regular-calendar-view.js',
  'js/modules/32-users-invites.js',
  'js/modules/33-control-dashboard.js',
  'js/modules/34-admin-functions.js',
  'js/modules/35-helpers.js',
  'js/modules/36-swipe-to-complete-event-delegation.js',
  'js/modules/37-browser-notifications.js',
  'js/modules/38-google-calendar-integration.js',
  'js/modules/39-telegram-integration.js',
  'js/modules/40-calendar-quick-actions.js',
  'js/modules/41-demo-data.js',
  'js/modules/42-swipe-between-tabs.js',
  'js/modules/43-pull-to-refresh-mobile.js',
  'js/modules/44-offline-support.js',
  'js/modules/45-comments-system.js',
  'js/modules/46-audit-log.js',
  'js/modules/47-cascading-escalation.js',
  'js/modules/48-kanban-board-status-deadlines.js',
  'js/modules/49-file-attachments.js',
  'js/modules/50-next-task-ai-like-task-prioritization.js',
  'js/modules/51-morning-start-auto-start-day.js',
  'js/modules/52-task-timer-track-execution-time.js',
  'js/modules/53-onboarding-hints-step-by-step-tooltips-for-new-use.js',
  'js/modules/54-personal-analytics-employee-self-insight.js',
  'js/modules/55-team-dashboard-manager-overview.js',
  'js/modules/56-daily-snapshot-data-for-future-agi-analysis.js',
  'js/modules/57-decision-log-track-manual-management-decisions-for.js',
  'js/modules/58-ai-structure-generator-import-assistants-config.js',
  'js/modules/59-ai-assistants-config-owner-panel.js',
  'js/modules/60-manual-incidents-journal.js',
  'js/modules/61-task-templates.js',
  'js/modules/62-completion-report.js',
  'js/modules/63-notification-center.js',
  'js/modules/64-focus-mode.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install — precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(err => console.log('[SW] Precache failed:', err))
  );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — strategy per request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Firebase/Google API — network only (no cache)
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebase.google.com') ||
      url.hostname.includes('accounts.google.com') ||
      url.hostname.includes('gstatic.com/firebasejs') ||
      url.hostname.includes('firestore.googleapis.com')) {
    return;
  }

  // Fonts — cache first (rarely change)
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Icons — cache first
  if (url.pathname.includes('/icons/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // App shell (HTML, JS, CSS) — network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          return cached || new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        });
      })
  );
});
