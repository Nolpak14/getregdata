# Distribution / submission pack

Ready-to-paste copy for listing the **getregdata MCP server** and **skills** across
agent-tool directories. These need your accounts/logins, so this is a paste-pack -
run through the list once the npm package is published (see "Publish" at the bottom).

## Canonical listing copy (reuse everywhere)

> Before pasting this anywhere, run `node scripts/check-counts.mjs` from the repo
> root. The counts below are the single most common thing to go stale - listings
> submitted with old numbers undersell the fleet and only get corrected on the
> directory's next crawl (or never).

- **Name:** getregdata
- **Tagline (≤60):** Official business-registry data for KYC/AML & due diligence
- **Short (≤160):** 34 official business-registry actors as MCP tools + 44 agent skills - KYC/AML, beneficial owners, credit-risk, adverse media across 16 jurisdictions.
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
- [getregdata](https://github.com/Nolpak14/getregdata) - 34 official business-registry actors (KYC/AML, beneficial owners, credit-risk, adverse media) across 16 jurisdictions in Europe, the US, UAE, Africa and LatAm via Apify. `npx -y getregdata-mcp`.
```

## Skills directories (submit the skills)

| Directory | How to submit | URL |
|---|---|---|
| **skills.sh** | Submit the repo (`Nolpak14/getregdata`); it installs via `npx skills add Nolpak14/getregdata` | https://skills.sh |
| **Awesome Claude (skills/agents)** | PR adding a bullet | search "awesome-claude" / "awesome-claude-code" on GitHub |

Bullet:
```
- [getregdata](https://github.com/Nolpak14/getregdata) - 44 skills for KYC/AML, credit-risk, property, compliance and lead-gen over 34 official business registries in 16 jurisdictions. `npx skills add Nolpak14/getregdata`.
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

Adding an actor touches more than `actors.js`. In order:

1. Regenerate `mcp/actors.js` from the live Apify account.
2. Bump `JURISDICTIONS` in `mcp/index.js` if the actor opens a new country.
3. Add the per-country section to `README.md` and `skills/regdata/SKILL.md`.
4. `node scripts/check-counts.mjs` - must print OK before you go further.
5. Update the **GitHub repo description**. This is the string GitHub search,
   social cards and most directory crawlers surface, and it is the one place
   `check-counts.mjs` cannot reach:
   ```bash
   gh repo edit Nolpak14/getregdata --description '...'
   ```
6. Bump `mcp/package.json` version and `npm publish` - npmjs.com shows the
   `description` field, so it stays stale until a republish.
7. Refresh the copy in this file, then re-submit to the directories above.
   Glama re-crawls the repo on its own; its API is read-only, with no
   refresh endpoint to force it.
