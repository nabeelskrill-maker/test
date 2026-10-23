(function(){
function boot(root){if(root.dataset.crscheckReady)return;root.dataset.crscheckReady="1";

const $=id=>root.querySelector("#"+id),skills=['Listening','Reading','Writing','Speaking'];
const education=[['0','Less than secondary school'],['1','Secondary school'],['2','One-year post-secondary'],['3','Two-year post-secondary'],['4','Bachelor’s / three-or-more-year program'],['5','Two or more credentials (one 3+ years)'],['6','Master’s / eligible professional degree'],['7','Doctorate']];
const tests={en:['CLB (manual)','IELTS General','CELPIP General','PTE Core'],fr:['NCLC (manual)','TEF Canada','TCF Canada'],none:['No test']};
const cut={
'IELTS General':{Listening:[[8.5,10],[8,9],[7.5,8],[6,7],[5.5,6],[5,5],[4.5,4]],Reading:[[8,10],[7,9],[6.5,8],[6,7],[5,6],[4,5],[3.5,4]],Writing:[[7.5,10],[7,9],[6.5,8],[6,7],[5.5,6],[5,5],[4,4]],Speaking:[[7.5,10],[7,9],[6.5,8],[6,7],[5.5,6],[5,5],[4,4]]},
'CELPIP General':Object.fromEntries(skills.map(k=>[k,[[10,10],[9,9],[8,8],[7,7],[6,6],[5,5],[4,4]]])),
'PTE Core':{Listening:[[89,10],[82,9],[71,8],[60,7],[50,6],[39,5],[28,4]],Reading:[[88,10],[78,9],[69,8],[60,7],[51,6],[42,5],[33,4]],Writing:[[90,10],[88,9],[79,8],[69,7],[60,6],[51,5],[41,4]],Speaking:[[89,10],[84,9],[76,8],[68,7],[59,6],[51,5],[42,4]]},
'TEF Canada':{Listening:[[316,10],[298,9],[280,8],[249,7],[217,6],[181,5],[145,4]],Reading:[[263,10],[248,9],[233,8],[207,7],[181,6],[151,5],[121,4]],Writing:[[393,10],[371,9],[349,8],[310,7],[271,6],[226,5],[181,4]],Speaking:[[393,10],[371,9],[349,8],[310,7],[271,6],[226,5],[181,4]]},
'TCF Canada':{Listening:[[549,10],[523,9],[503,8],[458,7],[398,6],[369,5],[331,4]],Reading:[[549,10],[524,9],[499,8],[453,7],[406,6],[375,5],[342,4]],Writing:[[16,10],[14,9],[12,8],[10,7],[7,6],[6,5],[4,4]],Speaking:[[16,10],[14,9],[12,8],[10,7],[7,6],[6,5],[4,4]]}};
let mode='current';
function setOpts(id,items){$(id).innerHTML=items.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}
function init(){setOpts('edu',education);setOpts('spedu',education);setOpts('canwork',Array.from({length:6},(_,i)=>[i,i===0?'None / less than one year':i===5?'5+ years':i+' year'+(i>1?'s':'')]));setOpts('spwork',Array.from({length:6},(_,i)=>[i,i===0?'None / less than one year':i===5?'5+ years':i+' year'+(i>1?'s':'')]));
for(const [test,lang,div] of [['test1','lang1','skills1'],['test2','lang2','skills2'],['sptest',null,'spskills']]){if(test==='sptest'){setOpts(test,tests.en.map(t=>[t,t]));}else fillTests(test,$(lang).value);drawSkills(test,div)}
$('lang2').value='none';fillTests('test2','none');drawSkills('test2','skills2');bind();const saved=null;if(saved){try{const data=JSON.parse(decodeURIComponent(atob(saved)));Object.entries(data).forEach(([id,val])=>{if($(id))$(id).value=val});fillTests('test1',$('lang1').value);fillTests('test2',$('lang2').value);drawSkills('test1','skills1');drawSkills('test2','skills2');drawSkills('sptest','spskills');Object.entries(data).forEach(([id,val])=>{if($(id))$(id).value=val})}catch(e){}}calculate()}
function fillTests(test,lang){setOpts(test,tests[lang].map(x=>[x,x]))}
function drawSkills(test,div){const selected=$(test).value;const old={};$(div).querySelectorAll('input').forEach(i=>old[i.id]=i.value);$(div).innerHTML=skills.map(s=>`<label class="field">${s}<input type="number" min="0" max="${selected==='TCF Canada'&&(s==='Speaking'||s==='Writing')?20: selected.includes('CLB')||selected.includes('NCLC')?12:999}" step="any" id="${div+s}" value="${old[div+s]??(selected.includes('CLB')||selected.includes('NCLC')?'9':'0')}"></label>`).join('');$(div).querySelectorAll('input').forEach(x=>x.addEventListener('input',calculate))}
function bind(){root.querySelectorAll('select,input').forEach(x=>x.addEventListener('change',()=>{if(x.id==='lang1'||x.id==='lang2'){const n=x.id.slice(-1);fillTests('test'+n,x.value);drawSkills('test'+n,'skills'+n)}if(['test1','test2','sptest'].includes(x.id))drawSkills(x.id,x.id==='sptest'?'spskills':'skills'+x.id.slice(-1));calculate()}));$('current').onclick=()=>switchMode('current');$('future').onclick=()=>switchMode('future');$('reset').onclick=()=>{location.hash='';root.querySelectorAll('input').forEach(x=>x.value=x.id==='age'?29:9);root.querySelectorAll('select').forEach(x=>x.selectedIndex=0);$('lang2').value='none';fillTests('test2','none');drawSkills('test2','skills2');switchMode('current')};$('print').onclick=()=>window.print();}
function switchMode(m){mode=m;$('current').classList.toggle('active',m==='current');$('future').classList.toggle('active',m==='future');calculate()}
function clbs(test,div){return skills.map(s=>{const v=Number($(div+s)?.value||0);if(test==='No test')return 0;if(test.includes('CLB')||test.includes('NCLC'))return Math.max(0,Math.min(12,Math.floor(v)));const rows=cut[test]?.[s]||[];return rows.find(([threshold])=>v>=threshold)?.[1]||0})}
function score(){const married=$('married').value==='yes',withSp=married&&$('accompany').value==='yes'&&$('spousePR').value==='no',age=Number($('age').value),edu=+$('edu').value,cw=+$('canwork').value,fw=+$('foreign').value;
const first=clbs($('test1').value,'skills1'),second=clbs($('test2').value,'skills2'),sp=clbs($('sptest').value,'spskills');
const ageSp=[0,0,0,0,0,0],ageMapSp={18:90,19:95,30:95,31:90,32:85,33:80,34:75,35:70,36:65,37:60,38:55,39:50,40:45,41:35,42:25,43:15,44:5},ageMapNo={18:99,19:105,30:105,31:99,32:94,33:88,34:83,35:77,36:72,37:66,38:61,39:55,40:50,41:39,42:28,43:17,44:6};
const agePoints=age>=20&&age<=29?(withSp?100:110):(withSp?ageMapSp[age]:ageMapNo[age])||0;
const eduPoints=(withSp?[0,28,84,91,112,119,126,140]:[0,30,90,98,120,128,135,150])[edu];
const firstPts=first.reduce((a,c)=>a+(withSp?(c>=10?32:c===9?29:c===8?22:c===7?16:c===6?8:c>=4?6:0):(c>=10?34:c===9?31:c===8?23:c===7?17:c===6?9:c>=4?6:0)),0);
const secondPts=Math.min(withSp?22:24,second.reduce((a,c)=>a+(c>=9?6:c>=7?3:c>=5?1:0),0));
const cwPts=(withSp?[0,35,46,56,63,70]:[0,40,53,64,72,80])[cw];
const spEdu=withSp?[0,2,6,7,8,9,10,10][+$('spedu').value]:0;
const spWork=withSp?[0,5,7,8,9,10][+$('spwork').value]:0;
const spLang=withSp?sp.reduce((a,c)=>a+(c>=9?5:c>=7?3:c>=5?1:0),0):0;
const all7=first.every(x=>x>=7),all9=first.every(x=>x>=9),all5=first.every(x=>x>=5);
const eduTier=edu===0||edu===1?0:edu<=4?1:2;
const educationLanguage=all7?(eduTier===2?(all9?50:25):eduTier===1?(all9?25:13):0):0;
const educationWork=cw?(eduTier===2?(cw>=2?50:25):eduTier===1?(cw>=2?25:13):0):0;
const foreignLanguage=fw&&all7?(fw===3?(all9?50:25):(all9?25:13)):0;
const foreignWork=fw&&cw?(fw===3?(cw>=2?50:25):(cw>=2?25:13)):0;
const trade= $('trade').value==='yes'&&all5?(all7?50:25):0;
const transfer=Math.min(100,Math.min(50,educationLanguage+educationWork)+Math.min(50,foreignLanguage+foreignWork)+trade);
const en=$('lang1').value==='en'?first:$('lang2').value==='en'?second:[0,0,0,0],fr=$('lang1').value==='fr'?first:$('lang2').value==='fr'?second:[0,0,0,0];
const french=fr.every(x=>x>=7)?(en.every(x=>x>=5)?50:25):0;
const extra=Math.min(600,($('pnp').value==='yes'?600:0)+($('sibling').value==='yes'?15:0)+Number($('canedu').value)+french);
const labour=mode==='future'?Math.min(150,Math.max(cwPts+Math.min(cw?70:0,Number($('highwork').value)),Number($('offer').value))):cwPts;
const core=agePoints+eduPoints+firstPts+secondPts+(mode==='current'?cwPts:0);
const spouse=spEdu+spWork+spLang;
const total=Math.min(1200,core+spouse+transfer+extra+(mode==='future'?labour:0));
return {total,core,spouse,transfer,extra,labour,first,second,withSp,cwPts,agePoints,eduPoints,firstPts,secondPts,spEdu,spWork,spLang,educationLanguage,educationWork,foreignLanguage,foreignWork,trade,french}}
function calculate(){const r=score();root.querySelectorAll('.spouse-toggle').forEach(e=>e.classList.toggle('hide',$('married').value!=='yes'));root.querySelectorAll('.spouse-section').forEach(e=>e.classList.toggle('hide',!r.withSp));$('skills2').classList.toggle('hide',$('lang2').value==='none');$('total').textContent=r.total;$('progress').style.width=(r.total/12)+'%';
const rows=mode==='current'?[['Core / human capital',r.core],['Spouse factors',r.spouse],['Skill transferability',r.transfer],['Additional points',r.extra]]:[['Core (excluding Canadian work)',r.core],['Spouse factors',r.spouse],['Skill transferability',r.transfer],['Labour Market Integration',r.labour],['Additional points',r.extra]];
$('breakdown').innerHTML=rows.map(([a,b])=>`<div class="score-row"><span>${a}</span><b>${b}</b></div>`).join('');
$('clbview').innerHTML=`First language CLB/NCLC: <b>${r.first.join(' / ')}</b><br>Second language CLB/NCLC: <b>${r.second.join(' / ')}</b><br><span class="hint">Order: Listening / Reading / Writing / Speaking</span>`;
const warnings=[];if($('lang1').value===$('lang2').value)warnings.push('First and second official languages must differ.');if(r.first.some(c=>c<7))warnings.push('Some first-language skills are below CLB/NCLC 7; eligibility may depend on the immigration program.');if($('pnp').value==='yes')warnings.push('Nomination must be valid and linked to Express Entry.');if(mode==='future'&&($('offer').value!=='0'||$('highwork').value!=='0'))warnings.push('Verify your NOC and qualifying experience/offer before relying on high-wage points.');if($('lang1').value==='fr'&&$('lang2').value==='none')warnings.push('French-language bonus may be 25 points without English test results.');
$('validation').innerHTML=warnings.length?warnings.join('<br><br>'):'Estimated points only. Check program eligibility and official IRCC criteria.';
const suggestions=[];if(!r.first.every(x=>x>=9))suggestions.push(['Raise first-language scores to CLB/NCLC 9',hypothetical(()=>skills.forEach(s=>{$('skills1'+s).value=9}),r.total)]);if($('pnp').value==='no')suggestions.push(['Qualifying provincial nomination',Math.min(1200,r.total+600)]);if($('canedu').value==='0')suggestions.push(['Qualifying 1–2 year Canadian credential',Math.min(1200,r.total+15)]);if($('sibling').value==='no')suggestions.push(['Qualifying sibling in Canada',Math.min(1200,r.total+15)]);$('tips').innerHTML='<p class="muted">Illustrative scenarios; eligibility and practical feasibility are not assessed.</p>'+suggestions.map(([label,val])=>`<div class="scenario">${label}<br><b>${val} points (${val-r.total>=0?'+':''}${val-r.total})</b></div>`).join('')+`<details><summary>See detailed factor breakdown</summary><div class="score-row">Age <b>${r.agePoints}</b></div><div class="score-row">Education <b>${r.eduPoints}</b></div><div class="score-row">First language <b>${r.firstPts}</b></div><div class="score-row">Second language <b>${r.secondPts}</b></div><div class="score-row">Canadian work-length <b>${r.cwPts}</b></div><div class="score-row">Spouse education / work / language <b>${r.spEdu} / ${r.spWork} / ${r.spLang}</b></div><div class="score-row">Education × language / work <b>${r.educationLanguage} / ${r.educationWork}</b></div><div class="score-row">Foreign work × language / Canadian work <b>${r.foreignLanguage} / ${r.foreignWork}</b></div><div class="score-row">Trade certificate transferability <b>${r.trade}</b></div><div class="score-row">French bonus <b>${r.french}</b></div></details>`}
function hypothetical(fn,baseline){const els=[...root.querySelectorAll('input,select')],values=els.map(x=>x.value);fn();const val=score().total;els.forEach((x,i)=>x.value=values[i]);return val}
init();

}
function start(){document.querySelectorAll('.crscheck-calculator-instance').forEach(boot)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.addEventListener('elementor/frontend/init',function(){if(window.elementorFrontend&&window.elementorFrontend.hooks){window.elementorFrontend.hooks.addAction('frontend/element_ready/crscheck_calculator.default',function($scope){$scope[0].querySelectorAll('.crscheck-calculator-instance').forEach(boot);});}});
})();
