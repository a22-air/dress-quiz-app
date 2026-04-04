"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

export default function VotePage() {
  const [name, setName] = useState("")
  const [group, setGroup] = useState<"groom" | "bride">("groom")
  const [answer, setAnswer] = useState("")
  const [choices, setChoices] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isVotingOpen, setIsVotingOpen] = useState(false)

  // 投票期間判定
  useEffect(() => {
    const fetchState = async () => {
      const ref = doc(db, "quizzes", "test-quiz", "state", "current")
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        const now = Date.now()
        const startTime = data.startTime?.toMillis ? data.startTime.toMillis() : data.startTime
        const endTime = data.endTime?.toMillis ? data.endTime.toMillis() : data.endTime
        setIsVotingOpen(now >= startTime && now <= endTime)
      }
      setLoading(false)
    }
    fetchState()
  }, [])

  // 選択肢取得
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

  // 投票処理
  const handleSubmit = async () => {
    if (!name.trim() || !answer) {
      alert("名前と回答を入力してください")
      return
    }

    // 名前チェック（既に投票済みか）
    const q = query(collection(db, "votes"), where("name", "==", name.trim()))
    const snap = await getDocs(q)
    if (!snap.empty) {
      alert("この名前では既に投票済みです。")
      return
    }

    try {
      await addDoc(collection(db, "votes"), {
        name: name.trim(),
        group,
        answer,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (e) {
      console.error("送信エラー:", e)
      alert("送信に失敗しました")
    }
  }

  if (loading) return <p className="text-center mt-10">読み込み中...</p>

  if (!isVotingOpen)
    return <p className="text-center mt-10 text-xl">投票期間外です。次回の投票をお待ちください。</p>

  if (submitted) return <p className="text-center mt-10 text-xl font-bold">投票ありがとうございました！</p>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">ドレスの色を予想してください！</h1>

      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="名前（漢字フルネーム）"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="mb-4">
        <p className="mb-2 font-semibold">どちら側？</p>
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded ${group === "groom" ? "bg-pink-400 text-white" : "bg-gray-200"}`}
            onClick={() => setGroup("groom")}
          >
            新郎
          </button>
          <button
            className={`flex-1 py-2 rounded ${group === "bride" ? "bg-pink-400 text-white" : "bg-gray-200"}`}
            onClick={() => setGroup("bride")}
          >
            新婦
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 font-semibold">ドレスの色</p>
        <div className="flex flex-wrap gap-2">
          {choices.map((choice) => (
            <button
              key={choice}
              className={`px-4 py-2 border rounded ${answer === choice ? "bg-pink-400 text-white" : ""}`}
              onClick={() => setAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <button
        className="w-full py-2 bg-pink-500 text-white font-bold rounded"
        onClick={handleSubmit}
      >
        投票する
      </button>
    </div>
  )
}