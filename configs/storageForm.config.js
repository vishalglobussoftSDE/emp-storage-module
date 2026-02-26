const COMMON_FIELDS = [
  {
    name: "delete_data_older_than",
    label: "Delete Data Older Than (Days)",
    type: "number",
    required: false
  },
  {
    name: "note",
    label: "Note",
    type: "text",
    required: false
  }
];

export const STORAGE_FORM_CONFIG = {
  s3: [
    { name: "access_key", label: "Access Key", type: "text", required: true },
    { name: "secret_access_key", label: "Secret Access Key", type: "password", required: true },
    { name: "bucket_name", label: "Bucket Name", type: "text", required: true },
    { name: "region", label: "Region", type: "text", required: true },
    { name: "api_end_point", label: "API Endpoint", type: "text", required: false },
    ...COMMON_FIELDS
  ],
  google_drive: [
    { name: "client_id", label: "Client ID", type: "text", required: true },
    { name: "client_secret", label: "Client Secret", type: "password", required: true },
    { name: "refresh_token", label: "Refresh Token", type: "text", required: true },
    ...COMMON_FIELDS
  ],
  dropbox: [
    { name: "app_key", label: "App Key", type: "text", required: true },
    { name: "app_secret", label: "App Secret", type: "password", required: true },
    { name: "refresh_token", label: "Refresh Token", type: "text", required: true },
    { name: "redirect_url", label: "Redirect URL", type: "text", required: false },
    ...COMMON_FIELDS
  ],
  sftp: [
    { name: "username", label: "Username", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "perm_key", label: "SFTP Permanent Key", type: "text", required: false },
    { name: "host", label: "Host", type: "text", required: true },
    { name: "port", label: "Port", type: "number", required: true },
    { name: "sftp_path", label: "SFTP Path", type: "text", required: true },
    ...COMMON_FIELDS
  ],
  cloudinary: [
    { name: "cloud_name", label: "Cloud Name", type: "text", required: true },
    { name: "api_key", label: "API Key", type: "text", required: true },
    { name: "api_secret", label: "API Secret", type: "password", required: true },
    { name: "folder", label: "Folder (Optional)", type: "text", required: false },
    ...COMMON_FIELDS
  ],
  webdav: [
    { name: "webdav_base_url", label: "WebDAV Base URL", required: true },
    { name: "webdav_path", label: "WebDAV Path", required: true },
    { name: "webdav_username", label: "WebDAV Username", required: true },
    { name: "webdav_password", label: "WebDAV Password", required: true }
  ],
  smb: [
    { name: "smb_host", label: "SMB Host", required: true },
    { name: "smb_port", label: "SMB Port", required: false },
    { name: "smb_share", label: "SMB Share Name", required: true },
    { name: "smb_username", label: "SMB Username", required: true },
    { name: "smb_password", label: "SMB Password", required: true },
    { name: "smb_domain", label: "SMB Domain", required: false }
  ],
  ftp: [
  { name: "ftp_host", label: "FTP Host", required: true },
  { name: "ftp_port", label: "FTP Port", required: true },
  { name: "ftp_username", label: "FTP Username", required: true },
  { name: "ftp_password", label: "FTP Password", required: true }
]
  // one_drive: [
  //   { name: "onedrive_client_id", label: "OneDrive Client ID", type: "text", required: true },
  //   { name: "onedrive_client_secret", label: "OneDrive Client Secret", type: "password", required: true },
  //   { name: "onedrive_refresh_token", label: "OneDrive Refresh Token", type: "text", required: true },
  //   { name: "onedrive_redirect_url", label: "OneDrive Redirect URL", type: "text", required: false },
  //   { name: "tenant_id", label: "Tenant ID", type: "text", required: true },
  //   ...COMMON_FIELDS
  // ],

  // zoho_workdrive: [
  //   { name: "zoho_client_id", label: "Zoho Client ID", type: "text", required: true },
  //   { name: "zoho_client_secret", label: "Zoho Client Secret", type: "password", required: true },
  //   { name: "zoho_refresh_token", label: "Zoho Refresh Token", type: "text", required: true },
  //   { name: "zoho_team_domain", label: "Zoho Team Domain", type: "text", required: true },
  //   ...COMMON_FIELDS
  // ],

}; 