import {
  connectFtp,
  uploadToFtp,
  downloadFromFtp,
  deleteFromFtp
} from "../services/ftp.service.js";

export const handleFtp = async (req) => {
  try {
    const {
      ftp_host,
      ftp_port,
      ftp_username,
      ftp_password
    } = req.body;

    if (!req.file?.buffer) {
      return {
        success: false,
        message: "Test file buffer missing"
      };
    }

    const client = await connectFtp({
      ftp_host,
      ftp_port,
      ftp_username,
      ftp_password
    });

    const fileName = `test-${Date.now()}-${req.file.originalname}`;

    // Upload
    await uploadToFtp({
      client,
      buffer: req.file.buffer,
      fileName
    });

    // Download
    const downloaded = await downloadFromFtp({
      client,
      fileName
    });

    const downloadedBytes = downloaded.length;

    // Delete
    await deleteFromFtp({
      client,
      fileName
    });

    client.close();

    return {
      success: true,
      message: "FTP Upload → Download → Delete success",
      storage: "ftp",
      uploaded_file: fileName,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };

  } catch (error) {
    return {
      success: false,
      message: "FTP handler failed",
      error: error.message
    };
  }
};