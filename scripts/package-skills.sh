#!/usr/bin/env sh
# Build one ZIP per skill in dist/, for uploading to the Claude app (Customize > Skills).
set -e
cd "$(dirname "$0")/.."
rm -rf dist && mkdir dist
for dir in skills/*/; do
  name=$(basename "$dir")
  (cd skills && zip -qr "../dist/$name.zip" "$name" -x "*/lint.test.mjs" "*/.DS_Store")
  echo "dist/$name.zip"
done
