import type { RequestFn } from "../types/common";
import type { DeviceList } from "../types/devices";

export class DevicesResource {
  constructor(private request: RequestFn) {}

  async list(platform?: "android" | "ios"): Promise<DeviceList> {
    const res = await this.request<{ devices: DeviceList }>(
      "GET",
      "/devices",
      {
        query: { platform },
      }
    );
    return res.devices;
  }
}
