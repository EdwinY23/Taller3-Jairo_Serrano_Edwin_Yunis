"""Taller 5 Planeación GOP — Clean King. Adaptación verificable de Guia.ipynb.

Autoría: solución académica basada en el taller del profesor Alcides R. Santander.
Dependencias: pulp (CBC), pandas. Para ejecutar: python modelo_pulp.py
Unidades: variables físicas en lotes/cajas/minutos; costos en millones de COP.
"""
from __future__ import annotations
import math
from pathlib import Path
import argparse

# Modelo basado en PuLP, como la guía docente; se corrigieron llamadas antiguas
# (LpProblem.add_variable -> LpVariable y COIN_CMD -> PULP_CBC_CMD).
import pulp as lp
import pandas as pd

PRODUCTOS = ('CK-1', 'CK-2', 'CK-3', 'CK-4')
MESES = ('Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre')
T = range(6)
P = range(4)
S = (0, 1)  # 0: 06:00-14:00, 1: 14:00-22:00
DIAS = [22, 23, 24, 23, 22, 23]
MIN_LOTE = [40, 42, 50, 57]
MP_LOTE = [378000, 349000, 425000, 456000]
DEMANDA_B = [
    [28000, 30000, 24000, 29000, 26000, 32000],
    [15000, 17000, 13000, 18000, 16000, 19000],
    [12000, 14000, 11000, 14000, 13000, 16000],
    [25000, 28000, 21000, 27000, 29000, 34000],
]
DEMANDA_M = [
    [18000, 9000, 9500, 10000, 11000, 13000],
    [15000, 15500, 6000, 19500, 17500, 18000],
    [14000, 14500, 15000, 15500, 16500, 17500],
    [17000, 8000, 9000, 20000, 12000, 24000],
]
INICIAL_B = [2770, 1580, 3140, 8121]
INICIAL_M = [3150, 665, 3890, 2090]
MAD_B = [2650, 935, 1210, 2100]
MAD_M = [125, 321, 268, 297]

# Conversión: 500 litros / 0.5 litros por botella / 10 botellas por caja
CAJAS_BRUTAS_LOTE = 100
CAJAS_DESTRUIDAS_QC = 4
CAJAS_NETAS_LOTE = 96
EFECTIVIDAD = 0.83
CAP_BODEGA_B = 50000
CAP_BODEGA_M = 38000
CAP_CAMION = 1500
C_OPER_T1 = 3600000
C_OPER_T2 = 4191000
C_SUPERVISOR = 1.2 * C_OPER_T1
C_MEZCLADORA_TURNO = 3681000
C_CAMION = 5200000
C_MANT_B = 1640
RECARGO_DISTRIBUCION_M = 0.12
PORCENTAJE_SALARIO_CUBIERTO_POR_OTRA_AREA = 0.40


