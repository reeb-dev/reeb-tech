package com.arautos.web;

import com.arautos.security.UserPrincipal;
import com.arautos.service.MetaConnectService;
import com.arautos.service.MetaPublishService;
import com.arautos.web.dto.SocialDtos;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/panel/social")
public class PanelSocialController {
  private final MetaConnectService connect;
  private final MetaPublishService publish;

  public PanelSocialController(MetaConnectService connect, MetaPublishService publish) {
    this.connect = connect;
    this.publish = publish;
  }

  @GetMapping("/meta/status")
  public SocialDtos.MetaStatusDto status(@AuthenticationPrincipal UserPrincipal principal) {
    return connect.status(principal);
  }

  @GetMapping("/meta/start")
  public SocialDtos.AuthorizeUrlDto start(@AuthenticationPrincipal UserPrincipal principal) {
    return new SocialDtos.AuthorizeUrlDto(
        connect.startUrl(principal),
        "Será redirigido a Meta para autorizar la Página e Instagram de su concesionaria.");
  }

  @GetMapping("/meta/callback")
  public void callback(
      @RequestParam(required = false) String code,
      @RequestParam(required = false) String state,
      @RequestParam(required = false) String error,
      HttpServletResponse response) throws IOException {
    response.sendRedirect(connect.handleCallback(code, state, error));
  }

  @GetMapping("/meta/pages")
  public SocialDtos.MetaPagesResponse pages(@AuthenticationPrincipal UserPrincipal principal) {
    return connect.listPendingPages(principal);
  }

  @PostMapping("/meta/select-page")
  public SocialDtos.MetaStatusDto selectPage(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestBody SocialDtos.SelectPageRequest body) {
    return connect.selectPage(principal, body);
  }

  @DeleteMapping("/meta")
  public SocialDtos.MetaStatusDto disconnect(@AuthenticationPrincipal UserPrincipal principal) {
    return connect.disconnect(principal);
  }

  @GetMapping("/publish/preview")
  public SocialDtos.PublishPreviewDto preview(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestParam UUID vehicleId) {
    return publish.preview(principal, vehicleId);
  }

  @PostMapping("/publish")
  public SocialDtos.PublishResponse publish(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestBody SocialDtos.PublishRequest body) {
    return publish.publish(principal, body);
  }

  @GetMapping("/publications")
  public List<SocialDtos.PublicationResultDto> publications(
      @AuthenticationPrincipal UserPrincipal principal) {
    return publish.history(principal);
  }
}
