import { Command } from "commander";
import { readConfig, writeConfig } from "../config";
import chalk from "chalk";

export function registerConfigureCommand(program: Command) {
  program
    .command("configure")
    .description("Configure AutoDevice CLI settings")
    .option("--api-key <key>", "Set API key")
    .option("--base-url <url>", "Set custom base URL")
    .action((opts) => {
      const config = readConfig();

      if (opts.apiKey) config.api_key = opts.apiKey;
      if (opts.baseUrl) config.base_url = opts.baseUrl;

      writeConfig(config);
      console.log(chalk.green("Configuration saved to ~/.autodevice/config.json"));

      if (config.api_key) {
        const masked =
          config.api_key.slice(0, 8) +
          "..." +
          config.api_key.slice(-4);
        console.log(`  API Key: ${masked}`);
      }
      if (config.base_url) {
        console.log(`  Base URL: ${config.base_url}`);
      }
    });
}
