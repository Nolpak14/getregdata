// Smoke test: spawn the server over stdio, list tools, and (if APIFY_TOKEN is
// set) run one live read against the catalog. Exits non-zero on failure.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ACTORS } from "./actors.js";

const transport = new StdioClientTransport({ command: "node", args: ["index.js"] });
const client = new Client({ name: "smoke", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

const { tools } = await client.listTools();
const names = tools.map((t) => t.name);
const expectHelpers = ["regdata_catalog", "regdata_describe"];
const actorTools = names.filter((n) => n.startsWith("regdata_") && !expectHelpers.includes(n));

console.log(`tools: ${tools.length} (${actorTools.length} actor tools + helpers)`);
if (actorTools.length !== ACTORS.length) throw new Error(`expected ${ACTORS.length} actor tools, got ${actorTools.length}`);
for (const h of expectHelpers) if (!names.includes(h)) throw new Error(`missing helper ${h}`);

// Every actor tool must expose a real input schema (fields beyond maxItems).
const thin = tools.filter(
  (t) =>
    actorTools.includes(t.name) &&
    Object.keys(t.inputSchema?.properties ?? {}).filter((k) => k !== "maxItems").length === 0
);
if (thin.length) throw new Error(`actor tools with empty input schema: ${thin.map((t) => t.name).join(", ")}`);
console.log("input schemas OK - all actor tools expose real fields");

const cat = await client.callTool({ name: "regdata_catalog", arguments: {} });
const list = JSON.parse(cat.content[0].text);
if (list.length !== ACTORS.length) throw new Error(`catalog returned ${list.length}, expected ${ACTORS.length}`);
console.log(`catalog OK - e.g. ${list[0].tool} -> regdata/${list[0].slug}`);

console.log("SMOKE PASS");
await client.close();
process.exit(0);
