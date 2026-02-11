import {
  getZohoAccessToken,
  uploadToZohoWorkDrive,
  downloadFromZohoWorkDrive,
  deleteFromZohoWorkDrive
} from "../services/zohoWorkDrive.service.js";

export const handleZohoWorkDrive = async (req) => {
  const {
    zoho_client_id,
    zoho_client_secret,
    zoho_refresh_token,
    zoho_team_domain,
    zoho_folder_id,
    zoho_accounts_domain
  } = req.body;

  const accessToken = await getZohoAccessToken({
    zoho_client_id,
    zoho_client_secret,
    zoho_refresh_token,
    zoho_accounts_domain: zoho_accounts_domain || "https://accounts.zoho.in"
  });

  const uploadedFile = await uploadToZohoWorkDrive({
    accessToken,
    zoho_team_domain,
    folderId: zoho_folder_id,
    buffer: req.file.buffer,
    fileName: `test-${Date.now()}-${req.file.originalname}`
  });

  const fileId = uploadedFile.id;

  const downloadedData = await downloadFromZohoWorkDrive({
    accessToken,
    zoho_team_domain,
    fileId
  });

  const downloadedBytes =
    downloadedData?.byteLength || downloadedData?.length || 0;

  await deleteFromZohoWorkDrive({
    accessToken,
    zoho_team_domain,
    fileId
  });

  return {
    success: true,
    message: "Zoho WorkDrive Upload -> Download -> Delete completed successfully",
    storage: "zoho_workdrive",
    uploaded_file_id: fileId,
    uploaded_file_name: uploadedFile?.attributes?.name || req.file.originalname,
    downloaded_bytes: downloadedBytes,
    deleted: true
  };
};
