"""
KRZ Debtor Registry Scraper - Polish insolvency and enforcement check
Actor: https://apify.com/regdata/krz-debtor-scraper

KRZ (National Debtor Registry) covers bankruptcy, restructuring, and enforcement
proceedings for Polish companies and individuals. Updated daily by courts.

Used for: credit risk screening, debt collection prep, due diligence
Cost: $0.006 per result + $0.025 actor start fee
Free tier: $5 credits = ~800 checks
"""

from apify_client import ApifyClient

APIFY_TOKEN = "YOUR_APIFY_TOKEN"

client = ApifyClient(APIFY_TOKEN)

# Batch check multiple companies by NIP or name
companies_to_check = [
    {"nip": "5252002340"},
    {"nip": "7792308903"},
    {"name": "Budimex SA"},  # Name search also supported
]

run = client.actor("regdata/krz-debtor-scraper").call(
    run_input={
        "searchQueries": companies_to_check,
        "maxResults": 50,  # Per query
    }
)

items = client.dataset(run["defaultDatasetId"]).list_items().items

# Flag companies with active proceedings
risky = [i for i in items if i.get("proceedings")]
clean = [i for i in items if not i.get("proceedings")]

print(f"Checked {len(items)} companies")
print(f"Clean: {len(clean)} | Flagged: {len(risky)}\n")

for item in risky:
    print(f"FLAGGED: {item.get('debtorName')} (NIP: {item.get('nip')})")
    for p in item.get("proceedings", []):
        print(f"  Type: {p.get('type')}")
        print(f"  Court: {p.get('court')}")
        print(f"  Filed: {p.get('filingDate')}")
        print(f"  Status: {p.get('status')}")
