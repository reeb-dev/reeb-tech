(function () {
  var KEY = "sistema-cotizaciones-v1";
  var state = load();
  var filter = "todos";
  var selected = null;
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
    return { items: window.COTIZ_SEED.items.slice(), seq: 1005 };
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) { return String(s||"").replace(/[&<>"']/g, function (c) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; }); }
  function money(n) { return "$ " + Number(n||0).toLocaleString("es-AR"); }
  function label(e) { return ({borrador:"Borrador",enviada:"Enviada",aceptada:"Aceptada",pedido:"Pedido"})[e]||e; }
  function badge(e) { return e==="pedido"?"is-ok":e==="aceptada"?"is-warn":e==="borrador"?"":"is-warn"; }
  function list() {
    var xs = state.items.slice();
    if (filter !== "todos") xs = xs.filter(function (x) { return x.estado === filter; });
    return xs;
  }
  function render() {
    var all = state.items;
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Cotizaciones</span><strong>'+all.length+'</strong></div>'+
      '<div class="stat"><span>Enviadas</span><strong>'+all.filter(function(x){return x.estado==="enviada";}).length+'</strong></div>'+
      '<div class="stat"><span>Aceptadas</span><strong>'+all.filter(function(x){return x.estado==="aceptada";}).length+'</strong></div>'+
      '<div class="stat"><span>Pedidos</span><strong>'+all.filter(function(x){return x.estado==="pedido";}).length+'</strong></div>';
    var opts = [["todos","Todas"],["borrador","Borrador"],["enviada","Enviada"],["aceptada","Aceptada"],["pedido","Pedido"]];
    document.getElementById("filters").innerHTML = opts.map(function(o){
      return '<button type="button" data-f="'+o[0]+'" class="'+(filter===o[0]?"on":"")+'">'+o[1]+'</button>';
    }).join("");
    document.querySelectorAll("#filters button").forEach(function(b){ b.onclick=function(){ filter=b.getAttribute("data-f"); render(); }; });
    document.getElementById("rows").innerHTML = list().map(function(x){
      return '<tr data-id="'+esc(x.id)+'" class="'+(selected===x.id?"is-on":"")+'"><td>'+esc(x.numero)+'</td><td>'+esc(x.cliente)+'</td><td>'+esc(x.item)+'</td><td class="amount">'+money(x.monto)+'</td><td><span class="badge-state '+badge(x.estado)+'">'+esc(label(x.estado))+'</span></td></tr>';
    }).join("") || '<tr><td colspan="5">Sin filas.</td></tr>';
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){ tr.onclick=function(){ selected=tr.getAttribute("data-id"); render(); }; });
    var sheet = document.getElementById("sheet");
    var x = state.items.filter(function(i){return i.id===selected;})[0];
    if (!x) { sheet.innerHTML = "<p>Elija una cotización.</p>"; return; }
    sheet.innerHTML = "<h3>"+esc(x.numero)+"</h3><p>"+esc(x.cliente)+"</p><p>"+esc(x.item)+"</p><p><strong>"+money(x.monto)+"</strong></p><p>Válida: "+esc(x.valida||"—")+"</p><p>"+esc(x.notas||"")+"</p><p><span class=\"badge-state "+badge(x.estado)+"\">"+esc(label(x.estado))+"</span></p><div class=\"actions\"><button data-s=\"enviada\">Marcar enviada</button><button data-s=\"aceptada\">Aceptada</button><button data-s=\"pedido\">Pasar a pedido</button><button data-s=\"borrador\">Borrador</button></div>";
    sheet.querySelectorAll("[data-s]").forEach(function(b){ b.onclick=function(){ x.estado=b.getAttribute("data-s"); save(); render(); }; });
  }
  var form = document.getElementById("create");
  document.getElementById("open-create").onclick = function(){ form.hidden = !form.hidden; };
  form.onsubmit = function(ev){
    ev.preventDefault();
    var fd = new FormData(form);
    var item = { id: "c"+Date.now(), numero: "COT-"+state.seq++, cliente: String(fd.get("cliente")).trim(), item: String(fd.get("item")).trim(), monto: Number(fd.get("monto")||0), valida: String(fd.get("valida")||""), notas: String(fd.get("notas")||""), estado: "borrador" };
    state.items.unshift(item); selected = item.id; save(); form.reset(); form.hidden = true; render();
  };
  render();
})();
