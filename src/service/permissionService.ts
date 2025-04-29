import { PERMISSIONS_API } from "@/Config";
import axios from "axios";

// Type definitions
export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: string[];
}

export interface UserPermissions {
  permissions: Permission[];
}

// Cache permissions to avoid unnecessary API calls
let cachedPermissions: Permission[] | null = null;
let cachedRolePermissions: Record<string, string[]> = {};

// Helper function to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// Get all permissions
export const getAllPermissions = async (): Promise<Permission[]> => {
  try {
    if (cachedPermissions) return cachedPermissions;

    const response = await axios.get(`${PERMISSIONS_API}`, {
      headers: getAuthHeaders(),
    });

    if (response.data.success) {
      cachedPermissions = response.data.permissions;
      return response.data.permissions;
    }

    return [];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return [];
  }
};

// Get permissions for a specific role
export const getRolePermissions = async (role: string): Promise<string[]> => {
  if (!role) return [];

  try {
    // Check cache first
    if (cachedRolePermissions[role]) {
      return cachedRolePermissions[role];
    }

    const response = await axios.get(`${PERMISSIONS_API}/role/${role}`, {
      headers: getAuthHeaders(),
    });

    if (response.data.success && response.data.permissions) {
      const permissionNames = response.data.permissions.map(
        (p: Permission) => p.name
      );
      cachedRolePermissions[role] = permissionNames;
      return permissionNames;
    }

    return [];
  } catch (error) {
    console.error(`Error fetching permissions for role ${role}:`, error);
    return [];
  }
};

// Check if user has a specific permission
export const hasPermission = async (
  role: string | null,
  permissionName: string
): Promise<boolean> => {
  if (!role) return false;

  try {
    const permissions = await getRolePermissions(role);
    return (
      permissions.includes(permissionName) ||
      permissions.includes("all_permissions")
    );
  } catch (error) {
    console.error(`Error checking permission ${permissionName}:`, error);
    return false;
  }
};

// Reset cache (call when user logs in/out or role changes)
export const resetPermissionCache = () => {
  cachedPermissions = null;
  cachedRolePermissions = {};
};
