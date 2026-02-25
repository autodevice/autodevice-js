import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AutoDeviceClient } from "@autodevice/sdk";
import { registerSuiteTools } from "./tools/suites.js";
import { registerFlowTools } from "./tools/flows.js";
import { registerRunTools } from "./tools/runs.js";
import { registerAppTools } from "./tools/apps.js";
import { registerDeviceTools } from "./tools/devices.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerDebugTools } from "./tools/debug.js";

export function createServer(): McpServer {
  const apiKey = process.env.AUTODEVICE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AUTODEVICE_API_KEY environment variable is required. " +
        "Set it before starting the MCP server."
    );
  }

  const client = new AutoDeviceClient({ apiKey });

  const server = new McpServer({
    name: "autodevice",
    version: "0.1.0",
  });

  registerSuiteTools(server, client);
  registerFlowTools(server, client);
  registerRunTools(server, client);
  registerAppTools(server, client);
  registerDeviceTools(server, client);
  registerTaskTools(server, client);
  registerDebugTools(server, client);

  return server;
}
