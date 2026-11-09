import 'dotenv/config'; 
import { initializeApp } from "firebase/app"; 
import { getFirestore } from 'firebase/firestore'; 
const firebaseConfig = {
    apiKey: "AIzaSyDJzbipyNGA8OYcR980T4sReJqCACUiA40",
    authDomain: "api-rest-node-js-data-db81e.firebaseapp.com",
    projectId: "api-rest-node-js-data-db81e",
    storageBucket: "api-rest-node-js-data-db81e.firebasestorage.app",
    messagingSenderId: "1045464070753",
    appId: "1:1045464070753:web:8c8ca88c49d3e714794820"
};
// Initialize Firebase 
    const app = initializeApp(firebaseConfig); 

// Initialize Firestore 
    const db = getFirestore(app); 
    export { app, db }; 