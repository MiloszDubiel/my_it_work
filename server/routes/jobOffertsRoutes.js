import express from "express";
import { getJobOfferts } from "../scrappers/jobOffertsScraper.js";
import {
  saveOffertsToDb,
  getAllOfferts,
} from "../services/jobOffertsService.js";
import { getFillteredOfferts } from "../services/jobOffertsService.js";

const router = express.Router();

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
    const offers = await getJobOfferts();
    const [result] = await saveOffertsToDb(offers);
    res.json({ inserted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
