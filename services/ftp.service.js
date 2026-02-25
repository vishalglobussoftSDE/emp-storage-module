import { Client } from "basic-ftp";
import { Readable, Writable } from "stream";

export const connectFtp = async ({
  ftp_host,
  ftp_port = 2121,
  ftp_username,
  ftp_password
}) => {
  const client = new Client();
  client.ftp.verbose = true;

  await client.access({
    host: ftp_host,
    port: Number(ftp_port),
    user: ftp_username,
    password: ftp_password,
    secure: true,
    secureOptions: {
      rejectUnauthorized: false   // 🔥 VERY IMPORTANT for self-signed cert
    }
  });

  return client;
};

export const uploadToFtp = async ({ client, buffer, fileName }) => {
  const readableStream = Readable.from(buffer);

  await client.ensureDir("/");     // ensure root
  await client.uploadFrom(readableStream, fileName);

  return fileName;
};

export const downloadFromFtp = async ({ client, fileName }) => {
  const chunks = [];

  const writable = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });

  await client.downloadTo(writable, fileName);

  return Buffer.concat(chunks);
};

export const deleteFromFtp = async ({ client, fileName }) => {
  await client.remove(fileName);
  return true;
};