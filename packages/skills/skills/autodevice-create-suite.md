---
name: AutoDevice Create Suite
description: Guided setup for creating a complete test suite with targets and flows
tools: ["Bash"]
---

# Create AutoDevice Test Suite

You are helping the user set up a complete test suite from scratch. This is a wizard-style workflow.

## Prerequisites
- The `autodevice` CLI must be installed and configured
- User should have an app uploaded (or be ready to upload one)

## Step 1: Create the Test Suite

Ask the user for:
- Suite name
- Description (optional)
- Whether to run flows in parallel
- Whether to stop on first failure

```bash
autodevice suites create --name "Suite Name" --description "Description" --json
```

## Step 2: Create a Target

Ask the user for:
- Target name
- Platform (android/ios)
- Device type
- OS version
- App identifier (package name or bundle ID)

List available devices first:
```bash
autodevice devices list --platform <platform> --json
```

Then create:
```bash
autodevice targets create <suite-id> --name "Target Name" --platform android --device <device-type> --os <version> --app <app-identifier> --json
```

## Step 3: Create Flows

For each test flow the user wants:

```bash
autodevice flows create --suite <suite-id> --target <target-id> --name "Flow Name" --json
```

## Step 4: Verify Setup

```bash
autodevice suites get <suite-id> --json
autodevice flows list --suite <suite-id> --json
```

## Step 5: Run the Suite (optional)

```bash
autodevice suites run <suite-id> --target <target-id> --wait --json
```

## Output Format
Always use `--json` flag. Guide the user through each step conversationally.
