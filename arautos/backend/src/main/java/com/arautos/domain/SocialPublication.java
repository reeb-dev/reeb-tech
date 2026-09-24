package com.arautos.domain;

import com.arautos.domain.enums.PublicationStatus;
import com.arautos.domain.enums.SocialChannel;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "social_publications")
public class SocialPublication {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private UUID tenantId;

  @Column(nullable = false)
  private UUID vehicleId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private SocialChannel channel;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private PublicationStatus status = PublicationStatus.PENDING;

  @Column(length = 128)
  private String externalPostId;

  @Column(length = 1000)
  private String postUrl;

  @Column(length = 2000)
  private String caption;

  @Column(length = 2000)
  private String errorMessage;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public UUID getTenantId() { return tenantId; }
  public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
  public UUID getVehicleId() { return vehicleId; }
  public void setVehicleId(UUID vehicleId) { this.vehicleId = vehicleId; }
  public SocialChannel getChannel() { return channel; }
  public void setChannel(SocialChannel channel) { this.channel = channel; }
  public PublicationStatus getStatus() { return status; }
  public void setStatus(PublicationStatus status) { this.status = status; }
  public String getExternalPostId() { return externalPostId; }
  public void setExternalPostId(String externalPostId) { this.externalPostId = externalPostId; }
  public String getPostUrl() { return postUrl; }
  public void setPostUrl(String postUrl) { this.postUrl = postUrl; }
  public String getCaption() { return caption; }
  public void setCaption(String caption) { this.caption = caption; }
  public String getErrorMessage() { return errorMessage; }
  public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
