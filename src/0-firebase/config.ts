// src/0-firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAb51b0FPjEv2UocApwDeb8K9zAHg_TNWg",
  authDomain: "risinga-ebc76.firebaseapp.com",
  projectId: "risinga-ebc76",
  storageBucket: "risinga-ebc76.firebasestorage.app",
  messagingSenderId: "386879187827",
  appId: "1:386879187827:web:44b37ee62346cde6913306",
  measurementId: "G-2KJYKCSYEB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };