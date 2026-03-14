# Automation Scripts — Integration Guide

This folder contains all automation scripts designed to run inside
[script_runner](https://github.com/Rey-der/script_runner).
They read from and write to the **Smart Desktop SQL** database.

---

## Prerequisites

| Requirement | Details |
|---|---|
| **script_runner** | Cloned and working — see its own README |
| **Node.js** | v18+ (v20+ recommended for `better-sqlite3`) |
| **smart_desktop_sql** | Project set up with `npm install` completed and database initialised via the `db-setup` script |
| **SMART_DESKTOP_DB** | Environment variable pointing to the database file (absolute path) |

### Setting the environment variable

Add to `~/.zshrc` (or equivalent):

```bash
export SMART_DESKTOP_DB="/Users/<you>/path/to/smart_desktop_sql/data/smart_desktop.db"
```

Reload with `source ~/.zshrc`. Every script in this folder reads this variable to locate the database — no hardcoded paths.

---

## Folder Structure

Each script is a self-contained folder following the script_runner convention:

```
automation_scripts/
├── README.md              ← This file
├── log-query/             ← Query: latest automation log entries
│   ├── main.js
│   ├── config.json
│   └── README.md
├── invoice-query/         ← Query: stored invoices (filterable)
├── backup-query/          ← Query: backup history
├── error-report/          ← Query: recent errors
├── dashboard-summary/     ← Query: aggregated statistics
├── execution-report/      ← Query: script executions with duration
├── download-sorter/       ← Write: sorts Downloads folder → DB
├── invoice-scanner/       ← Write: scans PDF invoices → DB
└── backup-runner/         ← Write: copies folders → DB
```

### Required files per script

| File | Purpose |
|---|---|
| `main.js` (or `.py`, `.sh`) | Entry point — executed by script_runner |
| `config.json` | Metadata: `name`, `description`, `mainScript` |
| `README.md` | Human-readable description |

### config.json format

```json
{
  "name": "Human-Readable Name",
  "description": "One-line summary shown in the script_runner UI",
  "mainScript": "main.js"
}
```

---

## How Scripts Resolve the Database

Every script derives the **smart_desktop_sql project root** from the env var:

```js
const dbPath = process.env.SMART_DESKTOP_DB;
// dbPath = /…/smart_desktop_sql/data/smart_desktop.db
const projectRoot = path.dirname(path.dirname(dbPath));
// projectRoot = /…/smart_desktop_sql
```

Then requires models and utilities from the project:

```js
const automationLog = require(path.join(projectRoot, 'src', 'models', 'automationLog'));
const { printJSON }  = require(path.join(projectRoot, 'src', 'utils', 'output'));
const { closeDb }    = require(path.join(projectRoot, 'src', 'utils', 'db'));
```

This means **no npm dependencies are needed inside `automation_scripts/`** — everything resolves back to `smart_desktop_sql/node_modules/`.

---

## Integrating with script_runner

1. Copy (or symlink) the desired script folders into script_runner's `scripts/` directory.
2. Restart script_runner — it auto-discovers any folder containing a `config.json` + supported `main.*` file.
3. The scripts appear in the UI and can be run with one click.

### Symlink example

```bash
ln -s /path/to/automation_scripts/log-query /path/to/script_runner/scripts/log-query
```

Or copy the entire folder:

```bash
cp -r /path/to/automation_scripts/log-query /path/to/script_runner/scripts/
```

---

## Script Categories

### Query scripts (read-only)

Read from the database and output JSON to stdout. Safe to run at any time.

| Script | Output |
|---|---|
| `log-query` | Latest N automation log entries |
| `invoice-query` | Invoices (all, by vendor, or by date range) |
| `backup-query` | Backup history, newest first |
| `error-report` | Recent errors with stack traces |
| `dashboard-summary` | Aggregated daily stats |
| `execution-report` | Script executions with duration |

### Write scripts (automation)

Perform real work (file operations, scanning, backups) and persist results to the database.
Each write script:

- Wraps its work in **execution tracking** (start → run → finish)
- Logs every action to **automation_logs**
- Records errors to both **automation_logs** and the **errors** table
- Validates data with **zod** before writing to the DB
- Uses **parameterized queries** exclusively — no SQL string interpolation

| Script | What it does |
|---|---|
| `download-sorter` | Sorts files from ~/Downloads into categorised folders |
| `invoice-scanner` | Scans PDF invoices in a folder and extracts vendor/amount/date |
| `backup-runner` | Copies configured folders to a backup location |

---

## Security Notes

- All DB access uses parameterized queries (enforced by models in `smart_desktop_sql`)
- No secrets are stored in these scripts — the only config is the env var
- The database file is in `.gitignore` and never committed
- Write scripts validate inputs before any INSERT
