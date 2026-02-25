import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";

export function registerAppTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "list_apps",
    "List all uploaded application builds",
    {},
    async () => {
      const apps = await client.apps.list();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(apps, null, 2),
          },
        ],
      };
    }
  );
}
