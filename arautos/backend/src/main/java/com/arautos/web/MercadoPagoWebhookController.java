package com.arautos.web;

import com.arautos.service.MercadoPagoBillingService;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/mp")
public class MercadoPagoWebhookController {
  private final MercadoPagoBillingService billing;

  public MercadoPagoWebhookController(MercadoPagoBillingService billing) {
    this.billing = billing;
  }

  @PostMapping("/webhook")
  public Map<String, String> webhook(
      @RequestBody(required = false) Map<String, Object> payload,
      @RequestParam(value = "topic", required = false) String topic,
      @RequestParam(value = "type", required = false) String type,
      @RequestParam(value = "id", required = false) String id,
      @RequestParam(value = "data.id", required = false) String dataId) {
    String effectiveTopic = topic != null ? topic : type;
    String effectiveId = id != null ? id : dataId;
    billing.handleWebhook(payload == null ? Map.of() : payload, effectiveTopic, effectiveId);
    return Map.of("status", "ok");
  }
}
