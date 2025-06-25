// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBOEGmPNDLPQVg6QDUf6fl2XkNPt3CJDec",
  authDomain: "quizapp-8ee9a.firebaseapp.com",
  projectId: "quizapp-8ee9a",
  storageBucket: "quizapp-8ee9a.appspot.com",
  messagingSenderId: "269285367112",
  appId: "1:269285367112:web:3f47307d5569fd1b65e77d",
  measurementId: "G-ZX6Y7831K7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider(); 