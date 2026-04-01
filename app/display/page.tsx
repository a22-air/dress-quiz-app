"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

import ClosedScreen from "./components/CloseScreen"
import ResultScreen from "./components/ResultScreen"
import LotteryScreen from "./components/LotteryScreen"
import WinnerScreen from "./components/WinnerScreen"

export default function DisplayPage() {
  const [status, setStatus] = useState("waiting")

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "quizzes", "test-quiz", "state", "current"),
      (doc) => {
        const data = doc.data()
        if (data) {
          setStatus(data.phase)
        }
      }
    )

    return () => unsub()
  }, [])

  if (status === "closed") {
    return <ClosedScreen />
  }

  if (status === "result") {
    return <ResultScreen />
  }

  if (status === "lottery") {
    return <LotteryScreen />
  }

  if (status === "winner") {
    return <WinnerScreen />
  }

  return <div>準備中...</div>
}