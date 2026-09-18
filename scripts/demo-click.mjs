import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 1500 });
await p.goto("http://localhost:3000/digest", { waitUntil: "networkidle0" });
// find Marcus's row and click Regenerate → hint chip "Warmer"
const rows = await p.$$("article");
let target;
for (const r of rows) { const t = await r.evaluate((e) => e.querySelector("a.font-medium")?.textContent); if (t === "Marcus Reid") target = r; }
if (!target) { console.log("no Marcus row"); process.exit(1); }
const before = await target.evaluate((e) => e.querySelector("p.font-display")?.textContent);
const regen = (await target.$$("button")).filter(async () => true);
for (const btn of await target.$$("button")) { if ((await btn.evaluate((e) => e.textContent)) === "Regenerate") { await btn.click(); break; } }
await new Promise((r) => setTimeout(r, 300));
for (const btn of await target.$$("button")) { if ((await btn.evaluate((e) => e.textContent)) === "Warmer") { await btn.click(); break; } }
const t0 = Date.now();
await p.waitForFunction((prev) => { const a = [...document.querySelectorAll("article")].find((e) => e.querySelector("a.font-medium")?.textContent === "Marcus Reid"); return a && a.querySelector("p.font-display")?.textContent !== prev; }, { timeout: 60000 }, before);
const after = await p.evaluate(() => { const a = [...document.querySelectorAll("article")].find((e) => e.querySelector("a.font-medium")?.textContent === "Marcus Reid"); return { text: a.querySelector("p.font-display")?.textContent, meta: [...a.querySelectorAll("span")].map((s) => s.textContent).filter((t) => /draft ·/.test(t)).join(" ") }; });
console.log(`regenerated in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log("before:", before);
console.log("after: ", after.text);
console.log("meta:  ", after.meta);
await p.screenshot({ path: "/tmp/shots/digest-live.png" });
await b.close();
