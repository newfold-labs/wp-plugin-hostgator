// <reference types="Cypress" />

describe( 'Home page - Webinar Component', function () {
    let webinarurl = 'https://cdn.hiive.space/resources/hostgator_US-webinars.json';

	before( () => {
		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
	} );

    it( 'Webinars section exists and renders properly', () => {
		cy.intercept(
			webinarurl,
			{ fixture: 'webinars.json' }
		);
		cy.reload();

        // Section Exists
		cy.get( '.wppbh-webinars-banner-section' )
			.contains( 'h2', 'Build your brand with WordPress' )
			.scrollIntoView()
			.should( 'be.visible' );

        // Webinar renders properly
		// Title
		cy.get( '.wppbh-webinars-banner-section' )
			.contains( 'h2', 'Build your brand with WordPress' )
			.scrollIntoView()
			.should( 'be.visible' );

		// Description
		cy.get( '.wppbh-webinars-banner-section p:first-of-type' )
			.contains(
				'Join us for a free webinar on how to build your brand with WordPress.'
			)
			.scrollIntoView()
			.should( 'be.visible' );

		// Topics
		cy.get( '.wppbh-webinars-banner-section h3' )
			.contains( 'Topics:' )
			.scrollIntoView()
			.should( 'be.visible' );

		// Date
		cy.get( '.wppbh-webinars-banner-section' )
			.contains( 'August 31, 2040' )
			.scrollIntoView()
			.should( 'be.visible' );

		// Time
		cy.get( '.wppbh-webinars-banner-section' )
			.contains( '1pm - 2pm EST' )
			.scrollIntoView()
			.should( 'be.visible' );

		// CTA
		cy.get( '.wppbh-webinars-banner-section a:first-of-type' )
			.contains( 'Register Now' )
			.scrollIntoView()
			.should( 'be.visible' )
			.should( 'have.attr', 'href' )
			.and(
				'include',
				'https://www.hostgator.com/blog/events/next-event-post'
			);
	} );

	it( "Webinars Section Doesn't Render When Active Propety is False", () => {
		cy.intercept(
			webinarurl,
			{ fixture: 'webinars-inactive.json' }
		);
		cy.reload();
		cy.get( '.wppbh-webinars-banner-section' ).should( 'not.exist' );
	} );

	it( "Webinars Section Doesn't Render Items Are in the Past", () => {
		cy.intercept(
			webinarurl,
			{ fixture: 'webinars-past.json' }
		);
		cy.reload();
		cy.get( '.wppbh-webinars-banner-section' ).should( 'not.exist' );
	} );

});