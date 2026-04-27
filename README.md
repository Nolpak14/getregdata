# getregdata - European Government Registry Skills

Claude Code skills for extracting and analyzing data from 14 official government registries across Poland, Spain, Austria, and France. Built on [Apify](https://console.apify.com/sign-up?ref=getregdata) actors for reliable, scalable data extraction.

## Install

```bash
npx skills add Nolpak14/getregdata -g -y
```

## Skills

| Skill | Use Case | Actors Used |
|---|---|---|
| `regdata` | Router - identifies your need and recommends the right skill | All 14 |
| `regdata-kyc-aml` | KYC/AML compliance, entity verification, beneficial owners | CRBR, KNF, KRS Board, Societe.com, WKO, Spain Dir |
| `regdata-credit-risk` | Insolvency monitoring, credit risk assessment, financial analysis | KRZ, MSiG, Ediktsdatei, eKRS, BORME |
| `regdata-property` | Property due diligence, ownership verification, mortgages | EKW, KRS Board, CRBR |
| `regdata-compliance` | Consumer protection audits, ESG/environmental compliance | UOKiK, BDO |
| `regdata-lead-gen` | B2B prospecting, decision-maker discovery, market research | KRS Board, WKO, Spain Dir, Societe.com, BORME |

## Quick Start

1. Install the skills (see above)
2. In Claude Code, describe what you need:
   - "Run a KYC check on a Polish company with NIP 5213103635"
   - "Check if this Austrian company is insolvent"
   - "Find decision makers at Spanish companies in Barcelona"
   - "Verify property ownership in Polish land registry"
3. The skill provides analysis frameworks and compliance checklists
4. When you're ready to extract live data, you'll need an [Apify account](https://console.apify.com/sign-up?ref=getregdata) (free $5 credits included)

## Actor Catalog

All actors are pay-per-use with no subscriptions or minimum commitments.

### Poland (9 actors)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [KNF Registry Scraper](https://apify.com/regdata/knf-registry-scraper) | KNF | 75,000+ payment institutions, e-money issuers, lending companies | $0.003 |
| [MSiG Court Gazette Scraper](https://apify.com/regdata/msig-scraper) | MSiG | Bankruptcy declarations, restructuring, liquidation notices (2001-present) | $0.004 |
| [KRS Board Members Scraper](https://apify.com/regdata/krs-fullnames-scraper) | KRS | Full, non-anonymized board member names from PDF extracts | $0.008 |
| [KRZ Debtor Registry Scraper](https://apify.com/regdata/krz-debtor-scraper) | KRZ | Bankruptcy, restructuring, enforcement proceedings | $0.006 |
| [eKRS Financial Scraper](https://apify.com/regdata/ekrs-financial-scraper) | eKRS | Official financial statements - balance sheets, P&L, assets | $0.008 |
| [EKW Land Registry Scraper](https://apify.com/regdata/ekw-ksiegi-wieczyste-scraper) | EKW | Property ownership, mortgages, easements across 25M entries | $0.01 |
| [UOKiK Clauses Scraper](https://apify.com/regdata/uokik-clauses-scraper) | UOKiK | 7,500+ court-ruled prohibited contract clauses | $0.003 |
| [CRBR Beneficial Owners Scraper](https://apify.com/regdata/crbr-beneficial-owners-scraper) | CRBR | Ultimate beneficial owners for KYC/AML compliance | $0.008 |
| [BDO Waste Registry Scraper](https://apify.com/regdata/bdo-waste-registry-scraper) | BDO | 674,000+ waste management entities, registration verification | $0.004 |

### Spain (2 actors)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [BORME Corporate Acts Scraper](https://apify.com/regdata/borme-corporate-acts-scraper) | BORME | Incorporations, officer appointments, capital changes, dissolutions | $0.003 |
| [Spain Company Directory Scraper](https://apify.com/regdata/spain-company-directory-scraper) | Registro Mercantil | NIF, officers, CNAE codes, legal form, IRUS, EUID | $0.005 |

### Austria (2 actors)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [Ediktsdatei Insolvency Scraper](https://apify.com/regdata/austria-ediktsdatei-scraper) | Ediktsdatei | Austrian insolvency publications - no IWG license required | $0.005 |
| [WKO Business Directory Scraper](https://apify.com/regdata/wko-business-directory-scraper) | WKO | 620,000+ Austrian businesses with contact details and trade licenses | $0.003 |

### France (1 actor)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [Societe.com Company Scraper](https://apify.com/regdata/societe-com-scraper) | Societe.com | SIREN, directors, financials, shareholders, subsidiaries | $0.005 |

## Authentication

To extract live registry data, set your Apify API token:

```bash
export APIFY_TOKEN=apify_api_xxxxx
```

Get your token: [Apify Console > Settings > Integrations](https://console.apify.com/sign-up?ref=getregdata)

New accounts include $5 free credits - enough for 100-1,600 registry checks depending on the actor.

## License

MIT
