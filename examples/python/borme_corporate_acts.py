"""
BORME Corporate Acts Scraper - Spain's official corporate registry gazette
Actor: https://apify.com/regdata/borme-corporate-acts-scraper

BORME (Boletin Oficial del Registro Mercantil) publishes 500+ corporate acts
daily: incorporations, officer appointments/dismissals, capital changes,
dissolutions. Required for Spanish corporate monitoring and due diligence.

Note: Requires Apify residential proxy (paid plan). Spain's BORME sits behind
an F5/Volterra WAF that blocks datacenter IPs.

Cost: $0.003 per act + $0.025 actor start fee
"""

from apify_client import ApifyClient
from datetime import datetime, timedelta

APIFY_TOKEN = "YOUR_APIFY_TOKEN"

client = ApifyClient(APIFY_TOKEN)

# Fetch all corporate acts for the past week
end_date = datetime.today()
start_date = end_date - timedelta(days=7)

run = client.actor("regdata/borme-corporate-acts-scraper").call(
    run_input={
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
        "documentType": "Todos",  # All act types
        "companyName": "",        # Leave empty for all companies
        "proxy": {
            "useApifyProxy": True,
            "apifyProxyGroups": ["RESIDENTIAL"],
        },
    }
)

items = client.dataset(run["defaultDatasetId"]).list_items().items
print(f"Retrieved {len(items)} corporate acts\n")

# Group by act type
from collections import Counter
act_types = Counter(item.get("documentType", "Unknown") for item in items)
print("Acts by type:")
for act_type, count in act_types.most_common():
    print(f"  {act_type}: {count}")

print("\nSample acts:")
for item in items[:5]:
    print(f"  {item.get('companyName')} - {item.get('documentType')} ({item.get('publicationDate')})")
