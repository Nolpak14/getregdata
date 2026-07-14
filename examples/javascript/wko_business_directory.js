/**
 * WKO Business Directory Scraper - Austrian Chamber of Commerce
 * Actor: https://apify.com/regdata/wko-business-directory-scraper
 *
 * 620,000+ Austrian businesses with phone, email, website, industry
 * classification, and trade licenses. Official Chamber of Commerce data.
 * No proxy required - works on Apify free tier.
 *
 * Cost: $0.005/result + $0.005 start fee
 * Free tier: $5 = ~1,000 business records
 */

import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'YOUR_APIFY_TOKEN' });

// Search Austrian businesses by industry keyword
const run = await client.actor('regdata/wko-business-directory-scraper').call({
    searchQuery: 'softwareentwicklung',  // Software development companies
    maxResults: 50,
    // Memory: 512MB recommended for this actor (WebForms site needs headroom)
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`Found ${items.length} Austrian businesses\n`);

// Filter to companies with email addresses (most valuable for outreach)
const withEmail = items.filter(item => item.email);
console.log(`With email: ${withEmail.length}/${items.length}\n`);

// Format for CRM import
const crmRows = withEmail.map(item => ({
    companyName: item.companyName,
    email: item.email,
    phone: item.phone,
    website: item.website,
    city: item.city,
    state: item.bundesland,
    industry: item.industry,
    sourceUrl: item.url,
}));

console.log('Sample records:');
crmRows.slice(0, 3).forEach(row => {
    console.log(`  ${row.companyName} | ${row.email} | ${row.city}`);
});

// Export as CSV
import { writeFileSync } from 'fs';
const csv = [
    Object.keys(crmRows[0]).join(','),
    ...crmRows.map(row => Object.values(row).map(v => `"${v || ''}"`).join(','))
].join('\n');
writeFileSync('austrian_software_companies.csv', csv);
console.log('\nExported to austrian_software_companies.csv');
