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
