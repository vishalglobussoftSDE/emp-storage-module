import fs from "fs";
import path from "path";
import {
  getDropboxClient,
  uploadToDropbox,
  downloadFromDropbox,
  deleteFromDropbox
} from "../services/dropbox.service.js";

let lastUploadedPath = null; // 🔥 store last uploaded file path

const createDropboxFromReq = async (req) => {
  const { app_key, app_secret, refresh_token } = req.body;

  if (!app_key || !app_secret || !refresh_token) {
    throw new Error("Missing Dropbox credentials");
  }

  return await getDropboxClient({
    app_key,
    app_secret,
    refresh_token
  });
};

export const dropboxHandler = {

  // ✅ VERIFY
  verify: async (req) => {
    try {
      const dbx = await createDropboxFromReq(req);

      // simple API call to check auth
      await dbx.usersGetCurrentAccount();

      return {
        success: true,
        message: "Dropbox verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "Dropbox verification failed",
        error: error.message
      };
    }
  },

  // ✅ UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const dbx = await createDropboxFromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);
      const fileName = `test-${Date.now()}.png`;

      const uploadedFile = await uploadToDropbox({
        dbx,
        buffer,
        fileName
      });

      if (!uploadedFile?.path_lower) {
        return {
          success: false,
          message: "Dropbox upload failed (path not returned)"
        };
      }

      lastUploadedPath = uploadedFile.path_lower; // 🔥 store for auto usage

      return {
        success: true,
        message: "File uploaded successfully",
        file_id: uploadedFile.id,
        file_name: uploadedFile.name || fileName,
        path: uploadedFile.path_lower
      };

    } catch (error) {
      return {
        success: false,
        message: "Dropbox upload failed",
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

      const dbx = await createDropboxFromReq(req);

      const downloadedData = await downloadFromDropbox({
        dbx,
        path: lastUploadedPath
      });

      const downloadedBytes =
        downloadedData?.byteLength ||
        downloadedData?.length ||
        0;

      return {
        success: true,
        path: lastUploadedPath,
        downloaded_bytes: downloadedBytes
      };

    } catch (error) {
      return {
        success: false,
        message: "Dropbox download failed",
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

      const dbx = await createDropboxFromReq(req);

      await deleteFromDropbox({
        dbx,
        path: lastUploadedPath
      });

      const deletedPath = lastUploadedPath;
      lastUploadedPath = null; // 🔥 reset after delete

      return {
        success: true,
        message: "Last uploaded file deleted",
        path: deletedPath
      };

    } catch (error) {
      return {
        success: false,
        message: "Dropbox delete failed",
        error: error.message
      };
    }
  },

  disconnect: async () => {
    return {
      success: true,
      message: "Dropbox uses token-based auth (no persistent connection)"
    };
  }

};