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

export default router;
