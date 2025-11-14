import express from "express";
import dotenv from "dotenv";
import { getAllOfferts } from "../services/jobOffertsService.js";
import { getFillteredOfferts } from "../services/jobOffertsService.js";
import { connection } from "../config/db.js";
import { scrapeAll } from "../scrappers/jobOffertsScraper.js";

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

router.get("/scrape", async (req, res) => {
  try {
    // const { code } = req.params;
    // if (code !== process.env.KEY_TO_SCRAPE) {
    //   return res.status(403).json({ error: "Unauthorized" });
    // }
    await scrapeAll();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/favorites", async (req, res) => {
  const { user_id, offer_id } = req.body;

  try {
    await connection.query(
      "INSERT IGNORE INTO favorites (user_id, offer_id) VALUES (?, ?)",
      [user_id, offer_id]
    );
    res.json({ success: true, message: "Dodano do ulubionych" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas dodawania do ulubionych" });
  }
});

router.delete("/favorites/:user_id/:offer_id", async (req, res) => {
  const { user_id, offer_id } = req.params;

  try {
    await connection.query(
      "DELETE FROM favorites WHERE user_id = ? AND offer_id = ?",
      [user_id, offer_id]
    );
    res.json({ success: true, message: "Usunięto z ulubionych" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas usuwania z ulubionych" });
  }
});

router.get("/favorites/:user_id/:offer_id", async (req, res) => {
  const { user_id, offer_id } = req.params;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM favorites WHERE user_id = ? AND offer_id = ?",
      [user_id, offer_id]
    );

    res.json({ isFavorite: rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd przy sprawdzaniu ulubionych" });
  }
});
router.post("/add", async (req, res) => {
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
    benefits,
    company_id,
    technologies,
    experience,
  } = req.body;

  if (!employer_id || !title) {
    return res.status(400).json({ error: "Brak wymaganych pól!" });
  }

  const conn = await connection.getConnection();
  await conn.beginTransaction();

  try {
    const [jobOfferResult] = await conn.query(
      `
      INSERT INTO job_offers 
      (title, company_id, companyName, workingMode, contractType, experience, technologies, description, salary, is_active, type, source)
      VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)
      `,
      [
        title,
        company_id,
        company,
        JSON.stringify([location ? location : ""]),
        JSON.stringify([contract_type ? contract_type : ""]),
        JSON.stringify([experience ? experience : ""]),
        JSON.stringify(technologies || []),
        description,
        `${salary_min} - ${salary_max}`,
        1,
        "own",
        "user",
      ]
    );

    const offerId = jobOfferResult.insertId;
    await conn.query(
      `
      INSERT INTO job_details
      (job_offer_id, requirements, benefits)
      VALUES (?, ?, ?)
      `,
      [offerId, requirements || "", benefits || ""]
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
});
export default router;
