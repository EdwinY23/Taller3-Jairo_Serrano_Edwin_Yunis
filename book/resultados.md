# Resultados y comparación

## Programa derivado del ordenamiento binario

| Horario | Auditorio 1 | Auditorio 2 | Auditorio 3 |
|---|---|---|---|
| 08:00–09:45 | Green Supply Chains | Machine learning | Big Data |
| 10:00–11:45 | Planeación portuaria | Pricing | Tratamiento de aguas |
| 14:00–15:45 | Realidad virtual y aumentada | Simulación | Diseño de Marketplaces |
| 16:00–17:45 | Gestión de Proyectos de Innovación | Sostenibilidad | Transformación digital |

**18 asistencias perdidas; 25 oportunidades aprovechables de 43.**

## Programa óptimo encontrado por Solver en el Excel final de los autores

La programación que se presenta aquí corresponde **literalmente** a la asignación de variables binarias de la hoja `Optimizacion` del archivo `Taller 3 - Jairo Serrano - Edwin Yunis(1).xlsx`. No se sustituye por otra solución equivalente.

| Horario | Auditorio 1 | Auditorio 2 | Auditorio 3 | Oportunidades perdidas |
|---|---|---|---|---:|
| 08:00–09:45 | Transformación digital | Green Supply Chains | Sostenibilidad | 1 |
| 10:00–11:45 | Machine learning | Big Data | Simulación | 4 |
| 14:00–15:45 | Gestión de Proyectos de Innovación | Diseño de Marketplaces | Planeación portuaria | 1 |
| 16:00–17:45 | Tratamiento de aguas | Realidad virtual y aumentada | Pricing | 1 |
| **Total** | | | | **7** |

**7 oportunidades de asistencia perdidas; 36 aprovechables de 43.**

La misma solución aparece en las celdas `C4:N7` de `Optimizacion` y en el resumen final `H24=36` y `M24=7`. La reducción frente al ordenamiento binario figura en `H27=61,11 %`.

> Nota de comprobación: en la hoja `Optimizacion`, los rótulos de los sectores de `B12:B23` no coinciden fila por fila con las referencias de `SUMPRODUCT` dirigidas a `Hoja1!C4:N15`. El **total agregado** de 36 y 7 sí es correcto porque se utilizan todas las filas de la matriz original; sin embargo, los valores **por sector** deben atribuirse según `Hoja1!B4:B15` y no según los rótulos desfasados de aquella tabla. El dashboard calcula esos detalles directamente desde los sectores correctos de la matriz inicial.

## Comparación

| Métrica | ROC | Óptimo |
|---|---:|---:|
| Intereses de origen | 43 | 43 |
| Oportunidades aprovechables | 25 | 36 |
| Asistencias perdidas | 18 | 7 |
| Aprovechamiento | 58,14 % | 83,72 % |
| Reducción de pérdidas respecto a ROC | — | 61,11 % |

```
Reducción = (18 - 7) / 18 × 100 = 61,11 %
```

## Consideraciones

- Hay **12 conferencias** y **12 combinaciones auditorio–horario** disponibles; todas deben ocuparse.
- El ROC genera una matriz con grupos de interés; el agrupamiento en tres columnas es una regla añadida para formar horarios.
- La optimización respeta explícitamente la capacidad por franja y maximiza oportunidades de asistencia.
- No es posible lograr cero pérdidas sin ampliar el número de franjas, modificar el programa o permitir que un sector se divida entre auditorios.

**Autores:** Jairo Serrano y Edwin Yunis, Universidad del Norte.
