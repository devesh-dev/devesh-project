// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import authentication module from firebase
import {getAuth} from 'firebase/auth'
// Import authentication module from firebase
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH7P5lMDdHIdZ5ZvjUHzGSTSOF2SD_js8",
  authDomain: "fir-todo-app-17e8c.firebaseapp.com",
  projectId: "fir-todo-app-17e8c",
  storageBucket: "fir-todo-app-17e8c.appspot.com",
  messagingSenderId: "369779296522",
  appId: "1:369779296522:web:0063965e0b30149a9892f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app) 
