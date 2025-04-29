/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/Store"
import { toast } from "react-hot-toast"
import { Check, X, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Client } from "@/types/Client"
import { assignEmployeesToClient, fetchClientAssignments } from "@/redux/slice/ClientAssignmentSlice"
import { fetchOrganizations } from "@/redux/slice/OrganizationUser"
import { Spinner } from "@/components/ui/spinner"

interface ClientAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
}

interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: string
  isAssigned?: boolean
}

const ClientAssignmentModal: React.FC<ClientAssignmentModalProps> = ({ open, onOpenChange, client }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const userId = localStorage.getItem("userId") ?? "";
  // Fetch team members and current assignments when modal opens
  useEffect(() => {
    if (open) {
      fetchTeamMembers()
      fetchAssignments()
    }
  }, [open, client.id])

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      const result = await dispatch(fetchOrganizations(userId)).unwrap()

      setTeamMembers(result)
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast.error("Failed to fetch team members")
    } finally {
      setLoading(false)
    }
  }
  // Fetch current assignments for this client
  const fetchAssignments = async () => {
    try {
      const result = await dispatch(fetchClientAssignments(client.id)).unwrap()
      const assignedIds = result.map((assignment: any) => assignment.id)
      setSelectedMembers(assignedIds)
    } catch (error) {
      console.error("Error fetching client assignments:", error)
      toast.error("Failed to fetch current assignments")
    }
  }

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Toggle member selection
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  // Save assignments
  const handleSaveAssignments = async () => {
    setLoading(true)
    try {
      await dispatch(
        assignEmployeesToClient({
          clientId: client.id,
          employeeIds: selectedMembers,
        }),
      ).unwrap()

      toast.success("Client assignments updated successfully")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving assignments:", error)
      toast.error("Failed to update client assignments")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Employees to Client</DialogTitle>
          <DialogDescription>Select employees who will work with {client.name}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {loading ? (
              <Spinner />
            ) : filteredMembers.length > 0 ? (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleMemberSelection(member.userId)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedMembers.includes(member.userId)}
                        onCheckedChange={() => toggleMemberSelection(member.userId)}
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-sm capitalize text-muted-foreground">{member.role}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground">No employees found</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSaveAssignments} disabled={loading}>
            <Check className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Assignments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ClientAssignmentModal
