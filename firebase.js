import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBQjwVNDOP6PACYMFmB4sNrOTqRJCFkTNU",
    authDomain: "online-mcq-test-7c019.firebaseapp.com",
    projectId: "online-mcq-test-7c019",
    storageBucket: "online-mcq-test-7c019.firebasestorage.app",
    messagingSenderId: "386164338251",
    appId: "1:386164338251:web:e4283d1764237ad9df27ce"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export { auth, db };