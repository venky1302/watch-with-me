import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import {
  createRoomSchema,
  joinRoomSchema,
  sendMessageSchema,
  setVideoSourceSchema,
  videoControlSchema,
  participantActionSchema,
  type Participant,
  type Message,
  type ReactionOverlay,
} from "@shared/schema";

interface ExtendedWebSocket extends WebSocket {
  roomCode?: string;
  participantId?: string;
  isAlive?: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server on /ws path (to avoid conflict with Vite's HMR)
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store room connections: roomCode -> Set of WebSocket clients
  const roomConnections = new Map<string, Set<ExtendedWebSocket>>();

  // Heartbeat to detect disconnected clients
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const socket = ws as ExtendedWebSocket;
      if (socket.isAlive === false) {
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  wss.on('connection', (ws: ExtendedWebSocket) => {
    ws.isAlive = true;
    
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, data: payload } = message;

        switch (type) {
          case 'create-room': {
            const parsed = createRoomSchema.parse(payload);
            
            // Create participant (host)
            const participantId = nanoid();
            const participant: Participant = {
              id: participantId,
              name: parsed.userName,
              avatar: parsed.avatar,
              isHost: true,
              isMuted: false,
              isCameraOff: true,
              joinedAt: Date.now(),
            };

            // Create room
            const room = storage.createRoom({
              name: parsed.roomName,
              hostId: participantId,
              videoSource: null,
              participants: [participant],
              messages: [],
              reactions: [],
              videoState: {
                isPlaying: false,
                currentTime: 0,
                lastUpdate: Date.now(),
              },
            });

            // Associate WebSocket with room and participant
            ws.roomCode = room.code;
            ws.participantId = participantId;

            // Add to room connections
            if (!roomConnections.has(room.code)) {
              roomConnections.set(room.code, new Set());
            }
            roomConnections.get(room.code)!.add(ws);

            // Send room created event
            ws.send(JSON.stringify({
              type: 'room-created',
              data: { room, participantId }
            }));
            break;
          }

          case 'join-room': {
            const parsed = joinRoomSchema.parse(payload);
            const room = storage.getRoom(parsed.roomCode);

            if (!room) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Room not found' }
              }));
              break;
            }

            // Create pending participant
            const pendingParticipant: Omit<Participant, "id"> = {
              name: parsed.userName,
              avatar: parsed.avatar,
              isHost: false,
              isMuted: false,
              isCameraOff: true,
              joinedAt: Date.now(),
            };

            // Store pending join request
            storage.addPendingJoinRequest(room.code, pendingParticipant);
            ws.roomCode = room.code;

            // Notify host about join request
            const hostSocket = Array.from(roomConnections.get(room.code) || [])
              .find(s => s.participantId === room.hostId);
            
            if (hostSocket && hostSocket.readyState === WebSocket.OPEN) {
              hostSocket.send(JSON.stringify({
                type: 'join-request',
                data: { participant: pendingParticipant }
              }));
            }
            break;
          }

          case 'approve-join': {
            const roomCode = ws.roomCode;
            if (!roomCode) break;

            const room = storage.getRoom(roomCode);
            const pendingParticipant = storage.getPendingJoinRequest(roomCode);
            
            if (!room || !pendingParticipant) break;

            // Create participant with ID
            const participantId = nanoid();
            const participant: Participant = {
              ...pendingParticipant,
              id: participantId,
            };

            // Add participant to room
            storage.addParticipant(roomCode, participant);
            const updatedRoom = storage.getRoom(roomCode);

            // Clear pending request
            storage.clearPendingJoinRequest(roomCode);

            // Find the joining client's WebSocket
            const joiningSocket = Array.from(wss.clients)
              .find((s) => {
                const socket = s as ExtendedWebSocket;
                return socket.roomCode === roomCode && !socket.participantId;
              }) as ExtendedWebSocket | undefined;

            if (joiningSocket && joiningSocket.readyState === WebSocket.OPEN) {
              joiningSocket.participantId = participantId;
              
              // Add to room connections
              if (!roomConnections.has(roomCode)) {
                roomConnections.set(roomCode, new Set());
              }
              roomConnections.get(roomCode)!.add(joiningSocket);

              // Send approval to joining client
              joiningSocket.send(JSON.stringify({
                type: 'join-approved',
                data: { room: updatedRoom, participantId }
              }));

              // Notify all participants in room about new participant
              broadcastToRoom(roomCode, {
                type: 'participant-joined',
                data: { participant }
              }, joiningSocket);
            }
            break;
          }

