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

	it('Language Change to pt_BR updates text', () => {
        // cy.setRegion('BR');
        cy.setLanguage('pt_BR');
		cy.visit('/wp-admin/admin.php?page=hostgator#/help', {
			onBeforeLoad() {
				cy.window().then((win) => {
                    win.NewfoldRuntime.restUrl = "http://localhost:8880/index.php?rest_route=/";
				});
			}
		});

		cy.get('.card-help-phone').contains('h3', 'Telefone')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Chat Card Exists', () => {
		cy.get('.card-help-chat').contains('h3', 'Chat')
			.scrollIntoView()
			.should('be.visible');
	});

	it('KB Card Exists', () => {
		cy.get('.card-help-kb').contains('h3', 'Base de Conhecimento')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Blog Card Exists', () => {
		cy.get('.card-help-blog').contains('h3', 'Blog')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Language change back to en_US updates text back', () => {
        // cy.setRegion();
        cy.setLanguage();
        cy.visit('/wp-admin/admin.php?page=hostgator#/help', {
			onBeforeLoad() {
				cy.window().then((win) => {
                    win.NewfoldRuntime.restUrl = "http://localhost:8880/index.php?rest_route=/";
				});
			}
		});

		cy.get('.card-help-kb').contains('h3', 'Knowledge Base')
			.scrollIntoView()
			.should('be.visible');
	});

});