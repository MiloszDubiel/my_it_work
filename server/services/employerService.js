import { connection } from "../config/db.js";

export function saveEmployersToDb(employers) {
  const insertQuery = `
    INSERT IGNORE INTO companies
      (companyName, technologies, locations, link, img) 
    VALUES ?`;

  const values = employers.map((employer) => [
    employer.companyName || null,
    JSON.stringify(employer.technologies || []),
    JSON.stringify(employer.locations || []),
    employer.link || null,
    employer.img || null,
  ]);

  return new Promise((resolve, reject) => {
    connection.query(insertQuery, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

export function getAllEmployers() {
  return connection.query("SELECT * FROM companies");
}

export async function getFillteredEmployers({
  locations,
  company,
  technologie,
}) {
  let sql = "SELECT * FROM companies WHERE 1=1"; // 1=1 żeby łatwo dokładać warunki
  const params = [];

  if (locations?.length > 0) {
    // np. locations to tablica: ["Warszawa", "Kraków"]
    sql += ` AND (${locations.map(() => "locations LIKE ?").join(" OR ")})`;
    locations.forEach((loc) => params.push(`%${loc}%`));
  }
  if (company) {
    sql += " AND companyName LIKE ?";
    values.push(`%${company}%`);
  }
  if (technologie?.length > 0) {
    // stanowisko to tablica: ["GameDev", "FrontEnd"]
    sql += ` AND (${technologie
      .map(() => "technologies LIKE ?")
      .join(" OR ")})`;
    technologie.forEach((tech) => params.push(`%${tech}%`));
  }

  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error("Błąd w zapytaniu SQL:", err);
    throw err;
  }
}
