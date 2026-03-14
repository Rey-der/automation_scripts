# Invoice Query

Displays stored invoices from the database.

## Filters

Set environment variables before running to filter results:
- `VENDOR` — filter by vendor name (e.g. `VENDOR=Amazon`)
- `FROM` + `TO` — filter by date range (e.g. `FROM=2026-01-01 TO=2026-12-31`)

Without filters, all invoices are returned.

## Output

JSON array of invoice records: `id`, `vendor`, `amount`, `invoice_date`, `file_path`, `processing_timestamp`.
