import express from "express";
import { connection } from "../config/db.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await connection.query(
      "SELECT id, email, name, surname, role, created_at FROM users ORDER BY id DESC"
    );
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania użytkowników" });
  }
});

router.get("/get-companies", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [companies] = await connection.query(
      "SELECT id, companyName, email, phone_number, owner_id, link, img FROM companies ORDER BY id DESC"
    );
    res.json({ companies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania firm" });
  }
});

router.get("/get-offers", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [offers] = await connection.query(
      `SELECT job_offers.*, companies.companyName AS companyName, companies.img AS company_img
       FROM job_offers
       LEFT JOIN companies ON companies.id = job_offers.company_id
       ORDER BY job_offers.id DESC`
    );
    res.json({ offers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania ofert pracy" });
  }
});

router.put("/edit-user", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id, name, surname, email, role } = req.body;
    if (!id) return res.status(400).json({ error: "Brak id" });

    if (!email || !name)
      return res.status(400).json({ error: "Brak wymaganych pól" });

    await connection.query(
      "UPDATE users SET name = ?, surname = ?, email = ?, role = ? WHERE id = ?",
      [name, surname || null, email, role || "user", id]
    );

    res.json({ info: "Zaktualizowano użytkownika" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd aktualizacji użytkownika" });
  }
});

router.put("/edit-company", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id, companyName, link, description, email, phone_number, img } =
      req.body;
    if (!id) return res.status(400).json({ error: "Brak id" });

    await connection.query(
      `UPDATE companies 
       SET companyName = ?, link = ?, description = ?, email = ?, phone_number = ?, img = ?
       WHERE id = ?`,
      [
        companyName || null,
        link || null,
        description || null,
        email || null,
        phone_number || null,
        img || null,
        id,
      ]
    );

    // opcjonalnie synchronizuj img do job_offers
    if (img) {
      await connection.query(
        "UPDATE job_offers SET img = ? WHERE company_id = ?",
        [img, id]
      );
    }

    res.json({ info: "Zaktualizowano firmę" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd aktualizacji firmy" });
  }
});

router.put("/edit-offer", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      id,
      title,
      salary,
      company_id,
      companyName,
      description,
      is_active,
      link,
      type,
      img,
      technologies,
      experience,
      contractType,
    } = req.body;

    if (!id) return res.status(400).json({ error: "Brak id oferty" });

    // aktualizuj job_offers
    await connection.query(
      `UPDATE job_offers SET title=?, salary=?, company_id=?, companyName=?, description=?, is_active=?, link=?, type=?, img=?, technologies=?, experience=?, contractType=?, updated_at = NOW() WHERE id=?`,
      [
        title || null,
        salary || null,
        company_id || null,
        companyName || null,
        description || null,
        typeof is_active !== "undefined" ? is_active : 1,
        link || null,
        type || null,
        img || null,
        technologies ? JSON.stringify(technologies) : null,
        experience ? JSON.stringify(experience) : null,
        contractType ? JSON.stringify(contractType) : null,
        id,
      ]
    );

    res.json({ info: "Zaktualizowano ofertę pracy" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd aktualizacji oferty" });
  }
});

router.post("/delete-user", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    await connection.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ info: "Usunięto użytkownika" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nie udało się usunąć użytkownika" });
  }
});

router.post("/delete-company", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    await connection.query("DELETE FROM job_offers WHERE company_id = ?", [id]);
    await connection.query("DELETE FROM companies WHERE id = ?", [id]);
    res.json({ info: "Firma została usunięta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nie udało się usunąć firmy" });
  }
});

router.post("/delete-offer", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    await connection.query("DELETE FROM job_details WHERE job_offer_id = ?", [
      id,
    ]);
    await connection.query("DELETE FROM job_offers WHERE id = ?", [id]);
    res.json({ info: "Oferta została usunięta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nie udało się usunąć oferty pracy" });
  }
});

export default router;
