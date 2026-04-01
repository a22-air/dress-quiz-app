"use client"

import { useEffect, useRef } from "react";

const groomWinners = ["山田太郎", "鈴木一郎", "田中次郎","山田太郎", "鈴木一郎", "田中次郎","山田太郎", "鈴木一郎", "田中次郎","鈴木一郎", "田中次郎","山田太郎", "鈴木一郎","山田太郎", "鈴木一郎", "田中次郎","山田太郎", "鈴木一郎", "田中次郎","山田太郎", "鈴木一郎",];
const brideWinners = ["佐藤花子", "高橋美咲", "伊藤愛"];

export default function ResultScreen() {
  const groomRef = useRef<HTMLDivElement | null>(null);
  const brideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (groomRef.current) {
        const el = groomRef.current;

        // 一番下に到達したらリセット
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 1;
        }
      }

      if (brideRef.current) {
        const el = brideRef.current;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 1;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 正解発表 🎉</h1>

      <div style={styles.answerBox}>
        <p style={styles.answerText}>正解は</p>
        <p style={styles.color}>赤色</p>
      </div>

      <p style={styles.subText}>正解者：80名</p>

      {/* 新郎・新婦エリア */}
      <div style={styles.wrapper}>
      {/* 新郎側 */}
      <div>
        <h3>新郎側</h3>

        <div ref={groomRef} style={styles.scrollBox}>
          {groomWinners.map((name, index) => (
            <p key={index} style={styles.name}>
              {name}
            </p>
          ))}
        </div>
      </div>

      {/* 新婦側 */}
      <div>
        <h3>新婦側</h3>

        <div ref={brideRef} style={styles.scrollBox}>
          {brideWinners.map((name, index) => (
            <p key={index} style={styles.name}>
              {name}
            </p>
          ))}
        </div>
  </div>
</div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center" as const,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  title: {
    fontSize: "clamp(36px, 5vw, 72px)",
    marginBottom: "40px",
  },

  answerBox: {
    marginBottom: "40px",
  },

  answerText: {
    fontSize: "clamp(20px, 2vw, 28px)",
  },

  color: {
    fontSize: "clamp(60px, 8vw, 120px)",
    fontWeight: "bold",
    color: "red",
  },

  subText: {
    fontSize: "clamp(18px, 1.8vw, 26px)",
    color: "#666",
  },

  wrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "60px",
    marginTop: "40px",
  },

  scrollBox: {
    width: "clamp(300px, 30vw, 500px)",
    maxHeight: "60vh",
    overflow: "hidden",
    border: "1px solid #ccc",
  },

  name: {
    padding: "10px",
    fontSize: "clamp(18px, 1.5vw, 24px)",
    borderBottom: "1px solid #ccc",
  },
};