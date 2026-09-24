# API de ARCA para developers (WSAA + WSFEv1)

Cómo hacer que un sistema de stock **single-tenant** pueda **pedir un CAE** hablando con ARCA/AFIP: primero autenticás (WSAA), después autorizás el comprobante (WSFEv1).

**Extra cotizado.** No es asesoría fiscal ni lista de precios.  
Si el PDF oficial dice otra cosa, gana el PDF.  
Fuentes: [Fuentes oficiales](arca-fuentes.html).  
URL canónica: https://webconreeb.com/docs/integraciones/arca-implementacion.html

---

## Si solo tenés 5 minutos

1. **No hay API REST de ARCA.** Es SOAP/XML por HTTPS.
2. **Sin el certificado del CUIT del comercio** (asociado al WSN `wsfe`) no arranca nada. REEB no presta certificado.
3. **Dos pasos siempre:** WSAA → `token`+`sign` (~12 h) → WSFEv1 usa eso en cada request.
4. **Gap crítico hoy:** no enviar `CondicionIVAReceptorId` (RG 5616) puede rechazar el CAE. Ver [Gaps](#7-gaps-vs-manual-prioridad-a2).

---

## Modelo mental

| Capa | Qué es | Idea |
|------|--------|------|
| 1 | Identidad del comercio | CUIT + cert X.509 + clave + PV electrónico (solo servidor) |
| 2 | WSAA = “login” | Firmás TRA, `loginCms`, cacheás el TA |
| 3 | WSFEv1 = “autorizar factura” | Último nro → FECAESolicitar → guardar CAE |

---

## Camino de punta a punta

1. **Homologación del cliente** — CUIT + certificado + WSN `wsfe` + PV electrónico.
2. **WSAA → TA** — Firmar TRA (CMS), `loginCms`, cachear `token` + `sign` (~12 h).
3. **WSFEv1 → CAE** — `FECompUltimoAutorizado` → `FECAESolicitar` → persistir CAE / vencimiento.
4. **Cerrar gaps** — Sobre todo `CondicionIVAReceptorId` y DocTipo/DocNro reales.

Transporte: **SOAP/XML sobre HTTPS**. No es REST JSON.

---

## Glosario

| Término | Significado |
|---------|-------------|
| WSAA | Autenticación: entrega el Ticket de Acceso (TA) |
| TRA | `LoginTicketRequest` firmado (CMS) enviado a WSAA |
| TA | `token` + `sign` (~12 h); va en cada request WSFE |
| WSFEv1 | Facturación electrónica (CAE) sin detalle de ítem |
| CAE | Código de autorización + vencimiento |
| Homo / Prod | Ambientes distintos: certificados y URLs no se cruzan |

---

## 1. Alcance del producto

| Incluido en el piloto | Fuera de alcance por defecto |
|-----------------------|------------------------------|
| WSFEv1 CAE (RG 4291) — A/B/C sin detalle de ítem | WSFEX, WSCT, WSMTXCA, WSBFE, WSSEG |
| WSAA LoginCms + TA cacheado | CAEA (contingencia) salvo cotización |
| Persistencia CAE / vencimiento en la venta | Libro diario / DDJJ |

### Secuencia al emitir un CAE

```text
1. Cert X.509 del CUIT del comercio (paths en servidor)
2. WSAA LoginCms (TRA firmado CMS SHA1+RSA, Base64) → TA
3. WSFEv1 FECompUltimoAutorizado → nro siguiente
4. WSFEv1 FECAESolicitar → Resultado A/R + CAE + CAEFchVto
5. Guardar en arca_invoice + sale.cae* (no re-solicitar si ya hay A)
```

---

## 2. Checklist del cliente (bloqueante)

1. CUIT activo y situación fiscal definida con su contador.
2. Clave fiscal.
3. Certificado digital:
   - **Homo:** WSASS ([manual](https://www.arca.gob.ar/ws/WSASS/WSASS_manual.pdf), [adhesión](https://www.arca.gob.ar/ws/WSASS/WSASS_como_adherirse.pdf)).
   - **Prod:** Admin. Certificados + [obtener](https://www.arca.gob.ar/ws/WSAA/wsaa_obtener_certificado_produccion.pdf) / [asociar WSN](https://www.arca.gob.ar/ws/WSAA/wsaa_asociar_certificado_a_wsn_produccion.pdf).
4. Asociar el certificado al WSN **Facturación Electrónica (`wsfe`)**.
5. Punto(s) de venta electrónicos habilitados (mismo valor que `ARCA_PTO_VTA`).
6. Reloj del servidor sincronizado (NTP; el manual cita `time.afip.gov.ar`, zona GMT-3).
7. Certificado y clave **solo en el servidor** (paths en env). Nunca en git ni en el front.

Sin certificado + asociación WSFE no hay integración posible.

---

## 3. WSAA — el “login”

Fuente: [Especificación técnica](https://www.arca.gob.ar/ws/WSAA/Especificacion_Tecnica_WSAA_1.2.2.pdf) + [Manual Dev](https://www.arca.gob.ar/ws/WSAA/WSAAmanualDev.pdf).

### Pasos

1. Armar `LoginTicketRequest` (TRA): `uniqueId`, `generationTime`, `expirationTime`, `service=wsfe`.
   - `source` / `destination` son **opcionales**; el FAQ recomienda omitirlos.
2. Firmar CMS `SignedData` (SHA1+RSA) con cert + clave privada.
3. Codificar CMS en Base64.
4. Invocar `loginCms` / `LoginCms`.
5. Extraer `token` + `sign`; respetar `expirationTime` (~12 h). **Reutilizar** el TA vigente.

### Cuando falla el login

| Qué ves | Causa típica | Qué hacer |
|---------|--------------|-----------|
| Cert no emitido por AC de confianza | Cert homo en prod o viceversa | Usar cert del ambiente correcto |
| Computador no autorizado a servicios / al servicio | Cert sin asociar a WSN o service mal | WSASS (homo) o Admin Relaciones (prod); `service=wsfe` |
| CEE ya posee un TA válido | Pedir TA de nuevo demasiado pronto | Cachear TA; no re-login mientras viva |
| generationTime / expirationTime inválidos | Reloj desfasado / formato | NTP; restar unos minutos a generationTime |
| Firma inválida / CMS bad | PEM mal, ambiente cruzado | Revisar firma y paths |

Retención al pedir TA de más (FAQ): ~10 min testing / ~2 min prod (puede cambiar).  
URLs: [Fuentes oficiales](arca-fuentes.html). Defaults: `wsaahomo.afip.gov.ar` / `wsaa.afip.gov.ar`.

---

## 4. WSFEv1 — pedir el CAE (RG 4291 V.4.8)

Fuente: [Manual desarrollador V. 4.8](https://www.afip.gob.ar/fe/ayuda/documentos/wsfev1-RG-4291.pdf).

### Auth en cada request

```xml
<Auth>
  <Token>…</Token>
  <Sign>…</Sign>
  <Cuit>…</Cuit>   <!-- CUIT representado -->
</Auth>
```

Errores de infra: `600` token/firma, `601` CUIT no en token, `500`/`501`/`502` internos.

### Métodos

| Método | Para qué sirve |
|--------|----------------|
| `FEDummy` | ¿La infra responde? |
| `FECompUltimoAutorizado` | Último nro → siguiente |
| `FECAESolicitar` | Autorizar comprobante/lote |
| `FECompConsultar` | Releer emitido |
| `FEParamGetTiposCbte` / `TiposDoc` / `TiposIva` / `TiposConcepto` / `PtosVenta` | Tablas de referencia |
| `FEParamGetCondicionIvaReceptor` | Códigos condición IVA receptor (RG 5616) |

CAEA (`FECAEA*`) fuera del piloto salvo cotización.

### FECAESolicitar — qué no puede faltar

Cabecera: `CantReg`, `PtoVta`, `CbteTipo`.  
Detalle (`FECAEDetRequest`), entre otros:

- `Concepto` (1 / 2 / 3)
- `DocTipo` / `DocNro`
- `CbteDesde` / `CbteHasta` / `CbteFch` (`yyyyMMdd`)
- `ImpTotal`, `ImpTotConc`, `ImpNeto`, `ImpOpEx`, `ImpTrib`, `ImpIVA`
- `MonId` (`PES`) / `MonCotiz`
- `Iva` → `AlicIva` — **no informar** en tipo C (según manual)
- **`CondicionIVAReceptorId`**

Persistir `CAE`, `CAEFchVto`, `Resultado`, observaciones/`Errors`.

### 4.1 CondicionIVAReceptorId (RG 5616)

- Con obligatoriedad RG 5616, emitir **sin** el dato **rechaza**.
- Valores: `FEParamGetCondicionIvaReceptor`.
- **Gap actual en stock-local:** el cliente WSFE **no envía** este campo (prioridad A2).

### 4.2 Alícuotas (ejemplos)

`Id=5` → 21 % · `Id=4` → 10,5 % · `Id=3` → 0 % · `Id=6` → 27 %.  
Catálogo vivo: `FEParamGetTiposIva`.

### 4.3 Tipos de comprobante (habitual)

| Documento local | CbteTipo |
|-----------------|----------|
| Factura A | 1 |
| Factura B | 6 |
| Factura C | 11 |

Confirmar con `FEParamGetTiposCbte` / contador.

---

## 5. Qué hay en stock-local

```text
infrastructure/arca
  ArcaProperties   — env HOMO/PROD, CUIT, paths, PtoVta, URLs
  WsaaClient       — TRA + CMS (BouncyCastle) + LoginCms + cache ~11 h
  WsfeClient       — FECompUltimoAutorizado + FECAESolicitar (XML/regex)
application/arca
  ArcaInvoiceService — status, requestCae, getBySale; mapeo A/B/C → CbteTipo
presentation/rest
  ArcaController   — /api/arca/* con @PreAuthorize
```

---

## 6. API interna y variables

| Método | Ruta | Quién |
|--------|------|-------|
| GET | `/api/arca/status` | TITULAR, OPERADOR |
| POST | `/api/arca/invoices/{saleId}` | TITULAR |
| GET | `/api/arca/invoices/{saleId}` | TITULAR, OPERADOR, CONTADOR |

- `ARCA_ENABLED` — activa el módulo
- `ARCA_ENV` — `HOMO` / `PROD`
- `ARCA_CUIT`
- `ARCA_CERT_PATH`
- `ARCA_KEY_PATH`
- `ARCA_PTO_VTA`

Sin cert: `not_configured` / 422.

### Comportamiento actual de FECAESolicitar

- Receptor fijo: `DocTipo=99`, `DocNro=0`
- `AlicIva Id=5` (21 %) si hay IVA; vacío si `vatCents=0`
- Concepto `1`
- Persiste request/response XML en DB
- Idempotencia blanda si ya hay resultado `A` con CAE

---

## 7. Gaps vs manual (prioridad A2)

| Gap | Riesgo | Acción |
|-----|--------|--------|
| No envía `CondicionIVAReceptorId` | **Alto** — rechazo RG 5616 | Mapear condición fiscal → id |
| Solo DocTipo 99 / DocNro 0 | **Alto** — no factura a RI con CUIT | DocTipo/DocNro de la venta |
| AlicIva fija Id=5 | **Medio** | Mapear alícuota; multi-alícuota |
| No `FEDummy` / `FEParamGet*` / `FECompConsultar` | **Medio** | Status rico + consulta |
| Parser XML por regex | **Medio** | XML API / cliente WSDL |
| Sin tests automatizados | **Medio** | Unit + WireMock SOAP |
| XML SOAP en DB | **Bajo** | Restringir roles; no al front |

---

## 8. Seguridad

- Cert/key fuera de git.
- Solo TITULAR solicita CAE.
- No devolver stack traces ni XML crudo al browser.
- HTTPS en prod.
- Un certificado = un CUIT del **cliente** (nunca cert compartido multi-tenant).

---

## 9. Testing

| Nivel | Qué |
|-------|-----|
| Unit | mapeos, centavos↔decimal, alícuota / CondicionIVAReceptor |
| Integration | Controller + `@PreAuthorize` |
| Contrato | WireMock LoginCms + FECAESolicitar; **sin** certs en CI |
| Homo manual | Checklist §2 + un CAE aprobado |

DoD homologación: al menos un comprobante con `Resultado=A` y CAE válido.  
Prod: solo con OK del contador del cliente.

---

## 10. Orden de trabajo

1. Completar checklist cliente (homo).
2. Cerrar gaps §7 (`CondicionIVAReceptorId` + DocTipo real primero).
3. UI panel: estado ARCA + “Solicitar CAE” + errores legibles.
4. Ticket/impresión con CAE.
5. Solo entonces PROD.

---

## Relación con hosted / piloto

Cada suscriptor aporta **su** CUIT y certificado. Una instancia = un comercio; no hay certificado compartido multi-tenant.
