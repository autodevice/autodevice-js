import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerSnapshotsCommand(program: Command) {
  const snapshots = program
    .command("snapshots")
    .description("Manage device snapshots");

  snapshots
    .command("list")
    .description("List device snapshots")
    .action(async (_opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.snapshots.list();
        output(cmd, result, {
          table: {
            columns: ["id", "name", "platform", "device_type", "os_version", "created_at"],
            truncate: { name: 30 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  snapshots
    .command("get <snapshot-id>")
    .description("Get snapshot detail")
    .action(async (snapshotId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.snapshots.get(snapshotId);
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  snapshots
    .command("delete <snapshot-id>")
    .description("Delete a snapshot")
    .action(async (snapshotId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        await client.snapshots.delete(snapshotId);
        console.log(`Snapshot ${snapshotId} deleted.`);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
