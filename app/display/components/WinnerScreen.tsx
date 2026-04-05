"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import confetti from "canvas-confetti";

export default function WinnerScreen() {
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [show, setShow] = useState(false);
  const [flash, setFlash] = useState(false);
  const [dark, setDark] = useState(true);
  // const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([])

  // useEffect(() => {
  //   const items = Array.from({ length: 24 }, (_, i) => ({
  //     id: i,
  //     x: Math.random() * 100,
  //     y: Math.random() * 100,
  //     delay: Math.random() * 4,
  //     size: Math.random() * 10 + 6,
  //   }))
  //   setSparkles(items)
  // }, [])

  const [sparkles] = useState<
    {
      id: number;
      x: number;
      y: number;
      delay: number;
      size: number;
    }[]
  >(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: Math.random() * 10 + 6,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDark(false);
      setShow(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  if (!show) return;

  setTimeout(() => setFlash(true), 0);
  const flashTimeout = setTimeout(() => setFlash(false), 300);

  const duration = 3000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#c9a84c", "#f0d98a", "#fff"],
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#c9a84c", "#f0d98a", "#fff"],
    });
  }, 100);

  return () => {
    clearTimeout(flashTimeout);
    clearInterval(interval);
  };
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

  return (
    <div
      style={{
        ...styles.page,
        background: dark
          ? "#000000"
          : flash
            ? "#fffbe6"
            : "linear-gradient(160deg, #0e0c09 0%, #1c1710 40%, #0e0c09 100%)",
        transition: "background 0.4s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(201,168,76,0.15), 0 0 80px rgba(201,168,76,0.05); }
          50% { box-shadow: 0 0 60px rgba(201,168,76,0.3), 0 0 120px rgba(201,168,76,0.1); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes winner-pop {
          0% { opacity: 0; transform: scale(0.6); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        .main-card { animation: fade-up 1s ease forwards, pulse-glow 4s ease-in-out infinite; }
        .shimmer-title { animation: shimmer 3s ease-in-out infinite; }
        .winner-name { animation: winner-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      {/* スパークル */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            color: "#c9a84c",
            opacity: 0,
            pointerEvents: "none",
            userSelect: "none",
            animation: `sparkle ${2.5 + s.delay * 0.4}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          ✦
        </span>
      ))}

      {/* 四隅装飾 */}
      <div
        style={{
          ...styles.corner,
          top: 32,
          left: 32,
          borderWidth: "2px 0 0 2px",
        }}
      />
      <div
        style={{
          ...styles.corner,
          top: 32,
          right: 32,
          borderWidth: "2px 2px 0 0",
        }}
      />
      <div
        style={{
          ...styles.corner,
          bottom: 32,
          left: 32,
          borderWidth: "0 0 2px 2px",
        }}
      />
      <div
        style={{
          ...styles.corner,
          bottom: 32,
          right: 32,
          borderWidth: "0 2px 2px 0",
        }}
      />

      {/* 左右縦ライン */}
      <div style={styles.sideLineLeft} />
      <div style={styles.sideLineRight} />

      <div className="main-card" style={styles.card}>
        {/* 上部オーナメント */}
        <div style={styles.topOrnament}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <span style={styles.ornamentText}>Wedding Dress Quiz</span>
          <div style={styles.ornamentDiamond} />
          <div
            style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }}
          />
        </div>

        {/* タイトル */}
        <h1 className="shimmer-title" style={styles.mainTitle}>
          当選者発表
        </h1>
        <p style={styles.mainTitleEn}>
          <em>Winner Announcement</em>
        </p>

        <div style={styles.dividerRow}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerIcon}>✦</span>
          <div style={styles.dividerLine} />
        </div>

        {/* 当選者カード */}
        <div style={styles.winnersWrapper}>
          {/* 新郎側 */}
          <div style={styles.winnerCard}>
            <p style={styles.winnerSideLabel}>新郎側</p>
            <p style={styles.winnerSideLabelEn}>Groom&apos; Guest</p>
            <div style={styles.winnerCardDivider} />
            <p
              className={show ? "winner-name" : ""}
              style={{
                ...styles.winnerName,
                opacity: show ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {groom}
            </p>
          </div>

          {/* 縦区切り */}
          <div style={styles.columnDivider} />

          {/* 新婦側 */}
          <div style={styles.winnerCard}>
            <p style={styles.winnerSideLabel}>新婦側</p>
            <p style={styles.winnerSideLabelEn}>Bride&apos;s Guest</p>
            <div style={styles.winnerCardDivider} />
            <p
              className={show ? "winner-name" : ""}
              style={{
                ...styles.winnerName,
                opacity: show ? 1 : 0,
                transition: "opacity 0.3s ease",
                animationDelay: "0.15s",
              }}
            >
              {bride}
            </p>
          </div>
        </div>

        {/* おめでとうメッセージ */}
        <p
          style={{
            ...styles.congratsText,
            opacity: show ? 1 : 0,
            transition: "opacity 1s ease 0.6s",
          }}
        >
          おめでとうございます — Congratulations
        </p>

        {/* 下部オーナメント */}
        <div
          style={{ ...styles.topOrnament, marginTop: "48px", marginBottom: 0 }}
        >
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <div style={styles.ornamentDiamond} />
          <div
            style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }}
          />
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flexDirection: "column",
  },
  corner: {
    position: "absolute",
    width: "48px",
    height: "48px",
    borderColor: "rgba(201,168,76,0.5)",
    borderStyle: "solid",
  },
  sideLineLeft: {
    position: "absolute",
    left: "80px",
    top: "10%",
    bottom: "10%",
    width: "1px",
    background:
      "linear-gradient(180deg, transparent, rgba(201,168,76,0.25), transparent)",
  },
  sideLineRight: {
    position: "absolute",
    right: "80px",
    top: "10%",
    bottom: "10%",
    width: "1px",
    background:
      "linear-gradient(180deg, transparent, rgba(201,168,76,0.25), transparent)",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 100px",
    border: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    width: "88%",
    maxWidth: "1100px",
    position: "relative",
  },
  topOrnament: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "40px",
    width: "100%",
    justifyContent: "center",
  },
  ornamentLineLong: {
    width: "120px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #c9a84c)",
    display: "block",
    flexShrink: 0,
  },
  ornamentDiamond: {
    width: "8px",
    height: "8px",
    background: "#c9a84c",
    transform: "rotate(45deg)",
    flexShrink: 0,
  },
  ornamentText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    fontWeight: 300,
    color: "rgba(201,168,76,0.7)",
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  eyebrow: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  mainTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(52px, 7vw, 96px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.18em",
    textAlign: "center",
    marginBottom: "12px",
  },
  mainTitleEn: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(18px, 2vw, 28px)" as unknown as string,
    fontWeight: 300,
    fontStyle: "italic",
    color: "rgba(240,217,138,0.4)",
    letterSpacing: "0.25em",
    textAlign: "center",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    margin: "36px 0",
    width: "40%",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
  },
  dividerIcon: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    color: "#c9a84c",
  },
  winnersWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: "0",
  },
  winnerCard: {
    flex: 1,
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 40px",
  },
  winnerSideLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(20px, 2.2vw, 32px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
    marginBottom: "4px",
  },
  winnerSideLabelEn: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(11px, 1vw, 15px)" as unknown as string,
    fontStyle: "italic",
    color: "rgba(240,217,138,0.35)",
    letterSpacing: "0.2em",
    marginBottom: "20px",
  },
  winnerCardDivider: {
    width: "40px",
    height: "1px",
    background: "rgba(201,168,76,0.3)",
    marginBottom: "24px",
  },
  winnerName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(36px, 5vw, 72px)" as unknown as string,
    fontWeight: 300,
    color: "#ffffff",
    letterSpacing: "0.12em",
    textAlign: "center",
  },
  columnDivider: {
    width: "1px",
    height: "160px",
    background:
      "linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)",
    flexShrink: 0,
    margin: "0 32px",
  },
  congratsText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "clamp(13px, 1.4vw, 20px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(201,168,76,0.6)",
    letterSpacing: "0.35em",
    marginTop: "32px",
  },
};
