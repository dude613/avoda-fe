import { useState, useEffect } from "react"
import { Card } from "../ui/card-b"

export default function TimerDisplay({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) return

    const start = new Date(startTime).getTime()

    const updateElapsed = () => {
      const now = Date.now()
      const elapsedSeconds = Math.floor((now - start) / 1000)
      setElapsed(elapsedSeconds)
    }

    // Update immediately
    updateElapsed()

    // Then update every second
    const intervalId = setInterval(updateElapsed, 1000)

    return () => clearInterval(intervalId)
  }, [startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours, minutes, secs].map((val) => val.toString().padStart(2, "0")).join(":")
  }

  return (
    <Card className="flex items-center justify-center p-4 bg-primary/5">
      <div className="text-center">
        <div className="text-3xl font-mono font-bold tracking-widest">{formatTime(elapsed)}</div>
      </div>
    </Card>
  )
}
