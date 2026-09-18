import { notFound } from "next/navigation";
import { CardSheet, SHEET_H, SHEET_W } from "@/components/Card";
import { getDb, isWorkspace } from "@/lib/db";
import { renderableCard } from "@/lib/render";

export const dynamic = "force-dynamic";

// Bare print page: two 303×216mm sheets, printed by Chrome into the PDF.
export default async function PrintCardPage({ params, searchParams }: PageProps<"/print/cards/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  if (process.env.PRINT_TOKEN && sp.t !== process.env.PRINT_TOKEN) notFound();
  const db = getDb(isWorkspace(sp.ws) ? sp.ws : "business");
  const card = db.cards.find((c) => c.id === id);
  if (!card) notFound();
  const rc = renderableCard(db, card);
  if (!rc) notFound();
  const marks = sp.marks === "1";
  return (
    <>
      <style>{`
        @page { size: ${SHEET_W}mm ${SHEET_H}mm; margin: 0; }
        html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .sheet { width: ${SHEET_W}mm; height: ${SHEET_H}mm; break-after: page; overflow: hidden; }
        .sheet:last-child { break-after: auto; }
      `}</style>
      <div className="sheet">
        <CardSheet card={rc} side="outside" marks={marks} />
      </div>
      <div className="sheet">
        <CardSheet card={rc} side="inside" marks={marks} />
      </div>
    </>
  );
}
