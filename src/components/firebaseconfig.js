// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);