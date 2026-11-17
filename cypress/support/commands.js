Cypress.Commands.add('login', () => {
  cy.session(
    'docente',
    () => {
      const token = Cypress.env('TOKEN');
      if (token) {
        cy.request({
          method: 'GET',
          url: '/api/users/perfil/',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          cy.visit('/');
          cy.window().then((win) => {
            win.sessionStorage.setItem('access_token', token);
            win.localStorage.setItem('_at_shared', token);
            win.localStorage.setItem('usuario', JSON.stringify(res.body));
          });
          cy.visit('/docente');
          cy.contains('aside button', 'Planes de Aula', { timeout: 12000 }).should('exist');
        });
      } else {
        cy.visit('/login');
        cy.get('#email').clear().type(Cypress.env('USER'));
        cy.get('#password').clear().type(Cypress.env('PASS'), { log: false });
        cy.contains('button[type="submit"]', 'Iniciar Sesión').click();
        cy.url().should('include', '/docente');
        cy.contains('aside button', 'Planes de Aula', { timeout: 12000 }).should('exist');
      }
    },
    {
      validate() {
        cy.visit('/docente');
        cy.contains('aside button', 'Planes de Aula', { timeout: 12000 }).should('exist');
      },
    },
  );
});

Cypress.Commands.add('abrirPlanes', () => {
  cy.viewport(1280, 800);
  cy.visit('/docente?s=planes');
  cy.contains('Todos los planes de aula', { timeout: 12000 }).should('be.visible');
});
