/// <reference types="Cypress" />

context("Main", function () {
    var serverUrl = "http://localhost:3000";

    function logine2e() {
        var credentials = Cypress.config('loginCredentials');

        cy.get("#l_user").type(credentials.username);
        cy.get("#l_pass").type(credentials.password);
        cy.get("#loginContainer > button").click();
    }

    beforeEach(function () {
        //there has to be a better way of staying logged in - not sure why the session keeps resetting on a refresh
        cy.visit(serverUrl + "/main");
        cy.server();
        logine2e(); 
    });

    it('should load the main page and set user online', function () {
        cy.route('GET', '/conversation', []).as("ConvoRoute");
        cy.route('GET', '/activeusers', []).as("UserRoute");

        //this is set from userLoaded socket listener
        cy.get("#onlineUsersList li").contains("e2e tester").should("exist");
        cy.get("#loginContainer").should("not.exist");
    });

    it('should load another active user', function () {
        cy.route('GET', '/conversation', []);
        cy.route('GET', '/activeusers', [{username: "Another user"}]);
        
        cy.get("#onlineUsersList li:nth-child(1)").invoke('text').then(function (text) {
            expect(text).to.equal("Another user");
        });
        //this is set from userLoaded socket listener
        cy.get("#onlineUsersList li:nth-child(2)").invoke('text').then(function (text) {
            expect(text).to.equal("e2e tester");
        });
    });

    it('should load login page when logout button clicked', function () {
        cy.route('GET', '/conversation', []);
        cy.route('GET', '/activeusers', []);

        cy.get("#logoutButton").click();

        cy.get("#loginContainer").should("exist");
    });
});