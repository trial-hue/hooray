// The physical card, in millimetres. Used by the on-screen preview and the print page alike.
import type { Palette } from "@/lib/colour";
import type { ResolvedArtwork } from "@/lib/artwork";
import type { FinalText } from "@/lib/types";
import { Artwork } from "./art/Artwork";

export type RenderableCard = {
  text: FinalText;
  palette: Palette;
  art: ResolvedArtwork;
  shortName: string;
  signAs: string;
  coSignAs?: string;
  ref: string;
  signatures?: { name: string; line: string }[];
  personal?: boolean;
  imageUrl?: string; // AI-generated picture; replaces the artwork on the front
};

// Geometry (mm)
export const PANEL_W = 148.5;
export const PANEL_H = 210;
export const BLEED = 3;
export const SHEET_W = 303;
export const SHEET_H = 216;

const mm = (n: number) => `${n}mm`;

function headlineSize(h: string): number {
  const w = h.trim().split(/\s+/).length;
  return w <= 2 ? 44 : w <= 4 ? 34 : 28;
}

export function FrontPanel({ card, bleed = false }: { card: RenderableCard; bleed?: boolean }) {
  const inset = bleed ? -BLEED : 0;
  return (
    <div className="relative overflow-hidden" style={{ width: mm(PANEL_W), height: mm(PANEL_H), background: card.palette.paper }}>
      <div className="absolute" style={{ top: mm(inset), left: mm(inset), right: mm(inset), bottom: mm(inset) }}>
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <Artwork art={card.art} palette={card.palette} />
        )}
      </div>
      {card.imageUrl && <div className="absolute" style={{ left: mm(inset), right: mm(inset), bottom: mm(inset), height: mm(70), background: `linear-gradient(to top, ${card.palette.paper} 30%, transparent)` }} />}
      <div className="absolute" style={{ left: mm(16), right: mm(16), bottom: mm(20) }}>
        <div className="font-display" style={{ fontSize: `${headlineSize(card.text.front_headline)}pt`, lineHeight: 1.02, letterSpacing: "-0.02em", color: card.palette.ink, fontWeight: 600, maxWidth: mm(112), textWrap: "balance" as never }}>
          {card.text.front_headline}
        </div>
      </div>
    </div>
  );
}

export function BackPanel({ card }: { card: RenderableCard }) {
  return (
    <div className="relative overflow-hidden" style={{ width: mm(PANEL_W), height: mm(PANEL_H), background: card.palette.paper }}>
      {!card.personal && (
        <div className="absolute left-0 right-0 text-center" style={{ bottom: mm(40) }}>
          <div className="font-display" style={{ fontSize: "13pt", color: card.palette.ink, fontWeight: 600 }}>
            {card.shortName}
          </div>
        </div>
      )}
      <div className="absolute left-0 right-0 text-center font-body" style={{ bottom: mm(12), fontSize: "7pt", color: card.palette.muted }}>
        {card.personal ? "Made with Hooray" : `Sent with care by ${card.shortName} · made with Hooray`}
      </div>
      <div className="absolute left-0 right-0 text-center font-body" style={{ bottom: mm(6), fontSize: "5pt", color: card.palette.muted }}>
        {card.ref}
      </div>
    </div>
  );
}

export function MessagePanel({ card }: { card: RenderableCard }) {
  return (
    <div className="relative overflow-hidden" style={{ width: mm(PANEL_W), height: mm(PANEL_H), background: card.palette.paper }}>
      <div className="absolute font-body" style={{ top: mm(40), left: mm(16), right: mm(18), color: card.palette.ink }}>
        <p style={{ fontSize: "11.5pt", lineHeight: 1.55, maxWidth: mm(104) }}>{card.text.inside_message}</p>
        <p style={{ fontSize: "11.5pt", lineHeight: 1.55, marginTop: mm(6) }}>{card.text.sign_off}</p>
        <p className="font-script" style={{ fontSize: "24pt", lineHeight: 1.1, marginTop: mm(2), color: card.palette.ink }}>
          {card.signAs}
          {card.coSignAs ? ` and ${card.coSignAs}` : ""}
        </p>
        <p style={{ fontSize: "7.5pt", color: card.palette.muted, marginTop: mm(1.5) }}>{card.text.signature_line}</p>
      </div>
    </div>
  );
}

