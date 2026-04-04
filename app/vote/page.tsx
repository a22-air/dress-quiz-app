"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore"
import { db } from "@/app/lib/firebase"

export default function VotePage() {
  const [name, setName] = useState("")
  const [group, setGroup] = useState("groom")
  const [answer, setAnswer] = useState("")
  const [choices, setChoices] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

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
    setError("")

    if (!name || !answer) {
      setError("名前と回答を入力してください")
      return
    }

    // 名前重複チェック
    const q = query(collection(db, "votes"), where("name", "==", name))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      setError("この名前ではすでに投票済みです")
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
      setError("送信に失敗しました")
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>投票ありがとうございました！</h1>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>ドレスの色を予想してください！</h1>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 5 }}>名前（漢字フルネーム）</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：山田 太郎"
          style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4, border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <p>どちら側？</p>
        <button
          onClick={() => setGroup("groom")}
          style={{
            padding: "8px 16px",
            marginRight: 10,
            background: group === "groom" ? "#ff7aa2" : "#eee",
            color: group === "groom" ? "#fff" : "#000",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          新郎
        </button>
        <button
          onClick={() => setGroup("bride")}
          style={{
            padding: "8px 16px",
            background: group === "bride" ? "#ff7aa2" : "#eee",
            color: group === "bride" ? "#fff" : "#000",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          新婦
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p>ドレスの色</p>
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setAnswer(choice)}
            style={{
              padding: "8px 16px",
              marginRight: 10,
              marginTop: 5,
              background: answer === choice ? "#ff7aa2" : "#eee",
              color: answer === choice ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          background: "#ff7aa2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        投票する
      </button>
    </div>
  )
}