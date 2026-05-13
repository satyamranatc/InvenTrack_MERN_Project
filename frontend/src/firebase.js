// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-YQhQ-yQ1I-DHavvio7cxLAOld4IiIn0",
  authDomain: "inventrack-edbc0.firebaseapp.com",
  projectId: "inventrack-edbc0",
  storageBucket: "inventrack-edbc0.firebasestorage.app",
  messagingSenderId: "999489110210",
  appId: "1:999489110210:web:281e564cba58f085927b5b",
  measurementId: "G-SWKF3DXB6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

