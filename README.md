# Pruebas funcionales E2E — Planes de Aula (rol Docente)

Automatización con **Cypress** de los casos funcionales del rol **Docente** en la aplicación **Planes de Aula** de la plataforma NOVA (Uniautónoma del Cauca). Acompaña al *Informe 1 — Pruebas funcionales* de la auditoría QA.

## Requisitos
- Node.js 22+ y npm
- Acceso autorizado al rol Docente (token de sesión o credenciales de prueba)

## Instalación
```bash
npm install
```

## Credenciales (fuera del código)
Las credenciales **no** se escriben en el código ni se suben al repositorio. Define una de estas opciones:

- **Token de sesión** (opción A): variable `CYPRESS_TOKEN`.
- **Login por UI** (opción B): variables `CYPRESS_USER` y `CYPRESS_PASS`.

En Windows (PowerShell):
```bash
$env:CYPRESS_TOKEN="<token>"
```
En Linux/macOS:
```bash
export CYPRESS_TOKEN="<token>"
```
También puedes crear `cypress.env.json` (está en `.gitignore`):
```json
{ "TOKEN": "<token>" }
```

## Ejecutar
```bash
npx cypress run     # modo consola: genera video y resultados
npx cypress open    # modo interactivo
```

## Estructura y trazabilidad
| Archivo | Casos cubiertos |
|---|---|
| `cypress/e2e/01-listado.cy.js` | CP-F-01, CP-F-02 |
| `cypress/e2e/02-filtros-busqueda.cy.js` | CP-F-03, CP-F-09, DEF-01 |
| `cypress/e2e/03-detalle.cy.js` | CP-F-04 |
| `cypress/e2e/04-crear-plan.cy.js` | CP-F-05, CP-F-06, CP-F-07, CP-F-08, CP-F-10 |
| `cypress/e2e/05-permisos.cy.js` | CP-F-11, CP-F-12 |

## Notas
- Los **selectores** son de partida (basados en la UI observada: `select` de Estado, `input[placeholder*="Buscar"]`, botones “Nuevo plan”, “Guardar”, “Enviar a revisión”). Ajústalos a `data-*` si el equipo de desarrollo los añade, para pruebas más estables.
- El caso `DEF-01` está escrito para **fallar** mientras el defecto exista (el contador “Total” no refleja el filtro); al corregirse, pasará.
- Los casos que **modifican datos reales** (crear/enviar a revisión definitivos) se dejan como verificación de validación, sin confirmar el guardado, para no alterar datos de producción.
- La evidencia de ejecución son los **videos** y **capturas** que Cypress genera en `cypress/videos` y `cypress/screenshots`.
- Reparte el historial de commits por archivo de prueba para reflejar el aporte de cada integrante.
