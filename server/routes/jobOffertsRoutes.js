import express, { json } from "express";
import dotenv from "dotenv";
import {
  getJobOfferts,
  getJobOffertDetail,
} from "../scrappers/jobOffertsScraper.js";
import {
  saveOffertsToDb,
  getAllOfferts,
} from "../services/jobOffertsService.js";
import { getFillteredOfferts } from "../services/jobOffertsService.js";
import { connection } from "../config/db.js";

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
    const [result] = await saveOffertsToDb(offers);
    res.json({ inserted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/scrape/details", async (req, res) => {
  try {
    const { link, type } = req.body;

    if (!link || !type) {
      return res.status(400).json("Niepoprawne dane");
    }
    const details = await getJobOffertDetail(link, type);
    res.json({ details: details });
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

export default router;
