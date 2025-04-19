package github.yagocranchi.pengubook.service;

import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.entities.LocationAvailability;
import github.yagocranchi.pengubook.entities.Reservation;
import github.yagocranchi.pengubook.repository.LocationAvailabilityRepository;
import github.yagocranchi.pengubook.repository.ReservationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AvailabilityService {

    private final LocationAvailabilityRepository availabilityRepository;
    private final LocationAvailabilityRepository locationAvailabilityRepository;
    private final ReservationRepository reservationRepository;

    public AvailabilityService(
        LocationAvailabilityRepository availabilityRepository,
        LocationAvailabilityRepository locationAvailabilityRepository,
        ReservationRepository reservationRepository) {

        this.availabilityRepository = availabilityRepository;
        this.locationAvailabilityRepository = locationAvailabilityRepository;
        this.reservationRepository = reservationRepository;
    }

    public boolean isLocationAvailable(Location location, LocalDateTime start, LocalDateTime end) {
        List<LocationAvailability> conflicts = availabilityRepository
            .findConflictingBlocks(location, start, end);

        return conflicts.isEmpty();
    }

    public boolean isLocationAvailableExcludingReservation(Location location, LocalDateTime start, LocalDateTime end, UUID reservationId) {
        List<LocationAvailability> conflicts = availabilityRepository
            .findConflictingBlocks(location, start, end);
        
        conflicts.removeIf(block -> 
            reservationId != null && 
            reservationId.equals(block.getReservationId()));
        
        return conflicts.isEmpty();
    }

    @Transactional
    public void blockLocationForReservation(Reservation reservation) {
        LocationAvailability block = new LocationAvailability();
        block.setLocation(reservation.getLocation());
        block.setStartDate(reservation.getStartDate());
        block.setEndDate(reservation.getEndDate());
        block.setReason("RESERVATION");

        if (reservation.getReservationId() != null) {
            block.setReservationId(reservation.getReservationId());
        }

        availabilityRepository.save(block);
    }

    @Transactional
    public void createManualBlock(Location location, LocalDateTime start,
        LocalDateTime end, String reason) {
        LocationAvailability block = new LocationAvailability();
        block.setLocation(location);
        block.setStartDate(start);
        block.setEndDate(end);
        block.setReason(reason);

        availabilityRepository.save(block);
    }

    @Transactional
    public boolean removeBlock(UUID blockId) {
        Optional<LocationAvailability> blockOpt = locationAvailabilityRepository.findById(blockId);

        if (blockOpt.isEmpty()) {
            return false;
        }

        LocationAvailability block = blockOpt.get();
        if (block.getReservationId() != null) {
            reservationRepository.deleteById(block.getReservationId());
        }

        locationAvailabilityRepository.delete(block);
        return true;
    }

    public List<LocationAvailability> getBlocksByLocation(UUID locationId, String reason,
        LocalDateTime startDate, LocalDateTime endDate) {
        return availabilityRepository.findByLocationWithFilters(locationId, reason, startDate, endDate);
    }

    public LocationAvailability getBlockByReservationId(UUID reservationId) {
        if (reservationId == null) {
            return null;
        }
        
        return availabilityRepository.findByReservationId(reservationId);
    }

    @Transactional
    public void removeReservationBlockByReservationId(Reservation reservation) {
        LocationAvailability block = getBlockByReservationId(reservation.getReservationId());
        if (block != null) {
            locationAvailabilityRepository.delete(block);
        }
    }

    @Transactional
    public void updateReservationBlock(Reservation reservation) {
        LocationAvailability oldBlock = getBlockByReservationId(reservation.getReservationId());
        if (oldBlock != null) {
            locationAvailabilityRepository.delete(oldBlock);
        }
        
        blockLocationForReservation(reservation);
    }
}
