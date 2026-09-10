# Kit de reglas para agentes de IA

Esta carpeta es un **kit de consultora**: cómo dejar reglas permanentes para agentes (Cursor, Claude Code y similares) y cómo pedir trabajo concreto (prompts y casos).

**No es** el portfolio público ni un producto de cliente. Quien clone el repo y abra `docs/` entra acá.

Si lo vas a **mandar por mail**, usá la nota corta: [LEEME-PARA-ENVIAR.md](LEEME-PARA-ENVIAR.md). Este README es el índice general (equipo, vos más adelante, un clone).

---

## Página pública

En GitHub Pages (no el blob del repo):

- Hub: https://webconreeb.com/docs/guia-inicio.html
- Primera vez: https://webconreeb.com/docs/guia-principiantes.html
- Fichas legacy / nuevo: https://webconreeb.com/docs/casos-practicos-legacy-y-nuevos.html
- Manual: https://webconreeb.com/docs/guia-agentes-reglas-y-modelos.html

Los `.md` en Pages suelen bajarse o verse como texto crudo. Usá los HTML.

---

## Cómo usar

1. Hub de una pantalla: [guia-inicio.html](guia-inicio.html).
2. Si es la primera vez: [guia-principiantes.html](guia-principiantes.html). Página de primera vez (pasos y FAQ), opcional.
3. Un capítulo del manual si hace falta: [guia-agentes-reglas-y-modelos.html](guia-agentes-reglas-y-modelos.html). No hace falta leerlo entero.
4. Prompts para el chat de hoy: [casos/prompts-base.md](casos/prompts-base.md).

Las reglas del **proyecto** van en Git, en el repo de ese producto: `AGENTS.md` o `CLAUDE.md` según la herramienta. Cortas. No se pegan en el chat. Si este kit choca con el producto, **gana la documentación oficial**.

Los nombres de modelos y de menús caducan; la lógica no.

---

## Abrir los HTML

Abrilos en el **navegador** (doble clic, o “Open in Browser”). GitHub “blob” muestra HTML crudo. Un `.md` en el navegador también sale como texto.

---

## Mapa

| Archivo | Para qué |
| --- | --- |
| [README.md](README.md) | Este índice. Quien abre `docs/`. |
| [guia-inicio.html](guia-inicio.html) | Hub de una pantalla. Empezá acá en el navegador. |
| [guia-principiantes.html](guia-principiantes.html) | Primera vez: agente, AGENTS.md, chat nuevo, qué no pedir. Opcional. |
| [guia-agentes-reglas-y-modelos.html](guia-agentes-reglas-y-modelos.html) | Manual largo (“ver más”). |
| [casos-practicos-legacy-y-nuevos.html](casos-practicos-legacy-y-nuevos.html) | Fichas: código legacy vs. proyecto nuevo. |
| [casos/](casos/README.md) | Casos cortos. Índice de fichas Markdown. |
| [casos/prompts-base.md](casos/prompts-base.md) | 32 plantillas para pegar (React, Java, Angular, Android). |
| [casos/instrucciones-por-herramienta.md](casos/instrucciones-por-herramienta.md) | Bloques para pegar: Cursor, Claude Code, OpenCode, Copilot y otras. |
| [LEEME-PARA-ENVIAR.md](LEEME-PARA-ENVIAR.md) | Nota corta si lo vas a mandar por mail. |

Fichas extra en `casos/`: bug / feature / arquitectura React, endpoint / legacy / capa Java, `AGENTS.md` portable. Ver [casos/README.md](casos/README.md).

---

## Puntos clave

1. No hace falta leerlo entero.
2. Reglas del equipo en Git: `AGENTS.md` o `CLAUDE.md` según la herramienta, corto, no en el chat.
3. Chat nuevo si cambiaste el MD o el hilo está inflado.
4. Arquitectura: modelo que razona. Ticket chico: modelo rápido.
5. Cuidá tokens: no dupliques reglas, no pegues el repo.
6. Prompts para pegar: `casos/prompts-base.md`.
7. Legacy: no reescribir. Nuevo: mapa de carpetas el día 0. Fichas en `casos-practicos-legacy-y-nuevos.html`.
8. Si choca con el producto, gana el enlace oficial (referencias en el manual).

---

## Qué no enviar

Secretos, nombres de cliente, repos de horas, el sitio personal como “el producto”.
