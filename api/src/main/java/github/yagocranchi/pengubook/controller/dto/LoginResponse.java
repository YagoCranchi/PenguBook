package github.yagocranchi.pengubook.controller.dto;

public record LoginResponse(String accessToken, Long accessExpiresIn) {
}
