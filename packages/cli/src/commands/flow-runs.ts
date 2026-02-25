import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerFlowRunsCommand(program: Command) {
  const flowRuns = program
    .command("flow-runs")
    .description("Manage flow runs");

  flowRuns
    .command("list")
    .description("List flow runs")
    .option("--flow <flow-id>", "Filter by flow")
    .option("--suite-run <suite-run-id>", "Filter by suite run")
    .option("--status <status>", "Filter by status")
    .option("--outcome <outcome>", "Filter by outcome")
    .option("--limit <n>", "Limit results")
    .option("--offset <n>", "Offset results")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flowRuns.list({
          flow_id: opts.flow,
          test_suite_run_id: opts.suiteRun,
          status: opts.status,
          outcome: opts.outcome,
          limit: opts.limit ? parseInt(opts.limit) : undefined,
          offset: opts.offset ? parseInt(opts.offset) : undefined,
        });
        output(cmd, result.flow_runs, {
          table: {
            columns: ["id", "status", "outcome", "flow_id", "duration_ms"],
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flowRuns
    .command("get <run-id>")
    .description("Get flow run detail")
    .action(async (runId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flowRuns.get(runId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flowRuns
    .command("steps <run-id>")
    .description("Get step-level execution detail")
    .action(async (runId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flowRuns.steps(runId);
        output(cmd, result, {
          table: {
            columns: ["step_no", "status", "original_instruction", "action_type", "duration_ms", "error_message"],
            truncate: { original_instruction: 50, error_message: 40 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
