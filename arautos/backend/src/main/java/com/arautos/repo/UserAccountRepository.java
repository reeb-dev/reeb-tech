package com.arautos.repo;

import com.arautos.domain.UserAccount;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {
  Optional<UserAccount> findByEmailIgnoreCase(String email);
  boolean existsByEmailIgnoreCase(String email);
  List<UserAccount> findByTenant_IdOrderByCreatedAtAsc(UUID tenantId);
  Optional<UserAccount> findByIdAndTenant_Id(UUID id, UUID tenantId);
}
