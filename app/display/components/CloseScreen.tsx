"use client"

import { useState, useEffect } from "react"

export default function ClosedScreen() {
  const [sparkles, setSparkles] = useState<
    {
      id: number;
      x: number;
      y: number;
      delay: number;
      size: number;
    }[]
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSparkles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
        size: Math.random() * 10 + 6,
      }))
    );
  }, []);
  return (
    <div style={styles.page}>

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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes shimmer-text {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes line-expand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(201,168,76,0.15), 0 0 80px rgba(201,168,76,0.05); }
          50% { box-shadow: 0 0 60px rgba(201,168,76,0.3), 0 0 120px rgba(201,168,76,0.1); }
        }
        .main-card { animation: fade-up 1.2s ease forwards, pulse-glow 4s ease-in-out infinite; }
        .center-title { animation: shimmer-text 3s ease-in-out infinite; }
        .float-wrap { animation: float-slow 6s ease-in-out infinite; }
      `}</style>

      <div style={styles.sideLineLeft} />
      <div style={styles.sideLineRight} />

      <div className="main-card" style={styles.card}>

        <div style={styles.topOrnament}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <span style={styles.ornamentText}>Wedding Dress Quiz</span>
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>

        <div className="float-wrap">
          <h1 className="center-title" style={styles.mainTitle}>
            ドレス色あてクイズ
          </h1>
          <p style={styles.mainTitleEn}>
            <em>Dress Color Quiz</em>
          </p>
        </div>

        <div style={styles.dividerRow}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerIcon}>✦</span>
          <div style={styles.dividerLine} />
        </div>

        <p style={styles.subText}>結果発表</p>
        <p style={styles.subTextEn}>Result Announcement</p>

        <div style={{ ...styles.topOrnament, marginTop: "64px", marginBottom: 0 }}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>

      </div>

      <div style={{ ...styles.corner, top: 32, left: 32, borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...styles.corner, top: 32, right: 32, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...styles.corner, bottom: 32, left: 32, borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...styles.corner, bottom: 32, right: 32, borderWidth: "0 2px 2px 0" }} />

    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(160deg, #0e0c09 0%, #1c1710 40%, #0e0c09 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  sideLineLeft: {
    position: "absolute",
    left: "80px",
    top: "10%",
    bottom: "10%",
    width: "1px",
    background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.25), transparent)",
  },
  sideLineRight: {
    position: "absolute",
    right: "80px",
    top: "10%",
    bottom: "10%",
    width: "1px",
    background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.25), transparent)",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 120px",
    border: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    maxWidth: "900px",
    width: "90%",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: "48px",
    height: "48px",
    borderColor: "rgba(201,168,76,0.5)",
    borderStyle: "solid",
  },
  topOrnament: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "56px",
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
  mainTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(64px, 8vw, 108px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.15em",
    textAlign: "center",
    lineHeight: 1.1,
    marginBottom: "16px",
  },
  mainTitleEn: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(22px, 2.5vw, 34px)" as unknown as string,
    fontWeight: 300,
    fontStyle: "italic",
    color: "rgba(240,217,138,0.45)",
    letterSpacing: "0.25em",
    textAlign: "center",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    margin: "52px 0",
    width: "60%",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
  },
  dividerIcon: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "20px",
    color: "#c9a84c",
  },
  subText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(36px, 5vw, 72px)" as unknown as string,
    fontWeight: 300,
    color: "#ffffff",
    letterSpacing: "0.3em",
    textAlign: "center",
    marginBottom: "12px",
  },
  subTextEn: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(16px, 1.8vw, 26px)" as unknown as string,
    fontWeight: 300,
    fontStyle: "italic",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "0.3em",
    textAlign: "center",
  },
}