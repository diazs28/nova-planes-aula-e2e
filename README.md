# Pruebas funcionales E2E — Plataforma NOVA

Automatización con **Cypress** sobre [https://nova.uniautonoma.edu.co](https://nova.uniautonoma.edu.co) (Uniautónoma del Cauca). Incluye el plan de pruebas en [PLAN_PRUEBAS.md](./PLAN_PRUEBAS.md) y 5 suites E2E enfocadas en flujos reales de los distintos módulos de la plataforma.

## Requisitos
- Node.js 22+ y npm
- Para `05-docente-planes-aula.cy.js`: acceso autorizado al rol Docente (token de sesión o credenciales activas)

## Instalación
```bash
npm install
```

## Credenciales (fuera del código)
Las credenciales **no** se escriben en los `.cy.js` ni se suben al repositorio. Copia `.env.example` o crea `cypress.env.json` (ignorado por Git):

```json
{
  "USER": "<correo-institucional>",
  "PASS": "<contraseña>"
}
```
O usando token de sesión:
```json
{
  "TOKEN": "<access_token>"
}
```

## Ejecutar
```bash
npx cypress run     # modo consola: genera video y capturas
npx cypress open    # modo interactivo
```

Para correr solo las pruebas que no requieren sesión docente:
```bash
npx cypress run --spec "cypress/e2e/01-*.cy.js,cypress/e2e/02-*.cy.js,cypress/e2e/03-*.cy.js,cypress/e2e/04-*.cy.js"
```

## Estructura y trazabilidad
| Archivo | Módulos cubiertos |
|---|---|
| `cypress/e2e/01-portal-y-asistente.cy.js` | Portal principal, accesibilidad (`Alt + A`), asistente virtual y políticas |
| `cypress/e2e/02-acceso-y-permisos.cy.js` | Login, recuperación de contraseña, registro y protección de rutas privadas |
| `cypress/e2e/03-pqrs-y-certificados.cy.js` | Radicación PQRS, consulta de radicado, solicitud y consulta de certificados |
| `cypress/e2e/04-servicios-institucionales.cy.js` | Directorio de contactos, manual de usuario, convocatorias y elecciones |
| `cypress/e2e/05-docente-planes-aula.cy.js` | Panel Docente: Planes de Aula (`DEF-01`), Quiz, Mis Tickets y Mi Perfil |

## Notas
- En Windows, si `ELECTRON_RUN_AS_NODE` está definido en la terminal, límpialo antes de ejecutar Cypress (`Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue`).
- Los formularios que alteran datos reales se verifican hasta sus validaciones previas para no ensuciar el entorno de producción.
- La evidencia de ejecución queda en `cypress/videos/` y `cypress/screenshots/`.
