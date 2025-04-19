package github.yagocranchi.pengubook.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "location_id")
    private UUID locationId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal hourlyRate;

    @Column(nullable = false)
    private Integer minimumTime;

    @Column(nullable = false)
    private Integer maximumTime;

    @Column(nullable = false, updatable = false)
    private LocalDateTime creationDate = LocalDateTime.now();

    public UUID getLocationId() {
        return locationId;
    }

    public void setLocationId(UUID locationId) {
        this.locationId = locationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public Integer getMinimumTime() {
        return minimumTime;
    }

    public void setMinimumTime(Integer minimumTime) {
        this.minimumTime = minimumTime;
    }

    public Integer getMaximumTime() {
        return maximumTime;
    }

    public void setMaximumTime(Integer maximumTime) {
        this.maximumTime = maximumTime;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }
}
