# REEB.

Sitio de Manuel Reeb: Senior Software Engineer (Android · Java/Spring · Angular).

Live: [webconreeb.com](https://webconreeb.com/) (también redirige desde [reeb-dev.github.io/reeb-tech](https://reeb-dev.github.io/reeb-tech/) cuando el DNS está activo)

Español e inglés: toggle **ES / EN** en el nav. Se guarda en `localStorage`; si el navegador está en inglés, arranca en EN.

## Stack del sitio

Angular, TypeScript, Tailwind CSS. Deploy automático a GitHub Pages en cada push a `main`.

```bash
npm install
npm start          # http://localhost:4200
npm run build -- --configuration production --base-href /
```

## Contenido

La copy vive en los componentes de `src/app/components/` (`hero`, `companies`, `projects`, `about`, `services`, `stack`, `contact`). Experiencia alineada a LinkedIn: BP4 (actualidad), Indra (2022–2025), Siskit (2018–2022).
