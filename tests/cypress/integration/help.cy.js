// <reference types="Cypress" />
const pluginNotificationsFixture = require( '../fixtures/plugin-notifications.json' );
const pluginProductsFixture = require( '../fixtures/plugin-products.json' );

describe('Help Page', function () {

	before(() => {
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
		cy.injectAxe();

	});
	
	it('Is Accessible', () => {
		cy.injectAxe();
		cy.wait(500);
		cy.a11y('.hgwp-app-body');
	});

	it('Phone Card Exists', () => {
		cy.get('.card-help-phone').contains('h3', 'Phone')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Chat Card Exists', () => {
		cy.get('.card-help-chat').contains('h3', 'Chat')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Tweet Card Exists', () => {
		cy.get('.card-help-twitter').contains('h3', 'Tweet')
			.scrollIntoView()
			.should('be.visible');
	});

	it('KB Card Exists', () => {
		cy.get('.card-help-kb').contains('h3', 'Knowledge Base')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Blog Card Exists', () => {
		cy.get('.card-help-blog').contains('h3', 'Blog')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Youtube Card Exists', () => {
		cy.get('.card-help-video').contains('h3', 'Video')
			.scrollIntoView()
			.should('be.visible');
	});

});
