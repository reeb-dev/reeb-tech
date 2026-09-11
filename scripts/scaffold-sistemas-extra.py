#!/usr/bin/env python3
"""Scaffold new management systems without colliding with existing demos."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ROOT / "public" / "demos"
HUB = DEMOS / "hub-img"

SYSTEMS = json.loads(Path("/tmp/sistemas_cfg.json").read_text(encoding="utf-8"))

FAV = """  <link rel="icon" href="/favicon.ico?v=20260911fav" sizes="any">
  <link rel="icon" href="/brand/reeb-mark-32.png?v=20260911fav" type="image/png" sizes="32x32">
  <link rel="icon" href="/brand/reeb-mark-16.png?v=20260911fav" type="image/png" sizes="16x16">
  <link rel="icon" href="/brand/reeb-mark.svg?v=20260911fav" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicon.ico?v=20260911fav">
  <link rel="apple-touch-icon" href="/brand/reeb-mark-180.png?v=20260911fav" sizes="180x180">
"""

# Schema-driven panels: each system defines list fields, statuses, form fields, related collections
SCHEMAS: dict[str, dict] = {
    "ordenes": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel"]},
        "columns": [("fecha", "Fecha"), ("cliente", "Cliente"), ("equipo", "Equipo"), ("detalle", "Detalle"), ("estado", "Estado")],
        "statuses": ["ingreso", "en_curso", "listo", "entregado"],
        "statusLabels": {"ingreso": "Ingreso", "en_curso": "En curso", "listo": "Listo", "entregado": "Entregado"},
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("equipo", "Equipo / unidad", "text"),
            ("detalle", "Trabajo", "text"),
        ],
        "row": ["fecha", "clienteNombre", "equipo", "detalle", "estadoLabel"],
        "wa": True,
    },
    "stockalertas": {
        "listKey": "items",
        "related": {},
        "columns": [("nombre", "Ítem"), ("stock", "Stock"), ("minimo", "Mínimo"), ("unidad", "Unidad"), ("alerta", "Alerta")],
        "statuses": [],
        "form": [("nombre", "Nombre", "text"), ("stock", "Stock", "number"), ("minimo", "Mínimo", "number"), ("unidad", "Unidad", "text")],
        "row": ["nombre", "stock", "minimo", "unidad", "alerta"],
        "extraTabs": {
            "movimientos": "movs",
            "alertas": "alertas",
        },
        "wa": False,
    },
    "visitas": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel", "dir"], "tecnicos": ["nombre"]},
        "columns": [("fecha", "Fecha"), ("hora", "Hora"), ("cliente", "Cliente"), ("tecnico", "Técnico"), ("estado", "Estado")],
        "statuses": ["pendiente", "en_camino", "hecha", "cancelada"],
        "statusLabels": {"pendiente": "Pendiente", "en_camino": "En camino", "hecha": "Hecha", "cancelada": "Cancelada"},
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("tecnicoId", "Técnico", "select:tecnicos"),
            ("fecha", "Fecha", "date"),
            ("hora", "Hora", "time"),
            ("motivo", "Motivo", "text"),
        ],
        "row": ["fecha", "hora", "clienteNombre", "tecnicoNombre", "estadoLabel"],
        "wa": True,
    },
    "takeaway": {
        "listKey": "items",
        "related": {"carta": ["nombre", "precio"]},
        "columns": [("hora", "Hora"), ("cliente", "Cliente"), ("plato", "Pedido"), ("estado", "Estado")],
        "statuses": ["nuevo", "preparando", "listo", "entregado"],
        "statusLabels": {"nuevo": "Nuevo", "preparando": "Preparando", "listo": "Listo", "entregado": "Entregado"},
        "form": [
            ("cliente", "Cliente / retiro", "text"),
            ("tel", "Teléfono", "text"),
            ("platoId", "Ítem", "select:carta"),
            ("nota", "Nota", "text"),
        ],
        "row": ["hora", "cliente", "platoNombre", "estadoLabel"],
        "wa": True,
    },
    "cuotas": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel"]},
        "columns": [("cliente", "Cliente"), ("concepto", "Concepto"), ("total", "Total"), ("progreso", "Cuotas"), ("estado", "Estado")],
        "statuses": [],
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("concepto", "Concepto", "text"),
            ("total", "Total", "number"),
            ("cuotas", "Nº cuotas", "number"),
        ],
        "row": ["clienteNombre", "concepto", "totalMoney", "progreso", "planEstado"],
        "wa": True,
        "payCuota": True,
    },
    "obra": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel"]},
        "columns": [("nombre", "Obra"), ("cliente", "Cliente"), ("avance", "Avance"), ("presupuesto", "Presupuesto"), ("estado", "Estado")],
        "statuses": ["aprobada", "en_obra", "cerrada"],
        "statusLabels": {"aprobada": "Aprobada", "en_obra": "En obra", "cerrada": "Cerrada"},
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("nombre", "Obra", "text"),
            ("presupuesto", "Presupuesto", "number"),
            ("avance", "Avance %", "number"),
            ("extras", "Extras", "text"),
        ],
        "row": ["nombre", "clienteNombre", "avancePct", "presupuestoMoney", "estadoLabel"],
        "wa": False,
    },
    "fichas": {
        "listKey": "items",
        "related": {},
        "columns": [("nombre", "Nombre"), ("tipo", "Tipo"), ("dueño", "Responsable"), ("proxima", "Próximo"), ("tel", "Tel")],
        "statuses": [],
        "form": [
            ("nombre", "Nombre", "text"),
            ("tipo", "Tipo", "text"),
            ("dueño", "Dueño / responsable", "text"),
            ("tel", "Teléfono", "text"),
            ("proxima", "Próximo control", "date"),
        ],
        "row": ["nombre", "tipo", "dueño", "proxima", "tel"],
        "wa": True,
        "addNota": True,
    },
    "flota": {
        "listKey": "items",
        "related": {},
        "columns": [("patente", "Patente"), ("modelo", "Modelo"), ("km", "Km"), ("vtv", "VTV"), ("seguro", "Seguro")],
        "statuses": [],
        "form": [
            ("patente", "Patente", "text"),
            ("modelo", "Modelo", "text"),
            ("km", "Km", "number"),
            ("vtv", "VTV hasta", "date"),
            ("seguro", "Seguro hasta", "date"),
        ],
        "row": ["patente", "modelo", "km", "vtv", "seguro"],
        "wa": False,
        "extraTabs": {"services": "services"},
    },
    "eventos": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel"]},
        "columns": [("fecha", "Fecha"), ("cliente", "Cliente"), ("personas", "Personas"), ("sena", "Seña"), ("estado", "Estado")],
        "statuses": ["consulta", "reservado", "cerrado"],
        "statusLabels": {"consulta": "Consulta", "reservado": "Reservado", "cerrado": "Cerrado"},
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("fecha", "Fecha", "date"),
            ("personas", "Personas", "number"),
            ("menu", "Menú", "text"),
            ("sena", "Seña", "number"),
        ],
        "row": ["fecha", "clienteNombre", "personas", "senaMoney", "estadoLabel"],
        "wa": True,
    },
    "abonos": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel"]},
        "columns": [("cliente", "Cliente"), ("plan", "Plan"), ("monto", "Monto"), ("ultimo", "Último pago"), ("estado", "Estado")],
        "statuses": ["al_dia", "mora", "baja"],
        "statusLabels": {"al_dia": "Al día", "mora": "Mora", "baja": "Baja"},
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("plan", "Plan", "text"),
            ("monto", "Monto mensual", "number"),
        ],
        "row": ["clienteNombre", "plan", "montoMoney", "ultimo", "estadoLabel"],
        "wa": True,
    },
    "mayorista": {
        "listKey": "items",
        "related": {"clientes": ["nombre", "tel"], "lista": ["nombre", "precio", "minimo"]},
        "columns": [("fecha", "Fecha"), ("cliente", "Cliente"), ("detalle", "Detalle"), ("estado", "Estado")],
        "statuses": ["pendiente", "despachado", "entregado"],
        "statusLabels": {"pendiente": "Pendiente", "despachado": "Despachado", "entregado": "Entregado"},
        "form": [
            ("clienteId", "Cliente", "select:clientes"),
            ("listaId", "Ítem lista", "select:lista"),
            ("cant", "Cantidad", "number"),
        ],
        "row": ["fecha", "clienteNombre", "detalleLineas", "estadoLabel"],
        "wa": False,
        "extraTabs": {"lista": "lista"},
    },
    "reparto": {
        "listKey": "items",
        "related": {"choferes": ["nombre"]},
        "columns": [("cliente", "Cliente"), ("zona", "Zona"), ("chofer", "Chofer"), ("detalle", "Detalle"), ("estado", "Estado")],
        "statuses": ["pendiente", "en_ruta", "entregado"],
        "statusLabels": {"pendiente": "Pendiente", "en_ruta": "En ruta", "entregado": "Entregado"},
        "form": [
            ("cliente", "Cliente", "text"),
            ("zona", "Zona", "text"),
            ("choferId", "Chofer", "select:choferes"),
            ("detalle", "Detalle", "text"),
        ],
        "row": ["cliente", "zona", "choferNombre", "detalle", "estadoLabel"],
        "wa": True,
    },
    "contratos": {
        "listKey": "items",
        "related": {"partes": ["nombre", "rol"]},
        "columns": [("titulo", "Contrato"), ("parte", "Parte"), ("vence", "Vence"), ("monto", "Monto"), ("estado", "Estado")],
        "statuses": ["vigente", "por_renovar", "finalizado"],
        "statusLabels": {"vigente": "Vigente", "por_renovar": "Por renovar", "finalizado": "Finalizado"},
        "form": [
            ("titulo", "Título", "text"),
            ("parteId", "Parte", "select:partes"),
            ("vence", "Vence", "date"),
            ("monto", "Monto", "number"),
        ],
        "row": ["titulo", "parteNombre", "vence", "montoMoney", "estadoLabel"],
        "wa": True,
    },
}


def seed_for(slug: str) -> dict:
    # Import seeds from previous inline definitions by re-executing compact map
    from importlib.machinery import SourceFileLoader
    # Keep seeds here for clarity
    seeds = {
        "ordenes": {
            "clientes": [
                {"id": "c1", "nombre": "Pedro Sosa", "tel": "2915551001"},
                {"id": "c2", "nombre": "Ana Gómez", "tel": "2915551002"},
                {"id": "c3", "nombre": "Taller Sur", "tel": "2915551003"},
            ],
            "items": [
                {"id": "o1", "clienteId": "c1", "equipo": "VW Gol 2014", "detalle": "Service + frenos", "estado": "en_curso", "fecha": "2026-09-11"},
                {"id": "o2", "clienteId": "c2", "equipo": "Heladera Patrick", "detalle": "No enfría", "estado": "ingreso", "fecha": "2026-09-11"},
                {"id": "o3", "clienteId": "c3", "equipo": "Fiat Cronos", "detalle": "Diagnóstico motor", "estado": "listo", "fecha": "2026-09-10"},
                {"id": "o4", "clienteId": "c1", "equipo": "VW Gol 2014", "detalle": "Alineación", "estado": "entregado", "fecha": "2026-09-08"},
            ],
        },
        "stockalertas": {
            "items": [
                {"id": "i1", "nombre": "Aceite 1L", "stock": 8, "minimo": 15, "unidad": "u"},
                {"id": "i2", "nombre": "Filtro aceite", "stock": 22, "minimo": 10, "unidad": "u"},
                {"id": "i3", "nombre": "Harina 000 25kg", "stock": 3, "minimo": 5, "unidad": "bolsa"},
                {"id": "i4", "nombre": "Caja clavos", "stock": 40, "minimo": 20, "unidad": "caja"},
            ],
            "movs": [
                {"id": "m1", "itemId": "i1", "tipo": "salida", "cant": 4, "fecha": "2026-09-11", "detalle": "Venta mostrador"},
                {"id": "m2", "itemId": "i3", "tipo": "entrada", "cant": 2, "fecha": "2026-09-10", "detalle": "Proveedor"},
                {"id": "m3", "itemId": "i2", "tipo": "salida", "cant": 3, "fecha": "2026-09-09", "detalle": "OT-12"},
            ],
        },
        "visitas": {
            "tecnicos": [{"id": "t1", "nombre": "Diego"}, {"id": "t2", "nombre": "Laura"}],
            "clientes": [
                {"id": "c1", "nombre": "Obra Norte", "tel": "2915552001", "dir": "Mitre 120"},
                {"id": "c2", "nombre": "Casa Paz", "tel": "2915552002", "dir": "Belgrano 45"},
            ],
            "items": [
                {"id": "v1", "clienteId": "c1", "tecnicoId": "t1", "fecha": "2026-09-11", "hora": "09:30", "motivo": "Instalación", "estado": "en_camino"},
                {"id": "v2", "clienteId": "c2", "tecnicoId": "t2", "fecha": "2026-09-11", "hora": "11:00", "motivo": "Revisión", "estado": "pendiente"},
                {"id": "v3", "clienteId": "c1", "tecnicoId": "t1", "fecha": "2026-09-11", "hora": "15:00", "motivo": "Medición", "estado": "hecha"},
            ],
        },
        "takeaway": {
            "carta": [
                {"id": "p1", "nombre": "Empanadas x6", "precio": 9000},
                {"id": "p2", "nombre": "Milanesa completa", "precio": 14500},
                {"id": "p3", "nombre": "Ensalada", "precio": 6500},
            ],
            "items": [
                {"id": "x1", "cliente": "Retiro 1", "tel": "2915553001", "platoId": "p1", "nota": "Sin picante", "estado": "preparando", "hora": "12:10"},
                {"id": "x2", "cliente": "Lucía", "tel": "2915553002", "platoId": "p2", "nota": "", "estado": "nuevo", "hora": "12:25"},
                {"id": "x3", "cliente": "Mostrador", "tel": "", "platoId": "p3", "nota": "", "estado": "listo", "hora": "12:05"},
            ],
        },
        "cuotas": {
            "clientes": [
                {"id": "c1", "nombre": "Familia Torres", "tel": "2915554001"},
                {"id": "c2", "nombre": "Marcos Díaz", "tel": "2915554002"},
            ],
            "items": [
                {"id": "p1", "clienteId": "c1", "concepto": "Placard 3 puertas", "total": 420000, "cuotas": 6, "pagadas": 2, "desde": "2026-08-01"},
                {"id": "p2", "clienteId": "c2", "concepto": "Deck 12 m2", "total": 540000, "cuotas": 4, "pagadas": 4, "desde": "2026-06-01"},
                {"id": "p3", "clienteId": "c1", "concepto": "Mesa ratona", "total": 95000, "cuotas": 3, "pagadas": 0, "desde": "2026-09-01"},
            ],
        },
        "obra": {
            "clientes": [
                {"id": "c1", "nombre": "Familia Gómez", "tel": "2915555001"},
                {"id": "c2", "nombre": "Obra Sur", "tel": "2915555002"},
            ],
            "items": [
                {"id": "w1", "clienteId": "c1", "nombre": "Cocina integral", "avance": 40, "estado": "en_obra", "extras": "Mesada", "presupuesto": 1800000},
                {"id": "w2", "clienteId": "c2", "nombre": "Deck terraza", "avance": 100, "estado": "cerrada", "extras": "", "presupuesto": 540000},
                {"id": "w3", "clienteId": "c1", "nombre": "Placard suite", "avance": 10, "estado": "aprobada", "extras": "", "presupuesto": 420000},
            ],
        },
        "fichas": {
            "items": [
                {"id": "f1", "nombre": "Luna", "tipo": "Mascota", "dueño": "Sofía Díaz", "tel": "2915556001", "proxima": "2026-09-20", "notas": [{"fecha": "2026-09-01", "texto": "Vacuna anual"}]},
                {"id": "f2", "nombre": "Juan Pérez", "tipo": "Paciente", "dueño": "—", "tel": "2915556002", "proxima": "2026-09-15", "notas": [{"fecha": "2026-08-20", "texto": "Control"}]},
                {"id": "f3", "nombre": "Rocky", "tipo": "Mascota", "dueño": "Pedro Sosa", "tel": "2915556003", "proxima": "2026-10-01", "notas": []},
            ]
        },
        "flota": {
            "items": [
                {"id": "v1", "patente": "AB123CD", "modelo": "Kangoo 2019", "km": 84500, "vtv": "2026-11-01", "seguro": "2026-10-15"},
                {"id": "v2", "patente": "AF456GH", "modelo": "Partner 2021", "km": 42000, "vtv": "2027-02-01", "seguro": "2026-09-20"},
                {"id": "v3", "patente": "AA999ZZ", "modelo": "Moto delivery", "km": 18000, "vtv": "2026-12-01", "seguro": "2026-09-12"},
            ],
            "services": [
                {"id": "s1", "vehiculoId": "v1", "fecha": "2026-08-10", "detalle": "Service 80.000", "km": 80200},
                {"id": "s2", "vehiculoId": "v3", "fecha": "2026-09-01", "detalle": "Cubiertas", "km": 17500},
            ],
        },
        "eventos": {
            "clientes": [
                {"id": "c1", "nombre": "Quince Ana", "tel": "2915557001"},
                {"id": "c2", "nombre": "Empresa Sur", "tel": "2915557002"},
            ],
            "items": [
                {"id": "e1", "clienteId": "c1", "fecha": "2026-10-12", "personas": 80, "menu": "Menú 2", "sena": 150000, "estado": "reservado", "check": ["Salón", "Luces", "DJ"]},
                {"id": "e2", "clienteId": "c2", "fecha": "2026-09-25", "personas": 40, "menu": "Coffee", "sena": 50000, "estado": "consulta", "check": ["Salón"]},
                {"id": "e3", "clienteId": "c1", "fecha": "2026-08-01", "personas": 100, "menu": "Menú 1", "sena": 200000, "estado": "cerrado", "check": ["Salón", "Catering"]},
            ],
        },
        "abonos": {
            "clientes": [
                {"id": "c1", "nombre": "Carla Méndez", "tel": "2915558001"},
                {"id": "c2", "nombre": "Tomás Vidal", "tel": "2915558002"},
                {"id": "c3", "nombre": "Nadia Cruz", "tel": "2915558003"},
            ],
            "items": [
                {"id": "a1", "clienteId": "c1", "plan": "Mensual full", "monto": 25000, "estado": "al_dia", "ultimo": "2026-09-01"},
                {"id": "a2", "clienteId": "c2", "plan": "Mantenimiento PC", "monto": 18000, "estado": "mora", "ultimo": "2026-07-01"},
                {"id": "a3", "clienteId": "c3", "plan": "Mensual full", "monto": 25000, "estado": "al_dia", "ultimo": "2026-09-05"},
            ],
        },
        "mayorista": {
            "clientes": [
                {"id": "c1", "nombre": "Kiosco Centro", "tel": "2915559001"},
                {"id": "c2", "nombre": "Almacén Norte", "tel": "2915559002"},
            ],
            "lista": [
                {"id": "l1", "nombre": "Caja gaseosa x12", "precio": 18000, "minimo": 5},
                {"id": "l2", "nombre": "Aceite 1L x6", "precio": 22000, "minimo": 3},
                {"id": "l3", "nombre": "Harina 25kg", "precio": 15000, "minimo": 2},
            ],
            "items": [
                {"id": "p1", "clienteId": "c1", "lineas": [{"nombre": "Caja gaseosa x12", "cant": 10, "monto": 18000}], "estado": "pendiente", "fecha": "2026-09-11"},
                {"id": "p2", "clienteId": "c2", "lineas": [{"nombre": "Harina 25kg", "cant": 4, "monto": 15000}], "estado": "despachado", "fecha": "2026-09-10"},
                {"id": "p3", "clienteId": "c1", "lineas": [{"nombre": "Aceite 1L x6", "cant": 3, "monto": 22000}], "estado": "entregado", "fecha": "2026-09-08"},
            ],
        },
        "reparto": {
            "choferes": [{"id": "h1", "nombre": "Luis"}, {"id": "h2", "nombre": "Mara"}],
            "items": [
                {"id": "r1", "cliente": "Doña Rosa", "zona": "Centro", "choferId": "h1", "estado": "en_ruta", "detalle": "Pedido #41"},
                {"id": "r2", "cliente": "Bar El Faro", "zona": "Norte", "choferId": "h2", "estado": "pendiente", "detalle": "Caja cerveza"},
                {"id": "r3", "cliente": "Kiosco Centro", "zona": "Centro", "choferId": "h1", "estado": "entregado", "detalle": "Pedido #38"},
            ],
        },
        "contratos": {
            "partes": [
                {"id": "p1", "nombre": "Administración NH", "rol": "Administración"},
                {"id": "p2", "nombre": "Locatario Torres", "rol": "Inquilino"},
                {"id": "p3", "nombre": "Locador Vega", "rol": "Propietario"},
            ],
            "items": [
                {"id": "k1", "titulo": "Alquiler Mitre 200", "parteId": "p2", "vence": "2026-12-01", "estado": "vigente", "monto": 350000},
                {"id": "k2", "titulo": "Alquiler Belgrano 12", "parteId": "p2", "vence": "2026-09-20", "estado": "por_renovar", "monto": 280000},
                {"id": "k3", "titulo": "Mantenimiento anual Sur", "parteId": "p1", "vence": "2027-01-15", "estado": "vigente", "monto": 90000},
            ],
        },
    }
    return seeds[slug]


PANEL_ENGINE = r'''
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
    var grid=document.getElementById("related-grid");
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
  render();
})();
'''


def write_data_js(slug: str, seed: dict) -> str:
    return f"window.SIS_SEED = {json.dumps(seed, ensure_ascii=False, indent=2)};\n"


def write_cfg_js(sys: dict, schema: dict) -> str:
    tabs = sys["tabs"]
    tab_titles = {t: t.capitalize() for t in tabs}
    tab_titles[sys["primary"]] = sys["title"]
    # nicer titles
    pretty = {
        "ordenes": "Órdenes",
        "clientes": "Clientes",
        "stock": "Stock",
        "movimientos": "Movimientos",
        "alertas": "Alertas",
        "visitas": "Visitas",
        "tecnicos": "Técnicos",
        "cola": "Cola",
        "carta": "Carta",
        "planes": "Planes",
        "obras": "Obras",
        "fichas": "Fichas",
        "notas": "Notas",
        "vehiculos": "Vehículos",
        "services": "Services",
        "eventos": "Eventos",
        "abonos": "Abonos",
        "pedidos": "Pedidos",
        "lista": "Lista de precio",
        "entregas": "Entregas",
        "choferes": "Choferes",
        "contratos": "Contratos",
        "partes": "Partes",
    }
    tab_titles = {t: pretty.get(t, t.capitalize()) for t in tabs}
    cfg = {
        "slug": sys["slug"],
        "title": sys["title"],
        "primary": sys["primary"],
        "tabs": tabs,
        "tabTitles": tab_titles,
        "listKey": schema["listKey"],
        "columns": schema["columns"],
        "row": schema["row"],
        "form": schema["form"],
        "statuses": schema.get("statuses", []),
        "statusLabels": schema.get("statusLabels", {}),
        "wa": schema.get("wa", False),
        "payCuota": schema.get("payCuota", False),
        "addNota": schema.get("addNota", False),
    }
    return f"window.SIS_CFG = {json.dumps(cfg, ensure_ascii=False, indent=2)};\n"


def form_html(schema: dict) -> str:
    parts = []
    for name, label, typ in schema["form"]:
        if typ.startswith("select:"):
            src = typ.split(":", 1)[1]
            parts.append(f'<label>{label}<select name="{name}" data-source="{src}" required></select></label>')
        elif typ == "number":
            parts.append(f'<label>{label}<input name="{name}" type="number" min="0" required></label>')
        elif typ == "date":
            parts.append(f'<label>{label}<input name="{name}" type="date" required></label>')
        elif typ == "time":
            parts.append(f'<label>{label}<input name="{name}" type="time" required></label>')
        else:
            full = " class=\"full\"" if name in ("detalle", "nota", "extras", "motivo") else ""
            parts.append(f'<label{full}>{label}<input name="{name}" required></label>')
    parts.append('<button type="submit">Guardar</button>')
    return "\n        ".join(parts)


def panel_html(sys: dict, schema: dict) -> str:
    pretty = {
        "ordenes": "Órdenes", "clientes": "Clientes", "stock": "Stock", "movimientos": "Movimientos",
        "alertas": "Alertas", "visitas": "Visitas", "tecnicos": "Técnicos", "cola": "Cola", "carta": "Carta",
        "planes": "Planes", "obras": "Obras", "fichas": "Fichas", "notas": "Notas", "vehiculos": "Vehículos",
        "services": "Services", "eventos": "Eventos", "abonos": "Abonos", "pedidos": "Pedidos", "lista": "Lista",
        "entregas": "Entregas", "choferes": "Choferes", "contratos": "Contratos", "partes": "Partes",
    }
    tabs = "".join(
        '<button type="button" class="%s" data-view="%s">%s</button>' % (
            "on" if t == sys["primary"] else "", t, pretty.get(t, t)
        )
        for t in sys["tabs"]
    )
    can = "".join("<span>%s</span>" % c for c in sys["can"])
    thead = "".join("<th>%s</th>" % lab for _, lab in schema["columns"])

    secondary = [t for t in sys["tabs"] if t != sys["primary"]]
    secondary_html = ""
    if secondary:
        first = secondary[0]
        related_form = """
      <form class="create" id="create-related" data-target="%s">
        <label>Nombre<input name="nombre" required></label>
        <label>Teléfono / dato<input name="tel"></label>
        <label class="full">Extra (precio, rol, dirección…)<input name="extra"></label>
        <button type="submit">Agregar</button>
      </form>""" % first
        for t in secondary:
            secondary_html += """
    <div id="view-%s" data-panel-view="%s" class="panel-hidden">
      %s
      <div class="cards-grid related-grid"></div>
    </div>""" % (t, t, related_form if t == first else "")

    primary_mov = ""
    if sys["slug"] == "stockalertas":
        primary_mov = """
      <form class="create" id="create-mov">
        <label>Ítem<select name="itemId" data-source="items"></select></label>
        <label>Tipo<select name="tipo"><option value="entrada">Entrada</option><option value="salida">Salida</option></select></label>
        <label>Cantidad<input name="cant" type="number" min="1" required></label>
        <label class="full">Detalle<input name="detalle"></label>
        <button type="submit">Registrar movimiento</button>
      </form>"""

    return """<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
