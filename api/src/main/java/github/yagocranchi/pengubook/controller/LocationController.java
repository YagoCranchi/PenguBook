package github.yagocranchi.pengubook.controller;

import github.yagocranchi.pengubook.controller.dto.BlockLocationDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.entities.Reservation;
import github.yagocranchi.pengubook.controller.dto.CreateLocationDto;
import github.yagocranchi.pengubook.entities.LocationAvailability;
import github.yagocranchi.pengubook.repository.LocationAvailabilityRepository;
import github.yagocranchi.pengubook.repository.LocationRepository;
import github.yagocranchi.pengubook.repository.ReservationRepository;
import github.yagocranchi.pengubook.service.AvailabilityService;
import github.yagocranchi.pengubook.utils.ValidationError;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/location")
public class LocationController {

    private final LocationRepository locationRepository;
    private final LocationAvailabilityRepository locationAvailabilityRepository;
    private final AvailabilityService availabilityService;
    private final ReservationRepository reservationRepository;

    public LocationController(
        LocationRepository locationRepository,
        ReservationRepository reservationRepository,
        LocationAvailabilityRepository locationAvailabilityRepository,
        AvailabilityService availabilityService) {
        this.locationRepository = locationRepository;
        this.availabilityService = availabilityService;
        this.reservationRepository = reservationRepository;
        this.locationAvailabilityRepository = locationAvailabilityRepository;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<Location>> listAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return ResponseEntity.ok(locations);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<List<ValidationError>> createLocation(@RequestBody CreateLocationDto dto, JwtAuthenticationToken token) {
        List<ValidationError> errors = new ArrayList<>();

        if (dto.name() == null || dto.name().isBlank()) {
            errors.add(new ValidationError(0, "Name is required."));
        }

        if (dto.hourlyRate() == null || dto.hourlyRate().compareTo(BigDecimal.ZERO) < 0) {
            errors.add(new ValidationError(1, "Hourly rate must be a positive value."));
        }

        if (dto.minimumTime() == null || dto.minimumTime() < 0) {
            errors.add(new ValidationError(2, "Minimum time must be a non-negative number."));
        }

        if (dto.maximumTime() != null && dto.maximumTime() < dto.minimumTime()) {
            errors.add(new ValidationError(3, "Maximum time must be greater than or equal to minimum time."));
        }

        if (!errors.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
        }

        Location location = new Location();
        location.setName(dto.name());
        location.setType(dto.type());
        location.setDescription(dto.description());
        location.setHourlyRate(dto.hourlyRate());
        location.setMinimumTime(dto.minimumTime());
        location.setMaximumTime(dto.maximumTime());

        locationRepository.save(location);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{locationId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> updateLocation(
        @PathVariable UUID locationId,
        @RequestBody CreateLocationDto dto) {

        List<ValidationError> errors = new ArrayList<>();

        Optional<Location> locationOpt = locationRepository.findById(locationId);
        if (locationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (dto.name() == null || dto.name().isBlank()) {
            errors.add(new ValidationError(0, "Name is required."));
        }

        if (dto.hourlyRate() == null || dto.hourlyRate().compareTo(BigDecimal.ZERO) < 0) {
            errors.add(new ValidationError(1, "Hourly rate must be a positive value."));
        }

        if (dto.minimumTime() == null || dto.minimumTime() < 0) {
            errors.add(new ValidationError(2, "Minimum time must be a non-negative number."));
        }

        if (dto.maximumTime() != null && dto.maximumTime() < dto.minimumTime()) {
            errors.add(new ValidationError(3, "Maximum time must be greater than or equal to minimum time."));
        }

        if (!errors.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
        }

        Location location = locationOpt.get();
        location.setName(dto.name());
        location.setType(dto.type());
        location.setDescription(dto.description());
        location.setHourlyRate(dto.hourlyRate());
        location.setMinimumTime(dto.minimumTime());
        location.setMaximumTime(dto.maximumTime());

        locationRepository.save(location);

        return ResponseEntity.ok(location);
    }
    
    @DeleteMapping("/{locationId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteLocation(@PathVariable UUID locationId) {
        Optional<Location> locationOpt = locationRepository.findById(locationId);
        if (locationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Location location = locationOpt.get();

        List<Reservation> locationReservations = reservationRepository.findByLocation(location);

        for (Reservation reservation : locationReservations) {
            availabilityService.removeReservationBlockByReservationId(reservation);

            reservationRepository.delete(reservation);
        }

        List<LocationAvailability> blocks = locationAvailabilityRepository.findByLocation(location);
        locationAvailabilityRepository.deleteAll(blocks);

        locationRepository.delete(location);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<?> findAvailableLocations(
        @RequestParam LocalDateTime checkIn,
        @RequestParam LocalDateTime checkOut) {

        if (checkIn.isAfter(checkOut)) {
            return ResponseEntity.badRequest().body(
                List.of(new ValidationError(1, "Check-in date must be before check-out date"))
            );
        }

        long durationInMinutes = Duration.between(checkIn, checkOut).toMinutes();

        List<Location> allLocations = locationRepository.findAll();

        List<Location> availableLocations = allLocations.stream()
            .filter(location -> {
                boolean isAvailable = availabilityService.isLocationAvailable(location, checkIn, checkOut);

                boolean meetsMinimumTime = durationInMinutes >= location.getMinimumTime();

                boolean meetsMaximumTime = location.getMaximumTime() == null
                    || durationInMinutes <= location.getMaximumTime();

                return isAvailable && meetsMinimumTime && meetsMaximumTime;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(availableLocations);
    }

    @PostMapping("/block/{locationId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> createManualBlock(
        @PathVariable UUID locationId,
        @RequestBody BlockLocationDto dto) {

        List<ValidationError> errors = new ArrayList<>();

        Optional<Location> locationOpt = locationRepository.findById(locationId);
        if (locationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (dto.startDate().isAfter(dto.endDate())) {
            errors.add(new ValidationError(1, "Start date must be before end date."));
        }

        if (dto.reason() == null || dto.reason().isBlank()) {
            errors.add(new ValidationError(2, "Reason is required."));
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Location location = locationOpt.get();

        if (!availabilityService.isLocationAvailable(location, dto.startDate(), dto.endDate())) {
            errors.add(new ValidationError(3, "The location is already blocked for the specified period."));
            return ResponseEntity.badRequest().body(errors);
        }

        availabilityService.createManualBlock(location, dto.startDate(), dto.endDate(), dto.reason());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/block/{locationId}/{blockId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> removeManualBlock(
        @PathVariable UUID locationId,
        @PathVariable UUID blockId) {

        if (!locationRepository.existsById(locationId)) {
            return ResponseEntity.notFound().build();
        }

        Optional<LocationAvailability> blockOpt = locationAvailabilityRepository.findById(blockId);
        if (blockOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!blockOpt.get().getLocation().getLocationId().equals(locationId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                List.of(new ValidationError(0, "O bloco não pertence à localização especificada"))
            );
        }

        if (availabilityService.removeBlock(blockId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/blocks/{locationId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> getLocationBlocks(
        @PathVariable UUID locationId,
        @RequestParam(required = false) String reason,
        @RequestParam(required = false) LocalDateTime startDate,
        @RequestParam(required = false) LocalDateTime endDate) {

        if (!locationRepository.existsById(locationId)) {
            return ResponseEntity.notFound().build();
        }

        List<LocationAvailability> blocks = availabilityService.getBlocksByLocation(
            locationId, reason, startDate, endDate);

        return ResponseEntity.ok(blocks);
    }
}
