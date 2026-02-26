import fs from "fs";
import path from "path";
import {
  connectFtp,
  uploadToFtp,
  downloadFromFtp,
  deleteFromFtp
} from "../services/ftp.service.js";

let lastUploadedFile = null; // 🔥 store last uploaded file name

const createFtpFromReq = async (req) => {
  const { ftp_host, ftp_port, ftp_username, ftp_password } = req.body;

  if (!ftp_host || !ftp_username || !ftp_password) {
    throw new Error("Missing FTP credentials");
  }

  return await connectFtp({
    ftp_host,
    ftp_port,
    ftp_username,
    ftp_password
  });
};

export const ftpHandler = {

  // ✅ VERIFY
  verify: async (req) => {
    try {
      const client = await createFtpFromReq(req);
      await client.close();

      return {
        success: true,
        message: "FTP verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "FTP verification failed",
        error: error.message
      };
    }
  },

  // ✅ UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const client = await createFtpFromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        await client.close();
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);
      const fileName = `test-${Date.now()}.png`;

      await uploadToFtp({
        client,
        buffer,
        fileName
      });

      lastUploadedFile = fileName; // 🔥 save for auto delete

      await client.close();

      return {
        success: true,
        message: "File uploaded successfully",
        file_name: fileName
      };

    } catch (error) {
      return {
        success: false,
        message: "FTP upload failed",
        error: error.message
      };
    }
  },

  // ✅ DOWNLOAD (Auto last uploaded)
  download: async (req) => {
    try {
      if (!lastUploadedFile) {
        return {
          success: false,
          message: "No file uploaded yet"
        };
      }

      const client = await createFtpFromReq(req);

      const buffer = await downloadFromFtp({
        client,
        fileName: lastUploadedFile
      });

      await client.close();

      return {
        success: true,
        file_name: lastUploadedFile,
        size: buffer.length
      };

    } catch (error) {
      return {
        success: false,
        message: "FTP download failed",
        error: error.message
      };
    }
  },

  // ✅ DELETE (Auto last uploaded)
  delete: async (req) => {
    try {
      if (!lastUploadedFile) {
        return {
          success: false,
          message: "No file available to delete"
        };
      }

      const client = await createFtpFromReq(req);

      await deleteFromFtp({
        client,
        fileName: lastUploadedFile
      });

      await client.close();

      const deletedFile = lastUploadedFile;
      lastUploadedFile = null; // 🔥 reset after delete

      return {
        success: true,
        message: "Last uploaded file deleted",
        file_name: deletedFile
      };

    } catch (error) {
      return {
        success: false,
        message: "FTP delete failed",
        error: error.message
      };
    }
  },

  disconnect: async () => {
    return {
      success: true,
      message: "FTP does not maintain persistent connection"
    };
  }

};