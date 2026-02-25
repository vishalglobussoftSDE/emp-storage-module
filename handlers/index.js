import { handleS3 } from "./s3.handler.js";
import { handleGoogleDrive } from "./googleDrive.handler.js";
import { handleCloudinary } from "./cloudinary.handler.js";
import { handleDropbox } from "./dropbox.handler.js";
import {handleSftp} from "./sftp.handler.js";
import {handleWebDav} from "./webdav.handler.js";
import { handleSmb } from "./smb.handler.js";
import { handleFtp } from "./ftp.handler.js";

export const STORAGE_HANDLERS = {
  s3: handleS3,
  google_drive: handleGoogleDrive,
  cloudinary: handleCloudinary,
  dropbox: handleDropbox,
  sftp : handleSftp,
  webdav: handleWebDav,
  smb: handleSmb,
  ftp: handleFtp
};
