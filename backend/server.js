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

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join_user_room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });;

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

      const [[conversation]] = await connection.query(
        `
        SELECT employer_id, candidate_id
        FROM conversations
        WHERE id = ?
        `,
        [conversation_id]
      );

      const receiverId =
        conversation.employer_id === sender_id
          ? conversation.candidate_id
          : conversation.employer_id;

io.to(`user_${receiverId}`).emit("new_message_notification", {
  conversationId: conversation_id,
  senderId: sender_id,
  receiverId,
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
  socket.on("application_submitted", async ({ candidate_id, company_id, offer_id }) => {
  try {
    const [[offer]] = await connection.query(
      `SELECT employer_id FROM job_offers WHERE id = ?`,
      [offer_id]
    );
    const employerId = offer.employer_id;

 

    const [applications] = await connection.query(
      `SELECT
  ja.id AS app_id,
  jo.id AS offer_id,
  jo.title,
  jo.employer_id,
  u.id AS user_id,
  u.name,
  u.surname,
  u.email,
  u.avatar,
  u.phone_number,
  ci.cv,
  ci.\`references\`,
  ci.locations,
  ci.skills,
  ci.lang,
  ci.edu,
  ci.link_git,
  ci.working_mode,
  ci.present_job,
  ci.target_job,
  ci.phone_number AS candidate_phone_number,
  ci.access,
  ci.career_level,
  ci.description AS candidate_description,
  ci.years_of_experience,
  ja.status,
  ja.created_at
FROM job_applications ja
JOIN job_offers jo ON ja.offer_id = jo.id
JOIN users u ON ja.user_id = u.id
LEFT JOIN candidate_info ci ON u.id = ci.user_id
WHERE jo.employer_id = ? 
  AND ja.status NOT IN ('odrzucono', 'anulowana', 'zaakceptowana')
ORDER BY ja.created_at DESC`,
      [employerId]
    );
   

    io.to(`user_${employerId}`).emit("application_updated",  applications );





  } catch (err) {
    console.error("Błąd przy zgłaszaniu nowej aplikacji:", err);
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
    console.log("Socket server działa na 5001")
  );
  app.listen(PORT, () =>
    console.log(`API działa na porcie ${PORT}`)
  );
}


export { app };