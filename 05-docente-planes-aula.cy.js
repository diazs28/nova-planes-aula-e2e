describe('Panel docente: Planes de Aula, Tickets, Quiz y Perfil', () => {
  beforeEach(() => {
    cy.fixture('datos').as('datos');
    cy.login();
  });

  it('filtra planes de aula por búsqueda, estado y facultad y verifica el contador Total (DEF-01)', function () {
    cy.abrirPlanes();

    cy.get('input[placeholder*="Buscar por curso"]').should('be.visible');
    cy.contains('label', 'Estado').parent().find('select').as('filtroEstado');
    cy.contains('label', 'Facultad').parent().find('select').as('filtroFacultad');
    cy.contains('label', 'Programa').parent().find('select').as('filtroPrograma');

    // Programa inicia deshabilitado hasta elegir una facultad
    cy.get('@filtroPrograma').should('be.disabled');

    // Busca un término inexistente y comprueba que "Total: X planes" refleja el filtro (DEF-01 si sigue mostrando el total global)
    cy.get('input[placeholder*="Buscar por curso"]').type(this.datos.busquedaInexistente);
    cy.contains(/^Total:\s*0\s*planes$/i).should('be.visible');

    cy.contains('button', 'Limpiar').click();
    cy.get('@filtroEstado').select('revision');
    cy.get('@filtroEstado').should('have.value', 'revision');
  });

  it('abre el modal de nuevo plan y valida campos sin alterar datos de producción', () => {
    cy.abrirPlanes();
    cy.contains('button', 'Nuevo plan').click();
    cy.contains(/curso|asignatura/i).should('be.visible');

    // Intenta guardar sin elegir curso para comprobar validación
    cy.contains('button[type="submit"]', /guardar|crear/i).click();
    cy.contains(/selecciona un curso/i).should('be.visible');
  });

  it('navega entre las secciones del docente: Quiz, Mis Tickets y Mi Perfil', () => {
    cy.visit('/docente');

    cy.visit('/docente?s=quiz');
    cy.contains('QuimeQuiz').should('be.visible');
    cy.contains('button', 'Unirme').click();
    cy.contains('Únete a un quiz como participante').should('be.visible');

    cy.visit('/docente?s=tickets');
    cy.contains(/tickets/i).should('be.visible');

    cy.visit('/docente?s=perfil');
    cy.contains('Cambiar contraseña').should('be.visible');
  });
});
