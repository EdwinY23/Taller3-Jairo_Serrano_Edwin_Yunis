# Taller 3 — Tecnología de Grupos

**Gestión de Operaciones · Maestría en Ingeniería Industrial · Universidad del Norte**

**Autores:** Jairo Serrano y Edwin Yunis.

**Docente:** Alcides R. Santander M., PhD.

## Presentación interactiva

**Dashboard para GitHub Pages:** https://edwiny23.github.io/Taller3-Jairo_Serrano_Edwin_Yunis/

**Libro académico navegable:** https://edwiny23.github.io/Taller3-Jairo_Serrano_Edwin_Yunis/book/

**Excel completo de los autores (.xlsx):** https://edwiny23.github.io/Taller3-Jairo_Serrano_Edwin_Yunis/data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx

> La dirección funciona una vez que se habilita GitHub Pages. La conexión de ChatGPT puede escribir en el repositorio, pero no administrar la configuración de GitHub Pages.

## Ampliación: afinidad sectorial y networking

Se conserva la programación Solver original de Jairo Serrano y Edwin Yunis y se agrega una tercera alternativa: **ROC + heurística de utilización por afinidad U**.

| Evaluación | ROC consecutivo | Solver original | Heurística de afinidad U |
|---|---:|---:|---:|
| Asistencias perdidas | **18** | **7** | **7** |
| Interés ponderado perdido P | 12,30 | 3,80 | **3,62** |
| Interés ponderado atendido | 62,02 % | 88,26 % | **88,83 %** |

Los valores nuevos se obtienen desde la matriz original sin redondeos intermedios; el total U es 32,3966204153.

**Archivos nuevos:** [capítulo de networking](book/afinidad.md) · [correlación Spearman CSV](data/correlacion_spearman_sectores.csv) · [utilización U CSV](data/utilizacion_afinidad_U.csv). El [notebook original ampliado](book/verificacion.ipynb) verifica todos los cálculos con SciPy.

La solución original del Solver no se modifica; la tercera propuesta permite valorar la similitud de intereses de los sectores, no solo el número de conferencias que pueden asistir.

## Resultados y comparación final

La exposición presenta primero el ordenamiento binario, luego la optimización y después la metodología **Spearman + utilización U + heurística ROC**. Finalmente, el [capítulo «Resultados y comparación»](book/resultados.md) reúne las tres programaciones y el análisis de afinidad.

| Indicador | ROC consecutivo | Solver | ROC + heurística U |
|---|---:|---:|---:|
| Temáticas programadas | 12 | 12 | 12 |
| Horarios / auditorios por horario | 4 / 3 | 4 / 3 | 4 / 3 |
| Intereses originales | 43 | 43 | 43 |
| Oportunidades aprovechables | 25 | 36 | 36 |
| Asistencias perdidas | **18** | **7** | **7** |
| Interés ponderado perdido P | 12,30 | 3,80 | **3,62** |
| Interés ponderado atendido | 62,02 % | 88,26 % | **88,83 %** |

Spearman identifica diez pares con correlación ≥ 0,50, entre ellos **Minería–Recursos forestales (0,82)**, **Sector Financiero–Administración Pública (0,67)** y **Administración Pública–Educación (0,67)**. Son afinidades de interés y no medidas directas de acuerdos o reuniones.

- **Reducción de pérdidas:** `(18 - 7) / 18 × 100 = 61,11 %`.
- **Cota inferior de pérdidas:** 7; tanto Solver como la heurística de afinidad la alcanzan.
- **Cota inferior ponderada:** 3,6180913422; la heurística de afinidad también la alcanza.
- **Verificación ROC/Solver:** enumeración exacta de **15.400** particiones, de las cuales **72** alcanzan el óptimo en pérdidas.

## Archivos del proyecto

| Archivo / carpeta | Qué contiene |
|---|---|
| [index.html](index.html) | Dashboard responsivo para presentar; funciona en GitHub Pages |
| [assets/style.css](assets/style.css) | Diseño y presentación |
| [assets/app.js](assets/app.js) | Visualizaciones interactivas, filtros y cálculos |
| [data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx](data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx) | **Archivo Excel completo entregado por Jairo Serrano y Edwin Yunis: ROC, fórmulas y hoja Optimizacion con Solver** |
| [data/matriz_intereses.csv](data/matriz_intereses.csv) | Exportación auxiliar para reproducir la matriz en Python; **no sustituye el Excel** |
| [book/index.md](book/index.md) | Introducción del Jupyter Book |
| [book/taller.md](book/taller.md) | Enunciado y supuestos |
| [book/ordenamiento.md](book/ordenamiento.md) | Cálculo del algoritmo de ordenamiento binario |
| [book/optimizacion.md](book/optimizacion.md) | Formulación de programación entera binaria |
| [book/afinidad.md](book/afinidad.md) | Correlación Spearman, utilización U y explicación de la heurística de asignación |
| [book/resultados.md](book/resultados.md) | Capítulo final: Spearman, las tres agendas y comparación con ambos criterios |
| [book/verificacion.ipynb](book/verificacion.ipynb) | Notebook reproducible con Python, NumPy y SciPy (Spearman), optimización y validaciones |
| [book/_config.yml](book/_config.yml), [book/_toc.yml](book/_toc.yml) | Configuración para generar un Jupyter Book |

## Publicar el dashboard con GitHub Pages

En este repositorio:

1. Abrir **Settings → Pages**.
2. En **Build and deployment**, seleccionar **Deploy from a branch**.
3. Elegir **main** y la carpeta **/(root)**.
4. Guardar con **Save**.

El archivo `index.html` está en la raíz de `main`; no hacen falta compilaciones ni servicios externos.

## Generar el Jupyter Book (opcional)

Las fuentes del libro académico también están incluidas. En un entorno local con Python:

```bash
pip install "jupyter-book>=1,<2"
jupyter-book build book
```

Esto compila las páginas Markdown y el notebook en la estructura de Jupyter Book. La web principal que se comparte mediante GitHub Pages es el dashboard estático; el libro permanece disponible como proyecto reproducible dentro de `book/`.

## Procedencia, criterio y límites

- **Fuente de datos:** archivo final de Excel de Jairo Serrano y Edwin Yunis, con las hojas `Hoja1` y `Optimizacion`. La web reproduce exactamente la programación que figura en `Optimizacion!C4:N7`. El archivo `.xlsx` alojado en GitHub conserva los mismos elementos internos que la carga original, recompresos sin alteración.
- **Enunciado:** `Taller 3. Tecnología de Grupos.pdf`, Gestión de Operaciones, profesor Alcides R. Santander M.
- **Marco metodológico:** diapositivas 12 a 15 de `3.1. Integración de Procesos y Distribución física.pdf`.
- **Criterio de optimización:** cada sector puede asistir como grupo a una conferencia por franja, de modo que sus pérdidas son `max(0, intereses simultáneos - 1)`.
- **Limitación:** no se modelan delegaciones que puedan dividirse entre auditorios ni ponderaciones por tamaño de sector, pues el enunciado no las suministra.

El material es académico y los datos no representan observaciones sectoriales fuera del caso del taller.

**© 2026 Jairo Serrano y Edwin Yunis — Trabajo académico.**
