import express, { json } from "express";
import multer from "multer";
import { connection } from "../config/db.js";
import { editUser, getCandiatInfo } from "../services/settingService.js";

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

router.post("/get-candiate-info", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Niepoprawne dane" });
  }

  const candiat = await getCandiatInfo(id);
  return res.json({ candiate: candiat });
});

router.post("/has-candiate-profile", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Niepoprawne dane" });
  }

  const [row] = await connection.query(
    "SELECT * FROM candidate_info WHERE user_id = ?",
    [id]
  );

  return res.json({ info: row });


  
});

export default router;
