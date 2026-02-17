import { execSync } from 'child_process';
import utils from './helpers/utils.mjs';

async function globalSetup(config) {
  utils.fancyLog('Running global setup...', 55, 'gray', '');

  try {
    const permalinkStructure = '/%postname%/';
    utils.fancyLog(`🔗 Setting permalink structure to: ${permalinkStructure}`, 55, 'gray', '');

    execSync(`npx wp-env run cli wp option update permalink_structure '${permalinkStructure}'`, {
      stdio: 'inherit',
      encoding: 'utf-8',
    });

    utils.fancyLog('🔄 Flushing rewrite rules...', 55, 'gray', '');
    execSync('npx wp-env run cli wp rewrite flush', {
      stdio: 'inherit',
      encoding: 'utf-8',
    });

    utils.fancyLog('✔ Global setup completed successfully', 55, 'green', '');
  } catch (error) {
    utils.fancyLog(`✘ Global setup failed: ${error.message}`, 55, 'red', '');
    process.exit(1);
  }
}

export default globalSetup;
