// Comandos personalizados

// Inicia sesión del rol Docente reutilizando la sesión entre pruebas.
// El token/credenciales NUNCA van en el código: se leen de variables de entorno.
//   - CYPRESS_TOKEN  -> token de sesión obtenido fuera del código
//   - CYPRESS_USER / CYPRESS_PASS -> login por UI (alternativa)
Cypress.Commands.add('login', () => {
  cy.session('docente', () => {
    const token = Cypress.env('TOKEN');
    if (token) {
      // Opción A: inyectar el token de sesión (ajustar la clave a la que use la app)
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('nova_token', token);
      });
    } else {
      // Opción B: login por interfaz (ajustar selectores a la pantalla de acceso real)
      cy.visit('/login');
      cy.get('input[type="email"], input[name="usuario"]').type(Cypress.env('USER'));
      cy.get('input[type="password"]').type(Cypress.env('PASS'), { log: false });
      cy.contains('button', /ingresar|iniciar/i).click();
      cy.url().should('include', '/docente');
    }
  });
});

// Abre el módulo Planes de Aula
Cypress.Commands.add('abrirPlanes', () => {
  cy.visit('/docente?s=planes');
  cy.contains('Planes de Aula').should('be.visible');
});
