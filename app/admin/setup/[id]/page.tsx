"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Toast from "@/app/components/Toast";

export default function SetupPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [choices, setChoices] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timestamp → datetime-local 文字列
  const toDatetimeLocal = (value: Timestamp | Date | string | null | undefined): string => {
    if (!value) return "";
    const date = value instanceof Timestamp ? value.toDate() : new Date(value as string);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!quizId) return;

    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "quizzes", quizId, "state", "current"));
        if (snap.exists()) {
          const data = snap.data();
          setChoices(data.choices?.length === 4 ? data.choices : ["", "", "", ""]);
          setCorrectAnswer(data.correctAnswer || "");
          setStartTime(toDatetimeLocal(data.startTime));
          setEndTime(toDatetimeLocal(data.endTime));
          setAdminPassword(data.adminPassword || "");
        }
      } catch (e) {
        console.error(e);
        setErrorMessage("設定の読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [quizId]);

  const handleSave = async () => {
    const filledChoices = choices.map((c) => c.trim());

    if (!adminPassword.trim()) {
      setErrorMessage("管理画面のパスワードを入力してください");
      return;
    }
    if (filledChoices.some((c) => !c)) {
      setErrorMessage("選択肢を4つすべて入力してください");
      return;
    }
    if (!correctAnswer) {
      setErrorMessage("正解のドレスを選択してください");
      return;
    }
    if (!filledChoices.includes(correctAnswer)) {
      setErrorMessage("正解は選択肢の中から選んでください");
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage("投票開始・終了時刻を入力してください");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setErrorMessage("終了時刻は開始時刻より後にしてください");
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "quizzes", quizId, "state", "current"),
        {
          choices: filledChoices,
          correctAnswer,
          adminPassword: adminPassword.trim(),
          startTime: Timestamp.fromDate(new Date(startTime)),
          endTime: Timestamp.fromDate(new Date(endTime)),
        },
        { merge: true }
      );
      setSuccessMessage("設定を保存しました");
    } catch (e) {
      console.error(e);
      setErrorMessage("保存に失敗しました。もう一度お試しください");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
        </div>
        <h1 style={styles.mainTitle}>クイズ設定</h1>
        <p style={styles.subtitle}>管理者専用ページ</p>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <p style={styles.loadingText}>読み込み中...</p>
        </div>
      </div>
    );
  }

  const validChoices = choices.map((c) => c.trim()).filter(Boolean);

  return (
    <div style={styles.container}>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {successMessage && (
        <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      <div style={styles.ornament}>
        <div style={styles.ornamentLine} />
        <div style={styles.ornamentDiamond} />
        <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
      </div>
      <h1 style={styles.mainTitle}>クイズ設定</h1>
      <p style={styles.subtitle}>管理者専用ページ</p>

      <div style={styles.card}>
        {/* 管理画面パスワード */}
        <p style={styles.sectionLabel}>Admin Password — 管理画面パスワード</p>
        <input
          type="password"
          style={styles.input}
          placeholder="新郎新婦が使うパスワード"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />

        {/* 選択肢 */}
        <p style={{ ...styles.sectionLabel, marginTop: "36px" }}>Dress Choices — 選択肢</p>
        {choices.map((choice, i) => (
          <div key={i} style={styles.fieldRow}>
            <span style={styles.fieldIndex}>{i + 1}</span>
            <input
              style={styles.input}
              placeholder={`選択肢 ${i + 1}`}
              value={choice}
              onChange={(e) => {
                const next = [...choices];
                next[i] = e.target.value;
                setChoices(next);
                if (correctAnswer === choice) setCorrectAnswer("");
              }}
            />
          </div>
        ))}

        {/* 正解 */}
        <p style={{ ...styles.sectionLabel, marginTop: "36px" }}>Correct Answer — 正解のドレス</p>
        <div style={styles.choicesGrid}>
          {validChoices.length > 0 ? (
            validChoices.map((c) => (
              <button
                key={c}
                style={
                  correctAnswer === c
                    ? { ...styles.choiceButton, ...styles.choiceButtonActive }
                    : styles.choiceButton
                }
                onClick={() => setCorrectAnswer(c)}
              >
                {c}
              </button>
            ))
          ) : (
            <p style={styles.hintText}>先に選択肢を入力してください</p>
          )}
        </div>

        {/* 時刻 */}
        <p style={{ ...styles.sectionLabel, marginTop: "36px" }}>Voting Period — 投票期間</p>

        <p style={styles.fieldLabel}>開始時刻</p>
        <input
          type="datetime-local"
          style={styles.input}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <p style={{ ...styles.fieldLabel, marginTop: "20px" }}>終了時刻</p>
        <input
          type="datetime-local"
          style={styles.input}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        {/* 保存ボタン */}
        <button
          style={saving ? { ...styles.saveButton, ...styles.saveButtonDisabled } : styles.saveButton}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "保存中..." : "✦ 設定を保存 ✦"}
        </button>
      </div>

      <button
        style={styles.backButton}
        onClick={() => router.push(`/admin/${quizId}`)}
      >
        ← 管理トップへ戻る
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #fdfcfa 0%, #f5f0e8 50%, #fdfcfa 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 24px 80px",
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
  card: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(201,168,76,0.18)",
    borderRadius: "2px",
    padding: "40px 48px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 4px 24px rgba(139,105,20,0.05)",
    marginBottom: "20px",
  },
  sectionLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "#c9a84c",
    textTransform: "uppercase" as const,
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  fieldRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  fieldIndex: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "14px",
    color: "rgba(201,168,76,0.6)",
    letterSpacing: "0.1em",
    width: "16px",
    flexShrink: 0,
    textAlign: "center" as const,
  },
  fieldLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.25em",
    marginBottom: "8px",
  },
  input: {
    flex: 1,
    width: "100%",
    padding: "12px 0",
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
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  choiceButton: {
    padding: "12px 20px",
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
  hintText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "#c9a84c",
    letterSpacing: "0.15em",
    gridColumn: "span 2",
    textAlign: "center" as const,
    padding: "16px 0",
    opacity: 0.6,
  },
  saveButton: {
    width: "100%",
    marginTop: "40px",
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
  saveButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as const,
  },
  backButton: {
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
  loadingText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.15em",
    padding: "20px 0",
  },
};
