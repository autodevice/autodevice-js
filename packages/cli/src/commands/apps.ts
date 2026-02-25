import { Command } from "commander";
import { readFileSync } from "node:fs";
import ora from "ora";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerAppsCommand(program: Command) {
  const apps = program.command("apps").description("Manage uploaded apps");

  apps
    .command("list")
    .description("List uploaded apps")
    .action(async (_opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.apps.list();
        output(cmd, result, {
          table: {
            columns: ["id", "app_name", "package_name", "platform", "version_name", "created_at"],
            truncate: { app_name: 30, package_name: 30 },
          },
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  apps
    .command("get <app-id>")
    .description("Get app detail")
    .action(async (appId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        const result = await client.apps.get(parseInt(appId));
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  apps
    .command("upload <file>")
    .description("Upload APK/IPA")
    .option("--commit-sha <sha>", "Git commit SHA")
    .option("--branch <branch>", "Git branch")
    .option("--repo <owner/repo>", "Repository full name")
    .option("--package-name <name>", "Package name override")
    .action(async (filePath, opts, cmd) => {
      try {
        const client = getClient(cmd);
        const spinner = ora("Uploading app...").start();

        const fileBuffer = readFileSync(filePath);
        const blob = new Blob([fileBuffer]);
        const filename = filePath.split("/").pop() || filePath;

        const result = await client.apps.upload(blob, filename, {
          commit_sha: opts.commitSha,
          branch: opts.branch,
          repo_full_name: opts.repo,
          package_name: opts.packageName,
        });

        spinner.succeed("Upload complete!");
        output(cmd, result);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });

  apps
    .command("delete <app-id>")
    .description("Delete an app")
    .action(async (appId, _opts, cmd) => {
      try {
        const client = getClient(cmd);
        await client.apps.delete(parseInt(appId));
        console.log(`App ${appId} deleted.`);
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
