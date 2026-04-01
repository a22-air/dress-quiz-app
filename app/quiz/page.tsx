"use client"

import { useState } from "react"

export default function QuizPage() {
  const [selected, setSelected] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selected) {
      alert("色を選んでください")
      return
    }

    console.log("回答:", selected)
    setSubmitted(true)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ドレス色当てクイズ</h1>

      {!submitted ? (
        <>
          <p>ドレスの色を選んでください</p>

          <div>
            {["赤", "青", "白", "黒"].map((color) => (
              <label key={color} style={styles.option}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  onChange={() => setSelected(color)}
                />
                {color}
              </label>
            ))}
          </div>

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