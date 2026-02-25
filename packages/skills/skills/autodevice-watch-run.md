---
name: AutoDevice Watch Run
description: Watch a running test suite or task in real-time
tools: ["Bash"]
---

# Watch AutoDevice Run

You are helping the user monitor a running test suite or task in real-time.

## Prerequisites
- The `autodevice` CLI must be installed and configured

## Watch a Test Suite Run

```bash
autodevice runs watch <run-id> --json
```

This will poll the run status until it completes, then report results.

## Watch a Task

```bash
autodevice tasks watch <task-id> --json
```

## Finding Active Runs

If the user doesn't have a run ID:
```bash
autodevice runs list --status running --json
```

For active tasks:
```bash
autodevice tasks list --status running --json
```

## Reporting Progress

While watching, periodically report:
- Current status
- How many flows have completed vs total
- Any failures so far
- Elapsed time

When complete:
- Final outcome (pass/fail)
- Summary of all flow results
- Duration
- Link to dashboard if available

## Output Format
Always use `--json` flag. Parse JSON and provide real-time updates conversationally.
