// Se carga antes de cada archivo de prueba
import './commands';

// Evita que errores no controlados de la app (SPA) tumben la corrida
Cypress.on('uncaught:exception', () => false);