def construir_modelo(k_mad: float = 0.0):
    """Crea MILP. k_mad=0: base sin stock de seguridad no especificado.

    k_mad>0: sensibilidad con inventario final >= ceil(k_mad * MAD) por ciudad/SKU.
    MAD no determina por sí solo una política de servicio; este es un supuesto opcional.
    """
    if k_mad < 0:
        raise ValueError('k_mad debe ser no negativo')

    modelo = lp.LpProblem('Clean_King_Planeacion_6_Meses', lp.LpMinimize)
    # Conservamos la nomenclatura de diccionarios por mes de la guía,
    # ampliada por producto, turno y ciudad.
    L = {(p,t,s): lp.LpVariable(f'L_{p}_{t}_{s+1}', lowBound=0, cat='Integer')
         for p in P for t in T for s in S}  # lotes
    M = {(t,s): lp.LpVariable(f'M_{t}_{s+1}', lowBound=0, upBound=6, cat='Integer')
         for t in T for s in S}  # mezcladoras por turno
    Q = {(t,s): lp.LpVariable(f'Q_{t}_{s+1}', lowBound=0, upBound=2, cat='Integer')
         for t in T for s in S}  # supervisores
    A = {(t,s): lp.LpVariable(f'A_{t}_{s+1}', lowBound=0, upBound=1, cat='Binary')
         for t in T for s in S}  # turnos activados
    E = {t: lp.LpVariable(f'E_{t}', lowBound=0, upBound=6, cat='Integer') for t in T}
    V = {t: lp.LpVariable(f'V_{t}', lowBound=0, cat='Integer') for t in T}  # viajes
    IB = {(p,t): lp.LpVariable(f'IB_{p}_{t}', lowBound=0, cat='Integer') for p in P for t in T}
    IM = {(p,t): lp.LpVariable(f'IM_{p}_{t}', lowBound=0, cat='Integer') for p in P for t in T}
    X = {(p,t): lp.LpVariable(f'X_{p}_{t}', lowBound=0, cat='Integer') for p in P for t in T}

    # Costos expresados en millones COP, para mejorar el escalamiento del solver.
    # Se reconoce el 40% de salario por mezcladora inactiva como asumido por otra área.
    costo_operadores_fijos = lp.lpSum(
        (6*C_OPER_T1 - (6-E[t])*PORCENTAJE_SALARIO_CUBIERTO_POR_OTRA_AREA*C_OPER_T1)/1e6
        for t in T
    )
    costo_mezcladoras = lp.lpSum(C_MEZCLADORA_TURNO/1e6 * M[t,s] for t in T for s in S)
    costo_segundo_turno = lp.lpSum(C_OPER_T2/1e6 * M[t,1] for t in T)
    costo_supervisores = lp.lpSum(C_SUPERVISOR/1e6 * Q[t,s] for t in T for s in S)
    costo_materia_prima = lp.lpSum(MP_LOTE[p]/1e6 * L[p,t,s] for p in P for t in T for s in S)
    costo_viajes = lp.lpSum(C_CAMION/1e6 * V[t] for t in T)
    costo_distribucion = lp.lpSum(
        (RECARGO_DISTRIBUCION_M*MP_LOTE[p]/CAJAS_NETAS_LOTE/1e6)*X[p,t] for p in P for t in T
    )
    costo_inventario_B = lp.lpSum(C_MANT_B/1e6*IB[p,t] for p in P for t in T)

    modelo += (costo_operadores_fijos+costo_mezcladoras+costo_segundo_turno+
               costo_supervisores+costo_materia_prima+costo_viajes+
               costo_distribucion+costo_inventario_B), 'Costo_Total_Millones_COP'

    for t in T:
        for s in S:
            # 8 h/día, efectividad 83%; todas las mezcladoras son intercambiables.
            modelo += lp.lpSum(MIN_LOTE[p]*L[p,t,s] for p in P) <= DIAS[t]*480*EFECTIVIDAD*M[t,s], f'Capacidad_{t}_{s}'
            modelo += M[t,s] <= 6*A[t,s], f'Turno_Abierto_U_{t}_{s}'
            modelo += M[t,s] >= A[t,s], f'Turno_Abierto_L_{t}_{s}'
            modelo += M[t,s] <= 3*Q[t,s], f'Cobertura_Supervisores_{t}_{s}'
            modelo += Q[t,s] >= A[t,s], f'Supervisores_Minimos_{t}_{s}'
            modelo += Q[t,s] <= 2*A[t,s], f'Supervisores_Cierre_{t}_{s}'
            # E es número de mezcladoras utilizadas al menos un turno en el mes.
            modelo += E[t] >= M[t,s], f'Equipos_Mes_{t}_{s}'
        modelo += E[t] <= M[t,0]+M[t,1], f'Equipos_No_Fantasmas_{t}'
        modelo += lp.lpSum(X[p,t] for p in P) <= CAP_CAMION*V[t], f'Transporte_{t}'
        modelo += lp.lpSum(IB[p,t] for p in P) <= CAP_BODEGA_B, f'Bodega_B_{t}'
        modelo += lp.lpSum(IM[p,t] for p in P) <= CAP_BODEGA_M, f'Bodega_M_{t}'
        for p in P:
            anterior_B = INICIAL_B[p] if t==0 else IB[p,t-1]
            anterior_M = INICIAL_M[p] if t==0 else IM[p,t-1]
            prod_neta = CAJAS_NETAS_LOTE*lp.lpSum(L[p,t,s] for s in S)
            modelo += IB[p,t] == anterior_B+prod_neta-X[p,t]-(DEMANDA_B[p][t]+30), f'Balance_B_{p}_{t}'
            modelo += IM[p,t] == anterior_M+X[p,t]-(DEMANDA_M[p][t]+50), f'Balance_M_{p}_{t}'
            if k_mad > 0:
                modelo += IB[p,t] >= math.ceil(k_mad*MAD_B[p]), f'Safety_B_{p}_{t}'
                modelo += IM[p,t] >= math.ceil(k_mad*MAD_M[p]), f'Safety_M_{p}_{t}'

    v={'L':L,'M':M,'Q':Q,'A':A,'E':E,'V':V,'IB':IB,'IM':IM,'X':X}
    return modelo,v


