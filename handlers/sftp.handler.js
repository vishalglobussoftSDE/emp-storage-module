import {
  getSftpClient,
  uploadToSftp,
  downloadFromSftp,
  deleteFromSftp
} from "../services/sftp.service.js";

export const handleSftp = async (req) => {
  const { host, port, username, password, perm_key, sftp_path } = req.body;

  const sftp = await getSftpClient({
    host,
    port,
    username,
    password,
    perm_key
  });

  const remoteFileName = `test-${Date.now()}-${req.file.originalname}`;
  const remotePath = `${sftp_path}/${remoteFileName}`.replace(/\/+/g, "/");

  // 1) Upload
  const uploadedFile = await uploadToSftp({
    sftp,
    buffer: req.file.buffer,
    remotePath
  });

  // 2) Download check
  const downloadedData = await downloadFromSftp({
    sftp,
    remotePath
  });

  const downloadedBytes =
    downloadedData?.byteLength || downloadedData?.length || 0;

  // 3) Delete
  await deleteFromSftp({
    sftp,
    remotePath
  });

  // Close connection
  await sftp.end();

  return {
    success: true,
    message: "Upload -> Download -> Delete completed successfully",
    storage: "sftp",
    uploaded_file_path: uploadedFile.remotePath,
    uploaded_file_name: remoteFileName,
    downloaded_bytes: downloadedBytes,
    deleted: true
  };
};
