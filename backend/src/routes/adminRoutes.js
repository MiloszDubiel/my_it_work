import express from "express";
import { connection } from "../config/db.js";
import { authenticateToken, requireRole } from "../middleware/authJwt.js";
import bcrypt from "bcryptjs";
import { scrapeAll } from "../scrappers/jobOffertsScraper.js";

const router = express.Router();

function parsePaginationParams(req) {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const pageSize = Math.max(
    1,
    Math.min(100, parseInt(req.query.pageSize || "10", 10)),
  );
  const search = (req.query.search || "").trim();
  const offset = (page - 1) * pageSize;
  return { page, pageSize, search, offset };
}
//UZYTKOWNICY
router.get(
  "/get-users",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { page, pageSize, search, offset } = parsePaginationParams(req);

      let countSql = "SELECT COUNT(*) AS cnt FROM users WHERE role != 'Admin'";
      const countParams = [];

      if (search) {
        countSql += " AND (email LIKE ? OR name LIKE ? OR surname LIKE ?)";
        const like = `%${search}%`;
        countParams.push(like, like, like);
      }

      const [[countRow]] = await connection.query(countSql, countParams);
      const total = countRow.cnt;
      const totalPages = Math.ceil(total / pageSize);

      let dataSql = `
    SELECT users.*, companies.companyName
FROM users
LEFT JOIN companies ON users.id = companies.owner_id
  `;
      const dataParams = [];

      if (search) {
        dataSql += " AND (email LIKE ? OR name LIKE ? OR surname LIKE ?)";
        const like = `%${search}%`;
        dataParams.push(like, like, like);
      }

      dataSql += " WHERE role != 'Admin'";
      dataSql += " ORDER BY id DESC LIMIT ? OFFSET ?";
      dataParams.push(pageSize, offset);

      const [rows] = await connection.query(dataSql, dataParams);

      res.json({ users: rows, page, pageSize, total, totalPages });
    } catch (err) {
      console.error("GET /admin/get-users error:", err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

router.put(
  "/users/:id",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, surname, email, is_active } = req.body;

      if (!email || !is_active) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
      }

      const [result] = await connection.query(
        "UPDATE users SET name=?, surname=?, email=?, is_active=? WHERE id=?",
        [name, surname, email, is_active, userId],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Użytkownik nie istnieje" });
      }

      res.json({ info: "Użytkownik zaktualizowany poprawnie" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);
router.post(
  "/delete-user",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.body;
      await connection.query("DELETE FROM users WHERE id = ?", [id]);
      res.json({ info: "Usunięto użytkownika" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Nie udało się usunąć użytkownika" });
    }
  },
);

router.get(
  "/get-companies",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
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

      let dataSql = `SELECT *
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
  },
);

router.put(
  "/edit-company",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id, companyName, nip } = req.body;
      if (!id) return res.status(400).json({ error: "Brak id" });

      await connection.query(
        `UPDATE companies 
       SET companyName = ?, nip =? 
       WHERE id = ?`,
        [companyName, nip, id],
      );

      res.status(200).json({ info: "Zaktualizowano firmę" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd aktualizacji firmy" });
    }
  },
);

router.post(
  "/delete-company",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.body;
      await connection.query("DELETE FROM job_offers WHERE company_id = ?", [
        id,
      ]);
      await connection.query("DELETE FROM companies WHERE id = ?", [id]);
      res.json({ info: "Firma została usunięta" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Nie udało się usunąć firmy" });
    }
  },
);

//OFERTY
router.get(
  "/get-offers",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { page, pageSize, search, offset } = parsePaginationParams(req);

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

      let dataSql = `SELECT  jo.id, jo.salary, jo.companyName, jo.title, jo.updated_at, jo.is_active, jd.description, jd.requirements, jd.active_to, jd.benefits, jd.responsibilities
       FROM job_offers jo
       INNER JOIN job_details jd ON jo.id = jd.job_offer_id
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
  },
);

router.post(
  "/delete-offer",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.body;

      console.log(id);
      await connection.query("DELETE FROM job_details WHERE job_offer_id = ?", [
        id,
      ]);
      await connection.query("DELETE FROM job_offers WHERE id = ?", [id]);
      res.json({ info: "Oferta została usunięta" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Nie udało się usunąć oferty pracy" });
    }
  },
);
router.put(
  "/update-offer",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id, description, is_active, title } = req.body;

      if (!id) return res.status(400).json({ error: "Brak id" });

      await connection.query(
        `UPDATE job_offers 
       SET title = ?, is_active = ?
       WHERE id = ?`,
        [title, is_active, id],
      );

      await connection.query(
        "UPDATE job_details SET description = ? WHERE job_offer_id = ?",
        [description, id],
      );

      res.json({ info: "Zaktualizowano ofertę" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd aktualizacji firmy" });
    }
  },
);

