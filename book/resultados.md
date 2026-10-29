# Resultados y comparación

## Programa derivado del ordenamiento binario

| Horario | Auditorio 1 | Auditorio 2 | Auditorio 3 |
|---|---|---|---|
| 08:00–09:45 | Green Supply Chains | Machine learning | Big Data |
| 10:00–11:45 | Planeación portuaria | Pricing | Tratamiento de aguas |
| 14:00–15:45 | Realidad virtual y aumentada | Simulación | Diseño de Marketplaces |
| 16:00–17:45 | Gestión de Proyectos de Innovación | Sostenibilidad | Transformación digital |

**18 asistencias perdidas; 25 oportunidades aprovechables de 43.**

## Programa óptimo

| Horario | Auditorio 1 | Auditorio 2 | Auditorio 3 |
|---|---|---|---|
| 08:00–09:45 | Machine learning | Tratamiento de aguas | Realidad virtual y aumentada |
| 10:00–11:45 | Transformación digital | Big Data | Gestión de Proyectos de Innovación |
| 14:00–15:45 | Pricing | Simulación | Planeación portuaria |
| 16:00–17:45 | Diseño de Marketplaces | Green Supply Chains | Sostenibilidad |

**7 asistencias perdidas; 36 oportunidades aprovechables de 43.**

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
