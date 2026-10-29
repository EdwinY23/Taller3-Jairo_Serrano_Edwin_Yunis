# Afinidad entre sectores y networking

**Taller 3 · Gestión de Operaciones · Jairo Serrano y Edwin Yunis.**

Esta ampliación complementa la solución del ordenamiento binario y la del Solver con un enfoque dirigido a conservar temáticas de interés compartido y facilitar la interacción entre sectores empresariales.

## 1. Correlación de Spearman

Cada sector se representa por su vector binario de doce temáticas; la correlación se obtiene asignando rangos medios a los empates y correlacionando dichos rangos.

$$
R_{ji}=\#\{x<a_{ji}\}+\frac{\#\{x=a_{ji}\}+1}{2}
$$

$$
\rho_{jk}=\frac{\sum_i(R_{ji}-\bar R_j)(R_{ki}-\bar R_k)}{\sqrt{\sum_i(R_{ji}-\bar R_j)^2\sum_i(R_{ki}-\bar R_k)^2}}
$$

Para datos binarios, el coeficiente anterior coincide con phi:

$$
\rho_{jk}=\frac{n_{11}n_{00}-n_{10}n_{01}}{\sqrt{n_{1\bullet}n_{0\bullet}n_{\bullet1}n_{\bullet0}}}
$$

**Atención:** la expresión simplificada de Spearman que no corrige empates no sirve para estos vectores con respuestas 0–1.

Agroindustria–Energía presenta tres coincidencias positivas y seis coincidencias negativas:

$$
\rho_{\mathrm{Agro,Energía}}=\frac{18}{\sqrt{972}}\approx0{,}5774
$$

Los principales pares son: Minería–Recursos forestales (0,82), Financiero–Adm. Pública (0,67), Adm. Pública–Educación (0,67), Agro–Energía (0,58), Turismo–Educación (0,53), Turismo–Financiero (0,53), Energía–Industria Química (0,52), Agro–Transporte (0,51), Manufactura–Textil (0,51) y Textil–Transporte (0,51).

[Matriz completa de correlación de Spearman (CSV)](../data/correlacion_spearman_sectores.csv).

## 2. Utilización por afinidad U

$$
\rho^+_{jk}=\max(0,\rho_{jk}), \qquad \rho^+_{jj}=1
$$

$$
U_{ji}=a_{ji}\frac{\sum_k\rho^+_{jk}a_{ki}}{\sum_k\rho^+_{jk}}
$$

La utilización U es una **medida propuesta de interés compartido**, no la utilización productiva de máquinas de la clase. Para Agroindustria el denominador es aproximadamente 2,39: U(Green Supply Chains)=1,00; U(Machine learning)=0,87; U(Tratamiento de aguas)=0,42.

$$
\sum_{j,i}U_{ji}=32{,}3966204153\approx32{,}40
$$

[Matriz U por sector y temática con totales (CSV)](../data/utilizacion_afinidad_U.csv).

## 3. Heurística de asignación

Adaptando el paso de asignación de Single Pass, se recorren las temáticas en el orden ROC, se evalúa el costo marginal para cada franja con menos de tres conferencias y se elige la menor alternativa. Ante un empate se elige la primera.

$$
c_{is}=\sum_j\min\left(U_{ji},\max_{k\in s}U_{jk}\right)
$$

| Paso | Temática | Franja | Costo marginal |
|---:|---|:---:|---:|
| 1 | Green Supply Chains | S1 | 0,00 |
| 2 | Machine learning | S2 | 0,00 |
| 3 | Big Data | S3 | 0,00 |
| 4 | Planeación portuaria | S4 | 0,00 |
| 5 | Pricing | S3 | 0,63 |
| 6 | Tratamiento de aguas | S1 | 0,42 |
| 7 | Realidad virtual y aumentada | S4 | 0,55 |
| 8 | Simulación | S3 | 0,56 |
| 9 | Diseño de Marketplaces | S2 | 0,63 |
| 10 | Gestión de Proyectos de Innovación | S2 | 0,46 |
| 11 | Sostenibilidad | S4 | 0,37 |
| 12 | Transformación digital | S1 | 0,00 |

**Costo acumulado exacto:** 3,6180913422.

### Programación de la tercera solución

| Horario | Auditorio 1 | Auditorio 2 | Auditorio 3 | Pérdidas |
|---|---|---|---|---:|
| 08:00–09:45 | Green Supply Chains | Tratamiento de aguas | Transformación digital | 1 |
| 10:00–11:45 | Machine learning | Marketplaces | Gestión de Proyectos | 2 |
| 14:00–15:45 | Big Data | Pricing | Simulación | 2 |
| 16:00–17:45 | Planeación portuaria | Realidad virtual y aumentada | Sostenibilidad | 2 |

## 4. Tercera evaluación

$$
P=\sum_j\sum_s\left[\sum_iU_{ji}z_{is}-\max_i(U_{ji}z_{is})\right]
$$

$$
\%\mathrm{atendido}=100\left(1-\frac{P}{\sum_{j,i}U_{ji}}\right)
$$

| Agenda | Asistencias perdidas | P | Interés ponderado atendido |
|---|---:|---:|---:|
| ROC agrupado consecutivamente | 18 | 12,30 | 62,02 % |
| Solver original de Edwin | 7 | **3,80** | 88,26 % |
| ROC + heurística de afinidad de Jairo | 7 | **3,62** | **88,83 %** |
| Cota inferior | 7 | 3,62 | — |

El valor exacto para Solver es 3,8032088383, en lugar de los 4,00 que aparecen en la propuesta inicial. Se utiliza el cálculo sin redondeo para permitir una comparación rigurosa.

### Prueba de optimalidad ponderada

Cada sector con más de cuatro temáticas perderá por lo menos sus (d_j−4) utilizaciones más bajas:

$$
P^*\ge\sum_j\operatorname{sumaMenores}_{d_j-4}(U_{j,\cdot})=3{,}6180913422
$$

La heurística alcanza esa cota: además de conservar el mínimo de siete oportunidades perdidas, minimiza el interés ponderado perdido en este caso. El Solver original **también sigue siendo óptimo** para las siete pérdidas, pero conserva una cantidad ligeramente menor de interés ponderado.

## 5. Reproducibilidad y fuentes

El [notebook de verificación](verificacion.ipynb) calcula Spearman con scipy.stats.spearmanr(A, axis=1), U y la nueva agenda; valida todos los indicadores sin redondeos intermedios.

El [Excel completo original](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx) permanece sin cambios, con sus ordenamientos y la solución Solver.

**Alcance:** la correlación es similitud descriptiva, no evidencia de colaboración efectiva; esta medida U es una adaptación explícita de los conceptos de tecnología de grupos al networking.
