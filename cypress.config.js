const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // URL de la aplicación asignada
    baseUrl: 'https://nova.uniautonoma.edu.co',
    specPattern: 'cypress/e2e/**/*.cy.js',
    defaultCommandTimeout: 8000,
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      // El token/credenciales se inyectan por variables de entorno (CYPRESS_TOKEN, etc.)
      return config;
    },
  },
});
