import axios from "axios";
import FormData from "form-data";

/**
 * Refresh Token -> Access Token
 */
export const getZohoAccessToken = async ({
  client_id,
  client_secret,
  refresh_token
}) => {
  const url = `https://accounts.zoho.com/oauth/v2/token`;

  const params = new URLSearchParams({
    refresh_token,
    client_id,
    client_secret,
    grant_type: "refresh_token"
  });

  const { data } = await axios.post(`${url}?${params.toString()}`);

  if (!data?.access_token) {
    throw new Error(
      "Zoho access_token not received. Check zoho_client_id / zoho_client_secret / zoho_refresh_token."
    );
  }

  return data.access_token;
};

/**
 * Same style like getGoogleDriveClient()
 */
export const getZohoWorkDriveClient = async ({
  zoho_client_id,
  zoho_client_secret,
  zoho_refresh_token,
  zoho_team_domain
}) => {
  const accessToken = await getZohoAccessToken({
    client_id: zoho_client_id,
    client_secret: zoho_client_secret,
    refresh_token: zoho_refresh_token
  });

  return {
    accessToken,
    teamDomain: zoho_team_domain,
    baseURL: "https://www.zohoapis.com/workdrive/api/v1"
  };
};

/**
 * Upload file
 * NOTE: Zoho WorkDrive needs folderId (parent_id)
 */
export const uploadToZohoWorkDrive = async ({
  client,
  buffer,
  fileName,
  folderId
}) => {
  const url = `${client.baseURL}/upload`;

  const form = new FormData();
  form.append("content", buffer, fileName);
  form.append("parent_id", folderId);

  const { data } = await axios.post(url, form, {
    headers: {
      Authorization: `Zoho-oauthtoken ${client.accessToken}`,
      ...form.getHeaders()
    }
  });

  const uploaded = data?.data?.[0];

  if (!uploaded?.id) {
    throw new Error("Zoho upload failed: file id not received from API.");
  }

  return {
    id: uploaded.id,
    name: uploaded.attributes?.name || fileName,
    size: uploaded.attributes?.storage_info?.size || null
  };
};

/**
 * Download file
 */
export const downloadFromZohoWorkDrive = async ({ client, fileId }) => {
  const url = `${client.baseURL}/files/${fileId}/download`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Zoho-oauthtoken ${client.accessToken}`
    },
    responseType: "arraybuffer"
  });

  return response.data;
};

/**
 * Delete file
 */
export const deleteFromZohoWorkDrive = async ({ client, fileId }) => {
  const url = `${client.baseURL}/files/${fileId}`;

  await axios.delete(url, {
    headers: {
      Authorization: `Zoho-oauthtoken ${client.accessToken}`
    }
  });

  return true;
};
