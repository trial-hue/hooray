#!/bin/sh
# Boot: make sure the volume has the cached drafts and the demo data. Idempotent.
set -e
DATA_DIR="${DATA_DIR:-/data}"
# Chrome renders print pages from this same container, on whatever port the host assigned.
export PRINT_BASE_URL="http://127.0.0.1:${PORT:-3000}"
mkdir -p "$DATA_DIR/drafts"
# New cached drafts ship with each image; never overwrite ones already on the volume.
cp -n /app/data/drafts/*.json "$DATA_DIR/drafts/" 2>/dev/null || true
[ -f "$DATA_DIR/personal.json" ] || cp /app/data/personal.json "$DATA_DIR/personal.json"
if [ ! -f "$DATA_DIR/db.json" ]; then
  AI_DISABLED=1 NO_EMAIL=1 npx tsx scripts/reset-demo.ts --staged || true
fi
# Richer personal demo, once. Emails for the cards drafted today go out for real.
if [ ! -f "$DATA_DIR/.seed-personal-v2" ]; then
  npx tsx scripts/seed-personal-demo.ts && touch "$DATA_DIR/.seed-personal-v2" || true
fi
exec "$@"
