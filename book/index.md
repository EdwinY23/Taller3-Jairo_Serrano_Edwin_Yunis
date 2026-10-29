# Tecnología de Grupos: programación de conferencias

**Taller 3 · Gestión de Operaciones · Universidad del Norte**

**Autores:** Jairo Serrano y Edwin Yunis.

Este libro documenta el desarrollo conjunto del taller del profesor **Alcides R. Santander M.** Se parte de una matriz binaria de intereses de **12 sectores y 12 temáticas** y se programan conferencias en **4 franjas y 3 auditorios**, con dos criterios de evaluación: oportunidades de asistencia y conservación del interés ponderado por afinidad.

La presentación mantiene tres alternativas de programación:

- **Ordenamiento binario (ROC):** agrupación consecutiva de las columnas ordenadas, tres por horario.
- **Optimización con Solver:** asignación binaria que minimiza las oportunidades de asistencia perdidas.
- **ROC + heurística de afinidad U:** asignación siguiendo el orden ROC y minimizando el solapamiento ponderado; utiliza como insumo la correlación de **Spearman** entre sectores.

> Spearman no representa una cuarta programación. Es una herramienta estadística para medir similitudes entre sectores, que permite construir la matriz de utilización U empleada por la tercera alternativa.

**Dashboard interactivo:** [Abrir la presentación](../index.html).

**Archivo Excel original de los autores:** [Descargar el libro de trabajo completo (.xlsx)](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx). Contiene las hojas `Hoja1` y `Optimizacion`, con las fórmulas, el ordenamiento binario y la solución obtenida mediante Solver.

## Orden recomendado para estudiar y exponer

1. **Enunciado y datos:** sectores, temáticas, matriz binaria y restricciones de horario.
2. **Ordenamiento binario:** pesos, reordenamientos, agrupamiento y construcción de la primera agenda.
3. **Modelo de optimización:** variables, función objetivo, restricciones y obtención de la segunda agenda con Solver.
4. **Afinidad · Spearman y networking:** correlaciones, utilización U, adaptación de Single Pass y procedimiento de asignación de la tercera agenda.
5. **Verificación reproducible:** notebook de Python con la búsqueda exacta, Spearman, las matrices y las tres evaluaciones.
6. **Resultados y comparación:** **último capítulo**; presenta las afinidades de Spearman, los tres horarios obtenidos, sus indicadores y la interpretación conjunta.

[Ir directamente a los resultados y la comparación final de los tres modelos](resultados.md).

> **Alcance del caso:** se supone que cada sector puede aprovechar como grupo una conferencia por franja. La correlación de Spearman identifica afinidad de intereses, no demuestra que se hayan producido relaciones comerciales reales.
