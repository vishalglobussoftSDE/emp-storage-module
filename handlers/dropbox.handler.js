import {
  getDropboxClient,
  uploadToDropbox,
  downloadFromDropbox,
  deleteFromDropbox
} from "../services/dropbox.service.js";

export const handleDropbox = async (req) => {
  try {
    const { app_key, app_secret, refresh_token } = req.body;

    // safety
    if (!req.file?.buffer) {
      return {
        success: false,
        field: "file",
        message: "Test file buffer is missing"
      };
    }

    const dbx = await getDropboxClient({
      app_key,
      app_secret,
      refresh_token
    });

    const fileName = `test-${Date.now()}-${req.file.originalname}`;

    // 1) Upload
    const uploadedFile = await uploadToDropbox({
      dbx,
      buffer: req.file.buffer,
      fileName
    });

    if (!uploadedFile?.path_lower) {
      return {
        success: false,
        message: "Dropbox upload failed (path_lower not returned)"
      };
    }

    // 2) Download check
    const downloadedData = await downloadFromDropbox({
      dbx,
      path: uploadedFile.path_lower
    });

    let downloadedBytes = 0;

    if (Buffer.isBuffer(downloadedData)) {
      downloadedBytes = downloadedData.length;
    } else if (downloadedData?.byteLength) {
      downloadedBytes = downloadedData.byteLength;
    } else if (downloadedData?.length) {
      downloadedBytes = downloadedData.length;
    }

    // 3) Delete
    await deleteFromDropbox({
      dbx,
      path: uploadedFile.path_lower
    });

    return {
      success: true,
      message: "Dropbox: Upload -> Download -> Delete completed successfully",
      storage: "dropbox",
      uploaded_file_id: uploadedFile.id,
      uploaded_file_name: uploadedFile.name || fileName,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };
  } catch (error) {
    return {
      success: false,
      message: "Dropbox handler failed",
      error: error.message
    };
  }
};
