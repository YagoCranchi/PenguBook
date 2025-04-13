package github.yagocranchi.pengubook.controller;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;
import github.yagocranchi.pengubook.controller.dto.LoginRequest;
import github.yagocranchi.pengubook.controller.dto.LoginResponse;
import github.yagocranchi.pengubook.entities.Role;
import github.yagocranchi.pengubook.repository.UserRepository;
import github.yagocranchi.pengubook.entities.User;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.oauth2.jwt.JwtDecoder;

@RestController
public class TokenController {

    private static final long ACCESS_TOKEN_EXPIRES_IN = 300L;
    private static final long REFRESH_TOKEN_EXPIRES_IN = 3000L;

    private String userId;

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public TokenController(JwtEncoder jwtEncoder,
                           JwtDecoder jwtDecoder,
                           UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        boolean isEmail = loginRequest.name().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

        Optional<User> user = isEmail
            ? userRepository.findByEmail(loginRequest.name())
            : userRepository.findByName(loginRequest.name());

        if (user.isEmpty() || !user.get().isLoginCorrect(loginRequest, passwordEncoder)) {
            throw new BadCredentialsException("user or password is invalid!");
        }

        var scopes = user.get().getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.joining(" "));

        userId = user.get().getUserId().toString();

        var accessToken = generateToken(userId, ACCESS_TOKEN_EXPIRES_IN, "access", scopes);
        var refreshToken = generateToken(userId, REFRESH_TOKEN_EXPIRES_IN, "refresh", "");

        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) REFRESH_TOKEN_EXPIRES_IN);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(new LoginResponse(accessToken, ACCESS_TOKEN_EXPIRES_IN));
    }

    @GetMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@CookieValue(value = "refresh_token", required = false) String refreshToken,
                                                      HttpServletResponse response) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Jwt decodedJwt;
        try {
            decodedJwt = jwtDecoder.decode(refreshToken);
        } catch (JwtException e) {
            return ResponseEntity.status(401).build();
        }

        String tokenType = decodedJwt.getClaim("type");
        if (!"refresh".equals(tokenType)) {
            return ResponseEntity.status(403).body(null);
        }

        userId = decodedJwt.getSubject();

        var userOptional = userRepository.findById(UUID.fromString(userId));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        var user = userOptional.get();
        var scopes = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.joining(" "));

        var newAccessToken = generateToken(userId, ACCESS_TOKEN_EXPIRES_IN, "access", scopes);

        return ResponseEntity.ok(new LoginResponse(newAccessToken, ACCESS_TOKEN_EXPIRES_IN));
    }

    @PostMapping("/logoff")
    public ResponseEntity<Void> logoff(HttpServletResponse response) {
        Cookie refreshCookie = new Cookie("refresh_token", "");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
        
        return ResponseEntity.ok().build();
    }

    private String generateToken(String subject, long expiresIn, String type, String scopes) {
        var claimsBuilder = JwtClaimsSet.builder()
                .issuer("mybackend")
                .subject(subject)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(expiresIn))
                .claim("type", type);

        if (!scopes.isEmpty()) {
            claimsBuilder.claim("scope", scopes);
        }

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsBuilder.build())).getTokenValue();
    }
}
