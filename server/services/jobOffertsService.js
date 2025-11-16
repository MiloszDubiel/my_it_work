import { connection } from "../config/db.js";

export function saveOffertsToDb(offers) {
  const insertQuery = `
    INSERT IGNORE INTO job_offers 
      (title, companyName, workingMode, contractType, experience, technologies, salary, type, img, link, is_active) 
    VALUES ?`;

  const values = offers.map((offer) => [
    offer.title || null,
    offer.companyName || null,
    JSON.stringify(offer.workingMode || []),
    JSON.stringify(offer.contractType || []),
    JSON.stringify(offer.experience || []),
    JSON.stringify(offer.technologies || []),
    offer.salary || null,
    offer.type || null,
    offer.img || null,
    offer.link || null,
    0,
  ]);

  return new Promise((resolve, reject) => {
    connection.query(insertQuery, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

export function getAllOfferts() {
  return connection.query(
    "SELECT job_offers.source, job_offers.id ,job_offers.title, job_offers.companyName, job_offers.workingMode, job_offers.contractType, job_offers.experience, job_offers.technologies, job_offers.salary, job_offers.is_active, job_offers.link, job_offers.img, job_details.description, job_details.requirements, job_offers.updated_at  FROM job_offers INNER JOIN job_details ON job_offers.id = job_details.job_offer_id WHERE job_offers.is_active = 1 ORDER BY updated_at DESC  "
  );
}

export async function getFillteredOfferts({ title, experience, location }) {
  let sql = "SELECT * FROM job_offers WHERE is_active = 1 ";
  const params = [];

  if (title && title.trim() !== "") {
    sql += " AND title LIKE ?";
    params.push(`%${title}%`);
  }

  if (experience && experience.trim() !== "") {
    if (experience === "") {
      sql += " AND experience LIKE ?";
      params.push(`%`);
    } else {
      sql += " AND experience LIKE ?";
      params.push(`%${experience}%`);
    }
  }

  if (location && location.trim() !== "") {
    sql += " AND workingMode LIKE ?";
    params.push(`%${location}%`);
  }

  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error("Błąd w zapytaniu SQL:", err);
    throw err;
  }
}
