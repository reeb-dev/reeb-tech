package com.arautos.domain;

import com.arautos.domain.enums.CurrencyCode;
import com.arautos.domain.enums.VehicleStatus;
import com.arautos.domain.enums.VehicleType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vehicles", indexes = {
  @Index(name = "idx_vehicles_tenant", columnList = "tenant_id"),
  @Index(name = "idx_vehicles_status", columnList = "status")
})
public class Vehicle {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "tenant_id", nullable = false)
  private Tenant tenant;

  @Column(nullable = false, length = 64)
  private String brand;

  @Column(nullable = false, length = 64)
  private String model;

  @Column(length = 128)
  private String version;

  @Column(nullable = false)
  private Integer year;

  @Column(nullable = false)
  private Integer km;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private VehicleType type;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal price;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 8)
  private CurrencyCode currency;

  @ElementCollection
  @CollectionTable(name = "vehicle_photos", joinColumns = @JoinColumn(name = "vehicle_id"))
  @Column(name = "photo_url", nullable = false)
  private List<String> photos = new ArrayList<>();

  @Column(nullable = false, length = 80)
  private String province;

  @Column(nullable = false, length = 80)
  private String city;

  @Column(length = 32)
  private String fuel;

  @Column(length = 32)
  private String transmission;

  @Column(length = 64)
  private String color;

  @Column(length = 2000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private VehicleStatus status = VehicleStatus.BORRADOR;

  @Column(nullable = false)
  private long views = 0;

  @Column(nullable = false)
  private long waClicks = 0;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  private Instant updatedAt = Instant.now();

  @PreUpdate
  void onUpdate() { this.updatedAt = Instant.now(); }

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public Tenant getTenant() { return tenant; }
  public void setTenant(Tenant tenant) { this.tenant = tenant; }
  public String getBrand() { return brand; }
  public void setBrand(String brand) { this.brand = brand; }
  public String getModel() { return model; }
  public void setModel(String model) { this.model = model; }
  public String getVersion() { return version; }
  public void setVersion(String version) { this.version = version; }
  public Integer getYear() { return year; }
  public void setYear(Integer year) { this.year = year; }
  public Integer getKm() { return km; }
  public void setKm(Integer km) { this.km = km; }
  public VehicleType getType() { return type; }
  public void setType(VehicleType type) { this.type = type; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }
  public CurrencyCode getCurrency() { return currency; }
  public void setCurrency(CurrencyCode currency) { this.currency = currency; }
  public List<String> getPhotos() { return photos; }
  public void setPhotos(List<String> photos) { this.photos = photos; }
  public String getProvince() { return province; }
  public void setProvince(String province) { this.province = province; }
  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }
  public String getFuel() { return fuel; }
  public void setFuel(String fuel) { this.fuel = fuel; }
  public String getTransmission() { return transmission; }
  public void setTransmission(String transmission) { this.transmission = transmission; }
  public String getColor() { return color; }
  public void setColor(String color) { this.color = color; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public VehicleStatus getStatus() { return status; }
  public void setStatus(VehicleStatus status) { this.status = status; }
  public long getViews() { return views; }
  public void setViews(long views) { this.views = views; }
  public long getWaClicks() { return waClicks; }
  public void setWaClicks(long waClicks) { this.waClicks = waClicks; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
