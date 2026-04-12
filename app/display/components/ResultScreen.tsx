"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import confetti from "canvas-confetti";

type Vote = {
  name: string;
  group: string;
  answer: string;
};

type Props = {
  quizId: string;
};

export default function ResultScreen({ quizId }: Props) {
  const groomRef = useRef<HTMLDivElement | null>(null);
  const brideRef = useRef<HTMLDivElement | null>(null);

  const [groomWinners, setGroomWinners] = useState<string[]>([]);
  const [brideWinners, setBrideWinners] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // 0: 待機 / 1: 正解テキスト表示 / 2: 人数表示 / 3: 名前リスト表示
  const [phase, setPhase] = useState(0);

  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSparkles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
        size: Math.random() * 8 + 5,
      }))
    );
  }, []);

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      const ref = doc(db, "quizzes", quizId, "state", "current");
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const correct = snap.data().correctAnswer;
      setCorrectAnswer(correct);

      const snapshot = await getDocs(
        collection(db, "quizzes", quizId, "votes")
      );

      const groom: string[] = [];
      const bride: string[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Vote;
        if (data.answer === correct) {
          if (data.group === "groom") groom.push(data.name);
          else if (data.group === "bride") bride.push(data.name);
        }
      });

      setGroomWinners(groom);
      setBrideWinners(bride);
      setTotal(groom.length + bride.length);
      setLoading(false);
    };

    fetchData();
  }, [quizId]);

  // フェーズ制御
  useEffect(() => {
    if (loading) return;

    const t1 = setTimeout(() => setPhase(1), 400);   // 正解テキスト
    const t2 = setTimeout(() => setPhase(2), 2200);  // 人数
    const t3 = setTimeout(() => setPhase(3), 3200);  // 名前リスト

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loading]);

  // 正解テキスト表示と同時に紙吹雪
  useEffect(() => {
    if (phase !== 1) return;

    const timer = setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.55 },
        colors: ["#c9a84c", "#f0d98a", "#fff8e1", "#ffffff"],
      });
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.55 },
        colors: ["#c9a84c", "#f0d98a", "#fff8e1", "#ffffff"],
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [phase]);

  // 名前リストのオートスクロール
  useEffect(() => {
    if (phase < 3) return;

    const interval = setInterval(() => {
      [groomRef, brideRef].forEach((ref) => {
        if (ref.current) {
          const el = ref.current;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            el.scrollTop = 0;
          } else {
            el.scrollTop += 1;
          }
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [phase]);

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Zen+Kaku+Gothic+New:wght@300;400&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { width: 100%; height: 100%; overflow: hidden; }
          @keyframes shimmer-text {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          .loading-text { animation: shimmer-text 2s ease-in-out infinite; }
        `}</style>
        <div style={styles.ornament}>
          <div style={styles.ornamentLine} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLine, transform: "scaleX(-1)" }} />
        </div>
        <p className="loading-text" style={styles.loadingText}>集計中</p>
        <p style={styles.loadingSubText}>Calculating...</p>
      </div>
    );
  }

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
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reveal-answer {
          0%   { opacity: 0; transform: scale(0.4); filter: blur(20px); }
          65%  { transform: scale(1.06); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer-gold {
          0%, 100% { opacity: 0.85; text-shadow: 0 0 40px rgba(240,217,138,0.2); }
          50%       { opacity: 1;    text-shadow: 0 0 80px rgba(240,217,138,0.5); }
        }
        @keyframes count-appear {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes name-appear {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes eyebrow-fade {
          from { opacity: 0; letter-spacing: 0.6em; }
          to   { opacity: 1; letter-spacing: 0.4em; }
        }

        .main-card { animation: pulse-glow 4s ease-in-out infinite; }
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

      <div style={styles.sideLineLeft} />
      <div style={styles.sideLineRight} />

      <div className="main-card" style={styles.card}>
        {/* 上部オーナメント */}
        <div style={styles.topOrnament}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <span style={styles.ornamentText}>Result Announcement</span>
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>

        {/* 正解発表エリア */}
        <div style={styles.answerBlock}>

          {/* ラベル */}
          <p style={{
            ...styles.answerEyebrow,
            animation: phase >= 1 ? "eyebrow-fade 0.8s ease both" : "none",
            opacity: phase >= 1 ? 1 : 0,
          }}>
            正解のドレス
          </p>

          {/* 正解テキスト */}
          <p style={{
            ...styles.correctColor,
            animation: phase >= 1 ? "reveal-answer 1s cubic-bezier(0.22,1,0.36,1) both, shimmer-gold 3s ease-in-out 1s infinite" : "none",
            opacity: phase >= 1 ? 1 : 0,
          }}>
            {correctAnswer}
          </p>

          {/* ディバイダー + 人数 */}
          <div style={{
            ...styles.dividerRow,
            opacity: phase >= 2 ? 1 : 0,
            animation: phase >= 2 ? "count-appear 0.6s ease both" : "none",
          }}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerIcon}>✦</span>
            <div style={styles.dividerLine} />
          </div>
          <p style={{
            ...styles.totalText,
            opacity: phase >= 2 ? 1 : 0,
            animation: phase >= 2 ? "count-appear 0.6s ease 0.15s both" : "none",
          }}>
            正解者 <span style={styles.totalNumber}>{total}</span> 名
          </p>
        </div>

        {/* 名前リスト */}
        <div style={{
          ...styles.winnersWrapper,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          {/* 新郎側 */}
          <div style={styles.winnerColumn}>
            <div style={styles.columnHeader}>
              <div style={styles.columnHeaderLine} />
              <p style={styles.columnTitle}>新郎側</p>
              <p style={styles.columnTitleEn}>Groom&apos;s Guests</p>
              <div style={styles.columnHeaderLine} />
            </div>
            <div
              ref={groomRef}
              style={{
                ...styles.scrollBox,
                display: groomWinners.length > 7 ? "grid" : "block",
                gridTemplateColumns: groomWinners.length > 7 ? "1fr 1fr" : undefined,
              }}
            >
              {groomWinners.map((name, i) => (
                <p
                  key={i}
                  style={{
                    ...styles.nameRow,
                    fontSize: groomWinners.length > 7
                      ? "clamp(14px, 1.6vw, 24px)"
                      : (styles.nameRow as React.CSSProperties).fontSize,
                    animation: phase >= 3
                      ? `name-appear 0.5s ease ${i * 0.08}s both`
                      : "none",
                  }}
                >
                  <span style={styles.nameDot}>◆</span>
                  {name}
                </p>
              ))}
            </div>
          </div>

          <div style={styles.columnDivider} />

          {/* 新婦側 */}
          <div style={styles.winnerColumn}>
            <div style={styles.columnHeader}>
              <div style={styles.columnHeaderLine} />
              <p style={styles.columnTitle}>新婦側</p>
              <p style={styles.columnTitleEn}>Bride&apos;s Guests</p>
              <div style={styles.columnHeaderLine} />
            </div>
            <div
              ref={brideRef}
              style={{
                ...styles.scrollBox,
                display: brideWinners.length > 7 ? "grid" : "block",
                gridTemplateColumns: brideWinners.length > 7 ? "1fr 1fr" : undefined,
              }}
            >
              {brideWinners.map((name, i) => (
                <p
                  key={i}
                  style={{
                    ...styles.nameRow,
                    fontSize: brideWinners.length > 7
                      ? "clamp(14px, 1.6vw, 24px)"
                      : (styles.nameRow as React.CSSProperties).fontSize,
                    animation: phase >= 3
                      ? `name-appear 0.5s ease ${i * 0.08}s both`
                      : "none",
                  }}
                >
                  <span style={styles.nameDot}>◆</span>
                  {name}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 下部オーナメント */}
        <div style={{ ...styles.topOrnament, marginTop: "40px", marginBottom: 0 }}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>
      </div>
    </div>
  );
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
    padding: "56px 100px",
    border: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    width: "88%",
    maxWidth: "1200px",
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
  ornamentLine: {
    width: "80px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #c9a84c)",
    display: "block",
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
  answerBlock: {
    textAlign: "center",
    marginBottom: "32px",
  },
  answerEyebrow: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "clamp(14px, 1.4vw, 22px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(201,168,76,0.6)",
    letterSpacing: "0.4em",
    marginBottom: "12px",
  },
  correctColor: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(56px, 8vw, 112px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.12em",
    lineHeight: 1.1,
    marginBottom: "24px",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    margin: "0 auto 20px",
    width: "40%",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
  },
  dividerIcon: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    color: "#c9a84c",
  },
  totalText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "clamp(14px, 1.4vw, 22px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.3em",
  },
  totalNumber: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(22px, 2.5vw, 38px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.1em",
  },
  winnersWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0px",
    width: "100%",
    justifyContent: "center",
  },
  winnerColumn: {
    flex: 1,
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  columnHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
    width: "100%",
    gap: "6px",
  },
  columnHeaderLine: {
    width: "60px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
  },
  columnTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(22px, 2.5vw, 36px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
  },
  columnTitleEn: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(11px, 1vw, 15px)" as unknown as string,
    fontStyle: "italic",
    color: "rgba(240,217,138,0.35)",
    letterSpacing: "0.2em",
  },
  columnDivider: {
    width: "1px",
    alignSelf: "stretch",
    background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)",
    margin: "0 48px",
    flexShrink: 0,
  },
  scrollBox: {
    width: "100%",
    maxHeight: "36vh",
    overflow: "hidden",
  },
  nameRow: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(20px, 2.2vw, 34px)" as unknown as string,
    fontWeight: 300,
    color: "#ffffff",
    letterSpacing: "0.1em",
    padding: "10px 0",
    borderBottom: "1px solid rgba(201,168,76,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "center",
  },
  nameDot: {
    fontSize: "8px",
    color: "#c9a84c",
    flexShrink: 0,
  },
  loadingText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(40px, 5vw, 72px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
    marginBottom: "12px",
  },
  loadingSubText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "clamp(12px, 1.2vw, 18px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(240,217,138,0.4)",
    letterSpacing: "0.3em",
  },
};
