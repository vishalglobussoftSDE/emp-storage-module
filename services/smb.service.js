import SMB2 from "smb2";

export const getSmbClient = ({
  smb_host,
  smb_share,
  smb_username,
  smb_password,
  smb_domain
}) => {
  if (!smb_host || !smb_share || !smb_username || !smb_password) {
    throw new Error(
      "SMB credentials missing (host/share/username/password)"
    );
  }

  return new SMB2({
    share: `\\\\${smb_host}\\${smb_share}`,
    domain: smb_domain || "",
    username: smb_username,
    password: smb_password,
    autoCloseTimeout: 0
  });
};

export const uploadToSmb = async ({ client, buffer, filePath }) => {
  return new Promise((resolve, reject) => {
    client.writeFile(filePath, buffer, (err) => {
      if (err) return reject(err);
      resolve({ path: filePath });
    });
  });
};

export const downloadFromSmb = async ({ client, filePath }) => {
  return new Promise((resolve, reject) => {
    client.readFile(filePath, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

export const deleteFromSmb = async ({ client, filePath }) => {
  return new Promise((resolve, reject) => {
    client.unlink(filePath, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};