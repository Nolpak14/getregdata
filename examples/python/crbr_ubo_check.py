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

APIFY_TOKEN = "YOUR_APIFY_TOKEN"  # https://console.apify.com/sign-up?ref=getregdata

client = ApifyClient(APIFY_TOKEN)

# Search by NIP (Polish tax ID) or KRS number
run = client.actor("regdata/crbr-beneficial-owners-scraper").call(
    run_input={
        "searchQueries": [
            {"nip": "5252002340"},   # Single NIP lookup
            {"nip": "5213103635"},
            {"krs": "0000016702"},   # Or by KRS number
        ],
        "proxyConfiguration": {"useApifyProxy": False},  # No proxy needed for CRBR
    }
)

items = client.dataset(run["defaultDatasetId"]).list_items().items

for item in items:
    company = item.get("company", {})
    owners = item.get("beneficialOwners", [])

    print(f"\n{company.get('name')} (NIP: {company.get('nip')})")
    print(f"  Status: {company.get('declarationStatus')}")

    if not owners:
        print("  No beneficial owners found (may not be registered)")
        continue

    for owner in owners:
        print(f"  Owner: {owner['fullName']}")
        print(f"    Citizenship: {owner.get('citizenship')}")
        print(f"    Ownership: {owner.get('ownershipPercentage')}")
        print(f"    Control type: {owner.get('controlNature')}")
