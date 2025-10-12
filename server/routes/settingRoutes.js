import express from "express";
import multer from "multer";
import { connection } from "../config/db.js";
import { editUser } from "../services/settingService.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/edit-profile", async (req, res) => {
  editUser(req.body).then((el) => {
    return res.json(el);
  });
});

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  const { id } = req.body;

  const file = req.file;

  if (!req.file) {
    return res.status(400).json({ error: "Nie wybrano pliku" });
  }

  const avatarBuffer = req.file.buffer;

  try {
    const [result] = await connection.query(
      "UPDATE users SET avatar = ? WHERE id = ?",
      [avatarBuffer, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Użytkownik nie istnieje" });
    }

    res.json({ success: true, message: "Avatar zapisany pomyślnie" });
  } catch (error) {
    console.error("Błąd przy zapisie avatara:", error);
    res.status(500).json({ error: "Błąd serwera przy zapisie avatara" });
  }
});

export default router;
