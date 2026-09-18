import { NextRequest } from "next/server";
import { renderCardPdf } from "@/lib/pdf";
import { isWorkspace } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest, ctx: RouteContext<"/api/cards/[id]/pdf">) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const marks = url.searchParams.get("marks") === "1";
  const download = url.searchParams.get("download") === "1";
  const wsParam = url.searchParams.get("ws");
  const ws = isWorkspace(wsParam) ? wsParam : "business";
  try {
    const pdf = await renderCardPdf(id, { marks, origin: url.origin, ws });
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="hooray-${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`PDF render failed: ${err instanceof Error ? err.message : String(err)}`, { status: 500 });
  }
}
