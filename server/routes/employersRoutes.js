import express from "express";
import { getEmployers } from "../scrappers/employerScraper.js";
import {
  saveEmployersToDb,
  getAllEmployers,
} from "../services/employerService.js";
import { getFillteredEmployers } from "../services/employerService.js";
const router = express.Router();

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

export default router;
