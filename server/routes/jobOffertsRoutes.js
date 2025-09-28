import express from "express";
import dotenv from "dotenv";
import { getJobOfferts } from "../scrappers/jobOffertsScraper.js";
import {
  saveOffertsToDb,
  getAllOfferts,
} from "../services/jobOffertsService.js";
import { getFillteredOfferts } from "../services/jobOffertsService.js";

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

router.get("/scrape/:code", async (req, res) => {
  try {
    const { code } = req.params;

    if (code !== process.env.KEY_TO_SCRAPE) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const offers = await getJobOfferts();
    // const [result] = await saveOffertsToDb(offers);
    // res.json({ inserted: result.affectedRows });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
