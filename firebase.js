import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAS09s0_uRkL9mR3R1WjO5MC4VF64Xjvwg",
    authDomain: "cotabmudas.firebaseapp.com",
    projectId: "cotabmudas",
    storageBucket: "cotabmudas.firebasestorage.app",
    messagingSenderId: "778625638233",
    appId: "1:778625638233:web:e11c8788a9de3163587648",
    measurementId: "G-4NHL5C7M1V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };