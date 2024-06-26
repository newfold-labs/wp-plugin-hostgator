// <reference types="Cypress" />

describe('Navigation', function () {
	const appId = Cypress.env( 'appId' );
	const pluginId = Cypress.env( 'pluginId' )

	before(() => {
		cy.exec( 'npx wp-env run cli wp transient delete newfold_marketplace' );
		cy.visit('/wp-admin/admin.php?page=' + pluginId );
	});

	it( "Admin submenu shouldn't exist inside app", () => {
		cy.get( '#adminmenu #toplevel_page_' + pluginId + ' ul.wp-submenu' ).should(
			'not.exist'
		);
	} );

	it('Logo Links to home', () => {
		cy.get('.' + appId + '-logo-wrap').click();
		cy.wait(500);
		cy.hash().should('eq', '#/home');
	});

	// test main nav
	it('Main nav links properly navigates', () => {
		cy
			.get('.' + appId + '-app-navitem-Marketplace').
			should('not.have.class', 'active');
		cy.get('.' + appId + '-app-navitem-Marketplace').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace');
		cy
			.get('.' + appId + '-app-navitem-Marketplace')
			.should('have.class', 'active');

		cy.get('.' + appId + '-app-navitem-Performance').click();
		cy.wait(500);
		cy.hash().should('eq', '#/performance');
		cy
			.get('.' + appId + '-app-navitem-Performance')
			.should('have.class', 'active');
		cy
			.get('.' + appId + '-app-navitem-Marketplace')
			.should('not.have.class', 'active');

		cy.get('.' + appId + '-app-navitem-Settings').click();
		cy.wait(500);
		cy.hash().should('eq', '#/settings');
	});
	
	it('Subnav links properly navigates', () => {
		cy
			.get('.' + appId + '-app-navitem-Marketplace')
			.scrollIntoView()
			.should('not.have.class', 'active');
		cy.get('.' + appId + '-app-navitem-Marketplace').click();

		cy.wait(500);
		cy.hash().should('eq', '#/marketplace');
		cy
			.get('.' + appId + '-app-navitem-Marketplace')
			.should('have.class', 'active');

			cy.get('.' + appId + '-app-subnavitem-Services').click();
			cy.wait(500);
			cy.hash().should('eq', '#/marketplace/services');
			cy
				.get('.' + appId + '-app-subnavitem-Services')
				.should('have.class', 'active');
			cy
				.get('.' + appId + '-app-navitem-Marketplace')
				.should('have.class', 'active');
		

		cy.get('.' + appId + '-app-subnavitem-SEO').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace/seo');
		cy
			.get('.' + appId + '-app-subnavitem-SEO')
			.should('have.class', 'active');
		cy
			.get('.' + appId + '-app-subnavitem-Services')
			.should('not.have.class', 'active');
		cy
			.get('.' + appId + '-app-navitem-Marketplace')
			.should('have.class', 'active');
			
		cy.get('.' + appId + '-app-navitem-Performance').click();
			cy.wait(500);
		cy
			.get('.' + appId + '-app-subnavitem-Services')
			.should('not.have.class', 'active');
		cy
			.get('.' + appId + '-app-subnavitem-SEO')
			.should('not.have.class', 'active');
		cy
			.get('.' + appId + '-app-navitem-Marketplace')
			.should('not.have.class', 'active');
	});

	// utility nav is no more, leaving this in place in case we bring it back anytime soon.
	it.skip('Utility nav links properly navigates', () => {
		cy
			.get('.utility-link-Performance')
			.should('not.have.class', 'active');
		cy
			.get('.utility-link-Performance').click();
		cy.wait(500);
		cy.hash().should('eq', '#/performance');
		cy
			.get('.utility-link-Performance')
			.should('have.class', 'active');

		cy
			.get('.utility-link-Settings').click();
		cy.wait(500);
		cy.hash().should('eq', '#/settings');
		cy
			.get('.utility-link-Settings')
			.should('have.class', 'active');
		cy
			.get('.utility-link-Performance')
			.should('not.have.class', 'active');

		cy
			.get('.utility-link-Help').click();
		cy.wait(500);
		cy.hash().should('eq', '#/help');
		cy
			.get('.utility-link-Help')
			.should('have.class', 'active');
		cy
			.get('.utility-link-Settings')
			.should('not.have.class', 'active');
	});

	// no mobile nav, but should probably add
	it.skip('Mobile nav links dispaly for mobile', () => {
		cy
			.get('.mobile-toggle')
			.should('not.exist');

		cy.viewport('iphone-x');
		cy
			.get('.mobile-toggle')
			.should('be.visible');
	});

	it.skip('Mobile nav links properly navigates', () => {
		cy.get('.mobile-link-Home').should('not.exist');
		cy.viewport('iphone-x');
		cy.get('.mobile-toggle').click();
		cy.wait(500);
		cy.get('.mobile-link-Home').should('be.visible');
		cy.get('button[aria-label="Close"]').should('be.visible')
		cy.get('button[aria-label="Close"]').click();
		cy.get('.mobile-link-Home').should('not.exist');
	});
});
