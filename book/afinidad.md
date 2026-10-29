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

Una correlación positiva indica que dos sectores manifiestan patrones similares de interés. El **mapa de calor, los diez pares más afines y su interpretación para networking** se presentan junto con los otros resultados en el [último capítulo, «Resultados y comparación»](resultados.md).

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

### Interpretación de la asignación

La heurística recorre las doce temáticas en el orden ROC y selecciona en cada iteración la franja que genera el menor solapamiento de utilización U, respetando los tres auditorios por horario. La tabla anterior permite reproducir la elección secuencial y el costo acumulado sin redondeos intermedios.

La **programación resultante**, con sus tres auditorios por horario y la comparación con ROC consecutivo y Solver, se presenta en [Resultados y comparación](resultados.md).

## 4. Cómo se mide la conservación del interés ponderado

Para comparar las tres agendas bajo el nuevo criterio se define la variable de asignación binaria \(z_{is}\), igual a 1 si la temática \(i\) se programa en la franja \(s\). La suma de U asignada a un horario menos la temática con mayor U para cada sector representa el interés ponderado perdido.

$$
P=\sum_j\sum_s\left[\sum_i U_{ji}z_{is}-\max_i(U_{ji}z_{is})\right]
$$

$$
\%\mathrm{atendido}=100\left(1-\frac{P}{\sum_{j,i}U_{ji}}\right)
$$

### Cota inferior del criterio ponderado

Un sector con \(d_j>4\) temáticas de interés debe renunciar como mínimo a \(d_j-4\) de ellas. La mejor situación posible sería que perdiera precisamente las de menor valor U:

$$
P^*\ge \sum_j\operatorname{sumaMenores}_{d_j-4}(U_{j,\cdot})
$$

Este procedimiento aporta una segunda evaluación, diferente al número de oportunidades perdidas \(L\). Que dos agendas tengan las mismas pérdidas no implica que conserven la misma cantidad de interés ponderado.

**Los valores calculados, las cotas alcanzadas y la conclusión comparativa de los tres enfoques se reservan para el [capítulo final](resultados.md).**

## 5. Reproducibilidad y fuentes

El [notebook de verificación](verificacion.ipynb) calcula Spearman con scipy.stats.spearmanr(A, axis=1), U y la nueva agenda; valida todos los indicadores sin redondeos intermedios.

El [Excel completo original](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx) permanece sin cambios, con sus ordenamientos y la solución Solver.

**Alcance:** la correlación es similitud descriptiva, no evidencia de colaboración efectiva; esta medida U es una adaptación explícita de los conceptos de tecnología de grupos al networking.
