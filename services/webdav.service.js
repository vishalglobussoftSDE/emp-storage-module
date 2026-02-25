import { createClient } from "webdav";

export const getWebDavClient = ({
  webdav_base_url,
  webdav_username,
  webdav_password
}) => {
  if (!webdav_base_url || !webdav_username || !webdav_password) {
    throw new Error("WebDAV credentials missing");
  }

  return createClient(webdav_base_url, {
    username: webdav_username,
    password: webdav_password
  });
};

export const uploadToWebDav = async ({
  client,
  buffer,
  filePath
}) => {
  await client.putFileContents(filePath, buffer);
  return { path: filePath };
};

export const downloadFromWebDav = async ({
  client,
  filePath
}) => {
  return await client.getFileContents(filePath);
};

export const deleteFromWebDav = async ({
  client,
  filePath
}) => {
  await client.deleteFile(filePath);
  return true;
};