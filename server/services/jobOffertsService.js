import { connection } from "../config/db.js";

export function saveOffertsToDb(offers) {
  const insertQuery = `
    INSERT IGNORE INTO job_offers 
      (title, companyName, workingMode, contractType, experience, technologies, salary, img, link) 
    VALUES ?`;

  const values = offers.map((offer) => [
    offer.title || null,
    offer.companyName || null,
    JSON.stringify(offer.workingMode || []),
    offer.contractType || null,
    offer.experience || null,
    JSON.stringify(offer.technologies || []),
    offer.salary || null,
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
  return connection.query("SELECT * FROM job_offerts");
}
