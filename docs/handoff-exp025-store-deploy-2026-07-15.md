# Handoff: Deploy Italy + MSiG Apify Store descriptions (EXP-025)
Date: 2026-07-15 · Source: openclaw-agent Paperclip review · Owner: Piotr

## Verdict: MANUAL-CONSOLE — the actor source/README is not in this repo; deploying = pasting into the Apify web console (or Apify API), not editing files here.

## Blocker
Two finished Store-description drafts (Italy "Registro Imprese" and Polish MSiG court gazette) have been ready since 2026-07-07 but need a human to publish them on Apify — the agent (Growth Executor) has no write path to the live actor READMEs. This is the #1 constraint on scaling RegData's proven EXP-020 store-conversion playbook: the 14-day measurement clock for EXP-025 only starts on deploy, and the deadline (2026-07-19) is already at risk.

## Source
- Paperclip issue: REG-41 (RegData) — status blocked
- Drafts on VM: /home/agent/workspace/apify/content/exp-025-store-conversion/{italy-registro-imprese,msig}-store-description.md

## Where things live (in this repo)
NOT in this repo. `getregdata/` = agent skills + MCP server + examples only. There is no `.actor/`, `actor.json`, `apify.json`, or actor source — `mcp/actors.js` is an auto-generated manifest of short MCP tool blurbs ("Auto-generated from the live Apify fleet"), a different field from the Store README. The actors live on Apify:
- Italy: `regdata/italy-registro-imprese-scraper` (id `V4iPB4ow1gOU0wKL7`)
- MSiG: `regdata/msig-scraper` (id `v8g2pQsHK5TecDmga`)
Deployment surface = each actor's README/Description on console.apify.com (or the Apify API). No git-linked source, no CLI push path from here.

## Task
1. Open the two drafts on the VM (paths above). Each has a `PROPOSED REPLACEMENT` block placed "after the features/capabilities section, before the input schema."
2. In console.apify.com, open `regdata/italy-registro-imprese-scraper` → the actor's README/Description editor.
3. Insert the Italy draft's PROPOSED REPLACEMENT section (free-tier capacity, when-you'll-pay threshold, production-scale workflow cost examples) at that location; keep existing README structure. Save/publish so the Store page updates.
4. Repeat for `regdata/msig-scraper` with the MSiG draft.
5. (Optional, advanced) Instead of manual paste, a session with `APIFY_TOKEN` could fetch each actor's current README via the Apify API, merge in the section, and PUT it back — riskier, needs the live README; verify before overwriting.

## Acceptance criteria
- [ ] Italy Registro Imprese store description live
- [ ] MSiG store description live
- [ ] Verify by loading each actor's public Apify Store page and confirming the new pricing/threshold/workflow sections render.

## Report-back
When done, post in Slack #apify: `HUMAN: EXP-025 store descriptions (Italy + MSiG) deployed` — the RegData CMO will clear the OPEN BLOCKER, close REG-41, and score EXP-025 at its next Sunday review. Do NOT hand-close REG-41 with a comment.
