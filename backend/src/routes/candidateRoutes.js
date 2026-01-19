import express, { json } from "express";
import { connection } from "../config/db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM candidate_info INNER JOIN users ON candidate_info.user_id = users.id WHERE users.role NOT IN ('admin','employer')"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/filltred", async (req, res) => {
  const { location, technologia } = req.body;

  let sql = `
    SELECT *
    FROM candidate_info
    INNER JOIN users ON candidate_info.user_id = users.id
    WHERE users.role = 'candidate'
  `;

  const params = [];

  if (location?.trim()) {
    sql += " AND candidate_info.locations LIKE ?";
    params.push(`%${location}%`);
  }

  if (technologia?.trim()) {
    sql += " AND candidate_info.skills LIKE ?";
    params.push(`%${technologia}%`);
  }

  try {
    const [rows] = await connection.query(sql, params);
    res.json(rows); // ✅ TO JEST KLUCZ
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});
export default router;
