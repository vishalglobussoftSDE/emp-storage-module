import { STORAGE_HANDLERS } from "../handlers/index.js";

const getHandler = (storageType) => {
  return STORAGE_HANDLERS[storageType];
};

export const verifyStorage = async (req, res) => {
  const handler = getHandler(req.body.select_storage_type);
  const result = await handler.verify(req);

  res.status(result.success ? 200 : 400).json(result);
};

export const uploadStorage = async (req, res) => {
  const handler = getHandler(req.body.select_storage_type);
  const result = await handler.upload(req);

  res.status(result.success ? 200 : 400).json(result);
};

export const downloadStorage = async (req, res) => {
  const handler = getHandler(req.body.select_storage_type);
  const result = await handler.download(req);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.setHeader("Content-Disposition", "attachment; filename=file");
  res.send(result.buffer);
};

export const deleteStorage = async (req, res) => {
  const handler = getHandler(req.body.select_storage_type);
  const result = await handler.delete(req);

  res.status(result.success ? 200 : 400).json(result);
};

export const disconnectStorage = async (req, res) => {
  const handler = getHandler(req.body.select_storage_type);
  const result = await handler.disconnect(req);

  res.status(result.success ? 200 : 400).json(result);
};