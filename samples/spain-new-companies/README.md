# New Spanish companies - sample dataset (BORME)

A one-day sample of companies newly incorporated in Spain, as published in the official gazette of the
commercial registry (Boletin Oficial del Registro Mercantil, BORME).

- **File:** [`spain-new-companies-sample-2026-09-17.csv`](spain-new-companies-sample-2026-09-17.csv) - 60 rows, UTF-8, comma-separated
- **Columns:** [`data-dictionary.csv`](data-dictionary.csv)
- **Issue date:** 17 September 2026
- **Scope:** company-level only. The file holds no directors, shareholders or other private individuals.

## What one row is

One company incorporation published in BORME on that day: legal name, province of the registering
Registro Mercantil, publication date, start of operations, corporate purpose (in Spanish, truncated to
400 characters in this sample), registered address, share capital in euros, the registry reference and
a link to the official BORME PDF the record comes from.

| Column | Meaning |
|---|---|
| `company_name` | Full legal name as published |
| `province` | Province of the Registro Mercantil that registered the company |
| `publication_date` | Date of the BORME issue |
| `start_of_operations` | Date the company began operating, as stated in the incorporation |
| `corporate_purpose` | Objeto social, as published |
| `registered_address` | Registered office as published |
| `share_capital_eur` | Share capital at incorporation |
| `registry_reference` | Seccion, hoja and inscripcion, for locating the entry in the register |
| `borme_entry_number` | Entry number within that day's BORME |
| `source_url` | The official BORME PDF |

On the two days measured (16 and 17 September 2026) BORME carried 313 and 425 new companies among
1,600+ published acts. This sample is 60 of them.

## Source and reuse

The source is BORME, published by the Agencia Estatal Boletin Oficial del Estado at
[boe.es](https://www.boe.es/diario_borme/). The data is reproduced as published and is not enriched or
corrected. Reuse of BOE content requires naming the source; this dataset is not an official publication
and is not endorsed by the Agencia Estatal BOE. Check every record against its `source_url` before
relying on it.

## Getting the full data

- **Self-serve:** the [BORME corporate acts actor](https://apify.com/regdata/borme-corporate-acts-scraper?fpr=getregdata)
  on Apify returns every act of any BORME issue (incorporations, capital changes, dissolutions), billed per result.
- **As a daily file:** [getregdata.com/managed-feeds/spain-new-companies/](https://getregdata.com/managed-feeds/spain-new-companies/) -
  new companies each business day by e-mail, filtered by province. A free one-day sample of your own filter is available on request.
