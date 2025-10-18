import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarSelector } from "@/components/avatar-selector";
import { type AvatarId } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoomModal({ open, onOpenChange }: CreateRoomModalProps) {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("avatar-1");

  const handleCreate = () => {
    if (!userName.trim() || !roomName.trim()) return;
    
    // Navigate to room page with creation params
    setLocation(`/room/create?name=${encodeURIComponent(userName)}&roomName=${encodeURIComponent(roomName)}&avatar=${selectedAvatar}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Create Your Room
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose your name and avatar to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-semibold">
              Your Name
            </Label>
            <Input
              id="userName"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={50}
              className="text-base"
              data-testid="input-user-name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-sm font-semibold">
              Room Name
            </Label>
            <Input
              id="roomName"
              placeholder="e.g., Movie Night with Friends"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength={100}
              className="text-base"
              data-testid="input-room-name"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Choose Your Avatar
            </Label>
            <AvatarSelector selected={selectedAvatar} onSelect={setSelectedAvatar} />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            data-testid="button-cancel-create"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!userName.trim() || !roomName.trim()}
            className="flex-1"
            data-testid="button-confirm-create"
          >
            Create Room
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
