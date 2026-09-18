// Print the bare card page to PDF with the installed Chrome via puppeteer-core.
// Fallback: Chrome's own --headless --print-to-pdf.
import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import puppeteer, { type Browser } from "puppeteer-core";
import { SHEET_H, SHEET_W } from "@/components/Card";

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

declare global {
  // eslint-disable-next-line no-var
  var __occasionallyBrowser: Promise<Browser> | undefined;
}

function getBrowser(): Promise<Browser> {
  if (!globalThis.__occasionallyBrowser) {
    globalThis.__occasionallyBrowser = puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--font-render-hinting=none"] }).then((b) => {
      b.on("disconnected", () => {
        globalThis.__occasionallyBrowser = undefined;
      });
      return b;
    });
  }
  return globalThis.__occasionallyBrowser;
}

export function printPageUrl(id: string, origin: string, marks: boolean): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? origin;
  const t = process.env.PRINT_TOKEN ? `&t=${encodeURIComponent(process.env.PRINT_TOKEN)}` : "";
  return `${base}/print/cards/${id}?marks=${marks ? 1 : 0}${t}`;
}

export async function renderCardPdf(id: string, opts: { marks?: boolean; origin: string }): Promise<Buffer> {
  const url = printPageUrl(id, opts.origin, Boolean(opts.marks));
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
      await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready);
      const pdf = await page.pdf({ width: `${SHEET_W}mm`, height: `${SHEET_H}mm`, printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  } catch (err) {
    // Fallback: plain headless Chrome. Honours @page size from CSS.
    const out = path.join(os.tmpdir(), `occasionally-${id}-${Date.now()}.pdf`);
    await promisify(execFile)(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--no-sandbox", `--print-to-pdf=${out}`, url], { timeout: 45_000 });
    const buf = fs.readFileSync(out);
    fs.unlinkSync(out);
    if (buf.length < 1000) throw err;
    return buf;
  }
}
