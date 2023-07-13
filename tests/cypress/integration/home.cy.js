// <reference types="Cypress" />

describe('Home Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/home');
		cy.injectAxe();
	});

	it('Site Info Exists', () => {
		cy.window().then((win) => {
			const siteTitle = win.HGWP.sitetitle;

			cy.get('.hgwp-app-site-info').contains('h3', siteTitle)
			.scrollIntoView()
			.should('be.visible');
		  })
	});

	it('Is Accessible', () => {
		cy.wait(500);
		cy.checkA11y('.hgwp-app-body');
	});

	it('Maintenance Mode Section Exists', () => {
		cy
			.get('.hgwp-app-home-coming-soon').contains('h3', 'Maintenance Mode')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Website Content Section Exists', () => {
		cy
			.get('.hgwp-app-home-content').contains('h3', 'Website Content')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Settings and Performance Section Exists', () => {
		cy
			.get('.hgwp-app-home-settings').contains('h3', 'Settings and Performance')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Web Hosting Section Exists', () => {
		cy
			.get('.hgwp-app-home-hosting').contains('h3', 'Web Hosting')
			.scrollIntoView()
			.should('be.visible');
	});
});
