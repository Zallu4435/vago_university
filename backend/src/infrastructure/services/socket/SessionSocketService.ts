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
            socketId: socket.id // Store socket ID for direct targeting
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
          isHost: !!user.isHost
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
        // Broadcast to all in room except sender
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

    socket.on('media-state-changed', (data) => {
      console.log(`[SessionSocketService] media-state-changed event:`, data);
      socket.to(data.sessionId).emit('media-state-changed', data);
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
        socket.to(currentSessionId).emit('user-left', { userId: currentUserId });
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