# Algoritmo de ordenamiento binario (ROC)

Este método sigue las diapositivas **12–15** de «Integración de Procesos y Distribución física», del profesor Alcides R. Santander.

## Paso 1. Construir la matriz 0–1

Sean `a[i,j]` los registros de interés para los 12 sectores y 12 temáticas. Se conservan las columnas en el orden inicial del archivo Excel.

## Paso 2. Asignar pesos binarios a las columnas

Para 12 columnas, el factor de la posición `j` (comenzando en 1) es:

```
peso_columna(j) = 2^(12-j)
```

Los pesos son `2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1`.

Por ejemplo, Agroindustria marca interés en Machine learning, Tratamiento de aguas, Big Data, Pricing, Green Supply Chains y Planeación portuaria:

```
Puntaje = 2048 + 1024 + 256 + 32 + 4 + 1 = 3365
```

Para una fila de doce intereses en `C4:N4`, con los factores en `C16:N16`, la fórmula de Excel es:

```excel
=SUMAPRODUCTO(C4:N4;$C$16:$N$16)
```

Se ordenan las filas por sus puntuaciones, de mayor a menor.

## Paso 3. Ordenar las columnas

Aplicar el mismo principio a cada columna con pesos sobre las filas, conservando los sectores. Ordenar las columnas en orden descendente de su puntuación.

## Paso 4. Iterar hasta estabilidad

Repetir los pasos 2 y 3 hasta que ninguna fila ni columna cambie de posición.

En el archivo original del equipo, la disposición final de temáticas es:

1. Green Supply Chains
2. Machine learning
3. Big Data
4. Planeación portuaria
5. Pricing
6. Tratamiento de aguas
7. Realidad virtual y aumentada
8. Simulación
9. Diseño de Marketplaces
10. Gestión de Proyectos de Innovación
11. Sostenibilidad
12. Transformación digital

## Paso 5. Derivar una agenda ROC

Como existen tres auditorios por horario, se aplica una **heurística adicional**: agrupar las columnas ordenadas en bloques consecutivos de tres. Cada bloque se asigna a una de las cuatro franjas.

| Horario | Auditorio 1 | Auditorio 2 | Auditorio 3 |
|---|---|---|---|
| 08:00–09:45 | Green Supply Chains | Machine learning | Big Data |
| 10:00–11:45 | Planeación portuaria | Pricing | Tratamiento de aguas |
| 14:00–15:45 | Realidad virtual y aumentada | Simulación | Diseño de Marketplaces |
| 16:00–17:45 | Gestión de Proyectos de Innovación | Sostenibilidad | Transformación digital |

## Paso 6. Evaluar la pérdida de asistencia

Sea `c[i,h]` la cantidad de temáticas de interés del sector `i` programadas en el horario `h`:

```
c[i,h] = ∑ a[i,j]  para j en el horario h
perdida[i,h] = max(0, c[i,h] - 1)
L = ∑ perdidas[i,h]
```

Al aplicar el criterio a la agenda ROC se obtienen **18 asistencias perdidas**.

> La programación por bloques de tres es una regla añadida para producir una agenda. El ROC sirve para agrupar afinidades, pero no garantiza una asignación de horarios que minimice cruces.
