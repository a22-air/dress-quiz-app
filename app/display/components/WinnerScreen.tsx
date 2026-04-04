"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
// @ts-ignore
import confetti from "canvas-confetti";

export default function WinnerScreen() {
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [show, setShow] = useState(false);
  const [flash, setFlash] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1500); // ← 1.5秒ためる

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (show) {
      const duration = 2000;
      const end = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);

        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 100);
    }
  }, [show]);

  useEffect(() => {
    const ref = doc(db, "quizzes", "test-quiz", "state", "current");

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data().winners;

      if (data) {
        setGroom(data.groom);
        setBride(data.bride);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (show) {
      setFlash(true);

      setTimeout(() => {
        setFlash(false);
      }, 300); // ← フラッシュ時間（短いほどリアル）
    }
  }, [show]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDark(false);
      setShow(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        background: dark ? "#000" : flash ? "#fff" : "#fff",
        color: dark ? "#fff" : "#000",
        transition: "all 0.3s ease",
      }}
    >
      <h1 style={styles.title}>🎉 当選者発表 🎉</h1>

      <div style={styles.wrapper}>
        {/* 新郎 */}
        <div style={styles.card}>
          <h2>新郎側</h2>
          <p
            style={{
              ...styles.name,
              opacity: show ? 1 : 0,
              transform: show ? "scale(1)" : "scale(0.5)",
            }}
          >
            {groom}
          </p>
        </div>

        {/* 新婦 */}
        <div style={styles.card}>
          <h2>新婦側</h2>
          <p
            style={{
              ...styles.name,
              opacity: show ? 1 : 0,
              transform: show ? "scale(1)" : "scale(0.5)",
            }}
          >
            {bride}
          </p>
        </div>
      </div>

      <p style={styles.message}>おめでとうございます！</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center" as const,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: "clamp(36px, 5vw, 72px)",
    marginBottom: "60px",
  },

  wrapper: {
    display: "flex",
    gap: "80px",
    marginBottom: "40px",
  },

  card: {
    background: "#fff5f7",
    padding: "40px",
    borderRadius: "20px",
    minWidth: "300px",
  },

  group: {
    fontSize: "24px",
    marginBottom: "20px",
  },

  name: {
    fontSize: "clamp(40px, 4vw, 64px)",
    fontWeight: "bold",
    transition: "all 0.5s ease",
  },

  message: {
    fontSize: "24px",
    marginTop: "20px",
  },
};
