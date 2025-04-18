"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../redux/Store"
import {
  fetchActiveTimer,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  selectActiveTimer,
  selectTimerLoading,
} from "../../redux/slice/Timer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card-b"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import TimerDisplay from "./TimerDisplay"
import { initializeSocket, disconnectSocket } from "../../service/socketService"
import toast from "react-hot-toast"
import { PlayIcon, PauseIcon, MonitorStopIcon as StopIcon, ClockIcon, PlayCircleIcon } from "lucide-react"

export default function TimerDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const activeTimer = useSelector(selectActiveTimer)
  const loading = useSelector(selectTimerLoading)
  const [timerData, setTimerData] = useState({
    task: "",
    project: "",
    client: "",
  })
  const [socketInitialized, setSocketInitialized] = useState(false)

  // Initialize socket connection and fetch active timer on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (token && !socketInitialized) {
      try {
        console.log("Initializing socket with token:", token.substring(0, 10) + "...")
        initializeSocket(token, dispatch)
        setSocketInitialized(true)
        console.log("Socket initialization attempted")
      } catch (error) {
        console.error("Error initializing socket:", error)
        toast.error("Failed to connect to server")
      }

      dispatch(fetchActiveTimer())
    }

    return () => {
      if (socketInitialized) {
        disconnectSocket()
        setSocketInitialized(false)
      }
    }
  }, [dispatch, socketInitialized])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTimerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStartTimer = async (e: React.FormEvent) => {
    e.preventDefault()

  if (!timerData.task.trim()) {
    toast.error("Task name is required")
    return
  }

  try {
    const resultAction = await dispatch(startTimer(timerData))
    if (startTimer.fulfilled.match(resultAction)) {
      // Clear form after successful timer start
      setTimerData({
        task: "",
        project: "",
        client: "",
      })
    }
  } catch (error) {
    console.error("Failed to start timer:", error)
  }
}

  const handleStopTimer = async () => {
    if (activeTimer) {
      try {
        await dispatch(stopTimer(activeTimer.id))
      } catch (error) {
        console.error("Failed to stop timer:", error)
      }
    }
  }

  const handlePauseTimer = async () => {
    if (activeTimer && !activeTimer.isPaused) {
      try {
        await dispatch(pauseTimer(activeTimer.id))
      } catch (error) {
        console.error("Failed to pause timer:", error)
      }
    }
  }

  const handleResumeTimer = async () => {
    if (activeTimer && activeTimer.isPaused) {
      try {
        await dispatch(resumeTimer(activeTimer.id))
      } catch (error) {
        console.error("Failed to resume timer:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Active Timer Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Current Timer
            </CardTitle>
            <CardDescription>Your active time tracking session</CardDescription>
          </CardHeader>
          <CardContent>
            {activeTimer ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Task</h3>
                  <p className="text-lg">{activeTimer.task}</p>
                </div>

                {activeTimer.project && (
                  <div>
                    <h3 className="font-medium">Project</h3>
                    <p>{activeTimer.project}</p>
                  </div>
                )}

                {activeTimer.client && (
                  <div>
                    <h3 className="font-medium">Client</h3>
                    <p>{activeTimer.client}</p>
                  </div>
                )}

                <hr className="my-4" />

                <TimerDisplay
                  startTime={activeTimer.startTime}
                  isPaused={activeTimer.isPaused}
                  pausedAt={activeTimer.pausedAt}
                  totalPausedTime={activeTimer.totalPausedTime}
                />

                {activeTimer.isPaused && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Timer Paused
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <ClockIcon className="w-12 h-12 mb-2" />
                <p>No active timer</p>
                <p className="text-sm">Start a new timer to begin tracking time</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {activeTimer ? (
              <>
                {activeTimer.isPaused ? (
                  <Button variant="outline" className="flex-1" onClick={handleResumeTimer} disabled={loading}>
                    <PlayCircleIcon className="w-4 h-4 mr-2" />
                    Resume Timer
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1" onClick={handlePauseTimer} disabled={loading}>
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Pause Timer
                  </Button>
                )}
                <Button variant="destructive" className="flex-1" onClick={handleStopTimer} disabled={loading}>
                  <StopIcon className="w-4 h-4 mr-2" />
                  Stop Timer
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full" disabled={true}>
                No Active Timer
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Start Timer Form */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Start New Timer</CardTitle>
            <CardDescription>Track time for your tasks, projects, and clients</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartTimer} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  name="client"
                  placeholder="Client name"
                  value={timerData.client}
                  onChange={handleInputChange}
                  disabled={loading || !!activeTimer}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  name="project"
                  placeholder="Project name"
                  value={timerData.project}
                  onChange={handleInputChange}
                  disabled={loading || !!activeTimer}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task">Task Name *</Label>
                <Input
                  id="task"
                  name="task"
                  placeholder="What are you working on?"
                  value={timerData.task}
                  onChange={handleInputChange}
                  disabled={loading || (!!activeTimer && !activeTimer.isPaused)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  name="project"
                  placeholder="Project name (optional)"
                  value={timerData.project}
                  onChange={handleInputChange}
                  disabled={loading || (!!activeTimer && !activeTimer.isPaused)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  name="client"
                  placeholder="Client name (optional)"
                  value={timerData.client}
                  onChange={handleInputChange}
                  disabled={loading || (!!activeTimer && !activeTimer.isPaused)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || (!!activeTimer && !activeTimer.isPaused)}>
                <PlayIcon className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
