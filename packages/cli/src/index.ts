import { Command } from "commander";
import { registerConfigureCommand } from "./commands/configure";
import { registerWhoamiCommand } from "./commands/whoami";
import { registerSuitesCommand } from "./commands/suites";
import { registerFlowsCommand } from "./commands/flows";
import { registerTargetsCommand } from "./commands/targets";
import { registerRunsCommand } from "./commands/runs";
import { registerFlowRunsCommand } from "./commands/flow-runs";
import { registerAppsCommand } from "./commands/apps";
import { registerDevicesCommand } from "./commands/devices";
import { registerTasksCommand } from "./commands/tasks";
import { registerWebhooksCommand } from "./commands/webhooks";
import { registerSnapshotsCommand } from "./commands/snapshots";

const program = new Command();

program
  .name("autodevice")
  .description("CLI for AutoDevice — automated mobile app testing")
  .version("0.1.0")
  .option("--json", "Output raw JSON")
  .option("--api-key <key>", "Override API key")
  .option("--base-url <url>", "Override base URL")
  .option("--no-color", "Disable colored output")
  .option("--verbose", "Show request/response details");

registerConfigureCommand(program);
registerWhoamiCommand(program);
registerSuitesCommand(program);
registerFlowsCommand(program);
registerTargetsCommand(program);
registerRunsCommand(program);
registerFlowRunsCommand(program);
registerAppsCommand(program);
registerDevicesCommand(program);
registerTasksCommand(program);
registerWebhooksCommand(program);
registerSnapshotsCommand(program);

program.parse();
