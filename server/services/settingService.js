import { connection } from "../config/db.js";
import bcrypt from "bcryptjs";

export async function editUser({ profile }) {
  if (!profile.id) {
    return { error: "Wewnetrzny błąd serwera" };
  }

  if (profile.newPassword != "") {
    if (profile.newPassword != profile.newPassword) {
      return { error: "Hasła nie są takie same" };
    }

    console.log(profile.newPassword);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(profile.newPassword, salt);

    const [result] = await connection.query(
      "UPDATE users SET name = ?, surname = ?, email = ?, password = ?, phone_number = ?, role = ? WHERE id = ?  ",
      [
        profile.name,
        profile.surname,
        profile.email,
        hash,
        profile.phone_number,
        profile.role,
        profile.id,
      ]
    );

    const [userData] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [profile.id]
    );

    if (result.affectedRows > 0)
      return { info: "Zapisano", userData: userData[0] };
  }

  const [result] = await connection.query(
    "UPDATE users SET name = ?, surname = ?, email = ?, role =?, phone_number = ? WHERE id = ?  ",
    [
      profile.name,
      profile.surname,
      profile.email,
      profile.role,
      profile.phone_number,
      profile.id,
    ]
  );

  const [userData] = await connection.query(
    "SELECT * FROM users WHERE id = ?",
    [profile.id]
  );
  if (result.affectedRows > 0)
    return { info: "Zapisano", userData: userData[0] };
}
