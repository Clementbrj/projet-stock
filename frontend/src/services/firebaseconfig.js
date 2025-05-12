// Import the functions you need from the SDKs you need
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC55-HB6_ezOhTIYrWeGzv_qaMnGvZbJqg",
  authDomain: "stock-manager-817f2.firebaseapp.com",
  projectId: "stock-manager-817f2",
  storageBucket: "stock-manager-817f2.firebasestorage.app",
  messagingSenderId: "641169866792",
  appId: "1:641169866792:web:f4eda34ebe1a99aed2b51d",
  measurementId: "G-LT2G50TSCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the functions you need
export { app, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, createUserWithEmailAndPassword };
