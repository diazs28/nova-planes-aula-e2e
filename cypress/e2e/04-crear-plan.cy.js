/// <reference types="cypress" />

describe('Planes de Aula - Creacion y validaciones (Docente)', () => {
  beforeEach(() => {
    cy.login();
    cy.abrirPlanes();
    cy.contains('button', 'Nuevo plan').click();
    cy.contains('Crear nuevo plan de aula').should('be.visible');
  });

  it('CP-F-05 marca obligatorios Curso y Competencia', () => {
    cy.contains(/Curso\s*\*/).should('exist');
    cy.contains(/Competencia\s*\*/).should('exist');
  });

  it('CP-F-06 autocompleta el Curso por codigo', () => {
    cy.get('input[placeholder*="código o nombre del curso"]').type('CRS-');
    cy.contains(/CRS-/).should('be.visible');
  });

  it('CP-F-07 no permite guardar sin Curso', () => {
    cy.get('textarea[placeholder*="Competencia"]').type('Competencia de prueba');
    cy.contains('button', 'Guardar').click();
    cy.contains('Crear nuevo plan de aula').should('be.visible');
  });

  it('CP-F-08 no permite guardar sin Competencia', () => {
    cy.get('input[placeholder*="código o nombre del curso"]').type('CRS-');
    cy.contains(/CRS-/).first().click();
    cy.contains('button', 'Guardar').click();
    cy.contains('Crear nuevo plan de aula').should('be.visible');
  });

  it('CP-F-10 valida el campo Creditos', () => {
    cy.get('input[type="number"]').type('-5');
    cy.get('input[type="number"]').invoke('val').then((v) => {
      expect(v).to.not.equal('');
    });
  });
});
