import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";

interface ArchiveConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserName: string;
  onArchive: () => void;
}

const ArchiveConfirmationModal: React.FC<ArchiveConfirmationModalProps> = ({ open, onOpenChange, selectedUserName, onArchive }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive {selectedUserName}?
            They will no longer appear in the active team members list.
            All data will remain in the database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={onArchive}>
            Archive Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArchiveConfirmationModal;
