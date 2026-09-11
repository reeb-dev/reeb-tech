(function () {
  var KEY = "sistema-comandas-v1";
  var state = load();
  var filter = "activas";
  var selected = null;
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
    return { mesas: window.COMANDAS_SEED.mesas.slice() };
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) { return String(s||"").replace(/[&<>"']/g, function (c) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; }); }
  function money(n) { return "$ " + Number(n||0).toLocaleString("es-AR"); }
  function total(m) { return (m.items||[]).reduce(function (a,i){ return a + Number(i.monto||0); }, 0); }
  function label(e) { return ({abierta:"Abierta",cocina:"En cocina",lista:"Lista",cerrada:"Cerrada"})[e]||e; }
  function badge(e) { return e==="lista"?"is-ok":e==="cocina"?"is-warn":e==="cerrada"?"is-bad":""; }
  function list() {
    var xs = state.mesas.slice();
    if (filter === "activas") xs = xs.filter(function (m) { return m.estado !== "cerrada"; });
    else if (filter !== "todas") xs = xs.filter(function (m) { return m.estado === filter; });
    return xs;
  }
  function render() {
    var act = state.mesas.filter(function (m) { return m.estado !== "cerrada"; });
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Activas</span><strong>'+act.length+'</strong></div>'+
      '<div class="stat"><span>Cocina</span><strong>'+state.mesas.filter(function(m){return m.estado==="cocina";}).length+'</strong></div>'+
      '<div class="stat"><span>Listas</span><strong>'+state.mesas.filter(function(m){return m.estado==="lista";}).length+'</strong></div>'+
      '<div class="stat"><span>Total abierto</span><strong>'+money(act.reduce(function(a,m){return a+total(m);},0))+'</strong></div>';
    var opts = [["activas","Activas"],["cocina","Cocina"],["lista","Listas"],["todas","Todas"]];
    document.getElementById("filters").innerHTML = opts.map(function(o){ return '<button type="button" data-f="'+o[0]+'" class="'+(filter===o[0]?"on":"")+'">'+o[1]+'</button>'; }).join("");
    document.querySelectorAll("#filters button").forEach(function(b){ b.onclick=function(){ filter=b.getAttribute("data-f"); render(); }; });
    document.getElementById("rows").innerHTML = list().map(function(m){
      return '<tr data-id="'+esc(m.id)+'" class="'+(selected===m.id?"is-on":"")+'"><td>'+esc(m.mesa)+'</td><td>'+esc((m.items||[]).map(function(i){return i.nombre;}).join(", "))+'</td><td class="amount">'+money(total(m))+'</td><td><span class="badge-state '+badge(m.estado)+'">'+esc(label(m.estado))+'</span></td></tr>';
    }).join("") || '<tr><td colspan="4">Sin mesas.</td></tr>';
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){ tr.onclick=function(){ selected=tr.getAttribute("data-id"); render(); }; });
    var sheet = document.getElementById("sheet");
    var m = state.mesas.filter(function(x){return x.id===selected;})[0];
    if (!m) { sheet.innerHTML = "<p>Elija una mesa.</p>"; return; }
    sheet.innerHTML = "<h3>"+esc(m.mesa)+"</h3><p>"+esc(m.notas||"Sin notas")+"</p><p><strong>"+money(total(m))+"</strong></p><div>"+(m.items||[]).map(function(i){return "<p>"+esc(i.nombre)+" · "+money(i.monto)+"</p>";}).join("")+"</div><p><span class=\"badge-state "+badge(m.estado)+"\">"+esc(label(m.estado))+"</span></p><div class=\"actions\"><button data-s=\"abierta\">Abierta</button><button data-s=\"cocina\">A cocina</button><button data-s=\"lista\">Lista</button><button data-s=\"cerrada\">Cerrar</button></div>";
    sheet.querySelectorAll("[data-s]").forEach(function(b){ b.onclick=function(){ m.estado=b.getAttribute("data-s"); save(); render(); }; });
  }
  var form = document.getElementById("create");
  document.getElementById("open-create").onclick = function(){ form.hidden=!form.hidden; };
  form.onsubmit = function(ev){
    ev.preventDefault();
    var fd = new FormData(form);
    var mesaName = String(fd.get("mesa")).trim();
    var existing = state.mesas.filter(function(m){ return m.mesa.toLowerCase()===mesaName.toLowerCase() && m.estado!=="cerrada"; })[0];
    var item = { nombre: String(fd.get("item")).trim(), monto: Number(fd.get("monto")||0) };
    if (existing) {
      existing.items.push(item);
      if (fd.get("notas")) existing.notas = String(fd.get("notas"));
      selected = existing.id;
    } else {
      var neu = { id: "me"+Date.now(), mesa: mesaName, items: [item], notas: String(fd.get("notas")||""), estado: "abierta" };
      state.mesas.unshift(neu); selected = neu.id;
    }
    save(); form.reset(); form.hidden = true; render();
  };
  render();
})();
