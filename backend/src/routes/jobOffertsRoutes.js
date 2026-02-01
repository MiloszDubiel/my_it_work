import express from "express";
import dotenv from "dotenv";
import { getAllOfferts } from "../services/jobOffertsService.js";
import { getFillteredOfferts } from "../services/jobOffertsService.js";
import { connection } from "../config/db.js";
import { authenticateToken } from "../middleware/authJwt.js";
import { requireRole } from "../middleware/authJwt.js";

const router = express.Router();
dotenv.config();

router.post("/filltred", async (req, res) => {
  try {
    const { state } = req.body;
    const rows = await getFillteredOfferts(state);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await getAllOfferts();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/favorites",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { user_id, offer_id } = req.body;

    try {
      await connection.query(
        "INSERT IGNORE INTO favorites (user_id, offer_id) VALUES (?, ?)",
        [user_id, offer_id],
      );
      res.json({ success: true, message: "Dodano do ulubionych" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd podczas dodawania do ulubionych" });
    }
  },
);

router.delete(
  "/favorites/:user_id/:offer_id",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { user_id, offer_id } = req.params;

    try {
      await connection.query(
        "DELETE FROM favorites WHERE user_id = ? AND offer_id = ?",
        [user_id, offer_id],
      );
      res.json({ success: true, message: "Usunięto z ulubionych" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd podczas usuwania z ulubionych" });
    }
  },
);

router.get(
  "/favorites/:user_id/:offer_id",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { user_id, offer_id } = req.params;

    try {
      const [rows] = await connection.query(
        "SELECT * FROM favorites WHERE user_id = ? AND offer_id = ?",
        [user_id, offer_id],
      );

      res.json({ isFavorite: rows.length > 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd przy sprawdzaniu ulubionych" });
    }
  },
);

router.post(
  "/add",
  authenticateToken,
  requireRole("employer", "admin"),
  async (req, res) => {
    const {
      employer_id,
      title,
      company,
      location,
      salary_min,
      salary_max,
      contract_type,
      description,
      requirements,
      responsibilities,
      benefits,
      company_id,
      technologies,
      experience,
      date,
    } = req.body;

    if (!employer_id || !title || !date) {
      return res.status(400).json({ error: "Brak wymaganych pól!" });
    }

    const conn = await connection.getConnection();
    await conn.beginTransaction();

    try {
      const [jobOfferResult] = await conn.query(
        `
      INSERT INTO job_offers 
      (title, company_id, companyName, workingMode, contractType, experience, technologies, salary, is_active, type, source, employer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?, ?)
      `,
        [
          title,
          company_id,
          company,
          JSON.stringify([location ? location : ""]),
          JSON.stringify([contract_type ? contract_type : ""]),
          JSON.stringify([experience ? experience : ""]),
          JSON.stringify(technologies || []),
          `${salary_min} - ${salary_max}`,
          0,
          "own",
          "user",
          employer_id,
        ],
      );

      const offerId = jobOfferResult.insertId;
      await conn.query(
        `
      INSERT INTO job_details
      (job_offer_id, description, requirements, benefits, responsibilities, active_to)
      VALUES (?, ?,?, ?, ?, ?)
      `,
        [
          offerId,
          description,
          requirements || "",
          benefits || "",
          responsibilities || "",
          date,
        ],
      );

      await conn.commit();

      res.json({
        success: true,
        offer_id: offerId,
        message: "Oferta została dodana",
      });
    } catch (err) {
      await conn.rollback();
      console.error("Błąd podczas dodawania oferty:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      conn.release();
    }
  },
);

router.delete(
  "/delete/:id",
  authenticateToken,
  requireRole("employer", "admin"),
  async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Brak wymaganych pól!" });
    }
    console.log(id);

    const conn = await connection.getConnection();
    await conn.beginTransaction();

    try {
      const [jobOfferResult] = await conn.query(
        `
      DELETE FROM job_offers WHERE id = ?
      `,
        [id],
      );

      await conn.commit();

      res.json({
        success: true,
        message: "Oferta została usunięta",
      });
    } catch (err) {
      await conn.rollback();
      console.error("Błąd podczas usuwania oferty:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      conn.release();
    }
  },
);

router.post(
  "/update",
  authenticateToken,
  requireRole("employer", "admin"),
  async (req, res) => {
    const {
      offer_id,
      title,
      company,
      location,
      salary_min,
      salary_max,
      contract_type,
      description,
      requirements,
      responsibilities,
      benefits,
      company_id,
      technologies,
      experience,
      date,
    } = req.body;

    if (!offer_id || !title || !date) {
      return res.status(400).json({ error: "Brak wymaganych pól!" });
    }

    const conn = await connection.getConnection();
    await conn.beginTransaction();

    try {
      const [jobOfferResult] = await conn.query(
        `
      UPDATE job_offers SET title = ?, companyName = ?, workingMode = ?, contractType= ?, experience = ? , technologies = ?, salary = ?, is_active = 0, date = ? WHERE id = ? 
      `,
        [
          title,
          company,
          JSON.stringify([location ? location : ""]),
          JSON.stringify([contract_type ? contract_type : ""]),
          JSON.stringify([experience ? experience : ""]),
          JSON.stringify(technologies || []),
          `${salary_min} - ${salary_max}`,
          date,
          offer_id,
        ],
      );

      await conn.query(
        `
      UPDATE job_details SET description = ? ,requirements = ?, benefits = ? , responsibilities = ?, active_to = ?
      WHERE job_offer_id = ? 
      `,
        [
          description,
          requirements || "",
          benefits || "",
          responsibilities || "",
          date,
          offer_id,
        ],
      );

      await conn.commit();

      res.status(200).json({
        success: true,
        message: "Oferta została zaaktualizowana",
      });
    } catch (err) {
      await conn.rollback();
      console.error("Błąd podczas dodawania oferty:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      conn.release();
    }
  },
);

router.post(
  "/applications",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { user_id, offer_id } = req.body;
    console.log(user_id, offer_id);

    try {
      await connection.query(
        "INSERT INTO job_applications (user_id, offer_id) VALUES (?, ?)",
        [user_id, offer_id],
      );
      res.json({ message: "Aplikacja została dodana" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

router.get(
  "/applications/:userId/:offerId",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { userId, offerId } = req.params;
    try {
      const [rows] = await connection.query(
        "SELECT created_at FROM job_applications WHERE user_id = ? AND offer_id = ? AND status <> 'anulowana'",
        [userId, offerId],
      );
      if (rows.length > 0) {
        res.json({ applied: true, applied_at: rows[0].created_at });
      } else {
        res.json({ applied: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);
export default router;
