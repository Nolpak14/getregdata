"""
CRBR Beneficial Owners Scraper - UBO check for Polish companies
Actor: https://apify.com/regdata/crbr-beneficial-owners-scraper

CRBR (Central Register of Beneficial Owners) is Poland's mandatory UBO register.
Every Polish company must register its natural-person beneficial owners (>25% ownership
or control). Required for AML/KYC compliance under AMLD5/6AMLD.

Cost: $0.008 per result + $0.025 actor start fee
Free tier: $5 credits = ~600 UBO checks
"""

from apify_client import ApifyClient

APIFY_TOKEN = "YOUR_APIFY_TOKEN"  # https://apify.com/regdata?fpr=getregdata

client = ApifyClient(APIFY_TOKEN)

# Single query: use the top-level "nip", "krs", or "companyName" field.
# Batch: use "queries" - a list of {"nip"|"krs"|"name"|"pesel"} objects.
run = client.actor("regdata/crbr-beneficial-owners-scraper").call(
    run_input={
        "queries": [
            {"nip": "6770065406"},   # Comarch S.A.
            {"krs": "0000006865"},   # Or by KRS number (CD Projekt S.A.)
        ],
    }
)

items = client.dataset(run["defaultDatasetId"]).list_items().items

for item in items:
    # Entities with no CRBR filing come back with found=false + a message.
    if item.get("found") is False or item.get("message"):
        print(f"\n{item.get('searchInput')}: no CRBR entry")
        continue

    owners = item.get("beneficialOwners", [])
    print(f"\n{item.get('name')} (NIP: {item.get('nip')}, KRS: {item.get('krs')})")

    if not owners:
        print("  No beneficial owners registered")
        continue

    for owner in owners:
        full_name = " ".join(
            p for p in (owner.get("firstName"), owner.get("secondName"), owner.get("lastName")) if p
        )
        controls = "; ".join(e.get("natureOfControl", "") for e in owner.get("entitlements", []))
        print(f"  UBO: {full_name} ({owner.get('citizenship')})")
        print(f"    Control: {controls}")
