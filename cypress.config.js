const { defineConfig } = require('cypress')
const { phpVersion, core } = require('./.wp-env.json')
const wpVersion = /[^/]*$/.exec(core)[0]

module.exports = defineConfig({
  projectId: "kuks2q",
  env: {
    wpUsername: 'admin',
    wpPassword: 'password',
		wpVersion,
		phpVersion,
    pluginId: 'hostgator',
    appId: 'hgwp',
  },
  downloadsFolder: 'tests/cypress/downloads',
  fixturesFolder: 'tests/cypress/fixtures',
  screenshotsFolder: 'tests/cypress/screenshots',
  video: true,
  videosFolder: 'tests/cypress/videos',
  chromeWebSecurity: false,
	viewportWidth: 1024,
	viewportHeight: 768,
	blockHosts: [
		'*doubleclick.net',
		'*jnn-pa.googleapis.com',
		'*youtube.com',
	],
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./tests/cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8880',
    specPattern: [
      'tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
      'vendor/newfold-labs/**/tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    ],
    supportFile: 'tests/cypress/support/index.js',
    testIsolation: false,
		excludeSpecPattern: [
      'vendor/newfold-labs/**/tests/cypress/integration/wp-module-support/*.cy.js', // skip any module's wp-module-support files
      'vendor/newfold-labs/wp-module-onboarding/tests/cypress/integration/', // skipping onboarding tests until they add multi-lingual support or onboarding is activated for all lanugages
      'vendor/newfold-labs/wp-module-patterns/tests/cypress/integration/', // skip pattern tests for now
    ],
  },
  retries: 1,
  experimentalMemoryManagement: true,
})
