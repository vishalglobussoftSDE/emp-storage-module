import fs from "fs";
import path from "path";
import {
  getSmbClient,
  uploadToSmb,
  downloadFromSmb,
  deleteFromSmb
} from "../services/smb.service.js";

let lastUploadedPath = null; // 🔥 store last uploaded file path

const createSmbFromReq = (req) => {
  const {
    smb_host,
    smb_port,
    smb_share,
    smb_username,
    smb_password,
    smb_domain
  } = req.body;

  if (!smb_host || !smb_share || !smb_username) {
    throw new Error("Missing SMB credentials");
  }

  return getSmbClient({
    smb_host,
    smb_port,
    smb_share,
    smb_username,
    smb_password,
    smb_domain
  });
};

export const smbHandler = {

  // ✅ VERIFY
  verify: async (req) => {
    try {
      const client = createSmbFromReq(req);

      // Simple test: list root or try basic access
      // (depends on your smb client implementation)
      await client.list(""); 

      return {
        success: true,
        message: "SMB verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "SMB verification failed",
        error: error.message
      };
    }
  },

  // ✅ UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const client = createSmbFromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);
      const fileName = `test-${Date.now()}.png`;
      const remotePath = fileName;

      await uploadToSmb({
        client,
        buffer,
        filePath: remotePath
      });

      lastUploadedPath = remotePath; // 🔥 store

      return {
        success: true,
        message: "File uploaded successfully",
        file_path: remotePath
      };

    } catch (error) {
      return {
        success: false,
        message: "SMB upload failed",
        error: error.message
      };
    }
  },

  // ✅ DOWNLOAD (Auto last uploaded)
  download: async (req) => {
    try {
      if (!lastUploadedPath) {
        return {
          success: false,
          message: "No file uploaded yet"
        };
      }

      const client = createSmbFromReq(req);

      const downloadedData = await downloadFromSmb({
        client,
        filePath: lastUploadedPath
      });

      const downloadedBytes = downloadedData?.length || 0;

      return {
        success: true,
        file_path: lastUploadedPath,
        downloaded_bytes: downloadedBytes
      };

    } catch (error) {
      return {
        success: false,
        message: "SMB download failed",
        error: error.message
      };
    }
  },

  // ✅ DELETE (Auto last uploaded)
  delete: async (req) => {
    try {
      if (!lastUploadedPath) {
        return {
          success: false,
          message: "No file available to delete"
        };
      }

      const client = createSmbFromReq(req);

      await deleteFromSmb({
        client,
        filePath: lastUploadedPath
      });

      const deletedPath = lastUploadedPath;
      lastUploadedPath = null; // 🔥 reset

      return {
        success: true,
        message: "Last uploaded file deleted",
        file_path: deletedPath
      };

    } catch (error) {
      return {
        success: false,
        message: "SMB delete failed",
        error: error.message
      };
    }
  },

  disconnect: async () => {
    return {
      success: true,
      message: "SMB uses stateless connection per request"
    };
  }

};