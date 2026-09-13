import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAXMRq6l9G2xjw8wGsY6Z2QMUeRzAEv8MY",
  authDomain: "cnc-electric.firebaseapp.com",
  projectId: "cnc-electric",
  storageBucket: "cnc-electric.firebasestorage.app",
  messagingSenderId: "319530776839",
  appId: "1:319530776839:web:76ada9457211ce665a6da2",
}

let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  console.log("[v0] Firebase initialized successfully")
} catch (error) {
  console.error("[v0] Firebase initialization error:", error)
  throw error
}

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
export default app
