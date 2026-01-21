const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");   

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", ({ message, roomCode }) => {
    console.log("Message:", message, "to room:", roomCode);
    socket.to(roomCode).emit("receiveMessage", message);
  });

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`${socket.id} has joined room ${roomCode}`);
    
    socket.to(roomCode).emit("userJoined", socket.id);
  });

  socket.on("leaveRoom", (roomCode) => {
    socket.leave(roomCode);
    console.log(`${socket.id} has left room ${roomCode}`);
    
    socket.emit("roomLeft", roomCode);
    
    socket.to(roomCode).emit("userLeft", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});