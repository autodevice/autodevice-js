import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerTargetsCommand(program: Command) {
  const targets = program.command("targets").description("Manage test targets");

  targets
    .command("list <suite-id>")
    .description("List targets for a suite")
    .action(async (suiteId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.targets.list(suiteId);
        output(cmd, result, {
          table: {
            columns: ["id", "name", "platform", "device_type", "os_version", "app_identifier"],
            truncate: { name: 30, app_identifier: 30 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  targets
    .command("create <suite-id>")
    .description("Create a target")
    .requiredOption("--name <name>", "Target name")
    .requiredOption("--device <device-type>", "Device type")
    .requiredOption("--os <version>", "OS version")
    .requiredOption("--platform <android|ios>", "Platform")
    .requiredOption("--app <app-identifier>", "App identifier")
    .option("--version-strategy <latest|static>", "Version strategy")
    .option("--app-version <version>", "App version (for static strategy)")
    .option("--image-variant <variant>", "Image variant")
    .option("--auto-run-on-upload", "Auto-run tests on app upload")
    .action(async (suiteId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.targets.create(suiteId, {
          name: opts.name,
          device_type: opts.device,
          os_version: opts.os,
          platform: opts.platform,
          app_identifier: opts.app,
          description: opts.description,
          version_strategy: opts.versionStrategy,
          app_version: opts.appVersion,
          image_variant: opts.imageVariant,
          auto_run_on_upload: opts.autoRunOnUpload || undefined,
        });
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  targets
    .command("update <suite-id> <target-id>")
    .description("Update a target")
    .option("--name <name>", "Target name")
    .option("--device <device-type>", "Device type")
    .option("--os <version>", "OS version")
    .option("--platform <android|ios>", "Platform")
    .option("--app <app-identifier>", "App identifier")
    .option("--version-strategy <latest|static>", "Version strategy")
    .option("--app-version <version>", "App version")
    .option("--image-variant <variant>", "Image variant")
    .option("--auto-run-on-upload", "Auto-run tests on app upload")
    .option("--no-auto-run-on-upload", "Disable auto-run on upload")
    .action(async (suiteId, targetId, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const params: Record<string, unknown> = {};
        if (opts.name) params.name = opts.name;
        if (opts.device) params.device_type = opts.device;
        if (opts.os) params.os_version = opts.os;
        if (opts.platform) params.platform = opts.platform;
        if (opts.app) params.app_identifier = opts.app;
        if (opts.versionStrategy) params.version_strategy = opts.versionStrategy;
        if (opts.appVersion) params.app_version = opts.appVersion;
        if (opts.imageVariant) params.image_variant = opts.imageVariant;
        if (opts.autoRunOnUpload !== undefined) params.auto_run_on_upload = opts.autoRunOnUpload;
        const result = await client.targets.update(suiteId, targetId, params);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  targets
    .command("delete <suite-id> <target-id>")
    .description("Delete a target")
    .action(async (suiteId, targetId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        await client.targets.delete(suiteId, targetId);
        console.log(`Target ${targetId} deleted.`);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
