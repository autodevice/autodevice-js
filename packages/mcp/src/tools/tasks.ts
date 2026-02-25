import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";

export function registerTaskTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "create_task",
    "Start an AI task agent that performs a goal on a device",
    {
      app_id: z.string().describe("The ID of the app to run the task against"),
      goal: z
        .string()
        .describe("Natural language description of what the AI agent should do"),
      device_id: z
        .string()
        .optional()
        .describe("Specific device ID to run on. If omitted, one is chosen automatically."),
      play_limit: z
        .number()
        .optional()
        .describe("Maximum number of actions the agent can take"),
    },
    async ({ app_id, goal, device_id, play_limit }) => {
      const result = await client.tasks.create({
        app_id,
        goal,
        device_id,
        play_limit,
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
    "get_task_status",
    "Get the current status of a task and its associated jobs",
    {
      task_id: z.string().describe("The ID of the task to check"),
    },
    async ({ task_id }) => {
      const task = await client.tasks.get(task_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );
}
