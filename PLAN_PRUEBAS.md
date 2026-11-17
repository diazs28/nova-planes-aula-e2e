# Plan de Pruebas E2E — Plataforma NOVA

**Aplicación bajo prueba:** https://nova.uniautonoma.edu.co/  
**Herramienta:** Cypress 13 (`cypress.config.js`)  
**Alcance:** Validación funcional E2E sobre los módulos públicos, control de acceso y flujo del panel Docente (Planes de Aula, Tickets, Quiz y Perfil).

## 1. Estrategia y criterios

- **Pruebas no destructivas en producción:** los formularios que crean registros reales (radicación de PQRS, registro de usuario, solicitud de certificados, creación de planes de aula y cambio de contraseña) se validan hasta las reglas de obligatoriedad, formato y comportamiento de interfaz, sin confirmar envíos definitivos.
- **Datos y credenciales fuera del código:** las credenciales o tokens se leen desde `cypress.env.json` (ignorado por Git) o variables de entorno (`CYPRESS_USER`, `CYPRESS_PASS`, `CYPRESS_TOKEN`).
- **Prioridad por impacto:** cada archivo cubre múltiples funcionalidades conectadas entre distintos módulos (UI + respuestas HTTP reales de la API + persistencia en navegador).

## 2. Matriz de cobertura por archivo

| Archivo | Módulos cubiertos | Qué valida |
|---|---|---|
| `01-portal-y-asistente.cy.js` | Portal principal, Accesibilidad (`Alt + A`), Asistente virtual, Políticas | Enlaces principales a servicios, persistencia en `localStorage` (`a11y_prefs`) al recargar, apertura/cierre e interacción del diálogo del asistente, preparación de sugerencias y navegación a `/politica-datos` y `/politica-pqrs`. |
| `02-acceso-y-permisos.cy.js` | Login, Recuperación de contraseña, Registro, Guardas de rutas (RBAC) | Validación HTML5 de correo incompleto (`johan.diaz.h@`), respuesta `401` real de `/api/login/`, navegación a `/forgot-password`, carga de `/api/pqrs/geo/departamentos/` en `/registro` y redirección a `/login` al intentar abrir `/docente`, `/estudiante`, `/area`, `/admin`, `/dashboard` y `/perfil` sin sesión. |
| `03-pqrs-y-certificados.cy.js` | PQRS, Consulta de radicado, Solicitud de certificados, Consulta de certificado | Tarjetas P/Q/R/S/F, cambio de modalidad (identificada vs anónima), consulta de radicado inexistente (`404` real en `/api/pqrs/consultar/`), enlace a consulta de certificados, selección de tipos de certificado (`NOTAS`, `CONTENIDOS`) y error `404` en `/api/pqrs/certificates/consultar/`. |
| `04-servicios-institucionales.cy.js` | Directorio de contactos, Manual de usuario, Convocatorias, Elecciones | Carga desde `/api/pqrs/contacts/`, filtrado por dependencia y estado vacío; carga de videos y PDFs en `/manual` (`/api/pqrs/manual-resources/`); redirección a `/convocatorias-app/`; consulta pública de resultados electorales (`/api/elecciones/public/resultados/`). |
| `05-docente-planes-aula.cy.js` | Panel Docente (`Planes de Aula`, `Quiz`, `Mis Tickets`, `Mi Perfil`) | Filtros por búsqueda, estado y cascada Facultad/Programa; verificación de `DEF-01` (contador `Total: X planes` frente a filas filtradas); validación en modal `Nuevo plan` sin guardar datos reales; navegación entre secciones del docente. |

## 3. Criterios de aceptación

- **Aprobado:** todas las aserciones de UI y códigos HTTP esperados pasan en `npx cypress run` con evidencia en `cypress/videos/`.
- **Defecto conocido (`DEF-01`):** en Planes de Aula, el subtítulo `Total: X planes` muestra el total global y no se actualiza al filtrar la tabla.
- **Hallazgos observados durante las pruebas:**
  1. **Credencial suministrada incompleta / inactiva:** el usuario `"johan.diaz.h@"` falla la validación HTML5 de `<input type="email">` por no incluir dominio; al completar `@uniautonoma.edu.co` con la contraseña indicada, `POST /api/login/` responde `401` (`No active account found with the given credentials`). Para ejecutar `05-docente-planes-aula.cy.js` contra producción se requiere un correo/contraseña activo o un `TOKEN` de sesión válido en `cypress.env.json`.
  2. **Catálogo de departamentos vacío en `/registro`:** el endpoint `GET /api/pqrs/geo/departamentos/` responde `200 []`, por lo que los selectores de `Departamento` y `Municipio` no ofrecen opciones en el formulario de registro.
