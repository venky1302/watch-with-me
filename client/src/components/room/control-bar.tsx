import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
  onShowInvite: () => void;
}

export function ControlBar({
  isMuted,
  isCameraOff,
  onToggleMic,
  onToggleCamera,
  onLeave,
  onShowInvite
}: ControlBarProps) {
  return (
    <div className="h-20 border-t border-border bg-card/95 backdrop-blur-md flex items-center justify-center px-4">
      <div className="flex items-center gap-3">
        <Button
          variant={isMuted ? "destructive" : "default"}
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            !isMuted && "bg-success hover:bg-success/90 text-white"
          )}
          onClick={onToggleMic}
          data-testid="button-toggle-mic"
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        
        <Button
          variant={isCameraOff ? "destructive" : "default"}
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            !isCameraOff && "bg-success hover:bg-success/90 text-white"
          )}
          onClick={onToggleCamera}
          data-testid="button-toggle-camera"
        >
          {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={onShowInvite}
          data-testid="button-control-share"
        >
          <Share2 className="w-5 h-5" />
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={onLeave}
          data-testid="button-leave-room"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
