import { v2 as cloudinary } from "cloudinary";

export const getCloudinaryClient = ({ cloud_name, api_key, api_secret }) => {
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

export const downloadFromCloudinary = async ({ cloudinaryUrl }) => {
  // NOTE: Cloudinary direct download normally needs HTTP fetch
  // But hum check ke liye simple URL return kar rahe.
  return cloudinaryUrl;
};

export const deleteFromCloudinary = async ({
  cloudinaryClient,
  public_id
}) => {
  await cloudinaryClient.uploader.destroy(public_id);
  return true;
};
