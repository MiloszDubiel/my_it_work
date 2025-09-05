import { connection } from "../config/db.js";

export function getUsers() {
  return connection.query(
    "SELECT id, name, surname, email, role, phone_number FROM users"
  );
}

export function deleteUser(id, email) {
  return connection.query("DELETE FROM users WHERE id = ? AND email = ?", [
    id,
    email,
  ]);
}
