Cypress.Commands.add('login', () => {
  cy.session('docente', () => {
    const token = Cypress.env('TOKEN');
    if (token) {
      cy.visit('/');
      cy.window().then((win) => {
        win.sessionStorage.setItem('access_token', token);
        win.localStorage.setItem('_at_shared', token);
      });
      cy.visit('/docente');
      cy.url().should('include', '/docente');
    } else {
      cy.visit('/login');
      cy.get('#email').clear().type(Cypress.env('USER'));
      cy.get('#password').clear().type(Cypress.env('PASS'), { log: false });
      cy.contains('button[type="submit"]', 'Iniciar Sesión').click();
      cy.url().should('include', '/docente');
    }
  });
});

Cypress.Commands.add('abrirPlanes', () => {
  cy.visit('/docente?s=planes');
  cy.contains('Planes de Aula').should('be.visible');
});
