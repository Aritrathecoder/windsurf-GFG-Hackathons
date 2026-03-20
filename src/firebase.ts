import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBgE7iGO9UkrZ_CN3z2jmkZ4ZNyjrBUo6U",
  authDomain: "rethink-d9f24.firebaseapp.com",
  projectId: "rethink-d9f24",
  storageBucket: "rethink-d9f24.firebasestorage.app",
  messagingSenderId: "777647696952",
  appId: "1:777647696952:web:43fbadef15c06a59ce8acd",
  measurementId: "G-ZDYN4W8J08"
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
