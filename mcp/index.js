#!/usr/bin/env node
// getregdata MCP server - exposes the regdata official business-registry actors as MCP tools.
// KYC/AML, credit-risk, due-diligence and B2B data across Europe, the US, UAE,
// Africa and LatAm. Fleet size is derived from actors.js - never hardcode it here
// (see scripts/check-counts.mjs for why).
//
// Auth: set APIFY_TOKEN in the environment (get one free at
// https://apify.com?fpr=getregdata - includes $5 credits).
//
// Run: npx getregdata-mcp   (or: node index.js)

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createRequire } from "node:module";
import { ACTORS } from "./actors.js";

const pkg = createRequire(import.meta.url)("./package.json");
const APIFY_BASE = "https://api.apify.com/v2";
// Jurisdictions covered by the actor fleet. Not derivable from actors.js (no
// country field), so it is asserted here and checked by scripts/check-counts.mjs.
const JURISDICTIONS = 16;
const token = () => process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN || "";

function requireToken() {
  const t = token();
  if (!t) {
    throw new Error(
      "APIFY_TOKEN is not set. Get a free token (with $5 credits) at " +
        "https://apify.com?fpr=getregdata and set APIFY_TOKEN in your MCP client config."
    );
  }
  return t;
}

// How long we hold a tool call open before handing back a run handle. Must stay
// under the MCP client's default request timeout (60s) with margin: if the CLIENT
// gives up first, the caller sees an error for a run that is still billing.
const WAIT_SECS = 45;
const TERMINAL = new Set(["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]);

// Retrying a pending check runs - and bills - a second time. This wording is
// deliberately blunt: it is the only thing between a slow check and a double charge.
const PENDING_NOTE =
  "This check is STILL RUNNING and is already being billed. Do NOT retry it and do NOT call this tool again - " +
  "call regdata_run_result with the runId above to collect the result. Retrying charges the user twice for the same check.";

async function apiJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`Apify API ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text).data;
}

async function datasetItems(datasetId, maxItems) {
  const url = new URL(`${APIFY_BASE}/datasets/${datasetId}/items`);
  url.searchParams.set("token", requireToken());
  if (maxItems) url.searchParams.set("limit", String(maxItems));
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`Could not read dataset ${datasetId} (${res.status})`);
  return text; // JSON array of dataset items
}

// Either the items, or a redeemable handle. Never a lost run.
async function settle(run, label, maxItems) {
  if (run.status === "SUCCEEDED") return await datasetItems(run.defaultDatasetId, maxItems);
  if (TERMINAL.has(run.status)) {
    throw new Error(
      `regdata/${label} run ${run.id} ended as ${run.status}` +
        (run.statusMessage ? `: ${run.statusMessage}` : "")
    );
  }
  return JSON.stringify(
    { status: run.status, runId: run.id, datasetId: run.defaultDatasetId, note: PENDING_NOTE },
    null,
    2
  );
}

// Start the actor and wait briefly.
//
// Started ASYNC on purpose. This previously used run-sync-get-dataset-items, which
// holds one connection open until the run ends. Per Apify's docs, "if the connection
// breaks, you will not receive any information about the run and its output" and
// "this won't abort the run itself" - so a client timeout destroyed the only handle
// to a run that then completed and BILLED. Measured durations for the Poland KYB
// composite were 21-148s against a 60s client default, so this was routine, not rare.
// Starting async means the runId exists from the first response and a disconnect is
// always recoverable.
async function runActor(slug, input, { maxItems } = {}) {
  const url = new URL(`${APIFY_BASE}/acts/regdata~${slug}/runs`);
  url.searchParams.set("token", requireToken());
  url.searchParams.set("waitForFinish", String(WAIT_SECS)); // Apify caps this at 60
  if (maxItems) url.searchParams.set("maxItems", String(maxItems));
  const run = await apiJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input ?? {}),
  });
  return await settle(run, slug, maxItems);
}

// Collect a run that was still going when its tool call returned.
//
// NOTE on access: we send the caller's token, but Apify does NOT scope runs or
// datasets to it - verified 2026-07-23, `GET /actor-runs/{id}` and
// `/datasets/{id}/items` both return 200 with a foreign token AND with no token
// at all, on a dataset whose isPublic is unset. The storage ID is itself the
// capability. So this tool grants nothing a runId holder could not already fetch
// straight from the public API; it is convenience, not an access boundary.
// Treat a runId as a secret and do not log or forward it.
async function collectRun(runId, { waitSecs, maxItems } = {}) {
  const url = new URL(`${APIFY_BASE}/actor-runs/${runId}`);
  url.searchParams.set("token", requireToken());
  url.searchParams.set("waitForFinish", String(Math.max(0, Math.min(waitSecs ?? WAIT_SECS, 60))));
  const run = await apiJson(url);
  return await settle(run, run.actId ?? "run", maxItems);
}

// Fetch an actor's live input schema so the model can construct correct input.
async function describeActor(slug) {
  const url = `${APIFY_BASE}/acts/regdata~${slug}?token=${requireToken()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch regdata/${slug} (${res.status})`);
  const { data } = await res.json();
  // The build's input schema lives on the default build; fall back to a hint.
  const schema =
    data?.defaultRunOptions?.inputSchema ||
    data?.exampleRunInput ||
    "See https://apify.com/regdata/" + slug + " for the input schema.";
  return { slug, title: data?.title, description: data?.description, schema };
}

const bySlug = Object.fromEntries(ACTORS.map((a) => [a.slug, a]));
const byTool = Object.fromEntries(ACTORS.map((a) => [a.tool, a]));

// One tool per actor + three helpers (catalog, run_result, describe).
const MAX_ITEMS_PROP = {
  type: "integer",
  description: "Optional cap on billed dataset items returned.",
};

function buildToolList() {
  const actorTools = ACTORS.map((a) => {
    // Deployed input schema baked in by scripts/gen-manifest.mjs; freeform fallback.
    const schema = a.inputSchema
      ? {
          ...a.inputSchema,
          properties: { ...a.inputSchema.properties, maxItems: MAX_ITEMS_PROP },
        }
      : {
          type: "object",
          description: `Input for regdata/${a.slug}. Freeform - matches the actor's Apify input schema.`,
          properties: { maxItems: MAX_ITEMS_PROP },
          additionalProperties: true,
        };
    const hint = a.inputSchema
      ? `Advanced fields beyond this schema are also accepted (regdata_describe lists them).`
      : `Pass the registry's search input as a flat object (e.g. name, tax ID, or registration number); ` +
        `call regdata_describe with slug "${a.slug}" first if unsure of the exact fields.`;
    return {
      name: a.tool,
      description: `${a.title}. ${a.description} ${hint}`,
      inputSchema: schema,
    };
  });

  return [
    {
      name: "regdata_catalog",
      description:
        `List the getregdata business-registry tools (KYC/AML, credit-risk, due-diligence, B2B) across ${JURISDICTIONS} jurisdictions, with each tool name and what it returns. ` +
        `For a Polish company, prefer regdata_poland_kyb_check: one call takes a NIP or KRS and returns a complete KYB verdict (identity + beneficial owners + insolvency screened against the company and every owner), instead of chaining several registry tools yourself. ` +
        `Use this catalog to find the right single-registry tool for other jurisdictions, or when you need one specific source in depth.`,
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
    },
    {
      name: "regdata_run_result",
      description:
        "Collect the result of a regdata check that was still running when its tool call returned. " +
        "When any regdata tool returns {status, runId, note} instead of results, the check is running and already billed - " +
        "call THIS tool with that runId rather than re-running the check, which would charge the user twice. " +
        "Returns the dataset items once the run finishes; if it is still going, returns the same handle so you can call again.",
      inputSchema: {
        type: "object",
        properties: {
          runId: {
            type: "string",
            description: "The runId returned by the pending tool call, e.g. NAMNqpPch7RFSY1oQ",
          },
          waitSecs: {
            type: "integer",
            description: "Seconds to wait for the run to finish before returning (0-60, default 45).",
          },
          maxItems: MAX_ITEMS_PROP,
        },
        required: ["runId"],
        additionalProperties: false,
      },
    },
    {
      name: "regdata_describe",
      description:
        "Fetch the live input schema + description for one actor so you can construct a correct call. Provide either the actor slug or its tool name.",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Actor slug, e.g. crbr-beneficial-owners-scraper" },
          tool: { type: "string", description: "Tool name, e.g. regdata_crbr_beneficial_owners" },
        },
        additionalProperties: false,
      },
    },
    ...actorTools,
  ];
}

const server = new Server(
  { name: "getregdata", version: pkg.version },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: buildToolList(),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  try {
    if (name === "regdata_catalog") {
      const list = ACTORS.map((a) => ({ tool: a.tool, slug: a.slug, title: a.title }));
      return { content: [{ type: "text", text: JSON.stringify(list, null, 2) }] };
    }
    if (name === "regdata_run_result") {
      if (!args.runId) throw new Error("runId is required - it is returned by the pending tool call.");
      const out = await collectRun(args.runId, { waitSecs: args.waitSecs, maxItems: args.maxItems });
      return { content: [{ type: "text", text: out }] };
    }
    if (name === "regdata_describe") {
      const slug = args.slug || byTool[args.tool]?.slug;
      if (!slug || !bySlug[slug]) throw new Error(`Unknown actor: ${args.slug || args.tool}`);
      const info = await describeActor(slug);
      return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
    }
    const actor = byTool[name];
    if (!actor) throw new Error(`Unknown tool: ${name}`);
    const { maxItems, ...input } = args;
    const items = await runActor(actor.slug, input, { maxItems });
    return { content: [{ type: "text", text: items }] };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: String(err?.message || err) }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`getregdata MCP server ready - ${ACTORS.length} registry tools + catalog/run_result/describe.`);
