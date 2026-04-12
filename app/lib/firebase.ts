import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, signInAnonymously } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD74Qc1CJsMLtot7PJ_wdwWa6z6f2tGEIw",
  authDomain: "wedding-quiz-33d59.firebaseapp.com",
  projectId: "wedding-quiz-33d59",
  storageBucket: "wedding-quiz-33d59.firebasestorage.app",
  messagingSenderId: "712963136923",
  appId: "1:712963136923:web:d0ae6169244baa8fd8953e",
  measurementId: "G-FZ6QY2SC4L"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

// 全ページで Firestore にアクセスできるよう匿名ログインを自動実行
signInAnonymously(auth).catch(console.error)