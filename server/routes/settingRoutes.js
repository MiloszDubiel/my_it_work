import express from "express";
import { editUser } from "../services/settingService.js";

const router = express.Router();

router.post("/edit-profile", async (req, res) => {
  editUser(req.body).then((el) => {
    return res.json(el);
  });
});

export default router;
