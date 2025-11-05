// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLv7L_6GHEXP2hkCTe4jWwkuECogWXRko",
  authDomain: "qfs-web.firebaseapp.com",
  projectId: "qfs-web",
  storageBucket: "qfs-web.firebasestorage.app",
  messagingSenderId: "652525918691",
  appId: "1:652525918691:web:959a427397b44235e4e8d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
