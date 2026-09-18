import { NextRequest } from "next/server";
import { readCardImage } from "@/lib/images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/cards/[id]/image">) {
  const { id } = await ctx.params;
  const buf = readCardImage(id);
  if (!buf) return new Response("no image", { status: 404 });
  return new Response(new Uint8Array(buf), { headers: { "Content-Type": "image/png", "Cache-Control": "no-store" } });
}
