(function () {
  var KEY = "sistema-reservas-v3";
  var seed = window.RESERVAS_SEED;
  var state = load();
  var view = "reservas", filter = "activas", search = "", selected = null;
  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function load(){ try{var r=localStorage.getItem(KEY);if(r)return JSON.parse(r);}catch(e){} return {unidades:clone(seed.unidades),reservas:clone(seed.reservas)}; }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s){ return String(s||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];}); }
  function money(n){ return "$ "+Number(n||0).toLocaleString("es-AR"); }
  function toast(m){ var el=document.getElementById("toast"); el.textContent=m; el.classList.add("show"); setTimeout(function(){el.classList.remove("show");},1600); }
  function byU(id){ return state.unidades.filter(function(u){return u.id===id;})[0]; }
  function byR(id){ return state.reservas.filter(function(r){return r.id===id;})[0]; }
  function label(e){ return ({consulta:"Consulta",reservada:"Reservada",ocupada:"Ocupada",cerrada:"Cerrada"})[e]||e; }
  function badge(e){ return e==="ocupada"?"is-warn":e==="reservada"?"is-ok":e==="cerrada"?"is-bad":""; }
  function nights(desde,hasta){ var a=new Date(desde+"T12:00:00"); var b=new Date(hasta+"T12:00:00"); return Math.max(1, Math.round((b-a)/86400000)); }
  function fillUnidades(){ document.querySelector("#create [name=unidadId]").innerHTML=state.unidades.map(function(u){return '<option value="'+esc(u.id)+'">'+esc(u.nombre)+'</option>';}).join(""); }
  function showView(name){
    view=name;
    ["reservas","unidades","calendario"].forEach(function(v){ document.getElementById("view-"+v).classList.toggle("panel-hidden", v!==name); });
    document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-view")===name); });
    document.getElementById("open-create").classList.toggle("panel-hidden", name!=="reservas");
    document.getElementById("view-title").textContent=({reservas:"Reservas",unidades:"Unidades",calendario:"Calendario"})[name];
    render();
  }
  function resetForm(){
    var f=document.getElementById("create"); f.reset(); f.id.value=""; f.sena.value=0;
    document.getElementById("create-submit").textContent="Guardar reserva";
    document.getElementById("create-cancel").hidden=true; fillUnidades();
  }
  function openEdit(r){
    var f=document.getElementById("create"); f.hidden=false; fillUnidades();
    f.id.value=r.id; f.unidadId.value=r.unidadId; f.huesped.value=r.huesped; f.tel.value=r.tel||"";
    f.desde.value=r.desde; f.hasta.value=r.hasta; f.sena.value=r.sena||0; f.notas.value=r.notas||"";
    document.getElementById("create-submit").textContent="Actualizar reserva";
    document.getElementById("create-cancel").hidden=false;
    f.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  function render(){
    document.getElementById("stats").innerHTML=
      '<div class="stat"><span>Reservas</span><strong>'+state.reservas.length+'</strong></div>'+
      '<div class="stat"><span>Ocupadas</span><strong>'+state.reservas.filter(function(r){return r.estado==="ocupada";}).length+'</strong></div>'+
      '<div class="stat"><span>Reservadas</span><strong>'+state.reservas.filter(function(r){return r.estado==="reservada";}).length+'</strong></div>'+
      '<div class="stat"><span>Unidades</span><strong>'+state.unidades.length+'</strong></div>';

    if(view==="unidades"){
      document.getElementById("unidades-grid").innerHTML=state.unidades.map(function(u){
        return '<article class="mini-card" data-id="'+esc(u.id)+'"><img src="'+esc(u.foto||"img/hero.jpg")+'" alt=""><div class="body"><strong>'+esc(u.nombre)+'</strong><span>'+esc(String(u.cupo))+' personas · '+money(u.precioNoche)+'/noche</span><span style="display:block;margin-top:0.3rem">'+esc(u.notas||"")+'</span>'+
          '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div></div></article>';
      }).join("");
      document.querySelectorAll("#unidades-grid [data-edit]").forEach(function(b){
        b.onclick=function(){ var u=byU(b.closest("[data-id]").getAttribute("data-id")); if(!u)return;
          var f=document.getElementById("create-unidad"); f.id.value=u.id; f.nombre.value=u.nombre; f.cupo.value=u.cupo; f.precioNoche.value=u.precioNoche; f.notas.value=u.notas||"";
          document.getElementById("unidad-submit").textContent="Actualizar"; document.getElementById("unidad-cancel").hidden=false; };
      });
      document.querySelectorAll("#unidades-grid [data-del]").forEach(function(b){
        b.onclick=function(){ var id=b.closest("[data-id]").getAttribute("data-id"); if(!confirm("¿Eliminar unidad?"))return;
          state.unidades=state.unidades.filter(function(u){return u.id!==id;}); save(); fillUnidades(); toast("Unidad eliminada"); render(); };
      });
      return;
    }
    if(view==="calendario"){
      var days=[];
      for(var i=0;i<7;i++){
        var d=new Date("2026-09-11T12:00:00"); d.setDate(d.getDate()+i);
        var iso=d.toISOString().slice(0,10);
        var lab=d.toLocaleDateString("es-AR",{weekday:"short",day:"numeric"});
        var pills=state.reservas.filter(function(r){return r.estado!=="cerrada" && r.desde<=iso && r.hasta>iso;}).map(function(r){
          var u=byU(r.unidadId)||{}; return '<span class="cal-pill">'+esc((u.nombre||"").split(" ")[0])+' · '+esc(r.huesped.split(" ")[0])+'</span>';
        }).join("");
        days.push('<div class="cal-day"><strong>'+esc(lab)+'</strong>'+(pills||'<span style="color:var(--muted)">Libre</span>')+'</div>');
      }
      document.getElementById("calendar").innerHTML=days.join("");
      return;
    }

    fillUnidades();
    var opts=[["activas","Activas"],["consulta","Consulta"],["reservada","Reservada"],["ocupada","Ocupada"],["todas","Todas"]];
    document.getElementById("filters").innerHTML=opts.map(function(o){return '<button type="button" data-f="'+o[0]+'" class="'+(filter===o[0]?"on":"")+'">'+o[1]+'</button>';}).join("");
    document.querySelectorAll("#filters button").forEach(function(b){b.onclick=function(){filter=b.getAttribute("data-f");render();};});
    var list=state.reservas.slice();
    if(filter==="activas") list=list.filter(function(r){return r.estado!=="cerrada";});
    else if(filter!=="todas") list=list.filter(function(r){return r.estado===filter;});
    if(search){ var q=search.toLowerCase(); list=list.filter(function(r){ var u=byU(r.unidadId)||{}; return (r.huesped+" "+(u.nombre||"")).toLowerCase().indexOf(q)!==-1; }); }
    document.getElementById("rows").innerHTML=list.map(function(r){
      var u=byU(r.unidadId)||{nombre:"—"};
      return '<tr data-id="'+esc(r.id)+'" class="'+(selected===r.id?"is-on":"")+'"><td>'+esc(u.nombre)+'</td><td>'+esc(r.huesped)+'</td><td>'+esc(r.desde)+" → "+esc(r.hasta)+'</td><td class="amount">'+money(r.sena)+'</td><td><span class="badge-state '+badge(r.estado)+'">'+esc(label(r.estado))+'</span></td></tr>';
    }).join("")||'<tr><td colspan="5">Sin reservas.</td></tr>';
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){tr.onclick=function(){selected=tr.getAttribute("data-id");render();};});

    var sheet=document.getElementById("sheet");
    var r=byR(selected);
    if(!r){ sheet.innerHTML='<p class="empty-sheet">Elija una reserva.</p>'; return; }
    var u=byU(r.unidadId)||{};
    var n=nights(r.desde,r.hasta); var est=(u.precioNoche||0)*n;
    sheet.innerHTML='<img class="sheet-hero" src="'+esc(u.foto||"img/hero.jpg")+'" alt="">'+
      '<h3>'+esc(u.nombre||"")+'</h3><p>'+esc(r.huesped)+' · '+esc(r.tel||"")+'</p>'+
      '<p>'+esc(r.desde)+' → '+esc(r.hasta)+' ('+n+' noches)</p>'+
      '<p>Estimado estadía: <strong>'+money(est)+'</strong></p><p>Seña: <strong>'+money(r.sena)+'</strong></p>'+
      '<p>'+esc(r.notas||"—")+'</p><p><span class="badge-state '+badge(r.estado)+'">'+esc(label(r.estado))+'</span></p>'+
      '<div class="actions">'+
        '<button type="button" data-s="consulta">Consulta</button><button type="button" data-s="reservada">Reservada</button>'+
        '<button type="button" data-s="ocupada">Check-in</button><button type="button" data-s="cerrada">Check-out</button>'+
        '<button type="button" id="edit-r">Editar</button><button type="button" class="danger" id="del-r">Eliminar</button>'+
        '<button type="button" class="primary" id="wa-res">WhatsApp</button></div>';
    sheet.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(){r.estado=b.getAttribute("data-s");save();toast(label(r.estado));render();};});
    sheet.querySelector("#edit-r").onclick=function(){openEdit(r);};
    sheet.querySelector("#del-r").onclick=function(){ if(!confirm("¿Eliminar reserva?"))return; state.reservas=state.reservas.filter(function(x){return x.id!==r.id;}); selected=null; save(); toast("Eliminada"); render(); };
    sheet.querySelector("#wa-res").onclick=function(){
      var msg="Hola "+r.huesped+", confirmamos su estadía en "+(u.nombre||"")+" del "+r.desde+" al "+r.hasta+". Seña registrada: "+money(r.sena)+".";
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){toast("Copiado");});
      else prompt("Copie",msg);
    };
  }
  document.querySelectorAll(".panel-tabs button").forEach(function(b){b.onclick=function(){showView(b.getAttribute("data-view"));};});
  document.getElementById("open-create").onclick=function(){ var f=document.getElementById("create"); if(f.hidden){resetForm();f.hidden=false;} else {f.hidden=true;resetForm();} };
  document.getElementById("create-cancel").onclick=function(){ document.getElementById("create").hidden=true; resetForm(); };
  document.getElementById("search").oninput=function(e){search=e.target.value.trim();render();};
  document.getElementById("reset-sample").onclick=function(){ if(confirm("¿Restablecer?")){localStorage.removeItem(KEY);location.reload();} };
  fillUnidades();
  document.getElementById("create").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var payload={unidadId:String(fd.get("unidadId")),huesped:String(fd.get("huesped")).trim(),tel:String(fd.get("tel")||""),desde:String(fd.get("desde")),hasta:String(fd.get("hasta")),sena:Number(fd.get("sena")||0),notas:String(fd.get("notas")||"")};
    if(id&&byR(id)){ var r=byR(id); Object.keys(payload).forEach(function(k){r[k]=payload[k];}); selected=id; toast("Reserva actualizada"); }
    else { var item={id:"r"+Date.now(),estado:"reservada"}; Object.keys(payload).forEach(function(k){item[k]=payload[k];}); state.reservas.unshift(item); selected=item.id; toast("Reserva ok"); }
    save(); ev.target.hidden=true; resetForm(); render();
  };
  document.getElementById("create-unidad").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var payload={nombre:String(fd.get("nombre")).trim(),cupo:Number(fd.get("cupo")||1),precioNoche:Number(fd.get("precioNoche")||0),notas:String(fd.get("notas")||"")};
    if(id&&byU(id)){ var u=byU(id); Object.keys(payload).forEach(function(k){u[k]=payload[k];}); toast("Unidad actualizada"); }
    else { state.unidades.unshift({id:"u"+Date.now(),foto:"img/unidad-1.jpg",nombre:payload.nombre,cupo:payload.cupo,precioNoche:payload.precioNoche,notas:payload.notas}); toast("Unidad ok"); }
    save(); fillUnidades(); ev.target.reset(); ev.target.id.value=""; document.getElementById("unidad-submit").textContent="Guardar unidad"; document.getElementById("unidad-cancel").hidden=true; render();
  };
  document.getElementById("unidad-cancel").onclick=function(){ var f=document.getElementById("create-unidad"); f.reset(); f.id.value=""; document.getElementById("unidad-submit").textContent="Guardar unidad"; document.getElementById("unidad-cancel").hidden=true; };
  render();
})();