export function SignaturesPanel({ card }: { card: RenderableCard }) {
  const sigs = card.signatures ?? [];
  if (sigs.length === 0) return <div style={{ width: mm(PANEL_W), height: mm(PANEL_H), background: card.palette.paper }} />;
  const twoCol = sigs.length > 6;
  return (
    <div className="relative overflow-hidden" style={{ width: mm(PANEL_W), height: mm(PANEL_H), background: card.palette.paper }}>
      <div className="absolute" style={{ top: mm(18), left: mm(18), right: mm(14), bottom: mm(16) }}>
        <div className="font-body" style={{ fontSize: "6.5pt", letterSpacing: "0.18em", textTransform: "uppercase", color: card.palette.muted }}>
          From the team
        </div>
        <div style={{ columnCount: twoCol ? 2 : 1, columnGap: mm(6), marginTop: mm(4) }}>
          {sigs.map((s, i) => (
            <div key={i} style={{ breakInside: "avoid", marginBottom: mm(twoCol ? 3.5 : 5) }}>
              <div className="font-script" style={{ fontSize: twoCol ? "11pt" : "13pt", lineHeight: 1.15, color: card.palette.ink }}>
                {s.line}
              </div>
              <div className="font-body" style={{ fontSize: "6.5pt", color: card.palette.muted, marginTop: "0.5mm" }}>
                — {s.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A full 303×216mm sheet with bleed. side = outside [back|front] or inside [signatures|message]. */
export function CardSheet({ card, side, marks = false }: { card: RenderableCard; side: "outside" | "inside"; marks?: boolean }) {
  const left = side === "outside" ? <BackPanel card={card} /> : <SignaturesPanel card={card} />;
  const right = side === "outside" ? <FrontPanel card={card} bleed /> : <MessagePanel card={card} />;
  return (
    <div className="relative overflow-hidden bg-white" style={{ width: mm(SHEET_W), height: mm(SHEET_H) }}>
      {/* bleed fill */}
      <div className="absolute inset-0" style={{ background: card.palette.paper }} />
      <div className="absolute" style={{ left: mm(BLEED), top: mm(BLEED) }}>
        {left}
      </div>
      <div className="absolute" style={{ left: mm(BLEED + PANEL_W), top: mm(BLEED) }}>
        {right}
      </div>
      {marks && <Marks />}
    </div>
  );
}

function Marks() {
  const c = "#000";
  const len = 2.5;
  const gap = 1;
  const marks: React.CSSProperties[] = [];
  const corners: [number, number][] = [
    [BLEED, BLEED],
    [SHEET_W - BLEED, BLEED],
    [BLEED, SHEET_H - BLEED],
    [SHEET_W - BLEED, SHEET_H - BLEED],
  ];
  for (const [x, y] of corners) {
    const sx = x === BLEED ? -1 : 1;
    const sy = y === BLEED ? -1 : 1;
    marks.push({ position: "absolute", left: mm(x + sx * gap + (sx < 0 ? -len : 0)), top: mm(y), width: mm(len), height: "0.25pt", background: c });
    marks.push({ position: "absolute", left: mm(x), top: mm(y + sy * gap + (sy < 0 ? -len : 0)), width: "0.25pt", height: mm(len), background: c });
  }
  return (
    <>
      {marks.map((s, i) => (
        <div key={i} style={s} />
      ))}
      <div style={{ position: "absolute", left: mm(SHEET_W / 2), top: 0, width: "0.25pt", height: mm(2.5), borderLeft: "0.25pt dashed #000" }} />
      <div style={{ position: "absolute", left: mm(SHEET_W / 2), bottom: 0, width: "0.25pt", height: mm(2.5), borderLeft: "0.25pt dashed #000" }} />
    </>
  );
}
