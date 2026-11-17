/// <reference types="cypress" />

describe('Panel docente: Planes de Aula, Tickets, Quiz y Perfil', () => {
  beforeEach(() => {
    cy.fixture('datos').as('datos');
    cy.login();
  });

  it('filtra planes por búsqueda y estado y muestra el estado vacío', function () {
    cy.abrirPlanes();

    cy.get('input[placeholder*="Buscar"]').should('be.visible');
    cy.contains('label', 'Estado').parent().find('select').as('filtroEstado');
    cy.contains('label', 'Programa').parent().find('select').as('filtroPrograma');

    // Programa inicia deshabilitado hasta elegir una facultad
    cy.get('@filtroPrograma').should('be.disabled');

    // Búsqueda sin resultados: la app muestra el estado vacío
    cy.get('input[placeholder*="Buscar"]').type(this.datos.busquedaInexistente);
    cy.contains('No hay planes con los filtros seleccionados').should('be.visible');

    // Limpia y filtra por estado Revisión (valor real de la opción)
    cy.contains('button', 'Limpiar').click();
    cy.get('@filtroEstado').select('revision');
    cy.get('@filtroEstado').should('have.value', 'revision');
    cy.contains(/Revisión/).should('exist');
  });

  it('abre el modal de nuevo plan y no guarda sin curso', () => {
    cy.abrirPlanes();
    cy.contains('button', 'Nuevo plan').click();
    cy.contains('Crear nuevo plan de aula').should('be.visible');
    cy.contains(/Curso\s*\*/).should('exist');
    cy.contains(/Competencia\s*\*/).should('exist');

    // Intenta guardar sin curso: el formulario no se envía (sigue abierto)
    cy.contains('button', /guardar/i).click();
    cy.contains('Crear nuevo plan de aula').should('be.visible');
  });

  it('navega entre Quiz, Mis Tickets y Mi Perfil', () => {
    cy.visit('/docente?s=quiz');
    cy.contains('QuimeQuiz').should('be.visible');
    cy.contains('Unirme').click();
    cy.contains(/Únete a un quiz|Panel del Estudiante/i).should('be.visible');

    cy.visit('/docente?s=tickets');
    cy.contains(/Mis Tickets/i).should('be.visible');

    cy.visit('/docente?s=perfil');
    cy.contains('Cambiar contraseña').should('be.visible');
  });
});
