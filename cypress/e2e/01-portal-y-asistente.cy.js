describe('Portal principal, accesibilidad y asistente', () => {
  it('muestra la portada institucional y enlaza a los servicios principales', () => {
    cy.visit('/');
    cy.contains('Núcleo de Operaciones Virtuales Académicas').should('be.visible');
    cy.contains('a', 'Iniciar sesión').should('have.attr', 'href', '/login');
    cy.get('a[href="/pqrs"]').should('exist');
    cy.get('a[href="/convocatorias"]').should('exist');
    cy.get('a[href="/consulta"]').should('exist');
    cy.get('a[href="/registro"]').should('exist');
  });

  it('cambia opciones de accesibilidad y las guarda al recargar', () => {
    cy.visit('/');
    cy.get('button[aria-label="Opciones de accesibilidad (Alt + A)"]').click();

    cy.contains('Tamaño de texto').should('be.visible');
    cy.contains('button', 'A++').click();
    cy.contains('button', 'Alto contraste').click();
    cy.contains('button', 'Subrayar enlaces').click();

    cy.window().then((win) => {
      const prefs = JSON.parse(win.localStorage.getItem('a11y_prefs') || '{}');
      expect(prefs.highContrast).to.eq(true);
      expect(prefs.underlineLinks).to.eq(true);
    });

    cy.reload();
    cy.window().then((win) => {
      const prefs = JSON.parse(win.localStorage.getItem('a11y_prefs') || '{}');
      expect(prefs.highContrast).to.eq(true);
      expect(prefs.underlineLinks).to.eq(true);
    });
  });

  it('abre el asistente virtual y muestra accesos y campo de mensaje', () => {
    cy.visit('/');
    cy.get('button[aria-label="Abrir asistente"]').click();

    cy.get('[role="dialog"][aria-label="Asistente virtual NOVA"]').within(() => {
      cy.contains('Hola, soy el asistente de NOVA').scrollIntoView().should('be.visible');
      cy.contains('button', 'Crear un ticket').should('be.visible');
      cy.contains('button', '¿Cómo radico una PQRS?').should('be.visible');
      cy.get('textarea[aria-label="Mensaje para el asistente"]').type('Horario de atención');
      cy.get('textarea[aria-label="Mensaje para el asistente"]').should('have.value', 'Horario de atención');
    });

    cy.get('button[aria-label="Cerrar asistente"]').click();
    cy.get('[role="dialog"][aria-label="Asistente virtual NOVA"]').should('not.exist');
  });

  it('permite preparar sugerencias y navegar a las políticas legales', () => {
    cy.visit('/');
    cy.contains('button', 'Facilidad de uso').click();
    cy.get('#nova-sugerencia').type('Prueba de interfaz sin envío');
    cy.get('#nova-sugerencia').should('have.value', 'Prueba de interfaz sin envío');

    cy.contains('a', 'Política de Tratamiento de Datos').click();
    cy.url().should('include', '/politica-datos');
    cy.go('back');

    cy.contains('a', 'Política PQRS Vigente').click();
    cy.url().should('include', '/politica-pqrs');
  });
});
