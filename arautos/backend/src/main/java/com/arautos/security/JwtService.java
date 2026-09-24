package com.arautos.security;

import com.arautos.config.ArautosProperties;
import com.arautos.domain.enums.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final ArautosProperties properties;
  private final SecretKey key;

  public JwtService(ArautosProperties properties) {
    this.properties = properties;
    byte[] bytes = properties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
    this.key = Keys.hmacShaKeyFor(bytes);
  }

  public String issue(UUID userId, UUID tenantId, String email, UserRole role) {
    long now = System.currentTimeMillis();
    var builder = Jwts.builder()
        .subject(userId.toString())
        .claim("email", email)
        .claim("role", role.name())
        .issuedAt(new Date(now))
        .expiration(new Date(now + properties.getJwt().getExpirationMs()))
        .signWith(key);
    if (tenantId != null) {
      builder.claim("tenantId", tenantId.toString());
    }
    return builder.compact();
  }

  public Claims parse(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }
}
