"use client"

import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>管理画面</h1>

      <div style={styles.card}>
        <h2>ドレス色あてクイズ</h2>

        <button
          style={styles.button}
          onClick={() => router.push("/admin/quiz")}
        >
          クイズ画面へ
        </button>

        <button
          style={styles.button}
          onClick={() => router.push("/admin/result")}
        >
          結果画面へ
        </button>

        <button
          style={styles.button}
          onClick={() => router.push("/admin/lottery")}
        >
          抽選画面へ
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "40px",
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
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "inline-block",
  },
  button: {
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#ff7aa2",
    color: "#fff",
  },
}