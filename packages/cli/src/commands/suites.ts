import { Command } from "commander";
import ora from "ora";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerSuitesCommand(program: Command) {
  const suites = program.command("suites").description("Manage test suites");

  suites
    .command("list")
    .description("List all test suites")
    .action(async (_opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.suites.list();
        output(cmd, result, {
          table: {
            columns: ["id", "name", "status", "created_at"],
            truncate: { name: 40 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  suites
    .command("get <suite-id>")
    .description("Get test suite detail")
    .action(async (suiteId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.suites.get(suiteId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  suites
    .command("create")
    .description("Create a test suite")
    .requiredOption("--name <name>", "Suite name")
    .option("--description <desc>", "Suite description")
    .option("--parallel", "Enable parallel execution")
    .option("--stop-on-failure", "Stop on first failure")
    .option("--timeout <ms>", "Timeout in milliseconds")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.suites.create({
          name: opts.name,
          description: opts.description,
          parallel_execution: opts.parallel || undefined,
          stop_on_failure: opts.stopOnFailure || undefined,
          timeout_ms: opts.timeout ? parseInt(opts.timeout) : undefined,
        });
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  suites
    .command("update <suite-id>")
    .description("Update a test suite")
    .option("--name <name>", "Suite name")
    .option("--description <desc>", "Suite description")
    .option("--parallel", "Enable parallel execution")
    .option("--no-parallel", "Disable parallel execution")
    .option("--stop-on-failure", "Stop on first failure")
    .option("--no-stop-on-failure", "Continue on failure")
    .option("--timeout <ms>", "Timeout in milliseconds")
    .action(async (suiteId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const params: Record<string, unknown> = {};
        if (opts.name) params.name = opts.name;
        if (opts.description) params.description = opts.description;
        if (opts.parallel !== undefined) params.parallel_execution = opts.parallel;
        if (opts.stopOnFailure !== undefined) params.stop_on_failure = opts.stopOnFailure;
        if (opts.timeout) params.timeout_ms = parseInt(opts.timeout);
        const result = await client.suites.update(suiteId, params);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  suites
    .command("delete <suite-id>")
    .description("Archive a test suite")
    .action(async (suiteId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        await client.suites.delete(suiteId);
        console.log(`Suite ${suiteId} archived.`);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  suites
    .command("run <suite-id>")
    .description("Run a test suite")
    .requiredOption("--target <target-id>", "Target configuration ID")
    .option("--commit-sha <sha>", "Git commit SHA")
    .option("--branch <branch>", "Git branch")
    .option("--repo <owner/repo>", "Repository full name")
    .option("--wait", "Wait for run to complete")
    .option("--timeout <ms>", "Timeout for --wait (default: 600000)", "600000")
    .action(async (suiteId, opts, cmd) => {
      try {
        const client = getClient(cmd);

        if (opts.wait) {
          const spinner = ora("Running test suite...").start();
          const result = await client.suites.runAndWait(suiteId, {
            targetId: opts.target,
            commitSha: opts.commitSha,
            branch: opts.branch,
            repoFullName: opts.repo,
            timeoutMs: parseInt(opts.timeout),
          });
          spinner.stop();
          output(cmd, result);

          if (result.run.outcome === "fail") process.exit(1);
        } else {
          const result = await client.suites.run(suiteId, {
            targetId: opts.target,
            commitSha: opts.commitSha,
            branch: opts.branch,
            repoFullName: opts.repo,
          });
          output(cmd, result);
        }
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
