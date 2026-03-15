# Log Query

Displays the latest automation log entries from the database.

## Language Variants

This script is available in two languages:

- **JavaScript** (Node.js): `main.js`
- **C#** (.NET): `csharp/Program.cs`

### Run (Node.js)

```bash
node main.js [limit]
```

### Run (C#)

```bash
dotnet run --project csharp/ [limit]
```

## Output

JSON array of log entries, most recent first. Each entry contains:
- `id`, `timestamp`, `script`, `level`, `message`, `details`

Default: last 20 entries. Pass a number as the first argument to override.

## Audit Documentation

For formal DORA-compliant documentation, see [DOKUMENTATION.md](DOKUMENTATION.md).
