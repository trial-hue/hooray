import { derivePalette } from "@/lib/colour";
import { resolveArtwork } from "@/lib/artwork";
import { Artwork } from "./art/Artwork";
import type { ArtTemplate, OccasionType, PaletteVariant } from "@/lib/types";

// Small front-panel preview used in lists. Same artwork + palette as the print page.
export function CardThumb({ width = 104, brandHex, accentHex, template, variant, occasionType, ordinal, seed, headline }: {
  width?: number;
  brandHex: string;
  accentHex?: string;
  template?: ArtTemplate;
  variant?: PaletteVariant;
  occasionType: OccasionType;
  ordinal?: number;
  seed: number;
  headline: string;
}) {
  const art = resolveArtwork(template, variant, occasionType, ordinal, seed);
  const palette = derivePalette(brandHex, art.variant, accentHex);
  const height = Math.round((width * 210) / 148.5);
  const fontPx = Math.max(7, Math.round(width / 9));
  return (
    <div className="relative overflow-hidden rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.18)]" style={{ width, height, background: palette.paper }}>
      <Artwork art={art} palette={palette} />
      <div className="absolute inset-0 flex items-end p-[8%]">
        <span className="font-display leading-[1.05]" style={{ color: art.template === "bands" ? palette.ink : palette.ink, fontSize: fontPx, fontWeight: 600 }}>
          {headline}
        </span>
      </div>
    </div>
  );
}
