const {defineConfig} = require('cypress')
const {phpVersion, core} = require('./.wp-env.json')
const wpVersion = /[^/]*$/.exec(core)[0]

module.exports = defineConfig({
	projectId: 'kuks2q',
	env: {
		wpUsername: 'admin',
		wpPassword: 'password',
		wpVersion,
		phpVersion,
		pluginId: 'hostgator',
		appId: 'hgwp',
		pluginSlug: 'wp-plugin-hostgator',
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

			const semver = require('semver');

			// Ensure that the base URL is always properly set.
			if (config.env && config.env.baseUrl) {
				config.baseUrl = config.env.baseUrl;
			}

			// Ensure that we have a semantically correct WordPress version number for comparisons.
			if (config.env.wpVersion) {
				if (config.env.wpVersion.split('.').length !== 3) {
					config.env.wpSemverVersion = `${config.env.wpVersion}.0`;
				} else {
					config.env.wpSemverVersion = config.env.wpVersion;
				}
			}

			// Ensure that we have a semantically correct PHP version number for comparisons.
			if (config.env.phpVersion) {
				if (config.env.phpVersion.split('.').length !== 3) {
					config.env.phpSemverVersion = `${config.env.phpVersion}.0`;
				} else {
					config.env.phpSemverVersion = config.env.phpVersion;
				}
			}

			// Exclude ecommerce tests for WordPress lower than 6.3 (6.2) or PHP lower than 7.4 (7.3)
			if ( semver.satisfies( config.env.wpSemverVersion, '<6.3.0' ) || semver.satisfies( config.env.phpSemverVersion, '<7.4.0' )) {
				config.excludeSpecPattern = config.excludeSpecPattern.concat( [
					'vendor/newfold-labs/wp-module-ecommerce/tests/cypress/integration/Site-Capabilities/**'
				] );
			}

			return config;
		},
		baseUrl: 'http://localhost:8884',
		specPattern: [
			'tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
			'vendor/newfold-labs/**/tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
		],
		supportFile: 'tests/cypress/support/index.js',
		testIsolation: false,
		excludeSpecPattern: [
			'vendor/newfold-labs/**/tests/cypress/integration/wp-module-support/*.cy.js', // skip any module's wp-module-support files
		],
		experimentalRunAllSpecs: true,
	},
	retries: 1,
	experimentalMemoryManagement: true,
})
