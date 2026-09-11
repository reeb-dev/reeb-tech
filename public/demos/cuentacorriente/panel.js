(function () {
  var KEY = "sistema-cc-v3";
  var seed = window.CC_SEED;
  var state = load();
  var view = "cuentas", filter = "todos", search = "", selected = null;
  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function load(){ try{var r=localStorage.getItem(KEY);if(r)return JSON.parse(r);}catch(e){} return {clientes:clone(seed.clientes),movs:clone(seed.movs)}; }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s){ return String(s||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];}); }
  function money(n){ return "$ "+Number(n||0).toLocaleString("es-AR"); }
  function toast(m){ var el=document.getElementById("toast"); el.textContent=m; el.classList.add("show"); setTimeout(function(){el.classList.remove("show");},1600); }
  function saldo(id){ return state.movs.filter(function(m){return m.clienteId===id;}).reduce(function(acc,m){return acc+(m.tipo==="cargo"?Number(m.monto):-Number(m.monto));},0); }
  function ultimo(id){ return state.movs.filter(function(m){return m.clienteId===id;}).sort(function(a,b){return b.fecha.localeCompare(a.fecha);})[0]||null; }
  function byId(id){ return state.clientes.filter(function(c){return c.id===id;})[0]; }
  function fillSel(){ document.querySelector("#create [name=clienteId]").innerHTML=state.clientes.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.nombre)+'</option>';}).join(""); }
  function showView(name){
    view=name;
    document.getElementById("view-cuentas").classList.toggle("panel-hidden", name!=="cuentas");
    document.getElementById("view-movimientos").classList.toggle("panel-hidden", name!=="movimientos");
    document.querySelectorAll(".panel-tabs button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-view")===name); });
    document.getElementById("view-title").textContent = name==="cuentas"?"Cuentas":"Movimientos";
    render();
  }
  function render(){
    var deudores=state.clientes.filter(function(c){return saldo(c.id)>0;}).length;
    var total=state.clientes.reduce(function(a,c){return a+Math.max(0,saldo(c.id));},0);
    document.getElementById("stats").innerHTML=
      '<div class="stat"><span>Clientes</span><strong>'+state.clientes.length+'</strong></div>'+
      '<div class="stat"><span>Con deuda</span><strong>'+deudores+'</strong></div>'+
      '<div class="stat"><span>A cobrar</span><strong>'+money(total)+'</strong></div>'+
      '<div class="stat"><span>Movimientos</span><strong>'+state.movs.length+'</strong></div>';
    var opts=[["todos","Todos"],["deuda","Con deuda"],["ok","Al día"]];
    document.getElementById("filters").innerHTML=opts.map(function(o){return '<button type="button" data-f="'+o[0]+'" class="'+(filter===o[0]?"on":"")+'">'+o[1]+'</button>';}).join("");
    document.querySelectorAll("#filters button").forEach(function(b){b.onclick=function(){filter=b.getAttribute("data-f");render();};});

    if(view==="movimientos"){
      var movs=state.movs.slice().sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
      if(search){ var q=search.toLowerCase(); movs=movs.filter(function(m){var c=byId(m.clienteId)||{}; return (c.nombre+" "+m.detalle).toLowerCase().indexOf(q)!==-1;}); }
      document.getElementById("mov-rows").innerHTML=movs.map(function(m){
        var c=byId(m.clienteId)||{nombre:"—"};
        return '<tr><td>'+esc(m.fecha)+'</td><td>'+esc(c.nombre)+'</td><td>'+esc(m.tipo)+'</td><td>'+esc(m.detalle)+'</td><td class="amount">'+money(m.monto)+'</td>'+
          '<td><button type="button" class="btn-soft" data-del="'+esc(m.id)+'" style="padding:0.25rem 0.5rem;font-size:0.8rem">Borrar</button></td></tr>';
      }).join("")||'<tr><td colspan="6">Sin movimientos.</td></tr>';
      document.querySelectorAll("#mov-rows [data-del]").forEach(function(b){
        b.onclick=function(){ if(!confirm("¿Borrar movimiento?"))return; var id=b.getAttribute("data-del");
          state.movs=state.movs.filter(function(m){return m.id!==id;}); save(); toast("Movimiento borrado"); render(); };
      });
      return;
    }

    var list=state.clientes.slice();
    if(filter==="deuda") list=list.filter(function(c){return saldo(c.id)>0;});
    if(filter==="ok") list=list.filter(function(c){return saldo(c.id)<=0;});
    if(search){ var q2=search.toLowerCase(); list=list.filter(function(c){return (c.nombre+" "+c.tel).toLowerCase().indexOf(q2)!==-1;}); }
    document.getElementById("rows").innerHTML=list.map(function(c){
      var s=saldo(c.id); var u=ultimo(c.id);
      return '<tr data-id="'+esc(c.id)+'" class="'+(selected===c.id?"is-on":"")+'"><td>'+esc(c.nombre)+'</td><td>'+esc(c.tel)+'</td><td class="amount">'+money(s)+'</td><td>'+esc(u?u.fecha+" · "+u.detalle:"—")+'</td></tr>';
    }).join("");
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){tr.onclick=function(){selected=tr.getAttribute("data-id");render();};});
    var sheet=document.getElementById("sheet");
    var c=byId(selected);
    if(!c){ sheet.innerHTML='<p class="empty-sheet">Elija un cliente.</p>'; return; }
    var movs=state.movs.filter(function(m){return m.clienteId===c.id;}).sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
    var run=0;
    var extracto=movs.slice().reverse().map(function(m){
      run += m.tipo==="cargo"?Number(m.monto):-Number(m.monto);
      return '<p>'+esc(m.fecha)+' · '+esc(m.tipo)+' · '+money(m.monto)+' — '+esc(m.detalle)+' <span style="color:var(--muted)">(saldo '+money(run)+')</span></p>';
    }).reverse().join("") || '<p>Sin movimientos.</p>';
    sheet.innerHTML='<img class="sheet-hero" src="'+esc(c.foto||"img/hero.jpg")+'" alt="">'+
      '<h3>'+esc(c.nombre)+'</h3><p>Saldo: <strong>'+money(saldo(c.id))+'</strong></p><p>Tel: '+esc(c.tel)+'</p>'+
      '<div style="margin-top:0.7rem">'+extracto+'</div>'+
      '<div class="actions">'+
        '<button type="button" class="primary" id="wa-cc">Recordatorio WhatsApp</button>'+
        '<button type="button" id="edit-cli">Editar cliente</button>'+
        '<button type="button" class="danger" id="del-cli">Eliminar cliente</button></div>';
    sheet.querySelector("#wa-cc").onclick=function(){
      var msg="Hola "+c.nombre+", le recordamos un saldo de "+money(saldo(c.id))+" en cuenta corriente. Cualquier duda, escribanos.";
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){toast("Copiado");});
      else prompt("Copie",msg);
    };
    sheet.querySelector("#edit-cli").onclick=function(){
      var f=document.getElementById("create-cliente"); f.hidden=false; document.getElementById("create").hidden=true;
      f.id.value=c.id; f.nombre.value=c.nombre; f.tel.value=c.tel||"";
      document.getElementById("cliente-submit").textContent="Actualizar cliente"; document.getElementById("cliente-cancel").hidden=false;
    };
    sheet.querySelector("#del-cli").onclick=function(){
      if(!confirm("¿Eliminar cliente y sus movimientos?")) return;
      state.movs=state.movs.filter(function(m){return m.clienteId!==c.id;});
      state.clientes=state.clientes.filter(function(x){return x.id!==c.id;});
      selected=null; save(); fillSel(); toast("Cliente eliminado"); render();
    };
  }
  document.querySelectorAll(".panel-tabs button").forEach(function(b){b.onclick=function(){showView(b.getAttribute("data-view"));};});
  document.getElementById("open-create").onclick=function(){ document.getElementById("create").hidden=!document.getElementById("create").hidden; document.getElementById("create-cliente").hidden=true; };
  document.getElementById("open-cliente").onclick=function(){
    var f=document.getElementById("create-cliente"); f.hidden=!f.hidden; document.getElementById("create").hidden=true;
    if(!f.hidden){ f.reset(); f.id.value=""; document.getElementById("cliente-submit").textContent="Guardar cliente"; document.getElementById("cliente-cancel").hidden=true; }
  };
  document.getElementById("cliente-cancel").onclick=function(){ var f=document.getElementById("create-cliente"); f.hidden=true; f.reset(); f.id.value=""; document.getElementById("cliente-submit").textContent="Guardar cliente"; document.getElementById("cliente-cancel").hidden=true; };
  document.getElementById("search").oninput=function(e){search=e.target.value.trim();render();};
  document.getElementById("reset-sample").onclick=function(){ if(confirm("¿Restablecer?")){localStorage.removeItem(KEY);location.reload();} };
  fillSel();
  document.getElementById("create").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target);
    state.movs.push({id:"m"+Date.now(),clienteId:String(fd.get("clienteId")),tipo:String(fd.get("tipo")),monto:Number(fd.get("monto")||0),detalle:String(fd.get("detalle")).trim(),fecha:"2026-09-11"});
    selected=String(fd.get("clienteId")); save(); ev.target.reset(); ev.target.hidden=true; toast("Movimiento ok"); render();
  };
  document.getElementById("create-cliente").onsubmit=function(ev){
    ev.preventDefault(); var fd=new FormData(ev.target); var id=String(fd.get("id")||"");
    var payload={nombre:String(fd.get("nombre")).trim(),tel:String(fd.get("tel")||"")};
    if(id&&byId(id)){ var c=byId(id); c.nombre=payload.nombre; c.tel=payload.tel; selected=id; toast("Cliente actualizado"); }
    else { var neu={id:"cl"+Date.now(),nombre:payload.nombre,tel:payload.tel,foto:"img/hero.jpg"}; state.clientes.push(neu); selected=neu.id; toast("Cliente ok"); }
    save(); fillSel(); ev.target.reset(); ev.target.id.value=""; ev.target.hidden=true;
    document.getElementById("cliente-submit").textContent="Guardar cliente"; document.getElementById("cliente-cancel").hidden=true; render();
  };
  render();
})();
