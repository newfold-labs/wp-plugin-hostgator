// <reference types="Cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', (username, password) => {
	cy
		.getCookies()
		.then(cookies => {
			let hasMatch = false;
			cookies.forEach((cookie) => {
				if (cookie.name.substr(0, 20) === 'wordpress_logged_in_') {
					hasMatch = true;
				}
			});
			if (!hasMatch) {
				cy.visit('/wp-login.php').wait(1000);
				cy.get('#user_login').type(username);
				cy.get('#user_pass').type(`${ password }{enter}`);

                // Speed up tests by setting permalink structure once
                cy.setPermalinkStructure();
			}
		});
});

Cypress.Commands.add('setPermalinkStructure', ((structure = '/%postname%/') => {
    cy.exec(`npx wp-env run cli wp rewrite structure "${structure}"`);
}));

Cypress.Commands.add('setRegion', ((region = null) => {
	if ( region === null ) {
		cy.exec(`npx wp-env run cli wp option delete hg_region`).then((result)=>{
			cy.log(result.stdout);
		});
	} else {
    	cy.exec(`npx wp-env run cli wp option update hg_region "${region}"`).then((result)=>{
			cy.log(result.stdout);
		});
	}
}));

Cypress.Commands.add('setLanguage', ((language = '') => {
	// pt_BR, en_US (default)
	if ( language !== '') {
		cy.exec(`npx wp-env run cli wp language core install "${language}"`);
		cy.exec(`npx wp-env run cli wp language core activate "${language}"`);
	}
    cy.exec(`npx wp-env run cli wp option update WPLANG "${language}"`).then((result)=>{
		cy.log(result.stdout);
	});
}));

Cypress.Commands.add('logout', () => {
	cy
		.getCookies()
		.then(
			cookies => {
				cookies.forEach(
					cookie => {
						cy.clearCookie(cookie.name);
					}
				)
			}
		);
});

// Print cypress-axe violations to the terminal
function printAccessibilityViolations(violations) {
	cy.task(
		'log',
		`${violations.length} accessibility violation${
		  violations.length === 1 ? '' : 's'
		} ${violations.length === 1 ? 'was' : 'were'} detected`
	)
	// pluck specific keys to keep the table readable
	const violationData = violations.map(
	({ id, impact, description, nodes }) => ({
		id,
		impact,
		description,
		nodes: nodes.length
	})
	)

	cy.task('table', violationData)
}
  
Cypress.Commands.add( 
	'a11y', 
	(context) => {
		cy.checkA11y(context, null, printAccessibilityViolations, false);
	},
);
