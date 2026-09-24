# API de ARCA (webservices oficiales)

Resumen operativo basado en los PDF de ARCA/AFIP.  
Canónico HTML: [arca-implementacion.html](arca-implementacion.html) · PDFs: [arca-fuentes.html](arca-fuentes.html)

## Orden

1. Certificado + WSN `wsfe` + PV electrónico  
2. WSAA `loginCms` → token + sign  
3. `FECompUltimoAutorizado` → nro siguiente  
4. `FECAESolicitar` → CAE (incluir `CondicionIVAReceptorId`, RG 5616)

## Manuales

- [wsfev1-RG-4291.pdf](pdfs/wsfev1-RG-4291.pdf)
- [WSAAmanualDev.pdf](pdfs/WSAAmanualDev.pdf)
- [Especificacion_Tecnica_WSAA_1.2.2.pdf](pdfs/Especificacion_Tecnica_WSAA_1.2.2.pdf)

Homologación externa: https://www.afip.gob.ar/ws/documentacion/homologacion-externa.asp
