import ClosedScreen from "./components/CloseScreen"
import ResultScreen from "./components/ResultScreen"
import LotteryScreen from "./components/LotteryScreen"
import WinnerScreen from "./components/WinnerScreen"

export default function DisplayPage() {
  const status = "result" // ← ここ変えると画面切り替わる

  if (status === "closed") {
    return <ClosedScreen />
  }

  if (status === "result") {
    return <ResultScreen />
  }

  if (status === "lottery") {
    return <LotteryScreen />
  }

  if (status === "winner") {
    return <WinnerScreen />
  }

  return <div>準備中...</div>
}