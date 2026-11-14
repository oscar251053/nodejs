import 'dotenv/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDJzbipyNGA8OYcR980T4sReJqCACUiA40',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'api-rest-node-js-data-db81e.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'api-rest-node-js-data-db81e',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'api-rest-node-js-data-db81e.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '1045464070753',
  appId: process.env.FIREBASE_APP_ID || '1:1045464070753:web:8c8ca88c49d3e714794820',
};

// Inicializa Firebase evitando inicializaciones duplicadas en entornos serverless/tests
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa Firestore
const db = getFirestore(app);

export { app, db };
