(function () {
  var KEY = "sistema-cc-v1";
  var state = load();
  var selected = null;
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
    return { clientes: window.CC_SEED.clientes.slice(), movs: window.CC_SEED.movs.slice() };
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) { return String(s||"").replace(/[&<>"']/g, function (c) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; }); }
  function money(n) { return "$ " + Number(n||0).toLocaleString("es-AR"); }
  function saldo(id) {
    return state.movs.filter(function (m) { return m.clienteId === id; }).reduce(function (acc, m) {
      return acc + (m.tipo === "cargo" ? Number(m.monto) : -Number(m.monto));
    }, 0);
  }
  function ultimo(id) {
    var xs = state.movs.filter(function (m) { return m.clienteId === id; }).sort(function (a,b){ return b.fecha.localeCompare(a.fecha); });
    return xs[0] || null;
  }
  function render() {
    var deudores = state.clientes.filter(function (c) { return saldo(c.id) > 0; }).length;
    var total = state.clientes.reduce(function (a,c){ return a + Math.max(0, saldo(c.id)); }, 0);
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Clientes</span><strong>'+state.clientes.length+'</strong></div>'+
      '<div class="stat"><span>Con deuda</span><strong>'+deudores+'</strong></div>'+
      '<div class="stat"><span>A cobrar</span><strong>'+money(total)+'</strong></div>'+
      '<div class="stat"><span>Movimientos</span><strong>'+state.movs.length+'</strong></div>';
    document.getElementById("filters").innerHTML = "";
    document.getElementById("rows").innerHTML = state.clientes.map(function (c) {
      var s = saldo(c.id); var u = ultimo(c.id);
      return '<tr data-id="'+esc(c.id)+'" class="'+(selected===c.id?"is-on":"")+'"><td>'+esc(c.nombre)+'</td><td>'+esc(c.tel)+'</td><td class="amount">'+money(s)+'</td><td>'+esc(u ? u.fecha + " · " + u.detalle : "—")+'</td></tr>';
    }).join("");
    document.querySelectorAll("#rows tr[data-id]").forEach(function (tr) { tr.onclick = function () { selected = tr.getAttribute("data-id"); render(); }; });
    var sheet = document.getElementById("sheet");
    var c = state.clientes.filter(function (x) { return x.id === selected; })[0];
    if (!c) { sheet.innerHTML = "<p>Elija un cliente.</p>"; return; }
    var movs = state.movs.filter(function (m) { return m.clienteId === c.id; }).sort(function (a,b){ return b.fecha.localeCompare(a.fecha); });
    sheet.innerHTML = "<h3>"+esc(c.nombre)+"</h3><p>Saldo: <strong>"+money(saldo(c.id))+"</strong></p><p>Tel: "+esc(c.tel)+"</p><div style=\"margin-top:0.8rem\">"+movs.map(function(m){
      return "<p>"+esc(m.fecha)+" · "+esc(m.tipo)+" · "+money(m.monto)+" — "+esc(m.detalle)+"</p>";
    }).join("")+"</div>";
  }
  var form = document.getElementById("create");
  var sel = form.clienteId;
  state.clientes.forEach(function (c) { var o = document.createElement("option"); o.value = c.id; o.textContent = c.nombre; sel.appendChild(o); });
  document.getElementById("open-create").onclick = function () { form.hidden = !form.hidden; };
  form.onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(form);
    state.movs.push({ id: "m"+Date.now(), clienteId: String(fd.get("clienteId")), tipo: String(fd.get("tipo")), monto: Number(fd.get("monto")||0), detalle: String(fd.get("detalle")).trim(), fecha: "2026-09-11" });
    selected = String(fd.get("clienteId")); save(); form.reset(); form.hidden = true; render();
  };
  render();
})();
