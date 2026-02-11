import {
  getGoogleDriveClient,
  uploadToGoogleDrive,
  downloadFromGoogleDrive,
  deleteFromGoogleDrive
} from "../services/googleDrive.service.js";

export const handleGoogleDrive = async (req) => {
  const { client_id, client_secret, refresh_token } = req.body;

  const drive = getGoogleDriveClient({
    client_id,
    client_secret,
    refresh_token
  });

  // 1) Upload
  const uploadedFile = await uploadToGoogleDrive({
    drive,
    buffer: req.file.buffer,
    fileName: `test-${Date.now()}-${req.file.originalname}`,
    mimeType: req.file.mimetype
  });

  // 2) Download check
  const downloadedData = await downloadFromGoogleDrive({
    drive,
    fileId: uploadedFile.id
  });

  const downloadedBytes =
    downloadedData?.byteLength || downloadedData?.length || 0;

  // 3) Delete
  await deleteFromGoogleDrive({
    drive,
    fileId: uploadedFile.id
  });

  return {
    success: true,
    message: "Upload -> Download -> Delete completed successfully",
    storage: "google_drive",
    uploaded_file_id: uploadedFile.id,
    uploaded_file_name: uploadedFile.name,
    downloaded_bytes: downloadedBytes,
    deleted: true
  };
};
