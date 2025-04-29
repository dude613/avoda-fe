"use client";

import { hasPermission } from "@/service/permissionService";
import { type ReactNode, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface PermissionGateProps {
  permissionName: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders content based on user permissions.
 * Use this to protect UI elements that require specific permissions.
 */
const PermissionGate = ({
  permissionName,
  children,
  fallback = null,
}: PermissionGateProps) => {
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    const checkPermission = async () => {
      try {
        const hasAccess = await hasPermission(userRole, permissionName);
        setCanAccess(hasAccess);
      } catch (error) {
        console.error(`Error checking permission ${permissionName}:`, error);
        setCanAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [permissionName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return canAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;
