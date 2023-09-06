// <reference types="Cypress" />

// Copied from module for time being. Coming soon module needs updates for multi-brans support.
// Also need some work on the ecommerce module for multi-brand support. 
// Or to move coming soon code out of ecommerce module and into coming soon module.

describe('Coming Soon', function () {
	let appClass = '.' + Cypress.env('appId');

	before(() => {
		// Set coming soon to true
		cy.exec(`npx wp-env run cli wp option update nfd_coming_soon true`);

		cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/settings');
		cy.injectAxe();
	});

	it('Coming Soon Toggle Functions', () => {

		// Initial Coming Soon State
		cy.get('#wp-toolbar #wp-admin-bar-site-status')
			.contains('span', 'Coming Soon')
			.should('be.visible');

		cy.get( appClass + '-app-settings-coming-soon').contains('h3', 'Maintenance Mode')
			.scrollIntoView()
			.should('be.visible');

		cy.get( appClass + '-app-settings-coming-soon').contains('label', 'Coming soon')
			.scrollIntoView()
			.should('be.visible');

		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'true');

		// Deactivate coming soon - Launch Site
		cy.get('[data-id="coming-soon-toggle"]').click();
		cy.wait(500);

		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'false');
		cy.get('#wp-toolbar #wp-admin-bar-site-status')
			.contains('span', 'Live')
			.should('be.visible');
		cy.get('.nfd-notifications').contains('.nfd-notification', 'Coming soon deactivated').should('be.visible');

		// Activate Coming Soon - Unlaunch Site
		cy.get('[data-id="coming-soon-toggle"]').click();
		cy.wait(500);
		
		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'true');
		cy.get('#wp-toolbar #wp-admin-bar-site-status')
			.contains('span', 'Coming Soon')
			.should('be.visible');
		cy.get('.nfd-notifications').contains('.nfd-notification', 'Coming soon activated').should('be.visible');
		
	});

	it('Displays Coming Soon in Site Status Admin Toolbar', () => {
		// Admin bar contains label
		cy.get('#wp-toolbar #wp-admin-bar-site-status')
			.contains('div', 'Site Status')
			.should('be.visible');
		// Admin bar contains status
		cy.get('#wp-toolbar #wp-admin-bar-site-status')
			.contains('span', 'Coming Soon')
			.should('be.visible');
	});

	it('Has Coming Soon Section on Home', () => {
		cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/home');
		cy.get( appClass + '-app-home-page .nfd-app-section-content').first()
			.scrollIntoView()
			.contains('h1', 'Ready to go live?')
			.should('be.visible');

		cy.get( appClass + '-app-home-page .nfd-app-section-content')
			.contains('a.nfd-button', 'Preview your').first()
			.should('exist');

		cy.get( appClass + '-app-home-page .nfd-app-section-content').first()
			.contains('button', 'Launch your')
			.should('exist');
		
	});

	it('Displays admin coming soon notice', () => {
		cy.visit('/wp-admin/index.php');
		cy.get('.notice-warning')
			.contains('p', 'coming')
			.should('be.visible');
	});

	it('Displays Coming Soon on Frontend', () => {
		cy.logout();
		cy.visit('/');
		cy.get('body')
			.contains('h1', 'Coming')
			.should('be.visible');
	});

	it('Launching launches site', () => {
		cy.login(Cypress.env('wpUsername'), Cypress.env('wpPassword'));
		cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/settings');
		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'true');
		
		cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/home');

		cy.get( appClass + '-app-home-page .nfd-app-section-content').first()
			.contains('button', 'Launch your')
			.click();
		cy.wait(100);
		
		cy.get( appClass + '-app-home-page .nfd-app-section-content').first()
			.contains('button', 'Launch your')
			.should('not.exist');

		cy.logout();
		cy.visit('/');
		cy.get('body')
			.contains('h1', 'Coming soon')
			.should('not.exist');

		cy.login(Cypress.env('wpUsername'), Cypress.env('wpPassword'));

		cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/settings');
	
		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'false');
		// Re-Activate Coming Soon
		cy.get('[data-id="coming-soon-toggle"]').click();
		cy.wait(500);
		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'true');

	})
});
