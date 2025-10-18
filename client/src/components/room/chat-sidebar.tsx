import { useState, useEffect, useRef } from "react";
import { type Room, type Message } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Send, Smile, MoreVertical, Crown, Mic, MicOff, Video, VideoOff, UserX } from "lucide-react";
import { getAvatarUrl } from "@/lib/avatars";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChatSidebarProps {
  room: Room;
  currentParticipantId: string;
  onSendMessage: (content: string, type?: 'text' | 'reaction' | 'gif') => void;
  onParticipantAction: (participantId: string, action: 'mute' | 'unmute' | 'kick' | 'ban' | 'transfer-host') => void;
  isHost: boolean;
}

export function ChatSidebar({ room, currentParticipantId, onSendMessage, onParticipantAction, isHost }: ChatSidebarProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [room.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage("");
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    onSendMessage(emojiData.emoji, 'reaction');
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 m-2">
          <TabsTrigger value="chat" data-testid="tab-chat">Chat</TabsTrigger>
          <TabsTrigger value="participants" data-testid="tab-participants">
            Participants ({room.participants.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {room.messages.map((msg) => {
                const isOwnMessage = msg.participantId === currentParticipantId;
                
                if (msg.type === 'reaction') {
                  return (
                    <div key={msg.id} className="text-center py-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
                        <span className="text-2xl">{msg.content}</span>
                        <span className="text-sm text-muted-foreground">from {msg.participantName}</span>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <img src={getAvatarUrl(msg.participantAvatar)} alt={msg.participantName} />
                    </Avatar>
                    <div className={`flex-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{msg.participantName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`inline-block px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    data-testid="button-emoji-picker"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-0" align="start">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </PopoverContent>
              </Popover>
              
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
                data-testid="input-chat-message"
              />
              
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                size="icon"
                data-testid="button-send-message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Participants Tab */}
        <TabsContent value="participants" className="flex-1 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {room.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover-elevate border border-border"
                  data-testid={`participant-${participant.id}`}
                >
                  <Avatar className="w-10 h-10">
                    <img src={getAvatarUrl(participant.avatar)} alt={participant.name} />
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{participant.name}</p>
                      {participant.isHost && (
                        <Crown className="w-4 h-4 text-warning flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {participant.isMuted ? (
                        <MicOff className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Mic className="w-3 h-3 text-success" />
                      )}
                      {participant.isCameraOff ? (
                        <VideoOff className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Video className="w-3 h-3 text-success" />
                      )}
                    </div>
                  </div>
                  
                  {isHost && participant.id !== currentParticipantId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          data-testid={`button-participant-menu-${participant.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onParticipantAction(participant.id, participant.isMuted ? 'unmute' : 'mute')}
                          data-testid={`menu-item-${participant.isMuted ? 'unmute' : 'mute'}`}
                        >
                          {participant.isMuted ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                          {participant.isMuted ? 'Unmute' : 'Mute'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onParticipantAction(participant.id, 'transfer-host')}
                          data-testid="menu-item-transfer-host"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Transfer Host
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onParticipantAction(participant.id, 'kick')}
                          className="text-destructive"
                          data-testid="menu-item-kick"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
