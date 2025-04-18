package github.yagocranchi.pengubook.controller.dto;

import java.time.LocalDateTime;

public record BlockLocationDto(
    LocalDateTime startDate,
    LocalDateTime endDate,
    String reason) {

}
