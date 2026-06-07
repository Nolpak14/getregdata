# getregdata - European Regulatory Research Skills for AI Agents

Installable agent skills - packaged, repeatable **workflows** - for KYC/AML, credit-risk, due-diligence and B2B research over European public business data. Each skill turns official public business registries into a process your agent can run on demand. Built on [Apify](https://console.apify.com/sign-up?ref=getregdata) actors for reliable, scalable access.

## Install

```bash
# Install Claude Code skills
npx skills add Nolpak14/getregdata -g -y
```

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
    run_input={"searchQueries": [{"nip": "5252002340"}]}
)
items = client.dataset(run["defaultDatasetId"]).list_items().items
for item in items:
    for owner in item.get("beneficialOwners", []):
        print(f"{item['company']['name']}: {owner['fullName']} ({owner['ownershipPercentage']})")
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

Get your API token: [Apify Console](https://console.apify.com/sign-up?ref=getregdata) - new accounts include $5 free credits.

More examples: [examples/python/](examples/python/) | [examples/javascript/](examples/javascript/)

---

## Claude Code Skills

Six skills that let Claude Code (and Copilot, Cline, Cursor, Codex) interact with all 14 actors:

| Skill | Use Case |
|---|---|
| `regdata` | Router - identifies your need and recommends the right skill |
| `regdata-kyc-aml` | KYC/AML compliance, entity verification, beneficial owners |
| `regdata-credit-risk` | Insolvency monitoring, credit risk, financial analysis |
| `regdata-property` | Property due diligence, ownership verification, mortgages |
| `regdata-compliance` | Consumer protection audits, ESG/environmental compliance |
| `regdata-lead-gen` | B2B prospecting, decision-maker discovery, market research |

Then in Claude Code: *"Run a KYC check on Polish company NIP 5213103635"* - the skill handles the rest.

---

## Actor Catalog

### Poland (9 actors)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [KNF Registry Scraper](https://apify.com/regdata/knf-registry-scraper) | KNF | Licensed payment, e-money and lending institutions | $0.003 |
| [MSiG Court Gazette Scraper](https://apify.com/regdata/msig-scraper) | MSiG | Bankruptcy, restructuring and liquidation notices | $0.004 |
| [KRS Board Members Scraper](https://apify.com/regdata/krs-fullnames-scraper) | KRS | Board members and shareholders (structured, GDPR-compliant) | $0.008 |
| [KRZ Debtor Registry Scraper](https://apify.com/regdata/krz-debtor-scraper) | KRZ | Bankruptcy, restructuring, enforcement proceedings | $0.006 |
| [eKRS Financial Scraper](https://apify.com/regdata/ekrs-financial-scraper) | eKRS | Financial statements - balance sheets, P&L, assets | $0.008 |
| [EKW Land Registry Scraper](https://apify.com/regdata/ekw-ksiegi-wieczyste-scraper) | EKW | Property ownership, mortgages and easements | $0.01 |
| [UOKiK Clauses Scraper](https://apify.com/regdata/uokik-clauses-scraper) | UOKiK | Court-ruled prohibited contract clauses | $0.003 |
| [CRBR Beneficial Owners Scraper](https://apify.com/regdata/crbr-beneficial-owners-scraper) | CRBR | Beneficial owners (UBO) for KYC/AML | $0.008 |
| [BDO Waste Registry Scraper](https://apify.com/regdata/bdo-waste-registry-scraper) | BDO | Waste-management entity registration verification | $0.004 |

### Spain (2 actors)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [BORME Corporate Acts Scraper](https://apify.com/regdata/borme-corporate-acts-scraper) | BORME | Incorporations, officer appointments, capital changes, dissolutions | $0.003 |
| [Spain Company Directory Scraper](https://apify.com/regdata/spain-company-directory-scraper) | Registro Mercantil | NIF, officers, CNAE codes, legal form, IRUS, EUID | $0.005 |

### Austria (2 actors)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [Ediktsdatei Insolvency Scraper](https://apify.com/regdata/austria-ediktsdatei-scraper) | Ediktsdatei | Austrian insolvency publications | $0.005 |
| [WKO Business Directory Scraper](https://apify.com/regdata/wko-business-directory-scraper) | WKO | Austrian businesses with contact details and trade licenses | $0.003 |

### France (1 actor)

| Actor | Registry | What You Get | Cost/Result |
|---|---|---|---|
| [Societe.com Company Scraper](https://apify.com/regdata/societe-com-scraper) | Societe.com | SIREN, directors, financials, shareholders, subsidiaries, director networks | $0.005 |

---

## Pricing

| Plan | Credits included | Typical coverage |
|---|---|---|
| Free | $5/month | 600-1,600 checks depending on actor |
| Starter ($49/mo) | $49 platform credits | ~6,000-16,000 checks |
| Scale ($499/mo) | $499 platform credits | ~60,000+ checks |

All actors are pay-per-result. No per-actor subscription. Unused credits roll over.

---

## Authentication

```bash
# Set token in environment
export APIFY_TOKEN=apify_api_xxxxx

# Or pass directly
client = ApifyClient("apify_api_xxxxx")
```

Get your token: [Apify Console > Settings > Integrations](https://console.apify.com/sign-up?ref=getregdata)

---

## All actors

[apify.com/regdata](https://apify.com/regdata)

## License

MIT
