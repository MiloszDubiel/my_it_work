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
export async function getCompanyInfo(id) {
  const [rows] = await connection.query(
    "SELECT * FROM companies WHERE owner_id = ? ",
    [id]
  );

  return rows;
}

export async function setCompanyInfo({
  owner_id,
  companyName,
  description,
  link,
  email,
  phone_number,
}) {
  const owner = await getCompanyInfo(owner_id);

  if (owner.length === 0) {
    await connection.query(
      "INSERT INTO companies(companyName, description, link, email, phone_number, owner_id) VALUES (?,?,?,?,?,?)  ",
      [companyName, description, link, email, phone, owner_id]
    );
    return { info: "Zapisano firme" };
  }

  await connection.query(
    "UPDATE companies SET  companyName = ?, description = ? , link = ?, email = ?, phone_number = ? WHERE owner_id = ? ",
    [companyName, description, link, email, phone_number, owner_id]
  );
  return { info: "Zapisano zmiany" };
}
