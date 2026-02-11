import { google } from "googleapis";
import { Readable } from "stream";

export const getGoogleDriveClient = ({
  client_id,
  client_secret,
  refresh_token
}) => {
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

  oAuth2Client.setCredentials({ refresh_token });

  const drive = google.drive({
    version: "v3",
    auth: oAuth2Client
  });

  return drive;
};

export const uploadToGoogleDrive = async ({
  drive,
  buffer,
  fileName,
  mimeType
}) => {
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

  return response.data; // { id, name, mimeType, size }
};

export const downloadFromGoogleDrive = async ({ drive, fileId }) => {
  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  return response.data; // ArrayBuffer
};

export const deleteFromGoogleDrive = async ({ drive, fileId }) => {
  await drive.files.delete({ fileId });
  return true;
};
