import {
  getS3Client,
  uploadToS3,
  downloadFromS3,
  deleteFromS3
} from "../services/s3.service.js";

export const handleS3 = async (req) => {
  try {
    const { access_key, secret_access_key, bucket_name, region, api_end_point } = req.body;

    if (!req.file?.buffer) {
      return {
        success: false,
        field: "file",
        message: "Test file buffer is missing"
      };
    }

    const s3 = getS3Client({
      access_key,
      secret_access_key,
      region,
      api_end_point
    });

    const key = `test-${Date.now()}-${req.file.originalname}`;

    // 1) Upload
    const uploaded = await uploadToS3({
      s3,
      bucket_name,
      buffer: req.file.buffer,
      fileName: key,
      mimeType: req.file.mimetype
    });

    // 2) Download
    const downloadedBuffer = await downloadFromS3({
      s3,
      bucket_name,
      key: uploaded.key
    });

    const downloadedBytes = downloadedBuffer.length;

    // 3) Delete
    await deleteFromS3({
      s3,
      bucket_name,
      key: uploaded.key
    });

    return {
      success: true,
      message: "S3: Upload -> Download -> Delete completed successfully",
      storage: "s3",
      uploaded_bucket: uploaded.bucket,
      uploaded_key: uploaded.key,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };
  } catch (error) {
    return {
      success: false,
      message: "S3 handler failed",
      error: error.message
    };
  }
};
