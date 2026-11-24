# Insolvency feed matcher - monitor your customers without sending us a list

The [GetRegData insolvency feed](https://getregdata.com/insolvency-feed/) carries every new company
insolvency notice for the countries on your key. This script downloads the feed and compares it
with your customer list **on your own machine**. The list never leaves your computer, and
GetRegData cannot tell which records matched.

- Matches are appended to `matches.jsonl`.
- Records that are not on your list are discarded and never written anywhere.
- The feed contains companies only. Natural persons and sole traders are not published in it.

Node 18 or newer. No dependencies.

## Run it

```bash
export GRD_API_KEY=grd_live_...        # your feed key
node match.mjs --list customers.csv
```

The first run reads the feed from the beginning. The position is saved in `.feed-cursor.json`, so
each later run reads only what is new. Run it once a day from cron or a scheduler.

To match a daily file you downloaded yourself instead of calling the API:

```bash
node match.mjs --list customers.csv --file feed-2026-11-24.jsonl
```

## Your list

One company number per line:

```
5260250995
0447.103.385
```

Or a CSV with a header row. Recognised columns: `id` (also `registryId`, `nip`, `krs`, `number`),
`country` (optional, ISO code) and `ref` (optional, your own customer reference - it is copied to
each match as `matchedRefs`).

```csv
ref,country,nip,krs
cust-1,PL,5260250995,0000123456
cust-2,BE,0447103385,
```

Matching is exact, on the company number. Spaces, dots and dashes are ignored, and so are a
leading country prefix (`PL5260250995`) and leading zeros.

The feed gives one number per record, of the type the official source publishes (the
`registryIdType` field, for example `PL-KRS`, `PL-NIP`, `BE-KBO`, `SIREN`, `GB-CRN`). If a country
has more than one common number, put every number you hold for the customer in the list - for
Poland both the NIP and the KRS number.

## Options

| Option | Meaning |
|---|---|
| `--list <file>` | Your list (required). |
| `--file <file>` | Match a downloaded feed file (JSON Lines) instead of calling the API. |
| `--countries FR,PL` | Only these countries. Default: every country on the key. |
| `--out <file>` | Where matches are appended. Default `matches.jsonl`. |
| `--state <file>` | Where the feed position is remembered. Default `.feed-cursor.json`. |
| `--since <cursor>` | Start from this position instead of the remembered one (`0` = beginning). |

## n8n

The same matching as an n8n workflow: [insolvency-feed-local-matching.json](../../n8n-templates/insolvency-feed-local-matching.json).

## What GetRegData sees

Your key and the countries on it, as with any feed download. Not your list, not its size, and not
which records matched. Details: [what we see when you use the API](https://getregdata.com/privacy/#what-we-see).

## Tests

```bash
node --test match.test.mjs
```
