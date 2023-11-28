// <reference types="Cypress" />

describe('Language updates on Help Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/help', {
			onBeforeLoad() {
				cy.window().then((win) => {
                    win.NewfoldRuntime.restUrl = "http://localhost:8880/index.php?rest_route=/";
				});
			}
		});
	});

	it('Phone Card Exists', () => {
		cy.get('.card-help-phone')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Tweet Card Exists', () => {
		cy.get('.card-help-twitter')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Language Change to pt_BR updates text', () => {
		cy.setBrand('hostgator-latam');
        cy.setRegion('br');
        cy.setLanguage('pt_BR');

		cy.visit('/wp-admin/admin.php?page=hostgator#/help', {
			onBeforeLoad() {
				cy.window().then((win) => {
                    win.NewfoldRuntime.restUrl = "http://localhost:8880/index.php?rest_route=/";
				});
			}
		});

		cy.get('.card-help-phone')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Phone Card Does Not Exist', () => {
		// No phone card for help in hg-latam-br
		cy.get('.card-help-phone')
			.scrollIntoView()
			.should('not.exist');
	});

	it('Twitter Card Does Not Exist', () => {
		// No twitter card for help in hg-latam-br
		cy.get('.card-help-twitter')
			.scrollIntoView()
			.should('not.exist');
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