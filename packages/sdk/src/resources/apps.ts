import type { RequestFn } from "../types/common";
import type {
  App,
  StartUploadParams,
  StartUploadResponse,
  ConfirmUploadParams,
  ConfirmUploadResponse,
  UploadStatusResponse,
  UpdateAppParams,
  UploadAppOptions,
} from "../types/apps";

export class AppsResource {
  constructor(private request: RequestFn) {}

  async list(): Promise<App[]> {
    const res = await this.request<{ apps: App[] }>("GET", "/apps");
    return res.apps;
  }

  async get(appId: number): Promise<App> {
    const res = await this.request<{ app: App }>("GET", `/apps/${appId}`);
    return res.app;
  }

  async update(appId: number, params: UpdateAppParams): Promise<App> {
    const res = await this.request<{ app: App }>("PUT", `/apps/${appId}`, {
      body: params,
    });
    return res.app;
  }

  async delete(appId: number): Promise<void> {
    await this.request("DELETE", `/apps/${appId}`);
  }

  async startUpload(params: StartUploadParams): Promise<StartUploadResponse> {
    return this.request<StartUploadResponse>("POST", "/apps/start-upload", {
      body: params,
    });
  }

  async confirmUpload(
    params: ConfirmUploadParams
  ): Promise<ConfirmUploadResponse> {
    return this.request<ConfirmUploadResponse>(
      "POST",
      "/apps/confirm-upload",
      { body: params }
    );
  }

  async uploadStatus(appId: number): Promise<UploadStatusResponse> {
    return this.request<UploadStatusResponse>("GET", "/apps/upload-status", {
      query: { app_id: appId },
    });
  }

  /**
   * Orchestrates the full upload flow:
   * 1. Start upload to get presigned URL
   * 2. PUT the file to the presigned URL
   * 3. Confirm the upload
   * 4. Poll upload status until complete
   */
  async upload(
    file: Blob,
    filename: string,
    options?: UploadAppOptions
  ): Promise<App> {
    const { upload_url, file_path } = await this.startUpload({
      filename,
      package_name: options?.package_name,
    });

    await fetch(upload_url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": "application/octet-stream" },
    });

    const fileSize = file.size;

    const { app_id } = await this.confirmUpload({
      file_path,
      file_size: fileSize,
      package_name: options?.package_name,
      commit_sha: options?.commit_sha,
      branch: options?.branch,
      repo_full_name: options?.repo_full_name,
    });

    // Poll upload status
    const deadline = Date.now() + 300_000; // 5 minute timeout
    while (Date.now() < deadline) {
      const status = await this.uploadStatus(app_id);
      if (status.status === "completed" && status.app) {
        return status.app;
      }
      if (status.status === "failed") {
        throw new Error(`Upload failed for app ${app_id}`);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    throw new Error(`Upload timed out for app ${app_id}`);
  }
}
