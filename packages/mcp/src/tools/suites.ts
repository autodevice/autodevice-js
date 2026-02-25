import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";

export function registerSuiteTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "list_test_suites",
    "List all test suites in the workspace",
    {},
    async () => {
      const suites = await client.suites.list();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(suites, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_test_suite",
    "Get detailed information about a specific test suite",
    {
      suite_id: z.string().describe("The ID of the test suite to retrieve"),
    },
    async ({ suite_id }) => {
      const suite = await client.suites.get(suite_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(suite, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "run_test_suite",
    "Run a test suite against a target. Optionally wait for completion and return results.",
    {
      suite_id: z.string().describe("The ID of the test suite to run"),
      target_id: z
        .string()
        .describe("The ID of the target (app + device config) to test against"),
      wait: z
        .boolean()
        .optional()
        .describe(
          "If true, poll until the run completes and return full results. Defaults to false."
        ),
      commit_sha: z
        .string()
        .optional()
        .describe("Git commit SHA to associate with this run"),
      branch: z
        .string()
        .optional()
        .describe("Git branch name to associate with this run"),
    },
    async ({ suite_id, target_id, wait, commit_sha, branch }) => {
      if (wait) {
        const result = await client.suites.runAndWait(suite_id, {
          targetId: target_id,
          commitSha: commit_sha,
          branch,
        });

        const summary = {
          run: result.run,
          flow_runs: result.flowRuns,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      const response = await client.suites.run(suite_id, {
        targetId: target_id,
        commitSha: commit_sha,
        branch,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );
}
