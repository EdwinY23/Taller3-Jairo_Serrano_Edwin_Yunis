
'use strict';
// Ampliación aditiva: Spearman, utilización U, heurística y tercera evaluación.
// Se reutiliza A, TOPICS, SECTORS y SCHEDULES desde app.js; no se cambian los resultados previos.
const AFF_ROC_SECTORS=[0,2,1,3,10,11,4,5,6,7,8,9];
const AFF_ROC_TOPICS=[9,0,3,11,6,1,4,7,8,5,10,2];
const AFF_SHORT=['Agroindustria','Transporte','Prod. Textil','Energía','Manufactura','Ind. Química','Minería','Rec. forestales','Turismo','Educación','Sec. Financiero','Adm. Pública'];
const AFF_TOPICS_SHORT=['Green SC','Machine learning','Big Data','Portuaria','Pricing','Aguas','RV / RA','Simulación','Marketplaces','GPI','Sostenibilidad','Transf. digital'];
function affSpearman(i,k){
  if(i===k)return 1;
  let n11=0,n10=0,n01=0,n00=0;
  for(let t=0;t<12;t++){const a=A[i][t],b=A[k][t];if(a&&b)n11++;else if(a)n10++;else if(b)n01++;else n00++}
  const den=Math.sqrt((n11+n10)*(n00+n01)*(n11+n01)*(n00+n10));
  return den===0?null:(n11*n00-n10*n01)/den;
}
const AFF_RHO=A.map((_,j)=>A.map((__,k)=>affSpearman(j,k)));
const AFF_POS=AFF_RHO.map((row,j)=>row.map((v,k)=>j===k?1:Math.max(v??0,0)));
const AFF_DEN=AFF_POS.map(row=>row.reduce((a,b)=>a+b,0));
const AFF_U=A.map((row,j)=>row.map((v,i)=>v*AFF_POS[j].reduce((s,p,k)=>s+p*A[k][i],0)/AFF_DEN[j]));
const AFF_TOTAL=AFF_U.flat().reduce((s,x)=>s+x,0);
function affLoss(schedule){return schedule.reduce((total,slot)=>total+AFF_U.reduce((s,row)=>s+slot.reduce((a,t)=>a+row[t],0)-Math.max(...slot.map(t=>row[t])),0),0)}
function affCost(t,group){if(!group.length)return 0;return AFF_U.reduce((s,row)=>s+Math.min(row[t],Math.max(...group.map(k=>row[k]))),0)}
function affGreedy(){
 const slots=[[],[],[],[]],steps=[];
 AFF_ROC_TOPICS.forEach((topic,idx)=>{
   let chosen=-1, best=Infinity;const costs=slots.map(group=>group.length<3?affCost(topic,group):null);
   costs.forEach((v,s)=>{if(v!==null&&v<best-1e-10){best=v;chosen=s}});
   if(chosen<0)throw new Error('No quedan franjas disponibles');
   slots[chosen].push(topic);
   steps.push({n:idx+1,topic,slot:chosen,cost:best,cumulative:0,choices:costs});
 });
 let accum=0;steps.forEach(step=>{accum+=step.cost;step.cumulative=accum});
 return {slots,steps};
}
const AFF_GREEDY=affGreedy();
const AFF_MIN=AFF_U.reduce((s,row,j)=>{
 const v=row.filter((x,t)=>A[j][t]);v.sort((a,b)=>a-b);
 const required=Math.max(0,v.length-4);return s+v.slice(0,required).reduce((x,y)=>x+y,0)},0);
