require("dotenv").config({ path: "config.env" });
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const path = require("path/posix");

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});

const chatSchema = new mongoose.Schema({
  sender: { type: String, enum: ["Adarsh", "Harsh", "Mridul"], required: true },
  message: String,
  roomId: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

app.get("/chats/:roomId", async (req, res) => {
  const messages = await Chat.find({ roomId: req.params.roomId }).sort({
    timestamp: 1,
  });
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("➕", socket.id, "connected");

  socket.on("status", ({ user, status }) => {
    socket.broadcast.emit("status", { user, status });
  });

  socket.on("disconnect", () => {
    console.log("➖", socket.id, "disconnected");
  });

  function getRoomId(user1, user2) {
    return [user1, user2].sort().join("_");
  }

  socket.on("join", ({ roomId, user }) => {
    if (!["Adarsh", "Harsh", "Mridul"].includes(user)) {
      socket.emit("error", "Unauthorized user");
      return;
    }

    socket.join(roomId);
    console.log(`${user} joined room ${roomId}`);
    socket.to(roomId).emit("system", `${user} joined the chat`);
  });

  socket.on("chat", async ({ roomId, user, message }) => {
    const chat = new Chat({ roomId, sender: user, message });
    await chat.save();

    io.to(roomId).emit("chat", {
      user,
      message,
      timestamp: new Date(),
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`),
);
