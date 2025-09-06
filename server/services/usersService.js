import { connection } from "../config/db.js";
import bcrypt from "bcryptjs";

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

export function editUser(userData) {
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);

    return connection.query(
      "UPDATE users SET name = ?, surname = ?, email = ?, password = ?, role = ?, phone_number = ? WHERE id = ?  ",
      [
        userData.name,
        userData.surname,
        userData.email,
        hash,
        userData.role,
        userData.phone,
        userData.id,
      ]
    );
  }

  return connection.query(
    "UPDATE users SET name = ?, surname = ?, email = ?, role =?, phone_number = ? WHERE id = ?  ",
    [
      userData.name,
      userData.surname,
      userData.email,
      userData.role,
      userData.phone,
      userData.id,
    ]
  );
}
