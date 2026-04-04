"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Vote = {
  name: string;
  group: string;
  answer: string;
};

export default function ResultScreen() {
  const groomRef = useRef<HTMLDivElement | null>(null);
  const brideRef = useRef<HTMLDivElement | null>(null);

  const [groomWinners, setGroomWinners] = useState<string[]>([]);
  const [brideWinners, setBrideWinners] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "quizzes", "test-quiz", "state", "current");
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const correct = snap.data().correctAnswer;
      setCorrectAnswer(correct);

      const snapshot = await getDocs(collection(db, "votes"));

      const groom: string[] = [];
      const bride: string[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Vote;

        if (data.answer === correct) {
          if (data.group === "groom") {
            groom.push(data.name);
          } else {
            bride.push(data.name);
          }
        }
      });

      setGroomWinners(groom);
      setBrideWinners(bride);
      setTotal(groom.length + bride.length);

      setLoading(false);
    };

    fetchData();
  }, []);

  // スクロール
  useEffect(() => {
    if (!showList) return;

    const interval = setInterval(() => {
      if (groomRef.current) {
        const el = groomRef.current;
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
  }, [showList]);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      setShowList(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>集計中...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 正解発表 🎉</h1>

      <div style={styles.answerBox}>
        <p style={styles.answerText}>正解は</p>
        <p style={styles.color}>{correctAnswer}</p>
      </div>

      <p style={styles.subText}>正解者：{total}名</p>

      <div
        style={{
          ...styles.wrapper,
          opacity: showList ? 1 : 0,
          transform: showList ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.6s ease",
          minHeight: "400px",
        }}
      >
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
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    overflow: "hidden"
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
    flex: 1,
  },

  scrollBox: {
    width: "clamp(300px, 30vw, 500px)",
    maxHeight: "40vh",
    overflow: "hidden",
    border: "1px solid #ccc",
  },

  name: {
    padding: "10px",
    fontSize: "clamp(18px, 1.5vw, 24px)",
    borderBottom: "1px solid #ccc",
  },
};
