"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Vote = {
  name: string;
  group: string;
  answer: string;
};

export default function LotteryPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    groom: string;
    bride: string;
  }>(null);

  const updatePhase = async (phase: string) => {
    if (!quizId) return;

    await updateDoc(doc(db, "quizzes", quizId, "state", "current"), {
      phase: phase,
    });
  };

  const startLottery = async () => {
    if (!quizId) return;

    setLoading(true);

    // ① 正解取得
    const ref = doc(db, "quizzes", quizId, "state", "current");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setLoading(false);
      return;
    }

    const correctAnswer = snap.data().correctAnswer;

    // ② 投票データ取得（ここ重要🔥）
    const votesRef = collection(db, "quizzes", quizId, "votes");
    const snapshot = await getDocs(votesRef);

    const votes: Vote[] = [];
    snapshot.forEach((doc) => {
      votes.push(doc.data() as Vote);
    });

    // ③ 正解者抽出
    const correctUsers = votes.filter((u) => u.answer === correctAnswer);

    const groomUsers = correctUsers.filter((u) => u.group === "groom");
    const brideUsers = correctUsers.filter((u) => u.group === "bride");

    // ④ 抽選
    const pickWinner = (users: Vote[]) => {
      if (users.length === 0) return null;
      const index = Math.floor(Math.random() * users.length);
      return users[index];
    };

    const groomWinner = pickWinner(groomUsers);
    const brideWinner = pickWinner(brideUsers);

    const resultData = {
      groom: groomWinner?.name || "該当者なし",
      bride: brideWinner?.name || "該当者なし",
    };

    // ⑤ Firestore保存
    await updateDoc(ref, {
      phase: "lottery",
    });

    await new Promise((r) => setTimeout(r, 300));

    await updateDoc(ref, {
      winners: resultData,
      phase: "winner",
    });

    // ⑥ UI反映
    setResult(resultData);
    setLoading(false);

    // ⑦ フェーズ変更
    await updatePhase("winner");
  };

  return (
    <div style={styles.container}>
      <div style={styles.ornament}>
        <div style={styles.ornamentLine} />
        <div style={styles.ornamentDiamond} />
        <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
      </div>

      <h1 style={styles.mainTitle}>抽選</h1>
      <p style={styles.subtitle}>新郎新婦専用ページ</p>

      <div style={styles.stage}>
        {/* 初期状態 */}
        {!loading && !result && (
          <div style={styles.card}>
            <p style={styles.startText}>ボタンを押して抽選を開始してください</p>
            <button style={styles.startButton} onClick={startLottery}>
              抽選スタート
            </button>
          </div>
        )}

        {/* 抽選中 */}
        {loading && (
          <div
            style={{ ...styles.card, ...styles.darkCard, textAlign: "center" }}
          >
            <p style={styles.spinningText}>🎲 抽選中…</p>
            <p style={styles.spinningSubText}>Drawing</p>
          </div>
        )}

        {/* 結果表示 */}
        {!loading && result && (
          <div
            style={{ ...styles.card, ...styles.darkCard, textAlign: "center" }}
          >
            <p style={styles.resultEyebrow}>🎉 当選者発表 — Winners</p>
            <div style={styles.resultWinners}>
              <div style={styles.winnerBlock}>
                <p style={styles.winnerSide}>新郎側 / Groom</p>
                <p style={styles.winnerNameBig}>{result.groom}</p>
              </div>
              <div style={styles.winnerBlock}>
                <p style={styles.winnerSide}>新婦側 / Bride</p>
                <p style={styles.winnerNameBig}>{result.bride}</p>
              </div>
            </div>
            <p style={styles.congrats}>Congratulations</p>
          </div>
        )}

        {/* ボタン行 */}
        <div style={styles.actionRow}>
          {!loading && result && (
            <button style={styles.actionButton} onClick={startLottery}>
              もう一度抽選
            </button>
          )}
          <button
            style={styles.actionButton}
            onClick={async () => {
              if (!quizId) return;

              await updatePhase("closed");
              router.push(`/admin/${quizId}`);
            }}
          >
            ← トップ画面へ戻る
          </button>
        </div>
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
    marginBottom: "48px",
  },
  stage: {
    width: "100%",
    maxWidth: "460px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  card: {
    width: "100%",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(201,168,76,0.18)",
    borderRadius: "2px",
    padding: "52px 48px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(139,105,20,0.05)",
  },
  darkCard: {
    background: "linear-gradient(135deg, #1a1612, #2d2318)",
    border: "1px solid rgba(201,168,76,0.3)",
  },
  startText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "12px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.15em",
    marginBottom: "32px",
  },
  startButton: {
    padding: "16px 48px",
    background: "linear-gradient(135deg, #c9a84c, #e8c76a)",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 400,
    color: "#1a1612",
    letterSpacing: "0.2em",
    boxShadow: "0 4px 16px rgba(139,105,20,0.2)",
  },
  spinningText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
    marginBottom: "8px",
  },
  spinningSubText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    color: "rgba(240,217,138,0.4)",
    letterSpacing: "0.3em",
  },
  resultEyebrow: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    letterSpacing: "0.25em",
    color: "rgba(201,168,76,0.8)",
    marginBottom: "28px",
  },
  resultWinners: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "20px",
  },
  winnerBlock: {
    textAlign: "center",
  },
  winnerSide: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "9px",
    fontWeight: 300,
    color: "rgba(201,168,76,0.5)",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  winnerNameBig: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "26px",
    fontWeight: 400,
    color: "#f0d98a",
    letterSpacing: "0.08em",
  },
  congrats: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "12px",
    fontStyle: "italic",
    color: "rgba(240,217,138,0.45)",
    letterSpacing: "0.2em",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    width: "100%",
  },
  actionButton: {
    flex: 1,
    padding: "14px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.3)",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.2em",
  },
};
