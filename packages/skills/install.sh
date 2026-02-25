#!/usr/bin/env bash
set -euo pipefail

SKILLS_DIR="${HOME}/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="${SCRIPT_DIR}/skills"

mkdir -p "${SKILLS_DIR}"

for skill in "${SOURCE_DIR}"/*.md; do
  filename="$(basename "${skill}")"
  ln -sf "${skill}" "${SKILLS_DIR}/${filename}"
  echo "Installed: ${filename}"
done

echo "Done! ${SKILLS_DIR} now has AutoDevice skills."
