"use client"

import { useEffect, useState } from "react"

export default function LotteryScreen() {
  const [visible, setVisible] = useState(true)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const items = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: Math.random() * 10 + 6,
    }))
    setSparkles(items)
  }, [])

  return (
    <div style={styles.page}>
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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .main-card { animation: fade-up 1s ease forwards, pulse-glow 4s ease-in-out infinite; }
        .spin-ring { animation: spin-ring 2s linear infinite; }
        .counter-text { animation: counter-spin 2s linear infinite; }
        .shimmer-text { animation: shimmer 1.5s ease-in-out infinite; }
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
      <div style={{ ...styles.corner, top: 32, left: 32, borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...styles.corner, top: 32, right: 32, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...styles.corner, bottom: 32, left: 32, borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...styles.corner, bottom: 32, right: 32, borderWidth: "0 2px 2px 0" }} />

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
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>

        {/* スピナー */}
        <div style={styles.spinnerWrap}>
          <div className="spin-ring" style={styles.spinRing}>
            <span
              className="counter-text"
              style={styles.spinInnerText}
            >
              ✦
            </span>
          </div>
        </div>

        {/* メインテキスト */}
        <h1 className="shimmer-text" style={styles.mainTitle}>抽選中</h1>
        <p style={styles.mainTitleEn}><em>Drawing Now</em></p>

        {/* ドキドキ点滅 */}
        <div style={styles.blinkWrap}>
          <span
            style={{
              ...styles.blinkText,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
          >
            ✦ &nbsp; ドキドキ &nbsp; ✦
          </span>
        </div>

        {/* 下部オーナメント */}
        <div style={{ ...styles.topOrnament, marginTop: "56px", marginBottom: 0 }}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>

      </div>
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
    padding: "72px 120px",
    border: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    maxWidth: "900px",
    width: "88%",
    position: "relative",
  },
  topOrnament: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "48px",
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
  spinnerWrap: {
    marginBottom: "40px",
    position: "relative",
    width: "100px",
    height: "100px",
  },
  spinRing: {
    width: "100px",
    height: "100px",
    border: "1px solid rgba(201,168,76,0.2)",
    borderTop: "1px solid #c9a84c",
    borderRadius: "50%",
    position: "relative",
  },
  spinInnerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    fontSize: "24px",
    color: "rgba(201,168,76,0.6)",
  },
  mainTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(56px, 8vw, 108px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
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
    marginBottom: "0",
  },
  blinkWrap: {
    marginTop: "40px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  blinkText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "clamp(18px, 2vw, 30px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(201,168,76,0.7)",
    letterSpacing: "0.4em",
  },
}