// =====================
        // FIREBASE CONFIG
        // =====================
'use strict';
        const firebaseConfig = {
            apiKey: "AIzaSyD1oBJuuFiVVo4HHjjeb81IhGEt1oz4Ydc",
            authDomain: "task-manager-44e84.firebaseapp.com",
            projectId: "task-manager-44e84",
            storageBucket: "task-manager-44e84.firebasestorage.app",
            messagingSenderId: "181519398491",
            appId: "1:181519398491:web:baa17a9a88f637ee94717e"
        };

        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();
        const storage = firebase.storage();
        const googleProvider = new firebase.auth.GoogleAuthProvider();
