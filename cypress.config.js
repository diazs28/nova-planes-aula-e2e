const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // URL de la aplicación asignada
    baseUrl: 'https://nova.uniautonoma.edu.co',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000,
    // Evidencia de ejecución para el informe (cypress/videos y cypress/screenshots)
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
  },
});
