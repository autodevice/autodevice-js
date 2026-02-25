# autodevice-js

AutoDevice SDK, CLI, and integrations for JavaScript & TypeScript.

Automate mobile app testing with [AutoDevice](https://autodevice.io) — run test suites, manage flows, upload builds, and debug failures from code, the command line, or AI agents.

## Packages

| Package | npm | Description |
|---------|-----|-------------|
| [`@autodevice/sdk`](./packages/sdk) | [![npm](https://img.shields.io/npm/v/@autodevice/sdk)](https://www.npmjs.com/package/@autodevice/sdk) | TypeScript client library |
| [`autodevice`](./packages/cli) | [![npm](https://img.shields.io/npm/v/autodevice)](https://www.npmjs.com/package/autodevice) | CLI tool |
| [`@autodevice/mcp`](./packages/mcp) | [![npm](https://img.shields.io/npm/v/@autodevice/mcp)](https://www.npmjs.com/package/@autodevice/mcp) | MCP server for AI agents |
| [`@autodevice/skills`](./packages/skills) | [![npm](https://img.shields.io/npm/v/@autodevice/skills)](https://www.npmjs.com/package/@autodevice/skills) | Claude Code skills |

## Quick Start

### SDK

```bash
npm install @autodevice/sdk
```

```typescript
import { AutoDeviceClient } from "@autodevice/sdk";

const client = new AutoDeviceClient({ apiKey: "sk_live_..." });

// List test suites
const suites = await client.suites.list();

// Run a suite and wait for results
const { run, flowRuns } = await client.suites.runAndWait("suite-id", {
  targetId: "target-id",
});

console.log(`Result: ${run.outcome} — ${run.passed_flows} passed, ${run.failed_flows} failed`);
```

### CLI

```bash
npm install -g autodevice
autodevice configure --api-key sk_live_...
```

```bash
# List suites
autodevice suites list

# Run tests and wait for results
autodevice suites run <suite-id> --target <target-id> --wait

# Upload a build
autodevice apps upload ./app-release.apk

# Debug a failed run
autodevice flow-runs steps <flow-run-id>
```

### MCP Server

Add to your MCP config (e.g., `~/.claude/mcp.json`):

```json
{
  "mcpServers": {
    "autodevice": {
      "command": "npx",
      "args": ["@autodevice/mcp"],
      "env": {
        "AUTODEVICE_API_KEY": "sk_live_..."
      }
    }
  }
}
```

### Claude Code Skills

```bash
npx @autodevice/skills install-skills
```

## Authentication

All packages use the same API key. Get yours at [autodevice.io](https://autodevice.io).

**Priority order:**
1. Explicit parameter (`apiKey` option or `--api-key` flag)
2. `AUTODEVICE_API_KEY` environment variable
3. `~/.autodevice/config.json` (set via `autodevice configure`)

## Development

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test

# Typecheck
bun run typecheck
```

## License

[MIT](./LICENSE)
