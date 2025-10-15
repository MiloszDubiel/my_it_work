import express, { json } from "express";
import { getEmployers } from "../scrappers/employerScraper.js";
import {
  saveEmployersToDb,
  getAllEmployers,
} from "../services/employerService.js";
import {
  getFillteredEmployers,
  getCompanyInfo,
  setCompanyInfo,
} from "../services/employerService.js";
const router = express.Router();
import { connection } from "../config/db.js";

router.post("/filltred", async (req, res) => {
  try {
    const { state } = req.body;
    const rows = await getFillteredEmployers(state);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await getAllEmployers();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/scrape", async (req, res) => {
  try {
    const offers = await getEmployers();
    const [result] = await saveEmployersToDb(offers);
    res.json({ inserted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/get-company-info", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.json({ error: "Brak id" });
  }

  return res.json({ companyInfo: await getCompanyInfo(id) });
});

router.post("/set-company-info", async (req, res) => {
  const { owner_id, companyName, email } = req.body.company;

  if (!owner_id || !email || !companyName) {
    return res.status(400).json({ error: "Niepoprawne dane" });
  }

  const rows = await setCompanyInfo(req.body.company);
  return res.json(rows);
});

router.post("/add-offer", async (req, res) => {
  const {
    owner_id,
    title,
    company_name,
    location,
    description,
    experience_level,
    contract_type,
    technologies,
    salary_min,
    salary_max,
    external_link,
  } = req.body;

  const userId = owner_id || null;

  if (!title || !company_name) {
    return res.status(400).json({ ok: false, error: "Brak wymaganych pól" });
  }

  try {
    let checkSql = "SELECT * FROM job_offers WHERE 1=1";
    const params = [];

    checkSql += " AND title = ? AND company_name = ?";
    params.push(title, company_name);
    if (location) {
      checkSql += " AND location = ?";
      params.push(location);
    }

    const [rows] = await connection.query(checkSql, params);

    if (rows.length > 0) {
      return res.json({
        ok: true,
        alreadyExists: true,
        offerId: rows[0].id,
        existing: rows[0],
      });
    }

    const insertSql = `
      INSERT INTO job_offers
        (title, company_name, location, contract_type, experience_level, technologies, description, salary_min, salary_max, type, owner_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?,?,?,?,"own", ?, 1)
    `;

    const techJson = Array.isArray(technologies)
      ? JSON.stringify(technologies)
      : JSON.stringify(
          (technologies || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        );

    const insertParams = [
      title,
      company_name,
      location || null,
      contract_type || null,
      experience_level || null,
      techJson,
      description || null,
      salary_min || null,
      salary_max || null,
      userId || null,
      external_link || null,
    ];

    const [result] = await connection.query(insertSql, insertParams);

    return res.json({
      ok: true,
      inserted: true,
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("Błąd /job/add:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.post(
  "/claim",
  /* authMiddleware, */ async (req, res) => {
    const { offerId } = req.body;
    const userId = req.user?.id || req.body.userId || null;

    if (!offerId || !userId) {
      return res
        .status(400)
        .json({ ok: false, error: "Brak offerId lub brak uwierzytelnienia" });
    }

    try {
      // opcjonalnie sprawdź czy oferta nie jest już przypisana
      const [rows] = await connection.query(
        "SELECT employer_id FROM job_offers WHERE id = ?",
        [offerId]
      );
      if (rows.length === 0)
        return res
          .status(404)
          .json({ ok: false, error: "Oferta nie znaleziona" });

      // jeśli już przypisana do innego pracodawcy, możesz odmówić lub nadpisać — tutaj nadpisujemy
      const updateSql = `
      UPDATE job_offers
      SET employer_id = ?, source = 'user', is_active = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
      const [updateRes] = await connection.query(updateSql, [userId, offerId]);

      return res.json({ ok: true, claimed: true, offerId });
    } catch (err) {
      console.error("Błąd /job/claim:", err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  }
);

export default router;
