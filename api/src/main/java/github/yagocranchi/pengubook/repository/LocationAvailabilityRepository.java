package github.yagocranchi.pengubook.repository;

import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.entities.LocationAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface LocationAvailabilityRepository extends JpaRepository<LocationAvailability, UUID> {
    
    List<LocationAvailability> findByLocation(Location location);
    
    @Query("SELECT la FROM LocationAvailability la WHERE la.location = :location " +
           "AND ((la.startDate <= :endDate AND la.endDate >= :startDate))")
    List<LocationAvailability> findConflictingBlocks(
            @Param("location") Location location,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT la FROM LocationAvailability la WHERE la.location.id = :locationId ORDER BY la.startDate ASC")
    List<LocationAvailability> findByLocation_IdOrderByStartDateAsc(@Param("locationId") UUID locationId);

    @Query("SELECT la FROM LocationAvailability la WHERE la.location.id = :locationId " +
        "AND (:reason IS NULL OR la.reason = :reason) " +
        "AND (:startDate IS NULL OR la.endDate >= :startDate) " +
        "AND (:endDate IS NULL OR la.startDate <= :endDate) " +
        "ORDER BY la.startDate ASC")
    List<LocationAvailability> findByLocationWithFilters(
        @Param("locationId") UUID locationId,
        @Param("reason") String reason,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);
    
    boolean existsByLocationAndReservationId(Location location, UUID reservationId);

    LocationAvailability findByReservationId(UUID reservationId);
}