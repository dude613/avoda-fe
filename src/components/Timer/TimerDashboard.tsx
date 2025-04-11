"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  updateTimerNote,
  deleteTimerNote,
} from "../../redux/slice/Timer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card-b"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import TimerDisplay from "./TimerDisplay"
import { initializeSocket, disconnectSocket } from "../../service/socketService"
import toast from "react-hot-toast"
import {
  PlayIcon,
  PauseIcon,
  MonitorStopIcon as StopIcon,
  ClockIcon,
  PlayCircleIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"

export default function TimerDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const activeTimer = useSelector(selectActiveTimer)
  const loading = useSelector(selectTimerLoading)
  const [timerData, setTimerData] = useState({
    task: "",
    project: "",
    client: "",
    note: "",
  })
  const [socketInitialized, setSocketInitialized] = useState(false)

  // Edit note states
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [editedNote, setEditedNote] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // Set edited note when active timer changes
  useEffect(() => {
    if (activeTimer?.note) {
      setEditedNote(activeTimer.note)
    } else {
      setEditedNote("")
    }
  }, [activeTimer])

  // Focus the textarea when editing starts
  useEffect(() => {
    if (isEditingNote && textareaRef.current) {
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isEditingNote])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          note: "",
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

  const handleEditNote = () => {
    if (activeTimer) {
      setIsEditingNote(true)
      setEditedNote(activeTimer.note || "")
    }
  }

  const handleSaveNote = async () => {
    if (!activeTimer) return

    try {
      await dispatch(
        updateTimerNote({
          timerId: activeTimer.id,
          note: editedNote,
        }),
      ).unwrap()

      // Immediately update the active timer in the Redux store
      dispatch(fetchActiveTimer())
      toast.success("Note updated successfully")
      setIsEditingNote(false)
    } catch (error) {
      toast.error("Failed to update note")
      console.error("Error updating note:", error)
    }
  }

  const handleDeleteNote = async () => {
    if (!activeTimer || !activeTimer.note) return

    try {
      await dispatch(deleteTimerNote(activeTimer.id)).unwrap()

      // Immediately update the active timer in the Redux store
      dispatch(fetchActiveTimer())
      toast.success("Note deleted successfully")
      setEditedNote("")
    } catch (error) {
      toast.error("Failed to delete note")
      console.error("Error deleting note:", error)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingNote(false)
    if (activeTimer) {
      setEditedNote(activeTimer.note || "")
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

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Note</h3>
                    {!isEditingNote && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={handleEditNote} className="w-8 h-8 p-0">
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        {activeTimer.note && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDeleteNote}
                            className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditingNote ? (
                    <div className="mt-2">
                      <Textarea
                        ref={textareaRef}
                        value={editedNote}
                        onChange={(e) => setEditedNote(e.target.value)}
                        className="min-h-[80px] focus-visible:ring-2"
                        placeholder="Add a note..."
                        autoFocus
                        onFocus={(e) => {
                          // Set cursor at the end of text
                          const value = e.target.value
                          e.target.value = ""
                          e.target.value = value
                        }}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSaveNote}
                          className="flex items-center gap-1"
                        >
                          <CheckIcon className="w-3 h-3" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1"
                        >
                          <XIcon className="w-3 h-3" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{activeTimer.note || "No note added"}</p>
                  )}
                </div>

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

              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Add a note (optional)"
                  value={timerData.note}
                  onChange={handleInputChange}
                  disabled={loading || (!!activeTimer && !activeTimer.isPaused)}
                  className="min-h-[80px]"
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