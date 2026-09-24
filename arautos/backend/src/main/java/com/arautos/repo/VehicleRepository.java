package com.arautos.repo;

import com.arautos.domain.Vehicle;
import com.arautos.domain.enums.VehicleStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {
  List<Vehicle> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);
  Optional<Vehicle> findByIdAndTenantId(UUID id, UUID tenantId);
  long countByTenantIdAndStatus(UUID tenantId, VehicleStatus status);

  @Query("select coalesce(sum(v.views),0) from Vehicle v where v.tenant.id = :tenantId")
  long sumViewsByTenant(@Param("tenantId") UUID tenantId);

  @Query("select coalesce(sum(v.waClicks),0) from Vehicle v where v.tenant.id = :tenantId")
  long sumWaClicksByTenant(@Param("tenantId") UUID tenantId);

  @Modifying
  @Query("update Vehicle v set v.views = v.views + 1 where v.id = :id")
  int incrementViews(@Param("id") UUID id);

  @Modifying
  @Query("update Vehicle v set v.waClicks = v.waClicks + 1 where v.id = :id")
  int incrementWaClicks(@Param("id") UUID id);
}
