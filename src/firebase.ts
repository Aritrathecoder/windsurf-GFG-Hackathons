import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBzUgUL5crfsz6o5o-WYVlLUS1dapBSgZo",
  authDomain: "windsurf-24306.firebaseapp.com",
  projectId: "windsurf-24306",
  storageBucket: "windsurf-24306.firebasestorage.app",
  messagingSenderId: "1021326902366",
  appId: "1:1021326902366:web:e5aaba2848fca7055a60cf",
  measurementId: "G-MKFS4DMBH5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    }
  });
}
