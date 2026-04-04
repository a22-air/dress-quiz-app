"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

export default function VotePage() {
  const [name, setName] = useState("")
  const [group, setGroup] = useState("groom")
  const [answer, setAnswer] = useState("")
  const [choices, setChoices] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchChoices = async () => {
      const ref = doc(db, "quizzes", "test-quiz", "state", "current")
      const snap = await getDoc(ref)

      if (snap.exists()) {
        const data = snap.data()
        setChoices(data.choices || [])
      }
    }

    fetchChoices()
  }, [])

  const handleSubmit = async () => {
    if (!name || !answer) {
      alert("名前と回答を入力してください")
      return
    }

    try {
      await addDoc(collection(db, "votes"), {
        name,
        group,
        answer,
        createdAt: serverTimestamp(),
      })

      setSubmitted(true)
    } catch (e) {
      console.error("エラー:", e)
      alert("送信に失敗しました")
    }
  }

  if (submitted) {
    return <h1>投票ありがとうございました！</h1>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ドレスの色を予想してください！</h1>

      <input
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <p>どちら側？</p>
        <button onClick={() => setGroup("groom")}>新郎</button>
        <button onClick={() => setGroup("bride")}>新婦</button>
      </div>

      <div>
        <p>ドレスの色</p>

        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      <button onClick={handleSubmit}>投票する</button>
    </div>
  )
}