"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, isWorkspace, mutate, resetDb, type Workspace } from "@/lib/db";
import { paths } from "@/lib/paths";
import { addDays } from "@/lib/dates";
import { addContact, addHumanOccasion, approveCard, changeSigner, dailyJob, draftCard, editCard, importRoster, loadDemoRoster, loadExampleContacts, markLeaving, releaseHeld, sendNow, skipCard, startPersonal, tick } from "@/lib/engine";
import { chooseGift, closeCollection, contribute } from "@/lib/collections";
import { setCardGift } from "@/lib/gifts";
import { generateCardImage, removeCardImage } from "@/lib/images";
import type { Company } from "@/lib/types";

function refresh() {
  revalidatePath("/", "layout");
}

function wsOf(formData: FormData): Workspace {
  const w = formData.get("ws");
  return isWorkspace(w) ? w : "business";
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
  await mutate(wsOf(formData), (db) => tick(db, addDays(db.clock.today, days)));
  refresh();
}

export async function approveCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await mutate(wsOf(formData), (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) approveCard(db, c, db.company?.approverId ?? "approver");
  });
  refresh();
}

export async function editCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const text = String(formData.get("inside_message") ?? "");
  if (!text.trim()) return;
  await mutate(wsOf(formData), (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) editCard(db, c, text, db.company?.approverId ?? "approver");
  });
  refresh();
}

export async function skipCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const reason = String(formData.get("reason") ?? "Skipped by approver");
  await mutate(wsOf(formData), (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) skipCard(db, c, reason);
  });
  refresh();
}

export async function changeSignerAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const signerId = String(formData.get("signerId"));
  await mutate(wsOf(formData), (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) changeSigner(db, c, signerId);
  });
  refresh();
}

export async function regenerateCardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const hint = String(formData.get("hint") ?? "").trim() || String(formData.get("preset") ?? "").trim();
  await mutate(wsOf(formData), async (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c && (c.status === "drafted" || c.status === "needs_review")) await draftCard(db, c, { hint: hint || undefined, bypassCache: true });
  });
  refresh();
}

export async function releaseHeldAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await mutate(wsOf(formData), async (db) => {
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
  const ws = wsOf(formData);
  const personId = String(formData.get("personId"));
  const kind = String(formData.get("kind")) as "wedding" | "new-baby" | "sympathy" | "get-well" | "congratulations";
  const days = Math.max(0, Math.min(90, Number(formData.get("days") ?? 14)));
  const label = String(formData.get("label") ?? "").trim() || undefined;
  let collectionId: string | undefined;
  await mutate(ws, async (db) => {
    const p = db.people.find((x) => x.id === personId);
    if (!p) return;
    const card = await addHumanOccasion(db, p, kind, addDays(db.clock.today, days), label);
    collectionId = card?.collectionId;
  });
  refresh();
  if (collectionId) redirect(`/collections/${collectionId}`);
  redirect(paths(ws).home);
}

// ---------- personal workspace ----------

export async function startPersonalAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const brandHex = /^#[0-9a-f]{6}$/i.test(String(formData.get("brandHex"))) ? String(formData.get("brandHex")) : "#1F3A5F";
  const toneWords = String(formData.get("toneWords") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const signOff = String(formData.get("signOff") ?? "").trim();
  await mutate("personal", (db) => startPersonal(db, { name, brandHex, toneWords, signOff }));
  refresh();
  redirect("/me/people");
}

export async function addContactAction(formData: FormData): Promise<void> {
  const first = String(formData.get("firstName") ?? "").trim();
  const last = String(formData.get("lastName") ?? "").trim();
  if (!first) return;
  const birthday = String(formData.get("birthday") ?? "").trim(); // YYYY-MM-DD or MM-DD
  const bd = birthday.match(/^(\d{4}-)?(\d{2}-\d{2})$/);
  const line1 = String(formData.get("line1") ?? "").trim();
  const town = String(formData.get("town") ?? "").trim();
  const postcode = String(formData.get("postcode") ?? "").trim();
  const fact = String(formData.get("fact") ?? "").trim();
  await mutate("personal", (db) =>
    addContact(db, {
      firstName: first,
      lastName: last || "",
      role: "",
      team: "",
      office: "",
      relationship: String(formData.get("relationship") ?? "").trim() || undefined,
      birthday: bd ? bd[2] : undefined,
      dob: bd && bd[1] ? birthday : undefined,
      homeAddress: line1 && postcode ? { line1, town, postcode } : undefined,
      publicFacts: fact ? [fact] : [],
    }),
  );
  refresh();
}

export async function loadExampleContactsAction(): Promise<void> {
  await mutate("personal", async (db) => {
    if (!db.company) await startPersonal(db, { name: "Akshay Devon", brandHex: "#1F3A5F", toneWords: ["warm", "a bit silly", "says what I actually mean"], signOff: "Lots of love", address: { line1: "7 Ridgeway Gardens", town: "London", postcode: "N6 5RB" } });
    await loadExampleContacts(db);
  });
  refresh();
  redirect("/me");
}

export async function resetPersonalAction(): Promise<void> {
  resetDb("personal");
  refresh();
  redirect("/me/start");
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

export async function closeCollectionAction(formData: FormData): Promise<void> {
  const collectionId = String(formData.get("collectionId"));
  await mutate((db) => {
    const col = db.collections.find((x) => x.id === collectionId);
    if (col) closeCollection(db, col);
  });
  refresh();
}

export async function generateImageAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const prompt = String(formData.get("prompt") ?? "").trim();
  const ws = wsOf(formData);
  await mutate(ws, async (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) await generateCardImage(db, c, prompt);
  });
  refresh();
}

export async function removeImageAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await mutate(wsOf(formData), (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) removeCardImage(c);
  });
  refresh();
}

export async function setCardGiftAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const giftId = String(formData.get("giftId") ?? "");
  await mutate(wsOf(formData), (db) => {
    const c = db.cards.find((x) => x.id === id);
    if (c) setCardGift(c, giftId || null);
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

export async function simulateSyncAction(formData: FormData): Promise<void> {
  const provider = String(formData.get("provider") ?? "").trim();
  const kind = (String(formData.get("kind")) === "crm" ? "crm" : "hr") as "hr" | "crm";
  if (!provider) return;
  await mutate(async (db) => {
    const { logEvent } = await import("@/lib/db");
    await loadDemoRoster(db);
    if (db.company) db.company.source = { provider, kind, simulated: true, syncedOn: db.clock.today };
    logEvent(db, `Synced ${db.people.filter((p) => p.kind === "staff").length} staff and ${db.people.filter((p) => p.kind === "client").length} clients from ${provider} (simulated for the demo)`);
  });
  refresh();
  redirect("/digest");
}

export async function resetDemoAction(): Promise<void> {
  resetDb("business");
  refresh();
  redirect("/onboarding");
}

export async function hasCompany(): Promise<boolean> {
  return Boolean(getDb().company);
}
