#!/usr/bin/env bash
# Regenerates src/app/fonts/material-symbols-outlined.woff2 — a self-hosted
# Material Symbols Outlined font containing only the icons used in src/.
# Run this after using an icon name that is not in the font yet.
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"

curl -fsSL "https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.codepoints" \
  | cut -d' ' -f1 | sort -u > "$tmp/valid"
# Every lowercase token in source files that is also a valid icon name (a safe superset).
grep -rlE "material-symbols|icon" src --include=*.ts --include=*.tsx \
  | xargs grep -ohE "[a-z][a-z0-9_]{1,40}" | sort -u > "$tmp/tokens"
names=$(comm -12 "$tmp/valid" "$tmp/tokens" | paste -sd, -)
echo "Including $(echo "$names" | tr ',' '\n' | wc -l) icons"

curl -fsSL -A "$UA" \
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300..400,0..1,0&icon_names=${names}&display=block" \
  > "$tmp/font.css"
url=$(grep -oE "https://[^)]+" "$tmp/font.css" | head -1)
curl -fsSL -o src/app/fonts/material-symbols-outlined.woff2 "$url"
ls -la src/app/fonts/material-symbols-outlined.woff2
