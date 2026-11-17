/// <reference types="cypress" />

describe('Planes de Aula - Listado e indicadores (Docente)', () => {
  beforeEach(() => {
    cy.login();
    cy.abrirPlanes();
  });

  it('CP-F-01 muestra los indicadores Total, En planeacion y Aprobados', () => {
    cy.contains('Total').should('be.visible');
    cy.contains('En planeación').should('be.visible');
    cy.contains('Aprobados').should('be.visible');
  });

  it('CP-F-02 lista planes y permite paginar', () => {
    cy.contains(/Página \d+ de \d+/).should('be.visible');
    cy.contains('button', 'Siguiente').click();
    cy.contains(/Página 2 de \d+/).should('be.visible');
    cy.contains('button', 'Anterior').click();
    cy.contains(/Página 1 de \d+/).should('be.visible');
  });
});
