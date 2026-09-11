# Sistemas de gestión — mapa del proyecto

**Interno** (equipo / agentes). No enlazar en el hub ni servir desde `public/`.

Documento de referencia para no duplicar ni chocar con ejemplos ya publicados en `public/demos/`.

Última actualización: 2026-09-11  
Dominio: https://webconreeb.com  
Hub / catálogo: `/` (fuente `public/demos/index.html`)  
Sitio personal (CV): `/cv/` — no mezclar con sistemas comerciales.

---

## 1. Dos familias (no confundir)

| Familia | Qué es | Rutas típicas |
|---------|--------|----------------|
| **Rubro / página pública** | Ejemplo de sitio del local + panel del rubro | `/demos/peluqueria/`, `/demos/taller/`, `/demos/restaurante/`, … |
| **Sistema de gestión** | Panel “producto” cotizable (CRUD, estados) | `/demos/turnos/`, `/demos/comandas/`, … · sección hub `#sistemas-gestion` |

UI compartida de sistemas: `public/demos/sistemas-ui/base.css`  
Login de paneles: `public/demos/login.js` (clave de ejemplo `demo`)  
OG por rubro/sistema: `scripts/generate-demo-og.py` → `og.jpg` + meta

---

## 2. Sistemas ya existentes (no recrear)

| Slug | Nombre | Para qué | No confundir con |
|------|--------|----------|------------------|
| `turnos` | Agenda de turnos | Agenda, clientes, servicios, bandeja WhatsApp | `peluqueria` (vitrina de salón) |
| `cotizaciones` | Cotizaciones | Presupuesto → seña → pedido | `carpinteria` / `obra` (avance de obra) |
| `cuentacorriente` | Cuenta corriente | Fiado, cargos/pagos, extracto | `cuotas` (plan de cuotas de una venta) |
| `comandas` | Comandas | Mesas, cocina, carta, cobro | `restaurante` (página), `takeaway` (para llevar) |
| `reservas` | Reservas | Unidades, calendario, check-in | `hospedaje` / `complejo`, `eventos` (salón) |

---

## 3. Sistemas nuevos (2026-09) — sin choque de rutas

En el hub `#sistemas-gestion`: **7 destacados** (turnos, cotizaciones, cuenta corriente, comandas, reservas, órdenes, takeaway) y el resto bajo “Más sistemas…”.

| Slug | Nombre | Utilidad | Separación explícita |
|------|--------|----------|----------------------|
| `ordenes` | Órdenes de trabajo | OT: ingreso, diagnóstico, estados, aviso | ≠ `taller` (página del taller) |
| `stockalertas` | Stock y alertas | Mínimos, movimientos, alertas | ≠ `stockfacturacion` (depósito + facturas) |
| `visitas` | Visitas / técnicos | Agenda de campo, check-in | ≠ `turnos` (salón/consultorio) |
| `takeaway` | Pedidos para llevar | Cola mostrador/cocina, listo/entregado | ≠ `comandas` (mesas) ni `rotiseria` (carta) |
| `cuotas` | Cobros y cuotas | Plan de pagos, vencimientos | ≠ `cuentacorriente` (saldo abierto) |
| `obra` | Presupuesto de obra | Etapas, avance %, extras | ≠ `cotizaciones` (presupuesto simple) |
| `fichas` | Fichas (paciente / mascota) | Historial + próximo control | ≠ `turnos` (solo agenda) |
| `flota` | Flota del local | Service, vencimientos, km | ≠ `automotores` (venta de vehículos) |
| `eventos` | Eventos / salón | Fecha, menú, seña, checklist | ≠ `reservas` (hospedaje) |
| `abonos` | Abonos / suscripciones | Alta mensual, mora | ≠ `cuotas` (cuotas de una venta) |
| `mayorista` | Pedidos mayoristas | Lista de precio, mínimo, despacho | ≠ `comercio` / `marketplace` |
| `reparto` | Reparto | Zonas, chofer, estados entrega | ≠ `takeaway` (retiro) |
| `contratos` | Contratos / alquileres | Vencimientos, renovación | ≠ `inmobiliaria` (vitrina Nahuel Huapi) |

---

## 4. Rubros (vitrinas) existentes — no son “sistemas”

`arquitectura`, `automotores`, `biblioteca`, `carpinteria`, `comercio`, `complejo`, `estudio`, `excursiones`, `facturacion`, `hospedaje`, `inmobiliaria`, `kiosco`, `libreria`, `marketplace`, `materiales`, `peluqueria`, `restaurante`, `rotiseria`, `steelframe`, `stockfacturacion`, `taller`, …

Cada uno: página pública + panel del rubro. Los **sistemas** de la sección `#sistemas-gestion` se cotizan / muestran aparte.

---

## 5. Reglas para agregar otro sistema

1. **Slug nuevo** que no exista en `public/demos/`.  
2. Anotar en esta tabla: *para qué* y *con qué no choca*.  
3. Usar `sistemas-ui` + login en `login.js`.  
4. Copy cliente: **ejemplo / página / panel** — no “demo/vitrina” hacia el cliente.  
5. Panel con CRUD usable (alta / edición / baja / estados).  
6. Favicon hub (`/brand/reeb-mark*`) + `og.jpg` del rubro.  
7. Ficha en hub `#sistemas-gestion`.  
8. Regenerar OG: `python3 scripts/generate-demo-og.py`.

---

## 6. URLs útiles

- Hub sistemas: https://webconreeb.com/#sistemas-gestion  
- Ejemplo: https://webconreeb.com/demos/<slug>/  
- Panel: https://webconreeb.com/demos/<slug>/panel.html  
- Local: `python3 -m http.server 8765 --directory public` → http://127.0.0.1:8765/demos/

---

## 7. Repo

- GitHub: `reeb-dev/reeb-tech`  
- Deploy: push a `main` (GitHub Pages)  
- Producto CRM inmobiliario real: repo aparte `inmobiliaria-crm` (no mezclar aquí)
