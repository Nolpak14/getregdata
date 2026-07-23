# Distribution / submission pack

Ready-to-paste copy for listing the **getregdata MCP server** and **skills** across
agent-tool directories. These need your accounts/logins, so this is a paste-pack -
run through the list once the npm package is published (see "Publish" at the bottom).

## Canonical listing copy (reuse everywhere)

> **This copy carries no counts, on purpose.** Directory listings are pasted by hand
> and re-crawled on someone else's schedule, so any number written here is stale the
> next time an actor ships - and every past attempt (exact numbers, then "30+" hedges)
> went stale anyway. Describe capability and regions; never write a fleet size into
> copy a human has to maintain. `node scripts/check-counts.mjs` enforces this.

- **Name:** getregdata
- **Tagline (≤60):** Official business-registry data for KYC/AML & due diligence
- **Short (≤160):** Official business registries as MCP tools + agent skills - one-call Poland KYB verdict, beneficial owners, credit-risk and adverse media across Europe, the US, UAE, Africa and LatAm.
- **Categories/tags:** kyc, aml, kyb, compliance, regtech, beneficial-owners, adverse-media, credit-risk, due-diligence, business-registry, apify
- **Repo:** https://github.com/Nolpak14/getregdata
- **npm:** https://www.npmjs.com/package/getregdata-mcp
- **Install command:** `npx -y getregdata-mcp`
- **Config block:**
  ```json
  { "mcpServers": { "getregdata": { "command": "npx", "args": ["-y", "getregdata-mcp"], "env": { "APIFY_TOKEN": "apify_api_xxxxx" } } } }
  ```

## MCP directories (submit the server)

| Directory | How to submit | URL |
|---|---|---|
| **mcp.so** | "Submit" form; paste repo + config + tags | https://mcp.so/submit |
| **Glama** | Auto-indexes public GitHub MCP servers; add topic `mcp` + `model-context-protocol` to the repo to be picked up, or submit | https://glama.ai/mcp/servers |
| **PulseMCP** | "Add a server" form | https://www.pulsemcp.com/submit |
| **Smithery** | Connect GitHub, add `smithery.yaml` (optional) + list | https://smithery.ai/new |
| **Awesome MCP Servers** | PR adding a bullet under the right category | https://github.com/punkpeye/awesome-mcp-servers |
| **Cursor MCP directory** | Submit via Cursor's directory form | https://cursor.directory/mcp |
| **mcpservers.org** | PR / submit | https://github.com/wong2/awesome-mcp-servers |

Bullet for the awesome-* PRs:
```
- [getregdata](https://github.com/Nolpak14/getregdata) - official business registries as agent tools (KYC/AML, beneficial owners, credit-risk, adverse media) across Europe, the US, UAE, Africa and LatAm via Apify; one call returns a complete Poland KYB verdict. `npx -y getregdata-mcp`.
```

## Skills directories (submit the skills)

| Directory | How to submit | URL |
|---|---|---|
| **skills.sh** | Submit the repo (`Nolpak14/getregdata`); it installs via `npx skills add Nolpak14/getregdata` | https://skills.sh |
| **Awesome Claude (skills/agents)** | PR adding a bullet | search "awesome-claude" / "awesome-claude-code" on GitHub |

Bullet:
```
- [getregdata](https://github.com/Nolpak14/getregdata) - skills for KYC/AML, credit-risk, property, compliance and lead-gen over official business registries across Europe, the US, UAE, Africa and LatAm, plus free public-API company lookups. `npx skills add Nolpak14/getregdata`.
```

## Repo hygiene that boosts auto-indexing

- Add GitHub topics: `mcp`, `model-context-protocol`, `kyc`, `aml`, `regtech`,
  `beneficial-owners`, `adverse-media`, `apify` (Glama and others crawl by topic).
- Keep the badges + install command near the top of the root README (done).

## Publish the npm package (one-time, needs your npm login)

```bash
cd mcp
npm login              # your npm account
npm publish --access public
# verify:
npx -y getregdata-mcp   # should print "getregdata MCP server ready - N registry tools..."
```

Bump `version` in `package.json` when the actor fleet changes (regenerate `actors.js`
from the live Apify account first).

## Checklist when the fleet grows

The expensive part used to be chasing a number through a dozen files. It is not any
more - **no public copy states a fleet size unless it is derived at runtime**, so
adding an actor should touch code and data, never marketing prose. If you find
yourself editing a sentence to change a number, stop: delete the number instead.

1. Regenerate `mcp/actors.js` from the live Apify account
   (`APIFY_TOKEN=... node scripts/gen-manifest.mjs`).
2. Bump `JURISDICTIONS` in `mcp/index.js` if the actor opens a new country. This is
   the one hardcoded number left, deliberately: it is read at runtime by the catalog
   tool description, so it lives in exactly one place.
3. Add the actor to the per-country tables in `README.md` and
   `skills/regdata/SKILL.md` - the tables are the content; do **not** add a count.
4. `node scripts/check-counts.mjs` - must print OK. It fails on any hardcoded fleet
   count, and on the retired Apify Console sign-up referral link (the old
   `?ref=` form, which earns no commission - always link
   `https://apify.com?fpr=getregdata` instead).
5. On the **site** (`getregdata-site`): add the entry to `src/data/registries.ts`,
   run `APIFY_TOKEN=... node scripts/sync-pricing.mjs` (it also fails if a
   `published:` flag disagrees with the live store), then `npm run build`.
   `/llms.txt`, `/llms-full.txt`, `/pricing.md` and `/.well-known/getregdata.json`
   are generated - never hand-edit them.
   Verify with `node scripts/check-counts.mjs --site ../getregdata-site`.
6. In `apify-actors`: add the actor to `FLEET` in `scripts/gen-cross-sell.mjs`
   (it exits 1 if a local actor is missing from the map), then
   `node scripts/gen-cross-sell.mjs --write` and redeploy the READMEs.
7. Update the **GitHub repo description** - GitHub search, social cards and most
   directory crawlers surface this string, and no repo-side check can reach it.
   Keep it count-free for the same reason as everything else:
   ```bash
   gh repo edit Nolpak14/getregdata --description '...'
   ```
8. Bump `mcp/package.json` version and `npm publish` - npmjs.com renders the
   *published* package's description, so GitHub alone never reaches `npx` users.
   Then `mcp-publisher publish` from `mcp/` to resync the Official MCP Registry.
9. The copy at the top of this file is count-free, so it does not need refreshing.
   Re-submit only if a directory listing is otherwise wrong. Glama re-crawls on its
   own; its API is read-only, with no refresh endpoint to force it.
