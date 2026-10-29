# Resultados y comparación de las tres programaciones

**Taller 3 · Tecnología de Grupos · Gestión de Operaciones**

**Autores:** Jairo Serrano y Edwin Yunis.

En los capítulos anteriores se desarrollaron tres propuestas: **ordenamiento binario (ROC) con agrupamiento consecutivo**, **optimización mediante Solver** y **ROC con heurística de afinidad U**. Aquí se reúnen sus resultados y se comparan con dos indicadores complementarios: la cantidad de oportunidades de asistencia perdidas y la conservación del interés ponderado de los sectores.

## 1. Datos comunes y criterios de evaluación

El caso comprende **12 sectores económicos**, **12 temáticas**, **4 franjas horarias**, **3 auditorios** por franja y **43 relaciones de interés** registradas en la matriz original.

### Indicador 1: oportunidades de asistencia perdidas

Si un sector desea asistir a varias conferencias simultáneas, solo puede aprovechar una en esa franja:

$$
L=\sum_i\sum_h\max\left(0,\sum_j a_{ij}x_{jh}-1\right)
$$

Las oportunidades potencialmente aprovechables se calculan como **43 − L**. Esta medida es el criterio original utilizado tanto para evaluar ROC como para optimizar con Solver.

### Indicador 2: interés ponderado perdido por afinidad

La tercera evaluación utiliza la matriz \(U\), construida a partir de **Spearman** entre sectores. Para una agenda \(z\), el interés ponderado que no puede aprovecharse es:

$$
P=\sum_j\sum_s\left[\sum_iU_{ji}z_{is}-\max_i(U_{ji}z_{is})\right]
$$

$$
\%\mathrm{atendido}=100\left(1-\frac{P}{\sum_{j,i}U_{ji}}\right)
$$

El total de la matriz es:

$$
\sum_{j,i}U_{ji}=32{,}3966204153
$$

**Interpretación:** \(L\) cuenta oportunidades perdidas sin ponderarlas; \(P\) distingue cuáles de esas temáticas tienen mayor interés compartido entre sectores afines. **Spearman no es una cuarta agenda**, sino la base estadística de la tercera alternativa.

---

## 2. Resultados de Spearman: sectores con mayor afinidad

La correlación de Spearman se calculó usando los doce vectores binarios de interés, con **rangos promedio ante empates**; para estos datos coincide con el coeficiente phi. El signo y la magnitud de \(\rho\) describen semejanzas en el patrón de temáticas elegidas.

La siguiente tabla muestra los **diez pares de sectores con correlación \(\rho\ge0{,}50\)**, ordenados de mayor a menor.

| Sectores con intereses compartidos | Correlación de Spearman |
|---|---:|
| Minería – Recursos forestales | **0,82** |
| Sector Financiero – Administración Pública | **0,67** |
| Administración Pública – Educación | **0,67** |
| Agroindustria – Energía | **0,58** |
| Turismo – Sector Financiero | **0,53** |
| Turismo – Educación | **0,53** |
| Energía – Industria Química | **0,52** |
| Agroindustria – Transporte | **0,51** |
| Manufactura – Producción Textil | **0,51** |
| Producción Textil – Transporte | **0,51** |

Un ejemplo es **Agroindustria y Energía**, que comparten tres temáticas de interés y obtienen:

$$
\rho_{\mathrm{Agro,Energía}}=\frac{18}{\sqrt{972}}\approx0{,}5774
$$

**Lectura para networking:** estos pares representan sectores con preferencias temáticas similares y, por tanto, posibles grupos de interacción en las conferencias. El resultado identifica **potencial de encuentro**, no confirma que exista colaboración o que se haya generado una relación comercial.

