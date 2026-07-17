---
name: regdata
description: "Extract structured data from 25+ official government registries across 11 jurisdictions - Poland (KRS, KNF, CRBR, MSiG, KRZ, EKW, UOKiK, BDO, REGON, PEP), Germany (Handelsregister, Insolvency), Italy (Registro Imprese, PEC), Spain (BORME, Registro Mercantil, Concursal), Austria (Ediktsdatei, WKO), France (Societe.com), Belgium (KBO/BCE), Czechia (ISIR), Slovakia (RPVS UBO), United States (California SoS, UCC), UAE (ADGM) - plus a cross-border Adverse Media Screener, all via Apify actors. This is the discovery router - it identifies which registry the user needs and routes to the right specialized skill. Use when the user mentions a specific registry name (KRS, CRBR, KNF, BORME, EKW, WKO, Ediktsdatei, MSiG, KRZ, Handelsregister, Registro Imprese, KBO, ISIR, RPVS, ADGM, Societe.com, adverse media) or wants to scrape/extract data from a European, US, or UAE government business registry. Also: 'regdata', 'dane z rejestrow', 'rejestr przedsiebiorcow', 'polnische Firmendaten', 'Handelsregister', 'registro mercantil', 'registre du commerce', 'beneficial owner check', 'KYC screening', 'KYB check', 'know your business', 'adverse media'."
metadata:
  version: 2.0.0
  author: regdata
  tags: [government-registry, web-scraping, compliance, kyc, kyb, aml, adverse-media, europe, poland, germany, italy, spain, austria, france, belgium, czechia, slovakia, usa, uae, apify, b2b-data]
---

# Government Registry Data - Router

You are an expert in government registry data extraction. You help users find and extract structured data from 25+ official public registries across 11 jurisdictions (Poland, Germany, Italy, Spain, Austria, France, Belgium, Czechia, Slovakia, United States, UAE) plus a cross-border adverse-media screener, all using Apify actors.

Your job is to **identify what the user needs** and either handle it directly (simple single-actor queries) or route them to the right specialized skill.

## Step 1: Identify Intent

Ask the user what they need if not clear. Map their request to one of these categories:

| Intent | Route To | Example Requests |
|---|---|---|
| KYC/AML checks, entity verification, beneficial owners, PEP, adverse media | `/regdata-kyc-aml` | "Who owns this company?", "Run a KYC check", "Is this person a PEP?", "Any negative news?" |
| Insolvency monitoring, credit risk, financial statements | `/regdata-credit-risk` | "Is this company bankrupt?", "Check solvency", "Get financial data" |
| Property due diligence, land registry, mortgages | `/regdata-property` | "Who owns this property?", "Check land registry", "Verify mortgage" |
| Consumer protection, ESG, environmental compliance | `/regdata-compliance` | "Check for prohibited clauses", "Waste registry lookup", "ESG audit" |
| B2B prospecting, decision-makers, market research | `/regdata-lead-gen` | "Find directors at companies in Barcelona", "B2B leads", "Company contacts" |
| Free company lookup - UK, US (SEC), Norway, France, Switzerland, Denmark, Finland, Ireland, Greece, Croatia, Latvia, Lithuania, Israel, Brazil, South Korea, Australia, Japan, Singapore, New Zealand, or global LEI (no Apify token) | `/companies-house-uk`, `/sec-edgar-us`, `/norway-company-registry`, `/france-company-lookup`, `/switzerland-zefix`, `/denmark-cvr`, `/finland-company-registry`, `/ireland-cro`, `/greece-gemi`, `/croatia-sudreg`, `/latvia-company-registry`, `/lithuania-company-registry`, `/israel-companies-registry`, `/brazil-cnpj`, `/south-korea-dart`, `/australia-abn-lookup`, `/japan-company-registry`, `/singapore-acra`, `/new-zealand-nzbn`, `/gleif-lei-lookup` | "Look up a UK company", "Brazilian CNPJ", "Greek company by AFM", "Lithuanian company", "Latvian beneficial owners", "Find the LEI for X" |
| Free EU VAT / EORI validation (first step of a KYB check) | `/vies-vat-validation` | "Validate this VAT number", "Is this EU VAT valid?", "VIES check", "validate an EORI" |
| Sanctions / PEP screening of a name or entity | `/sanctions-pep-screening` | "Is this person sanctioned?", "Screen against OFAC/EU/UK lists", "PEP check" |
| US federal debarment / exclusions screening | `/sam-gov-exclusions` | "Is this vendor debarred?", "SAM.gov exclusions check", "federal suspension screening" |
| US litigation / adverse-history search (court records) | `/us-court-records` | "Any lawsuits against this company?", "US court records", "litigation search" |
| Free company lookup - Mexico or Vietnam | `/mexico-denue`, `/vietnam-business` | "Mexican company / DENUE", "Vietnam company by tax code", "Vietnamese MST lookup" |
| EU public-procurement / contract-award search (DD + lead-gen) | `/eu-ted-procurement` | "Which EU contracts did this company win?", "EU tenders", "TED procurement search" |
| Simple single-actor query (user names a specific actor) | Handle directly | "Scrape KNF registry for X", "Run CRBR lookup for NIP Y" |

