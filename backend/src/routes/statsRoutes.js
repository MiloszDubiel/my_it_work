import express from "express";
import { connection } from "../config/db.js";
import { authenticateToken } from "../middleware/authJwt.js";
import { requireRole } from "../middleware/authJwt.js";

const router = express.Router();

/* =====================================
   1) STATYSTYKA WYNAGRODZEŃ
===================================== */
router.get(
  "/salary-stats",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
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
        ? (salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) /
          2
        : salaries[Math.floor(salaries.length / 2)];

    res.json({
      avg,
      median,
      min: salaries[0],
      max: salaries[salaries.length - 1],
      raw: salaries,
    });
  },
);

router.get(
  "/salary-histogram",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const [rows] = await connection.query("SELECT salary FROM job_offers");

      const raw = rows.map((r) => r.salary);

      const numericSalaries = raw
        .map((s) => {
          if (!s || s.toLowerCase() === "not available") return null;

          // usuń wszystkie spacje i PLN
          s = s.replace(/[^\d\-\–]/g, "");

          const match = s.match(/(\d+)-(\d+)/);
          if (match) {
            const min = Number(match[1]);
            const max = Number(match[2]);
            return (min + max) / 2;
          }

          const num = Number(s);
          return isNaN(num) ? null : num;
        })
        .filter(Boolean);

      if (numericSalaries.length === 0)
        return res.json({ histogram: [], min: 0, max: 0 });

      const min = Math.min(...numericSalaries);
      const max = Math.max(...numericSalaries);
      const step = Math.ceil((max - min) / 10); // 10 przedziałów

      const histogram = Array(10).fill(0);
      numericSalaries.forEach((v) => {
        let idx = Math.floor((v - min) / step);
        if (idx >= 10) idx = 9;
        histogram[idx]++;
      });

      const histogramData = histogram.map((count, i) => ({
        range: `${Math.round(min + i * step)} - ${Math.round(min + (i + 1) * step)} PLN`,
        count,
      }));

      res.json({ histogram: histogramData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

/* =====================================
   2) CZĘSTOŚĆ TECHNOLOGII
===================================== */
router.get(
  "/tech-frequency",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
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
  },
);

/* =====================================
   3) DOŚWIADCZENIE vs WYNAGRODZENIE
===================================== */
// routes/statsRoutes.js
router.get(
  "/experience-vs-salary",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const [rows] = await connection.query(`
      SELECT experience, salary
      FROM job_offers
      WHERE salary IS NOT NULL 
        AND salary NOT IN ('not available')
        AND experience IS NOT NULL
    `);

      const groups = {};

      rows.forEach((r) => {
        // 1. Parsowanie doświadczenia
        let exp;
        try {
          const parsedExp = JSON.parse(r.experience);
          if (!Array.isArray(parsedExp) || parsedExp.length === 0) return;
          exp = parsedExp[0];
        } catch (e) {
          return; // jeśli JSON źle sformatowany → pomijamy
        }

        // 2. Czyszczenie i przekształcenie salary na liczby
        const cleaned = r.salary
          .replace(/PLN/g, "")
          .replace(/\s/g, "")
          .replace(/–/g, "-") // długi myślnik na zwykły
          .replace(/,/g, "");

        const parts = cleaned.split("-");
        if (parts.length < 2) return; // jeśli nie ma min i max → pomijamy

        const min = Number(parts[0]);
        const max = Number(parts[1]);
        if (isNaN(min) || isNaN(max)) return; // jeśli coś nie jest liczbą → pomijamy

        const avg = (min + max) / 2;

        // 3. Grupowanie wg poziomu doświadczenia
        if (!groups[exp]) groups[exp] = [];
        groups[exp].push(avg);
      });

      // 4. Tworzenie wyniku do front-endu z avg_salary zaokrąglonym do 2 miejsc po przecinku
      const result = Object.entries(groups)
        .map(([level, salaries]) => ({
          level,
          avg_salary: parseFloat(
            (salaries.reduce((a, b) => a + b, 0) / salaries.length).toFixed(2),
          ),
          offers: salaries.length,
        }))
        // opcjonalnie posortuj po poziomie doświadczenia
        .sort((a, b) => {
          const order = [
            "Junior",
            "Mid",
            "Regular",
            "Senior",
            "Lead",
            "Manager",
          ];
          return order.indexOf(a.level) - order.indexOf(b.level);
        });

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  },
);

export default router;
