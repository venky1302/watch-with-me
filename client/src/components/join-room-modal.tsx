import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarSelector } from "@/components/avatar-selector";
import { type AvatarId } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface JoinRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomCode?: string;
}

export function JoinRoomModal({ open, onOpenChange, roomCode: initialRoomCode }: JoinRoomModalProps) {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("avatar-1");

  const handleJoin = () => {
    if (!userName.trim() || !roomCode.trim()) return;
    
    // Navigate to room page with join params
    setLocation(`/room/${roomCode}?name=${encodeURIComponent(userName)}&avatar=${selectedAvatar}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Join a Room
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter the room code and choose your avatar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="joinRoomCode" className="text-sm font-semibold">
              Room Code
            </Label>
            <Input
              id="joinRoomCode"
              placeholder="Enter 6-character code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-base uppercase font-mono tracking-widest"
              data-testid="input-room-code"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="joinUserName" className="text-sm font-semibold">
              Your Name
            </Label>
            <Input
              id="joinUserName"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={50}
              className="text-base"
              data-testid="input-join-user-name"
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
            data-testid="button-cancel-join"
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoin}
            disabled={!userName.trim() || !roomCode.trim() || roomCode.length !== 6}
            className="flex-1"
            data-testid="button-confirm-join"
          >
            Join Room
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
