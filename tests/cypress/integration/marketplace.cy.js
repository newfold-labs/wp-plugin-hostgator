// <reference types="Cypress" />

describe('Marketplace Page', function () {

	before(() => {
		cy.intercept({
			method: 'GET',
			url: /newfold-marketplace(\/|%2F)v1(\/|%2F)marketplace/
		}, {
			fixture: 'products'
		}).as('products');
		cy.visit('/wp-admin/admin.php?page=hostgator#/marketplace');
		cy.wait('@products');
	});
	
	it('Exists', () => {
		cy.contains('button', 'Featured');
	});
	
	it('Is Accessible', () => {
		cy.injectAxe();
		cy.wait(1000);
		cy.a11y('.hgwp-app-body');
	});

	it('Product grid has 5 items', () => {
		cy.get('.marketplace-item').should('have.length', 5);
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

	it('Category Tab Filters properly', () => {
		
		cy.get('.newfold-marketplace-tab-services').click();
		cy.get('.marketplace-item').should('have.length', 12);
		cy.wait(300);
		cy.get('#marketplace-item-003c9022-348b-4754-b27c-9452dd6eac62 h2')
			.scrollIntoView()
			.should('be.visible')
			.should('have.text', 'Web Design Services');
		
			cy.get('.newfold-marketplace-tab-seo').click();
		cy.get('.marketplace-item').should('have.length', 5);
		cy.wait(300);
		cy.get('#marketplace-item-00c3eae2-9f6c-4e13-8674-599fe4a05cc0 h2')
			.scrollIntoView()
			.should('be.visible')
			.should('have.text', 'Yoast Local SEO');
	});

	it('Load more button loads more products', () => {

		cy.get('.newfold-marketplace-tab-services').click();
		cy.wait(300);

		cy.get('.marketplace-item').should('have.length', 12);
		cy.contains('button', 'Load More');
		cy.get('.marketplace-list button')
			.scrollIntoView()
			.click();
		cy.wait(300);

		cy.get('.marketplace-item').should('have.length', 13);
	});

	it('Category tabs update path', () => {
		cy.get('.newfold-marketplace-tab-services').click();
		cy.location().should((loc) => {
			expect(loc.hash).to.eq('#/marketplace/services')
		});
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
