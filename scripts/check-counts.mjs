#!/usr/bin/env node
// check-counts.mjs - keep hand-maintained public copy FREE of fleet counts.
//
// History, and why this guard was inverted.
//
//   v1 hardcoded exact numbers everywhere and checked they matched. Adding one
//   actor then broke 15 places across 6 files, and the paste-only surfaces it
//   could not reach (the Apify store bio, directory listings) silently rotted.
//   v2 (commit c2583b4) swapped exact numbers for "30+" hedges; the hedges went
//   stale too AND undersold by construction, so it was reverted.
//
//   Both lost for the same reason: they kept a fleet size inside prose a human
//   maintains. "36 actors" versus "37 actors" changes no reader's decision, so
//   the number was pure liability. The rule now:
//
//     A fleet count may appear only where it is DERIVED AT RUNTIME from
//     mcp/actors.js (e.g. `${ACTORS.length}` in mcp/index.js) or generated at
//     build time. Anywhere a human types or pastes, describe capability and
//     regions - never a number.
//
// So this script no longer asks "is the number right?". It asks "is there a
// number here at all?" - and fails if there is.
//
// Run: node scripts/check-counts.mjs            (exit 1 on any hardcoded count)
//      node scripts/check-counts.mjs --site ../getregdata-site

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- ground truth, for the summary line only (never asserted into prose) ---
const { ACTORS } = await import(new URL("../mcp/actors.js", import.meta.url).href);
const SKILL_COUNT = readdirSync(join(ROOT, "skills"), { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(ROOT, "skills", e.name, "SKILL.md")))
  .length;

// --- the public-facing surface that directories and crawlers read ----------
const FILES = [
  "README.md",
  "AGENTS.md",
  "mcp/README.md",
  "mcp/SUBMISSIONS.md",
  "mcp/package.json",
  "mcp/server.json",
  "mcp/index.js",
  "skills/regdata/SKILL.md",
];

// Site agent files are GENERATED (src/pages/llms.txt.ts etc) into dist/, so they
// may carry exact counts - those are derived, not pasted. We check the built
// output for the retired referral link and for missing actors instead. Run
// `npm run build` in the site first; pointing at src/ would test nothing.
const SITE_FILES = [
  "dist/llms.txt",
  "dist/llms-full.txt",
  "dist/.well-known/getregdata.json",
  "dist/pricing.md",
];

// A fleet claim: a number immediately qualifying one of our countable nouns.
// Deliberately narrow - "$0.25 per check" and "16 fields" are not fleet claims.
const COUNT_CLAIM =
  /\b(\d+)\s*\+?\s+(?:official\s+|public\s+|regdata\s+|business-?\s*)*(actors?|registries|registry|jurisdictions|skills|tools|countries)\b/gi;

// shields.io badges encode "+" as %2B, so a plain grep misses them. Directory
// crawlers (Glama at least) read badges, so they are a public claim too.
const BADGE_CLAIM = /badge\/(?:actors|skills|jurisdictions|registries|tools)-(\d+)(?:%2B|\+)?-/gi;

// Per-country headings like "### Poland (12 actors)" - same liability, and they
// also have to be re-summed by hand every time.
const COUNTRY_HEADING = /^#+\s+.*\((\d+) actors?\)/;

// Written in prose, these are fine - they are derived at runtime, not typed.
const DERIVED = [/\$\{ACTORS\.length\}/, /\$\{JURISDICTIONS\}/, /ACTORS\.length/];
const isDerivedLine = (line) => DERIVED.some((re) => re.test(line));

// The retired referral link earns no commission - any occurrence is lost revenue.
const RETIRED_REF = /console\.apify\.com\/sign-up\?ref=/gi;

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  failures++;
};

function scan(baseDir, relPaths, { allowCounts = false } = {}) {
  for (const rel of relPaths) {
    const path = join(baseDir, rel);
    if (!existsSync(path)) {
      fail(`${rel}: listed in check-counts.mjs but missing on disk`);
      continue;
    }
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      const at = `${rel}:${i + 1}`;

      let m;
      RETIRED_REF.lastIndex = 0;
      if ((m = RETIRED_REF.exec(line)))
        fail(`${at}  retired referral link "${m[0]}" - earns no commission; use apify.com/regdata?fpr=getregdata`);

      if (allowCounts || isDerivedLine(line)) return;

      for (const re of [COUNT_CLAIM, BADGE_CLAIM]) {
        re.lastIndex = 0;
        while ((m = re.exec(line)) !== null)
          fail(`${at}  hardcoded fleet count "${m[0].trim()}" - describe capability/regions instead, or derive it at runtime`);
      }

      const ch = line.match(COUNTRY_HEADING);
      if (ch) fail(`${at}  per-country count "(${ch[1]} actors)" in a heading - drop it; the table below is the content`);
    });
  }
}

scan(ROOT, FILES);

const siteFlag = process.argv.indexOf("--site");
if (siteFlag !== -1) {
  const siteRoot = resolve(process.argv[siteFlag + 1] ?? "");
  if (!existsSync(siteRoot)) {
    fail(`--site ${siteRoot}: directory not found`);
  } else {
    // Generated output may carry counts; it must still be free of the dead link,
    // and must actually list every live actor.
    scan(siteRoot, SITE_FILES, { allowCounts: true });
    const slugs = ACTORS.map((a) => a.slug);
    for (const rel of ["dist/llms-full.txt", "dist/pricing.md"]) {
      const p = join(siteRoot, rel);
      if (!existsSync(p)) continue;
      const body = readFileSync(p, "utf8");
      const missing = slugs.filter((s) => !body.includes(s));
      if (missing.length)
        fail(`${rel}: missing ${missing.length} live actor(s) - ${missing.join(", ")}`);
    }
  }
}

if (failures) {
  console.error(
    `\n${failures} problem(s). Fleet is ${ACTORS.length} actors / ${SKILL_COUNT} skills right now - ` +
      `but do not paste those numbers into the files above. That is the bug this guard exists to prevent.`
  );
  process.exit(1);
}

console.log(
  `OK  no hardcoded fleet counts and no retired referral links across ${FILES.length} public-facing files` +
    (siteFlag !== -1 ? ` + ${SITE_FILES.length} site files` : "") +
    `. (Fleet is ${ACTORS.length} actors / ${SKILL_COUNT} skills - derived, not pasted.)`
);
