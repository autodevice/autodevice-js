import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CONFIG_DIR = join(homedir(), ".autodevice");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface Config {
  api_key?: string;
  base_url?: string;
}

export function readConfig(): Config {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function writeConfig(config: Config): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}

export function getApiKey(cmd: { optsWithGlobals(): Record<string, unknown> }): string {
  const opts = cmd.optsWithGlobals();
  return (
    (opts.apiKey as string) ||
    process.env.AUTODEVICE_API_KEY ||
    readConfig().api_key ||
    ""
  );
}

export function getBaseUrl(cmd: { optsWithGlobals(): Record<string, unknown> }): string | undefined {
  const opts = cmd.optsWithGlobals();
  return (
    (opts.baseUrl as string) ||
    process.env.AUTODEVICE_BASE_URL ||
    readConfig().base_url ||
    undefined
  );
}
