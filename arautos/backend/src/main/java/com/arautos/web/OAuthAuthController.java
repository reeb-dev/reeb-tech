package com.arautos.web;

import com.arautos.service.FacebookLoginService;
import com.arautos.service.GoogleLoginService;
import com.arautos.web.dto.SocialDtos;
import com.arautos.web.error.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
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
  private final GoogleLoginService googleLogin;

  public OAuthAuthController(FacebookLoginService facebookLogin, GoogleLoginService googleLogin) {
    this.facebookLogin = facebookLogin;
    this.googleLogin = googleLogin;
  }

  @GetMapping("/providers")
  public SocialDtos.ProvidersResponse providers() {
    return new SocialDtos.ProvidersResponse(List.of(
        googleLogin.providerStatus(),
        facebookLogin.providerStatus()));
  }

  @GetMapping("/{provider}/start")
  public void start(@PathVariable String provider, HttpServletResponse response) throws IOException {
    if ("google".equalsIgnoreCase(provider)) {
      response.sendRedirect(googleLogin.startUrl());
      return;
    }
    if ("facebook".equalsIgnoreCase(provider)) {
      response.sendRedirect(facebookLogin.startUrl());
      return;
    }
    throw new ApiException(HttpStatus.NOT_FOUND, "Proveedor no soportado: " + provider);
  }

  @GetMapping("/google/callback")
  public void googleCallback(
      @RequestParam(required = false) String code,
      @RequestParam(required = false) String state,
      @RequestParam(required = false) String error,
      HttpServletResponse response) throws IOException {
    response.sendRedirect(googleLogin.handleCallback(code, state, error));
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
