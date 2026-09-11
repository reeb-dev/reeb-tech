(function () {
  var KEY = "sistema-reservas-v1";
  var state = load();
  var filter = "activas";
  var selected = null;
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
    return { unidades: window.RESERVAS_SEED.unidades.slice(), reservas: window.RESERVAS_SEED.reservas.slice() };
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) { return String(s||"").replace(/[&<>"']/g, function (c) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; }); }
  function money(n) { return "$ " + Number(n||0).toLocaleString("es-AR"); }
  function label(e) { return ({consulta:"Consulta",reservada:"Reservada",ocupada:"Ocupada",cerrada:"Cerrada"})[e]||e; }
  function badge(e) { return e==="ocupada"?"is-warn":e==="reservada"?"is-ok":e==="cerrada"?"is-bad":""; }
  function list() {
    var xs = state.reservas.slice();
    if (filter === "activas") xs = xs.filter(function (r) { return r.estado !== "cerrada"; });
    else if (filter !== "todas") xs = xs.filter(function (r) { return r.estado === filter; });
    return xs;
  }
  function render() {
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Reservas</span><strong>'+state.reservas.length+'</strong></div>'+
      '<div class="stat"><span>Ocupadas</span><strong>'+state.reservas.filter(function(r){return r.estado==="ocupada";}).length+'</strong></div>'+
      '<div class="stat"><span>Reservadas</span><strong>'+state.reservas.filter(function(r){return r.estado==="reservada";}).length+'</strong></div>'+
      '<div class="stat"><span>Unidades</span><strong>'+state.unidades.length+'</strong></div>';
    var opts = [["activas","Activas"],["consulta","Consulta"],["reservada","Reservada"],["ocupada","Ocupada"],["todas","Todas"]];
    document.getElementById("filters").innerHTML = opts.map(function(o){ return '<button type="button" data-f="'+o[0]+'" class="'+(filter===o[0]?"on":"")+'">'+o[1]+'</button>'; }).join("");
    document.querySelectorAll("#filters button").forEach(function(b){ b.onclick=function(){ filter=b.getAttribute("data-f"); render(); }; });
    document.getElementById("rows").innerHTML = list().map(function(r){
      return '<tr data-id="'+esc(r.id)+'" class="'+(selected===r.id?"is-on":"")+'"><td>'+esc(r.unidad)+'</td><td>'+esc(r.huesped)+'</td><td>'+esc(r.desde)+" → "+esc(r.hasta)+'</td><td class="amount">'+money(r.sena)+'</td><td><span class="badge-state '+badge(r.estado)+'">'+esc(label(r.estado))+'</span></td></tr>';
    }).join("") || '<tr><td colspan="5">Sin reservas.</td></tr>';
    document.querySelectorAll("#rows tr[data-id]").forEach(function(tr){ tr.onclick=function(){ selected=tr.getAttribute("data-id"); render(); }; });
    var sheet = document.getElementById("sheet");
    var r = state.reservas.filter(function(x){return x.id===selected;})[0];
    if (!r) { sheet.innerHTML = "<p>Elija una reserva.</p>"; return; }
    var uObj=state.unidades.filter(function(u){var n=typeof u==="string"?u:u.nombre; return n===r.unidad;})[0]; var foto=(uObj&&uObj.foto)||"img/hero.jpg";
    sheet.innerHTML = '<img class="sheet-hero" src="'+foto+'" alt="">' + "<h3>"+esc(r.unidad)+"</h3><p>"+esc(r.huesped)+"</p><p>"+esc(r.desde)+" → "+esc(r.hasta)+"</p><p>Seña: <strong>"+money(r.sena)+"</strong></p><p>"+esc(r.notas||"—")+"</p><p><span class=\"badge-state "+badge(r.estado)+"\">"+esc(label(r.estado))+"</span></p><div class=\"actions\"><button data-s=\"consulta\">Consulta</button><button data-s=\"reservada\">Reservada</button><button data-s=\"ocupada\">Check-in</button><button data-s=\"cerrada\">Check-out</button></div>";
    sheet.querySelectorAll("[data-s]").forEach(function(b){ b.onclick=function(){ r.estado=b.getAttribute("data-s"); save(); render(); }; });
  }
  var form = document.getElementById("create");
  state.unidades.forEach(function(u){ var name=typeof u==="string"?u:u.nombre; var o=document.createElement("option"); o.value=name; o.textContent=name; form.unidad.appendChild(o); });
  document.getElementById("open-create").onclick = function(){ form.hidden=!form.hidden; };
  form.onsubmit = function(ev){
    ev.preventDefault();
    var fd = new FormData(form);
    var item = { id: "r"+Date.now(), unidad: String(fd.get("unidad")), huesped: String(fd.get("huesped")).trim(), desde: String(fd.get("desde")), hasta: String(fd.get("hasta")), sena: Number(fd.get("sena")||0), notas: String(fd.get("notas")||""), estado: "reservada" };
    state.reservas.unshift(item); selected = item.id; save(); form.reset(); form.hidden = true; render();
  };
  render();

  var resetBtn = document.getElementById("reset-sample");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!confirm("¿Restablecer los datos de ejemplo de este panel?")) return;
      localStorage.removeItem("sistema-reservas-v1");
      location.reload();
    });
  }
})();
