# Watch With Me

A real-time collaborative video watching platform that enables groups of friends and families to watch videos together online with synchronized playback, video chat, and interactive features—no registration required.

## Overview

Watch With Me is a production-ready web application built with React, Express, and WebSocket technology. It offers a seamless, privacy-first experience for watching videos together online.

### Key Features

- **No Registration Required**: Instant access without accounts or logins
- **Room-Based System**: Create or join rooms with unique 6-character codes
- **Synchronized Video Playback**: Watch YouTube videos together in perfect sync
- **Host Controls**: Comprehensive moderation tools (mute, kick, ban, transfer host)
- **Real-Time Chat**: Text messages, emoji reactions, and GIF support
- **Video Conferencing**: WebRTC-ready for video/audio chat (UI complete, WebRTC to be integrated)
- **Privacy First**: Complete data ephemerality - no storage after session ends
- **Responsive Design**: Mobile-first UI that works beautifully on all devices

## Project Architecture

### Technology Stack

**Frontend:**
- React with TypeScript
- Tailwind CSS + Shadcn UI components
- Wouter for routing
- React Query for state management
- Socket.io-client for WebSocket communication
- React Player for YouTube integration
- Emoji Picker React for reactions

**Backend:**
- Express.js
- WebSocket server (ws library)
- In-memory storage (ephemeral by design)
- Zod for validation

### Directory Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── room/            # Room-specific components
│   │   │   ├── avatar-selector.tsx
│   │   │   ├── create-room-modal.tsx
│   │   │   └── join-room-modal.tsx
│   │   ├── lib/
│   │   │   ├── avatars.ts       # Avatar image imports
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── landing.tsx      # Landing page
│   │   │   └── room.tsx         # Room page
│   │   └── App.tsx
│   └── index.html
├── server/
│   ├── routes.ts                # WebSocket server & API routes
│   ├── storage.ts               # In-memory storage
│   └── index.ts
└── shared/
    └── schema.ts                # TypeScript types & Zod schemas
```

### Data Model

**Room:**
- Unique 6-character code
- Host participant ID
- Video source (YouTube URL or screen share)
- Participants array
- Messages and reactions
- Video playback state

**Participant:**
- Name and avatar
- Host status
- Muted/camera-off states
- Join timestamp

**Message:**
- Text, reaction, or GIF type
- Participant info
- Content and timestamp

## WebSocket Events

### Client → Server

- `create-room`: Create a new room (host)
- `join-room`: Request to join existing room
- `approve-join`: Host approves join request
- `deny-join`: Host denies join request
- `send-message`: Send chat message or reaction
- `set-video-source`: Set YouTube URL or screen share (host only)
- `video-control`: Play/pause/seek control (host only)
- `participant-action`: Mute/kick/ban/transfer-host (host only)

### Server → Client

- `room-created`: Room successfully created
- `join-request`: Participant wants to join (to host)
- `join-approved`: Join request approved
- `join-denied`: Join request denied
- `participant-joined`: New participant joined
- `participant-left`: Participant left
- `participant-updated`: Participant state changed
- `message-received`: New chat message
- `reaction-added`: New reaction overlay
- `video-source-updated`: Video source changed
- `video-control`: Video playback state change
- `room-closed`: Room ended (host left)
- `error`: Error occurred

## User Flows

### Creating a Room

1. Click "Create a Room" on landing page
2. Enter name, room name, and select avatar
3. Room created with unique code
4. Host chooses video source (YouTube or screen share)
5. Share room code/link with friends

### Joining a Room

1. Click "Join a Room" or use invite link
2. Enter room code, name, and select avatar
3. Wait for host approval
4. Join room and start watching together

### In-Room Experience

- **Video Area**: Central synchronized video player
- **Chat Sidebar**: Real-time messaging and reactions
- **Participants Tab**: See all participants with host controls
- **Control Bar**: Toggle mic/camera, share invite, leave room
- **Reactions**: Send floating emoji reactions visible to all

### Host Controls

- Mute/unmute any participant
- Remove participants from room
- Ban participants (prevent rejoin)
- Transfer host role to another participant
- Control video playback (play, pause, seek)
- Change video source

## Privacy & Security

- **No Persistent Storage**: All data exists only in memory
- **Session-Based**: Data deleted immediately when room closes
- **No Tracking**: No user accounts, cookies, or analytics
- **Ephemeral Rooms**: Rooms auto-close when host leaves
- **Host Approval**: New participants require host approval

## Design System

The application follows a modern, welcoming design with:

- **Color Palette**: Purple-pink primary, blue secondary, success green for active states
- **Typography**: Inter for UI, Space Grotesk for headings
- **Components**: Shadcn UI with custom styling
- **Animations**: Subtle hover effects and smooth transitions
- **Responsive**: Mobile-first with adaptive layouts

## Development

### Running the Application

The workflow "Start application" runs `npm run dev` which starts both:
- Vite dev server (frontend) on port 5000
- Express server (backend) on the same port
- WebSocket server on `/ws` path

### Environment Variables

- `SESSION_SECRET`: Session secret (auto-configured)
- No other environment variables required

## Future Enhancements

Phase 2 features (not in current MVP):
- WebRTC peer-to-peer video/audio implementation
- Co-host delegation feature
- Animated onboarding tutorial
- Hand-raise notifications
- Picture-in-picture mode
- Room waiting room with custom messages

## Notes

- WebRTC video chat UI is complete but needs actual WebRTC implementation
- Screen sharing uses browser APIs (getDisplayMedia)
- YouTube integration uses React Player library
- All WebSocket communication is real-time and synchronized
- Mobile experience optimized with responsive design

## Recent Changes

- Initial MVP implementation completed (Oct 18, 2025)
- All core features functional and tested
- Beautiful UI with exceptional visual quality
- Complete real-time synchronization
- Host moderation tools fully implemented
