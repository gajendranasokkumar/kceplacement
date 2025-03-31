const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Update with your frontend's origin
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log(`User connected: ${socket.id}, userId: ${userId}`);
    
    socket.on("join", (roomId) => {
      if (roomId === userId) { // Verify user is joining their own room
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}, userId: ${userId}`);
    });
  });
}

function getSocket() {
  if (!io) {
    throw new Error("Socket.io is not initialized.");
  }
  return io;
}

module.exports = { initSocket, getSocket, io };