/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { url } from "@/Config"
import { Client } from "@/types/Client"
import { ClientFilters } from "@/redux/slice/ClientSlice"

// API endpoints
export const CLIENTS_API = `${url}/clients`

// Helper function to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
})

// API response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Fetch all clients with optional filters
export const fetchClientsAPI = async (filters?: ClientFilters): Promise<ApiResponse<any>> => {
  try {
    // Build query parameters from filters
    const params = new URLSearchParams()

    if (filters) {
      if (filters.name) params.append("name", filters.name)
      if (filters.email) params.append("email", filters.email)
      if (filters.industry) params.append("industry", filters.industry)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""

    const response = await axios.get(`${CLIENTS_API}${queryString}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching clients:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch clients",
    }
  }
}
export const fetchArchivedClientsAPI = async (filters?: ClientFilters): Promise<ApiResponse<Client[]>> => {
  try {
    // Build query parameters from filters
    const params = new URLSearchParams()

    if (filters) {
      if (filters.name) params.append("name", filters.name)
      if (filters.email) params.append("email", filters.email)
      if (filters.industry) params.append("industry", filters.industry)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""

    const response = await axios.get(`${CLIENTS_API}/archived${queryString}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching archived clients:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch archived clients",
    }
  }
}

// Create a new client
export const createClientAPI = async (
  clientData: Omit<Client, "id" | "status" | "projects">,
): Promise<ApiResponse<Client>> => {
  try {
    const response = await axios.post(CLIENTS_API, clientData, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error creating client:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create client",
    }
  }
}

// Update an existing client
export const updateClientAPI = async (clientData: Client): Promise<ApiResponse<Client>> => {
  try {
    const response = await axios.put(`${CLIENTS_API}/${clientData.id}`, clientData, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error updating client:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update client",
    }
  }
}

// Archive a client
export const archiveClientAPI = async (clientId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.put(
      `${CLIENTS_API}/${clientId}/archive`,
      {},
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error("Error archiving client:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to archive client",
    }
  }
}

// Restore a client
export const restoreClientAPI = async (clientId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.put(
      `${CLIENTS_API}/${clientId}/unarchive`,
      {},
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error("Error restoring client:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to restore client",
    }
  }
}

// Delete a client permanently
export const deleteClientAPI = async (clientId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.delete(`${CLIENTS_API}/${clientId}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error deleting client:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete client",
    }
  }
}
