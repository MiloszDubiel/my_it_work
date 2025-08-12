import express, { json } from "express";
import { connection } from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    res.json({ error: "Puste pola" });
    return;
  }

  try {
    const [result] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(400).json({ error: "Użytkownik nie istnieje" });
    }

    const hash = result[0].password;
    const user = result[0];

    const isCorrect = await bcrypt.compare(password, hash);
    if (!isCorrect) {
      return res.status(400).json({ error: "Niepoprawne dane logowania" });
    }

    res.json({
      info: "Zalogowano",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        surname: user.surname,
        phone_number: user.phone_number || "Nie podano",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

router.post("/registre", async (req, res) => {
  let { email, password, repeatPassword, role } = req.body;

  if (!email || !password || !repeatPassword || !role) {
    return res.status(400).json({ error: "Puste pola" });
  }
  if (password !== repeatPassword) {
    return res.status(400).json({ error: "Hasła są rózne" });
  }

  try {
    const [user] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length > 0) {
      return res.status(400).json({ error: "Użytkownik już istnieje" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await connection.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hash, role]
    );

    res.json({ info: "Zarejstrowano pomyślnie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

export default router;
