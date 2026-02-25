---
name: AutoDevice Manage Flows
description: Create, list, update, and manage test flows and steps
tools: ["Bash"]
---

# Manage AutoDevice Test Flows

You are helping the user manage test flows and their steps within AutoDevice test suites.

## Prerequisites
- The `autodevice` CLI must be installed and configured
- Verify setup: `autodevice whoami`

## Listing Flows

```bash
autodevice flows list --suite <suite-id> --json
```

## Creating a Flow

1. Get the suite ID and target ID first:
   ```bash
   autodevice suites list --json
   autodevice targets list <suite-id> --json
   ```

2. Create the flow:
   ```bash
   autodevice flows create --suite <suite-id> --target <target-id> --name "Flow Name" --description "Description" --json
   ```

## Managing Flow Steps

Steps are the individual test instructions within a flow.

### List steps:
```bash
autodevice flows get <flow-id> --json
```

### Add steps using the SDK or API directly (via the MCP server or programmatic access).

## Updating a Flow

```bash
autodevice flows update <flow-id> --name "New Name" --status active --json
```

## Running a Single Flow

```bash
autodevice flows run <flow-id> --target <target-id> --json
```

## Output Format
Always use `--json` flag. Parse JSON and explain results conversationally.
