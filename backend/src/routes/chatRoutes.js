import express from "express";
import { connection } from "../config/db.js";
const router = express.Router();

router.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const [rows] = await connection.query(
    "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
    [conversationId],
  );

  res.json(rows);
});

router.put("/read/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { userId } = req.body;

  await connection.query(
    `UPDATE messages
SET is_read = true
WHERE conversation_id = ?
AND sender_id != ?`,
    [conversationId, userId]
  );

  res.json({ success: true });
});

router.get("/has-unread/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [[result]] = await connection.query(
      `
      SELECT COUNT(m.id) AS unreadCount
      FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.is_read = false
        AND (
          (c.employer_id = ? AND m.sender_id != ?)
          OR
          (c.candidate_id = ? AND m.sender_id != ?)
        )
      `,
      [userId, userId, userId, userId]
    );

    res.json({ hasUnread: result.unreadCount > 0 });
  } catch (err) {
    console.error("has-unread error:", err);
    res.status(500).json({ error: "Server error" });
  }

});
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await connection.query(
      `
      SELECT c.*, 
             u1.name AS employer_name, 
             u2.name AS candidate_name,
             u1.surname AS employer_surname,
             u2.surname AS candidate_surname,
             com.companyName,
             u2.email,

             -- liczba nieprzeczytanych wiadomości dla zalogowanego usera
             (SELECT COUNT(*) 
              FROM messages m
              WHERE m.conversation_id = c.id
                AND m.is_read = 0
                AND m.sender_id != ?) AS unreadCount,

             -- ostatnia wiadomość w konwersacji
             (SELECT m.sender_id
              FROM messages m
              WHERE m.conversation_id = c.id
              ORDER BY m.created_at DESC
              LIMIT 1) AS lastMessageSenderId,

             (SELECT u.name
              FROM messages m
              JOIN users u ON u.id = m.sender_id
              WHERE m.conversation_id = c.id
              ORDER BY m.created_at DESC
              LIMIT 1) AS lastMessageSenderName

      FROM conversations c
      JOIN users u1 ON u1.id = c.employer_id
      JOIN users u2 ON u2.id = c.candidate_id
      LEFT JOIN companies com ON com.owner_id = u1.id
      WHERE c.employer_id = ? OR c.candidate_id = ?
      ORDER BY c.created_at DESC
      `,
      [userId, userId, userId] 
    );

    res.json(rows);
  } catch (err) {
    console.error("Błąd pobierania rozmów:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.post("/conversation/start", async (req, res) => {
  const { employer_id, candidate_id } = req.body;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM conversations WHERE employer_id = ? AND candidate_id = ?",
      [employer_id, candidate_id],
    );

    if (rows.length > 0) return res.json(rows[0]);

    const [result] = await connection.query(
      "INSERT INTO conversations (employer_id, candidate_id) VALUES (?, ?)",
      [employer_id, candidate_id],
    );

    res.json({ id: result.insertId, employer_id, candidate_id });
  } catch (err) {
    console.error("Błąd tworzenia rozmowy:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { employer_id, candidate_id } = req.body;

    const [existing] = await connection.query(
      "SELECT * FROM conversations WHERE employer_id = ? AND candidate_id = ? LIMIT 1",
      [employer_id, candidate_id],
    );

    if (existing.length) {
      return res.json(existing[0]);
    }

    const [result] = await connection.query(
      "INSERT INTO conversations (employer_id, candidate_id) VALUES (?, ?)",
      [employer_id, candidate_id],
    );

    const newConversation = {
      id: result.insertId,
      employer_id,
      candidate_id,
    };

    return res.json(newConversation);
  } catch (err) {
    console.error("Błąd tworzenia konwersacji:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});
export default router;
