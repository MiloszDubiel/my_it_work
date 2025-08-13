import express from "express";
import { connection } from "../../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/settings", async (req, res) => {
  let { id, email, password, confirmPassword, name, surname, phone_number } =
    req.body;

  if (!id || !email) {
    return res
      .status(400)
      .json({ error: "Pusty adres email lub nie podano id" });
  }

  try {
    if (!password || !confirmPassword) {
      const [result] = await connection.query(
        "UPDATE users SET name=?, surname=?, email=?, phone_number = ? WHERE id = ? ",
        [name, surname, email, phone_number, id]
      );

      res.json({
        info: "Zapisano zmainy",
      });
    } else if (password === confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const [result] = await connection.query(
        "UPDATE users SET name = ?, surname = ?, email = ?, phone_number = ?, password = ? WHERE id = ? ",
        [name, surname, email, phone_number, hash, id]
      );

      res.json({
        info: "Zapisano",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

export default router;
