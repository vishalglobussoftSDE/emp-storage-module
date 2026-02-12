import { Dropbox } from "dropbox";
import axios from "axios";

/**
 * Generate Dropbox access_token using refresh_token
 */
export const getDropboxAccessToken = async ({
  app_key,
  app_secret,
  refresh_token
}) => {
  const tokenUrl = "https://api.dropboxapi.com/oauth2/token";

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token
    }),
    {
      auth: {
        username: app_key,
        password: app_secret
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data.access_token;
};

/**
 * Create Dropbox client
 */
export const getDropboxClient = async ({ app_key, app_secret, refresh_token }) => {
  const access_token = await getDropboxAccessToken({
    app_key,
    app_secret,
    refresh_token
  });

  return new Dropbox({ accessToken: access_token });
};

export const uploadToDropbox = async ({ dbx, buffer, fileName }) => {
  const response = await dbx.filesUpload({
    path: `/${fileName}`,
    contents: buffer,
    mode: "add",
    autorename: true,
    mute: false
  });

  return response.result;
};

export const downloadFromDropbox = async ({ dbx, path }) => {
  const response = await dbx.filesDownload({ path });

  const fileData = response.result.fileBinary;

  return Buffer.from(fileData);
};

export const deleteFromDropbox = async ({ dbx, path }) => {
  await dbx.filesDeleteV2({ path });
  return true;
};
