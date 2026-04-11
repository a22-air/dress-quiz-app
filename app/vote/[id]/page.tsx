"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";

export default function VotePage() {
  const [name, setName] = useState("");
  const [group, setGroup] = useState<"groom" | "bride">("groom");
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const quizId = params.id as string;

  // 🔹 日付変換（安全版）
  const convertToDate = (
    time: Timestamp | Date | string | number | null | undefined
  ): Date | null => {
    if (!time) return null;
    if (time instanceof Timestamp) return time.toDate();
    if (time instanceof Date) return time;
    return new Date(time);
  };

  // 🔹 localStorage で投票済みチェック
  useEffect(() => {
    if (!quizId) return;
    const key = `voted_${quizId}`;
    if (localStorage.getItem(key) === "true") {
      setSubmitted(true);
    }
  }, [quizId]);

  // 🔹 state取得
  useEffect(() => {
    if (!quizId) return;

    const fetchState = async () => {
      try {
        const ref = doc(db, "quizzes", quizId, "state", "current");
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const data = snap.data();

        const start = convertToDate(data.startTime);
        const end = convertToDate(data.endTime);

        if (!start || !end) return;

        const now = new Date();
        setIsVotingOpen(now >= start && now <= end);
      } catch (e) {
        console.error("state取得エラー", e);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, [quizId]);

  // 🔹 choices取得
  useEffect(() => {
    if (!quizId) return;

    const fetchChoices = async () => {
      try {
        const ref = doc(db, "quizzes", quizId, "state", "current");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setChoices(data.choices || []);
        }
      } catch (e) {
        console.error("choices取得エラー", e);
      }
    };

    fetchChoices();
  }, [quizId]);

  // 🔹 送信
  const handleSubmit = async () => {
    if (!name.trim() || !answer) {
      alert("名前と回答を入力してください");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const votesRef = collection(db, "quizzes", quizId, "votes");

      const q = query(votesRef, where("name", "==", name.trim()));
      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("この名前では既に投票済みです。");
        return;
      }

      await addDoc(votesRef, {
        name: name.trim(),
        group,
        answer,
        createdAt: serverTimestamp(),
      });

      localStorage.setItem(`voted_${quizId}`, "true");
      setSubmitted(true);
    } catch (e) {
      console.error("送信エラー:", e);
      alert("送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ローディング
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div
            style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }}
          />
        </div>
        <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
        <p style={styles.subtitle}>Wedding Dress Quiz</p>
        <div
          style={{
            ...styles.card,
            ...styles.darkCard,
            textAlign: "center" as const,
          }}
        >
          <p style={styles.stateText}>読み込み中</p>
          <p style={styles.stateSubText}>Loading...</p>
        </div>
      </div>
    );
  }

  // 投票期間外
  if (!isVotingOpen) {
    return (
      <div style={styles.container}>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div
            style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }}
          />
        </div>
        <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
        <p style={styles.subtitle}>Wedding Dress Quiz</p>
        <div
          style={{
            ...styles.card,
            ...styles.darkCard,
            textAlign: "center" as const,
          }}
        >
          <p style={styles.stateText}>投票期間外です</p>
        </div>
      </div>
    );
  }

  // 投票完了
  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div
            style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }}
          />
        </div>
        <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
        <p style={styles.subtitle}>Wedding Dress Quiz</p>
        <div
          style={{
            ...styles.card,
            ...styles.darkCard,
            textAlign: "center" as const,
          }}
        >
          <p style={styles.stateText}>投票ありがとうございました</p>
        </div>
        <div style={styles.footerOrnament}>
          <div style={styles.footerLine} />
          <span style={styles.footerText}>✦</span>
          <div style={{ ...styles.footerLine, ...styles.footerLineRight }} />
        </div>
      </div>
    );
  }

  // 投票フォーム
  return (
    <div style={styles.container}>
      <div style={styles.ornament}>
        <div style={styles.ornamentLine} />
        <div style={styles.ornamentDiamond} />
        <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
      </div>

      <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
      <p style={styles.subtitle}>ドレスの色を予想してください</p>

      <div style={styles.card}>
        {/* 名前 */}
        <p style={styles.fieldLabel}>お名前 / Name</p>
        <input
          style={styles.input}
          placeholder="漢字フルネームで入力"
          value={name}
          onChange={(e) => {
            // 入力値の空白をすべて削除
            const cleaned = e.target.value.replace(/\s/g, "");
            setName(cleaned);
          }}
        />

        {/* 新郎新婦 */}
        <p style={styles.fieldLabel}>ご関係 / Relation</p>
        <div style={styles.groupRow}>
          <button
            style={
              group === "groom"
                ? { ...styles.groupButton, ...styles.groupButtonActive }
                : styles.groupButton
            }
            onClick={() => setGroup("groom")}
          >
            新郎側
          </button>
          <button
            style={
              group === "bride"
                ? { ...styles.groupButton, ...styles.groupButtonActive }
                : styles.groupButton
            }
            onClick={() => setGroup("bride")}
          >
            新婦側
          </button>
        </div>

        {/* ドレスの色 */}
        <p style={styles.fieldLabel}>ドレスの色 / Dress Color</p>
        <div style={styles.choicesGrid}>
          {choices.map((choice) => (
            <button
              key={choice}
              style={
                answer === choice
                  ? { ...styles.choiceButton, ...styles.choiceButtonActive }
                  : styles.choiceButton
              }
              onClick={() => setAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>

        {/* 送信 */}
        <button style={isSubmitting ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
          ✦ 投票する ✦
        </button>
      </div>

      <div style={styles.footerOrnament}>
        <div style={styles.footerLine} />
        <span style={styles.footerText}>✦</span>
        <div style={{ ...styles.footerLine, ...styles.footerLineRight }} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #fdfcfa 0%, #f5f0e8 50%, #fdfcfa 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
  },
  ornament: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  ornamentLine: {
    width: "60px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #c9a84c)",
  },
  ornamentLineRight: {
    background: "linear-gradient(90deg, #c9a84c, transparent)",
  },
  ornamentDiamond: {
    width: "6px",
    height: "6px",
    background: "#c9a84c",
    transform: "rotate(45deg)",
  },
  mainTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(28px, 5vw, 42px)" as unknown as string,
    fontWeight: 300,
    color: "#1a1612",
    letterSpacing: "0.12em",
    textAlign: "center",
    marginBottom: "8px",
  },
  subtitle: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "12px",
    fontWeight: 300,
    color: "#c9a84c",
    letterSpacing: "0.3em",
    textAlign: "center",
    marginBottom: "40px",
  },
  card: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(201,168,76,0.18)",
    borderRadius: "2px",
    padding: "40px 48px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 24px rgba(139,105,20,0.05)",
    marginBottom: "0px",
  },
  darkCard: {
    background: "linear-gradient(135deg, #1a1612 0%, #2d2318 100%)",
    border: "1px solid rgba(201,168,76,0.3)",
    padding: "56px 48px",
  },
  stateText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "26px",
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.15em",
    marginBottom: "10px",
  },
  stateSubText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "rgba(240,217,138,0.45)",
    letterSpacing: "0.25em",
  },
  fieldLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "#c9a84c",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    marginBottom: "10px",
    marginTop: "28px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(201,168,76,0.3)",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 300,
    color: "#1a1612",
    letterSpacing: "0.08em",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  groupRow: {
    display: "flex",
    gap: "12px",
  },
  groupButton: {
    flex: 1,
    padding: "12px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.25)",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "13px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.15em",
    transition: "all 0.2s ease",
  },
  groupButtonActive: {
    background: "linear-gradient(135deg, #c9a84c, #e8c76a)",
    border: "1px solid transparent",
    color: "#1a1612",
    fontWeight: 400,
  },
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  choiceButton: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.25)",
    cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    fontWeight: 400,
    color: "#4a4035",
    letterSpacing: "0.08em",
    transition: "all 0.2s ease",
  },
  choiceButtonActive: {
    background: "linear-gradient(135deg, #1a1612, #2d2318)",
    border: "1px solid rgba(201,168,76,0.4)",
    color: "#f0d98a",
  },
  submitButton: {
    width: "100%",
    marginTop: "36px",
    padding: "18px",
    background: "linear-gradient(135deg, #c9a84c, #e8c76a, #c9a84c)",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 400,
    color: "#1a1612",
    letterSpacing: "0.2em",
    boxShadow: "0 4px 16px rgba(139,105,20,0.2)",
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as const,
  },
  footerOrnament: {
    marginTop: "40px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  footerLine: {
    width: "40px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4))",
  },
  footerLineRight: {
    background: "linear-gradient(90deg, rgba(201,168,76,0.4), transparent)",
  },
  footerText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "11px",
    color: "rgba(201,168,76,0.5)",
    letterSpacing: "0.2em",
  },
};
