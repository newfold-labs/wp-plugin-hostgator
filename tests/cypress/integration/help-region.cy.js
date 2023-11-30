// <reference types="Cypress" />

describe('Language updates on Help Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/help');
	});

	it('Phone Card Exists', () => {
		cy.get('.card-help-phone')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Twitter Card Exists', () => {
		cy.get('.card-help-twitter')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Region Change Updates Content', () => {
		cy.setBrand('hostgator-latam');
        cy.setRegion('br');
        cy.setLanguage('pt_BR');
		cy.reload();

		cy.get('.card-help-phone').should('not.exist');
		cy.get('.card-help-twitter').should('not.exist');
	});

	it('Chat Card Exists', () => {
		cy.get('.card-help-chat')
			.scrollIntoView()
			.should('be.visible');
	});

	it('KB Card Exists', () => {
		cy.get('.card-help-kb')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Blog Card Exists', () => {
		cy.get('.card-help-blog')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Language change back to en_US updates text back', () => {
        cy.setBrand();
		cy.setRegion();
        cy.setLanguage();
        cy.reload();

		// check that page reloaded
		cy.get('.card-help-blog')
			.scrollIntoView()
			.should('be.visible');
	});

});