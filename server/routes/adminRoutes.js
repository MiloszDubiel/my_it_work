import express from "express";
import { connection } from "../config/db.js";
import { authenticateToken, isAdmin } from "../middleware/authJwt.js";
const router = express.Router();

function parsePaginationParams(req) {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const pageSize = Math.max(
    1,
    Math.min(100, parseInt(req.query.pageSize || "10", 10))
  );
  const search = (req.query.search || "").trim();
  const offset = (page - 1) * pageSize;
  return { page, pageSize, search, offset };
}

router.get("/get-users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page, pageSize, search, offset } = parsePaginationParams(req);

    // count total
    let countSql = "SELECT COUNT(*) AS cnt FROM users";
    const countParams = [];
    if (search) {
      countSql += " WHERE (email LIKE ? OR name LIKE ? OR surname LIKE ?)";
      const like = `%${search}%`;
      countParams.push(like, like, like);
    }
    const [[countRow]] = await connection.query(countSql, countParams);
    const total = countRow.cnt;
    const totalPages = Math.ceil(total / pageSize);

    // fetch rows
    let dataSql = `SELECT id, email, name, surname, role, is_active, created_at
                   FROM users`;
    const dataParams = [];
    if (search) {
      dataSql += " WHERE (email LIKE ? OR name LIKE ? OR surname LIKE ?)";
      const like = `%${search}%`;
      dataParams.push(like, like, like);
    }
    dataSql += " ORDER BY id DESC LIMIT ? OFFSET ?";
    dataParams.push(pageSize, offset);

    const [rows] = await connection.query(dataSql, dataParams);

    res.json({ users: rows, page, pageSize, total, totalPages });
  } catch (err) {
    console.error("GET /admin/get-users error:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

//Edycja uzytkowników
router.put("/users/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, surname, email, is_active } = req.body;

    console.log(req.body);

    if (!name || !surname || !email || !is_active) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    const [result] = await connection.query(
      "UPDATE users SET name=?, surname=?, email=?, is_active=? WHERE id=?",
      [name, surname, email, is_active, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Użytkownik nie istnieje" });
    }

    res.json({ message: "Użytkownik zaktualizowany poprawnie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.get("/get-companies", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page, pageSize, search, offset } = parsePaginationParams(req);

    let countSql = "SELECT COUNT(*) AS cnt FROM companies";
    const countParams = [];
    if (search) {
      countSql += " WHERE (companyName LIKE ? OR email LIKE ?)";
      const like = `%${search}%`;
      countParams.push(like, like);
    }
    const [[countRow]] = await connection.query(countSql, countParams);
    const total = countRow.cnt;
    const totalPages = Math.ceil(total / pageSize);

    let dataSql = `SELECT id, companyName, email, phone_number, owner_id, link, img, created_at
                   FROM companies`;
    const dataParams = [];
    if (search) {
      dataSql += " WHERE (companyName LIKE ? OR email LIKE ?)";
      const like = `%${search}%`;
      dataParams.push(like, like);
    }
    dataSql += " ORDER BY id DESC LIMIT ? OFFSET ?";
    dataParams.push(pageSize, offset);

    const [rows] = await connection.query(dataSql, dataParams);

    res.json({ companies: rows, page, pageSize, total, totalPages });
  } catch (err) {
    console.error("GET /admin/get-companies error:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.get("/get-offers", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page, pageSize, search, offset } = parsePaginationParams(req);

    // count (join to companies for companyName search)
    let countSql = `SELECT COUNT(*) AS cnt
       FROM job_offers jo
       LEFT JOIN companies c ON c.id = jo.company_id`;
    const countParams = [];
    if (search) {
      countSql += " WHERE (jo.title LIKE ? OR c.companyName LIKE ?)";
      const like = `%${search}%`;
      countParams.push(like, like);
    }
    const [[countRow]] = await connection.query(countSql, countParams);
    const total = countRow.cnt;
    const totalPages = Math.ceil(total / pageSize);

    // fetch rows with joined companyName and img
    let dataSql = `SELECT jo.id, jo.title, jo.company_id, jo.companyName, jo.img AS job_img,
              jo.salary, jo.is_active, jo.created_at,
              c.img AS company_img
       FROM job_offers jo
       LEFT JOIN companies c ON c.id = jo.company_id`;
    const dataParams = [];
    if (search) {
      dataSql += " WHERE (jo.title LIKE ? OR c.companyName LIKE ?)";
      const like = `%${search}%`;
      dataParams.push(like, like);
    }
    dataSql += " ORDER BY jo.id DESC LIMIT ? OFFSET ?";
    dataParams.push(pageSize, offset);

    const [rows] = await connection.query(dataSql, dataParams);

    res.json({ offers: rows, page, pageSize, total, totalPages });
  } catch (err) {
    console.error("GET /admin/get-offers error:", err);
    res.status(500).json({ error: "Błąd serwera" });
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
