"use client";

import { useRouter, useParams } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const updatePhase = async (phase: string) => {
    if (!quizId) return;

    try {
      await updateDoc(doc(db, "quizzes", quizId, "state", "current"), {
        phase: phase,
      });
      console.log("更新成功:", phase);
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin-auth");

    if (isAuthed === "true") return;

    const password = prompt("パスワードを入力してください");

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-auth", "true");
    } else {
      alert("パスワードが違います");
      router.push("/");
    }
  }, [router]);

  if (!quizId) {
    return <div>読み込み中...</div>;
  }

  return (
    <>
      <div style={styles.container}>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div
            style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }}
          />
        </div>

        <h1 style={styles.mainTitle}>ドレス色あてクイズ</h1>
        <p style={styles.subtitle}>新郎新婦専用ページ</p>

        <div style={styles.card}>
          <div style={styles.cardInner}>
            <p style={styles.cardTitle}>Menu</p>

            <button
              style={styles.navButton}
              onClick={async () => {
                if (!quizId) return;

                await updatePhase("result");
                router.push(`/admin/result/${quizId}`);
              }}
              onMouseEnter={(e) =>
                Object.assign(
                  (e.target as HTMLElement).style,
                  styles.navButtonHover
                )
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
              onClick={async () => {
                if (!quizId) return;

                await updatePhase("lottery");
                router.push(`/admin/lottery/${quizId}`);
              }}
              onMouseEnter={(e) =>
                Object.assign(
                  (e.target as HTMLElement).style,
                  styles.navButtonHover
                )
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

        <div style={styles.footerOrnament}>
          <div style={styles.footerLine} />
          <span style={styles.footerText}>✦</span>
          <div style={{ ...styles.footerLine, ...styles.footerLineRight }} />
        </div>
      </div>
    </>
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
    boxShadow:
      "0 4px 24px rgba(139,105,20,0.06), 0 1px 4px rgba(139,105,20,0.04)",
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
