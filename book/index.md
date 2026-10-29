# Tecnología de Grupos: programación de conferencias

**Taller 3 · Gestión de Operaciones · Universidad del Norte**

**Autores:** Jairo Serrano y Edwin Yunis.

Este libro académico documenta el procedimiento del taller del profesor **Alcides R. Santander M.** Se comparan dos métodos para organizar 12 conferencias entre cuatro horarios y tres auditorios, usando los intereses declarados en una matriz binaria por 12 sectores.

**Dashboard interactivo:** [Abrir página principal](../index.html).

**Archivo Excel de los autores:** [Descargar libro de trabajo completo (.xlsx)](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx). Contiene `Hoja1` y `Optimizacion`, con las fórmulas y los valores resueltos de Solver.

## Resultados principales

| Indicador | ROC + agrupación consecutiva | Optimización |
| :-- | --: | --: |
| Conferencias | 12 | 12 |
| Franjas horarias | 4 | 4 |
| Auditorios por franja | 3 | 3 |
| Intereses originales | 43 | 43 |
| Oportunidades de asistencia aprovechables | 25 | 36 |
| Asistencias perdidas | 18 | 7 |

**Reducción de asistencias perdidas:** `(18-7)/18 = 61,11 %`.

## Guía de lectura

- **Enunciado:** contexto, datos y restricciones.
- **Ordenamiento binario:** cómo se organizó la matriz de incidencia original.
- **Optimización:** variables binarias, objetivo y restricciones de la programación.
- **Resultados:** comparación de horarios y prueba de optimalidad.
- **Verificación:** cuaderno de Python con enumeración exacta de asignaciones.

> **Alcance:** los resultados se refieren a un caso académico; se supone que cada grupo sectorial puede asistir a una conferencia por horario y que los auditorios son intercambiables.