function affFormat(v,n=2){return Number(v).toFixed(n).replace('.',',')}
function affColor(v){
 // divergente: azul negativo, blanco para cero, naranja positivo
 const base=v<0?[62,111,187]:[220,122,61],t=Math.min(1,Math.abs(v));
 const rgb=base.map(c=>Math.round(255*(1-t)+c*t));
 return 'rgb('+rgb.join(',')+')';
}
function affContrast(v){return Math.abs(v)>=0.58?'#fff':'#21344d'}
function affBuildHeatmap(){
 const header=AFF_ROC_SECTORS.map((j,pos)=>'<th title="'+SECTORS[j]+'">'+AFF_SHORT[pos]+'</th>').join('');
 const rows=AFF_ROC_SECTORS.map((j,r)=>'<tr><th>'+AFF_SHORT[r]+'</th>'+AFF_ROC_SECTORS.map(k=>{
   const value=AFF_RHO[j][k];
   return '<td class="aff-m-cell" title="'+SECTORS[j]+' / '+SECTORS[k]+': '+affFormat(value,5)+'" style="background:'+affColor(value)+';color:'+affContrast(value)+'">'+affFormat(value)+'</td>';
 }).join('')+'</tr>').join('');
 document.getElementById('aff-spearman').innerHTML='<table class="aff-matrix"><thead><tr><th>Sector</th>'+header+'</tr></thead><tbody>'+rows+'</tbody></table>';
}
function affBuildU(){
 const head=AFF_TOPICS_SHORT.map(name=>'<th title="'+name+'">'+name+'</th>').join('');
 const colSums=AFF_ROC_TOPICS.map(t=>AFF_U.reduce((s,row)=>s+row[t],0));
 const rows=AFF_ROC_SECTORS.map((j,r)=>'<tr><th>'+AFF_SHORT[r]+'</th>'+AFF_ROC_TOPICS.map(t=>{
  const v=AFF_U[j][t];return '<td class="'+(v>0?'aff-u-active':'')+'" title="'+SECTORS[j]+' · '+TOPICS[t]+' = '+affFormat(v,6)+'">'+(v===0?'·':affFormat(v))+'</td>';
 }).join('')+'<td class="aff-total">'+affFormat(AFF_U[j].reduce((s,x)=>s+x,0))+'</td></tr>').join('');
 const foot='<tr class="aff-total-row"><th>Total U</th>'+colSums.map(v=>'<td>'+affFormat(v)+'</td>').join('')+'<td>'+affFormat(AFF_TOTAL)+'</td></tr>';
 document.getElementById('aff-u').innerHTML='<table class="aff-matrix aff-u-matrix"><thead><tr><th>Sector / tema</th>'+head+'<th>Σ sector</th></tr></thead><tbody>'+rows+foot+'</tbody></table>';
}
function affBuildPairs(){
 const pairs=[];for(let j=0;j<12;j++)for(let k=j+1;k<12;k++)if(AFF_RHO[j][k]>=0.5-1e-10)pairs.push({j,k,rho:AFF_RHO[j][k]});
 pairs.sort((a,b)=>b.rho-a.rho);
 document.getElementById('aff-pairs').innerHTML=pairs.map(x=>'<div class="aff-pair"><span>'+SECTORS[x.j]+' <span class="aff-pair-sep">↔</span> '+SECTORS[x.k]+'</span><strong>'+affFormat(x.rho)+'</strong></div>').join('');
 document.getElementById('aff-pair-count').textContent=pairs.length;
}
function affBuildSteps(){
 const steps=AFF_GREEDY.steps;
 document.getElementById('aff-steps').innerHTML=steps.map(s=>{
  const bestLabel='S'+(s.slot+1);return '<tr><td>'+s.n+'</td><td>'+TOPICS[s.topic]+'</td><td class="aff-slot-badge">'+bestLabel+'</td><td class="num">'+affFormat(s.cost)+'</td><td class="num">'+affFormat(s.cumulative)+'</td></tr>';
 }).join('');
 document.getElementById('aff-step-total').textContent=affFormat(steps.at(-1).cumulative);
}
function affBuildComparison(){
 const rows=[{name:'ROC consecutivo',key:'roc',desc:'Agrupación tras ordenamiento binario'},
 {name:'Optimización con Solver',key:'optimal',desc:'Optimización de asistencias perdidas'},
 {name:'ROC + heurística U',key:'heuristic',desc:'Afinidad entre sectores y conservación de interés'}];
 document.getElementById('aff-comparison').innerHTML=rows.map(item=>{
  const s=SCHEDULES[item.key],lost=sumLoss(s),p=affLoss(s),coverage=(1-p/AFF_TOTAL)*100;
  return '<tr><td><strong>'+item.name+'</strong><div class="note">'+item.desc+'</div></td><td class="num">'+lost+'</td><td class="num">'+affFormat(p)+'</td><td class="num">'+affFormat(coverage)+' %</td></tr>';
 }).join('')+'<tr class="aff-total-row"><th>Cota inferior teórica</th><td class="num">7</td><td class="num">'+affFormat(AFF_MIN)+'</td><td class="num">—</td></tr>';
 const pOpt=affLoss(SCHEDULES.optimal),pHeu=affLoss(SCHEDULES.heuristic);
 document.getElementById('aff-gain').textContent=affFormat(pOpt-pHeu);
 document.getElementById('aff-coverage').textContent=affFormat(100*(1-pHeu/AFF_TOTAL))+' %';
 document.getElementById('aff-p-opt').textContent=affFormat(pOpt);
 document.getElementById('aff-p-heur').textContent=affFormat(pHeu);
}
function affRenderMath(){
 if(typeof window.renderMathInElement==='function'){
  window.renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false});
 }
}
function affStart(){
 SCHEDULES.heuristic=AFF_GREEDY.slots;
 const verified=AFF_GREEDY.slots.map(x=>x.join(',' )).join('|')==='9,1,2|0,8,5|3,6,7|11,4,10'
  &&sumLoss(SCHEDULES.heuristic)===7 &&Math.abs(AFF_TOTAL-32.3966204153)<1e-8
  &&Math.abs(affLoss(SCHEDULES.heuristic)-3.618091342)<1e-7;
 if(!verified){document.getElementById('aff-method-note').textContent='Advertencia: la verificación numérica no coincide. Revisar matriz antes de usar resultados.';return}
 affBuildHeatmap();affBuildPairs();affBuildU();affBuildSteps();affBuildComparison();
 const btn=document.getElementById('method-heur');
 btn.addEventListener('click',()=>setMethod('heuristic'));
 // No interfiere con los dos botones previos.
 ['method-roc','method-opt'].forEach(id=>document.getElementById(id).addEventListener('click',()=>btn.classList.remove('active')));
 affRenderMath();
}
document.addEventListener('DOMContentLoaded',affStart);
