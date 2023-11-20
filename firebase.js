// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDi7iHh4JW-jfh5OYQI3ghJ5PSxkxV5JNI",
  authDomain: "tmax-19275.firebaseapp.com",
  projectId: "tmax-19275",
  storageBucket: "tmax-19275.appspot.com",
  messagingSenderId: "426999339864",
  appId: "1:426999339864:web:21ce5c79e28c5aa23ce32d",
  measurementId: "G-89EKKFRKPJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {app, db}