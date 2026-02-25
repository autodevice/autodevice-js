---
name: AutoDevice Run Tests
description: Run a test suite and report results
tools: ["Bash"]
---

# Run AutoDevice Test Suite

You are helping the user run automated mobile app tests using AutoDevice.

## Prerequisites
- The `autodevice` CLI must be installed and configured (`autodevice configure --api-key <key>`)
- Verify setup: `autodevice whoami`

## Workflow

1. **List available test suites:**
   ```bash
   autodevice suites list --json
   ```

2. **Ask the user which suite to run** (if not specified)

3. **Get the suite's targets:**
   ```bash
   autodevice targets list <suite-id> --json
   ```

4. **Run the suite and wait for results:**
   ```bash
   autodevice suites run <suite-id> --target <target-id> --wait --json
   ```

5. **If any flows failed, get details:**
   ```bash
   autodevice flow-runs steps <flow-run-id> --json
   ```

6. **Report results** to the user conversationally:
   - Total flows, passed, failed
   - For failures: step that failed, error message, screenshot URL
   - Suggest fixes based on error messages

## Output Format
Always use `--json` flag when running commands so you can parse the output reliably.
Parse the JSON output, then explain results in natural language.
