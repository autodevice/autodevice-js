import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerRunsCommand(program: Command) {
  const runs = program.command("runs").description("Manage test suite runs");

  runs
    .command("list")
    .description("List test suite runs")
    .option("--suite <suite-id>", "Filter by suite")
    .option("--status <status>", "Filter by status")
    .option("--outcome <outcome>", "Filter by outcome")
    .option("--limit <n>", "Limit results")
    .option("--offset <n>", "Offset results")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.runs.list({
          test_suite_id: opts.suite,
          status: opts.status,
          outcome: opts.outcome,
          limit: opts.limit ? parseInt(opts.limit) : undefined,
          offset: opts.offset ? parseInt(opts.offset) : undefined,
        });
        output(cmd, result.test_suite_runs, {
          table: {
            columns: ["id", "status", "outcome", "total_flows", "passed_flows", "failed_flows", "initiated_at"],
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  runs
    .command("get <run-id>")
    .description("Get run detail")
    .action(async (runId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.runs.get(runId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  runs
    .command("flows <run-id>")
    .description("List flow runs in a suite run")
    .action(async (runId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.runs.flows(runId);
        output(cmd, result, {
          table: {
            columns: ["id", "status", "outcome", "flow_id", "duration_ms"],
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  runs
    .command("watch <run-id>")
    .description("Stream run progress until complete")
    .option("--timeout <ms>", "Timeout in milliseconds", "600000")
    .action(async (runId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const spinner = ora("Watching run...").start();
        const run = await client.runs.wait(runId, {
          timeoutMs: parseInt(opts.timeout),
        });
        spinner.stop();

        const outcomeColor = run.outcome === "pass" ? chalk.green : chalk.red;
        console.log(
          `Run ${run.id}: ${outcomeColor(run.outcome || run.status)}`
        );
        console.log(
          `  Flows: ${run.passed_flows} passed, ${run.failed_flows} failed, ${run.skipped_flows} skipped`
        );
        if (run.duration_ms) {
          console.log(`  Duration: ${(run.duration_ms / 1000).toFixed(1)}s`);
        }

        output(cmd, run);

        if (run.outcome === "fail") process.exit(1);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
