# Taller 5 — Planeación de Operaciones: Clean King

**IIN 7171 · Gestión de Operaciones · Maestría y Doctorado en Ingeniería Industrial · Universidad del Norte**  
**Profesor:** Alcides R. Santander M., Ph.D.  
**Autores:** Jairo Serrano y Edwin Yunis.

## Accesos

- **Dashboard:** [Abrir la presentación en GitHub Pages](https://edwiny23.github.io/Taller3-Jairo_Serrano_Edwin_Yunis/taller5-planeacion-operaciones/).
- **Notebook:** [Ejecutar en Google Colab](https://colab.research.google.com/github/EdwinY23/Taller3-Jairo_Serrano_Edwin_Yunis/blob/main/taller5-planeacion-operaciones/Taller5_Planeacion_CleanKing.ipynb).
- **Modelo PuLP:** [Ver código fuente](modelo_pulp.py).

> **Ubicación del proyecto:** carpeta `taller5-planeacion-operaciones/` dentro del repositorio de GitHub.

## Planteamiento del problema

**Clean King**, empresa de detergentes líquidos con producción en Barranquilla, requiere un plan para atender sus mercados de Barranquilla y Medellín al menor costo, considerando cuatro referencias (CK-1 a CK-4), **seis meses de junio a noviembre**, mezcladoras y turnos, materias primas, muestreo destructivo de calidad, operación, supervisión, dos bodegas y transporte interurbano. Se permiten despachos a Medellín dentro del mismo mes y **no se permite demanda insatisfecha**.

**Observación sobre el horizonte:** aunque el texto inicial menciona diciembre, la tabla solo publica demanda y días hábiles para junio–noviembre (seis columnas). No se inventan datos para diciembre.

## Datos principales

| Parámetro | CK-1 | CK-2 | CK-3 | CK-4 |
|---|---:|---:|---:|---:|
| Tiempo de procesamiento (min/lote) | 40 | 42 | 50 | 57 |
| Materia prima (COP/lote) | 378.000 | 349.000 | 425.000 | 456.000 |
| Producción bruta (cajas/lote) | 100 | 100 | 100 | 100 |
| Muestreo destructivo (cajas/lote) | 4 | 4 | 4 | 4 |
| **Cajas netas aprovechables** | **96** | **96** | **96** | **96** |

Días hábiles: **22, 23, 24, 23, 22, 23**. Efectividad de mezcladoras **83 %**. Seis mezcladoras con hasta dos turnos de ocho horas, supervisores con capacidad de tres mezcladoras, 30 cajas promocionales por mes y referencia para Barranquilla, 50 para Medellín, bodega de 50.000 cajas en Barranquilla y 38.000 en Medellín, camiones de 1.500 cajas con costo fijo de 5.200.000 COP por viaje.

Los vectores completos de demanda, inventario inicial y MAD están en el notebook y en `modelo_pulp.py`.

## Formulación matemática MILP

**Índices:** producto \(p=1,\dots,4\), mes \(t=1,\dots,6\), turno \(s=1,2\).

**Variables:**

- \(L_{pts}\): lotes enteros de referencia \(p\) fabricados en mes \(t\), turno \(s\).
- \(m_{ts}\in\{0,\dots,6\}\): mezcladoras activas en cada mes y turno.
- \(q_{ts}\in\{0,1,2\}\): supervisores del turno.
- \(a_{ts}\in\{0,1\}\): activación del turno.
- \(e_t\in\{0,\dots,6\}\): mezcladoras diferentes utilizadas por mes (máximo de los turnos).
- \(I^B_{pt},I^M_{pt}\ge0\): inventario entero final de cada referencia por ciudad.
- \(X_{pt}\ge0\): cajas enteras despachadas a Medellín.
- \(V_t\ge0\): viajes enteros a Medellín.

### Función objetivo

Minimizar la suma de los costos de materias primas, operación de mezcladoras, operarios, supervisores, inventarios en Barranquilla, transporte fijo y logística variable de Medellín:

$$
\begin{aligned}
\min C ={}& \sum_{t,p,s} c^{MP}_p L_{pts}
+3.681.000\sum_{t,s}m_{ts}
+4.191.000\sum_t m_{t,2} \\
&+4.320.000\sum_{t,s}q_{ts}
+5.200.000\sum_t V_t
+1.640\sum_{t,p}I^B_{pt}\\
&+\sum_{t,p}\left(0,12\frac{c^{MP}_p}{96}\right)X_{pt}
+\sum_t\left[6(3.600.000)-0,40(3.600.000)(6-e_t)\right].
\end{aligned}
$$

Las variables de inventario, cajas y lotes son enteras, y el modelo está implementado con **PuLP**, como en `Guia.ipynb` del profesor, utilizando `LpProblem`, `LpVariable`, `lpSum`, restricciones y `PULP_CBC_CMD`. El objetivo del código se escala a **millones de COP** para facilitar la resolución numérica.

### Restricciones

**Capacidad disponible por turno (minutos efectivos):**

$$\sum_p\tau_pL_{pts}\le 480\,d_t(0,83)m_{ts}\qquad\forall t,s.$$

**Encendido de turno, supervisión y límite de equipos:**

$$a_{ts}\le m_{ts}\le 6a_{ts},\qquad m_{ts}\le 3q_{ts},\qquad a_{ts}\le q_{ts}\le 2a_{ts}.$$

**Mezcladoras distintas usadas en el mes:**

$$e_t\ge m_{t1},\quad e_t\ge m_{t2},\quad e_t\le m_{t1}+m_{t2}.$$

**Balance de Barranquilla (96 cajas netas/lote):**

$$I^B_{pt}=I^B_{p,t-1}+96\sum_sL_{pts}-X_{pt}-D^B_{pt}-30.$$

**Balance de Medellín:**

$$I^M_{pt}=I^M_{p,t-1}+X_{pt}-D^M_{pt}-50.$$

**Capacidad de bodegas y despachos:**

$$\sum_p I^B_{pt}\le50.000,\quad\sum_p I^M_{pt}\le38.000,\quad\sum_p X_{pt}\le1.500V_t.$$

Todos los inventarios son no negativos: se garantiza el 100 % de la demanda y de las muestras promocionales. Los inventarios iniciales son los publicados para cada una de las ocho combinaciones ciudad-producto.

## Solución de referencia — escenario base

Se resolvió una versión equivalente del MILP con **SciPy/HiGHS** para validar de forma independiente el modelo y obtener una solución inicial reproducible. El notebook principal utiliza **PuLP/CBC**, por lo que puede producir una distribución diferente y con costo muy cercano: existen soluciones enteras alternativas prácticamente equivalentes.

**Costo verificado de referencia: 5.251.851.475 COP.** Brecha relativa **0,00944 %**, inferior al 0,01 %. Es una solución **factible de alta precisión**; no se afirma optimalidad exacta con brecha positiva.

| Mes | Mezcladoras turno 1 | Mezcladoras turno 2 | Turnos activos | Viajes Medellín | Inventario final BQ | Inventario final MDE |
|---|---:|---:|---:|---:|---:|---:|
| Junio | 6 | 2 | 2 | 51 | 15 | 22.095 |
| Julio | 6 | 0 | 1 | 17 | 19 | 395 |
| Agosto | 6 | 0 | 1 | 30 | 43 | 5.695 |
| Septiembre | 6 | 2 | 2 | 41 | 0 | 1.218 |
| Octubre | 6 | 3 | 2 | 48 | 72 | 16.018 |
| Noviembre | 6 | 3 | 2 | 38 | 0 | 190 |

- Cajas utilizables fabricadas: **832.704**; cajas destruidas QC: **34.696**.
- Viajes a Medellín: **225** durante el horizonte.
- Los seis operarios de planta son requeridos al menos en un turno en cada mes: **0 operarios reasignables de jornada completa** en esta solución base.
- La capacidad no aprovechada de los turnos activos está medida y disponible mes a mes en el CSV y el dashboard.
- Los balances de inventario **Barranquilla/Medellín** de las 4 referencias × 6 meses presentan residuo **0**.

### Desglose total de costos (COP)

| Categoría | Costo |
|---|---:|
| Materias primas | 3.502.056.000 |
| Transporte fijo por camiones | 1.170.000.000 |
| Mezcladoras por turno | 169.326.000 |
| Distribución variable Medellín (12 %) | 169.595.115 |
| Operarios fijos imputados | 129.600.000 |
| Supervisores | 69.120.000 |
| Operarios segundo turno | 41.910.000 |
| Inventario Barranquilla | 244.360 |
| **Total** | **5.251.851.475** |

## Supuestos de costeo

1. El cargo **3.681.000 COP por mezcladora y turno** se interpreta como costo mensual por máquina operativa en el turno, no por cada día.
2. Se imputan los seis salarios base mensuales; por mezcladora totalmente inactiva en el mes se descuenta el **40 %** de su salario (cubierto por la otra dependencia).
3. Cada mezcladora utilizada en el **segundo turno** requiere un costo de operador de **4.191.000 COP al mes**, adicional al costo fijo de la primera dotación.
4. Cada supervisor activo por turno cuesta **4.320.000 COP mensuales**.
5. El **12 %** de logística variable para Medellín se aplica al **costo directo de materia prima por caja neta**: 0,12 × costo lote/96 × cajas despachadas. El enunciado no establece otra asignación completa de costos indirectos por caja.
6. La capacidad se asigna por mezcla total de lotes **agregada por turno y mes**, no como un programa de secuenciamiento lote por lote para cada mezcladora.
7. El MAD es conocido, pero sin nivel de servicio no define por sí mismo el inventario de seguridad: `k_mad=0` en la base. Se incorpora un escenario opcional `IB,IM ≥ ceil(k_mad × MAD)`.

**Estas convenciones NO aparecen especificadas por completo en el PDF y se explicitan para que el resultado pueda replicarse y revisarse académicamente.**

## Archivos

| Archivo | Contenido |
|---|---|
| [`Taller5_Planeacion_CleanKing.ipynb`](Taller5_Planeacion_CleanKing.ipynb) | Notebook de Colab con fases identificadas por títulos, modelo PuLP/CBC, reportes, gráficos y comprobaciones |
| [`modelo_pulp.py`](modelo_pulp.py) | Código fuente modular equivalente al notebook |
| [`material/Guia_profesor_original.ipynb`](material/Guia_profesor_original.ipynb) | Copia de la guía del profesor aportada al taller |
| [`data/resumen_mensual.csv`](data/resumen_mensual.csv) | Mezcladoras/turnos, trabajadores reasignables, transporte, bodegas y capacidad libre |
| [`data/detalle_por_producto.csv`](data/detalle_por_producto.csv) | Lotes por CK/mes/turno, inventarios, despachos y balances |
| [`data/desglose_costos.csv`](data/desglose_costos.csv) | Costos por categoría y mes |
| [`data/resultado_referencia.json`](data/resultado_referencia.json) | Solución de referencia del MILP en SciPy/HiGHS |
| [`index.html`](index.html) y [`assets/`](assets/) | Dashboard estático que se despliega automáticamente en GitHub Pages |

## Ejecución

En **Google Colab** basta abrir el [notebook](https://colab.research.google.com/github/EdwinY23/Taller3-Jairo_Serrano_Edwin_Yunis/blob/main/taller5-planeacion-operaciones/Taller5_Planeacion_CleanKing.ipynb) y seleccionar **Entorno de ejecución → Ejecutar todas**. El primer bloque instala `pulp[cbc]` y los demás ejecutan el modelo, verifican restricciones y permiten exportar CSV.

En local:

```bash
python -m pip install "pulp[cbc]" pandas matplotlib
python modelo_pulp.py --tiempo 180 --brecha 0.0001 --salida resultados
```

Para sensibilidad al MAD, usar `--k-mad 1.0` después de resolver el caso base. **No es un requisito impuesto por el enunciado.**

## Fuentes del desarrollo

- **Alcides R. Santander M.** *Taller 5. Planeación de Operaciones*, IIN 7171, Universidad del Norte, páginas 1–3 (documento entregado con el ejercicio).
- **Guia.ipynb**, código de referencia del profesor con PuLP, modelo agregado de planeación de operaciones (archivo entregado con el ejercicio).

