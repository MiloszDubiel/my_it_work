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



export default router;
