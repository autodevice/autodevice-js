export interface Target {
  id: string;
  name: string;
  description: string | null;
  device_type: string;
  os_version: string;
  platform: string;
  app_identifier: string;
  version_strategy: string;
  app_version: string | null;
  image_variant: string | null;
  auto_run_on_upload: boolean;
  created_at: string;
}

export interface CreateTargetParams {
  name: string;
  device_type: string;
  os_version: string;
  platform: "android" | "ios";
  app_identifier: string;
  description?: string;
  version_strategy?: "latest" | "static";
  app_version?: string;
  image_variant?: string;
  auto_run_on_upload?: boolean;
}

export interface UpdateTargetParams {
  name?: string;
  description?: string;
  device_type?: string;
  os_version?: string;
  platform?: "android" | "ios";
  app_identifier?: string;
  version_strategy?: "latest" | "static";
  app_version?: string;
  image_variant?: string;
  auto_run_on_upload?: boolean;
}
