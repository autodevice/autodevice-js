---
name: AutoDevice Debug Failure
description: Investigate and debug a failed test run
tools: ["Bash"]
---

# Debug Failed AutoDevice Test Run

You are helping the user investigate why a test run failed.

## Prerequisites
- The `autodevice` CLI must be installed and configured
- User must have a run ID or know which suite failed

## Workflow

1. **Get the run details:**
   ```bash
   autodevice runs get <run-id> --json
   ```

2. **List the flow runs for this suite run:**
   ```bash
   autodevice runs flows <run-id> --json
   ```

3. **For each failed flow run, get step-level detail:**
   ```bash
   autodevice flow-runs steps <flow-run-id> --json
   ```

4. **Analyze the failures:**
   - Identify which step failed
   - Check the error message
   - Note the screenshot URL for visual context
   - Look at subactions for more detail on what the agent attempted

5. **Report findings:**
   - Summarize which flows failed and why
   - For each failure: the step instruction, what went wrong, and the screenshot
   - Suggest potential fixes (e.g., update step instructions, fix app bugs, adjust timeouts)

## Finding Recent Failures

If the user doesn't have a run ID:
```bash
autodevice runs list --status completed --outcome fail --limit 5 --json
```

## Output Format
Always use `--json` flag. Parse JSON and provide detailed analysis.
