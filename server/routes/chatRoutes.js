import express from "express";
import { connection } from "../config/db.js";
const router = express.Router();

// ====== API REST (np. do pobrania historii wiadomości) ======
router.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  console.log(conversationId);

  const [rows] = await connection.query(
    "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
    [conversationId]
  );

  res.json(rows);
});
// 📨 Pobierz listę rozmów użytkownika (dla pracodawcy lub kandydata)
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await connection.query(
      `
      SELECT c.*, 
             u1.name AS employer_name, 
             u2.name AS candidate_name
      FROM conversations c
      JOIN users u1 ON u1.id = c.employer_id
      JOIN users u2 ON u2.id = c.candidate_id
      WHERE c.employer_id = ? OR c.candidate_id = ?
      ORDER BY c.created_at DESC
      `,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Błąd pobierania rozmów:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 📬 Utwórz nową konwersację (jeśli nie istnieje)
router.post("/conversation/start", async (req, res) => {
  const { employer_id, candidate_id } = req.body;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM conversations WHERE employer_id = ? AND candidate_id = ?",
      [employer_id, candidate_id]
    );

    if (rows.length > 0) return res.json(rows[0]);

    const [result] = await connection.query(
      "INSERT INTO conversations (employer_id, candidate_id) VALUES (?, ?)",
      [employer_id, candidate_id]
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

    // Czy istnieje konwersacja?
    const [existing] = await connection.query(
      "SELECT * FROM conversations WHERE employer_id = ? AND candidate_id = ? LIMIT 1",
      [employer_id, candidate_id]
    );

    if (existing.length) {
      return res.json(existing[0]);
    }

    // Tworzenie nowej konwersacji
    const [result] = await connection.query(
      "INSERT INTO conversations (employer_id, candidate_id) VALUES (?, ?)",
      [employer_id, candidate_id]
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
