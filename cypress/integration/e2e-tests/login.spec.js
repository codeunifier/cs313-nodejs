/// <reference types="Cypress" />

context("Login", function () {
    var serverUrl = "http://localhost:3000";

    beforeEach(function () {
        cy.visit(serverUrl + "/login");
        cy.server();
    });

    it('should show error message when invalid login credentials', function () {
        cy.route({
            method: "POST",
            url: serverUrl + "/login",
            response: {
                error: "Error message"
            }
        });

        cy.get("#l_user").type("Testing Fake User");
        cy.get("#l_pass").type("Password");
        cy.get("#loginContainer > button").click();
        
        cy.get("#errorMessage").should("be.visible");
        cy.get("#errorMessage").contains("Error message");
    });

    // it('should redirect to main page with valid login credentials', function () {
    //     cy.route({
    //         method: "POST",
    //         url: serverUrl + "/login",
    //         response: {}
    //     });

    //     cy.get("#l_user").type("Testing Fake User");
    //     cy.get("#l_pass").type("Password");
    //     cy.get("#loginContainer > button").click();

    //     cy.get("#errorMessage").should("not.be.visible");
    // });
});