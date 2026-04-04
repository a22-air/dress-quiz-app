"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, updateDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/app/lib/firebase"
import { getDoc } from "firebase/firestore"

type Vote = {
  name: string
  group: string
  answer: string
}

export default function ResultPage() {
  const router = useRouter()

  const [correctUsers, setCorrectUsers] = useState<Vote[]>([])
  const [wrongUsers, setWrongUsers] = useState<Vote[]>([])
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [loading, setLoading] = useState(true)

  const updatePhase = async (phase: string) => {
    await updateDoc(
      doc(db, "quizzes", "test-quiz", "state", "current"),
      {
        phase: phase
      }
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "quizzes", "test-quiz", "state", "current")
      const snap = await getDoc(ref)

      if (!snap.exists()) return

      const correctAnswer = snap.data().correctAnswer

      const snapshot = await getDocs(collection(db, "votes"))

      const correct: Vote[] = []
      const wrong: Vote[] = []

      snapshot.forEach((doc) => {
        const data = doc.data() as Vote

        if (data.answer === correctAnswer) {
          correct.push(data)
        } else {
          wrong.push(data)
        }
      })

      setCorrectAnswer(correctAnswer)
      setCorrectUsers(correct)
      setWrongUsers(wrong)

      setLoading(false)
    }

    fetchData()
  }, [])

  // グループ分け
  const groomCorrect = correctUsers.filter(
    (u) => u.group === "groom"
  )

  const brideCorrect = correctUsers.filter(
    (u) => u.group === "bride"
  )

  const countByAnswer: { [key: string]: number } = {}

  wrongUsers.forEach((user) => {
    if (!countByAnswer[user.answer]) {
      countByAnswer[user.answer] = 0
    }
    countByAnswer[user.answer]++
  })

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>🎉 集計中...</h2>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>結果発表</h1>

      {/* 正解 */}
      <div style={styles.card}>
        <h2>正解は 💖 {correctAnswer}</h2>
        <p>正解者は {correctUsers.length} 名です！</p>
      </div>

      {/* 正解者 */}
      <div style={styles.card}>
        <h3>正解者一覧</h3>

        <h4>新郎側</h4>
        <ul>
          {groomCorrect.map((user, index) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>

        <h4>新婦側</h4>
        <ul>
          {brideCorrect.map((user, index) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      </div>

      {/* 抽選ボタン */}
      <button
        style={styles.button}
        onClick={async () => {
          await updatePhase("lottery")
          router.push("/admin/lottery")
        }}
      >
        抽選画面へ
      </button>

      {/* 不正解者 */}
      <div style={styles.card}>
        <h3>残念…不正解</h3>

        {Object.entries(countByAnswer).map(([answer, count]) => (
          <div key={answer} style={{ marginBottom: "10px" }}>
            <p>
              {answer}：{count}人
            </p>
        
            <ul>
              {wrongUsers
                .filter((user) => user.answer === answer)
                .map((user, index) => (
                  <li key={index}>{user.name}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "20px",
    background: "#fff5f7",
    minHeight: "100vh",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    margin: "15px auto",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#ff7aa2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
}