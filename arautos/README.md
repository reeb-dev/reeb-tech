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
| `demo1@patagonia-motors.example` | `demo123` | Patagonia Motors (trial) |
| `demo2@centro-automotores.example` | `demo123` | Centro Automotores (trial) |

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
- `/panel` stock + stats + suscripción + ranking provincia

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
- `GET|POST|PUT|DELETE /api/panel/vehicles`
- `GET|PUT /api/panel/profile` · `GET /api/panel/stats`
- `GET /api/panel/billing/status` · `POST /api/panel/billing/checkout`
- `GET /api/panel/ranking`
- `GET /api/admin/tenants/pending` · `POST .../approve` · `POST .../suspend`

## Fuera de alcance

ARCA, subdominio/custom domain, montos públicos inventados, editar demos del hub `public/demos`.
