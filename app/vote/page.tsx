"use client"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

export default function VotePage() {
  const [name, setName] = useState("")
  const [group, setGroup] = useState("groom")
  const [answer, setAnswer] = useState("pink")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!name) {
      alert("名前を入力してください")
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
        <button onClick={() => setAnswer("pink")}>ピンク</button>
        <button onClick={() => setAnswer("blue")}>青</button>
        <button onClick={() => setAnswer("white")}>白</button>
      </div>

      <button onClick={handleSubmit}>投票する</button>
    </div>
  )
}