package github.yagocranchi.pengubook.controller;

import java.util.Set;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import github.yagocranchi.pengubook.entities.Role;
import github.yagocranchi.pengubook.entities.User;
import github.yagocranchi.pengubook.repository.RoleRepository;
import github.yagocranchi.pengubook.repository.UserRepository;
import github.yagocranchi.pengubook.controller.dto.CreateUserDto;
import github.yagocranchi.pengubook.controller.dto.GetUserDto;
import github.yagocranchi.pengubook.controller.dto.UpdateUserDto;
import github.yagocranchi.pengubook.repository.ReservationRepository;
import github.yagocranchi.pengubook.service.AvailabilityService;
import github.yagocranchi.pengubook.utils.ValidationError;

import java.util.ArrayList;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ReservationRepository reservationRepository;
    private final AvailabilityService availabilityService;

    public UserController(UserRepository userRepository,
        RoleRepository roleRepository,
        BCryptPasswordEncoder passwordEncoder,
        ReservationRepository reservationRepository,
        AvailabilityService availabilityService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.reservationRepository = reservationRepository;
        this.availabilityService = availabilityService;
    }

    @GetMapping
    public ResponseEntity<GetUserDto> userInfo(JwtAuthenticationToken token) {
        return userRepository.findById(UUID.fromString(token.getName()))
            .map(user -> {
                var userDto = new GetUserDto();
                userDto.setUserId(user.getUserId());
                userDto.setName(user.getName());
                userDto.setEmail(user.getEmail());
                userDto.setCpf(user.getCpf());
                userDto.setPhone(user.getPhone());
                userDto.setCreationDate(user.getCreationDate());

                var firstRole = user.getRoles().stream().findFirst().orElse(null);
                if (firstRole != null) {
                    userDto.setRoleName(firstRole.getName());
                }

                return ResponseEntity.ok(userDto);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<User>> listUsers() {
        var users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<List<ValidationError>> newUser(@RequestBody CreateUserDto dto) {
        List<ValidationError> errors = new ArrayList<>();

        if (userRepository.findByName(dto.name()).isPresent()) {
            errors.add(new ValidationError(0, "Username is already taken."));
        }

        if (userRepository.findByEmail(dto.email()).isPresent()) {
            errors.add(new ValidationError(1, "Email is already in use."));
        }

        if (userRepository.findByCpf(dto.cpf()).isPresent()) {
            errors.add(new ValidationError(2, "CPF is already registered."));
        }

        if (!errors.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
        }

        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        var user = new User();
        user.setName(dto.name());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        user.setCpf(dto.cpf());
        user.setRoles(Set.of(basicRole));

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<List<ValidationError>> updateUser(@RequestBody UpdateUserDto dto, JwtAuthenticationToken token) {
        List<ValidationError> errors = new ArrayList<>();

        var userId = UUID.fromString(token.getName());
        var userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            errors.add(new ValidationError(0, "User not found."));
        }

        var user = userOpt.get();

        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            var existingUser = userRepository.findByEmail(dto.getEmail());

            if (existingUser.isPresent() && !existingUser.get().getUserId().equals(user.getUserId())) {
                errors.add(new ValidationError(1, "Email is already in use."));
            }
        }

        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone())) {
            var existingUser = userRepository.findByPhone(dto.getPhone());

            if (existingUser.isPresent() && !existingUser.get().getUserId().equals(user.getUserId())) {
                errors.add(new ValidationError(2, "Phone number is already in use."));
            }
        }

        if (!errors.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<List<ValidationError>> updateUserByAdmin(
        @PathVariable UUID id,
        @RequestBody UpdateUserDto dto) {

        List<ValidationError> errors = new ArrayList<>();

        var userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            errors.add(new ValidationError(0, "User not found."));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
        }

        var user = userOpt.get();

        if (dto.getName() != null && !dto.getName().equals(user.getName())) {
            var existingUser = userRepository.findByName(dto.getName());
            if (existingUser.isPresent() && !existingUser.get().getUserId().equals(user.getUserId())) {
                errors.add(new ValidationError(1, "Name is already in use."));
            }
        }

        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            var existingUser = userRepository.findByEmail(dto.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getUserId().equals(user.getUserId())) {
                errors.add(new ValidationError(2, "Email is already in use."));
            }
        }

        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone())) {
            var existingUser = userRepository.findByPhone(dto.getPhone());
            if (existingUser.isPresent() && !existingUser.get().getUserId().equals(user.getUserId())) {
                errors.add(new ValidationError(3, "Phone number is already in use."));
            }
        }

        if (!errors.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
        }

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable UUID userId) {
        List<ValidationError> errors = new ArrayList<>();

        var userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            errors.add(new ValidationError(0, "User not found."));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
        }

        User user = userOpt.get();

        boolean isAdmin = user.getRoles().stream()
            .anyMatch(role -> role.getName().equals(Role.Values.ADMIN.name()));

        if (isAdmin) {
            errors.add(new ValidationError(1, "Deleting admin users is not allowed."));
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errors);
        }

        var userReservations = reservationRepository.findByUser(user);
        userReservations.forEach(reservation -> {
            availabilityService.removeReservationBlockByReservationId(reservation);
            reservationRepository.delete(reservation);
        });

        user.getRoles().clear();
        userRepository.save(user);

        userRepository.delete(user);

        return ResponseEntity.noContent().build();
    }
}
