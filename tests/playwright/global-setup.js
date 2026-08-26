import { execFileSync } from 'child_process';
import { dirname, join } from 'path';
import utils from './helpers/utils.mjs';
import wordpress from './helpers/wordpress.mjs';

/** Plugin root must match wp-env's cwd: loadConfig uses path.resolve('.'). */
function getPluginRoot(config) {
  if (config.configFile && config.configFile.length > 0) {
    return dirname(config.configFile);
  }
  return config.rootDir || process.cwd();
}

function runApplyPlaywrightModuleOverrides(config) {
  const pluginRoot = getPluginRoot(config);
  const script = join(pluginRoot, '.github/scripts/apply-playwright-module-overrides.mjs');
  // No shell: argv only, so path characters are not interpreted by a shell
  execFileSync(process.execPath, [script], { cwd: pluginRoot, stdio: 'inherit' });
}

async function globalSetup(config) {
  process.env.PLUGIN_DIR = process.env.PLUGIN_DIR || getPluginRoot(config);

  // Apply module spec overrides (separate process; see runApplyPlaywrightModuleOverrides)
  runApplyPlaywrightModuleOverrides(config);

  utils.fancyLog('Running global setup...', 100, 'gray', '');
  
  try {
    // Set permalink structure and flush rewrite rules in one step.
    // `rewrite structure` updates permalink_structure and flushes rules; `--hard` also
    // updates .htaccess (same intent as the old option update + rewrite flush --hard).
    // https://developer.wordpress.org/cli/commands/rewrite/structure/
    const permalinkStructure = '/%postname%/';
    utils.fancyLog(`🔗 Setting permalink structure to: ${permalinkStructure}`, 100, 'gray', '');
    const { result: pResult, attempt: permalinkAttempt } = await wordpress.wpCliWithRetry(
      `rewrite structure '${permalinkStructure}' --hard`,
      { failOnNonZeroExit: false },
      { maxAttempts: 2, delayMs: 2000 },
    );
    if (wordpress.isWpCliFailure(pResult)) {
      utils.fancyLog(
        `✘ Permalink setup failed after ${permalinkAttempt} attempt(s): ${wordpress.formatWpCliResult(pResult)}`,
        200,
        'yellow',
        '',
      );
    } else {
      const attemptNote = permalinkAttempt > 1 ? `, attempt ${permalinkAttempt}` : '';
      utils.fancyLog(
        `✔ Permalink structure set (${wordpress.formatWpCliResult(pResult)}${attemptNote})`,
        200,
        'green',
        '',
      );
    }

    // Deactivate extra plugins so they do not load during tests (files remain installed).
    // https://developer.wordpress.org/cli/commands/plugin/deactivate/
    // failOnNonZeroExit: false — plugins may be absent; setup should not fail.
    const extraPlugins = [
      'google-analytics-for-wordpress/googleanalytics.php',
      'jetpack/jetpack.php',
      'optinmonster/optin-monster-wp-api.php',
      'wpforms-lite/wpforms.php',
      'wordpress-seo/wp-seo.php',
    ];
    for (const plugin of extraPlugins) {
      const result = await wordpress.wpCli(`plugin deactivate ${plugin}`, {
        failOnNonZeroExit: false,
      });
      if (wordpress.isWpCliFailure(result)) {
        utils.fancyLog(
          `⚠ Could not deactivate ${plugin}: ${wordpress.formatWpCliResult(result)}`,
          200,
          'yellow',
          '',
        );
      }
    }

    // Clear cron hooks known to fatal ("Class ... not found") if they fire after their
    // owning module's dependency is deactivated/removed mid-suite (e.g. a stale nfd_data_sync_cron
    // surviving into a state where wp-module-data's autoloader isn't registered). WP-Cron retries
    // a failing event on every subsequent page load, so one orphaned event can take down the rest
    // of the run. Belt-and-suspenders alongside the upstream fix in wp-module-data (deactivation
    // hook now clears these itself) — protects any site/branch still on an older module version.
    // See: https://github.com/newfold-labs/wp-plugin-bluehost/pull/1380
    //      https://github.com/newfold-labs/wp-module-data/pull/292
    const orphanProneCronHooks = ['nfd_data_sync_cron', 'nfd_data_cron'];
    for (const hook of orphanProneCronHooks) {
      const result = await wordpress.wpCli(`cron event delete ${hook}`, {
        failOnNonZeroExit: false,
      });
      if (wordpress.isWpCliFailure(result)) {
        utils.fancyLog(
          `⚠ Could not clear cron hook ${hook}: ${wordpress.formatWpCliResult(result)}`,
          200,
          'yellow',
          '',
        );
      }
    }

    utils.fancyLog('✔ Global setup completed successfully', 100, 'green', '');
  } catch (error) {
    utils.fancyLog(`✘ Global setup failed: ${error.message}`, 100, 'red', '');
    process.exit(1);
  }
}

export default globalSetup;
