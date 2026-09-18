import puppeteer from "puppeteer-core";
const url = process.argv[2];
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 900 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
const info = await p.evaluate(() => ({
  title: document.title,
  h1: [...document.querySelectorAll("h1")].map(e => e.textContent.trim()).slice(0, 3),
  links: [...document.querySelectorAll("a[href]")].map(a => `${a.textContent.trim().slice(0, 40)} → ${a.getAttribute("href")}`).filter((v, i, a) => a.indexOf(v) === i).slice(0, 25),
  buttons: [...document.querySelectorAll("button")].map(b => b.textContent.trim()).filter(Boolean).slice(0, 15),
}));
console.log(JSON.stringify(info, null, 1));
await p.screenshot({ path: "/tmp/gallery/lovable.png", fullPage: true });
await b.close();
