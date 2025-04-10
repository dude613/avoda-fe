"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../redux/Store"
import {
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  selectActiveTimer,
  selectTimerLoading,
} from "../../redux/slice/Timer"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { PlayIcon, PauseIcon, MonitorStopIcon as StopIcon, PlayCircleIcon } from "lucide-react"
import TimerDisplay from "./TimerDisplay"
import toast from "react-hot-toast"

export default function TimerControls() {
  const dispatch = useDispatch<AppDispatch>()
  const activeTimer = useSelector(selectActiveTimer)
  const loading = useSelector(selectTimerLoading)
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [timerData, setTimerData] = useState({
    task: "",
    project: "",
    client: "",
  })

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
        setTimerData({
          task: "",
          project: "",
          client: "",
        })
        setIsStartModalOpen(false)
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
    <div className="flex items-center gap-2">
      {activeTimer ? (
        <>
          <TimerDisplay
            startTime={activeTimer.startTime}
            isPaused={activeTimer.isPaused}
            pausedAt={activeTimer.pausedAt}
            totalPausedTime={activeTimer.totalPausedTime}
            className="!bg-transparent !p-0 !shadow-none !border-0"
            showLabels={false}
            size="sm"
          />

          <TooltipProvider>
            {activeTimer.isPaused ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResumeTimer}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <PlayCircleIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resume Timer</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePauseTimer}
                    disabled={loading}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <PauseIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pause Timer</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStopTimer}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <StopIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop Timer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsStartModalOpen(true)}
                disabled={loading}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <PlayIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start Timer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start New Timer</DialogTitle>
            <DialogDescription>Enter task details to start tracking your time</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStartTimer} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="header-task">Task Name *</Label>
              <Input
                id="header-task"
                name="task"
                placeholder="What are you working on?"
                value={timerData.task}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="header-project">Project</Label>
              <Input
                id="header-project"
                name="project"
                placeholder="Project name (optional)"
                value={timerData.project}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="header-client">Client</Label>
              <Input
                id="header-client"
                name="client"
                placeholder="Client name (optional)"
                value={timerData.client}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsStartModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !timerData.task.trim()}>
                <PlayIcon className="mr-2 h-4 w-4" />
                Start Timer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}