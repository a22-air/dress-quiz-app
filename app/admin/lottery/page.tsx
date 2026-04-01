"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

export default function LotteryPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    groom: string
    bride: string
  }>(null)

  const startLottery = () => {
  setLoading(true)

  setTimeout(async () => {
    const groomList = ["山田太郎", "佐藤次郎", "鈴木一郎"]
    const brideList = ["田中花子", "佐藤花子", "高橋美咲"]

    const randomGroom =
      groomList[Math.floor(Math.random() * groomList.length)]
    const randomBride =
      brideList[Math.floor(Math.random() * brideList.length)]

    setResult({
      groom: randomGroom,
      bride: randomBride,
    })

    setLoading(false)

    // 🔥 ここ追加（winnerに切り替え）
    await updatePhase("winner")
    }, 2000)
  }

    const updatePhase = async (phase: string) => {
      await updateDoc(
        doc(db, "quizzes", "test-quiz", "state", "current"),
        {
          phase: phase
        }
      )
    }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>抽選</h1>

      {!result && (
        <button style={styles.button} onClick={startLottery}>
          抽選スタート
        </button>
      )}

      {loading && <p>🎲 抽選中…</p>}

      {result && (
        <div style={styles.result}>
          <h2>🎉 当選者</h2>
          <p>新郎側：{result.groom}</p>
          <p>新婦側：{result.bride}</p>
        </div>
      )}

      <button
        style={styles.button}
        onClick={async () => {
          await updatePhase("closed")
          router.push("/admin")
        }}
      >
        管理画面へ戻る
      </button>
    </div>
  )
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  button: {
    margin: "10px",
    padding: "12px 20px",
    background: "#ff7aa2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    padding: "20px",
    background: "#fff5f7",
    borderRadius: "12px",
  },
}