"use client"

import TimerDashboard from "@/components/Timer/TimerDashboard"
import TimerHistory from "@/components/Timer/TimerHistory"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"

export default function TimerPage() {
  useEffect(() => {
    document.title = "Time Tracker"
  }, [])

  return (
    <div className="p-8">
      <Toaster />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Time Tracker</h1>
        <p className="text-primary text-sm leading-5 font-semibold">Track your time efficiently and stay productive</p>
      </div>

      <div className="space-y-8">
        <TimerDashboard />
        <TimerHistory />
      </div>
    </div>
  )
}

