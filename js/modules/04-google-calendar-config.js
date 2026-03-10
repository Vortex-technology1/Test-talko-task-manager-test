// =====================
        // GOOGLE CALENDAR CONFIG
        // =====================
'use strict';
        const GOOGLE_CLIENT_ID = '373376418182-1bc6pfp3qo54n2rt8l0sqjtqaqj6ari3.apps.googleusercontent.com';
        const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email';
        let googleAccessToken = null;
        let tokenClient = null;
