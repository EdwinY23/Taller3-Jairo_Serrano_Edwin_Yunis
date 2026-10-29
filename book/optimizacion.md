# Modelo matemático de optimización

## Conjuntos

- `I`: doce sectores empresariales.
- `J`: doce temáticas.
- `H`: cuatro franjas horarias.

## Parámetros

- `a[i,j]`: 1 si el sector i tiene interés en la temática j; 0 en otro caso.
- `C = 3`: auditorios disponibles por franja.

## Variables binarias

```
x[j,h] = 1 si la temática j se programa en el horario h
y[i,h] = 1 si el sector i cuenta con alguna temática de interés en h
```

## Función objetivo

Maximizar las oportunidades de asistencia aprovechables:

```
Maximizar Z = ∑(i∈I) ∑(h∈H) y[i,h]
```

Equivalentemente se minimiza `L = 43 - Z`, porque existen 43 intereses.

## Restricciones

**Una franja por temática:**

```
∑(h∈H) x[j,h] = 1                      para cada j
```

**Tres conferencias por franja:**

```
∑(j∈J) x[j,h] = 3                      para cada h
```

**Una asistencia posible solo si existe interés:**

```
y[i,h] ≤ ∑(j∈J) a[i,j] · x[j,h]        para cada i,h
```

**Dominio:**

```
x[j,h], y[i,h] ∈ {0,1}
```

Este es un modelo de programación lineal entera binaria. En Excel Solver se puede resolver con **Simplex LP**, marcando ambas familias de variables como binarias.

## Aclaración sobre el objetivo

No minimizamos el número de pares de conferencias simultáneas con intereses compartidos, sino el número de **oportunidades de asistencia perdidas**. Para un sector interesado en tres conferencias simultáneas, esta medida registra dos pérdidas, no tres pares de conflicto.

## Prueba de optimalidad

Si el sector `i` tiene `d[i]` temáticas de interés, y solamente hay cuatro horarios, la cantidad de pérdidas inevitable para él es al menos:

```
max(0, d[i] - 4)
```

Los sectores que superan los cuatro intereses son:

| Sector | Intereses | Pérdidas mínimas |
|---|---:|---:|
| Agroindustria | 6 | 2 |
| Producción Textil | 6 | 2 |
| Transporte | 5 | 1 |
| Turismo | 5 | 1 |
| Manufactura | 5 | 1 |

Por lo tanto, `L ≥ 7`. La programación propuesta logra **L = 7**, por lo que es globalmente óptima bajo el objetivo establecido.

La enumeración exhaustiva independiente de las 15.400 particiones no etiquetadas en cuatro grupos de tres produjo un mínimo de 7 y 72 agrupaciones óptimas.
