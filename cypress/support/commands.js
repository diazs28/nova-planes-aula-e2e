// Comandos de apoyo

// Inicia sesión con el rol Docente y reutiliza la sesión entre pruebas y archivos.
// Las credenciales se leen de variables de entorno (o de cypress.env.json), nunca del código:
//   CYPRESS_TOKEN               -> token de acceso de una sesión ya iniciada
//   CYPRESS_USER / CYPRESS_PASS -> inicio de sesión por la pantalla de login
Cypress.Commands.add('login', () => {
  cy.session(
    'docente',
    () => {
      const token = Cypress.env('TOKEN');

      if (token) {
        // La app lee el token de sessionStorage.access_token y el perfil de localStorage.usuario
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
        });
      } else {
        const user = Cypress.env('USER')?.trim();
        const pass = Cypress.env('PASS');
        if (!user || !pass) {
          throw new Error(
            'Faltan credenciales de Cypress. Configura CYPRESS_TOKEN o CYPRESS_USER y CYPRESS_PASS.',
          );
        }

        cy.intercept('POST', '**/api/login/').as('loginDocente');
        cy.visit('/login');
        // Se trabaja dentro del formulario: la barra de navegación también tiene
        // un botón "Ingresar" que no envía las credenciales.
        cy.get('form').within(() => {
          cy.get('#email').clear().type(user, { log: false });
          cy.get('#password').clear().type(pass, { log: false });
          cy.contains('button[type="submit"]', /iniciar sesión/i).click();
        });
        cy.wait('@loginDocente').its('response.statusCode').should('eq', 200);
      }

      cy.location('pathname', { timeout: 15000 }).should('include', '/docente');
      cy.contains('aside button', 'Planes de Aula', { timeout: 12000 }).should('exist');
      // Espera a que la app guarde el perfil antes de guardar la sesión en caché
      cy.window().its('localStorage.usuario', { timeout: 15000 }).should('include', '"rol"');
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.visit('/docente');
        cy.contains('aside button', 'Planes de Aula', { timeout: 12000 }).should('exist');
      },
    },
  );
});

// Navega a un módulo del rol: planes | quiz | tickets | perfil
Cypress.Commands.add('irA', (modulo) => {
  cy.visit(`/docente?s=${modulo}`);
});

// Abre el módulo Planes de Aula y espera el listado
Cypress.Commands.add('abrirPlanes', () => {
  cy.viewport(1280, 800);
  cy.visit('/docente?s=planes');
  cy.contains('Todos los planes de aula', { timeout: 12000 }).should('be.visible');
});
