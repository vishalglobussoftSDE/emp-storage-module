import { STORAGE_FORM_CONFIG } from "../configs/storageForm.config.js";
import { STORAGE_HANDLERS } from "../handlers/index.js";

const validateFieldsFromConfig = (reqBody) => {
  const { select_storage_type } = reqBody;
  //this is checking storage type is filled or not
  if (!select_storage_type) {
    return {
      success: false,
      field: "select_storage_type",
      message: "Storage type is required"
    };
  }

  // this is checking that selected storage type is in the array which is in the backend like for valid storage type 
  const fieldsConfig = STORAGE_FORM_CONFIG[select_storage_type];

  if (!fieldsConfig) {
    return {
      success: false,
      field: "select_storage_type",
      message: "Invalid storage type selected"
    };
  }

  // storage_from_config is a object which val = array (suppose i select the drive  google_drive : [credentials1 , creadential2 , .... etc]) now checking each cred with loop 
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


export const testUploadStorage = async (req, res) => {
  try {
    // 1) validate fields from config
    const validation = validateFieldsFromConfig(req.body);
    if (!validation.success) {
      return res.status(400).json(validation);
    }

    // 2) file check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        field: "file",
        message: "File is required (multipart/form-data)"
      });
    }

    const { select_storage_type } = req.body;

    // 3) handler check
    const handler = STORAGE_HANDLERS[select_storage_type];

    if (!handler) {
      return res.status(400).json({
        success: false,
        field: "select_storage_type",
        message: `${select_storage_type} is not implemented yet`
      });
    }

    // 4) run handler (upload -> download -> delete)
    const result = await handler(req);

    // if handler returns success false
    if (!result?.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Upload test failed",
      error: error.message
    });
  }
}; 