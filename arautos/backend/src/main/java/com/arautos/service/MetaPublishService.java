package com.arautos.service;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.SocialPublication;
import com.arautos.domain.Tenant;
import com.arautos.domain.Vehicle;
import com.arautos.domain.enums.PublicationStatus;
import com.arautos.domain.enums.SocialChannel;
import com.arautos.domain.enums.VehicleStatus;
import com.arautos.repo.SocialPublicationRepository;
import com.arautos.repo.TenantRepository;
import com.arautos.repo.VehicleRepository;
import com.arautos.security.TokenCryptoService;
import com.arautos.security.UserPrincipal;
import com.arautos.service.meta.MetaGraphClient;
import com.arautos.web.dto.SocialDtos;
import com.arautos.web.error.ApiException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MetaPublishService {
  private final ArautosProperties properties;
  private final TenantRepository tenants;
  private final VehicleRepository vehicles;
  private final SocialPublicationRepository publications;
  private final TokenCryptoService crypto;
  private final MetaGraphClient graph;
  private final SubscriptionService subscriptions;

  public MetaPublishService(ArautosProperties properties, TenantRepository tenants, VehicleRepository vehicles,
                            SocialPublicationRepository publications, TokenCryptoService crypto,
                            MetaGraphClient graph, SubscriptionService subscriptions) {
    this.properties = properties;
    this.tenants = tenants;
    this.vehicles = vehicles;
    this.publications = publications;
    this.crypto = crypto;
    this.graph = graph;
    this.subscriptions = subscriptions;
  }

  @Transactional(readOnly = true)
  public SocialDtos.PublishPreviewDto preview(UserPrincipal principal, UUID vehicleId) {
    Tenant t = requireTenant(principal);
    Vehicle v = requireVehicle(t, vehicleId);
    String caption = buildCaption(t, v);
    String imageUrl = firstPhoto(v);
    boolean httpsPublic = isPublicHttps(imageUrl);
    boolean fbReady = t.getMetaPageId() != null && t.getMetaPageTokenEnc() != null;
    boolean igReady = t.getMetaInstagramId() != null && t.getMetaPageTokenEnc() != null;
    String warning = null;
    if (!httpsPublic) {
      warning = "La foto debe ser una URL HTTPS pública. Meta no puede descargar imágenes desde localhost.";
    } else if (!fbReady && !igReady) {
      warning = "Conecte Meta (Página / Instagram) antes de publicar.";
    }
    return new SocialDtos.PublishPreviewDto(
        v.getId(),
        v.getBrand() + " " + v.getModel() + " " + v.getYear(),
        caption,
        priceLabel(v),
        v.getCity() + ", " + v.getProvince(),
        publicVehicleUrl(v.getId()),
        imageUrl,
        httpsPublic,
        fbReady,
        igReady,
        warning);
  }

  @Transactional
  public SocialDtos.PublishResponse publish(UserPrincipal principal, SocialDtos.PublishRequest req) {
    if (!properties.getFacebookOAuth().isConfigured()) {
      throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Meta no configurado en el servidor");
    }
    Tenant t = requireTenant(principal);
    if (!subscriptions.canWritePanel(t)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Panel en solo lectura");
    }
    if (req == null || req.vehicleId() == null) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Indique vehicleId");
    }
    if (!req.facebook() && !req.instagram()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Elija Facebook, Instagram o ambos");
    }
    Vehicle v = requireVehicle(t, req.vehicleId());
    if (v.getStatus() != VehicleStatus.PUBLICADO) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Solo se pueden difundir avisos publicados");
    }
    String imageUrl = firstPhoto(v);
    if (!isPublicHttps(imageUrl)) {
      throw new ApiException(HttpStatus.BAD_REQUEST,
          "La foto debe ser HTTPS pública. Meta no descarga desde localhost.");
    }
    if (t.getMetaPageTokenEnc() == null) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Conecte Meta antes de publicar");
    }
    String pageToken = crypto.decrypt(t.getMetaPageTokenEnc());
    String caption = buildCaption(t, v);
    List<SocialDtos.PublicationResultDto> results = new ArrayList<>();

    if (req.facebook()) {
      results.add(publishChannel(t, v, SocialChannel.FACEBOOK, caption, imageUrl, pageToken));
    }
    if (req.instagram()) {
      if (t.getMetaInstagramId() == null) {
        SocialPublication pub = basePublication(t, v, SocialChannel.INSTAGRAM, caption);
        pub.setStatus(PublicationStatus.ERROR);
        pub.setErrorMessage("Esta concesionaria no tiene Instagram profesional vinculado a la Página.");
        publications.save(pub);
        results.add(toDto(pub));
      } else {
        results.add(publishChannel(t, v, SocialChannel.INSTAGRAM, caption, imageUrl, pageToken));
      }
    }
    boolean anyOk = results.stream().anyMatch(r -> "SUCCESS".equals(r.status()));
    return new SocialDtos.PublishResponse(
        results,
        anyOk ? "Publicación enviada a Meta." : "No se pudo publicar. Revise los errores.");
  }

  @Transactional(readOnly = true)
  public List<SocialDtos.PublicationResultDto> history(UserPrincipal principal) {
    Tenant t = requireTenant(principal);
    return publications.findByTenantIdOrderByCreatedAtDesc(t.getId()).stream()
        .map(this::toDto)
        .toList();
  }

  private SocialDtos.PublicationResultDto publishChannel(Tenant t, Vehicle v, SocialChannel channel,
                                                         String caption, String imageUrl, String pageToken) {
    SocialPublication pub = basePublication(t, v, channel, caption);
    try {
      MetaGraphClient.PublishResult result;
      if (channel == SocialChannel.FACEBOOK) {
        result = graph.publishPagePhoto(t.getMetaPageId(), pageToken, imageUrl, caption);
      } else if (channel == SocialChannel.INSTAGRAM) {
        result = graph.publishInstagram(t.getMetaInstagramId(), pageToken, imageUrl, caption);
      } else {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Canal no soportado");
      }
      pub.setStatus(PublicationStatus.SUCCESS);
      pub.setExternalPostId(result.postId());
      pub.setPostUrl(result.postUrl());
    } catch (ApiException e) {
      pub.setStatus(PublicationStatus.ERROR);
      pub.setErrorMessage(e.getMessage());
    } catch (Exception e) {
      pub.setStatus(PublicationStatus.ERROR);
      pub.setErrorMessage(e.getMessage());
    }
    publications.save(pub);
    return toDto(pub);
  }

  private SocialPublication basePublication(Tenant t, Vehicle v, SocialChannel channel, String caption) {
    SocialPublication pub = new SocialPublication();
    pub.setTenantId(t.getId());
    pub.setVehicleId(v.getId());
    pub.setChannel(channel);
    pub.setCaption(caption);
    pub.setStatus(PublicationStatus.PENDING);
    return pub;
  }

  private SocialDtos.PublicationResultDto toDto(SocialPublication pub) {
    return new SocialDtos.PublicationResultDto(
        pub.getChannel().name(),
        pub.getStatus().name(),
        pub.getExternalPostId(),
        pub.getPostUrl(),
        pub.getErrorMessage(),
        pub.getCreatedAt());
  }

  private String buildCaption(Tenant t, Vehicle v) {
    return v.getBrand() + " " + v.getModel()
        + (v.getVersion() != null && !v.getVersion().isBlank() ? " " + v.getVersion() : "")
        + " · " + v.getYear()
        + " · " + priceLabel(v)
        + " · " + v.getCity() + ", " + v.getProvince()
        + " · " + t.getName()
        + "\n" + publicVehicleUrl(v.getId());
  }

  private String priceLabel(Vehicle v) {
    return v.getCurrency().name() + " " + v.getPrice().toPlainString();
  }

  private String firstPhoto(Vehicle v) {
    if (v.getPhotos() == null || v.getPhotos().isEmpty()) {
      return null;
    }
    return v.getPhotos().get(0);
  }

  private boolean isPublicHttps(String url) {
    if (url == null || url.isBlank()) return false;
    String u = url.toLowerCase(Locale.ROOT);
    if (!u.startsWith("https://")) return false;
    return !u.contains("localhost") && !u.contains("127.0.0.1");
  }

  private String publicVehicleUrl(UUID vehicleId) {
    String base = properties.getPublicBaseUrl();
    if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
    return base + "/aviso/" + vehicleId;
  }

  private Tenant requireTenant(UserPrincipal principal) {
    if (principal.getTenantId() == null) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Sin concesionaria asociada");
    }
    return tenants.findById(principal.getTenantId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Concesionaria no encontrada"));
  }

  private Vehicle requireVehicle(Tenant t, UUID vehicleId) {
    Vehicle v = vehicles.findById(vehicleId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aviso no encontrado"));
    if (v.getTenant() == null || !v.getTenant().getId().equals(t.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "El aviso no pertenece a su concesionaria");
    }
    return v;
  }
}
