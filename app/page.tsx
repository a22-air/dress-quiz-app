"use client"

import { useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

export default function Home() {
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "quizzes", "test-quiz", "state", "current"),
      (doc) => {
        console.log("🔥 Firestoreデータ:", doc.data())
      }
    )

    return () => unsub()
  }, [])

  return <div>Firestore接続テスト</div>
}