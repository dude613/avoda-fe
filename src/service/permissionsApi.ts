/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { PERMISSIONS_API } from "../Config"

// Helper function to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
})

// API response types
interface Permission {
  id: string
  name: string
  description: string
  roles: string[]
}

interface ApiResponse {
  success: boolean
  message?: string
  error?: string
  [key: string]: any
}

// Get all permissions
export const getAllPermissions = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${PERMISSIONS_API}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error("Error fetching permissions:", error)
    return { success: false, error: error.response?.data?.error || "Failed to fetch permissions" }
  }
}

// Get permissions for a specific role
export const getRolePermissions = async (role: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${PERMISSIONS_API}/role/${role}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error: any) {
    console.error(`Error fetching permissions for role ${role}:`, error)
    return { success: false, error: error.response?.data?.error || `Failed to fetch permissions for role ${role}` }
  }
}

// Set permissions for a role
export const setRolesPermissions = async (role: string, permissionNames: string[]): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${PERMISSIONS_API}/role`,
      { role, permissionNames },
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error: any) {
    console.error(`Error setting permissions for role ${role}:`, error)
    return { success: false, error: error.response?.data?.error || `Failed to set permissions for role ${role}` }
  }
}

export type { Permission }
