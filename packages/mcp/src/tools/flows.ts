import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";

export function registerFlowTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "list_flows",
    "List flows, optionally filtered by test suite or status",
    {
      suite_id: z
        .string()
        .optional()
        .describe("Filter flows by test suite ID"),
      status: z
        .string()
        .optional()
        .describe("Filter flows by status (draft, active, archived)"),
    },
    async ({ suite_id, status }) => {
      const result = await client.flows.list({
        test_suite_id: suite_id,
        status,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_flow",
    "Get a flow with its step definitions",
    {
      flow_id: z.string().describe("The ID of the flow to retrieve"),
    },
    async ({ flow_id }) => {
      const flow = await client.flows.get(flow_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(flow, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "create_flow",
    "Create a new flow within a test suite",
    {
      suite_id: z.string().describe("The test suite ID to add the flow to"),
      target_id: z
        .string()
        .describe("The target ID for the flow's setup context"),
      name: z.string().describe("Name of the flow"),
      description: z
        .string()
        .optional()
        .describe("Optional description of the flow"),
    },
    async ({ suite_id, target_id, name, description }) => {
      const flow = await client.flows.create({
        test_suite_id: suite_id,
        target_id,
        name,
        description,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(flow, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "run_flow",
    "Run a single flow against a target device configuration",
    {
      flow_id: z.string().describe("The ID of the flow to run"),
      target_id: z.string().describe("The target ID to run the flow against"),
    },
    async ({ flow_id, target_id }) => {
      const result = await client.flows.run(flow_id, {
        target_id,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
