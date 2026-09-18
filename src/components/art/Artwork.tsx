// Eight parameterised templates. One SVG per card front, 10 units per mm on a
// 151.5 × 216 mm panel (with 3 mm bleed). The headline sits bottom-left, so
// every template keeps the bottom-left third quiet.
import type { Palette } from "@/lib/colour";
import type { ResolvedArtwork } from "@/lib/artwork";
import { mulberry32 } from "@/lib/rng";

const W = 1515;
const H = 2160;

export function Artwork({ art, palette }: { art: ResolvedArtwork; palette: Palette }) {
  const rng = mulberry32(art.seed);
  const body = (() => {
    switch (art.template) {
      case "confetti":
        return confetti(rng, palette);
      case "rings":
        return rings(rng, palette);
      case "numeral":
        return numeral(rng, palette, art.ordinal ?? 10);
      case "bands":
        return bands(rng, palette);
      case "sprig":
        return sprig(rng, palette);
      case "sparks":
        return sparks(rng, palette);
      case "dots":
        return dots(rng, palette);
      case "waves":
        return waves(rng, palette);
    }
  })();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width={W} height={H} fill={palette.paper} />
      {body}
    </svg>
  );
}

function confetti(rng: () => number, p: Palette) {
  const cols = [p.brand, p.accent, p.tint, p.brand, p.accent, p.muted];
  const items = [];
  for (let i = 0; i < 90; i++) {
    const x = rng() * W;
    const y = H * Math.pow(rng(), 1.7); // denser at the top
    if (y > 1500 && x < 1100) continue; // headline zone
    const s = 14 + rng() * 40;
    const c = cols[Math.floor(rng() * cols.length)];
    const kind = rng();
    if (kind < 0.45) items.push(<rect key={i} x={x} y={y} width={s * 0.55} height={s * 1.6} rx={s * 0.15} fill={c} transform={`rotate(${rng() * 360} ${x} ${y})`} />);
    else if (kind < 0.8) items.push(<circle key={i} cx={x} cy={y} r={s * 0.35} fill={c} />);
    else items.push(<path key={i} d={`M ${x} ${y} q ${s * 0.6} ${-s * 0.5} ${s * 1.2} 0`} stroke={c} strokeWidth={s * 0.18} fill="none" strokeLinecap="round" transform={`rotate(${rng() * 360} ${x} ${y})`} />);
  }
  return <g>{items}</g>;
}

function rings(rng: () => number, p: Palette) {
  const cx = 1250 + rng() * 150;
  const cy = 200 + rng() * 150;
  const cols = [p.brand, p.tint, p.accent, p.tintSoft];
  const out = [];
  let r = 240;
  for (let i = 0; i < 7; i++) {
    out.push(<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={cols[i % cols.length]} strokeWidth={34 + rng() * 56} />);
    r += 150 + rng() * 40;
  }
  return <g>{out}</g>;
}

function numeral(rng: () => number, p: Palette, n: number) {
  const x = 1120 + rng() * 120;
  return (
    <g>
      <text x={x} y={1330} fontSize={1400} fontWeight={700} fill={p.tint} textAnchor="middle" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
        {n}
      </text>
      <rect x={120} y={210} width={560} height={10} fill={p.brand} />
      <rect x={120} y={260} width={280} height={10} fill={p.accent} />
    </g>
  );
}

function bands(rng: () => number, p: Palette) {
  const cols = [p.brand, p.tint, p.accent, p.tintSoft, p.brand];
  const out = [];
  const angle = -18 - rng() * 6;
  for (let i = 0; i < 5; i++) {
    const y = -300 + i * 260;
    out.push(<rect key={i} x={-600} y={y} width={W + 1200} height={190 + rng() * 60} fill={cols[i]} transform={`rotate(${angle} ${W / 2} ${H / 3})`} />);
  }
  return <g>{out}</g>;
}

function sprig(rng: () => number, p: Palette) {
  const out = [];
  for (let s = 0; s < 3; s++) {
    const x0 = s === 0 ? 1350 : s === 1 ? 1180 : 220;
    const y0 = s === 2 ? -40 : -60;
    const len = 700 + rng() * 300;
    const bend = (s === 2 ? 1 : -1) * (120 + rng() * 200);
    const path = `M ${x0} ${y0} q ${bend} ${len * 0.5} ${bend * 0.3} ${len}`;
    out.push(<path key={`s${s}`} d={path} stroke={p.muted} strokeWidth={9} fill="none" strokeLinecap="round" />);
    for (let i = 1; i <= 8; i++) {
      const t = i / 9;
      const px = x0 + bend * (2 * t * (1 - t)) + bend * 0.3 * t * t;
      const py = y0 + len * t;
      const side = i % 2 ? 1 : -1;
      out.push(<ellipse key={`l${s}-${i}`} cx={px + side * 55} cy={py} rx={80} ry={32} fill={i % 3 ? p.tint : p.accent} transform={`rotate(${side * 35} ${px} ${py})`} opacity={0.9} />);
    }
  }
  return <g>{out}</g>;
}

function sparks(rng: () => number, p: Palette) {
  const out = [];
  for (let i = 0; i < 16; i++) {
    const x = rng() * W;
    const y = rng() * H * 0.68;
    const r = 40 + rng() * 140;
    const c = rng() < 0.6 ? p.brand : p.accent;
    const rays = [];
    for (let k = 0; k < 8; k++) {
      const a = (Math.PI / 4) * k;
      rays.push(<line key={k} x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} stroke={c} strokeWidth={k % 2 ? 8 : 14} strokeLinecap="round" />);
    }
    out.push(<g key={i}>{rays}</g>);
  }
  return <g>{out}</g>;
}

function dots(rng: () => number, p: Palette) {
  const out = [];
  const cols = 12;
  const rows = 17;
  const jitter = rng() * 20;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = 130 + (i * (W - 260)) / (cols - 1);
      const y = 130 + (j * (H - 260)) / (rows - 1);
      const t = Math.max(0, Math.min(1, (i / cols) * 0.6 + (1 - j / rows) * 0.6));
      const r = 3 + t * t * 34 + jitter * t;
      if (y > 1550 && x < 1000 && r > 12) continue;
      out.push(<circle key={`${i}-${j}`} cx={x} cy={y} r={r} fill={p.brand} opacity={0.9} />);
    }
  }
  return <g>{out}</g>;
}

function waves(rng: () => number, p: Palette) {
  const out = [];
  const cols = [p.brand, p.tint, p.accent, p.tintSoft, p.brand, p.tint];
  for (let i = 0; i < 6; i++) {
    const base = -100 + i * 150;
    const amp = 60 + rng() * 80;
    const freq = 1.2 + rng() * 1.2;
    let d = `M -50 ${base}`;
    for (let x = -50; x <= W + 50; x += 40) {
      const y = base + Math.sin((x / W) * Math.PI * 2 * freq + i) * amp;
      d += ` L ${x} ${y}`;
    }
    d += ` L ${W + 50} -200 L -50 -200 Z`;
    out.push(<path key={i} d={d} fill={cols[i]} opacity={1 - i * 0.12} />);
  }
  return <g>{out}</g>;
}
