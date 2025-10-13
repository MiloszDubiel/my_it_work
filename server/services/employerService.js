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

export async function getFillteredEmployers({ locations, companyName }) {
  let sql = "SELECT * FROM companies WHERE 1=1"; // 1=1 żeby łatwo dokładać warunki
  const params = [];

  if (locations && locations.trim() !== "") {
    sql += " AND locations LIKE ?";
    params.push(`%${locations}%`);
  }

  if (companyName && companyName.trim() !== "") {
    sql += " AND companyName LIKE ?";
    params.push(`%${companyName}%`);
  }

  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error("Błąd w zapytaniu SQL:", err);
    throw err;
  }
}
