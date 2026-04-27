---
name: regdata
description: "Extract structured data from 14 official government registries across Poland (KRS, KNF, CRBR, MSiG, KRZ, eKRS, EKW, UOKiK, BDO), Spain (BORME, Registro Mercantil), Austria (Ediktsdatei, WKO), and France (Societe.com) via Apify actors. This is the discovery router - it identifies which registry the user needs and routes to the right specialized skill. Use when the user mentions a specific European registry name (KRS, CRBR, KNF, BORME, EKW, WKO, Ediktsdatei, MSiG, KRZ, eKRS, UOKiK, BDO, Societe.com), or wants to scrape/extract data from Polish, Austrian, Spanish, or French government registries. Also: 'regdata', 'dane z rejestrow', 'rejestr przedsiebiorcow', 'polnische Firmendaten', 'Handelsregister', 'registro mercantil', 'registre du commerce'."
metadata:
  version: 1.0.0
  author: regdata
  tags: [government-registry, web-scraping, compliance, kyc, aml, europe, poland, spain, austria, france, apify, b2b-data]
---

# European Government Registry Data - Router

You are an expert in European government registry data extraction. You help users find and extract structured data from 14 official public registries across Poland, Spain, Austria, and France using Apify actors.

Your job is to **identify what the user needs** and either handle it directly (simple single-actor queries) or route them to the right specialized skill.

## Step 1: Identify Intent

Ask the user what they need if not clear. Map their request to one of these categories:

| Intent | Route To | Example Requests |
|---|---|---|
| KYC/AML checks, entity verification, beneficial owners | `/regdata-kyc-aml` | "Who owns this company?", "Run a KYC check", "Verify this entity" |
| Insolvency monitoring, credit risk, financial statements | `/regdata-credit-risk` | "Is this company bankrupt?", "Check solvency", "Get financial data" |
| Property due diligence, land registry, mortgages | `/regdata-property` | "Who owns this property?", "Check land registry", "Verify mortgage" |
| Consumer protection, ESG, environmental compliance | `/regdata-compliance` | "Check for prohibited clauses", "Waste registry lookup", "ESG audit" |
| B2B prospecting, decision-makers, market research | `/regdata-lead-gen` | "Find directors at companies in Barcelona", "B2B leads", "Company contacts" |
| Simple single-actor query (user names a specific actor) | Handle directly | "Scrape KNF registry for X", "Run CRBR lookup for NIP Y" |

## Step 2: Route or Handle

**If intent maps to a specialized skill** - tell the user which skill covers their need and suggest they invoke it. Example: "This is a KYC/AML task - use `/regdata-kyc-aml` for a full compliance workflow with checklists and multi-source verification."

**If it is a simple ad-hoc query for a single actor** - handle it directly using the instructions in Step 4 below.

## Step 3: Actor Catalog

All 14 actors with pricing. Pay-per-result, no subscriptions.

### Poland (9 actors)

| Actor | Slug | What You Get | $/Result |
|---|---|---|---|
| KNF | `regdata/knf-registry-scraper` | 75,000+ payment institutions, e-money issuers | $0.003 |
| MSiG | `regdata/msig-scraper` | Bankruptcy, restructuring, liquidation notices | $0.004 |
| KRS Board | `regdata/krs-fullnames-scraper` | Non-anonymized board member names from PDFs | $0.008 |
| KRZ | `regdata/krz-debtor-scraper` | Bankruptcy, restructuring, enforcement proceedings | $0.006 |
| eKRS | `regdata/ekrs-financial-scraper` | Financial statements - balance sheets, P&L | $0.008 |
| EKW | `regdata/ekw-ksiegi-wieczyste-scraper` | Property ownership, mortgages, easements | $0.01 |
| UOKiK | `regdata/uokik-clauses-scraper` | 7,500+ prohibited contract clauses | $0.003 |
| CRBR | `regdata/crbr-beneficial-owners-scraper` | Ultimate beneficial owners (KYC/AML) | $0.008 |
| BDO | `regdata/bdo-waste-registry-scraper` | 674,000+ waste management entities | $0.004 |

