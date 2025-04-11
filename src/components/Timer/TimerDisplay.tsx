"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/card-b"

interface TimerDisplayProps {
  startTime: string
  isPaused?: boolean
  pausedAt?: string
  totalPausedTime?: number
  className?: string
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
}

export default function TimerDisplay({
  startTime,
  isPaused = false,
  pausedAt,
  totalPausedTime = 0,
  className = "",
  showLabels = true,
  size = "md",
}: TimerDisplayProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) return

    const start = new Date(startTime).getTime()
    const pausedTime = pausedAt ? new Date(pausedAt).getTime() : null

    const updateElapsed = () => {
      const now = Date.now()
      let elapsedMs = now - start - (totalPausedTime || 0) * 1000

      // If timer is paused, calculate elapsed time up to the pause point
      if (isPaused && pausedTime) {
        elapsedMs = pausedTime - start - (totalPausedTime || 0) * 1000
      }

      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      setElapsed(elapsedSeconds)
    }

    // Update immediately
    updateElapsed()

    // Only set interval if not paused
    let intervalId: number | undefined
    if (!isPaused) {
      intervalId = window.setInterval(updateElapsed, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [startTime, isPaused, pausedAt, totalPausedTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours, minutes, secs].map((val) => val.toString().padStart(2, "0")).join(":")
  }

  const sizeClasses = {
    sm: "text-lg p-2",
    md: "text-3xl p-4",
    lg: "text-4xl p-6",
  }

  return (
    <Card className={`flex items-center justify-center ${isPaused ? "bg-amber-50" : "bg-primary/5"} ${className}`}>
      <div className="text-center">
        <div className={`font-mono font-bold tracking-widest ${sizeClasses[size]}`}>{formatTime(elapsed)}</div>
        {showLabels && <div className="mt-1 text-xs text-muted-foreground">HH:MM:SS</div>}
      </div>
    </Card>
  )
}
