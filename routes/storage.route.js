import express from "express";
import {
  validateStorageData,
  testStorageOperations
} from "../controllers/storage.controller.js";

const router = express.Router();

router.post("/validate", validateStorageData);
router.post("/test-operations", testStorageOperations);

export default router;
