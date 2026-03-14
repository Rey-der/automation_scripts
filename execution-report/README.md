# Execution Report

Displays recent script executions with duration and status.

## Output

JSON array of execution records:
- `id`, `script`, `start_time`, `end_time`
- `status` — SUCCESS or FAIL (null if still running)
- `error_message` — error details if failed
- `duration_seconds` — computed runtime in seconds (null if not finished)

## Usage

Run from script_runner. Defaults to the last 20 executions.
