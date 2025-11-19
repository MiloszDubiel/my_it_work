import express, { json } from "express";
import { connection } from "../config/db.js";
import bcrypt from "bcryptjs";
import { fileTypeFromBuffer } from "file-type";
import jwt from "jsonwebtoken";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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

    if (result[0].is_active == 0) {
      return res.status(403).json({ error: "Konto niekatywne " });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({
      token,
      info: "Zalogowano",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        surname: user.surname,
        phone_number: user.phone_number,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

router.post("/registre", async (req, res) => {
  let { email, password, repeatPassword, role, companyName } = req.body;

  if (!email || !password || !repeatPassword || !role) {
    return res.status(400).json({ error: "Puste pola" });
  }

  if (role == "employer" && !companyName) {
    return res.status(400).json({ error: "Nie podano nazwy firmy" });
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

    if (role == "employer") {
      let [result] = await connection.query(
        "INSERT INTO users (email, password, role, is_active) VALUES (?, ?, ?, '0')",
        [email, hash, role]
      );

      const employerId = result.insertId;

      await connection.query(
        "INSERT INTO companies (companyName, owner_id) VALUES (?, ?)",
        [companyName, employerId]
      );

      return res.json({
        info: "Konto zostanie zweryfikowane i zostanie aktywowane przez Administratora",
      });
    }

    await connection.query(
      "INSERT INTO users (email, password, role, is_active) VALUES (?, ?, ?, '1')",
      [email, hash, role]
    );
    return res.json({ info: "Zarejstrowano pomyślnie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

export default router;