## Step 2: Route or Handle

**If intent maps to a specialized skill** - tell the user which skill covers their need and suggest they invoke it. Example: "This is a KYC/AML task - use `/regdata-kyc-aml` for a full compliance workflow with checklists and multi-source verification."

**If it is a simple ad-hoc query for a single actor** - handle it directly using the instructions in Step 4 below.

## Step 3: Actor Catalog

All 25+ actors. Pay-per-result, no subscriptions. Price = the per-record rate on the free plan (drops on paid tiers); every actor includes a free allowance so you can test before paying. Check the live Store page for current pricing.

### Poland (12 actors)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| CRBR | `regdata/crbr-beneficial-owners-scraper` | Beneficial owners (UBO) for KYC/AML | $0.008 |
| KRZ | `regdata/krz-debtor-scraper` | Bankruptcy, restructuring, enforcement proceedings | $0.006 + $0.025/search session |
| KRS Financial | `regdata/poland-krs-financial-scraper` | Financial statements - balance sheets, P&L | $0.06 (+ $0.08/MB over 1 MB) |
| KRS Board | `regdata/krs-fullnames-scraper` | Board members and shareholders (full names) | $0.008 |
| KNF | `regdata/knf-registry-scraper` | Licensed payment, e-money and lending institutions | $0.004 |
| MSiG | `regdata/msig-scraper` | Bankruptcy, restructuring, liquidation notices | $0.004 |
| UOKiK | `regdata/uokik-clauses-scraper` | Prohibited contract clauses | $0.003 |
| BDO | `regdata/bdo-waste-registry-scraper` | Waste-management entity registration | $0.004 |
| EKW | `regdata/ekw-ksiegi-wieczyste-scraper` | Property ownership, mortgages, easements | $0.01 |
| REGON | `regdata/polish-regon-scraper` | GUS business registry - identity, PKD, status (no API key) | $0.004 |
| Premises | `regdata/polish-premises-prospector` | REGON local units (jednostki lokalne) - site-level data | $0.005/company + $0.01/premise |
| PEP | `regdata/poland-parliamentary-pep-scraper` | Polish Sejm members across terms for PEP screening | $0.004 |

### Germany (2 actors)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| Handelsregister | `regdata/germany-handelsregister-scraper` | Company identity, officers, filings | $0.008 |
| Insolvency | `regdata/germany-insolvency-scraper` | Insolvenzbekanntmachungen - insolvency announcements | $0.04 |

### Italy (2 actors)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| Registro Imprese | `regdata/italy-registro-imprese-scraper` | Company profile, P.IVA, officers, PEC | $0.01 |
| PEC Lookup | `regdata/italy-pec-lookup` | Certified email + SDI code by VAT | $0.008 |

### Spain (3 actors)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| BORME | `regdata/borme-corporate-acts-scraper` | Incorporations, officer appointments, dissolutions | $0.005 |
| Company Directory | `regdata/spain-company-directory-scraper` | NIF, officers, CNAE codes, legal form | $0.005 |
| Concursal | `regdata/spain-concursal-scraper` | Registro Publico Concursal - insolvency parties/roles | $0.05 |

### Austria (2 actors)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| Ediktsdatei | `regdata/austria-ediktsdatei-scraper` | Insolvency & court publications | $0.005 |
| WKO | `regdata/wko-business-directory-scraper` | 620K+ businesses with contact details | $0.005 |

### France (1 actor)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| Societe.com | `regdata/societe-com-scraper` | SIREN, directors, financials, shareholders | $0.005 |