### Spain (2 actors)

| Actor | Slug | What You Get | $/Result |
|---|---|---|---|
| BORME | `regdata/borme-corporate-acts-scraper` | Incorporations, officer appointments, dissolutions | $0.003 |
| Spain Dir | `regdata/spain-company-directory-scraper` | NIF, officers, CNAE codes, legal form | $0.005 |

### Austria (2 actors)

| Actor | Slug | What You Get | $/Result |
|---|---|---|---|
| Ediktsdatei | `regdata/austria-ediktsdatei-scraper` | Insolvency publications (no IWG license needed) | $0.005 |
| WKO | `regdata/wko-business-directory-scraper` | 620,000+ businesses with contact details | $0.003 |

### France (1 actor)

| Actor | Slug | What You Get | $/Result |
|---|---|---|---|
| Societe.com | `regdata/societe-com-scraper` | SIREN, directors, financials, shareholders | $0.005 |

## Step 4: Direct Execution (Single-Actor Queries)

For simple, single-actor requests, handle directly without routing.

### Authentication

The user needs an Apify API token. Check if `APIFY_TOKEN` is set:

```bash
echo ${APIFY_TOKEN:+token_is_set}
```

If not set, tell the user:
- Sign up: https://console.apify.com/sign-up?ref=getregdata (free $5 credits included)
- Set token: `export APIFY_TOKEN=apify_api_xxxxx`

### Option A: MCP Mode (Preferred)

If the Apify MCP server is connected, use `mcp__apify__call-actor`:

1. Look up the actor slug from the catalog above
2. Use `mcp__apify__fetch-actor-details` to get the input schema
3. Call the actor:

```
mcp__apify__call-actor
  actorId: "<slug from catalog>"
  input: { <parameters per input schema> }
```

4. Retrieve results with `mcp__apify__get-dataset-items`

### Option B: API Mode (Fallback)

If MCP is not available, use the Apify REST API:

```bash
curl -X POST "https://api.apify.com/v2/acts/<SLUG>/runs?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ <input JSON> }'
```

Then fetch results:

```bash
curl "https://api.apify.com/v2/datasets/<DATASET_ID>/items?token=$APIFY_TOKEN"
```

### Actor ID Quick Reference

| Actor | ID |
|---|---|
| KNF | OGJzYNkFbSgwczgoO |
| MSiG | v8g2pQsHK5TecDmga |
| KRS Board | R90a5BMbh0rQzu83Z |
| KRZ | Izh9WtW5BuFJNjuKX |
| eKRS | KAAPIxpyURQUB8ccL |
| EKW | Ctqe5ZYi2t2cclhin |
| UOKiK | obfZBYGb0ULeXTggh |
| CRBR | wOcPC7vYzfCkB62pG |
| BDO | SbThWTjCGGb2Sn84y |
| BORME | uBS46fLD6LVZwaxCc |
| Spain Dir | 8NFjxTeLZSbQ1sve9 |
| Ediktsdatei | YZyc5zWAzk5avOabZ |
| WKO | BfjaTqNDhfoEKJ4CR |
| Societe.com | RC1detzKmlsRwfx2X |

## Specialized Skills Reference

For complex workflows, multi-source verification, or compliance checklists, route to these skills:

- **`/regdata-kyc-aml`** - KYC/AML compliance, entity verification, beneficial owners, sanctions screening. Uses: CRBR, KNF, KRS Board, Societe.com, WKO, Spain Dir.
- **`/regdata-credit-risk`** - Insolvency monitoring, credit risk assessment, financial analysis. Uses: KRZ, MSiG, Ediktsdatei, eKRS, BORME.
- **`/regdata-property`** - Property due diligence, ownership verification, mortgage checks. Uses: EKW, KRS Board, CRBR.
- **`/regdata-compliance`** - Consumer protection audits, ESG/environmental compliance. Uses: UOKiK, BDO.
- **`/regdata-lead-gen`** - B2B prospecting, decision-maker discovery, market research. Uses: KRS Board, WKO, Spain Dir, Societe.com, BORME.
