import {
  getCloudinaryClient,
  uploadToCloudinary,
  downloadFromCloudinary,
  deleteFromCloudinary
} from "../services/cloudinary.service.js";

export const handleCloudinary = async (req) => {
  try {
    const { cloud_name, api_key, api_secret, folder } = req.body;

    // safety
    if (!req.file?.buffer) {
      return {
        success: false,
        field: "file",
        message: "Test file buffer is missing"
      };
    }

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

    if (!uploadedFile?.public_id) {
      return {
        success: false,
        message: "Cloudinary upload failed (no public_id returned)"
      };
    }

    // 2) Download check (Cloudinary returns URL, so we download using url)
    const downloadedData = await downloadFromCloudinary({
      cloudinaryUrl: uploadedFile.secure_url
    });

    let downloadedBytes = 0;

    if (Buffer.isBuffer(downloadedData)) {
      downloadedBytes = downloadedData.length;
    } else if (downloadedData?.byteLength) {
      downloadedBytes = downloadedData.byteLength;
    } else if (downloadedData?.length) {
      downloadedBytes = downloadedData.length;
    }

    // 3) Delete
    await deleteFromCloudinary({
      cloudinaryClient,
      public_id: uploadedFile.public_id
    });

    return {
      success: true,
      message: "Cloudinary: Upload -> Download -> Delete completed successfully",
      storage: "cloudinary",
      uploaded_file_id: uploadedFile.public_id,
      uploaded_file_name: uploadedFile.original_filename || fileName,
      uploaded_url: uploadedFile.secure_url,
      downloaded_bytes: downloadedBytes,
      deleted: true
    };
  } catch (error) {
    return {
      success: false,
      message: "Cloudinary handler failed",
      error: error.message
    };
  }
};
