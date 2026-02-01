import path from "path";
import fs from "fs";
import multer from "multer";
const CvAndRefStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    if (file.fieldname === "cv") dir = "uploads/cv";
    else if (file.fieldname === "references") dir = "uploads/references";

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (file.fieldname === "cv") cb(null, `cv_${req.body.user_id}${ext}`);
    else if (file.fieldname === "references")
      cb(null, `ref_${req.body.user_id}${ext}`);
  },
});

export const uploadCvAndRef = multer({
  storage: CvAndRefStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "src/uploads/avatars";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.body.id}${ext}`);
  },
});

export const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    if (!["image/png"].includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "src/uploads/company_logos";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo_${req.body.company_id}${ext}`);
  },
});

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
      return cb(new Error("Tylko PNG lub JPG"), false);
    }
    cb(null, true);
  },
});
