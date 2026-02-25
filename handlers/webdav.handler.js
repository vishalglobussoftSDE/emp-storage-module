import {
  getWebDavClient,
  uploadToWebDav,
  downloadFromWebDav,
  deleteFromWebDav
} from "../services/webdav.service.js";

export const handleWebDav = async (req) => {
  try {
    const {
      webdav_base_url,
      webdav_path,
      webdav_username,
      webdav_password
    } = req.body;

    if (!req.file?.buffer) {
      return {
        success: false,
        field: "file",
        message: "Test file buffer is missing"
      };
    }

    const client = getWebDavClient({
      webdav_base_url,
      webdav_username,
      webdav_password
    });

    const fileName = `test-${Date.now()}-${req.file.originalname}`;
    const fullPath = `${webdav_path}/${fileName}`;
    //  Upload
    await uploadToWebDav({
      client,
      buffer: req.file.buffer,
      filePath: fullPath
    });

    //  Download
    const downloadedData = await downloadFromWebDav({
      client,
      filePath: fullPath
    });

    const downloadedBytes = Buffer.isBuffer(downloadedData)
      ? downloadedData.length
      : downloadedData.byteLength || 0;

    //  Delete
    await deleteFromWebDav({
      client,
      filePath: fullPath
    });

    return {
      success: true,
      message: "WebDAV: Upload -> Download -> Delete completed successfully",
      storage: "webdav",
      uploaded_path: fullPath,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };

  } catch (error) {
    return {
      success: false,
      message: "WebDAV handler failed",
      error: error.message
    };
  }
};