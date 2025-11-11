import express, { json } from "express";
import multer from "multer";
import { connection } from "../config/db.js";
import { editUser, getCandiatInfo } from "../services/settingService.js";
import fs from "fs";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/edit-profile", async (req, res) => {
  editUser(req.body).then((el) => {
    return res.json(el);
  });
});

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  const { id } = req.body;

  const file = req.file;

  if (!req.file) {
    return res.status(400).json({ error: "Nie wybrano pliku" });
  }

  const avatarBuffer = req.file.buffer;

  try {
    const [result] = await connection.query(
      "UPDATE users SET avatar = ? WHERE id = ?",
      [avatarBuffer, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Użytkownik nie istnieje" });
    }

    res.json({ success: true, message: "Avatar zapisany pomyślnie" });
  } catch (error) {
    console.error("Błąd przy zapisie avatara:", error);
    res.status(500).json({ error: "Błąd serwera przy zapisie avatara" });
  }
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

router.get("/candidate-cv/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await connection.query(
      "SELECT cv FROM candidate_info WHERE user_id = ?",
      [user_id]
    );

    if (!rows.length || !rows[0].cv) {
      return res.status(404).json({ error: "Brak pliku CV" });
    }

    const pdfBuffer = rows[0].cv; // 👈 to powinien być Buffer (nie string)

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cv.pdf");
    res.send(pdfBuffer); // 🔥 wysyłamy czysty binarny plik
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.get("/candidate-cover/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await connection.query(
      "SELECT cover_letter FROM candidate_info WHERE user_id = ?",
      [user_id]
    );

    if (!rows.length || !rows[0].cover_letter) {
      return res.status(404).json({ error: "Brak pliku motywacyjnego" });
    }

    const pdfBuffer = rows[0].cover_letter;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cv.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
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
  upload.fields([{ name: "cv" }, { name: "cover_letter" }]),
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

      console.log(exp);

      const cv = req.files?.cv ? req.files.cv[0].buffer : null;
      const cover_letter = req.files?.cover_letter
        ? req.files.cover_letter[0].buffer
        : null;

      const [rows] = await connection.query(
        "SELECT id FROM candidate_info WHERE user_id = ?",
        [user_id]
      );

      if (rows.length === 0) {
        const [result] = await connection.query(
          `INSERT INTO candidate_info
            (user_id, cv, cover_letter, locations, skills, lang, edu, exp, link_git, working_mode, present_job, target_job, phone_number, access, career_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user_id,
            cv,
            cover_letter,
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

        res.json({
          success: true,
          message: "Profil kandydata utworzony",
          id: result.insertId,
        });
      } else {
        // --- jeśli profil istnieje, aktualizujemy go ---
        const candidateId = rows[0].id;

        const [update] = await connection.query(
          `UPDATE candidate_info
          SET 
            cv = COALESCE(?, cv),
            cover_letter = COALESCE(?, cover_letter),
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
            cv,
            cover_letter,
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

        res.json({ success: true, message: "Profil kandydata zaktualizowany" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera", details: err.message });
    }
  }
);

export default router;
