import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";

interface UnarchiveConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserName: string;
  onUnarchive: () => void;
}

const UnarchiveConfirmationModal: React.FC<UnarchiveConfirmationModalProps> = ({ open, onOpenChange, selectedUserName, onUnarchive }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unarchive Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to unarchive {selectedUserName}?
            They will appear in the active team members list again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={onUnarchive}>
            Unarchive Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnarchiveConfirmationModal;
