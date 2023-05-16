// <reference types="Cypress" />

describe('Settings Page', function () {

	before(() => {
		cy.visit('/wp-admin/admin.php?page=hostgator#/settings');
		cy.injectAxe();
		
	});

	it('Is Accessible', () => {
		cy.get('.autoupdate-all-toggle input[type="checkbox"]').uncheck();
		cy.get('.disable-comments-toggle input[type="checkbox"]').check();
		cy.wait(500);
		cy.a11y('.hgwp-app-body');
	});

	it('Has Auto Updates Settings', () => {
		cy
			.get('.card-auto-updates')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Has Coming Soon', () => {
		cy
			.get('.card-coming-soon')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Has Content Settings', () => {
		cy
			.get('.card-content-settings')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Has Comments Settings', () => {
		cy
			.get('.card-comment-settings')
			.scrollIntoView()
			.should('be.visible');
	});

	it('Everything Auto Update Toggle Works', () => {
		cy.intercept('POST', /hostgator(\/|%2F)v1(\/|%2F)settings/).as('update');

		cy.get('.autoupdate-all-toggle input[type="checkbox"]').check();
		cy.get('.autoupdate-all-toggle input[type="checkbox"]').should('be.checked');
		cy.get('.autoupdate-core-toggle input[type="checkbox"]').should('be.disabled').should('be.checked');
		cy.get('.autoupdate-plugin-toggle input[type="checkbox"]').should('be.disabled').should('be.checked');
		cy.get('.autoupdate-theme-toggle input[type="checkbox"]').should('be.disabled').should('be.checked');

		cy.get('.autoupdate-all-toggle input[type="checkbox"]').uncheck();
		cy.get('.autoupdate-core-toggle input[type="checkbox"]').should('not.be.disabled').should('be.checked');
		cy.get('.autoupdate-plugin-toggle input[type="checkbox"]').should('not.be.disabled').should('be.checked');
		cy.get('.autoupdate-theme-toggle input[type="checkbox"]').should('not.be.disabled').should('be.checked');

		cy.get('.autoupdate-core-toggle input[type="checkbox"]').uncheck();
		cy.get('.autoupdate-core-toggle input[type="checkbox"]').should('not.be.disabled').should('not.be.checked');
		cy.get('.autoupdate-all-toggle input[type="checkbox"]').should('not.be.checked');
		cy.wait('@update');
		cy
			.get('.edit-site-notices ')
			.contains('.components-snackbar__content', 'Core')
			.should('be.visible');

		cy.get('.autoupdate-plugin-toggle input[type="checkbox"]').uncheck();
		cy.get('.autoupdate-plugin-toggle input[type="checkbox"]').should('not.be.disabled').should('not.be.checked');
		cy.get('.autoupdate-all-toggle input[type="checkbox"]').should('not.be.checked');
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'Plugins')
			.should('be.visible');

		cy.get('.autoupdate-theme-toggle input[type="checkbox"]').uncheck();
		cy.get('.autoupdate-theme-toggle input[type="checkbox"]').should('not.be.disabled').should('not.be.checked');
		cy.get('.autoupdate-all-toggle input[type="checkbox"]').should('not.be.checked');
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'Theme')
			.should('be.visible');
		
		cy.get('.autoupdate-all-toggle input[type="checkbox"]').check();
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'Everything')
			.should('be.visible');

		cy.get('.autoupdate-all-toggle input[type="checkbox"]').should('be.checked');
		cy.get('.autoupdate-core-toggle input[type="checkbox"]').should('be.disabled').should('be.checked');
		cy.get('.autoupdate-plugin-toggle input[type="checkbox"]').should('be.disabled').should('be.checked');
		cy.get('.autoupdate-theme-toggle input[type="checkbox"]').should('be.disabled').should('be.checked');

	});

	it('Content Settings Work', () => {
		cy.intercept('POST', /hostgator(\/|%2F)v1(\/|%2F)settings/).as('update');

		cy.get('.content-revisions-select select').select('20');
		cy.get('.content-revisions-select select').select('1');
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'Post revision setting saved')
			.should('be.visible');
		cy
			.get('.content-revisions-select label')
			.scrollIntoView()
			.contains('strong', '1')
			.should('be.visible');
		cy
			.get('.content-revisions-setting .components-base-control__help')
			.contains('span', 'Posts will save 1 revision')
			.should('be.visible');

		cy.get('.content-revisions-select select').select('40');
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'Post revision setting saved')
			.should('be.visible');
		cy.get('.content-revisions-select label').contains('span', '40').should('be.visible');
	});

	it('Comment Settings Work', () => {
		cy.intercept('POST', /hostgator(\/|%2F)v1(\/|%2F)settings/).as('update');
		
		cy.get('.disable-comments-toggle input[type="checkbox"]').uncheck();
		cy.get('.close-comments-days-select select').should('be.disabled');
		cy.get('.disable-comments-toggle input[type="checkbox"]').check();
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'Old post comments')
			.should('be.visible');

		cy.get('.close-comments-days-select select').should('not.be.disabled');
		cy.get('.close-comments-days-select select').select('3');
		cy.get('.close-comments-days-select label').contains('span', '3').should('be.visible');
		cy.wait('@update');
		cy
			.get('.edit-site-notices')
			.contains('.components-snackbar__content', 'comments')
			.should('be.visible');

		cy.get('.comments-per-page-select select').select('10');
		cy.get('.comments-per-page-select label').contains('span', '10').should('be.visible');

	});

});
