// <reference types="Cypress" />

describe('Home Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/marketplace');
		cy.injectAxe();
		
	});

	it('Header Exists', () => {
		cy
            .get('.hgwp-header').contains('h2', 'HostGator')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Is Accessible', () => {
		cy.wait(500);
		cy.checkA11y('.hgwp-app-body');
	});


});
