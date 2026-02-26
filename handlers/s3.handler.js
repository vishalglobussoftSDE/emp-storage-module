import fs from "fs";
import path from "path";
import {
  getS3Client,
  uploadToS3,
  downloadFromS3,
  deleteFromS3
} from "../services/s3.service.js";

let lastUploadedKey = null; // 🔥 store last uploaded key

const createS3FromReq = (req) => {
  const { access_key, secret_access_key, region, api_end_point } = req.body;

  if (!access_key || !secret_access_key || !region) {
    throw new Error("Missing S3 credentials");
  }

  return getS3Client({
    access_key,
    secret_access_key,
    region,
    api_end_point
  });
};

export const s3Handler = {

  // ✅ VERIFY
  verify: async (req) => {
    try {
      const { bucket_name } = req.body;

      if (!bucket_name) {
        return {
          success: false,
          message: "bucket_name is required"
        };
      }

      const s3 = createS3FromReq(req);

      // simple head bucket check
      await s3.headBucket({ Bucket: bucket_name });

      return {
        success: true,
        message: "S3 verified successfully"
      };

    } catch (error) {
      return {
        success: false,
        message: "S3 verification failed",
        error: error.message
      };
    }
  },

  // ✅ UPLOAD (Auto public/test.png)
  upload: async (req) => {
    try {
      const { bucket_name } = req.body;

      if (!bucket_name) {
        return {
          success: false,
          message: "bucket_name is required"
        };
      }

      const s3 = createS3FromReq(req);

      const filePath = path.join(process.cwd(), "public", "test.png");

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: "public/test.png not found"
        };
      }

      const buffer = fs.readFileSync(filePath);
      const key = `test-${Date.now()}.png`;

      const uploaded = await uploadToS3({
        s3,
        bucket_name,
        buffer,
        fileName: key,
        mimeType: "image/png"
      });

      lastUploadedKey = uploaded.key; // 🔥 store for auto usage

      return {
        success: true,
        message: "File uploaded successfully",
        bucket: uploaded.bucket,
        key: uploaded.key
      };

    } catch (error) {
      return {
        success: false,
        message: "S3 upload failed",
        error: error.message
      };
    }
  },

  // ✅ DOWNLOAD (Auto last uploaded)
  download: async (req) => {
    try {
      const { bucket_name } = req.body;

      if (!bucket_name) {
        return {
          success: false,
          message: "bucket_name is required"
        };
      }

      if (!lastUploadedKey) {
        return {
          success: false,
          message: "No file uploaded yet"
        };
      }

      const s3 = createS3FromReq(req);

      const buffer = await downloadFromS3({
        s3,
        bucket_name,
        key: lastUploadedKey
      });

      return {
        success: true,
        bucket: bucket_name,
        key: lastUploadedKey,
        downloaded_bytes: buffer.length
      };

    } catch (error) {
      return {
        success: false,
        message: "S3 download failed",
        error: error.message
      };
    }
  },

  // ✅ DELETE (Auto last uploaded)
  delete: async (req) => {
    try {
      const { bucket_name } = req.body;

      if (!bucket_name) {
        return {
          success: false,
          message: "bucket_name is required"
        };
      }

      if (!lastUploadedKey) {
        return {
          success: false,
          message: "No file available to delete"
        };
      }

      const s3 = createS3FromReq(req);

      await deleteFromS3({
        s3,
        bucket_name,
        key: lastUploadedKey
      });

      const deletedKey = lastUploadedKey;
      lastUploadedKey = null; // 🔥 reset after delete

      return {
        success: true,
        message: "Last uploaded file deleted",
        bucket: bucket_name,
        key: deletedKey
      };

    } catch (error) {
      return {
        success: false,
        message: "S3 delete failed",
        error: error.message
      };
    }
  },

  disconnect: async () => {
    return {
      success: true,
      message: "S3 does not maintain persistent connection"
    };
  }

};