/**
 * Societe.com Company Scraper - French director network mapping
 * Actor: https://apify.com/regdata/societe-com-scraper
 *
 * Gets SIREN, directors with roles and cross-company positions, simplified
 * financials, shareholders, subsidiaries. Essential for French due diligence -
 * the official SIRENE/INPI APIs don't expose director networks.
 *
 * Note: Keyless - no proxy and no API key needed. Societe.com uses DataDome
 * anti-bot protection that blocks datacenter IPs, but the actor clears it for
 * you (that cost is baked into the per-result price).
 *
 * Cost: $0.005/company record + $0.025 start fee
 */

import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'YOUR_APIFY_TOKEN' });

// Look up French companies by SIREN or company name
const run = await client.actor('regdata/societe-com-scraper').call({
    searchType: 'siren',
    queries: [
        '830657001',   // SIREN numbers
        '524838522',
        '552032534',   // TotalEnergies
    ],
    includeDirectors: true,
    includeFinancials: true,
    maxResults: 3,
    // No proxy or API key needed - the actor handles anti-bot internally
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();

for (const company of items) {
    console.log(`\n${company.companyName} (SIREN: ${company.siren})`);
    console.log(`  Legal form: ${company.legalForm}`);
    console.log(`  Revenue: €${(company.financials?.revenue || 0).toLocaleString()}`);

    console.log('  Directors:');
    for (const director of company.directors || []) {
        console.log(`    ${director.name} - ${director.role}`);
        if (director.otherCompanies?.length > 0) {
            // Cross-company positions reveal hidden relationships
            console.log(`    Also directs ${director.otherCompanies.length} other companies`);
        }
    }

    console.log('  Shareholders:');
    for (const sh of company.shareholders || []) {
        console.log(`    ${sh.name}: ${sh.ownership}`);
    }
}

// Risk flag: directors connected to insolvent entities
const riskyDirectors = items.flatMap(c =>
    (c.directors || [])
        .filter(d => d.otherCompanies?.length > 3)
        .map(d => ({ company: c.companyName, director: d.name, connections: d.otherCompanies.length }))
);

if (riskyDirectors.length > 0) {
    console.log('\nDirectors with 4+ company connections (review recommended):');
    riskyDirectors.forEach(r =>
        console.log(`  ${r.director} at ${r.company} - ${r.connections} connections`)
    );
}
