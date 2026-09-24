package com.arautos.web.dto;

import java.util.List;
import java.util.UUID;

public final class RankingDtos {
  private RankingDtos() {}

  public record RankingEntry(
      int rank,
      UUID tenantId,
      String name,
      String slug,
      String province,
      long waClicks,
      boolean self) {}

  public record RankingResponse(
      String province,
      List<RankingEntry> entries,
      String criterion) {}
}
