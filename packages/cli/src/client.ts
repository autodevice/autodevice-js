import { AutoDeviceClient } from "@autodevice/sdk";
import { getApiKey, getBaseUrl } from "./config";

export function getClient(cmd: { optsWithGlobals(): Record<string, unknown> }): AutoDeviceClient {
  const apiKey = getApiKey(cmd);
  const baseUrl = getBaseUrl(cmd);

  if (!apiKey) {
    console.error(
      "Error: API key required. Run `autodevice configure --api-key <key>` or set AUTODEVICE_API_KEY."
    );
    process.exit(2);
  }

  return new AutoDeviceClient({ apiKey, baseUrl });
}
