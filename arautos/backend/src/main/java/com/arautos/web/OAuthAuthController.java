package com.arautos.web;

import com.arautos.service.FacebookLoginService;
import com.arautos.web.dto.SocialDtos;
import com.arautos.web.error.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/oauth")
public class OAuthAuthController {
  private final FacebookLoginService facebookLogin;

  public OAuthAuthController(FacebookLoginService facebookLogin) {
    this.facebookLogin = facebookLogin;
  }

  @GetMapping("/providers")
  public SocialDtos.ProvidersResponse providers() {
    return facebookLogin.providers();
  }

  @GetMapping("/{provider}/start")
  public void start(@PathVariable String provider, HttpServletResponse response) throws IOException {
    if (!"facebook".equalsIgnoreCase(provider)) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Proveedor no soportado: " + provider);
    }
    response.sendRedirect(facebookLogin.startUrl());
  }

  @GetMapping("/facebook/callback")
  public void facebookCallback(
      @RequestParam(required = false) String code,
      @RequestParam(required = false) String state,
      @RequestParam(required = false) String error,
      HttpServletResponse response) throws IOException {
    response.sendRedirect(facebookLogin.handleCallback(code, state, error));
  }
}
