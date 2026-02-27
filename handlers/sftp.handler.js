import fs from "fs";
import path from "path";
import {
  getSftpClient,
  uploadToSftp,
  downloadFromSftp,
  deleteFromSftp
} from "../services/sftp.service.js";

let lastUploadedRemotePath = null; // 🔥 store last uploaded file path

const createSftpFromReq = async (req) => {
  const { host, port, username, password, perm_key } = req.body;

  if (!host || !username) {
    throw new Error("Missing SFTP credentials");
  }

  return await getSftpClient({
    host,
    port,
    username,
    password,
    perm_key
  });
};

export const sftpHandler = {

  // VERIFY
  verify: async (req) => {
    try {
      const sftp = await createSftpFromReq(req);
      await sftp.end();

      return {
        success: true,
        message: "SFTP verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "SFTP verification failed",
        error: error.message
      };
    }
  },

  // UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const { sftp_path } = req.body;

      if (!sftp_path) {
        return {
          success: false,
          message: "sftp_path is required"
        };
      }

      const sftp = await createSftpFromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        await sftp.end();
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);
      const remoteFileName = `test-${Date.now()}.png`;
      const remotePath = `${sftp_path}/${remoteFileName}`.replace(/\/+/g, "/");

      await uploadToSftp({
        sftp,
        buffer,
        remotePath
      });

      lastUploadedRemotePath = remotePath; // 🔥 store for auto usage

      await sftp.end();

      return {
        success: true,
        message: "File uploaded successfully",
        remote_path: remotePath,
        file_name: remoteFileName
      };

    } catch (error) {
      return {
        success: false,
        message: "SFTP upload failed",
        error: error.message
      };
    }
  },

  //DOWNLOAD (Auto last uploaded)
  download: async (req) => {
    try {
      if (!lastUploadedRemotePath) {
        return {
          success: false,
          message: "No file uploaded yet"
        };
      }

      const sftp = await createSftpFromReq(req);

      const downloadedData = await downloadFromSftp({
        sftp,
        remotePath: lastUploadedRemotePath
      });

      const downloadedBytes =
        downloadedData?.byteLength || downloadedData?.length || 0;

      await sftp.end();

      return {
        success: true,
        remote_path: lastUploadedRemotePath,
        downloaded_bytes: downloadedBytes
      };

    } catch (error) {
      return {
        success: false,
        message: "SFTP download failed",
        error: error.message
      };
    }
  },

  // DELETE (Auto last uploaded)
  delete: async (req) => {
    try {
      if (!lastUploadedRemotePath) {
        return {
          success: false,
          message: "No file available to delete"
        };
      }

      const sftp = await createSftpFromReq(req);

      await deleteFromSftp({
        sftp,
        remotePath: lastUploadedRemotePath
      });

      const deletedPath = lastUploadedRemotePath;
      lastUploadedRemotePath = null; // 🔥 reset

      await sftp.end();

      return {
        success: true,
        message: "Last uploaded file deleted",
        remote_path: deletedPath
      };

    } catch (error) {
      return {
        success: false,
        message: "SFTP delete failed",
        error: error.message
      };
    }
  },

  disconnect: async () => {
    return {
      success: true,
      message: "SFTP does not maintain persistent connection"
    };
  }

};