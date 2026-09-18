import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 1200 });
await p.goto("http://localhost:3000/cards/card-1hal3tx", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 800));
const info = await p.evaluate(() => {
  const outer = document.querySelector("main .grid.gap-6");
  const sec = outer?.querySelector("section");
  const scaled = sec?.querySelector(":scope > div");
  const inner = scaled?.firstElementChild;
  const w = (e) => e ? Math.round(e.getBoundingClientRect().width) : null;
  return { grid: w(outer), gridCols: outer && getComputedStyle(outer).gridTemplateColumns, section: w(sec), scaledOuter: w(scaled), scaledOuterClass: scaled?.className, inner: w(inner), innerTransform: inner && getComputedStyle(inner).transform, aside: w(document.querySelector("aside")) };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
