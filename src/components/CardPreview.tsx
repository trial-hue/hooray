"use client";

import { useEffect, useRef, useState } from "react";

const MM_PX = 3.7795275591;

/** Scales a millimetre-sized child to the container width. */
export function Scaled({ widthMm, heightMm, children, shadow = true }: { widthMm: number; heightMm: number; children: React.ReactNode; shadow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / (widthMm * MM_PX)));
    ro.observe(el);
    setScale(el.clientWidth / (widthMm * MM_PX));
    return () => ro.disconnect();
  }, [widthMm]);
  return (
    <div ref={ref} className="w-full" style={{ height: heightMm * MM_PX * scale }}>
      <div className={`origin-top-left ${shadow ? "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.06)]" : ""}`} style={{ transform: `scale(${scale})`, width: widthMm * MM_PX, height: heightMm * MM_PX }}>
        {children}
      </div>
    </div>
  );
}
