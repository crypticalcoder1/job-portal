// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxO8qVALRV2LGLDkt2g5V4dxUddNSLg_c",
  authDomain: "online-job-portal-5a8c9.firebaseapp.com",
  projectId: "online-job-portal-5a8c9",
  storageBucket: "online-job-portal-5a8c9.appspot.com",
  messagingSenderId: "406649809249",
  appId: "1:406649809249:web:67c5c2cce9507fb6dc7d20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export {db};