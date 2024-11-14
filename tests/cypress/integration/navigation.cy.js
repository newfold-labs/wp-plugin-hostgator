// <reference types="Cypress" />

describe('Navigation', { testIsolation: true }, () => {
	const appClass = '.' + Cypress.env( 'appId' );

	beforeEach(() => {
		cy.wpLogin();
		cy.exec( 'npx wp-env run cli wp transient delete newfold_marketplace' );
		cy.visit( `/wp-admin/admin.php?page=${ Cypress.env( 'pluginId' ) }` );
	});

	it( "Admin submenu shouldn't exist inside app", () => {
		cy.get( `#adminmenu #toplevel_page_${ Cypress.env( 'pluginId' ) } ul.wp-submenu` ).should(
			'not.exist'
		);
	} );

	it('Logo Links to home', () => {
		cy.get( appClass + '-logo-wrap').click();
		cy.wait(500);
		cy.hash().should('eq', '#/home');
	});

	it('Main nav links properly navigates', () => {
		cy
			.get( appClass + '-app-navitem-Marketplace').
			should('not.have.class', 'active');
		cy.get( appClass + '-app-navitem-Marketplace').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace');
		cy
			.get( appClass + '-app-navitem-Marketplace')
			.should('have.class', 'active');

		cy.get( appClass + '-app-navitem-Performance').click();
		cy.wait(500);
		cy.hash().should('eq', '#/performance');
		cy
			.get( appClass + '-app-navitem-Performance')
			.should('have.class', 'active');
		cy
			.get( appClass + '-app-navitem-Marketplace')
			.should('not.have.class', 'active');

		cy.get( appClass + '-app-navitem-Settings').click();
		cy.wait(500);
		cy.hash().should('eq', '#/settings');
	});
	
	it('Subnav links properly navigates', () => {
		cy
			.get( appClass + '-app-navitem-Marketplace')
			.scrollIntoView()
			.should('not.have.class', 'active');
		cy.get( appClass + '-app-navitem-Marketplace').click();

		cy.wait(500);
		cy.hash().should('eq', '#/marketplace');
		cy
			.get( appClass + '-app-navitem-Marketplace')
			.should('have.class', 'active');

			cy.get( appClass + '-app-subnavitem-Services').click();
			cy.wait(500);
			cy.hash().should('eq', '#/marketplace/services');
			cy
				.get( appClass + '-app-subnavitem-Services')
				.should('have.class', 'active');
			cy
				.get( appClass + '-app-navitem-Marketplace')
				.should('have.class', 'active');
		

		cy.get( appClass + '-app-subnavitem-SEO').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace/seo');
		cy
			.get( appClass + '-app-subnavitem-SEO')
			.should('have.class', 'active');
		cy
			.get( appClass + '-app-subnavitem-Services')
			.should('not.have.class', 'active');
		cy
			.get( appClass + '-app-navitem-Marketplace')
			.should('have.class', 'active');
			
		cy.get( appClass + '-app-navitem-Performance').click();
			cy.wait(500);
		cy
			.get( appClass + '-app-subnavitem-Services')
			.should('not.have.class', 'active');
		cy
			.get( appClass + '-app-subnavitem-SEO')
			.should('not.have.class', 'active');
		cy
			.get( appClass + '-app-navitem-Marketplace')
			.should('not.have.class', 'active');
	});

	it( 'Mobile nav links dispaly and link properly on mobile', () => {
		cy.viewport( 'iphone-x' );
		cy.get( '#nfd-app-mobile-nav' ).should( 'be.visible' );

		cy.get( appClass + '-app-navitem-Home' ).should( 'not.exist' );

		cy.get( '#nfd-app-mobile-nav' ).click();
		cy.wait( 500 );
		cy.get( appClass + '-app-navitem-Home' ).should( 'be.visible' );
		cy.get( 'button.nfd-modal__close-button' ).should( 'be.visible' );
		cy.get( 'button.nfd-modal__close-button' ).click();
		cy.get( appClass + '-app-navitem-Home' ).should( 'not.exist' );
	});
});
