// <reference types="Cypress" />

describe('Home Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/home'); // use internal override
		// cy.injectAxe();
	});

	it('Exists', () => {
		cy
			// .findByRole('heading', {name: 'Website Content', level: 2})
            .get('.hgwp-header').contains('h2', 'HostGator')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Is Accessible', () => {
		cy.wait(500);
		cy.checkA11y('.hgwp-app-body');
	});


});
