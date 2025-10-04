import { connection } from "../config/db.js";

export function saveOffertsToDb(offers) {
  const insertQuery = `
    INSERT IGNORE INTO job_offers 
      (title, companyName, workingMode, contractType, experience, technologies, salary, type, img, link) 
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
  ]);

  return new Promise((resolve, reject) => {
    connection.query(insertQuery, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

export function getAllOfferts() {
  return connection.query("SELECT * FROM job_offers");
}

export async function getFillteredOfferts({
  locations,
  position,
  technologie,
  exprience,
  type,
}) {
  let sql = "SELECT * FROM job_offers WHERE 1=1"; // 1=1 żeby łatwo dokładać warunki
  const params = [];

  if (locations?.length > 0) {
    // np. locations to tablica: ["Warszawa", "Kraków"]
    sql += ` AND (${locations.map(() => "workingMode LIKE ?").join(" OR ")})`;
    locations.forEach((loc) => params.push(`%${loc}%`));
  }
  if (technologie?.length > 0) {
    // technologie to tablica: ["React", "Node.js"]
    sql += ` AND (${technologie
      .map(() => "technologies LIKE ?")
      .join(" OR ")})`;
    technologie.forEach((tech) => params.push(`%${tech}%`));
  }
  if (position?.length > 0) {
    // stanowisko to tablica: ["GameDev", "FrontEnd"]
    sql += ` AND (${position.map(() => "title LIKE ?").join(" OR ")})`;
    position.forEach((pos) => params.push(`%${pos}%`));
  }
  if (type?.length > 0) {
    // typ kontraktu to tablica: ["Kontrakt B2B", "Umowa o pracę"]
    sql += ` AND (${type.map(() => "contractType LIKE ?").join(" OR ")})`;
    type.forEach((typ) => params.push(`%${typ}%`));
  }
  if (exprience?.length > 0) {
    // typ kontraktu to tablica: ["Kontrakt B2B", "Umowa o pracę"]
    sql += ` AND (${exprience.map(() => "experience LIKE ?").join(" OR ")})`;
    exprience.forEach((exp) => params.push(`%${exp}%`));
  }

  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error("Błąd w zapytaniu SQL:", err);
    throw err;
  }
}
