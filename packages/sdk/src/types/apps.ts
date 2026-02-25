export interface App {
  id: number;
  app_name: string;
  package_name: string;
  platform: string;
  version_name: string;
  version_code: string;
  created_at: string;
}

export interface StartUploadParams {
  filename: string;
  package_name?: string;
}

export interface StartUploadResponse {
  upload_url: string;
  file_path: string;
  token: string;
}

export interface ConfirmUploadParams {
  file_path: string;
  file_size: number;
  package_name?: string;
  commit_sha?: string;
  branch?: string;
  repo_full_name?: string;
}

export interface ConfirmUploadResponse {
  message: string;
  app_id: number;
}

export interface UploadStatusResponse {
  status: string;
  app?: App;
}

export interface UpdateAppParams {
  app_name?: string;
  package_name?: string;
}

export interface UploadAppOptions {
  commit_sha?: string;
  branch?: string;
  repo_full_name?: string;
  package_name?: string;
}
