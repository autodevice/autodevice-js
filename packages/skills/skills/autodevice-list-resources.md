---
name: AutoDevice List Resources
description: List suites, flows, devices, apps, runs, or any AutoDevice resource
tools: ["Bash"]
---

# List AutoDevice Resources

You are helping the user quickly look up AutoDevice resources.

## Prerequisites
- The `autodevice` CLI must be installed and configured

## Available Resources

### Test Suites
```bash
autodevice suites list --json
```

### Flows
```bash
autodevice flows list --json
autodevice flows list --suite <suite-id> --json
```

### Targets
```bash
autodevice targets list <suite-id> --json
```

### Test Suite Runs
```bash
autodevice runs list --json
autodevice runs list --suite <suite-id> --json
autodevice runs list --status running --json
```

### Flow Runs
```bash
autodevice flow-runs list --json
autodevice flow-runs list --flow <flow-id> --json
```

### Apps
```bash
autodevice apps list --json
```

### Devices
```bash
autodevice devices list --json
autodevice devices list --platform android --json
autodevice devices list --platform ios --json
```

### Tasks
```bash
autodevice tasks list --json
```

### Webhooks
```bash
autodevice webhooks list <suite-id> --json
```

### Snapshots
```bash
autodevice snapshots list --json
```

## Output Format
Always use `--json` flag. Present results in a clear, readable format.
Summarize key information (counts, names, statuses) conversationally.
