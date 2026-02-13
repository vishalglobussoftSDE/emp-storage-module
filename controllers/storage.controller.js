import fs from "fs";
import path from "path";
import { STORAGE_FORM_CONFIG } from "../configs/storageForm.config.js";
import { STORAGE_HANDLERS } from "../handlers/index.js";

/**
 * Validate required fields based on selected storage type
 */
const validateFieldsFromConfig = (reqBody) => {
  const { select_storage_type } = reqBody;

  // 1) storage type required
  if (!select_storage_type) {
    return {
      success: false,
      field: "select_storage_type",
      message: "Storage type is required"
    };
  }

  // 2) storage type must exist in config
  const fieldsConfig = STORAGE_FORM_CONFIG[select_storage_type];

  if (!fieldsConfig) {
    return {
      success: false,
      field: "select_storage_type",
      message: "Invalid storage type selected"
    };
  }

  // 3) required fields check
  for (const field of fieldsConfig) {
    const value = reqBody[field.name];

    if (field.required && (value === undefined || value === null || value === "")) {
      return {
        success: false,
        field: field.name,
        message: `${field.label} is required`
      };
    }
  }

  return { success: true };
};

/**
 * API 1: Only checks if all required fields are filled
 */
export const validateStorageData = (req, res) => {
  const validation = validateFieldsFromConfig(req.body);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(200).json({
    success: true,
    message: "All required fields are filled"
  });
};

/**
 * API 2: Backend will pick a file from public folder and run:
 * upload -> download -> delete
 */
export const testStorageOperations = async (req, res) => {
  try {
    // 1) validate fields from config
    const validation = validateFieldsFromConfig(req.body);
    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const { select_storage_type } = req.body;

    // 2) handler check
    const handler = STORAGE_HANDLERS[select_storage_type];

    if (!handler) {
      return res.status(400).json({
        success: false,
        field: "select_storage_type",
        message: `${select_storage_type} is not implemented yet`
      });
    }

    // 3) Pick a test file from backend public folder
    // You can change file name here
    const testFilePath = path.join(process.cwd(), "public", "test.avif");

    if (!fs.existsSync(testFilePath)) {
      return res.status(400).json({
        success: false,
        field: "public_file",
        message: `Test file not found at: public/test.avif`
      });
    }

    // 4) Create a fake file object (like multer)
    // so your old handler can work without changes
    const fileBuffer = fs.readFileSync(testFilePath);

    const fakeReq = {
      ...req,
      file: {
        originalname: "test.png",
        mimetype: "image/png",
        buffer: fileBuffer,
        size: fileBuffer.length
      }
    };

    // 5) run handler (upload -> download -> delete)
    const result = await handler(fakeReq);

    if (!result?.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Storage operations test failed",
      error: error.message
    });
  }
};
