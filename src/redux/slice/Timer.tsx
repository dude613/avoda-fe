/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../Store"
import {
  type Timer,
  type TimerFormData,
  startTimerAPI,
  stopTimerAPI,
  pauseTimerAPI,
  resumeTimerAPI,
  getActiveTimerAPI,
  getTimerHistoryAPI,
} from "../../service/timerApi"

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

export const fetchTimerHistory = createAsyncThunk<any, any, any>(
  "timer/fetchTimerHistory",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getTimerHistoryAPI(page)
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
        return rejectWithValue(response.error || "Failed to start timer")
      }
      return response
    } catch (error: any) {
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
    addTimerToHistory: (state, action: PayloadAction<Timer>) => {
      // Add to the beginning of the array
      state.timerHistory = [action.payload, ...state.timerHistory]
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
  },
})

// Actions
export const { updateActiveTimer, clearActiveTimer, pauseActiveTimer, resumeActiveTimer, addTimerToHistory } =
  timerSlice.actions

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
