package com.arautos.domain;

import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tenants")
public class Tenant {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true, length = 80)
  private String slug;

  private String logoUrl;

  @Column(nullable = false, length = 80)
  private String province;

  @Column(nullable = false, length = 80)
  private String city;

  private String address;

  @Column(nullable = false, length = 32)
  private String whatsapp;

  private String email;

  @Column(length = 1000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private SubscriptionStatus subscriptionStatus = SubscriptionStatus.PENDIENTE_PAGO;

  private Instant trialEndsAt;

  @Column(length = 64)
  private String planId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private ModerationStatus moderationStatus = ModerationStatus.PENDIENTE;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getSlug() { return slug; }
  public void setSlug(String slug) { this.slug = slug; }
  public String getLogoUrl() { return logoUrl; }
  public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
  public String getProvince() { return province; }
  public void setProvince(String province) { this.province = province; }
  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }
  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }
  public String getWhatsapp() { return whatsapp; }
  public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public SubscriptionStatus getSubscriptionStatus() { return subscriptionStatus; }
  public void setSubscriptionStatus(SubscriptionStatus subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }
  public Instant getTrialEndsAt() { return trialEndsAt; }
  public void setTrialEndsAt(Instant trialEndsAt) { this.trialEndsAt = trialEndsAt; }
  public String getPlanId() { return planId; }
  public void setPlanId(String planId) { this.planId = planId; }
  public ModerationStatus getModerationStatus() { return moderationStatus; }
  public void setModerationStatus(ModerationStatus moderationStatus) { this.moderationStatus = moderationStatus; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
