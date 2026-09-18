"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, mutate, resetDb } from "@/lib/db";
import { addDays } from "@/lib/dates";
import {
  approveCard,
  changeSigner,
  draftCard,
  editCard,
  importRoster,
  loadDemoRoster,
  releaseHeld,
  skipCard,
  submitDigest,
  tick,
} from "@/lib/engine";
import type { Company } from "@/lib/types";

function refresh() {
  revalidatePath("/", "layout");
}

export async function loadDemoRosterAction(): Promise<void> {
  await mutate((db) => loadDemoRoster(db));
  refresh();
  redirect("/digest");
}

export async function importCsvAction(formData: FormData): Promise<void> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  const csv = await file.text();
  const name = String(formData.get("name") ?? "").trim() || "Your firm";
  const shortName = String(formData.get("shortName") ?? "").trim() || name.replace(/\s+(LLP|Ltd|Limited|plc)$/i, "");
  const brandHex = /^#[0-9a-f]{6}$/i.test(String(formData.get("brandHex"))) ? String(formData.get("brandHex")) : "#1F3A5F";
  const toneWords = String(formData.get("toneWords") ?? "warm, plain, specific")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const formality = (["low", "medium", "high"].includes(String(formData.get("formality"))) ? String(formData.get("formality")) : "medium") as Company["formality"];
  const officeLine = String(formData.get("officeAddress") ?? "").trim();
  const [line1 = name, line2 = "", town = "", postcode = ""] = officeLine.split(",").map((s) => s.trim());
  const company: Company = {
    id: shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    shortName,
    sector: "other",
    toneWords,
    formality,
    brandHex,
    offices: { Main: { line1, line2: line2 || undefined, town, postcode } },
    primaryOffice: "Main",
    neverMention: [],
    signOff: String(formData.get("signOff") ?? "With best wishes").trim() || "With best wishes",
    allowAgeMentions: false,
  };
  await mutate(async (db) => {
    const res = await importRoster(db, csv, company);
    // pick a managing partner / approver if the CSV didn't say
    const staff = db.people.filter((p) => p.kind === "staff");
    const mp = staff.find((p) => /managing|founder|chief|ceo|director/i.test(p.role)) ?? staff[0];
    if (mp && db.company) {
      db.company.managingPartnerId = mp.id;
      db.company.approverId = staff.find((p) => /people|hr|office manager/i.test(p.role))?.id ?? mp.id;
      for (const p of staff) if (!p.office) p.office = "Main";
    }
    // digest was built before signer fallback existed; rebuild
    db.digests = [];
    db.cards = [];
    db.occasions = [];
    const { buildDigest } = await import("@/lib/engine");
    await buildDigest(db, db.clock.today);
    return res;
  });
  refresh();
  redirect("/digest");
}

export async function advanceClockAction(formData: FormData): Promise<void> {
  const days = Math.max(1, Math.min(60, Number(formData.get("days") ?? 1)));
  await mutate((db) => tick(db, addDays(db.clock.today, days)));
  refresh();
}

export async function approveCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await mutate((db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) approveCard(db, c, db.company?.approverId ?? "approver");
  });
  refresh();
}

export async function editCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const text = String(formData.get("inside_message") ?? "");
  if (!text.trim()) return;
  await mutate((db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) editCard(db, c, text, db.company?.approverId ?? "approver");
  });
  refresh();
}

export async function skipCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const reason = String(formData.get("reason") ?? "Skipped by approver");
  await mutate((db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) skipCard(db, c, reason);
  });
  refresh();
}

export async function changeSignerAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const signerId = String(formData.get("signerId"));
  await mutate((db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) changeSigner(db, c, signerId);
  });
  refresh();
}

export async function regenerateCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const hint = String(formData.get("hint") ?? "").trim();
  await mutate(async (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c && (c.status === "drafted" || c.status === "needs_review")) await draftCard(db, c, { hint: hint || undefined, bypassCache: true });
  });
  refresh();
}

export async function releaseHeldAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await mutate(async (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) await releaseHeld(db, c);
  });
  refresh();
}

export async function approveAllAction(formData: FormData): Promise<void> {
  const digestId = String(formData.get("digestId"));
  await mutate((db) => {
    const d = db.digests.find((x) => x.id === digestId);
    if (!d) return;
    for (const id of d.cardIds) {
      const c = db.cards.find((x) => x.id === id);
      if (c && c.status === "drafted" && c.flags.length === 0) approveCard(db, c, db.company?.approverId ?? "approver");
    }
  });
  refresh();
}

export async function submitDigestAction(formData: FormData): Promise<void> {
  const digestId = String(formData.get("digestId"));
  await mutate((db) => {
    const d = db.digests.find((x) => x.id === digestId);
    if (d) submitDigest(db, d);
  });
  refresh();
  redirect("/print");
}

export async function resetDemoAction(): Promise<void> {
  resetDb();
  refresh();
  redirect("/onboarding");
}

export async function hasCompany(): Promise<boolean> {
  return Boolean(getDb().company);
}
