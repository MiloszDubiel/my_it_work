import express from "express";
import { connection } from "../../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/settings", async (req, res) => {
  let { id, email, password, confirmPassword, name, surname, phone } = req.body;

  if (!id || !email) {
    return res
      .status(400)
      .json({ error: "Pusty adres email lub nie podano id" });
  }

  try {
    if (!password || !confirmPassword) {
      const [result] = await connection.query(
        "UPDATE users SET name=?, surname=?, email=?, phone_number = ? WHERE id = ? ",
        [name, surname, email, phone, id]
      );

      const [user] = await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );

      const userData = user[0];

      res.json({
        info: "Zapisano zmiany",
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          surname: userData.surname,
          phone_number: userData.phone_number,
        },
      });
    } else if (password === confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const [result] = await connection.query(
        "UPDATE users SET name = ?, surname = ?, email = ?, phone_number = ?, password = ? WHERE id = ? ",
        [name, surname, email, phone, hash, id]
      );

      const [user] = await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );

      const userData = user[0];

      res.json({
        info: "Zapisano zmiany",
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          surname: userData.surname,
          phone_number: userData.phone_number,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

export default router;
