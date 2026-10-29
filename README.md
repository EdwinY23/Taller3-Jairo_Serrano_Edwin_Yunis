# Taller 3 — Tecnología de Grupos

**Gestión de Operaciones · Maestría en Ingeniería Industrial · Universidad del Norte**

**Autores:** Jairo Serrano y Edwin Yunis.

**Docente:** Alcides R. Santander M., PhD.

## Presentación interactiva

**Dashboard para GitHub Pages:** https://edwiny23.github.io/Taller3-Jairo_Serrano_Edwin_Yunis/

**Libro académico navegable:** https://edwiny23.github.io/Taller3-Jairo_Serrano_Edwin_Yunis/book/

> La dirección funciona una vez que se habilita GitHub Pages. La conexión de ChatGPT puede escribir en el repositorio, pero no administrar la configuración de GitHub Pages.

## Resultados

| Indicador | Ordenamiento binario + grupos de 3 | Optimización |
|---|---:|---:|
| Temáticas | 12 | 12 |
| Franjas | 4 | 4 |
| Auditorios por franja | 3 | 3 |
| Intereses de la matriz | 43 | 43 |
| Asistencias aprovechables | 25 | 36 |
| Oportunidades perdidas | 18 | **7** |

- **Reducción de pérdidas:** `(18 - 7) / 18 × 100 = 61,11 %`.
- La cota inferior de pérdidas es **7** por los sectores con más de cuatro intereses.
- Se verificó el resultado mediante enumeración exacta de **15.400** particiones; **72** alcanzan el óptimo.

## Archivos del proyecto

| Archivo / carpeta | Qué contiene |
|---|---|
| [index.html](index.html) | Dashboard responsivo para presentar; funciona en GitHub Pages |
| [assets/style.css](assets/style.css) | Diseño y presentación |
| [assets/app.js](assets/app.js) | Visualizaciones interactivas, filtros y cálculos |
| [data/matriz_intereses.csv](data/matriz_intereses.csv) | Transcripción validada de los 43 intereses de la hoja Excel original |
| [book/index.md](book/index.md) | Introducción del Jupyter Book |
| [book/taller.md](book/taller.md) | Enunciado y supuestos |
| [book/ordenamiento.md](book/ordenamiento.md) | Cálculo del algoritmo de ordenamiento binario |
| [book/optimizacion.md](book/optimizacion.md) | Formulación de programación entera binaria |
| [book/resultados.md](book/resultados.md) | Agendas y comparación |
| [book/verificacion.ipynb](book/verificacion.ipynb) | Notebook reproducible sin bibliotecas externas |
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

- **Fuente de datos:** matriz del archivo `Taller 3 - Jairo Serrano - Edwin Yunis.xlsx`, elaborado por los autores a partir del taller.
- **Enunciado:** `Taller 3. Tecnología de Grupos.pdf`, Gestión de Operaciones, profesor Alcides R. Santander M.
- **Marco metodológico:** diapositivas 12 a 15 de `3.1. Integración de Procesos y Distribución física.pdf`.
- **Criterio de optimización:** cada sector puede asistir como grupo a una conferencia por franja, de modo que sus pérdidas son `max(0, intereses simultáneos - 1)`.
- **Limitación:** no se modelan delegaciones que puedan dividirse entre auditorios ni ponderaciones por tamaño de sector, pues el enunciado no las suministra.

El material es académico y los datos no representan observaciones sectoriales fuera del caso del taller.

**© 2026 Jairo Serrano y Edwin Yunis — Trabajo académico.**
