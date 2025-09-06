import express from "express";
import { getUsers, deleteUser, editUser } from "../services/usersService.js";

const router = express.Router();

router.get("/get-users", async (req, res) => {
  try {
    const rows = await getUsers();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/delete-users", async (req, res) => {
  try {
    const { id, email } = req.body;
    const rows = await deleteUser(id, email);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/edit-user", async (req, res) => {
  try {
    const userData = req.body;
    const rows = await editUser(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
