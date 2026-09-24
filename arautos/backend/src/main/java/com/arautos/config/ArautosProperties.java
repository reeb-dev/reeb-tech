package com.arautos.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "arautos")
public class ArautosProperties {
  private final Jwt jwt = new Jwt();
  private int trialDays = 14;
  private final Plan plan = new Plan();
  private final MercadoPago mercadoPago = new MercadoPago();
  private String corsOrigins = "http://localhost:4200";
  private boolean seed = true;

  public Jwt getJwt() { return jwt; }
  public int getTrialDays() { return trialDays; }
  public void setTrialDays(int trialDays) { this.trialDays = trialDays; }
  public Plan getPlan() { return plan; }
  public MercadoPago getMercadoPago() { return mercadoPago; }
  public String getCorsOrigins() { return corsOrigins; }
  public void setCorsOrigins(String corsOrigins) { this.corsOrigins = corsOrigins; }
  public boolean isSeed() { return seed; }
  public void setSeed(boolean seed) { this.seed = seed; }

  public static class Jwt {
    private String secret;
    private long expirationMs = 86400000;
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public long getExpirationMs() { return expirationMs; }
    public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
  }

  public static class Plan {
    private String id = "starter";
    private String name = "Starter";
    private String priceUsd = "";
    private String priceArs = "";
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPriceUsd() { return priceUsd; }
    public void setPriceUsd(String priceUsd) { this.priceUsd = priceUsd; }
    public String getPriceArs() { return priceArs; }
    public void setPriceArs(String priceArs) { this.priceArs = priceArs; }
  }

  /**
   * Credenciales y URLs de Mercado Pago vía env. Sin token no se crea preferencia real.
   * Montos del plan siguen en {@link Plan} (vacíos hasta que Manuel los fije).
   */
  public static class MercadoPago {
    private boolean enabled = false;
    private String accessToken = "";
    private String publicKey = "";
    private String webhookSecret = "";
    private String successUrl = "http://localhost:4200/panel?mp=success";
    private String pendingUrl = "http://localhost:4200/panel?mp=pending";
    private String failureUrl = "http://localhost:4200/panel?mp=failure";
    private String notificationUrl = "http://localhost:8080/api/public/mp/webhook";

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getPublicKey() { return publicKey; }
    public void setPublicKey(String publicKey) { this.publicKey = publicKey; }
    public String getWebhookSecret() { return webhookSecret; }
    public void setWebhookSecret(String webhookSecret) { this.webhookSecret = webhookSecret; }
    public String getSuccessUrl() { return successUrl; }
    public void setSuccessUrl(String successUrl) { this.successUrl = successUrl; }
    public String getPendingUrl() { return pendingUrl; }
    public void setPendingUrl(String pendingUrl) { this.pendingUrl = pendingUrl; }
    public String getFailureUrl() { return failureUrl; }
    public void setFailureUrl(String failureUrl) { this.failureUrl = failureUrl; }
    public String getNotificationUrl() { return notificationUrl; }
    public void setNotificationUrl(String notificationUrl) { this.notificationUrl = notificationUrl; }

    public boolean isConfigured() {
      return enabled
          && accessToken != null && !accessToken.isBlank()
          && publicKey != null && !publicKey.isBlank();
    }
  }
}
