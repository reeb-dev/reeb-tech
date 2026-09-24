package com.arautos.web;

import com.arautos.security.UserPrincipal;
import com.arautos.service.MercadoPagoBillingService;
import com.arautos.web.dto.BillingDtos;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/panel/billing")
public class PanelBillingController {
  private final MercadoPagoBillingService billing;

  public PanelBillingController(MercadoPagoBillingService billing) {
    this.billing = billing;
  }

  @GetMapping("/status")
  public BillingDtos.BillingStatusDto status(@AuthenticationPrincipal UserPrincipal principal) {
    return billing.status(principal);
  }

  @PostMapping("/checkout")
  public BillingDtos.CheckoutResponse checkout(@AuthenticationPrincipal UserPrincipal principal) {
    return billing.createCheckout(principal);
  }
}
