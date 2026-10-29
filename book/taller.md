# Enunciado y datos de entrada

El Taller 3, «Tecnología de Grupos», de **Gestión de Operaciones**, propone organizar una rueda de negocios entre sectores colombianos y potenciales aliados internacionales. Las empresas seleccionan temáticas mediante una matriz de interés binaria.

## Conjuntos y parámetros

- **12 sectores:** Agroindustria, Producción Textil, Transporte, Energía, Minería, Recursos forestales, Turismo, Educación, Sector Financiero, Administración Pública, Manufactura e Industria Química.
- **12 temáticas:** Machine learning, Tratamiento de aguas, Transformación digital, Big Data, Realidad virtual y aumentada, Gestión de Proyectos de Innovación, Pricing, Simulación, Diseño de Marketplaces, Green Supply Chains, Sostenibilidad y Planeación portuaria.
- **4 horarios:** 08:00–09:45, 10:00–11:45, 14:00–15:45, 16:00–17:45.
- **3 auditorios:** tres conferencias en paralelo por franja.

La matriz `a[i,j]` contiene **1** si el sector `i` manifestó interés en la temática `j` y **0** en caso contrario. La suma de sus elementos es **43**.

La fuente principal es el [Excel final completo de Jairo Serrano y Edwin Yunis](../data/Taller_3_Jairo_Serrano_Edwin_Yunis.xlsx), que incluye las matrices de ordenamiento binario, las fórmulas de Excel y la solución Solver. Para reproducir el cuaderno Python sin procesar Excel se incluye también una exportación auxiliar a [CSV](../data/matriz_intereses.csv).

## Objetivo operativo

Reducir los cruces horarios entre conferencias que interesan al mismo sector, para mejorar la asistencia simultáneamente posible.

El enunciado solicita contrastar la propuesta derivada del **algoritmo de ordenamiento binario** con una obtenida mediante un **modelo de optimización**.

## Supuesto indispensable

Se considera un representante o grupo de representantes por sector, con capacidad de asistir conjuntamente a una temática por horario. El problema no proporciona tamaños de delegaciones ni participación múltiple dentro de un mismo sector.

La cantidad de auditorios es igual a la de conferencias por franja; dentro de una franja el auditorio específico no cambia la cantidad de cruces.

**Fuente:** «Taller 3. Tecnología de Grupos.pdf», profesor Alcides R. Santander, Universidad del Norte; matriz 0–1 trabajada por Jairo Serrano y Edwin Yunis.
