import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";

export function registerDeviceTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "list_devices",
    "List available device configurations, optionally filtered by platform",
    {
      platform: z
        .enum(["android", "ios"])
        .optional()
        .describe("Filter devices by platform (android or ios)"),
    },
    async ({ platform }) => {
      const devices = await client.devices.list(platform);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(devices, null, 2),
          },
        ],
      };
    }
  );
}
