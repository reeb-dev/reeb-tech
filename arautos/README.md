# ArAutos — Marketplace multi-concesionario (AR)

Producto aparte del hub `reeb-tech` (esta carpeta `arautos/`).

Decisiones Fase 0: ver plan en el Agent Store del proyecto (`docs/plan-arautos.md`).

## Stack

- Backend: Java 21 + Spring Boot 3.3 + JWT + JPA
- Frontend: Angular 19
- DB: PostgreSQL 16 (Docker Compose)

## Cómo levantar (local)

### 1. Postgres

```bash
cd arautos
docker compose up -d
```

Sin Docker, creá DB/usuario `arautos`/`arautos` en Postgres local (puerto 5432).

Variables: copiá `.env.example` (opcional). Precios de plan quedan vacíos a propósito.

### 2. API

```bash
cd arautos/backend
mvn spring-boot:run
```

API en `http://localhost:8080`.

Seed automático (si `ARAUTOS_SEED=true`):

| Usuario | Password | Rol |
| --- | --- | --- |
| `admin@arautos.local` | `admin123` | PLATFORM_ADMIN |
| `demo1@patagonia-motors.example` | `demo123` | TENANT_ADMIN · Patagonia Motors |
| `agente1@patagonia-motors.example` | `demo123` | TENANT_AGENT · Patagonia Motors |
| `demo2@centro-automotores.example` | `demo123` | TENANT_ADMIN · Centro Automotores |

### 3. Front

```bash
cd arautos/frontend
npm install
npm start
```

Abre `http://localhost:4200` (proxy `/api` → `:8080`).

Rutas:

- `/` catálogo público
- `/aviso/:id` ficha (galería + lightbox)
- `/c/:slug` perfil concesionaria
- `/panel/login` login / alta self-serve
- `/panel` panel del local (stock, perfil, usuarios si es admin del local)
- `/panel/admin` administración de plataforma (solo `PLATFORM_ADMIN`)

APIs de usuarios:

- `GET/POST /api/panel/users` — listar / alta (TENANT_ADMIN)
- `PUT /api/panel/users/{id}/role` — cambiar rol
- `POST /api/panel/users/{id}/deactivate|activate`
- `DELETE /api/panel/users/{id}`
- `GET /api/admin/tenants` · `GET /api/admin/tenants/pending`
- `POST /api/admin/tenants/{id}/approve|suspend`
## Reglas de suscripción

- Catálogo: solo avisos `PUBLICADO` de tenants con moderación `ACTIVA` y suscripción `TRIAL` vigente o `ACTIVA`.
- `VENCIDA`: no lista en catálogo; panel solo lectura.
- Trial: 14 días desde aprobación admin (`ARAUTOS_TRIAL_DAYS`).
- Moneda avisos: USD y ARS.

## Fase 1b — Mercado Pago (scaffolding)

Checkout y webhook están listos; **no hay secrets ni montos inventados en el repo**.

Env (ver `.env.example`):

| Variable | Uso |
| --- | --- |
| `ARAUTOS_MP_ENABLED` | `true` para habilitar |
| `ARAUTOS_MP_ACCESS_TOKEN` | Access token (privado) |
| `ARAUTOS_MP_PUBLIC_KEY` | Public key |
| `ARAUTOS_MP_WEBHOOK_SECRET` | Opcional / futuro |
| `ARAUTOS_PLAN_PRICE_ARS` | Monto del plan en ARS (requerido para crear preferencia) |
| `ARAUTOS_PLAN_PRICE_USD` | Placeholder opcional (no se inventa en UI pública) |

Endpoints:

- `GET /api/panel/billing/status` — estado + si MP está configurado
- `POST /api/panel/billing/checkout` — crea preferencia o responde mensaje de bloqueo
- `POST /api/public/mp/webhook` — actualiza `ACTIVA` / `PENDIENTE_PAGO` según pago

**Bloqueo actual:** sin `ARAUTOS_MP_*` + monto ARS, el checkout devuelve `configured:false` y un mensaje claro. No hardcodear tokens.

## Meta — Login vs Conectar redes

Dos flujos distintos (no un token global para todos):

| Flujo | Callback | Uso |
| --- | --- | --- |
| Ingresar con Google | `/api/auth/oauth/google/callback` | Cuenta AR Autos |
| Ingresar con Facebook | `/api/auth/oauth/facebook/callback` | Cuenta AR Autos |
| Conectar Meta | `/api/panel/social/meta/callback` | Página + Instagram de **esa** concesionaria |

### Google — `redirect_uri_mismatch`

En Google Cloud Console → Credenciales → cliente OAuth **Web** → **Authorized redirect URIs**, agregue **exactamente** (sin slash final, `http` no `https`, puerto `8080`):

```text
http://localhost:8080/api/auth/oauth/google/callback
```

En el `.env` local:

```env
ARAUTOS_OAUTH_GOOGLE_ENABLED=true
ARAUTOS_OAUTH_GOOGLE_CLIENT_ID=...
ARAUTOS_OAUTH_GOOGLE_CLIENT_SECRET=...
ARAUTOS_OAUTH_GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/oauth/google/callback
```

Errores típicos: URI en `:4200`, `127.0.0.1` vs `localhost`, slash final, o falta `/api`.

Env Facebook/Meta: `ARAUTOS_OAUTH_FACEBOOK_*`. Sin secret: botones apagados / `configured:false`.

Panel: **Conectar Meta** → elegir Página → tokens cifrados por tenant → **Difusión** con vista previa y publicación FB/IG. Las fotos deben ser HTTPS públicas.

Playbook: Agent Store `docs/meta-conectar-redes.md`.

## Fase 1c — Ranking panel

- `GET /api/panel/ranking?province=` — ranking por provincia, criterio **clics WhatsApp**
- Solo usuarios autenticados del panel (no público)

## API útil

- `GET /api/public/catalog`
- `GET /api/public/vehicles/{id}`
- `POST /api/public/vehicles/{id}/view`
- `POST /api/public/vehicles/{id}/wa-click`
- `GET /api/public/c/{slug}`
- `POST /api/auth/login` · `POST /api/auth/register`
- `GET /api/auth/oauth/providers` · `GET /api/auth/oauth/facebook/start|callback`
- `GET|POST|PUT|DELETE /api/panel/vehicles`
- `GET|PUT /api/panel/profile` · `GET /api/panel/stats`
- `GET /api/panel/billing/status` · `POST /api/panel/billing/checkout`
- `GET /api/panel/social/meta/status|start|pages` · `POST .../select-page` · `DELETE .../meta`
- `GET /api/panel/social/publish/preview` · `POST /api/panel/social/publish`
- `GET /api/panel/ranking`
- `GET /api/admin/tenants/pending` · `POST .../approve` · `POST .../suspend`

## Fuera de alcance

ARCA, subdominio/custom domain, montos públicos inventados, editar demos del hub `public/demos`.
