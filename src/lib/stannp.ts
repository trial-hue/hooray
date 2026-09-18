// Stannp print API: POST https://api-eu1.stannp.com/v1/letters/create with Basic auth (API key as username).
// test=true returns a proof PDF without dispatching or charging.
import { resolveDelivery } from "./delivery";
import type { Card, DB } from "./types";

export const STANNP_ENDPOINT = "https://api-eu1.stannp.com/v1/letters/create";

export type StannpPayload = Record<string, string>;

export function buildStannpPayload(db: DB, card: Card, pdfUrl: string): StannpPayload | undefined {
  const p = db.people.find((x) => x.id === card.personId);
  if (!p) return undefined;
  const d = resolveDelivery(p, db.company, card.dueDate);
  if (!d) return undefined;
  const payload: StannpPayload = {
    test: "true",
    "recipient[firstname]": p.firstName,
    "recipient[lastname]": p.lastName,
    "recipient[address1]": d.address.line1,
    "recipient[address2]": d.address.line2 ?? "",
    "recipient[town]": d.address.town,
    "recipient[postcode]": d.address.postcode,
    "recipient[country]": "GB",
    file: pdfUrl,
    size: "A4",
    duplex: "true",
    tags: `occasionally,${db.company?.id ?? "demo"},${card.id}`,
  };
  if (d.mode === "office-batch") payload["recipient[company]"] = db.company?.name ?? "";
  return payload;
}

export function stannpCurl(payload: StannpPayload): string {
  const fields = Object.entries(payload)
    .map(([k, v]) => `  -F '${k}=${v.replace(/'/g, "'\\''")}'`)
    .join(" \\\n");
  return `curl -u "$STANNP_API_KEY:" ${STANNP_ENDPOINT} \\\n${fields}`;
}

export type StannpResult = { ok: true; id: string; pdf: string; cost: string; status: string } | { ok: false; error: string };

/** Send a test letter with the PDF bytes attached. Requires STANNP_API_KEY. */
export async function sendStannpTest(payload: StannpPayload, pdf: Buffer, filename: string): Promise<StannpResult> {
  const key = process.env.STANNP_API_KEY;
  if (!key) return { ok: false, error: "STANNP_API_KEY not set" };
  const form = new FormData();
  for (const [k, v] of Object.entries(payload)) if (k !== "file") form.append(k, v);
  form.append("file", new Blob([new Uint8Array(pdf)], { type: "application/pdf" }), filename);
  try {
    const res = await fetch(STANNP_ENDPOINT, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}` }, body: form });
    const json = (await res.json()) as { success?: boolean; data?: { id?: number | string; pdf?: string; cost?: string; status?: string }; error?: string };
    if (!res.ok || !json.success || !json.data) return { ok: false, error: json.error ?? `HTTP ${res.status}` };
    return { ok: true, id: String(json.data.id ?? ""), pdf: json.data.pdf ?? "", cost: json.data.cost ?? "", status: json.data.status ?? "test" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
