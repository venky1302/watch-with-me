import { type Room, type Participant } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Share2, Settings, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactPlayer from "react-player";
import { ReactionOverlays } from "./reaction-overlays";

interface VideoAreaProps {
  room: Room;
  currentParticipant: Participant | undefined;
  onVideoControl: (action: 'play' | 'pause' | 'seek', currentTime?: number) => void;
  onShowInvite: () => void;
  onShowVideoSource: () => void;
  isHost: boolean;
}

export function VideoArea({
  room,
  currentParticipant,
  onVideoControl,
  onShowInvite,
  onShowVideoSource,
  isHost
}: VideoAreaProps) {
  return (
    <div className="relative h-full bg-black/95 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {room.name}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                Code: {room.code}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                {room.participants.length} {room.participants.length === 1 ? 'participant' : 'participants'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onShowInvite}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
              data-testid="button-share-invite"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {isHost && (
              <Button
                variant="outline"
                size="icon"
                onClick={onShowVideoSource}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
                data-testid="button-video-source"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 flex items-center justify-center relative">
        {room.videoSource ? (
          room.videoSource.type === 'youtube' ? (
            <div className="w-full h-full">
              <ReactPlayer
                url={room.videoSource.url}
                playing={room.videoState.isPlaying}
                controls={isHost}
                width="100%"
                height="100%"
                onPlay={() => isHost && onVideoControl('play')}
                onPause={() => isHost && onVideoControl('pause')}
                onSeek={(seconds) => isHost && onVideoControl('seek', seconds)}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Settings className="w-12 h-12 text-primary" />
                </div>
                <p className="text-white text-lg">Screen sharing active</p>
                <p className="text-white/60">WebRTC screen share would be displayed here</p>
              </div>
            </div>
          )
        ) : (
          <div className="text-center space-y-6 p-8">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Play className="w-16 h-16 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">No Video Source</h3>
              <p className="text-white/70 text-lg max-w-md">
                {isHost
                  ? "Choose a video source to start watching together"
                  : "Waiting for the host to select a video source..."}
              </p>
            </div>
            {isHost && (
              <Button
                onClick={onShowVideoSource}
                size="lg"
                className="mt-4"
                data-testid="button-select-video-source"
              >
                Select Video Source
              </Button>
            )}
          </div>
        )}

        {/* Reaction Overlays */}
        <ReactionOverlays reactions={room.reactions} />
      </div>

      {/* Participant Video Grid (WebRTC would show here) */}
      <div className="absolute bottom-20 right-4 z-20 flex gap-2 flex-wrap max-w-xs">
        {room.participants.slice(0, 4).map((participant) => (
          <div
            key={participant.id}
            className="w-32 h-24 rounded-lg bg-black/60 border-2 border-white/30 backdrop-blur-md overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center text-white/70">
              <p className="text-xs">{participant.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
