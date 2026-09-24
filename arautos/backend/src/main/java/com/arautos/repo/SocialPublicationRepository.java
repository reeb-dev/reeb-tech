package com.arautos.repo;

import com.arautos.domain.SocialPublication;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialPublicationRepository extends JpaRepository<SocialPublication, UUID> {
  List<SocialPublication> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);
}
