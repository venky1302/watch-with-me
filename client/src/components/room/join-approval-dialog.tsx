import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { type Participant } from "@shared/schema";
import { getAvatarUrl } from "@/lib/avatars";
import { UserCheck, UserX } from "lucide-react";

interface JoinApprovalDialogProps {
  participant: Omit<Participant, "id">;
  onApprove: () => void;
  onDeny: () => void;
}

export function JoinApprovalDialog({ participant, onApprove, onDeny }: JoinApprovalDialogProps) {
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Join Request
          </DialogTitle>
          <DialogDescription>
            Someone wants to join your room
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-6">
          <Avatar className="w-24 h-24">
            <img src={getAvatarUrl(participant.avatar)} alt={participant.name} />
          </Avatar>
          <div className="text-center">
            <p className="text-xl font-semibold">{participant.name}</p>
            <p className="text-sm text-muted-foreground">wants to join the room</p>
          </div>
        </div>
        
        <DialogFooter className="flex-row gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={onDeny}
            className="flex-1"
            data-testid="button-deny-join"
          >
            <UserX className="w-4 h-4 mr-2" />
            Deny
          </Button>
          <Button
            onClick={onApprove}
            className="flex-1"
            data-testid="button-approve-join"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
