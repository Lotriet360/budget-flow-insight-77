// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAk6kgdG7pE9Av20ru1Qx9jrCylZfo3ZWk",
  authDomain: "budgeting-2b16a.firebaseapp.com",
  projectId: "budgeting-2b16a",
  storageBucket: "budgeting-2b16a.firebasestorage.app",
  messagingSenderId: "543792677435",
  appId: "1:543792677435:web:384bdbadf83a1ba86b521e",
  measurementId: "G-T2C3JQH96L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

