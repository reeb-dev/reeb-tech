package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import com.arautos.repo.TenantRepository;
import com.arautos.security.UserPrincipal;
import com.arautos.web.dto.BillingDtos;
import com.arautos.web.error.ApiException;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

/**
 * Fase 1b — hooks de checkout / webhook Mercado Pago.
 * Sin credenciales: responde scaffolding (configured=false) sin inventar montos.
 */
@Service
public class MercadoPagoBillingService {
  private static final Logger log = LoggerFactory.getLogger(MercadoPagoBillingService.class);

  private final ArautosProperties properties;
  private final TenantRepository tenants;
  private final SubscriptionService subscriptions;
  private final RestClient restClient = RestClient.create();

  public MercadoPagoBillingService(ArautosProperties properties, TenantRepository tenants,
                                   SubscriptionService subscriptions) {
    this.properties = properties;
    this.tenants = tenants;
    this.subscriptions = subscriptions;
  }

  @Transactional(readOnly = true)
  public BillingDtos.BillingStatusDto status(UserPrincipal principal) {
    Tenant t = requireTenant(principal);
    subscriptions.refreshExpiredTrial(t);
    ArautosProperties.MercadoPago mp = properties.getMercadoPago();
    ArautosProperties.Plan plan = properties.getPlan();
    return new BillingDtos.BillingStatusDto(
        t.getSubscriptionStatus(),
        t.getTrialEndsAt(),
        plan.getId(),
        plan.getName(),
        blankToNull(plan.getPriceUsd()),
        blankToNull(plan.getPriceArs()),
        mp.isConfigured(),
        t.getMpPreferenceId(),
        subscriptions.isPanelReadOnly(t),
        mp.isConfigured()
            ? "Checkout listo cuando el plan tenga monto configurado."
            : "Mercado Pago no configurado. Defina ARAUTOS_MP_* en el entorno (ver README).");
  }

  @Transactional
  public BillingDtos.CheckoutResponse createCheckout(UserPrincipal principal) {
    Tenant t = requireTenant(principal);
    subscriptions.refreshExpiredTrial(t);
    if (t.getModerationStatus() != ModerationStatus.ACTIVA) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Cuenta pendiente de aprobación");
    }

    ArautosProperties.MercadoPago mp = properties.getMercadoPago();
    ArautosProperties.Plan plan = properties.getPlan();
    if (!mp.isConfigured()) {
      return new BillingDtos.CheckoutResponse(
          false,
          null,
          null,
          null,
          "Mercado Pago no configurado. Cargá ARAUTOS_MP_ENABLED=true, ACCESS_TOKEN y PUBLIC_KEY. Sin secrets en el repo.");
    }

    BigDecimal amount = resolveAmountArs(plan);
    if (amount == null) {
      return new BillingDtos.CheckoutResponse(
          false,
          null,
          null,
          null,
          "Falta monto del plan (ARAUTOS_PLAN_PRICE_ARS). No se inventan precios públicos.");
    }

