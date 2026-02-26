import { Command } from "commander";
import { readConfig, writeConfig } from "../config";
import chalk from "chalk";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export function registerConfigureCommand(program: Command) {
  program
    .command("configure")
    .description("Configure AutoDevice CLI settings")
    .option("--api-key <key>", "Set API key")
    .option("--base-url <url>", "Set custom base URL")
    .action(async (opts) => {
      const config = readConfig();

      let apiKey: string | undefined = opts.apiKey;
      let baseUrl: string | undefined = opts.baseUrl;

      if (!apiKey && !baseUrl && input.isTTY && output.isTTY) {
        const rl = createInterface({ input, output });
        try {
          const apiPrompt = config.api_key
            ? "API key (press Enter to keep current): "
            : "API key: ";
          const nextApiKey = (await rl.question(apiPrompt)).trim();
          if (nextApiKey) apiKey = nextApiKey;

          const basePrompt = config.base_url
            ? "Base URL (press Enter to keep current, '-' to clear): "
            : "Base URL (optional): ";
          const nextBaseUrl = (await rl.question(basePrompt)).trim();
          if (nextBaseUrl === "-") {
            baseUrl = "";
          } else if (nextBaseUrl) {
            baseUrl = nextBaseUrl;
          }
        } finally {
          rl.close();
        }
      }

      if (apiKey) config.api_key = apiKey;
      if (baseUrl !== undefined) {
        if (baseUrl) config.base_url = baseUrl;
        else delete config.base_url;
      }

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
