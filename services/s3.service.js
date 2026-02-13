import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

// stream -> buffer helper
const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

export const getS3Client = ({ access_key, secret_access_key, region, api_end_point }) => {
  if (!access_key || !secret_access_key || !region) {
    throw new Error("S3 credentials missing (access_key/secret_access_key/region)");
  }

  const config = {
    region,
    credentials: {
      accessKeyId: access_key,
      secretAccessKey: secret_access_key
    }
  };

  // Optional custom endpoint (MinIO etc)
  if (api_end_point) {
    config.endpoint = api_end_point;
    config.forcePathStyle = true;
  }

  return new S3Client(config);
};

export const uploadToS3 = async ({ s3, bucket_name, buffer, fileName, mimeType }) => {
  if (!s3) throw new Error("S3 client missing");
  if (!bucket_name) throw new Error("bucket_name missing");
  if (!buffer) throw new Error("Upload buffer missing");

  const command = new PutObjectCommand({
    Bucket: bucket_name,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType
  });

  await s3.send(command);

  return { bucket: bucket_name, key: fileName };
};

export const downloadFromS3 = async ({ s3, bucket_name, key }) => {
  if (!s3) throw new Error("S3 client missing");
  if (!bucket_name) throw new Error("bucket_name missing");
  if (!key) throw new Error("key missing");

  const command = new GetObjectCommand({
    Bucket: bucket_name,
    Key: key
  });

  const response = await s3.send(command);

  if (!response?.Body) {
    throw new Error("S3 download failed: empty body");
  }

  return await streamToBuffer(response.Body);
};

export const deleteFromS3 = async ({ s3, bucket_name, key }) => {
  if (!s3) throw new Error("S3 client missing");
  if (!bucket_name) throw new Error("bucket_name missing");
  if (!key) throw new Error("key missing");

  const command = new DeleteObjectCommand({
    Bucket: bucket_name,
    Key: key
  });

  await s3.send(command);
  return true;
};
