# REEB.

Sitio de Manuel Reeb. En [webconreeb.com](https://webconreeb.com/) la raíz lleva al **hub de demos** (catálogo comercial). El CV Angular vive en [/cv/](https://webconreeb.com/cv/).

Español e inglés en el CV: toggle **ES / EN** en el nav. Se guarda en `localStorage`; si el navegador está en inglés, arranca en EN.

## Stack del sitio

Angular, TypeScript, Tailwind CSS. Deploy automático a GitHub Pages en cada push a `main`.

```bash
npm install
npm start          # http://localhost:4200 (CV en local)
npm run build -- --configuration production
```

## Contenido

- Hub de demos: `public/demos/` (home del dominio vía redirect en el build).
- CV Angular: `src/app/` → publicado en `/cv/`.
- Copy i18n: `src/app/i18n/content.ts`. Experiencia alineada a LinkedIn: BP4 (actualidad), Indra (2022–2025), Siskit (2018–2022).
