package github.yagocranchi.pengubook.repository;

import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.entities.Reservation;
import github.yagocranchi.pengubook.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.location = :location " +
           "AND r.startDate < :endDate AND r.endDate > :startDate")
    boolean existsByLocationAndDateRange(@Param("location") Location location,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
    
    List<Reservation> findByUser(User user);

}