package github.yagocranchi.pengubook.controller;

import github.yagocranchi.pengubook.entities.User;
import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.entities.Reservation;
import github.yagocranchi.pengubook.controller.dto.CreateReservationDto;
import github.yagocranchi.pengubook.controller.dto.ReservationDateDto;
import github.yagocranchi.pengubook.repository.UserRepository;
import github.yagocranchi.pengubook.repository.LocationRepository;
import github.yagocranchi.pengubook.repository.ReservationRepository;
import github.yagocranchi.pengubook.utils.ValidationError;
import github.yagocranchi.pengubook.service.AvailabilityService;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final AvailabilityService availabilityService;

    public ReservationController(ReservationRepository reservationRepository,
        UserRepository userRepository,
        LocationRepository locationRepository,
        AvailabilityService availabilityService) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.availabilityService = availabilityService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Reservation>> getMyReservations(JwtAuthenticationToken token) {
        UUID userId = UUID.fromString(token.getName());

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Reservation> reservations = reservationRepository.findByUser(userOpt.get());

        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> allReservations = reservationRepository.findAll();
        return ResponseEntity.ok(allReservations);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> createReservation(@RequestBody CreateReservationDto dto) {
        List<ValidationError> errors = new ArrayList<>();

        Optional<User> userOpt = userRepository.findById(dto.userId());
        if (userOpt.isEmpty()) {
            errors.add(new ValidationError(0, "User not found."));
        }

        Optional<Location> locationOpt = locationRepository.findById(dto.locationId());
        if (locationOpt.isEmpty()) {
            errors.add(new ValidationError(1, "Location not found."));
        }

        if (dto.startDate().isAfter(dto.endDate())) {
            errors.add(new ValidationError(2, "Start date must be before end date."));
        }

        if (locationOpt.isPresent()) {
            Location location = locationOpt.get();
            if (!availabilityService.isLocationAvailable(location, dto.startDate(), dto.endDate())) {
                errors.add(new ValidationError(3, "Location is not available for the selected dates."));
            }
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Location location = locationOpt.get();
        Reservation reservation = new Reservation();
        reservation.setUser(userOpt.get());
        reservation.setLocation(location);
        reservation.setStartDate(dto.startDate());
        reservation.setEndDate(dto.endDate());

        BigDecimal finalValue = calculateFinalValue(location, dto.startDate(), dto.endDate());
        reservation.setFinalValue(finalValue);
        reservation.setStatus(dto.status());

        reservationRepository.save(reservation);

        availabilityService.blockLocationForReservation(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @PostMapping("/{locationId}")
    @Transactional
    public ResponseEntity<?> createUserReservation(
        @PathVariable UUID locationId,
        @RequestBody ReservationDateDto dto,
        JwtAuthenticationToken token) {

        List<ValidationError> errors = new ArrayList<>();

        UUID userId = UUID.fromString(token.getName());

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Location> locationOpt = locationRepository.findById(locationId);
        if (locationOpt.isEmpty()) {
            errors.add(new ValidationError(1, "Location not found."));
            return ResponseEntity.badRequest().body(errors);
        }

        if (dto.startDate().isAfter(dto.endDate())) {
            errors.add(new ValidationError(2, "Start date must be before end date."));
        }

        Location location = locationOpt.get();
        if (!availabilityService.isLocationAvailable(location, dto.startDate(), dto.endDate())) {
            errors.add(new ValidationError(3, "Location is not available for the selected dates."));
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Reservation reservation = new Reservation();
        reservation.setUser(userOpt.get());
        reservation.setLocation(location);
        reservation.setStartDate(dto.startDate());
        reservation.setEndDate(dto.endDate());

        BigDecimal finalValue = calculateFinalValue(location, dto.startDate(), dto.endDate());
        reservation.setFinalValue(finalValue);
        reservation.setStatus("PENDING");

        reservationRepository.save(reservation);

        availabilityService.blockLocationForReservation(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    private BigDecimal calculateFinalValue(Location location, LocalDateTime startDate, LocalDateTime endDate) {
        long hours = Duration.between(startDate, endDate).toHours();
        return location.getHourlyRate().multiply(BigDecimal.valueOf(hours));
    }

    @PutMapping("/{reservationId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> updateReservation(
        @PathVariable UUID reservationId,
        @RequestBody CreateReservationDto dto) {

        List<ValidationError> errors = new ArrayList<>();

        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Reservation reservation = reservationOpt.get();

        Optional<User> userOpt = userRepository.findById(dto.userId());
        if (userOpt.isEmpty()) {
            errors.add(new ValidationError(0, "User not found."));
        }

        Optional<Location> locationOpt = locationRepository.findById(dto.locationId());
        if (locationOpt.isEmpty()) {
            errors.add(new ValidationError(1, "Location not found."));
        }

        if (dto.startDate().isAfter(dto.endDate())) {
            errors.add(new ValidationError(2, "Start date must be before end date."));
        }

        boolean datesOrLocationChanged = !dto.startDate().equals(reservation.getStartDate())
            || !dto.endDate().equals(reservation.getEndDate())
            || !dto.locationId().equals(reservation.getLocation().getLocationId());

        if (locationOpt.isPresent() && datesOrLocationChanged) {
            Location location = locationOpt.get();

            boolean isAvailable = availabilityService.isLocationAvailableExcludingReservation(
                location, dto.startDate(), dto.endDate(), reservationId);

            if (!isAvailable) {
                errors.add(new ValidationError(3, "Location is not available for the selected dates."));
            }
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Location location = locationOpt.get();
        User user = userOpt.get();

        reservation.setUser(user);
        reservation.setLocation(location);
        reservation.setStartDate(dto.startDate());
        reservation.setEndDate(dto.endDate());
        reservation.setStatus(dto.status());

        BigDecimal finalValue = calculateFinalValue(location, dto.startDate(), dto.endDate());
        reservation.setFinalValue(finalValue);

        reservationRepository.save(reservation);

        if (datesOrLocationChanged) {
            availabilityService.updateReservationBlock(reservation);
        }

        return ResponseEntity.ok(reservation);
    }


    @DeleteMapping("/{reservationId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteReservation(@PathVariable UUID reservationId) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Reservation reservation = reservationOpt.get();
        
        availabilityService.removeReservationBlockByReservationId(reservation);
        
        reservationRepository.delete(reservation);
        
        return ResponseEntity.noContent().build();
    }
}
