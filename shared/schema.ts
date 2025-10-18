import { z } from "zod";

// Avatar options (12 pre-defined avatars)
export const AVATAR_OPTIONS = [
  "avatar-1", "avatar-2", "avatar-3", "avatar-4",
  "avatar-5", "avatar-6", "avatar-7", "avatar-8",
  "avatar-9", "avatar-10", "avatar-11", "avatar-12"
] as const;

export type AvatarId = typeof AVATAR_OPTIONS[number];

// Participant schema
export const participantSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  avatar: z.enum(AVATAR_OPTIONS),
  isHost: z.boolean(),
  isMuted: z.boolean().default(false),
  isCameraOff: z.boolean().default(true),
  joinedAt: z.number(),
});

export type Participant = z.infer<typeof participantSchema>;

// Video source schema
export const videoSourceSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("youtube"),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal("screenshare"),
  }),
]);

export type VideoSource = z.infer<typeof videoSourceSchema>;

// Message type
export const messageSchema = z.object({
  id: z.string(),
  participantId: z.string(),
  participantName: z.string(),
  participantAvatar: z.enum(AVATAR_OPTIONS),
  content: z.string(),
  timestamp: z.number(),
  type: z.enum(["text", "reaction", "gif"]),
});

export type Message = z.infer<typeof messageSchema>;

// Reaction overlay (floating reactions on video)
export const reactionOverlaySchema = z.object({
  id: z.string(),
  participantId: z.string(),
  participantName: z.string(),
  emoji: z.string(),
  timestamp: z.number(),
});

export type ReactionOverlay = z.infer<typeof reactionOverlaySchema>;

// Room schema
export const roomSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().min(1).max(100),
  hostId: z.string(),
  videoSource: videoSourceSchema.nullable(),
  participants: z.array(participantSchema),
  messages: z.array(messageSchema),
  reactions: z.array(reactionOverlaySchema),
  videoState: z.object({
    isPlaying: z.boolean(),
    currentTime: z.number(),
    lastUpdate: z.number(),
  }),
  createdAt: z.number(),
});

export type Room = z.infer<typeof roomSchema>;

// Client-to-server events
export const createRoomSchema = z.object({
  roomName: z.string().min(1).max(100),
  userName: z.string().min(1).max(50),
  avatar: z.enum(AVATAR_OPTIONS),
});

export type CreateRoomData = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomCode: z.string().length(6),
  userName: z.string().min(1).max(50),
  avatar: z.enum(AVATAR_OPTIONS),
});

export type JoinRoomData = z.infer<typeof joinRoomSchema>;

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  type: z.enum(["text", "reaction", "gif"]),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;

export const setVideoSourceSchema = z.object({
  source: videoSourceSchema,
});

export type SetVideoSourceData = z.infer<typeof setVideoSourceSchema>;

export const videoControlSchema = z.object({
  action: z.enum(["play", "pause", "seek"]),
  currentTime: z.number().optional(),
});

export type VideoControlData = z.infer<typeof videoControlSchema>;

export const participantActionSchema = z.object({
  participantId: z.string(),
  action: z.enum(["mute", "unmute", "kick", "ban", "transfer-host"]),
});

export type ParticipantActionData = z.infer<typeof participantActionSchema>;

// Server-to-client events
export type ServerEvents = {
  "room-created": { room: Room; participantId: string };
  "join-request": { participant: Omit<Participant, "id"> };
  "join-approved": { room: Room; participantId: string };
  "join-denied": { reason: string };
  "participant-joined": { participant: Participant };
  "participant-left": { participantId: string };
  "participant-updated": { participant: Participant };
  "message-received": { message: Message };
  "reaction-added": { reaction: ReactionOverlay };
  "video-source-updated": { source: VideoSource | null };
  "video-control": VideoControlData;
  "room-closed": {};
  "error": { message: string };
};
