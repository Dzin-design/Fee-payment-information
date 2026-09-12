let data=[];let charts={};
const COUNT=["ศูนย์บริการธุรกิจพลังงาน_ราย", "บริษัท ไปรษณีย์ไทย จำกัด_ราย", "ธนาคารกรุงไทย จำกัด (มหาชน)_ราย", "เคาน์เตอร์เซอร์วิส_ราย"];const MONEY=["ศูนย์บริการธุรกิจพลังงาน_บาท", "บริษัท ไปรษณีย์ไทย จำกัด_บาท", "ธนาคารกรุงไทย จำกัด (มหาชน)_บาท", "เคาน์เตอร์เซอร์วิส_บาท"];
const TC="รวม_ราย";const TM="รวม_บาท";
const Y="ปีงบประมาณ",M="เดือน",L="กฎหมาย";
const fmt=n=>Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:2});
const sum=(rows,key)=>rows.reduce((a,r)=>a+(Number(r[key])||0),0);
const unique=k=>[...new Set(data.map(r=>r[k]).filter(v=>v!==null&&v!==''))];
function fill(id,vals){vals.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;document.getElementById(id).appendChild(o)})}
function filtered(){const y=document.getElementById('year').value,m=document.getElementById('month').value,l=document.getElementById('law').value;return data.filter(r=>(!y||String(r[Y])===y)&&(!m||String(r[M])===m)&&(!l||String(r[L])===l))}
function destroy(){Object.values(charts).forEach(c=>c.destroy());charts={}}
function update(){
 const r=filtered();document.getElementById('people').textContent=fmt(sum(r,TC));document.getElementById('money').textContent=fmt(sum(r,TM));
 document.getElementById('months').textContent=new Set(r.map(x=>x[M]).filter(Boolean)).size;document.getElementById('laws').textContent=new Set(r.map(x=>x[L]).filter(Boolean)).size;
 destroy();
 const labels=COUNT.map(x=>x.replace(/_ราย$/,''));
 charts.bar=new Chart(document.getElementById('bar'),{type:'bar',data:{labels,datasets:[{label:'จำนวนราย',data:COUNT.map(k=>sum(r,k))}]},options:{responsive:true,maintainAspectRatio:false}});
 charts.pie=new Chart(document.getElementById('pie'),{type:'doughnut',data:{labels,datasets:[{data:COUNT.map(k=>sum(r,k))}]},options:{responsive:true,maintainAspectRatio:false}});
 const monthly={};r.forEach(x=>{const k=x[M]||'ไม่ระบุ';monthly[k]=(monthly[k]||0)+(Number(x[TC])||0)});
 const ml=Object.keys(monthly);charts.line=new Chart(document.getElementById('line'),{type:'line',data:{labels:ml,datasets:[{label:'จำนวนผู้ชำระ',data:ml.map(k=>monthly[k]),tension:.25}]},options:{responsive:true,maintainAspectRatio:false}});
 const law={};r.forEach(x=>{const k=x[L]||'ไม่ระบุ';law[k]=(law[k]||0)+(Number(x[TC])||0)});const ll=Object.keys(law);
 charts.law=new Chart(document.getElementById('lawChart'),{type:'bar',data:{labels:ll,datasets:[{label:'จำนวนราย',data:ll.map(k=>law[k])}]},options:{responsive:true,maintainAspectRatio:false}});
 charts.money=new Chart(document.getElementById('moneyChart'),{type:'bar',data:{labels:MONEY.map(x=>x.replace(/_บาท$/,'')),datasets:[{label:'จำนวนเงิน (บาท)',data:MONEY.map(k=>sum(r,k))}]},options:{responsive:true,maintainAspectRatio:false}});
 const show=[Y,M,L,...COUNT,...MONEY,TC,TM].filter((x,i,a)=>x&&a.indexOf(x)===i);
 document.getElementById('table').innerHTML='<thead><tr>'+show.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+r.map(x=>'<tr>'+show.map(k=>'<td>'+(typeof x[k]==='number'?fmt(x[k]):(x[k]??''))+'</td>').join('')+'</tr>').join('')+'</tbody>';
}
fetch('data.json').then(x=>x.json()).then(j=>{data=j;fill('year',unique(Y));fill('month',unique(M));fill('law',unique(L));update()}).catch(e=>alert('โหลดข้อมูลไม่ได้: '+e));
['year','month','law'].forEach(id=>document.getElementById(id).onchange=update);
document.getElementById('reset').onclick=()=>{['year','month','law'].forEach(id=>document.getElementById(id).value='');update()};
