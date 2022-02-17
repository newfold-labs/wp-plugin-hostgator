// <reference types="Cypress" />

describe('Marketplace Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/marketplace');
		cy.injectAxe();
	});

	it('Is Accessible', () => {
		cy.wait(500);
		cy.checkA11y('.hgwp-app-body');
	});


	it('Plugins tab is default/first', () => {
		cy.get('.components-tab-panel__tabs-item.plugins').should('have.class', 'current-tab');
		cy.get('.components-tab-panel__tabs-item.services').should('not.have.class', 'current-tab');
		cy.get('.components-tab-panel__tabs-item.themes').should('not.have.class', 'current-tab');
		cy
			.get('.components-tab-panel__tab-content')
			.contains('h3', 'Plugins')
			.should('have.class', 'screen-reader-text');
	});

	it('Plugins tab contains Yoast Premium', () => {
		cy
			.get('.marketplace-item-yoast-premium')
			.contains('h4', 'Yoast SEO Premium');
		cy
			.get('.marketplace-item-yoast-premium')
			.contains('a', 'Buy Now')
			.should('have.attr', 'href')
			.and('match', /yoa.st/);
	});

	it('Plugins tab contains Yoast Woo', () => {
		cy
			.get('.marketplace-item-yoast-woo')
			.contains('h4', 'Yoast WooCommerce SEO');
		cy
			.get('.marketplace-item-yoast-woo')
			.contains('a', 'Buy Now')
			.should('have.attr', 'href')
			.and('match', /yoa.st/);
	});

	it('Tabs switch to proper content', () => {
		cy.get('.components-tab-panel__tabs-item.services').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace/services');
		cy.get('.components-tab-panel__tabs-item.services').should('have.class', 'current-tab');

		cy
			.get('.components-tab-panel__tab-content')
			.contains('h3', 'Services')
			.should('have.class', 'screen-reader-text');
	});

});
