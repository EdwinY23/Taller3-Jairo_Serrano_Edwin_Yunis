
'use strict';
const TOPICS=['Machine learning','Tratamiento de aguas','Transformación digital','Big Data','Realidad virtual y aumentada','Gestión de Proyectos de Innovación','Pricing','Simulación','Diseño de Marketplaces','Green Supply Chains','Sostenibilidad','Planeación portuaria'];
const SECTORS=['Agroindustria','Producción Textil','Transporte','Energía','Minería','Recursos forestales','Turismo','Educación','Sector Financiero','Adm. Pública','Manufactura','Industria Química'];
const A=[[1,1,0,1,0,0,1,0,0,1,0,1],[1,0,0,1,1,0,0,1,1,1,0,0],[1,0,0,1,1,0,0,0,0,1,0,1],[1,0,0,0,0,0,1,0,0,1,0,0],[0,1,0,0,0,1,0,1,0,0,1,0],[0,1,0,0,0,1,0,0,0,0,1,0],[0,0,1,0,1,0,0,1,1,0,1,0],[0,0,1,0,1,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,1,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,1,0,0]];
const SCHEDULES={
 roc:[[9,0,3],[11,6,1],[4,7,8],[5,10,2]],
 optimal:[[2,9,10],[0,3,7],[5,8,11],[1,4,6]]
};
const TIMES=[['08:00 – 09:45','Sesión de la mañana'],['10:00 – 11:45','Sesión de la mañana'],['14:00 – 15:45','Sesión de la tarde'],['16:00 – 17:45','Sesión de la tarde']];
let mode='optimal', focus=-1;
const $=id=>document.getElementById(id);
const lossesFor=(schedule,i)=>schedule.reduce((p,g)=>p+Math.max(0,g.reduce((q,t)=>q+A[i][t],0)-1),0);
const interestCount=i=>A[i].reduce((a,b)=>a+b,0);
const sumLoss=s=>SECTORS.reduce((n,_,i)=>n+lossesFor(s,i),0);
const interestTotal=A.reduce((n,row)=>n+row.reduce((p,q)=>p+q,0),0);
const escapeHTML=t=>String(t).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function getSelected(){return SCHEDULES[mode]}
function setMethod(next){mode=next;$('method-roc').classList.toggle('active',mode==='roc');$('method-opt').classList.toggle('active',mode==='optimal');if($('method-heur'))$('method-heur').classList.toggle('active',mode==='heuristic');$('method-roc').setAttribute('aria-pressed',String(mode==='roc'));$('method-opt').setAttribute('aria-pressed',String(mode==='optimal'));if($('method-heur'))$('method-heur').setAttribute('aria-pressed',String(mode==='heuristic'));render()}
function renderSchedule(){
 const schedule=getSelected();
 $('schedule-grid').innerHTML=schedule.map((group,h)=>{
  let count=0;
  for(let i=0;i<SECTORS.length;i++) count+=Math.max(0,group.reduce((a,t)=>a+A[i][t],0)-1);
  const cards=group.map((j,a)=>{
   const relevant=focus<0||A[focus][j]===1;
   return '<div class="topic '+(focus>=0?(relevant?'focus':'dim'):'')+'"><small>Auditorio '+(a+1)+'</small><strong>'+escapeHTML(TOPICS[j])+'</strong></div>';
  }).join('');
  const thisLoss=focus<0?count:Math.max(0,group.reduce((a,t)=>a+A[focus][t],0)-1);
  return '<article class="slot"><div class="slot-time"><strong>'+TIMES[h][0]+'</strong><span>'+TIMES[h][1]+'</span></div>'+cards+'<div class="slot-footer">'+(thisLoss===0?'Sin asistencias perdidas': '<strong>'+thisLoss+'</strong> '+(thisLoss===1?'asistencia perdida':'asistencias perdidas'))+'</div></article>';
 }).join('');
 const visibleLoss=focus<0?sumLoss(schedule):lossesFor(schedule,focus);
 $('schedule-context').textContent=focus<0?'Todos los sectores · total '+visibleLoss+' asistencias perdidas':SECTORS[focus]+' · '+visibleLoss+' asistencias perdidas';
 $('current-loss').textContent=String(visibleLoss);
 $('schedule-title').textContent=mode==='optimal'?'Programa optimizado':mode==='heuristic'?'Programa ROC + heurística de afinidad':'Programa derivado del ordenamiento binario';
}
function renderSectorTable(){
 const schedule=getSelected();
 $('sectors-body').innerHTML=SECTORS.map((sector,i)=>{
  const interest=interestCount(i), loss=lossesFor(schedule,i), usable=interest-loss;
  const cl=focus===i?'style="background:#ecf8f6"':'';
  return '<tr '+cl+'><td>'+escapeHTML(sector)+'</td><td class="num">'+interest+'</td><td class="num">'+usable+'</td><td class="num">'+loss+'</td><td><span class="spark" style="width:'+(100*usable/6)+'px"></span></td></tr>';
 }).join('');
 const n=focus<0?interestTotal:interestCount(focus);
 const l=focus<0?sumLoss(schedule):lossesFor(schedule,focus);
 $('covered-value').textContent=String(n-l);
 $('coverage-value').textContent=((n-l)*100/n).toFixed(1).replace('.',',')+'%';
 $('coverage-fill').style.width=((n-l)*100/n)+'%';
 $('sector-detail').textContent=focus<0?'43 intereses sector–temática · 12 sectores':SECTORS[focus]+': '+(n-l)+' de '+n+' intereses aprovechables';
}
function renderMatrix(){
 const cols=TOPICS.map((t,j)=>'<th class="rotate"><span title="'+escapeHTML(t)+'">'+escapeHTML(t)+'</span></th>').join('');
 const body=SECTORS.map((s,i)=>'<tr><th>'+escapeHTML(s)+'</th>'+TOPICS.map((t,j)=>'<td class="'+(A[i][j]?'one':'')+' '+(i===focus&&A[i][j]?'focus':'')+'" title="'+escapeHTML(s)+' · '+escapeHTML(t)+'">'+(A[i][j]?'1':'·')+'</td>').join('')+'</tr>').join('');
 $('matrix-holder').innerHTML='<table class="matrix"><thead><tr><th>Sector / temática</th>'+cols+'</tr></thead><tbody>'+body+'</tbody></table>';
}
function render(){
 renderSchedule();renderSectorTable();renderMatrix();
 $('mode-description').textContent=mode==='optimal'?'Distribución de 12 conferencias que alcanza la cota inferior de 7 asistencias perdidas.':mode==='heuristic'?'Propuesta complementaria de Jairo: asignación de la secuencia ROC por menor solapamiento ponderado U, favoreciendo la participación en temáticas de sectores afines.':'Agrupación consecutiva de las 12 columnas del ROC final, tres conferencias por horario.';

}
function csvDownload(){
 const header=['Sector'].concat(TOPICS),rows=SECTORS.map((s,i)=>[s].concat(A[i]));
 const csv=[header].concat(rows).map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const blob=new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'});
 const link=document.createElement('a'); const url=URL.createObjectURL(blob);
 link.href=url;link.download='taller3_matriz_intereses.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function init(){
 $('method-roc').addEventListener('click',()=>setMethod('roc'));
 $('method-opt').addEventListener('click',()=>setMethod('optimal'));
 $('sector-select').innerHTML='<option value="-1">Todos los sectores</option>'+SECTORS.map((s,i)=>'<option value="'+i+'">'+escapeHTML(s)+'</option>').join('');
 $('sector-select').addEventListener('change',e=>{focus=Number(e.target.value);render()});
 $('nav-mobile').addEventListener('change',e=>{if(e.target.value)document.querySelector(e.target.value)?.scrollIntoView({behavior:'smooth'});});
 const links=Array.from(document.querySelectorAll('.nav a'));
 links.forEach(a=>a.addEventListener('click',()=>{links.forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
 $('kpi-sector').textContent=SECTORS.length;
 $('kpi-topics').textContent=TOPICS.length;
 $('kpi-interests').textContent=interestTotal;
 $('kpi-delta').textContent=(((18-7)/18)*100).toFixed(1).replace('.',',')+'%';
 $('loss-roc').textContent=sumLoss(SCHEDULES.roc);
 $('loss-opt').textContent=sumLoss(SCHEDULES.optimal);
 $('bar-roc').style.width='100%';
 $('bar-opt').style.width=((sumLoss(SCHEDULES.optimal)/sumLoss(SCHEDULES.roc))*100)+'%';
 $('solutions-count').textContent='15.400';
 render();
}
document.addEventListener('DOMContentLoaded',init);
