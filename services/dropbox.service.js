import { Dropbox } from "dropbox";

export const getDropboxClient = ({ access_token }) => {
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

  return response.result; // { id, name, path_lower, ... }
};

export const downloadFromDropbox = async ({ dbx, path }) => {
  const response = await dbx.filesDownload({ path });

  const fileData = response.result.fileBinary;

  // convert to Buffer
  return Buffer.from(fileData);
};

export const deleteFromDropbox = async ({ dbx, path }) => {
  await dbx.filesDeleteV2({ path });
  return true;
};
