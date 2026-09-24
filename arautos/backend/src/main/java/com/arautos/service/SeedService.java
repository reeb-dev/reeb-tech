package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.Tenant;
import com.arautos.domain.UserAccount;
import com.arautos.domain.Vehicle;
import com.arautos.domain.enums.CurrencyCode;
import com.arautos.domain.enums.ModerationStatus;
import com.arautos.domain.enums.SubscriptionStatus;
import com.arautos.domain.enums.UserRole;
import com.arautos.domain.enums.VehicleStatus;
import com.arautos.domain.enums.VehicleType;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.UserAccountRepository;
import com.arautos.repo.VehicleRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SeedService implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(SeedService.class);

  private final ArautosProperties properties;
  private final TenantRepository tenants;
  private final UserAccountRepository users;
  private final VehicleRepository vehicles;
  private final PasswordEncoder passwordEncoder;

  public SeedService(ArautosProperties properties, TenantRepository tenants, UserAccountRepository users,
                     VehicleRepository vehicles, PasswordEncoder passwordEncoder) {
    this.properties = properties;
    this.tenants = tenants;
    this.users = users;
    this.vehicles = vehicles;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (!properties.isSeed()) {
      return;
    }
    if (users.existsByEmailIgnoreCase("admin@arautos.local")) {
      log.info("Seed ya aplicado, se omite");
      return;
    }

    UserAccount admin = new UserAccount();
    admin.setEmail("admin@arautos.local");
    admin.setPasswordHash(passwordEncoder.encode("admin123"));
    admin.setRole(UserRole.PLATFORM_ADMIN);
    users.save(admin);

    Tenant t1 = createTenant(
        "Patagonia Motors",
        "patagonia-motors",
        "Río Negro",
        "San Carlos de Bariloche",
        "Av. Bustillo 5100",
        "5492944123456",
        "contacto@patagoniamotors.example",
        "Multimarca en Bariloche. 0km y usados seleccionados. Permuta y financiación.",
        "/assets/dealers/patagonia-motors.svg",
        "#0B3D4A",
        "#F59E0B");
    UserAccount u1 = createUser(t1, "demo1@patagonia-motors.example", "demo123");

    Tenant t2 = createTenant(
        "Centro Automotores",
        "centro-automotores",
        "Buenos Aires",
        "La Plata",
        "Calle 7 1234",
        "5492214567890",
        "ventas@centroautomotores.example",
        "Concesionaria familiar en La Plata. Financiación y permuta.",
        "/assets/dealers/centro-automotores.svg",
        "#1E3A5F",
        "#2563EB");
    UserAccount u2 = createUser(t2, "demo2@centro-automotores.example", "demo123");

    vehicles.save(vehicle(t1, "Toyota", "Corolla", "XEi 2.0 CVT", 2024, 0, VehicleType.CERO_KM,
        new BigDecimal("32000"), CurrencyCode.USD, "nafta", "cvt", "Blanco Perlado",
        "/assets/cars/toyota-corolla.jpg"));
    vehicles.save(vehicle(t1, "Jeep", "Compass", "Limited 1.3T", 2022, 42000, VehicleType.USADO,
        new BigDecimal("41000"), CurrencyCode.USD, "nafta", "automatica", "Gris",
        "/assets/cars/jeep-compass.jpg"));
    vehicles.save(vehicle(t1, "Ford", "Ranger", "XLT 3.2 4x4", 2021, 72000, VehicleType.USADO,
        new BigDecimal("38500000"), CurrencyCode.ARS, "diesel", "manual", "Blanco",
        "/assets/cars/ford-ranger.jpg"));

    vehicles.save(vehicle(t2, "Fiat", "Cronos", "Precision 1.3", 2023, 18000, VehicleType.USADO,
        new BigDecimal("18500"), CurrencyCode.USD, "nafta", "cvt", "Rojo",
        "/assets/cars/fiat-cronos.jpg"));
    vehicles.save(vehicle(t2, "Chevrolet", "Tracker", "Premier 1.2T", 2024, 0, VehicleType.CERO_KM,
        new BigDecimal("29500"), CurrencyCode.USD, "nafta", "automatica", "Negro",
        "/assets/cars/chevrolet-tracker.jpg"));
    vehicles.save(vehicle(t2, "Peugeot", "208", "Active Pack 1.6", 2020, 55000, VehicleType.USADO,
        new BigDecimal("16200000"), CurrencyCode.ARS, "nafta", "manual", "Gris Plata",
        "/assets/cars/peugeot-208.jpg"));

    log.info("Seed OK: admin@arautos.local / admin123 | {} / demo123 | {} / demo123",
        u1.getEmail(), u2.getEmail());
  }

  private Tenant createTenant(String name, String slug, String province, String city, String address,
                              String wa, String email, String desc, String logoUrl,
                              String primaryColor, String accentColor) {
    Tenant t = new Tenant();
    t.setName(name);
    t.setSlug(slug);
    t.setProvince(province);
    t.setCity(city);
    t.setAddress(address);
    t.setWhatsapp(wa);
    t.setEmail(email);
    t.setDescription(desc);
    t.setLogoUrl(logoUrl);
    t.setPrimaryColor(primaryColor);
    t.setAccentColor(accentColor);
    t.setModerationStatus(ModerationStatus.ACTIVA);
    t.setSubscriptionStatus(SubscriptionStatus.TRIAL);
    t.setTrialEndsAt(Instant.now().plus(properties.getTrialDays(), ChronoUnit.DAYS));
    t.setPlanId(properties.getPlan().getId());
    return tenants.save(t);
  }

  private UserAccount createUser(Tenant tenant, String email, String password) {
    UserAccount u = new UserAccount();
    u.setTenant(tenant);
    u.setEmail(email);
    u.setPasswordHash(passwordEncoder.encode(password));
    u.setRole(UserRole.TENANT_ADMIN);
    return users.save(u);
  }

  private Vehicle vehicle(Tenant tenant, String brand, String model, String version, int year, int km,
                          VehicleType type, BigDecimal price, CurrencyCode currency,
                          String fuel, String transmission, String color, String photo) {
    Vehicle v = new Vehicle();
    v.setTenant(tenant);
    v.setBrand(brand);
    v.setModel(model);
    v.setVersion(version);
    v.setYear(year);
    v.setKm(km);
    v.setType(type);
    v.setPrice(price);
    v.setCurrency(currency);
    v.setProvince(tenant.getProvince());
    v.setCity(tenant.getCity());
    v.setFuel(fuel);
    v.setTransmission(transmission);
    v.setColor(color);
    v.setDescription(brand + " " + model + " " + version + ". Consultá por WhatsApp.");
    v.setStatus(VehicleStatus.PUBLICADO);
    v.setPhotos(List.of(photo));
    return v;
  }
}
