package com.arautos.web;

import com.arautos.security.UserPrincipal;
import com.arautos.service.RankingService;
import com.arautos.web.dto.RankingDtos;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/panel")
public class PanelRankingController {
  private final RankingService ranking;

  public PanelRankingController(RankingService ranking) {
    this.ranking = ranking;
  }

  @GetMapping("/ranking")
  public RankingDtos.RankingResponse ranking(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestParam(value = "province", required = false) String province) {
    return ranking.rankingForPanel(principal, province);
  }
}
