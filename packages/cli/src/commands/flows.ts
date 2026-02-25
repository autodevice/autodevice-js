import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerFlowsCommand(program: Command) {
  const flows = program.command("flows").description("Manage test flows");

  flows
    .command("list")
    .description("List flows")
    .option("--suite <suite-id>", "Filter by suite")
    .option("--status <status>", "Filter by status")
    .option("--limit <n>", "Limit results")
    .option("--offset <n>", "Offset results")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flows.list({
          test_suite_id: opts.suite,
          status: opts.status,
          limit: opts.limit ? parseInt(opts.limit) : undefined,
          offset: opts.offset ? parseInt(opts.offset) : undefined,
        });
        output(cmd, result.flows, {
          table: {
            columns: ["id", "name", "status", "test_suite_id", "execution_order"],
            truncate: { name: 40 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flows
    .command("get <flow-id>")
    .description("Get flow with steps")
    .action(async (flowId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flows.get(flowId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flows
    .command("create")
    .description("Create a flow")
    .requiredOption("--suite <suite-id>", "Test suite ID")
    .requiredOption("--target <target-id>", "Target ID")
    .requiredOption("--name <name>", "Flow name")
    .option("--description <desc>", "Flow description")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flows.create({
          name: opts.name,
          test_suite_id: opts.suite,
          target_id: opts.target,
          description: opts.description,
        });
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flows
    .command("update <flow-id>")
    .description("Update a flow")
    .option("--name <name>", "Flow name")
    .option("--description <desc>", "Flow description")
    .option("--status <status>", "Flow status")
    .action(async (flowId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const params: Record<string, unknown> = {};
        if (opts.name) params.name = opts.name;
        if (opts.description) params.description = opts.description;
        if (opts.status) params.status = opts.status;
        const result = await client.flows.update(flowId, params);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flows
    .command("delete <flow-id>")
    .description("Archive a flow")
    .action(async (flowId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        await client.flows.delete(flowId);
        console.log(`Flow ${flowId} archived.`);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  flows
    .command("run <flow-id>")
    .description("Run a single flow")
    .requiredOption("--target <target-id>", "Target ID")
    .action(async (flowId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.flows.run(flowId, {
          target_id: opts.target,
        });
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
