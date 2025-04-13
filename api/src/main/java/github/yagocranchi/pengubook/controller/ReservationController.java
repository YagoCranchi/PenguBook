package github.yagocranchi.pengubook.controller;

import github.yagocranchi.pengubook.entities.User;
import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.entities.Reservation;
import github.yagocranchi.pengubook.controller.dto.CreateReservationDto;
import github.yagocranchi.pengubook.repository.UserRepository;
import github.yagocranchi.pengubook.repository.LocationRepository;
import github.yagocranchi.pengubook.repository.ReservationRepository;
import github.yagocranchi.pengubook.utils.ValidationError;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

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

    public ReservationController(ReservationRepository reservationRepository,
                                 UserRepository userRepository,
                                 LocationRepository locationRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
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

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<List<ValidationError>> createReservation(@RequestBody CreateReservationDto dto) {
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
            boolean hasConflict = reservationRepository.existsByLocationAndDateRange(
                locationOpt.get(), dto.startDate(), dto.endDate()
            );
            if (hasConflict) {
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

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    
    private BigDecimal calculateFinalValue(Location location, LocalDateTime startDate, LocalDateTime endDate) {
        long hours = Duration.between(startDate, endDate).toHours();
        return location.getHourlyRate().multiply(BigDecimal.valueOf(hours));
    }

}