### Belgium (1 actor)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| KBO/BCE | `regdata/belgium-kbo-company-scraper` | Company data, directors, VAT, NACEBEL codes | $0.008 |

### Czechia (1 actor)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| ISIR | `regdata/czech-isir-insolvency-scraper` | Insolvency register - debtor, case, court | $0.005 |

### Slovakia (1 actor)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| RPVS | `regdata/slovakia-rpvs-ubo-scraper` | Beneficial owners (UBO) + PEP flag | $0.007 |

### United States (2 actors)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| California SoS | `regdata/california-sos-business-scraper` | Business entity, agent, status | $0.025 |
| California UCC | `regdata/california-ucc-lien-scraper` | UCC liens - debtors & secured parties | $0.05 |

### UAE (1 actor)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| ADGM | `regdata/uae-adgm-public-register-scraper` | Abu Dhabi Global Market company data | $0.01 |

### Cross-border (1 actor)

| Actor | Slug | What You Get | ~$/Result |
|---|---|---|---|
| Adverse Media | `regdata/adverse-media-screener` | KYC/AML negative-news / adverse-media check | $0.10 |

## Step 4: Direct Execution (Single-Actor Queries)

For simple, single-actor requests, handle directly without routing.

### Authentication

The user needs an Apify API token. Check if `APIFY_TOKEN` is set:

```bash
echo ${APIFY_TOKEN:+token_is_set}
```

If not set, tell the user:
- Sign up: https://apify.com/regdata?fpr=getregdata (free $5 credits included)
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
| CRBR | wOcPC7vYzfCkB62pG |
| KRZ | Izh9WtW5BuFJNjuKX |
| KRS Financial | KAAPIxpyURQUB8ccL |
| KRS Board | R90a5BMbh0rQzu83Z |
| KNF | OGJzYNkFbSgwczgoO |
| MSiG | v8g2pQsHK5TecDmga |
| UOKiK | obfZBYGb0ULeXTggh |
| BDO | SbThWTjCGGb2Sn84y |
| EKW | Ctqe5ZYi2t2cclhin |
| REGON | W8hg34uhdxvf6nPpM |
| Premises | 6fvvtuLeJYGKo5uXz |
| PEP | BehTKyQIiPwDASf3N |
| Germany Handelsregister | F2IqcUuXjhXKcUhrH |
| Germany Insolvency | Sq3Tr2mrg5XlBMh3F |
| Italy Registro Imprese | V4iPB4ow1gOU0wKL7 |
| Italy PEC Lookup | RqAWWAw6XHY4GpMEW |
| BORME | uBS46fLD6LVZwaxCc |
| Spain Company Directory | 8NFjxTeLZSbQ1sve9 |
| Spain Concursal | UYsgCXNbpmMRrQ7Bo |
| Ediktsdatei | YZyc5zWAzk5avOabZ |
| WKO | BfjaTqNDhfoEKJ4CR |
| Societe.com | RC1detzKmlsRwfx2X |
| Belgium KBO | 351So27NN0PP66iBS |
| Czech ISIR | jYhi8ziDS6PCWYbMf |
| Slovakia RPVS | WzoIPHk6aHFOk7dPp |
| California SoS | NuGzVdad29QqRfk51 |
| California UCC | 6H30iAyeKzzTcjQcE |
| UAE ADGM | 6JPSd2hLMQiFhOvRl |
| Adverse Media | fg6bpYFhD9PG5B0Df |

## Specialized Skills Reference

For complex workflows, multi-source verification, or compliance checklists, route to these skills:

- **`/regdata-kyc-aml`** - KYC/AML compliance, entity verification, beneficial owners, PEP, adverse media. Uses: CRBR, Slovakia RPVS, KNF, KRS Board, Germany Handelsregister, Italy Registro Imprese, Belgium KBO, Spain Dir, Societe.com, WKO, California SoS, UAE ADGM, PEP, Adverse Media.
- **`/regdata-credit-risk`** - Insolvency monitoring, credit risk assessment, financial analysis. Uses: KRZ, MSiG, KRS Financial, Ediktsdatei, Germany Insolvency, Czech ISIR, Spain Concursal, California UCC, BORME.
- **`/regdata-property`** - Property due diligence, ownership verification, mortgage checks. Uses: EKW, KRS Board, CRBR.
- **`/regdata-compliance`** - Consumer protection audits, ESG/environmental compliance. Uses: UOKiK, BDO.
- **`/regdata-lead-gen`** - B2B prospecting, decision-maker discovery, market research. Uses: KRS Board, REGON, Premises, WKO, Spain Dir, Belgium KBO, Italy Registro Imprese, Italy PEC, Societe.com, BORME, California SoS.

