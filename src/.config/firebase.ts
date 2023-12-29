import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuJyMLxJlSFVtPWKMchWiRWmE35CxOEvY",
  authDomain: "test-firebase-b3fad.firebaseapp.com",
  projectId: "test-firebase-b3fad",
  storageBucket: "test-firebase-b3fad.appspot.com",
  messagingSenderId: "121906409238",
  appId: "1:121906409238:web:3148a5fc80a2834c57aa37",
  measurementId: "G-0Y7LJCYGNY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
