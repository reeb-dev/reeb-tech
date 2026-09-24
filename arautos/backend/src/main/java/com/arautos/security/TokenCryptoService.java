package com.arautos.security;

import com.arautos.config.ArautosProperties;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

/** Cifrado AES-GCM para tokens Meta por tenant. Clave derivada del JWT secret. */
@Service
public class TokenCryptoService {
  private static final int GCM_IV_LENGTH = 12;
  private static final int GCM_TAG_LENGTH = 128;

  private final SecretKeySpec key;
  private final SecureRandom random = new SecureRandom();

  public TokenCryptoService(ArautosProperties properties) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(properties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
      this.key = new SecretKeySpec(hash, "AES");
    } catch (Exception e) {
      throw new IllegalStateException("No se pudo inicializar cifrado de tokens", e);
    }
  }

  public String encrypt(String plain) {
    if (plain == null || plain.isBlank()) {
      return null;
    }
    try {
      byte[] iv = new byte[GCM_IV_LENGTH];
      random.nextBytes(iv);
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
      byte[] encrypted = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));
      ByteBuffer buffer = ByteBuffer.allocate(iv.length + encrypted.length);
      buffer.put(iv);
      buffer.put(encrypted);
      return Base64.getEncoder().encodeToString(buffer.array());
    } catch (Exception e) {
      throw new IllegalStateException("Error al cifrar token", e);
    }
  }

  public String decrypt(String encoded) {
    if (encoded == null || encoded.isBlank()) {
      return null;
    }
    try {
      byte[] raw = Base64.getDecoder().decode(encoded);
      ByteBuffer buffer = ByteBuffer.wrap(raw);
      byte[] iv = new byte[GCM_IV_LENGTH];
      buffer.get(iv);
      byte[] encrypted = new byte[buffer.remaining()];
      buffer.get(encrypted);
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
      return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
    } catch (Exception e) {
      throw new IllegalStateException("Error al descifrar token", e);
    }
  }
}
