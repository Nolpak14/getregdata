# Free-API skills expansion - strategy, wiring, and measurement

_Added 2026-07-17._

## Why

getregdata's skills were all gated behind paid Apify actors, so a developer who
found the repo hit a paywall before getting any value - and never generated the
install telemetry that skills.sh uses to index and rank skills. The repo was
therefore invisible on skills.sh (`npx skills find getregdata` returned nothing;
the site's search and leaderboard are the same telemetry-backed index, not a
GitHub crawler).

The fix is an open-core funnel: add skills that wrap **genuinely free public
registry APIs**. They have standalone utility, so they get installed and used for
free, which generates the telemetry that gets the whole suite indexed and ranked.
The paid actors then become the natural upsell for the jurisdictions that have no
free API (Poland, Germany, Spain, Italy, ...) and for the depth the free sources
do not provide (beneficial owners, financials, insolvency, court filings).

Proof point: a single free national-registry skill (`aradotso/trending-skills@brreg`,
Norway) has ~1,300 installs on skills.sh, while getregdata's paid suite had ~0.
Free national-registry wrappers are the top performers in this niche.

## What was added (Phase 1)

Six free skills that query official public APIs directly - no Apify token, no
per-result cost:

| Skill | Source | Free? |
|---|---|---|
| `companies-house-uk` | UK Companies House API | Free API key, OGL |
| `sec-edgar-us` | US SEC EDGAR | No key (User-Agent required), public domain |
| `norway-company-registry` | Brønnøysundregistrene (data.brreg.no) | No key, NLOD |
| `france-company-lookup` | api.gouv.fr (INSEE Sirene + INPI RNE) | No key, Licence Ouverte |
| `gleif-lei-lookup` | GLEIF API | No key, CC0 (public domain) |
| `sanctions-pep-screening` | OFAC / EU / UK / UN consolidated lists | Free, official/public |

Each skill is free-API-first and routes to the paid actor exactly where the free
source stops. `gleif-lei-lookup` is the cross-border spine: resolve a name to an
LEI + local registry ID, then pull the deep national record from the right source.

### Honesty note on sanctions screening

The `sanctions-pep-screening` skill is anchored on the **official government
consolidated lists** (OFAC SDN + Consolidated, EU FSD, UK OFSI, UN Security
Council), which are free and open for any use including commercial. OpenSanctions
is mentioned only as an optional aggregator with its real licence caveat: its
hosted API is paid for commercial use, and its bulk data is CC-BY-NC, so
commercial screening on OpenSanctions data needs a paid licence regardless of
self-hosting. The skill must never imply OpenSanctions is "free for business."

## Discoverability (Phase 0)

skills.sh search is naive keyword-matching on skill name + description, and the
scan found the relevant lanes wide open:

- `kyb` returns only crypto noise (Skybridge, KyberSwap) - no real KYB skill.
- `sanctions` returned nothing at all.

Actions taken:
- Added `kyb` / "know your business" / "counterparty verification" to the
  `regdata-kyc-aml` and `regdata` router descriptions, tags and triggers - these
  skills genuinely do KYB, so this is an honest claim on an empty lane.
- Held the `sanctions` keyword for the real `sanctions-pep-screening` skill rather
  than keyword-stuffing it into a skill that only does adverse-media news.
- The install command `npx skills add Nolpak14/getregdata` must be front-and-centre
  on every reach channel (getregdata.com, Dev.to/Medium articles, Apify actor
  READMEs, MCP listings). Every install feeds the telemetry index. The bar to
  rank is low: `vyayasan/kyc-analyst` ranks for "kyc" on ~53 installs.

## Cross-sell wiring (Phase 2)

- The router (`regdata` SKILL.md) has a "Free Registry Skills" section and intent-table
  rows routing free lookups and sanctions/PEP screening to the new skills.
- Each free skill ends with a cross-sell table mapping "you now need X" to the paid
  actor slug, plus a "Related skills" section linking siblings and `regdata-kyc-aml`.
- README has a "Free registry skills" table and the funnel explanation.

## Measurement

There is no Apify API for install attribution, so track the funnel from both ends:

1. **skills.sh install counts per skill** - the public leaderboard shows per-skill
   installs. Watch each new free skill appear and climb; watch whether the paid
   `regdata-*` skills start appearing once telemetry crosses the threshold. Check
   with `npx skills find <keyword>` (e.g. `companies house`, `lei`, `sec edgar`,
   `sanctions`, `kyb`) and confirm getregdata entries surface.
2. **GitHub traffic** (repo Insights) - unique clones/views. Note that automated
   crawlers dominate raw clone counts; trust the skills.sh telemetry over clones
   for real adoption.
3. **Apify actor run volume** - watch for lift in paid actor runs (especially
   Societe.com for France, Handelsregister for Germany, CRBR/KRS for Poland,
   California SoS for US) that correlates with free-skill adoption. That lift is
   the cross-sell working.

## Content flywheel (Phase 3)

One article per free skill, reusing the existing Dev.to / Medium distribution.
Every article ends with the install command and a cross-sell CTA to the paid actors.

| # | Working title | Skill | Cross-sell CTA |
|---|---|---|---|
| 1 | Look up any UK company from Claude, for free (Companies House + PSC) | `companies-house-uk` | "No free API for PL/DE/ES/FR? Use the regdata actors" |
| 2 | Resolve any company to its global LEI (and its parent) with one skill | `gleif-lei-lookup` | "Then pull beneficial owners with CRBR/RPVS" |
| 3 | Free Norwegian company + bankruptcy checks in your agent (brreg) | `norway-company-registry` | "Cross-border? The regdata suite covers 16 jurisdictions" |
| 4 | Search every French company by SIREN or director, free (api.gouv.fr) | `france-company-lookup` | "Financials + shareholders: Societe.com actor" |
| 5 | Pull SEC filings and XBRL financials from Claude (EDGAR, no key) | `sec-edgar-us` | "Private US companies: California SoS actor" |
| 6 | Free sanctions screening against OFAC/EU/UK/UN lists in your agent | `sanctions-pep-screening` | "Screen the UBOs you extracted from registries" |

Each article: the problem, the 5-minute setup, a working example, the honest limits
of the free source, and the paid upsell for where it stops. Titles double as
search-landing pages ("free [country] company lookup API"), matching how buyers
search.