%s
  <title>Panel · %s</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../sistemas-ui/base.css?v=c5">
  <link rel="stylesheet" href="styles.css?v=c5">
</head>
<body class="panel-body">
  <script src="../login.js?v=2" data-rubro="%s" data-place="panel"></script>
  <header class="band">
    <div class="band-inner">
      <a class="brand" href="index.html"><strong>%s</strong><span>%s</span></a>
      <nav>
        <a href="index.html">Qué es</a>
        <div class="panel-tabs">%s</div>
        <button class="btn" id="open-create" type="button">%s</button>
      </nav>
    </div>
  </header>
  <div class="wrap">
    <div class="toolbar">
      <div><p class="kicker">Datos de ejemplo · este navegador</p><h1 id="view-title">%s</h1></div>
      <div class="toolbar-actions">
        <label class="search-box"><span class="visually-hidden">Buscar</span><input type="search" id="search" placeholder="Buscar…"></label>
        <button type="button" id="reset-sample" class="btn-soft">Restablecer</button>
      </div>
    </div>
    <p class="hint-bar"><strong>Qué puede hacer aquí.</strong> Clave de ejemplo: <strong>demo</strong>.</p>
    <div class="can-do">%s</div>
    <div class="stats" id="stats"></div>
    <div id="view-%s" data-panel-view="%s">
      <form class="create" id="create" hidden>
        %s
      </form>
      %s
      <div class="workspace">
        <section class="list"><div class="table-scroll"><table>
          <thead><tr>%s</tr></thead>
          <tbody id="rows"></tbody>
        </table></div></section>
        <aside class="sheet" id="sheet"><p class="empty-sheet">Elija un registro.</p></aside>
      </div>
    </div>
    %s
  </div>
  <div id="toast" class="toast"></div>
  <div id="contacto"></div>
  <footer class="wrap">%s · ejemplo de sistema · clave demo.</footer>
  <script src="data.js"></script>
  <script src="cfg.js"></script>
  <script src="panel.js"></script>
  <script src="../contacto.js" data-phone="5492915757934" data-text="Hola, quiero consultar por %s" data-subject="Consulta — %s" data-title="Consultar" data-place="panel"></script>
