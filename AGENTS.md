## Learned User Preferences

- Respond in Spanish.
- Keep LinkedIn, GitHub, and portfolio copy aligned with each other; do not invent experience, education, certificates, skills, or metrics (including user counts) that are not on the public profile. Headline and pinned skills should match the public stack (Android, Angular, Java/Spring), not Docker, Linux, CI/CD, or Three.js.
- Prefer human, less AI-sounding copy for LinkedIn posts and site drafts; use a professional register (not colloquial “criollo”) in colleague-facing emails and documentation.
- Keep the site bilingual ES/EN (nav toggle plus i18n copy) so it works for freelance clients.
- “Deploy” means commit and push to `main` for GitHub Pages; do not commit or push unless explicitly asked.
- Show company logos (BP4 together with Fiserv) and technology logos on the stack, not text-only lists.
- Surface only the most important HackerRank certifications (the ones highlighted on LinkedIn), not the full list.
- Do not present BP4 client or internal tools (hours/timesheet repos) as public portfolio, LinkedIn, or GitHub profile projects.
- When writing shareable docs or examples, do not treat the personal portfolio (`reeb-tech`) as the product; use generic consultora or product cases. Frame the `docs/` kit as optional material for classmates, not course work or a new team process.
- Prefer downloaded local images that match the item (book cover = that book, car photo = that brand/model, architecture/exterior = buildings and landscapes); do not use generic magazine or kiosk stock for those themes.
- The demos hub should sell custom development (not SaaS); experience copy stays LinkedIn-aligned only.

## Learned Workspace Facts

- This repo is Manuel Reeb’s personal portfolio (`reeb-dev/reeb-tech`): Angular + Tailwind, live at https://reeb-dev.github.io/reeb-tech/.
- GitHub Pages deploys automatically on every push to `main` (`base-href` `/reeb-tech/`).
- Bilingual copy lives in `src/app/i18n/content.ts`; the language toggle persists in `localStorage`.
- Experience aligned to LinkedIn: BP4 (current, with Fiserv — legacy maintenance, Java backend, SMTP tests from the terminal in dev and prod), Indra (2022–2025), Siskit (2018–2022). Professional stack: Android, Java/Spring, Angular.
- Featured personal projects on the site: daily-reflex-tap (Android) and cosmos-simulation (Three.js on Vercel).
- GitHub profile README lives in `reeb-dev/reeb-dev` (not this portfolio repo) and should feature only public work: the portfolio, daily-reflex-tap, and cosmos-simulation.
- Education: Teclab Instituto Técnico Superior, Técnico Superior en Programación (2021–2025).
- Public profile used as source of truth: https://www.linkedin.com/in/manuel-jesus-reeb
- HackerRank certificates on the site (LinkedIn-backed): Software Engineer Intern, Angular (Intermediate), JavaScript (Intermediate), Rest API (Intermediate).
- `docs/` is a shareable Spanish agent-rules kit (not the public portfolio): index `docs/README.md`, hub `docs/guia-inicio.html`, beginner guide `docs/guia-principiantes.html`, long guide `docs/guia-agentes-reglas-y-modelos.html`, practical cases `docs/casos-practicos-legacy-y-nuevos.html`, paste prompts in `docs/casos/`. Open the HTML in a browser, not as a GitHub blob.
- The kit is served on GitHub Pages at https://reeb-dev.github.io/reeb-tech/docs/ (`public/docs/` is the deploy copy; `docs/` is the source).
- User is building demo web apps for Argentine business verticals under `public/demos/` (and GitHub Pages at https://reeb-dev.github.io/reeb-tech/demos/): estudio, comercio, facturación, kiosco, inmobiliaria, taller, peluquería, carpintería, librería, biblioteca, restaurante, rotisería, marketplace, stock+facturación, automotores, turismo (Sierra de la Ventana: hospedaje, excursiones, complejo), arquitectura, materiales (corralón), steelframe. Standalone HTML/CSS/JS with localStorage, distinct visual identity, ARCA where applicable. Demos include WhatsApp + contact form (demo, no backend). Client-facing catalog plus admin panel.
