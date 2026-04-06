"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/app/lib/firebase"
import { useParams } from "next/navigation";

import ClosedScreen from "../components/CloseScreen"
import ResultScreen from "../components/ResultScreen"
import LotteryScreen from "../components/LotteryScreen"
import WinnerScreen from "../components/WinnerScreen"

export default function DisplayPage() {
  const [status, setStatus] = useState("waiting")

  const params = useParams();
  const quizId = params.id as string;

  useEffect(() => {
    if (!quizId) return;

    const unsub = onSnapshot(
      doc(db, "quizzes", quizId, "state", "current"),
      (docSnap) => {
        const data = docSnap.data();
        if (data) {
          setStatus(data.phase);
        }
      }
    );

    return () => unsub();
  }, [quizId]);

  if (!quizId) {
    return <div>読み込み中...</div>;
  }

  if (status === "closed") {
    return <ClosedScreen />;
  }

  if (status === "result") {
    return <ResultScreen quizId={quizId}/>;
  }

  if (status === "lottery") {
    return <LotteryScreen />;
  }

  if (status === "winner") {
    return <WinnerScreen quizId={quizId}/>;
  }

  return <div>準備中...</div>;
}