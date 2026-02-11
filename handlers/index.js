import { handleS3 } from "./s3.handler.js";
import { handleGoogleDrive } from "./googleDrive.handler.js";
import { handleCloudinary } from "./cloudinary.handler.js";
import { handleDropbox } from "./dropbox.handler.js";
import { handleZohoWorkDrive } from "./zohoWorkDrive.handler.js";

export const STORAGE_HANDLERS = {
  s3: handleS3,
  google_drive: handleGoogleDrive,
  cloudinary: handleCloudinary,
  dropbox: handleDropbox,
  zoho_workdrive: handleZohoWorkDrive
};
