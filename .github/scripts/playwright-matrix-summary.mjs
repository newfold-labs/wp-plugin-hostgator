/**
 * Aggregates Playwright matrix artifacts into one GitHub job summary.
 * Env: GITHUB_STEP_SUMMARY, PLAYWRIGHT_MATRIX_RESULTS_DIR
 */
import { appendFile, readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { stripVTControlCharacters } from 'node:util';

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
const resultsDir = process.env.PLAYWRIGHT_MATRIX_RESULTS_DIR || 'matrix-results';

const md = (s) => String(s ?? '')
  .replaceAll('|', '\\|')
  .replaceAll('\n', ' ');

/**
 * @param {string} s
 */
function cleanErrorText(s) {
  if (s == null) return '';
  let t = stripVTControlCharacters(String(s));
  t = t.replace(/\uFFFD/g, '');
  t = t.replace(/\[[\d;]+m/g, '');
  return t.replace(/\s+/g, ' ').trim();
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function listSubDirectories(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * @param {string} startDir
 * @returns {Promise<string | null>}
 */
async function findPlaywrightJson(startDir) {
  const entries = await readdir(startDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(startDir, entry.name);
    if (entry.isFile() && entry.name === 'github-summary-source.json') {
      return fullPath;
    }
    if (entry.isDirectory()) {
      const nested = await findPlaywrightJson(fullPath);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * @param {string} artifactName
 */
function parseEnvFromArtifactName(artifactName) {
  const match = artifactName.match(/^playwright-report-wp(.+)-php(.+)$/);
  if (!match) {
    return { wp: 'unknown', php: 'unknown' };
  }
  return { wp: match[1], php: match[2] };
}

/**
 * @typedef {{ name: string, file: string, line: number, status: string, error: string }} FlatTest
 */

/**
 * @param {any} suite
 * @param {string[]} pathTitles
 * @param {FlatTest[]} out
 */
function walkSuite(suite, pathTitles, out) {
  const next = suite.title ? [...pathTitles, suite.title] : pathTitles;
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const file = (spec.file || spec.location?.file || suite.file || 'unknown') || 'unknown';
      const line = spec.line ?? spec.location?.line ?? 0;
      const status = test?.status || 'unknown';
      const errObj = test?.results?.[0]?.error || null;
      const err =
        (errObj && (errObj.message || (typeof errObj === 'string' ? errObj : JSON.stringify(errObj)))) || '';
      const name = [...next, spec.title || ''].filter(Boolean).join(' › ') || (spec.title || 'unnamed');
      const firstLine = (err && String(err).split('\n')[0]) || '';
      out.push({
        name,
        file,
        line: typeof line === 'number' ? line : 0,
        status,
        error: cleanErrorText(firstLine),
      });
    }
  }
  for (const sub of suite.suites || []) {
    walkSuite(sub, next, out);
  }
}

if (!summaryFile) {
  console.warn('playwright-matrix-summary: GITHUB_STEP_SUMMARY is not set; skipping.');
  process.exit(0);
}

if (!existsSync(resultsDir)) {
  await appendFile(
    summaryFile,
    [
      '## Playwright Matrix Summary',
      '',
      `*No matrix results directory found at \`${md(resultsDir)}\`.*`,
      '',
    ].join('\n'),
    'utf8',
  );
  process.exit(0);
}

const artifactDirs = await listSubDirectories(resultsDir);
if (artifactDirs.length === 0) {
  await appendFile(
    summaryFile,
    [
      '## Playwright Matrix Summary',
      '',
      '*No matrix artifacts were downloaded.*',
      '',
    ].join('\n'),
    'utf8',
  );
  process.exit(0);
}

const lines = [];
lines.push('## Playwright Matrix Summary');
lines.push('');

/** @type {Array<{ env: string, php: string, wp: string, passed: number, failed: number, flaky: number, skipped: number, durationMs: number }>} */
const envRows = [];

/** @type {Map<string, { name: string, file: string, line: number, count: number, envs: Set<string>, sampleError: string }>} */
const failureMap = new Map();

for (const artifactDir of artifactDirs) {
  const artifactName = artifactDir.split('/').pop() || artifactDir;
  const { wp, php } = parseEnvFromArtifactName(artifactName);
  const env = `wp${wp} / php${php}`;

  const jsonPath = await findPlaywrightJson(artifactDir);
  if (!jsonPath) {
    envRows.push({
      env,
      php,
      wp,
      passed: 0,
      failed: 0,
      flaky: 0,
      skipped: 0,
      durationMs: 0,
    });
    continue;
  }

  let report;
  try {
    report = JSON.parse(await readFile(jsonPath, 'utf8'));
  } catch {
    envRows.push({
      env,
      php,
      wp,
      passed: 0,
      failed: 0,
      flaky: 0,
      skipped: 0,
      durationMs: 0,
    });
    continue;
  }

  const stats = report?.stats || {};
  const passed = Number(stats.expected || 0);
  const failed = Number(stats.unexpected || 0);
  const flaky = Number(stats.flaky || 0);
  const skipped = Number(stats.skipped || 0);
  const durationMs = Number(stats.duration || 0);

  envRows.push({
    env,
    php,
    wp,
    passed,
    failed,
    flaky,
    skipped,
    durationMs,
  });

  const all = [];
  for (const top of report?.suites || []) {
    walkSuite(top, [], all);
  }
  const failedTests = all.filter((t) => t.status === 'unexpected');
  for (const test of failedTests) {
    const key = `${test.file}:${test.line}::${test.name}`;
    const existing = failureMap.get(key);
    if (existing) {
      existing.count += 1;
      existing.envs.add(env);
      if (!existing.sampleError && test.error) existing.sampleError = test.error;
    } else {
      failureMap.set(key, {
        name: test.name,
        file: test.file,
        line: test.line,
        count: 1,
        envs: new Set([env]),
        sampleError: test.error,
      });
    }
  }
}

envRows.sort((a, b) => {
  const byFailed = b.failed - a.failed;
  if (byFailed !== 0) return byFailed;
  const byWp = a.wp.localeCompare(b.wp, undefined, { numeric: true });
  if (byWp !== 0) return byWp;
  return a.php.localeCompare(b.php, undefined, { numeric: true });
});

const totalPassed = envRows.reduce((sum, row) => sum + row.passed, 0);
const totalFailed = envRows.reduce((sum, row) => sum + row.failed, 0);
const totalFlaky = envRows.reduce((sum, row) => sum + row.flaky, 0);
const totalSkipped = envRows.reduce((sum, row) => sum + row.skipped, 0);
const totalDurationMs = envRows.reduce((sum, row) => sum + row.durationMs, 0);

lines.push('| Environment | ✅ Passed | ❌ Failed | ⚠️ Flaky | ⏭️ Skipped |');
lines.push('|-------------|---------:|---------:|--------:|----------:|');
for (const row of envRows) {
  lines.push(`| ${md(row.env)} | ${row.passed} | ${row.failed} | ${row.flaky} | ${row.skipped} |`);
}
lines.push(`| **Total** | **${totalPassed}** | **${totalFailed}** | **${totalFlaky}** | **${totalSkipped}** |`);
lines.push('');
if (totalFailed === 0) {
  lines.push('🎉 **No failed tests across any matrix environment.**');
} else {
  const noun = totalFailed === 1 ? 'test failure' : 'test failures';
  lines.push(`⚠️ **${totalFailed} ${noun} detected across the matrix.**`);
}
lines.push('');
lines.push(`*Combined duration: ${(totalDurationMs / 1000).toFixed(1)}s across ${envRows.length} envs*`);
lines.push('');

const failureRows = [...failureMap.values()].sort((a, b) => {
  const byCount = b.count - a.count;
  if (byCount !== 0) return byCount;
  return a.name.localeCompare(b.name);
});

lines.push('### ❌ Aggregated Failures (Most Frequent First)');
lines.push('');
if (failureRows.length === 0) {
  lines.push('🎉 *No failed tests detected across matrix environments.*');
  lines.push('');
} else {
  lines.push('| ❌ Fails In | Test | Location | Environments |');
  lines.push('|-----------:|------|----------|--------------|');
  for (const row of failureRows) {
    const where = row.line ? `:${row.line}` : '';
    const envList = [...row.envs].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('<br>');
    lines.push(
      `| ${row.count} | ${md(row.name)} | \`${md(row.file)}${where}\` | ${md(envList)} |`,
    );
    if (row.sampleError) {
      lines.push(`|  | _Error_ |  | \`${md(row.sampleError.slice(0, 300))}\` |`);
    }
  }
  lines.push('');
}

await appendFile(summaryFile, `${lines.join('\n')}\n`, 'utf8');
