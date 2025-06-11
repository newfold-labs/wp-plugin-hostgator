// <reference types="Cypress" />

describe('Home Page', { testIsolation: true }, () => {
	const appClass = '.' + Cypress.env( 'appId' );

	beforeEach( () => {
		cy.wpLogin();
		cy.visit( `/wp-admin/admin.php?page=${ Cypress.env( 'pluginId' ) }#/home` );
		
	});

	it('Is Accessible and Each Section Exists', () => {
		cy.injectAxe();
		cy.get( appClass + '-home', { timeout: 2000 } ).should( 'exist' );
		cy.checkA11y( appClass + '-app-body');

		// Maintenance Mode
		cy
			.get( appClass + '-app-home-coming-soon').contains('h3', 'Site Status')
			.scrollIntoView()
			.should('be.visible');
		
		// Website Content
		cy
			.get( appClass + '-app-home-content').contains('h3', 'Website Content')
			.scrollIntoView()
			.should('be.visible');
		
		// Settings and Performance Section Exists
		cy
			.get( appClass + '-app-home-settings').contains('h3', 'Settings and Performance')
			.scrollIntoView()
			.should('be.visible');
		
		// Web Hosting Section Exists
		cy
			.get( appClass + '-app-home-hosting').contains('h3', 'Web Hosting')
			.scrollIntoView()
			.should('be.visible');
	});
});
