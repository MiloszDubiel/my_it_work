import { connection } from "../config/db.js";

export async function getCandiatInfo(id) {
  const [row] = await connection.query(
    "SELECT * FROM candidate_info WHERE user_id = ?",
    [id]
  );

  if (row.length === 0) {
    return false;
  }

  return row;
}
