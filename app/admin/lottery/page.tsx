"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    groom: string;
    bride: string;
  }>(null);

  const updatePhase = async (phase: string) => {
    await updateDoc(doc(db, "quizzes", "test-quiz", "state", "current"), {
      phase: phase,
    });
  };

  const startLottery = async () => {
    setLoading(true);

    // ① 正解取得
    const ref = doc(db, "quizzes", "test-quiz", "state", "current");
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const correctAnswer = snap.data().correctAnswer;

    // ② 投票データ取得
    const snapshot = await getDocs(collection(db, "votes"));

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
      groom: groomWinner?.name || "なし",
      bride: brideWinner?.name || "なし",
    };

    // ① 先にFirestore保存
    await updateDoc(ref, {
      winners: resultData,
    });

    // ② 結果セット
    setResult(resultData);

    // ③ 最後にローディング解除
    setLoading(false);
    // ⑥ 画面切り替え
    await updatePhase("winner");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>抽選</h1>

      {/* 初期状態 */}
      {!loading && !result && (
        <button style={styles.button} onClick={startLottery}>
          抽選スタート
        </button>
      )}

      {/* 抽選中 */}
      {loading && <p>🎲 抽選中…</p>}

      {/* 結果表示 */}
      {!loading && result && (
        <>
          <div style={styles.result}>
            <h2>🎉 当選者</h2>
            <p>新郎側：{result.groom}</p>
            <p>新婦側：{result.bride}</p>
          </div>

          <button
            style={styles.button}
            onClick={async () => {
              await updatePhase("closed");
              router.push("/admin");
            }}
          >
            管理画面へ戻る
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  button: {
    margin: "10px",
    padding: "12px 20px",
    background: "#ff7aa2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    padding: "20px",
    background: "#fff5f7",
    borderRadius: "12px",
  },
};
