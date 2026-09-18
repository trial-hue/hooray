import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const p = await b.newPage();
p.on("console", (m) => { if (m.type() === "error") console.log(m.text().slice(0, 2500)); });
await p.goto("http://localhost:3000/digest", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));
await b.close();
