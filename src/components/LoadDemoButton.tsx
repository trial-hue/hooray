"use client";

import { useFormStatus } from "react-dom";

export function LoadDemoButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary px-6 py-3 text-base ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Importing the roster and drafting this week's cards…" : "Load Hartley & Crane and draft this week"}
    </button>
  );
}
