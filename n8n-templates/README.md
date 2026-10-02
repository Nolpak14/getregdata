# n8n workflow templates

Ready-made [n8n](https://n8n.io) workflows built on official company registers. Each one runs a getregdata actor on Apify through the official Apify community node (`@apify/n8n-nodes-apify`).

| Template | What it does | Actors used | n8n gallery |
|---|---|---|---|
| [Polish counterparty insolvency watchlist](polish-counterparty-insolvency-watchlist.json) | Every Monday, checks a list of Polish companies (NIP or KRS) against the insolvency register and the court gazette, and e-mails you only new entries. | [KRZ debtor registry](https://apify.com/regdata/krz-debtor-scraper?fpr=getregdata), [MSiG court gazette](https://apify.com/regdata/msig-scraper?fpr=getregdata) | [open in gallery](https://n8n.io/workflows/19939-monitor-polish-counterparties-for-insolvency-with-apify-google-sheets-and-gmail/) |
| [New Spanish companies to Google Sheets](spain-borme-new-companies-to-sheets.json) | Every weekday, adds the previous day's new company registrations from BORME to a sheet, filtered by province, with a summary e-mail. | [BORME corporate acts](https://apify.com/regdata/borme-corporate-acts-scraper?fpr=getregdata) | [open in gallery](https://n8n.io/workflows/20169-log-new-spanish-companies-from-borme-to-google-sheets-with-apify-and-gmail/) |
| [German supplier check](german-supplier-check-handelsregister.json) | A form: enter a company name, get its register court, number and status from the Handelsregister, logged to a sheet. | [Handelsregister](https://apify.com/regdata/germany-handelsregister-scraper?fpr=getregdata) | [open in gallery](https://n8n.io/workflows/20043-check-german-suppliers-in-the-handelsregister-with-apify-and-google-sheets/) |
| [KYB research agent (Poland, Germany)](kyb-research-agent-poland-germany.json) | A chat agent that checks a Polish or German company on request and says which register each fact came from. | [Poland KYB check](https://apify.com/regdata/poland-kyb-check?fpr=getregdata), KRZ, Handelsregister | - |

All our published templates: [n8n.io/creators/getregdata](https://n8n.io/creators/getregdata/).

## Use one

1. In n8n, install the community node **@apify/n8n-nodes-apify** (Settings → Community nodes).
2. Download the JSON file and import it (Workflows → Import from file).
3. Add your credentials where the workflow asks: an Apify API token, and Google Sheets / Gmail where used. The yellow sticky note in each workflow lists the setup steps.
4. Run it once by hand, then turn on the schedule.

Each run is billed on Apify per result or per search, as shown on the actor's page. Every Apify node carries a "maximum cost per run" cap you can adjust.

The KYB agent uses the Apify node as an AI tool, which needs `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` on your n8n instance.

Prefer the data delivered as a file instead of running a workflow? See [getregdata.com/managed-feeds](https://getregdata.com/managed-feeds/).
