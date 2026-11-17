import { existsSync } from 'node:fs';

/**
 * Wait for the Playground webServer child to finish booting.
 * HTTP checks must run in the child process — parent fetch to 127.0.0.1 fails in CI.
 */
async function waitForPlaygroundReadyFile(readyFile, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (existsSync(readyFile)) {
      console.log(`Playground ready file found: ${readyFile}`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(
    `Playground did not write ready file at ${readyFile} within ${timeoutMs}ms`
  );
}

export default async function globalSetup() {
  if (process.env.PLAYGROUND_AUTO_LOGIN !== '1' && !process.env.PLAYGROUND_PLUGIN_DIR) {
    return;
  }

  const readyFile = process.env.PLAYGROUND_READY_FILE;
  if (!readyFile) {
    throw new Error('PLAYGROUND_READY_FILE is required for Playground global setup');
  }

  await waitForPlaygroundReadyFile(readyFile);
}
