// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 Firebase Config (Replace with your Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyCRkjq8xfDn--ZcRHOATaM74NtmIaU0QSo",
  authDomain: "mac22-d95d1.firebaseapp.com",
  projectId: "mac22-d95d1",
  storageBucket: "mac22-d95d1.firebasestorage.app",
  messagingSenderId: "445717562160",
  appId: "1:445717562160:web:362e7218dec4dc15d0bef5"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
