import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

// stream to buffer helper
const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

export const getS3Client = ({
  access_key,
  secret_access_key,
  region,
  api_end_point
}) => {
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

export const uploadToS3 = async ({
  s3,
  bucket_name,
  buffer,
  fileName,
  mimeType
}) => {
  const command = new PutObjectCommand({
    Bucket: bucket_name,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType
  });

  await s3.send(command);

  return {
    Bucket: bucket_name,
    Key: fileName
  };
};

export const downloadFromS3 = async ({ s3, bucket_name, key }) => {
  const command = new GetObjectCommand({
    Bucket: bucket_name,
    Key: key
  });

  const response = await s3.send(command);

  // response.Body is a stream in Node.js
  const buffer = await streamToBuffer(response.Body);

  return buffer;
};

export const deleteFromS3 = async ({ s3, bucket_name, key }) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket_name,
    Key: key
  });

  await s3.send(command);
  return true;
};
