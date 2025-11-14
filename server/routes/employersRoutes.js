import express, { json } from "express";
import { getEmployers } from "../scrappers/employerScraper.js";
import {
  saveEmployersToDb,
  getAllEmployers,
} from "../services/employerService.js";
import {
  getFillteredEmployers,
  getCompanyInfo,
} from "../services/employerService.js";

import { connection } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

//Konfiguracja przesyłania zdjec
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/company_logos";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "company_" + req.body.owner_id + ext);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpeg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
}

export const uploadLogo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

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

router.post(
  "/set-company-info",
  uploadLogo.single("logo"),
  async (req, res) => {
    try {
      const { owner_id, companyName, description, link, email, phone_number } =
        req.body;

      const logo = req.file ? req.file.filename : null;
      const logoLink = logo
        ? `http://localhost:5000/api/employers/get-company-logo/${owner_id}`
        : null;

      // Pobieramy istniejącą firmę
      const owner = await getCompanyInfo(owner_id);

      if (owner.length === 0) {
        // INSERT nowej firmy
        const query = logo
          ? "INSERT INTO companies (companyName, description, link, email, phone_number, owner_id, uploaded_image, img) VALUES (?,?,?,?,?,?,?,?)"
          : "INSERT INTO companies (companyName, description, link, email, phone_number, owner_id) VALUES (?,?,?,?,?,?)";

        const params = logo
          ? [
              companyName,
              description,
              link,
              email,
              phone_number,
              owner_id,
              logo,
              logoLink,
            ]
          : [companyName, description, link, email, phone_number, owner_id];

        await connection.query(query, params);

        return res.status(200).json({ info: "Zapisano firmę" });
      }

      // UPDATE istniejącej firmy
      const updateQuery = logo
        ? "UPDATE companies SET companyName=?, description=?, link=?, email=?, phone_number=?, uploaded_image=?, img=? WHERE owner_id=?"
        : "UPDATE companies SET companyName=?, description=?, link=?, email=?, phone_number=? WHERE owner_id=?";

      const updateParams = logo
        ? [
            companyName,
            description,
            link,
            email,
            phone_number,
            logo,
            logoLink,
            owner_id,
          ]
        : [companyName, description, link, email, phone_number, owner_id];

      await connection.query(updateQuery, updateParams);

      // Jeśli logo się zmieniło, aktualizujemy kolumnę img w job_offers
      if (logo) {
        await connection.query(
          "UPDATE job_offers SET img=? WHERE company_id=?",
          [logoLink, owner[0].id]
        );
      }

      return res.status(200).json({ info: "Zapisano zmiany" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }
);

router.get("/get-company-logo/:id", async (req, res) => {
  const owner_id = req.params.id;

  const [results] = await connection.query(
    "SELECT uploaded_image FROM companies WHERE owner_id = ?",
    [owner_id]
  );

  if (results.length === 0 || !results[0].uploaded_image) {
    return res.status(404).json({ error: "Brak logo" });
  }

  const filename = results[0].uploaded_image;
  const filepath = `uploads/company_logos/${filename}`;

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: "Logo nie istnieje" });
  }
  res.sendFile(path.resolve(filepath));
});

router.post("/get-my-offers", async (req, res) => {
  try {
    const { owner_id } = req.body;

    if (!owner_id) {
      return res.status(400).json({ error: "Brak owner_id w zapytaniu" });
    }
    
    const [companyResult] = await connection.query(
      "SELECT id FROM companies WHERE owner_id = ?",
      [owner_id]
    );

    if (companyResult.length === 0) {
      return res
        .status(404)
        .json({ error: "Nie znaleziono firmy dla tego właściciela" });
    }

    const company_id = companyResult[0].id;

    // Pobieramy wszystkie oferty pracy powiązane z firmą
    const [offers] = await connection.query(
      "SELECT * FROM job_offers WHERE company_id = ?",
      [company_id]
    );

    return res.status(200).json({ offers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd serwera" });
  }
});

export default router;
