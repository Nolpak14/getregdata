#!/usr/bin/env node
// Match the GetRegData insolvency feed against your own customer list - on your machine.
//
// The feed carries every new company insolvency notice for the countries on your key. This script
// downloads it, compares it with a list that never leaves your computer, writes the matches and
// throws the rest away. GetRegData never receives your list and cannot tell which records matched.
//
//   GRD_API_KEY=grd_live_... node match.mjs --list customers.csv
//   node match.mjs --list customers.csv --file feed-2026-11-24.jsonl     (a daily file you downloaded)
//
// Node 18 or newer, no dependencies. Options: see README.md or run with --help.

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const HELP = `Usage: node match.mjs --list <file> [options]

  --list <file>       Your list: one company number per line, or a CSV with a header row.
                      Recognised columns: id (or registryId, nip, krs, number), country (optional),
                      ref (optional - your own customer reference, copied to each match).
  --file <file>       Match a downloaded feed file (JSON Lines) instead of calling the API.
  --countries FR,PL   Only these countries (default: every country on the key).
  --out <file>        Where matches are appended (default: matches.jsonl).
  --state <file>      Where the feed position is remembered (default: .feed-cursor.json).
  --since <cursor>    Start from this feed position instead of the remembered one (0 = beginning).
  --base <url>        API address (default: https://api.getregdata.com).

The API key is read from the GRD_API_KEY environment variable.`;

/** A company number reduced to what can be compared: upper case, letters and digits only. */
export function normalizeId(value) {
    return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Every spelling of a number that should count as the same company: as written, without a
 * leading country prefix ("PL5260250995", "BE0447103385"), and without leading zeros (a KRS or
 * KBO number is often typed without them).
 */
export function idVariants(value, country = null) {
    const base = normalizeId(value);
    if (!base) return [];
    const out = new Set([base]);
    const prefix = /^([A-Z]{2})(\d.*)$/.exec(base);
    if (prefix && (!country || prefix[1] === country)) out.add(prefix[2]);
    for (const v of [...out]) {
        const trimmed = v.replace(/^0+(?=.)/, '');
        if (trimmed) out.add(trimmed);
    }
    return [...out];
}

/** One line of a simple CSV: commas or semicolons, optional double quotes. */
export function splitCsvLine(line) {
    const sep = line.includes(';') && !line.includes(',') ? ';' : ',';
    const cells = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (quoted) {
            if (ch === '"' && line[i + 1] === '"') { cur += '"'; i += 1; } else if (ch === '"') quoted = false; else cur += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === sep) { cells.push(cur); cur = ''; } else cur += ch;
    }
    cells.push(cur);
    return cells.map((c) => c.trim());
}

const ID_COLUMNS = ['id', 'registryid', 'registry_id', 'nip', 'krs', 'number', 'companynumber', 'company_number'];

/**
 * Read the customer list into a lookup: key -> [{ ref, country }]. A key is "<variant>" for an
 * entry without a country and "<COUNTRY>:<variant>" for an entry with one.
 */
export function buildIndex(text) {
    const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
    const index = new Map();
    if (!lines.length) return { index, entries: 0 };
    const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, ''));
    const idCols = header.map((h, i) => (ID_COLUMNS.includes(h) ? i : -1)).filter((i) => i >= 0);
    const hasHeader = idCols.length > 0;
    const countryCol = hasHeader ? header.indexOf('country') : -1;
    const refCol = hasHeader ? header.indexOf('ref') : -1;
    let entries = 0;
    for (const line of hasHeader ? lines.slice(1) : lines) {
        const cells = splitCsvLine(line);
        const country = countryCol >= 0 ? normalizeId(cells[countryCol]).slice(0, 2) || null : null;
        const ids = hasHeader ? idCols.map((i) => cells[i]) : [cells[0]];
        const ref = refCol >= 0 ? cells[refCol] || null : null;
        const entry = { ref, country }; // one object per list line, so a line is counted once per record
        let used = false;
        for (const id of ids) {
            for (const variant of idVariants(id, country)) {
                const key = country ? `${country}:${variant}` : variant;
                if (!index.has(key)) index.set(key, []);
                if (!index.get(key).includes(entry)) index.get(key).push(entry);
                used = true;
            }
        }
        if (used) entries += 1;
    }
    return { index, entries };
}

/** The list entries a feed record matches, or an empty array. */
export function matchRecord(record, index) {
    if (!record?.registryId) return [];
    const country = normalizeId(record.country).slice(0, 2);
    const hits = new Set();
    for (const variant of idVariants(record.registryId, country)) {
        for (const key of [`${country}:${variant}`, variant]) {
            for (const entry of index.get(key) ?? []) hits.add(entry);
        }
    }
    return [...hits];
}

/** Pages of feed records from the API, starting at `since`. Yields { records, nextCursor }. */
export async function* readFeed({ base, key, since, countries, fetchImpl = fetch }) {
    let cursor = since;
    for (;;) {
        const url = new URL('/v1/feeds/insolvency', base);
        url.searchParams.set('since', String(cursor));
        url.searchParams.set('limit', '1000');
        if (countries) url.searchParams.set('countries', countries);
        const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(60000) });
        if (!res.ok) throw new Error(`The feed answered HTTP ${res.status}. Check the key and the countries on it.`);
        const body = await res.json();
        yield { records: body.records ?? [], nextCursor: body.nextCursor ?? cursor };
        if (!body.hasMore || body.nextCursor === cursor) return;
        cursor = body.nextCursor;
    }
}

function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i += 1) {
        const a = argv[i];
        if (a === '--help' || a === '-h') args.help = true;
        else if (a.startsWith('--')) { args[a.slice(2)] = argv[i + 1]; i += 1; }
    }
    return args;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.list) { console.log(HELP); process.exit(args.help ? 0 : 1); }
    const out = args.out ?? 'matches.jsonl';
    const stateFile = args.state ?? '.feed-cursor.json';
    const { index, entries } = buildIndex(readFileSync(args.list, 'utf8'));
    if (!entries) throw new Error(`No company numbers found in ${args.list}.`);

    let seen = 0;
    let matched = 0;
    const handle = (record) => {
        seen += 1;
        const hits = matchRecord(record, index);
        if (!hits.length) return; // not on your list: never written anywhere
        matched += 1;
        appendFileSync(out, `${JSON.stringify({ matchedRefs: [...new Set(hits.map((h) => h.ref).filter(Boolean))], ...record })}\n`);
    };

    if (args.file) {
        for (const line of readFileSync(args.file, 'utf8').split(/\r?\n/)) if (line.trim()) handle(JSON.parse(line));
    } else {
        const key = process.env.GRD_API_KEY;
        if (!key) throw new Error('Set the GRD_API_KEY environment variable to your GetRegData API key.');
        const saved = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : {};
        const since = args.since != null ? Number(args.since) : saved.cursor ?? 0;
        const base = args.base ?? 'https://api.getregdata.com';
        for await (const page of readFeed({ base, key, since, countries: args.countries })) {
            page.records.forEach(handle);
            // Saved after each page, so an interrupted run continues where it stopped.
            writeFileSync(stateFile, `${JSON.stringify({ cursor: page.nextCursor, updatedAt: new Date().toISOString() })}\n`);
        }
    }
    console.log(`${entries} companies on your list, ${seen} feed records read, ${matched} matched${matched ? ` -> ${out}` : ''}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((err) => { console.error(err.message); process.exit(1); });
}
