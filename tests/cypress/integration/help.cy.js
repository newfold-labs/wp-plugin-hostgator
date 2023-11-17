// <reference types="Cypress" />

describe('Help Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/help');
	});
	
	it('Is Accessible', () => {
		cy.injectAxe();
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
