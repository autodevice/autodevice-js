# CLAUDE.md

This is the guide for Claude Code when working on the autodevice-js monorepo.

## Project Overview

AutoDevice SDK, CLI, and integrations for JavaScript & TypeScript. This monorepo contains 4 packages that wrap the AutoDevice REST API for automated mobile app testing.

## Monorepo Structure

```
packages/
  sdk/       @autodevice/sdk     — TypeScript client library (zero runtime deps, uses fetch)
  cli/       autodevice          — CLI tool (depends on sdk)
  skills/    @autodevice/skills  — Claude Code skill markdown files
  mcp/       @autodevice/mcp     — MCP server (depends on sdk)
```

## Tech Stack

- **Runtime**: Node.js >= 18
- **Package manager**: bun (use `bun` for all install/run commands, never npm/yarn/pnpm)
- **Monorepo**: bun workspaces + turborepo
- **Build**: tsup (dual ESM/CJS for SDK, ESM-only for CLI and MCP)
- **TypeScript**: strict mode, ES2022 target, bundler module resolution
- **Testing**: vitest
- **Versioning**: changesets

## Common Commands

```bash
bun install          # Install all dependencies
bun run build        # Build all packages (via turbo)
bun run test         # Run all tests (via turbo)
bun run typecheck    # Typecheck all packages (via turbo)
bun run lint         # Lint all packages (via turbo)
```

To build/test a single package:

```bash
cd packages/sdk && bun run build
cd packages/cli && bun run build
cd packages/mcp && bun run build
```

## Architecture

### SDK (`packages/sdk`)

- `src/client.ts` — `AutoDeviceClient` class with core HTTP request method
- `src/resources/` — One file per API resource (suites, flows, runs, etc.). Each class takes a bound `request` function from the client.
- `src/types/` — TypeScript interfaces for all API request/response shapes
- `src/errors.ts` — Typed error classes: `AutoDeviceError`, `AuthenticationError`, `NotFoundError`, `RateLimitError`
- Zero runtime dependencies. Only uses built-in `fetch`.
- Exports dual CJS/ESM with `.d.ts` declarations.

### CLI (`packages/cli`)

- `src/index.ts` — Commander program setup, registers all commands
- `src/commands/` — One file per command group (suites, flows, runs, apps, etc.)
- `src/config.ts` — Reads/writes `~/.autodevice/config.json`
- `src/client.ts` — Creates SDK client from config/env/flags
- `src/output.ts` — Handles `--json` flag, table formatting
- Dependencies: commander, chalk, ora, cli-table3

### MCP Server (`packages/mcp`)

- `src/server.ts` — Creates McpServer, registers all tools
- `src/tools/` — One file per tool group, each registers tools on the server
- Uses `@modelcontextprotocol/sdk` and zod for tool parameter schemas
- Reads `AUTODEVICE_API_KEY` from environment

### Skills (`packages/skills`)

- `skills/` — Markdown files with YAML frontmatter for Claude Code
- `install.sh` — Symlinks skills into `~/.claude/skills/`
- No build step

## Key Patterns

- **Resource pattern**: Each SDK resource is a class that receives a `RequestFn` (the client's bound `request` method). All API calls go through this single method.
- **API key resolution order**: `--api-key` flag > `AUTODEVICE_API_KEY` env var > `~/.autodevice/config.json`
- **CLI output**: Every command supports `--json` for machine-readable output. Without it, data is formatted as tables.
- **Polling**: `suites.runAndWait()`, `runs.wait()`, and `tasks.watch()` poll the API until a terminal status is reached.
- **Workspace dependencies**: CLI and MCP depend on SDK via `"@autodevice/sdk": "workspace:*"`. Turborepo builds SDK first.

## API Reference

Base URL: `https://autodevice.io/api/v1`
Auth: `Authorization: Bearer <api_key>`

The full API spec is in `docs/plans/sdk-cli-skills-plan.md` (Section 7).

## Adding a New SDK Resource

1. Create types in `packages/sdk/src/types/<resource>.ts`
2. Export them from `packages/sdk/src/types/index.ts`
3. Create resource class in `packages/sdk/src/resources/<resource>.ts`
4. Add to `AutoDeviceClient` constructor in `packages/sdk/src/client.ts`
5. Export from `packages/sdk/src/index.ts`

## Adding a New CLI Command

1. Create command file in `packages/cli/src/commands/<command>.ts`
2. Export a `register<Name>Command(program)` function
3. Import and call it in `packages/cli/src/index.ts`
4. Use `getClient(cmd)` for SDK access, `output(cmd, data, opts)` for formatted output

## Adding a New MCP Tool

1. Add tool registration in the appropriate `packages/mcp/src/tools/<group>.ts`
2. Use `server.tool(name, description, zodSchema, handler)` pattern
3. Return `{ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }`