</body>
</html>
""" % (
        FAV,
        sys["title"],
        sys["slug"],
        sys["short"],
        sys["span"],
        tabs,
        sys["btn"],
        sys["title"],
        can,
        sys["primary"],
        sys["primary"],
        form_html(schema),
        primary_mov,
        thead,
        secondary_html,
        sys["title"],
        sys["title"],
        sys["title"],
    )


def index_html(sys: dict) -> str:
    steps = [
        ("Alta", "Carga el registro en el panel."),
        ("Estados", "Sigue el avance del día a día."),
        ("Consulta", "Si hace falta, copia un texto para WhatsApp."),
    ]
    steps_html = "".join(f'<article class="step"><strong>{a}</strong><p>{b}</p></article>' for a, b in steps)
    can = "".join(f"<li>{c}</li>" for c in sys["can"])
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
{FAV}
  <title>{sys["title"]} — ejemplo de sistema</title>
  <meta name="description" content="{sys["lead"]}">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../sistemas-ui/base.css?v=c5">
  <link rel="stylesheet" href="styles.css?v=c5">
</head>
<body>
  <header class="band">
    <div class="band-inner">
      <a class="brand" href="index.html"><strong>{sys["short"]}</strong><span>{sys["span"]}</span></a>
      <nav>
        <a href="#como">Cómo funciona</a>
        <a class="btn" href="panel.html">Abrir panel</a>
      </nav>
    </div>
  </header>
  <main class="wrap">
    <section class="hero">
      <div>
        <p class="kicker">Sistema de gestión</p>
        <h1>{sys["title"]}</h1>
        <p class="lead">{sys["lead"]}</p>
        <div class="hero-actions">
          <a class="btn" href="panel.html">Probar el panel</a>
          <a class="btn btn-quiet" href="/demos/#sistemas-gestion">Volver al catálogo</a>
        </div>
      </div>
      <div class="hero-stage">
        <img src="img/hero.jpg" alt="{sys["title"]}">
        <div class="cap"><strong>{sys["short"]}</strong><span>Página de ejemplo · panel incluido</span></div>
      </div>
    </section>
    <section class="section" id="como">
      <p class="kicker">Uso</p>
      <h2>Cómo funciona en el día a día</h2>
      <p class="section-lead">{sys["lead"]}</p>
      <div class="steps">{steps_html}</div>
    </section>
    <section class="section">
      <p class="kicker">Panel</p>
      <h2>Qué puede hacer</h2>
      <ul>{can}</ul>

    </section>
    <div class="cta-band">
      <p class="kicker" style="color:#e3c48a">A medida</p>
      <h2>¿Le sirve este sistema a su local?</h2>
      <p>Se adapta a su rubro. No es un software de suscripción: se cotiza y se entrega para usted.</p>
      <a class="btn" href="#contacto">Consultar</a>
    </div>
  </main>
  <div id="contacto"></div>
  <footer class="wrap">{sys["title"]} · ejemplo de sistema · no es un software de suscripción.</footer>
  <script src="../contacto.js" data-phone="5492915757934" data-text="Hola, quiero consultar por {sys["title"]}" data-subject="Consulta — {sys["title"]}" data-title="Consultar" data-place="index"></script>
</body>
</html>
'''


def patch_engine() -> str:
    return PANEL_ENGINE.replace(
        "var grid=document.getElementById(\"related-grid\");\n    if(!grid) return;",
        "var wrap=document.querySelector('[data-panel-view=\"'+name+'\"]');\n    var grid=wrap?wrap.querySelector('.related-grid'):null;\n    if(!grid) return;",
    )


def main() -> None:
    engine = patch_engine()
    for sys in SYSTEMS:
        slug = sys["slug"]
        dest = DEMOS / slug
        if dest.exists():
            raise SystemExit(f"Collision: {slug} already exists")
        schema = SCHEMAS[slug]
        # map primary tab name quirks to list views
        # stockalertas primary is 'stock' but listKey items - ok
        # takeaway primary cola - ok
        dest.mkdir(parents=True)
        img = dest / "img"
        img.mkdir()
        (img / "index.html").write_text("<!doctype html><title></title>\n", encoding="utf-8")
        src_img = HUB / sys["hub"]
        if src_img.exists():
            shutil.copy2(src_img, img / "hero.jpg")
        else:
            # fallback any hub
            any_img = next(HUB.glob("*.jpg"))
            shutil.copy2(any_img, img / "hero.jpg")

        styles = f""":root {{
  --ink: {sys['ink']}; --muted: {sys['muted']}; --paper: {sys['paper']}; --card: #fff;
  --line: {sys['line']}; --brand: {sys['brand']}; --accent: {sys['accent']};
}}
"""
        (dest / "styles.css").write_text(styles, encoding="utf-8")
        seed = seed_for(slug)
        (dest / "data.js").write_text(write_data_js(slug, seed), encoding="utf-8")
        (dest / "cfg.js").write_text(write_cfg_js(sys, schema), encoding="utf-8")
        (dest / "panel.js").write_text(engine, encoding="utf-8")
        (dest / "panel.html").write_text(panel_html(sys, schema), encoding="utf-8")
        (dest / "index.html").write_text(index_html(sys), encoding="utf-8")
        print("OK", slug)

    print("DONE", len(SYSTEMS))


if __name__ == "__main__":
    main()
