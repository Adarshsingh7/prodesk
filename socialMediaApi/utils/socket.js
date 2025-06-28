import app from "../app.js";
import Message from "../models/message.model.js";
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", async (userId) => {
    await UserSocket.findOneAndUpdate(
      { userId },
      { socketId: socket.id, lastActive: new Date() },
      { upsert: true, new: true },
    );
  });

  socket.on("send_message", async ({ toUserId, message }) => {
    const target = await UserSocket.findOne({ userId: toUserId });
    if (target) {
      io.to(target.socketId).emit("receive_message", {
        fromUserId: toUserId,
        message,
      });
    } else {
      console.log("User not online or socket not found");
    }
  });

  socket.on("disconnect", async () => {
    await UserSocket.findOneAndDelete({ socketId: socket.id });
  });
});

export { server, io };
