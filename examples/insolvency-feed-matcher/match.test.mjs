import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeId, idVariants, splitCsvLine, buildIndex, matchRecord, readFeed } from './match.mjs';

const rec = (country, registryId, extra = {}) => ({ recordId: 'x', country, registryId, companyName: 'ACME', ...extra });

test('normalizeId and idVariants: spacing, country prefix, leading zeros', () => {
    assert.equal(normalizeId(' 526-025-09-95 '), '5260250995');
    assert.deepEqual(idVariants('PL 526-025-09-95').sort(), ['5260250995', 'PL5260250995']);
    assert.deepEqual(idVariants('0000123456').sort(), ['0000123456', '123456']);
    assert.deepEqual(idVariants(''), []);
    // A foreign-looking prefix is kept when the country says otherwise.
    assert.deepEqual(idVariants('SC123456', 'GB'), ['SC123456']);
});

test('splitCsvLine: commas, semicolons, quotes', () => {
    assert.deepEqual(splitCsvLine('a, b ,c'), ['a', 'b', 'c']);
    assert.deepEqual(splitCsvLine('a;b;c'), ['a', 'b', 'c']);
    assert.deepEqual(splitCsvLine('"Smith, Jones Ltd",123'), ['Smith, Jones Ltd', '123']);
});

test('a plain list of numbers matches in any country', () => {
    const { index, entries } = buildIndex('5260250995\n# comment\n\n0447.103.385\n');
    assert.equal(entries, 2);
    assert.equal(matchRecord(rec('PL', '5260250995'), index).length, 1);
    assert.equal(matchRecord(rec('BE', '0447103385'), index).length, 1);
    assert.equal(matchRecord(rec('BE', '0999999999'), index).length, 0);
    assert.equal(matchRecord(rec('BE', null), index).length, 0);
});

test('a CSV with country, several id columns and a ref', () => {
    const csv = 'ref,country,nip,krs\ncust-1,PL,PL5260250995,123456\ncust-2,FR,,\ncust-3,BE,,\n';
    const { index, entries } = buildIndex(`${csv}`.replace('cust-3,BE,,', 'cust-3,be,447103385,'));
    assert.equal(entries, 2);
    assert.deepEqual(matchRecord(rec('PL', '5260250995'), index).map((h) => h.ref), ['cust-1']);
    assert.deepEqual(matchRecord(rec('PL', '0000123456'), index).map((h) => h.ref), ['cust-1']);
    assert.deepEqual(matchRecord(rec('BE', '0447103385'), index).map((h) => h.ref), ['cust-3']);
    // The same digits in another country are a different company.
    assert.equal(matchRecord(rec('CZ', '5260250995'), index).length, 0);
});

test('readFeed follows the cursor until hasMore is false and sends the key', async () => {
    const calls = [];
    const pages = { 0: { records: [rec('PL', '1')], nextCursor: 5, hasMore: true }, 5: { records: [rec('PL', '2')], nextCursor: 9, hasMore: false } };
    const fetchImpl = async (url, init) => {
        calls.push([url.searchParams.get('since'), url.searchParams.get('countries'), init.headers.Authorization]);
        return { ok: true, json: async () => pages[url.searchParams.get('since')] };
    };
    const got = [];
    for await (const p of readFeed({ base: 'https://api.test', key: 'k', since: 0, countries: 'PL', fetchImpl })) got.push(p);
    assert.deepEqual(got.map((p) => p.nextCursor), [5, 9]);
    assert.deepEqual(calls, [['0', 'PL', 'Bearer k'], ['5', 'PL', 'Bearer k']]);
    await assert.rejects(async () => { for await (const _ of readFeed({ base: 'https://api.test', key: 'k', since: 0, fetchImpl: async () => ({ ok: false, status: 403 }) })); }, /HTTP 403/);
});
