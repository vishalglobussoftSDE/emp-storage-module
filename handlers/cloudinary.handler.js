import {
  getCloudinaryClient,
  uploadToCloudinary,
  downloadFromCloudinary,
  deleteFromCloudinary
} from "../services/cloudinary.service.js";

export const handleCloudinary = async (req) => {
  const { cloud_name, api_key, api_secret, folder } = req.body;

  const cloudinaryClient = getCloudinaryClient({
    cloud_name,
    api_key,
    api_secret
  });

  // 1) Upload
  const fileName = `test-${Date.now()}-${req.file.originalname}`;

  const uploadedFile = await uploadToCloudinary({
    cloudinaryClient,
    buffer: req.file.buffer,
    fileName,
    folder
  });

  // 2) Download check (here only url check)
  const downloadedData = await downloadFromCloudinary({
    cloudinaryUrl: uploadedFile.secure_url
  });

  const downloadedBytes = downloadedData?.length || 0;

  // 3) Delete
  await deleteFromCloudinary({
    cloudinaryClient,
    public_id: uploadedFile.public_id
  });

  return {
    success: true,
    message: "Upload -> Download -> Delete completed successfully",
    storage: "cloudinary",
    uploaded_file_id: uploadedFile.public_id,
    uploaded_file_name: uploadedFile.original_filename,
    uploaded_url: uploadedFile.secure_url,
    downloaded_bytes: downloadedBytes,
    deleted: true
  };
};
