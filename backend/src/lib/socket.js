import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://fullstack-chat-app-wyak.onrender.com"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketsMap[userId];
}

//use To store Online Users and their socket IDs
const userSocketsMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketsMap[userId] = socket.id;
    console.log("User Sockets Map: ", userSocketsMap);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketsMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
    // Remove the user from the online users list
    if (userId) {
      delete userSocketsMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketsMap));
    }
  });
});

export { io, app, server };
