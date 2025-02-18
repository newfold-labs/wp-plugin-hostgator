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
			.get( appClass + '-app-navitem-marketplace').
			should('not.have.class', 'active');
		cy.get( appClass + '-app-navitem-marketplace').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace');
		cy
			.get( appClass + '-app-navitem-marketplace')
			.should('have.class', 'active');

		cy.get( appClass + '-app-navitem-performance').click();
		cy.wait(500);
		cy.hash().should('eq', '#/performance');
		cy
			.get( appClass + '-app-navitem-performance')
			.should('have.class', 'active');
		cy
			.get( appClass + '-app-navitem-marketplace')
			.should('not.have.class', 'active');

		cy.get( appClass + '-app-navitem-settings').click();
		cy.wait(500);
		cy.hash().should('eq', '#/settings');
	});
	
	it('Subnav links properly navigates', () => {
		cy
			.get( appClass + '-app-navitem-marketplace')
			.scrollIntoView()
			.should('not.have.class', 'active');
		cy.get( appClass + '-app-navitem-marketplace').click();

		cy.wait(500);
		cy.hash().should('eq', '#/marketplace');
		cy
			.get( appClass + '-app-navitem-marketplace')
			.should('have.class', 'active');

			cy.get( appClass + '-app-subnavitem-services').click();
			cy.wait(500);
			cy.hash().should('eq', '#/marketplace/services');
			cy
				.get( appClass + '-app-subnavitem-services')
				.should('have.class', 'active');
			cy
				.get( appClass + '-app-navitem-marketplace')
				.should('have.class', 'active');
		

		cy.get( appClass + '-app-subnavitem-seo').click();
		cy.wait(500);
		cy.hash().should('eq', '#/marketplace/seo');
		cy
			.get( appClass + '-app-subnavitem-seo')
			.should('have.class', 'active');
		cy
			.get( appClass + '-app-subnavitem-services')
			.should('not.have.class', 'active');
		cy
			.get( appClass + '-app-navitem-marketplace')
			.should('have.class', 'active');
			
		cy.get( appClass + '-app-navitem-performance').click();
			cy.wait(500);
		cy
			.get( appClass + '-app-subnavitem-services')
			.should('not.have.class', 'active');
		cy
			.get( appClass + '-app-subnavitem-seo')
			.should('not.have.class', 'active');
		cy
			.get( appClass + '-app-navitem-marketplace')
			.should('not.have.class', 'active');
	});

	it( 'Mobile nav links dispaly and link properly on mobile', () => {
		cy.viewport( 'iphone-x' );
		cy.get( '#nfd-app-mobile-nav' ).should( 'be.visible' );

		cy.get( appClass + '-app-navitem-home' ).should( 'not.exist' );

		cy.get( '#nfd-app-mobile-nav' ).click();
		cy.wait( 500 );
		cy.get( appClass + '-app-navitem-home' ).should( 'be.visible' );
		cy.get( 'button.nfd-modal__close-button' ).should( 'be.visible' );
		cy.get( 'button.nfd-modal__close-button' ).click();
		cy.get( appClass + '-app-navitem-home' ).should( 'not.exist' );
	});
});
