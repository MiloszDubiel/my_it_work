import express, { json } from "express";
import { getAllEmployers } from "../services/employerService.js";
import {
  getFillteredEmployers,
  getCompanyInfo,
} from "../services/employerService.js";
import { connection } from "../config/db.js";
import { uploadLogo } from "../middleware/settingMiddleware.js";
import path from "path";


const router = express.Router();

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
      const { owner_id, description, link, email, phone_number, company_id } =
        req.body;

      let logoPath = null;

      if (req.file) {
        logoPath = `http://localhost:5000/uploads/company_logos/logo_${company_id}${path.extname(
          req.file.originalname
        )}`;
      }

      await connection.query(
        "UPDATE companies SET description=?, link=?, email=?, phone_number=?, img = ? WHERE owner_id=?",
        [description, link, email, phone_number, logoPath, owner_id]
      );

      return res.status(200).json({ info: "Zapisano zmiany" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }
);

router.post("/request-company-change", async (req, res) => {
  try {
    const { owner_id, companyName, nip, company_id } = req.body;

    const [rows] = await connection.query(
      `SELECT * FROM company_change_requests 
         WHERE company_id = ? 
         AND employer_id = ? 
         AND status = 'pending'`,
      [company_id, owner_id]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        error: "Poprzednia prośba czeka na odpowiedź administratora.",
      });
    }

  
    const sql = `
        INSERT INTO company_change_requests 
        (company_id, employer_id, new_company_name, new_nip, status)
        VALUES (?, ?, ?, ?, 'pending')
      `;

    await connection.query(sql, [
      company_id,
      owner_id,
      companyName || null,
      nip || null,
    ]);

    return res.status(200).json({
      info: "Wysłano prośbę do administratora.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Błąd serwera", details: e.message });
  }
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

    const [offers] = await connection.query(
      `SELECT  
    job_offers.companyName,
    job_offers.contractType,
    job_offers.workingMode,
    job_offers.title,
    job_offers.id,
    job_offers.updated_at,
    job_offers.is_active,
    companies.owner_id,  
    job_offers.salary,
    job_offers.experience,
    job_offers.technologies,
    job_details.description,
    job_details.requirements,
    job_details.benefits,
    job_details.responsibilities
FROM job_offers
INNER JOIN job_details 
    ON job_offers.id = job_details.job_offer_id
INNER JOIN companies 
    ON job_offers.company_id = companies.id
WHERE company_id = ?
`,
      [company_id]
    );

    return res.status(200).json({ offers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd serwera" });
  }
});

router.post("/get-my-applications", async (req, res) => {
  const { employer_id } = req.body;
  if (!employer_id) {
    return res.status(400).json({ error: "Missing employer ID" });
  }

  try {
    const [rows] = await connection.query(
      `SELECT
      job_applications.id AS app_id,
      job_offers.title,
      job_offers.employer_id,
      users.id AS 'user_id',
      users.name,
      users.surname,
      users.email,
      users.avatar,
      users.phone_number,
      candidate_info.*
      FROM job_applications
      JOIN  job_offers ON job_applications.offer_id = job_offers.id
      JOIN users ON job_applications.user_id = users.id
      JOIN candidate_info ON users.id = candidate_info.user_id
      WHERE job_offers.employer_id = ? AND  job_applications.status NOT IN('odrzucono', 'anulowana', 'zaakceptowana')
      ORDER BY job_applications.created_at DESC`,
      [employer_id]
    );

    res.json({ applications: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/update-application-status", async (req, res) => {
  const { application_id, status } = req.body;

  if (!application_id || !status) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const [result] = await connection.query(
      "UPDATE job_applications SET status = ? WHERE id = ?",
      [status, application_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ success: true, info: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/revoke-application/:id", async (req, res) => {
  const app_id = req.params.id;

  try {
    await connection.query(
      "UPDATE job_applications SET status = 'odrzucono' WHERE id = ?",
      [app_id]
    );
    res.json({ success: true, message: "Odrzucono aplikacje" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas odrzucania aplikacji" });
  }
});

router.put("/accept-application/:id", async (req, res) => {
  const app_id = req.params.id;

  try {
    await connection.query(
      "UPDATE job_applications SET status = 'zaakceptowana' WHERE id = ?",
      [app_id]
    );
    res.json({ success: true, message: "Przyjęto aplikacje" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas przyjmowania aplikacji" });
  }
});

export default router;
