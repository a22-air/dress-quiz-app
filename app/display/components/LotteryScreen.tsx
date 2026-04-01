"use client"

import { useEffect, useState } from "react"

export default function LotteryScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 500) // 0.5秒ごとに切り替え

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>抽選中...</h1>

      {visible && <p style={styles.text}>ドキドキ...</p>}
    </div>
  )
}

const styles = {
  container: {
    textAlign: "center" as const,
    marginTop: "120px",
  },
  title: {
    fontSize: "40px",
    marginBottom: "40px",
  },
  text: {
    fontSize: "28px",
    color: "#555",
  },
}