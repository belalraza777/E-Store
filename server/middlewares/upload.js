import multer from "multer";
import { storage } from "../config/cloudnary.js";

// Allowed file types (product images only)
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

// Check file type
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only images and videos are allowed."), false);
  }
  cb(null, true);
};

// File size limit: 15MB (enough for product images)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

export default upload;
