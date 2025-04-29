/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../Store";
import type { Project, ProjectFilters } from "@/types/Project";

// API endpoints
const PROJECT_API = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

// Helper function to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// Define the state interface
interface ProjectState {
  projects: Project[];
  projectsByClient: Record<string, Project[]>;
  currentProject: Project | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state
const initialState: ProjectState = {
  projects: [],
  projectsByClient: {},
  currentProject: null,
  status: "idle",
  error: null,
};

// Create async thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (filters: ProjectFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get(PROJECT_API, {
        headers: getAuthHeaders(),
        params: filters,
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch projects"
        );
      }

      return response.data.data.projects as Project[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectsByClient = createAsyncThunk(
  "projects/fetchProjectsByClient",
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${PROJECT_API}/client/${clientId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch client projects"
        );
      }

      return { clientId, projects: response.data.data as Project[] };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch client projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${PROJECT_API}/${projectId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch project"
        );
      }

      return response.data.data as Project;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: Omit<Project, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(PROJECT_API, projectData, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to create project"
        );
      }

      return response.data.data as Project;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (projectData: Project, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${PROJECT_API}/${projectData.id}`,
        projectData,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update project"
        );
      }

      return response.data.data as Project;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${PROJECT_API}/${projectId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to delete project"
        );
      }

      return projectId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

// Create the project slice
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.status = "succeeded";
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch projects by client
      .addCase(fetchProjectsByClient.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProjectsByClient.fulfilled,
        (
          state,
          action: PayloadAction<{ clientId: string; projects: Project[] }>
        ) => {
          state.status = "succeeded";
          state.projectsByClient[action.payload.clientId] =
            action.payload.projects;
        }
      )
      .addCase(fetchProjectsByClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.status = "succeeded";
          state.currentProject = action.payload;
        }
      )
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.status = "succeeded";
          state.projects.push(action.payload);

          // Update client projects if we have them loaded
          if (state.projectsByClient[action.payload.clientId]) {
            state.projectsByClient[action.payload.clientId].push(
              action.payload
            );
          }
        }
      )
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.status = "succeeded";

          // Update in main projects array
          const index = state.projects.findIndex(
            (project) => project.id === action.payload.id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }

          // Update in client projects if loaded
          if (state.projectsByClient[action.payload.clientId]) {
            const clientIndex = state.projectsByClient[
              action.payload.clientId
            ].findIndex((project) => project.id === action.payload.id);
            if (clientIndex !== -1) {
              state.projectsByClient[action.payload.clientId][clientIndex] =
                action.payload;
            }
          }

          // Update current project if it's the one being edited
          if (
            state.currentProject &&
            state.currentProject.id === action.payload.id
          ) {
            state.currentProject = action.payload;
          }
        }
      )
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";

          // Remove from main projects array
          state.projects = state.projects.filter(
            (project) => project.id !== action.payload
          );

          // Remove from client projects if loaded
          Object.keys(state.projectsByClient).forEach((clientId) => {
            state.projectsByClient[clientId] = state.projectsByClient[
              clientId
            ].filter((project) => project.id !== action.payload);
          });

          // Clear current project if it's the one being deleted
          if (
            state.currentProject &&
            state.currentProject.id === action.payload
          ) {
            state.currentProject = null;
          }
        }
      )
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearCurrentProject, setCurrentProject } = projectSlice.actions;

// Export selectors
export const selectAllProjects = (state: RootState) => state.project.projects;
export const selectProjectsByClient = (state: RootState, clientId: string) =>
  state.project.projectsByClient[clientId] || [];
export const selectCurrentProject = (state: RootState) =>
  state.project.currentProject;
export const selectProjectStatus = (state: RootState) => state.project.status;
export const selectProjectError = (state: RootState) => state.project.error;
export const selectProjectsLoading = (state: RootState) =>
  state.project.status === "loading";

// Export reducer
export default projectSlice.reducer;
