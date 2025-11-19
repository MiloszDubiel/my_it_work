import express, { json } from "express";
import multer from "multer";
import { connection } from "../config/db.js";
import { editUser, getCandiatInfo } from "../services/settingService.js";
import path from "path";
import fs from "fs";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    if (file.fieldname === "cv") {
      dir = "uploads/cv";
    } else if (file.fieldname === "references") {
      dir = "uploads/references";
    }

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (file.fieldname === "cv") {
      cb(null, `cv_${req.body.user_id}${ext}`);
    } else if (file.fieldname === "references") {
      cb(null, `ref_${req.body.user_id}${ext}`);
    }
  },
});

export const uploadFiles = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/edit-profile", async (req, res) => {
  editUser(req.body).then((el) => {
    return res.json(el);
  });
});

router.post("/get-candiate-info", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Niepoprawne dane" });
  }

  const candiat = await getCandiatInfo(id);
  res.setHeader("Content-Type", "application/pdf");
  return res.json({ candiate: candiat });
});

router.post("/has-candiate-profile", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Niepoprawne dane" });
  }

  const [row] = await connection.query(
    "SELECT * FROM candidate_info WHERE user_id = ?",
    [id]
  );

  return res.json({ info: row });
});

router.get("/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await connection.query(
      `SELECT j.*, f.created_at AS added_at
       FROM favorites f
       JOIN job_offers j ON f.offer_id = j.id
       WHERE f.user_id = ?`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Błąd przy pobieraniu ulubionych:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.post(
  "/set-candidate-info",
  uploadFiles.fields([
    { name: "cv", maxCount: 1 },
    { name: "references", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        user_id,
        locations,
        skills,
        lang,
        edu,
        exp,
        link_git,
        working_mode,
        present_job,
        target_job,
        phone_number,
        access,
        career_level,
      } = req.body;

      const cvFile = req.files?.cv?.[0]?.filename || null;
      const refFile = req.files?.references?.[0]?.filename || null;

      const cvPath = cvFile
        ? `http://localhost:5000/uploads/cv/cv_${user_id}.pdf`
        : null;
      const refPath = refFile
        ? `http://localhost:5000/uploads/cv/cv_${user_id}.pdf`
        : null;

      const [rows] = await connection.query(
        "SELECT id FROM candidate_info WHERE user_id = ?",
        [user_id]
      );

      if (rows.length === 0) {

        await connection.query(
          `INSERT INTO candidate_info
            (user_id, cv, "references", locations, skills, lang, edu, exp, link_git, working_mode, present_job, target_job, phone_number, access, career_level)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user_id,
            cvPath,
            refPath,
            locations,
            skills,
            lang,
            edu,
            exp,
            link_git,
            working_mode,
            present_job,
            target_job,
            phone_number,
            access,
            career_level,
          ]
        );

        return res.json({
          success: true,
          info: "Profil kandydata utworzony",
        });
      }

      await connection.query(
        `UPDATE candidate_info
   SET 
     cv = ?,
     \`references\` = ?,
     locations = ?,
     skills = ?,
     lang = ?,
     edu = ?,
     exp = ?,
     link_git = ?,
     working_mode = ?,
     present_job = ?,
     target_job = ?,
     phone_number = ?,
     access = ?,
     career_level = ?,
     updated_at = NOW()
   WHERE user_id = ?`,
        [
          cvPath,
          refPath,
          locations,
          skills,
          lang,
          edu,
          exp,
          link_git,
          working_mode,
          present_job,
          target_job,
          phone_number,
          access,
          career_level,
          user_id,
        ]
      );
      res.json({
        success: true,
        info: "Profil kandydata zaktualizowany",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera", details: err.message });
    }
  }
);

export default router;
