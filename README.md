# getregdata - Business Registry Research Skills for AI Agents

[![Skills](https://img.shields.io/badge/skills-30-blue)](#claude-code-skills)
[![Actors](https://img.shields.io/badge/actors-25%2B-green)](#actor-catalog)
[![Jurisdictions](https://img.shields.io/badge/jurisdictions-11-orange)](#actor-catalog)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)
[![Install](https://img.shields.io/badge/install-npx%20skills%20add-black)](#install)

Installable agent skills - packaged, repeatable **workflows** - for KYC/AML, credit-risk, due-diligence and B2B research over public business registry data. 25+ actors across 11 jurisdictions - Poland, Spain, Austria, Germany, France, Italy, Belgium, Czechia, Slovakia, the US (California) and the UAE - plus cross-border adverse-media screening. Each skill turns official public registries into a process your agent can run on demand. Built on [Apify](https://apify.com/regdata?fpr=getregdata) actors for reliable, scalable access.

## Install

**As Claude Code / agent skills:**
```bash
npx skills add Nolpak14/getregdata -g -y
```

**As a local MCP server** (Claude Desktop, Claude Code, Cursor, Cline, Windsurf - all 25+ registries as tools, with full input schemas):
```json
{ "mcpServers": { "getregdata": { "command": "npx", "args": ["-y", "getregdata-mcp"], "env": { "APIFY_TOKEN": "apify_api_xxxxx" } } } }
```

**As a hosted MCP server - no install** (claude.ai web, ChatGPT developer mode, Gemini, any remote MCP client): connect Apify's hosted MCP endpoint with OAuth, preloaded with regdata registry tools:
```
https://mcp.apify.com/?actors=regdata/crbr-beneficial-owners-scraper,regdata/krz-debtor-scraper,regdata/germany-handelsregister-scraper,regdata/poland-krs-financial-scraper,regdata/adverse-media-screener
```
Swap in any of the [25+ regdata actors](https://apify.com/regdata?fpr=getregdata) - or use plain `https://mcp.apify.com` and let the agent discover them with `search-actors`. Billing goes to your own Apify account either way.

See [`mcp/`](mcp/) for the server, tool list, and per-client config.

---

## Why this exists

European business registries are public, but they are fragmented and rarely offer a clean API: data is spread across separate portals and formats, returned as PDFs or partial fields, and often has to be joined by hand across several official sources. These skills - and the actors behind them - give you consistent, structured access, and package the common jobs (KYC checks, insolvency monitoring, due diligence, lead generation) into workflows your agent can run end to end.

---

## Workflows you can build

These skills are designed to be wired into recurring processes, not one-off lookups:

- **KYC / onboarding check** (`regdata-kyc-aml`) - resolve a company's beneficial
  owners and verify licensing as a repeatable onboarding step.
- **Insolvency & credit-risk watchlist** (`regdata-credit-risk`) - monitor counterparties
  for bankruptcy, restructuring and enforcement proceedings on a schedule (add Austria
  for cross-border coverage).
- **New-incorporation lead feed** (`regdata-lead-gen`) - a daily feed of newly
  registered companies and officer changes for B2B prospecting.
- **Property due-diligence check** (`regdata-property`) - verify ownership and mortgages
  as a standard pre-deal check.
- **Contract / ESG compliance audit** (`regdata-compliance`) - screen terms against
  prohibited clauses and verify environmental registrations.

Each skill ships the analysis framework and checklists; you supply the trigger
(a cron, an inbound lead, an onboarding event) and the agent runs the workflow.

## Quick Start

**Python**
```python
from apify_client import ApifyClient

client = ApifyClient("YOUR_APIFY_TOKEN")

# Check beneficial owners for a Polish company (CRBR)
run = client.actor("regdata/crbr-beneficial-owners-scraper").call(
    run_input={"nip": "6770065406"}   # Comarch S.A.; batch via "queries": [{"nip": ...}]
)
items = client.dataset(run["defaultDatasetId"]).list_items().items
for item in items:
    for owner in item.get("beneficialOwners", []):
        name = f"{owner.get('firstName','')} {owner.get('lastName','')}".strip()
        control = (owner.get("entitlements") or [{}])[0].get("natureOfControl", "")
        print(f"{item.get('name')}: {name} - {control}")
```

**JavaScript**
```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'YOUR_APIFY_TOKEN' });

// Check if an Austrian company is insolvent (Ediktsdatei)
const run = await client.actor('regdata/austria-ediktsdatei-scraper').call({
    searchQuery: 'Alpenbau GmbH',
    maxResults: 10
});
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(`Found ${items.length} insolvency records`);
items.forEach(item => console.log(`${item.debtorName} - ${item.proceedingType}`));
```

Get your API token: [Apify Console](https://apify.com/regdata?fpr=getregdata) - new accounts include $5 free credits.

One prompt in your agent - *"Run a KYC check on NIP 6770065406"* - and the `regdata-kyc-aml` skill resolves the company's beneficial owners, scores the ownership, and flags anything for enhanced due diligence.

More examples: [examples/python/](examples/python/) | [examples/javascript/](examples/javascript/)

---

## Claude Code Skills

Thirty skills that let Claude Code (and Copilot, Cline, Cursor, Codex) interact with all 25+ actors - plus free public-API lookups that need no Apify token.

**Workflow skills** (the compliance/research frameworks, backed by the paid actors):

| Skill | Use Case |
|---|---|
| `regdata` | Router - identifies your need and recommends the right skill |
| `regdata-kyc-aml` | KYC/AML/KYB compliance, entity verification, beneficial owners |
| `regdata-credit-risk` | Insolvency monitoring, credit risk, financial analysis |
| `regdata-property` | Property due diligence, ownership verification, mortgages |
| `regdata-compliance` | Consumer protection audits, ESG/environmental compliance |
| `regdata-lead-gen` | B2B prospecting, decision-maker discovery, market research |

**Free registry skills** (query official public APIs directly - no Apify token, no per-result cost):

| Skill | Source | What You Get (free) |
|---|---|---|
| `companies-house-uk` | UK Companies House API | Company profile, officers, PSC (beneficial owners), filings |
| `sec-edgar-us` | US SEC EDGAR | Filings, submissions, XBRL financials for SEC-registered issuers |
| `norway-company-registry` | Brønnøysundregistrene (data.brreg.no) | Norwegian companies, roles/board, bankruptcy flag |
| `france-company-lookup` | api.gouv.fr (INSEE/INPI) | French companies by name/SIREN/director, identity + dirigeants |
| `switzerland-zefix` | Zefix (Swiss federal index) | Swiss companies, UID/CHE number, status, SHAB publications |
| `denmark-cvr` | CVR (Erhvervsstyrelsen) | Danish companies, CVR number, industry, management |
| `finland-company-registry` | PRH open data | Finnish companies by name/Y-tunnus, forms, NACE, addresses |
| `australia-abn-lookup` | ABN Lookup (ABR) | Australian entities by ABN/ACN/name, status, GST |
| `japan-company-registry` | gBizINFO | Japanese companies by name/corporate number, plus subsidies/procurement |
| `new-zealand-nzbn` | NZBN API | New Zealand entities by NZBN/name, roles, industry |
| `ireland-cro` | CRO Open Services | Irish companies, status, filings (free key + CC-BY bulk) |
| `greece-gemi` | GEMI OpenData API | Greek companies by name/GEMI number/AFM |
| `croatia-sudreg` | Sudski registar OPEN API | Croatian companies by OIB/MBS (OAuth, free registration) |
| `latvia-company-registry` | data.gov.lv | Latvian companies, officers, and open beneficial owners (UBO) |
| `lithuania-company-registry` | Registru centras (Spinta) | Lithuanian companies by name/code, mgmt, financials |
| `israel-companies-registry` | data.gov.il | Israeli companies by name/number, status, purpose |
| `brazil-cnpj` | BrasilAPI (Receita Federal) | Brazilian companies by CNPJ, incl. QSA partner list |
| `south-korea-dart` | DART (FSS) | Korean listed-company profiles and financial statements |
| `singapore-acra` | data.gov.sg | Singapore entities by name/UEN (identity) |
| `gleif-lei-lookup` | GLEIF API | Global LEI, local registry ID, parent/child corporate structure |
| `vies-vat-validation` | EU VIES + EOS | Validate any EU VAT (and EORI) number + consultation number |
| `sanctions-pep-screening` | OFAC / EU / UK / UN lists | Sanctions and PEP screening for a name or entity |
| `sam-gov-exclusions` | SAM.gov | US federal debarment / exclusions screening |
| `us-court-records` | CourtListener | US litigation / court-record search (adverse-history DD) |

The free skills are the front door - they answer the easy lookups for free and drive adoption; the paid actors are the upsell for jurisdictions with no free API (Poland, Germany, Spain, Italy, ...) and for depth the free sources do not provide (beneficial owners, financials, insolvency, court filings).

Then in Claude Code: *"Run a KYC check on Polish company NIP 6770065406"* or *"Look up UK company 00445790"* - the skill handles the rest.

---

## Actor Catalog

25+ actors across 11 jurisdictions. Per-result pricing is shown on each actor's Apify Store page - see [Pricing](#pricing) below.

### Poland (12 actors)

| Actor | Registry | What You Get |
|---|---|---|
| [KRS Financial Statements Scraper](https://apify.com/regdata/poland-krs-financial-scraper?fpr=getregdata) | eKRS | Financial statements - balance sheets, P&L, assets |
| [EKW Land Registry Scraper](https://apify.com/regdata/ekw-ksiegi-wieczyste-scraper?fpr=getregdata) | EKW | Property ownership, mortgages and easements |
| [CRBR Beneficial Owners Scraper](https://apify.com/regdata/crbr-beneficial-owners-scraper?fpr=getregdata) | CRBR | Beneficial owners (UBO) for KYC/AML |
| [KRZ Debtor Registry Scraper](https://apify.com/regdata/krz-debtor-scraper?fpr=getregdata) | KRZ | Bankruptcy, restructuring, enforcement proceedings |
| [KRS Board Members Scraper](https://apify.com/regdata/krs-fullnames-scraper?fpr=getregdata) | KRS | Board members and shareholders (structured, GDPR-compliant) |
| [KNF Registry Scraper](https://apify.com/regdata/knf-registry-scraper?fpr=getregdata) | KNF | Licensed payment, e-money and lending institutions |
| [MSiG Court Gazette Scraper](https://apify.com/regdata/msig-scraper?fpr=getregdata) | MSiG | Bankruptcy, restructuring and liquidation notices |
| [UOKiK Clauses Scraper](https://apify.com/regdata/uokik-clauses-scraper?fpr=getregdata) | UOKiK | Court-ruled prohibited contract clauses |
| [BDO Waste Registry Scraper](https://apify.com/regdata/bdo-waste-registry-scraper?fpr=getregdata) | BDO | Waste-management entity registration verification |
| [REGON Company Scraper](https://apify.com/regdata/polish-regon-scraper?fpr=getregdata) | GUS REGON | Official company master data - no API key needed |
| [Premises Prospector](https://apify.com/regdata/polish-premises-prospector?fpr=getregdata) | GUS REGON | Site-level / local-unit (jednostki lokalne) records for prospecting |
| [Parliamentary PEP Scraper](https://apify.com/regdata/poland-parliamentary-pep-scraper?fpr=getregdata) | Sejm | Politically-exposed persons (PEP) for KYC/AML screening |

### Spain (3 actors)

| Actor | Registry | What You Get |
|---|---|---|
| [BORME Corporate Acts Scraper](https://apify.com/regdata/borme-corporate-acts-scraper?fpr=getregdata) | BORME | Incorporations, officer appointments, capital changes, dissolutions |
| [Spain Company Directory Scraper](https://apify.com/regdata/spain-company-directory-scraper?fpr=getregdata) | Registro Mercantil | NIF, officers, CNAE codes, legal form, IRUS, EUID |
| [Registro Publico Concursal Scraper](https://apify.com/regdata/spain-concursal-scraper?fpr=getregdata) | Registro Publico Concursal | Insolvency parties and their roles (debtor, administrator, disqualified) |

### Austria (2 actors)

| Actor | Registry | What You Get |
|---|---|---|
| [Ediktsdatei Insolvency Scraper](https://apify.com/regdata/austria-ediktsdatei-scraper?fpr=getregdata) | Ediktsdatei | Austrian insolvency and court publications |
| [WKO Business Directory Scraper](https://apify.com/regdata/wko-business-directory-scraper?fpr=getregdata) | WKO | Austrian businesses with contact details and trade licenses |

### Germany (2 actors)

| Actor | Registry | What You Get |
|---|---|---|
| [Handelsregister Scraper](https://apify.com/regdata/germany-handelsregister-scraper?fpr=getregdata) | Handelsregister | Company KYB - registered details, officers, capital |
| [Insolvency Register Search](https://apify.com/regdata/germany-insolvency-scraper?fpr=getregdata) | Insolvenzbekanntmachungen | German insolvency announcements by company and date |

### France (1 actor)

| Actor | Registry | What You Get |
|---|---|---|
| [Societe.com Company Scraper](https://apify.com/regdata/societe-com-scraper?fpr=getregdata) | Societe.com | SIREN, directors, financials, shareholders, subsidiaries, director networks |

### Italy (2 actors)

| Actor | Registry | What You Get |
|---|---|---|
| [Registro Imprese Scraper](https://apify.com/regdata/italy-registro-imprese-scraper?fpr=getregdata) | Registro Imprese | Full company profile by name or P.IVA (VAT), incl. PEC |
| [PEC Lookup](https://apify.com/regdata/italy-pec-lookup?fpr=getregdata) | INI-PEC | Certified email (PEC) and SDI code by VAT - bulk lookup |

### Belgium (1 actor)

| Actor | Registry | What You Get |
|---|---|---|
| [KBO/BCE Company Scraper](https://apify.com/regdata/belgium-kbo-company-scraper?fpr=getregdata) | KBO/BCE | Company data, directors and VAT |

### Czechia (1 actor)

| Actor | Registry | What You Get |
|---|---|---|
| [ISIR Insolvency Register Search](https://apify.com/regdata/czech-isir-insolvency-scraper?fpr=getregdata) | ISIR | Czech insolvency register - debtor, case, court |

### Slovakia (1 actor)

| Actor | Registry | What You Get |
|---|---|---|
| [RPVS Beneficial Owners Scraper](https://apify.com/regdata/slovakia-rpvs-ubo-scraper?fpr=getregdata) | RPVS | Beneficial owners (UBO) with PEP flag - "the CRBR of Slovakia" |

### United States (2 actors)

| Actor | Registry | What You Get |
|---|---|---|
| [California SoS Business Scraper](https://apify.com/regdata/california-sos-business-scraper?fpr=getregdata) | California SoS | Business entity status and registered agent |
| [California UCC Lien Search](https://apify.com/regdata/california-ucc-lien-scraper?fpr=getregdata) | California UCC | UCC liens - debtors and secured parties |

### UAE (1 actor)

| Actor | Registry | What You Get |
|---|---|---|
| [ADGM Public Register Scraper](https://apify.com/regdata/uae-adgm-public-register-scraper?fpr=getregdata) | ADGM | Abu Dhabi Global Market company data |

### Cross-border (1 actor)

| Actor | Source | What You Get |
|---|---|---|
| [Adverse Media Screener](https://apify.com/regdata/adverse-media-screener?fpr=getregdata) | News / web | KYC/AML adverse-media (negative news) check for a name or company |

---

## Pricing

| Plan | Credits included | Typical coverage |
|---|---|---|
| Free | $5/month | 600-1,600 checks depending on actor |
| Starter ($49/mo) | $49 platform credits | ~6,000-16,000 checks |
| Scale ($499/mo) | $499 platform credits | ~60,000+ checks |

All actors are pay-per-result (from ~$0.003/result depending on actor and tier). No per-actor subscription. Unused credits roll over. Each actor's Apify Store page shows its current per-result price.

---

## Authentication

```bash
# Set token in environment
export APIFY_TOKEN=apify_api_xxxxx

# Or pass directly
client = ApifyClient("apify_api_xxxxx")
```

Get your token: [Apify Console > Settings > Integrations](https://apify.com/regdata?fpr=getregdata)

---

## All actors

[apify.com/regdata](https://apify.com/regdata?fpr=getregdata)

## License

MIT
