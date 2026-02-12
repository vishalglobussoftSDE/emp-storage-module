    import SftpClient from "ssh2-sftp-client";

export const getSftpClient = async ({
  host,
  port,
  username,
  password,
  perm_key
}) => {
  const sftp = new SftpClient();

  const connectionOptions = {
    host,
    port: Number(port || 22),
    username
  };

  // ✅ If perm_key provided => use privateKey
  if (perm_key && perm_key !== "NA") {
    connectionOptions.privateKey = perm_key;
  } else {
    connectionOptions.password = password;
  }

  await sftp.connect(connectionOptions);

  return sftp;
};

export const uploadToSftp = async ({ sftp, buffer, remotePath }) => {
  await sftp.put(buffer, remotePath);

  return {
    remotePath
  };
};

export const downloadFromSftp = async ({ sftp, remotePath }) => {
  const data = await sftp.get(remotePath);
  return data; // Buffer
};

export const deleteFromSftp = async ({ sftp, remotePath }) => {
  await sftp.delete(remotePath);
  return true;
};
