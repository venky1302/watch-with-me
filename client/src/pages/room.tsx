import { useEffect, useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { VideoArea } from "@/components/room/video-area";
import { ChatSidebar } from "@/components/room/chat-sidebar";
import { ControlBar } from "@/components/room/control-bar";
import { ShareInviteDialog } from "@/components/room/share-invite-dialog";
import { VideoSourceDialog } from "@/components/room/video-source-dialog";
import { JoinApprovalDialog } from "@/components/room/join-approval-dialog";
import { type Room, type Participant, type Message, type ReactionOverlay } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function RoomPage() {
  const [, params] = useRoute("/room/:action");
  const [location] = useLocation();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showVideoSourceDialog, setShowVideoSourceDialog] = useState(false);
  const [pendingJoinRequest, setPendingJoinRequest] = useState<Omit<Participant, "id"> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Get URL params from window.location.search (wouter's useLocation only returns pathname)
  const searchParams = new URLSearchParams(window.location.search);
  const userName = searchParams.get('name') || '';
  const roomName = searchParams.get('roomName') || '';
  const avatar = searchParams.get('avatar') || 'avatar-1';
  const isCreate = params?.action === 'create';
  const roomCode = !isCreate ? params?.action : '';

  useEffect(() => {
    // Initialize WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      
      // Send create or join request
      if (isCreate) {
        socket.send(JSON.stringify({
          type: 'create-room',
          data: { roomName, userName, avatar }
        }));
      } else {
        socket.send(JSON.stringify({
          type: 'join-room',
          data: { roomCode, userName, avatar }
        }));
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'room-created':
          setRoom(message.data.room);
          setCurrentParticipantId(message.data.participantId);
          setIsConnecting(false);
          setShowVideoSourceDialog(true); // Host chooses video source
          toast({
            title: "Room Created!",
            description: "Choose your video source to get started.",
          });
          break;
          
        case 'join-request':
          setPendingJoinRequest(message.data.participant);
          break;
          
        case 'join-approved':
          setRoom(message.data.room);
          setCurrentParticipantId(message.data.participantId);
          setIsConnecting(false);
          toast({
            title: "Joined Room!",
            description: `Welcome to ${message.data.room.name}`,
          });
          break;
          
        case 'join-denied':
          toast({
            title: "Access Denied",
            description: message.data.reason,
            variant: "destructive",
          });
          setTimeout(() => window.location.href = '/', 2000);
          break;
          
        case 'participant-joined':
          if (room) {
            setRoom({
              ...room,
              participants: [...room.participants, message.data.participant]
            });
            toast({
              title: "Participant Joined",
              description: `${message.data.participant.name} joined the room`,
            });
          }
          break;
          
        case 'participant-left':
          if (room) {
            setRoom({
              ...room,
              participants: room.participants.filter(p => p.id !== message.data.participantId)
            });
          }
          break;
          
        case 'participant-updated':
          if (room) {
            setRoom({
              ...room,
              participants: room.participants.map(p =>
                p.id === message.data.participant.id ? message.data.participant : p
              )
            });
          }
          break;
          
        case 'message-received':
          if (room) {
            setRoom({
              ...room,
              messages: [...room.messages, message.data.message]
            });
          }
          break;
          
        case 'reaction-added':
          if (room) {
            setRoom({
              ...room,
              reactions: [...room.reactions, message.data.reaction]
            });
            // Remove reaction after animation (3 seconds)
            setTimeout(() => {
              setRoom(prev => prev ? {
                ...prev,
                reactions: prev.reactions.filter(r => r.id !== message.data.reaction.id)
              } : null);
            }, 3000);
          }
          break;
          
        case 'video-source-updated':
          if (room) {
            setRoom({
              ...room,
              videoSource: message.data.source
            });
          }
          break;
          
        case 'video-control':
          // Handle video playback synchronization
          if (room) {
            setRoom({
              ...room,
              videoState: {
                isPlaying: message.data.action === 'play',
                currentTime: message.data.currentTime || room.videoState.currentTime,
                lastUpdate: Date.now()
              }
            });
          }
          break;
          
        case 'room-closed':
          toast({
            title: "Room Closed",
            description: "The host has ended the session.",
            variant: "destructive",
          });
          setTimeout(() => window.location.href = '/', 2000);
          break;
          
        case 'error':
          toast({
            title: "Error",
            description: message.data.message,
            variant: "destructive",
          });
          break;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the room.",
        variant: "destructive",
      });
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [isCreate, roomCode, userName, roomName, avatar]);

  const sendMessage = (content: string, type: 'text' | 'reaction' | 'gif' = 'text') => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'send-message',
        data: { content, type }
      }));
    }
  };

  const handleVideoControl = (action: 'play' | 'pause' | 'seek', currentTime?: number) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'video-control',
        data: { action, currentTime }
      }));
    }
  };

  const handleParticipantAction = (participantId: string, action: 'mute' | 'unmute' | 'kick' | 'ban' | 'transfer-host') => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'participant-action',
        data: { participantId, action }
      }));
    }
  };

  const handleApproveJoin = (approve: boolean) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && pendingJoinRequest) {
      socketRef.current.send(JSON.stringify({
        type: approve ? 'approve-join' : 'deny-join',
        data: {}
      }));
      setPendingJoinRequest(null);
    }
  };

  const handleSetVideoSource = (source: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'set-video-source',
        data: { source }
      }));
      setShowVideoSourceDialog(false);
    }
  };

  const toggleMic = () => {
    // WebRTC implementation would go here
    console.log("Toggle mic");
  };

  const toggleCamera = () => {
    // WebRTC implementation would go here
    console.log("Toggle camera");
  };

  const leaveRoom = () => {
    socketRef.current?.close();
    window.location.href = '/';
  };

  if (isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">
            {isCreate ? 'Creating your room...' : 'Joining room...'}
          </p>
        </div>
      </div>
    );
  }

  if (!room || !currentParticipantId) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Room not found</p>
        </div>
      </div>
    );
  }

  const currentParticipant = room.participants.find(p => p.id === currentParticipantId);
  const isHost = currentParticipant?.isHost || false;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <VideoArea
            room={room}
            currentParticipant={currentParticipant}
            onVideoControl={handleVideoControl}
            onShowInvite={() => setShowShareDialog(true)}
            onShowVideoSource={() => setShowVideoSourceDialog(true)}
            isHost={isHost}
          />
        </div>
        
        {/* Chat Sidebar */}
        <ChatSidebar
          room={room}
          currentParticipantId={currentParticipantId}
          onSendMessage={sendMessage}
          onParticipantAction={handleParticipantAction}
          isHost={isHost}
        />
      </div>
      
      {/* Control Bar */}
      <ControlBar
        isMuted={currentParticipant?.isMuted || false}
        isCameraOff={currentParticipant?.isCameraOff || true}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onLeave={leaveRoom}
        onShowInvite={() => setShowShareDialog(true)}
      />
      
      {/* Dialogs */}
      <ShareInviteDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        roomCode={room.code}
        roomName={room.name}
      />
      
      {isHost && (
        <VideoSourceDialog
          open={showVideoSourceDialog}
          onOpenChange={setShowVideoSourceDialog}
          onSelectSource={handleSetVideoSource}
        />
      )}
      
      {isHost && pendingJoinRequest && (
        <JoinApprovalDialog
          participant={pendingJoinRequest}
          onApprove={() => handleApproveJoin(true)}
          onDeny={() => handleApproveJoin(false)}
        />
      )}
    </div>
  );
}
