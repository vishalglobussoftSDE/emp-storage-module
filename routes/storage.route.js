import express from "express";
import {
  verifyStorage,
  uploadStorage,
  downloadStorage,
  deleteStorage,
  disconnectStorage
} from "../controllers/storage.controller.js";

const router = express.Router();

router.post("/verify", verifyStorage);
router.post("/upload", uploadStorage);
router.post("/download", downloadStorage);
router.post("/delete", deleteStorage);
router.post("/disconnect", disconnectStorage);

export default router;