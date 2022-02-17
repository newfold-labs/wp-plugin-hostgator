// <reference types="Cypress" />

describe('Performance Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/performance');
		cy.injectAxe();
		
	});

	it('Is Accessible', () => {
		cy.wait(500);
		cy.checkA11y('.hgwp-app-body');
	});



});
