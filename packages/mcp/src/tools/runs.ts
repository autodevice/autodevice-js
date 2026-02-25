import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";

export function registerRunTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "list_runs",
    "List test suite runs, optionally filtered by suite or status",
    {
      suite_id: z
        .string()
        .optional()
        .describe("Filter runs by test suite ID"),
      status: z
        .string()
        .optional()
        .describe("Filter runs by status (running, completed, failed)"),
      limit: z
        .number()
        .optional()
        .describe("Maximum number of runs to return"),
    },
    async ({ suite_id, status, limit }) => {
      const result = await client.runs.list({
        test_suite_id: suite_id,
        status,
        limit,
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
    "get_run_status",
    "Get the current status and summary of a test suite run",
    {
      run_id: z.string().describe("The ID of the test suite run"),
    },
    async ({ run_id }) => {
      const run = await client.runs.get(run_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(run, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_run_results",
    "Get a test suite run along with all its flow run results",
    {
      run_id: z.string().describe("The ID of the test suite run"),
    },
    async ({ run_id }) => {
      const [run, flowRuns] = await Promise.all([
        client.runs.get(run_id),
        client.runs.flows(run_id),
      ]);

      const results = {
        run,
        flow_runs: flowRuns,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_flow_run_steps",
    "Get step-level detail for a specific flow run, including subactions",
    {
      flow_run_id: z.string().describe("The ID of the flow run"),
    },
    async ({ flow_run_id }) => {
      const steps = await client.flowRuns.steps(flow_run_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(steps, null, 2),
          },
        ],
      };
    }
  );
}
