// <reference types="Cypress" />

describe('Home Page', function () {
	const appId = Cypress.env( 'appId' );
	const pluginId = Cypress.env( 'pluginId' );

	before(() => {
		cy.visit('/wp-admin/admin.php?page=' + pluginId + '#/home');
		cy.injectAxe();
	});

	it('Site Info Exists', () => {
		cy.window().then((win) => {
			const siteTitle = win.NewfoldRuntime.siteTitle;

			cy.get('.' + appId + '-app-site-info').contains('h3', siteTitle)
			.scrollIntoView()
			.should('be.visible');
		  })
	});

	it('Is Accessible', () => {
		cy.wait(500);
		cy.checkA11y('.' + appId + '-app-body');
	});

	it('Maintenance Mode Section Exists', () => {
		cy
			.get('.' + appId + '-app-home-coming-soon').contains('h3', 'Site Status')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Website Content Section Exists', () => {
		cy
			.get('.' + appId + '-app-home-content').contains('h3', 'Website Content')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Settings and Performance Section Exists', () => {
		cy
			.get('.' + appId + '-app-home-settings').contains('h3', 'Settings and Performance')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Web Hosting Section Exists', () => {
		cy
			.get('.' + appId + '-app-home-hosting').contains('h3', 'Web Hosting')
			.scrollIntoView()
			.should('be.visible');
	});
});
