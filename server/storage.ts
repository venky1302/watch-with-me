import { type Room, type Participant, type Message, type ReactionOverlay } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Room operations
  createRoom(room: Omit<Room, "id" | "code" | "createdAt">): Room;
  getRoom(code: string): Room | undefined;
  updateRoom(code: string, updates: Partial<Room>): Room | undefined;
  deleteRoom(code: string): void;
  
  // Participant operations
  addParticipant(roomCode: string, participant: Participant): void;
  removeParticipant(roomCode: string, participantId: string): void;
  updateParticipant(roomCode: string, participantId: string, updates: Partial<Participant>): Participant | undefined;
  getParticipant(roomCode: string, participantId: string): Participant | undefined;
  
  // Message operations
  addMessage(roomCode: string, message: Message): void;
  
  // Reaction operations
  addReaction(roomCode: string, reaction: ReactionOverlay): void;
  
  // Pending join requests
  addPendingJoinRequest(roomCode: string, participant: Omit<Participant, "id">): void;
  getPendingJoinRequest(roomCode: string): Omit<Participant, "id"> | undefined;
  clearPendingJoinRequest(roomCode: string): void;
  
  // Banned users
  banUser(roomCode: string, participantId: string): void;
  isBanned(roomCode: string, userId: string): boolean;
}

export class MemStorage implements IStorage {
  private rooms: Map<string, Room>;
  private pendingJoinRequests: Map<string, Omit<Participant, "id">>;
  private bannedUsers: Map<string, Set<string>>; // roomCode -> Set of banned user IDs

  constructor() {
    this.rooms = new Map();
    this.pendingJoinRequests = new Map();
    this.bannedUsers = new Map();
  }

  // Generate unique 6-character room code
  private generateRoomCode(): string {
    let code: string;
    do {
      code = nanoid(6).toUpperCase();
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(roomData: Omit<Room, "id" | "code" | "createdAt">): Room {
    const room: Room = {
      ...roomData,
      id: nanoid(),
      code: this.generateRoomCode(),
      createdAt: Date.now(),
    };
    this.rooms.set(room.code, room);
    return room;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  updateRoom(code: string, updates: Partial<Room>): Room | undefined {
    const room = this.rooms.get(code);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(code, updatedRoom);
    return updatedRoom;
  }

  deleteRoom(code: string): void {
    this.rooms.delete(code);
    this.pendingJoinRequests.delete(code);
    this.bannedUsers.delete(code);
  }

  addParticipant(roomCode: string, participant: Participant): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    
    room.participants.push(participant);
    this.rooms.set(roomCode, room);
  }

  removeParticipant(roomCode: string, participantId: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    
    room.participants = room.participants.filter(p => p.id !== participantId);
    this.rooms.set(roomCode, room);
  }

  updateParticipant(roomCode: string, participantId: string, updates: Partial<Participant>): Participant | undefined {
    const room = this.rooms.get(roomCode);
    if (!room) return undefined;
    
    const participantIndex = room.participants.findIndex(p => p.id === participantId);
    if (participantIndex === -1) return undefined;
    
    const updatedParticipant = { ...room.participants[participantIndex], ...updates };
    room.participants[participantIndex] = updatedParticipant;
    this.rooms.set(roomCode, room);
    return updatedParticipant;
  }

  getParticipant(roomCode: string, participantId: string): Participant | undefined {
    const room = this.rooms.get(roomCode);
    if (!room) return undefined;
    return room.participants.find(p => p.id === participantId);
  }

  addMessage(roomCode: string, message: Message): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    
    room.messages.push(message);
    this.rooms.set(roomCode, room);
  }

  addReaction(roomCode: string, reaction: ReactionOverlay): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    
    room.reactions.push(reaction);
    this.rooms.set(roomCode, room);
  }

  addPendingJoinRequest(roomCode: string, participant: Omit<Participant, "id">): void {
    this.pendingJoinRequests.set(roomCode, participant);
  }

  getPendingJoinRequest(roomCode: string): Omit<Participant, "id"> | undefined {
    return this.pendingJoinRequests.get(roomCode);
  }

  clearPendingJoinRequest(roomCode: string): void {
    this.pendingJoinRequests.delete(roomCode);
  }

  banUser(roomCode: string, participantId: string): void {
    if (!this.bannedUsers.has(roomCode)) {
      this.bannedUsers.set(roomCode, new Set());
    }
    this.bannedUsers.get(roomCode)!.add(participantId);
  }

  isBanned(roomCode: string, userId: string): boolean {
    return this.bannedUsers.get(roomCode)?.has(userId) || false;
  }
}

export const storage = new MemStorage();
