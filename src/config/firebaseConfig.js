import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2AC_dnhp-NuoC73W4Jll1df1ubE1Stoo",
  authDomain: "moodtracker-ad625.firebaseapp.com",
  projectId: "moodtracker-ad625",
  storageBucket: "moodtracker-ad625.firebasestorage.app",
  messagingSenderId: "165964944108",
  appId: "1:165964944108:web:3a79f20d10fc112f654bc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };