# Mercado Pago — Checkout Pro (guía de integración)

Documento para integrar **cobros online** vía Checkout Pro en un sistema de stock/ventas (single-tenant).

**Extra cotizado.** Sin el `ACCESS_TOKEN` de la **cuenta del comercio** no se crean cobros.
No inventa precios de suscripción: el cobro es del comercio con su propia cuenta MP.

Documentación oficial:

| Recurso | URL |
|---------|-----|
| Checkout Pro (overview) | https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing |
| Crear preferencia | https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/create-payment-preference |
| Webhooks / notificaciones | https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks |
| Credenciales (test/prod) | https://www.mercadopago.com.ar/developers/panel/app |
| SDK / API reference | https://www.mercadopago.com.ar/developers/es/reference |

---

## Variables de entorno (servidor)

```bash
MP_ENABLED=true
MP_ACCESS_TOKEN=APP_USR-...          # token de la cuenta del comercio (nunca en el front)
MP_PUBLIC_KEY=APP_USR-...            # opcional (front / bricks futuros)
MP_NOTIFICATION_URL=https://tu-dominio/api/mercadopago/webhooks
MP_SUCCESS_URL=https://tu-dominio/panel
MP_FAILURE_URL=https://tu-dominio/panel
MP_PENDING_URL=https://tu-dominio/panel
MP_CURRENCY_ID=ARS
```

Seguridad:

- El **Access Token** vive solo en el servidor (env / secrets). Nunca en git ni en el navegador.
- Usar HTTPS en producción.
- Validar notificaciones (consultar el pago por API con el `id` del webhook antes de marcar la venta como pagada).

---

## API típica del producto (ejemplo)

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/mercadopago/status` | ¿Configurado? |
| POST | `/api/mercadopago/preferences/{saleId}` | Crea preferencia Checkout Pro |
| GET | `/api/mercadopago/checkouts/{saleId}` | Links / estados |
| POST/GET | `/api/mercadopago/webhooks` | IPN / webhook (público) |

Flujo:

1. Cerrar venta en el panel.
2. Crear preferencia → obtener `init_point` (prod) o `sandbox_init_point` (test).
3. Abrir el link / QR para que el cliente pague.
4. Webhook actualiza estado; el panel muestra pagado / pendiente / fallido.

En el panel: **Ventas → Link MP**.

---

## Checklist de aceptación

- [ ] Credenciales de **prueba** generan preferencia y pago sandbox.
- [ ] Webhook marca la venta sin intervención manual.
- [ ] Credenciales de **producción** solo con OK del comercio.
- [ ] Token no aparece en logs de front ni en repositorio.
