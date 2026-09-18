// Stannp print API: POST https://api-eu1.stannp.com/v1/letters/create with Basic auth (API key as username).
// test=true returns a proof PDF without dispatching or charging. Live sends are behind STANNP_LIVE=1.
import { resolveDelivery } from "./delivery";
import type { Card, DB } from "./types";

export const STANNP_ENDPOINT = "https://api-eu1.stannp.com/v1/letters/create";

export type StannpPayload = Record<string, string>;

/** Live printing is off unless STANNP_LIVE=1 is set in the environment. */
export function stannpLive(): boolean {
  return process.env.STANNP_LIVE === "1";
}

export function buildStannpPayload(db: DB, card: Card, pdfUrl: string, test: boolean = !stannpLive()): StannpPayload | undefined {
  const p = db.people.find((x) => x.id === card.personId);
  if (!p) return undefined;
  const d = resolveDelivery(p, db.company, card.dueDate);
  if (!d) return undefined;
  // Office deliveries carry the firm as the company line, so don't repeat it as address line 1.
  const office = d.mode === "office-batch";
  const address1 = office && d.address.line2 ? d.address.line2 : d.address.line1;
  const address2 = office && d.address.line2 ? "" : (d.address.line2 ?? "");
  const payload: StannpPayload = {
    test: test ? "true" : "false",
    "recipient[firstname]": p.firstName,
    "recipient[lastname]": p.lastName,
    "recipient[address1]": address1,
    "recipient[address2]": address2,
    "recipient[town]": d.address.town,
    "recipient[postcode]": d.address.postcode,
    "recipient[country]": "GB",
    file: pdfUrl,
    size: "A4",
    duplex: "true",
    tags: `hooray,${db.company?.id ?? "demo"},${card.id}`,
  };
  if (office) payload["recipient[company]"] = db.company?.name ?? "";
  return payload;
}

export function stannpCurl(payload: StannpPayload): string {
  const fields = Object.entries(payload)
    .map(([k, v]) => `  -F '${k}=${v.replace(/'/g, "'\\''")}'`)
    .join(" \\\n");
  return `curl -u "$STANNP_API_KEY:" ${STANNP_ENDPOINT} \\\n${fields}`;
}

export type StannpResult = { ok: true; id: string; pdf: string; cost: string; status: string } | { ok: false; error: string };

/** Send a letter with the PDF bytes attached. Requires STANNP_API_KEY. Test unless the payload says otherwise. */
export async function sendStannp(payload: StannpPayload, pdf: Buffer, filename: string): Promise<StannpResult> {
  const key = process.env.STANNP_API_KEY;
  if (!key) return { ok: false, error: "STANNP_API_KEY not set" };
  const form = new FormData();
  for (const [k, v] of Object.entries(payload)) if (k !== "file") form.append(k, v);
  form.append("file", new Blob([new Uint8Array(pdf)], { type: "application/pdf" }), filename);
  try {
    const res = await fetch(STANNP_ENDPOINT, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}` }, body: form });
    const json = (await res.json()) as { success?: boolean; data?: { id?: number | string; pdf?: string; cost?: string; status?: string }; error?: string };
    if (!res.ok || !json.success || !json.data) return { ok: false, error: json.error ?? `HTTP ${res.status}` };
    const result: StannpResult = { ok: true, id: String(json.data.id ?? ""), pdf: json.data.pdf ?? "", cost: json.data.cost ?? "", status: json.data.status ?? "test" };
    if (payload.test !== "true") console.log(`[stannp] LIVE order id=${result.id} cost=£${result.cost} status=${result.status}`);
    return result;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Kept for older callers. */
export const sendStannpTest = sendStannp;
