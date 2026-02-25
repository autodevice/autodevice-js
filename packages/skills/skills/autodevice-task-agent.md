---
name: AutoDevice Task Agent
description: Start an AI task agent to explore an app and report findings
tools: ["Bash"]
---

# AutoDevice AI Task Agent

You are helping the user start an AI task agent that will explore a mobile app.

## Prerequisites
- The `autodevice` CLI must be installed and configured
- An app must be uploaded to AutoDevice

## Workflow

1. **List available apps:**
   ```bash
   autodevice apps list --json
   ```

2. **Ask the user** for:
   - Which app to test
   - The goal/objective for the AI agent
   - Optional: specific device, time limit

3. **Create the task:**
   ```bash
   autodevice tasks create --app <app-id> --goal "Explore the login flow and report any issues" --json
   ```

   Optional flags:
   - `--device <device-id>` — Specific device
   - `--play-limit <seconds>` — Time limit (default: 60, max: 300)

4. **Watch the task progress:**
   ```bash
   autodevice tasks watch <task-id> --json
   ```

5. **Get detailed results:**
   ```bash
   autodevice tasks get <task-id> --json
   ```

   For job-level detail with messages:
   ```bash
   autodevice tasks job <task-id> <job-id> --json
   ```

6. **Report findings** to the user:
   - Task outcome (completed/failed)
   - Job results and summaries
   - Key observations from the agent's messages
   - Screenshots if available

## Output Format
Always use `--json` flag. Parse JSON and report findings conversationally.
