# ArAutos — Fase 1a (MVP multi-concesionario)

Marketplace multi-tenant para concesionarias en Argentina.  
Producto aparte del hub `reeb-tech` (esta carpeta `arautos/`).

Decisiones Fase 0: ver `/cursor/stores/self/docs/plan-arautos.md`.

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
- `/aviso/:id` ficha
- `/c/:slug` perfil concesionaria
- `/panel/login` login / alta self-serve
- `/panel` stock + stats

## Reglas 1a

- Catálogo: solo avisos `PUBLICADO` de tenants con moderación `ACTIVA` y suscripción `TRIAL` vigente o `ACTIVA`.
- `VENCIDA`: no lista en catálogo; panel solo lectura.
- Trial: 14 días desde aprobación admin (`ARAUTOS_TRIAL_DAYS`).
- Moneda avisos: USD y ARS.
- Sin Mercado Pago (1b). Sin ranking (1c).

## API útil

- `GET /api/public/catalog`
- `GET /api/public/vehicles/{id}`
- `POST /api/public/vehicles/{id}/view`
- `POST /api/public/vehicles/{id}/wa-click`
- `GET /api/public/c/{slug}`
- `POST /api/auth/login` · `POST /api/auth/register`
- `GET|POST|PUT|DELETE /api/panel/vehicles`
- `GET|PUT /api/panel/profile` · `GET /api/panel/stats`
- `GET /api/admin/tenants/pending` · `POST .../approve` · `POST .../suspend`

## Fuera de alcance 1a

Mercado Pago, ranking, subdominio/custom domain, montos públicos inventados, editar demos del hub.
