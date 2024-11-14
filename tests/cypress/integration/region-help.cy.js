// <reference types="Cypress" />
const pluginNotificationsFixture = require( '../fixtures/plugin-notifications.json' );
const pluginProductsFixture = require( '../fixtures/plugin-products.json' );

describe('Language updates on Help Page', { testIsolation: true }, () => {

	beforeEach(() => {
		cy.wpLogin();
		cy.setBrand('hostgator-latam');
        cy.setRegion('br');
        cy.setLanguage('pt_BR');
		cy.reload();

		cy.intercept(
			{
				method: 'GET',
				url: /newfold-marketplace(\/|%2F)v1(\/|%2F)marketplace/,
			},
			pluginProductsFixture
		).as( 'pluginProductsFixture' );
		cy.intercept(
			{
				method: 'GET',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			pluginNotificationsFixture
		).as( 'pluginNotificationsFixture' );

		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/help',
			{
				timeout: 30000,
				onLoad() {
					cy.window().then((win) => {
						win.NewfoldRuntime.restUrl = "http://localhost:8880/index.php?rest_route=/";
					});
				}
			}
		);

	});

	it('Region Change Updates Content', () => {
		cy.get('.card-help-phone').should('not.exist');
		cy.get('.card-help-twitter').should('not.exist');
	
		// Chat Card Exists
		cy.get('.card-help-chat')
			.scrollIntoView()
			.should('be.visible');

		//KB Card Exists
		cy.get('.card-help-kb')
			.scrollIntoView()
			.should('be.visible');

		//Blog Card Exists
		cy.get('.card-help-blog')
			.scrollIntoView()
			.should('be.visible');
	});

	after(() => {
        cy.setBrand();
		cy.setRegion();
        cy.setLanguage();
        cy.reload();

		// confirm the page reloaded
		cy.get('.card-help-blog')
			.scrollIntoView()
			.should('be.visible');
	});

});