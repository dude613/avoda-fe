/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../Store"
import {
  type Timer,
  type TimerFormData,
  type TimerEditData,
  startTimerAPI,
  stopTimerAPI,
  pauseTimerAPI,
  resumeTimerAPI,
  getActiveTimerAPI,
  getTimerHistoryAPI,
  updateTimerNoteAPI,
  deleteTimerNoteAPI,
  editTimerAPI,
  deleteTimerAPI,
} from "../../service/timerApi"
import toast from "react-hot-toast"

interface TimerState {
  activeTimer: Timer | null
  timerHistory: Timer[]
  loading: boolean
  historyLoading: boolean
  error: string | null
  totalPages: number
  currentPage: number
}

// Initial state
const initialState: TimerState = {
  activeTimer: null,
  timerHistory: [],
  loading: false,
  historyLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
}

// Async thunks
export const fetchActiveTimer = createAsyncThunk("timer/fetchActiveTimer", async (_, { rejectWithValue }) => {
  try {
    const response = await getActiveTimerAPI()
    if (!response.success) {
      return rejectWithValue(response.error || "Failed to fetch active timer")
    }
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch active timer")
  }
})

interface FetchTimerHistoryParams {
  page?: number;
  filters?: any;
  limit?: number;
}

export const fetchTimerHistory = createAsyncThunk(
  "timer/fetchTimerHistory",
  async ({ page = 1, filters = {}, limit = 10 }: FetchTimerHistoryParams = {}, { rejectWithValue }) => {
    try {
      const response = await getTimerHistoryAPI(page, filters, limit)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to fetch timer history")
      }
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch timer history")
    }
  },
)

export const startTimer = createAsyncThunk(
  "timer/startTimer",
  async (timerData: TimerFormData, { rejectWithValue }) => {
    try {
      const response = await startTimerAPI(timerData)
      if (!response.success) {
        toast.error(response?.error as string);
        return rejectWithValue(response.error || "Failed to start timer")
      }
      return response
    } catch (error: any) {
      toast.error(error.message);
      return rejectWithValue(error.message || "Failed to start timer")
    }
  },
)

export const stopTimer = createAsyncThunk("timer/stopTimer", async (timerId: string, { rejectWithValue }) => {
  try {
    const response = await stopTimerAPI(timerId)
    if (!response.success) {
      return rejectWithValue(response.error || "Failed to stop timer")
    }
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to stop timer")
  }
})

export const pauseTimer = createAsyncThunk("timer/pauseTimer", async (timerId: string, { rejectWithValue }) => {
  try {
    const response = await pauseTimerAPI(timerId)
    if (!response.success) {
      return rejectWithValue(response.error || "Failed to pause timer")
    }
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to pause timer")
  }
})

export const resumeTimer = createAsyncThunk("timer/resumeTimer", async (timerId: string, { rejectWithValue }) => {
  try {
    const response = await resumeTimerAPI(timerId)
    if (!response.success) {
      return rejectWithValue(response.error || "Failed to resume timer")
    }
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to resume timer")
  }
})

export const updateTimerNote = createAsyncThunk(
  "timer/updateTimerNote",
  async ({ timerId, note }: { timerId: string; note: string }, { rejectWithValue }) => {
    try {
      const response = await updateTimerNoteAPI(timerId, note)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update timer note")
      }
      return { ...response, timerId, note }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update timer note")
    }
  },
)

export const deleteTimerNote = createAsyncThunk(
  "timer/deleteTimerNote",
  async (timerId: string, { rejectWithValue }) => {
    try {
      const response = await deleteTimerNoteAPI(timerId)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to delete timer note")
      }
      return { ...response, timerId }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete timer note")
    }
  },
)

export const editTimer = createAsyncThunk(
  "timer/edit",
  async ({ timerId, timerData }: { timerId: string; timerData: TimerEditData }, { rejectWithValue }) => {
    try {
      const response = await editTimerAPI(timerId, timerData)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to edit timer")
      }
      return { ...response, timerId }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to edit timer")
    }
  },
)

