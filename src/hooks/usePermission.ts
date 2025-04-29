"use client";

import { hasPermission } from "@/service/permissionService";
import { useEffect, useState } from "react";

/**
 * Custom hook to check if the current user has a specific permission
 * @param permissionName The permission to check
 * @returns An object with loading and allowed states
 */
const usePermission = (permissionName: string) => {
  const [allowed, setAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    const checkPermission = async () => {
      try {
        const result = await hasPermission(userRole, permissionName);
        setAllowed(result);
      } catch (error) {
        console.error(`Error checking permission ${permissionName}:`, error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [permissionName]);

  return { loading, allowed };
};

export default usePermission;
