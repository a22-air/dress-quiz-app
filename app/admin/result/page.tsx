"use client"

import { useRouter } from "next/navigation"

export default function ResultPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>結果発表</h1>

      {/* 正解 */}
      <div style={styles.card}>
        <h2>正解は 💖 ピンク</h2>
        <p>正解者は 5名です！</p>
      </div>

      {/* 正解者 */}
      <div style={styles.card}>
        <h3>正解者一覧</h3>

        <h4>新郎側</h4>
        <ul>
          <li>山田 太郎</li>
          <li>佐藤 次郎</li>
        </ul>

        <h4>新婦側</h4>
        <ul>
          <li>田中 花子</li>
          <li>鈴木 美咲</li>
        </ul>
      </div>

      {/* 抽選ボタン */}
      <button
        style={styles.button}
        onClick={() => router.push("/admin/lottery")}
      >
        抽選スタート
      </button>

      {/* 不正解者 */}
      <div style={styles.card}>
        <h3>残念…不正解</h3>

        <p>ドレスA（青）：3名</p>
        <ul>
          <li>山田 一郎</li>
        </ul>

        <p>ドレスB（白）：2名</p>
        <ul>
          <li>田中 次郎</li>
        </ul>

        <p>ドレスC（その他）：1名</p>
        <ul>
          <li>佐藤 花子</li>
        </ul>
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