
(function () {
  var CFG = window.SIS_CFG;
  var KEY = "sistema-" + CFG.slug + "-v1";
  var seed = window.SIS_SEED;
  var state = load();
  var view = CFG.primary;
  var selected = null;
  var search = "";

  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function load(){ try{ var r=localStorage.getItem(KEY); if(r) return JSON.parse(r);}catch(e){} return clone(seed); }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s){ return String(s||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];}); }
  function money(n){ return "$ "+Number(n||0).toLocaleString("es-AR"); }
  function toast(m){ var el=document.getElementById("toast"); el.textContent=m; el.classList.add("show"); setTimeout(function(){el.classList.remove("show");},1600); }
  function byId(list,id){ return (list||[]).filter(function(x){return x.id===id;})[0]; }
  function labelEstado(e){ return (CFG.statusLabels&&CFG.statusLabels[e])||e||"—"; }

  function enrich(item){
    var o = Object.assign({}, item);
    if(item.clienteId && state.clientes){ var c=byId(state.clientes,item.clienteId)||{}; o.clienteNombre=c.nombre||"—"; o.clienteTel=c.tel||""; }
    if(item.tecnicoId && state.tecnicos){ o.tecnicoNombre=(byId(state.tecnicos,item.tecnicoId)||{}).nombre||"—"; }
    if(item.choferId && state.choferes){ o.choferNombre=(byId(state.choferes,item.choferId)||{}).nombre||"—"; }
    if(item.parteId && state.partes){ o.parteNombre=(byId(state.partes,item.parteId)||{}).nombre||"—"; }
    if(item.platoId && state.carta){ o.platoNombre=(byId(state.carta,item.platoId)||{}).nombre||"—"; }
    if(item.estado) o.estadoLabel=labelEstado(item.estado);
    if(item.total!=null) o.totalMoney=money(item.total);
    if(item.monto!=null) o.montoMoney=money(item.monto);
    if(item.sena!=null) o.senaMoney=money(item.sena);
    if(item.presupuesto!=null) o.presupuestoMoney=money(item.presupuesto);
    if(item.avance!=null) o.avancePct=item.avance+"%";
    if(item.cuotas!=null){ o.progreso=(item.pagadas||0)+"/"+item.cuotas; o.planEstado=((item.pagadas||0)>=item.cuotas)?"Cancelado":"Activo"; }
    if(item.lineas) o.detalleLineas=item.lineas.map(function(l){return l.nombre+" x"+l.cant;}).join(", ");
    if(item.stock!=null && item.minimo!=null) o.alerta = Number(item.stock)<Number(item.minimo) ? "Bajo mínimo" : "Ok";
    return o;
  }

  function showView(name){
    view=name;
    document.querySelectorAll("[data-panel-view]").forEach(function(el){ el.classList.toggle("panel-hidden", el.getAttribute("data-panel-view")!==name); });
    document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-view")===name); });
    var oc=document.getElementById("open-create"); if(oc) oc.classList.toggle("panel-hidden", name!==CFG.primary);
    document.getElementById("view-title").textContent = CFG.tabTitles[name]||name;
    render();
  }

  function fillSelects(form){
    form.querySelectorAll("select[data-source]").forEach(function(sel){
      var src=sel.getAttribute("data-source");
      var list=state[src]||[];
      var labelKey = src==="lista"||src==="carta" ? "nombre" : "nombre";
      sel.innerHTML=list.map(function(x){
        var extra = x.precio!=null ? (" · "+money(x.precio)) : (x.rol?(" · "+x.rol):"");
        return '<option value="'+esc(x.id)+'">'+esc(x[labelKey]||x.id)+esc(extra)+'</option>';
      }).join("");
    });
  }

  function renderStats(){
    var list=state[CFG.listKey]||[];
    var html='<div class="stat"><span>Registros</span><strong>'+list.length+'</strong></div>';
    if(CFG.statuses && CFG.statuses.length){
      CFG.statuses.slice(0,3).forEach(function(st){
        html+='<div class="stat"><span>'+esc(labelEstado(st))+'</span><strong>'+list.filter(function(x){return x.estado===st;}).length+'</strong></div>';
      });
    } else if(CFG.slug==="stockalertas"){
      var low=list.filter(function(x){return Number(x.stock)<Number(x.minimo);}).length;
      html+='<div class="stat"><span>Bajo mínimo</span><strong>'+low+'</strong></div>';
      html+='<div class="stat"><span>Movimientos</span><strong>'+(state.movs||[]).length+'</strong></div>';
      html+='<div class="stat"><span>Ítems</span><strong>'+list.length+'</strong></div>';
    } else {
      html+='<div class="stat"><span>Activos</span><strong>'+list.length+'</strong></div>';
      html+='<div class="stat"><span>Ejemplo</span><strong>CRUD</strong></div>';
      html+='<div class="stat"><span>Clave</span><strong>demo</strong></div>';
    }
    document.getElementById("stats").innerHTML=html;
  }

  function renderPrimary(){
    var list=(state[CFG.listKey]||[]).map(enrich);
    if(search){ var q=search.toLowerCase(); list=list.filter(function(x){ return JSON.stringify(x).toLowerCase().indexOf(q)!==-1; }); }
    var cols=CFG.columns;
    document.getElementById("rows").innerHTML=list.map(function(x){
      return '<tr data-id="'+esc(x.id)+'" class="'+(selected===x.id?"is-on":"")+'">'+CFG.row.map(function(k){ return '<td>'+esc(String(x[k]!=null?x[k]:"—"))+'</td>'; }).join("")+'</tr>';
    }).join("") || '<tr><td colspan="'+cols.length+'">Sin datos.</td></tr>';
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){ tr.onclick=function(){ selected=tr.getAttribute("data-id"); render(); }; });

    var sheet=document.getElementById("sheet");
    var raw=byId(state[CFG.listKey], selected);
    if(!raw){ sheet.innerHTML='<p class="empty-sheet">Elija un registro.</p>'; return; }
    var x=enrich(raw);
    var body='<h3>'+esc(String(x[CFG.row[0]]||x.nombre||x.titulo||x.patente||"Detalle"))+'</h3>';
    CFG.row.forEach(function(k,i){ if(i===0) return; body+='<p>'+esc(String(x[k]!=null?x[k]:"—"))+'</p>'; });
    if(raw.notas && raw.notas.length){ body+='<div style="margin-top:0.6rem">'+raw.notas.map(function(n){return '<p>'+esc(n.fecha)+' · '+esc(n.texto)+'</p>';}).join("")+'</div>'; }
    if(raw.check){ body+='<p>Checklist: '+esc(raw.check.join(", "))+'</p>'; }
    body+='<div class="actions">';
    (CFG.statuses||[]).forEach(function(st){ body+='<button type="button" data-s="'+esc(st)+'">'+esc(labelEstado(st))+'</button>'; });
    if(CFG.payCuota) body+='<button type="button" id="pay">Registrar cuota</button>';
    if(CFG.addNota) body+='<button type="button" id="addnota">Agregar nota</button>';
    if(CFG.wa) body+='<button type="button" class="primary" id="wa">WhatsApp</button>';
    body+='<button type="button" class="danger" id="del">Eliminar</button></div>';
    sheet.innerHTML=body;
    sheet.querySelectorAll("[data-s]").forEach(function(b){ b.onclick=function(){ raw.estado=b.getAttribute("data-s"); save(); toast(labelEstado(raw.estado)); render(); }; });
    var del=sheet.querySelector("#del"); if(del) del.onclick=function(){ if(!confirm("¿Eliminar?"))return; state[CFG.listKey]=state[CFG.listKey].filter(function(i){return i.id!==raw.id;}); selected=null; save(); toast("Eliminado"); render(); };
    var wa=sheet.querySelector("#wa");
    if(wa) wa.onclick=function(){
      var msg="Hola "+(x.clienteNombre||x.cliente||x.dueño||"")+", le escribimos por "+CFG.title+": "+(x.detalle||x.concepto||x.motivo||x.titulo||x.nombre||x.equipo||"su gestión")+".";
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){toast("Copiado");}); else prompt("Copie",msg);
    };
    var pay=sheet.querySelector("#pay");
    if(pay) pay.onclick=function(){ raw.pagadas=Math.min(Number(raw.cuotas||0), Number(raw.pagadas||0)+1); save(); toast("Cuota registrada"); render(); };
    var an=sheet.querySelector("#addnota");
    if(an) an.onclick=function(){ var t=prompt("Nota"); if(!t)return; raw.notas=raw.notas||[]; raw.notas.unshift({fecha:"2026-09-11",texto:t}); save(); toast("Nota ok"); render(); };
  }

  function renderRelated(name){
    var wrap=document.querySelector('[data-panel-view="'+name+'"]');
    var grid=wrap?wrap.querySelector('.related-grid'):null;
    if(!grid) return;
    if(name==="movimientos"){
      grid.innerHTML='<div class="list"><div class="table-scroll"><table><thead><tr><th>Fecha</th><th>Ítem</th><th>Tipo</th><th>Cant</th><th>Detalle</th></tr></thead><tbody>'+
        (state.movs||[]).map(function(m){ var it=byId(state.items,m.itemId)||{}; return '<tr><td>'+esc(m.fecha)+'</td><td>'+esc(it.nombre||"—")+'</td><td>'+esc(m.tipo)+'</td><td>'+esc(m.cant)+'</td><td>'+esc(m.detalle)+'</td></tr>'; }).join("")+
        '</tbody></table></div></div>';
      return;
    }
    if(name==="alertas"){
      var low=(state.items||[]).filter(function(x){return Number(x.stock)<Number(x.minimo);});
      grid.innerHTML=low.map(function(x){ return '<article class="mini-card"><div class="body"><strong>'+esc(x.nombre)+'</strong><span>Stock '+esc(x.stock)+' / mín '+esc(x.minimo)+'</span></div></article>'; }).join("")||'<p>Sin alertas.</p>';
      return;
    }
    if(name==="services"){
      grid.innerHTML=(state.services||[]).map(function(s){ var v=byId(state.items,s.vehiculoId)||{}; return '<article class="mini-card"><div class="body"><strong>'+esc(v.patente||"—")+'</strong><span>'+esc(s.fecha)+' · '+esc(s.detalle)+' · '+esc(s.km)+' km</span></div></article>'; }).join("")||'<p>Sin services.</p>';
      return;
    }
    if(name==="lista"){
      grid.innerHTML=(state.lista||[]).map(function(x){ return '<article class="mini-card"><div class="body"><strong>'+esc(x.nombre)+'</strong><span>'+money(x.precio)+' · mín '+esc(x.minimo)+'</span></div></article>'; }).join("");
      return;
    }
    // generic related collection by tab name matching state key
    var key = name;
    if(name==="tecnicos") key="tecnicos";
    if(name==="choferes") key="choferes";
    if(name==="partes") key="partes";
    if(name==="clientes") key="clientes";
    if(name==="carta") key="carta";
    var list=state[key]||[];
    var form=document.getElementById("create-related");
    if(form) form.setAttribute("data-target", key);
    grid.innerHTML=list.map(function(x){
      return '<article class="mini-card" data-id="'+esc(x.id)+'"><div class="body"><strong>'+esc(x.nombre||x.rol||x.id)+'</strong><span>'+esc(x.tel||x.dir||x.rol||(x.precio!=null?money(x.precio):"")||"")+'</span>'+
        '<div class="card-actions"><button type="button" class="danger" data-del>Eliminar</button></div></div></article>';
    }).join("")||'<p>Vacío.</p>';
    grid.querySelectorAll("[data-del]").forEach(function(b){ b.onclick=function(){ var id=b.closest("[data-id]").getAttribute("data-id"); if(!confirm("¿Eliminar?"))return; state[key]=state[key].filter(function(i){return i.id!==id;}); save(); toast("Eliminado"); render(); }; });
  }

  function render(){
    renderStats();
    fillSelects(document.getElementById("create"));
    if(view===CFG.primary) renderPrimary();
    else renderRelated(view);
  }

  document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.onclick=function(){ showView(b.getAttribute("data-view")); }; });
  document.getElementById("open-create").onclick=function(){ var f=document.getElementById("create"); f.hidden=!f.hidden; fillSelects(f); };
  document.getElementById("search").oninput=function(e){ search=e.target.value.trim(); render(); };
  document.getElementById("reset-sample").onclick=function(){ if(confirm("¿Restablecer?")){ localStorage.removeItem(KEY); location.reload(); } };

  document.getElementById("create").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var item={ id: CFG.slug[0]+Date.now() };
    CFG.form.forEach(function(field){ var name=field[0]; item[name]=String(fd.get(name)||""); if(field[2]==="number") item[name]=Number(item[name]||0); });
    if(CFG.statuses && CFG.statuses.length) item.estado=CFG.statuses[0];
    if(CFG.slug==="ordenes"||CFG.slug==="mayorista") item.fecha="2026-09-11";
    if(CFG.slug==="takeaway") item.hora=new Date().toTimeString().slice(0,5);
    if(CFG.slug==="cuotas"){ item.pagadas=0; item.desde="2026-09-11"; }
    if(CFG.slug==="fichas") item.notas=[];
    if(CFG.slug==="eventos") item.check=["Salón"];
    if(CFG.slug==="abonos"){ item.estado="al_dia"; item.ultimo="2026-09-11"; }
    if(CFG.slug==="mayorista"){
      var li=byId(state.lista, item.listaId)||{};
      item.lineas=[{nombre:li.nombre||"Ítem", cant:Number(item.cant||1), monto:li.precio||0}];
      item.estado="pendiente"; item.fecha="2026-09-11";
      delete item.listaId; delete item.cant;
    }
    state[CFG.listKey].unshift(item); selected=item.id; save(); ev.target.reset(); ev.target.hidden=true; toast("Guardado"); render();
  };

  var rel=document.getElementById("create-related");
  if(rel) rel.onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var target=rel.getAttribute("data-target")||"clientes";
    var neu={ id: "r"+Date.now(), nombre:String(fd.get("nombre")||"").trim() };
    if(fd.get("tel")!=null) neu.tel=String(fd.get("tel")||"");
    if(fd.get("extra")){
      var ex=String(fd.get("extra"));
      if(target==="lista"||target==="carta"){ neu.precio=Number(ex)||0; if(target==="lista") neu.minimo=1; }
      else if(target==="partes") neu.rol=ex;
      else if(target==="clientes") neu.dir=ex;
    }
    state[target]=state[target]||[]; state[target].unshift(neu); save(); ev.target.reset(); toast("Alta ok"); render();
  };

  // stock movement helper
  var mov=document.getElementById("create-mov");
  if(mov) mov.onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var itemId=String(fd.get("itemId")); var tipo=String(fd.get("tipo")); var cant=Number(fd.get("cant")||0);
    var it=byId(state.items,itemId); if(!it) return;
    it.stock = Number(it.stock||0) + (tipo==="entrada"?cant:-cant);
    state.movs=state.movs||[]; state.movs.unshift({id:"m"+Date.now(),itemId:itemId,tipo:tipo,cant:cant,fecha:"2026-09-11",detalle:String(fd.get("detalle")||"")});
    save(); ev.target.reset(); toast("Movimiento ok"); render();
  };

  fillSelects(document.getElementById("create"));
  var movForm = document.getElementById("create-mov");
  if (movForm) fillSelects(movForm);
  render();
})();
