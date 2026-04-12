"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc, collection, getDocs, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useParams } from "next/navigation";
import Toast from "@/app/components/Toast";

type Vote = {
  name: string;
  group: string;
  answer: string;
};

export default function ResultPage() {
  const router = useRouter();

  const [correctUsers, setCorrectUsers] = useState<Vote[]>([]);
  const [wrongUsers, setWrongUsers] = useState<Vote[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const params = useParams();
  const quizId = params.id as string;

  const updatePhase = async (phase: string) => {
    if (!quizId) return;

    try {
      await updateDoc(doc(db, "quizzes", quizId, "state", "current"), {
        phase: phase,
        displayUpdatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("更新エラー:", error);
      setErrorMessage("通信エラーが発生しました。もう一度お試しください。");
    }
  };

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      const ref = doc(db, "quizzes", quizId, "state", "current");
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const correctAnswer = snap.data().correctAnswer;

      // 👇 ここが超重要（修正ポイント）
      const votesRef = collection(db, "quizzes", quizId, "votes");
      const snapshot = await getDocs(votesRef);

      const correct: Vote[] = [];
      const wrong: Vote[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Vote;

        if (data.answer === correctAnswer) {
          correct.push(data);
        } else {
          wrong.push(data);
        }
      });

      setCorrectAnswer(correctAnswer);
      setCorrectUsers(correct);
      setWrongUsers(wrong);

      setLoading(false);
    };

    fetchData();
  }, [quizId]);

  // グループ分け
  const groomCorrect = correctUsers.filter((u) => u.group === "groom");

  const brideCorrect = correctUsers.filter((u) => u.group === "bride");

  const countByAnswer: { [key: string]: number } = {};

  wrongUsers.forEach((user) => {
    if (!countByAnswer[user.answer]) {
      countByAnswer[user.answer] = 0;
    }
    countByAnswer[user.answer]++;
  });

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
        <h1 style={styles.mainTitle}>結果発表</h1>
        <p style={styles.subtitle}>新郎新婦専用ページ</p>
        <div style={{ ...styles.card, ...styles.loadingCard }}>
          <p style={styles.loadingIcon}>⌛</p>
          <p style={styles.loadingText}>集計中</p>
          <p style={styles.loadingSubText}>Calculating — 少々お待ちください</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      <div style={styles.ornament}>
        <div style={styles.ornamentLine} />
        <div style={styles.ornamentDiamond} />
        <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
      </div>

      <h1 style={styles.mainTitle}>結果発表</h1>
      <p style={styles.subtitle}>新郎新婦専用ページ</p>

      {/* 正解 */}
      <div style={{ ...styles.card, ...styles.answerCard }}>
        <p style={styles.answerLabel}>正解のドレス</p>
        <p style={styles.answerColor}>{correctAnswer}</p>
        <p style={styles.answerCount}>正解者 {correctUsers.length}名</p>
      </div>

      {/* ディスプレイ表示ボタン */}
      <button
        style={styles.displayButton}
        onClick={async () => {
          if (!quizId) return;
          await updatePhase("result");
        }}
      >
        ディスプレイに結果を表示
      </button>

      {/* 抽選ボタン */}
      <button
        style={styles.lotteryButton}
        onClick={() => {
          if (!quizId) return;
          router.push(`/admin/lottery/${quizId}`);
        }}
      >
        ✦ 抽選スタート ✦
      </button>

      {/* 正解者 */}
      <div style={styles.card}>
        <p style={styles.sectionLabel}>Winners — 正解者一覧</p>
        <div style={styles.winnersGrid}>
          <div style={styles.winnerGroup}>
            <h4 style={styles.winnerGroupTitle}>新郎側 / Groom</h4>
            {groomCorrect.map((user, index) => (
              <p key={index} style={styles.winnerName}>
                {user.name}
              </p>
            ))}
          </div>
          <div style={styles.winnerGroup}>
            <h4 style={styles.winnerGroupTitle}>新婦側 / Bride</h4>
            {brideCorrect.map((user, index) => (
              <p key={index} style={styles.winnerName}>
                {user.name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 不正解 */}
      <div style={styles.card}>
        <p style={{ ...styles.sectionLabel, marginBottom: "16px" }}>
          Other Answers — 不正解
        </p>

        {Object.entries(countByAnswer).map(([answer, count], idx, arr) => (
          <div
            key={answer}
            style={{
              ...styles.incorrectGroup,
              borderBottom: idx === arr.length - 1 ? "none" : undefined,
              marginBottom: idx === arr.length - 1 ? 0 : "16px",
              paddingBottom: idx === arr.length - 1 ? 0 : "16px",
            }}
          >
            <p style={{ ...styles.incorrectColor, marginBottom: "8px" }}>
              {answer} — {count}名
            </p>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {wrongUsers
                .filter((user) => user.answer === answer)
                .map((user, index) => (
                  <p
                    key={index}
                    style={{
                      ...styles.incorrectName,
                      width: "50%",
                      marginBottom: "8px",
                    }}
                  >
                    {user.name}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button
        style={{
          ...styles.backButton,
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
        onClick={() => {
          if (!quizId) return;
          router.push(`/admin/${quizId}`);
        }}
      >
        ← トップ画面へ戻る
      </button>
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
    padding: "36px 48px",
    width: "100%",
    maxWidth: "520px",
    marginBottom: "20px",
    boxShadow: "0 4px 24px rgba(139,105,20,0.05)",
  },
  answerCard: {
    background: "linear-gradient(135deg, #1a1612 0%, #2d2318 100%)",
    border: "1px solid rgba(201,168,76,0.3)",
    textAlign: "center",
  },
  answerLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "rgba(201,168,76,0.7)",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  answerColor: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "40px",
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.1em",
    marginBottom: "8px",
  },
  answerCount: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "13px",
    fontWeight: 300,
    color: "rgba(240,217,138,0.7)",
    letterSpacing: "0.15em",
  },
  sectionLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "#c9a84c",
    textTransform: "uppercase",
    marginBottom: "24px",
    textAlign: "center",
  },
  winnersGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  winnerGroup: {
    textAlign: "center",
  },
  winnerGroupTitle: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.2em",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(201,168,76,0.15)",
  },
  winnerName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 400,
    color: "#1a1612",
    letterSpacing: "0.05em",
    padding: "5px 0",
  },
  displayButton: {
    width: "100%",
    maxWidth: "520px",
    padding: "14px 20px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.4)",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "12px",
    fontWeight: 300,
    color: "#c9a84c",
    letterSpacing: "0.2em",
    marginBottom: "10px",
  },
  lotteryButton: {
    width: "100%",
    maxWidth: "520px",
    padding: "20px",
    background: "linear-gradient(135deg, #c9a84c, #e8c76a, #c9a84c)",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 400,
    color: "#1a1612",
    letterSpacing: "0.2em",
    marginBottom: "20px",
    boxShadow: "0 4px 16px rgba(139,105,20,0.2)",
  },
  incorrectGroup: {
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(201,168,76,0.1)",
  },
  incorrectColor: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.2em",
    marginBottom: "6px",
  },
  incorrectName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "17px",
    color: "#4a4035",
    letterSpacing: "0.05em",
  },
  backButton: {
    marginTop: "8px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.3)",
    padding: "14px 32px",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.25em",
  },
  loadingCard: {
    background: "linear-gradient(135deg, #1a1612 0%, #2d2318 100%)",
    border: "1px solid rgba(201,168,76,0.3)",
    textAlign: "center" as const,
    padding: "56px 48px",
  },
  loadingIcon: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  loadingText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
    marginBottom: "12px",
  },
  loadingSubText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "rgba(240,217,138,0.45)",
    letterSpacing: "0.2em",
  },
};
