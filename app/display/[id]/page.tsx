"use client"

import { useEffect, useRef, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/app/lib/firebase"
import { useParams } from "next/navigation";

import ClosedScreen from "../components/CloseScreen"
import ResultScreen from "../components/ResultScreen"
import LotteryScreen from "../components/LotteryScreen"
import WinnerScreen from "../components/WinnerScreen"

export default function DisplayPage() {
  const [status, setStatus] = useState("closed")
  const [isOffline, setIsOffline] = useState(false)
  const isFirstLoad = useRef(true)

  const params = useParams();
  const quizId = params.id as string;

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  useEffect(() => {
    if (!quizId) return;

    const unsub = onSnapshot(
      doc(db, "quizzes", quizId, "state", "current"),
      (docSnap) => {
        setIsOffline(false)
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
          return;
        }
        const data = docSnap.data();
        if (data) {
          setStatus(data.phase);
        }
      },
      () => {
        setIsOffline(true)
      }
    );

    return () => unsub();
  }, [quizId]);

  if (!quizId) {
    return <div>読み込み中...</div>;
  }

  const screen = () => {
    if (status === "closed") return <ClosedScreen />;
    if (status === "result") return <ResultScreen quizId={quizId} />;
    if (status === "lottery") return <LotteryScreen />;
    if (status === "winner") return <WinnerScreen quizId={quizId} />;
    return <div>準備中...</div>;
  };

  return (
    <>
      {isOffline && (
        <div style={offlineBannerStyle}>
          通信が切れました — 再接続を待っています...
        </div>
      )}
      {screen()}
    </>
  );
}

const offlineBannerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  background: "rgba(45, 20, 20, 0.92)",
  borderBottom: "1px solid rgba(220,80,80,0.4)",
  color: "#f5a0a0",
  fontFamily: "'Zen Kaku Gothic New', sans-serif",
  fontSize: "14px",
  fontWeight: 300,
  letterSpacing: "0.1em",
  padding: "12px 24px",
  textAlign: "center",
  zIndex: 9999,
};