package com.arautos.web.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class SocialDtos {
  private SocialDtos() {}

  public record ProviderStatus(String id, boolean enabled, boolean configured, String note) {}

  public record ProvidersResponse(List<ProviderStatus> providers) {}

  public record AuthorizeUrlDto(String authorizeUrl, String message) {}

  public record MetaStatusDto(
      boolean configured,
      boolean facebookConnected,
      boolean instagramConnected,
      String pageId,
      String pageName,
      String instagramUsername,
      Instant connectedAt,
      boolean pendingPageSelection,
      String message) {}

  public record MetaPageOption(String id, String name, boolean hasInstagram, String instagramUsername) {}

  public record MetaPagesResponse(List<MetaPageOption> pages, String message) {}

  public record SelectPageRequest(String pageId) {}

  public record PublishRequest(UUID vehicleId, boolean facebook, boolean instagram) {}

  public record PublishPreviewDto(
      UUID vehicleId,
      String title,
      String caption,
      String priceLabel,
      String location,
      String publicUrl,
      String imageUrl,
      boolean imagePublicHttps,
      boolean facebookReady,
      boolean instagramReady,
      String warning) {}

  public record PublicationResultDto(
      String channel,
      String status,
      String postId,
      String postUrl,
      String errorMessage,
      Instant createdAt) {}

  public record PublishResponse(
      List<PublicationResultDto> results,
      String message) {}
}
