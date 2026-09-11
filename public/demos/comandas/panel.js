(function () {
  var KEY = "sistema-comandas-v3";
  var seed = window.COMANDAS_SEED;
  var state = load();
  var view = "salon", selected = null;
  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function load(){ try{var r=localStorage.getItem(KEY);if(r)return JSON.parse(r);}catch(e){} return {mesas:clone(seed.mesas),carta:clone(seed.carta)}; }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s){ return String(s||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];}); }
  function money(n){ return "$ "+Number(n||0).toLocaleString("es-AR"); }
  function toast(m){ var el=document.getElementById("toast"); el.textContent=m; el.classList.add("show"); setTimeout(function(){el.classList.remove("show");},1600); }
  function total(m){ return (m.items||[]).reduce(function(a,i){return a+Number(i.monto||0);},0); }
  function label(e){ return ({abierta:"Abierta",cocina:"En cocina",lista:"Lista",cerrada:"Cerrada"})[e]||e; }
  function badge(e){ return e==="lista"?"is-ok":e==="cocina"?"is-warn":e==="cerrada"?"is-bad":""; }
  function byId(id){ return state.mesas.filter(function(m){return m.id===id;})[0]; }
  function byPlato(id){ return state.carta.filter(function(p){return p.id===id;})[0]; }
  function showView(name){
    view=name;
    ["resumen","salon","cocina","carta"].forEach(function(v){
      var el=document.getElementById("view-"+v);
      if(el) el.classList.toggle("panel-hidden", v!==name);
    });
    document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-view")===name); });
    document.getElementById("open-create").classList.toggle("panel-hidden", name!=="salon");
    document.getElementById("view-title").textContent=({resumen:"Resumen del día",salon:"Salón",cocina:"Cocina",carta:"Carta"})[name]||name;
    var stats=document.getElementById("stats");
    if(stats) stats.classList.toggle("panel-hidden", name==="resumen");
    var create=document.getElementById("create");
    if(create && name!=="salon") create.hidden=true;
    if(name==="resumen"){ renderDashboard(); return; }
    render();
  }
  function renderDashboard(){
    if(!window.SisPanelDash) return;
    var list=state.mesas||[];
    var act=list.filter(function(m){return m.estado!=="cerrada";});
    SisPanelDash.paint({
      title:"Salón en vivo",
      lead:"Mesas abiertas, cocina y cobro.",
      goPrimary:"salon",
      kpis:[
        {label:"Activas",value:act.length,hint:"Mesas abiertas"},
        {label:"Cocina",value:list.filter(function(m){return m.estado==="cocina";}).length,hint:"Preparando",tone:"warn"},
        {label:"Listas",value:list.filter(function(m){return m.estado==="lista";}).length,hint:"Para servir",tone:"ok"}
      ],
      attention:act.filter(function(m){return m.estado==="lista"||m.estado==="cocina";}).slice(0,5).map(function(m){
        return {title:m.mesa,sub:label(m.estado)+" · "+money(total(m))};
      })
    });
  }
  function render(){
    if(view==="resumen"){ renderDashboard(); return; }
    var act=state.mesas.filter(function(m){return m.estado!=="cerrada";});
    document.getElementById("stats").innerHTML=
      '<div class="stat"><span>Activas</span><strong>'+act.length+'</strong></div>'+
      '<div class="stat"><span>Cocina</span><strong>'+state.mesas.filter(function(m){return m.estado==="cocina";}).length+'</strong></div>'+
      '<div class="stat"><span>Listas</span><strong>'+state.mesas.filter(function(m){return m.estado==="lista";}).length+'</strong></div>'+
      '<div class="stat"><span>Abierto</span><strong>'+money(act.reduce(function(a,m){return a+total(m);},0))+'</strong></div>';
    document.querySelector("#create [name=plato]").innerHTML=state.carta.map(function(p){
      return '<option value="'+esc(p.id)+'">'+esc(p.nombre)+' · '+money(p.precio)+'</option>';
    }).join("");

    if(view==="carta"){
      document.getElementById("carta-grid").innerHTML=state.carta.map(function(p){
        return '<article class="mini-card" data-id="'+esc(p.id)+'"><img src="'+esc(p.foto||"img/hero.jpg")+'" alt=""><div class="body"><strong>'+esc(p.nombre)+'</strong><span>'+money(p.precio)+'</span>'+
          '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div></div></article>';
      }).join("");
      document.querySelectorAll("#carta-grid [data-edit]").forEach(function(b){
        b.onclick=function(){ var p=byPlato(b.closest("[data-id]").getAttribute("data-id")); if(!p)return;
          var f=document.getElementById("create-plato"); f.id.value=p.id; f.nombre.value=p.nombre; f.precio.value=p.precio;
          document.getElementById("plato-submit").textContent="Actualizar"; document.getElementById("plato-cancel").hidden=false; };
      });
      document.querySelectorAll("#carta-grid [data-del]").forEach(function(b){
        b.onclick=function(){ var id=b.closest("[data-id]").getAttribute("data-id"); if(!confirm("¿Eliminar plato?"))return;
          state.carta=state.carta.filter(function(p){return p.id!==id;}); save(); toast("Plato eliminado"); render(); };
      });
      return;
    }
    if(view==="cocina"){
      var cols=[["abierta","Recibidas"],["cocina","Preparando"],["lista","Listas"]];
      document.getElementById("kanban").innerHTML=cols.map(function(col){
        var cards=state.mesas.filter(function(m){return m.estado===col[0];}).map(function(m){
          return '<div class="kanban-card" data-id="'+esc(m.id)+'"><strong>'+esc(m.mesa)+'</strong><span>'+esc((m.items||[]).map(function(i){return i.nombre;}).join(", "))+'</span></div>';
        }).join("")||'<p style="color:var(--muted);font-size:0.9rem">Vacío</p>';
        return '<div class="kanban-col"><h3>'+col[1]+'</h3>'+cards+'</div>';
      }).join("");
      document.querySelectorAll("#kanban [data-id]").forEach(function(card){
        card.onclick=function(){ selected=card.getAttribute("data-id"); showView("salon"); };
      });
      return;
    }

    document.getElementById("mesas-grid").innerHTML=state.mesas.filter(function(m){return m.estado!=="cerrada";}).map(function(m){
      return '<button type="button" class="mesa-tile is-'+esc(m.estado)+(selected===m.id?" is-on":"")+'" data-id="'+esc(m.id)+'"><strong>'+esc(m.mesa)+'</strong><span>'+esc(label(m.estado))+'</span><div style="margin-top:0.35rem;font-weight:700">'+money(total(m))+'</div></button>';
    }).join("");
    document.querySelectorAll("#mesas-grid [data-id]").forEach(function(b){ b.onclick=function(){ selected=b.getAttribute("data-id"); render(); }; });

    var list=state.mesas.filter(function(m){return m.estado!=="cerrada";});
    document.getElementById("rows").innerHTML=list.map(function(m){
      return '<tr data-id="'+esc(m.id)+'" class="'+(selected===m.id?"is-on":"")+'"><td>'+esc(m.mesa)+'</td><td>'+esc((m.items||[]).map(function(i){return i.nombre;}).join(", "))+'</td><td class="amount">'+money(total(m))+'</td><td><span class="badge-state '+badge(m.estado)+'">'+esc(label(m.estado))+'</span></td></tr>';
    }).join("");
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){ tr.onclick=function(){ selected=tr.getAttribute("data-id"); render(); }; });

    var sheet=document.getElementById("sheet");
    var m=byId(selected);
    if(!m){ sheet.innerHTML='<p class="empty-sheet">Elija una mesa.</p>'; return; }
    var itemsHtml=(m.items||[]).map(function(i,idx){
      return '<p>'+esc(i.nombre)+' · '+money(i.monto)+
        ' <button type="button" class="btn-soft" data-rm="'+idx+'" style="padding:0.15rem 0.4rem;font-size:0.75rem;margin-left:0.35rem">Quitar</button></p>';
    }).join("");
    sheet.innerHTML='<img class="sheet-hero" src="img/plato-1.jpg" alt="">'+
      '<h3>'+esc(m.mesa)+'</h3><p>'+esc(String(m.cubiertos||"—"))+' cubiertos · Mozo: '+esc(m.mozo||"—")+'</p>'+
      '<p>'+esc(m.notas||"Sin notas")+'</p><p><strong>'+money(total(m))+'</strong></p>'+itemsHtml+
      '<p><span class="badge-state '+badge(m.estado)+'">'+esc(label(m.estado))+'</span></p>'+
      '<div class="actions">'+
        '<button type="button" data-s="abierta">Abierta</button><button type="button" data-s="cocina">A cocina</button>'+
        '<button type="button" data-s="lista">Lista</button><button type="button" class="primary" data-s="cerrada">Cerrar / cobrar</button>'+
        '<button type="button" class="danger" id="del-mesa">Eliminar mesa</button></div>';
    sheet.querySelectorAll("[data-s]").forEach(function(b){ b.onclick=function(){ m.estado=b.getAttribute("data-s"); save(); toast(label(m.estado)); render(); }; });
    sheet.querySelectorAll("[data-rm]").forEach(function(b){
      b.onclick=function(){ var idx=Number(b.getAttribute("data-rm")); m.items.splice(idx,1); save(); toast("Ítem quitado"); render(); };
    });
    sheet.querySelector("#del-mesa").onclick=function(){
      if(!confirm("¿Eliminar mesa?")) return;
      state.mesas=state.mesas.filter(function(x){return x.id!==m.id;}); selected=null; save(); toast("Mesa eliminada"); render();
    };
  }
  document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.onclick=function(){ showView(b.getAttribute("data-view")); }; });
  document.getElementById("open-create").onclick=function(){ document.getElementById("create").hidden=!document.getElementById("create").hidden; };
  document.getElementById("reset-sample").onclick=function(){ if(confirm("¿Restablecer?")){ localStorage.removeItem(KEY); location.reload(); } };
  document.getElementById("create").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target);
    var plato=byPlato(String(fd.get("plato")));
    var mesaName=String(fd.get("mesa")).trim();
    var existing=state.mesas.filter(function(m){return m.mesa.toLowerCase()===mesaName.toLowerCase() && m.estado!=="cerrada";})[0];
    var item={ nombre: plato?plato.nombre:String(fd.get("plato")), monto: plato?plato.precio:0 };
    if(existing){ existing.items.push(item); if(fd.get("notas")) existing.notas=String(fd.get("notas")); selected=existing.id; }
    else { var neu={ id:"me"+Date.now(), mesa:mesaName, cubiertos:Number(fd.get("cubiertos")||2), items:[item], notas:String(fd.get("notas")||""), estado:"abierta", mozo:String(fd.get("mozo")||"") }; state.mesas.unshift(neu); selected=neu.id; }
    save(); ev.target.hidden=true; toast("Mesa actualizada"); render();
  };
  document.getElementById("create-plato").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var payload={nombre:String(fd.get("nombre")).trim(),precio:Number(fd.get("precio")||0)};
    if(id&&byPlato(id)){ var p=byPlato(id); p.nombre=payload.nombre; p.precio=payload.precio; toast("Plato actualizado"); }
    else { state.carta.unshift({id:"p"+Date.now(),foto:"img/plato-2.jpg",nombre:payload.nombre,precio:payload.precio}); toast("Plato ok"); }
    save(); ev.target.reset(); ev.target.id.value=""; document.getElementById("plato-submit").textContent="Guardar plato"; document.getElementById("plato-cancel").hidden=true; render();
  };
  document.getElementById("plato-cancel").onclick=function(){ var f=document.getElementById("create-plato"); f.reset(); f.id.value=""; document.getElementById("plato-submit").textContent="Guardar plato"; document.getElementById("plato-cancel").hidden=true; };
  showView("resumen");
})();
