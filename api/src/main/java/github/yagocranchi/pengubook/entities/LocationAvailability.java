package github.yagocranchi.pengubook.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "location_availability")
public class LocationAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID blockId;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(nullable = false)
    private String reason;
    
    @Column(nullable = true)
    private UUID reservationId;

    public UUID getBlockId() {
        return blockId;
    }

    public void setBlockId(UUID blockId) {
        this.blockId = blockId;
    }
    
    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public UUID getReservationId() {
        return reservationId;
    }

    public void setReservationId(UUID reservationId) {
        this.reservationId = reservationId;
    }
}