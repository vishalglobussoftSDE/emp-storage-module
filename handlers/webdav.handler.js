import fs from "fs";
import path from "path";
import {
  getWebDavClient,
  uploadToWebDav,
  downloadFromWebDav,
  deleteFromWebDav
} from "../services/webdav.service.js";

let lastUploadedPath = null; // 🔥 store last uploaded file path

const createWebDavFromReq = (req) => {
  const {
    webdav_base_url,
    webdav_username,
    webdav_password
  } = req.body;

  if (!webdav_base_url || !webdav_username || !webdav_password) {
    throw new Error("Missing WebDAV credentials");
  }

  return getWebDavClient({
    webdav_base_url,
    webdav_username,
    webdav_password
  });
};

export const webdavHandler = {

  // VERIFY
  verify: async (req) => {
    try {
      const client = createWebDavFromReq(req);

      // simple root check
      await client.getDirectoryContents("/");

      return {
        success: true,
        message: "WebDAV verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "WebDAV verification failed",
        error: error.message
      };
    }
  },

  // UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const { webdav_path } = req.body;

      if (!webdav_path) {
        return {
          success: false,
          message: "webdav_path is required"
        };
      }

      const client = createWebDavFromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);
      const fileName = `test-${Date.now()}.png`;
      const fullPath = `${webdav_path}/${fileName}`.replace(/\/+/g, "/");

      await uploadToWebDav({
        client,
        buffer,
        filePath: fullPath
      });

      lastUploadedPath = fullPath; //store for auto usage

      return {
        success: true,
        message: "File uploaded successfully",
        path: fullPath
      };

    } catch (error) {
      return {
        success: false,
        message: "WebDAV upload failed",
        error: error.message
      };
    }
  },

  // DOWNLOAD (Auto last uploaded)
  download: async (req) => {
    try {
      if (!lastUploadedPath) {
        return {
          success: false,
          message: "No file uploaded yet"
        };
      }

      const client = createWebDavFromReq(req);

      const downloadedData = await downloadFromWebDav({
        client,
        filePath: lastUploadedPath
      });

      const downloadedBytes = Buffer.isBuffer(downloadedData)
        ? downloadedData.length
        : downloadedData?.byteLength || 0;

      return {
        success: true,
        path: lastUploadedPath,
        downloaded_bytes: downloadedBytes
      };

    } catch (error) {
      return {
        success: false,
        message: "WebDAV download failed",
        error: error.message
      };
    }
  },

  // DELETE (Auto last uploaded)
  delete: async (req) => {
    try {
      if (!lastUploadedPath) {
        return {
          success: false,
          message: "No file available to delete"
        };
      }

      const client = createWebDavFromReq(req);

      await deleteFromWebDav({
        client,
        filePath: lastUploadedPath
      });

      const deletedPath = lastUploadedPath;
      lastUploadedPath = null; // reset after delete

      return {
        success: true,
        message: "Last uploaded file deleted",
        path: deletedPath
      };

    } catch (error) {
      return {
        success: false,
        message: "WebDAV delete failed",
        error: error.message
      };
    }
  },

  disconnect: async () => {
    return {
      success: true,
      message: "WebDAV uses stateless HTTP connection"
    };
  }

};