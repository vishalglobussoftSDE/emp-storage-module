import fs from "fs";
import path from "path";
import { google } from "googleapis";
import {
  getGoogleDriveClient,
  uploadToGoogleDrive,
  downloadFromGoogleDrive,
  deleteFromGoogleDrive
} from "../services/googleDrive.service.js";

let lastUploadedFileId = null; // 🔥 store last uploaded file id

const createDriveFromReq = (req) => {
  const { client_id, client_secret, refresh_token } = req.body;

  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Missing Google Drive credentials");
  }

  return getGoogleDriveClient({
    client_id,
    client_secret,
    refresh_token
  });
};

export const googleDriveHandler = {

  // ✅ VERIFY
  verify: async (req) => {
    try {
      const drive = createDriveFromReq(req);
      await drive.about.get({ fields: "user" });

      return {
        success: true,
        message: "Google Drive verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "Verification failed",
        error: error.message
      };
    }
  },

  // ✅ UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const drive = createDriveFromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);

      const uploaded = await uploadToGoogleDrive({
        drive,
        buffer,
        fileName: `test-${Date.now()}.png`,
        mimeType: "image/png"
      });

      lastUploadedFileId = uploaded.id; // 🔥 store id

      return {
        success: true,
        message: "File uploaded successfully",
        file_id: uploaded.id,
        file_name: uploaded.name
      };

    } catch (error) {
      return {
        success: false,
        message: "Upload failed",
        error: error.message
      };
    }
  },

  // ✅ DOWNLOAD (Auto last uploaded)
  download: async (req) => {
    try {
      if (!lastUploadedFileId) {
        return {
          success: false,
          message: "No file uploaded yet"
        };
      }

      const drive = createDriveFromReq(req);

      const buffer = await downloadFromGoogleDrive({
        drive,
        fileId: lastUploadedFileId
      });

      return {
        success: true,
        file_id: lastUploadedFileId,
        size: buffer.length
      };

    } catch (error) {
      return {
        success: false,
        message: "Download failed",
        error: error.message
      };
    }
  },

  // ✅ DELETE (Auto last uploaded)
  delete: async (req) => {
    try {
      if (!lastUploadedFileId) {
        return {
          success: false,
          message: "No file available to delete"
        };
      }

      const drive = createDriveFromReq(req);

      await deleteFromGoogleDrive({
        drive,
        fileId: lastUploadedFileId
      });

      const deletedId = lastUploadedFileId;
      lastUploadedFileId = null; // 🔥 reset after delete

      return {
        success: true,
        message: "Last uploaded file deleted",
        file_id: deletedId
      };

    } catch (error) {
      return {
        success: false,
        message: "Delete failed",
        error: error.message
      };
    }
  },

  // ✅ DISCONNECT
  disconnect: async (req) => {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return {
          success: false,
          message: "refresh_token is required"
        };
      }

      const oAuth2Client = new google.auth.OAuth2();
      await oAuth2Client.revokeToken(refresh_token);

      return {
        success: true,
        message: "Disconnected successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "Disconnect failed",
        error: error.message
      };
    }
  }

};