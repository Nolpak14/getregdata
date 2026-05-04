# getregdata - European Government Registry APIs

14 pay-per-use actors covering official business registries across Poland, Spain, Austria, and France. No subscriptions, no minimum commitment. Structured JSON output.

```bash
# Install Claude Code skills
npx skills add Nolpak14/getregdata -g -y
```

---

## Why this exists

European government registries are public but have no APIs. Poland's KRS returns `"L******"` instead of real board member names in its official JSON endpoint. Spain's BORME sits behind an F5/Volterra WAF that blocks all datacenter IPs. Austria's Ediktsdatei insolvency register requires an IWG government license and digital identity to access programmatically. France's company data lives across three separate official sources that must be joined manually.

These actors handle all of that so you don't have to.

---

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
| [KNF Registry Scraper](https://apify.com/regdata/knf-registry-scraper) | KNF | 75,000+ payment institutions, e-money issuers, lending companies | $0.003 |
| [MSiG Court Gazette Scraper](https://apify.com/regdata/msig-scraper) | MSiG | Bankruptcy declarations, restructuring, liquidation notices (2001-present) | $0.004 |
| [KRS Board Members Scraper](https://apify.com/regdata/krs-fullnames-scraper) | KRS | Full, non-anonymized board member names (bypasses the official JSON censorship) | $0.008 |
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
