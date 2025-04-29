/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../Store";
import axios from "axios";

// API endpoints
const TASK_API = `${import.meta.env.VITE_BACKEND_URL}/api/tasks`;

// Define task interface
export interface Task {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  description?: string;
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
  status: string;
  priority: string;
  dueDate?: string;
  assignedUser?: {
    id: string;
    userName: string;
  };
  assignedTo: string | null;
}

export interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

interface FetchTasksParams {
  page?: number;
  limit?: number;
  projectId?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  name?: string;
}

// Simplify the state structure to match what the component expects
const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

// Helper function to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// Update the fetchTasks thunk to correctly handle the response structure
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params: FetchTasksParams = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        projectId,
        status,
        priority,
        assignedTo,
        name,
      } = params;

      let url = `${TASK_API}?page=${page}&limit=${limit}`;

      if (projectId) url += `&projectId=${projectId}`;
      if (status) url += `&status=${status}`;
      if (priority) url += `&priority=${priority}`;
      if (assignedTo) url += `&assignedTo=${assignedTo}`;
      if (name) url += `&name=${name}`;

      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch tasks"
        );
      }

      console.log("API Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Fetch a single task by ID
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${TASK_API}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch task");
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await axios.post(TASK_API, taskData, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to create task"
        );
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

// Update an existing task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, data }: { id: string; data: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${TASK_API}/${id}`, data, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update task"
        );
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Unassign an existing task
export const unassignTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, data }: { id: string; data: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${TASK_API}/${id}`,
        { ...data, assignedUser: "" },
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update task"
        );
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${TASK_API}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to delete task"
        );
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

// Update the fetchAssignedTasks thunk to correctly handle the response structure
export const fetchAssignedTasks = createAsyncThunk(
  "tasks/fetchAssignedTasks",
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${TASK_API}/assigned`, {
        headers: getAuthHeaders(),
        params: filters,
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch assigned tasks"
        );
      }

      console.log("API Response (Assigned):", response.data);
      return response.data.data;
    } catch (error: any) {
      // If the endpoint doesn't exist (404) or other error, return empty data instead of rejecting
      if (error.response?.status === 404) {
        return {
          tasks: [],
          totalPages: 1,
          currentPage: 1,
        };
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned tasks"
      );
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        // Directly set the tasks array from the response
        state.tasks = action.payload.tasks || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        console.log("fetchTasks.fulfilled - tasks:", action.payload.tasks);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })

      // Fetch assigned tasks
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        // Directly set the tasks array from the response
        state.tasks = action.payload.tasks || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        console.log(
          "fetchAssignedTasks.fulfilled - tasks:",
          action.payload.tasks
        );
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTask } = taskSlice.actions;

// Update the selectors to correctly access the state
export const selectAllTasks = (state: RootState) => state.tasks?.tasks || [];
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectTasksLoading = (state: RootState) => state.tasks?.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksPagination = (state: RootState) => ({
  totalPages: state.tasks?.totalPages || 1,
  currentPage: state.tasks?.currentPage || 1,
});

export default taskSlice.reducer;
