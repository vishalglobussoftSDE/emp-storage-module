import { google } from "googleapis";
import { Readable } from "stream";

export const getGoogleDriveClient = ({ client_id, client_secret, refresh_token }) => {
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Google Drive credentials missing (client_id/client_secret/refresh_token)");
  }

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

  oAuth2Client.setCredentials({ refresh_token });

  return google.drive({
    version: "v3",
    auth: oAuth2Client
  });
};

export const uploadToGoogleDrive = async ({ drive, buffer, fileName, mimeType }) => {
  if (!drive) throw new Error("Drive client missing");
  if (!buffer) throw new Error("Upload buffer missing");

  const fileMetadata = {
    name: fileName
  };

  const media = {
    mimeType,
    body: Readable.from(buffer)
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name, mimeType, size"
  });

  return response.data;
};

export const downloadFromGoogleDrive = async ({ drive, fileId }) => {
  if (!drive) throw new Error("Drive client missing");
  if (!fileId) throw new Error("fileId missing");

  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  return Buffer.from(response.data);
};


export const deleteFromGoogleDrive = async ({ drive, fileId }) => {
  if (!drive) throw new Error("Drive client missing");
  if (!fileId) throw new Error("fileId missing");

  await drive.files.delete({ fileId });
  return true;
};
