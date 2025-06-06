// <reference types="Cypress" />

describe('Navigation', { testIsolation: true }, () => {
	const appClass = '.' + Cypress.env( 'appId' );

	beforeEach(() => {
		cy.wpLogin();
		cy.visit( `/wp-admin/admin.php?page=${ Cypress.env( 'pluginId' ) }` );
	});

	it('Logo Links to home', () => {
		cy.get( appClass + '-logo-wrap a').click();
		cy.wait(500);
		cy.hash().should('eq', '#/home');
	});

	it( 'Admin submenu exists', () => {
		cy.visit( '/wp-admin/index.php' );
		cy.get( '#adminmenu #toplevel_page_hostgator ul.wp-submenu' ).should(
			'exist'
		);
		cy.get(
			'#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/home"]'
		).should( 'exist' );
		cy.get(
			'#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/settings"]'
		).should( 'exist' );
		cy.get(
			'#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/help"]'
		).should( 'exist' );
	} );

	// test main nav
	it( 'Settings link properly navigates', () => {
		cy.visit( '/wp-admin/index.php' );
		cy.get(
			'#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/settings"]'
		).click( { force: true } );
		cy.wait( 500 );
		cy.hash().should( 'eq', '#/settings' );
	} );
});
