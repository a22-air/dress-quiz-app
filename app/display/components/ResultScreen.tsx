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
    marginTop: "100px",
  },
  title: {
    fontSize: "clamp(24px, 4vw, 48px)",
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

  // 追加
  wrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "40px",
  },
  scrollBox: {
    width: "25vw",
    height: "60vh",
    maxWidth: "400px",
    minWidth: "250px",
    maxHeight: "600px",
    minHeight: "300px",
    overflow: "hidden",
    border: "1px solid #ccc",
  },

  name: {
    padding: "5px",
    borderBottom: "1px solid #ccc",
  },
};