def resolver(k_mad: float=0.0, tiempo: int=180, tolerancia: float=0.0001, mensaje: bool=False):
    modelo,v=construir_modelo(k_mad)
    solucionador=lp.PULP_CBC_CMD(msg=mensaje, timeLimit=tiempo, gapRel=tolerancia)
    estatus=modelo.solve(solucionador)
    estado=lp.LpStatus[estatus]
    if estado not in ('Optimal','Integer Feasible'):
        raise RuntimeError(f'El solucionador no alcanzó una solución MILP aceptable. Estado: {estado}')
    if any(lp.value(x) is None for x in modelo.variables()):
        raise RuntimeError('Hay variables sin valores: revisar la solución del optimizador')
    return modelo,v,estado


def extraer_tablas(modelo,v):
    """Extrae resultados y audita los dos balances por SKU/mes.

    Devolver dataframes de resumen, detalle y costos. Evita confundir lotes con cajas.
    """
    def n(name,*key):return int(round(lp.value(v[name][tuple(key) if name not in ('E','V') else key[0]])))
    mensual, detalle, costos=[],[],[]
    prevB=INICIAL_B[:]
    prevM=INICIAL_M[:]
    for t in T:
        lotes_total=sum(n('L',p,t,s) for p in P for s in S)
        disponible=[n('M',t,s)*DIAS[t]*480*EFECTIVIDAD for s in S]
        usado=[sum(MIN_LOTE[p]*n('L',p,t,s) for p in P) for s in S]
        assert all(usado[s] <= disponible[s]+1e-4 for s in S)
        sal_fijos=6*C_OPER_T1-(6-n('E',t))*PORCENTAJE_SALARIO_CUBIERTO_POR_OTRA_AREA*C_OPER_T1
        component={
            'Materia prima':sum(MP_LOTE[p]*sum(n('L',p,t,s) for s in S) for p in P),
            'Mezcladoras por turno':C_MEZCLADORA_TURNO*sum(n('M',t,s) for s in S),
            'Operarios fijos netos':sal_fijos,
            'Operarios segundo turno':C_OPER_T2*n('M',t,1),
            'Supervisores':C_SUPERVISOR*sum(n('Q',t,s) for s in S),
            'Transporte fijo':C_CAMION*n('V',t),
            'Distribución variable Medellín (12%)':sum(RECARGO_DISTRIBUCION_M*MP_LOTE[p]/CAJAS_NETAS_LOTE*n('X',p,t) for p in P),
            'Inventario Barranquilla':C_MANT_B*sum(n('IB',p,t) for p in P),
        }
        for cat,costo in component.items():costos.append({'Mes':MESES[t],'Categoría':cat,'Costo_COP':round(costo,2)})
        mensual.append({
            'Mes':MESES[t],'Días_hábiles':DIAS[t],
            'Lotes_producidos':lotes_total,'Cajas_brutas':100*lotes_total,
            'Cajas_QC_destructivas':4*lotes_total,'Cajas_utilizables':96*lotes_total,
            'Demanda_B_mas_muestras':sum(DEMANDA_B[p][t]+30 for p in P),
            'Demanda_M_mas_muestras':sum(DEMANDA_M[p][t]+50 for p in P),
            'Mezcladoras_turno_1':n('M',t,0),'Mezcladoras_turno_2':n('M',t,1),
            'Turnos_activos':sum(n('A',t,s) for s in S),
            'Supervisores_turno_1':n('Q',t,0),'Supervisores_turno_2':n('Q',t,1),
            'Mezcladoras_utilizadas_mes':n('E',t),'Operarios_reasignables_mes':6-n('E',t),
            'Viajes_medellin':n('V',t),'Cajas_despachadas_medellin':sum(n('X',p,t) for p in P),
            'Inventario_final_B':sum(n('IB',p,t) for p in P),'Inventario_final_M':sum(n('IM',p,t) for p in P),
            'Minutos_productivos_turno_1':usado[0], 'Minutos_disponibles_turno_1':round(disponible[0],2),
            'Capacidad_no_aprovechada_min_turno_1':round(disponible[0]-usado[0],2),
            'Minutos_productivos_turno_2':usado[1], 'Minutos_disponibles_turno_2':round(disponible[1],2),
            'Capacidad_no_aprovechada_min_turno_2':round(disponible[1]-usado[1],2),
            'Costo_mensual_COP':round(sum(component.values()),2),
        })
        assert sum(n('X',p,t) for p in P) <= CAP_CAMION*n('V',t)
        assert sum(n('IB',p,t) for p in P) <= CAP_BODEGA_B
        assert sum(n('IM',p,t) for p in P) <= CAP_BODEGA_M
        for p in P:
            lotes=sum(n('L',p,t,s) for s in S)
            ib,im,env=n('IB',p,t),n('IM',p,t),n('X',p,t)
            balB=prevB[p]+96*lotes-env-(DEMANDA_B[p][t]+30)-ib
            balM=prevM[p]+env-(DEMANDA_M[p][t]+50)-im
            assert balB==0 and balM==0, f'Descuadre {MESES[t]} CK-{p+1}: {balB}, {balM}'
            detalle.append({'Mes':MESES[t],'Referencia':PRODUCTOS[p],
                'Lotes_turno_1':n('L',p,t,0),'Lotes_turno_2':n('L',p,t,1),
                'Lotes_totales':lotes,'Producción_bruta_cajas':100*lotes,
                'Muestras_QC_destruidas':4*lotes,'Producción_utilizable_cajas':96*lotes,
                'Demanda_B_mas_muestras':DEMANDA_B[p][t]+30,
                'Demanda_M_mas_muestras':DEMANDA_M[p][t]+50,
                'Despacho_medellin_cajas':env,'Inventario_final_B':ib,
                'Inventario_final_M':im,'Balance_B_0':balB,'Balance_M_0':balM})
            prevB[p],prevM[p]=ib,im
    resumen=pd.DataFrame(mensual)
    data=pd.DataFrame(detalle)
    costos_df=pd.DataFrame(costos)
    assert abs(resumen['Costo_mensual_COP'].sum()-lp.value(modelo.objective)*1e6) < 1e-2
    return resumen,data,costos_df


