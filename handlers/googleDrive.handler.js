import {
  getGoogleDriveClient,
  uploadToGoogleDrive,
  downloadFromGoogleDrive,
  deleteFromGoogleDrive
} from "../services/googleDrive.service.js";

export const handleGoogleDrive = async (req) => {
  try {
    const { client_id, client_secret, refresh_token } = req.body;

    // safety: file must exist (fakeReq will provide it)
    if (!req.file?.buffer) {
      return {
        success: false,
        field: "file",
        message: "Test file buffer is missing"
      };
    }

    const drive = getGoogleDriveClient({
      client_id,
      client_secret,
      refresh_token
    });

    const fileName = `test-${Date.now()}-${req.file.originalname}`;

    // 1) Upload
    const uploadedFile = await uploadToGoogleDrive({
      drive,
      buffer: req.file.buffer,
      fileName,
      mimeType: req.file.mimetype
    });

    if (!uploadedFile?.id) {
      return {
        success: false,
        message: "Upload failed (no file id returned)"
      };
    }

    // 2) Download check
    const downloadedData = await downloadFromGoogleDrive({
      drive,
      fileId: uploadedFile.id
    });

    let downloadedBytes = 0;

    // Buffer
    if (Buffer.isBuffer(downloadedData)) {
      downloadedBytes = downloadedData.length;
    }
    // ArrayBuffer
    else if (downloadedData instanceof ArrayBuffer) {
      downloadedBytes = downloadedData.byteLength;
    }
    // Uint8Array
    else if (downloadedData?.byteLength) {
      downloadedBytes = downloadedData.byteLength;
    }
    // fallback
    else if (downloadedData?.length) {
      downloadedBytes = downloadedData.length;
    }

    // // 3) Delete
    await deleteFromGoogleDrive({
      drive,
      fileId: uploadedFile.id
    });

    return {
      success: true,
      message: "Google Drive: Upload -> Download -> Delete completed successfully",
      storage: "google_drive",
      uploaded_file_id: uploadedFile.id,
      uploaded_file_name: uploadedFile.name || fileName,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };
  } catch (error) {
    return {
      success: false,
      message: "Google Drive handler failed",
      error: error.message
    };
  }
};