export const deleteTimer = createAsyncThunk("timer/delete", async (timerId: string, { rejectWithValue }) => {
  try {
    const response = await deleteTimerAPI(timerId)
    if (!response.success) {
      return rejectWithValue(response.error || "Failed to delete timer")
    }
    return { ...response, timerId }
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete timer")
  }
})

// Timer slice
const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    updateActiveTimer: (state, action: PayloadAction<Timer>) => {
      state.activeTimer = action.payload
    },
    clearActiveTimer: (state) => {
      state.activeTimer = null
    },
    pauseActiveTimer: (state, action: PayloadAction<Timer>) => {
      state.activeTimer = action.payload
    },
    resumeActiveTimer: (state, action: PayloadAction<Timer>) => {
      state.activeTimer = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchActiveTimer
      .addCase(fetchActiveTimer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveTimer.fulfilled, (state, action) => {
        state.loading = false
        state.activeTimer = action.payload.hasActiveTimer ? action.payload.timer : null
      })
      .addCase(fetchActiveTimer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // fetchTimerHistory
      .addCase(fetchTimerHistory.pending, (state) => {
        state.historyLoading = true
        state.error = null
      })
      .addCase(fetchTimerHistory.fulfilled, (state, action) => {
        state.historyLoading = false
        state.timerHistory = action.payload.timers
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchTimerHistory.rejected, (state, action) => {
        state.historyLoading = false
        state.error = action.payload as string
      })

      // startTimer
      .addCase(startTimer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startTimer.fulfilled, (state, action) => {
        state.loading = false
        state.activeTimer = action.payload.timer || null
      })
      .addCase(startTimer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // stopTimer
      .addCase(stopTimer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(stopTimer.fulfilled, (state, action) => {
        state.loading = false
        state.activeTimer = null
        // Add the stopped timer to history if available
        if (action.payload.timer) {
          state.timerHistory = [action.payload.timer, ...state.timerHistory]
        }
      })
      .addCase(stopTimer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // pauseTimer
      .addCase(pauseTimer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(pauseTimer.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.timer) {
          state.activeTimer = action.payload.timer
        }
      })
      .addCase(pauseTimer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // resumeTimer
      .addCase(resumeTimer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resumeTimer.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.timer) {
          state.activeTimer = action.payload.timer
        }
      })
      .addCase(resumeTimer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // updateTimerNote
      .addCase(updateTimerNote.fulfilled, (state, action) => {
        const { timerId, note } = action.payload
        state.timerHistory = state.timerHistory.map((timer) => (timer.id === timerId ? { ...timer, note } : timer))
      })

      // deleteTimerNote
      .addCase(deleteTimerNote.fulfilled, (state, action) => {
        const { timerId } = action.payload
        state.timerHistory = state.timerHistory.map((timer) =>
          timer.id === timerId ? { ...timer, note: undefined } : timer,
        )
      })

      // editTimer
      .addCase(editTimer.fulfilled, (state, action) => {
        const { timerId, timer } = action.payload
        if (timer) {
          state.timerHistory = state.timerHistory.map((t) => (t.id === timerId ? timer : t))
        }
      })

      // deleteTimer
      .addCase(deleteTimer.fulfilled, (state, action) => {
        const { timerId } = action.payload
        state.timerHistory = state.timerHistory.filter((timer) => timer.id !== timerId)
      })
  },
})

// Actions
export const { updateActiveTimer, clearActiveTimer, pauseActiveTimer, resumeActiveTimer } = timerSlice.actions

// Selectors
export const selectActiveTimer = (state: RootState) => state.timer.activeTimer
export const selectTimerHistory = (state: RootState) => state.timer.timerHistory
export const selectTimerLoading = (state: RootState) => state.timer.loading
export const selectHistoryLoading = (state: RootState) => state.timer.historyLoading
export const selectTimerError = (state: RootState) => state.timer.error
export const selectTimerPagination = (state: RootState) => ({
  totalPages: state.timer.totalPages,
  currentPage: state.timer.currentPage,
})

export default timerSlice.reducer