**Consulta completa:** [abrir el mapa de calor de correlaciones 12 × 12](../index.html#spearman) o [descargar la matriz Spearman en CSV](../data/correlacion_spearman_sectores.csv). La matriz está organizada en el orden ROC, para facilitar la comparación con el agrupamiento de la primera metodología.

---

## 3. Resultados de las tres propuestas de programación

Las siguientes tablas conservan las cuatro franjas y las doce temáticas de la matriz de entrada. Cada fila corresponde a tres conferencias simultáneas: una por auditorio.

### Propuesta 1. Ordenamiento binario y agrupamiento consecutivo

Se toman las columnas en el orden obtenido mediante ROC y se distribuyen consecutivamente en grupos de tres. Este método agrupa temáticas según la estructura de afinidades de la matriz, pero **no incorpora directamente la minimización de conflictos** al asignar los horarios.

| Franja | Auditorio 1 | Auditorio 2 | Auditorio 3 | Asistencias perdidas |
|---|---|---|---|---:|
| 08:00–09:45 | Green Supply Chains | Machine learning | Big Data | 7 |
| 10:00–11:45 | Planeación portuaria | Pricing | Tratamiento de aguas | 2 |
| 14:00–15:45 | Realidad virtual y aumentada | Simulación | Diseño de Marketplaces | 6 |
| 16:00–17:45 | Gestión de Proyectos de Innovación | Sostenibilidad | Transformación digital | 3 |
| **Total** | | | | **18** |

**Resultado ROC:** 18 oportunidades de asistencia perdidas y **25 de 43** intereses potencialmente aprovechables.

### Propuesta 2. Optimización mediante Solver

El modelo entero binario asigna una franja única a cada temática, programa exactamente tres conferencias por franja y **minimiza las oportunidades de asistencia perdidas**.

Esta es la programación calculada en la hoja \`Optimizacion\` del [Excel final de los autores](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx); se conserva tal como aparece en el archivo, sin sustituirla por otra solución óptima equivalente.

| Franja | Auditorio 1 | Auditorio 2 | Auditorio 3 | Asistencias perdidas |
|---|---|---|---|---:|
| 08:00–09:45 | Transformación digital | Green Supply Chains | Sostenibilidad | 1 |
| 10:00–11:45 | Machine learning | Big Data | Simulación | 4 |
| 14:00–15:45 | Gestión de Proyectos de Innovación | Diseño de Marketplaces | Planeación portuaria | 1 |
| 16:00–17:45 | Tratamiento de aguas | Realidad virtual y aumentada | Pricing | 1 |
| **Total** | | | | **7** |

**Resultado Solver:** 7 oportunidades perdidas y **36 de 43** intereses potencialmente aprovechables. La solución alcanza la cota inferior de 7 del criterio \(L\).

### Propuesta 3. ROC + heurística de utilización por afinidad U

Primero se calcula **Spearman** para identificar coincidencias entre sectores y construir la matriz \(U\). Después, se recorren las temáticas en el **orden ROC** y cada una se asigna a la franja que genera el **menor solapamiento de utilización ponderada**, respetando la capacidad de tres auditorios. En caso de empate se escoge la primera franja disponible.

| Franja | Auditorio 1 | Auditorio 2 | Auditorio 3 | Asistencias perdidas |
|---|---|---|---|---:|
| 08:00–09:45 | Green Supply Chains | Tratamiento de aguas | Transformación digital | 1 |
| 10:00–11:45 | Machine learning | Diseño de Marketplaces | Gestión de Proyectos de Innovación | 2 |
| 14:00–15:45 | Big Data | Pricing | Simulación | 2 |
| 16:00–17:45 | Planeación portuaria | Realidad virtual y aumentada | Sostenibilidad | 2 |
| **Total** | | | | **7** |

**Resultado ROC + U:** 7 oportunidades perdidas y **36 de 43** intereses aprovechables. Además, esta agenda alcanza el mínimo comprobado de **3,6180913422 unidades de interés ponderado perdido**.

La tabla de las doce iteraciones, la regla de asignación y las fórmulas de \(U\) se encuentran en el [capítulo de afinidad y networking](afinidad.md).

---

## 4. Comparación conjunta de las tres alternativas

### Comparación con el mismo criterio de asistencia

| Indicador | ROC consecutivo | Solver | ROC + heurística U |
|---|---:|---:|---:|
| Temáticas programadas | 12 | 12 | 12 |
| Franjas horarias | 4 | 4 | 4 |
| Auditorios por franja | 3 | 3 | 3 |
| Intereses originalmente registrados | 43 | 43 | 43 |
| Intereses potencialmente aprovechables | **25** | **36** | **36** |
| Oportunidades de asistencia perdidas \(L\) | **18** | **7** | **7** |
| Proporción de oportunidades aprovechables | 58,14 % | 83,72 % | 83,72 % |
| Reducción de pérdidas frente a ROC consecutivo | — | 61,11 % | 61,11 % |

La reducción común frente al agrupamiento consecutivo es:

$$
\frac{18-7}{18}\times100=61{,}11\%
$$

Bajo el criterio **exclusivo de oportunidades de asistencia perdidas**, Solver y la heurística de afinidad **empatan**.

### Comparación con la utilización ponderada por Spearman

| Indicador | ROC consecutivo | Solver | ROC + heurística U |
|---|---:|---:|---:|
| Suma de utilización U de referencia | 32,40 | 32,40 | 32,40 |
| Interés ponderado perdido \(P\) | **12,30** | **3,80** | **3,62** |
| Interés ponderado conservado | 20,09 | 28,59 | **28,78** |
| Porcentaje de interés ponderado atendido | **62,02 %** | **88,26 %** | **88,83 %** |

Los valores proceden de cálculos sin redondeos intermedios:

- ROC consecutivo: \(P=12{,}3037062538\).
- Solver: \(P=3{,}8032088383\).
- ROC + heurística U: \(P=3{,}6180913422\).

El interés conservado se obtiene restando \(P\) del total \(32{,}3966204153\).

**Resultado diferencial:** ambas últimas agendas consiguen siete pérdidas, pero la heurística de afinidad conserva aproximadamente **0,19 unidades adicionales de interés ponderado** y aumenta el porcentaje ponderado atendido en aproximadamente **0,57 puntos porcentuales** respecto a la solución de Solver.

Esto ocurre porque **no todas las oportunidades perdidas tienen el mismo valor U**. Por ejemplo, en la tercera agenda Manufactura conserva Diseño de Marketplaces (U ≈ 0,74) en lugar de sacrificar esa temática mientras mantiene Gestión de Proyectos de Innovación (U ≈ 0,46).

---

## 5. Comprobación de las cotas óptimas

### Cota de asistencias perdidas

Algunos sectores presentan más de cuatro intereses, pero solo existen cuatro franjas. Como máximo pueden atender una temática por franja.

| Sector | Intereses | Pérdidas mínimas |
|---|---:|---:|
| Agroindustria | 6 | 2 |
| Producción Textil | 6 | 2 |
| Transporte | 5 | 1 |
| Turismo | 5 | 1 |
| Manufactura | 5 | 1 |
| **Total mínimo** | | **7** |

$$
L^*\ge \sum_i\max(0,d_i-4)=2+2+1+1+1=7
$$

Tanto Solver como ROC + heurística U alcanzan exactamente esa cota y son **óptimos para el criterio de asistencias perdidas**.

### Cota de interés ponderado perdido

Para un sector con más de cuatro intereses, incluso en la mejor distribución debe perder al menos sus \(d_j-4\) temáticas con menores valores U.

$$
P^*\ge\sum_j\operatorname{sumaMenores}_{d_j-4}(U_{j,\cdot})
=3{,}6180913422
$$

La agenda ROC + heurística U alcanza también esta segunda cota. Por ello, **en este caso concreto es óptima simultáneamente en \(L\) y en \(P\)**, mientras que Solver permanece óptimo para \(L\), pero no alcanza el menor valor de \(P\).

---

## 6. Interpretación final y alcance académico

El análisis presenta **tres enfoques complementarios**:

1. **ROC** identifica patrones en la matriz binaria y proporciona una agrupación inicial de las temáticas, aunque la asignación consecutiva concentra conflictos de horario.
2. **Solver** minimiza explícitamente las oportunidades de asistencia perdidas y demuestra que se pueden conservar 36 de 43 oportunidades.
3. **Spearman + utilización U + heurística ROC** incorpora la semejanza de preferencias entre sectores, conserva el mismo mínimo de pérdidas y protege una mayor cantidad de interés ponderado. Esto ofrece un criterio adicional para diseñar sesiones con **potencial de networking**.

La correlación de Spearman **no prueba por sí sola** que los asistentes efectivamente establezcan contactos o colaboraciones. El indicador U mide intereses compartidos ponderados y no sustituye una medición directa de reuniones, alianzas o resultados comerciales.

**Conclusión:** la tercera alternativa presenta el mejor resultado **para la evaluación ampliada**, sin invalidar la optimalidad del Solver respecto a las oportunidades de asistencia. La comparación demuestra que es posible lograr siete pérdidas con diferentes programaciones, pero conservar cantidades distintas de interés sectorial.

### Archivos para revisar los cálculos

- [Excel original de Jairo Serrano y Edwin Yunis](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx).
- [Correlaciones de Spearman: matriz CSV 12 × 12](../data/correlacion_spearman_sectores.csv).
- [Matriz U de utilización por afinidad: CSV con totales](../data/utilizacion_afinidad_U.csv).
- [Notebook de verificación reproducible](verificacion.ipynb).
- [Dashboard interactivo con mapa de calor y las tres agendas](../index.html).

**Autores:** Jairo Serrano y Edwin Yunis · Universidad del Norte, 2026.
