"use client"

import { useEffect, useMemo, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/app/lib/firebase"

type Props = {
  quizId: string;
};

const ITEM_HEIGHT = 88;
const TAPE_COUNT = 20; // ランダム名の枚数

type SlotProps = {
  names: string[];
};

function Slot({ names }: SlotProps) {
  const [started, setStarted] = useState(false);

  const pool = names.length > 0 ? names : ["？"];

  const tape = useMemo(() => {
    return Array.from(
      { length: TAPE_COUNT },
      () => pool[Math.floor(Math.random() * pool.length)]
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.join(",")]);

  const totalScroll = (TAPE_COUNT - 1) * ITEM_HEIGHT;

  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true), 80);
    return () => {
      clearTimeout(t1);
    };
  }, []);

  return (
    <div style={slotWindow}>
      {/* 上下のグラデーションマスク */}
      <div style={maskTop} />
      <div style={maskBottom} />
      {/* 中央ハイライトライン */}
      <div style={highlightLine} />

      <div
        style={{
          transform: started ? `translateY(-${totalScroll}px)` : "translateY(0px)",
          transition: started ? `transform 4.5s cubic-bezier(0.05, 0, 0.12, 1)` : "none",
        }}
      >
        {tape.map((name, i) => (
          <div
            key={i}
            style={{
              height: ITEM_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 3.2vw, 48px)",
              fontWeight: 300,
              letterSpacing: "0.12em",
              color: "#ffffff",
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LotteryScreen({ quizId }: Props) {
  const [groomNames, setGroomNames] = useState<string[]>([]);
  const [brideNames, setBrideNames] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);

  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
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

  useEffect(() => {
    if (!quizId) return;

    const unsub = onSnapshot(
      doc(db, "quizzes", quizId, "state", "current"),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();

        if (data.lotteryUsers) {
          setGroomNames(data.lotteryUsers.groom || []);
          setBrideNames(data.lotteryUsers.bride || []);
          setReady(true);
        }
      }
    );

    return () => unsub();
  }, [quizId]);

  // ready になったタイミング（スロット開始）から 3.3s 後にフェードアウト開始
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setFading(true), 3300);
    return () => clearTimeout(t);
  }, [ready]);

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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes winner-glow {
          0%, 100% { text-shadow: 0 0 40px rgba(240,217,138,0.5); }
          50% { text-shadow: 0 0 80px rgba(240,217,138,0.9), 0 0 120px rgba(240,217,138,0.4); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .main-card { animation: fade-up 0.6s ease both, pulse-glow 4s ease-in-out infinite; }
        .label-shimmer { animation: shimmer 2s ease-in-out infinite; }
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
          <span style={styles.ornamentText}>Wedding Dress Quiz</span>
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>

        {/* タイトル */}
        <h1 className="label-shimmer" style={styles.mainTitle}>抽選中</h1>
        <p style={styles.mainTitleEn}><em>Drawing Now</em></p>

        {/* スロット */}
        {ready ? (
          <div style={styles.slotsRow}>
            <div style={styles.slotColumn}>
              <p style={styles.slotLabel}>新郎側 / Groom</p>
              <Slot names={groomNames} />
            </div>
            <div style={styles.slotDivider} />
            <div style={styles.slotColumn}>
              <p style={styles.slotLabel}>新婦側 / Bride</p>
              <Slot names={brideNames} />
            </div>
          </div>
        ) : (
          <div style={styles.waitingText}>
            <p className="label-shimmer" style={styles.waitingLabel}>準備中...</p>
          </div>
        )}

        {/* 下部オーナメント */}
        <div style={{ ...styles.topOrnament, marginTop: "48px", marginBottom: 0 }}>
          <div style={styles.ornamentLineLong} />
          <div style={styles.ornamentDiamond} />
          <div style={styles.ornamentDiamond} />
          <div style={{ ...styles.ornamentLineLong, transform: "scaleX(-1)" }} />
        </div>
      </div>

      {/* フェードアウト用ブラックオーバーレイ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: fading ? 1 : 0,
          transition: fading ? "opacity 0.7s ease" : "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// スロット窓スタイル
const slotWindow: React.CSSProperties = {
  width: "100%",
  height: ITEM_HEIGHT,
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(201,168,76,0.3)",
  background: "rgba(0,0,0,0.3)",
};

const maskTop: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "30%",
  background: "linear-gradient(180deg, rgba(20,15,8,0.9), transparent)",
  zIndex: 1,
  pointerEvents: "none",
};

const maskBottom: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "30%",
  background: "linear-gradient(0deg, rgba(20,15,8,0.9), transparent)",
  zIndex: 1,
  pointerEvents: "none",
};

const highlightLine: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 0,
  right: 0,
  height: "1px",
  background: "rgba(201,168,76,0.25)",
  transform: "translateY(-50%)",
  zIndex: 2,
  pointerEvents: "none",
};

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
    padding: "64px 100px",
    border: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    width: "88%",
    maxWidth: "1000px",
    position: "relative",
  },
  topOrnament: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
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
    fontSize: "clamp(40px, 5vw, 72px)" as unknown as string,
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.2em",
    marginBottom: "8px",
    textAlign: "center",
  },
  mainTitleEn: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(14px, 1.6vw, 24px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(240,217,138,0.4)",
    letterSpacing: "0.25em",
    marginBottom: "40px",
    textAlign: "center",
  },
  slotsRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "0px",
  },
  slotColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  slotLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "clamp(11px, 1.1vw, 16px)" as unknown as string,
    fontWeight: 300,
    color: "rgba(201,168,76,0.6)",
    letterSpacing: "0.25em",
    textAlign: "center",
  },
  slotDivider: {
    width: "1px",
    height: "120px",
    background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)",
    margin: "0 48px",
    flexShrink: 0,
  },
  waitingText: {
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  waitingLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "14px",
    fontWeight: 300,
    color: "rgba(201,168,76,0.4)",
    letterSpacing: "0.3em",
  },
};
