import axios from "axios";
import type { Project, ProjectFilters } from "@/types/Project";

const PROJECT_API = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

// Get auth token
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// Fetch all projects with optional filters
export const fetchProjectsApi = async (filters?: ProjectFilters) => {
  try {
    const response = await axios.get(PROJECT_API, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      params: filters,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch projects");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch projects by client ID
export const fetchProjectsByClientApi = async (clientId: string) => {
  try {
    const response = await axios.get(`${PROJECT_API}/client/${clientId}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch client projects"
      );
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching client projects:", error);
    throw error;
  }
};

// Fetch a single project by ID
export const fetchProjectByIdApi = async (projectId: string) => {
  try {
    const response = await axios.get(`${PROJECT_API}/${projectId}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch project");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Create a new project
export const createProjectApi = async (project: Omit<Project, "id">) => {
  try {
    const response = await axios.post(PROJECT_API, project, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create project");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Update an existing project
export const updateProjectApi = async (project: Project) => {
  try {
    const response = await axios.put(`${PROJECT_API}/${project.id}`, project, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update project");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProjectApi = async (projectId: string) => {
  try {
    const response = await axios.delete(`${PROJECT_API}/${projectId}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete project");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
