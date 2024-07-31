import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsA57gTRgBUoF2qvHPKC3CKmNjgIsDcw0",
  authDomain: "bmi-program.firebaseapp.com",
  projectId: "bmi-program",
  storageBucket: "bmi-program.appspot.com",
  messagingSenderId: "316951727213",
  appId: "1:316951727213:web:b884d0605b6f1ac4624364",
  measurementId: "G-JJF5XKLC2K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,signInWithEmailAndPassword,db};