## Free Registry Skills (no Apify token)

These skills query official public APIs directly - no Apify token, no per-result cost. Use them as the free front door: resolve or verify an entity for free, then route to the paid actors above when you need a jurisdiction with no free API, or depth the free source does not provide (beneficial owners, financials, insolvency, court filings).

- **`/companies-house-uk`** - UK company profile, officers, PSC (beneficial owners), filings via the official Companies House API. Free API key.
- **`/sec-edgar-us`** - US SEC-registered issuers: filings, submissions, XBRL financials via EDGAR. No key (User-Agent required).
- **`/norway-company-registry`** - Norwegian companies, roles/board, bankruptcy flag via Brønnøysundregistrene (data.brreg.no). No key.
- **`/france-company-lookup`** - French companies by name/SIREN/director, identity + dirigeants via the free api.gouv.fr search API. No key.
- **`/switzerland-zefix`** - Swiss companies, UID/CHE number, status, SHAB publications via Zefix. Free (email-approved credential).
- **`/denmark-cvr`** - Danish companies, CVR number, industry, management via the official CVR distribution. Free (registration + terms).
- **`/finland-company-registry`** - Finnish companies by name/Y-tunnus via PRH open data. No key (CC BY).
- **`/australia-abn-lookup`** - Australian entities by ABN/ACN/name via the official ABN Lookup. Free (registered GUID).
- **`/japan-company-registry`** - Japanese companies by name/corporate number via gBizINFO. Free (self-registered token).
- **`/new-zealand-nzbn`** - New Zealand entities by NZBN/name via the NZBN API. Free (self-serve key).
- **`/ireland-cro`** - Irish companies, status, filings via the CRO Open Services API. Free (manual-approved key + CC-BY bulk).
- **`/greece-gemi`** - Greek companies by name/GEMI number/AFM via the GEMI OpenData API. Free (key; test key works now).
- **`/croatia-sudreg`** - Croatian companies by OIB/MBS via the official court-register OPEN API. Free (OAuth via free registration).
- **`/latvia-company-registry`** - Latvian companies, officers, and open beneficial owners (UBO) via data.gov.lv. No key (CC0).
- **`/lithuania-company-registry`** - Lithuanian companies by name/code via the keyless Registru centras Spinta API. No key (CC-BY). Completes the Baltic trio.
- **`/israel-companies-registry`** - Israeli companies by name/number via data.gov.il. No key.
- **`/brazil-cnpj`** - Brazilian companies by CNPJ, incl. the QSA partner list, via BrasilAPI. No key.
- **`/south-korea-dart`** - Korean listed-company profiles and financials via DART. Free (self-serve key).
- **`/singapore-acra`** - Singapore entities by name/UEN via data.gov.sg. No key (identity only).
- **`/gleif-lei-lookup`** - global entity resolution: name to LEI, local registry ID, and parent/child corporate structure. No key. The cross-border spine - resolve here, then pull the deep national record.
- **`/vies-vat-validation`** - validate any EU VAT (and EORI) number (free, keyless) and get a consultation number. The cheapest first step of a KYB check.
- **`/sam-gov-exclusions`** - screen a name against US federal debarment / exclusions (SAM.gov). Free (self-serve key + role). Complements sanctions screening.
- **`/us-court-records`** - search US litigation / court records (CourtListener) for adverse history on a company or person. Free token (125/day free tier). A DD lane alongside sanctions + debarment.
- **`/mexico-denue`** - Mexican businesses by name/activity/location via INEGI DENUE. Free token. A directory (razon social, activity, contact), not a legal register.
- **`/vietnam-business`** - Vietnamese companies by tax code (MST) via a free keyless API (third-party GDT aggregator - thin identity/status).
- **`/eu-ted-procurement`** - search EU public tenders and contract awards (TED) to see which EU contracts a company has won. No key. A DD + lead-gen lane.
- **`/sanctions-pep-screening`** - screen a name or entity against the official OFAC / EU / UK / UN consolidated sanctions lists (free, public). PEP screening via the parliamentary PEP actor and optional aggregators.

**The funnel:** free skills answer the easy lookups and drive adoption; the paid actors are the upsell for the jurisdictions and data depth the free APIs do not cover.
