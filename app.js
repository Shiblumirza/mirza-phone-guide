// Phone listings are comparison guides, not live retailer inventory.
const phones=[
 {brand:'Samsung',name:'Galaxy A56 5G',price:52999,priceNote:'Guide estimate · check 8/256 GB price',display:'6.7″ Super AMOLED',camera:'50MP main',color:'#dce8da',source:'https://www.samsung.com/bd/smartphones/galaxy-a/galaxy-a56-5g-awesome-graphite-256gb-sm-a566ezkcbkd/'},
 {brand:'Apple',name:'iPhone 16',price:109999,priceNote:'Guide estimate · check seller and variant',display:'6.1″ OLED',camera:'48MP main',color:'#ede1e8',source:'https://support.apple.com/en-us/121029'},
 {brand:'Xiaomi',name:'Redmi Note 14 Pro',price:32999,priceNote:'8/256 GB · listed price; verify',display:'6.67″ AMOLED',camera:'200MP main',color:'#dceae4',source:'https://www.mi.com/bd/product/redmi-note-14-pro/'},
 {brand:'vivo',name:'V50',price:62999,priceNote:'12/256 GB · +VAT; verify current price',display:'6.77″ AMOLED',camera:'50MP main',color:'#f1e3d6',source:'https://www.vivo.com/bd/products/param/v50'}
];
let selected=[];
const container=document.getElementById('cards');
const fmt=n=>'৳'+n.toLocaleString('en-US');
function render(items=phones){
 container.innerHTML=items.map((p,i)=>`<article class="phone-card"><div class="card-image" style="--tone:${p.color}"><span class="spec-score">PHONE GUIDE</span><button class="heart" aria-label="Add ${p.name} to favourites">♡</button><div class="device"></div></div><div class="card-brand">${p.brand}</div><h3>${p.name}</h3><div class="spec-line"><span>${p.display}</span><span>${p.camera}</span></div><div class="price-row"><div class="price">${fmt(p.price)}<small>${p.priceNote}</small></div><label class="compare-check"><input type="checkbox" data-name="${p.name}"> Compare</label></div><a class="source-link" href="${p.source}" target="_blank" rel="noopener noreferrer">View manufacturer details ↗</a></article>`).join('');
 container.querySelectorAll('input').forEach(c=>c.addEventListener('change',()=>toggleCompare(c.dataset.name,c.checked)));
 container.querySelectorAll('.heart').forEach(b=>b.addEventListener('click',()=>{b.textContent=b.textContent==='♡'?'♥':'♡';b.style.color=b.textContent==='♥'?'#ec765d':''}));
}
function toggleCompare(name,on){
 selected=on?[...selected.filter(x=>x!==name),name].slice(-2):selected.filter(x=>x!==name);
 const toast=document.getElementById('toast');toast.classList.toggle('show',selected.length>0);
 document.getElementById('toastText').textContent=selected.length===1?'1 phone selected':'2 phones selected (maximum)';
 document.getElementById('compareGo').innerHTML=selected.length>1?'Compare →':'Choose one more phone';
 container.querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=selected.includes(c.dataset.name));
}
function filter(q){
 q=q.toLowerCase().trim();
 const under30=q.includes('30000')||q.includes('30,000')||q.includes('under 30000');
 const res=phones.filter(p=>`${p.brand} ${p.name} ${fmt(p.price)}`.toLowerCase().includes(q)|| (under30&&p.price<=30000));
 render(res);document.getElementById('empty').style.display=res.length?'none':'block';
}
document.getElementById('searchBtn').onclick=()=>filter(document.getElementById('search').value);
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter')filter(e.target.value)});
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{document.getElementById('search').value=b.dataset.query;filter(b.dataset.query)});
document.getElementById('focusSearch').onclick=()=>{document.getElementById('search').focus();document.getElementById('finder').scrollIntoView({behavior:'smooth'})};
document.querySelectorAll('[data-brand]').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('search').value=a.dataset.brand;filter(a.dataset.brand);document.getElementById('latest').scrollIntoView({behavior:'smooth'})});
document.querySelectorAll('[data-budget]').forEach(b=>b.onclick=()=>{const max=Number(b.dataset.budget);const res=phones.filter(p=>p.price<=max);render(res);document.getElementById('empty').style.display=res.length?'none':'block';document.getElementById('latest').scrollIntoView({behavior:'smooth'})});
document.getElementById('compareGo').onclick=()=>{
 if(selected.length<2){document.getElementById('latest').scrollIntoView({behavior:'smooth'});return}
 const rows=selected.map(name=>phones.find(p=>p.name===name)).filter(Boolean);
 const result=document.getElementById('comparisonResults');
 result.innerHTML=`<div class="section-head"><div><span class="section-kicker">Your shortlist</span><h2>Phone comparison</h2></div><button class="clear-compare" type="button">Clear comparison</button></div><div class="comparison-table-wrap"><table class="comparison-table"><thead><tr><th scope="col">Details</th>${rows.map(p=>`<th scope="col">${p.brand} ${p.name}</th>`).join('')}</tr></thead><tbody><tr><th scope="row">Display</th>${rows.map(p=>`<td>${p.display}</td>`).join('')}</tr><tr><th scope="row">Main camera</th>${rows.map(p=>`<td>${p.camera}</td>`).join('')}</tr><tr><th scope="row">Guide price</th>${rows.map(p=>`<td>${fmt(p.price)}<small>${p.priceNote}</small></td>`).join('')}</tr><tr><th scope="row">Manufacturer details</th>${rows.map(p=>`<td><a href="${p.source}" target="_blank" rel="noopener noreferrer">View source ↗</a></td>`).join('')}</tr></tbody></table></div><p class="compare-disclaimer">Prices and specifications may change. Confirm the exact model and current local price with the seller.</p>`;
 result.hidden=false;result.scrollIntoView({behavior:'smooth'});
 result.querySelector('.clear-compare').onclick=()=>{selected=[];container.querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=false);document.getElementById('toast').classList.remove('show');result.hidden=true;document.getElementById('latest').scrollIntoView({behavior:'smooth'})};
};
document.querySelector('.menu').addEventListener('click',e=>{const nav=document.querySelector('.nav nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});
render();
