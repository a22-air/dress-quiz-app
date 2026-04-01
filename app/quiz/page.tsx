"use client"

import { useState } from "react"

export default function QuizPage() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [color, setColor] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!name || !role || !color) {
      alert("すべて入力してください")
      return
    }

    // 仮の送信（あとでAPIに接続）
    console.log({
      name,
      role,
      color,
    })

    setSubmitted(true)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ドレス色当てクイズ</h1>

      {!submitted ? (
        <>
          {/* 名前入力 */}
          <h3>お名前</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
            style={styles.input}
          />

          {/* 新郎・新婦選択 */}
          <h3>あなたはどちら側ですか？</h3>

          <label style={styles.option}>
            <input
              type="radio"
              name="role"
              value="groom"
              onChange={() => setRole("groom")}
            />
            新郎側
          </label>

          <label style={styles.option}>
            <input
              type="radio"
              name="role"
              value="bride"
              onChange={() => setRole("bride")}
            />
            新婦側
          </label>

          {/* 色選択 */}
          <h3>ドレスの色を選んでください</h3>

          {["赤", "青", "白", "黒"].map((c) => (
            <label key={c} style={styles.option}>
              <input
                type="radio"
                name="color"
                value={c}
                onChange={() => setColor(c)}
              />
              {c}
            </label>
          ))}

          <button style={styles.button} onClick={handleSubmit}>
            回答する
          </button>
        </>
      ) : (
        <h2>回答を送信しました！</h2>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "200px",
    marginBottom: "20px",
  },
  option: {
    display: "block",
    margin: "10px 0",
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