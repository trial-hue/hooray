// Palette derivation from one brand hex. Browser-safe.
import type { PaletteVariant } from "./types";

export type Palette = {
  brand: string;
  ink: string;
  paper: string;
  tint: string;
  tintSoft: string;
  accent: string;
  onBrand: string;
  muted: string;
};

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function luminance(hex: string): number {
  const m = hex.replace("#", "");
  const ch = [0, 2, 4].map((i) => {
    const v = parseInt(m.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function derivePalette(brandHex: string, variant: PaletteVariant = "bright", accentHex?: string): Palette {
  let { h, s, l } = hexToHsl(brandHex);
  if (s < 0.08) { h = 30; s = 0.1; }
  if (l > 0.8) l = 0.55;
  if (variant === "muted") s *= 0.7;
  const brand = hslToHex(h, s, l);
  const ink = hslToHex(h, Math.min(s, 0.6), 0.14);
  const paper = hslToHex(h, Math.min(s, 0.25), 0.975);
  const tint = hslToHex(h, s * 0.8, variant === "muted" ? 0.9 : 0.86);
  const tintSoft = hslToHex(h, s * 0.6, 0.94);
  let accent: string;
  if (accentHex) {
    const a = hexToHsl(accentHex);
    accent = variant === "muted" ? hslToHex(a.h, a.s * 0.45, Math.min(0.7, a.l + 0.08)) : variant === "formal" ? hslToHex(a.h, a.s * 0.75, a.l) : accentHex;
  } else {
    accent = hslToHex((h + 35) % 360, variant === "formal" ? s * 0.6 : s, 0.58);
  }
  const muted = hslToHex(h, 0.25, 0.42);
  const onBrand = contrastRatio("#ffffff", brand) >= 4.5 ? "#ffffff" : ink;
  return { brand, ink, paper, tint, tintSoft, accent, onBrand, muted };
}
