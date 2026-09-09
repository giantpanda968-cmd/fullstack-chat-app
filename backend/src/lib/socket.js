import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://fullstack-chat-app-wyak.onrender.com",
    ],
    credentials: true,
  },
});

const userSocketsMap = {};

export function getReceiverSocketId(userId) {
  return userSocketsMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketsMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketsMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // IMPORTANT:
    // Sirf tab remove karo jab disconnect hone wala
    // socket abhi bhi user ka current socket ho.
    if (userId && userSocketsMap[userId] === socket.id) {
      delete userSocketsMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketsMap));
  });
});

export { io, app, server };