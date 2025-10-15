import { connection } from "../config/db.js";
import bcrypt from "bcryptjs";

export async function editUser({
  name,
  surname,
  email,
  newPassword,
  repeatPassword,
  id,
}) {
  if (!id) {
    return { error: "Wewnetrzny błąd serwera" };
  }

  if (newPassword !== "") {
    if (newPassword !== repeatPassword) {
      return { error: "Hasła nie są takie same" };
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    const [result] = await connection.query(
      "UPDATE users SET name = ?, surname = ?, email = ?, password = ? WHERE id = ?  ",
      [name, surname, email, hash, id]
    );

    const [userData] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0)
      return { info: "Zapisano", userData: userData[0] };
  }

  const [result] = await connection.query(
    "UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?  ",
    [name, surname, email, id]
  );

  const [userData] = await connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  return { info: "Zapisano zmiany", userData: userData[0] };
}
