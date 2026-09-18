"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, mutate, resetDb } from "@/lib/db";
import { addDays } from "@/lib/dates";
import { addHumanOccasion, approveCard, changeSigner, dailyJob, draftCard, editCard, importRoster, loadDemoRoster, markLeaving, releaseHeld, sendNow, skipCard, tick } from "@/lib/engine";
import { chooseGift, contribute } from "@/lib/collections";
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
    // import without drafting first so we can set signer defaults, then run the daily job
    const res = await importRoster(db, csv, company);
    const staff = db.people.filter((p) => p.kind === "staff");
    const mp = staff.find((p) => /managing|founder|chief|ceo|director|partner/i.test(p.role)) ?? staff[0];
    if (mp && db.company) {
      db.company.managingPartnerId = mp.id;
      db.company.approverId = staff.find((p) => /people|hr|office manager/i.test(p.role))?.id ?? mp.id;
      for (const p of staff) if (!p.office) p.office = "Main";
    }
    db.cards = [];
    db.occasions = [];
    db.collections = [];
    db.printJobs = [];
    await dailyJob(db);
    return res;
  });
  refresh();
  redirect("/digest");
}

export async function advanceClockAction(formData: FormData): Promise<void> {
  const days = Math.max(1, Math.min(366, Number(formData.get("days") ?? 1)));
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
  const hint = String(formData.get("hint") ?? "").trim() || String(formData.get("preset") ?? "").trim();
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

export async function approveAllAction(): Promise<void> {
  await mutate((db) => {
    for (const c of db.cards) if (c.status === "drafted" && c.flags.length === 0) approveCard(db, c, db.company?.approverId ?? "approver");
  });
  refresh();
}

export async function sendNowAction(): Promise<void> {
  await mutate((db) => sendNow(db));
  refresh();
  redirect("/print");
}

export async function markLeavingAction(formData: FormData): Promise<void> {
  const personId = String(formData.get("personId"));
  const days = Math.max(1, Math.min(90, Number(formData.get("days") ?? 14)));
  const retiring = String(formData.get("retiring")) === "true";
  let collectionId: string | undefined;
  await mutate(async (db) => {
    const p = db.people.find((x) => x.id === personId);
    if (!p) return;
    const card = await markLeaving(db, p, addDays(db.clock.today, days), retiring);
    collectionId = card?.collectionId;
  });
  refresh();
  if (collectionId) redirect(`/collections/${collectionId}`);
}

export async function addOccasionAction(formData: FormData): Promise<void> {
  const personId = String(formData.get("personId"));
  const kind = String(formData.get("kind")) as "wedding" | "new-baby" | "sympathy" | "get-well" | "congratulations";
  const days = Math.max(0, Math.min(90, Number(formData.get("days") ?? 14)));
  const label = String(formData.get("label") ?? "").trim() || undefined;
  let collectionId: string | undefined;
  await mutate(async (db) => {
    const p = db.people.find((x) => x.id === personId);
    if (!p) return;
    const card = await addHumanOccasion(db, p, kind, addDays(db.clock.today, days), label);
    collectionId = card?.collectionId;
  });
  refresh();
  if (collectionId) redirect(`/collections/${collectionId}`);
  redirect("/digest");
}

export async function contributeAction(formData: FormData): Promise<void> {
  const collectionId = String(formData.get("collectionId"));
  const contributorId = String(formData.get("contributorId"));
  const amountPence = Math.max(0, Math.round(Number(formData.get("amount") ?? 10) * 100));
  const message = String(formData.get("message") ?? "").trim();
  await mutate((db) => {
    const col = db.collections.find((x) => x.id === collectionId);
    if (col) contribute(db, col, contributorId, amountPence, message);
  });
  refresh();
}

export async function contributeManyAction(formData: FormData): Promise<void> {
  // Demo helper: eight colleagues contribute with plausible lines.
  const collectionId = String(formData.get("collectionId"));
  await mutate((db) => {
    const col = db.collections.find((x) => x.id === collectionId);
    if (!col) return;
    const p = db.people.find((x) => x.id === col.personId)!;
    const lines = [
      `Going to miss you, ${p.firstName}. Who do I ask now?`,
      "Thank you for the patience, the pivot tables and the bacon rolls.",
      "Best of luck. Don't be a stranger.",
      "The Friday order will never be the same.",
      "Thanks for everything. Genuinely.",
      "You made this place better. Go and enjoy the next bit.",
      "Eight years and never a late payroll. Legend, quietly.",
      "All the best from the Leeds lot.",
      "Thank you for showing me the ropes when I started.",
      "Come back and visit. Bring cake.",
    ];
    const team = col.teamIds.filter((id) => !col.contributions.some((c) => c.contributorId === id)).slice(0, 8);
    team.forEach((id, i) => contribute(db, col, id, [1000, 1500, 1000, 2000, 1000, 500, 1000, 2500][i % 8], lines[i % lines.length]));
  });
  refresh();
}

export async function chooseGiftAction(formData: FormData): Promise<void> {
  const collectionId = String(formData.get("collectionId"));
  const giftId = String(formData.get("giftId"));
  await mutate((db) => {
    const col = db.collections.find((x) => x.id === collectionId);
    if (col) chooseGift(col, giftId);
  });
  refresh();
}

export async function resetDemoAction(): Promise<void> {
  resetDb();
  refresh();
  redirect("/onboarding");
}

export async function hasCompany(): Promise<boolean> {
  return Boolean(getDb().company);
}
