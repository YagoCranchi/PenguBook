package github.yagocranchi.pengubook.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.RequestMapping;

import github.yagocranchi.pengubook.entities.Location;
import github.yagocranchi.pengubook.controller.dto.CreateLocationDto;
import github.yagocranchi.pengubook.repository.LocationRepository;
import github.yagocranchi.pengubook.utils.ValidationError;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/location")
public class LocationController {
    
    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
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

    @GetMapping
    public ResponseEntity<List<Location>> listAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return ResponseEntity.ok(locations);
    }

}
