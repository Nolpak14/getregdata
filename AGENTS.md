# AGENTS.md - how AI agents use getregdata

getregdata turns 25+ official public business registries (11 jurisdictions: PL, DE, ES, IT, AT, FR, BE, CZ, SK, US-CA, UAE) into structured JSON for KYC/AML, credit-risk, due-diligence and B2B lead-gen work.

## Fastest paths

1. **Local MCP server (stdio)** - full input schemas baked into every tool:
   `npx -y getregdata-mcp` with env `APIFY_TOKEN` (free token + $5 credits: https://console.apify.com/sign-up?ref=getregdata)
2. **Hosted MCP (no install, OAuth)** - for remote clients:
   `https://mcp.apify.com/?actors=regdata/crbr-beneficial-owners-scraper,regdata/krz-debtor-scraper,regdata/germany-handelsregister-scraper` (swap in any regdata actor)
3. **Agent skills** (Claude Code and compatible): `npx skills add Nolpak14/getregdata -g -y`
4. **Raw HTTP**: `POST https://api.apify.com/v2/acts/regdata~<actor-name>/run-sync-get-dataset-items?token=<APIFY_TOKEN>` with the actor's JSON input as body; returns dataset items as a JSON array.

## Tool conventions

- MCP tools are named `regdata_<registry>` (e.g. `regdata_crbr_beneficial_owners`, `regdata_germany_insolvency`). Call `regdata_catalog` to list them all; `regdata_describe` returns an actor's live input schema.
- Inputs are flat objects keyed by official identifiers: `nip`/`krs` (Poland), register number (Germany), NIF (Spain), Partita IVA (Italy), ICO (Czechia), enterprise/VAT number (Belgium).
- Registry refusals are NOT empty results: several registries reject over-broad queries ("too many matches"). Tools report that state explicitly - narrow the query and re-run instead of concluding "no records".

## Auth and billing

- Every call needs the user's own `APIFY_TOKEN`. Never invent one; ask the user to create a free account if missing.
- Pay-per-result on Apify (from ~$0.003/result; per-actor price on its page at https://apify.com/regdata). The monthly free credit covers hundreds of lookups. No subscription.

## Key links

- Actor catalog: https://apify.com/regdata
- Site + docs: https://getregdata.com (machine-readable: https://getregdata.com/llms.txt, https://getregdata.com/.well-known/getregdata.json)
- MCP server source: `mcp/` in this repo; npm package `getregdata-mcp`; MCP Registry id `io.github.Nolpak14/getregdata`
