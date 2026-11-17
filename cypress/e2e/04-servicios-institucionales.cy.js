describe('Servicios institucionales: directorio, manual, convocatorias y elecciones', () => {
  beforeEach(() => {
    cy.fixture('datos').as('datos');
  });

  it('carga contactos desde la API, filtra por dependencia y maneja búsqueda vacía', function () {
    cy.intercept('GET', '**/api/pqrs/contacts/**').as('cargarContactos');

    cy.visit('/contactos');
    cy.wait('@cargarContactos').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Directorio de Contactos').should('be.visible');

    cy.get('input[placeholder*="Buscar por nombre"]')
      .type(this.datos.dependenciaContacto)
      .should('have.value', this.datos.dependenciaContacto);
    cy.contains('Planeación').should('be.visible');

    cy.get('input[placeholder*="Buscar por nombre"]')
      .clear()
      .type(this.datos.busquedaInexistente)
      .should('have.value', this.datos.busquedaInexistente);
    cy.contains('No se encontraron contactos con ese criterio').should('be.visible');
  });

  it('carga los recursos del manual de usuario (videos y documentos PDF)', () => {
    cy.intercept('GET', '**/api/pqrs/manual-resources/**').as('cargarManual');

    cy.visit('/manual');
    cy.wait('@cargarManual').its('response.statusCode').should('eq', 200);

    cy.contains('h1', 'Manual de Usuario').should('be.visible');
    cy.contains('h2', 'Videos instructivos').should('be.visible');
    cy.contains('h2', 'Documentos PDF').should('be.visible');
  });

  it('redirige al módulo de convocatorias docentes y muestra información pública', () => {
    cy.visit('/convocatorias');
    cy.url().should('include', '/convocatorias-app');
    cy.contains('Convocatorias Disponibles', { timeout: 10000 }).should('be.visible');
    cy.contains('Cargos docentes').should('be.visible');
    cy.contains('Documentos requeridos').should('be.visible');
  });

  it('consulta el módulo público de elecciones estudiantiles', () => {
    cy.intercept('GET', '**/api/elecciones/public/resultados/**').as('resultadosElecciones');

    cy.visit('/elecciones/publico');
    cy.wait('@resultadosElecciones').its('response.statusCode').should('be.oneOf', [200, 404]);
    cy.contains('h1', 'Tarjetones y resultados').should('be.visible');
  });
});
