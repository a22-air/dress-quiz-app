"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = async () => {
    setResetting(true);
    setConfirmReset(false);
    try {
      await updateDoc(doc(db, "quizzes", quizId, "state", "current"), {
        phase: "closed",
        displayUpdatedAt: serverTimestamp(),
      });
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    if (!quizId) return;
    const sessionKey = `admin-auth-${quizId}`;
    if (sessionStorage.getItem(sessionKey) === "true") {
      setAuthed(true);
    }
  }, [quizId]);

  const handleLogin = async () => {
    const value = (inputRef.current?.value ?? passwordInput).trim();
    if (!value) {
      setPasswordError(true);
      return;
    }
    setChecking(true);
    setPasswordError(false);

    try {
      const snap = await getDoc(doc(db, "quizzes", quizId, "state", "current"));
      const adminPassword = snap.exists() ? snap.data().adminPassword : null;

      if (adminPassword && value === String(adminPassword)) {
        sessionStorage.setItem(`admin-auth-${quizId}`, "true");
        setAuthed(true);
      } else {
        setPasswordError(true);
        setPasswordInput("");
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch {
      setPasswordError(true);
    } finally {
      setChecking(false);
    }
  };

  if (!quizId) {
    return <div>読み込み中...</div>;
  }

  // 未認証: パスワード入力画面
  if (!authed) {
    return (
      <div style={styles.container}>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
        </div>

        <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
        <p style={styles.subtitle}>新郎新婦専用ページ</p>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Password</p>

          <p style={styles.fieldLabel}>パスワード</p>
          <input
            ref={inputRef}
            type="password"
            style={{
              ...styles.input,
              borderBottomColor: passwordError
                ? "rgba(200,80,80,0.6)"
                : "rgba(201,168,76,0.3)",
            }}
            placeholder="パスワードを入力"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
          />

          {passwordError && (
            <p style={styles.errorText}>パスワードが違います</p>
          )}

          <button
            style={
              checking
                ? { ...styles.loginButton, ...styles.loginButtonDisabled }
                : styles.loginButton
            }
            onClick={handleLogin}
            disabled={checking}
          >
            {checking ? "確認中..." : "入室する"}
          </button>
        </div>
      </div>
    );
  }

  // 認証済み: 管理メニュー
  return (
    <div style={styles.container}>
      <div style={styles.ornament}>
        <div style={styles.ornamentLine} />
        <div style={styles.ornamentDiamond} />
        <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
      </div>

      <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
      <p style={styles.subtitle}>新郎新婦専用ページ</p>

      <div style={styles.card}>
        <div style={styles.cardInner}>
          <p style={styles.cardTitle}>Menu</p>

          <button
            style={styles.navButton}
            onClick={() => router.push(`/admin/result/${quizId}`)}
            onMouseEnter={(e) =>
              Object.assign((e.target as HTMLElement).style, styles.navButtonHover)
            }
            onMouseLeave={(e) =>
              Object.assign((e.target as HTMLElement).style, {
                borderColor: "rgba(201,168,76,0.25)",
                transform: "none",
                boxShadow: "none",
              })
            }
          >
            <div style={styles.navButtonContent}>
              <span style={styles.navButtonLabel}>Result</span>
              <span style={styles.navButtonTitle}>結果発表</span>
            </div>
            <span style={styles.navButtonArrow}>→</span>
          </button>

          <button
            style={{ ...styles.navButton, marginBottom: 0 }}
            onClick={() => router.push(`/admin/lottery/${quizId}`)}
            onMouseEnter={(e) =>
              Object.assign((e.target as HTMLElement).style, styles.navButtonHover)
            }
            onMouseLeave={(e) =>
              Object.assign((e.target as HTMLElement).style, {
                borderColor: "rgba(201,168,76,0.25)",
                transform: "none",
                boxShadow: "none",
              })
            }
          >
            <div style={styles.navButtonContent}>
              <span style={styles.navButtonLabel}>Lottery</span>
              <span style={styles.navButtonTitle}>抽選</span>
            </div>
            <span style={styles.navButtonArrow}>→</span>
          </button>
        </div>
      </div>

      {confirmReset ? (
        <div style={styles.confirmBox}>
          <p style={styles.confirmText}>ディスプレイをトップ画面に戻しますか？</p>
          <div style={styles.confirmRow}>
            <button
              style={styles.confirmYes}
              onClick={handleReset}
              disabled={resetting}
            >
              {resetting ? "処理中..." : "戻す"}
            </button>
            <button
              style={styles.confirmNo}
              onClick={() => setConfirmReset(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          style={styles.resetButton}
          onClick={() => setConfirmReset(true)}
        >
          ディスプレイをトップ画面に戻す
        </button>
      )}

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
    background: "linear-gradient(160deg, #fdfcfa 0%, #f5f0e8 50%, #fdfcfa 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cormorant Garamond', serif",
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
    marginBottom: "56px",
  },
  card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "2px",
    padding: "48px 56px",
    width: "100%",
    maxWidth: "440px",
    position: "relative",
    boxShadow: "0 4px 24px rgba(139,105,20,0.06), 0 1px 4px rgba(139,105,20,0.04)",
  },
  cardInner: {
    position: "relative",
  },
  cardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "11px",
    fontWeight: 400,
    color: "#c9a84c",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: "32px",
  },
  fieldLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.3em",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "12px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(201,168,76,0.3)",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "20px",
    fontWeight: 300,
    color: "#1a1612",
    letterSpacing: "0.15em",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  },
  errorText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "#b05050",
    letterSpacing: "0.15em",
    marginTop: "10px",
  },
  loginButton: {
    width: "100%",
    marginTop: "32px",
    padding: "16px",
    background: "linear-gradient(135deg, #c9a84c, #e8c76a, #c9a84c)",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    fontWeight: 400,
    color: "#1a1612",
    letterSpacing: "0.2em",
    boxShadow: "0 4px 16px rgba(139,105,20,0.2)",
  },
  loginButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as const,
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "18px 24px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.25)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "14px",
    position: "relative",
  },
  navButtonHover: {
    borderColor: "rgba(201,168,76,0.6)",
    transform: "translateY(-1px)",
    boxShadow: "0 8px 24px rgba(139,105,20,0.1)",
  },
  navButtonContent: {
    textAlign: "left",
  },
  navButtonLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "10px",
    fontWeight: 300,
    color: "#c9a84c",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px",
  },
  navButtonTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: 400,
    color: "#1a1612",
    letterSpacing: "0.05em",
  },
  navButtonArrow: {
    fontSize: "18px",
    color: "#c9a84c",
  },
  resetButton: {
    marginTop: "24px",
    width: "100%",
    maxWidth: "440px",
    padding: "12px 20px",
    background: "transparent",
    border: "1px solid rgba(200,80,80,0.25)",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "rgba(180,80,80,0.7)",
    letterSpacing: "0.2em",
  },
  confirmBox: {
    marginTop: "24px",
    width: "100%",
    maxWidth: "440px",
    padding: "16px 20px",
    border: "1px solid rgba(200,80,80,0.25)",
    background: "rgba(200,80,80,0.04)",
  },
  confirmText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "rgba(180,80,80,0.8)",
    letterSpacing: "0.15em",
    marginBottom: "12px",
    textAlign: "center" as const,
  },
  confirmRow: {
    display: "flex",
    gap: "8px",
  },
  confirmYes: {
    flex: 1,
    padding: "10px",
    background: "rgba(180,80,80,0.12)",
    border: "1px solid rgba(200,80,80,0.35)",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "rgba(180,80,80,0.9)",
    letterSpacing: "0.2em",
  },
  confirmNo: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.2)",
    cursor: "pointer",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "#9e9080",
    letterSpacing: "0.2em",
  },
  footerOrnament: {
    marginTop: "48px",
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
