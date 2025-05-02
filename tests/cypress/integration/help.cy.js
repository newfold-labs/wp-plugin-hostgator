// <reference types="Cypress" />
const pluginNotificationsFixture = require( '../fixtures/plugin-notifications.json' );
const pluginProductsFixture = require( '../fixtures/plugin-products.json' );

describe('Help Page', { testIsolation: true }, () => {

	beforeEach(() => {
		cy.wpLogin();
        cy.setRegion();
        cy.setBrand();
        cy.setLanguage();
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
				onLoad: () => {
					cy.window().then((win) => {
						win.NewfoldRuntime.restUrl = "http://localhost:8880/index.php?rest_route=/";
					});
				}
			}
		);

	});
	
	it('Is Accessible and Cards Exist', () => {
		cy.injectAxe();
		cy.get( '.hgwp-app-help-page', { timeout: 2000 } ).should( 'exist' );
		cy.a11y('.hgwp-app-body');

		cy.get('.card-help-phone').contains('h3', 'Phone')
			.scrollIntoView()
			.should('be.visible');

		cy.get('.card-help-chat').contains('h3', 'Chat')
			.scrollIntoView()
			.should('be.visible');

		cy.get('.card-help-twitter').contains('h3', 'Tweet')
			.scrollIntoView()
			.should('be.visible');

		cy.get('.card-help-kb').contains('h3', 'Knowledge Base')
			.scrollIntoView()
			.should('be.visible');

		cy.get('.card-help-blog').contains('h3', 'Blog')
			.scrollIntoView()
			.should('be.visible');

		cy.get('.card-help-video').contains('h3', 'Video')
			.scrollIntoView()
			.should('be.visible');
	});

});
