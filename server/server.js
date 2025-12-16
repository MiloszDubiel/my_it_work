import express from "express";
import cors from "cors";
import jobOffertsRoutes from "./routes//jobOffertsRoutes.js";
import employersRoutes from "./routes/employersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingRoute from "./routes/settingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import http from "http";
import { connection } from "./config/db.js";

import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/job-offerts", jobOffertsRoutes);
app.use("/api/employers", employersRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/auth", authRoutes);
app.use("/user", settingRoute);
app.use("/messager", chatRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", chatRoutes);


app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);

// ✅ Konfiguracja Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Użytkownik połączony:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`👥 Użytkownik dołączył do konwersacji ${conversationId}`);
  });

  socket.on("send_message", async ({ conversation_id, sender_id, content }) => {
    const [result] = await connection.query(
      "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)",
      [conversation_id, sender_id, content]
    );

    const message = {
      id: result.insertId,
      conversation_id,
      sender_id,
      content,
      created_at: new Date(),
    };

    io.to(conversation_id).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Użytkownik odłączony:", socket.id);
  });
});

server.listen(5001, () => console.log("Server działa na porcie 5001"));
app.listen(PORT, () => console.log(`Serwer działa na porcie: ${PORT}`));
