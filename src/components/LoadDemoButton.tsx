"use client";

import { useFormStatus } from "react-dom";

export function LoadDemoButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Importing roster and drafting next week's cards…" : "Load Hartley & Crane"}
    </button>
  );
}
