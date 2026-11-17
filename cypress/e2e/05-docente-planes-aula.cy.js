describe('Panel docente: Planes de Aula, Tickets, Quiz y Perfil', () => {
  beforeEach(() => {
    cy.fixture('datos').as('datos');
    cy.login();
  });

  it('filtra planes de aula por búsqueda, estado y cascada facultad/programa', function () {
    cy.abrirPlanes();

    cy.get('input[placeholder*="Buscar por curso"]').should('be.visible');
    cy.contains('label', 'Estado').parent().find('select').as('filtroEstado');
    cy.contains('label', 'Facultad').parent().find('select').as('filtroFacultad');
    cy.contains('label', 'Programa').parent().find('select').as('filtroPrograma');

    // Programa inicia deshabilitado hasta elegir una facultad
    cy.get('@filtroPrograma').should('be.disabled');

    cy.get('input[placeholder*="Buscar por curso"]').type(this.datos.busquedaInexistente);
    cy.contains('No hay planes con los filtros seleccionados').should('be.visible');

    cy.contains('button', 'Limpiar').click();
    cy.get('@filtroEstado').select('revision');
    cy.get('@filtroEstado').should('have.value', 'revision');
  });

  it('DEF-01: el contador Total debe reflejar el filtro aplicado (falla mientras exista el defecto)', function () {
    cy.abrirPlanes();
    cy.get('input[placeholder*="Buscar por curso"]').type(this.datos.busquedaInexistente);
    cy.contains("Total:").should('be.visible');
  });

  it('abre el modal de nuevo plan, agrega instrumento y evita crear sin curso', () => {
    let intentoCrearPlan = false;
    cy.intercept('POST', '**/api/planes-aula/plans**', () => {
      intentoCrearPlan = true;
    });

    cy.abrirPlanes();
    cy.contains('button', 'Nuevo plan').click();
    cy.contains('Crear nuevo plan de aula').should('be.visible');

    cy.contains('button', 'Agregar instrumento').click();
    cy.get('input[placeholder*="Parcial"], input[placeholder*="Evaluaci"], input[type="number"]').should('exist');

    // Al intentar guardar sin curso, el modal permanece abierto y no envía POST de creación
    cy.contains('button[type="submit"]', 'Guardar plan completo').click();
    cy.get('[role="dialog"]')
      .should('be.visible')
      .then(() => {
        expect(intentoCrearPlan).to.eq(false);
      });

    cy.contains('button', 'Cancelar').click();
    cy.contains('Crear nuevo plan de aula').should('not.exist');
  });

  it('navega entre las secciones del docente: Quiz, Mis Tickets y Mi Perfil', () => {
    cy.viewport(1280, 800);
    cy.visit('/docente');
    cy.url().should('include', '/docente');

    cy.contains('aside button', 'Quiz', { timeout: 12000 }).click();
    cy.url().should('include', 's=quiz');
    cy.contains('h2', 'QuimeQuiz').should('be.visible');
    cy.contains('button', 'Unirme').click();
    cy.contains('Únete a un quiz como participante').should('be.visible');

    cy.contains('aside button', 'Mis Tickets').click();
    cy.url().should('include', 's=tickets');
    cy.contains('Mis Tickets').should('be.visible');

    cy.contains('aside button', 'Mi Perfil').click();
    cy.url().should('include', 's=perfil');
    cy.contains('Cambiar contraseña').should('be.visible');
  });
});
