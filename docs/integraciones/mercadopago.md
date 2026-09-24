# Mercado Pago — guía de implementación (Checkout Pro + API)

Extra cotizado. Sin el **Access Token de la cuenta del comercio** no se crean cobros.  
No inventa precios de suscripción: el cobro es del comercio con su propia cuenta MP.

Fuente de verdad (API): [https://www.mercadopago.com.ar/developers/es/reference](https://www.mercadopago.com.ar/developers/es/reference)  
Base URL: `https://api.mercadopago.com`  
Checkout Pro (producto): [landing](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)

---

## 1. Para el usuario (comercio)

1. Crear cuenta de vendedor en Mercado Pago.  
2. Ir a **Tus integraciones** → crear aplicación.  
3. Copiar credenciales:
   - **Access Token** (servidor; test y prod son distintos).  
   - **Public Key** (opcional hoy; bricks / front futuro).  
4. Entregar a REEB solo por canal seguro (1Password / mensaje cifrado). Nunca por issue público.  
5. En producción hace falta **HTTPS** en la URL del local (MP descarta `back_urls` con `http://`).  
6. Probar un pago de prueba → ver estado en el panel (Ventas → Link MP).  
7. Producción: cambiar a token prod solo con OK del dueño.

Extras ARCA (CAE) son independientes: ver [Guía de implementación](arca-implementacion.html) y [Fuentes oficiales](arca-fuentes.html).

---

## 2. Autenticación (todas las llamadas)

```http
Authorization: Bearer <ACCESS_TOKEN>
```

- Solo HTTPS.  
- Nunca exponer el Access Token en el front ni en git.  
- Panel de credenciales: [developers panel](https://www.mercadopago.com.ar/developers/panel/app).

Ejemplo:

```bash
curl -H 'Authorization: Bearer <ENV_ACCESS_TOKEN>' \
  https://api.mercadopago.com/v1/payments/<PAYMENT_ID>
```

---

## 3. Endpoints que usa este producto

| Uso | Método | Path | Doc oficial |
|-----|--------|------|-------------|
| Crear preferencia Checkout Pro | `POST` | `/checkout/preferences` | [Crear preferencia](https://www.mercadopago.com.ar/developers/es/reference/online-payments/checkout-pro/preferences/create-preference/post) |
| Consultar pago (webhook) | `GET` | `/v1/payments/{id}` | [Obtener pago](https://www.mercadopago.com.ar/developers/es/reference/online-payments/checkout-api-payments/get-payment/get) |

Notificaciones: [Webhooks](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks).

Colección Postman: enlazada desde la [API Reference](https://www.mercadopago.com.ar/developers/es/reference).

---

## 4. Crear preferencia — campos relevantes

Body mínimo útil:

| Campo | Obligatorio práctico | Notas |
|-------|----------------------|--------|
| `items[]` | Sí | `title`, `quantity`, `unit_price`, `currency_id` (`ARS`) |
| `external_reference` | Sí (nuestro) | Ej. `sale-<uuid>` para reconciliar |
| `back_urls.success/failure/pending` | Recomendado | **HTTPS obligatorio**; HTTP se descarta |
| `auto_return` | Opcional | `approved` redirige al éxito |
| `notification_url` | Recomendado | URL pública HTTPS del webhook |

Respuesta clave:

| Campo | Uso |
|-------|-----|
| `id` | Preference id |
| `init_point` | URL de cobro (usar también en pruebas según doc actual) |
| `sandbox_init_point` | La doc indica **no usarlo**; preferir `init_point` |

Referencia completa de request/response: link “Crear preferencia” arriba.

---

## 5. Obtener pago — estados

Tras el webhook, el servidor **debe** consultar `GET /v1/payments/{id}` (no confiar solo en el body crudo).

Estados habituales (`status`): `pending`, `approved`, `authorized`, `in_process`, `in_mediation`, `rejected`, `cancelled`, `refunded`, `charged_back`.

Campos útiles: `id`, `status`, `external_reference`, montos, medio de pago.

---

## 6. Variables de entorno (servidor)

```bash
MP_ENABLED=true
MP_ACCESS_TOKEN=APP_USR-...          # cuenta del comercio
MP_PUBLIC_KEY=APP_USR-...            # opcional
MP_NOTIFICATION_URL=https://tu-dominio/api/mercadopago/webhooks
MP_SUCCESS_URL=https://tu-dominio/panel
MP_FAILURE_URL=https://tu-dominio/panel
MP_PENDING_URL=https://tu-dominio/panel
MP_CURRENCY_ID=ARS
```

En hosted: van en `ops/instances/<slug>/.env` (gitignored).

---

## 7. API interna del panel

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/mercadopago/status` | ¿Configurado? |
| POST | `/api/mercadopago/preferences/{saleId}` | Crea preferencia |
| GET | `/api/mercadopago/checkouts/{saleId}` | Links / estados |
| POST/GET | `/api/mercadopago/webhooks` | Notificación (público) |

Flujo: venta → preferencia → abrir `init_point` → webhook → `GET /v1/payments/{id}` → actualizar checkout local.

Código: `application/mercadopago` + `infrastructure/mercadopago`.

---

## 8. Gaps vs API Reference (para A3)

| Gap | Riesgo | Acción |
|-----|--------|--------|
| UI usa a veces `sandbox_init_point` | Doc actual: no usarlo | Preferir siempre `init_point` |
| `back_urls` en localhost HTTP | MP las descarta | Solo HTTPS en piloto real |
| Webhook sin firma / secret validado | Spoofing | Validar según guía webhooks + siempre GET pago |
| Venta local no siempre refleja “pagada” | Confusión en caja | Mapear `approved` → estado de venta (A3) |
| Sin tests WireMock | Regresiones | Mock preferencia + payment |

---

## 9. Checklist de aceptación

### Usuario / comercio

- [ ] App creada; token test entregado por canal seguro.  
- [ ] Un pago de prueba completo (preferencia → checkout → webhook).  
- [ ] Token prod solo tras OK explícito.

### Código / ops

- [ ] `MP_*` en secrets del servidor; no en git.  
- [ ] `notification_url` y `back_urls` en HTTPS.  
- [ ] Logs sin Access Token.  
- [ ] Test unit/integration del mapeo `external_reference` → venta.

---

## 10. Fuera de alcance por defecto

- Mercado Pago **Suscripciones** (cobro del plan REEB al comercio) — cobro del plan = transferencia o link manual al inicio (ver piloto A0).  
- Checkout Bricks / Card Form embebido (otro afluente si se cotiza).  
- Split / marketplace fee.