    try {
      Map<String, Object> body = buildPreferenceBody(t, plan, amount, mp);
      @SuppressWarnings("unchecked")
      Map<String, Object> response = restClient.post()
          .uri("https://api.mercadopago.com/checkout/preferences")
          .contentType(MediaType.APPLICATION_JSON)
          .header("Authorization", "Bearer " + mp.getAccessToken())
          .body(body)
          .retrieve()
          .body(Map.class);

      if (response == null) {
        throw new ApiException(HttpStatus.BAD_GATEWAY, "Respuesta vacía de Mercado Pago");
      }
      String preferenceId = String.valueOf(response.get("id"));
      String initPoint = response.get("init_point") != null
          ? String.valueOf(response.get("init_point"))
          : null;
      String sandbox = response.get("sandbox_init_point") != null
          ? String.valueOf(response.get("sandbox_init_point"))
          : null;

      t.setMpPreferenceId(preferenceId);
      if (t.getSubscriptionStatus() == SubscriptionStatus.VENCIDA
          || t.getSubscriptionStatus() == SubscriptionStatus.TRIAL) {
        t.setSubscriptionStatus(SubscriptionStatus.PENDIENTE_PAGO);
      }
      tenants.save(t);

      return new BillingDtos.CheckoutResponse(true, preferenceId, initPoint, sandbox, null);
    } catch (ApiException e) {
      throw e;
    } catch (Exception e) {
      log.warn("Checkout MP falló: {}", e.getMessage());
      throw new ApiException(HttpStatus.BAD_GATEWAY,
          "No se pudo crear la preferencia de Mercado Pago. Revisá el access token.");
    }
  }

  @Transactional
  public void handleWebhook(Map<String, Object> payload, String topic, String id) {
    ArautosProperties.MercadoPago mp = properties.getMercadoPago();
    if (!mp.isConfigured()) {
      log.info("Webhook MP ignorado: credenciales no configuradas");
      return;
    }

    String paymentId = id;
    if (paymentId == null || paymentId.isBlank()) {
      Object data = payload != null ? payload.get("data") : null;
      if (data instanceof Map<?, ?> dataMap && dataMap.get("id") != null) {
        paymentId = String.valueOf(dataMap.get("id"));
      }
    }
    if (paymentId == null || paymentId.isBlank()) {
      log.info("Webhook MP sin payment id (topic={})", topic);
      return;
    }

    try {
      @SuppressWarnings("unchecked")
      Map<String, Object> payment = restClient.get()
          .uri("https://api.mercadopago.com/v1/payments/{id}", paymentId)
          .header("Authorization", "Bearer " + mp.getAccessToken())
          .retrieve()
          .body(Map.class);
      if (payment == null) {
        return;
      }
      String status = String.valueOf(payment.get("status"));
      String externalRef = payment.get("external_reference") != null
          ? String.valueOf(payment.get("external_reference"))
          : null;
      if (externalRef == null || externalRef.isBlank()) {
        log.warn("Pago MP {} sin external_reference", paymentId);
        return;
      }
      UUID tenantId = UUID.fromString(externalRef);
      Tenant tenant = tenants.findById(tenantId).orElse(null);
      if (tenant == null) {
        log.warn("Pago MP {} referencia tenant inexistente {}", paymentId, tenantId);
        return;
      }
      tenant.setMpPaymentId(paymentId);
      if ("approved".equalsIgnoreCase(status)) {
        tenant.setSubscriptionStatus(SubscriptionStatus.ACTIVA);
        tenant.setTrialEndsAt(null);
        log.info("Suscripción ACTIVA para tenant {} por pago {}", tenant.getSlug(), paymentId);
      } else if ("pending".equalsIgnoreCase(status) || "in_process".equalsIgnoreCase(status)) {
        tenant.setSubscriptionStatus(SubscriptionStatus.PENDIENTE_PAGO);
      } else if ("rejected".equalsIgnoreCase(status) || "cancelled".equalsIgnoreCase(status)) {
        if (tenant.getSubscriptionStatus() != SubscriptionStatus.ACTIVA) {
          tenant.setSubscriptionStatus(SubscriptionStatus.PENDIENTE_PAGO);
        }
      }
      tenants.save(tenant);
    } catch (Exception e) {
      log.warn("Webhook MP no pudo procesar pago {}: {}", paymentId, e.getMessage());
    }
  }

  private Map<String, Object> buildPreferenceBody(Tenant tenant, ArautosProperties.Plan plan,
                                                  BigDecimal amount, ArautosProperties.MercadoPago mp) {
    Map<String, Object> item = new LinkedHashMap<>();
    item.put("title", "ArAutos — plan " + plan.getName());
    item.put("quantity", 1);
    item.put("currency_id", "ARS");
    item.put("unit_price", amount);

    Map<String, Object> backUrls = new LinkedHashMap<>();
    backUrls.put("success", mp.getSuccessUrl());
    backUrls.put("pending", mp.getPendingUrl());
    backUrls.put("failure", mp.getFailureUrl());

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("items", List.of(item));
    body.put("external_reference", tenant.getId().toString());
    body.put("back_urls", backUrls);
    body.put("auto_return", "approved");
    if (mp.getNotificationUrl() != null && !mp.getNotificationUrl().isBlank()) {
      body.put("notification_url", mp.getNotificationUrl());
    }
    return body;
  }

  private static BigDecimal resolveAmountArs(ArautosProperties.Plan plan) {
    String raw = plan.getPriceArs();
    if (raw == null || raw.isBlank()) {
      return null;
    }
    try {
      return new BigDecimal(raw.trim());
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private Tenant requireTenant(UserPrincipal principal) {
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Usuario sin concesionaria");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }

  private static String blankToNull(String s) {
    return s == null || s.isBlank() ? null : s;
  }
}
