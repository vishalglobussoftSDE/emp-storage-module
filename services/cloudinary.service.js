import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

export const getCloudinaryClient = ({ cloud_name, api_key, api_secret }) => {
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary credentials missing (cloud_name/api_key/api_secret)");
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  });

  return cloudinary;
};

export const uploadToCloudinary = async ({
  cloudinaryClient,
  buffer,
  fileName,
  folder
}) => {
  if (!cloudinaryClient) throw new Error("cloudinaryClient missing");
  if (!buffer) throw new Error("Upload buffer missing");

  return new Promise((resolve, reject) => {
    cloudinaryClient.uploader
      .upload_stream(
        {
          public_id: fileName,
          folder: folder || undefined,
          resource_type: "image"
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

/**
 * Download file bytes from Cloudinary URL
 * Returns Buffer
 */
export const downloadFromCloudinary = async ({ cloudinaryUrl }) => {
  if (!cloudinaryUrl) throw new Error("cloudinaryUrl missing");

  const response = await axios.get(cloudinaryUrl, {
    responseType: "arraybuffer"
  });

  return Buffer.from(response.data);
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async ({ cloudinaryClient, public_id }) => {
  if (!cloudinaryClient) throw new Error("cloudinaryClient missing");
  if (!public_id) throw new Error("public_id missing");

  const result = await cloudinaryClient.uploader.destroy(public_id);

  // Cloudinary returns:
  // { result: "ok" } OR { result: "not found" }
  if (result?.result !== "ok") {
    throw new Error(`Cloudinary delete failed: ${result?.result}`);
  }

  return true;
};
