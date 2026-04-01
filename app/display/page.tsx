export default function DisplayPage() {
  const status = "closed"

  if (status === "closed") {
    return <h1>結果発表！</h1>
  }

  if (status === "result") {
    return <h1>正解は赤！</h1>
  }

  return <div>準備中</div>
}