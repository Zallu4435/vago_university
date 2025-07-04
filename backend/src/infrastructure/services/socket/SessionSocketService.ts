import { Server } from 'socket.io';
import { VideoSessionModel } from '../../database/mongoose/models/session.model';
import type { Socket as IOSocket } from 'socket.io';

// In-memory participant tracking per session
const sessionParticipants = {};

// Extend the Socket type to allow userId property
declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

export const setupSessionSocketHandlers = (io: Server) => {
  console.log('[SessionSocketService] Registering session event handlers...');
  
  io.on('connection', (socket) => {
    console.log('[SessionSocketService] New socket connected:', socket.id);
    socket.userId = socket.handshake.auth.userId;

    let currentUserId = null;
    let currentSessionId = null;
    let currentUserName = null;
    let currentIsHost = false;

    socket.on('join-room', async (sessionId: string, user: any) => {
      try {
        currentUserId = user.userId;
        socket.userId = currentUserId;
        currentSessionId = sessionId;
        currentUserName = user.username;
        currentIsHost = !!user.isHost;
        
        console.log(`[SessionSocketService] User joining room: ${user.username} (${user.userId}) -> ${sessionId}`);
        
        // Join the socket room
        socket.join(sessionId);

        // Track participants in memory
        if (!sessionParticipants[sessionId]) {
          sessionParticipants[sessionId] = [];
        }
        
        // Only add if not already present
        if (!sessionParticipants[sessionId].some(p => p.userId === user.userId)) {
          sessionParticipants[sessionId].push({
            userId: user.userId,
            name: user.username,
            isHost: !!user.isHost,
            socketId: socket.id,
            micOn: true,
            cameraOn: true,
            handRaised: false
          });
        } else {
          // Update socket ID if user reconnects
          const existingUser = sessionParticipants[sessionId].find(p => p.userId === user.userId);
          if (existingUser) {
            existingUser.socketId = socket.id;
          }
        }

        // Send full participant list to the joining user
        socket.emit('participant-list', sessionParticipants[sessionId]);
        
        // Broadcast to others that a new user joined
        socket.to(sessionId).emit('user-joined', {
          id: user.userId,
          name: user.username,
          isHost: !!user.isHost,
          micOn: true,
          cameraOn: true,
          handRaised: false
        });

        // Update database
        const session = await VideoSessionModel.findById(sessionId);
        if (!session) {
          console.error(`[SessionSocketService] Session not found for sessionId: ${sessionId}`);
          return socket.emit('error', { message: 'Session not found' });
        }
        
        if (!session.participants.includes(user.userId)) {
          session.participants.push(user.userId);
          await session.save();
          console.log(`[SessionSocketService] User ${user.username} added to session: ${sessionId}`);
        }

        // Log current room state
        const clients = await io.in(sessionId).allSockets();
        console.log(`[SessionSocketService] Room ${sessionId} now has ${clients.size} sockets:`, Array.from(clients));
        console.log(`[SessionSocketService] Participants in memory:`, sessionParticipants[sessionId]);

      } catch (error) {
        console.error('[SessionSocketService] Error in join-room:', error);
        socket.emit('error', { message: 'Error joining room' });
      }
    });

    // WebRTC signaling handlers
    socket.on('video-offer', (data) => {
      console.log(`[SessionSocketService] Received video-offer from ${data.from} to ${data.to}`);
      
      if (data.to) {
        const targetSocketId = getSocketIdForUser(data.sessionId, data.to);
        if (targetSocketId) {
          console.log(`[SessionSocketService] Relaying video-offer to socket: ${targetSocketId}`);
          io.to(targetSocketId).emit('video-offer', data);
        } else {
          console.log(`[SessionSocketService] ERROR: No socket found for userId: ${data.to}`);
          logRoomState(data.sessionId);
        }
      } else {
        socket.to(data.sessionId).emit('video-offer', data);
      }
    });

    socket.on('video-answer', (data) => {
      console.log(`[SessionSocketService] Received video-answer from ${data.from} to ${data.to}`);
      
      if (data.to) {
        const targetSocketId = getSocketIdForUser(data.sessionId, data.to);
        if (targetSocketId) {
          console.log(`[SessionSocketService] Relaying video-answer to socket: ${targetSocketId}`);
          io.to(targetSocketId).emit('video-answer', data);
        } else {
          console.log(`[SessionSocketService] ERROR: No socket found for userId: ${data.to}`);
          logRoomState(data.sessionId);
        }
      } else {
        socket.to(data.sessionId).emit('video-answer', data);
      }
    });

    socket.on('ice-candidate', (data) => {
      console.log(`[SessionSocketService] Received ice-candidate from ${data.from} to ${data.to}`);
      
      if (data.to) {
        const targetSocketId = getSocketIdForUser(data.sessionId, data.to);
        if (targetSocketId) {
          console.log(`[SessionSocketService] Relaying ice-candidate to socket: ${targetSocketId}`);
          io.to(targetSocketId).emit('ice-candidate', data);
        } else {
          console.log(`[SessionSocketService] ERROR: No socket found for userId: ${data.to}`);
          logRoomState(data.sessionId);
        }
      } else {
        socket.to(data.sessionId).emit('ice-candidate', data);
      }
    });

    // Media state changes (mic, camera)
    socket.on('media-state-changed', (data) => {
      console.log(`[SessionSocketService] media-state-changed event:`, data);
      
      // Update participant in memory
      if (sessionParticipants[data.sessionId]) {
        const participant = sessionParticipants[data.sessionId].find(p => p.userId === data.userId);
        if (participant) {
          participant.micOn = data.micOn;
          participant.cameraOn = data.cameraOn;
        }
      }
      
      // Broadcast to all other participants
      socket.to(data.sessionId).emit('media-state-changed', data);
    });

    // Hand raise/lower
    socket.on('hand-raise-changed', (data) => {
      console.log(`[SessionSocketService] hand-raise-changed event:`, data);
      
      // Update participant in memory
      if (sessionParticipants[data.sessionId]) {
        const participant = sessionParticipants[data.sessionId].find(p => p.userId === data.userId);
        if (participant) {
          participant.handRaised = data.handRaised;
        }
      }
      
      // Broadcast to all other participants
      socket.to(data.sessionId).emit('hand-raise-changed', {
        userId: data.userId,
        userName: data.userName,
        handRaised: data.handRaised,
        sessionId: data.sessionId
      });
    });

    // Emoji reactions
    socket.on('send-reaction', (data) => {
      console.log(`[SessionSocketService] send-reaction event:`, data);
      
      // Broadcast reaction to all participants including sender
      io.to(data.sessionId).emit('reaction-received', {
        id: Date.now().toString() + Math.random(),
        emoji: data.emoji,
        userId: data.userId,
        userName: data.userName,
        timestamp: Date.now(),
        sessionId: data.sessionId
      });
    });

    // Chat messages
    socket.on('send-message', (data) => {
      console.log(`[SessionSocketService] send-message event:`, data);
      
      // Broadcast message to all participants
      io.to(data.sessionId).emit('message-received', {
        id: Date.now().toString() + Math.random(),
        userId: data.userId,
        userName: data.userName,
        text: data.message,
        timestamp: new Date().toISOString(),
        sessionId: data.sessionId
      });
    });

    // Screen sharing
    socket.on('screen-share-started', (data) => {
      console.log(`[SessionSocketService] screen-share-started event:`, data);
      
      // Update participant in memory
      if (sessionParticipants[data.sessionId]) {
        const participant = sessionParticipants[data.sessionId].find(p => p.userId === data.userId);
        if (participant) {
          participant.isPresenting = true;
        }
      }
      
      // Broadcast to all other participants
      socket.to(data.sessionId).emit('screen-share-started', {
        userId: data.userId,
        userName: data.userName,
        sessionId: data.sessionId
      });
    });

    socket.on('screen-share-stopped', (data) => {
      console.log(`[SessionSocketService] screen-share-stopped event:`, data);
      
      // Update participant in memory
      if (sessionParticipants[data.sessionId]) {
        const participant = sessionParticipants[data.sessionId].find(p => p.userId === data.userId);
        if (participant) {
          participant.isPresenting = false;
        }
      }
      
      // Broadcast to all other participants
      socket.to(data.sessionId).emit('screen-share-stopped', {
        userId: data.userId,
        userName: data.userName,
        sessionId: data.sessionId
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[SessionSocketService] Socket ${socket.id} disconnected. Reason: ${reason}`);
      
      if (currentUserId && currentSessionId) {
        // Remove from in-memory participants
        if (sessionParticipants[currentSessionId]) {
          sessionParticipants[currentSessionId] = sessionParticipants[currentSessionId].filter(p => p.userId !== currentUserId);
          console.log(`[SessionSocketService] Removed user ${currentUserId} from session ${currentSessionId}`);
        }
        
        // Broadcast user-left to remaining participants
        socket.to(currentSessionId).emit('user-left', { 
          userId: currentUserId,
          userName: currentUserName 
        });
      }
    });

    // Helper to log room state for debugging
    function logRoomState(sessionId: string) {
      console.log(`[SessionSocketService] === Room State Debug for ${sessionId} ===`);
      console.log('Participants in memory:', sessionParticipants[sessionId]);
      
      const sockets = Array.from(Object.values(io.sockets.sockets));
      console.log('All connected sockets:', sockets.map(s => ({
        id: s.id,
        userId: s.userId,
        rooms: Array.from(s.rooms)
      })));
      
      console.log('Sockets in this room:', sockets.filter(s => s.rooms.has(sessionId)).map(s => ({
        id: s.id,
        userId: s.userId
      })));
    }
  });

  // Helper to map userId to socketId for a session
  function getSocketIdForUser(sessionId: string, userId: string): string | null {
    // First, try to get from in-memory participants (includes socketId)
    const participants = sessionParticipants[sessionId];
    if (participants) {
      const participant = participants.find(p => p.userId === userId);
      if (participant && participant.socketId) {
        // Verify the socket still exists and is in the room
        const socket = io.sockets.sockets.get(participant.socketId);
        if (socket && socket.rooms.has(sessionId)) {
          return participant.socketId;
        }
      }
    }

    // Fallback: search through all sockets
    const sockets = Array.from(Object.values(io.sockets.sockets));
    for (const socket of sockets) {
      if (socket.rooms.has(sessionId) && socket.userId === userId) {
        console.log(`[getSocketIdForUser] Found socket via fallback for userId ${userId}: ${socket.id}`);
        return socket.id;
      }
    }

    console.log(`[getSocketIdForUser] No socket found for userId: ${userId} in sessionId: ${sessionId}`);
    return null;
  }
};