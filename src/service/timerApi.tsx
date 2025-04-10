/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { TIMER_START, TIMER_STOP, TIMER_ACTIVE, TIMER_HISTORY, TIMER_PAUSE, TIMER_RESUME } from "../Config"

// Types
export interface Timer {
  id: string
  task: string
  project?: string
  client?: string
  startTime: string
  endTime?: string
  isActive: boolean
  isPaused?: boolean
  pausedAt?: string
  totalPausedTime?: number
  duration: number
}

export interface TimerFormData {
  task: string
  project?: string
  client?: string
}

export interface TimerHistoryResponse {
  success: boolean
  timers: Timer[]
  totalPages: number
  currentPage: number
  error?: string
}

export interface TimerResponse {
  success: boolean
  message?: string
  timer?: Timer
  error?: string
}

export interface ActiveTimerResponse {
  success: boolean
  hasActiveTimer: boolean
  timer: Timer | null
  error?: string
}

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
})

export async function startTimerAPI(timerData: TimerFormData): Promise<TimerResponse> {
  try {
    const response = await axios.post(TIMER_START, timerData, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error starting timer:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to start timer",
    }
  }
}

export async function stopTimerAPI(timerId: string): Promise<TimerResponse> {
  try {
    const response = await axios.put(
      `${TIMER_STOP}/${timerId}`,
      {},
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error("Error stopping timer:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to stop timer",
    }
  }
}

export async function pauseTimerAPI(timerId: string): Promise<TimerResponse> {
  try {
    const response = await axios.put(
      `${TIMER_PAUSE}/${timerId}`,
      {},
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error("Error pausing timer:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to pause timer",
    }
  }
}

export async function resumeTimerAPI(timerId: string): Promise<TimerResponse> {
  try {
    const response = await axios.put(
      `${TIMER_RESUME}/${timerId}`,
      {},
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error("Error resuming timer:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to resume timer",
    }
  }
}

export async function getActiveTimerAPI(): Promise<ActiveTimerResponse> {
  try {
    const response = await axios.get(TIMER_ACTIVE, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching active timer:", error)
    return {
      success: false,
      hasActiveTimer: false,
      timer: null,
      error: error.response?.data?.message || "Failed to fetch active timer",
    }
  }
}

export async function getTimerHistoryAPI(page = 1, limit = 10): Promise<TimerHistoryResponse> {
  try {
    const response = await axios.get(`${TIMER_HISTORY}?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching timer history:", error)
    return {
      success: false,
      timers: [],
      totalPages: 0,
      currentPage: page,
      error: error.response?.data?.message || "Failed to fetch timer history",
    }
  }
}
