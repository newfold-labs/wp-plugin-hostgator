// <reference types="Cypress" />

describe('Coming Soon', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/settings');
		cy.injectAxe();
		cy.wait(500);
	});

	it('Coming Soon Toggle Exists', () => {

		cy.get('.hgwp-app-settings-coming-soon').contains('h3', 'Maintenance Mode')
			.scrollIntoView()
			.should('be.visible');
		
		cy.get('.hgwp-app-settings-coming-soon').contains('label', 'Coming soon')
			.scrollIntoView()
			.should('be.visible');

		cy.get('[data-id="coming-soon-toggle"]').should('be.visible');
	});

	it('Coming Soon Toggle Works', () => {
		cy.get('[data-id="coming-soon-toggle"]').then(toggle => {
			if (toggle.hasClass('yst-toggle--checked')) {
				// if already checked, turn off
				cy.get('[data-id="coming-soon-toggle"]').click();
				// wait
				cy.wait(100);
			}
			// turn on
			cy.get('[data-id="coming-soon-toggle"]').click();
		});
	});

	it('Displays Coming Soon in Site Status Admin Toolbar', () => {
		cy.get('#wp-toolbar #wp-admin-bar-hostgator-coming_soon')
			.contains('a', 'Coming Soon Active')
			.should('be.visible');
	});

	it('Has Coming Soon Section on Home', () => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/home');
		cy.get('.hgwp-app-home-coming-soon .yst-alert--info').scrollIntoView()
			.contains('Coming Soon')
			.should('be.visible');
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
		cy.get('body').scrollIntoView()
			.contains('h2', 'Coming')
			.should('be.visible');
	});

	it('Launching launches site', () => {
		cy.login(Cypress.env('wpUsername'), Cypress.env('wpPassword'));
		cy.visit('/wp-admin/admin.php?page=hostgator#/settings');
		cy.get('[data-id="coming-soon-toggle"]').should('have.attr', 'aria-checked').and('include', 'true');

		cy.get('[data-id="coming-soon-toggle"]').click();
		cy.wait(100);
		
		cy.get('.hgwp-page .hgwp-app-settings-coming-soon .yst-alert--info').should('not.exist');

		cy.logout();
		cy.visit('/');
		cy.get('body')
			.contains('h2', 'Coming soon')
			.should('not.exist');

		cy.login(Cypress.env('wpUsername'), Cypress.env('wpPassword'));
		cy.visit('/wp-admin/admin.php?page=hostgator#/settings');
	})
});
