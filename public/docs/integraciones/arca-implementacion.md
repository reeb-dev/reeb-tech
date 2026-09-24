# ARCA — guía de implementación (WSAA + WSFEv1)

Documento interno para facturación electrónica en el sistema de stock (single-tenant) (single-tenant).  
**Extra cotizado.** Fuentes: [Fuentes oficiales](arca-fuentes.html).  
Índice maestro: [Homologación externa](https://www.afip.gob.ar/ws/documentacion/homologacion-externa.asp) (RG 5616 / manuales vigentes).

No inventa precios ni asesora fiscalmente.

---

## 1. Alcance del producto

| Incluido en el piloto | Fuera de alcance por defecto |
|-----------------------|------------------------------|
| WSFEv1 CAE (RG 4291) — comprobantes A/B/C sin detalle de ítem | WSFEX, WSCT, WSMTXCA, WSBFE, WSSEG |
| WSAA LoginCms + TA cacheado | CAEA (contingencia) salvo cotización |
| Persistencia CAE / vencimiento en venta | Libro diario / DDJJ |

Flujo:

```text
Cert X.509 del CUIT del comercio
        ↓
WSAA LoginCms (TRA firmado CMS SHA1+RSA, Base64) → TA (token + sign, ~12 h)
        ↓
WSFEv1 FECompUltimoAutorizado → nro siguiente
        ↓
WSFEv1 FECAESolicitar → Resultado A/R + CAE + CAEFchVto
        ↓
Guardar en arca_invoice + sale.cae*
```

Transporte: **SOAP/XML sobre HTTPS**. No es REST JSON.

---

## 2. Requisitos del cliente (checklist)

1. CUIT activo y situación fiscal definida con su contador.  
2. Clave fiscal.  
3. Certificado digital:  
   - **Homo:** WSASS ([manual](https://www.arca.gob.ar/ws/WSASS/WSASS_manual.pdf), [adhesión](https://www.arca.gob.ar/ws/WSASS/WSASS_como_adherirse.pdf)).  
   - **Prod:** Administrador de Certificados Digitales + [obtener](https://www.arca.gob.ar/ws/WSAA/wsaa_obtener_certificado_produccion.pdf) / [asociar WSN](https://www.arca.gob.ar/ws/WSAA/wsaa_asociar_certificado_a_wsn_produccion.pdf).  
4. Asociar el certificado al WSN **Facturación Electrónica (`wsfe`)**.  
5. Punto(s) de venta electrónicos habilitados.  
6. Reloj del servidor sincronizado (NTP; el manual cita `time.afip.gov.ar`, zona GMT-3).  
7. Certificado y clave **solo en el servidor** (paths en env). Nunca en git ni en el front.

Sin certificado + asociación WSFE no hay integración posible.

---

## 3. WSAA — contrato operativo

Fuente: [Especificación técnica](https://www.arca.gob.ar/ws/WSAA/Especificacion_Tecnica_WSAA_1.2.2.pdf) + [Manual Dev](https://www.arca.gob.ar/ws/WSAA/WSAAmanualDev.pdf).

### Pasos

1. Armar `LoginTicketRequest` (TRA): `uniqueId`, `generationTime`, `expirationTime`, `service=wsfe`.  
   - `source` / `destination` son **opcionales**; el FAQ recomienda omitirlos.  
2. Firmar CMS `SignedData` (SHA1+RSA) con cert + clave privada.  
3. Codificar CMS en Base64.  
4. Invocar `loginCms` / `LoginCms`.  
5. Extraer `token` + `sign` del TA; respetar `expirationTime` (~12 h). **Reutilizar** el TA vigente.

### Errores frecuentes (manual / FAQ)

| Síntoma / código | Causa típica | Acción |
|------------------|--------------|--------|
| Cert no emitido por AC de confianza | Cert homo en prod o viceversa | Usar cert del ambiente correcto |
| Computador no autorizado a servicios / al servicio | Cert sin asociar a WSN o service ID mal | WSASS (homo) o Admin Relaciones (prod); `service=wsfe` |
| CEE ya posee un TA válido | Pedir TA de nuevo demasiado pronto | Cachear TA; no re-login mientras viva |
| generationTime / expirationTime inválidos | Reloj desfasado / formato | NTP; restar unos minutos a generationTime |
| Firma inválida / CMS bad | PEM mal, ambiente cruzado | Revisar firma y paths |

Retención al pedir TA de más (FAQ): ~10 min testing / ~2 min prod (valores pueden cambiar).

### URLs

Ver [Fuentes oficiales](arca-fuentes.html). Defaults en código: `wsaahomo.afip.gov.ar` / `wsaa.afip.gov.ar`.

---

## 4. WSFEv1 — contrato operativo (RG 4291 V.4.8)

Fuente principal: [Manual desarrollador V. 4.8](https://www.afip.gob.ar/fe/ayuda/documentos/wsfev1-RG-4291.pdf)  
(enlazado desde homologación externa).

### Auth en cada request

```xml
<Auth>
  <Token>…</Token>
  <Sign>…</Sign>
  <Cuit>…</Cuit>   <!-- CUIT representado -->
</Auth>
```

Errores de infraestructura citados en el manual: `600` token/firma, `601` CUIT no en token, `500`/`501`/`502` internos.

### Métodos CAE (mínimo útil)

| Método | Uso |
|--------|-----|
| `FEDummy` | Salud infra |
| `FECompUltimoAutorizado` | Último nro por PtoVta + CbteTipo → siguiente |
| `FECAESolicitar` | Autorizar comprobante/lote |
| `FECompConsultar` | Consultar emitido |
| `FEParamGetTiposCbte` / `TiposDoc` / `TiposIva` / `TiposConcepto` / `PtosVenta` | Tablas de referencia |
| `FEParamGetCondicionIvaReceptor` | Códigos condición IVA receptor (RG 5616) |

CAEA (`FECAEA*`) fuera del piloto salvo cotización.

### FECAESolicitar — campos clave del detalle

Cabecera: `CantReg`, `PtoVta`, `CbteTipo`.  
Detalle (`FECAEDetRequest`), entre otros:

- `Concepto` (1 productos / 2 servicios / 3 productos y servicios)  
- `DocTipo` / `DocNro` (receptor)  
- `CbteDesde` / `CbteHasta` / `CbteFch` (`yyyyMMdd`)  
- `ImpTotal`, `ImpTotConc`, `ImpNeto`, `ImpOpEx`, `ImpTrib`, `ImpIVA`  
- `MonId` (`PES`) / `MonCotiz`  
- `Iva` → `AlicIva` (`Id`, `BaseImp`, `Importe`) — **no informar** en comprobantes tipo C (según manual)  
- **`CondicionIVAReceptorId`** — ver §4.1  

Resultados: aprobado; aprobado con observaciones (validaciones no excluyentes); rechazado (excluyentes).  
Persistir `CAE`, `CAEFchVto`, `Resultado`, observaciones/`Errors`.

### 4.1 CondicionIVAReceptorId (RG 5616)

Según historial del manual V.4.x:

- Campo agregado junto con `CanMisMonExt`.  
- Desde **6 abr 2025** pudo enviarse **opcional**; al entrar en vigencia la obligatoriedad de la **RG 5616**, la emisión **sin** el dato **rechaza**.  
- Valores: método `FEParamGetCondicionIvaReceptor`.  
- Si el valor es inválido: CAE rechaza; si no existe: rechaza.

**Gap actual en el sistema de stock (single-tenant):** el cliente WSFE **no envía** `CondicionIVAReceptorId` (ver §6). Prioridad A2.

### 4.2 Alícuotas (ejemplos del manual)

En ejemplos SOAP: `Id=5` → 21 %, `Id=4` → 10,5 %, `Id=3` → 0 %, `Id=6` → 27 %.  
Catálogo vivo: `FEParamGetTiposIva` (no hardcodear a ciegas en prod).

### 4.3 Tipos de comprobante (mapeo local habitual)

| Documento local | CbteTipo (habitual) |
|-----------------|---------------------|
| Factura A | 1 |
| Factura B | 6 |
| Factura C | 11 |

Confirmar siempre con `FEParamGetTiposCbte` / contador del cliente.

---

## 5. Qué hay implementado en el sistema de stock (single-tenant)

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

### API interna

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/arca/status` | TITULAR, OPERADOR |
| POST | `/api/arca/invoices/{saleId}` | TITULAR |
| GET | `/api/arca/invoices/{saleId}` | TITULAR, OPERADOR, CONTADOR |

Variables: `ARCA_ENABLED`, `ARCA_ENV` (`HOMO`/`PROD`), `ARCA_CUIT`, `ARCA_CERT_PATH`, `ARCA_KEY_PATH`, `ARCA_PTO_VTA`.

Sin cert del **comercio**: `not_configured` / 422 con mensaje claro.

### Comportamiento actual de `FECAESolicitar`

- Receptor fijo: `DocTipo=99`, `DocNro=0` (consumidor final típico).  
- `AlicIva Id=5` (21 %) si hay IVA; vacío si `vatCents=0`.  
- Concepto `1`.  
- Persiste request/response XML en DB (server-side).  
- Idempotencia blanda: si ya hay resultado `A` con CAE, no re-solicita.

---

## 6. Gaps vs manual V.4.8 / RG 5616 (para A2)

| Gap | Riesgo | Acción A2 |
|-----|--------|-----------|
| No envía `CondicionIVAReceptorId` | Rechazo al ser obligatorio (RG 5616) | Mapear condición fiscal del cliente → id; llamar `FEParamGetCondicionIvaReceptor` |
| Solo DocTipo 99 / DocNro 0 | No factura a RI con CUIT | Usar DocTipo/DocNro del cliente de la venta |
| AlicIva fija Id=5 | Mal si hay 10,5 % / 27 % / exento | Mapear alícuota producto → Id; multi-alicuota |
| No `FEDummy` / `FEParamGet*` / `FECompConsultar` | Difícil diagnosticar y auditar | Agregar status rico + consulta |
| Parser XML por regex | Frágil ante cambios de envelope | Preferir XML API / cliente generado del WSDL |
| Sin tests automatizados | Regresiones silenciosas | Unit mapeos + WireMock SOAP |
| XML SOAP en DB puede incluir datos sensibles | Retención / acceso | Restringir roles; no exponer al front |

---

## 7. Seguridad

- Cert/key fuera de git (`*.pem`, paths en secrets del VPS).  
- Solo TITULAR solicita CAE.  
- No devolver stack traces ni XML crudo al browser.  
- HTTPS obligatorio en prod.  
- Un certificado = un CUIT del **cliente**; nunca un cert “de REEB” para terceros (hosted).

---

## 8. Testing (estricto)

| Nivel | Qué |
|-------|-----|
| Unit | `mapDocumentType`, dinero centavos↔decimal, mapeo alícuota / CondicionIVAReceptor |
| Integration | Controller + `@PreAuthorize` |
| Contrato | WireMock LoginCms + FECAESolicitar; **sin** certs reales en CI |
| Homo manual | Checklist §2 + un CAE aprobado en ambiente de testing |

DoD homologación: al menos un comprobante con `Resultado=A` y CAE válido.  
Prod: solo con OK del contador del cliente.

---

## 9. Orden de trabajo (A2)

1. Completar checklist cliente (homo).  
2. Cerrar gaps §6 (empezar por `CondicionIVAReceptorId` + DocTipo real).  
3. UI panel: estado ARCA + “Solicitar CAE” + errores legibles.  
4. Ticket/impresión con CAE.  
5. Solo entonces PROD.

---

## 10. Relación con hosted / piloto

En plan mensual cada suscriptor aporta **su** CUIT y certificado (o alta asistida cotizada).  
Ver [PLAN-MENSUAL-HOSTED.md](./PLAN-MENSUAL-HOSTED.md), [MAPA-PILOTO.md](./MAPA-PILOTO.md), [ARQUITECTURA.md](./ARQUITECTURA.md).
