import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerDevicesCommand(program: Command) {
  const devices = program
    .command("devices")
    .description("Manage available devices");

  devices
    .command("list")
    .description("List available devices")
    .option("--platform <android|ios>", "Filter by platform")
    .action(async (opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.devices.list(opts.platform);

        const isJson = cmd.optsWithGlobals().json;
        if (isJson) {
          output(cmd, result);
          return;
        }

        // Flatten devices for table display
        const allDevices: Record<string, unknown>[] = [];
        if (result.android) {
          for (const d of result.android) {
            allDevices.push({
              platform: "android",
              id: d.id,
              label: d.label,
              value: d.value,
              versions: d.supportedVersions.join(", "),
            });
          }
        }
        if (result.ios) {
          for (const d of result.ios) {
            allDevices.push({
              platform: "ios",
              id: d.id,
              label: d.label,
              value: d.value,
              versions: d.supportedVersions.join(", "),
            });
          }
        }

        output(cmd, allDevices, {
          table: {
            columns: ["platform", "id", "label", "value", "versions"],
            truncate: { versions: 40 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
