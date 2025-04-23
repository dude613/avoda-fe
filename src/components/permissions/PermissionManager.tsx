"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Shield, Check, X, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card-b"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import { getAllPermissions, getRolePermissions, type Permission, setRolesPermissions } from "@/service/permissionsApi"

interface PermissionManagerProps {
  className?: string
}

export function PermissionManager({ className }: PermissionManagerProps) {
  const [activeRole, setActiveRole] = useState<string>("manager")
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<string[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Group permissions by category (based on prefix before first underscore)
  const groupedPermissions = allPermissions.reduce((groups: Record<string, Permission[]>, permission) => {
    const category = permission.name.split("_")[0]
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(permission)
    return groups
  }, {})

  // Fetch all permissions and role permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true)
      try {
        const [allPermsResponse, rolePermsResponse] = await Promise.all([
          getAllPermissions(),
          getRolePermissions(activeRole),
        ])

        if (allPermsResponse.success && allPermsResponse.permissions) {
          setAllPermissions(allPermsResponse.permissions)
        } else {
          toast.error("Failed to fetch permissions")
        }

        if (rolePermsResponse.success && rolePermsResponse.permissions) {
          const permissionNames = rolePermsResponse.permissions.map((p: Permission) => p.name)
          setRolePermissions(permissionNames)
          setSelectedPermissions(permissionNames)
        } else {
          toast.error(`Failed to fetch permissions for ${activeRole} role`)
        }
      } catch (error) {
        console.error("Error fetching permissions:", error)
        toast.error("An error occurred while fetching permissions")
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [activeRole])

  // Check if selected permissions differ from role permissions
  useEffect(() => {
    const hasChanges =
      selectedPermissions.length !== rolePermissions.length ||
      !selectedPermissions.every((p) => rolePermissions.includes(p))

    setHasChanges(hasChanges)
  }, [selectedPermissions, rolePermissions])

  // Handle role tab change
  const handleRoleChange = (role: string) => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to switch roles?")) {
        setActiveRole(role)
      }
    } else {
      setActiveRole(role)
    }
  }

  // Toggle permission selection
  const togglePermission = (permissionName: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionName)) {
        return prev.filter((p) => p !== permissionName)
      } else {
        return [...prev, permissionName]
      }
    })
  }

  // Save permissions
  const savePermissions = async () => {
    setSaving(true)
    try {
      const response = await setRolesPermissions(activeRole, selectedPermissions)
      if (response.success) {
        toast.success(`Permissions updated for ${activeRole} role`)
        setRolePermissions([...selectedPermissions])
        setHasChanges(false)
      } else {
        toast.error(response.error || "Failed to update permissions")
      }
    } catch (error) {
      console.error("Error saving permissions:", error)
      toast.error("An error occurred while saving permissions")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Role Permissions
        </CardTitle>
        <CardDescription>Manage permissions for different roles in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={[
            { value: "manager", label: "Manager" },
            { value: "employee", label: "Employee" },
          ]}
          activeTab={activeRole}
          onTabChange={handleRoleChange}
          className="mb-4"
        />

        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium capitalize">{activeRole} Permissions</h3>
              <Button onClick={savePermissions} disabled={!hasChanges || saving} className="flex items-center gap-1">
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground">{category}</h4>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {permissions.map((permission) => {
                      const isSelected = selectedPermissions.includes(permission.name)
                      return (
                        <div
                          key={permission.id}
                          className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                            isSelected ? "bg-primary/10 border-primary/30" : "bg-background hover:bg-muted/50"
                          }`}
                          onClick={() => togglePermission(permission.name)}
                        >
                          <div>
                            <p className="font-medium">{permission.name.replace(/_/g, " ")}</p>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
