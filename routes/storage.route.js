import express from "express";
import { validateStorageData, testUploadStorage } from "../controllers/storage.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/validate", validateStorageData);
router.post("/test-upload", upload.single("file"), testUploadStorage);

export default router;
