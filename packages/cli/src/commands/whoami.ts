import { Command } from "commander";
import { getClient } from "../client";
import { output, errorOutput } from "../output";

export function registerWhoamiCommand(program: Command) {
  program
    .command("whoami")
    .description("Validate API key and show account info")
    .action(async (_opts, cmd) => {
      try {
        const client = getClient(cmd);
        // Validate key by listing suites (lightweight call)
        const suites = await client.suites.list();
        output(cmd, {
          authenticated: true,
          test_suites_count: suites.length,
        });
      } catch (error) {
        errorOutput(error);
        process.exit(2);
      }
    });
}
