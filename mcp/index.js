#!/usr/bin/env node
// getregdata MCP server - exposes the regdata official business-registry actors as MCP tools.
// KYC/AML, credit-risk, due-diligence and B2B data across 11 jurisdictions.
//
// Auth: set APIFY_TOKEN in the environment (get one free at
// https://apify.com/regdata?fpr=getregdata - includes $5 credits).
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
const token = () => process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN || "";

function requireToken() {
  const t = token();
  if (!t) {
    throw new Error(
      "APIFY_TOKEN is not set. Get a free token (with $5 credits) at " +
        "https://apify.com/regdata?fpr=getregdata and set APIFY_TOKEN in your MCP client config."
    );
  }
  return t;
}

// Run an actor synchronously and return its dataset items.
async function runActor(slug, input, { maxItems } = {}) {
  const url = new URL(`${APIFY_BASE}/acts/regdata~${slug}/run-sync-get-dataset-items`);
  url.searchParams.set("token", requireToken());
  if (maxItems) url.searchParams.set("maxItems", String(maxItems));
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input ?? {}),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify run failed (${res.status}) for regdata/${slug}: ${text.slice(0, 400)}`);
  }
  return text; // JSON array of dataset items
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

// One tool per actor + two helpers (catalog, describe).
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
        `List all ${ACTORS.length} getregdata business-registry actors (KYC/AML, credit-risk, due-diligence, B2B) across 11 jurisdictions, with their tool name and what each returns. Call this first to discover which registry tool to use.`,
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
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
console.error(`getregdata MCP server ready - ${ACTORS.length} registry tools + catalog/describe.`);
