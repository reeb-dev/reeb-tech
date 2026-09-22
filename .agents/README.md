# Carpeta común Cursor + OpenCode

Un solo inventario para los dos agentes.

| Quién | Cómo lo lee |
| --- | --- |
| OpenCode | `opencode.json` → `instructions` incluye `.agents/PROYECTOS.md`. Las skills de `.agents/skills/` se descubren solas. |
| Cursor | La regla `.cursor/rules/proyectos.mdc` obliga a usar `.agents/PROYECTOS.md`. La skill de diseño sigue en `.cursor/skills/`; acá hay un enlace a la misma carpeta. |

No dupliques la lista en otro archivo. Si aparece un repo nuevo en GitHub, actualizá solo `PROYECTOS.md`.
