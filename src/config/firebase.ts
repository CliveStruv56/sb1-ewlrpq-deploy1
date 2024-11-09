import { initializeApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCqm49bAzlJwx2SaTXJQZwrBMMM8BtP_1U",
  authDomain: "bolt-coffee-shop.firebaseapp.com",
  projectId: "bolt-coffee-shop",
  storageBucket: "bolt-coffee-shop.firebasestorage.app",
  messagingSenderId: "921119001263",
  appId: "1:921119001263:web:59aa28f9f2ce17ebb6225a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence with multi-tab support
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  });
} catch (error) {
  console.warn('Error enabling persistence:', error);
}

export { db, auth };