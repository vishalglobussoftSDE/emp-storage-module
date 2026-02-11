import {
  getS3Client,
  uploadToS3,
  downloadFromS3,
  deleteFromS3
} from "../services/s3.service.js";

export const handleS3 = async (req) => {
  const { access_key, secret_access_key, bucket_name, region, api_end_point } =
    req.body;

  const s3 = getS3Client({
    access_key,
    secret_access_key,
    region,
    api_end_point
  });

  // 1) Upload
  const fileKey = `test-${Date.now()}-${req.file.originalname}`;

  const uploadedFile = await uploadToS3({
    s3,
    bucket_name,
    buffer: req.file.buffer,
    fileName: fileKey,
    mimeType: req.file.mimetype
  });

  // 2) Download check
  const downloadedData = await downloadFromS3({
    s3,
    bucket_name,
    key: uploadedFile.Key
  });

  const downloadedBytes =
    downloadedData?.byteLength || downloadedData?.length || 0;

  // 3) Delete
  await deleteFromS3({
    s3,
    bucket_name,
    key: uploadedFile.Key
  });

  return {
    success: true,
    message: "Upload -> Download -> Delete completed successfully",
    storage: "s3",
    uploaded_file_bucket: uploadedFile.Bucket,
    uploaded_file_key: uploadedFile.Key,
    downloaded_bytes: downloadedBytes,
    deleted: true
  };
};
