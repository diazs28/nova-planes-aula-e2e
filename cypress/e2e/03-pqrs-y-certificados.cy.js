describe('Módulo PQRS, consulta de radicado y certificados', () => {
  beforeEach(() => {
    cy.fixture('datos').as('datos');
  });

  it('permite elegir tipo de PQRS, cambiar modalidad y validar campos sin enviar', () => {
    cy.visit('/pqrs');
    cy.contains('Atención y Servicio').should('be.visible');

    ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación'].forEach((tipo) => {
      cy.contains('h3', tipo).scrollIntoView().should('be.visible');
    });

    cy.contains('h3', 'Petición').click();
    cy.get('#asunto').should('be.visible');
    cy.get('#descripcion').should('be.visible');
    cy.get('input[name="modalidadRadicacion"]').should('have.length', 2);

    // Al cambiar a radicación anónima cambia la visibilidad de datos personales
    cy.get('input[name="modalidadRadicacion"]').eq(1).check({ force: true });
    cy.get('#asunto').type('Validación de formulario sin radicar');

    // Sin completar obligatorios ni aceptar la política, el botón permanece deshabilitado
    cy.contains('button[type="submit"]', 'Radicar PQRS Ahora').should('be.disabled');
    cy.url().should('include', '/pqrs');
  });

  it('consulta un radicado inexistente y valida la respuesta de la API', function () {
    cy.intercept('GET', '**/api/pqrs/consultar/**').as('consultaRadicado');

    cy.visit('/consulta');
    cy.get('#radicado').type(this.datos.radicadoInexistente);
    cy.contains('button[type="submit"]', 'Buscar').click();

    cy.wait('@consultaRadicado').then(({ response }) => {
      expect(response.statusCode).to.eq(404);
      expect(response.body.detail).to.include('No existe');
    });
    cy.contains('Radicado no encontrado').should('be.visible');

    cy.contains('a', 'Consultar certificado')
      .should('have.attr', 'href')
      .and('include', '/consulta-certificado');
  });

  it('permite cambiar tipo de certificado y valida obligatorios en solicitud', () => {
    cy.visit('/solicitud-certificados');
    cy.contains('Solicitud de certificados académicos').should('be.visible');

    cy.contains('button', 'Certificado de notas').click();
    cy.get('input[name="certificate_type"]').should('have.value', 'NOTAS');

    cy.contains('button', 'Contenidos programáticos').click();
    cy.get('input[name="certificate_type"]').should('have.value', 'CONTENIDOS');

    cy.get('#programa_academico').type('Ingeniería de Sistemas');
    cy.contains('button[type="submit"]', 'Enviar solicitud').click();
    cy.url().should('include', '/solicitud-certificados');
  });

  it('consulta una solicitud de certificado inexistente y maneja el error', function () {
    cy.intercept('POST', '**/api/pqrs/certificates/consultar/').as('consultarCertificado');

    cy.visit('/consulta-certificado');
    cy.get('#numero_solicitud').type(this.datos.solicitudInexistente);
    cy.get('#correo').type(this.datos.correoPrueba);
    cy.contains('button[type="submit"]', 'Consultar').click();

    cy.wait('@consultarCertificado').its('response.statusCode').should('be.oneOf', [400, 404]);
    cy.contains('No se encontró la solicitud').should('be.visible');
  });
});
