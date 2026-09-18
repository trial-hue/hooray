// The daily job on real time. A scheduler (Vercel Cron, GitHub Actions, a crontab)
// hits this once a morning; it advances the simulated clock to today's real date,
// running the daily job for every day in between, and on Mondays emails the digest.
//
//   POST /api/cron                      Authorization: Bearer $CRON_SECRET (falls back to PRINT_TOKEN)
//   POST /api/cron?date=2026-10-05      tick to a given date instead (testing)
//   POST /api/cron?digest=1             force the digest email regardless of weekday
import { NextRequest } from "next/server";
import { mutate } from "@/lib/db";
import { fromUtc, isMonday } from "@/lib/dates";
import { tick } from "@/lib/engine";
import { sendDigest } from "@/lib/digestEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET ?? process.env.PRINT_TOKEN;
  const auth = req.headers.get("authorization") ?? "";
  if (secret && auth !== `Bearer ${secret}`) return Response.json({ error: "unauthorised" }, { status: 401 });

  const url = new URL(req.url);
  const target = url.searchParams.get("date") ?? fromUtc(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(target)) return Response.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  const forceDigest = url.searchParams.get("digest") === "1";

  const out = await mutate(async (db) => {
    if (!db.company) return { error: "no company loaded" };
    const from = db.clock.today;
    if (target > from) await tick(db, target);
    const digest = forceDigest || (target > from && isMonday(db.clock.today)) ? await sendDigest(db) : undefined;
    return {
      from,
      today: db.clock.today,
      daysRun: Math.max(0, Math.round((Date.parse(db.clock.today) - Date.parse(from)) / 86400000)),
      digest: digest && "mode" in digest ? { mode: digest.mode, to: digest.to, id: digest.id, error: digest.error } : digest,
      log: db.clock.log.slice(-8).map((e) => `${e.at} ${e.event}`),
    };
  });
  return Response.json(out, { status: "error" in out && out.error ? 409 : 200 });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
