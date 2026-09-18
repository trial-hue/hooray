#!/bin/sh
# First boot on an empty volume: copy the year of cached drafts and the personal demo, and stage the business demo.
set -e
DATA_DIR="${DATA_DIR:-/data}"
mkdir -p "$DATA_DIR"
[ -d "$DATA_DIR/drafts" ] || cp -r /app/data/drafts "$DATA_DIR/drafts"
[ -f "$DATA_DIR/personal.json" ] || cp /app/data/personal.json "$DATA_DIR/personal.json"
if [ ! -f "$DATA_DIR/db.json" ]; then
  AI_DISABLED=1 NO_EMAIL=1 npx tsx scripts/reset-demo.ts --staged || true
fi
exec "$@"
