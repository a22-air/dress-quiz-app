"use client";

import { useEffect } from "react";

type Props = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={style}>
      ⚠️ {message}
    </div>
  );
}

const style: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#2d1a1a",
  border: "1px solid rgba(220,80,80,0.4)",
  color: "#f5a0a0",
  fontFamily: "'Zen Kaku Gothic New', sans-serif",
  fontSize: "13px",
  fontWeight: 300,
  letterSpacing: "0.1em",
  padding: "14px 24px",
  borderRadius: "2px",
  zIndex: 9999,
  whiteSpace: "nowrap",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
};
