"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/Store";
import { toast } from "react-hot-toast";
import { Check, X, Search, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTaskById, updateTask } from "@/redux/slice/TaskSlice";
import type { Task } from "@/redux/slice/TaskSlice";
import { fetchOrganizations } from "@/redux/slice/OrganizationUser";
import { Spinner } from "@/components/ui/spinner";

interface TaskAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

interface TeamMember {
  userId: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TaskAssignmentModal({
  open,
  onOpenChange,
  task,
}: TaskAssignmentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    task.assignedTo
  );
  const userId = localStorage.getItem("userId") ?? "";
  // Fetch team members when modal opens
  useEffect(() => {
    if (open) {
      fetchTeamMembers();
    }
  }, [open]);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const result = await dispatch(fetchOrganizations(userId)).unwrap();
      setTeamMembers(result);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle member selection
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(selectedMemberId === memberId ? null : memberId);
  };

  // Save assignment
  const handleSaveAssignment = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: {
            assignedTo: selectedMemberId,
          },
        })
      ).unwrap();

      toast.success("Task assignment updated successfully");
      dispatch(fetchTaskById(task.id));
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to update task assignment");
    } finally {
      setLoading(false);
    }
  };

  // Clear assignment
  const handleClearAssignment = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: {
            assignedTo: null,
          },
        })
      ).unwrap();
      toast.success("Task assignment cleared successfully");
      dispatch(fetchTaskById(task.id));
      onOpenChange(false);
    } catch (error) {
      console.error("Error clearing assignment:", error);
      toast.error("Failed to clear task assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Select a team member to assign this task to
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
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
                    onClick={() => handleSelectMember(member.userId)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedMemberId === member.userId}
                        onCheckedChange={() =>
                          handleSelectMember(member.userId)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm capitalize text-muted-foreground">
                      {member.role}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <User className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No team members found</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClearAssignment}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Unassign
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment} disabled={loading}>
              <Check className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Assignment"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
