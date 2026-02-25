import {
  getSmbClient,
  uploadToSmb,
  downloadFromSmb,
  deleteFromSmb
} from "../services/smb.service.js";

export const handleSmb = async (req) => {
  try {
    const {
      smb_host,
      smb_port,
      smb_share,
      smb_username,
      smb_password,
      smb_domain
    } = req.body;

    if (!req.file?.buffer) {
      return {
        success: false,
        field: "file",
        message: "Test file buffer is missing"
      };
    }

    const client = getSmbClient({
      smb_host,
      smb_port,
      smb_share,
      smb_username,
      smb_password,
      smb_domain
    });

    const fileName = `test-${Date.now()}-${req.file.originalname}`;
    const remotePath = fileName;

    // 1️⃣ Upload
    await uploadToSmb({
      client,
      buffer: req.file.buffer,
      filePath: remotePath
    });

    // 2️⃣ Download
    const downloadedData = await downloadFromSmb({
      client,
      filePath: remotePath
    });

    const downloadedBytes = downloadedData?.length || 0;

    // 3️⃣ Delete
    await deleteFromSmb({
      client,
      filePath: remotePath
    });

    return {
      success: true,
      message: "SMB: Upload -> Download -> Delete completed successfully",
      storage: "smb",
      uploaded_file: remotePath,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };

  } catch (error) {
    return {
      success: false,
      message: "SMB handler failed",
      error: error.message
    };
  }
};