(function () {
  var KEY = "sistema-cotizaciones-v3";
  var seed = window.COTIZ_SEED;
  var state = load();
  var view = "lista", filter = "todos", search = "", selected = null;
  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function load(){
    try { var r=localStorage.getItem(KEY); if(r) return JSON.parse(r); } catch(e){}
    return { clientes:clone(seed.clientes), catalogo:clone(seed.catalogo), cotizaciones:clone(seed.cotizaciones), seq:1005 };
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s){ return String(s||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];}); }
  function money(n){ return "$ "+Number(n||0).toLocaleString("es-AR"); }
  function toast(m){ var el=document.getElementById("toast"); el.textContent=m; el.classList.add("show"); setTimeout(function(){el.classList.remove("show");},1600); }
  function byId(list,id){ return list.filter(function(x){return x.id===id;})[0]; }
  function total(c){ return (c.items||[]).reduce(function(a,i){return a+Number(i.monto||0)*Number(i.cant||1);},0); }
  function label(e){ return ({borrador:"Borrador",enviada:"Enviada",aceptada:"Aceptada",pedido:"Pedido"})[e]||e; }
  function badge(e){ return e==="pedido"?"is-ok":e==="aceptada"?"is-warn":e==="borrador"?"":"is-warn"; }
  function fillClientes(){
    var sel=document.querySelector("#create [name=clienteId]");
    sel.innerHTML=state.clientes.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.nombre)+'</option>';}).join("");
  }
  function showView(name){
    view=name;
    ["resumen","lista","clientes","catalogo"].forEach(function(v){
      var el=document.getElementById("view-"+v);
      if(el) el.classList.toggle("panel-hidden",v!==name);
    });
    document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.classList.toggle("on",b.getAttribute("data-view")===name); });
    document.getElementById("open-create").classList.toggle("panel-hidden", name!=="lista");
    document.getElementById("view-title").textContent=({resumen:"Resumen del día",lista:"Cotizaciones",clientes:"Clientes",catalogo:"Catálogo"})[name]||name;
    var stats=document.getElementById("stats");
    if(stats) stats.classList.toggle("panel-hidden", name==="resumen");
    if(name==="resumen"){ renderDashboard(); return; }
    render();
  }
  function renderDashboard(){
    if(!window.SisPanelDash) return;
    var all=state.cotizaciones||[];
    SisPanelDash.paint({
      title:"Cotizaciones en curso",
      lead:"Borradores, enviadas y aceptadas.",
      goPrimary:"lista",
      kpis:[
        {label:"Total",value:all.length,hint:"Cotizaciones"},
        {label:"Enviadas",value:all.filter(function(x){return x.estado==="enviada";}).length,hint:"Esperando respuesta",tone:"warn"},
        {label:"Aceptadas",value:all.filter(function(x){return x.estado==="aceptada"||x.estado==="pedido";}).length,hint:"Avance",tone:"ok"}
      ],
      attention:all.filter(function(x){return x.estado==="enviada"||x.estado==="borrador";}).slice(0,5).map(function(x){
        var c=byId(state.clientes,x.clienteId)||{};
        return {title:c.nombre||"Cliente",sub:label(x.estado)};
      })
    });
  }
  function resetForm(){
    var f=document.getElementById("create");
    f.reset(); f.id.value=""; f.senaPct.value=30;
    document.getElementById("create-submit").textContent="Guardar borrador";
    document.getElementById("create-cancel").hidden=true;
    fillClientes();
  }
  function openEdit(x){
    var f=document.getElementById("create");
    f.hidden=false; fillClientes();
    f.id.value=x.id; f.clienteId.value=x.clienteId;
    f.item1.value=(x.items[0]&&x.items[0].nombre)||""; f.monto1.value=(x.items[0]&&x.items[0].monto)||0;
    f.item2.value=(x.items[1]&&x.items[1].nombre)||""; f.monto2.value=(x.items[1]&&x.items[1].monto)||0;
    f.senaPct.value=x.senaPct||30; f.valida.value=x.valida||""; f.notas.value=x.notas||"";
    document.getElementById("create-submit").textContent="Actualizar";
    document.getElementById("create-cancel").hidden=false;
    f.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  function renderLista(){
    var all=state.cotizaciones;
    document.getElementById("stats").innerHTML=
      '<div class="stat"><span>Cotizaciones</span><strong>'+all.length+'</strong></div>'+
      '<div class="stat"><span>Enviadas</span><strong>'+all.filter(function(x){return x.estado==="enviada";}).length+'</strong></div>'+
      '<div class="stat"><span>Aceptadas</span><strong>'+all.filter(function(x){return x.estado==="aceptada";}).length+'</strong></div>'+
      '<div class="stat"><span>Pedidos</span><strong>'+all.filter(function(x){return x.estado==="pedido";}).length+'</strong></div>';
    var opts=[["todos","Todas"],["borrador","Borrador"],["enviada","Enviada"],["aceptada","Aceptada"],["pedido","Pedido"]];
    document.getElementById("filters").innerHTML=opts.map(function(o){return '<button type="button" data-f="'+o[0]+'" class="'+(filter===o[0]?"on":"")+'">'+o[1]+'</button>';}).join("");
    document.querySelectorAll("#filters button").forEach(function(b){b.onclick=function(){filter=b.getAttribute("data-f");render();};});
    var list=all.slice();
    if(filter!=="todos") list=list.filter(function(x){return x.estado===filter;});
    if(search){ var q=search.toLowerCase(); list=list.filter(function(x){ var cl=byId(state.clientes,x.clienteId)||{}; return (x.numero+" "+(cl.nombre||"")+" "+(x.notas||"")).toLowerCase().indexOf(q)!==-1; }); }
    document.getElementById("rows").innerHTML=list.map(function(x){
      var cl=byId(state.clientes,x.clienteId)||{nombre:"—"};
      var det=(x.items||[]).map(function(i){return i.nombre;}).join(", ");
      return '<tr data-id="'+esc(x.id)+'" class="'+(selected===x.id?"is-on":"")+'"><td>'+esc(x.numero)+'</td><td>'+esc(cl.nombre)+'</td><td>'+esc(det)+'</td><td class="amount">'+money(total(x))+'</td><td><span class="badge-state '+badge(x.estado)+'">'+esc(label(x.estado))+'</span></td></tr>';
    }).join("")||'<tr><td colspan="5">Sin filas.</td></tr>';
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){tr.onclick=function(){selected=tr.getAttribute("data-id");render();};});
    var sheet=document.getElementById("sheet");
    var x=byId(state.cotizaciones,selected);
    if(!x){ sheet.innerHTML='<p class="empty-sheet">Elija una cotización.</p>'; return; }
    var cl=byId(state.clientes,x.clienteId)||{};
    var tot=total(x); var sena=Math.round(tot*Number(x.senaPct||0)/100);
    sheet.innerHTML='<img class="sheet-hero" src="'+esc(x.foto||"img/hero.jpg")+'" alt="">'+
      '<h3>'+esc(x.numero)+'</h3><p>'+esc(cl.nombre||"")+' · '+esc(cl.tel||"")+'</p>'+
      (x.items||[]).map(function(i){return '<p>'+esc(i.nombre)+' · '+money(i.monto)+'</p>';}).join("")+
      '<p><strong>Total '+money(tot)+'</strong> · Seña '+esc(String(x.senaPct||0))+'% = '+money(sena)+'</p>'+
      '<p>Válida: '+esc(x.valida||"—")+'</p><p>'+esc(x.notas||"")+'</p>'+
      '<p><span class="badge-state '+badge(x.estado)+'">'+esc(label(x.estado))+'</span></p>'+
      '<div class="actions">'+
        '<button type="button" data-s="enviada">Enviada</button><button type="button" data-s="aceptada">Aceptada</button>'+
        '<button type="button" data-s="pedido">Pedido</button><button type="button" data-s="borrador">Borrador</button>'+
        '<button type="button" id="edit-c">Editar</button><button type="button" class="danger" id="del-c">Eliminar</button>'+
        '<button type="button" class="primary" id="copy-wa">Copiar WhatsApp</button></div>';
    sheet.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(){x.estado=b.getAttribute("data-s");save();toast(label(x.estado));render();};});
    sheet.querySelector("#edit-c").onclick=function(){openEdit(x);};
    sheet.querySelector("#del-c").onclick=function(){
      if(!confirm("¿Eliminar cotización?")) return;
      state.cotizaciones=state.cotizaciones.filter(function(c){return c.id!==x.id;});
      selected=null; save(); toast("Eliminada"); render();
    };
    sheet.querySelector("#copy-wa").onclick=function(){
      var lines=["Cotización "+x.numero, cl.nombre||"", ""].concat((x.items||[]).map(function(i){return "- "+i.nombre+": "+money(i.monto);}));
      lines.push("","Total: "+money(tot),"Seña ("+x.senaPct+"%): "+money(sena));
      if(x.valida) lines.push("Válida hasta: "+x.valida);
      var msg=lines.join("\n");
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){toast("Copiado");});
      else prompt("Copie",msg);
    };
  }
  function renderClientes(){
    document.getElementById("clientes-grid").innerHTML=state.clientes.filter(function(c){
      return !search || (c.nombre+" "+c.tel).toLowerCase().indexOf(search.toLowerCase())!==-1;
    }).map(function(c){
      return '<article class="mini-card" data-id="'+esc(c.id)+'"><div class="body"><strong>'+esc(c.nombre)+'</strong><span>'+esc(c.tel||"")+'</span><span style="display:block">'+esc(c.email||"")+'</span>'+
        '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div></div></article>';
    }).join("")||"<p>Sin clientes.</p>";
    document.querySelectorAll("#clientes-grid [data-edit]").forEach(function(b){
      b.onclick=function(){ var c=byId(state.clientes,b.closest("[data-id]").getAttribute("data-id")); if(!c)return;
        var f=document.getElementById("create-cliente"); f.id.value=c.id; f.nombre.value=c.nombre; f.tel.value=c.tel||""; f.email.value=c.email||"";
        document.getElementById("cliente-submit").textContent="Actualizar"; document.getElementById("cliente-cancel").hidden=false; };
    });
    document.querySelectorAll("#clientes-grid [data-del]").forEach(function(b){
      b.onclick=function(){ var id=b.closest("[data-id]").getAttribute("data-id"); if(!confirm("¿Eliminar cliente?"))return;
        state.clientes=state.clientes.filter(function(c){return c.id!==id;}); save(); fillClientes(); toast("Cliente eliminado"); render(); };
    });
  }
  function renderCatalogo(){
    document.getElementById("catalogo-grid").innerHTML=state.catalogo.map(function(c){
      return '<article class="mini-card" data-id="'+esc(c.id)+'"><img src="'+esc(c.foto||"img/hero.jpg")+'" alt=""><div class="body"><strong>'+esc(c.nombre)+'</strong><span>'+money(c.precio)+'</span>'+
        '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button><button type="button" data-use>Usar en cotización</button></div></div></article>';
    }).join("");
    document.querySelectorAll("#catalogo-grid [data-edit]").forEach(function(b){
      b.onclick=function(){ var c=byId(state.catalogo,b.closest("[data-id]").getAttribute("data-id")); if(!c)return;
        var f=document.getElementById("create-cat"); f.id.value=c.id; f.nombre.value=c.nombre; f.precio.value=c.precio;
        document.getElementById("cat-submit").textContent="Actualizar"; document.getElementById("cat-cancel").hidden=false; };
    });
    document.querySelectorAll("#catalogo-grid [data-del]").forEach(function(b){
      b.onclick=function(){ var id=b.closest("[data-id]").getAttribute("data-id"); if(!confirm("¿Eliminar del catálogo?"))return;
        state.catalogo=state.catalogo.filter(function(c){return c.id!==id;}); save(); toast("Ítem eliminado"); render(); };
    });
    document.querySelectorAll("#catalogo-grid [data-use]").forEach(function(b){
      b.onclick=function(){ var c=byId(state.catalogo,b.closest("[data-id]").getAttribute("data-id")); if(!c)return;
        showView("lista"); var f=document.getElementById("create"); f.hidden=false; resetForm();
        f.item1.value=c.nombre; f.monto1.value=c.precio; toast("Ítem cargado en el formulario"); };
    });
  }
  function render(){ if(view==="resumen"){ renderDashboard(); return; } if(view==="lista")renderLista(); if(view==="clientes")renderClientes(); if(view==="catalogo")renderCatalogo(); }
  document.querySelectorAll(".panel-tabs button").forEach(function(b){b.onclick=function(){showView(b.getAttribute("data-view"));};});
  document.getElementById("open-create").onclick=function(){ var f=document.getElementById("create"); if(f.hidden){resetForm();f.hidden=false;} else {f.hidden=true;resetForm();} };
  document.getElementById("create-cancel").onclick=function(){ document.getElementById("create").hidden=true; resetForm(); };
  document.getElementById("search").oninput=function(e){search=e.target.value.trim();render();};
  document.getElementById("reset-sample").onclick=function(){ if(confirm("¿Restablecer?")){localStorage.removeItem(KEY);location.reload();} };
  fillClientes();
  document.getElementById("create").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var items=[{nombre:String(fd.get("item1")),monto:Number(fd.get("monto1")||0),cant:1}];
    if(String(fd.get("item2")||"").trim()) items.push({nombre:String(fd.get("item2")),monto:Number(fd.get("monto2")||0),cant:1});
    var payload={clienteId:String(fd.get("clienteId")),items:items,senaPct:Number(fd.get("senaPct")||30),valida:String(fd.get("valida")||""),notas:String(fd.get("notas")||"")};
    if(id&&byId(state.cotizaciones,id)){ var x=byId(state.cotizaciones,id); Object.keys(payload).forEach(function(k){x[k]=payload[k];}); selected=id; toast("Actualizada"); }
    else { var item={id:"c"+Date.now(),numero:"COT-"+state.seq++,estado:"borrador",foto:"img/trabajo-1.jpg"}; Object.keys(payload).forEach(function(k){item[k]=payload[k];}); state.cotizaciones.unshift(item); selected=item.id; toast("Borrador guardado"); }
    save(); ev.target.hidden=true; resetForm(); render();
  };
  document.getElementById("create-cliente").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var payload={nombre:String(fd.get("nombre")).trim(),tel:String(fd.get("tel")||""),email:String(fd.get("email")||"")};
    if(id&&byId(state.clientes,id)){ var c=byId(state.clientes,id); Object.keys(payload).forEach(function(k){c[k]=payload[k];}); toast("Cliente actualizado"); }
    else { state.clientes.unshift({id:"cl"+Date.now(),nombre:payload.nombre,tel:payload.tel,email:payload.email}); toast("Cliente ok"); }
    save(); fillClientes(); ev.target.reset(); ev.target.id.value=""; document.getElementById("cliente-submit").textContent="Guardar cliente"; document.getElementById("cliente-cancel").hidden=true; render();
  };
  document.getElementById("cliente-cancel").onclick=function(){ var f=document.getElementById("create-cliente"); f.reset(); f.id.value=""; document.getElementById("cliente-submit").textContent="Guardar cliente"; document.getElementById("cliente-cancel").hidden=true; };
  document.getElementById("create-cat").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var payload={nombre:String(fd.get("nombre")).trim(),precio:Number(fd.get("precio")||0)};
    if(id&&byId(state.catalogo,id)){ var c=byId(state.catalogo,id); Object.keys(payload).forEach(function(k){c[k]=payload[k];}); toast("Catálogo actualizado"); }
    else { state.catalogo.unshift({id:"cat"+Date.now(),foto:"img/trabajo-1.jpg",nombre:payload.nombre,precio:payload.precio}); toast("Ítem ok"); }
    save(); ev.target.reset(); ev.target.id.value=""; document.getElementById("cat-submit").textContent="Guardar ítem"; document.getElementById("cat-cancel").hidden=true; render();
  };
  document.getElementById("cat-cancel").onclick=function(){ var f=document.getElementById("create-cat"); f.reset(); f.id.value=""; document.getElementById("cat-submit").textContent="Guardar ítem"; document.getElementById("cat-cancel").hidden=true; };
  showView("resumen");
})();