          case 'deny-join': {
            const roomCode = ws.roomCode;
            if (!roomCode) break;

            storage.clearPendingJoinRequest(roomCode);

            // Find and notify the joining client
            const joiningSocket = Array.from(wss.clients)
              .find((s) => {
                const socket = s as ExtendedWebSocket;
                return socket.roomCode === roomCode && !socket.participantId;
              }) as ExtendedWebSocket | undefined;

            if (joiningSocket && joiningSocket.readyState === WebSocket.OPEN) {
              joiningSocket.send(JSON.stringify({
                type: 'join-denied',
                data: { reason: 'The host denied your request to join' }
              }));
              joiningSocket.close();
            }
            break;
          }

          case 'send-message': {
            const parsed = sendMessageSchema.parse(payload);
            const roomCode = ws.roomCode;
            const participantId = ws.participantId;

            if (!roomCode || !participantId) break;

            const participant = storage.getParticipant(roomCode, participantId);
            if (!participant) break;

            if (parsed.type === 'reaction') {
              // Create reaction overlay
              const reaction: ReactionOverlay = {
                id: nanoid(),
                participantId,
                participantName: participant.name,
                emoji: parsed.content,
                timestamp: Date.now(),
              };

              storage.addReaction(roomCode, reaction);

              // Broadcast reaction to all in room
              broadcastToRoom(roomCode, {
                type: 'reaction-added',
                data: { reaction }
              });
            } else {
              // Create chat message
              const chatMessage: Message = {
                id: nanoid(),
                participantId,
                participantName: participant.name,
                participantAvatar: participant.avatar,
                content: parsed.content,
                timestamp: Date.now(),
                type: parsed.type,
              };

              storage.addMessage(roomCode, chatMessage);

              // Broadcast message to all in room
              broadcastToRoom(roomCode, {
                type: 'message-received',
                data: { message: chatMessage }
              });
            }
            break;
          }

          case 'set-video-source': {
            const parsed = setVideoSourceSchema.parse(payload);
            const roomCode = ws.roomCode;
            const participantId = ws.participantId;

            if (!roomCode || !participantId) break;

            const room = storage.getRoom(roomCode);
            if (!room || room.hostId !== participantId) break;

            // Update room's video source
            storage.updateRoom(roomCode, { videoSource: parsed.source });

            // Broadcast to all in room
            broadcastToRoom(roomCode, {
              type: 'video-source-updated',
              data: { source: parsed.source }
            });
            break;
          }

          case 'video-control': {
            const parsed = videoControlSchema.parse(payload);
            const roomCode = ws.roomCode;
            const participantId = ws.participantId;

            if (!roomCode || !participantId) break;

            const room = storage.getRoom(roomCode);
            if (!room || room.hostId !== participantId) break;

            // Update video state
            const videoState = {
              isPlaying: parsed.action === 'play',
              currentTime: parsed.currentTime ?? room.videoState.currentTime,
              lastUpdate: Date.now(),
            };
            storage.updateRoom(roomCode, { videoState });

            // Broadcast to all in room
            broadcastToRoom(roomCode, {
              type: 'video-control',
              data: parsed
            });
            break;
          }

