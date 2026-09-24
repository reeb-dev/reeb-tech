# ARCA / AFIP — fuentes oficiales (índice)

Índice maestro para implementar facturación electrónica en el sistema de stock (single-tenant).  
**No inventa precios ni normativa.** Ante duda, prevalece el PDF vigente en el sitio ARCA/AFIP.

Extra cotizado: no forma parte del plan base del producto.

---

## Índice maestro (homologación externa / RG 5616)

Página prioritaria pedida para el piloto:

**https://www.afip.gob.ar/ws/documentacion/homologacion-externa.asp**  
(espejo: https://www.arca.gob.ar/ws/documentacion/homologacion-externa.asp)

Manuales enlazados desde esa página (adecuaciones R.G. N° 5.616/2024):

| Servicio | RG | Manual enlazado | ¿Lo usamos? |
|----------|----|-----------------|-------------|
| **wsfev1** | 4.291 | [Manual desarrollador V. 4.8](https://www.afip.gob.ar/fe/ayuda/documentos/wsfev1-RG-4291.pdf) | **Sí** (CAE A/B/C sin detalle de ítem) |
| wsseg | 2.668 | [Manual V.1.0](https://www.afip.gob.ar/fe/ayuda/documentos/wsseg-RG-2668.pdf) | No (seguros de caución) |
| wsmtxca | 2.904 | [Manual V 0.25.8](https://www.afip.gob.ar/fe/ayuda/documentos/Web-Service-MTXCA-Homo-Externa.pdf) | No (con detalle de ítem / MTX) |
| wsbfev1 | 5427 / 2.861 | [Manual V. 3.2](https://www.afip.gob.ar/fe/ayuda/documentos/wsbfev1-RG-5427-y-2861.pdf) | No (bonos fiscales) |

---

## WSAA (autenticación)

Hub: https://www.arca.gob.ar/ws/documentacion/wsaa.asp

| Recurso | URL | Cubre |
|---------|-----|--------|
| Manual desarrollador WSAA | https://www.arca.gob.ar/ws/WSAA/WSAAmanualDev.pdf | Flujo TRA→CMS→LoginCms→TA, FAQ, ejemplos |
| Especificación técnica WSAA 1.2.2 | https://www.arca.gob.ar/ws/WSAA/Especificacion_Tecnica_WSAA_1.2.2.pdf | Schema TRA/TA, errores `cms.*` / `xml.*` / `coe.*`, HTTPS |
| Obtener cert producción | https://www.arca.gob.ar/ws/WSAA/wsaa_obtener_certificado_produccion.pdf | Alta cert prod |
| Asociar cert a WSN (prod) | https://www.arca.gob.ar/ws/WSAA/wsaa_asociar_certificado_a_wsn_produccion.pdf | Delegación WSFE |
| Generación de certificados | https://www.arca.gob.ar/ws/WSAA/WSAA.ObtenerCertificado.pdf | CSR / OpenSSL |
| Delegar WS (Admin Relaciones) | https://www.arca.gob.ar/ws/WSAA/ADMINREL.DelegarWS.pdf | Prod: asociar WSN |
| Ejemplo Java | https://www.arca.gob.ar/ws/WSAA/ejemplos/wsaa_client_java.tgz | Cliente de referencia |
| Ejemplo PHP / C# / VB / PowerShell | bajo `…/ws/WSAA/ejemplos/` | Idem |

### URLs WSAA

| Ambiente | LoginCms |
|----------|----------|
| Homologación | `https://wsaahomo.afip.gov.ar/ws/services/LoginCms` (+ `?WSDL`) |
| Producción | `https://wsaa.afip.gov.ar/ws/services/LoginCms` (+ `?WSDL`) |

FAQ del manual también cita `wsaahomo.arca.gov.ar` / `wsaa.arca.gov.ar`. Preferir las URLs publicadas en la página WSAA vigente.

Para factura electrónica el tag `<service>` del TRA es **`wsfe`**.

---

## Certificados / WSASS (homologación)

Hub: https://www.arca.gob.ar/ws/documentacion/certificados.asp

| Recurso | URL | Cubre |
|---------|-----|--------|
| Cómo adherirse al WSASS | https://www.arca.gob.ar/ws/WSASS/WSASS_como_adherirse.pdf | Alta testing |
| Manual usuario WSASS (PDF) | https://www.arca.gob.ar/ws/WSASS/WSASS_manual.pdf | Cert + asociar WSN en homo |
| Manual usuario WSASS (HTML) | https://www.arca.gob.ar/ws/WSASS/html/index.html | Idem |
| Cadena cert homo 2022–2034 | https://www.arca.gob.ar/ws/WSASS/Cadena_de_certificacion_homo_2022_2034.zip | Trust store |

---

## WS factura electrónica (catálogo de servicios)

Hub: https://www.arca.gob.ar/ws/documentacion/ws-factura-electronica.asp  
Desde ahí: “Ver manuales” → homologación externa.

| Recurso | URL | Nota |
|---------|-----|------|
| COMPG (manual desarrollador, listado FE) | https://www.arca.gob.ar/ws/documentacion/manuales/manual-desarrollador-ARCA-COMPG.pdf | V. 4.7 en el listado del hub FE; contrastar siempre con **V. 4.8** de homologación externa |
| WSFEX (exportación) | …/manuales/WSFEX-Manualparaeldesarrollador_V3.1.1_ARCA.pdf | Fuera de alcance piloto |
| WSCT (comprobantes T) | …/manuales/Manual_Desarrollador_WSCT_v1.6.4.pdf | Fuera de alcance |

### URLs WSFEv1 (manual RG 4291 V.4.8)

| Ambiente | Endpoint |
|----------|----------|
| Homologación | `https://wswhomo.afip.gov.ar/wsfev1/service.asmx` |
| Homologación WSDL | `https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL` |
| Producción | `https://servicios1.afip.gov.ar/wsfev1/service.asmx` |
| Producción WSDL | `https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL` |

Namespace SOAP habitual: `http://ar.gov.afip.dif.FEV1/`.

---

## Otros hubs útiles

| Página | URL |
|--------|-----|
| Arquitectura general WS | https://www.arca.gob.ar/ws/documentacion/arquitectura-general.asp |
| Catálogo WS (amplio) | https://www.arca.gob.ar/ws/documentacion/catalogo.asp |
| Ayuda FE | https://www.afip.gob.ar/fe/ayuda.asp |
| Soporte homo FE | `wsfev1@arca.gov.ar` (citado en manual) |
| Soporte prod | `sri@arca.gov.ar` |
| Normativa FE | `facturaelectronica@arca.gov.ar` |

---

## Qué NO bajamos al repo

Los PDF oficiales **no** se versionan en git (peso + vigencia). Se consultan por URL.  
Guía operativa destilada: [Guía de implementación](arca-implementacion.html).

---

## Verificación de descarga (sesión A1)

| Recurso | Resultado |
|---------|-----------|
| homologacion-externa.asp | OK |
| wsaa.asp, certificados.asp, ws-factura-electronica.asp | OK |
| wsfev1-RG-4291.pdf (V.4.8) | OK (~4 MB) |
| WSAAmanualDev.pdf + Especificacion_Tecnica_WSAA | OK |
| WSASS_manual + WSASS_como_adherirse | OK |
| wsaa_obtener / wsaa_asociar cert prod | OK |
| manual-desarrollador-ARCA-COMPG.pdf | OK (descargado; alinear versión con V.4.8) |
| LoginCms?WSDL (homo) | HTTP 200 XML |
| wsfev1?WSDL (homo) | Respuesta corta HTML (81 B) — **no usable en esta sesión**; reintentar o usar SoapUI/manual |
| afip.gob.ar/ws/documentacion/default.asp | Redirect/vacío (~238 B) — usar arca.gob.ar |
| afip.gob.ar/ws/programadores/ | Idem ~235 B |