//STATYSTYKI

//Hasło
router.put(
  "/change-password",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user.id;

    const [rows] = await connection.query(
      "SELECT password FROM users WHERE id = ?",
      [adminId],
    );

    const match = await bcrypt.compare(oldPassword, rows[0].password);

    if (!match) {
      return res.status(400).json({ msg: "Złe hasło" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await connection.query("UPDATE users SET password = ? WHERE id = ?", [
      newHash,
      adminId,
    ]);

    res.json({ msg: "Hasło zaaktualizowane" });
  },
);

//Zmiana danych firmy
router.get(
  "/company-change-requests",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const [rows] = await connection.query(`
            SELECT r.*, 
                   c.companyName AS old_name, 
                   c.nip AS old_nip,
                   c.img AS old_logo
            FROM company_change_requests r
            LEFT JOIN companies c ON c.id = r.company_id
            WHERE r.status = 'pending'
            ORDER BY r.created_at DESC
        `);

      res.json({ requests: rows });
    } catch (err) {
      res.status(500).json({ error: "Błąd serwera." });
    }
  },
);
router.post(
  "/approve-company-change",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    const { request_id } = req.body;

    const [[request]] = await connection.query(
      `SELECT * FROM company_change_requests WHERE id = ?`,
      [request_id],
    );

    if (!request) return res.status(404).json({ error: "Nie znaleziono." });

    await connection.query(
      `UPDATE companies
         SET companyName = ?, nip = ?, img = ?
         WHERE id = ?`,
      [
        request.new_company_name,
        request.new_nip,
        request.new_logo,
        request.company_id,
      ],
    );

    await connection.query(
      `UPDATE company_change_requests SET status = 'approved' WHERE id = ?`,
      [request_id],
    );

    res.json({ msg: "Zmieniono dane firmy." });
  },
);

router.post(
  "/reject-company-change",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    const { request_id } = req.body;

    await connection.query(
      `UPDATE company_change_requests SET status = 'rejected' WHERE id = ?`,
      [request_id],
    );

    res.json({ msg: "Prośbę odrzucono." });
  },
);


router.post("/scrap/stop", authenticateToken,
  requireRole("admin"),async (req, res) => {
  await stopScraping(req.app.get("io"));
  res.json({ message: "Zatrzymywanie..." });
});


router.get(
  "/scrap/:scrap_when",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    const { scrap_when } = req.params;



    try {
      await connection.query("INSERT INTO scrap_data(date) VALUES(?)", [
        scrap_when,
      ]);

      res.json({ message: "Scraper uruchomiony w tle" });

      scrapeAll(req.app.get("io")) // 👈 przekaż io
        .then(() => {
          console.log("Zakończono scrapowanie pomyślnie");
        })
        .catch((err) => {
          console.error("Błąd podczas scrapowania:", err);
        });

    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

router.get(
  "/scrape-date",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    const [rows] = await connection.query(`
            SELECT date FROM scrap_data ORDER BY id DESC LIMIT 1
        `);

    res.json({ date: rows[0].date });
  },
);

export default router;
