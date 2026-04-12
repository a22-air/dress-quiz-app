"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupIndexPage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!date || !groomName.trim() || !brideName.trim()) {
      setError("すべて入力してください");
      return;
    }

    const formattedDate = date.replace(/-/g, "");
    const id = `${formattedDate}-${groomName.trim().toLowerCase()}-${brideName.trim().toLowerCase()}`;
    router.push(`/admin/setup/${id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.ornament}>
        <div style={styles.ornamentLine} />
        <div style={styles.ornamentDiamond} />
        <div style={{ ...styles.ornamentLine, ...styles.ornamentLineRight }} />
      </div>

      <h1 style={styles.mainTitle}>新規クイズ作成</h1>
      <p style={styles.subtitle}>管理者専用ページ</p>

      <div style={styles.card}>
        <p style={styles.sectionLabel}>Quiz ID 生成</p>

        <p style={styles.fieldLabel}>挙式日</p>
        <input
          type="date"
          style={styles.input}
          value={date}
          onChange={(e) => { setDate(e.target.value); setError(""); }}
        />

        <p style={{ ...styles.fieldLabel, marginTop: "24px" }}>新郎の苗字（ローマ字）</p>
        <input
          style={styles.input}
          placeholder="例: yamada"
          value={groomName}
          onChange={(e) => { setGroomName(e.target.value); setError(""); }}
        />

        <p style={{ ...styles.fieldLabel, marginTop: "24px" }}>新婦の苗字（ローマ字）</p>
        <input
          style={styles.input}
          placeholder="例: tanaka"
          value={brideName}
          onChange={(e) => { setBrideName(e.target.value); setError(""); }}
        />

        {date && groomName && brideName && (
          <div style={styles.previewBox}>
            <p style={styles.previewLabel}>生成されるID</p>
            <p style={styles.previewId}>
              {date.replace(/-/g, "")}-{groomName.trim().toLowerCase()}-{brideName.trim().toLowerCase()}
            </p>
          </div>
        )}

        {error && <p style={styles.errorText}>{error}</p>}

        <button style={styles.createButton} onClick={handleCreate}>
          セットアップへ進む →
        </button>
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
    maxWidth: "480px",
    boxShadow: "0 4px 24px rgba(139,105,20,0.05)",
  },
  sectionLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "#c9a84c",
    textTransform: "uppercase" as const,
    marginBottom: "24px",
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
  previewBox: {
    marginTop: "28px",
    padding: "16px 20px",
    background: "linear-gradient(135deg, #1a1612, #2d2318)",
    border: "1px solid rgba(201,168,76,0.2)",
  },
  previewLabel: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "9px",
    fontWeight: 300,
    color: "rgba(201,168,76,0.5)",
    letterSpacing: "0.3em",
    marginBottom: "6px",
  },
  previewId: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px",
    fontWeight: 300,
    color: "#f0d98a",
    letterSpacing: "0.08em",
    wordBreak: "break-all" as const,
  },
  errorText: {
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    fontSize: "11px",
    fontWeight: 300,
    color: "#b05050",
    letterSpacing: "0.15em",
    marginTop: "16px",
  },
  createButton: {
    width: "100%",
    marginTop: "32px",
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
};
