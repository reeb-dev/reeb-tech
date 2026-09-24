# Datos geográficos Argentina

- **Fuente:** [Georef API](https://apis.datos.gob.ar/georef/) (datos.gob.ar)
- **Archivo:** `ar-provincias-localidades.json`
- **Contenido:** 24 provincias + localidades por provincia (nombres oficiales)
- **Malvinas:** siempre presentes bajo *Tierra del Fuego, Antártida e Islas del Atlántico Sur* (`Islas Malvinas`, `Puerto Argentino`, `Antártida Argentina`) + lema en UI
- Regenerar:

```bash
curl -sS 'https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=50&orden=nombre' -o /tmp/p.json
curl -sS 'https://apis.datos.gob.ar/georef/api/localidades?campos=id,nombre,provincia.id,provincia.nombre&max=5000&orden=nombre' -o /tmp/l.json
# luego compactar con el script del agente / pipeline interno
```