          case 'participant-action': {
            const parsed = participantActionSchema.parse(payload);
            const roomCode = ws.roomCode;
            const hostId = ws.participantId;

            if (!roomCode || !hostId) break;

            const room = storage.getRoom(roomCode);
            if (!room || room.hostId !== hostId) break;

            const targetParticipant = storage.getParticipant(roomCode, parsed.participantId);
            if (!targetParticipant) break;

            switch (parsed.action) {
              case 'mute':
              case 'unmute': {
                const updated = storage.updateParticipant(roomCode, parsed.participantId, {
                  isMuted: parsed.action === 'mute'
                });
                if (updated) {
                  broadcastToRoom(roomCode, {
                    type: 'participant-updated',
                    data: { participant: updated }
                  });
                }
                break;
              }

              case 'kick': {
                // Remove participant
                storage.removeParticipant(roomCode, parsed.participantId);

                // Find and close their WebSocket
                const targetSocket = Array.from(roomConnections.get(roomCode) || [])
                  .find(s => s.participantId === parsed.participantId);
                
                if (targetSocket) {
                  roomConnections.get(roomCode)?.delete(targetSocket);
                  if (targetSocket.readyState === WebSocket.OPEN) {
                    targetSocket.send(JSON.stringify({
                      type: 'room-closed',
                      data: {}
                    }));
                  }
                  targetSocket.close();
                }

                // Notify others
                broadcastToRoom(roomCode, {
                  type: 'participant-left',
                  data: { participantId: parsed.participantId }
                });
                break;
              }

              case 'ban': {
                // Ban and remove participant
                storage.banUser(roomCode, parsed.participantId);
                storage.removeParticipant(roomCode, parsed.participantId);

                // Find and close their WebSocket
                const targetSocket = Array.from(roomConnections.get(roomCode) || [])
                  .find(s => s.participantId === parsed.participantId);
                
                if (targetSocket) {
                  roomConnections.get(roomCode)?.delete(targetSocket);
                  if (targetSocket.readyState === WebSocket.OPEN) {
                    targetSocket.send(JSON.stringify({
                      type: 'room-closed',
                      data: {}
                    }));
                  }
                  targetSocket.close();
                }

                // Notify others
                broadcastToRoom(roomCode, {
                  type: 'participant-left',
                  data: { participantId: parsed.participantId }
                });
                break;
              }

              case 'transfer-host': {
                // Transfer host role
                const oldHost = storage.updateParticipant(roomCode, hostId, { isHost: false });
                const newHost = storage.updateParticipant(roomCode, parsed.participantId, { isHost: true });
                
                if (oldHost && newHost) {
                  storage.updateRoom(roomCode, { hostId: parsed.participantId });
                  
                  broadcastToRoom(roomCode, {
                    type: 'participant-updated',
                    data: { participant: oldHost }
                  });
                  broadcastToRoom(roomCode, {
                    type: 'participant-updated',
                    data: { participant: newHost }
                  });
                }
                break;
              }
            }
            break;
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Invalid request' }
        }));
      }
    });

    ws.on('close', () => {
      const roomCode = ws.roomCode;
      const participantId = ws.participantId;

      if (roomCode && participantId) {
        const room = storage.getRoom(roomCode);
        
        if (room) {
          // Remove from room connections
          roomConnections.get(roomCode)?.delete(ws);

          // If host left, close the room
          if (room.hostId === participantId) {
            broadcastToRoom(roomCode, {
              type: 'room-closed',
              data: {}
            });
            
            // Close all connections and delete room
            roomConnections.get(roomCode)?.forEach(socket => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.close();
              }
            });
            roomConnections.delete(roomCode);
            storage.deleteRoom(roomCode);
          } else {
            // Regular participant left
            storage.removeParticipant(roomCode, participantId);
            broadcastToRoom(roomCode, {
              type: 'participant-left',
              data: { participantId }
            });
          }
        }
      }
    });
  });

  // Helper function to broadcast message to all clients in a room
  function broadcastToRoom(roomCode: string, message: any, excludeSocket?: ExtendedWebSocket) {
    const connections = roomConnections.get(roomCode);
    if (!connections) return;

    const messageStr = JSON.stringify(message);
    connections.forEach((socket) => {
      if (socket !== excludeSocket && socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
      }
    });
  }

  return httpServer;
}