def exportar(resumen,detalle,costos,carpeta='resultados'):
    carpeta=Path(carpeta);carpeta.mkdir(parents=True,exist_ok=True)
    for name,df in [('resumen_mensual.csv',resumen),('detalle_por_producto.csv',detalle),('desglose_costos.csv',costos)]:
        df.to_csv(carpeta/name,sep=',',index=False,encoding='utf-8-sig')
    return carpeta

if __name__=='__main__':
    parser=argparse.ArgumentParser(description='Planeación MILP Clean King')
    parser.add_argument('--k-mad',type=float,default=0)
    parser.add_argument('--tiempo',type=int,default=180)
    parser.add_argument('--brecha',type=float,default=0.0001)
    parser.add_argument('--salida',default='resultados')
    args=parser.parse_args()
    print('Modelo original de guía extendido a Clean King (6 meses).')
    modelo,v,estado=resolver(args.k_mad,args.tiempo,args.brecha,mensaje=False)
    print('Estado CBC:',estado,'Costo total COP:',round(lp.value(modelo.objective)*1e6,2))
    resumen,detalle,costos=extraer_tablas(modelo,v)
    exportar(resumen,detalle,costos,args.salida)
    print(resumen[['Mes','Mezcladoras_turno_1','Mezcladoras_turno_2','Turnos_activos','Viajes_medellin','Operarios_reasignables_mes','Costo_mensual_COP']].to_string(index=False))
