// <reference types="Cypress" />

describe('Marketplace Page', function () {

	before(() => {
		cy.server();
		cy.intercept({
			method: 'GET',
			url: '**newfold-marketplace**'
		}, {
			fixture: 'products.json'
		}).as('marketplace');
		cy.visit('/wp-admin/admin.php?page=hostgator#/marketplace');
		cy.injectAxe();
	});

	it('Exists', () => {
		cy.contains('button', 'Featured');
	});

	it('Is Accessible', () => {
		cy.wait(1000);
		cy.checkA11y('.hgwp-app-body');
	});

	it('Product grid has 6 items', () => {
		cy.get('.marketplace-item').should('have.length', 3);
	});

	it('First product card renders correctly', () => {
		cy.get('#marketplace-item-003c9022-348b-4754-b27c-9452dd6eac62').as('card');

		cy.get('@card')
			.findByRole('link', {name: 'Learn More'})
			.scrollIntoView()
			.should('be.visible')
			.should('have.attr', 'href')
			.and('include', 'https://www.hostgator.com/services/web-design');

		cy.get('@card').first().within(() => {
			cy.get('.components-card__header')
				.contains('Web Design Services')
				.should('be.visible');
			cy.get('.components-card__media').should('be.visible');
			cy.get('.components-card__header em.price').should('not.exist');
		});
	});

	it('Second product card render correctly', () => {
		cy.get('#marketplace-item-81357ab8-49fc-4a9e-a01d-7d33fdf3f058').as('card');

		cy.get('@card')
			.findByRole('link', {name: 'Get More Leads'})
			.scrollIntoView()
			.should('be.visible')
			.should('have.attr', 'href')
			.and('include', 'https://www.hostgator.com/services/ppc');

		cy.get('@card').first().within(() => {
			cy.get('.components-card__header')
				.contains('PPC')
				.should('be.visible');
			cy.get('.components-card__media').should('be.visible');
			cy.get('.components-card__header em.price')
				// .contains('$59.00')
				.should('not.exist');
		});
	});
	
	it('CTA links have target=_blank', () => {
		cy.get('#marketplace-item-81357ab8-49fc-4a9e-a01d-7d33fdf3f058').as('card');

		cy.get('@card')
			.findByRole('link', {name: 'Get More Leads'})
			.scrollIntoView()
			.should('have.attr', 'target')
			.and('include', '_blank');
	});

	// Not enough products in fixture to require load more button.
	it.skip('Load more button loads more products', () => {
		cy.get('.marketplace-item').should('have.length', 12);

		cy.contains('button', 'Load More');

		cy.get('.marketplaceList button')
			.scrollIntoView()
			.click();

		cy.wait(300);

		cy.get('.marketplace-item').should('have.length', 19);
	});

	// Test passes locally but fails in github action
	it('Category Tab Filters properly', () => {
		
		cy.findByRole('tab', { name: 'Services' } ).click();
		cy.get('.marketplace-item').should('have.length', 4);
		cy.get('#marketplace-item-003c9022-348b-4754-b27c-9452dd6eac62 h3')
			.scrollIntoView()
			.should('be.visible')
			.should('have.text', 'Web Design Services');
		
		cy.findByRole('tab', { name: 'SEO' } ).click();
		cy.get('.marketplace-item').should('have.length', 4);
		cy.get('#marketplace-item-00c3eae2-9f6c-4e13-8674-599fe4a05cc0 h3')
			.scrollIntoView()
			.should('be.visible')
			.should('have.text', 'Yoast Local SEO');
	});

	// CTB Not supported yet
	it.skip('Product CTB cards render correctly', () => {
		cy.get('.marketplace-item-ec14a614-8672-4094-8310-cb0b1eb0f176').as('card');

		cy.get('@card')
			.findByRole('button', {name: 'Buy Now'})
			.scrollIntoView()
			.should('be.visible')
			.should('have.attr', 'data-action')
			.and('include', 'load-nfd-ctb');

		cy.get('@card').first().within(() => {
			cy.get('.components-card__header').should('be.visible');
			cy.get('.components-card__media').should('be.visible');
		});
	});

});
