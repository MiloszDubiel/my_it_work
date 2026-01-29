import express from "express";
import { connection } from "../config/db.js";

const router = express.Router();

/* =====================================
   1) STATYSTYKA WYNAGRODZEŃ
===================================== */
router.get("/salary-stats", async (req, res) => {
  const [rows] = await connection.query(`
    SELECT salary
    FROM job_offers
    WHERE salary IS NOT NULL 
      AND salary NOT IN ('not available')
      AND salary REGEXP '[0-9]'
  `);

  // parsowanie salary
  const salaries = rows
    .map((r) => {
      const cleaned = r.salary
        .replace(/PLN/g, "")
        .replace(/\s/g, "")
        .replace(/–/g, "-")
        .replace(/,/g, "");

      const parts = cleaned.split("-");
      if (parts.length === 2) {
        const min = Number(parts[0]);
        const max = Number(parts[1]);
        return (min + max) / 2;
      }
      return null;
    })
    .filter((v) => v && !isNaN(v));

  salaries.sort((a, b) => a - b);

  const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
  const median =
    salaries.length % 2 === 0
      ? (salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) / 2
      : salaries[Math.floor(salaries.length / 2)];

  res.json({
    avg,
    median,
    min: salaries[0],
    max: salaries[salaries.length - 1],
    raw: salaries,
  });
});

/* =====================================
   2) CZĘSTOŚĆ TECHNOLOGII
===================================== */
router.get("/tech-frequency", async (req, res) => {
  const [rows] = await connection.query(`
    SELECT technologies FROM job_offers
    WHERE technologies IS NOT NULL
  `);

  const freq = {};

  rows.forEach((r) => {
    try {
      const techs = JSON.parse(r.technologies);
      techs.forEach((t) => {
        const tech = t.trim();
        freq[tech] = (freq[tech] || 0) + 1;
      });
    } catch (e) {}
  });

  const result = Object.entries(freq)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  res.json(result);
});

/* =====================================
   3) DOŚWIADCZENIE vs WYNAGRODZENIE
===================================== */
router.get("/experience-vs-salary", async (req, res) => {
  const [rows] = await connection.query(`
    SELECT experience, salary
    FROM job_offers
    WHERE salary IS NOT NULL 
      AND salary NOT IN ('not available')
      AND experience IS NOT NULL
  `);

  const groups = {};

  rows.forEach((r) => {
    let exp;
    try {
      exp = JSON.parse(r.experience)[0];
    } catch (e) {
      return;
    }

    const cleaned = r.salary
      .replace(/PLN/g, "")
      .replace(/\s/g, "")
      .replace(/–/g, "-")
      .replace(/,/g, "");

    const parts = cleaned.split("-");
    if (parts.length !== 2) return;

    const avg = (Number(parts[0]) + Number(parts[1])) / 2;

    if (!groups[exp]) groups[exp] = [];
    groups[exp].push(avg);
  });

  const result = Object.entries(groups).map(([level, arr]) => ({
    level,
    avg_salary: arr.reduce((a, b) => a + b, 0) / arr.length,
    offers: arr.length,
  }));

  res.json(result);
});

export default router;
