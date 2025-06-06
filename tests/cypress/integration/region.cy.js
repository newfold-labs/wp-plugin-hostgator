// <reference types="Cypress" />

describe('Regional Adjustments', { testIsolation: true }, () => {

    beforeEach(() => {
        cy.wpLogin();
        // Set up options
        cy.setRegion('BR');
        cy.setBrand('hostgator-latam');
        cy.setLanguage('pt_BR');
        cy.reload();
    });

    it('Web hosting link adjusts for BR', () => {

        cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/home', {
            onBeforeLoad() {
                cy.window().then((win) => {
                    // this is redundant now that the commands are in place
                    win.NewfoldRuntime.plugin.brand = 'hostgator-latam';
                    win.NewfoldRuntime.plugin.region = 'BR';
                });
            }
        });

        cy.get('.hgwp-app-home-sites-action a.nfd-button').should('have.attr', 'href')
            .then(href => {
                expect(href).to.contain('cliente.hostgator.com.br')
            });

    });

    it('Help page content display adjusts for BR', () => {
        cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/help', {
            onBeforeLoad() {
                cy.window().then((win) => {
                    win.NewfoldRuntime.plugin.brand = 'hostgator-latam';
                    win.NewfoldRuntime.plugin.region = 'BR';
                });
            }
        });

        // Phone card does not exist
        cy.get('.card-help-phone').should('not.exist');

        // Twitter card does not exist
        cy.get('.card-help-twitter').should('not.exist');

    });

    it('Help page links adjust for BR', () => {
        cy.visit('/wp-admin/admin.php?page=' + Cypress.env('pluginId') + '#/help', {
            onBeforeLoad() {
                cy.window().then((win) => {
                    win.NewfoldRuntime.plugin.brand = 'hostgator-latam';
                    win.NewfoldRuntime.plugin.region = 'BR';
                });
            }
        });

        // Chat card has PT text and BR link
        cy.get('.card-help-chat').should('exist').contains('.nfd-button', 'Chat ao Vivo');
        cy.get('.card-help-chat .nfd-button').should('have.attr', 'href')
            .then(href => {
                expect(href).to.contain('soporte.hostgator.mx')
            });
    });

    after(() => {
        // Reset Options to defaults
        cy.setRegion();
        cy.setBrand();
        cy.setLanguage();
        cy.reload();
    });
});
