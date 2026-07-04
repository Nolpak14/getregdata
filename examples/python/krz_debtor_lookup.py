"""
KRZ Debtor Registry Scraper - Polish insolvency and enforcement check
Actor: https://apify.com/regdata/krz-debtor-scraper

KRZ (National Debtor Registry) covers bankruptcy, restructuring, and enforcement
proceedings for Polish companies and individuals. Updated daily by courts.

Used for: credit risk screening, debt collection prep, due diligence
Cost: ~$0.025 per result on the free tier (lower on paid plans)
Free tier: $5 credits = ~200 results

Note: KRZ runs ONE search per run (searchMode + entityName or identifier) - there is
no multi-query batch field. Loop over the entities you want to check. Searching by
name can match similarly-named entities; pass a NIP/KRS via `identifier` for a precise hit.
"""

from apify_client import ApifyClient

APIFY_TOKEN = "YOUR_APIFY_TOKEN"  # https://console.apify.com/sign-up?ref=getregdata

client = ApifyClient(APIFY_TOKEN)

# Check several companies (by name here; use `identifier` with a NIP/KRS for precision)
companies_to_check = ["Getin", "Budimex"]

all_hits = []
for name in companies_to_check:
    run = client.actor("regdata/krz-debtor-scraper").call(
        run_input={
            "searchMode": "entity",   # companies by name/KRS/NIP
            "entityName": name,        # or use "identifier": "<NIP or KRS>"
            "maxResults": 50,
        }
    )
    all_hits += client.dataset(run["defaultDatasetId"]).list_items().items

print(f"Found {len(all_hits)} proceeding record(s)\n")

for item in all_hits:
    who = item.get("entityName") or f"{item.get('firstName', '')} {item.get('lastName', '')}".strip()
    print(f"FLAGGED: {who} (NIP: {item.get('nip')}, KRS: {item.get('krs')})")
    print(f"  Proceeding: {item.get('proceedingType')} - {item.get('proceedingStatus')}")
    print(f"  Court: {item.get('court')} | Case: {item.get('caseSignature')}")
