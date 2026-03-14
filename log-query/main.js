/**
 * log-query — Displays the latest automation log entries.
 *
 * Outputs JSON to stdout for script_runner display.
 * Default: last 20 entries. Pass a number as first arg to override.
 */

const path = require('path');

const dbPath = process.env.SMART_DESKTOP_DB;
if (!dbPath) {
  console.error('ERROR: SMART_DESKTOP_DB environment variable is not set.');
  process.exit(1);
}

const projectRoot = path.dirname(path.dirname(dbPath));
const automationLog = require(path.join(projectRoot, 'src', 'models', 'automationLog'));
const { printJSON } = require(path.join(projectRoot, 'src', 'utils', 'output'));
const { closeDb } = require(path.join(projectRoot, 'src', 'utils', 'db'));

try {
  const limit = parseInt(process.argv[2], 10) || 20;
  const rows = automationLog.getRecent(limit);

  if (rows.length === 0) {
    console.log('No automation log entries found.');
  } else {
    console.log(`Last ${rows.length} automation log entries:\n`);
    printJSON(rows);
  }
} finally {
  closeDb();
}
