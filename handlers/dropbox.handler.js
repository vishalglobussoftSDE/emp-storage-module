import {
  getDropboxClient,
  uploadToDropbox,
  downloadFromDropbox,
  deleteFromDropbox
} from "../services/dropbox.service.js";

export const handleDropbox = async (req) => {
  const { app_key, app_secret, refresh_token } = req.body;

  const dbx = await getDropboxClient({
    app_key,
    app_secret,
    refresh_token
  });

  // 1) Upload
  const uploadedFile = await uploadToDropbox({
    dbx,
    buffer: req.file.buffer,
    fileName: `test-${Date.now()}-${req.file.originalname}`
  });

  // 2) Download check
  const downloadedData = await downloadFromDropbox({
    dbx,
    path: uploadedFile.path_lower
  });

  const downloadedBytes =
    downloadedData?.byteLength || downloadedData?.length || 0;

  // 3) Delete
  await deleteFromDropbox({
    dbx,
    path: uploadedFile.path_lower
  });

  return {
    success: true,
    message: "Upload -> Download -> Delete completed successfully",
    storage: "dropbox",
    uploaded_file_id: uploadedFile.id,
    uploaded_file_name: uploadedFile.name,
    downloaded_bytes: downloadedBytes,
    deleted: true
  };
};
