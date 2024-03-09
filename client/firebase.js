// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "portfolio-blog-mahesh.firebaseapp.com",
  projectId: "portfolio-blog-mahesh",
  storageBucket: "portfolio-blog-mahesh.appspot.com",
  messagingSenderId: "70993072645",
  appId: "1:70993072645:web:55245ecea281c62265426c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
