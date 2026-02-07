import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { connection } from "./src/config/db.js";
import jobOffertsRoutes from "./src/routes/jobOffertsRoutes.js";
import employersRoutes from "./src/routes/employersRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import settingRoute from "./src/routes/settingRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import candidateRoutes from "./src/routes/candidateRoutes.js";
import statsRoutes from "./src/routes/statsRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/job-offerts", jobOffertsRoutes);
app.use("/api/employers", employersRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/auth", authRoutes);
app.use("/user", settingRoute);
app.use("/chat", chatRoutes);
app.use("/admin", adminRoutes);
app.use("/api/stats", statsRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join_user_room", (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on(
    "send_message",
    async ({ conversation_id, sender_id, content }) => {
      try {
        const [result] = await connection.query(
          `INSERT INTO messages 
           (conversation_id, sender_id, content, is_read)
           VALUES (?, ?, ?, false)`,
          [conversation_id, sender_id, content]
        );

        const message = {
          id: result.insertId,
          conversation_id,
          sender_id,
          content,
          is_read: false,
          created_at: new Date(),
        };

        io.to(`conversation_${conversation_id}`).emit(
          "receive_message",
          message
        );

        io.emit("new_message_notification", {
          conversationId: conversation_id,
          senderId: sender_id,
        });
      } catch (err) {
        console.error("❌ send_message error:", err);
      }
    }
  );


socket.on("accept_application", async ({ app_id, candidate_id, employer_id }) => {
    try {
      await connection.query(
        "UPDATE job_applications SET status = 'zaakceptowana' WHERE id = ?",
        [app_id]
      );

      const [rows] = await connection.query(
        `SELECT  job_applications.id, job_offers.title, job_offers.companyName, job_applications.created_at, job_applications.status, companies.owner_id
       FROM job_applications
       JOIN job_offers ON job_applications.offer_id = job_offers.id
       JOIN companies ON job_offers.company_id = companies.id
       WHERE job_applications.user_id = ?
       ORDER BY created_at DESC`,
        [candidate_id]
      );
      const updatedApp = rows[0];

      io.to(`user_${candidate_id}`).emit("application_updated", updatedApp);
      io.to(`user_${employer_id}`).emit("application_updated", updatedApp);

    } catch (err) {
      console.error("Błąd przy akceptowaniu aplikacji:", err);
    }
  });

  socket.on("reject_application", async ({ app_id, candidate_id, employer_id }) => {
    try {
      await connection.query(
        "UPDATE job_applications SET status = 'odrzucono' WHERE id = ?",
        [app_id]
      );

       const [rows] = await connection.query(
        `SELECT  job_applications.id, job_offers.title, job_offers.companyName, job_applications.created_at, job_applications.status, companies.owner_id
       FROM job_applications
       JOIN job_offers ON job_applications.offer_id = job_offers.id
       JOIN companies ON job_offers.company_id = companies.id
       WHERE job_applications.user_id = ?
       ORDER BY created_at DESC`,
        [candidate_id]
      );
      const updatedApp = rows[0];

      io.to(`user_${candidate_id}`).emit("application_updated", updatedApp);
      io.to(`user_${employer_id}`).emit("application_updated", updatedApp);

    } catch (err) {
      console.error("Błąd przy odrzuceniu aplikacji:", err);
    }
  });
  
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
  });
  
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

if (process.env.NODE_ENV !== "test") {
  server.listen(5001, () =>
    console.log("🧠 Socket server działa na 5001")
  );
  app.listen(PORT, () =>
    console.log(`🚀 API działa na porcie ${PORT}`)
  );
}

export { app };