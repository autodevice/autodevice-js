---
name: AutoDevice Upload Build
description: Upload an APK or IPA build file to AutoDevice
tools: ["Bash"]
---

# Upload App Build to AutoDevice

You are helping the user upload a mobile app build (APK/IPA) to AutoDevice.

## Prerequisites
- The `autodevice` CLI must be installed and configured
- User must have the APK or IPA file path ready

## Workflow

1. **Confirm the file path** with the user. Verify the file exists:
   ```bash
   ls -la <file-path>
   ```

2. **Upload the build:**
   ```bash
   autodevice apps upload <file-path> --json
   ```

   Optional flags:
   - `--commit-sha <sha>` — Tag with git commit
   - `--branch <branch>` — Tag with git branch
   - `--repo <owner/repo>` — Tag with repository name

3. **Verify the upload:**
   ```bash
   autodevice apps list --json
   ```

4. **Report** the upload result with app ID, name, version, and platform.

## Auto-tagging with Git

If the user is in a git repository, you can automatically get the commit info:
```bash
git rev-parse HEAD
git rev-parse --abbrev-ref HEAD
git remote get-url origin
```

Then include those in the upload command.

## Output Format
Always use `--json` flag. Parse JSON and explain results conversationally.
