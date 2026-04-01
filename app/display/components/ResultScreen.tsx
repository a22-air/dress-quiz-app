export default function ResultScreen() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 正解発表 🎉</h1>

      <div style={styles.answerBox}>
        <p style={styles.answerText}>正解は</p>
        <p style={styles.color}>赤色</p>
      </div>

      <p style={styles.subText}>正解者：80名</p>
    </div>
  )
}

const styles = {
  container: {
    textAlign: "center" as const,
    marginTop: "100px",
  },
  title: {
    fontSize: "40px",
    marginBottom: "40px",
  },
  answerBox: {
    marginBottom: "40px",
  },
  answerText: {
    fontSize: "24px",
  },
  color: {
    fontSize: "64px",
    fontWeight: "bold",
    color: "red",
  },
  subText: {
    fontSize: "20px",
    color: "#666",
  },
}