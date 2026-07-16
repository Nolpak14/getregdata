#!/usr/bin/env node
// Regenerates mcp/actors.js with each actor's DEPLOYED input schema baked in.
// Source of truth = the Apify platform (default build), never local files.
//
// Usage: APIFY_TOKEN=... node scripts/gen-manifest.mjs
//
// Keeps the curated tool names/titles/descriptions already in mcp/actors.js
// (they encode negative-result semantics the store copy lacks) and only
// attaches/refreshes `inputSchema`.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ACTORS_PATH = join(ROOT, "mcp", "actors.js");
const API = "https://api.apify.com/v2";
const token = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
if (!token) {
  console.error("APIFY_TOKEN is required");
  process.exit(1);
}

const { ACTORS } = await import(new URL(`file://${ACTORS_PATH.replace(/\\/g, "/")}`));

async function apiGet(path) {
  const res = await fetch(`${API}${path}${path.includes("?") ? "&" : "?"}token=${token}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return (await res.json()).data;
}

// Trim a full Apify input schema down to what an LLM needs to fill the input.
function trimSchema(full) {
  const props = {};
  for (const [key, p] of Object.entries(full.properties ?? {})) {
    if (key === "proxyConfiguration") continue; // server-side concern, still accepted via additionalProperties
    if (/^deprecated\b/i.test(p.description ?? "")) continue;
    const out = {};
    if (p.type) out.type = p.type;
    if (p.title) out.title = p.title;
    if (p.description) out.description = p.description;
    if (p.enum) out.enum = p.enum;
    if (p.default !== undefined) out.default = p.default;
    if (p.items?.type) out.items = { type: p.items.type };
    props[key] = out;
  }
  const trimmed = { type: "object", properties: props, additionalProperties: true };
  const required = (full.required ?? []).filter((r) => props[r]);
  if (required.length) trimmed.required = required;
  return trimmed;
}

async function deployedInputSchema(slug) {
  const actor = await apiGet(`/acts/regdata~${slug}`);
  const buildId = actor?.taggedBuilds?.latest?.buildId;
  if (!buildId) throw new Error(`no latest build for ${slug}`);
  const build = await apiGet(`/actor-builds/${buildId}`);
  const raw = build?.inputSchema ?? build?.actorDefinition?.input;
  if (!raw) throw new Error(`no input schema on build for ${slug}`);
  return trimSchema(typeof raw === "string" ? JSON.parse(raw) : raw);
}

const updated = [];
const failed = [];
for (const a of ACTORS) {
  try {
    const schema = await deployedInputSchema(a.slug);
    updated.push({ ...a, inputSchema: schema });
    console.log(`${a.slug}: ${Object.keys(schema.properties).length} fields${schema.required ? `, required=[${schema.required}]` : ""}`);
  } catch (err) {
    failed.push(a.slug);
    updated.push({ ...a }); // keep actor, tool falls back to freeform input
    console.error(`${a.slug}: FAILED - ${err.message}`);
  }
}

const banner =
  `// Auto-generated from the live Apify fleet (deployed builds). ${updated.length} regdata actors.\n` +
  `// Regenerate with: APIFY_TOKEN=... node scripts/gen-manifest.mjs\n` +
  `// Generated ${new Date().toISOString().slice(0, 10)}. Do not edit inputSchema by hand.\n`;
writeFileSync(ACTORS_PATH, `${banner}export const ACTORS = ${JSON.stringify(updated, null, 2)};\n`);
console.log(`\nwrote ${ACTORS_PATH}: ${updated.length} actors, ${failed.length} without schema${failed.length ? ` [${failed.join(", ")}]` : ""}`);
if (failed.length > updated.length / 2) process.exit(1);
