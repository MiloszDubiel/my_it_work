import express from "express";
import {
  uploadCvAndRef,
  avatarUpload,
} from "../middleware/settingMiddleware.js";
import { connection } from "../config/db.js";
import { authenticateToken } from "../middleware/authJwt.js";
import { requireRole } from "../middleware/authJwt.js";

import bcrypt from "bcryptjs";

const router = express.Router();

router.post(
  "/edit-profile",
  avatarUpload.single("avatar"),
  authenticateToken,
  requireRole("employer", "admin", "candidate"),
  async (req, res) => {
    try {
      const { id, name, surname, email, newPassword, repeatPassword } =
        req.body;

      if (!id || !email) {
        return { error: "Brak id lub email" };
      }
      let avatarPath = null;

      if (req.file) {
        avatarPath = `http://localhost:5000/uploads/avatars/avatar_${id}.png`;
      }

      const fields = [];
      const values = [];

      if (name) {
        fields.push("name = ?");
        values.push(name);
      }
      if (surname) {
        fields.push("surname = ?");
        values.push(surname);
      }
      if (email) {
        fields.push("email = ?");
        values.push(email);
      }

      if (avatarPath) {
        fields.push("avatar = ?");
        values.push(avatarPath);
      }

      if (newPassword && newPassword === repeatPassword) {
        fields.push("password = ?");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        values.push(hash);
      }

      values.push(id);

      await connection.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );

      const [user] = await connection.query(
        "SELECT name, surname, email, id, avatar, role FROM users WHERE id = ? ",
        [id],
      );

      res.status(200).json({
        info: "Profil zaktualizowany",
        userData: user[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

router.post(
  "/get-candiate-info",
  authenticateToken,
  requireRole("admin", "candidate"),
  async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Niepoprawne dane" });
    }
    const [candiat] = await connection.query(
      "SELECT * FROM candidate_info WHERE user_id = ?",
      [id],
    );
    return res.json({ candiate: candiat });
  },
);

router.post(
  "/has-candiate-profile",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Niepoprawne dane" });
    }

    const [row] = await connection.query(
      "SELECT * FROM candidate_info WHERE user_id = ?",
      [id],
    );

    return res.json({ info: row });
  },
);

router.get(
  "/favorites/:user_id",
  authenticateToken,
  requireRole("admin", "candidate"),
  async (req, res) => {
    const { user_id } = req.params;
    try {
      const [rows] = await connection.query(
        `
      
      
      SELECT
  job_offers.source,
  job_offers.id,
  job_offers.title,
  job_offers.companyName,
  job_offers.workingMode,
  job_offers.contractType,
  job_offers.experience,
  job_offers.technologies,
  job_offers.salary,
  job_offers.is_active,
  job_offers.link,
  job_details.description,
  job_details.active_to,
  job_details.requirements,
  job_offers.updated_at,
  companies.img,
  owner_id,
  favorites.created_at AS added_at
FROM job_offers
INNER JOIN job_details
  ON job_offers.id = job_details.job_offer_id
LEFT JOIN companies
  ON job_offers.company_id = companies.id
JOIN favorites ON favorites.offer_id = job_offers.id 
WHERE favorites.user_id = ?`,
        [user_id],
      );

      res.json(rows);
    } catch (err) {
      console.error("Błąd przy pobieraniu ulubionych:", err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

router.post(
  "/set-candidate-info",
  uploadCvAndRef.fields([
    { name: "cv", maxCount: 1 },
    { name: "references", maxCount: 1 },
  ]),
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    try {
      const {
        user_id,
        description,
        locations,
        skills,
        lang,
        edu,
        link_git,
        working_mode,
        present_job,
        target_job,
        phone_number,
        access,
        career_level,
        years_of_experience,
      } = req.body;

      const cvFile = req.files?.cv || null;
      const refFile = req.files?.references || null;

      const cvPath = cvFile
        ? `http://localhost:5000/uploads/cv/cv_${user_id}.pdf`
        : null;
      const refPath = refFile
        ? `http://localhost:5000/uploads/references/ref_${user_id}.pdf`
        : null;

      const [rows] = await connection.query(
        "SELECT id FROM candidate_info WHERE user_id = ?",
        [user_id],
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO candidate_info (
    user_id, cv, \`references\`, locations, skills, lang, edu, 
    link_git, working_mode, present_job, target_job, 
    phone_number, access, career_level, description, years_of_experience
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
          [
            user_id,
            cvPath || null,
            refPath || null,
            locations || null,
            skills || "[]",
            lang || "[]",
            edu || "[]",
            link_git || null,
            working_mode || null,
            present_job || null,
            target_job || null,
            phone_number || null,
            access || null,
            career_level || null,
            description || null,
            years_of_experience || 0,
          ],
        );

        return res.json({
          success: true,
          info: "Profil kandydata utworzony",
        });
      }

      const existing = rows[0];

      const updateFields = [
        "locations = ?",
        "skills = ?",
        "lang = ?",
        "edu = ?",
        "link_git = ?",
        "working_mode = ?",
        "present_job = ?",
        "target_job = ?",
        "phone_number = ?",
        "access = ?",
        "career_level = ?",
        "description = ?",
        "years_of_experience = ?",
      ];

      const updateValues = [
        locations,
        skills,
        lang,
        edu,
        link_git,
        working_mode,
        present_job,
        target_job,
        phone_number,
        access,
        career_level,
        description,
        years_of_experience,
      ];

      if (cvPath) {
        updateFields.push("cv = ?");
        updateValues.push(cvPath);
      }
      if (refPath) {
        updateFields.push("`references` = ?");
        updateValues.push(refPath);
      }

      updateValues.push(user_id);

      await connection.query(
        `UPDATE candidate_info
         SET ${updateFields.join(", ")}, updated_at = NOW()
         WHERE user_id = ?`,
        updateValues,
      );

      res.json({
        success: true,
        info: "Profil kandydata zaktualizowany",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera", details: err.message });
    }
  },
);

//Pobieranie złozony moich cv

router.post(
  "/get-user-applications",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    try {
      const { user_id } = req.body;

      const [rows] = await connection.query(
        `SELECT  job_applications.id, job_offers.title, job_offers.companyName, job_applications.created_at, job_applications.status, companies.owner_id
       FROM job_applications
       JOIN job_offers ON job_applications.offer_id = job_offers.id
       JOIN companies ON job_offers.company_id = companies.id
       WHERE job_applications.user_id = ?
       ORDER BY created_at DESC`,
        [user_id],
      );

      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

//anuluje złozenie cv

router.delete(
  "/cancel-application/:id",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Sprawdź czy aplikacja istnieje
      const [rows] = await connection.query(
        "SELECT * FROM job_applications WHERE id = ?",
        [id],
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Aplikacja nie istnieje" });
      }

      await connection.query(
        "UPDATE job_applications SET status = 'anulowana' WHERE id = ?",
        [id],
      );

      res.status(200).json({ info: "Aplikacja została anulowana." });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

//Usuwanie historii aplikacji
router.delete(
  "/clear-history/:id",
  authenticateToken,
  requireRole("candidate", "admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      await connection.query(
        "DELETE FROM job_applications WHERE user_id = ? AND status IN('odrzucono', 'anulowana')",
        [id],
      );
      return res.status(200).json({ info: "Usunięto" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
);

export default router;
