export type UserRole = 'admin' | 'employee';

export interface RolePermissions {
  canAccess: string[];
  defaultRoute: string;
}

export interface PermissionsConfig {
  [key: string]: RolePermissions;
}

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  EMPLOYEE: 'employee' as UserRole
};

export const PERMISSIONS: PermissionsConfig = {
  [ROLES.ADMIN]: {
    canAccess: ['*'], // Admin can access all routes
    defaultRoute: '/team'
  },
  [ROLES.EMPLOYEE]: {
    canAccess: ['/team'],
    defaultRoute: '/team'
  }
};

export const isAuthorized = (userRole: UserRole | null, path: string): boolean => {
  if (!userRole) return false;
  
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  // Admin has access to everything
  if (rolePermissions.canAccess.includes('*')) return true;

  // Check if the path is in the allowed routes
  return rolePermissions.canAccess.some(allowedPath => 
    path.startsWith(allowedPath)
  );
}; 