import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
for (const u of ["/digest", "/dashboard", "/calendar", "/people", "/onboarding", "/collections/col-1hal3tx"]) {
  const p = await b.newPage();
  const msgs = [];
  p.on("console", (m) => { if (["error", "warning"].includes(m.type())) msgs.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  p.on("pageerror", (e) => msgs.push(`pageerror: ${String(e).slice(0, 300)}`));
  await p.goto("http://localhost:3000" + u, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  console.log(u, msgs.length ? "\n  " + msgs.join("\n  ") : "clean");
  await p.close();
}
await b.close();
