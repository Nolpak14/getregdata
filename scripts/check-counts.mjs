#!/usr/bin/env node
// check-counts.mjs - fail loudly when public-facing prose undersells the fleet.
//
// Why this exists: counts drifted for months across README, AGENTS.md, the MCP
// tool descriptions and the submission paste-pack, so directory listings said
// "24 actors / 11 jurisdictions" while the fleet was at 34 / 16. Hedging with
// "30+" did not help - the hedge itself went stale and undersold anyway.
//
// Run: node scripts/check-counts.mjs   (exit 1 on any mismatch)

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- ground truth, derived from the code wherever possible -----------------
const { ACTORS } = await import(
  new URL("../mcp/actors.js", import.meta.url).href
);
const ACTOR_COUNT = ACTORS.length;

const SKILL_COUNT = readdirSync(join(ROOT, "skills"), { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(ROOT, "skills", e.name, "SKILL.md")))
  .length;

// Not derivable from actors.js (no country field), so index.js asserts it and
// we read it back from there - one place to change, checked everywhere.
const indexSrc = readFileSync(join(ROOT, "mcp", "index.js"), "utf8");
const jm = indexSrc.match(/^const JURISDICTIONS = (\d+);/m);
if (!jm) {
  console.error("FAIL  mcp/index.js: no `const JURISDICTIONS = <n>;` declaration found");
  process.exit(1);
}
const JURISDICTIONS = Number(jm[1]);

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

const RULES = [
  { label: "actors", expect: ACTOR_COUNT, re: /(\d+)\+?\s+(?:regdata\s+)?actors\b/gi },
  {
    label: "registries",
    expect: ACTOR_COUNT,
    re: /(\d+)\+?\s+(?:official\s+)?(?:public\s+)?(?:business-)?registr(?:y|ies)\b/gi,
  },
  { label: "jurisdictions", expect: JURISDICTIONS, re: /(\d+)\+?\s+jurisdictions\b/gi },
  { label: "skills", expect: SKILL_COUNT, re: /(\d+)\+?\s+skills\b/gi },
];

// Per-country section headings like "### Poland (12 actors)" are a different
// claim - they must sum to the fleet total rather than equal it.
const COUNTRY_HEADING = /^#+\s+.*\((\d+) actors?\)/;

let failures = 0;
for (const rel of FILES) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) {
    console.error(`FAIL  ${rel}: listed in check-counts.mjs but missing on disk`);
    failures++;
    continue;
  }
  const lines = readFileSync(path, "utf8").split("\n");
  const sections = [];
  lines.forEach((line, i) => {
    // the JURISDICTIONS declaration is the source of truth, not a claim
    if (/^const JURISDICTIONS = \d+;/.test(line)) return;
    const ch = line.match(COUNTRY_HEADING);
    if (ch) {
      sections.push(Number(ch[1]));
      return;
    }
    for (const { label, expect, re } of RULES) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        if (Number(m[1]) !== expect) {
          console.error(
            `FAIL  ${rel}:${i + 1}  says "${m[0].trim()}" - ${label} is ${expect}`
          );
          failures++;
        }
      }
    }
  });

  if (sections.length) {
    const sum = sections.reduce((a, b) => a + b, 0);
    if (sum !== ACTOR_COUNT) {
      console.error(
        `FAIL  ${rel}: per-country sections sum to ${sum} across ${sections.length} ` +
          `headings, but the fleet has ${ACTOR_COUNT} actors - a section is missing or stale`
      );
      failures++;
    }
  }
}

if (failures) {
  console.error(
    `\n${failures} stale count(s). Ground truth: ${ACTOR_COUNT} actors, ` +
      `${JURISDICTIONS} jurisdictions, ${SKILL_COUNT} skills.`
  );
  console.error("Also update the GitHub repo description - crawlers read that, not the README:");
  console.error("  gh repo edit Nolpak14/getregdata --description '...'");
  process.exit(1);
}

console.log(
  `OK  ${ACTOR_COUNT} actors, ${JURISDICTIONS} jurisdictions, ${SKILL_COUNT} skills - ` +
    `consistent across ${FILES.length} public-facing files.`
);
