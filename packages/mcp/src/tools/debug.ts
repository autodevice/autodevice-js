import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AutoDeviceClient } from "@autodevice/sdk";
import type { FlowRun, FlowRunStep } from "@autodevice/sdk";

interface FailedFlowAnalysis {
  flow_run_id: string;
  flow_name: string | undefined;
  outcome: string | null;
  outcome_summary: string | null;
  duration_ms: number | null;
  device_type: string | null;
  device_os: string | null;
  failed_steps: FailedStepDetail[];
}

interface FailedStepDetail {
  step_no: number;
  instruction: string | null;
  status: string;
  error_message: string | null;
  action_type: string | null;
  action_descriptor: string | null;
  screenshot_url: string | null;
  subactions: SubactionDetail[];
}

interface SubactionDetail {
  action_type: string;
  action_description: string;
  action_success: boolean;
  error_message: string | null;
  reasoning: string | null;
  screenshot_url: string | null;
}

export function registerDebugTools(
  server: McpServer,
  client: AutoDeviceClient
): void {
  server.tool(
    "debug_failed_run",
    "Analyze a failed test suite run. Retrieves the run details, identifies failed flows, fetches step-level detail for each failure, and returns a comprehensive diagnostic report.",
    {
      run_id: z.string().describe("The ID of the test suite run to debug"),
    },
    async ({ run_id }) => {
      // 1. Get the run details
      const run = await client.runs.get(run_id);

      // 2. Get all flow runs for this suite run
      const flowRuns = await client.runs.flows(run_id);

      // 3. Identify failed flow runs
      const failedFlowRuns = flowRuns.filter(
        (fr: FlowRun) => fr.outcome === "fail"
      );

      if (failedFlowRuns.length === 0) {
        const summary = {
          run_id: run.id,
          status: run.status,
          outcome: run.outcome,
          message: "No failed flow runs found in this suite run.",
          run_summary: run.outcome_summary,
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

      // 4. For each failed flow run, get step-level detail
      const failedAnalyses: FailedFlowAnalysis[] = await Promise.all(
        failedFlowRuns.map(async (flowRun: FlowRun) => {
          const steps = await client.flowRuns.steps(flowRun.id);

          // Filter to steps that have errors or non-successful status
          const failedSteps: FailedStepDetail[] = steps
            .filter(
              (step: FlowRunStep) =>
                step.error_message || step.status === "failed"
            )
            .map((step: FlowRunStep) => ({
              step_no: step.step_no,
              instruction: step.original_instruction,
              status: step.status,
              error_message: step.error_message,
              action_type: step.action_type,
              action_descriptor: step.action_descriptor,
              screenshot_url: step.screenshot_url,
              subactions: (step.subactions || [])
                .filter((sa) => !sa.action_success || sa.error_message)
                .map((sa) => ({
                  action_type: sa.action_type,
                  action_description: sa.action_description,
                  action_success: sa.action_success,
                  error_message: sa.error_message,
                  reasoning: sa.reasoning,
                  screenshot_url: sa.screenshot_url,
                })),
            }));

          return {
            flow_run_id: flowRun.id,
            flow_name: flowRun.flow?.name,
            outcome: flowRun.outcome,
            outcome_summary: flowRun.outcome_summary,
            duration_ms: flowRun.duration_ms,
            device_type: flowRun.device_type,
            device_os: flowRun.device_os,
            failed_steps: failedSteps,
          };
        })
      );

      // 5. Build the comprehensive report
      const report = {
        run_id: run.id,
        suite_id: run.test_suite_id,
        suite_name: run.test_suite?.name,
        status: run.status,
        outcome: run.outcome,
        outcome_summary: run.outcome_summary,
        total_flows: run.total_flows,
        passed_flows: run.passed_flows,
        failed_flows: run.failed_flows,
        skipped_flows: run.skipped_flows,
        duration_ms: run.duration_ms,
        commit_sha: run.commit_sha,
        branch: run.branch,
        failures: failedAnalyses,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    }
  );
}
