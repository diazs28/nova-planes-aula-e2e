describe('Acceso, registro, recuperación y protección de rutas', () => {
  it('valida formato de correo y muestra error real ante credenciales inválidas', () => {
    cy.intercept('POST', '**/api/login/').as('loginApi');

    cy.visit('/login');
    cy.get('#email').type('johan.diaz.h@');
    cy.get('#password').type('ClavePrueba123');
    cy.contains('button[type="submit"]', 'Iniciar Sesión').click();

    // El navegador bloquea el envío si falta el dominio después de @
    cy.get('#email').then(($input) => {
      expect($input[0].checkValidity()).to.eq(false);
    });

    cy.get('#email').clear().type('usuario.inexistente@uniautonoma.edu.co');
    cy.contains('button[type="submit"]', 'Iniciar Sesión').click();
    cy.wait('@loginApi').its('response.statusCode').should('be.oneOf', [400, 401]);
    cy.contains(/error de autenticación|no active account|credenciales/i).should('be.visible');
  });

  it('navega a recuperación de contraseña y valida el correo antes de enviar', () => {
    cy.visit('/login');
    cy.contains('a', '¿Olvidó su contraseña?').click();
    cy.url().should('include', '/forgot-password');
    cy.contains('Recuperar contraseña').should('be.visible');

    cy.get('#email').type('correo-invalido');
    cy.contains('button[type="submit"]', 'Enviar enlace de recuperación').click();
    cy.get('#email').then(($input) => {
      expect($input[0].checkValidity()).to.eq(false);
    });

    cy.contains('Volver al inicio de sesión').click();
    cy.url().should('include', '/login');
  });

  it('consulta departamentos en registro y valida contraseñas y campos obligatorios', () => {
    cy.intercept('GET', '**/api/pqrs/geo/departamentos/**').as('departamentos');

    cy.visit('/registro');
    cy.wait('@departamentos').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      cy.get('select[aria-label="Departamento"]').should('be.visible');
      cy.get('select[aria-label="Municipio"]').should('be.visible');
    });

    cy.get('#password').type('ClaveTemporal1!');
    cy.get('#password2').type('OtraClaveDistinta2!');

    // Sin aceptar políticas ni completar obligatorios el botón permanece deshabilitado
    cy.contains('button[type="submit"]', 'Crear Cuenta').should('be.disabled');
    cy.url().should('include', '/registro');
  });

  it('redirige al login cuando se intenta entrar a módulos privados sin sesión', () => {
    const rutasPrivadas = [
      '/docente',
      '/docente?s=planes',
      '/estudiante',
      '/area',
      '/admin',
      '/dashboard',
      '/perfil',
    ];

    rutasPrivadas.forEach((ruta) => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit(ruta);
      cy.url().should('include', '/login');
    });
  });
});
