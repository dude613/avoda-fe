/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import {
  TIMER_START,
  TIMER_STOP,
  TIMER_ACTIVE,
  TIMER_HISTORY,
  TIMER_PAUSE,
  TIMER_RESUME,
  TIMER_UPDATE_NOTE,
  TIMER_DELETE_NOTE,
  TIMER_EDIT,
  TIMER_DELETE,
} from "../Config"

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
  note?: string
}

export interface TimerFormData {
  task: string
  project?: string
  client?: string
  note?: string
}

export interface TimerEditData {
  task: string
  project?: string
  client?: string
  note?: string
  startTime?: string
  endTime?: string
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

export async function updateTimerNoteAPI(timerId: string, note: string): Promise<TimerResponse> {
  try {
    const response = await axios.put(
      `${TIMER_UPDATE_NOTE}/${timerId}`,
      { note },
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error("Error updating timer note:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update timer note",
    }
  }
}

export async function deleteTimerNoteAPI(timerId: string): Promise<TimerResponse> {
  try {
    const response = await axios.delete(`${TIMER_DELETE_NOTE}/${timerId}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error deleting timer note:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete timer note",
    }
  }
}

export async function editTimerAPI(timerId: string, timerData: TimerEditData): Promise<TimerResponse> {
  try {
    const response = await axios.put(`${TIMER_EDIT}/${timerId}`, timerData, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error editing timer:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to edit timer",
    }
  }
}

export async function deleteTimerAPI(timerId: string): Promise<TimerResponse> {
  try {
    const response = await axios.delete(`${TIMER_DELETE}/${timerId}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error deleting timer:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete timer",
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

export async function getTimerHistoryAPI(page = 1, filters = {}, limit = 10): Promise<TimerHistoryResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value as string)
      }
    })

    console.log("API Request with params:", params.toString())

    const response = await axios.get(`${TIMER_HISTORY}?${params.toString()}`, {
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