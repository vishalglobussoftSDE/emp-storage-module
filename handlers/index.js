import { s3Handler } from "./s3.handler.js";
import { googleDriveHandler } from "./googleDrive.handler.js";
import { handleCloudinary } from "./cloudinary.handler.js";
import { dropboxHandler } from "./dropbox.handler.js";
import {sftpHandler} from "./sftp.handler.js";
import {webdavHandler} from "./webdav.handler.js";
import { smbHandler } from "./smb.handler.js";
import { ftpHandler } from "./ftp.handler.js";

export const STORAGE_HANDLERS = {
  s3: s3Handler,
  google_drive: googleDriveHandler,
  cloudinary: handleCloudinary,
  dropbox: dropboxHandler,
  sftp : sftpHandler,
  webdav: webdavHandler,
  smb: smbHandler,
  ftp: ftpHandler
};
