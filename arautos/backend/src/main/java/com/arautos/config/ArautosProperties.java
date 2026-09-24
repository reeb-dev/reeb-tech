package com.arautos.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "arautos")
public class ArautosProperties {
  private final Jwt jwt = new Jwt();
  private int trialDays = 14;
  private final Plan plan = new Plan();
  private String corsOrigins = "http://localhost:4200";
  private boolean seed = true;

  public Jwt getJwt() { return jwt; }
  public int getTrialDays() { return trialDays; }
  public void setTrialDays(int trialDays) { this.trialDays = trialDays; }
  public Plan getPlan() { return plan; }
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
}
