import express from "express";
import { connection } from "../config/db.js";
const router = express.Router();

/* OFERTY */
router.get("/offers", async (req, res) => {
  const [rows] = await connection.query(`
    SELECT id, title, salary, technologies
    FROM job_offers
    WHERE salary NOT IN ('not available')
  `);
  res.json(rows);
});

/* APLIKACJE */
router.get("/applications/:userId", async (req, res) => {
  const [rows] = await connection.query(
    `
    SELECT status
    FROM job_applications
    WHERE user_id = ?
  `,
    [req.params.userId]
  );

  res.json(rows);
});

/* USER SKILLS */
router.get("/user/:id/skills", async (req, res) => {
  const [rows] = await connection.query(
    `
    SELECT users.id, skills, exp, locations
    FROM users
    INNER JOIN candidate_info ON
    users.id = candidate_info.user_id
    WHERE users.id = ?
  `,
    [req.params.id]
  );

  res.json(rows[0]);
});

export default router;
