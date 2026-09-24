package com.arautos.service.meta;

import com.arautos.config.ArautosProperties;
import com.arautos.web.error.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class MetaGraphClient {
  private final ArautosProperties properties;
  private final RestClient rest;
  private final ObjectMapper mapper;

  public MetaGraphClient(ArautosProperties properties, ObjectMapper mapper) {
    this.properties = properties;
    this.mapper = mapper;
    this.rest = RestClient.create();
  }

  public String graphBase() {
    return "https://graph.facebook.com/" + properties.getFacebookOAuth().getGraphVersion();
  }

  public String exchangeCode(String code, String redirectUri) {
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    String url = graphBase() + "/oauth/access_token"
        + "?client_id=" + enc(fb.getClientId())
        + "&client_secret=" + enc(fb.getClientSecret())
        + "&redirect_uri=" + enc(redirectUri)
        + "&code=" + enc(code);
    JsonNode json = get(url);
    String token = text(json, "access_token");
    if (token == null) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Meta no devolvió access_token");
    }
    return token;
  }

  public String exchangeLongLivedUserToken(String shortToken) {
    ArautosProperties.FacebookOAuth fb = properties.getFacebookOAuth();
    String url = graphBase() + "/oauth/access_token"
        + "?grant_type=fb_exchange_token"
        + "&client_id=" + enc(fb.getClientId())
        + "&client_secret=" + enc(fb.getClientSecret())
        + "&fb_exchange_token=" + enc(shortToken);
    JsonNode json = get(url);
    String token = text(json, "access_token");
    return token != null ? token : shortToken;
  }

  public JsonNode me(String userToken) {
    return get(graphBase() + "/me?fields=id,name,email&access_token=" + enc(userToken));
  }

  public List<MetaPage> listPages(String userToken) {
    JsonNode json = get(graphBase() + "/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}"
        + "&access_token=" + enc(userToken));
    List<MetaPage> pages = new ArrayList<>();
    JsonNode data = json.path("data");
    if (data.isArray()) {
      for (JsonNode n : data) {
        String igId = null;
        String igUser = null;
        JsonNode ig = n.path("instagram_business_account");
        if (!ig.isMissingNode() && !ig.isNull()) {
          igId = text(ig, "id");
          igUser = text(ig, "username");
        }
        pages.add(new MetaPage(
            text(n, "id"),
            text(n, "name"),
            text(n, "access_token"),
            igId,
            igUser));
      }
    }
    return pages;
  }

  public PublishResult publishPagePhoto(String pageId, String pageToken, String imageUrl, String caption) {
    String url = graphBase() + "/" + pageId + "/photos";
    JsonNode json = postForm(url, Map.of(
        "url", imageUrl,
        "caption", caption == null ? "" : caption,
        "access_token", pageToken));
    String postId = text(json, "post_id");
    if (postId == null) {
      postId = text(json, "id");
    }
    String link = postId != null ? "https://www.facebook.com/" + postId : null;
    return new PublishResult(postId, link);
  }

  public PublishResult publishInstagram(String igUserId, String pageToken, String imageUrl, String caption) {
    String createUrl = graphBase() + "/" + igUserId + "/media";
    JsonNode container = postForm(createUrl, Map.of(
        "image_url", imageUrl,
        "caption", caption == null ? "" : caption,
        "access_token", pageToken));
    String creationId = text(container, "id");
    if (creationId == null) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Instagram no creó el contenedor multimedia");
    }
    String publishUrl = graphBase() + "/" + igUserId + "/media_publish";
    JsonNode published = postForm(publishUrl, Map.of(
        "creation_id", creationId,
        "access_token", pageToken));
    String mediaId = text(published, "id");
    return new PublishResult(mediaId, mediaId != null ? "https://www.instagram.com/" : null);
  }

  private JsonNode get(String url) {
    try {
      String body = rest.get().uri(URI.create(url)).retrieve().body(String.class);
      return mapper.readTree(body == null ? "{}" : body);
    } catch (RestClientResponseException e) {
      throw metaError(e);
    } catch (ApiException e) {
      throw e;
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Error al llamar a Meta Graph: " + e.getMessage());
    }
  }

  private JsonNode postForm(String url, Map<String, String> form) {
    try {
      StringBuilder sb = new StringBuilder();
      form.forEach((k, v) -> {
        if (!sb.isEmpty()) sb.append('&');
        sb.append(enc(k)).append('=').append(enc(v == null ? "" : v));
      });
      String body = rest.post()
          .uri(URI.create(url))
          .contentType(MediaType.APPLICATION_FORM_URLENCODED)
          .body(sb.toString())
          .retrieve()
          .body(String.class);
      return mapper.readTree(body == null ? "{}" : body);
    } catch (RestClientResponseException e) {
      throw metaError(e);
    } catch (ApiException e) {
      throw e;
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Error al publicar en Meta: " + e.getMessage());
    }
  }

  private ApiException metaError(RestClientResponseException e) {
    String detail = e.getResponseBodyAsString();
    try {
      JsonNode err = mapper.readTree(detail == null ? "{}" : detail).path("error");
      String msg = text(err, "message");
      if (msg != null) {
        return new ApiException(HttpStatus.BAD_GATEWAY, "Meta: " + msg);
      }
    } catch (Exception ignored) {
      // fall through
    }
    return new ApiException(HttpStatus.BAD_GATEWAY, "Meta respondió " + e.getStatusCode().value());
  }

  private static String text(JsonNode n, String field) {
    JsonNode v = n.path(field);
    if (v.isMissingNode() || v.isNull()) return null;
    String s = v.asText();
    return s == null || s.isBlank() ? null : s;
  }

  private static String enc(String v) {
    return URLEncoder.encode(v, StandardCharsets.UTF_8);
  }

  public record MetaPage(String id, String name, String accessToken, String instagramId, String instagramUsername) {}

  public record PublishResult(String postId, String postUrl) {}
}
