/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// API endpoint
const CLIENT_ASSIGNMENT_API = `${import.meta.env.VITE_BACKEND_URL}/api/clients/employees`

interface ClientAssignment {
  userId: string;
}

interface ClientAssignmentState {
  assignments: ClientAssignment[]
  loading: boolean
  error: string | null
}

const initialState: ClientAssignmentState = {
  assignments: [],
  loading: false,
  error: null,
}

// Helper function to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
})

// Fetch client assignments
export const fetchClientAssignments = createAsyncThunk(
  "clientAssignments/fetchClientAssignments",
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CLIENT_ASSIGNMENT_API}/${clientId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch client assignments")
      }

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch client assignments")
    }
  },
)

// Assign employees to client
export const assignEmployeesToClient = createAsyncThunk(
  "clientAssignments/assignEmployeesToClient",
  async ({ clientId, employeeIds }: { clientId: string; employeeIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CLIENT_ASSIGNMENT_API}/${clientId}`,
        { employeeIds },
        {
          headers: getAuthHeaders(),
        },
      )

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to assign employees")
      }

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign employees")
    }
  },
)

// Client assignment slice
const clientAssignmentSlice = createSlice({
  name: "clientAssignments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch client assignments
      .addCase(fetchClientAssignments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClientAssignments.fulfilled, (state, action) => {
        state.loading = false
        state.assignments = action.payload
      })
      .addCase(fetchClientAssignments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Assign employees to client
      .addCase(assignEmployeesToClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(assignEmployeesToClient.fulfilled, (state, action) => {
        state.loading = false
        // Optionally update the state with the new assignments
        state.assignments = action.payload
      })
      .addCase(assignEmployeesToClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default clientAssignmentSlice.reducer
