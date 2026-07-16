# getregdata MCP server

An [MCP](https://modelcontextprotocol.io) server that gives any MCP-capable agent
(Claude Desktop, Claude Code, Cursor, Cline, Windsurf, ...) direct
access to **25+ official business-registry actors** for KYC/AML, credit-risk,
due-diligence and B2B data across **11 jurisdictions**: Poland, Germany, Italy,
Spain, Austria, France, Belgium, Czechia, Slovakia, the US (California) and the UAE -
plus a cross-border adverse-media screener.

Each registry is exposed as its own tool (e.g. `regdata_crbr_beneficial_owners`,
`regdata_germany_handelsregister`, `regdata_adverse_media`), plus two helpers:

- `regdata_catalog` - list every registry tool and what it returns.
- `regdata_describe` - fetch a specific actor's live input schema so the agent
  builds a correct call.

## Setup

You need an Apify API token (free, includes $5 credits):
[console.apify.com/sign-up?ref=getregdata](https://console.apify.com/sign-up?ref=getregdata).

### Claude Desktop / Claude Code

Add to your MCP config (`claude_desktop_config.json`, or `.mcp.json` for Claude Code):

```json
{
  "mcpServers": {
    "getregdata": {
      "command": "npx",
      "args": ["-y", "getregdata-mcp"],
      "env": { "APIFY_TOKEN": "apify_api_xxxxx" }
    }
  }
}
```

### Cursor / Cline / Windsurf

Same block in the client's MCP settings (`mcp.json` / MCP servers panel). The server
speaks stdio, so `npx -y getregdata-mcp` with `APIFY_TOKEN` in `env` is all you need.

### Hosted clients - claude.ai web, ChatGPT developer mode, Gemini (no install)

This npm server is stdio-only. For hosted agents that need a remote HTTPS endpoint,
connect **Apify's hosted MCP server** with OAuth instead - the regdata actors are
first-class tools there:

```
https://mcp.apify.com/?actors=regdata/crbr-beneficial-owners-scraper,regdata/krz-debtor-scraper,regdata/germany-handelsregister-scraper,regdata/poland-krs-financial-scraper,regdata/adverse-media-screener
```

Swap in any of the [25+ regdata actors](https://apify.com/regdata), or connect plain
`https://mcp.apify.com` and let the agent discover them via `search-actors`
("Poland beneficial owners", "Germany insolvency", ...). OAuth signs you into your
own Apify account, so billing and the free credit work exactly like the local server.

## Usage

Once connected, just ask your agent in natural language:

- *"Screen Wirecard for adverse media."* -> `regdata_adverse_media`
- *"Who are the beneficial owners of Polish NIP 5260250995?"* -> `regdata_crbr_beneficial_owners`
- *"Is this German company in the Handelsregister?"* -> `regdata_germany_handelsregister`
- *"Check this company against the Czech insolvency register."* -> `regdata_czech_isir`

If the agent is unsure of a registry's exact input fields, it calls
`regdata_describe` first, then runs the tool.

## Pricing

Pay-per-result on Apify, no subscription - from ~$0.003/result depending on actor
and plan tier. The $5 monthly free credit covers hundreds to ~1,600 lookups. Each
actor's current price is on its Store page at [apify.com/regdata](https://apify.com/regdata).

## How it works

The server calls Apify's `run-sync-get-dataset-items` endpoint for each actor and
returns the dataset items as JSON. No data passes through any third party - it is
your token, the Apify platform, and the official registry source.

## Local development

```bash
npm install
npm run smoke          # verify all tools load with real input schemas
APIFY_TOKEN=xxx npm start
```

## License

MIT - part of [github.com/Nolpak14/getregdata](https://github.com/Nolpak14/getregdata).
