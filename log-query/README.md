# Log Query

Displays the latest automation log entries from the database.

## Output

JSON array of log entries, most recent first. Each entry contains:
- `id`, `timestamp`, `script`, `status`, `message`, `metadata`

## Usage

Run from script_runner. Defaults to the last 20 entries.
